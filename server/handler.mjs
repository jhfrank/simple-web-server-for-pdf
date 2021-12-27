// library imports
import fs from 'fs';

// my imports
import * as logger from './logging.mjs';

// constants
const filesDir = './server/files/';

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
        const resultStr;
        if (err) {
            logger.error(`error listing files in directory '${filesDir}': `, err)
            resultStr = JSON.stringify({"errorMsg": err.msg});
        } else {
            const filesFound = [];
            files.forEach(fileName => {
                filesFound.push(fileName);
            });
            logger.info(`found ${filesFound.length} files: `, filesFound)
            resultStr = JSON.stringify({"files": filesFound});
        }
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(resultStr);
    });
}

const mimeTypes = {
    'pdf': 'application/pdf',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'txt': 'text/plain',
};

export function fetchFile(req, res, searchParams) {
    logger.info(`received /fetch-file with parameters: `, searchParams);
    if (searchParams.has('file')) {
        const fileName = searchParams.get('file');
        const filePath = filesDir + fileName;
        const suffix = /.*\.([a-zA-Z]+)$/.exec(fileName)[1]; // TODO: this will fail if filename does not have a dot-separated suffix
        if (suffix in mimeTypes) {
            const fileContent = fs.readFileSync(filePath); // file content original byte stream
            const fileContentBase64 = fileContent.toString('base64'); // file content base64 encoded for transmission
            const mimeType = mimeTypes[suffix]; // mime type, derived from file extension
            logger.info(`will try to send file '${filePath}' with mime type '${mimeType}'`);
            res.setHeader('Content-Type', mimeType);
            res.writeHead(200);
            res.end(fileContentBase64); // send base64 encoded file content
        } else {
            res.writeHead(500);
            res.end(`file '${fileName}' has unknown mime type`);
        }
    } else {
        res.writeHead(500);
        res.end(`no 'file' property found in URL parameters`);
    }
}
