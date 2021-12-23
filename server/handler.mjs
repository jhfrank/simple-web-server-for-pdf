// library imports
import {readFileSync} from 'fs';

// my imports
import * as logger from './logging.mjs';

// serve file with given mime type
const serveFile = (filePath, mimeType) => {
    return ((req, res) => {
        res.setHeader('Content-Type', mimeType);
        res.writeHead(200);
        res.end(readFileSync(filePath));
    });
}

const homePage = serveFile('./public/index.html', 'text/html');
const favIcon = serveFile('./public/favicon.ico', 'image/ico');
const indexJs = serveFile('./client/index.js', 'text/javascript');

export {homePage, favIcon, indexJs};

// process incoming message (in POST body)
export function newMessage(req, res) {
    let data = [];
    // large data may come in more than one 'chunk' of bytes; need to combine those
    req.on('data', function(chunk) {
        data.push(chunk);
    });
    // the last chunk has arrived with this req, we can process the data now
    req.on('end', function() {
        logger.info(`received message data ${data}`);
        const dataObj = JSON.parse(data); // convert string back to object { user: '...', message: '...' }
        addMessage(dataObj); // add message to the message history 
        res.setHeader('Content-Length', '0');
        res.writeHead(200); // tell the browser that the message was received
        res.end(); 
    });
}

// the message histories of all users
const userMessages = {};

function addMessage(dataObj) {
    const usr = dataObj.user;
    const msg = dataObj.message;
    if (!(usr in userMessages)) {
        userMessages[usr] = []; // initialize array of messages for new user
    }
    userMessages[usr].push(logger.utcTimeForLogging() + ' ' + msg); // add the new message for this user
    logger.debug('all messages from all users\n', userMessages);
}

export function getMessagesForUser(req, res, searchParams) {
    const usr = searchParams.get('usr');
    logger.info(`retrieving messages for user '${usr}'`);
    const result = {
        'messages': userMessages[usr] // only return the messages of the user requested
    }
    const resultStr = JSON.stringify(result)
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(resultStr);
}
