#!/usr/bin/env node

console.log('client started');

UPDATE_MSGS_EVERY_SECS=5;
console.log(`after user identified, will update messages every ${UPDATE_MSGS_EVERY_SECS} seconds`);

var userName = '';

// runs in the browser only, no server interaction: gets user name and writes a greeting
function greetUser() {
    const fieldValue = document.getElementById('user-name').value;
    if (fieldValue.length == 0) return
    userName = fieldValue;
    console.log('got user name "' + userName + '"');
    document.getElementById('greeting').innerHTML = 'Hallo ' + userName + '!';
    document.getElementById('user-name').setAttribute("readonly", "true"); // prevent user from changing the name
    document.getElementById('message-section').style.visibility = "visible"; // show the messages section
    setInterval(updateMessages, UPDATE_MSGS_EVERY_SECS * 1000);
}
document.getElementById('greet-user').addEventListener('click', greetUser);

// 
function sendMessageToServer() {
    const theText = document.getElementById('the-message').value;
    const data = {
        user: userName,
        message: theText,
    }
    const dataStr = JSON.stringify(data);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/new-message');
    xhr.setRequestHeader('Content-Type', 'application/json');
    console.log('sending http POST to /new-message with data ', dataStr);
    xhr.send(dataStr);
    xhr.onload = function() {
        updateMessages();
    }
}
document.getElementById('send-message').addEventListener('click', sendMessageToServer);

function updateMessages() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/messages-for-user?usr=' + encodeURIComponent(userName));
    xhr.onload = (function() {
        if (xhr.status != 200) {
            console.log(`Error ${xhr.status}: ${xhr.statusText}`);
        } else { // show the result
            console.log(`received ${xhr.response.length} bytes of message data`);
            displayMessages(xhr.responseText);
        }
    });
    xhr.send();
}

function displayMessages(theMessages) {
    console.log('received messages for display', theMessages);
    const theMsgsObj = JSON.parse(theMessages); // convert to object
    if ('messages' in theMsgsObj) {
        const msgsArray = theMsgsObj['messages']; // get array of messages
        let msgs = '<b>Messages so far:</b><br/>'; // heading for message history
        for (let msg of msgsArray) {
            msgs += '<br/>' + msg; // append each message in a new line
        }
        document.getElementById('message-history').innerHTML = msgs; // display message history
    }
}
