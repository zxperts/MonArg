

function waitForPDFJS(callback) {
    const startTime = Date.now();
    const interval = setInterval(function() {
        if (Date.now() - startTime >= 10000) {
            // PDF.js has not been included after 2 seconds, so stop trying
            clearInterval(interval);
            callback(new Error("PDF.js could not be loaded"));
        } else if (typeof PDFJS !== "undefined") {
            // PDF.js has been included, so stop trying and call the callback
            clearInterval(interval);
            callback(null);
        }
    }, 100);
}



function readPdf(pdfFfile) {
    
    // const pdfjs = require('pdfjs-dist');
    
    if (typeof PDFJS !== "undefined") {
        // PDFJS is defined and can be used
    } else {
        // throw new ReferenceError("Cannot access undefined variable");
    }
    
    
    // Load the PDF file using the File and FileReader APIs
    // const pdfFile = new File(["pdf-file-contents"], "filename.pdf");
    const pdfFile = new File(["pdf-file-contents"], pdfFfile);
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(pdfFile);
    
    // Once the PDF file is loaded, convert it to a TXT file using the PDF.js library
    fileReader.onload = function() {
        const pdfData = new Uint8Array(fileReader.result);
        const pdf = PDFJS.getDocument(pdfData);
        pdf.then(function(pdf) {
            pdf.getPage(1).then(function(page) {
                page.getTextContent().then(function(textContent) {
                    const txt = textContent.items.map(function(item) {
                        return item.str;
                    }).join("\n");
                    
                    // Save the TXT file using the File and FileSaver APIs
                    const txtFile = new Blob([txt], {type: "text/plain;charset=utf-8"});
                    saveAs(txtFile, "filename.txt");
                });
            });
        });
    }
}