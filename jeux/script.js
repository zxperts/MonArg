// Liste des calligraphies avec leurs lettres correspondantes
// const calligraphies = {
//     'Calligraphie 1': ['A', 'B', 'C', 'D'],
//     'Calligraphie 2': ['E', 'F', 'G', 'H'],
//     'Calligraphie 3': ['I', 'J', 'K', 'L'],
//     // Ajouter plus de calligraphies ici
//   };

// Sélection aléatoire d'une calligraphie et de la lettre correspondante
let selectedCalligraphy;
let selectedLetter;
let selectedOption;
let selectedAnswer;
let comptage;
let comptJuste;

// Fonction pour initialiser le jeu
function initGame() {
    comptJuste=0;
    comptage=0;

    // Sélection aléatoire d'une calligraphie
    //const calligraphyKeys = Object.keys(calligraphies);
    //const randomIndex = Math.floor(Math.random() * calligraphyKeys.length);
    //selectedCalligraphy = calligraphyKeys[randomIndex];
    
    // Sélection aléatoire d'une lettre dans la calligraphie choisie
    //const letters = calligraphies[selectedCalligraphy];
    //selectedLetter = letters[Math.floor(Math.random() * letters.length)];
    selectedLetter=generateSelectedLetter();
    document.querySelector('h1').textContent = 'Trouver la Lettre:'+selectedLetter;
    //alert('Trouver la Lettre:'+selectedLetter);
    
    // Réinitialisation des options
    const options = document.getElementsByClassName('option');
    for (let option of options) {
        option.addEventListener('click', selectOption);
        option.style.backgroundColor = '#4CAF50';
        option.classList.remove('selected');    
    }
    
    // Sélection de tous les éléments avec la classe "option"
    var optionButtons = document.querySelectorAll('.option');
    // Parcours de chaque bouton
    optionButtons.forEach(function(button) {
        // Génération d'une lettre aléatoire
        button.textContent = getRandomLetter();
        button.setAttribute('style', getRandomCalligraphy());
    });
    // Sélection aléatoire d'un index de bouton
    var randomIndex = Math.floor(Math.random() * optionButtons.length);
    // Mise à jour du texte du bouton sélectionné avec "Z"
    optionButtons[randomIndex].textContent =  randomUpcase(selectedLetter);
    
    //trouver combien de letrre son égale
    optionButtons.forEach(function(button) {
        if (button.textContent.toUpperCase() === selectedLetter.toUpperCase()) {
            // Incrémenter la variable de comptage
            comptage++;
        }
    });
    document.querySelector('h1').textContent+=' '+comptage+' fois!'
    
    
    // Affichage de la calligraphie à deviner
    const calligraphyElement = document.getElementById('calligraphy');
    calligraphyElement.innerText = selectedLetter;
    
}

// Fonction pour sélectionner une option
function selectOption(event) {
    const option = event.target;
    
    // Si l'option est déjà sélectionnée, la désélectionner
    if (option.classList.contains('selected')) {
        option.classList.remove('selected');
    } else {
        // Sinon, désélectionner toutes les autres options et sélectionner l'option actuelle
        const options = document.getElementsByClassName('option');
        for (let option of options) {
            option.classList.remove('selected');
        }
        //option.classList.add('selected');
    }
}

// Fonction pour vérifier la réponse
function checkAnswer(selectedAnswer,clickedOption) {
    
    // Vérifier si une option est sélectionnée
    if (selectedAnswer) {
        
        // Vérifier si la réponse est correcte
        if (selectedAnswer.toUpperCase() === selectedLetter.toUpperCase()) {
            comptJuste++;
            tempAlert(comptJuste+' Bonnne(s) réponse(s) 👏',1000);
            clickedOption.style.backgroundColor = '#ffcc00';

            scorePlusNbr=+scorePlusNbr
            scorePlus = document.getElementById('scorePlus');
            scorePlus.innerText = selectedLetter;

            if (comptage==comptJuste) {
                tempAlert('👏 Félicitations, vous avez tout trouvé!🎉',2000);
                // Réinitialiser le jeu
                initGame();
            }
        } else {
            clickedOption.classList.remove('selected');
            clickedOption.style.backgroundColor = '#4CAF50';
            tempAlert('😢Désolé, la réponse est incorrecte.😰 <br>'+ selectedAnswer +'❌'+selectedLetter,3000);
            return;
        }
        
    } else {
        alert('Veuillez sélectionner une option avant de vérifier.');
    }
}

// Initialiser le jeu au chargement de la page
window.addEventListener('DOMContentLoaded', initGame);

// Ajouter un gestionnaire d'événement au bouton de vérification
//const checkButton = document.getElementById('check');
//checkButton.addEventListener('click', checkAnswer);


// Récupérer tous les éléments avec la classe "option"
const optionElements = document.getElementsByClassName('option');

// Parcourir tous les éléments avec la classe "option"
for (let i = 0; i < optionElements.length; i++) {
    const option = optionElements[i];
    // Ajouter un gestionnaire d'événement à chaque option
    option.addEventListener('click', handleOptionClick);
}

// Fonction de gestionnaire d'événement pour les options
function handleOptionClick(event) {
    const clickedOption = event.target;
    clickedOption.style.backgroundColor = '#ffcc00';
    selectedAnswer=clickedOption.innerText;
    // Effectuer les actions nécessaires lorsque l'option est cliquée
    checkAnswer(selectedAnswer,clickedOption); // Appeler checkAnswer() ici
}

function generateSelectedLetter2(){
    const randomChar = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    selectedLetter = randomChar;
    if (Math.random() >= 0.5) {
        selectedLetter = randomChar.toUpperCase();
    }
    return selectedLetter;
}


function generateSelectedLetter() {
    //const letters = ['b','d', 'p', 't', 'q',];
    const letters = ['b','d',];
    const randomIndex = Math.floor(Math.random() * letters.length);
    
    selectedLetter = letters[randomIndex];
    if (Math.random() >= 0.5) {
        selectedLetter = selectedLetter.toUpperCase();
    }
    return selectedLetter;
}


function randomUpcase(letter){
    if (Math.random() >= 0.75) {
        console.log
        letter = letter.toUpperCase();
    }
    return letter;
}


function getRandomCalligraphy() {
    const calligraphies = [
        /*         '"Times New Roman", Times, serif',
        'Arial, Helvetica, sans-serif',
        '"Apple Chancery",cursive',
        '"Bradley Hand",cursive',
        '"Brush Script MT",cursive',
        '"Chalkduster",FANTASY',
        '"papyrus",cursive',
        '"Apple Chancery",CSS',
        '"Marker Felt",FANTASY',
        '"Comic Sans MS",cursive',
        '"Monaco",MONOSPACE', */
        'White_Dream',
        'Sweet_Romance',
        'Sunday_Gallery',
        'Starkville',
        'Saturday_August',
        'Samantha_Signature',
        'Autography',
        'Beautiful_Spring',
        'Bitcheese',
        'BlueSignature_PERSONAL_USE_ONLY',
        'Delight_Mother',
        'Delight_Sunset',
        'Rosaline_Signature',
        'RoyalWedding-Regular',
    ];
    
    var randomIndex = Math.floor(Math.random() * calligraphies.length);
    var selectedCalligraphy = calligraphies[randomIndex];
    //return `<span style="font-family: ${selectedCalligraphy}">${letter}</span>`;
    //alert(selectedCalligraphy);
    return 'font-family:'+ selectedCalligraphy;
}

// Fonction pour générer une lettre aléatoire
function getRandomLetter() {
    //var letters = 'dbpqt';
    var letters = 'db';
    var randomIndex = Math.floor(Math.random() * letters.length);
    return letters[randomIndex];
}


function tempAlert(msg,duration)
{
    var el = document.createElement("div");
    //el.setAttribute("style","position:absolute;top:40%;left:10%;background-color:white;");
    el.setAttribute("style", "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1.5); background-color: white;");
    el.innerHTML = msg;
    setTimeout(function(){
        el.parentNode.removeChild(el);
    },duration);
    document.body.appendChild(el);
}