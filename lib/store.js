const fs = require('fs');
const path = require('path');

class StoreHelper {
  constructor(filename) {
    this.filename = filename;
    this.read();
  }

  has(item) {
    return this.data.indexOf(item) !== -1;
  }

  append(item) {
    this.data.push(item);
  }

  read() {
    const content = fs.readFileSync(this.filename, 'utf8');

    this.data = content ? JSON.parse(content) : [];
  }

  flush(callback) {
    const content = JSON.stringify(this.data);

    fs.writeFile(this.filename, content, 'utf-8', (error) => {
      callback(error);
    });
  }

  flushSync() {
    const content = JSON.stringify(this.data);

    fs.writeFileSync(this.filename, content, 'utf-8');
  }
}

const user = new StoreHelper(path.join(__dirname, '../data/bind.txt'));
const push = new StoreHelper(path.join(__dirname, '../data/push.txt'));

module.exports = {
  user,
  push,
  store: StoreHelper
};