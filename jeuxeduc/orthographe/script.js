const elements = Object.fromEntries(['position', 'score', 'progress', 'game', 'results', 'prompt',
    'listen', 'answerForm', 'answer', 'validate', 'skip', 'feedback', 'next', 'resultTitle',
    'review', 'restart', 'wordEmoji', 'listeningArt', 'letterChoices', 'eraseLetter'].map(name => [name, document.getElementById(name)]));
const speechAvailable = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
let questions = [];
let answers = [];
let answered = false;
let nextQuestionTimer = null;

function advanceQuestion() {
    clearTimeout(nextQuestionTimer);
    nextQuestionTimer = null;
    if (!answered) return;
    if (answers.length === 20) showResults();
    else { showQuestion(); speakWord(); }
}

function speakWord() {
    if (!speechAvailable) return;
    window.speechSynthesis.cancel();
    const current = questions[answers.length - (answered ? 1 : 0)];
    const utterance = new SpeechSynthesisUtterance(`${current.article} ${current.word}`);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.8;
    const voice = window.speechSynthesis.getVoices().find(candidate => candidate.lang.startsWith('fr'));
    if (voice) utterance.voice = voice;
    utterance.onerror = event => {
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
            elements.feedback.textContent = "Lecture vocale indisponible. Vérifiez qu'une voix française est installée et réessayez.";
        }
    };
    window.speechSynthesis.speak(utterance);
}

function updateLetterChoices() {
    const remaining = Array.from(elements.answer.value.normalize('NFC').toLocaleLowerCase('fr'));
    elements.letterChoices.querySelectorAll('button').forEach(button => {
        const index = remaining.indexOf(button.textContent);
        button.disabled = answered || index !== -1;
        if (index !== -1) remaining.splice(index, 1);
    });
    elements.eraseLetter.disabled = answered || !elements.answer.value;
}

function renderLetterChoices() {
    elements.letterChoices.replaceChildren();
    createLetterChoices(questions[answers.length].word).forEach(letter => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = letter;
        button.addEventListener('click', () => {
            if (answered || button.disabled) return;
            elements.answer.value += letter;
            updateLetterChoices();
        });
        elements.letterChoices.appendChild(button);
    });
    updateLetterChoices();
}

function showQuestion() {
    answered = false;
    const emoji = wordEmojis[questions[answers.length].word];
    elements.wordEmoji.textContent = emoji || '';
    elements.wordEmoji.hidden = !emoji;
    elements.listeningArt.hidden = Boolean(emoji);
    elements.position.textContent = `${answers.length + 1} / 20`;
    elements.answer.value = '';
    elements.answer.disabled = false;
    elements.validate.disabled = false;
    elements.skip.disabled = false;
    elements.next.hidden = true;
    elements.feedback.textContent = '';
    elements.feedback.className = '';
    renderLetterChoices();
    elements.answer.focus();
}

function submitAnswer(skipped) {
    if (answered) return;
    const typed = elements.answer.value.trim();
    if (!skipped && !typed) return;
    const current = questions[answers.length];
    const correct = !skipped && acceptsAnswer(typed, current, spellingWords);
    answers.push({ word: current.word, typed: skipped ? '' : typed, correct });
    answered = true;
    updateLetterChoices();
    elements.answer.disabled = true;
    elements.validate.disabled = true;
    elements.skip.disabled = true;
    elements.feedback.className = correct ? 'good' : 'bad';
    elements.feedback.textContent = correct
        ? `Bonne réponse ! ${normalizeAnswer(typed)}${normalizeAnswer(typed) !== current.word ? ` (homophone de ${current.word})` : ''}`
        : `${skipped ? 'Mot passé.' : 'Pas tout à fait.'} Le mot était : ${current.word}.`;
    elements.score.textContent = `${answers.filter(answer => answer.correct).length} / 20`;
    elements.progress.value = answers.length;
    elements.next.textContent = answers.length === 20 ? 'Voir le bilan' : 'Mot suivant';
    elements.next.hidden = false;
    elements.next.focus();
    if (correct) nextQuestionTimer = setTimeout(advanceQuestion, 900);
}

function showResults() {
    window.speechSynthesis.cancel();
    elements.game.hidden = true;
    elements.results.hidden = false;
    elements.resultTitle.textContent = `Votre résultat : ${answers.filter(answer => answer.correct).length} / 20`;
    elements.review.replaceChildren();
    answers.forEach(answer => {
        const item = document.createElement('li');
        item.className = answer.correct ? 'good' : 'bad';
        item.textContent = answer.correct ? `${answer.typed} : correct` : `${answer.typed || 'Sans réponse'} → ${answer.word}`;
        elements.review.appendChild(item);
    });
    elements.restart.focus();
}

function restartGame() {
    clearTimeout(nextQuestionTimer);
    nextQuestionTimer = null;
    if (!speechAvailable) {
        elements.feedback.textContent = 'Ce navigateur ne propose pas la lecture vocale. Ouvrez ce jeu dans un navigateur compatible, comme Chrome, Edge ou Safari.';
        elements.answer.disabled = true;
        elements.validate.disabled = true;
        elements.skip.disabled = true;
        elements.listen.disabled = true;
        return;
    }
    window.speechSynthesis.cancel();
    questions = shuffleWords(spellingWords).slice(0, 20);
    answers = [];
    elements.game.hidden = false;
    elements.results.hidden = true;
    elements.score.textContent = '0 / 20';
    elements.progress.value = 0;
    showQuestion();
}

elements.listen.addEventListener('click', speakWord);
elements.answer.addEventListener('input', updateLetterChoices);
elements.eraseLetter.addEventListener('click', () => {
    if (answered) return;
    elements.answer.value = Array.from(elements.answer.value).slice(0, -1).join('');
    updateLetterChoices();
});
elements.answerForm.addEventListener('submit', event => { event.preventDefault(); submitAnswer(false); });
elements.skip.addEventListener('click', () => submitAnswer(true));
elements.next.addEventListener('click', advanceQuestion);
elements.restart.addEventListener('click', restartGame);
window.addEventListener('pagehide', () => {
    clearTimeout(nextQuestionTimer);
    if (speechAvailable) window.speechSynthesis.cancel();
});
restartGame();