    //Global variables here

    var valArray =[];

function createTableHeader(tableId){
    var tableHeaderRow = document.createElement('TR');
    var th1 = document.createElement('TH');
    var th2 = document.createElement('TH');
    var th3 = document.createElement('TH');
    var th4 = document.createElement('TH');
    th1.appendChild(document.createTextNode("ProductId"));
    th2.appendChild(document.createTextNode("Type"));
    th3.appendChild(document.createTextNode("Price"));
    th4.appendChild(document.createTextNode("Examine"));
    tableHeaderRow.appendChild(th1);
    tableHeaderRow.appendChild(th2);
    tableHeaderRow.appendChild(th3);
    tableHeaderRow.appendChild(th4);
    document.getElementById(tableId).appendChild(tableHeaderRow);
}

function updateTable(tableId,productArray){
    var tableBody = document.getElementById(tableId);
    //reset table
    while (tableBody.hasChildNodes()) {   
        tableBody.removeChild(tableBody.firstChild);
    }
    //create table header
    createTableHeader(tableId);
    //populate table rows
    for (i = 0; i < productArray.length; i++) {
        var tr = document.createElement('TR');
        var td1 = document.createElement('TD');
        var td2 = document.createElement('TD');
        var td3 = document.createElement('TD');
        var td4 = document.createElement('button');

        td4.addEventListener('click',function(){
            processSearchId(this.parentNode.firstChild.innerHTML);
        });


        td1.appendChild(document.createTextNode(productArray[i].id));
        td2.appendChild(document.createTextNode(productArray[i].type));
        td3.appendChild(document.createTextNode(productArray[i].price));
        td4.appendChild(document.createTextNode("Examine"));
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tableBody.appendChild(tr);
    }  
}
function clearTable(tableId){
    var tableBody = document.getElementById(tableId);
    //reset table
    //while(tableBody.rows.length > 0) {
     //   tableBody.deleteRow(0);
   // }
   while (tableBody.hasChildNodes()) {   
        tableBody.removeChild(tableBody.firstChild);
    }
}

api.searchAllProducts().then(function(value){
    updateTable('allTable',value);
});

function updateExaminedText(product){
    var outputString = "Product Id: " + product.id;
    outputString += "<br> Price: " + product.price;
    outputString += "<br> Type: " + product.type;
    document.getElementById("productText").innerHTML = outputString;
}

function clearExaminedText(){
    var outputString = "Product Id: ";
    outputString += "<br> Price: ";
    outputString += "<br> Type: ";
    document.getElementById("productText").innerHTML = outputString;
}

function getIntersection(arrA,arrB,searchedId){

    var samePrice = arrA;
    var sameType = arrB;
    var similarArray = [];
    samePrice.forEach(function(obj1){
        sameType.forEach(function(obj2){
            if(obj1.id == obj2.id && obj1.id != searchedId)
                similarArray.push(obj1);     
        });
    });

    return similarArray;

}

function processSearchId(searchId){
    api.searchProductById(searchId).then(function(val){
        return Promise.all([api.searchProductsByPrice(val.price,50),api.searchProductsByType(val.type),val]);
    }).then(function(val){
        var similarArray = getIntersection(val[0],val[1],val[2].id);
        updateExaminedText(val[2]);
        updateTable('similarTable',similarArray);
    }).catch(function(val){
        alert(val);
    });
}

function processSearchType(searchType){
    api.searchProductsByType(searchType).then(function(val){
       
        return val;
    }).then(function(val){
        var similarArray = [];
        var similarArray = val;        
        updateTable('similarTable',similarArray);
        valArray = [];
    }).catch(function(val){
        alert(val);
    });
}

function processSearchPrice(searchPrice){
    api.searchProductsByPrice(searchPrice,50).then(function(val){
        return val;
    }).then(function(val){
            var similarArray = [];
            var similarArray = val;        
            updateTable('similarTable',similarArray);
            valArray = [];
    }).catch(function(val){
        alert(val);
    });
}

document.getElementById("inputButton0").addEventListener('click',function(){
    processSearchId(document.getElementById("input0").value);
});

document.getElementById("inputButton1").addEventListener('click',function(){
    clearExaminedText();
    processSearchType(document.getElementById("input1").value);
});

document.getElementById("inputButton2").addEventListener('click',function(){
    clearExaminedText();
    processSearchPrice(document.getElementById("input2").value);
});

