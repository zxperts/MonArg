
function createCookie(cookieName,cookieValue,daysToExpire)
{
  var date = new Date();
  date.setTime(date.getTime()+(daysToExpire*24*60*60*1000));
  document.cookie = cookieName + "=" + cookieValue + "; expires=" + date.toGMTString();
}
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
      while(arrKm1d.length) arrKm.push(arrKm1d.splice(0,3));
      return arrKm;
    }
  }
  return "";
}
function onLoadcheckCookie()
{
  hideButton();
  // if (cameraStream !== null){return;}
  var arrKm = accessCookie("KmCookie");
  todayDate=new Date().toISOString().substring(0, 10);
  if (arrKm!="")
  {
    $('#km_Alert').slideUp(500);
    $("#cookie_Alert").slideUp(500);
    // arrKm = [];
    
    // arrKm = [[1, todayDate],[2, todayDate],[3, todayDate],[4, todayDate]];
    // arrKm[0] = 1;
    // arrKm.push([Math.floor(Math.random() * 100),todayDate]); 
    // console.log(arrKm)
    // createCookie("KmCookie", arrKm, 1);
    // alert("Welcome Back, Le compteur est à " + arrKm[arrKm.length - 1] + " !");
    console.log("Welcome Back, Le compteur est à " + arrKm[arrKm.length - 1] + " !");
    console.log(arrKm);
    var kmCur=arrKm[0][0];
    createTable(arrKm);
    document.getElementById('KmInput').value = kmCur;
    // document.getElementById('kmDash').innerHTML = kmCur;
    animateValue("kmDash", 0, kmCur, 1000);
    // createTable(arrKm);
  }
  else
  {
    if (testCoockies())    
    { $("#cookie_Alert").slideUp(500); }
    else
    {
      // $("#exampleModal").fadeIn('slow');
      
      // alert("Activez les Cookies afin d'utiliser cet outil" + "!!!");
    }
    
    
    // num = prompt("How many days you want to store your name on your computer?");
    // num=1;
    
    // var arrKm = [[1, todayDate],[2, todayDate],[3, todayDate],[4, todayDate]];
    // if (arrKm[0]!="" && arrKm[0]!=null)
    // {
    //   createCookie("KmCookie", arrKm, num);
    // }
  }
  
  
  
  
  // createCookie("KmCookie", table2Array(), 1);
  // createTable(arrKm.reverse());
  
  
  
}





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
    
    // rowData.forEach(function(cellData,idx) {
    //   var cell = document.createElement('td');
    //   cell.appendChild(document.createTextNode(cellData));
    
    //   if (idx === rowData.length - 1){ 
    //     var btn = document.createElement('input');
    //     btn.type = "button";
    //     btn.className = "btn btn-danger btn-xs";
    //     btn.value = 'Delete';
    //     cell.appendChild(btn);
    //     cell.appendChild(document.createElement('br'));
    //   }
    // console.log(cellData);
    // row.appendChild(cell);
    // });    
    // tableBody.appendChild(row);
    
    var actions = $("#tableKm td:last-child").html();    {
      $(this).attr("disabled", "disabled");
      var index = $("#tableKm tbody tr:last-child").index();
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
      $("#tableKm").append(row);		
      // $("table tbody tr").eq(index + 1).find(".add, .edit").toggle();
      $('[data-toggle="tooltip"]').tooltip();
    }
    
    
    
  });
  
  table.appendChild(tableBody);
  document.body.appendChild(table);
  document.getElementById("collapseOneInner").appendChild(table);
  
}

function saveInputValue(){
  // Selecting the input element and get its value 
  var inputVal = document.getElementById("KmInput").value;
  var inputDate = document.getElementById("KmDateInput").value;
  var inputCity = document.getElementById("KmCityInput").value;
  console.log(inputVal,inputDate,inputCity);
  
  // var arrKm = accessCookie("KmCookie");
  var arrKm = table2Array();
  // const arrKm1d = arrKmSTR.split(",");
  // const arrKm = [];
  // while(arrKm1d.length) arrKm.push(arrKm1d.splice(0,2));
  
  // arrKm.push([inputVal,inputDate,inputCity]); 
  arrKm.unshift([inputVal,inputDate,inputCity]);
  // console.log('91: '+arrKm)
  
  createCookie("KmCookie", arrKm, 100);
  createTable(arrKm);
  updateCookie();
  
  // Displaying the value
  // alert('Vous venez d encodez: '+inputVal);
}

// createTable([["row 1, cell 1", "row 1, cell 2"], ["row 2, cell 1", "row 2, cell 2"]]);


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
  }, 50//stepTime
  );
}

// animateValue("value", 100, 25, 500);




function table2Array(){
  console.log("tableKm");
  // console.log(document.getElementById("tableKm"));
  
  var myTableArray = [];
  $("table#tableKm tr").each(function() {
    var arrayOfThisRow = [];
    var tableData = $(this).find('td');
    if (tableData.length > 0) {
      tableData.each(function() { arrayOfThisRow.push($(this).text()); });
      myTableArray.push(arrayOfThisRow);
    }
  });
  
  // alert(myTableArray);
  var myTableArrayMinLast = myTableArray.map(function(val) {
    return val.slice(0, -1);
  });
  console.log(myTableArrayMinLast);
  return myTableArrayMinLast;
}

function updateCookie(){
  
  var arrKm = table2Array();    
  createCookie("KmCookie", arrKm, 100);  
  // Displaying the value
  // alert('Value Modified: ');
  animateValue("kmDash", 0, arrKm[0][0], 1000);
  
  // demoFromHTML();
  
  
}



function demoFromHTML() {
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


