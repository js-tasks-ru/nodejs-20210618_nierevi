const url = require('url');
const http = require('http');
const path = require('path');
const { createReadStream } = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const isNestedPath = pathname.includes('/');
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (isNestedPath) {
        res.statusCode = 400;
        res.end('bad request');
      }

      const rs = createReadStream(filepath);
      rs.pipe(res);

      rs.on('error', (error) => {
        if (error.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('file not found');
        } else {
          res.statusCode = 500;
          res.end('something went wrong');
        }
      });
      
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
