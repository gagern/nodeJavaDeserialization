import java.io.Serializable;

enum SomeEnum { ONE, TWO, THREE }

class PrimitiveFields implements Serializable {
    private static final long serialVersionUID = 1234567L;
    int i = -123;
    short s = -456;
    long l = -789;
    byte by = -21;
    double d = 12.34;
    float f = 76.5f;
    boolean bo = true;
}

class TestCases extends GenerateTestCases {

    @SerializationTestCase public void canariesOnly() throws Exception {
        args = "";
    }

    @SerializationTestCase public void string() throws Exception {
        writeObject("sometext");
        checkThat("typeof itm === 'string'");
        checkThat("itm === 'sometext'");
    }

    @SerializationTestCase public void primitiveFields() throws Exception {
        writeObject(new PrimitiveFields());
        checkStrictEqual("itm.i", "-123");
        checkStrictEqual("itm.s", "-456");
        checkStrictEqual("itm.l", "'fffffffffffffceb'");
        checkStrictEqual("itm.by", "-21");
        checkStrictEqual("itm.d", "12.34");
        checkStrictEqual("itm.f", "76.5");
        checkStrictEqual("itm.bo", "true");
        checkStrictEqual("Object.keys(itm).length", "7");
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
