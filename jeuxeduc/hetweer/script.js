const weatherVocabulary = [
    { dutch: 'De Zon', french: 'Le soleil' },
    { dutch: 'De Zon schijnt', french: 'Le soleil brille' },
    { dutch: 'de regen', french: 'La pluie' },
    { dutch: 'Het Regent', french: 'Il pleut' },
    { dutch: 'het nacht', french: 'La nuit' },
    { dutch: 'de maan', french: 'La lune' },
    { dutch: 'Het Waait', french: 'Il y a du vent' },
    { dutch: 'de wind', french: 'Le vent' },
    { dutch: 'de sneeuw', french: 'La neige' },
    { dutch: 'het sneeuwt', french: 'Il neige' },
    { dutch: 'het is mistig', french: 'Il y a du brouillard' },
    { dutch: 'de mist', french: 'Le brouillard' },
    { dutch: 'het is bewolkt', french: 'Le ciel est nuageux' },
    { dutch: 'de wolk', french: 'Le nuage' },
    { dutch: 'de regenboog', french: 'L\'arc-en-ciel' },
    { dutch: 'het onweert', french: 'Il y a de l\'orage' },
    { dutch: 'het onweer', french: 'L\'orage' },
    { dutch: 'de orkaan', french: 'L\'ouragan' },
    { dutch: 'het klaart op', french: 'Le ciel se dégage' },
    { dutch: 'de opklaring', french: 'L\'éclaircie' },
    { dutch: 'het vriest', french: 'Il gèle' },
    { dutch: 'de temperatuur', french: 'La température' }
];

let score = 0;
let total = 0;
let streak = 0;
let askedIndexes = [];
let currentQuestion = null;
let isAnswered = false;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const remainingEl = document.getElementById('remaining');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');

function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function updateStats() {
    scoreEl.textContent = `${score}/${total}`;
    streakEl.textContent = String(streak);
    remainingEl.textContent = String(weatherVocabulary.length - askedIndexes.length);
}

function pickQuestion() {
    if (askedIndexes.length >= weatherVocabulary.length) {
        questionEl.textContent = '🎉 Bravo, toutes les questions sont terminées !';
        optionsEl.innerHTML = '';
        feedbackEl.textContent = 'Cliquez sur « Recommencer » pour rejouer.';
        feedbackEl.className = 'feedback good';
        nextBtn.disabled = true;
        updateStats();
        return;
    }

    const availableIndexes = weatherVocabulary
        .map((_, i) => i)
        .filter(index => !askedIndexes.includes(index));

    const nextIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    askedIndexes.push(nextIndex);
    currentQuestion = weatherVocabulary[nextIndex];
    isAnswered = false;

    questionEl.textContent = currentQuestion.dutch;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    nextBtn.disabled = true;

    renderOptions();
    updateStats();
}

function renderOptions() {
    const wrongAnswers = shuffleArray(
        weatherVocabulary
            .filter(item => item.french !== currentQuestion.french)
            .map(item => item.french)
    ).slice(0, 3);

    const options = shuffleArray([currentQuestion.french, ...wrongAnswers]);

    optionsEl.innerHTML = '';
    options.forEach(option => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'option-btn';
        button.textContent = option;
        button.addEventListener('click', () => handleAnswer(option, button));
        optionsEl.appendChild(button);
    });
}

function handleAnswer(selected, selectedBtn) {
    if (isAnswered) return;

    isAnswered = true;
    total += 1;

    const allButtons = Array.from(document.querySelectorAll('.option-btn'));
    allButtons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === currentQuestion.french) {
            btn.classList.add('correct');
        }
    });

    if (selected === currentQuestion.french) {
        score += 1;
        streak += 1;
        selectedBtn.classList.add('correct');
        feedbackEl.textContent = '✅ Bonne réponse !';
        feedbackEl.className = 'feedback good';
    } else {
        streak = 0;
        selectedBtn.classList.add('wrong');
        feedbackEl.textContent = `❌ Mauvaise réponse. Bonne réponse : ${currentQuestion.french}`;
        feedbackEl.className = 'feedback bad';
    }

    nextBtn.disabled = false;
    updateStats();
}

function restartGame() {
    score = 0;
    total = 0;
    streak = 0;
    askedIndexes = [];
    currentQuestion = null;
    isAnswered = false;
    pickQuestion();
}

nextBtn.addEventListener('click', pickQuestion);
restartBtn.addEventListener('click', restartGame);

pickQuestion();
