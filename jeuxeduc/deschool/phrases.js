const schoolWords = [
    { nl: 'Kan je herhalen?', fr: 'Peux-tu répéter ?', emoji: '🔁' },
    { nl: 'Zwijgen, alstublieft!', fr: "Silence, s’il vous plaît !", emoji: '🤫' },
    { nl: 'Ik begrijp het niet.', fr: 'Je ne comprends pas.', emoji: '❓' },
    { nl: 'Ga zitten!', fr: 'Assieds-toi !', emoji: '🪑' },
    { nl: 'Kan je helpen?', fr: 'Peux-tu aider ?', emoji: '🤝' },
    { nl: 'Schrijf je naam op je papier!', fr: 'Écris ton nom sur ta feuille !', emoji: '✍️' },
    { nl: 'Mag het raam open?', fr: 'Peut-on ouvrir la fenêtre ?', emoji: '🪟' },
    { nl: 'Mag het raam toe?', fr: 'Peut-on fermer la fenêtre ?', emoji: '🪟' },
    { nl: 'Ik ben klaar!', fr: "J’ai terminé !", emoji: '✅' },
    { nl: 'Wat is … in het Nederlands?', fr: 'Comment dit-on … en néerlandais ?', emoji: '💬' },
    { nl: 'Kom naar het bord!', fr: 'Viens au tableau !', emoji: '👩‍🏫' },
    { nl: 'Maak deze oefening!', fr: 'Fais cet exercice !', emoji: '📝' },
    { nl: 'Neem je …?', fr: 'Prends-tu ton / ta / tes … ?', emoji: '🎒' },
    { nl: 'Mag ik naar het toilet gaan?', fr: 'Puis-je aller aux toilettes ?', emoji: '🚻' },
    { nl: 'Mag ik mijn potlood slijpen?', fr: 'Puis-je tailler mon crayon ?', emoji: '✏️' },
    { nl: 'Mag het licht aan?', fr: 'Peut-on allumer la lumière ?', emoji: '💡' },
    { nl: 'Mag het licht uit?', fr: 'Peut-on éteindre la lumière ?', emoji: '💡' }
];

function shuffleSchoolWords(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index--) {
        const other = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
    }
    return shuffled;
}