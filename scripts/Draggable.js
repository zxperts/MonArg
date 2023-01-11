
function setDraggable() {    
    // Tells the other side what data is being passed (e.g. the ID is targeted)
    var dropTarget = document.querySelector(".drop-target");
    var draggables = document.querySelectorAll(".drag-task");
    var droppables = document.querySelectorAll(".drag-box");
    
    // Tells the other side what data is being passed (e.g. the ID is targeted)
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


// Create a new list item when clicking on the "Add" butto
function createCategorie(categorieName) {
    // alert("You must write something!");
    
    var divv = document.createElement("div");
    divv.id=document.getElementById("InputAddCat").value||categorieName||"No Value";
    divv.className = 'drag-box';
    divv.innerHTML = document.getElementById("InputAddCat").value||categorieName+"&#9776"||"No Value";
    divv.style.backgroundColor=document.getElementById("favcolor").value;
    //   divv.style.opacity=0.1;
    document.getElementById("drop-target").appendChild(divv);
    
    document.getElementById("InputAddCat").value = "";
    document.getElementById("favcolor").value = RandomLightenDarkenColor();

}

function createTask(taskName, boxName) {
    // alert("You must write something!");
    
    var divTask = document.createElement("div");
    divTask.id=document.getElementById("InputAddTask").value||taskName||"No Value";
    divTask.className = 'drag-task';
    divTask.innerHTML = document.getElementById("InputAddTask").value||taskName||"No Value";
    divTask.draggable="true";
    divTask.style.backgroundColor=document.getElementById("favColorTask").value;
    // var boxName=listCategorie[taskName]||"Pas de catégorie";
    // var boxName="Pas de catégorie";
    // console.log(boxName);
    document.getElementById("filre_param").style.visibility = "visible";

    if (!document.getElementById(boxName)){
        createCategorie(boxName);
    }

    document.getElementById(boxName).appendChild(divTask);
    setDraggable();

    document.getElementById("InputAddTask").value = "";
    document.getElementById("favColorTask").value = RandomLightenDarkenColor();
    //console.log(" :",taskName,"-", boxName);
}

function removeTask(taskName) {
    document.getElementsByTagName.removeChild(taskName);
}





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
 * It takes a random hex color, and adds a random amount of red, green, and blue to it.
 * @returns A random color.
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

window.onload = function() {


    
    
};


function extractCategory() {
    
    const string = 'This is :state :buttonName by :name';
    //JSON  person = {name:"John", age:31, city:"New York"};
    const data = {
        buttonName: 'button link',
        state: 'Alabama',
        name: 'Arun'
    }
    const res = string.replace(/:([a-zA-Z]+)/g, (m, i) => i in data ? data[i] : m)
    //console.log(res)
}

function generateAllTask(listCategorie) {    
    for (const [key, value] of Object.entries(listCategorie)) {
        //console.log("--",key, value);
        createTask(key, value);
    }
    
}