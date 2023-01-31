
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
 * @returns 18 : Feuille2temps=[[1,2,3],[4,5,6],[7,8,9]]
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
      arrFeuille2tempsSTR = temp.substring(name.length,temp.length);
      const arrFeuille2temps1d = arrFeuille2tempsSTR.split(",");
      const arrFeuille2temps = [];
      while(arrFeuille2temps1d.length) arrFeuille2temps.push(arrFeuille2temps1d.splice(0,3));
      return arrFeuille2temps;
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
  hideButton();
  // if (cameraStream !== null){return;}
  var arrFeuille2temps = accessCookie("Feuille2tempsCookie");
  todayDate=new Date().toISOString().substring(0, 10);
  if (arrFeuille2temps!="")
  {
    $('#Feuille2temps_Alert').slideUp(500);
    $("#cookie_Alert").slideUp(500);

    console.log("Welcome Back, Le compteur est à " + arrFeuille2temps[arrFeuille2temps.length - 1] + " !");
    console.log(arrFeuille2temps);
    var Feuille2tempsCur=arrFeuille2temps[0][0];
    createTable(arrFeuille2temps);
    document.getElementById('Feuille2tempsInput').value = Feuille2tempsCur;
    // document.getElementById('Feuille2tempsDash').innerHTML = Feuille2tempsCur;
    animateValue("Feuille2tempsDash", 0, Feuille2tempsCur, 1000);
    // createTable(arrFeuille2temps);
    updateFeuille2tempsChart(arrFeuille2temps);
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
  
  $("#tableFeuille2tempsBody").empty();
  
  tableData.forEach(function(rowData) {
    var row = document.createElement('tr');
    
    var actions = $("#tableFeuille2temps td:last-child").html();    {
      $(this).attr("disabled", "disabled");
      var index = $("#tableFeuille2temps tbody tr:last-child").index();
      var row = '<tr>' +
      '<td>'+ rowData[0] +'</td>' +
      '<td>'+ rowData[1] +'</td>' +
      '<td>'+ rowData[2] +'</td>' +
      // '<td>' + actions + '</td>' +
      '<td>'+
      '<a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>'+
      '<a class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>'+
      '<a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>'+
      '</td>'+
      '</tr>';
      $("#tableFeuille2temps").append(row);		
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
  var inputVal = document.getElementById("Feuille2tempsInput").value;
  var inputDate = document.getElementById("Feuille2tempsDateInput").value;
  var inputCity = document.getElementById("Feuille2tempsCityInput").value;
  console.log(inputVal,inputDate,inputCity);
  
  var arrFeuille2temps = table2Array();

  arrFeuille2temps.unshift([inputVal,inputDate,inputCity]);
  
  createCookie("Feuille2tempsCookie", arrFeuille2temps, 100);
  createTable(arrFeuille2temps);
  updateCookie();
}



function animateValue(id, start, end, duration) {
  if (start === end) return;
  var range = (end - start)/5;
  var current = start;
  var increment = end > start? range : -range;
  increment=1;
  var stepTime = Math.abs(Math.floor(duration / range));
  console.log(stepTime);
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
  console.log("tableFeuille2temps");
  
  var myTableArray = [];
  $("table#tableFeuille2temps tr").each(function() {
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
  console.log(myTableArrayMinLast);
  return myTableArrayMinLast;
}

function updateCookie(){
  
  var arrFeuille2temps = table2Array();    
  createCookie("Feuille2tempsCookie", arrFeuille2temps, 100);  
  animateValue("Feuille2tempsDash", 0, arrFeuille2temps[0][0], 1000);
  updateFeuille2tempsChart(arrFeuille2temps);
  
}



/**
 * Il prend le contenu d'un tableau et en fait un pdf
 */
function table2pdf() {
  var pdf = new jsPDF('p', 'pt', 'letter');
  
  pdf.cellInitialize();
  pdf.setFontSize(10);
  pdf.text(20, 30, 'Historique des Feuille de temps');
  $.each( $('#tableFeuille2temps tr'), function (i, row){
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


