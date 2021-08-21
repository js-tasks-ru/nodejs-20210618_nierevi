const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

const setResponse = (res, code, message) => {
  res.statusCode = code;
  res.end(message);
}

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const isNestedPath = pathname.includes('/');
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (isNestedPath) {
        setResponse(res, 400, `bad request ${pathname}`);
        break;
      }
      
      req.on('error', (err) => {
        setResponse(res, 500, `unknown error: ${err.message}`);
      });

      fs.unlink(filepath, (err) => {
        if(err) {
          setResponse(res, 404, `there is no file '${pathname}'`);
          return;
        }
        setResponse(res, 200, `file '${pathname}' has been deleted`);
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
