// library imports
import {createServer} from 'http';

// my imports
import * as logger from './logging.mjs';
import {
    homePage,
    favIcon,
    indexJs,
    newMessage,
    getMessagesForUser,
} from './handler.mjs';

// constants
const myPort = 3434

// dispatcher, mapping http VERB and /path to name of function (defined in handler.mjs) which returns a file
const dispatch = {
    'GET /': homePage,
    'GET /favicon.ico': favIcon,
    'GET /client/index.js': indexJs,
    'POST /new-message': newMessage,
    'GET /messages-for-user': getMessagesForUser,
}

const myServer = createServer((req, res) => {
    const reqURL = new URL('http://' + req.headers.host + req.url);
    const rq = req.method + ' ' + reqURL.pathname;
    console.log('');
    logger.info('received', rq);
    if (rq in dispatch) {
        dispatch[rq](req, res, reqURL.searchParams);
    } else {
        logger.warning('no handler for', rq)
    }
});

logger.info('listening on port', myPort);
myServer.listen(myPort);
