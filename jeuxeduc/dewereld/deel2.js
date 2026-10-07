const landscapes = [
    {
        id: 'landelijk',
        name: 'Landelijk landschap',
        emoji: '🌳',
        items: ['veel natuur', 'bossen', 'weiden en akkers', 'dorpen']
    },
    {
        id: 'stedelijk',
        name: 'Stedelijk landschap',
        emoji: '🏙️',
        items: ['veel gebouwen', 'veel mensen', 'weinig natuur', "veel auto's"]
    },
    {
        id: 'industrieel',
        name: 'Industrieel landschap',
        emoji: '🏭',
        items: ['havens', 'fabrieken', 'verkeersknooppunten']
    },
    {
        id: 'toeristisch',
        name: 'Toeristisch landschap',
        emoji: '🏖️',
        items: ['skistation', 'strand', 'bergen', 'pretpark', 'museum']
    }
];

const allItems = landscapes.flatMap(l => l.items.map(text => ({ text, landscapeId: l.id })));

let score = 0;
let total = 0;
let streak = 0;
let queue = [];
let currentItem = null;
let isAnswered = false;
let placed = {};

const questionEl = document.getElementById('question');
const categoriesEl = document.getElementById('categories');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const remainingEl = document.getElementById('remaining');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const boardEl = document.getElementById('board');

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
    remainingEl.textContent = String(queue.length + (currentItem && !isAnswered ? 1 : 0));
}

function renderBoard() {
    boardEl.innerHTML = '';
    landscapes.forEach(l => {
        const col = document.createElement('div');
        col.className = 'board-col';

        const title = document.createElement('h3');
        title.textContent = `${l.emoji} ${l.name}`;
        col.appendChild(title);

        const list = document.createElement('ul');
        placed[l.id].forEach(text => {
            const li = document.createElement('li');
            li.textContent = text;
            list.appendChild(li);
        });
        col.appendChild(list);
        boardEl.appendChild(col);
    });
}

function renderCategories() {
    categoriesEl.innerHTML = '';
    landscapes.forEach((l, i) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'option-btn';
        button.dataset.id = l.id;
        button.dataset.key = String(i + 1);
        button.textContent = `${l.emoji} ${l.name}`;
        button.addEventListener('click', () => handleAnswer(l.id, button));
        categoriesEl.appendChild(button);
    });
}

function pickQuestion() {
    if (queue.length === 0) {
        currentItem = null;
        questionEl.textContent = `🏆 Bravo ! Score final : ${score}/${total}`;
        categoriesEl.innerHTML = '';
        feedbackEl.textContent = 'Cliquez sur « Recommencer » pour rejouer.';
        feedbackEl.className = 'feedback good';
        nextBtn.disabled = true;
        updateStats();
        return;
    }

    currentItem = queue.shift();
    isAnswered = false;
    questionEl.textContent = currentItem.text;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    nextBtn.disabled = true;

    renderCategories();
    updateStats();
}

function handleAnswer(chosenId, chosenBtn) {
    if (isAnswered) return;

    isAnswered = true;
    total += 1;

    const correct = landscapes.find(l => l.id === currentItem.landscapeId);
    categoriesEl.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.id === correct.id) {
            btn.classList.add('correct');
        }
    });

    if (chosenId === correct.id) {
        score += 1;
        streak += 1;
        feedbackEl.textContent = `✅ Bonne réponse ! « ${currentItem.text} » → ${correct.name}`;
        feedbackEl.className = 'feedback good';
    } else {
        streak = 0;
        chosenBtn.classList.add('wrong');
        feedbackEl.textContent = `❌ Mauvaise réponse. « ${currentItem.text} » → ${correct.name}`;
        feedbackEl.className = 'feedback bad';
    }

    placed[correct.id].push(currentItem.text);
    renderBoard();
    nextBtn.disabled = false;
    updateStats();
}

function restartGame() {
    score = 0;
    total = 0;
    streak = 0;
    queue = shuffleArray(allItems);
    currentItem = null;
    isAnswered = false;
    placed = Object.fromEntries(landscapes.map(l => [l.id, []]));
    renderBoard();
    pickQuestion();
}

document.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !nextBtn.disabled) {
        event.preventDefault();
        pickQuestion();
        return;
    }
    const target = categoriesEl.querySelector(`.option-btn[data-key="${event.key}"]`);
    if (target && !isAnswered) {
        target.click();
    }
});

nextBtn.addEventListener('click', pickQuestion);
restartBtn.addEventListener('click', restartGame);

restartGame();
