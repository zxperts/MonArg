let currentMode = 'fractionToDecimal'; // 'fractionToDecimal' ou 'decimalToFraction'
let currentDifficulty = 'easy'; // 'easy', 'medium', 'hard'
let currentQuestion = null;
let correctAnswer = null;
let totalQuestions = 0;
let correctAnswers = 0;
let currentStreak = 0;
let bestStreak = 0;
let questionAnswered = false;

// Base de données de fractions avec leurs équivalents décimaux
const fractionDatabase = {
    easy: [
        { fraction: '1/2', decimal: '0.5', display: '1/2' },
        { fraction: '1/3', decimal: '0.33', display: '1/3' },
        { fraction: '2/3', decimal: '0.67', display: '2/3' },
        { fraction: '1/4', decimal: '0.25', display: '1/4' },
        { fraction: '3/4', decimal: '0.75', display: '3/4' },
        { fraction: '1/5', decimal: '0.2', display: '1/5' },
        { fraction: '2/5', decimal: '0.4', display: '2/5' },
        { fraction: '3/5', decimal: '0.6', display: '3/5' },
        { fraction: '4/5', decimal: '0.8', display: '4/5' },
        { fraction: '1/10', decimal: '0.1', display: '1/10' },
        { fraction: '3/10', decimal: '0.3', display: '3/10' },
        { fraction: '7/10', decimal: '0.7', display: '7/10' },
        { fraction: '9/10', decimal: '0.9', display: '9/10' }
    ],
    medium: [
        { fraction: '2/6', decimal: '0.33', display: '2/6' },
        { fraction: '4/6', decimal: '0.67', display: '4/6' },
        { fraction: '2/8', decimal: '0.25', display: '2/8' },
        { fraction: '6/8', decimal: '0.75', display: '6/8' },
        { fraction: '5/10', decimal: '0.5', display: '5/10' },
        { fraction: '1/6', decimal: '0.17', display: '1/6' },
        { fraction: '5/6', decimal: '0.83', display: '5/6' },
        { fraction: '1/8', decimal: '0.125', display: '1/8' },
        { fraction: '3/8', decimal: '0.375', display: '3/8' },
        { fraction: '5/8', decimal: '0.625', display: '5/8' },
        { fraction: '7/8', decimal: '0.875', display: '7/8' },
        { fraction: '6/5', decimal: '1.2', display: '6/5' },
        { fraction: '7/5', decimal: '1.4', display: '7/5' },
        { fraction: '9/5', decimal: '1.8', display: '9/5' },
        { fraction: '3/2', decimal: '1.5', display: '3/2' }
    ],
    hard: [
        { fraction: '12/15', decimal: '0.8', display: '12/15' },
        { fraction: '15/20', decimal: '0.75', display: '15/20' },
        { fraction: '8/12', decimal: '0.67', display: '8/12' },
        { fraction: '9/12', decimal: '0.75', display: '9/12' },
        { fraction: '1/7', decimal: '0.14', display: '1/7' },
        { fraction: '2/7', decimal: '0.29', display: '2/7' },
        { fraction: '3/7', decimal: '0.43', display: '3/7' },
        { fraction: '4/7', decimal: '0.57', display: '4/7' },
        { fraction: '5/7', decimal: '0.71', display: '5/7' },
        { fraction: '6/7', decimal: '0.86', display: '6/7' },
        { fraction: '1/9', decimal: '0.11', display: '1/9' },
        { fraction: '2/9', decimal: '0.22', display: '2/9' },
        { fraction: '4/9', decimal: '0.44', display: '4/9' },
        { fraction: '5/9', decimal: '0.56', display: '5/9' },
        { fraction: '7/9', decimal: '0.78', display: '7/9' },
        { fraction: '8/9', decimal: '0.89', display: '8/9' },
        { fraction: '1/20', decimal: '0.05', display: '1/20' },
        { fraction: '3/20', decimal: '0.15', display: '3/20' },
        { fraction: '7/20', decimal: '0.35', display: '7/20' },
        { fraction: '9/20', decimal: '0.45', display: '9/20' },
        { fraction: '11/20', decimal: '0.55', display: '11/20' },
        { fraction: '13/20', decimal: '0.65', display: '13/20' },
        { fraction: '17/20', decimal: '0.85', display: '17/20' },
        { fraction: '19/20', decimal: '0.95', display: '19/20' }
    ]
};

// Initialisation du jeu
document.addEventListener('DOMContentLoaded', function() {
    loadBestStreak();
    generateQuestion();
});

// Gestion des modes de jeu
function setMode(mode) {
    currentMode = mode;
    
    // Mise à jour des boutons
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(mode).classList.add('active');
    
    // Générer une nouvelle question
    generateQuestion();
}

// Gestion de la difficulté
function setDifficulty(difficulty) {
    currentDifficulty = difficulty;
    
    // Mise à jour des boutons
    document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(difficulty).classList.add('active');
    
    // Générer une nouvelle question
    generateQuestion();
}

// Génération d'une nouvelle question
function generateQuestion() {
    questionAnswered = false;
    document.getElementById('nextButton').disabled = true;
    document.getElementById('notification').textContent = '';
    document.getElementById('notification').className = 'notification';
    
    // Sélectionner une fraction aléatoire selon la difficulté
    const availableFractions = fractionDatabase[currentDifficulty];
    const randomIndex = Math.floor(Math.random() * availableFractions.length);
    currentQuestion = availableFractions[randomIndex];
    
    // Afficher la question selon le mode
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    
    if (currentMode === 'fractionToDecimal') {
        // Afficher la fraction, chercher le décimal
        questionElement.innerHTML = `
            <span>Quelle est la valeur décimale de </span>
            <span class="fraction">
                <span class="numerator">${currentQuestion.display.split('/')[0]}</span>
                <span class="denominator">${currentQuestion.display.split('/')[1]}</span>
            </span>
            <span> ?</span>
        `;
        correctAnswer = currentQuestion.decimal;
        generateDecimalOptions();
    } else {
        // Afficher le décimal, chercher la fraction
        questionElement.textContent = `Quelle fraction correspond à ${currentQuestion.decimal} ?`;
        correctAnswer = currentQuestion.display;
        generateFractionOptions();
    }
    
    // Réinitialiser les styles des options
    resetOptionStyles();
}

// Génération des options décimales
function generateDecimalOptions() {
    const options = [currentQuestion.decimal];
    const allFractions = fractionDatabase[currentDifficulty];
    
    // Ajouter des options incorrectes
    while (options.length < 4) {
        const randomFraction = allFractions[Math.floor(Math.random() * allFractions.length)];
        if (!options.includes(randomFraction.decimal)) {
            options.push(randomFraction.decimal);
        }
    }
    
    // Mélanger les options
    shuffleArray(options);
    
    // Afficher les options
    displayOptions(options);
}

// Génération des options de fractions
function generateFractionOptions() {
    const options = [currentQuestion.display];
    const allFractions = fractionDatabase[currentDifficulty];
    
    // Ajouter des options incorrectes
    while (options.length < 4) {
        const randomFraction = allFractions[Math.floor(Math.random() * allFractions.length)];
        if (!options.includes(randomFraction.display)) {
            options.push(randomFraction.display);
        }
    }
    
    // Mélanger les options
    shuffleArray(options);
    
    // Afficher les options avec formatage des fractions
    displayFractionOptions(options);
}

// Affichage des options décimales
function displayOptions(options) {
    const optionsElement = document.getElementById('options');
    optionsElement.innerHTML = '';
    
    options.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => selectAnswer(option, optionDiv);
        optionsElement.appendChild(optionDiv);
    });
}

// Affichage des options de fractions
function displayFractionOptions(options) {
    const optionsElement = document.getElementById('options');
    optionsElement.innerHTML = '';
    
    options.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        
        if (option.includes('/')) {
            const parts = option.split('/');
            optionDiv.innerHTML = `
                <span class="fraction">
                    <span class="numerator">${parts[0]}</span>
                    <span class="denominator">${parts[1]}</span>
                </span>
            `;
        } else {
            optionDiv.textContent = option;
        }
        
        optionDiv.onclick = () => selectAnswer(option, optionDiv);
        optionsElement.appendChild(optionDiv);
    });
}

// Sélection d'une réponse
function selectAnswer(selectedAnswer, optionElement) {
    if (questionAnswered) return;
    
    questionAnswered = true;
    totalQuestions++;
    
    const notification = document.getElementById('notification');
    
    if (selectedAnswer === correctAnswer) {
        // Bonne réponse
        optionElement.classList.add('correct');
        notification.textContent = '🎉 Excellente réponse !';
        notification.className = 'notification success';
        
        correctAnswers++;
        currentStreak++;
        
        if (currentStreak > bestStreak) {
            bestStreak = currentStreak;
            saveBestStreak();
        }
    } else {
        // Mauvaise réponse
        optionElement.classList.add('incorrect');
        notification.textContent = `❌ Incorrect ! La bonne réponse est ${correctAnswer}`;
        notification.className = 'notification error';
        
        // Mettre en évidence la bonne réponse
        document.querySelectorAll('.option').forEach(opt => {
            const optText = opt.textContent.trim() || opt.querySelector('.fraction')?.textContent.replace(/\s+/g, '') || '';
            const correctText = correctAnswer.replace(/\s+/g, '');
            
            if (optText === correctText || 
                (opt.querySelector('.fraction') && 
                 `${opt.querySelector('.numerator')?.textContent}/${opt.querySelector('.denominator')?.textContent}` === correctAnswer)) {
                opt.classList.add('correct');
            }
        });
        
        currentStreak = 0;
    }
    
    updateScoreDisplay();
    document.getElementById('nextButton').disabled = false;
}

// Question suivante
function nextQuestion() {
    generateQuestion();
}

// Mise à jour de l'affichage du score
function updateScoreDisplay() {
    document.getElementById('score').textContent = `${correctAnswers}/${totalQuestions}`;
    document.getElementById('streak').textContent = currentStreak;
    document.getElementById('bestStreak').textContent = bestStreak;
}

// Réinitialisation des styles des options
function resetOptionStyles() {
    setTimeout(() => {
        document.querySelectorAll('.option').forEach(option => {
            option.classList.remove('correct', 'incorrect');
        });
    }, 100);
}

// Mélange d'un tableau
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Sauvegarde de la meilleure série
function saveBestStreak() {
    localStorage.setItem('fractionGameBestStreak', bestStreak.toString());
}

// Chargement de la meilleure série
function loadBestStreak() {
    const saved = localStorage.getItem('fractionGameBestStreak');
    if (saved) {
        bestStreak = parseInt(saved, 10);
        updateScoreDisplay();
    }
}

// Gestion du clavier
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        if (!document.getElementById('nextButton').disabled) {
            nextQuestion();
        }
    }
    
    // Touches numériques pour sélectionner les options
    const num = parseInt(event.key);
    if (num >= 1 && num <= 4) {
        const options = document.querySelectorAll('.option');
        if (options[num - 1] && !questionAnswered) {
            options[num - 1].click();
        }
    }
});
