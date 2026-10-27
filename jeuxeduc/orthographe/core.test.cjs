const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const context = vm.createContext({});
for (const file of ['words.js', 'core.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), context);
}
vm.runInContext(`
    globalThis.words = spellingWords;
    globalThis.sample = shuffleWords(spellingWords).slice(0, 20);
    globalThis.normalized = normalizeAnswer('  ÉCOLE  ');
    globalThis.accentCorrect = acceptsAnswer('école', spellingWords.find(item => item.word === 'école'), spellingWords);
    globalThis.accentWrong = acceptsAnswer('ecole', spellingWords.find(item => item.word === 'école'), spellingWords);
    globalThis.homophoneCorrect = acceptsAnswer('chant', { phon: 'test', article: 'un' }, [
        {word: 'champ', phon: 'test', article: 'un'}, {word: 'chant', phon: 'test', article: 'un'}]);
    globalThis.ligatureCorrect = acceptsAnswer('cœur', spellingWords.find(item => item.word === 'coeur'), spellingWords);
`, context);
assert.equal(context.words.length, 1000);
assert.equal(new Set(context.words.map(item => item.word)).size, 1000);
assert.equal(context.sample.length, 20);
assert.equal(new Set(context.sample.map(item => item.word)).size, 20);
assert.equal(context.normalized, 'école');
assert.equal(context.accentCorrect, true);
assert.equal(context.accentWrong, false);
assert.equal(context.homophoneCorrect, true);
assert.equal(context.ligatureCorrect, true);
console.log('OK : 1 000 noms uniques, 20 mots sans répétition, accents et homophones.');
for (const word of context.words) {
    const choices = vm.runInContext(`createLetterChoices(${JSON.stringify(word.word)})`, context);
    const remaining = Array.from(choices);
    for (const letter of Array.from(word.word.normalize('NFC').toLocaleLowerCase('fr'))) {
        const index = remaining.indexOf(letter);
        assert.notEqual(index, -1, `Lettre manquante pour ${word.word}`);
        remaining.splice(index, 1);
    }
    assert.equal(remaining.length, 4);
    assert.equal(new Set(remaining).size, 4);
    assert.ok(remaining.every(letter => !word.word.includes(letter)));
}
console.log('OK : lettres de chacun des 1 000 mots et quatre intruses distinctes.');