function shuffleWords(words) {
    const shuffled = [...words];
    for (let index = shuffled.length - 1; index > 0; index--) {
        const other = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
    }
    return shuffled;
}

function createLetterChoices(word) {
    const letters = Array.from(word.normalize('NFC').toLocaleLowerCase('fr'));
    const distractors = shuffleWords(Array.from('abcdefghijklmnopqrstuvwxyz')
        .filter(letter => !letters.includes(letter))).slice(0, 4);
    return shuffleWords([...letters, ...distractors]);
}

function normalizeAnswer(answer) {
    return answer.normalize('NFC').trim().toLocaleLowerCase('fr').replaceAll('œ', 'oe').replaceAll('æ', 'ae');
}

function acceptsAnswer(answer, word, words) {
    const normalized = normalizeAnswer(answer);
    return words.some(candidate => candidate.phon === word.phon
        && candidate.article === word.article && normalizeAnswer(candidate.word) === normalized);
}