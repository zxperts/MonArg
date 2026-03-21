// ── Données : 10 pays africains ──────────────────────────────
// Coordonnées sur la carte Africa_location_map.svg (660 × 721 px)
// capitalPlacement : 'left' | 'right' | 'below'
const locations = [
    // --- Vos 10 pays initiaux ---
    { key: 'maroc',        country: 'Maroc',        capital: 'Rabat',        x: 170, y: 100, capitalPlacement: 'right'  },
    { key: 'algerie',      country: 'Algérie',      capital: 'Alger',        x: 230, y: 150, capitalPlacement: 'right'  },
    { key: 'egypte',       country: 'Égypte',       capital: 'Le Caire',     x: 430, y: 150, capitalPlacement: 'left'   },
    { key: 'nigeria',      country: 'Nigeria',      capital: 'Abuja',        x: 270, y: 290, capitalPlacement: 'left'   },
    { key: 'ethiopie',     country: 'Éthiopie',     capital: 'Addis-Abeba', x: 520, y: 290, capitalPlacement: 'left'   },
    { key: 'kenya',        country: 'Kenya',        capital: 'Nairobi',      x: 525, y: 370, capitalPlacement: 'left'   },
    { key: 'ghana',        country: 'Ghana',        capital: 'Accra',        x: 190, y: 300, capitalPlacement: 'right'  },
    { key: 'angola',       country: 'Angola',       capital: 'Luanda',       x: 338, y: 485, capitalPlacement: 'left'   },
    { key: 'tanzanie',     country: 'Tanzanie',     capital: 'Dodoma',       x: 498, y: 435, capitalPlacement: 'left'   },
    { key: 'afriquedusud', country: 'Afrique du Sud', capital: 'Pretoria',  x: 408, y: 630, capitalPlacement: 'left'   },

    // --- Afrique du Nord ---
    { key: 'tunisie',      country: 'Tunisie',      capital: 'Tunis',        x: 280, y: 70,  capitalPlacement: 'right'  },
    { key: 'libye',        country: 'Libye',        capital: 'Tripoli',      x: 330, y: 120, capitalPlacement: 'right'  },

    // --- Afrique de l'Ouest ---
    { key: 'mauritanie',   country: 'Mauritanie',   capital: 'Nouakchott',   x: 100, y: 180, capitalPlacement: 'right'  },
    { key: 'senegal',      country: 'Sénégal',      capital: 'Dakar',        x: 60,  y: 230, capitalPlacement: 'left'   },
    { key: 'mali',         country: 'Mali',         capital: 'Bamako',       x: 160, y: 220, capitalPlacement: 'right'  },
    { key: 'niger',        country: 'Niger',        capital: 'Niamey',       x: 250, y: 210, capitalPlacement: 'right'  },
    { key: 'tchad',        country: 'Tchad',        capital: 'N\'Djaména',   x: 350, y: 230, capitalPlacement: 'right'  },
    { key: 'gambie',       country: 'Gambie',       capital: 'Banjul',       x: 55,  y: 245, capitalPlacement: 'left'   },
    { key: 'guineebissau', country: 'Guinée-Bissau', capital: 'Bissau',       x: 65,  y: 265, capitalPlacement: 'left'   },
    { key: 'guinee',       country: 'Guinée',       capital: 'Conakry',      x: 80,  y: 285, capitalPlacement: 'right'  },
    { key: 'sierraleone',  country: 'Sierra Leone', capital: 'Freetown',     x: 95,  y: 310, capitalPlacement: 'right'  },
    { key: 'liberia',      country: 'Libéria',      capital: 'Monrovia',     x: 120, y: 330, capitalPlacement: 'right'  },
    { key: 'cotedivoire',  country: 'Côte d\'Ivoire', capital: 'Yamoussoukro', x: 160, y: 315, capitalPlacement: 'right'  },
    { key: 'burkinafaso',  country: 'Burkina Faso', capital: 'Ouagadougou',  x: 200, y: 245, capitalPlacement: 'right'  },
    { key: 'togo',         country: 'Togo',         capital: 'Lomé',         x: 215, y: 320, capitalPlacement: 'right'  },
    { key: 'benin',        country: 'Bénin',        capital: 'Porto-Novo',   x: 235, y: 315, capitalPlacement: 'right'  },
    { key: 'capvert',      country: 'Cap-Vert',     capital: 'Praia',        x: 20,  y: 220, capitalPlacement: 'left'   },

    // --- Afrique Centrale ---
    { key: 'cameroun',     country: 'Cameroun',     capital: 'Yaoundé',      x: 300, y: 340, capitalPlacement: 'right'  },
    { key: 'centrafrique', country: 'Rép. Centrafricaine', capital: 'Bangui', x: 380, y: 310, capitalPlacement: 'right'  },
    { key: 'gabon',        country: 'Gabon',        capital: 'Libreville',   x: 280, y: 385, capitalPlacement: 'left'   },
    { key: 'congo',        country: 'Congo-Brazza', capital: 'Brazzaville', x: 320, y: 410, capitalPlacement: 'left'   },
    { key: 'rdcongo',      country: 'RD Congo',     capital: 'Kinshasa',     x: 370, y: 420, capitalPlacement: 'right'  },
    { key: 'guineeequat',  country: 'Guinée Équat.', capital: 'Malabo',       x: 275, y: 360, capitalPlacement: 'left'   },
    { key: 'saotome',      country: 'S. Tomé-et-P.', capital: 'São Tomé',     x: 250, y: 380, capitalPlacement: 'left'   },

    // --- Afrique de l'Est ---
    { key: 'soudan',       country: 'Soudan',       capital: 'Khartoum',     x: 430, y: 220, capitalPlacement: 'right'  },
    { key: 'soudansud',    country: 'Soudan du Sud', capital: 'Djouba',       x: 445, y: 310, capitalPlacement: 'right'  },
    { key: 'erythree',     country: 'Érythrée',     capital: 'Asmara',       x: 500, y: 215, capitalPlacement: 'right'  },
    { key: 'djibouti',     country: 'Djibouti',     capital: 'Djibouti',     x: 545, y: 255, capitalPlacement: 'right'  },
    { key: 'somalie',      country: 'Somalie',      capital: 'Mogadiscio',   x: 580, y: 320, capitalPlacement: 'left'   },
    { key: 'ouganda',      country: 'Ouganda',      capital: 'Kampala',      x: 480, y: 350, capitalPlacement: 'right'  },
    { key: 'rwanda',       country: 'Rwanda',       capital: 'Kigali',       x: 470, y: 380, capitalPlacement: 'left'   },
    { key: 'burundi',      country: 'Burundi',      capital: 'Gitega',       x: 470, y: 400, capitalPlacement: 'left'   },

    // --- Afrique Australe et Océan Indien ---
    { key: 'namibie',      country: 'Namibie',      capital: 'Windhoek',     x: 340, y: 580, capitalPlacement: 'right'  },
    { key: 'botswana',     country: 'Botswana',     capital: 'Gaborone',     x: 400, y: 580, capitalPlacement: 'right'  },
    { key: 'zimbabwe',     country: 'Zimbabwe',     capital: 'Harare',       x: 455, y: 550, capitalPlacement: 'right'  },
    { key: 'zambie',       country: 'Zambie',       capital: 'Lusaka',       x: 430, y: 500, capitalPlacement: 'right'  },
    { key: 'malawi',       country: 'Malawi',       capital: 'Lilongwe',     x: 480, y: 500, capitalPlacement: 'right'  },
    { key: 'mozambique',   country: 'Mozambique',   capital: 'Maputo',       x: 485, y: 580, capitalPlacement: 'left'   },
    { key: 'lesotho',      country: 'Lesotho',      capital: 'Maseru',       x: 430, y: 665, capitalPlacement: 'right'  },
    { key: 'eswatini',     country: 'Eswatini',     capital: 'Mbabane',      x: 460, y: 640, capitalPlacement: 'right'  },
    { key: 'madagascar',   country: 'Madagascar',   capital: 'Antananarivo', x: 570, y: 550, capitalPlacement: 'right'  },
    { key: 'maurice',      country: 'Maurice',      capital: 'Port-Louis',   x: 640, y: 580, capitalPlacement: 'right'  },
    { key: 'seychelles',   country: 'Seychelles',   capital: 'Victoria',     x: 630, y: 400, capitalPlacement: 'right'  },
    { key: 'comores',      country: 'Comores',      capital: 'Moroni',       x: 540, y: 480, capitalPlacement: 'right'  }
];


// ── Références DOM ────────────────────────────────────────────
const dropLayer              = document.getElementById('dropLayer');
const countryBank            = document.getElementById('countryBank');
const capitalBank            = document.getElementById('capitalBank');
const placedCountEl          = document.getElementById('placedCount');
const completedCountriesEl   = document.getElementById('completedCountries');
const statusTextEl           = document.getElementById('statusText');
const feedbackEl             = document.getElementById('feedback');
const newGameButton          = document.getElementById('newGameButton');

// ── État ──────────────────────────────────────────────────────
const state = {
    correctSlots: 0,
    completedCountries: 0,
    totalSlots: locations.length * 2
};

let selectedChip = null;

function selectChip(chip) {
    if (selectedChip) selectedChip.classList.remove('selected');
    selectedChip = chip;
    if (chip) chip.classList.add('selected');
}

function clearSelection() {
    if (selectedChip) selectedChip.classList.remove('selected');
    selectedChip = null;
}

// ── Constantes carte ──────────────────────────────────────────
const MAP_W = 660;
const MAP_H = 721;
const CAPITAL_SIDE_OFFSET  = 50;  // décalage gauche/droite en px carte
const CAPITAL_BELOW_OFFSET = 55;  // décalage bas en px carte

function toPercent(value, total) {
    return `${(value / total) * 100}%`;
}

// ── Utilitaires ───────────────────────────────────────────────
function shuffle(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function setFeedback(message, type = '') {
    feedbackEl.textContent = message;
    feedbackEl.className = type ? `feedback ${type}` : 'feedback';
}

function updateScoreboard() {
    placedCountEl.textContent         = `${state.correctSlots} / ${state.totalSlots}`;
    completedCountriesEl.textContent  = `${state.completedCountries} / ${locations.length}`;

    if (state.correctSlots === state.totalSlots) {
        statusTextEl.textContent = 'Terminé 🎉';
    } else if (state.correctSlots === 0) {
        statusTextEl.textContent = 'En cours';
    } else {
        statusTextEl.textContent = 'Bien parti !';
    }
}

// ── Chips ─────────────────────────────────────────────────────
function createChip(label, itemId, kind) {
    const chip = document.createElement('div');
    chip.className = 'drag-chip';
    chip.textContent = label;
    chip.draggable = true;
    chip.dataset.itemId = itemId;
    chip.dataset.kind = kind;

    chip.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', itemId);
        e.dataTransfer.effectAllowed = 'move';
        chip.classList.add('dragging');
        clearSelection();
    });

    chip.addEventListener('dragend', () => {
        chip.classList.remove('dragging');
    });

    chip.addEventListener('click', () => {
        if (selectedChip === chip) {
            clearSelection();
        } else {
            selectChip(chip);
            setFeedback(`« ${chip.textContent} » sélectionné. Clique sur la punaise correspondante.`, '');
        }
    });

    return chip;
}

function renderBanks() {
    countryBank.innerHTML = '';
    capitalBank.innerHTML = '';

    shuffle(locations).forEach((loc) =>
        countryBank.appendChild(createChip(loc.country, `country-${loc.key}`, 'country'))
    );
    shuffle(locations).forEach((loc) =>
        capitalBank.appendChild(createChip(loc.capital, `capital-${loc.key}`, 'capital'))
    );
}

// ── Logique de dépôt ─────────────────────────────────────────
function updateCompletedState(pointEl) {
    const filled = pointEl.querySelectorAll('.drop-slot.filled').length;
    if (filled === 2 && pointEl.dataset.completed !== 'true') {
        pointEl.dataset.completed = 'true';
        pointEl.classList.add('completed');
        state.completedCountries += 1;
    }
}

function handleCorrectDrop(slot, chip) {
    const pinHead = slot.querySelector('.pin-head');
    if (pinHead) pinHead.textContent = chip.textContent;
    slot.classList.add('filled');
    slot.dataset.filled = 'true';
    chip.remove();

    // Dès que le pays est posé, masquer sa punaise et afficher celle de la capitale
    if (slot.classList.contains('country-slot')) {
        slot.style.display = 'none';
        const point = slot.closest('.map-point');
        const capitalSlot = point.querySelector('.capital-slot');
        if (capitalSlot) {
            capitalSlot.dataset.locked = 'false';
            capitalSlot.classList.remove('locked');
            capitalSlot.style.display = '';
            const head = capitalSlot.querySelector('.pin-head');
            if (head) head.textContent = 'Cap.';
        }
    }

    state.correctSlots += 1;
    updateCompletedState(slot.closest('.map-point'));
    updateScoreboard();

    if (state.correctSlots === state.totalSlots) {
        setFeedback('Bravo ! Tous les pays et capitales sont bien placés.', 'success');
    } else {
        setFeedback('Correct ! Continue.', 'success');
    }
}

// ── Liaison d'un slot ─────────────────────────────────────────
function bindSlot(slot) {
    // Clic sur la punaise (mode sélection)
    slot.addEventListener('click', () => {
        if (slot.dataset.filled === 'true' || slot.dataset.locked === 'true') return;
        if (!selectedChip) {
            if (slot.classList.contains('country-slot')) {
                const countryKey = slot.dataset.accept.replace('country-', '');
                const countryData = locations.find((loc) => loc.key === countryKey);
                const head = slot.querySelector('.pin-head');
                if (countryData && head) {
                    head.textContent = countryData.country;
                }
            }
            setFeedback('Sélectionne d\'abord une carte dans la liste.', '');
            return;
        }
        const itemId = selectedChip.dataset.itemId;
        if (itemId !== slot.dataset.accept) {
            setFeedback('Ce n\'est pas le bon emplacement. Réessaie.', 'error');
            clearSelection();
            return;
        }
        const chip = selectedChip;
        clearSelection();
        handleCorrectDrop(slot, chip);
    });

    // Drag-over
    slot.addEventListener('dragover', (e) => {
        if (slot.dataset.filled === 'true' || slot.dataset.locked === 'true') return;
        e.preventDefault();
        slot.classList.add('drag-over');
        e.dataTransfer.dropEffect = 'move';
    });

    slot.addEventListener('dragleave', () => {
        slot.classList.remove('drag-over');
    });

    // Drop
    slot.addEventListener('drop', (e) => {
        e.preventDefault();
        slot.classList.remove('drag-over');
        if (slot.dataset.filled === 'true' || slot.dataset.locked === 'true') return;

        const itemId = e.dataTransfer.getData('text/plain');
        const chip = document.querySelector(`[data-item-id="${itemId}"]`);
        if (!chip) return;

        if (itemId !== slot.dataset.accept) {
            setFeedback('Ce n\'est pas le bon emplacement. Réessaie.', 'error');
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
    pinHead.textContent = accept.startsWith('capital') ? '🔒' : 'Pays';

    const pinTail = document.createElement('div');
    pinTail.className = 'pin-tail';

    slot.appendChild(pinHead);
    slot.appendChild(pinTail);
    bindSlot(slot);
    return slot;
}

// ── Rendu des points de dépôt ─────────────────────────────────
function renderDropPoints() {
    dropLayer.innerHTML = '';

    locations.forEach((loc) => {
        const point = document.createElement('div');
        point.className = 'map-point';
        point.style.left = toPercent(loc.x, MAP_W);
        point.style.top  = toPercent(loc.y, MAP_H);
        point.dataset.key = loc.key;
        point.dataset.completed = 'false';

        // Punaise pays
        const countrySlot = createSlot('Glisse le pays ici', `country-${loc.key}`);
        countrySlot.style.left = '0%';
        countrySlot.style.top  = '0%';

        // Punaise capitale (verrouillée au départ)
        const capitalSlot = createSlot('Glisse la capitale ici', `capital-${loc.key}`);
        capitalSlot.dataset.locked = 'true';
        capitalSlot.classList.add('locked');

        if (loc.capitalPlacement === 'left') {
            capitalSlot.style.left = toPercent(-CAPITAL_SIDE_OFFSET, MAP_W);
            capitalSlot.style.top  = '0%';
        } else if (loc.capitalPlacement === 'right') {
            capitalSlot.style.left = toPercent(CAPITAL_SIDE_OFFSET, MAP_W);
            capitalSlot.style.top  = '0%';
        } else {
            // below
            capitalSlot.style.left = '0%';
            capitalSlot.style.top  = toPercent(CAPITAL_BELOW_OFFSET, MAP_H);
        }

        point.appendChild(countrySlot);
        point.appendChild(capitalSlot);
        dropLayer.appendChild(point);
    });
}

// ── Nouvelle partie ───────────────────────────────────────────
function startGame() {
    state.correctSlots = 0;
    state.completedCountries = 0;
    clearSelection();
    renderBanks();
    renderDropPoints();
    updateScoreboard();
    setFeedback('Commence à glisser les pays sur la carte.', '');
}

newGameButton.addEventListener('click', startGame);
startGame();

// ── Grille de repérage ────────────────────────────────────────
const gridCanvas    = document.getElementById('gridCanvas');
const gridCtx       = gridCanvas.getContext('2d');
const coordDisplay  = document.getElementById('coordDisplay');
const toggleGridBtn = document.getElementById('toggleGridBtn');
const mapStage      = document.querySelector('.map-stage');

const GRID_W     = MAP_W;
const GRID_H     = MAP_H;
const GRID_MINOR = 50;
const GRID_MAJOR = 100;

function drawGrid() {
    gridCanvas.width  = GRID_W;
    gridCanvas.height = GRID_H;
    gridCtx.clearRect(0, 0, GRID_W, GRID_H);

    // Lignes légères (50 px)
    gridCtx.strokeStyle = 'rgba(50, 50, 200, 0.10)';
    gridCtx.lineWidth   = 0.5;
    for (let x = 0; x <= GRID_W; x += GRID_MINOR) {
        gridCtx.beginPath(); gridCtx.moveTo(x, 0); gridCtx.lineTo(x, GRID_H); gridCtx.stroke();
    }
    for (let y = 0; y <= GRID_H; y += GRID_MINOR) {
        gridCtx.beginPath(); gridCtx.moveTo(0, y); gridCtx.lineTo(GRID_W, y); gridCtx.stroke();
    }

    // Lignes principales (100 px)
    gridCtx.strokeStyle = 'rgba(50, 50, 200, 0.28)';
    gridCtx.lineWidth   = 1;
    for (let x = 0; x <= GRID_W; x += GRID_MAJOR) {
        gridCtx.beginPath(); gridCtx.moveTo(x, 0); gridCtx.lineTo(x, GRID_H); gridCtx.stroke();
    }
    for (let y = 0; y <= GRID_H; y += GRID_MAJOR) {
        gridCtx.beginPath(); gridCtx.moveTo(0, y); gridCtx.lineTo(GRID_W, y); gridCtx.stroke();
    }

    // Étiquettes axe X
    gridCtx.textAlign    = 'center';
    gridCtx.textBaseline = 'top';
    gridCtx.font         = 'bold 10px monospace';
    for (let x = GRID_MAJOR; x < GRID_W; x += GRID_MAJOR) {
        gridCtx.fillStyle = 'rgba(255,255,255,0.75)';
        gridCtx.fillRect(x - 14, 1, 28, 12);
        gridCtx.fillStyle = 'rgba(20, 20, 160, 0.85)';
        gridCtx.fillText(x, x, 2);
    }

    // Étiquettes axe Y
    gridCtx.textAlign    = 'right';
    gridCtx.textBaseline = 'middle';
    for (let y = GRID_MAJOR; y < GRID_H; y += GRID_MAJOR) {
        gridCtx.fillStyle = 'rgba(255,255,255,0.75)';
        gridCtx.fillRect(1, y - 6, 26, 12);
        gridCtx.fillStyle = 'rgba(20, 20, 160, 0.85)';
        gridCtx.fillText(y, 26, y);
    }
}

let gridVisible = false;

toggleGridBtn.addEventListener('click', () => {
    gridVisible = !gridVisible;
    gridCanvas.style.display    = gridVisible ? 'block' : 'none';
    coordDisplay.style.display  = gridVisible ? 'block' : 'none';
    toggleGridBtn.classList.toggle('active', gridVisible);
    toggleGridBtn.textContent = gridVisible ? '📐 Masquer' : '📐 Grille';
    if (gridVisible) {
        drawGrid();
        coordDisplay.textContent = 'x: —\ny: —';
    }
});

mapStage.addEventListener('mousemove', (e) => {
    if (!gridVisible) return;
    const rect = mapStage.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) / rect.width  * GRID_W);
    const y = Math.round((e.clientY - rect.top)  / rect.height * GRID_H);
    coordDisplay.textContent = `x: ${x}\ny: ${y}`;
});

mapStage.addEventListener('mouseleave', () => {
    if (gridVisible) coordDisplay.textContent = 'x: —\ny: —';
});
