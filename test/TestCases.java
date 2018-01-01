import java.io.Serializable;

enum SomeEnum { ONE, TWO, THREE }

class PrimitiveFields implements Serializable {
    private static final long serialVersionUID = 0x123456789abcL;
    int i = -123;
    short s = -456;
    long l = -789;
    byte by = -21;
    double d = 12.34;
    float f = 76.5f;
    boolean bo = true;
    char c = '\u1234';
}

class BaseClassWithField implements Serializable {
    private static final long serialVersionUID = 0x1234L;
    private int foo = 123;
}

class DerivedClassWithAnotherField extends BaseClassWithField {
    private static final long serialVersionUID = 0x2345L;
    private int bar = 234;
}

class DerivedClassWithSameField extends BaseClassWithField {
    private static final long serialVersionUID = 0x3456L;
    private int foo = 345;
}

class TestCases extends GenerateTestCases {

    @SerializationTestCase public void canariesOnly() throws Exception {
        args = "";
    }

    @SerializationTestCase public void string() throws Exception {
        writeObject("sometext");
        checkStrictEqual("typeof itm", "'string'");
        checkStrictEqual("itm", "'sometext'");
    }

    @SerializationTestCase public void primitiveFields() throws Exception {
        writeObject(new PrimitiveFields());
        checkStrictEqual("itm.i", "-123");
        checkStrictEqual("itm.s", "-456");
        checkStrictEqual("String(itm.l)", "'-789'");
        checkStrictEqual("itm.l.toNumber()", "-789");
        checkThat("itm.l.equals(-789)");
        checkStrictEqual("itm.by", "-21");
        checkStrictEqual("itm.d", "12.34");
        checkStrictEqual("itm.f", "76.5");
        checkStrictEqual("itm.bo", "true");
        checkStrictEqual("itm.c", "'\\u1234'");
        checkStrictEqual("Object.keys(itm).length", "8");
        checkStrictEqual("itm.class.serialVersionUID", "'0000123456789abc'");
    }

    @SerializationTestCase public void boxedPrimitives() throws Exception {
        writeObject(new Integer(-123));
        writeObject(new Short((short)-456));
        writeObject(new Long(-789L));
        writeObject(new Byte((byte)-21));
        writeObject(new Double(12.34));
        writeObject(new Float(76.5f));
        writeObject(Boolean.TRUE);
        writeObject(new Character('\u1234'));
        args = "i, s, l, by, d, f, bo, c";
        checkStrictEqual("i.value", "-123");
        checkStrictEqual("s.value", "-456");
        checkThat("l.value.equals(-789)");
        checkStrictEqual("by.value", "-21");
        checkStrictEqual("d.value", "12.34");
        checkStrictEqual("f.value", "76.5");
        checkStrictEqual("bo.value", "true");
        checkStrictEqual("c.value", "'\\u1234'");
        checkStrictEqual("i.class.name", "'java.lang.Integer'");
        checkStrictEqual("s.class.name", "'java.lang.Short'");
        checkStrictEqual("l.class.name", "'java.lang.Long'");
        checkStrictEqual("by.class.name", "'java.lang.Byte'");
        checkStrictEqual("d.class.name", "'java.lang.Double'");
        checkStrictEqual("f.class.name", "'java.lang.Float'");
        checkStrictEqual("bo.class.name", "'java.lang.Boolean'");
        checkStrictEqual("c.class.name", "'java.lang.Character'");
    }

    @SerializationTestCase public void inheritedField() throws Exception {
        writeObject(new DerivedClassWithAnotherField());
        checkStrictEqual("itm.class.name", "'DerivedClassWithAnotherField'");
        checkStrictEqual("itm.class.super.name", "'BaseClassWithField'");
        checkStrictEqual("itm.class.super.super", "null");
        checkStrictEqual("itm.extends.DerivedClassWithAnotherField.bar", "234");
        checkStrictEqual("itm.extends.DerivedClassWithAnotherField.foo", "undefined");
        checkStrictEqual("itm.extends.BaseClassWithField.foo", "123");
        checkStrictEqual("itm.bar", "234");
        checkStrictEqual("itm.foo", "123");
    }

    @SerializationTestCase public void duplicateField() throws Exception {
        writeObject(new DerivedClassWithSameField());
        checkStrictEqual("itm.class.name", "'DerivedClassWithSameField'");
        checkStrictEqual("itm.class.super.name", "'BaseClassWithField'");
        checkStrictEqual("itm.class.super.super", "null");
        checkStrictEqual("itm.extends.DerivedClassWithSameField.foo", "345");
        checkStrictEqual("itm.extends.BaseClassWithField.foo", "123");
        checkStrictEqual("itm.foo", "345");
    }

    @SerializationTestCase public void primitiveArray() throws Exception {
        writeObject(new int[] { 12, 34, 56 });
        checkThat("Array.isArray(itm)");
        checkStrictEqual("itm.length", "3");
        checkStrictEqual("itm[0]", "12");
        checkStrictEqual("itm[1]", "34");
        checkStrictEqual("itm[2]", "56");
        checkStrictEqual("itm.class.name", "'[I'");
    }

    @SerializationTestCase public void enums() throws Exception {
        writeObject(SomeEnum.ONE);
        writeObject(SomeEnum.THREE);
        args = "one, three";
        checkStrictEqual("typeof one", "'object'");
        checkThat("one instanceof String");
        checkEqual("one", "'ONE'");
        checkNotStrictEqual("one", "'ONE'");
        checkStrictEqual("one.class.name", "'SomeEnum'");
        checkThat("one.class.isEnum");
        checkStrictEqual("one.class.super.name", "'java.lang.Enum'");
        checkStrictEqual("one.class.super.super", "null");
        checkEqual("three", "'THREE'");
    }

}
