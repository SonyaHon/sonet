const uuid = require('uuid/v1');

class Events {
  constructor() {
    this.events = {};
    this.middlewares = [];
    this.middlewaresAfter = [];
  }

  on(name, callback) {
    const id = uuid();
    if (!this.events[name]) {
      this.events[name] = {};
    }
    this.events[name][id] = callback;
    return id;
  }

  once(name, callback) {
    const id = uuid();
    if (!this.events[name]) {
      this.events[name] = {};
    }
    this.events[name][id] = (...args) => {
      this.off(name, id);
      callback(...args);
    };
    return id;
  }

  off(name, id) {
    if (this.events[name]) {
      if (id) {
        delete this.events[name][id];
      } else {
        delete this.events[name];
      }
    }
  }

  use(middleware, opts = { after: false, shift: false }) {
    let arr = this.middlewares;
    if (opts.after) arr = this.middlewaresAfter;
    if (opts.shift) {
      arr.unshift(middleware);
    } else {
      arr.push(middleware);
    }
  }

  unuse(middleware) {
    if (this.middlewares.indexOf(middleware) !== -1) {
      this.middlewares.splice(this.middlewares.indexOf(middleware), 1);
    } else if (this.middlewaresAfter.indexOf(middleware) !== -1) {
      this.middlewaresAfter.splice(this.middlewaresAfter.indexOf(middleware), 1);
    }
  }

  emit(name, ...args) {
  }

  emitMultiple(events) {}

  async wait(name, ...args) {}

  async waitMultiple() {}
}

module.exports = Events;
