// Read the data from CSV
function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
        console.log('no contents....')
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
    var dateParts = myDate0.split("/");                
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

function chartDataAdd(key,arrayx,arrayy) {
    return {                    
        x: arrayx,
        y: arrayy,
        // color:  key,
        name:  key,
        type: 'bar'
    }                 
}

// Plot the stacked bar chart 
function plotChartData(chartData) {
    Plotly.newPlot('plot', chartData, 
    layout
    );             
}

var entete_montant="";
var entete_date="";
var entete_communication="";

var chartDataDay = [];
var chartDataWeek = [];
var chartDataMonth = [];             
var chartDataYear= [];
var layout = {
    hovermode: "closest",
    barmode: 'relative',
    height: 800,
};
const monthNames = ["01 January", "02 February", "03 March", "04 April", "05 May", "06 June",
"July", "August", "September", "October", "November", "December"];



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
            
            
            var headerNames = Plotly.d3.keys(csv_data[0]);
            headerNames.forEach(element => {         
                
                if (element=="Contrepartie"){
                    console.log("Communication.....")
                    entete_communication=element
                }
                if (element=="Libellés"){
                    console.log("Communication.....")
                    entete_communication=element
                }
                
                var first_content=csv_data[0][element]
                if (checkwages(first_content)){
                    console.log("Number.....")
                    console.log(first_content)
                    entete_montant=element    
                }
                console.log("entete_date:",entete_date)
                if (validateDateWE(first_content) && entete_date===""){
                    console.log("Date.....")
                    console.log(first_content)
                    entete_date=element
                }
            });
            
            
            console.log('....les entetes:',entete_montant,entete_date,entete_communication)
            
            
            
            
            
            
            
            var arrayDay = [];
            var arrayWeek = [];
            var arrayMonth = [];
            var arrayYear = [];
            
            
            function pushArrayPeriod(arrayMonth,period) {
                //si pas encore cette communication  
                if (!arrayMonth[str_api]) {
                    arrayMonth[str_api] = [[],[]];
                }                
                arrayMonth[str_api][0].push(period);
                arrayMonth[str_api][1].push(str_idy);                
            }
            
            
            
            // Loop through all rows of the csv_data
            for(var i = 0; i < csv_data.length; i++) {
                
                d=csv_data[i]    
                var str_idxDay=dateWesternEurope(d[entete_date],"Day")
                var str_idxWeek=dateWesternEurope(d[entete_date],"Week")
                var str_idxMonth=dateWesternEurope(d[entete_date],"Month")
                var str_idxYear=dateWesternEurope(d[entete_date],"Year")  
                
                var str_idy=d[entete_montant]  
                
                str_api=d[entete_communication].replace(/ /g,'')
                if (str_api === null || str_api === '') {
                    str_api="...Tenue de cpte Performance Pack"
                }
                pushArrayPeriod(arrayDay,str_idxDay);
                pushArrayPeriod(arrayWeek,str_idxWeek);
                pushArrayPeriod(arrayMonth,str_idxMonth);
                pushArrayPeriod(arrayYear,str_idxYear);      
            }
            entete_date="";
            
            
            
            Object.keys(arrayDay).map(function(key, index) {                
                chartDataDay.push(chartDataAdd(key,arrayDay[key][0],arrayDay[key][1]));                  
            });
            Object.keys(arrayWeek).map(function(key, index) {                
                chartDataWeek.push(chartDataAdd(key,arrayWeek[key][0],arrayWeek[key][1]));                  
            });
            Object.keys(arrayMonth).map(function(key, index) {                
                chartDataMonth.push(chartDataAdd(key,arrayMonth[key][0],arrayMonth[key][1]));                  
            });
            Object.keys(arrayYear).map(function(key, index) {                
                chartDataYear.push(chartDataAdd(key,arrayYear[key][0],arrayYear[key][1]));                  
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
            plotChartData(chartDataMonth);
            
            
            
            
            
            
        }
    }
    
}

document.getElementById('formFile').addEventListener('change', readSingleFile, false);

document.getElementById('verInfo').addEventListener('change', togglePopup, false);


function togglePopup(){
    console.log('verInfo')
    document.getElementById("popup-1").classList.toggle("active");
}

function PlotlyPlot(period){
    console.log("La period", period)
    
    if (period=="Journalier") {plotChartData(chartDataDay);}
    if (period=="Hebdomadaire") {plotChartData(chartDataWeek);}
    if (period=="Mensuel") {plotChartData(chartDataMonth);}
    if (period=="Annuel") {plotChartData(chartDataYear);}
    
}


if (document.querySelector('input[name="exampleRadios"]')) {
    document.querySelectorAll('input[name="exampleRadios"]').forEach((elem) => {
        elem.addEventListener("change", function(event) {
            var item = event.target.value;
            var name = event.target.getAttribute('id');
            console.log(item);
            console.log(typeof  name);
            PlotlyPlot(name);
        });
    });
}



