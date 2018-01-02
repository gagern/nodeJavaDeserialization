const assert = require('assert');
const javaDeserialization = require('../');

function testCase(b64data, checks) {
  return function() {
    const bytes = Buffer.from(b64data, 'base64');
    const res = javaDeserialization.parse(bytes);
    const begin = res[0];
    const end = res[res.length - 1];
    assert.strictEqual(begin[0], 'Begin');
    assert.strictEqual(begin[1], begin);
    assert.strictEqual(end[0], end);
    assert.strictEqual(end[1], 'End');
    assert.strictEqual(res.length, checks.length + 2,
      'Number of serialized objects must match args list');
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
      assert.strictEqual(typeof itm, 'string', "expected typeof itm to be strictEqual to 'string'");
      assert.strictEqual(itm, 'sometext', "expected itm to be strictEqual to 'sometext'");
    }));

  it('primitive fields', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEA' +
    'fgABc3IAD1ByaW1pdGl2ZUZpZWxkcwAAEjRWeJq8AgAIWgACYm9CAAJieUMAAWNEAAFkRgAB' +
    'ZkkAAWlKAAFsUwABc3hwAesSNEAorhR64UeuQpkAAP///4X////////86/44dXEAfgAAAAAA' +
    'AnEAfgAFdAADRW5k',
    function(itm) {
      assert.strictEqual(itm.i, -123, "expected itm.i to be strictEqual to -123");
      assert.strictEqual(itm.s, -456, "expected itm.s to be strictEqual to -456");
      assert.strictEqual(String(itm.l), '-789', "expected String(itm.l) to be strictEqual to '-789'");
      assert.strictEqual(itm.l.toNumber(), -789, "expected itm.l.toNumber() to be strictEqual to -789");
      assert(itm.l.equals(-789), "expected itm.l.equals(-789)");
      assert.strictEqual(itm.by, -21, "expected itm.by to be strictEqual to -21");
      assert.strictEqual(itm.d, 12.34, "expected itm.d to be strictEqual to 12.34");
      assert.strictEqual(itm.f, 76.5, "expected itm.f to be strictEqual to 76.5");
      assert.strictEqual(itm.bo, true, "expected itm.bo to be strictEqual to true");
      assert.strictEqual(itm.c, '\u1234', "expected itm.c to be strictEqual to '\u1234'");
      assert.strictEqual(Object.keys(itm).length, 8, "expected Object.keys(itm).length to be strictEqual to 8");
      assert.strictEqual(itm.class.serialVersionUID, '0000123456789abc', "expected itm.class.serialVersionUID to be strictEqual to '0000123456789abc'");
    }));

  it('boxed primitives', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEA' +
    'fgABc3IAEWphdmEubGFuZy5JbnRlZ2VyEuKgpPeBhzgCAAFJAAV2YWx1ZXhyABBqYXZhLmxh' +
    'bmcuTnVtYmVyhqyVHQuU4IsCAAB4cP///4VzcgAPamF2YS5sYW5nLlNob3J0aE03EzRg2lIC' +
    'AAFTAAV2YWx1ZXhxAH4ABP44c3IADmphdmEubGFuZy5Mb25nO4vkkMyPI98CAAFKAAV2YWx1' +
    'ZXhxAH4ABP////////zrc3IADmphdmEubGFuZy5CeXRlnE5ghO5Q9RwCAAFCAAV2YWx1ZXhx' +
    'AH4ABOtzcgAQamF2YS5sYW5nLkRvdWJsZYCzwkopa/sEAgABRAAFdmFsdWV4cQB+AARAKK4U' +
    'euFHrnNyAA9qYXZhLmxhbmcuRmxvYXTa7cmi2zzw7AIAAUYABXZhbHVleHEAfgAEQpkAAHNy' +
    'ABFqYXZhLmxhbmcuQm9vbGVhbs0gcoDVnPruAgABWgAFdmFsdWV4cAFzcgATamF2YS5sYW5n' +
    'LkNoYXJhY3RlcjSLR9lrGiZ4AgABQwAFdmFsdWV4cBI0dXEAfgAAAAAAAnEAfgAUdAADRW5k',
    function(i, s, l, by, d, f, bo, c) {
      assert.strictEqual(i.value, -123, "expected i.value to be strictEqual to -123");
      assert.strictEqual(s.value, -456, "expected s.value to be strictEqual to -456");
      assert(l.value.equals(-789), "expected l.value.equals(-789)");
      assert.strictEqual(by.value, -21, "expected by.value to be strictEqual to -21");
      assert.strictEqual(d.value, 12.34, "expected d.value to be strictEqual to 12.34");
      assert.strictEqual(f.value, 76.5, "expected f.value to be strictEqual to 76.5");
      assert.strictEqual(bo.value, true, "expected bo.value to be strictEqual to true");
      assert.strictEqual(c.value, '\u1234', "expected c.value to be strictEqual to '\u1234'");
      assert.strictEqual(i.class.name, 'java.lang.Integer', "expected i.class.name to be strictEqual to 'java.lang.Integer'");
      assert.strictEqual(s.class.name, 'java.lang.Short', "expected s.class.name to be strictEqual to 'java.lang.Short'");
      assert.strictEqual(l.class.name, 'java.lang.Long', "expected l.class.name to be strictEqual to 'java.lang.Long'");
      assert.strictEqual(by.class.name, 'java.lang.Byte', "expected by.class.name to be strictEqual to 'java.lang.Byte'");
      assert.strictEqual(d.class.name, 'java.lang.Double', "expected d.class.name to be strictEqual to 'java.lang.Double'");
      assert.strictEqual(f.class.name, 'java.lang.Float', "expected f.class.name to be strictEqual to 'java.lang.Float'");
      assert.strictEqual(bo.class.name, 'java.lang.Boolean', "expected bo.class.name to be strictEqual to 'java.lang.Boolean'");
      assert.strictEqual(c.class.name, 'java.lang.Character', "expected c.class.name to be strictEqual to 'java.lang.Character'");
    }));

  it('inherited field', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEA' +
    'fgABc3IAHERlcml2ZWRDbGFzc1dpdGhBbm90aGVyRmllbGQAAAAAAAAjRQIAAUkAA2Jhcnhy' +
    'ABJCYXNlQ2xhc3NXaXRoRmllbGQAAAAAAAASNAIAAUkAA2Zvb3hwAAAAewAAAOp1cQB+AAAA' +
    'AAACcQB+AAZ0AANFbmQ=',
    function(itm) {
      assert.strictEqual(itm.class.name, 'DerivedClassWithAnotherField', "expected itm.class.name to be strictEqual to 'DerivedClassWithAnotherField'");
      assert.strictEqual(itm.class.super.name, 'BaseClassWithField', "expected itm.class.super.name to be strictEqual to 'BaseClassWithField'");
      assert.strictEqual(itm.class.super.super, null, "expected itm.class.super.super to be strictEqual to null");
      assert.strictEqual(itm.extends.DerivedClassWithAnotherField.bar, 234, "expected itm.extends.DerivedClassWithAnotherField.bar to be strictEqual to 234");
      assert.strictEqual(itm.extends.DerivedClassWithAnotherField.foo, undefined, "expected itm.extends.DerivedClassWithAnotherField.foo to be strictEqual to undefined");
      assert.strictEqual(itm.extends.BaseClassWithField.foo, 123, "expected itm.extends.BaseClassWithField.foo to be strictEqual to 123");
      assert.strictEqual(itm.bar, 234, "expected itm.bar to be strictEqual to 234");
      assert.strictEqual(itm.foo, 123, "expected itm.foo to be strictEqual to 123");
    }));

  it('duplicate field', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEA' +
    'fgABc3IAGURlcml2ZWRDbGFzc1dpdGhTYW1lRmllbGQAAAAAAAA0VgIAAUkAA2Zvb3hyABJC' +
    'YXNlQ2xhc3NXaXRoRmllbGQAAAAAAAASNAIAAUkAA2Zvb3hwAAAAewAAAVl1cQB+AAAAAAAC' +
    'cQB+AAZ0AANFbmQ=',
    function(itm) {
      assert.strictEqual(itm.class.name, 'DerivedClassWithSameField', "expected itm.class.name to be strictEqual to 'DerivedClassWithSameField'");
      assert.strictEqual(itm.class.super.name, 'BaseClassWithField', "expected itm.class.super.name to be strictEqual to 'BaseClassWithField'");
      assert.strictEqual(itm.class.super.super, null, "expected itm.class.super.super to be strictEqual to null");
      assert.strictEqual(itm.extends.DerivedClassWithSameField.foo, 345, "expected itm.extends.DerivedClassWithSameField.foo to be strictEqual to 345");
      assert.strictEqual(itm.extends.BaseClassWithField.foo, 123, "expected itm.extends.BaseClassWithField.foo to be strictEqual to 123");
      assert.strictEqual(itm.foo, 345, "expected itm.foo to be strictEqual to 345");
    }));

  it('primitive array', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEA' +
    'fgABdXIAAltJTbpgJnbqsqUCAAB4cAAAAAMAAAAMAAAAIgAAADh1cQB+AAAAAAACcQB+AAV0' +
    'AANFbmQ=',
    function(itm) {
      assert(Array.isArray(itm), "expected Array.isArray(itm)");
      assert.strictEqual(itm.length, 3, "expected itm.length to be strictEqual to 3");
      assert.strictEqual(itm[0], 12, "expected itm[0] to be strictEqual to 12");
      assert.strictEqual(itm[1], 34, "expected itm[1] to be strictEqual to 34");
      assert.strictEqual(itm[2], 56, "expected itm[2] to be strictEqual to 56");
      assert.strictEqual(itm.class.name, '[I', "expected itm.class.name to be strictEqual to '[I'");
    }));

  it('nested array', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEA' +
    'fgABdXIAFFtbTGphdmEubGFuZy5TdHJpbmc7Mk0JrYQy5FcCAAB4cAAAAAJ1cgATW0xqYXZh' +
    'LmxhbmcuU3RyaW5nO63SVufpHXtHAgAAeHAAAAACdAABYXQAAWJ1cQB+AAUAAAABdAABY3Vx' +
    'AH4AAAAAAAJxAH4AC3QAA0VuZA==',
    function(itm) {
      assert(Array.isArray(itm), "expected Array.isArray(itm)");
      assert.strictEqual(itm.length, 2, "expected itm.length to be strictEqual to 2");
      assert(Array.isArray(itm[0]), "expected Array.isArray(itm[0])");
      assert.strictEqual(itm[0].length, 2, "expected itm[0].length to be strictEqual to 2");
      assert.strictEqual(itm[1].length, 1, "expected itm[1].length to be strictEqual to 1");
      assert.strictEqual(itm[0][0], 'a', "expected itm[0][0] to be strictEqual to 'a'");
      assert.strictEqual(itm[0][1], 'b', "expected itm[0][1] to be strictEqual to 'b'");
      assert.strictEqual(itm[1][0], 'c', "expected itm[1][0] to be strictEqual to 'c'");
    }));

  it('array fields', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEA' +
    'fgABc3IAC0FycmF5RmllbGRzAAAAAAAAAAECAANbAAJpYXQAAltJWwADaWFhdAADW1tJWwAC' +
    'c2F0ABNbTGphdmEvbGFuZy9TdHJpbmc7eHB1cgACW0lNumAmduqypQIAAHhwAAAAAwAAAAwA' +
    'AAAiAAAAOHVyAANbW0kX9+RPGY+JPAIAAHhwAAAAAnVxAH4ACAAAAAIAAAALAAAADHVxAH4A' +
    'CAAAAAMAAAAVAAAAFgAAABd1cgATW0xqYXZhLmxhbmcuU3RyaW5nO63SVufpHXtHAgAAeHAA' +
    'AAACdAADZm9vdAADYmFydXEAfgAAAAAAAnEAfgASdAADRW5k',
    function(itm) {
      assert(Array.isArray(itm.ia), "expected Array.isArray(itm.ia)");
      assert(Array.isArray(itm.iaa), "expected Array.isArray(itm.iaa)");
      assert(Array.isArray(itm.sa), "expected Array.isArray(itm.sa)");
      assert.strictEqual(itm.iaa[1][2], 23, "expected itm.iaa[1][2] to be strictEqual to 23");
      assert.strictEqual(itm.sa[1], 'bar', "expected itm.sa[1] to be strictEqual to 'bar'");
    }));

  it('enums', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEA' +
    'fgABfnIACFNvbWVFbnVtAAAAAAAAAAASAAB4cgAOamF2YS5sYW5nLkVudW0AAAAAAAAAABIA' +
    'AHhwdAADT05FfnEAfgADdAAFVEhSRUV1cQB+AAAAAAACcQB+AAl0AANFbmQ=',
    function(one, three) {
      assert.strictEqual(typeof one, 'object', "expected typeof one to be strictEqual to 'object'");
      assert(one instanceof String, "expected one instanceof String");
      assert.equal(one, 'ONE', "expected one to be equal to 'ONE'");
      assert.notStrictEqual(one, 'ONE', "expected one to be notStrictEqual to 'ONE'");
      assert.strictEqual(one.class.name, 'SomeEnum', "expected one.class.name to be strictEqual to 'SomeEnum'");
      assert(one.class.isEnum, "expected one.class.isEnum");
      assert.strictEqual(one.class.super.name, 'java.lang.Enum', "expected one.class.super.name to be strictEqual to 'java.lang.Enum'");
      assert.strictEqual(one.class.super.super, null, "expected one.class.super.super to be strictEqual to null");
      assert.equal(three, 'THREE', "expected three to be equal to 'THREE'");
    }));

  it('custom format', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEA' +
    'fgABc3IADEN1c3RvbUZvcm1hdAAAAAAAAAABAwABSQADZm9veHAAADA5dwu16y0AtestALXr' +
    'LXQACGFuZCBtb3JleHVxAH4AAAAAAAJxAH4ABnQAA0VuZA==',
    function(itm) {
      assert(Array.isArray(itm['@']), "expected Array.isArray(itm['@'])");
      assert.strictEqual(itm['@'].length, 2, "expected itm['@'].length to be strictEqual to 2");
      assert(Buffer.isBuffer(itm['@'][0]), "expected Buffer.isBuffer(itm['@'][0])");
      assert.strictEqual(itm['@'][0].toString('hex'), 'b5eb2d00b5eb2d00b5eb2d', "expected itm['@'][0].toString('hex') to be strictEqual to 'b5eb2d00b5eb2d00b5eb2d'");
      assert.strictEqual(itm['@'][1], 'and more', "expected itm['@'][1] to be strictEqual to 'and more'");
      assert.strictEqual(itm.foo, 12345, "expected itm.foo to be strictEqual to 12345");
    }));

});
