var entete_montant="";
var entete_date="";
var entete_communication="";
var selectedPeriod="Mensuel";
var minAmount=-10000;
var maxAmount=10000;

var chartDataDay = [];
var chartDataWeek = [];
var chartDataMonth = [];
var chartDataYear= [];
var layout = {
    hovermode: "closest",
    barmode: 'relative',
    height: 800,
};
const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];

var headerNames;

// Read the data from CSV
function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
        console.log('no contents....')
        return;
    }
    if (!(file.type.includes("excel") || file.type.includes("csv"))) {
        alert("Le fichier n'est pas un csv...😱");
        return;
    }
    
    
    var reader = new FileReader();
    
    reader.onload = function(e) {
        var contents = e.target.result;
        
        displayContents(e.target.result);
        
    };
    reader.readAsDataURL(file);
}


function dateWesternEurope(d_Date,period) {       
    var myDate0 = d_Date      
    var dateParts = myDate0.split(/[/-]+/);
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
    
    var dayObject=dateObject.getDate()
    var weekObject=getWeekNumber(dateObject)
    var monthObject=dateObject.getMonth() 
    var yearObject=dateObject.getFullYear() 
    if (period=="Day") {return dayObject}
    if (period=="Week") {return weekObject}
    if (period=="Month") {return monthNames[monthObject]}
    if (period=="Year") {return yearObject}
    else{return monthNames[monthObject]}
    
}

function validateDateWE (input){
    var reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)?\d\d/;
    if (input.match(reg)) {
        return true;
    }
    else {
        return false
    }
}

function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    // return [d.getUTCFullYear(), weekNo];
    return weekNo;
}

function checkwages(input){
    var validformat=/^\-?\d+(?:\,\d{0,2})$/;
    if ( validformat.test(input)) {
        return true;
    }
    var validformat=/^\-?\d+(?:\.\d{0,2})$/;
    if ( validformat.test(input)) {
        return true;
    }   
    return false;
}

function chartDataAdd(key,arrayx,arrayy,c_all) {    
    let t = new Array(arrayx.length);
    size=arrayx.length;
    while(size--) t[size] = key;
    console.log('key',key);
    console.log('c_all',c_all);
    console.log('t',t);
    return {                    
        x: arrayx,
        y: arrayy,
        text: c_all,
        name:  key,
        customdata:t,
        type: 'bar',
        hovertemplate:
            "<b>%{customdata}</b><br><br>" +
            "%{yaxis.title.text}: %{y}<br>" +
            "%{xaxis.title.text}: %{x}<br>" +
            "Communication: %{text}" +
            "<extra></extra>"
    }
}

// Plot the stacked bar chart 
function plotChartData(chartData) {
    // plot sans filtre
    // Plotly.newPlot('plot', chartData,layout); 

    if (!chartData || chartData.length< 2) {
        console.log('no contents....')
        alert("Pas encore de fichier uploadé...😱");
        return;
    }
    
    
    var res = [];
    var resx_filtered = [];
    var resy_filtered = [];
    var rest_filtered = [];
    var chartDataFiltered = [];
    
    for (var cd_i = 0; cd_i < chartData.length; cd_i++) {
        for (var i = 0; i < chartData[cd_i].y.length; i++) {
            checkAmount=Math.ceil(chartData[cd_i].y[i]);
            if  (checkAmount >=minAmount && checkAmount <=maxAmount) {
                if (!res[cd_i]) res[cd_i] = [];
                res[cd_i].push(i);
            }
        }
        if (res[cd_i]){
            // Pour ne garder que les index du filtre
            resx_filtered[cd_i] = chartData[cd_i].x.filter(function (eachElem, indexx) {
                return res[cd_i].indexOf(indexx) >= 0
            });
            resy_filtered[cd_i] = chartData[cd_i].y.filter(function (eachElem, indexy) {
                return res[cd_i].indexOf(indexy) >= 0
            });
            rest_filtered[cd_i] = chartData[cd_i].text.filter(function (eachElem, indexy) {
                return res[cd_i].indexOf(indexy) >= 0
            });
        }
        else {
            resx_filtered[cd_i]=[];
            resy_filtered[cd_i]=[];
            rest_filtered[cd_i]=[];
        }
        // Plot avec les filtres
        chartDataFiltered.push(chartDataAdd(chartData[cd_i].name,resx_filtered[cd_i],resy_filtered[cd_i],rest_filtered[cd_i]));
    }
    
    Plotly.newPlot('plot', chartDataFiltered,layout); 
    
}

var removeUselessWords = function(txt) {
    var uselessWordsArray = 
    [
        "achatbancontact", "mistercash", "belnum", "rodecartex", "achatmaestro",
        "renceing", "retraitbancontact", "virementeurop", "domiciliationeurop",
        "xxxxxxxx", "bruxelles", "bank", "retraitself", "avisenannexe",
        "virement", "retraitmaestro", "xxxxxx", "fimaser","Bancontact","contactless",
        "appointements","association","avantages","bar","belgrade","brussels","centre",
        "champion","contrat","couleur","courses","crelan","domiciliation","ecommerce",
        "economie","facture","flawinne","floreffe","gembloux","interruption","kuringen",
        "mensuelle","oiseau","paiement","performance","permanent","salzinnes","schaerbeek",
        "service","wallone","belgrad","bouge","brussel","carte","eur","faveur","loisirs",
        "louvain","malonne","namur","precedent","suarlee","wemmel","votre"
    ];
    
    var expStr = uselessWordsArray.join("|");
    return txt.replace(new RegExp('\\b(' + expStr + ')\\b', 'gi'), ' ')
    .replace(/\s{2,}/g, ' ');
}

function findLongestWord(str) {
    var longestWord = str.split(' ').reduce(function(longest, currentWord) {
        return currentWord.length > longest.length ? currentWord : longest;
    }, "");
    return longestWord;
}



function displayContents(contents) {
    
    var list_cat_=[];
    
    
    
    var list_cat_=[];
    var list_cat=[];
    // var field2=[];
    
    Plotly.d3.csv("https://raw.githubusercontent.com/zxperts/hellodjango/master/csv/ListCat2.csv",function(csv){processData2(csv)});
    
    function processData2(csv) {
        csv.map(function(d){
            list_cat_.push(d.libelle);
        })
        
        
        var list_cat = [list_cat_,['Ethias','Acinapolis','Grogon','Delhaize','Decathlon']]       
        
        Plotly.d3.dsv(';')(contents,  function(csv_data){ processData(csv_data) } );
        
        
        
        function processData(csv_data) {
            console.log("csv_data loaded....");
            
            
            headerNames = Plotly.d3.keys(csv_data[0]);
            headerNames.forEach(element => {         
                
                if (element=="Contrepartie" || element=="Libellés" ||element=="Communications"){
                    // console.log("Communication.....")
                    entete_communication=element
                }
                
                var first_content=csv_data[0][element]

                // console.log("entete_date:",entete_date)
                if (validateDateWE(first_content) && entete_date===""){
                    // console.log("Date.....")
                    // console.log(first_content)
                    entete_date=element
                }
                if (element=="Montant"){
                    entete_montant=element
                }
                else if (checkwages(first_content) && entete_montant ===""){
                    // console.log("Number.....")
                    // console.log(first_content)
                    entete_montant=element    
                }

            });
            
            if (!entete_montant || !entete_date || !entete_communication) {
                console.log('Les entetes sont manquantes....')
                alert("Au moins une des entetes (Contrepartie,Montant ,  )est manquantes...😱");
                return;
            }
            
            console.log('....les entetes:',entete_montant,entete_date,entete_communication)
            
            
            
            
            
            
            
            var arrayDay = [];
            var arrayWeek = [];
            var arrayMonth = [];
            var arrayYear = [];
            
            
            function pushArrayPeriod(arrayPeriod,period) {
                //si pas encore cette communication  
                if (!arrayPeriod[communication_z]) {
                    arrayPeriod[communication_z] = [[],[],[]];
                }                
                arrayPeriod[communication_z][0].push(period);
                arrayPeriod[communication_z][1].push(montant_y);
                arrayPeriod[communication_z][2].push(communication_all); 
                // console.log("montant_y",arrayPeriod[communication_z][1])
                // console.log(period,montant_y)
                // console.log(arrayPeriod)           
            }
            
            
            
            // Loop through all rows of the csv_data
            for(var i = 0; i < csv_data.length; i++) {
                
                d=csv_data[i]    
                var str_idxDay=dateWesternEurope(d[entete_date],"Day")
                var str_idxWeek=dateWesternEurope(d[entete_date],"Week")
                var str_idxMonth=dateWesternEurope(d[entete_date],"Month")
                var str_idxYear=dateWesternEurope(d[entete_date],"Year")  
                
                var montant_y=d[entete_montant]
                montant_y = montant_y.replace(',', '.');    
                // console.log("montant_y",montant_y)
                communication_z="";
                communication_all="";
                headerNames.forEach(element => {    
                    communication_z=communication_z+" "+d[element]
                });          
                communication_z=communication_z.replace(/[^a-zA-Z&]+/g, " ");
                // console.log(communication_z)
                communication_z=removeUselessWords(communication_z);
                communication_all=communication_z;
                communication_z=findLongestWord(communication_z);
                // console.log('communication_z: ',communication_z)
                if (communication_z === null || communication_z === '') {
                    communication_z="...Tenue de cpte Performance Pack"
                }
                pushArrayPeriod(arrayDay,str_idxDay);
                pushArrayPeriod(arrayWeek,str_idxWeek);
                pushArrayPeriod(arrayMonth,str_idxMonth);
                pushArrayPeriod(arrayYear,str_idxYear);      
            }
            entete_date="";
            
            
            // création du dataset pour le plot
            Object.keys(arrayDay).map(function(key, index) {                
                chartDataDay.push(chartDataAdd(key,arrayDay[key][0],arrayDay[key][1],arrayDay[key][2]));
            });
            Object.keys(arrayWeek).map(function(key, index) {                
                chartDataWeek.push(chartDataAdd(key,arrayWeek[key][0],arrayWeek[key][1],arrayWeek[key][2]));
            });
            Object.keys(arrayMonth).map(function(key, index) {                
                chartDataMonth.push(chartDataAdd(key,arrayMonth[key][0],arrayMonth[key][1],arrayMonth[key][2]));
            });
            Object.keys(arrayYear).map(function(key, index) {                
                chartDataYear.push(chartDataAdd(key,arrayYear[key][0],arrayYear[key][1],arrayYear[key][2]));
            });
            
            
            // Define a chart layout
            var layout = {
                hovermode: "closest",
                // hovermode: "y",
                // barmode: 'stack',
                barmode: 'relative',
                // width: 1200,
                height: 800,
                // showspikes = True
            };
            
            // Plot the stacked bar chart   
            // plotChartData(chartDataMonth);
            PlotlyPlot("Mensuel");
            
            
            
            
            
            
        }
    }
    
}

document.getElementById('formFile').addEventListener('change', readSingleFile, false);

// document.getElementById('verInfo').addEventListener('change', togglePopup, false);


function togglePopup(){
    // console.log('verInfo')
    document.getElementById("popup-1").classList.toggle("active");
}

function PlotlyPlot(selectedPeriod){
    // console.log("La period", period)
    
    if (selectedPeriod=="Journalier") {plotChartData(chartDataDay);}
    if (selectedPeriod=="Hebdomadaire") {plotChartData(chartDataWeek);}
    if (selectedPeriod=="Mensuel") {plotChartData(chartDataMonth);}
    if (selectedPeriod=="Annuel") {plotChartData(chartDataYear);}
    
}


if (document.querySelector('input[name="periodRadios"]')) {
    document.querySelectorAll('input[name="periodRadios"]').forEach((elem) => {
        elem.addEventListener("change", function(event) {
            var item = event.target.value;
            selectedPeriod = event.target.getAttribute('id');
            // console.log(item);
            // console.log(typeof  name);
            PlotlyPlot(selectedPeriod);
        });
    });
}

document.getElementById('reversedRange').addEventListener('mouseup', function(e){
    // alert(e.target.value);
    tmp=e.target.value;
    minAmount=-tmp*tmp
    PlotlyPlot(selectedPeriod);
});

document.getElementById('positiveRange').addEventListener('mouseup', function(e){
    tmp=e.target.value;
    maxAmount=tmp*tmp
    PlotlyPlot(selectedPeriod);
});



