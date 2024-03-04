/* Ces lignes de code ajoutent des écouteurs d'événement aux champs de saisie avec les ID "InputAddCat"
et "InputAddTask". */
var input = document.getElementById("InputAddCat");
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("btnAddCat").click();
    }
});

var input = document.getElementById("InputAddTask");
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("btnAddTask").click();
    }
});

var input = document.getElementById("InputAddCat");
input.addEventListener("focus", function(event) {
    document.getElementById('favcolor').value=RandomLightenDarkenColor();
});

/*************************************************************************/

/**
 * La fonction configure la fonctionnalité de glisser-déposer 
 * pour les éléments avec des classes
 * spécifiques et attribue des catégories aux éléments déposés.
 */
function setDraggable() {    
    
    var dropTarget = document.querySelector(".drop-target");
    var draggables = document.querySelectorAll(".drag-task");
    var droppables = document.querySelectorAll(".drag-box");
    
    
    /* Configure la fonctionnalité de glisser-déposer pour les éléments avec la classe
    "drag-task". Il ajoute un écouteur d'événement à chacun de ces éléments afin que lorsqu'ils sont
    glissés, leur ID soit stocké dans l'objet de transfert de données "srcId". Cet ID peut ensuite
    être utilisé pour identifier l'élément lorsqu'il est déposé dans un nouvel emplacement. */
    draggables.forEach(item => {
        // console.log("Here: "+item.id+"-"+item.parentNode.id);
        item.addEventListener("dragstart", function(ev) {
            ev.dataTransfer.setData("srcId", ev.target.id);
        });
    })
    // The end destination, prevent browsers default drag and drop (disabling breaks feature)
    // because it's disabled by browsers by default
    dropTarget.addEventListener('dragover', function(ev) {
        ev.preventDefault();
    });
    // End destination where item is dropped into
    dropTarget.addEventListener('drop', function(ev) {
        ev.preventDefault();
        let target = ev.target;
        let droppable = target.classList.contains('drag-box');
        let srcId = ev.dataTransfer.getData("srcId");
        
        if (droppable) {
            ev.target.appendChild(document.getElementById(srcId));
            // console.log(target.innerText+' '+srcId);
            // console.log(srcId.parentNode+' '+srcId);
            listCategorie[srcId] = target.id;//Nouvelle assignation de la catégorie👌
            
            var x = document.getElementById("snackbar");
            var xText="👍"+target.id+'\n'+srcId;
            x.innerText =xText;
            x.className = "show";
            setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
        }
    });
    
}

/**
 * La fonction crée une nouvelle catégorie avec un nom et une couleur donnés et l'ajoute à une cible de
 * dépôt.
 */
function createCategorie(categorieName,dropTarget) {
    //alert("You must write something!",categorieName);
    
    var divv = document.createElement("div");
    divv.id=document.getElementById("InputAddCat").value||categorieName||"No Value";
    divv.className = 'drag-box';
    divv.innerHTML = document.getElementById("InputAddCat").value||categorieName+"&#9776"||"No Value";
    //divv.style.backgroundColor=document.getElementById("favcolor").value;
    divv.style.backgroundColor=RandomLightenDarkenColor();
    //   divv.style.opacity=0.1;
    //Ajouter la catégorie à un dropTarget
    document.getElementById(dropTarget||"dropBoxEditTransaction"||"dropTargetCat").appendChild(divv);    
    document.getElementById("InputAddCat").value = "";
    document.getElementById("favcolor").value = RandomLightenDarkenColor();

}


function createTask(taskName, boxName,dropTarget) {
    // alert("You must write something!");
    
    var divTask = document.createElement("div");
    divTask.id=document.getElementById("InputAddTask").value||taskName||"No Value";
    divTask.className = 'drag-task';
    divTask.innerHTML = document.getElementById("InputAddTask").value||taskName||"No Value";
    divTask.draggable="true";
    divTask.style.backgroundColor=RandomLightenDarkenColor();

    if (boxName=="dragBoxLibelle") {
        var VerticalCard = document.getElementById("VerticalCard");
        divTask.setAttribute("onclick", VerticalCard.getAttribute("onclick"));
    } 
    if (boxName=="CategorieSS") {
        var catVerticalCard = document.getElementById("catVerticalCard");
        divTask.setAttribute("onclick", catVerticalCard.getAttribute("onclick"));
    } 
    divTask.setAttribute('data-delete', 'true');
    document.getElementById("filre_param").style.visibility = "visible";

    /*Vérifie si un élément avec l'ID spécifié dans la variable `boxName` existe dans le document.
    S'il n'existe pas, il appelle la fonction `createCategorie` pour créer un nouvel élément*/
    if (!document.getElementById(boxName)){
        createCategorie(boxName,dropTarget);
    }

    document.getElementById(boxName).appendChild(divTask);
    setDraggable();

    document.getElementById("InputAddTask").value = "";
    document.getElementById("favColorTask").value = RandomLightenDarkenColor();
}

function removeTask(taskName) {
    document.getElementsByTagName.removeChild(taskName);
}

/**
 * La fonction génère une couleur aléatoire, puis l'assombrit d'une quantité fixe.
 */
function RandomLightenDarkenColorOld() {
    const col = "#"+((1<<24)*Math.random()|0).toString(16);
    const amt =-10;
    var num = parseInt(col, 16);
    var r = (num >> 16) + amt;
    var b = ((num >> 8) & 0x00FF) + amt;
    var g = (num & 0x0000FF) + amt;
    var newColor = g | (b << 8) | (r << 16);
    return newColor.toString(16);
}

/**
 * La fonction génère une couleur aléatoire et l'éclaircit ou l'assombrit d'une quantité spécifiée.
 */
function RandomLightenDarkenColor() {
    var col = "#"+((1<<24)*Math.random()|0).toString(16);
    var amt =150;    
    
    var usePound = false;
    if ( col[0] == "#" ) {
        col = col.slice(1);
        usePound = true;
    }
    
    var num = parseInt(col,16); 
    
    var r = (num >> 16) + amt;    
    if ( r > 255 ) r = 255;
    else if  (r < 0) r = 0;
    
    var b = ((num >> 8) & 0x00FF) + amt;
    if ( b > 255 ) b = 255;
    else if  (b < 0) b = 0;
    
    var g = (num & 0x0000FF) + amt;
    if ( g > 255 ) g = 255;
    else if  ( g < 0 ) g = 0;
    
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}

function generateAllTask(listOfCategorie,dropTarget) {

    var tempListOfCategorie=listOfCategorie;
    if (listOfCategorie == listCategorie && dropTarget=="dropTargetCat") {
        tempListOfCategorie=getSwapListCategorie(listOfCategorie||listCategorie);
    } 

    for (const [key, value] of Object.entries(tempListOfCategorie)) {
        console.log("-chartDataMonth-",chartDataMonth);
        createTask(key, value,dropTarget);
    }
}


/* La fonction permute les clés et les valeurs d'un objet et renvoie le nouvel objet. */
function getSwapListCategorie(listCategorie) { 
    // Create a new object with keys and values swapped
    //"ALIMENTATION" – "Pas de catégorie" --> <->
    const swappedListCategorie = {};
    for (const key in listCategorie) {
        swappedListCategorie[listCategorie[key]] = "CategorieSS";
    }
    return swappedListCategorie;
}