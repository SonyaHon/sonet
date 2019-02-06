const assert = require('assert');
const Events = require('events');
const sonet = require('../index');

describe('Utils', () => {
  describe('isUndefined', () => {
    it('should return true only if undefined', () => {
      assert.strictEqual(sonet.utils.isUndefined(undefined), true);
      assert.strictEqual(sonet.utils.isUndefined(null), false);
      assert.strictEqual(sonet.utils.isUndefined(1), false);
      assert.strictEqual(sonet.utils.isUndefined({}), false);
    });
  });
  describe('isArray', () => {
    it('should return true only if Array', () => {
      assert.strictEqual(sonet.utils.isArray([]), true);
      assert.strictEqual(sonet.utils.isArray([1, 2, 3]), true);
      assert.strictEqual(sonet.utils.isArray({}), false);
      assert.strictEqual(sonet.utils.isArray(1), false);
    });
  });
  describe('isObject', () => {
    it('should return true only if Object', () => {
      assert.strictEqual(sonet.utils.isObject({}), true);
      assert.strictEqual(sonet.utils.isObject({ a: 1 }), true);
      assert.strictEqual(sonet.utils.isObject([]), false);
      assert.strictEqual(sonet.utils.isObject(1), false);
    });
  });
  describe('isString', () => {
    it('should return true only if String', () => {
      assert.strictEqual(sonet.utils.isString('xui'), true);
      assert.strictEqual(sonet.utils.isString(''), true);
      assert.strictEqual(sonet.utils.isString([1, 2, 3]), false);
      assert.strictEqual(sonet.utils.isString(0), false);
    });
  });
  describe('isNull', () => {
    it('should return true only if null', () => {
      assert.strictEqual(sonet.utils.isNull(null), true);
      assert.strictEqual(sonet.utils.isNull(undefined), false);
      assert.strictEqual(sonet.utils.isNull(0), false);
      assert.strictEqual(sonet.utils.isNull([]), false);
    });
  });
  describe('isBoolean', () => {
    it('should return true only if Boolean', () => {
      assert.strictEqual(sonet.utils.isBoolean(true), true);
      assert.strictEqual(sonet.utils.isBoolean(false), true);
      assert.strictEqual(sonet.utils.isBoolean(0), false);
      assert.strictEqual(sonet.utils.isBoolean(1), false);
      assert.strictEqual(sonet.utils.isBoolean([]), false);
      assert.strictEqual(sonet.utils.isBoolean({}), false);
    });
  });
  describe('isNumber', () => {
    it('should return true only if Number', () => {
      assert.strictEqual(sonet.utils.isNumber(1), true);
      assert.strictEqual(sonet.utils.isNumber(0.123), true);
      assert.strictEqual(sonet.utils.isNumber(false), false);
      assert.strictEqual(sonet.utils.isNumber('123'), false);
      assert.strictEqual(sonet.utils.isNumber([]), false);
      assert.strictEqual(sonet.utils.isNumber({}), false);
    });
  });
  describe('isInteger', () => {
    it('should return true only if Integer', () => {
      assert.strictEqual(sonet.utils.isInteger(1123), true);
      assert.strictEqual(sonet.utils.isInteger(-26), true);
      assert.strictEqual(sonet.utils.isInteger(0.123), false);
      assert.strictEqual(sonet.utils.isInteger('123'), false);
      assert.strictEqual(sonet.utils.isInteger([]), false);
      assert.strictEqual(sonet.utils.isInteger({}), false);
    });
  });
  describe('isIterable', () => {
    it('should return true only if Iterable', () => {
      assert.strictEqual(sonet.utils.isIterable([1, 2, 34]), true);
      assert.strictEqual(sonet.utils.isIterable({ a: 0, v: 'xui' }), true);
      assert.strictEqual(sonet.utils.isIterable(0.123), false);
      assert.strictEqual(sonet.utils.isIterable('123'), false);
      assert.strictEqual(sonet.utils.isIterable([]), false);
      assert.strictEqual(sonet.utils.isIterable({}), false);
    });
  });
  describe('isJSON', () => {
    it('should return true only if Integer', () => {
      assert.strictEqual(sonet.utils.isJSON(JSON.stringify({})), true);
      assert.strictEqual(sonet.utils.isJSON({ a: 0, v: 'xui' }), false);
      assert.strictEqual(sonet.utils.isJSON('""'), false);
      assert.strictEqual(sonet.utils.isJSON('123'), false);
      assert.strictEqual(sonet.utils.isJSON([]), false);
      assert.strictEqual(sonet.utils.isJSON({}), false);
    });
  });
  describe('isFunction', () => {
    it('should return true only if Integer', () => {
      assert.strictEqual(sonet.utils.isFunction(() => {}), true);
      assert.strictEqual(sonet.utils.isFunction(async () => {}), true);
      assert.strictEqual(sonet.utils.isFunction('123'), false);
      assert.strictEqual(sonet.utils.isFunction([]), false);
      assert.strictEqual(sonet.utils.isFunction({}), false);
    });
  });
  describe('isAsyncFunction', () => {
    it('should return true only if Integer', () => {
      assert.strictEqual(sonet.utils.isAsyncFunction(() => {}), false);
      assert.strictEqual(sonet.utils.isAsyncFunction(async () => {}), true);
      assert.strictEqual(sonet.utils.isAsyncFunction('123'), false);
      assert.strictEqual(sonet.utils.isAsyncFunction([]), false);
      assert.strictEqual(sonet.utils.isAsyncFunction({}), false);
    });
  });
  describe('sleep', () => {
    it('should wait for ms via await', async () => {
      const begin = Date.now();
      await sonet.utils.sleep(500);
      const res = Date.now() - begin;
      assert.strictEqual(sonet.utils.isPositiveInteger(res), true);
    });
  });
  describe('task', () => {
    it('should wait for result of callback function', async () => {
      const a = new Events();
      setTimeout(() => {
        a.emit('evt', 1, 2, 3);
      }, 100);
      const res = await sonet.utils.task(a, 'once', 'evt');
      assert.strictEqual(res.length, 3);
      assert.strictEqual(res[0], 1);
      assert.strictEqual(res[1], 2);
      assert.strictEqual(res[2], 3);
    });
  });
  describe('findAndDelete', () => {
    it('should delete only one entry if exists', () => {
      const arr = [1, 2, 3];
      sonet.utils.findAndDelete(arr, 2);
      assert.strictEqual(arr.length, 2);
      assert.strictEqual(arr[0], 1);
      assert.strictEqual(arr[1], 3);
    });
    it('should should delete all entries included if what is []', () => {
      const arr = [1, 2, 3];
      sonet.utils.findAndDelete(arr, [1, 3]);
      assert.strictEqual(arr.length, 1);
      assert.strictEqual(arr[0], 2);
    });
    it('should work with objects', () => {
      const obj = { a: 0, b: 1, c: 3 };
      sonet.utils.findAndDelete(obj, 1);
      assert.strictEqual(obj.b, undefined);
      assert.strictEqual(obj.a, 0);
      assert.strictEqual(obj.c, 3);
    });
    it('should work with objects and [] what', () => {
      const obj = { a: 0, b: 1, c: 3 };
      sonet.utils.findAndDelete(obj, [1, 3]);
      assert.strictEqual(obj.b, undefined);
      assert.strictEqual(obj.a, 0);
      assert.strictEqual(obj.c, undefined);
    });
    it('should deep check', () => {
      const arr = [{ a: 0 }, { b: 1 }];
      sonet.utils.findAndDelete(arr, { a: 0 });
      assert.strictEqual(arr.length, 1);
      assert.deepStrictEqual(arr[0], { b: 1 });
    });
    it('should not delete anything if no entries', () => {
      const arr = [1, 2];
      sonet.utils.findAndDelete(arr, 0);
      assert.strictEqual(arr.length, 2);
    });
  });
  describe('findAndDeleteAll', () => {
    it('should delete all entries of what in target', () => {
      const arr = [0, 0, 0, 1];
      sonet.utils.findAndDeleteAll(arr, 0);
      assert.strictEqual(arr.length, 1);
      assert.strictEqual(arr[0], 1);
    });
  });
  it('should delete all entries of what if what is []', () => {
    const arr = [0, 0, 1, 1, 2];
    sonet.utils.findAndDeleteAll(arr, [0, 1]);
    assert.strictEqual(arr.length, 1);
    assert.strictEqual(arr[0], 2);
  });
  it('should work with objects', () => {
    const obj = {
      a: 0,
      b: 0,
      c: 1,
    };
    sonet.utils.findAndDeleteAll(obj, 0);
    assert.strictEqual(obj.a, undefined);
    assert.strictEqual(obj.b, undefined);
    assert.strictEqual(obj.c, 1);
  });
  it('should deep equal', () => {
    const arr = [{ a: 0 }, { a: 0 }, { b: 1 }];
    sonet.utils.findAndDeleteAll(arr, { a: 0 });
    assert.strictEqual(arr.length, 1);
    assert.deepStrictEqual(arr[0], { b: 1 });
  });
});

describe('Events', () => {
  it('should create instance', () => {
    const a = new sonet.Events();
    assert.strictEqual(a instanceof sonet.Events, true);
  });
  it('should apply on and work with emit, emitMultiple, wait and waitMultiple', async () => {
    const a = new sonet.Events();
    let result = 0;
    a.on('bla', () => {
      result += 1;
    });
    a.emit('bla');
    assert.strictEqual(result, 1);
    a.emitMultiple([{ name: 'bla', args: [] }, { name: 'bla', args: [] }, { name: 'bla', args: [] }]);
    assert.strictEqual(result, 4);
    result = 0;
    a.on('bla-async', async () => {
      await sonet.utils.sleep(100);
      result += 1;
    });
    let begin = Date.now();
    await a.wait('bla-async');
    let delay = Date.now() - begin;
    assert.strictEqual(sonet.utils.isPositiveInteger(delay), true);
    assert.strictEqual(result, 1);
    begin = Date.now();
    await a.waitMultiple([{ name: 'bla-async', args: [] }, { name: 'bla-async', args: [] }, { name: 'bla-async', args: [] }]);
    delay = Date.now() - begin;
    assert.strictEqual(sonet.utils.isPositiveInteger(delay), true);
    assert.strictEqual(result, 4);
  });
  it('should off events', () => {
    const a = new sonet.Events();
    let result = 0;
    const id = a.on('bla', () => {
      result = 1;
    });
    a.off('bla', id);
    a.emit('bla');
    assert.strictEqual(result, 0);
  });
  it('should work with arguments', () => {
    const a = new sonet.Events();
    let result = 0;
    a.on('bla', (arg) => {
      result = arg;
    });
    a.emit('bla', 'xui');
    assert.strictEqual(result, 'xui');
  });
  it('should work with middleware', () => {
    const a = new sonet.Events();
    let res = 2;
    let res2 = 0;
    const m1 = (evt, args) => [args[0] + 1];
    a.use(m1);
    a.use((evt, args) => {
      res2 = args[0];
    }, { after: true, shift: false });
    a.on('bla', (arg) => {
      res = arg;
    });
    a.emit('bla', 10);
    assert.strictEqual(res, 11);
    assert.strictEqual(res2, 11);
    a.unuse(m1);
    a.emit('bla', 20);
    assert.strictEqual(res, 20);
    assert.strictEqual(res2, 20);
  });
});
