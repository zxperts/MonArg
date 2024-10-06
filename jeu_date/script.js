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
        }
    }

    function getDateForEvent(event) {
        const eventDates = {
            'Nieuwjaar': '1 Janvier',
            'Dag van de arbeid': '1 Mai',
            'WapenStilstand': '11 Novembre',
            'Kerstmis': '25 Décembre',
            'SinterKlaas': '6 Décembre',
            'Drie Koningen': '6 Janvier',
            'AprilVis': '1 Avril',
            'Feest van Maria': '15 Août',
            'Sint Valentijn': '14 Février',
            'Allerheiligen & AllerZielen': '1 Novembre',
            'Nationale Feestdag': '21 Juillet',
            'Moederdag': 'Deuxième dimanche de mai',
            'Eerste schooldag': '1er septembre',
            'Pasen': 'Date variable',
            'Vaderdag': 'Troisième dimanche de juin'
        };
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
        shuffleElements('events1');
        shuffleElements('dates');
        shuffleElements('dates1');
        toggleVisibility('hideAll', ['event12', 'event13', 'event14', 'event15', 'date12', 'date13', 'date14', 'date15']);

        const emojis = document.querySelectorAll('.emoji');
        emojis.forEach(emoji => {
            emoji.classList.toggle('hidden');
        });
    };

    let selectedCards = [];

        
    function handleCardClick(event) {
        const card = event.target;
        if (selectedCards.length < 2 && !card.classList.contains('matched')) {
            card.classList.add('selected');
            selectedCards.push(card);
            if (selectedCards.length === 2) {
                checkMatch();
            }
        }
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

        } else {
            notification.style.color ="red";
            notification.textContent = 'Mauvaise réponse, essayez encore.';
            card1.click();
            card2.classList.toggle('unscale')
            notification.classList.add('error');
        }
        setTimeout(() => {
            card1.classList.remove('selected');
            card2.classList.remove('selected');
            selectedCards = [];
            notification.textContent = '';
            notification.classList.remove('error');
        }, 1000);
    }

    function toggleEmojis(){
        const emojis = document.querySelectorAll('.emoji');
        emojis.forEach(emoji => {
            emoji.classList.toggle('hidden');
        });
    }

    


});
