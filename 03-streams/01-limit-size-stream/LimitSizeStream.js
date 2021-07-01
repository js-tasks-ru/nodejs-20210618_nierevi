const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.bytesTransferred = 0;
    this.limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    this.bytesTransferred += chunk.length;

    if (this.bytesTransferred > this.limit) {
      callback(new LimitExceededError());
    } else {
      callback(null, chunk);
    }

  }
}

module.exports = LimitSizeStream;
