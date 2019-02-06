const deepEqual = require('deep-equal');

const utils = {};

utils._testConstructor = (constrName, val) => !utils.isUndefined(val) && !utils.isNull(val) && val.constructor && val.constructor.name === constrName;

utils.isGeneratorFunction = utils._testConstructor.bind(undefined, 'GeneratorFunction');

utils.isAsyncFunction = (val) => {
  if (!val) return false;
  const afcText = val.toString().toLocaleLowerCase().replace(/\n/g, '').replace(/ /g, '');
  return utils._testConstructor('AsyncFunction', val)
    || ((utils._testConstructor('Function', val) && (afcText.slice(afcText.indexOf('{')).indexOf('returnnewpromise(function($return,$error)') === 1)));
};

utils.isFunction = val => utils._testConstructor('Function', val) || utils.isAsyncFunction(val) || utils.isGeneratorFunction(val);

utils.isUndefined = val => typeof val === 'undefined';
utils.isArray = utils._testConstructor.bind(undefined, 'Array');
utils.isObject = val => ({}.toString.call(val)) === '[object Object]';
utils.isNativeObject = utils._testConstructor.bind(undefined, 'Object');
utils.isString = utils._testConstructor.bind(undefined, 'String');
utils.isNull = val => Object.prototype.toString.call(val) === '[object Null]';
utils.isBoolean = val => Object.prototype.toString.call(val) === '[object Boolean]';
utils.isNumber = Number.isFinite;
utils.isInteger = Number.isSafeInteger;
utils.isPositiveInteger = val => utils.isInteger(val) && (val >= 0);
utils.isIterable = val => (utils.isObject(val) ? !!Object.keys(val).length : false)
  || (utils.isArray(val) ? !!val.length : false);
utils.isJSON = (val) => {
  if (!utils.isString(val)) return false;
  try {
    const obj = JSON.parse(val);
    return !!obj && typeof obj === 'object';
  } catch (e) { /* ignore */
  }
  return false;
};

function _fnd(target, what) {
  if (utils.isArray(target)) {
    let idx = null;
    for (let i = 0; i < target.length; i += 1) {
      if (deepEqual(target[i], what)) {
        idx = i;
        break;
      }
    }
    if (!utils.isNull(idx)) {
      target.splice(idx, 1);
    }
  } else if (utils.isObject(target)) {
    const arr = Object.entries(target);
    let idx = null;
    for (let i = 0; i < arr.length; i += 1) {
      const pair = arr[i];
      if (deepEqual(pair[1], what)) {
        idx = pair[0];
        break;
      }
    }
    if (!utils.isNull(idx)) {
      delete target[idx];
    }
  }
}

utils.findAndDelete = (target, what) => {
  if (utils.isArray(what)) {
    for (let i = 0; i < what.length; i += 1) {
      _fnd(target, what[i]);
    }
  } else {
    _fnd(target, what);
  }
};

function _fnda(target, what) {
  if (utils.isArray(target)) {
    const idxs = [];
    /*  Array.entries(target).forEach((entry) => {
      if (deepEqual(entry[1], what)) {
        idxs.push(entry[0]);
      }
    }); */
    target.forEach((val, index) => {
      if (deepEqual(val, what)) {
        idxs.push(index);
      }
    });
    for (let i = idxs.length - 1; i >= 0; i -= 1) {
      target.splice(idxs[i], 1);
    }
  } else if (utils.isObject(target)) {
    const idxs = [];
    Object.entries(target).forEach((entry) => {
      if (deepEqual(entry[1], what)) {
        idxs.push(entry[0]);
      }
    });
    for (let i = idxs.length - 1; i >= 0; i -= 1) {
      delete target[idxs[i]];
    }
  }
}

utils.findAndDeleteAll = (target, what) => {
  if (utils.isArray(what)) {
    for (let i = 0; i < what.length; i += 1) {
      _fnda(target, what[i]);
    }
  } else {
    _fnda(target, what);
  }
};

utils.sleep = async (ms) => {
  const p = new Promise(((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  }));
  await p;
};

utils.task = async (context, method, ...args) => new Promise(((resolve) => {
  context[method](...args, function clb() {
    const result = [];
    for (const arg of arguments) {
      result.push(arg);
    }
    resolve(result);
  });
}));

module.exports = utils;
