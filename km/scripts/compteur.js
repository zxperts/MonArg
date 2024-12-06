  var index;
  var selectedIndex;
  
  
  /**
  * Créez un cookie avec le nom cookieName,
  * la valeur cookieValue et la date d'expiration daysToExpire
  * jours à partir de maintenant.
  * @param cookieName - Le nom du cookie que vous souhaitez créer.
  * @param cookieValue - La valeur du cookie.
  * @param daysToExpire - Le nombre de jours jusqu'à ce que le cookie expire.
  */
  function createCookie(cookieName,cookieValue,daysToExpire)
  {
    var date = new Date();
    date.setTime(date.getTime()+(daysToExpire*24*60*60*1000));
    document.cookie = cookieName + "=" + cookieValue + "; expires=" + date.toGMTString();
  }
  
  
  /**
  * Il prend un nom de cookie comme argument,
  * puis renvoie un tableau de tableaux des valeurs du cookie.
  * @param cookieName - le nom du cookie auquel vous souhaitez accéder
  * @returns 18 : km=[[1,2,3],[4,5,6],[7,8,9]]
  */
  function accessCookie(cookieName)
  {
    var name = cookieName + "=";
    var allCookieArray = document.cookie.split(';');
    for(var i=0; i<allCookieArray.length; i++)
      {
      var temp = allCookieArray[i].trim();
      if (temp.indexOf(name)==0)
        {
        console.log('18: '+temp)
        arrKmSTR = temp.substring(name.length,temp.length);
        const arrKm1d = arrKmSTR.split(",");
        const arrKm = [];
        while(arrKm1d.length) arrKm.push(arrKm1d.splice(0,5));
        return arrKm;
      }
    }
    return "";
  }
  
  
  /**
  * Il vérifie si le cookie existe, s'il existe,
  *  il crée un tableau avec les données du cookie, si ce
  * n'est pas le cas, il vérifie si les cookies sont activés,
  *  s'ils le sont, il masque l'alerte cookie,
  * s'ils ne le sont pas , il affiche l'alerte cookie.
  */
  function onLoadcheckCookie()
  {
    console.log("onLoadcheckCookie");
    hideButton();
    // if (cameraStream !== null){return;}
    var arrKm = accessCookie("KmCookie");
    todayDate=new Date().toISOString().substring(0, 10);
    if (arrKm!="")
      {
      $('#km_Alert').slideUp(500);
      $("#cookie_Alert").slideUp(500);
      
      console.log("Welcome Back, Le compteur est à " + arrKm[arrKm.length - 1] + " !");
      console.log("arrKm",arrKm);
      var kmCur=arrKm[0][0];
      createTable(arrKm);
      document.getElementById('KmInput').value = kmCur;
      document.getElementById('PreKmInput').value = kmCur;
      // document.getElementById('kmDash').innerHTML = kmCur;
      animateValue("kmDash", 0, kmCur, 1000);
      createTable(arrKm);
      updateKmChart(arrKm);
    }
    else
    {
      if (testCoockies())    
        { $("#cookie_Alert").slideUp(500); }
    }
    
  }
  
  
  /**
  * Il crée une table,
  * ajoute une ligne à la table, puis ajoute la table au DOM.
  * @param tableData - un tableau de tableaux, dont chacun représente une ligne dans la table.
  */
  function createTable(tableData) {
    var table = document.createElement('table');
    table.setAttribute('border', '50');
    table.setAttribute('frame', 'void');
    table.setAttribute('rules', 'rows');
    table.setAttribute('bordercolor', 'black');
    var tableBody = document.createElement('tbody');
    
    $("#tableKmBody").empty();
    
    tableData.forEach(function(rowData) {
      var row = document.createElement('tr');
      
      //alert("rowData",rowData)
      console.log("rowData",  rowData);
      
      var actions = $("#tableKm td:last-child").html();    {
        $(this).attr("disabled", "disabled");
        var index = $("#tableKm tbody tr:last-child").index();
        var row = '<tr>' +
        '<td>'+ rowData[0] +'</td>' +
        '<td>'+ rowData[1] +'</td>' +
        '<td>'+ rowData[2] +'</td>' +
        '<td>'+ rowData[3] +'</td>' +
        '<td>'+ rowData[4] +'</td>' +
        // '<td>' + actions + '</td>' +
        '<td>'+
        //'<a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>'+
        '<a class="edit" title="Edit" data-toggle="modal" data-target="#inputkm_modal"><i class="material-icons">&#xE254;</i></a>'+
        '<a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>'+
        '</td>'+
        '</tr>';
        $("#tableKm").append(row);		
        // $("table tbody tr").eq(index + 1).find(".add, .edit").toggle();
        $('[data-toggle="tooltip"]').tooltip();
      }
    });
    
    table.appendChild(tableBody);
    document.body.appendChild(table);
    document.getElementById("collapseOneInner").appendChild(table);
  }
  
  /**
  * Il prend les valeurs d'entrée du formulaire,
  * les place dans un tableau, puis crée un cookie avec le
  * tableau comme valeur.
  */
  function saveInputValue(){
    // Selecting the input element and get its value 
    var inputVal = document.getElementById("KmInput").value;
    var inputDate = document.getElementById("KmDateInput").value;
    var inputCity = document.getElementById("KmCityInput").value;
    var inputVol = document.getElementById("VolInput").value;
    //var inputPreKm = document.getElementById("PreKmInput").value;
    var inputConso = document.getElementById("ConsoInput").value;
    console.log("inputVal,inputDate,inputCity,inputVol,inputConso",inputVal,inputDate,inputCity,inputVol,inputConso);
    
    var arrKm = table2Array();
    
    arrKm.unshift([inputVal,inputDate,inputCity,inputVol,inputConso]);
    
    createCookie("KmCookie", arrKm, 100);
    createTable(arrKm);
    updateCookie();
  }
  
  
  
  
  function animateValue(id, start, end, duration) {
    if (start === end) return;
    if (end > 1000000) {
      end = 1000000;
    }
    var range = (end - start)/5;
    var current = start;
    var increment = end > start? range : -range;
    increment=1;
    var stepTime = Math.abs(Math.floor(duration / range));
    console.log("stepTime",stepTime);
    var obj = document.getElementById(id);
    var timer = setInterval(function() {
      increment=increment*2;
      current += increment;
      obj.innerHTML = current;
      obj.innerHTML = current > end? end : current;
      if (current >= end) {
        clearInterval(timer);
      }
    }, 50
  );
}


function table2Array(){
  console.log("tableKm");
  
  var myTableArray = [];
  $("table#tableKm tr").each(function() {
    var arrayOfThisRow = [];
    var tableData = $(this).find('td');
    if (tableData.length > 0) {
      tableData.each(function() { arrayOfThisRow.push($(this).text()); });
      myTableArray.push(arrayOfThisRow);
    }
  });
  
  var myTableArrayMinLast = myTableArray.map(function(val) {
    return val.slice(0, -1);
  });
  console.log("myTableArrayMinLast",myTableArrayMinLast);
  return myTableArrayMinLast;
}

function updateCookie(){
  
  var arrKm = table2Array();
  createCookie("KmCookie", arrKm, 100);  
  animateValue("kmDash", 0, arrKm[0][0], 1000);
  updateKmChart(arrKm);
  
}



/**
* Il prend le contenu d'un tableau et en fait un pdf
*/
function table2pdf() {
  var pdf = new jsPDF('p', 'pt', 'letter');
  
  pdf.cellInitialize();
  pdf.setFontSize(10);
  pdf.text(20, 30, 'Historique des kilomètres');
  $.each( $('#tableKm tr'), function (i, row){
    $.each( $(row).find("td, th"), function(j, cell){
      var txt = $(cell).text().trim() || " ";
      txt=txt.replace(/\W/g, ' ');
      var width = (j==4) ? 40 : 70; //make 4th column smaller
      pdf.cell(10, 50, width, 30, txt, i);
    });
  });
  pdf.text(450,30, 'Date Impression:'+ new Date().toISOString().substring(0, 10));
  
  pdf.save('sample-file.pdf');  
}


function testCoockies(){
  var enabled = false;
  // Quick test if browser has cookieEnabled host property
  if (navigator.cookieEnabled){
    enabled = true;
  }
  // Create cookie test
  document.cookie = "testcookie=1";
  enabled = document.cookie.indexOf("testcookie=") != -1;
  // Delete cookie test
  document.cookie = "testcookie=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
  return enabled;
}




// $(document).on("click", ".ModifyIt", function(){ $('#inputkm_modal').modal('show'); });

// Delete row on delete button click
$(document).on("click", ".delete", function(){
  
  
  selectedIndex = $(this).closest('tr').index();
  if (selectedIndex == -1) { 
    rowIndex = getOriginalRowIndex(this.closest('.card'));
    console.log("Deleting row..."+rowIndex);
    document.getElementById('tableKm').deleteRow(rowIndex);
  }
  else { 
    $(this).parents("tr").remove();
    $(".add-new").removeAttr("disabled");
  }
  updateCookie();	
});

$(document).on('click', '.edit', function() {
  
  document.querySelector('button[onclick="saveInputValue();"]').style.display = "none";
  document.querySelector('button[onclick="UpdateInTable();"]').style.display = "block";
  
  index = $(this).closest('tr');
  
  
  selectedIndex = $(this).closest('tr').index();
  if (selectedIndex == -1) { 
    selectedIndex = getOriginalRowIndex(this.closest('.card'));
    row = getOriginalRow(this.closest('.card'));
    var cells = row.cells; // Obtenir toutes les cellules de la rangée
    var nextRow = row.nextElementSibling; // Obtenir la rangée suivante
    
    var id= cells[0].textContent
    var date= cells[1].textContent
    var location= cells[2].textContent
    var volume= cells[3].textContent
    var Consommation= cells[4].textContent
    var preKm= nextRow ? nextRow.cells[0].textContent : '';
  }
  else {  
    var $tr = $(this).closest('tr')
    var $prevTr = $tr.next(); // Obtenir la rangée précédente
    
    var id = $tr.find('td').eq(0).text();  
    var date = $tr.find('td').eq(1).text(); 
    var location = $tr.find('td').eq(2).text();
    var volume = $tr.find('td').eq(3).text();
    var preKm = $prevTr.find('td').eq(0).text();
    var Consommation = $tr.find('td').eq(4).text();
  }
  
  
  
  
  
  $('#inputkm_modal').find('#KmInput').val(id);
  $('#inputkm_modal').find('#KmDateInput').val(date);
  $('#inputkm_modal').find('#KmCityInput').val(location);
  $('#inputkm_modal').find('#VolInput').val(volume);
  $('#inputkm_modal').find('#PreKmInput').val(preKm);
  $('#inputkm_modal').find('#ConsoInput').val(Consommation);
  $('#inputkm_modal').find('#customTitle').val(selectedIndex);
  console.log(selectedIndex + " selected");
  
});

$(document).on('click', '#manuelInput', function() {
  document.querySelector('button[onclick="saveInputValue();"]').style.display = "block";
  document.querySelector('button[onclick="UpdateInTable();"]').style.display = "none";
});


function UpdateInTable() {
  if (selectedIndex !== undefined) {
    console.log("Editing row..."+selectedIndex);
    
    // Utilisez selectedIndex ici pour mettre à jour la ligne correspondante
    var newId = $('#KmInput').val();
    var newDate = $('#KmDateInput').val();
    var newLocation = $('#KmCityInput').val();
    var newVolume = $('#VolInput').val();
    //var newPreKm = $('#PreKmInput').val();
    var newConso = $('#ConsoInput').val();

    rw=selectedIndex*1+1;
    
    var $tableRow = $('table tr').eq(rw); // +1 car la première ligne est souvent l'en-tête
    $tableRow.find('td').eq(0).text(newId);
    $tableRow.find('td').eq(1).text(newDate);
    $tableRow.find('td').eq(2).text(newLocation);
    $tableRow.find('td').eq(3).text(newVolume);
    $tableRow.find('td').eq(4).text(newConso);

    console.log("xx "+$tableRow.find('td').eq(0).text());
    
    
    
    var arrKm = table2Array();
    //arrKm.unshift([newId,newDate,newLocation,newVolume,newConso]);
    console.log(arrKm); 
    
    
    createCookie("KmCookie", arrKm, 100);
    alert("Please select..."+$tableRow+"..."+rw);
    updateCookie();
    
    // Fermez le modal si nécessaire
    $('#inputkm_modal').modal('hide');
  } else {
    console.log("Aucune ligne sélectionnée");
    alert("Aucune ligne sélectionnée");
  }
}

function saveTableAndUpdateCokie() { 
  var arrKm = table2Array();   
  console.log("arrKm -"+ arrKm);
    createCookie("KmCookie", arrKm, 100);
    updateCookie();
}



document.getElementById('KmInput').addEventListener('input', calculateConsumption);
document.getElementById('VolInput').addEventListener('input', calculateConsumption);
document.getElementById('PreKmInput').addEventListener('input', calculateConsumption);

function calculateConsumption() {
  const km = document.getElementById('KmInput').value;
  const Prekm = document.getElementById('PreKmInput').value;
  const volume = document.getElementById('VolInput').value;
  const consumption = (volume && km && Prekm && (km - Prekm) > 0) ? (volume / (km - Prekm)) * 100 : 0;  // Consommation en litres pour 100 km
  //alert(volume +" "+ km +" "+ Prekm + " "+ consumption);
  
  document.getElementById('ConsoInput').value = consumption.toFixed(2);
}


document.querySelectorAll('.checkbox-wrapper input[type="checkbox"]').forEach(function(checkbox) {
  checkbox.addEventListener('change', function() {
    var column = this.getAttribute('data-column');
    var table = document.getElementById('tableKm');
    var display = this.checked ? '' : 'none';
    Array.from(table.rows).forEach(function(row) {
      row.cells[column].style.display = display;
    });
  });
});



// Function to set a cookie
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get a cookie
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Function to handle checkbox change
function handleCheckboxChange(checkbox) {
  var column = checkbox.getAttribute('data-column');
  var table = document.getElementById('tableKm');
  var display = checkbox.checked ? '' : 'none';
  Array.from(table.rows).forEach(function(row) {
    row.cells[column].style.display = display;
  });
  // Save the preference in a cookie
  setCookie('column' + column, checkbox.checked ? 'show' : 'hide', 7);
}

function convertTableToCards() {
  const table = document.getElementById('tableKm');
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const cardContainer = document.getElementById('cardContainer');
  
  // Clear any existing cards
  cardContainer.innerHTML = '';
  
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td');
    const km = cells[0].textContent;
    const date = cells[1].textContent;
    const ville = cells[2].textContent;
    const volume = cells[3].textContent;
    const consommation = cells[4].textContent;
    const actions = cells[5].innerHTML;
    
    const cardHTML = `
          <div class="col-12 mb-3" >
            <div class="card shadow-sm" style="border-radius: 15px; overflow: hidden;" data-row-index="${index}">
              <div class="card-body" style="padding: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <span style="color: #6c757d; font-size: 1.25rem;">${date}</span>
                  <h5 class="card-title m-0" style="font-weight: 600;">Kilomètres: ${km}</h5>
                </div>
                <p class="card-text" style="display: none; margin-bottom: 0.5rem;" id="details-${km}">
                  <span style="display: flex; justify-content: space-between; align-items: center;">
                    <span>
                      <span style="display: block; margin-bottom: 0.25rem;">Volume: <strong>${volume}</strong></span>
                      <span style="display: block;">Consommation: <strong>${consommation}</strong></span>
                    </span>
                    <span style="display: flex; align-items: center;">${actions}</span>
                  </span>
                </p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: 500;">Ville: ${ville}</span>
                  <button class="btn btn-outline-primary btn-sm" style="border-radius: 20px;" onclick="toggleDetails('${km}')">
                    Afficher plus
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
    
    cardContainer.innerHTML += cardHTML;
  });
}

function getOriginalRow(card) {
  //alert('Please select');
  //alert(card.innerHTML);
  //alert(card.getAttribute('data-row-index'));
  //alert(card.dataset.rowIndex)
  const rowIndex = card.getAttribute('data-row-index');
  const table = document.getElementById('tableKm');
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  console.log("rowIndex: " + rowIndex);
  return rows[rowIndex];
}


function getOriginalRowIndex(card) {
  return card.getAttribute('data-row-index');
  
}

// Function to toggle the visibility of the details
function toggleDetails(km) {
  const details = document.getElementById(`details-${km}`);
  const button = details.nextElementSibling.querySelector('button');
  if (details.style.display === 'none') {
    details.style.display = 'block';
    button.textContent = 'Afficher moins';
  } else {
    details.style.display = 'none';
    button.textContent = 'Afficher plus';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  //convertTableToCards();
  
});


    // Fonction pour exporter le tableau en CSV
    function exportTableToCSV(filename) {
      const csv = [];
      const rows = document.querySelectorAll("#tableKm tr");

      for (const row of rows) {
        const cols = row.querySelectorAll("td:not(:last-child), th:not(:last-child)");
        const csvRow = [];
        for (const col of cols) {
          csvRow.push(col.innerText);
        }
        csv.push(csvRow.join(","));
      }

      const csvFile = new Blob([csv.join("\n")], { type: "text/csv" });
      const downloadLink = document.createElement("a");
      downloadLink.download = filename;
      downloadLink.href = window.URL.createObjectURL(csvFile);
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }

    // Fonction pour importer un fichier CSV et ajouter les données au tableau
    function importCSV(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const rows = e.target.result.split("\n");
          const tableBody = document.querySelector("#tableKmBody");

          // Ignore the header row
          for (let i = 1; i < rows.length; i++) {
            const cols = rows[i].split(",");
            if (cols.length === 5) { // Ensure the row has the correct number of columns
              const tr = document.createElement("tr");
              for (const col of cols) {
                const td = document.createElement("td");
                td.innerText = col.trim();
                tr.appendChild(td);
              }
              // Ajout des actions
              const actions = document.createElement("td");
              actions.innerHTML = `
                <a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>
                <a class="edit" title="Edit" data-toggle="modal" data-target="#inputkm_modal"><i class="material-icons">&#xE254;</i></a>
                <a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
              `;
              tr.appendChild(actions);
              tableBody.appendChild(tr);
              saveTableAndUpdateCokie();
            }
          }
        };
        reader.readAsText(file);
      }
      
    }

    // Event listeners pour les boutons
    document.getElementById("exportCsv").addEventListener("click", function() {
      exportTableToCSV("tableKm.csv");
    });

    document.getElementById("importCsv").addEventListener("change", importCSV);


    document.getElementById("importCsv").addEventListener("click", importCSV);