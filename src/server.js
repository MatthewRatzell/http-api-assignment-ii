const http = require('http'); // pull in the http server module
const url = require('url'); // pull in the url module
// pull in the query string module

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
    '/getUsers': jsonHandler.getUsers,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getUsers': jsonHandler.getUsersMeta,
    notFound: jsonHandler.notFoundMeta,
  },
  POST: {
    '/addUser': jsonHandler.parseBody,
    notFound: jsonHandler.notFoundMeta,
  },
};

// function to handle requests
const onRequest = (request, response) => {
  // first we have to parse information from the url
  const parsedUrl = url.parse(request.url);

  // now we check to see if we have something to handle the
  // request. This syntax may look verbose, but essentially
  // what we are doing is indexing into urlStruct by the method
  // which returns another object. We then index into that object
  // by the pathname to get the handler. Inside the if, we can
  // use that same syntax to call the actual function.
  if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response);
  } else {
    urlStruct[request.method].notFound(request, response);
  }
};

// start HTTP server
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1:${port}`);
