let totalAnswers = 0;
let goodAnswers = 0;
let badAnswers = 0;
let selectedCards = [];
let nbrShowed = 0;

const eventTrdFRs = {
    'Toets': 'Test',
    'Donderdag': 'Jeudi',
    'Vul - Vullen': 'Remplir',
    'Beginnen - Begint': 'Commencer',
    'Maart': 'Mars',
    'De': 'Le',
    'Gisteren': 'Hier',
    'In': 'Dans',
    'Van': 'De',
    'Mei': 'Mai',
    'Kalender - Kalenderjaar': 'Calendrier - Année calendaire',
    'Was': 'Était',
    'Jaar': 'Année',
    'Lente': 'Printemps',
    'Schrijf': 'Écrire',
    'Welk': 'Quel',
    'Dinsdag': 'Mardi',
    'Telt - Tellen': 'Compte - Compter',
    'Datum': 'Date',
    'Dag - Dagen': 'Jour - Jours',
    'Omcirkel': 'Entourer',
    'Weken': 'Semaines',
    'Op': 'Sur',
    'Vandaag': 'Aujourd\'hui',
    'Maanden': 'Mois',
    'Seizoenen - Seizoen': 'Saisons - Saison',
    'Andere': 'Autre',
    'Ben - Bent - Is - Zijn': 'Suis - Êtes - Est - Sont',
    'Eeuw': 'Siècle',
    'Manier': 'Manière',
    'Het': 'Le',
    'Semester': 'Semestre',
    'November': 'Novembre',
    'Schrikkeljaar': 'Année bissextile',
    'Juni': 'Juin',
    'Mergen': 'Mélanger',
    'Laatste': 'Dernier'
};

window.onload = function() {

    //generateDivs(eventTrdFRs);


    //initializeOrder('events');
    //restoreOrder('events');
    //initializeOrder('trdfrs');
    //showTop10Divs();
    //shuffleElements('trdfrs');
    //shuffleElements('events');
    //shuffleElements('trdfrs1');
    //toggleVisibility('hideAll', ['event12', 'event13', 'event14', 'event15', 'trdfr12', 'trdfr13', 'trdfr14', 'trdfr15']);

    

    const emojis = document.querySelectorAll('.emoji');
    emojis.forEach(emoji => {
        emoji.classList.toggle('hidden');
    });
};

document.addEventListener('DOMContentLoaded', () => {


    const events = document.querySelectorAll('.event');
    const trdfrs = document.querySelectorAll('.trdfr');

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.event);
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();
        const eventName = e.dataTransfer.getData('text/plain');
        const eventElement = document.querySelector(`[data-event="${eventName}"]`);
        if (e.target.dataset.trdfr === getTrdFRForEvent(eventName)) {
            e.target.classList.add('matched');
            eventElement.classList.add('matched');
            e.target.textContent = `${e.target.textContent} - ${eventName}`;

            const emojis = document.querySelectorAll('.emoji');
            emojis.forEach(emoji => {
                emoji.classList.add('hidden');
            });
            goodAnswers++;
        }
        else {badAnswers++;}

        totalAnswers=goodAnswers+badAnswers;
		document.getElementById("scoreBtn").textContent = `${goodAnswers}/${totalAnswers}`;
    }

    function generateDivs(eventTrdFRs) {
        const eventsContainer = document.getElementById('events');
        const trdfrsContainer = document.getElementById('trdfrs');

        let eventIndex = 1;
        for (const [event, trdfr] of Object.entries(eventTrdFRs)) {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event';
            eventDiv.id = `event${eventIndex}`;
            eventDiv.draggable = true;
            eventDiv.dataset.event = event;
            eventDiv.innerText = event;
            eventDiv.dataset.status = ''; // Initial status
            eventDiv.dataset.verdict = ''; // Initial verdict
            eventsContainer.appendChild(eventDiv);

            const trdfrDiv = document.createElement('div');
            trdfrDiv.className = 'trdfr';
            trdfrDiv.id = `trdfr${eventIndex}`;
            trdfrDiv.dataset.trdfr = trdfr;
            trdfrDiv.innerText = trdfr;
            trdfrDiv.dataset.status = ''; // Initial status
            trdfrDiv.dataset.verdict = ''; // Initial verdict
            trdfrsContainer.appendChild(trdfrDiv);

            eventIndex++;
        }
    }

    function getTrdFRForEvent(event) {        
        return eventTrdFRs[event];
    }

    // Initialiser l'ordre initial avant le mélange
    function initializeOrder(containerId) {
        const container = document.getElementById(containerId);
        container.dataset.initialOrder = JSON.stringify(Array.from(container.children).map(child => child.id));
    }

    function shuffleElements(containerId) {
        const container = document.getElementById(containerId);
        for (let i = container.children.length; i >= 0; i--) {
            container.appendChild(container.children[Math.random() * i | 0]);
        }
    }

    // Fonction pour rétablir l'ordre initial
    function restoreOrder(containerId) {
    const container = document.getElementById(containerId);
    const initialOrder = JSON.parse(container.dataset.initialOrder);
    const elements = Array.from(container.children);

    initialOrder.forEach(id => {
        const element = elements.find(el => el.id === id);
        if (element) {
            container.appendChild(element);
        }
    });
    }

    function showTop10Divs() {

        const eventsContainer = document.getElementById('events');
        const trdfrsContainer = document.getElementById('trdfrs');
        const eventDivs = eventsContainer.getElementsByClassName('event');
        const trdfrDivs = trdfrsContainer.getElementsByClassName('trdfr');
        let count = 0;
        let nbrtrdfrDivRestantDiv = 0;
        nbrShowed = 0;
    
        for (let i = 0; i < eventDivs.length; i++) {
            const eventDiv = eventDivs[i];
            const trdfrDiv = trdfrDivs[i]; 
    
            if (trdfrDiv.dataset.verdict === '') {nbrtrdfrDivRestantDiv++;}
            if (trdfrDiv.dataset.verdict != 'OK' && count < 8) {
                eventDiv.style.display = '';
                trdfrDiv.style.display = '';
                eventDiv.classList.remove('matched');
                trdfrDiv.classList.remove('matched');
                count++;
                nbrShowed++;
            } else {
                eventDiv.style.display = 'none';
                trdfrDiv.style.display = 'none';
            }
        }
        //alert(nbrtrdfrDivRestantDiv);
        var CaisseBtn = document.getElementById("CaisseBtn");
        CaisseBtn.textContent="📦".repeat( Math.floor(nbrtrdfrDivRestantDiv/8) );
        //alert('Event '  + ' trdfrDiv ' );
        if(nbrShowed==0) {
            notification2.textContent = '🏆Brovo. Jeux Terminé !🏆';
        }
    }
    

    function toggleVisibility(checkboxId, elementIds) {
        const checkbox = document.getElementById(checkboxId);
        checkbox.addEventListener('change', function() {
            elementIds.forEach(id => {
                const element = document.getElementById(id);
                if (checkbox.checked) {
                    element.style.display = "none";
                } else {
                    element.style.display = "block";
                }
            });
        });
    }

        
    function handleCardClick(event) {

        //notification.style.color ="blue";
        //notification.textContent = 'OK';
        

        const card = event.target;
        console.log(card.innerText);
        if (selectedCards.length < 2 && !card.classList.contains('matched')) {
            card.classList.add('selected');
            selectedCards.push(card);
            console.log('1 '+card.innerText);
            if (selectedCards.length === 2) {
                console.log(selectedCards.length +' '+ card.innerText);
                checkMatch();
            }
        }

        setTimeout(() => {
            notification.classList.remove('error');
        }, 1000);
    }

    function checkMatch() {
        const [card1, card2] = selectedCards;
        if (getTrdFRForEvent(card1.getAttribute('data-event')) === card2.getAttribute('data-trdfr') ||
            getTrdFRForEvent(card2.getAttribute('data-event')) === card1.getAttribute('data-trdfr')
        ) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            if (card1.dataset.verdict === 'KO') {
                card1.dataset.verdict = '';
            } else {
                card1.dataset.verdict = 'OK';
            }

            if (card2.dataset.verdict === 'KO') {
                card2.dataset.verdict = '';
            } else {
                card2.dataset.verdict = 'OK'; 
            }
            notification.style.color ="green";
            notification.textContent = 'Bonne réponse !';
            notification.classList.remove('error');
            const emojis = document.querySelectorAll('.emoji');
            emojis.forEach(emoji => {
                emoji.classList.add('hidden');
            });

            goodAnswers++;

            if (goodAnswers % nbrShowed === 0) { 
                restoreOrder('events');
                restoreOrder('trdfrs');
                showTop10Divs(); 
                shuffleElements('trdfrs');
            }

        } else {
            notification.style.color ="red";
            notification.textContent = 'Mauvaise réponse, essayez encore.';
            notification.classList.add('error');
            card1.classList.remove('selected');
            card2.classList.remove('selected');
            card1.dataset.verdict = 'KO';
            card2.dataset.verdict = 'KO';
            badAnswers++;


        }
        selectedCards = [];
        setTimeout(() => {
            card1.classList.toggle('unscale')
            card2.classList.toggle('unscale')
            notification.textContent = '';
            notification.classList.remove('error');
        }, 1500);

        totalAnswers=goodAnswers+badAnswers;
		document.getElementById("scoreBtn").textContent = `${goodAnswers}/${totalAnswers}`;
    }

    function toggleEmojis(){
        const emojis = document.querySelectorAll('.emoji');
        emojis.forEach(emoji => {
            emoji.classList.toggle('hidden');
        });
    }

    // Appel de la fonction pour générer les divs
    generateDivs(eventTrdFRs);

    document.querySelectorAll('.event').forEach(item => {
        item.addEventListener('click', event => {
            event.target.classList.toggle('scale');
        });
        item.addEventListener('click', handleCardClick);
    });

    document.querySelectorAll('.trdfr').forEach(item => {
        item.addEventListener('click', event => {
            event.target.classList.toggle('scale');
        });
        item.addEventListener('click', handleCardClick);
    });

    events.forEach(event => {
        event.addEventListener('dragstart', dragStart);
    });

    trdfrs.forEach(trdfr => {
        trdfr.addEventListener('dragover', dragOver);
        trdfr.addEventListener('drop', drop);
    });
    
    initializeOrder('events');
    //restoreOrder('events');
    initializeOrder('trdfrs');
    showTop10Divs();
    shuffleElements('trdfrs');
    //shuffleElements('events');

});
