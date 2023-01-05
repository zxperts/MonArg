

let pdfArray = new Array();
let globalIsNewLine = false;        

// disable worker and set language
pdfjsLib.GlobalWorkerOptions.workerSrc = '';
// pdfjsLib.LocalizedStrings.setLanguage('en-us');

function readMyPdf(contents) {
    var stringData;
    pdfjsLib.getDocument(contents).promise.then(function (pdfDocumnet) {
        try {
            var textContainer;
            // get the first page
            for(let currPage = 1; currPage <= pdfDocumnet.numPages; currPage++) {
                pdfDocumnet.getPage(currPage).then(function(page) {
                    // render the page
                    var scale = 1;
                    var viewport = page.getViewport({scale: scale});
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    var renderContext = {
                        canvasContext: ctx,
                        viewport: viewport
                    };
                    page.render(renderContext).promise.then(function () {
                        // get the text content
                        return page.getTextContent();
                    }).then(async function (textContent) {
                        // create the text file
                        var textFile = null;
                        var data = new Blob([textContent.items.map(function (item) {
                            return item.str;
                        }).join('\n')], {type: 'text/plain'});
                        
                        var blobStringData= await convertBlobToString(data);
                        stringData=stringData+blobStringData;
                        parseLines(blobStringData);
                    });
                });
            };
        } catch (error) {
            // Handle the error
            alert("An error occurred: " + error.message);
        }
    });
    
    
};

function convertBlobToString(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function() {
            resolve(reader.result);
        };
        reader.onerror = function(error) {
            reject(error);
        };
        reader.readAsText(blob);
    });
}

function insertUpdateData(key, value, isNewObject) {
    
    // If the array is not empty, check if a new object should be created
    if (pdfArray.length === 0||isNewObject ||globalIsNewLine) {
        // If a new object should be created, create a new object and push it to the array
        pdfArray.push({[key]: value});
    } else if (key=="Date") {
        console.log("insertUpdateData, key: " + key + ", value: " + value );
        pdfArray[pdfArray.length - 1][key]=value;
        //console.log("insertUpdateData, pdfArray: " , pdfArray);
    }else if (key=="Montant") {
        pdfArray[pdfArray.length - 1][key]=value;
    } else {
        // If a new object should not be created, update the value of the specified key in the last object in the array
        pdfArray[pdfArray.length - 1][key] += " "+value.split(" ");
    }
    globalIsNewLine=false;
}


function containsDate(string) { 
    //verification for "dd/mm" or "dd-mm"
    const dateRegex = /\d{1,2}[\/-]\d{1,2}/;
    return dateRegex.test(string);
}

function convertDate(input) {
    // Use the Date object to get the current year
    const currentYear = new Date().getFullYear();
    
    // Split the input string into day and month using the separator (/ or -)
    const parts = input.split(/[/-]/);
    const day = parts[0];
    const month = parts[1];
    
    // Pad the day and month with leading zeros if necessary
    const paddedDay = day.padStart(2, "0");
    const paddedMonth = month.padStart(2, "0");
    
    // Return the converted date string
    return `${paddedDay}/${paddedMonth}/${currentYear}`;
}


function parseLines(dataString) {
    //console.log('Valeur à interpréter', dataString);
    
    let AmountRegex = /^([0-9]+\.)?[0-9]+(\,[0-9]{1,2})+$/;
    // Split the data string into an array of lines
    const lines = dataString.split("\n");
    let retNumValeur = 0;
    
    
    // Loop through the lines
    for (const line of lines) {
        // Split the line into an array of cells
        const cells = line.split(" ");
        
        // Create a new object
        //const obj = {};
        
        // Loop through the cells and add the cell values as key-value pairs to the object
        for (let i = 0; i < cells.length; i++) {
            //obj[i] = cells[i];
            //if (cells[i].indexOf("Virement") !== -1)
            if (containsDate(cells[i]))  { 
                insertUpdateData("Date",convertDate(cells[i]) , false) 
            }
            if (AmountRegex.test(cells[i])) {
                //The text contains only an amount.
                // insertUpdateData("Montant", cells[i], false);
                // globalIsNewLine=true;
                retNumValeur=cells[i];
                
            }
            if (/^[+-]$/.test(cells[i]))  {
                insertUpdateData("Montant", cells[i].concat(retNumValeur), false);
                //New line feeds will be inserted
                globalIsNewLine=true;
                //insert a dummy date if there is no date
                checkRecord(pdfArray);
                
            }
            else if (/^[a-zA-Z]+$/.test(cells[i])) {  
                insertUpdateData("Communications", cells[i], false ) 
            }
            
            // Push the object to the array
            //array.push(obj);
        }
        
        
    }
    pdfArray=pdfArray.filter(element => {
        const montant = element.Montant;
        return /[1-9]/.test(montant);
    });
    //remove duplicates in pdfArray
    pdfArray = [...new Set(pdfArray)];
    
    console.log("pdfArray:",pdfArray);
    //Going back monArg.js
    processData(pdfArray);
    
}

function checkRecord(arr) {
    // Get the last object in the array
    const lastObj = arr[arr.length - 1];
    
    // Check if the last object has a "Date" key
    if (!lastObj.hasOwnProperty("Date")) {
        // If it does not, insert a "Date" key with the value of the first day of the current year
        const currentYear = new Date().getFullYear();
        lastObj.Date = `${currentYear}-01-01`;
    }
    // Check if the last object has a "Montant" key
    if (!lastObj.hasOwnProperty("Montant")) {
        // If it does not, insert a "Montant" key with the value of 0
        lastObj.Montant = 0;
    }
    // Check if the last object has a "Communications" key
    if (!lastObj.hasOwnProperty("Communications")) {
        // If it does not, insert a "Communications" key with the value of 0
        lastObj.Communications = "Other";
    }
}










