// library imports
import fs from 'fs';

// my imports
import * as logger from './logging.mjs';

// constants
const filesDir = './server/files';

// serve file with given mime type
const serveFile = (filePath, mimeType) => {
    return ((req, res) => {
        res.setHeader('Content-Type', mimeType);
        res.writeHead(200);
        res.end(fs.readFileSync(filePath));
    });
}

const homePage = serveFile('./public/index.html', 'text/html');
const favIcon = serveFile('./public/favicon.ico', 'image/ico');
const indexJs = serveFile('./client/index.js', 'text/javascript');

export {homePage, favIcon, indexJs};

// get list of files for selection
export function getFilesForSelection(req, res, searchParams) {
    fs.readdir(filesDir, (err, files) => {
        let resultStr;
        if (err) {
            logger.error(`error listing files in directory '${filesDir}': `, err)
            resultStr = JSON.stringify({"errorMsg": err.msg});
        } else {
            let filesFound = [];
            files.forEach(fileName => {
                // if (fileName.endsWith('.pdf')) {
                    filesFound.push(fileName);
                // }
            });
            logger.info(`found ${filesFound.length} files: `, filesFound)
            resultStr = JSON.stringify({"files": filesFound});
        }
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(resultStr);
    });
}

export function fetchFile(req, res, searchParams) {
    logger.info(`received /fetch-file with parameters: `, searchParams);
    res.setHeader('ContentType', 'application/text');
    res.writeHead(200);
    res.end('Hello world!');
}
