const fs = require('fs');
const path = require('path');

class StoreHelper {
  constructor(filename) {
    this.filename = filename;
    this.read();
  }

  has(item) {
    const key = Object.keys(item)[0];
    return this.data[key] === item[key];
  }

  append(item) {
    const key = Object.keys(item)[0];
    this.data[key] = item[key];
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