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
            const li = document.createElement('li');
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
    xhr.open('GET', '/fetch-file?file=' + fileName);
    xhr.onload = (function() {
        if (xhr.status != 200) { // log error
            console.log(`error fetching file '${fileName}', status = ${xhr.status}, message = ${xhr.statusText}`);
        } else { // display file
            const contentType = xhr.getResponseHeader('Content-Type');
            const responseBytes = xhr.response;
            const l = responseBytes.length;
            console.log(`received response of length ${l} with content type '${contentType}' from server: `, responseBytes.substring(0,25) + ' ... ' + responseBytes.substring(l-10, l));
            displayResult(responseBytes, contentType);
        }
    });
    xhr.send();
}

function displayResult(responseBase64, contentType) {
    switch(contentType) {
        case 'text/plain':
            const paragraph = document.createElement('p');
            const textSource = atob(responseBase64); // convert base64 character stream back to original bytes (i.e. readable text)
            paragraph.textContent = textSource; 
            document.getElementById('selected-file').innerHTML = "";
            document.getElementById('selected-file').appendChild(paragraph);
        break;
        case 'image/png':
        case 'image/jpeg':
            const image = document.createElement('img');
            const imageSource = 'data:' + contentType + ';base64,' + responseBase64; // no need to convert base64 character stream back to original bytes, browser will do it for us
            image.setAttribute('src', imageSource);
            image.setAttribute('width', '75%');
            document.getElementById('selected-file').innerHTML = "";
            document.getElementById('selected-file').appendChild(image);
        break;
        case 'application/pdf':
            // see https://stackoverflow.com/questions/58488416/open-base64-encoded-pdf-file-using-javascript-issue-with-file-size-larger-than
            const contentBlob = base64ToBlob(responseBase64, 'application/pdf'); // convert base64 character stream back to original bytes
            const contentAsURL = URL.createObjectURL(contentBlob);
            const iframe = document.createElement('iframe');
            iframe.setAttribute('width', '75%');
            iframe.setAttribute('height', '600px');
            iframe.setAttribute('src', contentAsURL);
            document.getElementById('selected-file').innerHTML = "";
            document.getElementById('selected-file').appendChild(iframe);
        break;
    } 
}

// see https://stackoverflow.com/questions/58488416/open-base64-encoded-pdf-file-using-javascript-issue-with-file-size-larger-than
function base64ToBlob(contentBase64, contentType = "application/octet-stream") {
    const contentBinary = atob(contentBase64); // convert base64 character strea to original byte stream
    const len = contentBinary.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        arr[i] = contentBinary.charCodeAt(i);
    }
    return new Blob([arr], {type: contentType} );
}

getFilesFromServer();
