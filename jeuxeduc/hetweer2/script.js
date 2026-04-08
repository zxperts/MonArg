const weatherV2Questions = [
    // 1) De neerslag
    { category: 'De neerslag', question: 'de neerslag', answer: 'Les précipitations' },
    { category: 'De neerslag', question: 'de pluviometer', answer: 'Le pluviomètre' },
    { category: 'De neerslag', question: 'de regen', answer: 'La pluie' },
    { category: 'De neerslag', question: 'de mist', answer: 'Le brouillard' },
    { category: 'De neerslag', question: 'de sneeuw', answer: 'La neige' },

    // 2) De wind
    { category: 'De wind', question: 'de wind', answer: 'Le vent' },
    { category: 'De wind', question: 'de schaal van Beaufort', answer: 'L’échelle de Beaufort' },
    { category: 'De wind', question: 'de manometer', answer: 'Le manomètre' },
    { category: 'De wind', question: 'de windroos', answer: 'La rose des vents' },
    { category: 'De wind', question: 'Noordwind = koud', answer: 'Vent du nord = froid' },
    { category: 'De wind', question: 'Westenwind = regen', answer: 'Vent d’ouest = pluie' },
    { category: 'De wind', question: 'Oostenwind = droog', answer: 'Vent d’est = sec' },
    { category: 'De wind', question: 'Zuidenwind = warm', answer: 'Vent du sud = chaud' },

    // 3) Temperatuur
    { category: 'Temperatuur', question: 'de temperatuur', answer: 'La température' },
    { category: 'Temperatuur', question: 'de thermometer', answer: 'Le thermomètre' },
    { category: 'Temperatuur', question: 'Celsius', answer: 'Celsius' },
    { category: 'Temperatuur', question: 'Fahrenheit', answer: 'Fahrenheit' },
    { category: 'Temperatuur', question: '0 graden: water wordt ijs', answer: 'À 0 degré: l’eau devient de la glace' },
    { category: 'Temperatuur', question: '100 graden: water kookt', answer: 'À 100 degrés: l’eau bout' },

    // 4) Luchtdruk
    { category: 'Luchtdruk', question: 'de luchtdruk', answer: 'La pression atmosphérique' },
    { category: 'Luchtdruk', question: 'de barometer', answer: 'Le baromètre' },
    { category: 'Luchtdruk', question: 'milibar', answer: 'Millibar' },
    { category: 'Luchtdruk', question: 'Warme lucht → hoge luchtdruk → mooi weer', answer: 'Air chaud → haute pression → beau temps' },
    { category: 'Luchtdruk', question: 'Koude lucht → lage luchtdruk → slecht weer', answer: 'Air froid → basse pression → mauvais temps' }
];

let score = 0;
let total = 0;
let streak = 0;
let askedIndexes = [];
let currentQuestion = null;
let isAnswered = false;

const questionEl = document.getElementById('question');
const categoryEl = document.getElementById('category');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const remainingEl = document.getElementById('remaining');
const helpToggleEl = document.getElementById('helpToggle');
const helpBoxEl = document.getElementById('helpBox');
const helpImageEl = document.getElementById('helpImage');
const helpCaptionEl = document.getElementById('helpCaption');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');

const helpImages = {
    'de neerslag': 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=640&h=360&fit=crop',
    'de pluviometer': 'https://images.unsplash.com/photo-1534662883644-b7a6e72a4a15?w=640&h=360&fit=crop',
    'de regen': 'https://images.unsplash.com/photo-1534274988757-a28bf1ad0e1f?w=640&h=360&fit=crop',
    'de mist': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640&h=360&fit=crop',
    'de sneeuw': 'https://images.unsplash.com/photo-1491002052546-bf38f186603a?w=640&h=360&fit=crop',
    'de wind': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=640&h=360&fit=crop',
    'de schaal van Beaufort': 'https://images.unsplash.com/photo-1525398099487-eaf0e58f29bb?w=640&h=360&fit=crop',
    'de manometer': 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=640&h=360&fit=crop',
    'de windroos': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=640&h=360&fit=crop',
    'Noordwind = koud': 'https://images.unsplash.com/photo-1491002052546-bf38f186603a?w=640&h=360&fit=crop',
    'Westenwind = regen': 'https://images.unsplash.com/photo-1534274988757-a28bf1ad0e1f?w=640&h=360&fit=crop',
    'Oostenwind = droog': 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=640&h=360&fit=crop',
    'Zuidenwind = warm': 'https://images.unsplash.com/photo-1495954484750-af469f1357be?w=640&h=360&fit=crop',
    'de temperatuur': 'https://images.unsplash.com/photo-1580541831550-7323e8f0ce2b?w=640&h=360&fit=crop',
    'de thermometer': 'https://images.unsplash.com/photo-1581092915962-8627cb94b474?w=640&h=360&fit=crop',
    'Celsius': 'https://images.unsplash.com/photo-1580541831550-7323e8f0ce2b?w=640&h=360&fit=crop',
    'Fahrenheit': 'https://images.unsplash.com/photo-1581092915962-8627cb94b474?w=640&h=360&fit=crop',
    '0 graden: water wordt ijs': 'https://images.unsplash.com/photo-1491002052546-bf38f186603a?w=640&h=360&fit=crop',
    '100 graden: water kookt': 'https://images.unsplash.com/photo-1545521521-7a0c3fb6583f?w=640&h=360&fit=crop',
    'de luchtdruk': 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=640&h=360&fit=crop',
    'de barometer': 'https://images.unsplash.com/photo-1581092165854-40129078f061?w=640&h=360&fit=crop',
    'milibar': 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=640&h=360&fit=crop',
    'Warme lucht → hoge luchtdruk → mooi weer': 'https://images.unsplash.com/photo-1495954484750-af469f1357be?w=640&h=360&fit=crop',
    'Koude lucht → lage luchtdruk → slecht weer': 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=640&h=360&fit=crop'
};

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
    remainingEl.textContent = String(weatherV2Questions.length - askedIndexes.length);
}

function hideHelp() {
    helpBoxEl.hidden = true;
    helpImageEl.src = '';
    helpCaptionEl.textContent = '';
}

function renderHelpImage() {
    if (!helpToggleEl.checked || !currentQuestion) {
        hideHelp();
        return;
    }

    const imageUrl = helpImages[currentQuestion.question] || 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=640&h=360&fit=crop';

    helpBoxEl.hidden = false;
    helpCaptionEl.textContent = `Aide visuelle : ${currentQuestion.answer}`;

    helpImageEl.onerror = () => {
        helpCaptionEl.textContent = `Aide visuelle indisponible`;
        helpImageEl.style.display = 'none';
    };

    helpImageEl.onload = () => {
        helpImageEl.style.display = 'block';
    };

    helpImageEl.src = imageUrl;
}

function pickQuestion() {
    if (askedIndexes.length >= weatherV2Questions.length) {
        categoryEl.textContent = 'Terminé';
        questionEl.textContent = '🎉 Bravo, toutes les questions sont terminées !';
        optionsEl.innerHTML = '';
        hideHelp();
        feedbackEl.textContent = 'Cliquez sur « Recommencer » pour rejouer.';
        feedbackEl.className = 'feedback good';
        nextBtn.disabled = true;
        updateStats();
        return;
    }

    const availableIndexes = weatherV2Questions
        .map((_, i) => i)
        .filter(index => !askedIndexes.includes(index));

    const nextIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    askedIndexes.push(nextIndex);
    currentQuestion = weatherV2Questions[nextIndex];
    isAnswered = false;

    categoryEl.textContent = currentQuestion.category;
    questionEl.textContent = currentQuestion.question;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    nextBtn.disabled = true;

    renderHelpImage();
    renderOptions();
    updateStats();
}

function renderOptions() {
    const wrongAnswers = shuffleArray(
        weatherV2Questions
            .filter(item => item.answer !== currentQuestion.answer)
            .map(item => item.answer)
    ).slice(0, 3);

    const options = shuffleArray([currentQuestion.answer, ...wrongAnswers]);

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
        if (btn.textContent === currentQuestion.answer) {
            btn.classList.add('correct');
        }
    });

    if (selected === currentQuestion.answer) {
        score += 1;
        streak += 1;
        selectedBtn.classList.add('correct');
        feedbackEl.textContent = '✅ Bonne réponse !';
        feedbackEl.className = 'feedback good';
    } else {
        streak = 0;
        selectedBtn.classList.add('wrong');
        feedbackEl.textContent = `❌ Mauvaise réponse. Bonne réponse : ${currentQuestion.answer}`;
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
helpToggleEl.addEventListener('change', renderHelpImage);

pickQuestion();
