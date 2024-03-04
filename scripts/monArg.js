var entete_montant = "";
var entete_date = "";
var entete_communication = "";
var selectedPeriod = "Mensuel";
var minAmount = -10000;
var maxAmount = 10000;
var categoriser = false;


const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

var chartDataDay = [];
var chartDataWeek = [];
var chartDataMonth = [];
var chartDataYear = [];

var listCategorie = {};
var listCategorieMan = {};
var textLibelleInit ="";
var textCategorieInit = "";

var layout;


window.onload = function() {

    var x = document.getElementById("snackbarMain");
    x.innerText = "Les Filtres montants\n sont maintenant fonctionnels.";
    x.className = "show";
    setTimeout(function() {
        x.className = x.className.replace("show", "");
    }, 3000);
    //document.getElementById("filre_param").style.visibility = "hidden";
    

    document.getElementById('favcolor').value = RandomLightenDarkenColor();

    // createCategorie("Loisirs");
    // createCategorie("Frais financiers");
    // createCategorie("Shopping");
    // createCategorie("Nourritures & Boissons");
    // createCategorie("Salaire");
    // createCategorie("Logement");
    // createCategorie("Véhicule");
    // createCategorie("Transports");
    // createCategorie("Multimedia & PC");
    // createCategorie("Santé");
    // createCategorie("Bricolage");
    // createCategorie("Vêtement");
    // createCategorie("Investisement");
    // createCategorie("Education");
    // createCategorie("Education");

    //setDraggable();
    //getCategManuellle();

}



function setLayout() {
    layout = {
        legend: {
            traceorder: 'normal',
        },

        xaxis: {
            tickformat: '%B %Y'
        },
        hovermode: "closest",
        barmode: 'relative',
        height: 800,
    };
    if (selectedPeriod == "Hebdomadaire") {
        // layout = {
        //     xaxis: {tickformat:'Week %V'},
        // };
    }
}
setLayout();


var headerNames;

// Read the data from CSV
/**It reads the contents of the file and displays it in the browser.*/
function readSingleFile(e) {
    var fileIn = e.target.files[0];
    if (!fileIn) {
        //console.log('no contents....')
        return;
    }
    if (!(fileIn.type.includes("excel") || fileIn.type.includes("csv") || fileIn.type.includes("pdf"))) {
        alert("Le fichier n'est pas un csv...😱");
        return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
        var contents = e.target.result;

        if (fileIn.type.includes("pdf")) {
            //setTimeout(readPdf(contents), 2000);
            readMyPdf(contents);
        } else {
            startProcessing(e.target.result);
        }

    };
    reader.readAsDataURL(fileIn);
}


function sortObject(o) {
    var sorted = {},
        key, a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }
    // a.sort();
    a.sort(function(a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
}

function dateWesternEurope(d_Date, period) {
    var myDate0 = d_Date
    var dateParts = myDate0.split(/[/-]+/);
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])

    var dayObject = dateObject.getDate()
    var weekObject = getWeekNumber(dateObject)
    var monthObject = dateObject.getMonth() + 1
    var yearObject = dateObject.getFullYear()
    // if (period=="Month") {return [monthNames[monthObject],'-',dayObject].join('')}
    if (period == "Day") {
        return [yearObject, '-', monthObject, '-', dayObject].join('')
    }
    if (period == "Week") {
        return [yearObject, '-', weekObject].join('')
    }
    if (period == "Month") {
        return [yearObject, '-', monthObject].join('')
    }
    if (period == "Year") {
        return yearObject
    } else {
        return [yearObject, '-', monthObject].join('')
    }

}

/**
 * The function takes in a string and checks if it matches the format of a date in the form of
 * MM/DD/YYYY
 */
function validateDateWE(input) {
    var reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)?\d\d/;
    if (input.match(reg)) {
        return true;
    } else {
        return false
    }
}

/**
 * Given a date, return the week number of the year
 */
function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    // Return array of year and week number
    // return [d.getUTCFullYear(), weekNo];
    return weekNo;
}

/**
 * The function checks to see if the input is a valid number. 
 * The function returns true if the input is a valid number. 
 * The function returns false if the input is not a valid number. 
 */
function checkwages(input) {
    var validformat = /^\-?\d+(?:\,\d{0,2})$/;
    if (validformat.test(input)) {
        return true;
    }
    var validformat = /^\-?\d+(?:\.\d{0,2})$/;
    if (validformat.test(input)) {
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
function chartDataAdd(key, arrayx, arrayy, c_all) {
    key = key.toUpperCase()+"XX_XX";
    let t = new Array(arrayx.length);
    size = arrayx.length;
    while (size--) t[size] = key;

    var CatHover = listCategorieMan[key]|| "Pas de catégorie";
    listCategorie[key] = CatHover;

    return {
        x: arrayx,
        y: arrayy,
        z: CatHover,
        text: c_all,
        name: key,
        CatHover:CatHover,
        hovertext:CatHover,
        customdata: t,
        type: 'bar',
        hovertemplate: "<b>%{customdata}</b><br><br>" +
            "%{yaxis.title.text}: %{y}<br>" +
            "%{xaxis.title.text}: %{x}<br>" +
            "%{zaxis.title.text}: %{z}<br>" +
            "Categorie XXX: %{name} %{CatHover} %{hovertext}<br>" +
            "Communication: %{text}" +
            'Marker Color: %{marker.color}<br>' +
            '[Hover Label: %{hovertext}]'+
            'Custom Data: %{customdata[0]}'+
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

    if (!chartData || chartData.length < 1) {
        //console.log('no contents....')
        alert("Pas encore de fichier uploadé...😱");
        return;
    }
    //console.log('chartData length',chartData.length);


    var res = [];
    var resx_filtered = [];
    var resy_filtered = [];
    var rest_filtered = [];
    var chartDataFiltered = [];
    var chartDataFiltered2 = [];
    var filteredArray = [];

    for (var cd_i = 0; cd_i < chartData.length; cd_i++) {
        for (var i = 0; i < chartData[cd_i].y.length; i++) {
            checkAmount = Math.ceil(chartData[cd_i].y[i]);
            if (checkAmount >= minAmount && checkAmount <= maxAmount) {
                if (!res[cd_i]) res[cd_i] = [];
                res[cd_i].push(i);
            }
        }
        if (res[cd_i]) {
            // Pour ne garder que les index du filtre
            /* Filtering the data to only include the data points that are in the res array. */
            resx_filtered[cd_i] = chartData[cd_i].x.filter(function(eachElem, indexx) {
                return res[cd_i].indexOf(indexx) >= 0
            });
            resy_filtered[cd_i] = chartData[cd_i].y.filter(function(eachElem, indexy) {
                return res[cd_i].indexOf(indexy) >= 0
            });
            rest_filtered[cd_i] = chartData[cd_i].text.filter(function(eachElem, indexy) {
                return res[cd_i].indexOf(indexy) >= 0
            });
        } else {
            resx_filtered[cd_i] = [];
            resy_filtered[cd_i] = [];
            rest_filtered[cd_i] = [];
        }
        // Plot avec les filtres
        // let replaced = chartData[cd_i].name.map(el => listCategorie[el]);
        //console.log("replaced: "+replaced);

        var libelle2Replace = chartData[cd_i].name;

        if (categoriser == "true") {
            libelle2Replace = replaceByCategory(libelle2Replace); //⚠️
        }


        chartDataFiltered.push(chartDataAdd(libelle2Replace, resx_filtered[cd_i], resy_filtered[cd_i], rest_filtered[cd_i]));
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
    Plotly.newPlot('plot', chartDataFiltered2, layout);

    document.getElementById('plot').on('plotly_click', function(data){
        var pts = '';    
        for(var i=0; i < data.points.length; i++){    
            pts = 'x = '+data.points[i].x +'\n'+
                  'y = '+data.points[i].y.toPrecision(4) +'\n'+  
                  'Libelle = '+data.points[i].customdata+"-." + data.points[i].text + '\n\n';//" Mme Noemie Genin BE en Travaux maison BE "
                  
                  textLibelleInit=data.points[i].customdata.trim().toUpperCase();;
                  textCategorieInit=data.points[i].name||"Pas de catégorie";                  
                  set_valuexx(textLibelleInit,'textLibelle');
                  set_valuexx(textCategorieInit,'textCategorie');


                  document.getElementById("dragBoxLibelle").style.backgroundColor = RandomLightenDarkenColor();
                  document.getElementById("CategorieSS").style.backgroundColor = RandomLightenDarkenColor();

                  var generatedWordCategoryList= generateWordCategoryList(data.points[i].text , "dragBoxLibelle");
                  generateAllTask(generatedWordCategoryList,"dropBoxEditTransaction");
        }

        $("#EditItemModal").modal("show");
        alert('Changer le Libelle ou la Catégorie:\n\n'+pts);
        console.log('my_data',data);

    });

}

function pushFilteredArray(libelle2Replace, filteredArray, xxx, yyy, ttt) {
    //si pas encore cette communication
    if (!filteredArray[libelle2Replace]) {
        filteredArray[libelle2Replace] = [
            [],
            [],
            []
        ];
    }
    filteredArray[libelle2Replace][0] = filteredArray[libelle2Replace][0].concat(xxx);
    filteredArray[libelle2Replace][1] = filteredArray[libelle2Replace][1].concat(yyy);
    filteredArray[libelle2Replace][2] = filteredArray[libelle2Replace][2].concat(ttt);
}


/* Removing useless words from the text. */
var removeUselessWords = function(txt) {
    var uselessWordsArray = [
        "achatbancontact", "mistercash", "belnum", "rodecartex", "achatmaestro",
        "renceing", "retraitbancontact", "virementeurop", "domiciliationeurop",
        "xxxxxxxx", "bruxelles", "bank", "retraitself", "avisenannexe",
        "virement", "retraitmaestro", "xxxxxx", "fimaser", "Bancontact", "contactless",
        "appointements", "association", "avantages", "bar", "belgrade", "brussels", "centre",
        "champion", "contrat", "couleur", "courses", "crelan", "domiciliation", "ecommerce",
        "economie", "facture", "flawinne", "floreffe", "gembloux", "interruption", "kuringen",
        "mensuelle", "oiseau", "paiement", "performance", "permanent", "salzinnes", "schaerbeek",
        "service", "wallone", "belgrad", "bouge", "brussel", "carte", "eur", "faveur", "loisirs",
        "louvain", "malonne", "namur", "precedent", "suarlee", "wemmel", "votre",
        "undefined", "Virement", "donneur", "NOTPROVIDED", "Communication"
    ];

    var expStr = uselessWordsArray.join("|");
    return txt.replace(new RegExp('\\b(' + expStr + ')\\b', 'gi'), ' ')
        .replace(/\s{2,}/g, ' ');
}

/**
 * Find the longest word in a string
 */
function findLongestWord(str) {
    var longestWord = str.split(' ').reduce(function(longest, currentWord) {
        return currentWord.length > longest.length ? currentWord : longest;
    }, "");
    return longestWord;
}


function replaceByCategory(libelle2Replace) {
    return replaced = libelle2Replace.replace(/(\w+)/g, (match, key) => listCategorie[key] || match);
}


function startProcessing(contents) {
    var list_cat_ = [];
    var list_cat_ = [];
    var list_cat = [];
    // var field2=[];
    // Plotly.d3.csv("https://raw.githubusercontent.com/zxperts/hellodjango/master/csv/listCategorie2.csv",function(csv){processData2(csv)});

    var list_cat = [list_cat_, ['Ethias', 'Acinapolis', 'Grogon', 'Delhaize', 'Decathlon']]
    Plotly.d3.dsv(';')(contents, function(csv_data) {
        processData(csv_data);
        generateAllTask(listCategorie,"dropTargetCat");
    });
}

function demoProcessing() {
    Plotly.d3.csv("https://raw.githubusercontent.com/zxperts/hellodjango/master/csv/FebMi_aleatoire2.csv", function(csv_data) {
        processData(csv_data);
        //console.log('les données CSV',csv_data);
        generateAllTask(listCategorie,"dropTargetCat");//processData() ne sera pas appelée de manière asynchrone
    });
    
}



/**
 * It creates a dataset for the plotly chart.
 */
function processData(csv_data) {
    //console.log("csv_data loaded....", csv_data);


    headerNames = Plotly.d3.keys(csv_data[0]);
    headerNames.forEach(element => {

        if (element == "Contrepartie" || element.includes("Libell") || element == "Communications") {
            //console.log("Communication.....")
            entete_communication = element
        }

        var first_content = csv_data[0][element]

        //console.log("entete_date:",entete_date)
        if (validateDateWE(first_content) && entete_date === "") {
            //console.log("Date.....")
            //console.log(first_content)
            entete_date = element
        }
        if (element == "Montant") {
            entete_montant = element
        } else if (checkwages(first_content) && entete_montant === "") {
            //console.log("Number.....")
            //console.log(first_content)
            entete_montant = element
        }

    });

    if (!entete_montant || !entete_date || !entete_communication) {
        //console.log('Les entetes sont manquantes....')
        alert("Au moins une des entetes (Contrepartie,Montant ,  )est manquantes...😱", entete_montant + entete_date + entete_communication);
        return;
    }

    var arrayDay = [];
    var arrayWeek = [];
    var arrayMonth = [];
    var arrayYear = [];

    chartDataDay.length = 0;
    chartDataWeek.length = 0;
    chartDataMonth.length = 0;
    chartDataYear.length = 0;

    function pushArrayPeriod(communication_z, arrayPeriod, period) {
        //si pas encore cette communication  
        if (!arrayPeriod[communication_z]) {
            arrayPeriod[communication_z] = [
                [],
                [],
                []
            ];
        }
        arrayPeriod[communication_z][0].push(period);
        arrayPeriod[communication_z][1].push(montant_y);
        arrayPeriod[communication_z][2].push(communication_all);
        //console.log("montant_y",arrayPeriod[communication_z][1])
        //console.log(period,montant_y)
        //console.log(arrayPeriod)           
    }




    // Loop through all rows of the csv_data
    for (var i = 0; i < csv_data.length; i++) {

        d = csv_data[i]
        var str_idxDay = dateWesternEurope(d[entete_date], "Day")
        var str_idxWeek = dateWesternEurope(d[entete_date], "Week")
        var str_idxMonth = dateWesternEurope(d[entete_date], "Month")
        var str_idxYear = dateWesternEurope(d[entete_date], "Year")

        var montant_y = d[entete_montant]
        montant_y = montant_y.replace(',', '.');
        //console.log("montant_y",montant_y)
        communication_z = "";
        communication_all = "";
        headerNames.forEach(element => {
            communication_z = communication_z + " " + d[element]
        });
        communication_z = communication_z.replace(/[^a-zA-Z&]+/g, " ");
        //console.log(communication_z)
        communication_z = removeUselessWords(communication_z);
        communication_all = communication_z;
        communication_z = findLongestWord(communication_z);
        //console.log('communication_z: ',communication_z)
        if (communication_z === null || communication_z === '') {
            communication_z = "...Tenue de cpte Performance Pack"
        }
        pushArrayPeriod(communication_z, arrayDay, str_idxDay);
        pushArrayPeriod(communication_z, arrayWeek, str_idxWeek);
        pushArrayPeriod(communication_z, arrayMonth, str_idxMonth);
        pushArrayPeriod(communication_z, arrayYear, str_idxYear);
    }
    entete_date = "";
    arrayDay = sortObject(arrayDay);
    arrayWeek = sortObject(arrayWeek);
    arrayMonth = sortObject(arrayMonth);
    arrayYear = sortObject(arrayYear);




    // création du dataset pour le plot
    /* Creating a new array called chartDataDay and pushing the values from the arrayDay object
    into it. */
    Object.keys(arrayDay).map(function(key, index) {
        chartDataDay.push(chartDataAdd(key, arrayDay[key][0], arrayDay[key][1], arrayDay[key][2]));
    });
    Object.keys(arrayWeek).map(function(key, index) {
        chartDataWeek.push(chartDataAdd(key, arrayWeek[key][0], arrayWeek[key][1], arrayWeek[key][2]));
    });
    Object.keys(arrayMonth).map(function(key, index) {
        chartDataMonth.push(chartDataAdd(key, arrayMonth[key][0], arrayMonth[key][1], arrayMonth[key][2]));
    });
    Object.keys(arrayYear).map(function(key, index) {
        chartDataYear.push(chartDataAdd(key, arrayYear[key][0], arrayYear[key][1], arrayYear[key][2]));
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
    //console.log(categManuellle());
    //listCategorie = categManuellle();
    //console.log(listCategorie);

    document.getElementById("accordionFiltres").style.display = "block";




}



document.getElementById('formFile').addEventListener('change', readSingleFile, false);

function togglePopup() {
    //console.log('verInfo')
    document.getElementById("popup-1").classList.toggle("active");
}

/**
 * The function is called when the user selects a period. 
 */
function PlotlyPlot(selectedPeriod) {
    //console.log("La period", period)

    if (selectedPeriod == "Journalier") {
        plotChartData(chartDataDay);
    }
    if (selectedPeriod == "Hebdomadaire") {
        plotChartData(chartDataWeek);
    }
    if (selectedPeriod == "Mensuel") {
        plotChartData(chartDataMonth);
    }
    if (selectedPeriod == "Annuel") {
        plotChartData(chartDataYear);
    }

}

function setCategoriser(varCategoriser) {
    categoriser = varCategoriser;
    PlotlyPlot(selectedPeriod);
}


if (document.querySelector('input[name="periodRadios"]')) {
    document.querySelectorAll('input[name="periodRadios"]').forEach((elem) => {
        elem.addEventListener("change", function(event) {
            var item = event.target.value;
            selectedPeriod = event.target.getAttribute('id');
            //console.log(item);
            //console.log(typeof  name);
            PlotlyPlot(selectedPeriod);
        });
    });
}

document.getElementById('reversedRange').addEventListener('mouseup', function(e) {
    // alert(e.target.value);
    tmp = e.target.value;
    minAmount = tmp * Math.abs(tmp);
    PlotlyPlot(selectedPeriod);
});

document.getElementById('positiveRange').addEventListener('mouseup', function(e) {
    tmp = e.target.value;
    maxAmount = tmp * Math.abs(tmp);
    PlotlyPlot(selectedPeriod);
});

function categManuellle() {

    // listCategorie = JSON.parse("https://raw.githubusercontent.com/zxperts/MonArg/main/data/keyCategory.json");

    // $.getJSON("https://raw.githubusercontent.com/zxperts/MonArg/main/data/keyCategory.json", function(listCategorie) {
    //     // listCategorie=JSON.parse(listCategorie0);
    //     //console.log("listCategorie...",listCategorie); // this will show the info it in firebug console                
    //     // generateAllTask(listCategorie);
    //     // setStoredValue(listCategorie, listCategorie);
    // });

    generateAllTask(listCategorie,"dropTargetCat");
    setStoredValue(listCategorie, listCategorie);

    return listCategorie;


}

function getCategManuellle() {
    var listCategorieMan2 = {};
    // listCategorie = JSON.parse("https://raw.githubusercontent.com/zxperts/MonArg/main/data/keyCategory.json");

    $.getJSON("https://raw.githubusercontent.com/zxperts/MonArg/main/data/keyCategory.json", function(listCategorieMan2) {
        // listCategorie=JSON.parse(listCategorie0);
        //console.log("listCategorieMan...",listCategorieMan2); // this will show the info it in firebug console
        listCategorieMan = listCategorieMan2;
        // generateAllTask(listCategorie);
        // setStoredValue(listCategorie, listCategorie);
    });

    // return listCategorieMan2;


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

function toggleTheme() {
    var lightThemeLink = document.getElementById('light-theme');
    var darkThemeLink = document.getElementById('dark-theme');
    if (lightThemeLink.getAttribute('href') === 'styles/light.css') {
        lightThemeLink.setAttribute('href', 'styles/dark.css');
        darkThemeLink.setAttribute('href', 'styles/light.css');
    } else {
        lightThemeLink.setAttribute('href', 'styles/light.css');
        darkThemeLink.setAttribute('href', 'styles/dark.css');
    }
}

function replaceLibelle() {
    var textLibelleValue= document.getElementById("textLibelle").value;
    function replaceLibellePeriod(csv_data) {
        for (let i = 0; i < csv_data.length; i++) {
            //console.log('value from: '+csv_data[i].name+'or'+textLibelleInit+' to:'+textLibelleValue);
            //console.log(csv_data[i].name === textLibelleInit, 'csv_data[i].name === textLibelleInit');
            if (csv_data[i].name === textLibelleInit) {
            //console.log('value changed from: '+textLibelleInit+ ' to:'+textLibelleValue);
              csv_data[i].name = textLibelleValue;
            }
            if (csv_data[i].name.toUpperCase() === textLibelleInit.toUpperCase()) {
                //console.log('value changed from: '+textLibelleInit+ ' to:'+textLibelleValue);
                  csv_data[i].name = textLibelleValue;
            }
          }
    }

    replaceLibellePeriod(chartDataDay);
    replaceLibellePeriod(chartDataWeek);
    replaceLibellePeriod(chartDataMonth);
    replaceLibellePeriod(chartDataYear);

    taskDelete();

    PlotlyPlot(selectedPeriod);
  }

  function generateWordCategoryList(sentence, category) {
    var words = sentence.split(" ");
    var wordCategoryList = {};
    // Loop through the words array and add each word to the object with the specified category
    for (var i = 0; i < words.length; i++) {
      wordCategoryList[words[i]] = category;
    }
    // Return the word-category list object
    //console.log("wordCategoryList",wordCategoryList);
    //console.log("listCategorie",listCategorie);
    return wordCategoryList;
  }

    /* Sélectionner tous les éléments du document HTML qui ont un
    attribut "data-delete", puis les supprime du document. */
  function taskDelete(){
    const elementsToRemove = document.querySelectorAll('[data-delete]');
    elementsToRemove.forEach((element) => {
      element.remove();
    });
  }