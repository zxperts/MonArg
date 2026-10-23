let currentTable;
let steps = [];
let currentStepIndex = 0;
let startTime;
let expertMode = false;
let recognition = null;
let isListening = false;
let enteredAnswer = '';
let answerMode = 'grid';

document.getElementById('answerModeButton').addEventListener('click', () => {
    const answerModes = ['grid', 'keypad', 'single-line'];
    answerMode = answerModes[(answerModes.indexOf(answerMode) + 1) % answerModes.length];
    updateAnswerMode();
});

function updateAnswerMode() {
    const numericMode = answerMode !== 'grid';
    const labels = { grid: 'Tableau', keypad: 'Pavé numérique', 'single-line': 'Sur une ligne' };
    document.getElementById('answerModeButton').textContent = labels[answerMode];
    document.getElementById('expertSettings').hidden = numericMode;
    document.getElementById('grid').hidden = numericMode;
    document.getElementById('numericAnswer').hidden = !numericMode;
    document.getElementById('numericAnswer').classList.toggle('single-line', answerMode === 'single-line');
}

function resetNumericAnswer() {
    enteredAnswer = '';
    document.getElementById('answerDisplay').textContent = '';
    document.getElementById('answerFeedback').textContent = '';
    document.getElementById('answerFeedback').classList.remove('success');
}

function appendDigit(digit) {
    if (!currentTable || currentStepIndex >= steps.length || enteredAnswer.length >= 3) return;
    enteredAnswer = enteredAnswer === '0' ? digit : enteredAnswer + digit;
    document.getElementById('answerDisplay').textContent = enteredAnswer;
    document.getElementById('answerFeedback').textContent = '';
    document.getElementById('answerFeedback').classList.remove('success');
    if (Number(enteredAnswer) === currentTable * steps[currentStepIndex]) {
        submitNumericAnswer();
    }
}

function eraseDigit() {
    enteredAnswer = enteredAnswer.slice(0, -1);
    document.getElementById('answerDisplay').textContent = enteredAnswer;
    document.getElementById('answerFeedback').textContent = '';
    document.getElementById('answerFeedback').classList.remove('success');
}

function submitNumericAnswer() {
    if (enteredAnswer === '') return;
    const answer = Number(enteredAnswer);
    const cell = document.getElementById('grid').children[answer - 1];
    checkAnswer(answer, cell);
}

function generateNumberButtons() {
    const numberSelection = document.getElementById('numberSelection');
    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = 'number-btn';
        btn.onclick = () => selectTable(i, btn);
        numberSelection.appendChild(btn);
    }
}

function selectTable(number, btn) {
    document.querySelectorAll('.number-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    currentTable = number;
    startTime = new Date(); // Démarrer le chronomètre
    startGame();
    // Scroll automatique vers la grille
    const answerArea = answerMode !== 'grid' ? 'numericAnswer' : 'grid';
    document.getElementById(answerArea).scrollIntoView({ behavior: 'smooth' });
}

function startGame() {
    steps = shuffleArray([...Array(10).keys()].map(i => i + 1));
    currentStepIndex = 0;
    resetNumericAnswer();
    document.getElementById('answerKeys').disabled = false;

    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    for (let i = 1; i <= currentTable * 10; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = i;
        cell.onclick = () => checkAnswer(i, cell);
        grid.appendChild(cell);
    }
    updateCalculationDisplay();
}

function checkAnswer(num, cell) {
    if (!currentTable || currentStepIndex >= steps.length) return;
    if (num === currentTable * steps[currentStepIndex]) {
        cell.classList.remove('incorrect');
        cell.classList.add('correct');
        resetNumericAnswer();
        document.getElementById('answerFeedback').textContent = 'Bonne réponse !';
        document.getElementById('answerFeedback').classList.add('success');

        // En mode expert, retirer la couleur après 2 secondes
        if (expertMode && answerMode === 'grid') {
            setTimeout(() => {
                cell.classList.remove('correct');
            }, 2000);
        }

        currentStepIndex++;
        if (currentStepIndex >= steps.length) {
            document.getElementById('answerKeys').disabled = true;
            document.getElementById('currentCalculation').textContent = 'Table terminée !';
            const endTime = new Date();
            const elapsedTime = (endTime - startTime) / 1000; // Temps en secondes
            if (elapsedTime < 30) {
                showCelebration(elapsedTime);
            } else {
                showModal(`Vous avez terminé la table de ${currentTable}`, elapsedTime);
            }
        } else {
            updateCalculationDisplay(answerMode !== 'grid');
        }
    } else {
        document.getElementById('answerFeedback').textContent = 'Pas encore, réessaie !';
        document.getElementById('answerFeedback').classList.remove('success');
        if (cell && !cell.classList.contains('correct')) {
            cell.classList.add('incorrect');

            // En mode expert, retirer la couleur après 2 secondes
            if (expertMode && answerMode === 'grid') {
                setTimeout(() => {
                    cell.classList.remove('incorrect');
                }, 2000);
            }
        }
    }
}

function updateCalculationDisplay(animateTransition = false) {
    const calculationDisplay = document.getElementById('currentCalculation');
    calculationDisplay.getAnimations().forEach(animation => animation.cancel());
    calculationDisplay.textContent = `${currentTable} x ${steps[currentStepIndex]} = ?`;
    if (animateTransition) {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        calculationDisplay.animate([
            { backgroundColor: '#dcfce7', color: '#166534', transform: reducedMotion ? 'none' : 'translateY(6px) scale(0.96)' },
            { backgroundColor: '#fef08a', color: '#166534', transform: reducedMotion ? 'none' : 'translateY(-3px) scale(1.04)', offset: 0.45 },
            { backgroundColor: '#e0f2fe', color: '#075985', transform: 'none', offset: 0.75 },
            { backgroundColor: 'transparent', color: '#2c3e50', transform: 'none' }
        ], { duration: reducedMotion ? 150 : 650, easing: 'ease-out' });
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function showCelebration(elapsedTime) {
    // Ne pas modifier la grille, garder l'historique des réponses
    showModal("Félicitations ! Vous avez terminé la table de " + currentTable + " en un temps record !\n🎉Vous êtes un champion de la multiplication !🎉", elapsedTime, true);
}

function showModal(message, elapsedTime, isChampion = false) {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    document.body.appendChild(modalOverlay);

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const title = isChampion ? '🏆 Champion ! 🏆' : 'Félicitations !';
    const timeColor = elapsedTime < 30 ? '#f1c40f' : '#ffffff';

    modalContent.innerHTML = `
        <div class="modal-title">${title}</div>
        <div class="modal-message">${message}</div>
        <div class="modal-time" style="color: ${timeColor};">Temps: ${elapsedTime.toFixed(2)} secondes</div>
        <button class="modal-button">Jouer à nouveau</button>
    `;

    modalOverlay.appendChild(modalContent);

    // Animation d'apparition
    setTimeout(() => {
        modalOverlay.classList.add('show');
    }, 100);

    const modalButton = modalContent.querySelector('.modal-button');
    modalButton.onclick = () => {
        modalOverlay.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(modalOverlay);
            //startGame();
        }, 300);
    };
}

function toggleMode() {
    expertMode = !expertMode;
    const expertCheckbox = document.getElementById('expertCheckbox');

    if (expertMode) {
        expertCheckbox.classList.add('checked');
    } else {
        expertCheckbox.classList.remove('checked');
    }
}

// Initialiser la reconnaissance vocale
function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'fr-FR';

        recognition.onstart = function() {
            isListening = true;
            document.getElementById('voiceButton').classList.add('listening');
            document.getElementById('voiceButton').innerHTML = '🔴 Écoute...';
            document.getElementById('voiceStatus').textContent = 'Parlez maintenant...';
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript.toLowerCase();
            document.getElementById('voiceStatus').textContent = `Vous avez dit: "${transcript}"`;

            // Convertir les mots en nombres
            const number = convertSpeechToNumber(transcript);
            if (number !== null) {
                // Trouver la cellule correspondante et cliquer dessus
                const cells = document.querySelectorAll('.cell');
                for (let cell of cells) {
                    if (parseInt(cell.textContent) === number) {
                        checkAnswer(number, cell);
                        break;
                    }
                }
            } else {
                document.getElementById('voiceStatus').textContent = 'Nombre non reconnu, essayez encore';
            }

            // Redémarrer l'écoute si elle est toujours activée
            if (isListening) {
                setTimeout(() => {
                    recognition.start();
                }, 1000);
            }
        };

        recognition.onerror = function(event) {
            document.getElementById('voiceStatus').textContent = 'Erreur de reconnaissance vocale';
            // Redémarrer l'écoute si elle est toujours activée
            if (isListening) {
                setTimeout(() => {
                    recognition.start();
                }, 1000);
            }
        };

        recognition.onend = function() {
            // Redémarrer l'écoute si elle est toujours activée
            if (isListening) {
                setTimeout(() => {
                    recognition.start();
                }, 1000);
            }
        };
    } else {
        document.getElementById('voiceStatus').textContent = 'Reconnaissance vocale non supportée';
        document.getElementById('voiceButton').disabled = true;
    }
}

function stopListening() {
    isListening = false;
    document.getElementById('voiceButton').classList.remove('listening');
    document.getElementById('voiceButton').innerHTML = '🎤 Réponse vocale';
}

function toggleVoiceRecognition() {
    if (!recognition) {
        initSpeechRecognition();
        return;
    }

    if (isListening) {
        // Désactiver l'écoute
        recognition.stop();
        stopListening();
    } else {
        // Activer l'écoute
        recognition.start();
    }
}

function convertSpeechToNumber(speech) {
    const numberWords = {
        'zéro': 0, 'un': 1, 'deux': 2, 'trois': 3, 'quatre': 4, 'cinq': 5,
        'six': 6, 'sept': 7, 'huit': 8, 'neuf': 9, 'dix': 10,
        'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
        'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
    };

    // Essayer de trouver un nombre dans le texte
    for (let word in numberWords) {
        if (speech.includes(word)) {
            return numberWords[word];
        }
    }

    // Essayer de trouver un chiffre directement
    const numbers = speech.match(/\d+/);
    if (numbers) {
        return parseInt(numbers[0]);
    }

    return null;
}

generateNumberButtons();