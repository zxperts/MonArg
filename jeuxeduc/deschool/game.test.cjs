const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');

function element() {
    return {
        children: [], dataset: {}, listeners: {}, hidden: false, disabled: false,
        classList: { add() {}, remove() {} }, setAttribute() {}, focus() {},
        addEventListener(type, handler) { this.listeners[type] = handler; },
        replaceChildren() { this.children = []; },
        appendChild(child) { this.children.push(child); },
        querySelector() { return this.children[0]; }
    };
}

for (const [file, count] of [['words.js', 28], ['phrases.js', 17]]) {
    const elements = new Map();
    const radios = ['fr', 'nl'].map(value => Object.assign(element(), { value }));
    const context = vm.createContext({ document: {
        getElementById(id) {
            if (!elements.has(id)) elements.set(id, element());
            return elements.get(id);
        },
        createElement: element,
        querySelectorAll() { return radios; }
    } });
    for (const script of [file, 'script.js']) {
        vm.runInContext(fs.readFileSync(path.join(__dirname, script), 'utf8'), context);
    }
    const run = code => vm.runInContext(code, context);
    assert.equal(run('schoolWords.length'), count);
    for (const language of ['fr', 'nl']) {
        assert.equal(run(`new Set(schoolWords.map(item => item.${language})).size`), count);
        radios.find(radio => radio.value === language).listeners.change();
        assert.equal(elements.get('progress').max, count);
        const source = elements.get('source').children[0];
        const wrong = elements.get('target').children.find(button => button.dataset.id !== source.dataset.id);
        source.listeners.click();
        wrong.listeners.click();
        assert.equal(run('errors'), 1);
        assert.equal(source.disabled, false);
        const seen = new Set();
        for (let round = 0; round < Math.ceil(count / 7); round++) {
            assert.equal(elements.get('source').children.length, Math.min(7, count - round * 7));
            for (const button of elements.get('source').children) {
                assert.equal(button.lang, language);
                assert.equal(seen.has(button.dataset.id), false);
                seen.add(button.dataset.id);
                const target = elements.get('target').children.find(other => other.dataset.id === button.dataset.id);
                button.listeners.click();
                target.listeners.click();
                assert.equal(button.disabled, true);
            }
            if (round < Math.ceil(count / 7) - 1) {
                assert.equal(elements.get('next').hidden, false);
                elements.get('next').listeners.click();
            }
        }
        assert.equal(seen.size, count);
        assert.equal(run('matched'), count);
        assert.equal(elements.get('next').hidden, true);
        assert.match(elements.get('feedback').textContent, new RegExp(`${count} paires`));
        elements.get('restart').listeners.click();
        assert.equal(run('matched'), 0);
        assert.equal(run('errors'), 0);
    }
    console.log(`OK : ${file}, ${count} paires, deux sens, erreurs, manches et redémarrage.`);
}