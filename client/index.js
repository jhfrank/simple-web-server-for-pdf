#!/usr/bin/env node

console.log('client started');

function getFilesFromServer() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/files-for-selection');
    xhr.onload = (function() {
        if (xhr.status != 200) { // log error
            console.log(`error getting files for selection, status = ${xhr.status}, message = ${xhr.statusText}`);
        } else { // show the result
            console.log(`received response of length ${xhr.response.length} from server: `, xhr.response);
            displayFiles(xhr.responseText);
        }
    });
    xhr.send();
}

function displayFiles(responseText) {
    const responseObj = JSON.parse(responseText); // convert to an object
    if ('files' in responseObj) {
        const filesArray = responseObj['files']; // get array of file names
        const filesList = filesArray.map(fileName => {
            let li = document.createElement('li');
            li.textContent = fileName;
            li.setAttribute('style', 'cursor: pointer; color: blue');
            li.addEventListener("click", function() {getFile(fileName)});
            return li;
        });
        document.getElementById('file-list').append(... filesList);
    } else {
        console.log(`cannot display files, response = `, responseText);
    }
}

function getFile(fileName) {
    console.log('getting from server: ' + fileName);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/fetch-file');
    xhr.onload = (function() {
        if (xhr.status != 200) { // log error
            console.log(`error fetching file '${fileName}', status = ${xhr.status}, message = ${xhr.statusText}`);
        } else { // display file
            console.log(`received response of length ${xhr.response.length} from server: `, xhr.response);
            // displayFile(xhr.responseText);
        }
    });
    xhr.send();
}

getFilesFromServer();
