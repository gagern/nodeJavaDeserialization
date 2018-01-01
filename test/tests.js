const assert = require('assert');
const javaDeserialization = require('../');

function testCase(b64data, checks) {
  return function() {
    const bytes = Buffer.from(b64data, 'base64');
    const res = javaDeserialization.parse(bytes);
    const begin = res[0];
    const end = res[res.length - 1];
    assert(begin[0] === 'Begin');
    assert(begin[1] === begin);
    assert(end[0] === end);
    assert(end[1] === 'End');
    assert(res.length === checks.length + 2);
    return checks.apply(null, res.slice(1, -1));
  };
}

describe('Deserialization of', () => {

  it('canaries only', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEA' +
    'fgABdXEAfgAAAAAAAnEAfgADdAADRW5k', 
    function() {
    }));

  it('string', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEA' +
    'fgABdAAIc29tZXRleHR1cQB+AAAAAAACcQB+AAR0AANFbmQ=', 
    function(itm) {
      assert(typeof itm === 'string');
      assert(itm === 'sometext');
    }));

  it('primitive fields', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEA' +
    'fgABc3IAD1ByaW1pdGl2ZUZpZWxkcwAAAAAAEtaHAgAHWgACYm9CAAJieUQAAWRGAAFmSQAB' +
    'aUoAAWxTAAFzeHAB60AorhR64UeuQpkAAP///4X////////86/44dXEAfgAAAAAAAnEAfgAF' +
    'dAADRW5k', 
    function(itm) {
      assert.strictEqual(itm.i, -123);
      assert.strictEqual(itm.s, -456);
      assert.strictEqual(String(itm.l), '-789');
      assert.strictEqual(itm.l.toNumber(), -789);
      assert(itm.l.equals(-789));
      assert.strictEqual(itm.by, -21);
      assert.strictEqual(itm.d, 12.34);
      assert.strictEqual(itm.f, 76.5);
      assert.strictEqual(itm.bo, true);
      assert.strictEqual(Object.keys(itm).length, 7);
    }));

  it('enums', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEA' +
    'fgABfnIACFNvbWVFbnVtAAAAAAAAAAASAAB4cgAOamF2YS5sYW5nLkVudW0AAAAAAAAAABIA' +
    'AHhwdAADT05FfnEAfgADdAAFVEhSRUV1cQB+AAAAAAACcQB+AAl0AANFbmQ=', 
    function(one, three) {
      assert.strictEqual(typeof one, 'object');
      assert(one instanceof String);
      assert.equal(one, 'ONE');
      assert.notStrictEqual(one, 'ONE');
      assert.strictEqual(one.class.name, 'SomeEnum');
      assert(one.class.isEnum);
      assert.strictEqual(one.class.super.name, 'java.lang.Enum');
      assert.strictEqual(one.class.super.super, null);
      assert.equal(three, 'THREE');
    }));

});
