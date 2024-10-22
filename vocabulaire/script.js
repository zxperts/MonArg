let totalAnswers = 0;
let goodAnswers = 0;
let badAnswers = 0;

document.addEventListener('DOMContentLoaded', () => {
    const events = document.querySelectorAll('.event');
    const dates = document.querySelectorAll('.date');

    events.forEach(event => {
        event.addEventListener('dragstart', dragStart);
    });

    dates.forEach(date => {
        date.addEventListener('dragover', dragOver);
        date.addEventListener('drop', drop);
    });

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
        if (e.target.dataset.date === getDateForEvent(eventName)) {
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

    const eventDates = {
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
    
    

    function generateDivs(eventDates) {
        const eventsContainer = document.getElementById('events');
        const datesContainer = document.getElementById('dates');

        let eventIndex = 1;
        for (const [event, date] of Object.entries(eventDates)) {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event';
            eventDiv.id = `event${eventIndex}`;
            eventDiv.draggable = true;
            eventDiv.dataset.event = event;
            eventDiv.innerText = event;
            eventsContainer.appendChild(eventDiv);

            const dateDiv = document.createElement('div');
            dateDiv.className = 'date';
            dateDiv.id = `date${eventIndex}`;
            dateDiv.dataset.date = date;
            dateDiv.innerText = date;
            datesContainer.appendChild(dateDiv);

            eventIndex++;
        }
    }

    // Appel de la fonction pour générer les divs
    generateDivs(eventDates);

    function getDateForEvent(event) {
        
        return eventDates[event];
    }

    function shuffleElements(containerId) {
        const container = document.getElementById(containerId);
        for (let i = container.children.length; i >= 0; i--) {
            container.appendChild(container.children[Math.random() * i | 0]);
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

    document.querySelectorAll('.event').forEach(item => {
        item.addEventListener('click', event => {
            event.target.classList.toggle('scale');
        });
        item.addEventListener('click', handleCardClick);
    });


    document.querySelectorAll('.date').forEach(item => {
        item.addEventListener('click', event => {
            event.target.classList.toggle('scale');
        });
        item.addEventListener('click', handleCardClick);
    });


    

    window.onload = function() {
        shuffleElements('events');
        //shuffleElements('events1');
        shuffleElements('dates');
        //shuffleElements('dates1');
        //toggleVisibility('hideAll', ['event12', 'event13', 'event14', 'event15', 'date12', 'date13', 'date14', 'date15']);

        const emojis = document.querySelectorAll('.emoji');
        emojis.forEach(emoji => {
            emoji.classList.toggle('hidden');
        });
    };

    let selectedCards = [];

        
    function handleCardClick(event) {

        //notification.style.color ="blue";
        //notification.textContent = 'OK';

        const card = event.target;
        if (selectedCards.length < 2 && !card.classList.contains('matched')) {
            card.classList.add('selected');
            selectedCards.push(card);
            if (selectedCards.length === 2) {
                checkMatch();
            }
        }

        setTimeout(() => {
            notification.classList.remove('error');
        }, 1000);
    }

    function checkMatch() {
        const [card1, card2] = selectedCards;
        if (getDateForEvent(card1.getAttribute('data-event')) === card2.getAttribute('data-date') ||
            getDateForEvent(card2.getAttribute('data-event')) === card1.getAttribute('data-date')
        ) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            notification.style.color ="green";
            notification.textContent = 'Bonne réponse !';
            notification.classList.remove('error');
            const emojis = document.querySelectorAll('.emoji');
            emojis.forEach(emoji => {
                emoji.classList.add('hidden');
            });

            goodAnswers++;

        } else {
            notification.style.color ="red";
            notification.textContent = 'Mauvaise réponse, essayez encore.';
            notification.classList.add('error');
            card1.classList.remove('selected');
            card2.classList.remove('selected');
            badAnswers++;


        }
        setTimeout(() => {
            card1.classList.toggle('unscale')
            card2.classList.toggle('unscale')
            selectedCards = [];
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

    


});
