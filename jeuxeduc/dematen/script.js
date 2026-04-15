/* ═══════════════════════════════════════════════════════════
   De maten – script.js
   Association game: measurement tools & concrete examples
   ═══════════════════════════════════════════════════════════ */

/* ── Game data ───────────────────────────────────────────── */
const LEVELS = {
    1: {
        subtitle: 'Associeer elk meetinstrument met de juiste soort meting.',
        /* category label → array of correct items */
        categories: {
            'Temperatuur': ['een thermometer'],
            'Tijd':        ['een kalender', 'een chronometer', 'een uurwerk'],
            'Prijs':       ['het geld'],
            'Inhoud':      ['een spuit', 'een maatbeker'],
            'Gewicht':     ['een weegschaal'],
            'Lengte':      ['een meetlat', 'een lintmeter']
        },
        translations: {
            'Temperatuur': 'Température',
            'Tijd': 'Temps',
            'Prijs': 'Prix',
            'Inhoud': 'Contenance',
            'Gewicht': 'Poids',
            'Lengte': 'Longueur',
            'een thermometer': 'un thermomètre',
            'een kalender': 'un calendrier',
            'een chronometer': 'un chronomètre',
            'een uurwerk': 'une horloge',
            'het geld': 'l\'argent',
            'een spuit': 'une seringue',
            'een maatbeker': 'un verre doseur',
            'een weegschaal': 'une balance',
            'een meetlat': 'une règle graduée',
            'een lintmeter': 'un mètre ruban'
        },
        /* No sub-groups for level 1 */
        groups: null
    },
    2: {
        subtitle: 'Associeer elke hoeveelheid met een concreet voorbeeld uit het dagelijkse leven.',
        categories: {
            /* Volume */
            '100 liter':   ['een bad'],
            '10 liter':    ['een emmer'],
            '1 liter':     ['een brik melk'],
            'deciliter':   ['een potje yoghurt'],
            'centiliter':  ['een eetlepel'],
            'milliliter':  ['een druppel'],
            /* Massa */
            'kilogram':    ['een pak bloem'],
            '100 gram':    ['een kleine appel'],
            '10 gram':     ['een pakje vanillesuiker'],
            'gram':        ['een vel papier'],
            /* Lengte */
            'kilometer':   ['een kwartier stappen'],
            '100 meter':   ['lengte voetbalveld'],
            '10 meter':    ['hoogte huis (3 verdieping.)'],
            '1 meter':     ['een grote step'],
            'decimeter':   ['afstand tussen ogen'],
            'centimeter':  ['breedte pink'],
            'millimeter':  ['dikte punt balpen']
        },
        translations: {
            '100 liter': '100 litres',
            '10 liter': '10 litres',
            '1 liter': '1 litre',
            'deciliter': 'décilitre',
            'centiliter': 'centilitre',
            'milliliter': 'millilitre',
            'kilogram': 'kilogramme',
            '100 gram': '100 grammes',
            '10 gram': '10 grammes',
            'gram': 'gramme',
            'kilometer': 'kilomètre',
            '100 meter': '100 mètres',
            '10 meter': '10 mètres',
            '1 meter': '1 mètre',
            'decimeter': 'décimètre',
            'centimeter': 'centimètre',
            'millimeter': 'millimètre',
            'een bad': 'une baignoire',
            'een emmer': 'un seau',
            'een brik melk': 'une brique de lait',
            'een potje yoghurt': 'un pot de yaourt',
            'een eetlepel': 'une cuillère à soupe',
            'een druppel': 'une goutte',
            'een pak bloem': 'un paquet de farine',
            'een kleine appel': 'une petite pomme',
            'een pakje vanillesuiker': 'un sachet de sucre vanillé',
            'een vel papier': 'une feuille de papier',
            'een kwartier stappen': '15 minutes de marche',
            'lengte voetbalveld': 'longueur d\'un terrain de football',
            'hoogte huis (3 verdieping.)': 'hauteur d\'une maison (3 étages)',
            'een grote step': 'une grande trottinette',
            'afstand tussen ogen': 'distance entre les yeux',
            'breedte pink': 'largeur du petit doigt',
            'dikte punt balpen': 'épaisseur de la pointe d\'un stylo-bille'
        },
        /* Visual group separators shown in the LEFT column */
        groups: [
            { label: 'Inhoud (liter)',   keys: ['100 liter','10 liter','1 liter','deciliter','centiliter','milliliter'] },
            { label: 'Gewicht (gram)',   keys: ['kilogram','100 gram','10 gram','gram'] },
            { label: 'Lengte (meter)',   keys: ['kilometer','100 meter','10 meter','1 meter','decimeter','centimeter','millimeter'] }
        ]
    }
};

/* ── State ───────────────────────────────────────────────── */
let currentLevel   = 1;
let selectedItem   = null;   // currently selected right-column card element
let matchedCount   = 0;
let totalItems     = 0;
let correctAnswers = 0;
let wrongAnswers   = 0;
let helpEnabled    = false;
let helpTooltipEl  = null;

/* ── Helpers ─────────────────────────────────────────────── */
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function updateScore() {
    const total = correctAnswers + wrongAnswers;
    document.getElementById('score-display').textContent =
        `${correctAnswers} / ${total}`;
}

function getFrenchTranslation(label) {
    const levelTranslations = LEVELS[currentLevel].translations || {};
    return levelTranslations[label] || '';
}

function ensureHelpTooltip() {
    if (!helpTooltipEl) {
        helpTooltipEl = document.getElementById('help-tooltip');
    }
    return helpTooltipEl;
}

function positionHelpTooltip(mouseX, mouseY) {
    const tooltip = ensureHelpTooltip();
    if (!tooltip) return;

    const margin = 14;
    const rect = tooltip.getBoundingClientRect();
    let left = mouseX + 16;
    let top = mouseY + 20;

    if (left + rect.width > window.innerWidth - margin) {
        left = Math.max(margin, mouseX - rect.width - 16);
    }

    if (top + rect.height > window.innerHeight - margin) {
        top = Math.max(margin, mouseY - rect.height - 16);
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
}

function showHelpTooltip(text, mouseX, mouseY) {
    const tooltip = ensureHelpTooltip();
    if (!tooltip || !text) return;

    tooltip.textContent = text;
    tooltip.classList.add('show');
    positionHelpTooltip(mouseX, mouseY);
}

function hideHelpTooltip() {
    const tooltip = ensureHelpTooltip();
    if (!tooltip) return;
    tooltip.classList.remove('show');
}

function onHelpMouseEnter(e) {
    if (!helpEnabled) return;
    const fr = e.currentTarget.dataset.fr;
    if (!fr) return;
    showHelpTooltip(fr, e.clientX, e.clientY);
}

function onHelpMouseMove(e) {
    if (!helpEnabled) return;
    const tooltip = ensureHelpTooltip();
    if (!tooltip || !tooltip.classList.contains('show')) return;
    positionHelpTooltip(e.clientX, e.clientY);
}

function onHelpMouseLeave() {
    hideHelpTooltip();
}

function setHelpTooltip(element, label) {
    const translation = getFrenchTranslation(label);
    element.dataset.fr = translation;

    if (!element.dataset.helpBound) {
        element.addEventListener('mouseenter', onHelpMouseEnter);
        element.addEventListener('mousemove', onHelpMouseMove);
        element.addEventListener('mouseleave', onHelpMouseLeave);
        element.dataset.helpBound = '1';
    }

    element.removeAttribute('title');
}

function applyHelpToAllCards() {
    document.querySelectorAll('[data-fr]').forEach((el) => {
        el.removeAttribute('title');
    });

    if (!helpEnabled) {
        hideHelpTooltip();
    }
}

function toggleHelp(enabled) {
    helpEnabled = enabled;
    applyHelpToAllCards();
}

/* Notification banner */
let notifTimer = null;
function notify(msg, type /* 'ok' | 'ko' */, ms = 1800) {
    const el = document.getElementById('notification');
    el.textContent = msg;
    el.className   = `show ${type}`;
    clearTimeout(notifTimer);
    notifTimer = setTimeout(() => { el.className = ''; }, ms);
}

/* ── Level loader ────────────────────────────────────────── */
function loadLevel(n) {
    currentLevel = n;

    /* Update level buttons */
    document.getElementById('btn-n1').classList.toggle('active', n === 1);
    document.getElementById('btn-n2').classList.toggle('active', n === 2);

    /* Update victory button visibility */
    const nextBtn = document.getElementById('btn-victory-next');
    nextBtn.style.display = (n === 1) ? '' : 'none';

    /* Subtitle */
    document.getElementById('subtitle').textContent = LEVELS[n].subtitle;

    resetGame();
}

/* ── Game builder ────────────────────────────────────────── */
function buildGame() {
    const level    = LEVELS[currentLevel];
    const catData  = level.categories;
    const catKeys  = Object.keys(catData);

    /* Collect all items and shuffle them */
    const allItems = [];
    catKeys.forEach(cat => catData[cat].forEach(item => allItems.push(item)));
    const shuffled = shuffle(allItems);
    totalItems     = allItems.length;
    matchedCount   = 0;

    /* ── Build LEFT column (categories) ─────────────────── */
    const catCol = document.getElementById('categories-col');
    catCol.innerHTML = '';

    if (level.groups) {
        /* Level 2: grouped layout */
        level.groups.forEach(group => {
            const sep = document.createElement('div');
            sep.className   = 'group-sep';
            sep.textContent = group.label;
            catCol.appendChild(sep);

            group.keys.forEach(cat => renderCategoryCard(catCol, cat, catData));
        });
    } else {
        /* Level 1: flat layout */
        catKeys.forEach(cat => renderCategoryCard(catCol, cat, catData));
    }

    /* ── Build RIGHT column (items pool) ─────────────────── */
    const itemsCol = document.getElementById('items-col');
    itemsCol.innerHTML = '';

    shuffled.forEach(item => {
        const card = document.createElement('div');
        card.className        = 'item-card';
        card.dataset.item     = item;
        card.textContent      = item;
        setHelpTooltip(card, item);
        card.addEventListener('click', onItemClick);
        itemsCol.appendChild(card);
    });
}

function renderCategoryCard(container, cat, catData) {
    const card = document.createElement('div');
    card.className      = 'category-card';
    card.dataset.cat    = cat;
    card.dataset.needed = catData[cat].length;
    card.dataset.found  = '0';
    card.innerHTML      = `<div class="cat-title">${cat}</div><div class="cat-items"></div>`;
    setHelpTooltip(card, cat);
    card.addEventListener('click', onCategoryClick);
    container.appendChild(card);
}

/* ── Interaction handlers ────────────────────────────────── */
function onItemClick(e) {
    const card = e.currentTarget;
    if (card.classList.contains('used')) return;

    /* Deselect previous */
    if (selectedItem && selectedItem !== card) {
        selectedItem.classList.remove('selected');
    }

    if (selectedItem === card) {
        /* Toggle off */
        card.classList.remove('selected');
        selectedItem = null;
    } else {
        card.classList.add('selected');
        selectedItem = card;
    }
}

function onCategoryClick(e) {
    if (!selectedItem) {
        notify('Kies eerst een item aan de rechterkant. 👉', 'ko', 1500);
        return;
    }

    const catCard  = e.currentTarget;
    if (catCard.classList.contains('complete')) return;

    const cat      = catCard.dataset.cat;
    const item     = selectedItem.dataset.item;
    const catData  = LEVELS[currentLevel].categories;
    const correct  = catData[cat].includes(item);

    if (correct) {
        /* ✅ Correct match */
        correctAnswers++;

        selectedItem.classList.remove('selected');
        selectedItem.classList.add('used');
        selectedItem = null;

        /* Add chip inside category */
        const chip = document.createElement('span');
        chip.className   = 'matched-chip';
        chip.textContent = item;
        setHelpTooltip(chip, item);
        catCard.querySelector('.cat-items').appendChild(chip);

        /* Check if category is complete */
        const found   = parseInt(catCard.dataset.found) + 1;
        catCard.dataset.found = found;
        if (found >= parseInt(catCard.dataset.needed)) {
            catCard.classList.add('complete');
        }

        matchedCount++;
        notify(`✅ Goed zo!`, 'ok');
    } else {
        /* ❌ Wrong match */
        wrongAnswers++;

        const wrongItemCard = selectedItem;
        wrongItemCard.classList.add('flash-wrong');
        catCard.classList.add('flash-error');

        setTimeout(() => {
            wrongItemCard.classList.remove('flash-wrong');
            catCard.classList.remove('flash-error');
        }, 500);

        notify(`❌ Probeer opnieuw!`, 'ko');
    }

    updateScore();

    /* Check game-over */
    if (matchedCount === totalItems) {
        setTimeout(showVictory, 600);
    }
}

/* ── Victory screen ──────────────────────────────────────── */
function showVictory() {
    const total = correctAnswers + wrongAnswers;
    const pct   = Math.round((correctAnswers / total) * 100);
    let   emoji = pct === 100 ? '🌟' : pct >= 75 ? '👍' : '💪';
    document.getElementById('victory-msg').textContent =
        `${emoji}  ${correctAnswers} goede antwoorden op ${total} pogingen (${pct}%).`;
    document.getElementById('victory').classList.add('show');
}

function goNextLevel() {
    document.getElementById('victory').classList.remove('show');
    loadLevel(2);
}

/* ── Reset ───────────────────────────────────────────────── */
function resetGame() {
    document.getElementById('victory').classList.remove('show');
    selectedItem   = null;
    correctAnswers = 0;
    wrongAnswers   = 0;
    matchedCount   = 0;
    updateScore();
    buildGame();
}

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    ensureHelpTooltip();
    loadLevel(1);
});
