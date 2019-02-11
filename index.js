/* 
    Super Simple Hello World
    Author: Kenny Webb
    Pirple NodeJS Master Class
*/

/* Native Node */
const http = require('http'),
    url = require('url'),
    StringDecoder = require('string_decoder').StringDecoder;

/* My Modules */
const config = require('./config');

/* This handles all requests to the server and assigns a handler */
const serverHandler = (req = {},res = {}) => {
    const decoder = new StringDecoder('utf-8');
    let decodeBuffer = '';

    const parsedReq = url.parse(req.url, true);
    const trimmedPath = parsedReq.pathname.replace(/^\?+|\?+$/g, '');

    req.on('data', (data) => {
        decodeBuffer += decoder.write(data);
    });

    req.on('end', () => {
        decodeBuffer += decoder.end();
        let reqHandler = typeof (routes[trimmedPath]) !== 'undefined' ? routes[trimmedPath] : handlers.notFound;
        console.log(routes[trimmedPath], trimmedPath);
        reqHandler({
            'trimmedPath': trimmedPath,
            'queries': parsedReq.query,
            'method': req.method.toLowerCase(),
            'headers': req.headers,
            'payload': decodeBuffer
        }, (statusCode = 200, payload = {}) => {
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(JSON.stringify(payload));
            console.log('Server Response '+ req.method + ':'+ trimmedPath + ' |', statusCode, payload);
        });
    });
};

let handlers = {
    hello(data, callback) {
        // message seperate if logic to switch needs to be added ie.language
        let message = 'Hi there, Welcome to this Node flavoured Hello World!';
        callback(200, {'message': message});
    },
    notFound(data, callback){
        callback(404);
    }
};

let routes = {
    '/hello': handlers.hello
};

const thisServer = http.createServer((req, res) => {
    serverHandler(req, res);
});

thisServer.listen(config.port, () => {
    console.log('The Server is listenting on port ', config.port);
});
