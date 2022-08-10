var entete_montant="";
var entete_date="";
var entete_communication="";
var selectedPeriod="Mensuel";
var minAmount=-10000;
var maxAmount=10000;
var categoriser = false;


const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];

var chartDataDay = [];
var chartDataWeek = [];
var chartDataMonth = [];
var chartDataYear= [];
// var listCategorie = new Object();
var listCategorie ={};
// let listCategorie = [];

var layout;


window.onload = function() {
    
    var x = document.getElementById("snackbarMain");
    x.innerText ="Les Filtres montants\n sont maintenant fonctionnels.";
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    // document.getElementById("filre_param").style.visibility = "hidden";
    
    document.getElementById('favcolor').value=RandomLightenDarkenColor();
    createCategorie("Loisirs");
    createCategorie("Frais financiers");
    createCategorie("Shopping");
    createCategorie("Nourritures & Boissons");
    createCategorie("Salaire");
    createCategorie("Logement");
    createCategorie("Véhicule");
    createCategorie("Transports");
    createCategorie("Multimedia & PC");
    createCategorie("Santé");
    createCategorie("Bricolage");
    createCategorie("Vêtement");
    createCategorie("Investisement");
    createCategorie("Education");
    createCategorie("Education");
    
    setDraggable();

    // console.log("getStoredValue: ", getStoredValue(listCategorie));
    
    
}



function setLayout(){
    layout = {    
        legend: {traceorder: 'normal',},
        
        xaxis: {
            tickformat:'%B %Y'
        },
        hovermode: "closest",
        barmode: 'relative',
        height: 800,
    };
    if (selectedPeriod=="Hebdomadaire") {
        // layout = {
        //     xaxis: {tickformat:'Week %V'},
        // };
    }
}
setLayout();


var headerNames;

// Read the data from CSV
/**
* It reads the contents of the file and displays it in the browser.
* @param e - The event object.
* @returns The file contents are being returned as a base64 encoded string.
*/
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


/**
* It takes an object, creates an array of its keys, sorts the array, and then creates a new object
* with the sorted keys and their associated values.
* @param o - the object to sort
* @returns An object with the keys sorted alphabetically.
*/
function sortObject(o) {
    var sorted = {},
    key, a = [];
    
    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }
    // a.sort();
    a.sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
}

/**
* Given a date in the format "dd/mm/yyyy" return the day, week, month or year
* @param d_Date - The date to be converted.
* @param period - The period of time you want to group by.
* @returns the day, week, month, or year of the date.
*/
function dateWesternEurope(d_Date,period) {       
    var myDate0 = d_Date      
    var dateParts = myDate0.split(/[/-]+/);
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
    
    var dayObject=dateObject.getDate()
    var weekObject=getWeekNumber(dateObject)
    var monthObject=dateObject.getMonth()+1
    var yearObject=dateObject.getFullYear() 
    // if (period=="Month") {return [monthNames[monthObject],'-',dayObject].join('')}
    if (period=="Day") {return [yearObject,'-',monthObject,'-',dayObject].join('')}
    if (period=="Week") {return [yearObject,'-',weekObject].join('')}
    if (period=="Month") {return [yearObject,'-',monthObject].join('')}
    if (period=="Year") {return yearObject}
    else{return [yearObject,'-',monthObject].join('')}
    
}

/**
* The function takes in a string and checks if it matches the format of a date in the form of
* MM/DD/YYYY
* @param input - The input string to be validated.
* @returns a boolean value.
*/
function validateDateWE (input){
    var reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)?\d\d/;
    if (input.match(reg)) {
        return true;
    }
    else {
        return false
    }
}

/**
* Given a date, return the week number of the year
* @param d - The date to get the week number for.
* @returns The week number of the year.
*/
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

/**
* The function checks to see if the input is a valid number. 
* The function returns true if the input is a valid number. 
* The function returns false if the input is not a valid number. 
* @param input - The input string to be validated.
* @returns a boolean value.
*/
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

/**
* The function takes in a key, an array of x values, an array of y values, and an array of all the
* values. 
* It returns a dictionary with the x, y, text, name, customdata, type, and hovertemplate.
* @param key - The name of the data series.
* @param arrayx - the x-axis data
* @param arrayy - The y-axis values for the chart.
* @param c_all - the total number of communications for the given key
* @returns a dictionary with the following keys:
*     x: arrayx
*     y: arrayy
*     text: c_all
*     name:  key
*     customdata:t
*     type: 'bar'
*     hovertemplate:
*/
function chartDataAdd(key,arrayx,arrayy,c_all) {
    key= key.toUpperCase();
    let t = new Array(arrayx.length);
    size=arrayx.length;
    while(size--) t[size] = key;
    // console.log('key',key);
    // console.log('c_all',c_all);
    // console.log('t',t);
    
    // listCategorie["one"] = 1;.
    // listCategorie = {label:key,categorie:"Pas de Cat."};
    // listCategorie = {name:"John", age:31, city:"New York"}
    // listCategorie.push([key,"Pas de Cat."]);
    listCategorie[key] = "Pas de catégorie";
    // console.log("listCategorie: " + listCategorie);
    
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
        "Categorie XXX: %{name}<br>" +
        "Communication: %{text}" +
        "<extra></extra>"
    }
}

/**
* Plot the stacked bar chart  and
* It filters the data according to the min and max amount.
* @param chartData - the data to be plotted.
* @returns the filtered data.
*/
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
    var chartDataFiltered2 = [];
    var filteredArray = [];
    
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
            /* Filtering the data to only include the data points that are in the res array. */
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
        // let replaced = chartData[cd_i].name.map(el => listCategorie[el]);
        // console.log("replaced: "+replaced);
        
        var libelle2Replace=chartData[cd_i].name;
        
        if (categoriser=="true"){
            libelle2Replace=replaceByCategory(libelle2Replace);//⚠️
        }
        
        
        chartDataFiltered.push(chartDataAdd(libelle2Replace,resx_filtered[cd_i],resy_filtered[cd_i],rest_filtered[cd_i]));
        pushFilteredArray(libelle2Replace,
            filteredArray,
            resx_filtered[cd_i],
            resy_filtered[cd_i],
            rest_filtered[cd_i]
            )
        }
        
        Object.keys(filteredArray).map(function(key, index) {                
            chartDataFiltered2.push(chartDataAdd(key,
                filteredArray[key][0],
                filteredArray[key][1],
                filteredArray[key][2]
                ));
            });
            
            setLayout();    
            Plotly.newPlot('plot', chartDataFiltered2,layout); 
            
        }
        
        function pushFilteredArray(libelle2Replace,filteredArray,xxx,yyy,ttt) {
            //si pas encore cette communication
            if (!filteredArray[libelle2Replace]) {
                filteredArray[libelle2Replace] = [[],[],[]];
            }                
            filteredArray[libelle2Replace][0]=filteredArray[libelle2Replace][0].concat(xxx); 
            filteredArray[libelle2Replace][1]=filteredArray[libelle2Replace][1].concat(yyy);
            filteredArray[libelle2Replace][2]=filteredArray[libelle2Replace][2].concat(ttt); 
        }
        
        
        /* Removing useless words from the text. */
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
        
        /**
        * Find the longest word in a string
        * @param str - The string to find the longest word in.
        * @returns The longest word in the string.
        */
        function findLongestWord(str) {
            var longestWord = str.split(' ').reduce(function(longest, currentWord) {
                return currentWord.length > longest.length ? currentWord : longest;
            }, "");
            return longestWord;
        }
        
        
        function replaceByCategory(libelle2Replace){
            return replaced = libelle2Replace.replace(/(\w+)/g, (match,key)=>listCategorie[key]||match);
        }
        
        
        function displayContents(contents) {
            
            var list_cat_=[];
            
            
            
            var list_cat_=[];
            var list_cat=[];
            // var field2=[];
            
            // Plotly.d3.csv("https://raw.githubusercontent.com/zxperts/hellodjango/master/csv/listCategorie2.csv",function(csv){processData2(csv)});
            
            processData2();
            // function processData2(csv) {
            function processData2() {
                // csv.map(function(d){
                //     list_cat_.push(d.libelle);
                // })
                
                
                var list_cat = [list_cat_,['Ethias','Acinapolis','Grogon','Delhaize','Decathlon']]       
                
                Plotly.d3.dsv(';')(contents,  function(csv_data){ processData(csv_data) } );
                
                
                
                /**
                * It creates a dataset for the plotly chart.
                * @param csv_data - The data to be processed.
                */
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
                    
                    
                    /* The code is creating a new array for each unique communication_z. The array contains
                    three sub-arrays:
                    - The first sub-array contains the period of each transaction
                    - The second sub-array contains the amount of each transaction
                    - The third sub-array contains the description of each transaction */
                    function pushArrayPeriod(communication_z,arrayPeriod,period) {
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
                        pushArrayPeriod(communication_z,arrayDay,str_idxDay);
                        pushArrayPeriod(communication_z,arrayWeek,str_idxWeek);
                        pushArrayPeriod(communication_z,arrayMonth,str_idxMonth);
                        pushArrayPeriod(communication_z,arrayYear,str_idxYear);      
                    }
                    entete_date="";
                    arrayDay=sortObject(arrayDay);
                    arrayWeek=sortObject(arrayWeek);
                    arrayMonth=sortObject(arrayMonth);
                    arrayYear=sortObject(arrayYear);
                    
                    
                    
                    
                    // création du dataset pour le plot
                    /* Creating a new array called chartDataDay and pushing the values from the arrayDay object
                    into it. */
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
                    console.log(categManuellle());
                    listCategorie=categManuellle();
                    // console.log(listCategorie);
                    
                    document.getElementById("filre_param").style.visibility = "visible";
                    
                    
                    
                    
                    
                    
                    
                }
            }
            
        }
        
        document.getElementById('formFile').addEventListener('change', readSingleFile, false);
        
        // document.getElementById('verInfo').addEventListener('change', togglePopup, false);
        
        
        /**
        * The function toggles the class of the div with the id of "popup-1" between active and not active
        */
        function togglePopup(){
            // console.log('verInfo')
            document.getElementById("popup-1").classList.toggle("active");
        }
        
        /**
        * The function is called when the user selects a period. 
        * 
        * It then calls the plotChartData function with the appropriate data
        * @param selectedPeriod - The period selected by the user.
        */
        function PlotlyPlot(selectedPeriod){
            // console.log("La period", period)
            
            if (selectedPeriod=="Journalier") {plotChartData(chartDataDay);}
            if (selectedPeriod=="Hebdomadaire") {plotChartData(chartDataWeek);}
            if (selectedPeriod=="Mensuel") {plotChartData(chartDataMonth);}
            if (selectedPeriod=="Annuel") {plotChartData(chartDataYear);}
            
        }
        
        function setCategoriser(varCategoriser){
            categoriser=varCategoriser;
            PlotlyPlot(selectedPeriod);
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
            minAmount=tmp*Math.abs(tmp);
            PlotlyPlot(selectedPeriod);
        });
        
        document.getElementById('positiveRange').addEventListener('mouseup', function(e){
            tmp=e.target.value;
            maxAmount=tmp*Math.abs(tmp);
            PlotlyPlot(selectedPeriod);
        });
        
        function categManuellle(){

            // listCategorie = JSON.parse("https://raw.githubusercontent.com/zxperts/MonArg/main/keyCategory.json");

            $.getJSON("https://raw.githubusercontent.com/zxperts/MonArg/main/keyCategory.json", function(listCategorie) {
                // listCategorie=JSON.parse(listCategorie0);
                console.log("listCategorie...",listCategorie); // this will show the info it in firebug console                
                generateAllTask(listCategorie);
                setStoredValue(listCategorie, listCategorie);
            });
            
            return listCategorie;


            // listCategorie["ABBAYEDEVILLERS"]="Loisirs";
            // listCategorie["ABBEVILLE"]="Loisirs";
            // listCategorie["ACOMPTE"]="Frais financiers";
            // listCategorie["ACTION"]="Shopping";
            // listCategorie["ADELINE"]="Loisirs";
            // listCategorie["ADIFA"]="Nourritures & Boissons";
            // listCategorie["ADMINISTRATION"]="Frais financiers";
            // listCategorie["ADSL"]="Loisirs";
            // listCategorie["AETERNA"]="Loisirs";
            // listCategorie["AGATSUKAN"]="Loisirs";
            // listCategorie["AGRICOVERT"]="Nourritures & Boissons";
            // listCategorie["ALDI"]="Nourritures & Boissons";
            // listCategorie["ALIMENTERRE"]="Nourritures & Boissons";
            // listCategorie["ALLOCATION"]="Salaire";
            // listCategorie["ALLOCATIONS"]="Salaire";
            // listCategorie["ALPISPORT"]="Loisirs";
            // listCategorie["ALTEZZA"]="Nourritures & Boissons";
            // listCategorie["AMANDINE"]="Loisirs";
            // listCategorie["AMRIT"]="Nourritures & Boissons";
            // listCategorie["ANCOR"]="Nourritures & Boissons";
            // listCategorie["ANDENNANDENNE"]="Loisirs";
            // listCategorie["ANDENNE"]="Salaire";
            // listCategorie["ANDERLECHT"]="Nourritures & Boissons";
            // listCategorie["ANNIVERSAIRE"]="Loisirs";
            // listCategorie["APPROVISIONNEMENT"]="Salaire";
            // listCategorie["ARCHITECT"]="Logement";
            // listCategorie["ASINERIE"]="Loisirs";
            // listCategorie["ASSURANCE"]="Frais financiers";
            // listCategorie["ASTERIA"]="Nourritures & Boissons";
            // listCategorie["ATELIER"]="Loisirs";
            // listCategorie["ATTRACTIE"]="Loisirs";
            // listCategorie["AUDERGHEM"]="Véhicule";
            // listCategorie["AUSTRALIAN"]="Nourritures & Boissons";
            // listCategorie["AUTO"]="Véhicule";
            // listCategorie["AUTOROUTE"]="Transports";
            // listCategorie["AUTOROUTES"]="Transports";
            // listCategorie["AUTOSECURITE"]="Véhicule";
            // listCategorie["AUVELAIS"]="Nourritures & Boissons";
            // listCategorie["AXA"]="Frais financiers";
            // listCategorie["BALADINS"]="Loisirs";
            // listCategorie["BE"]="Nourritures & Boissons";
            // listCategorie["BEAUCOUP"]="Loisirs";
            // listCategorie["BELBELGRADE"]="Nourritures & Boissons";
            // listCategorie["BELFIUS"]="Frais financiers";
            // listCategorie["BELGE"]="Nourritures & Boissons";
            // listCategorie["BELGIUM"]="Multimedia & PC";
            // listCategorie["BELGRADBELGRADE"]="Nourritures & Boissons";
            // listCategorie["BELGRBELGRADE"]="Nourritures & Boissons";
            // listCategorie["BELGRNAMUR"]="Nourritures & Boissons";
            // listCategorie["BENEDICTE"]="Loisirs";
            // listCategorie["BENJAMINE"]="Loisirs";
            // listCategorie["BERDIFF"]="Loisirs";
            // listCategorie["BERNARD"]="Nourritures & Boissons";
            // listCategorie["BETE"]="Nourritures & Boissons";
            // listCategorie["BIENVENUE"]="Loisirs";
            // listCategorie["BIERWART"]="Nourritures & Boissons";
            // listCategorie["BIGARD"]="Logement";
            // listCategorie["BIO"]="Nourritures & Boissons";
            // listCategorie["BIOCAP"]="Nourritures & Boissons";
            // listCategorie["BLAIMONT"]="Nourritures & Boissons";
            // listCategorie["BORREJAMBES"]="Multimedia & PC";
            // listCategorie["BOUABSA"]="Nourritures & Boissons";
            // listCategorie["BOULANGERIE"]="Nourritures & Boissons";
            // listCategorie["BOVERIE"]="Nourritures & Boissons";
            // listCategorie["BRANDEN"]="Santé";
            // listCategorie["BRESSOUX"]="Nourritures & Boissons";
            // listCategorie["BRICO"]="Bricolage";
            // listCategorie["BRICOLAGE"]="Bricolage";
            // listCategorie["BRUGELETTE"]="Loisirs";
            // listCategorie["BUNGALOW"]="Loisirs";
            // listCategorie["BVBA"]="Nourritures & Boissons";
            // listCategorie["BVBAKNOKKE"]="Loisirs";
            // listCategorie["C&A"]="Vêtement";
            // listCategorie["CALIMERO"]="Vêtement";
            // listCategorie["CAMEO"]="Vêtement";
            // listCategorie["CARAVANING"]="Loisirs";
            // listCategorie["CARBURANT"]="Transports";
            // listCategorie["CERTINERGIE"]="Logement";
            // listCategorie["CHAMPIONCHAMPION"]="Shopping";
            // listCategorie["CHANGEMENT"]="Investisement";
            // listCategorie["CHARLIER"]="Logement";
            // listCategorie["CHARLOTTE"]="Nourritures & Boissons";
            // listCategorie["CHR"]="Santé";
            // listCategorie["CHRETIENNE"]="Santé";
            // listCategorie["CIRQUE"]="Loisirs";
            // listCategorie["CITADELLE"]="Loisirs";
            // listCategorie["COLRUYT"]="Nourritures & Boissons";
            // listCategorie["COMMUNALE"]="Education";
            // listCategorie["COMMUNALWANZE"]="Education";
            // listCategorie["COMMUNICATION"]="Frais financiers";
            // listCategorie["COMPLETS"]="Education";
            // listCategorie["CONSULTANT"]="Logement";
            // listCategorie["CORBAIS"]="Vêtement";
            // listCategorie["COTISATION"]="Loisirs";
            // listCategorie["COURAN"]="Education";
            // listCategorie["COUTURIER"]="Vêtement";
            // listCategorie["CREAM"]="Nourritures & Boissons";
            // listCategorie["CRF"]="Nourritures & Boissons";
            // listCategorie["CUISINE"]="Logement";
            // listCategorie["CUTABLE"]="Salaire";
            // listCategorie["DECATHLON"]="Vêtement";
            // listCategorie["DELHAIZE"]="Nourritures & Boissons";
            // listCategorie["DEMA"]="Bricolage";
            // listCategorie["DENTISTES"]="Santé";
            // listCategorie["DENTNAMUR"]="Santé";
            // listCategorie["DEPLACEMENTS"]="Transports";
            // listCategorie["DIRECT"]="Nourritures & Boissons";
            // listCategorie["DOMININAMECHE"]="Nourritures & Boissons";
            // listCategorie["DOZIER"]="Logement";
            // listCategorie["DREAMBABY"]="Shopping";
            // listCategorie["DREAMLAND"]="Shopping";
            // listCategorie["DRONGEN"]="Nourritures & Boissons";
            // listCategorie["DUCHENE"]="Nourritures & Boissons";
            // listCategorie["DUMONT"]="Nourritures & Boissons";
            // listCategorie["EGHEZEE"]="Nourritures & Boissons";
            // listCategorie["ELECTRABEL"]="facture";
            // listCategorie["EPARGNE"]="Investisement";
            // listCategorie["ERPENT"]="Nourritures & Boissons";
            // listCategorie["ESPRIT"]="Vêtement";
            // listCategorie["ETHIAS"]="Assuraces";
            // listCategorie["ETTERBEEK"]="Vêtement";
            // listCategorie["EUROPEAN"]="Nourritures & Boissons";
            // listCategorie["EUROPEANFORECOURTR"]="Nourritures & Boissons";
            // listCategorie["EXPO"]="Nourritures & Boissons";
            // listCategorie["EXPRESS"]="Transports";
            // listCategorie["FARMLLN"]="Nourritures & Boissons";
            // listCategorie["FELICIEN"]="Nourritures & Boissons";
            // listCategorie["FINANCE"]="Frais financiers";
            // listCategorie["FISCALITE"]="Fiscalité";
            // listCategorie["FLAFLAWINNE"]="Nourritures & Boissons";
            // listCategorie["FLAWINNENAMUR"]="Vêtement";
            // listCategorie["FLAWINNFLAWINNE"]="Vêtement";
            // listCategorie["FLOREFFLOREFFE"]="Loisirs";
            // listCategorie["FLORIAN"]="Logement";
            // listCategorie["FLYING"]="Nourritures & Boissons";
            // listCategorie["FONDAIRE"]="Logement";
            // listCategorie["FOOTBALL"]="Loisirs";
            // listCategorie["FRANCOISE"]="Investisement";
            // listCategorie["GEOMETRE"]="Logement";
            // listCategorie["GOURMAND"]="Nourritures & Boissons";
            // listCategorie["H&M"]="Vêtement";
            // listCategorie["HARVENGT"]="Nourritures & Boissons";
            // listCategorie["HASSEHASSELT"]="Bricolage";
            // listCategorie["HASSELT"]="Shopping";
            // listCategorie["HERSTAL"]="Nourritures & Boissons";
            // listCategorie["HOESELT"]="Transports";
            // listCategorie["HUBO"]="Bricolage";
            // listCategorie["IMAGINARIUM"]="Loisirs";
            // listCategorie["IMPOSITION"]="Investisement";
            // listCategorie["INSCRIPTION"]="Loisirs";
            // listCategorie["INSTANTAN"]="Loisirs";
            // listCategorie["INSURANCE"]="Assuraces";
            // listCategorie["INTERMARCHE"]="Nourritures & Boissons";
            // listCategorie["JAMBEJAMBES"]="Transports";
            // listCategorie["JAMBES"]="Nourritures & Boissons";
            // listCategorie["JAMJAMMEKE"]="Nourritures & Boissons";
            // listCategorie["JANVIER"]="Education";
            // listCategorie["JARDIN"]="Bricolage";
            // listCategorie["JBC"]="Vêtement";
            // listCategorie["JEUNESSES"]="Loisirs";
            // listCategorie["KAZIDOMI"]="Loisirs";
            // listCategorie["KEMSEKE"]="Loisirs";
            // listCategorie["KOKSIJDE"]="Loisirs";
            // listCategorie["KRUIDVAT"]="Shopping";
            // listCategorie["LB"]="Loisirs";
            // listCategorie["LIBRAIRIE"]="Loisirs";
            // listCategorie["LIDL"]="Nourritures & Boissons";
            // listCategorie["LILIBULLE"]="Loisirs";
            // listCategorie["LORENT"]="Nourritures & Boissons";
            // listCategorie["LORIS"]="Investisement";
            // listCategorie["LORISPAYER"]="Investisement";
            // listCategorie["LOVINFOSSE"]="Santé";
            // listCategorie["MAASMECHELE"]="Loisirs";
            // listCategorie["MAASMECHELEN"]="Loisirs";
            // listCategorie["MADUELECTRO"]="Multimedia & PC";
            // listCategorie["MAESTRO"]="Shopping";
            // listCategorie["MAILLARD"]="Shopping";
            // listCategorie["MALMALONNE"]="Nourritures & Boissons";
            // listCategorie["MALO"]="Nourritures & Boissons";
            // listCategorie["MALONMALONNE"]="Shopping";
            // listCategorie["MALONN"]="Bricolage";
            // listCategorie["MANIAS"]="Loisirs";
            // listCategorie["MARCHEMARCHE"]="Nourritures & Boissons";
            // listCategorie["MARTENS"]="Logement";
            // listCategorie["MATERNITE"]="Santé";
            // listCategorie["MAXI"]="Loisirs";
            // listCategorie["MOBILE"]="Assuraces";
            // listCategorie["MULTIPHARMA"]="Santé";
            // listCategorie["MUNSI"]="Investisement";
            // listCategorie["MUTUALISTE"]="Assuraces";
            // listCategorie["NAD"]="Nourritures & Boissons";
            // listCategorie["NAMJAMBES"]="Nourritures & Boissons";
            // listCategorie["NAMTATION"]="Sport";
            // listCategorie["NAMURNAMUR"]="Nourritures & Boissons";
            // listCategorie["NANINNE"]="Loisirs";
            // listCategorie["NATUREL"]="Loisirs";
            // listCategorie["NEUVILLE"]="Loisirs";
            // listCategorie["NIKALAICHANKA"]="Shopping";
            // listCategorie["NOEMIE"]="Investisement";
            // listCategorie["NOTTIGNIES"]="Transports";
            // listCategorie["OHGREEN"]="Loisirs";
            // listCategorie["OLIVIEGHEZEE"]="Nourritures & Boissons";
            // listCategorie["OLIVIER"]="Nourritures & Boissons";
            // listCategorie["ONLINE"]="Loisirs";
            // listCategorie["OOSTDUINKERKE"]="Loisirs";
            // listCategorie["OTTIGNIES"]="Transports";
            // listCategorie["OTTIGNOTTIGNIES"]="Transports";
            // listCategorie["PANIER"]="Nourritures & Boissons";
            // listCategorie["PAPYRUS"]="Loisirs";
            // listCategorie["PARKING"]="Transports";
            // listCategorie["PATISSERIE"]="Nourritures & Boissons";
            // listCategorie["PATRICIA"]="Loisirs";
            // listCategorie["PATRICK"]="Investisement";
            // listCategorie["PEDIATRIE"]="Santé";
            // listCategorie["PERCEPTION"]="Frais financiers";
            // listCategorie["PIROUETTE"]="Loisirs";
            // listCategorie["PISCINE"]="Loisirs";
            // listCategorie["PIZZARIA"]="Nourritures & Boissons";
            // listCategorie["PIZZERIA"]="Nourritures & Boissons";
            // listCategorie["POLICE"]="Transports";
            // listCategorie["PONANT"]="Santé";
            // listCategorie["PRECOMPTE"]="Frais financiers";
            // listCategorie["PROVINCIE"]="Loisirs";
            // listCategorie["PROVISION"]="Investisement";
            // listCategorie["PSYCHOMOTRICITE"]="Santé";
            // listCategorie["PTJ"]="Nourritures & Boissons";
            // listCategorie["PUBLICANNEE"]="Frais financiers";
            // listCategorie["PUMBO"]="Loisirs";
            // listCategorie["QUICK"]="Nourritures & Boissons";
            // listCategorie["RAMBURES"]="Nourritures & Boissons";
            // listCategorie["RAPHAEL"]="Nourritures & Boissons";
            // listCategorie["RECONFORT"]="Loisirs";
            // listCategorie["RECURRING"]="Frais financiers";
            // listCategorie["REGION"]="Frais financiers";
            // listCategorie["REMBOURSEMENBT"]="Loisirs";
            // listCategorie["REMBOURSEMENT"]="Santé";
            // listCategorie["REMUNERATION"]="Salaire";
            // listCategorie["RENFLOUEMENT"]="Investisement";
            // listCategorie["RENMANS"]="Nourritures & Boissons";
            // listCategorie["RESEARCH"]="Salaire";
            // listCategorie["RESERVATION"]="Loisirs";
            // listCategorie["RETRAIT"]="Frais financiers";
            // listCategorie["REVES"]="Loisirs";
            // listCategorie["ROLE"]="Investisement";
            // listCategorie["ROSERAIE"]="Loisirs";
            // listCategorie["SAINTE"]="Education";
            // listCategorie["SAINTGILLES"]="Nourritures & Boissons";
            // listCategorie["SALNAMUR"]="Nourritures & Boissons";
            // listCategorie["SAMBRE"]="Nourritures & Boissons";
            // listCategorie["SANSDEMELVD"]="Investisement";
            // listCategorie["SANTE"]="Santé";
            // listCategorie["SCANDALES"]="Loisirs";
            // listCategorie["SCARLET"]="Multimedia & PC";
            // listCategorie["SCHEINS"]="Shopping";
            // listCategorie["SCOLAIRE"]="Education";
            // listCategorie["SEBASTIEN"]="Loisirs";
            // listCategorie["SEPTEMBER"]="Education";
            // listCategorie["SERVICES"]="Nourritures & Boissons";
            // listCategorie["SNCB"]="Transports";
            // listCategorie["SPECIALISTE"]="Santé";
            // listCategorie["SPERANZA"]="Loisirs";
            // listCategorie["SPORTIVE"]="Loisirs";
            // listCategorie["SPY"]="Nourritures & Boissons";
            // listCategorie["STARBUCKS"]="Nourritures & Boissons";
            // listCategorie["STATION"]="Transports";
            // listCategorie["STEPHANE"]="Santé";
            // listCategorie["SUN"]="Nourritures & Boissons";
            // listCategorie["SUPERMARCH"]="Nourritures & Boissons";
            // listCategorie["SURGELES"]="Nourritures & Boissons";
            // listCategorie["TAO"]="Nourritures & Boissons";
            // listCategorie["TELEPHERIQUE"]="Loisirs";
            // listCategorie["TEMPLOUX"]="Loisirs";
            // listCategorie["TENDANCE"]="Nourritures & Boissons";
            // listCategorie["TENUE"]="Shopping";
            // listCategorie["TERROIRS"]="Shopping";
            // listCategorie["TOTALDALTYSA"]="Transports";
            // listCategorie["TRAFIC"]="Shopping";
            // listCategorie["TRAIN"]="Transports";
            // listCategorie["TRAITEMENT"]="Frais financiers";
            // listCategorie["TRAMPOLINE"]="Loisirs";
            // listCategorie["TRANSACTION"]="Frais financiers";
            // listCategorie["TRAVAUX"]="Logement";
            // listCategorie["TRONOME"]="Nourritures & Boissons";
            // listCategorie["VACANCES"]="Loisirs";
            // listCategorie["VALOPHAR"]="Loisirs";
            // listCategorie["VANDERSMISSEN"]="Loisirs";
            // listCategorie["VERITAS"]="Shopping";
            // listCategorie["VERLAINE"]="Transports";
            // listCategorie["VERLAIVERLAINE"]="Transports";
            // listCategorie["VERVALDAG"]="Frais financiers";
            // listCategorie["VILLE"]="Frais financiers";
            // listCategorie["VILLERS"]="Nourritures & Boissons";
            // listCategorie["VISA"]="Frais financiers";
            // listCategorie["VOTTEM"]="Nourritures & Boissons";
            // listCategorie["WALLON"]="Investisement";
            // listCategorie["WALLONIE"]="Frais financiers";
            // listCategorie["WALLONNE"]="Frais financiers";
            // listCategorie["WESTHOEK"]="Loisirs";
            // listCategorie["WETTEREN"]="Loisirs";
            // listCategorie["WIBRA"]="Shopping";
            // listCategorie["YR"]="Loisirs";
        }
        
        
        function getStoredValue(key) {
            if (localStorage) {
                // return localStorage.getItem(key);
                // return JSON.parse(window.localStorage.getItem("listCategorie"));
                return JSON.parse(window.localStorage.getItem(key));
            } else {
                return $.cookies.get(key);
            }
        }

        function setStoredValue(key, value) {
            if (localStorage) {
                // localStorage.setItem(key, value);
                //Convert object to JSON strings, and back in get
                window.localStorage.setItem(key, JSON.stringify(value));
            } else {
                $.cookies.set(key, value);
            }
        }