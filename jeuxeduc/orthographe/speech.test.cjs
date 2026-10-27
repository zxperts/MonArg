const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const elements = new Map();
const speechListeners = {};
let voices = [];
let spoken = null;
function createElement() {
    return {
        value: '', children: [],
        addEventListener() {}, focus() {},
        replaceChildren() { this.children = []; },
        appendChild(child) { this.children.push(child); },
        querySelectorAll() { return this.children; }
    };
}
const speechSynthesis = {
    cancel() {},
    getVoices() { return voices; },
    speak(utterance) { spoken = utterance; },
    addEventListener(type, handler) { speechListeners[type] = handler; }
};
function SpeechSynthesisUtterance(text) { this.text = text; }
const context = vm.createContext({
    document: {
        getElementById(id) {
            if (!elements.has(id)) elements.set(id, createElement());
            return elements.get(id);
        },
        createElement
    },
    window: { speechSynthesis, SpeechSynthesisUtterance, addEventListener() {} },
    SpeechSynthesisUtterance, clearTimeout,
    spellingWords: [{ word: 'école', article: 'une' }],
    shuffleWords: words => words, wordEmojis: {}, createLetterChoices: () => []
});
vm.runInContext(fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8'), context);
const run = code => vm.runInContext(code, context);
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
console.log('OK : voix différées, priorité Premium/Améliorée, langue, débit et reprise manuelle Safari.');