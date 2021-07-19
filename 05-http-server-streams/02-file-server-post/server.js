const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

const setResponse = (res, code, message) => {
  res.statusCode = code;
  res.end(message);
}

server.on('request', async (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const isNestedPath = pathname.includes('/');
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (isNestedPath) {
        setResponse(res, 400, `bad request ${pathname}`);
        break;
      }

      const ws = fs.createWriteStream(filepath, {flags: 'wx'});

      const deleteFile = () => {
        ws.destroy();
        fs.unlinkSync(filepath);
      }

      ws.on('error', (err) => {
        if( err.code === 'EEXIST') {
          setResponse(res, 409, `file ${pathname} already exists`)
        } else {
          deleteFile();
          setResponse(res, 500, `unknown error`);
        }
      });
      ws.on('finish', () => {
        setResponse(res, 201, `file ${pathname} unloaded`);
      });

      const limitSizeStream = new LimitSizeStream({limit: 1_000_000});
      
      limitSizeStream.on('error', (err) => {
        deleteFile();
        if(err.code === 'LIMIT_EXCEEDED') {
          setResponse(res, 413, `limit exceeded`);
        } else {
          setResponse(res, 500, `unknown error`);
        }
      });

      req.on('error', (err) => {
        if (err.code === 'ECONNRESET') {
          deleteFile();
        }
      });

      req.pipe(limitSizeStream).pipe(ws);
      
      break;
    
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
