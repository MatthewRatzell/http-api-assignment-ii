const http = require('http'); // pull in the http server module
const url = require('url'); // pull in the url module
// pull in the query string module
const query = require('querystring');

// pull in our html response handler file
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
// pull in our json response handler file
// const jsonHandler = require('./jsonResponses.js');

// set the port. process.env.PORT and NODE_PORT are for servers like heroku
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// function that originally gets called from our server addUser
// is hardcoded so atm this only works with addUser

// key:value object to look up URL routes to specific functions
const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/main.js': htmlHandler.getJavaScript,
    '/getCards': jsonHandler.getCards,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getCards': jsonHandler.getCardsMeta,
    notFound: jsonHandler.notFoundMeta,
  },
  POST: {
    '/addCard': jsonHandler.parseBody,
    notFound: jsonHandler.notFoundMeta,
  },
};

// function to handle requests
const onRequest = (request, response) => {
  // first we have to parse information from the url
  const parsedUrl = url.parse(request.url);
  // grab the query parameters (?key=value&key2=value2&etc=etc)
  // and parse them into a reusable object by field name
  const params = query.parse(parsedUrl.query);
  if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response, params);
  } else {
    urlStruct[request.method].notFound(request, response, params);
  }
};

// start HTTP server
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1:${port}`);
