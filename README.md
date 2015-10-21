# Java Deserialization for Node

This package started out with the hope of satisfying
some specific need for a given project.
The first version was committed once that need was satisfied.
So far, it makes no claims of completeness or correctness.
But if you need to deserialize some Java objects using JavaScript,
then you might prefer building on that over starting from scratch.

## Usage

```js
var javaDeserialization = require("java-deserialization");
var objects = javaDeserialization.parse(buf);
```

Each object in `objects` will contain the values of its “normal”
fields as properties, and two hidden properties.
One is called `class` and represents the class of the object,
with `super` pointing at its parent class.
The other is `extends` which is a map from fully qualified class names
to the fields associated with that class.
If one wants to inspect the private field of some specific class,
using `extends` will help in cases where a more derived class contains
another field of the same name.
The names `class` and `extends` were deliberately chosen in such a way
that they are keywords in Java and won't occur in normal field names.
The properties are non-enumerable, so they won't show up in enumerations
and e.g. `util.inspect` won't show them by default.

## Custom deserialization code

If the class contained custom serialization code,
the output from that is collected in a special property called `@`.
One can write post-processing code to reformat the data from that list.
Such code has already been added for `java.util.Hashtable` and
`java.util.HashMap`, which will add a property called `map`
if all the keys in the mapping are strings.

## Contributing

Bug reports, suggestions, code contributions and the likes should go
to the project's GitHub page.
