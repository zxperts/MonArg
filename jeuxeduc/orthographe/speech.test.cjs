const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const elements = new Map();
const speechListeners = {};
let voices = [];
let spoken = null;
let resumeCount = 0;
function createElement() {
    return {
        value: '', children: [], listeners: {},
        addEventListener(type, handler) { this.listeners[type] = handler; }, focus() {},
        replaceChildren() { this.children = []; },
        appendChild(child) { this.children.push(child); },
        querySelectorAll() { return this.children; }
    };
}
const speechSynthesis = {
    cancel() {},
    paused: false,
    resume() { this.paused = false; resumeCount++; },
    getVoices() { return voices; },
    speak(utterance) { spoken = utterance; },
    addEventListener(type, handler) { speechListeners[type] = handler; }
};
function SpeechSynthesisUtterance(text) { this.text = text; }
const context = vm.createContext({
    document: {
        getElementById(id) {
            if (id === 'listeningArt') return null;
            if (!elements.has(id)) elements.set(id, createElement());
            return elements.get(id);
        },
        createElement
    },
    window: { speechSynthesis, SpeechSynthesisUtterance, addEventListener() {} },
    SpeechSynthesisUtterance, clearTimeout,
    spellingWords: [{ word: 'école', article: 'une' }],
    shuffleWords: words => words, wordEmojis: {},
    createLetterChoices: () => Array.from('écoleabdf')
});
vm.runInContext(fs.readFileSync(path.join(__dirname, 'external-speech.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8'), context);
const run = code => vm.runInContext(code, context);
assert.equal(elements.get('letterChoices').children.length, 9);
const letterButton = elements.get('letterChoices').children[0];
assert.equal(letterButton.textContent, 'é');
letterButton.listeners.click();
assert.equal(elements.get('answer').value, 'é');
assert.equal(letterButton.disabled, true);
elements.get('eraseLetter').listeners.click();
assert.equal(elements.get('answer').value, '');
assert.equal(letterButton.disabled, false);
run('speakWord()');
assert.equal(spoken.lang, 'fr-FR');
assert.equal(spoken.voice, undefined);
assert.equal(spoken.text, 'une école');

const compact = { name: 'Thomas (compact)', voiceURI: 'compact', lang: 'fr-FR' };
const enhanced = { name: 'Thomas (Améliorée)', voiceURI: 'enhanced', lang: 'fr-FR' };
const premium = { name: 'Thomas (Premium)', voiceURI: 'premium', lang: 'fr-FR' };
voices = [compact, { name: 'English Premium', lang: 'en-US' }, enhanced];
speechListeners.voiceschanged();
assert.equal(run('preferredVoice'), enhanced);
run('speakWord()');
assert.equal(spoken.voice, enhanced);
assert.equal(spoken.rate, 0.9);
assert.equal(run('activeUtterance'), spoken);
const previous = spoken;
voices.push(premium);
run('speakWord()');
assert.equal(spoken.voice, premium);
previous.onerror({ error: 'not-allowed' });
assert.equal(elements.get('feedback').textContent, '');
previous.onend();
assert.equal(run('activeUtterance'), spoken);
spoken.onend();
assert.equal(run('activeUtterance'), null);

voices = [{ name: 'French Canada', lang: 'fr-CA' }, { name: 'French France', lang: 'fr-FR' }];
run('speakWord()');
assert.equal(spoken.voice, voices[1]);
voices = [voices[0]];
run('speakWord()');
assert.equal(spoken.lang, 'fr-CA');
spoken.onerror({ error: 'not-allowed' });
assert.match(elements.get('feedback').textContent, /Écouter/);
voices = [compact, { name: 'French Natural', lang: 'fr-FR' }];
run('speakWord()');
assert.equal(spoken.voice, voices[1]);
voices = [{ name: 'French', lang: 'fr-FR', localService: false },
    { name: 'French installed', lang: 'fr-FR', localService: true }];
speechSynthesis.paused = true;
run('speakWord()');
assert.equal(spoken.voice, voices[1]);
assert.equal(resumeCount, 1);
assert.equal(spoken.pitch, 1);
assert.equal(spoken.volume, 1);
const cancelled = spoken;
run('stopSpeech()');
elements.get('feedback').textContent = '';
cancelled.onerror({ error: 'synthesis-failed' });
assert.equal(elements.get('feedback').textContent, '');
speechSynthesis.speak = () => { throw { name: 'NotAllowedError' }; };
run('speakWord()');
assert.match(elements.get('feedback').textContent, /Écouter/);
console.log('OK : qualité des voix, voix installées, reprise Safari, erreurs périmées et autorisation tactile.');