const elements = Object.fromEntries(['round', 'matched', 'errors', 'progress', 'board',
    'sourceTitle', 'targetTitle', 'source', 'target', 'feedback', 'next', 'restart']
    .map(name => [name, document.getElementById(name)]));
let direction = 'fr';
let deck = [];
let round = 0;
let matched = 0;
let errors = 0;
let selection = { source: null, target: null };

function updateStats() {
    elements.round.textContent = `${round + 1} / 4`;
    elements.matched.textContent = `${matched} / ${schoolWords.length}`;
    elements.errors.textContent = String(errors);
    elements.progress.value = matched;
}

function selectWord(side, button) {
    if (button.disabled) return;
    if (selection[side]) {
        selection[side].classList.remove('selected');
        selection[side].setAttribute('aria-pressed', 'false');
    }
    selection[side] = button;
    button.classList.add('selected');
    button.setAttribute('aria-pressed', 'true');
    if (!selection.source || !selection.target) return;
    const correct = selection.source.dataset.id === selection.target.dataset.id;
    if (correct) {
        const item = deck[Number(selection.source.dataset.id)];
        matched++;
        elements.feedback.className = 'good';
        elements.feedback.textContent = `${item.emoji} ${item.fr} = ${item.nl}`;
    } else {
        errors++;
        elements.feedback.className = 'bad';
        elements.feedback.textContent = 'Ces mots ne vont pas ensemble. Réessaie !';
    }
    Object.values(selection).forEach(selected => {
        selected.classList.remove('selected');
        selected.setAttribute('aria-pressed', 'false');
        if (correct) {
            selected.disabled = true;
            selected.classList.add('matched');
        }
    });
    selection = { source: null, target: null };
    updateStats();
    if (matched === schoolWords.length) {
        elements.feedback.textContent = `Bravo ! Les 28 paires sont réunies. Erreurs : ${errors}.`;
        elements.restart.focus();
    } else if (matched === (round + 1) * 7) {
        elements.next.hidden = false;
        elements.next.focus();
    }
}

function renderRound() {
    selection = { source: null, target: null };
    elements.feedback.textContent = '';
    elements.feedback.className = '';
    elements.next.hidden = true;
    const targetLanguage = direction === 'fr' ? 'nl' : 'fr';
    elements.sourceTitle.textContent = direction === 'fr' ? 'Français' : 'Néerlandais';
    elements.targetTitle.textContent = direction === 'fr' ? 'Néerlandais' : 'Français';
    const indexes = Array.from({ length: 7 }, (_, index) => round * 7 + index);
    for (const side of ['source', 'target']) {
        elements[side].replaceChildren();
        const language = side === 'source' ? direction : targetLanguage;
        shuffleSchoolWords(indexes).forEach(index => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'word';
            button.lang = language;
            button.dataset.id = String(index);
            button.textContent = deck[index][language];
            button.setAttribute('aria-pressed', 'false');
            button.addEventListener('click', () => selectWord(side, button));
            elements[side].appendChild(button);
        });
    }
    updateStats();
}

function restartGame() {
    deck = shuffleSchoolWords(schoolWords);
    round = 0;
    matched = 0;
    errors = 0;
    renderRound();
}

document.querySelectorAll('input[name="direction"]').forEach(input => {
    input.addEventListener('change', () => {
        direction = input.value;
        restartGame();
    });
});
elements.next.addEventListener('click', () => {
    if (matched !== (round + 1) * 7 || matched === schoolWords.length) return;
    round++;
    renderRound();
    elements.source.querySelector('button').focus();
});
elements.restart.addEventListener('click', restartGame);
restartGame();