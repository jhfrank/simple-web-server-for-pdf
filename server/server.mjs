// library imports
import {createServer} from 'http';

// my imports
import * as logger from './logging.mjs';
import {
    homePage,
    favIcon,
    indexJs,
    getFilesForSelection,
    fetchFile,
} from './handler.mjs';

// constants
const myPort = 3435

// dispatcher, mapping http VERB and /path to name of function (defined in handler.mjs) which returns a file
const dispatch = {
    'GET /': homePage,
    'GET /favicon.ico': favIcon,
    'GET /client/index.js': indexJs,
    'GET /files-for-selection': getFilesForSelection,
    'GET /fetch-file': fetchFile,
}

const myServer = createServer((req, res) => {
    const reqURL = new URL('http://' + req.headers.host + req.url);
    const rq = req.method + ' ' + reqURL.pathname;
    console.log('');
    logger.info('received', rq, reqURL.searchParams != null ? reqURL.searchParams : '');
    if (rq in dispatch) {
        dispatch[rq](req, res, reqURL.searchParams);
    } else {
        logger.warning('no handler for', rq)
    }
});

logger.info('listening on port', myPort);
myServer.listen(myPort);
