const vocabulary = [
    { dutch: 'een haven', french: 'un port', emoji: '⚓' },
    { dutch: 'een fabriek', french: 'une usine', emoji: '🏭' },
    { dutch: 'een Afrikaans landschap', french: 'un paysage africain', emoji: '🦒' },
    { dutch: 'een vulkaan', french: 'un volcan', emoji: '🌋' },
    { dutch: 'een woestijn', french: 'un désert', emoji: '🏜️' },
    { dutch: 'ijsschotsen', french: 'des blocs de glace flottants', emoji: '🧊' },
    { dutch: 'een bos', french: 'une forêt', emoji: '🌲' },
    { dutch: 'een dorp', french: 'un village', emoji: '🏘️' },
    { dutch: 'een akker', french: 'un champ', emoji: '🌾' },
    { dutch: 'een zee', french: 'une mer', emoji: '🌊' },
    { dutch: 'een stad', french: 'une ville', emoji: '🏙️' },
    { dutch: 'de bergen', french: 'les montagnes', emoji: '⛰️' },
    { dutch: 'de maan', french: 'la lune', emoji: '🌙' },
    { dutch: 'de wereld', french: 'le monde', emoji: '🌐' },
    { dutch: 'de windroos', french: 'la rose des vents', emoji: '🧭' },
    { dutch: 'een provincie', french: 'une province', emoji: '📍' },
    { dutch: 'een planeet', french: 'une planète', emoji: '🪐' },
    { dutch: 'de aarde', french: 'la Terre', emoji: '🌍' },
    { dutch: 'een stadsplan', french: 'un plan de ville', emoji: '🗺️' },
    { dutch: 'een land', french: 'un pays', emoji: '🇧🇪' },
    { dutch: 'een continent', french: 'un continent', emoji: '🌎' }
];

const modes = {
    nlToFr: { label: 'Mot néerlandais', ask: 'dutch', answer: 'french', showEmoji: false },
    frToNl: { label: 'Mot français', ask: 'french', answer: 'dutch', showEmoji: false },
    emojiToNl: { label: 'Que représente cette image ?', ask: null, answer: 'dutch', showEmoji: true }
};

let mode = 'nlToFr';
let score = 0;
let total = 0;
let streak = 0;
let askedIndexes = [];
let currentQuestion = null;
let isAnswered = false;

const emojiEl = document.getElementById('emoji');
const labelEl = document.getElementById('label');
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
    remainingEl.textContent = String(vocabulary.length - askedIndexes.length);
}

function pickQuestion() {
    if (askedIndexes.length >= vocabulary.length) {
        emojiEl.textContent = '🏆';
        labelEl.textContent = '';
        questionEl.textContent = `Bravo ! Score final : ${score}/${total}`;
        optionsEl.innerHTML = '';
        feedbackEl.textContent = 'Cliquez sur « Recommencer » pour rejouer.';
        feedbackEl.className = 'feedback good';
        nextBtn.disabled = true;
        updateStats();
        return;
    }

    const availableIndexes = vocabulary
        .map((_, i) => i)
        .filter(index => !askedIndexes.includes(index));

    const nextIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    askedIndexes.push(nextIndex);
    currentQuestion = vocabulary[nextIndex];
    isAnswered = false;

    const config = modes[mode];
    emojiEl.textContent = config.showEmoji ? currentQuestion.emoji : '';
    emojiEl.hidden = !config.showEmoji;
    labelEl.textContent = config.label;
    questionEl.textContent = config.ask ? currentQuestion[config.ask] : '';
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    nextBtn.disabled = true;

    renderOptions();
    updateStats();
}

function renderOptions() {
    const key = modes[mode].answer;
    const correct = currentQuestion[key];
    const wrongAnswers = shuffleArray(
        vocabulary.filter(item => item[key] !== correct).map(item => item[key])
    ).slice(0, 3);

    optionsEl.innerHTML = '';
    shuffleArray([correct, ...wrongAnswers]).forEach((option, i) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'option-btn';
        button.textContent = option;
        button.dataset.key = String(i + 1);
        button.addEventListener('click', () => handleAnswer(option, button));
        optionsEl.appendChild(button);
    });
}

function handleAnswer(selected, selectedBtn) {
    if (isAnswered) return;

    isAnswered = true;
    total += 1;

    const correct = currentQuestion[modes[mode].answer];
    optionsEl.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correct) {
            btn.classList.add('correct');
        }
    });

    // Always reveal the picture + full pair after answering
    emojiEl.hidden = false;
    emojiEl.textContent = currentQuestion.emoji;

    if (selected === correct) {
        score += 1;
        streak += 1;
        feedbackEl.textContent = `✅ Bonne réponse ! ${currentQuestion.dutch} = ${currentQuestion.french}`;
        feedbackEl.className = 'feedback good';
    } else {
        streak = 0;
        selectedBtn.classList.add('wrong');
        feedbackEl.textContent = `❌ Mauvaise réponse. ${currentQuestion.dutch} = ${currentQuestion.french}`;
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

document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        mode = btn.dataset.mode;
        restartGame();
    });
});

document.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !nextBtn.disabled) {
        event.preventDefault();
        pickQuestion();
        return;
    }
    const target = optionsEl.querySelector(`.option-btn[data-key="${event.key}"]`);
    if (target && !isAnswered) {
        target.click();
    }
});

nextBtn.addEventListener('click', pickQuestion);
restartBtn.addEventListener('click', restartGame);

pickQuestion();
