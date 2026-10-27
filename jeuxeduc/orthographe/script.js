const elements = Object.fromEntries(['position', 'score', 'progress', 'game', 'results', 'prompt',
    'listen', 'answerForm', 'answer', 'validate', 'skip', 'feedback', 'next', 'resultTitle',
    'review', 'restart', 'wordEmoji', 'letterChoices', 'eraseLetter',
    'voiceSource', 'externalVoiceSettings', 'voiceUrl', 'voiceStatus'].map(name => [name, document.getElementById(name)]));
const speechAvailable = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
let questions = [];
let answers = [];
let answered = false;
let nextQuestionTimer = null;
let preferredVoice = null;
let activeUtterance = null;
const externalSpeech = createExternalSpeech(reason => {
    if (reason === 'permission') {
        elements.voiceStatus.textContent = 'Touchez Écouter le mot pour autoriser la lecture audio.';
        return;
    }
    elements.voiceStatus.textContent = reason === 'configuration'
        ? 'Indiquez une URL audio HTTPS contenant {text}.'
        : 'Service vocal externe indisponible.';
    if (speechAvailable) {
        elements.voiceStatus.textContent += ' Lecture avec la voix de l’appareil.';
        speakDeviceWord();
    }
});

function stopSpeech() {
    externalSpeech.stop();
    if (speechAvailable) window.speechSynthesis.cancel();
    activeUtterance = null;
}

function refreshVoice() {
    const frenchVoices = window.speechSynthesis.getVoices()
        .filter(voice => /^fr(?:[-_]|$)/i.test(voice.lang));
    function voicePriority(voice) {
        const description = `${voice.name} ${voice.voiceURI}`;
        let priority = 0;
        if (/premium/i.test(description)) priority += 200;
        else if (/enhanced|améliorée?|amelioree?/i.test(description)) priority += 100;
        if (/compact/i.test(description)) priority -= 50;
        if (/^fr[-_]FR$/i.test(voice.lang)) priority += 20;
        if (voice.default) priority += 5;
        return priority;
    }
    preferredVoice = frenchVoices.sort((first, second) => voicePriority(second) - voicePriority(first))[0] || null;
}

function advanceQuestion() {
    clearTimeout(nextQuestionTimer);
    nextQuestionTimer = null;
    if (!answered) return;
    if (answers.length === 20) showResults();
    else { showQuestion(); speakWord(); }
}

function speakWord() {
    stopSpeech();
    elements.voiceStatus.textContent = '';
    if (elements.voiceSource.value === 'external') {
        const current = questions[answers.length - (answered ? 1 : 0)];
        externalSpeech.speak(elements.voiceUrl.value.trim(), `${current.article} ${current.word}`);
        return;
    }
    speakDeviceWord();
}

function speakDeviceWord() {
    if (!speechAvailable) return;
    window.speechSynthesis.cancel();
    refreshVoice();
    const current = questions[answers.length - (answered ? 1 : 0)];
    const utterance = new SpeechSynthesisUtterance(`${current.article} ${current.word}`);
    utterance.lang = preferredVoice ? preferredVoice.lang : 'fr-FR';
    utterance.rate = 0.9;
    if (preferredVoice) utterance.voice = preferredVoice;
    activeUtterance = utterance;
    utterance.onend = () => {
        if (activeUtterance === utterance) activeUtterance = null;
    };
    utterance.onerror = event => {
        if (activeUtterance === utterance) activeUtterance = null;
        if (event.error === 'not-allowed') {
            elements.feedback.textContent = 'Touchez le bouton Écouter pour lancer la lecture du mot.';
            return;
        }
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
    stopSpeech();
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
    if (!speechAvailable && elements.voiceSource.value !== 'external') {
        elements.voiceStatus.textContent = 'Voix de l’appareil indisponible. Choisissez une voix externe.';
    }
    stopSpeech();
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
elements.voiceSource.addEventListener('change', () => {
    stopSpeech();
    elements.externalVoiceSettings.hidden = elements.voiceSource.value !== 'external';
    elements.voiceStatus.textContent = '';
});
elements.voiceUrl.addEventListener('input', () => {
    stopSpeech();
    elements.voiceStatus.textContent = '';
});
if (speechAvailable) {
    window.speechSynthesis.addEventListener('voiceschanged', refreshVoice);
    refreshVoice();
}
window.addEventListener('pagehide', () => {
    clearTimeout(nextQuestionTimer);
    stopSpeech();
});
restartGame();