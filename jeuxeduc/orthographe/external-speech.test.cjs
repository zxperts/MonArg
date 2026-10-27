const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const audios = [];
const timers = new Map();
const errors = [];
let identifier = 0;

class Audio {
    constructor() { audios.push(this); }
    play() { return Promise.resolve(); }
    pause() { this.paused = true; }
    removeAttribute() { this.src = ''; }
    load() {}
}

const context = vm.createContext({
    URL, Audio,
    setTimeout(callback) { timers.set(++identifier, callback); return identifier; },
    clearTimeout(id) { timers.delete(id); },
    onError: reason => errors.push(reason)
});
vm.runInContext(fs.readFileSync(path.join(__dirname, 'external-speech.js'), 'utf8'), context);
const run = code => vm.runInContext(code, context);
run('globalThis.player = createExternalSpeech(onError)');
const url = run("externalSpeechUrl('https://example.com/tts?text={text}&lang={lang}', 'une école & un cœur')");
assert.equal(new URL(url).searchParams.get('text'), 'une école & un cœur');
assert.equal(new URL(url).searchParams.get('lang'), 'fr-FR');
for (const template of ['http://example.com/{text}', 'https://example.com/no-text', 'https://user:pass@example.com/{text}']) {
    assert.throws(() => run(`externalSpeechUrl(${JSON.stringify(template)}, 'mot')`));
}
run("player.speak('https://example.com/?text={text}', 'une école')");
const oldError = audios[0].onerror;
run("player.speak('https://example.com/?text={text}', 'un chat')");
oldError();
assert.equal(errors.length, 0);
assert.equal(audios[0].paused, true);
audios[1].onplaying();
assert.equal(timers.size, 0);
audios[1].onerror();
assert.deepEqual(errors, ['network']);
run("player.speak('bad-url', 'un chat')");
assert.equal(errors.at(-1), 'configuration');
run("player.speak('https://example.com/?text={text}', 'un chat')");
[...timers.values()][0]();
assert.equal(errors.at(-1), 'network');
assert.equal(timers.size, 0);
Audio.prototype.play = () => Promise.reject({ name: 'NotAllowedError' });
run("player.speak('https://example.com/?text={text}', 'un chat')");
setImmediate(() => {
    assert.equal(errors.at(-1), 'permission');
    assert.equal(timers.size, 0);
    console.log('OK : URL encodée, HTTPS, erreurs réseau, délai, annulation et autorisation iOS.');
});