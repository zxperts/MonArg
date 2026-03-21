const countries = [
    { country: 'België', capital: 'Brussel', french: 'Belgique' },
    { country: 'Denemarken', capital: 'Kopenhagen', french: 'Danemark' },
    { country: 'Duitsland', capital: 'Berlijn', french: 'Allemagne' },
    { country: 'Frankrijk', capital: 'Parijs', french: 'France' },
    { country: 'Griekenland', capital: 'Athene', french: 'Grèce' },
    { country: 'Ierland', capital: 'Dublin', french: 'Irlande' },
    { country: 'Italië', capital: 'Rome', french: 'Italie' },
    { country: 'Luxemburg', capital: 'Luxemburg', french: 'Luxembourg' },
    { country: 'Malta', capital: 'Valletta', french: 'Malte' },
    { country: 'Nederland', capital: 'Amsterdam', french: 'Pays-Bas' }
];

const state = {
    remaining: [],
    current: null,
    answered: new Set(),
    correct: 0,
    total: countries.length
};

const progressElement = document.getElementById('progress');
const correctCountElement = document.getElementById('correctCount');
const remainingCountElement = document.getElementById('remainingCount');
const countryButton = document.getElementById('countryButton');
const countryTooltip = document.getElementById('countryTooltip');
const answerPanel = document.getElementById('answerPanel');
const choicesContainer = document.getElementById('choicesContainer');
const feedbackElement = document.getElementById('feedback');
const nextButton = document.getElementById('nextButton');
const countdownTextElement = document.getElementById('countdownText');
const progressTrackElement = document.getElementById('progressTrack');
const progressBarFillElement = document.getElementById('progressBarFill');
const newGameButton = document.getElementById('newGameButton');
const restartButton = document.getElementById('restartButton');
const countryList = document.getElementById('countryList');

const AUTO_NEXT_DELAY = 5000;

let autoNextTimeoutId = null;
let autoNextIntervalId = null;

function shuffle(list) {
    const copy = [...list];

    for (let index = copy.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }

    return copy;
}

function renderCountryList() {
    countryList.innerHTML = '';

    countries.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.country} · ${item.french}`;

        if (state.answered.has(item.country)) {
            listItem.classList.add('done');
        }

        countryList.appendChild(listItem);
    });
}

function updateScoreboard() {
    const answeredCount = state.answered.size;
    const currentStep = state.current ? answeredCount + 1 : answeredCount;
    progressElement.textContent = `${Math.min(currentStep, state.total)} / ${state.total}`;
    correctCountElement.textContent = String(state.correct);
    remainingCountElement.textContent = String(state.total - answeredCount);
}

function showFeedback(message, type) {
    feedbackElement.textContent = message;
    feedbackElement.className = `feedback ${type}`;
}

function hideAutoNext() {
    countdownTextElement.classList.add('hidden');
    progressTrackElement.classList.add('hidden');
    countdownTextElement.textContent = '5s';
    progressBarFillElement.style.width = '0%';
}

function clearAutoNext() {
    if (autoNextTimeoutId) {
        clearTimeout(autoNextTimeoutId);
        autoNextTimeoutId = null;
    }

    if (autoNextIntervalId) {
        clearInterval(autoNextIntervalId);
        autoNextIntervalId = null;
    }

    hideAutoNext();
}

function goToNextQuestion() {
    clearAutoNext();
    showQuestion();
}

function startAutoNext() {
    clearAutoNext();

    const startTime = Date.now();
    countdownTextElement.classList.remove('hidden');
    progressTrackElement.classList.remove('hidden');
    progressBarFillElement.style.width = '0%';
    countdownTextElement.textContent = '5s';

    autoNextIntervalId = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remainingMs = Math.max(AUTO_NEXT_DELAY - elapsed, 0);
        const remainingSeconds = Math.ceil(remainingMs / 1000);
        const percentage = Math.min((elapsed / AUTO_NEXT_DELAY) * 100, 100);

        countdownTextElement.textContent = `${remainingSeconds}s`;
        progressBarFillElement.style.width = `${percentage}%`;
    }, 100);

    autoNextTimeoutId = setTimeout(() => {
        goToNextQuestion();
    }, AUTO_NEXT_DELAY);
}

function getChoicesForCurrentQuestion() {
    const wrongAnswers = countries
        .filter((item) => item.capital !== state.current.capital)
        .map((item) => item.capital);

    const randomWrongAnswers = shuffle(wrongAnswers).slice(0, 3);
    return shuffle([state.current.capital, ...randomWrongAnswers]);
}

function renderChoices() {
    choicesContainer.innerHTML = '';

    getChoicesForCurrentQuestion().forEach((capital) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'choice-btn';
        button.textContent = capital;
        button.addEventListener('click', () => handleAnswer(capital, button));
        choicesContainer.appendChild(button);
    });
}

function setChoicesDisabled(disabled) {
    const buttons = choicesContainer.querySelectorAll('.choice-btn');
    buttons.forEach((button) => {
        button.disabled = disabled;
    });
}

function showQuestion() {
    clearAutoNext();

    if (state.remaining.length === 0) {
        state.current = null;
        countryButton.textContent = 'Klaar!';
        countryButton.appendChild(countryTooltip);
        countryTooltip.textContent = 'Terminé !';
        answerPanel.classList.add('hidden');
        nextButton.classList.add('hidden');
        restartButton.classList.remove('hidden');
        showFeedback(`Spel afgelopen! Je hebt ${state.correct} van de ${state.total} hoofdsteden goed geraden.`, 'success');
        updateScoreboard();
        return;
    }

    state.current = state.remaining.shift();
    countryButton.textContent = state.current.country;
    countryButton.appendChild(countryTooltip);
    countryTooltip.textContent = state.current.french;
    answerPanel.classList.remove('hidden');
    renderChoices();
    nextButton.classList.add('hidden');
    restartButton.classList.add('hidden');
    feedbackElement.className = 'feedback';
    feedbackElement.textContent = '';
    updateScoreboard();
    renderCountryList();
}

function handleAnswer(selectedCapital, selectedButton) {
    if (!state.current) {
        return;
    }

    state.answered.add(state.current.country);
    setChoicesDisabled(true);

    const allButtons = choicesContainer.querySelectorAll('.choice-btn');
    allButtons.forEach((button) => {
        if (button.textContent === state.current.capital) {
            button.classList.add('correct-choice');
        }
    });

    if (selectedCapital === state.current.capital) {
        state.correct += 1;
        selectedButton.classList.add('correct-choice');
        showFeedback(`Goed gedaan! ${state.current.country} heeft als hoofdstad ${state.current.capital}.`, 'success');
        startAutoNext();
    } else {
        selectedButton.classList.add('wrong-choice');
        showFeedback(`Niet juist. De hoofdstad van ${state.current.country} is ${state.current.capital}.`, 'error');
        clearAutoNext();
    }

    nextButton.classList.remove('hidden');
    updateScoreboard();
    renderCountryList();
}

function restartGame() {
    clearAutoNext();
    state.remaining = shuffle(countries);
    state.current = null;
    state.answered = new Set();
    state.correct = 0;
    answerPanel.classList.remove('hidden');
    showQuestion();
}

nextButton.addEventListener('click', goToNextQuestion);
newGameButton.addEventListener('click', restartGame);
restartButton.addEventListener('click', restartGame);

renderCountryList();
restartGame();
