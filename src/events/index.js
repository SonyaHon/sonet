const uuid = require('uuid/v1');
const utils = require('../utils');


class Index {
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
    utils.findAndDelete(this.middlewares, middleware);
    utils.findAndDelete(this.middlewaresAfter, middleware);
  }

  async emit(name, ...args) {
    const callbacks = this.events[name];
    Object.values(callbacks).forEach(async (value) => {
      // use all middleware
      let nArgs = args;
      for (const middleware of this.middlewares) {
        nArgs = middleware(name, nArgs);
      }
      // apply callback
      value(...nArgs);
      // use all after middleware
      for (const middleware of this.middlewaresAfter) {
        nArgs = middleware(name, nArgs);
      }
    });
  }

  emitMultiple(events) {
    events.forEach((evt) => {
      this.emit(evt.name, ...evt.args);
    });
  }

  async wait(name, ...args) {
    const callbacks = this.events[name];
    let nArgs = args;
    for (const key in callbacks) {
      for (const middleware of this.middlewares) {
        nArgs = await middleware(name, nArgs);
      }
      await callbacks[key](...nArgs);
      for (const middleware of this.middlewaresAfter) {
        nArgs = await middleware(name, nArgs);
      }
    }
  }

  async waitMultiple(events) {
    for (const evt of events) {
      await this.wait(evt.name, ...evt.args);
    }
  }
}

module.exports = Index;
