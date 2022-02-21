const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const javascript = fs.readFileSync(`${__dirname}/main.js`);
const cardTemp = fs.readFileSync(`${__dirname}/sw-card.js`);
// function to get the index page
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// function to get css page
const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

// function to get css page
const getJavaScript = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'module' });
  response.write(javascript);
  response.end();
};

// function to get css page
const getCardTemp = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/javascript' });
  response.write(cardTemp);
  response.end();
};
// set out public exports
module.exports = {
  getIndex,
  getCSS,
  getJavaScript,
  getCardTemp
};
