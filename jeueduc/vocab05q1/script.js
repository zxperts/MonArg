// Base de données des verbes néerlandais avec leurs traductions françaises
const verbsDatabase = [
    { infinitive: "Wandelen", conjugated: "Wandel", french: "Se promener" },
    { infinitive: "Dansen", conjugated: "Dans", french: "Danser" },
    { infinitive: "Eten", conjugated: "Eet", french: "Manger" },
    { infinitive: "Spelen", conjugated: "Speel", french: "Jouer" },
    { infinitive: "Voetballen", conjugated: "Voetbal", french: "Jouer au foot" },
    { infinitive: "Drinken", conjugated: "Drink", french: "Boire" },
    { infinitive: "Lezen", conjugated: "Lees", french: "Lire" },
    { infinitive: "Zwemmen", conjugated: "Zwem", french: "Nager" },
    { infinitive: "Paardrijden", conjugated: "Rijd paard", french: "Monter à cheval" },
    { infinitive: "Fietsen", conjugated: "Fiets", french: "Faire du vélo" },
    { infinitive: "Huilen", conjugated: "Huil", french: "Pleurer" },
    { infinitive: "Kammen", conjugated: "Kam", french: "Peigner" },
    { infinitive: "Naaien", conjugated: "Naai", french: "Coudre" },
    { infinitive: "Schoonmaken", conjugated: "Maak schoon", french: "Nettoyer" },
    { infinitive: "Poetsen", conjugated: "Poets", french: "Brosser (les dents)" },
    { infinitive: "Koken", conjugated: "Kook", french: "Cuisiner" },
    { infinitive: "Schrijven", conjugated: "Schrijf", french: "Écrire" },
    { infinitive: "Wassen", conjugated: "Was", french: "Laver" },
    { infinitive: "Glijden", conjugated: "Glijd", french: "Glisser" },
    { infinitive: "Lachen", conjugated: "Lach", french: "Rire" },
    { infinitive: "Verven", conjugated: "Verf", french: "Peindre" },
    { infinitive: "Geeuwen", conjugated: "Geeuw", french: "Bailler" },
    { infinitive: "Zitten", conjugated: "Zit", french: "Être assis" },
    { infinitive: "Lopen", conjugated: "Loop", french: "Marcher/courir" },
    { infinitive: "Blazen", conjugated: "Blaas", french: "Souffler" },
    { infinitive: "Vallen", conjugated: "Val", french: "Tomber" },
    { infinitive: "Zingen", conjugated: "Zing", french: "Chanter" },
    { infinitive: "Telefoneren", conjugated: "Telefoneer", french: "Téléphoner" },
    { infinitive: "Aaien", conjugated: "Aai", french: "Caresser" },
    { infinitive: "Kijken naar", conjugated: "Kijk naar", french: "Regarder" }
];

let currentMode = 'nlToFr'; // 'nlToFr', 'frToNl', 'infinitive', 'conjugated'
let currentQuestion = null;
let correctAnswer = null;
let totalQuestions = 0;
let correctAnswers = 0;
let currentStreak = 0;
let bestStreak = 0;
let questionAnswered = false;
let usedQuestions = [];
let totalVerbsLearned = new Set();

// Initialisation du jeu
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing game...'); // Debug
    
    // Attendre un peu pour être sûr que tous les éléments sont prêts
    setTimeout(() => {
        loadBestStreak();
        setMode('nlToFr');
        
        // Vérifier que les éléments essentiels existent
        const questionElement = document.getElementById('questionTitle');
        const optionsElement = document.getElementById('options');
        const infinitiveValue = document.getElementById('infinitiveValue');
        const conjugatedValue = document.getElementById('conjugatedValue');
        
        console.log('Elements check:', {
            question: !!questionElement,
            options: !!optionsElement,
            infinitive: !!infinitiveValue,
            conjugated: !!conjugatedValue
        });
        
        if (questionElement && optionsElement && infinitiveValue && conjugatedValue) {
            generateQuestion();
        } else {
            console.error('Required elements not found');
        }
    }, 100);
});

// Gestion des modes de jeu
function setMode(mode) {
    currentMode = mode;
    
    // Mise à jour des boutons
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    const modeBtn = document.getElementById(mode);
    if (modeBtn) {
        modeBtn.classList.add('active');
    }
    
    // Réinitialiser les questions utilisées
    usedQuestions = [];
    
    // Générer une nouvelle question seulement si les éléments DOM existent
    if (document.getElementById('options')) {
        generateQuestion();
    }
}

// Génération d'une nouvelle question
function generateQuestion() {
    console.log('Generating question...'); // Debug
    
    questionAnswered = false;
    const nextButton = document.getElementById('nextButton');
    const notification = document.getElementById('notification');
    
    if (nextButton) nextButton.disabled = true;
    if (notification) {
        notification.textContent = '';
        notification.className = 'notification';
    }
    
    // Si toutes les questions ont été utilisées, réinitialiser
    if (usedQuestions.length >= verbsDatabase.length) {
        usedQuestions = [];
    }
    
    // Sélectionner un verbe qui n'a pas encore été utilisé
    let availableVerbs = verbsDatabase.filter((verb, index) => !usedQuestions.includes(index));
    const randomIndex = Math.floor(Math.random() * availableVerbs.length);
    currentQuestion = availableVerbs[randomIndex];
    
    console.log('Selected verb:', currentQuestion); // Debug
    
    // Marquer cette question comme utilisée
    const originalIndex = verbsDatabase.indexOf(currentQuestion);
    usedQuestions.push(originalIndex);
    
    // Ajouter à la liste des verbes appris
    totalVerbsLearned.add(originalIndex);
    
    // Afficher la question selon le mode
    displayQuestion();
    generateOptions();
    
    // Réinitialiser les styles des options
    resetOptionStyles();
    
    // Mettre à jour la progression
    updateProgressDisplay();
}

// Affichage de la question selon le mode
function displayQuestion() {
    console.log('Displaying question for mode:', currentMode); // Debug
    console.log('Current question:', currentQuestion); // Debug
    
    const questionElement = document.getElementById('questionTitle');
    const infinitiveValue = document.getElementById('infinitiveValue');
    const conjugatedValue = document.getElementById('conjugatedValue');
    const infinitiveLabel = document.querySelector('#infinitiveForm .verb-label');
    const conjugatedLabel = document.querySelector('#conjugatedForm .verb-label');
    
    if (!questionElement || !infinitiveValue || !conjugatedValue || !currentQuestion) {
        console.error('Missing elements or question data');
        return;
    }
    
    switch (currentMode) {
        case 'nlToFr':
            questionElement.textContent = 'Trouvez la traduction française de ces formes :';
            infinitiveLabel.textContent = 'INFINITIF';
            infinitiveValue.textContent = currentQuestion.infinitive;
            conjugatedLabel.textContent = 'JE...';
            conjugatedValue.textContent = currentQuestion.conjugated;
            correctAnswer = currentQuestion.french;
            break;
            
        case 'frToNl':
            questionElement.textContent = 'Trouvez l\'infinitif néerlandais :';
            infinitiveLabel.textContent = 'FRANÇAIS';
            infinitiveValue.textContent = currentQuestion.french;
            conjugatedLabel.textContent = 'INFINITIF ?';
            conjugatedValue.textContent = '?';
            correctAnswer = currentQuestion.infinitive;
            break;
            
        case 'infinitive':
            questionElement.textContent = 'Trouvez l\'infinitif néerlandais :';
            infinitiveLabel.textContent = 'FRANÇAIS';
            infinitiveValue.textContent = currentQuestion.french;
            conjugatedLabel.textContent = 'JE...';
            conjugatedValue.textContent = currentQuestion.conjugated;
            correctAnswer = currentQuestion.infinitive;
            break;
            
        case 'conjugated':
            questionElement.textContent = 'Trouvez la forme conjuguée (je) :';
            infinitiveLabel.textContent = 'INFINITIF';
            infinitiveValue.textContent = currentQuestion.infinitive;
            conjugatedLabel.textContent = 'FRANÇAIS';
            conjugatedValue.textContent = currentQuestion.french;
            correctAnswer = currentQuestion.conjugated;
            break;
    }
    
    console.log('Correct answer set to:', correctAnswer); // Debug
}

// Génération des options de réponse
function generateOptions() {
    console.log('Generating options for answer:', correctAnswer); // Debug
    
    let options = [correctAnswer];
    
    // Ajouter des options incorrectes selon le mode
    while (options.length < 4) {
        const randomVerb = verbsDatabase[Math.floor(Math.random() * verbsDatabase.length)];
        let wrongAnswer;
        
        switch (currentMode) {
            case 'nlToFr':
                wrongAnswer = randomVerb.french;
                break;
            case 'frToNl':
            case 'infinitive':
                wrongAnswer = randomVerb.infinitive;
                break;
            case 'conjugated':
                wrongAnswer = randomVerb.conjugated;
                break;
        }
        
        if (!options.includes(wrongAnswer)) {
            options.push(wrongAnswer);
        }
    }
    
    // Mélanger les options
    shuffleArray(options);
    
    console.log('Generated options:', options); // Debug
    
    // Afficher les options
    displayOptions(options);
}

// Affichage des options
function displayOptions(options) {
    console.log('Displaying options:', options); // Debug
    
    const optionsElement = document.getElementById('options');
    if (!optionsElement) {
        console.error('Options element not found');
        return;
    }
    
    optionsElement.innerHTML = '';
    
    options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => selectAnswer(option, optionDiv);
        optionDiv.setAttribute('data-key', index + 1);
        optionsElement.appendChild(optionDiv);
    });
    
    console.log('Options displayed successfully'); // Debug
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
        notification.textContent = `❌ Incorrect ! La bonne réponse est : ${correctAnswer}`;
        notification.className = 'notification error';
        
        // Mettre en évidence la bonne réponse
        document.querySelectorAll('.option').forEach(opt => {
            if (opt.textContent === correctAnswer) {
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

// Mise à jour de la progression
function updateProgressDisplay() {
    const progress = totalVerbsLearned.size;
    const total = verbsDatabase.length;
    document.getElementById('progress').textContent = `${progress}/${total}`;
    
    const percentage = (progress / total) * 100;
    document.getElementById('progressFill').style.width = `${percentage}%`;
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
    localStorage.setItem('vocabulaire05q1BestStreak', bestStreak.toString());
}

// Chargement de la meilleure série
function loadBestStreak() {
    const saved = localStorage.getItem('vocabulaire05q1BestStreak');
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
        event.preventDefault();
    }
    
    // Touches numériques pour sélectionner les options
    const num = parseInt(event.key);
    if (num >= 1 && num <= 4) {
        const options = document.querySelectorAll('.option');
        if (options[num - 1] && !questionAnswered) {
            options[num - 1].click();
        }
        event.preventDefault();
    }
});
