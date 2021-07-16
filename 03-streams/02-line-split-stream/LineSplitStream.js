const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this._encoding = options.encoding;
    this._cashe = '';
    this._endsWithEOL = false;
  }

  pushChunk(lines) {
    const chunk = lines.shift();

    this.push(this._cashe + chunk);
    this._cashe = '';

    if(lines.length === 1 && !this._endsWithEOL) {
      this._cashe += lines.pop();
    }

    if(lines.length) {
      this.pushChunk(lines);
    }
  }

  _transform(chunk, _, callback) {
    const chunkStr = chunk.toString(this._encoding);
    this._endsWithEOL = chunkStr.slice(-os.EOL.length) === os.EOL;
        
    if (chunkStr.includes(os.EOL)) {
      const lines = chunkStr.split(os.EOL);
      this.pushChunk(lines);
    } else {
      this._cashe += chunkStr;
    }

    callback();
  }

  _flush(callback) {
    if(this._cashe) {
      this.push(this._cashe);
    }

    callback();
  }
}

module.exports = LineSplitStream;
