const schoolWords = [
    { nl: 'de pennenzak', fr: 'la trousse', emoji: '👝' },
    { nl: 'de balpen', fr: 'le stylo à bille', emoji: '🖊️' },
    { nl: 'het potlood', fr: 'le crayon', emoji: '✏️' },
    { nl: 'het kleurpotlood', fr: 'le crayon de couleur', emoji: '✏️' },
    { nl: 'de lijm (de lijmstift)', fr: 'la colle (le bâton de colle)', emoji: '🧴' },
    { nl: 'de stiften', fr: 'les feutres', emoji: '🖍️' },
    { nl: 'de fluostift', fr: 'le surligneur', emoji: '🖍️' },
    { nl: 'de nietmachine', fr: "l’agrafeuse", emoji: '📎' },
    { nl: 'de perforator', fr: 'la perforatrice', emoji: '📄' },
    { nl: 'de schaar', fr: 'les ciseaux', emoji: '✂️' },
    { nl: 'de laptop', fr: "l’ordinateur portable", emoji: '💻' },
    { nl: 'de plakband', fr: 'le ruban adhésif', emoji: '🩹' },
    { nl: 'de prullenbak', fr: 'la poubelle', emoji: '🗑️' },
    { nl: 'de wastafel', fr: 'le lavabo', emoji: '🚰' },
    { nl: 'de schooltas', fr: 'le cartable', emoji: '🎒' },
    { nl: 'de potloodslijper', fr: 'le taille-crayon', emoji: '✏️' },
    { nl: 'de borstel', fr: 'la brosse', emoji: '🧹' },
    { nl: 'de klok', fr: "l’horloge", emoji: '🕒' },
    { nl: 'het penseel', fr: 'le pinceau', emoji: '🖌️' },
    { nl: 'de spons', fr: "l’éponge", emoji: '🧽' },
    { nl: 'zwemmen', fr: 'nager', emoji: '🏊' },
    { nl: 'turnen', fr: 'faire de la gymnastique', emoji: '🤸' },
    { nl: 'schrijven', fr: 'écrire', emoji: '✍️' },
    { nl: 'lezen', fr: 'lire', emoji: '📖' },
    { nl: 'tellen', fr: 'compter', emoji: '🔢' },
    { nl: 'de juf', fr: 'la maîtresse', emoji: '👩‍🏫' },
    { nl: 'de meester', fr: 'le maître', emoji: '👨‍🏫' },
    { nl: 'het vuilblik', fr: 'la pelle à poussière', emoji: '🧹' }
];

function shuffleSchoolWords(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index--) {
        const other = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
    }
    return shuffled;
}