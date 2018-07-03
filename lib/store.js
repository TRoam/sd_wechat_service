const fs = require('fs');
const path = require('path');

class StoreHelper {
  constructor(filename) {
    this.filename = filename;
    this.read();
  }

  has(key) {
    return this.data[key];
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
const order = new StoreHelper(path.join(__dirname, '../data/order.txt'));

module.exports = {
  user,
  push,
  order,
  store: StoreHelper
};