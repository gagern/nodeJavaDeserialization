import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.io.PrintStream;
import java.lang.reflect.Method;
import java.util.Base64;

class GenerateTestCases {

    public static void main(String[] args) throws Exception {
        System.out.print
            ("const assert = require('assert');\n" +
             "const javaDeserialization = require('../');\n" +
             "\n" +
             "function testCase(b64data, checks) {\n" +
             "  return function() {\n" +
             "    const bytes = Buffer.from(b64data, 'base64');\n" +
             "    const res = javaDeserialization.parse(bytes);\n" +
             "    const begin = res[0];\n" +
             "    const end = res[res.length - 1];\n" +
             "    assert.strictEqual(begin[0], 'Begin');\n" +
             "    assert.strictEqual(begin[1], begin);\n" +
             "    assert.strictEqual(end[0], end);\n" +
             "    assert.strictEqual(end[1], 'End');\n" +
             "    assert.strictEqual(res.length, checks.length + 2,\n" +
             "      'Number of serialized objects must match args list');\n" +
             "    return checks.apply(null, res.slice(1, -1));\n" +
             "  };\n" +
             "}\n" +
             "\n" +
             "describe('Deserialization of', () => {\n\n");
        runTests(TestCases.class);
        System.out.print("});\n");
    }

    private static void runTests(Class<? extends GenerateTestCases> cases)
        throws Exception
    {
        for (Method m: cases.getMethods()) {
            SerializationTestCase a =
                m.getAnnotation(SerializationTestCase.class);
            if (a == null)
                continue;
            StringBuilder desc = new StringBuilder(m.getName());
            for (int i = desc.length() - 1; i > 0; --i) {
                if (Character.isUpperCase(desc.charAt(i)))
                    desc.insert(i, ' ');
            }
            GenerateTestCases instance = cases.newInstance();
            instance.description = desc.toString().toLowerCase();
            instance.prepare();
            m.invoke(instance);
            instance.finish();
        }
    }

    protected String description;

    private PrintStream out = System.out;

    private ByteArrayOutputStream dataBuf;

    private ByteArrayOutputStream checkBuf;

    protected String args = "itm";

    protected ObjectOutputStream data;

    protected PrintStream check;

    protected void writeObject(Object obj) throws IOException {
        data.writeObject(obj);
    }

    protected void checkLine(String chk)  {
        check.print("      " + chk + "\n");
    }

    protected void checkThat(String chk) {
        checkLine("assert(" + chk + ", \"expected " + chk + "\");");
    }

    protected void checkWith(String method, String actual, String expected) {
        checkLine("assert." + method + "(" + actual + ", " + expected + ", " +
                  "\"expected " + actual + " to be " + method + " to " +
                  expected + "\");");
    }

    protected void checkStrictEqual(String actual, String expected) {
        checkWith("strictEqual", actual, expected);
    }

    protected void checkEqual(String actual, String expected) {
        checkWith("equal", actual, expected);
    }

    protected void checkNotStrictEqual(String actual, String expected) {
        checkWith("notStrictEqual", actual, expected);
    }

    protected void checkNotEqual(String actual, String expected) {
        checkWith("notEqual", actual, expected);
    }

    private void prepare() throws Exception {
        dataBuf = new ByteArrayOutputStream();
        data = new ObjectOutputStream(dataBuf);
        checkBuf = new ByteArrayOutputStream();
        check = new PrintStream(checkBuf, false, "UTF-8");
        Object[] canary = { "Begin", null };
        canary[1] = canary;
        writeObject(canary);
    }

    private void finish() throws Exception {
        Object[] canary = { null, "End" };
        canary[0] = canary;
        writeObject(canary);

        out.print("  it('");
        out.print(description);
        out.print("', testCase(\n    '");
        String b64 = Base64.getEncoder().encodeToString(dataBuf.toByteArray());
        int chunklen = 72;
        int i;
        for (i = 0; i + chunklen < b64.length(); i += chunklen) {
            out.print(b64.substring(i, i + chunklen));
            out.print("' +\n    '");
        }
        out.print(b64.substring(i));
        out.print("',\n    function(");
        out.print(args);
        out.print(") {\n");
        checkBuf.writeTo(out);
        out.print("    }));\n\n");
    }

}
