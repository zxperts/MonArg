const schoolWords = [
    { nl: 'de goudvis', fr: 'le poisson rouge', emoji: '\u{1F420}' },
    { nl: 'de inktvis', fr: 'le calmar', emoji: '\u{1F991}' },
    { nl: 'de zalm', fr: 'le saumon', emoji: '\u{1F41F}' },
    { nl: 'de oester', fr: "l'huître", emoji: '\u{1F9AA}' },
    { nl: 'de vink', fr: 'le pinson', emoji: '\u{1F426}' },
    { nl: 'de schildpad', fr: 'la tortue', emoji: '\u{1F422}' },
    { nl: 'de ijsbeer', fr: "l'ours polaire", emoji: '\u{1F43B}\u200D\u2744\uFE0F' },
    { nl: 'de gier', fr: 'le vautour', emoji: '\u{1FAB6}' },
    { nl: 'de karper', fr: 'la carpe', emoji: '\u{1F41F}' },
    { nl: 'de hagedis', fr: 'le lézard', emoji: '\u{1F98E}' },
    { nl: 'de haai', fr: 'le requin', emoji: '\u{1F988}' },
    { nl: 'de kwal', fr: 'la méduse', emoji: '\u{1FABC}' },
    { nl: 'de aap', fr: 'le singe', emoji: '\u{1F412}' },
    { nl: 'de slang', fr: 'le serpent', emoji: '\u{1F40D}' },
    { nl: 'de zee-egel', fr: "l'oursin", emoji: '\u{1F30A}' }
];

function shuffleSchoolWords(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index--) {
        const other = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
    }
    return shuffled;
}