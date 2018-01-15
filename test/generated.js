const chai = require('chai');
const expect = chai.expect;
const javaDeserialization = require('../');

function testCase(b64data, checks) {
  return function() {
    const bytes = Buffer.from(b64data, 'base64');
    const res = javaDeserialization.parse(bytes);
    const begin = res[0];
    const end = res[res.length - 1];
    expect(begin[0]).to.equal('Begin');
    expect(begin[1]).to.equal(begin);
    expect(end[0]).to.equal(end);
    expect(end[1]).to.equal('End');
    expect(res.length,
      'Number of serialized objects must match args list'
    ).to.equal(checks.length + 2);
    return checks.apply(null, res.slice(1, -1));
  };
}

describe('Deserialization of', function() {

  it('canaries only', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEAfgABdXEAfgAAAAAAAnEAfgADdAADRW5k',
    function() {
    }));

  it('string', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEAfgABdAAIc29tZXRleHR1cQB+AAAAAAACcQB+AAR0AANFbmQ=',
    function(itm) {
      expect(typeof itm, "typeof itm").to.equal('string');
      expect(itm, "itm").to.equal('sometext');
    }));

  it('null', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEAfgABcHVxAH4AAAAAAAJxAH4AA3QAA0VuZA==',
    function(itm) {
      expect(typeof itm, "typeof itm").to.equal('object');
      expect(itm, "itm").to.equal(null);
    }));

  it('duplicate object', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEAfgABc3IAEkJhc2VDbGFzc1dpdGhGaWVsZAAAAAAAABI0AgABSQADZm9veHAAAAB7dAAFZGVsaW1xAH4ABHVxAH4AAAAAAAJxAH4ABnQAA0VuZA==',
    function(obj1, delim, obj2) {
      expect(obj1, "obj1").to.equal(obj2);
    }));

  it('primitive fields', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEAfgABc3IAD1ByaW1pdGl2ZUZpZWxkcwAAEjRWeJq8AgAIWgACYm9CAAJieUMAAWNEAAFkRgABZkkAAWlKAAFsUwABc3hwAesSNEAorhR64UeuQpkAAP///4X////////86/44dXEAfgAAAAAAAnEAfgAFdAADRW5k',
    function(itm) {
      expect(itm.i, "itm.i").to.equal(-123);
      expect(itm.s, "itm.s").to.equal(-456);
      expect(String(itm.l), "String(itm.l)").to.equal('-789');
      expect(itm.l.toNumber(), "itm.l.toNumber()").to.equal(-789);
      expect(itm.l.equals(-789), "itm.l.equals(-789)").to.be.true;
      expect(itm.by, "itm.by").to.equal(-21);
      expect(itm.d, "itm.d").to.equal(12.34);
      expect(itm.f, "itm.f").to.equal(76.5);
      expect(itm.bo, "itm.bo").to.equal(true);
      expect(itm.c, "itm.c").to.equal('\u1234');
      expect(itm, "itm").to.have.all.keys(['i', 's', 'l', 'by', 'd', 'f', 'bo', 'c']);
      expect(itm.class.serialVersionUID, "itm.class.serialVersionUID").to.equal('0000123456789abc');
    }));

  it('boxed primitives', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEAfgABc3IAEWphdmEubGFuZy5JbnRlZ2VyEuKgpPeBhzgCAAFJAAV2YWx1ZXhyABBqYXZhLmxhbmcuTnVtYmVyhqyVHQuU4IsCAAB4cP///4VzcgAPamF2YS5sYW5nLlNob3J0aE03EzRg2lICAAFTAAV2YWx1ZXhxAH4ABP44c3IADmphdmEubGFuZy5Mb25nO4vkkMyPI98CAAFKAAV2YWx1ZXhxAH4ABP////////zrc3IADmphdmEubGFuZy5CeXRlnE5ghO5Q9RwCAAFCAAV2YWx1ZXhxAH4ABOtzcgAQamF2YS5sYW5nLkRvdWJsZYCzwkopa/sEAgABRAAFdmFsdWV4cQB+AARAKK4UeuFHrnNyAA9qYXZhLmxhbmcuRmxvYXTa7cmi2zzw7AIAAUYABXZhbHVleHEAfgAEQpkAAHNyABFqYXZhLmxhbmcuQm9vbGVhbs0gcoDVnPruAgABWgAFdmFsdWV4cAFzcgATamF2YS5sYW5nLkNoYXJhY3RlcjSLR9lrGiZ4AgABQwAFdmFsdWV4cBI0dXEAfgAAAAAAAnEAfgAUdAADRW5k',
    function(i, s, l, by, d, f, bo, c) {
      expect(i.value, "i.value").to.equal(-123);
      expect(s.value, "s.value").to.equal(-456);
      expect(l.value.equals(-789), "l.value.equals(-789)").to.be.true;
      expect(by.value, "by.value").to.equal(-21);
      expect(d.value, "d.value").to.equal(12.34);
      expect(f.value, "f.value").to.equal(76.5);
      expect(bo.value, "bo.value").to.equal(true);
      expect(c.value, "c.value").to.equal('\u1234');
      expect(i.class.name, "i.class.name").to.equal('java.lang.Integer');
      expect(s.class.name, "s.class.name").to.equal('java.lang.Short');
      expect(l.class.name, "l.class.name").to.equal('java.lang.Long');
      expect(by.class.name, "by.class.name").to.equal('java.lang.Byte');
      expect(d.class.name, "d.class.name").to.equal('java.lang.Double');
      expect(f.class.name, "f.class.name").to.equal('java.lang.Float');
      expect(bo.class.name, "bo.class.name").to.equal('java.lang.Boolean');
      expect(c.class.name, "c.class.name").to.equal('java.lang.Character');
    }));

  it('inherited field', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEAfgABc3IAHERlcml2ZWRDbGFzc1dpdGhBbm90aGVyRmllbGQAAAAAAAAjRQIAAUkAA2JhcnhyABJCYXNlQ2xhc3NXaXRoRmllbGQAAAAAAAASNAIAAUkAA2Zvb3hwAAAAewAAAOp1cQB+AAAAAAACcQB+AAZ0AANFbmQ=',
    function(itm) {
      expect(itm.class.name, "itm.class.name").to.equal('DerivedClassWithAnotherField');
      expect(itm.class.super.name, "itm.class.super.name").to.equal('BaseClassWithField');
      expect(itm.class.super.super, "itm.class.super.super").to.equal(null);
      expect(itm.extends.DerivedClassWithAnotherField.bar, "itm.extends.DerivedClassWithAnotherField.bar").to.equal(234);
      expect(itm.extends.DerivedClassWithAnotherField.foo, "itm.extends.DerivedClassWithAnotherField.foo").to.equal(undefined);
      expect(itm.extends.BaseClassWithField.foo, "itm.extends.BaseClassWithField.foo").to.equal(123);
      expect(itm.bar, "itm.bar").to.equal(234);
      expect(itm.foo, "itm.foo").to.equal(123);
    }));

  it('duplicate field', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEAfgABc3IAGURlcml2ZWRDbGFzc1dpdGhTYW1lRmllbGQAAAAAAAA0VgIAAUkAA2Zvb3hyABJCYXNlQ2xhc3NXaXRoRmllbGQAAAAAAAASNAIAAUkAA2Zvb3hwAAAAewAAAVl1cQB+AAAAAAACcQB+AAZ0AANFbmQ=',
    function(itm) {
      expect(itm.class.name, "itm.class.name").to.equal('DerivedClassWithSameField');
      expect(itm.class.super.name, "itm.class.super.name").to.equal('BaseClassWithField');
      expect(itm.class.super.super, "itm.class.super.super").to.equal(null);
      expect(itm.extends.DerivedClassWithSameField.foo, "itm.extends.DerivedClassWithSameField.foo").to.equal(345);
      expect(itm.extends.BaseClassWithField.foo, "itm.extends.BaseClassWithField.foo").to.equal(123);
      expect(itm.foo, "itm.foo").to.equal(345);
    }));

  it('primitive array', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEAfgABdXIAAltJTbpgJnbqsqUCAAB4cAAAAAMAAAAMAAAAIgAAADh1cQB+AAAAAAACcQB+AAV0AANFbmQ=',
    function(itm) {
      expect(itm, "itm").to.be.an('Array');
      expect(itm, "itm").to.have.lengthOf(3);
      expect(itm[0], "itm[0]").to.equal(12);
      expect(itm[1], "itm[1]").to.equal(34);
      expect(itm[2], "itm[2]").to.equal(56);
      expect(itm.class.name, "itm.class.name").to.equal('[I');
    }));

  it('nested array', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEAfgABdXIAFFtbTGphdmEubGFuZy5TdHJpbmc7Mk0JrYQy5FcCAAB4cAAAAAJ1cgATW0xqYXZhLmxhbmcuU3RyaW5nO63SVufpHXtHAgAAeHAAAAACdAABYXQAAWJ1cQB+AAUAAAABdAABY3VxAH4AAAAAAAJxAH4AC3QAA0VuZA==',
    function(itm) {
      expect(itm, "itm").to.be.an('Array');
      expect(itm, "itm").to.have.lengthOf(2);
      expect(itm[0], "itm[0]").to.be.an('Array');
      expect(itm[0], "itm[0]").to.have.lengthOf(2);
      expect(itm[1], "itm[1]").to.have.lengthOf(1);
      expect(itm[0][0], "itm[0][0]").to.equal('a');
      expect(itm[0][1], "itm[0][1]").to.equal('b');
      expect(itm[1][0], "itm[1][0]").to.equal('c');
    }));

  it('array fields', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEAfgABc3IAC0FycmF5RmllbGRzAAAAAAAAAAECAANbAAJpYXQAAltJWwADaWFhdAADW1tJWwACc2F0ABNbTGphdmEvbGFuZy9TdHJpbmc7eHB1cgACW0lNumAmduqypQIAAHhwAAAAAwAAAAwAAAAiAAAAOHVyAANbW0kX9+RPGY+JPAIAAHhwAAAAAnVxAH4ACAAAAAIAAAALAAAADHVxAH4ACAAAAAMAAAAVAAAAFgAAABd1cgATW0xqYXZhLmxhbmcuU3RyaW5nO63SVufpHXtHAgAAeHAAAAACdAADZm9vdAADYmFydXEAfgAAAAAAAnEAfgASdAADRW5k',
    function(itm) {
      expect(itm.ia, "itm.ia").to.be.an('Array');
      expect(itm.iaa, "itm.iaa").to.be.an('Array');
      expect(itm.sa, "itm.sa").to.be.an('Array');
      expect(itm.iaa[1][2], "itm.iaa[1][2]").to.equal(23);
      expect(itm.sa[1], "itm.sa[1]").to.equal('bar');
    }));

  it('enum', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEAfgABfnIACFNvbWVFbnVtAAAAAAAAAAASAAB4cgAOamF2YS5sYW5nLkVudW0AAAAAAAAAABIAAHhwdAADT05FfnEAfgADdAAFVEhSRUVxAH4AB3VxAH4AAAAAAAJxAH4ACXQAA0VuZA==',
    function(one, three, three2) {
      expect(typeof one, "typeof one").to.equal('object');
      expect(one, "one").to.be.an.instanceof(String);
      expect(one == 'ONE', "one == 'ONE'").to.be.true;
      expect(one, "one").to.not.equal('ONE');
      expect(one.class.name, "one.class.name").to.equal('SomeEnum');
      expect(one.class.isEnum, "one.class.isEnum").to.be.true;
      expect(one.class.super.name, "one.class.super.name").to.equal('java.lang.Enum');
      expect(one.class.super.super, "one.class.super.super").to.equal(null);
      expect(three == 'THREE', "three == 'THREE'").to.be.true;
      expect(typeof three2, "typeof three2").to.equal('object');
      expect(three2, "three2").to.be.an.instanceof(String);
      expect(three2 == 'THREE', "three2 == 'THREE'").to.be.true;
      expect(three2, "three2").to.equal(three);
    }));

  it('Exception as regular object', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEAfgABc3IAGmphdmEubGFuZy5SdW50aW1lRXhjZXB0aW9unl8GRwo0g+UCAAB4cgATamF2YS5sYW5nLkV4Y2VwdGlvbtD9Hz4aOxzEAgAAeHIAE2phdmEubGFuZy5UaHJvd2FibGXVxjUnOXe4ywMABEwABWNhdXNldAAVTGphdmEvbGFuZy9UaHJvd2FibGU7TAANZGV0YWlsTWVzc2FnZXQAEkxqYXZhL2xhbmcvU3RyaW5nO1sACnN0YWNrVHJhY2V0AB5bTGphdmEvbGFuZy9TdGFja1RyYWNlRWxlbWVudDtMABRzdXBwcmVzc2VkRXhjZXB0aW9uc3QAEExqYXZhL3V0aWwvTGlzdDt4cHEAfgAKdAAGS2Fib29tdXIAHltMamF2YS5sYW5nLlN0YWNrVHJhY2VFbGVtZW50OwJGKjw8/SI5AgAAeHAAAAABc3IAG2phdmEubGFuZy5TdGFja1RyYWNlRWxlbWVudGEJxZomNt2FAgAESQAKbGluZU51bWJlckwADmRlY2xhcmluZ0NsYXNzcQB+AAdMAAhmaWxlTmFtZXEAfgAHTAAKbWV0aG9kTmFtZXEAfgAHeHAAAAB7dAADQ2xzdAAIQ2xzLmphdmF0AANtZXRzcgAmamF2YS51dGlsLkNvbGxlY3Rpb25zJFVubW9kaWZpYWJsZUxpc3T8DyUxteyOEAIAAUwABGxpc3RxAH4ACXhyACxqYXZhLnV0aWwuQ29sbGVjdGlvbnMkVW5tb2RpZmlhYmxlQ29sbGVjdGlvbhlCAIDLXvceAgABTAABY3QAFkxqYXZhL3V0aWwvQ29sbGVjdGlvbjt4cHNyABNqYXZhLnV0aWwuQXJyYXlMaXN0eIHSHZnHYZ0DAAFJAARzaXpleHAAAAAAdwQAAAAAeHEAfgAYeHVxAH4AAAAAAAJxAH4AGXQAA0VuZA==',
    function(itm) {
      expect(itm.class.name, "itm.class.name").to.equal('java.lang.RuntimeException');
      expect(itm.detailMessage, "itm.detailMessage").to.equal('Kaboom');
    }));

  it('custom format', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEAfgABc3IADEN1c3RvbUZvcm1hdAAAAAAAAAABAwABSQADZm9veHAAADA5dwu16y0AtestALXrLXQACGFuZCBtb3JleHVxAH4AAAAAAAJxAH4ABnQAA0VuZA==',
    function(itm) {
      expect(itm['@'], "itm['@']").to.be.an('Array');
      expect(itm['@'], "itm['@']").to.have.lengthOf(2);
      expect(Buffer.isBuffer(itm['@'][0]), "Buffer.isBuffer(itm['@'][0])").to.be.true;
      expect(itm['@'][0].toString('hex'), "itm['@'][0].toString('hex')").to.equal('b5eb2d00b5eb2d00b5eb2d');
      expect(itm['@'][1], "itm['@'][1]").to.equal('and more');
      expect(itm.foo, "itm.foo").to.equal(12345);
    }));

  it('externalizable', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEAfgABc3IACEV4dGVybmFsJ+EnQdGOfAQMAAB4cHcLtestALXrLQC16y10AAhhbmQgbW9yZXh1cQB+AAAAAAACcQB+AAZ0AANFbmQ=',
    function(itm) {
      expect(itm['@'], "itm['@']").to.be.an('Array');
      expect(itm['@'], "itm['@']").to.have.lengthOf(2);
      expect(Buffer.isBuffer(itm['@'][0]), "Buffer.isBuffer(itm['@'][0])").to.be.true;
      expect(itm['@'][0].toString('hex'), "itm['@'][0].toString('hex')").to.equal('b5eb2d00b5eb2d00b5eb2d');
      expect(itm['@'][1], "itm['@'][1]").to.equal('and more');
      expect(itm, "itm").to.have.all.keys(['@']);
    }));

  it('HashMap<String, …>', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEAfgABc3IAEWphdmEudXRpbC5IYXNoTWFwBQfawcMWYNEDAAJGAApsb2FkRmFjdG9ySQAJdGhyZXNob2xkeHA/QAAAAAAADHcIAAAAEAAAAAJ0AANiYXJ0AANiYXp0AANmb29zcgARamF2YS5sYW5nLkludGVnZXIS4qCk94GHOAIAAUkABXZhbHVleHIAEGphdmEubGFuZy5OdW1iZXKGrJUdC5TgiwIAAHhwAAAAe3h1cQB+AAAAAAACcQB+AAt0AANFbmQ=',
    function(itm) {
      expect(typeof itm.obj, "typeof itm.obj").to.equal('object');
      expect(typeof itm['@'], "typeof itm['@']").to.equal('object');
      expect(itm.obj.bar, "itm.obj.bar").to.equal('baz');
      expect(itm.obj.foo.value, "itm.obj.foo.value").to.equal(123);
      expect(itm.obj, "itm.obj").to.have.all.keys(['foo', 'bar']);
      expect(itm.map, "itm.map").to.be.an.instanceof(Map);
      expect(itm.map.get('bar'), "itm.map.get('bar')").to.equal('baz');
      expect(itm.map.get('foo').value, "itm.map.get('foo').value").to.equal(123);
      expect(itm.map.size, "itm.map.size").to.equal(2);
    }));

  it('HashMap<not String, …>', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEAfgABc3IAEWphdmEudXRpbC5IYXNoTWFwBQfawcMWYNEDAAJGAApsb2FkRmFjdG9ySQAJdGhyZXNob2xkeHA/QAAAAAAADHcIAAAAEAAAAAJ0AANiYXp0AANiYXJzcgARamF2YS5sYW5nLkludGVnZXIS4qCk94GHOAIAAUkABXZhbHVleHIAEGphdmEubGFuZy5OdW1iZXKGrJUdC5TgiwIAAHhwAAAAe3QAA2Zvb3hxAH4ACXVxAH4AAAAAAAJxAH4AC3QAA0VuZA==',
    function(itm, i123) {
      expect(typeof itm.obj, "typeof itm.obj").to.equal('object');
      expect(typeof itm['@'], "typeof itm['@']").to.equal('object');
      expect(itm['@'], "itm['@']").to.be.an('Array');
      expect(itm.obj, "itm.obj").to.have.all.keys(['baz']);
      expect(itm.obj.baz, "itm.obj.baz").to.equal('bar');
      expect(itm.map, "itm.map").to.be.an.instanceof(Map);
      expect(itm.map.get('baz'), "itm.map.get('baz')").to.equal('bar');
      expect(itm.map.get(i123), "itm.map.get(i123)").to.equal('foo');
      expect(itm.map.size, "itm.map.size").to.equal(2);
    }));

  it('empty HashMap', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEAfgABc3IAEWphdmEudXRpbC5IYXNoTWFwBQfawcMWYNEDAAJGAApsb2FkRmFjdG9ySQAJdGhyZXNob2xkeHA/QAAAAAAAAHcIAAAAEAAAAAB4dXEAfgAAAAAAAnEAfgAFdAADRW5k',
    function(itm) {
      expect(typeof itm.obj, "typeof itm.obj").to.equal('object');
      expect(itm.obj, "itm.obj").to.be.an('object').that.is.empty;
      expect(itm.map, "itm.map").to.be.an.instanceof(Map);
      expect(itm.map.size, "itm.map.size").to.equal(0);
    }));

  it('Hashtable<String, …>', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEAfgABc3IAE2phdmEudXRpbC5IYXNodGFibGUTuw8lIUrkuAMAAkYACmxvYWRGYWN0b3JJAAl0aHJlc2hvbGR4cD9AAAAAAAAIdwgAAAALAAAAAnQAA2JhcnQAA2JhenQAA2Zvb3NyABFqYXZhLmxhbmcuSW50ZWdlchLioKT3gYc4AgABSQAFdmFsdWV4cgAQamF2YS5sYW5nLk51bWJlcoaslR0LlOCLAgAAeHAAAAB7eHVxAH4AAAAAAAJxAH4AC3QAA0VuZA==',
    function(itm) {
      expect(typeof itm.obj, "typeof itm.obj").to.equal('object');
      expect(typeof itm['@'], "typeof itm['@']").to.equal('object');
      expect(itm.obj.bar, "itm.obj.bar").to.equal('baz');
      expect(itm.obj.foo.value, "itm.obj.foo.value").to.equal(123);
      expect(itm.obj, "itm.obj").to.have.all.keys(['foo', 'bar']);
      expect(itm.map, "itm.map").to.be.an.instanceof(Map);
      expect(itm.map.get('bar'), "itm.map.get('bar')").to.equal('baz');
      expect(itm.map.get('foo').value, "itm.map.get('foo').value").to.equal(123);
      expect(itm.map.size, "itm.map.size").to.equal(2);
    }));

  it('EnumMap', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEAfgABc3IAEWphdmEudXRpbC5FbnVtTWFwBl19976QfKEDAAFMAAdrZXlUeXBldAARTGphdmEvbGFuZy9DbGFzczt4cHZyAAhTb21lRW51bQAAAAAAAAAAEgAAeHIADmphdmEubGFuZy5FbnVtAAAAAAAAAAASAAB4cHcEAAAAAn5xAH4ABnQAA09ORXNyABFqYXZhLmxhbmcuSW50ZWdlchLioKT3gYc4AgABSQAFdmFsdWV4cgAQamF2YS5sYW5nLk51bWJlcoaslR0LlOCLAgAAeHAAAAB7fnEAfgAGdAAFVEhSRUV0AANiYXp4cQB+AAlxAH4ADnVxAH4AAAAAAAJxAH4AEXQAA0VuZA==',
    function(itm, one, three) {
      expect(typeof itm.obj, "typeof itm.obj").to.equal('object');
      expect(typeof itm['@'], "typeof itm['@']").to.equal('object');
      expect(itm.obj.THREE, "itm.obj.THREE").to.equal('baz');
      expect(itm.obj.ONE.value, "itm.obj.ONE.value").to.equal(123);
      expect(itm.obj, "itm.obj").to.have.all.keys(['ONE', 'THREE']);
      expect(itm.keyType.name, "itm.keyType.name").to.equal('SomeEnum');
      expect(itm.keyType.isEnum, "itm.keyType.isEnum").to.be.true;
      expect(itm.map, "itm.map").to.be.an.instanceof(Map);
      expect(itm.map.get(three), "itm.map.get(three)").to.equal('baz');
      expect(itm.map.get(one).value, "itm.map.get(one).value").to.equal(123);
      expect(itm.map.size, "itm.map.size").to.equal(2);
    }));

  it('ArrayList', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEAfgABc3IAE2phdmEudXRpbC5BcnJheUxpc3R4gdIdmcdhnQMAAUkABHNpemV4cAAAAAJ3BAAAAAJ0AANmb29zcgARamF2YS5sYW5nLkludGVnZXIS4qCk94GHOAIAAUkABXZhbHVleHIAEGphdmEubGFuZy5OdW1iZXKGrJUdC5TgiwIAAHhwAAAAe3h1cQB+AAAAAAACcQB+AAl0AANFbmQ=',
    function(itm) {
      expect(itm.list, "itm.list").to.be.an('Array');
      expect(itm.list, "itm.list").to.have.lengthOf(2);
      expect(itm.list[0], "itm.list[0]").to.equal('foo');
      expect(itm.list[1].value, "itm.list[1].value").to.equal(123);
    }));

  it('ArrayDeque', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEAfgABc3IAFGphdmEudXRpbC5BcnJheURlcXVlIHzaLiQNoIsDAAB4cHcEAAAAAnQAA2Zvb3NyABFqYXZhLmxhbmcuSW50ZWdlchLioKT3gYc4AgABSQAFdmFsdWV4cgAQamF2YS5sYW5nLk51bWJlcoaslR0LlOCLAgAAeHAAAAB7eHVxAH4AAAAAAAJxAH4ACXQAA0VuZA==',
    function(itm) {
      expect(itm.list, "itm.list").to.be.an('Array');
      expect(itm.list, "itm.list").to.have.lengthOf(2);
      expect(itm.list[0], "itm.list[0]").to.equal('foo');
      expect(itm.list[1].value, "itm.list[1].value").to.equal(123);
    }));

  it('HashSet', testCase(
    'rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAAJ0AAVCZWdpbnEAfgABc3IAEWphdmEudXRpbC5IYXNoU2V0ukSFlZa4tzQDAAB4cHcMAAAAED9AAAAAAAACdAADZm9vc3IAEWphdmEubGFuZy5JbnRlZ2VyEuKgpPeBhzgCAAFJAAV2YWx1ZXhyABBqYXZhLmxhbmcuTnVtYmVyhqyVHQuU4IsCAAB4cAAAAHt4dXEAfgAAAAAAAnEAfgAJdAADRW5k',
    function(itm) {
      expect(itm.set, "itm.set").to.be.an.instanceof(Set);
      expect(itm.set.size, "itm.set.size").to.equal(2);
      expect(itm.set.has('foo'), "itm.set.has('foo')").to.be.true;
    }));

});
