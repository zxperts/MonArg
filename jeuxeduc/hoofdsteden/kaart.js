const locations = [
    { key: 'frankrijk', country: 'Frankrijk', capital: 'Parijs', french: 'France', x: 350, y: 400, capitalPlacement: 'below' },
    { key: 'denemarken', country: 'Denemarken', capital: 'Kopenhagen', french: 'Danemark', x: 425, y: 300, capitalPlacement: 'left' },
    { key: 'duitsland', country: 'Duitsland', capital: 'Berlijn', french: 'Allemagne', x: 450, y: 360, capitalPlacement: 'left' },
    { key: 'italie', country: 'Italië', capital: 'Rome', french: 'Italie', x: 470, y: 474, capitalPlacement: 'left' },
    { key: 'belgie', country: 'België', capital: 'Brussel', french: 'Belgique', x: 350, y: 380, capitalPlacement: 'left' },
    { key: 'ierland', country: 'Ierland', capital: 'Dublin', french: 'Irlande', x: 220, y: 330, capitalPlacement: 'left' },
    { key: 'luxemburg', country: 'Luxemburg', capital: 'Luxemburg', french: 'Luxembourg', x: 385, y: 390, capitalPlacement: 'below' },
    { key: 'griekenland', country: 'Griekenland', capital: 'Athene', french: 'Grèce', x: 575, y: 510, capitalPlacement: 'below' },
    { key: 'malta', country: 'Malta', capital: 'Valletta', french: 'Malte', x: 422, y: 535, capitalPlacement: 'below' },
    { key: 'nederland', country: 'Nederland', capital: 'Amsterdam', french: 'Pays-Bas', x: 380, y: 358, capitalPlacement: 'left' }
];

const dropLayer = document.getElementById('dropLayer');
const countryBank = document.getElementById('countryBank');
const capitalBank = document.getElementById('capitalBank');
const placedCountElement = document.getElementById('placedCount');
const completedCountriesElement = document.getElementById('completedCountries');
const statusTextElement = document.getElementById('statusText');
const mapFeedbackElement = document.getElementById('mapFeedback');
const newMapGameButton = document.getElementById('newMapGameButton');

const state = {
    correctSlots: 0,
    completedCountries: 0,
    totalSlots: locations.length * 2
};

const MAP_W = 972;
const MAP_H = 673;
const CAPITAL_LEFT_OFFSET  = 50;   // séparation gauche en px (coordonnées carte)
const CAPITAL_BELOW_OFFSET = 55;   // séparation basse  en px (coordonnées carte)

function toPercent(value, total) {
    return `${(value / total) * 100}%`;
}

function shuffle(list) {
    const copy = [...list];

    for (let index = copy.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }

    return copy;
}

function setFeedback(message, type = '') {
    mapFeedbackElement.textContent = message;
    mapFeedbackElement.className = type ? `feedback ${type}` : 'feedback';
}

function updateScoreboard() {
    placedCountElement.textContent = `${state.correctSlots} / ${state.totalSlots}`;
    completedCountriesElement.textContent = `${state.completedCountries} / ${locations.length}`;

    if (state.correctSlots === state.totalSlots) {
        statusTextElement.textContent = 'Klaar';
    } else if (state.correctSlots === 0) {
        statusTextElement.textContent = 'Bezig';
    } else {
        statusTextElement.textContent = 'Goed bezig';
    }
}

function createChip(label, itemId, kind) {
    const chip = document.createElement('div');
    chip.className = 'drag-chip';
    chip.textContent = label;
    chip.draggable = true;
    chip.dataset.itemId = itemId;
    chip.dataset.kind = kind;

    chip.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', itemId);
        event.dataTransfer.effectAllowed = 'move';
        chip.classList.add('dragging');
    });

    chip.addEventListener('dragend', () => {
        chip.classList.remove('dragging');
    });

    return chip;
}

function renderBanks() {
    countryBank.innerHTML = '';
    capitalBank.innerHTML = '';

    const countryChips = shuffle(locations).map((location) =>
        createChip(location.country, `country-${location.key}`, 'country')
    );
    const capitalChips = shuffle(locations).map((location) =>
        createChip(location.capital, `capital-${location.key}`, 'capital')
    );

    countryChips.forEach((chip) => countryBank.appendChild(chip));
    capitalChips.forEach((chip) => capitalBank.appendChild(chip));
}

function updateCompletedState(pointElement) {
    const filledSlots = pointElement.querySelectorAll('.drop-slot.filled').length;

    if (filledSlots === 2 && pointElement.dataset.completed !== 'true') {
        pointElement.dataset.completed = 'true';
        pointElement.classList.add('completed');
        state.completedCountries += 1;
    }
}

function handleCorrectDrop(slot, chip) {
    const pinHead = slot.querySelector('.pin-head');
    if (pinHead) {
        pinHead.textContent = chip.textContent;
    }
    slot.classList.add('filled');
    slot.dataset.filled = 'true';
    chip.remove();

    // Masquer le pays, déverrouiller et afficher la capitale
    if (slot.classList.contains('country-slot')) {
        slot.style.display = 'none';
        const point = slot.closest('.map-point');
        const capitalSlot = point.querySelector('.capital-slot');
        if (capitalSlot) {
            capitalSlot.dataset.locked = 'false';
            capitalSlot.classList.remove('locked');
            capitalSlot.style.display = '';
            const head = capitalSlot.querySelector('.pin-head');
            if (head) head.textContent = 'Hofdstad';
        }
    }

    state.correctSlots += 1;
    updateCompletedState(slot.closest('.map-point'));
    updateScoreboard();

    if (state.correctSlots === state.totalSlots) {
        setFeedback('Fantastisch! Alle landen en hoofdsteden staan op de juiste plaats.', 'success');
    } else {
        setFeedback('Juist geplaatst! Ga verder met de kaart.', 'success');
    }
}

function bindDropSlot(slot) {
    slot.addEventListener('dragover', (event) => {
        if (slot.dataset.filled === 'true' || slot.dataset.locked === 'true') {
            return;
        }

        event.preventDefault();
        slot.classList.add('drag-over');
        event.dataTransfer.dropEffect = 'move';
    });

    slot.addEventListener('dragleave', () => {
        slot.classList.remove('drag-over');
    });

    slot.addEventListener('drop', (event) => {
        event.preventDefault();
        slot.classList.remove('drag-over');

        if (slot.dataset.filled === 'true' || slot.dataset.locked === 'true') {
            return;
        }

        const itemId = event.dataTransfer.getData('text/plain');
        const chip = document.querySelector(`[data-item-id="${itemId}"]`);

        if (!chip) {
            return;
        }

        if (itemId !== slot.dataset.accept) {
            setFeedback('Nog niet juist. Controleer land en hoofdstad nog eens.', 'error');
            return;
        }

        handleCorrectDrop(slot, chip);
    });
}

function createSlot(label, accept) {
    const slot = document.createElement('div');
    slot.className = 'drop-slot';
    slot.classList.add(accept.startsWith('capital') ? 'capital-slot' : 'country-slot');
    slot.dataset.accept = accept;
    slot.dataset.filled = 'false';
    slot.title = label;

    const pinHead = document.createElement('div');
    pinHead.className = 'pin-head';
    pinHead.textContent = accept.startsWith('capital') ? '🔒' : 'Land';

    const pinTail = document.createElement('div');
    pinTail.className = 'pin-tail';

    slot.appendChild(pinHead);
    slot.appendChild(pinTail);
    bindDropSlot(slot);
    return slot;
}

function renderDropPoints() {
    dropLayer.innerHTML = '';

    locations.forEach((location) => {
        const point = document.createElement('div');
        point.className = 'map-point';
        point.style.left = toPercent(location.x, MAP_W);
        point.style.top = toPercent(location.y, MAP_H);
        point.dataset.key = location.key;
        point.dataset.completed = 'false';
        point.dataset.capitalPlacement = location.capitalPlacement || 'below';

        const countrySlot = createSlot('Sleep hier het land', `country-${location.key}`);
        countrySlot.style.left = '0%';
        countrySlot.style.top  = '0%';

        const capitalSlot = createSlot('Sleep hier de hoofdstad', `capital-${location.key}`);
        capitalSlot.dataset.locked = 'true';
        capitalSlot.classList.add('locked');
        if (location.capitalPlacement === 'left') {
            capitalSlot.style.left = toPercent(-CAPITAL_LEFT_OFFSET, MAP_W);
            capitalSlot.style.top  = '0%';
        } else {
            capitalSlot.style.left = '0%';
            capitalSlot.style.top  = toPercent(CAPITAL_BELOW_OFFSET, MAP_H);
        }

        point.appendChild(countrySlot);
        point.appendChild(capitalSlot);
        dropLayer.appendChild(point);
    });
}

function restartMapGame() {
    state.correctSlots = 0;
    state.completedCountries = 0;
    renderBanks();
    renderDropPoints();
    updateScoreboard();
    setFeedback('Begin met slepen.', '');
}

newMapGameButton.addEventListener('click', restartMapGame);

restartMapGame();

// ── Grille de repérage des coordonnées ────────────────────────
const gridCanvas = document.getElementById('gridCanvas');
const gridCtx = gridCanvas.getContext('2d');
const coordDisplay = document.getElementById('coordDisplay');
const toggleGridBtn = document.getElementById('toggleGridBtn');
const mapStage = document.querySelector('.map-stage');

const GRID_W = MAP_W;
const GRID_H = MAP_H;
const GRID_MINOR = 50;
const GRID_MAJOR = 100;
const FOCUS_MIN_X = 150;
const FOCUS_MAX_X = 600;
const FOCUS_MIN_Y = 200;
const FOCUS_MAX_Y = 600;

function drawGrid() {
    gridCanvas.width = GRID_W;
    gridCanvas.height = GRID_H;
    gridCtx.clearRect(0, 0, GRID_W, GRID_H);

    // Lignes légères toutes les 50 px
    gridCtx.strokeStyle = 'rgba(50, 50, 200, 0.10)';
    gridCtx.lineWidth = 0.5;
    for (let x = 0; x <= GRID_W; x += GRID_MINOR) {
        gridCtx.beginPath(); gridCtx.moveTo(x, 0); gridCtx.lineTo(x, GRID_H); gridCtx.stroke();
    }
    for (let y = 0; y <= GRID_H; y += GRID_MINOR) {
        gridCtx.beginPath(); gridCtx.moveTo(0, y); gridCtx.lineTo(GRID_W, y); gridCtx.stroke();
    }

    // Lignes principales toutes les 100 px
    gridCtx.strokeStyle = 'rgba(50, 50, 200, 0.28)';
    gridCtx.lineWidth = 1;
    for (let x = 0; x <= GRID_W; x += GRID_MAJOR) {
        gridCtx.beginPath(); gridCtx.moveTo(x, 0); gridCtx.lineTo(x, GRID_H); gridCtx.stroke();
    }
    for (let y = 0; y <= GRID_H; y += GRID_MAJOR) {
        gridCtx.beginPath(); gridCtx.moveTo(0, y); gridCtx.lineTo(GRID_W, y); gridCtx.stroke();
    }

    // Zone demandée mise en évidence
    gridCtx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    gridCtx.fillRect(FOCUS_MIN_X, FOCUS_MIN_Y, FOCUS_MAX_X - FOCUS_MIN_X, FOCUS_MAX_Y - FOCUS_MIN_Y);
    gridCtx.strokeStyle = 'rgba(16, 16, 120, 0.9)';
    gridCtx.lineWidth = 2;
    gridCtx.strokeRect(FOCUS_MIN_X, FOCUS_MIN_Y, FOCUS_MAX_X - FOCUS_MIN_X, FOCUS_MAX_Y - FOCUS_MIN_Y);

    // Étiquettes de coordonnées
    gridCtx.fillStyle = 'rgba(20, 20, 160, 0.72)';
    gridCtx.font = 'bold 10px monospace';

    // Axe X (en haut)
    gridCtx.textAlign = 'center';
    gridCtx.textBaseline = 'top';
    const xStart = Math.ceil(FOCUS_MIN_X / GRID_MAJOR) * GRID_MAJOR;
    for (let x = xStart; x <= FOCUS_MAX_X; x += GRID_MAJOR) {
        // Fond blanc pour lisibilité
        gridCtx.fillStyle = 'rgba(255,255,255,0.75)';
        gridCtx.fillRect(x - 14, 1, 28, 12);
        gridCtx.fillStyle = 'rgba(20, 20, 160, 0.85)';
        gridCtx.fillText(x, x, 2);
    }

    // Axe Y (à gauche)
    gridCtx.textAlign = 'right';
    gridCtx.textBaseline = 'middle';
    const yStart = Math.ceil(FOCUS_MIN_Y / GRID_MAJOR) * GRID_MAJOR;
    for (let y = yStart; y <= FOCUS_MAX_Y; y += GRID_MAJOR) {
        gridCtx.fillStyle = 'rgba(255,255,255,0.75)';
        gridCtx.fillRect(1, y - 6, 26, 12);
        gridCtx.fillStyle = 'rgba(20, 20, 160, 0.85)';
        gridCtx.fillText(y, 26, y);
    }
}

let gridVisible = false;

toggleGridBtn.addEventListener('click', () => {
    gridVisible = !gridVisible;
    gridCanvas.style.display = gridVisible ? 'block' : 'none';
    coordDisplay.style.display = gridVisible ? 'block' : 'none';
    toggleGridBtn.classList.toggle('active', gridVisible);
    toggleGridBtn.textContent = gridVisible ? '📐 Verbergen' : '📐 Rooster';
    if (gridVisible) {
        drawGrid();
        coordDisplay.textContent = `x: — (150–600)\ny: — (200–600)`;
    }
});

mapStage.addEventListener('mousemove', (e) => {
    if (!gridVisible) return;
    const rect = mapStage.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;
    const relativeY = (e.clientY - rect.top) / rect.height;
    const x = Math.round(FOCUS_MIN_X + relativeX * (FOCUS_MAX_X - FOCUS_MIN_X));
    const y = Math.round(FOCUS_MIN_Y + relativeY * (FOCUS_MAX_Y - FOCUS_MIN_Y));
    const clampedX = Math.min(Math.max(x, FOCUS_MIN_X), FOCUS_MAX_X);
    const clampedY = Math.min(Math.max(y, FOCUS_MIN_Y), FOCUS_MAX_Y);
    coordDisplay.textContent = `x: ${clampedX} (150–600)\ny: ${clampedY} (200–600)`;
});

mapStage.addEventListener('mouseleave', () => {
    coordDisplay.textContent = 'x: — (150–600)\ny: — (200–600)';
});
