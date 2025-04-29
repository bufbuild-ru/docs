---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/descriptors/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/protobuf-files-and-packages/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/migration-guides/migrate-v2-config-files/"
  - - meta
    - property: "og:title"
      content: "Descriptors - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/descriptors.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/descriptors/"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "og:image:type"
      content: "image/png"
  - - meta
    - property: "og:image:width"
      content: "1200"
  - - meta
    - property: "og:image:height"
      content: "630"
  - - meta
    - property: "twitter:title"
      content: "Descriptors - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/descriptors.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Descriptors

Descriptors describe Protobuf definitions. Their representation in Protobuf is in [`google/protobuf/descriptor.proto`](https://github.com/protocolbuffers/protobuf/blob/main/src/google/protobuf/descriptor.proto) (included with Protobuf compilers). They're a fundamental part of the Protobuf ecosystem and the foundation of Protobuf’s plugin system, as well as all reflection-based tasks. If you want to understand how Protobuf works and use Protobuf in more advanced ways, you need to understand how descriptors work.

## What are descriptors?

The term “descriptors” refers to models that describe the data types defined in Protobuf sources. They resemble an AST (Abstract Syntax Tree) of the Protobuf IDL, using Protobuf messages for the tree nodes.Descriptors are used for three key purposes:

- **Code generation**: When the compiler invokes a plugin to generate code, it uses descriptors to provide the plugin with a description of what to generate.
- **Reflection**: The ability to examine the Protobuf schema details at runtime. This allows code to examine metadata that's defined in the Protobuf sources, such as inspecting field numbers, or custom options defined on elements like messages, fields, and methods.
- **Dynamic messages and dynamic RPC**: The ability to interact with message types and Protobuf RPC services without generating code. Instead of statically generating RPC interfaces and data structures to represent request and response messages, the descriptors can be used at runtime to build dynamic data types and RPC stubs.

Descriptors can be a source of confusion for developers who are learning Protobuf. There are a few reasons:

- Historically, descriptors haven't been well documented and described. Often, they're deeply understood by only a few Protobuf “experts” at an organization, where that knowledge may be gained by a few through extensive tinkering or handed down from one person to the next via pair programming.
- Descriptors are self-referential: not only do they _describe_ Protobuf sources, they're actually _defined_ using Protobuf sources as well. These descriptor Protobuf messages are produced by a compiler and used to perform code generation. Their contents are also embedded into the generated code in some runtimes. This means you need some basic knowledge of Protobuf—about the IDL syntax, its concepts, and its type system—before trying to learn about descriptors.
- Some aspects of descriptors and how IDL source code maps to a descriptor representation are non-intuitive. Numerous quirks exist, but one of the biggest hurdles is that descriptors are _file-centric_. Instead of simply describing **types**, descriptors describe **files** which contain the types. This can complicate the use of descriptors, which can further encumber new developers trying to learn about them.

This article aims to demystify descriptors. The next sections dive more deeply into what descriptors are and how they can be effectively used.

## Deep dive into the model

As mentioned above, the well-known file [`google/protobuf/descriptor.proto`](https://github.com/protocolbuffers/protobuf/blob/main/src/google/protobuf/descriptor.proto) defines Protobuf messages for the various kinds of descriptors.It uses [“proto2” syntax](https://protobuf.com/docs/language-spec#syntax-declaration) because it makes use of _extensions_, which aren't allowed in “proto3” syntax. We can use the extension ranges defined in this file to create custom options ([more on that later](#custom-options)).The `descriptor.proto` file defines a message for each type of element in the language. Throughout the rest of this article, the `google.protobuf` package prefix is omitted so we can refer to relevant messages using shorthand.

- **[`FileDescriptorProto`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L60-L95)**: The root of the hierarchy. This describes a single source file. It contains references to all top-level types defined in the file: messages, enums, extensions, and services.
- **[`DescriptorProto`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L97-L130)**: This describes a **message**. It's confusingly named since, unlike all the other messages, it has no prefix that indicates the element type it describes (it lacks a “Message” prefix in the name). This is a historical relic—you can think of this as `MessageDescriptorProto` in effect.This element may also contain references to other _nested_ types: messages, enums, and extensions that are defined inside another message.
- **[`FieldDescriptorProto`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L140-L241)**: This describes a **field**, defined in a message, or an **extension**.
- **[`OneofDescriptorProto`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L243-L247)**: This describes a **oneof** defined in a message. Note that this structure doesn't contain any references to fields. Instead, a `FieldDescriptorProto` refers to its enclosing `oneof` via [an index](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L207-L209), and the `OneofDescriptorProto` itself is just a placeholder.
- **[`EnumDescriptorProto`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L249-L276)**: This describes an **enum**. It contains enum values.
- **[`EnumValueDescriptorProto`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L278-L284)**: This describes an **enum value**, also called an **enum entry**.
- **[`ServiceDescriptorProto`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L286-L292)**: This describes a **service**. It contains methods.
- **[`MethodDescriptorProto`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L294-L309)**: This describes a **method**, also called an “RPC”.

So the full hierarchy, in a tree diagram, looks like this:

```text
─ FileDescriptorProto
   │
   ├─ DescriptorProto           // Messages
   │   ├─ FieldDescriptorProto  //   - normal fields and nested extensions
   │   ├─ OneofDescriptorProto
   │   ├─ DescriptorProto       //   - nested messages
   │   │   └─ (...more...)
   │   └─ EnumDescriptorProto   //   - nested enums
   │       └─ EnumValueDescriptorProto
   │
   ├─ EnumDescriptorProto       // Enums
   │   └─ EnumValueDescriptorProto
   │
   ├─ FieldDescriptorProto      // Extensions
   │
   └─ ServiceDescriptorProto    // Services
       └─ MethodDescriptorProto
```

You can find more information on how these Protobuf messages are populated by a compiler in the [Protobuf Guide](https://protobuf.com/docs/descriptors#descriptor-production).

### Options messages

The `descriptor.proto` file also defines the **options** messages. There is one such message type for each element in the language for which options may be defined.

- **[`FileOptions`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L343-L459)**: This message represents the metadata defined by top-level “option” declarations, such as for indicating the [Go package](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L43) or the [Java package](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L44) of generated code.
- **[`MessageOptions`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L461-L538)**: This represents the metadata defined by “option” declarations inside a message definition. (Note: It contains a field named `map_entry` that may _not_ actually be used by an “option” declaration.)
- **[`FieldOptions`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L540-L671)**: This is for options that may appear at the end of a field definition.There are two options that can appear here that are **_not_** actually represented in the `FieldOptions` message: `default` and `json_name`. While these look like any other option in the source file syntax, they're handled differently by the compiler and stored elsewhere in the corresponding `FieldDescriptorProto` message.
- **[`OneofOptions`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L673-L679)**: This is for “option” declarations inside a oneof definition.
- **[`ExtensionRangeOptions`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L132-L138)**: For options that may appear at the end of an extension range declaration (only allowed in “proto2” syntax).
- **[`EnumOptions`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L681-L708)**: For “option” declarations inside an enum definition, such as indicating if the enum [allows aliases](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L683-L685) (multiple names for the same numeric value).
- **[`EnumValueOptions`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L710-L722)**: For options that may appear at the end of an enum value definition.
- **[`ServiceOptions`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L724-L742)**: For “option” declarations inside a service definition.
- **[`MethodOptions`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L744-L773)**: For “option” declarations inside a method definition, such as the method’s [idempotency level](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L757-L766).

An important quality shared by all of the above options messages is that **they're all extendable**. They all have extension ranges [starting at field number 1000](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L454-L456). This is what enables “custom options” (often called annotations), which are actually extension fields of an options message.The following example shows a simple source file that uses options:

```protobuf
syntax = "proto3";
package foo.bar;

// These next two lines are file options
option go_package = "github.com/foo/bar";
option java_package = "com.foo.bar";

message Foo {
  // This is a message option
  option deprecated = true;

  string name = 1;

  // This field has an option (packed)
  repeated int64 class_ids = 2 [packed = true];

  // As does this one (debug_redact)
  string ssn = 3 [debug_redact = true];
}
```

And here’s the corresponding `FileDescriptorProto` (shown using the JSON format; some inconsequential fields omitted for brevity):

```json
{
  "syntax": "proto3",
  "package": "foo.bar",
  "options": {
    // [!code highlight]
    "go_package": "github.com/foo/bar", // [!code highlight]
    "java_package": "com.foo.bar" // [!code highlight]
  },
  "message": [
    {
      "name": "Foo",
      "options": { "deprecated": true }, // [!code highlight]
      "field": [
        {
          "name": "name",
          "number": 1,
          "type": "TYPE_STRING",
          "label": "LABEL_OPTIONAL"
        },
        {
          "name": "class_ids",
          "number": 2,
          "type": "TYPE_STRING",
          "label": "LABEL_REPEATED",
          "options": { "packed": true } // [!code highlight]
        },
        {
          "name": "ssn",
          "number": 3,
          "type": "TYPE_STRING",
          "label": "LABEL_OPTIONAL",
          "options": { "debug_redact": true } // [!code highlight]
        }
      ]
    }
  ]
}
```

In the above example, we can clearly see how “option” declarations in the source file correspond to the `options` fields of the descriptor messages.

- On lines 5 and 6 of the source, we see [file options](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L79) that map to fields of the same name in the `FileOptions` message ([here](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L386-L391) and [here](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L345-L349), respectively).
- On line 10, we see a [message option](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L117) that maps to a field in the `MessageOptions` message ([here](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L487-L491)).
- And on lines 15 and 18, we see [field options](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L217) that map to fields of the same name in the `FieldOptions` message ([here](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L554-L559) and [here](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L630-L632), respectively).

#### Custom options

A **custom** option is an _extension field_ on one of the options messages. Here’s an example:

```protobuf
syntax = "proto3";
package foo.bar;
import "google/protobuf/descriptor.proto";

// By extending FileOptions, we are creating custom file options.
extend google.protobuf.FileOptions {
  // Each field defined in this block is an extension.

  // This extension's full name is "foo.bar.baz" since it's in a
  // file whose package is "foo.bar".
  string baz = 30303;
  // NOTE: We can't create another extension in this file named "baz"
  // that extends a different message because it would also be named
  // "foo.bar.baz". The extended message (in this case FileOptions)
  // is *not* part of the extension's name.
}

// Now we can use the above custom option.
// Note the use of parentheses around the name, which indicate
// that it's an extension name.
option (foo.bar.baz) = "abc";
```

The above demonstrates a custom _file_ option. The same can be done for other kinds of options by simply extending one of the other options messages. For example, extending `MessageOptions` creates custom _message_ options.

### Source code information

A `FileDescriptorProto` may optionally contain source code information. It's modeled via the Protobuf message [`SourceCodeInfo`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L806-L808) and indicates position information (line and column) for elements defined in the file, such as the location in the file where a particular message or field is declared. It also includes comment information, such as documentation comments for said message or field.However, the way it's modeled is neither intuitive nor simple.One might imagine storing the location spans and comments inline in each descriptor Protobuf message. But that would make each message larger even when no source code info is present (at least in most languages, where the fields are laid out into a struct in memory and take up space even if they're all null or empty). It also makes stripping source code info more complicated and error-prone: every element in the hierarchy must be visited to clear out these fields.To avoid these issues, source code info is stored in a separate, “look-aside” structure. It's a [separate field](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L81-L85) on the `FileDescriptorProto`, so stripping this information is as trivial as clearing that one field. And, since it’s not inlined, structs that represent descriptor Protobuf messages in generated code aren’t bloated with extra fields.This look-aside structure is keyed by an element’s “path”. The element’s path represents a traversal from the root of the `FileDescriptorProto` message to where that element is defined.Let’s look at an example:

```protobuf
syntax = "proto3";

package foo.bar;

enum Foo {
  FOO_UNSPECIFIED = 0;
  FOO_BAR = 1;
  FOO_BAZ = 2;
}

message Fizz {
  string name = 1;
}

message Buzz {
  uint64 id = 1;
  repeated string tags = 2;
  Foo foo = 3;
}
```

The above source turns into a `FileDescriptorProto` message that looks more or less like the following:

```json
{
  "syntax": "proto3",
  "package": "foo.bar",
  "enum": [
    {
      "name": "Foo",
      "value": [
        { "name": "FOO_UNSPECIFIED", "number": 0 },
        { "name": "FOO_BAR", "number": 1 },
        { "name": "FOO_BAZ", "number": 2 }
      ]
    }
  ],
  "message": [
    {
      "name": "Fizz",
      "field": [
        {
          "name": "name",
          "number": 1,
          "type": "TYPE_STRING",
          "label": "LABEL_OPTIONAL"
        }
      ]
    },
    {
      "name": "Buzz",
      "field": [
        {
          "name": "id",
          "number": 1,
          "type": "TYPE_UINT64",
          "label": "LABEL_OPTIONAL"
        },
        {
          "name": "tags",
          "number": 2,
          "type": "TYPE_STRING",
          "label": "LABEL_REPEATED"
        },
        {
          "name": "foo",
          "number": 3,
          "type": "TYPE_ENUM",
          "label": "LABEL_OPTIONAL",
          "type_name": ".foo.bar.Foo"
        }
      ]
    }
  ]
}
```

If we want to look up the source code info for the field named `tags` of message `Buzz`, we have to traverse the above like so:

1.  First we descend into the top-level field **`message`**. This corresponds to [field number **4**](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L74) of `FileDescriptorProto`, whose type is repeated `DescriptorProto` messages.
2.  We're now in an **array**. `Buzz` is the message at index **1**. Indices are zero-based indices, so the message at index zero is `Fizz`; one is the index of the second entry.
3.  Now we descend into the field named `**field**`. This corresponds to [field number **2**](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L101) of `DescriptorProto`, whose type is repeated `FieldDescriptorProto` messages.
4.  We're in another array. The field `tags` is again the second element, so we go to index **1**.

At this point in the traversal, we have arrived at the definition of the field `tags`. The traversal path is **\[4, 1, 2, 1\]**, corresponding to the field numbers and array indices through which we traversed.For another example, let’s say we want the position of the _name_ of the enum value `FOO_BAZ`—not just the entire declaration but specifically the name. The traversal follows:

1.  Top-level field **`enum`**, which is [field number **5**](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L75).
2.  Into index **0** of the array (first and only item in this array).
3.  Field **`value`**, which is [field number **2**](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L253).
4.  Into index **2** of the array.
5.  Field **`name`**, which is [field number **1**](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L280).

So the path to this element is **\[5, 0, 2, 2, 1\]**.Given a traversal path, we can then examine the file’s [`source_code_info`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L85) field, if it's present. Therein is a [list of locations](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L852), each of which looks like so:

```protobuf
message Location {
  // The traversal path. The rest of the fields contain information
  // about the element at this path.
  repeated int32 path = 1 [packed = true];

  // This field indicates the position information for the element.
  // Always has exactly three or four elements: start line, start column,
  // end line (optional, otherwise assumed same as start line), end column.
  // These are packed into a single field for efficiency.  Note that line
  // and column numbers are zero-based -- typically you will want to add
  // 1 to each before displaying to a user.
  repeated int32 span = 2 [packed = true];

  // The fields below contain comments for the element. Comments are present
  // only for full declarations. For example, the path to a field will have
  // comments for that field. But traversal paths to components in the field
  // (like its name, number, or type) won't have comments.

  // The comments right before the element. This is typically a documentation
  // comment for the element.
  optional string leading_comments = 3;
  // The comments right after the element, if present and not associated with
  // the subsequent element.
  optional string trailing_comments = 4;
  // Any detached comments between the previous element and this one. A
  // detached comment may be separated from an element via a blank line or
  // may be otherwise ambiguous and not clearly attached to this element or
  // the previous one. If an element has all three of these fields they're
  // in the following order:
  //    // leading detached comments
  //
  //    // leading comments
  //    element
  //    // trailing comments
  repeated string leading_detached_comments = 6;
}
```

So we can iterate through the locations to find one that has a matching path. You can read more about how a compiler populates source code info in the [Protobuf Guide](https://protobuf.com/docs/descriptors#source-code-info).

::: tip NoteDescriptor information that is embedded in generated code _will not_ include source code info. This is to reduce the size of the resulting packages and/or compiled binaries. Descriptors provided to code generation plugins, on the other hand, _should always_ include source code info. That way a code generator can propagate comments in the Protobuf source to comments in generated code.

:::

### Generating and exchanging descriptors

The final message of note in `google/protobuf/descriptor.proto` is [`FileDescriptorSet`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L54-L58): this is a collection of files, typically in topological order. Topological order means that a file in the set always appears _after_ all files that it depends on. So a program that's processing the files can simply iterate over the contents and know that any dependencies of a file have already been processed.Compilers can produce a file containing a serialized `FileDescriptorSet`.The `-o` option tells buf to create a file with the given name. Its contents are a serialized `FileDescriptorSet`, encoded using the Protobuf binary format. You may optionally specify the `--exclude-source-info` flag to strip source code info from the resulting descriptors. This can shrink the resulting file, if source code info isn't needed (depends on how the descriptors are used).

```console
$ buf build ./proto \
    -o descriptors.binpb
```

The `-o` option works the same way with `protoc`. The `--include_imports` flag is important: without it, the resulting file may be incomplete and not loadable by an application. The `--include_source_info` flag is optional: without it, the resulting descriptors won't contain source code info (which may or may not be useful, depending on how the descriptors are used).

```console
$ protoc -I ./proto \
    foo/bar/test.proto \
    -o descriptors.binpb \
    --include_imports \
    --include_source_info
```

Generating these files this way is a common way to exchange descriptors, especially in environments where things like [server reflection](https://github.com/grpc/grpc/blob/master/doc/server-reflection.md) are unavailable. Server reflection is another way to exchange descriptors; it allows clients to download the descriptors that are embedded in the generated code of the server via an RPC.To see an example of code that uses this serialized form and does something useful with it, see the [dynamic message example](#dynamic-messaging) below.

### Quirks of the model

There are a few areas where the way things are represented in these Protobuf messages doesn’t quite match the way they look in the original source or the way we might want them to look for maximum usability.Here are some of the biggest “impedance mismatches” to keep in mind:

- The `name` fields of the various descriptor messages only contain the “simple” name: the single identifier as it appears in source. So users who need to know the [fully qualified name](https://protobuf.com/docs/language-spec#fully qualified-names) of an element must _compute_ that name. This is done by combining the simple name with the enclosing file’s package (and optionally the names of any enclosing messages, if the element is nested inside a message). Here are examples of fully qualified names:

  ```protobuf
  syntax = "proto3";             // Fully qualified names
  package foo.bar;               // ---------------------

  message Baz {                  // foo.bar.Baz
    string name = 1;             // foo.bar.Baz.name
    fixed64 uid = 2;             // foo.bar.Baz.uid
    Settings settings = 3;       // foo.bar.Baz.settings
    message Settings {           // foo.bar.Baz.Settings
      bool frozen = 1;           // foo.bar.Baz.Settings.frozen
      uint32 version = 2;        // foo.bar.Baz.Settings.version
      repeated string attrs = 3; // foo.bar.Baz.Settings.attrs
    }
  }
  ```

- When one descriptor _references_ another—such as the [`type_name`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L190-L195) of a `FieldDescriptorProto` or the [`input_type` or `output_type`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L298-L301) of a `MethodDescriptorProto`—it does so via a fully qualified name **plus a leading dot**. So if a field is an enum of type `foo.bar.Enum`, then the string in the `type_name` field is `".foo.bar.Enum"`.
- In a `FieldDescriptorProto`, there is no value for the [`type`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L186-L188) field that indicates that a field is a map. Instead, a map field has a `type` of `TYPE_MESSAGE`, and the `type_name` field points to a _synthetic_ message. (A synthetic message is one that exists in a `FileDescriptorProto` but has no corresponding message declaration in the source file; it's synthesized by the compiler.)This synthetic message has a boolean option named [`map_entry`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L499-L516) set to true, which indicates that it’s synthetic. The message has two fields: one named `key` with field number 1, and another named `value` with field number 2. The types of these fields match the types of the map key and value in the type declaration. So a type of `map<string, uint64>` results in a `key` field with a type of `TYPE_STRING` and a `value` field with a type of `TYPE_UINT64`.
- In a file that uses “proto3” syntax, use of the `optional` keyword for fields (only normal fields, not extensions) results in a _synthetic_ oneof. The optional field is the only field in that oneof.To distinguish this field from a normal field that happens to be defined in source in a oneof by itself, the field has a boolean setting named [`proto3_optional`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L219-L240) set to true. So you know a oneof is synthetic if it contains exactly one field and that field is marked as `proto3_optional`.
- The [`label`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L184) field of a `FieldDescriptorProto` is **always** present, even if there was no such label in the source. So in “proto3” syntax files, fields that don't indicate a label still have the `label` field set to `LABEL_OPTIONAL`. When the `optional` label keyword _is_ present, a separate [`proto3_optional`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L219-L240) field on the `FieldDescriptorProto` is also set to true. (See above bullet.)
- The [`json_name`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L211-L215) field of a `FileDescriptorProto` is **always** present, even if there was no such option on the field in source. This is intended to assist code generation plugins, so they know the correct JSON name for the field even when it wasn't explicitly set. The downside, however, is that it's not always possible to determine whether a field indicated a custom JSON name explicitly (at least not without access to the original source).
- The [`syntax`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L87-L91) field of a `FileDescriptorProto` is **always** present, even if there was no such statement in the source file. Instead of the field being absent, it's set to the string `"proto2"`. So it's not possible to determine whether a file omitted the syntax statement without access to the original source.

## Runtime library support

Many of the quirks described above are solved by Protobuf runtime libraries that provide good support for descriptors. Where such support exists, it's provided by _wrapper types_, which wrap the Protobuf messages and provide an improved interface.These wrapper types are nearly eponymous with the underlying types, except they don't have any `Proto` suffixes. For example:

- `FileDescriptor` is a wrapper around a `FileDescriptorProto`.
- `Descriptor` (or `MessageDescriptor` in some languages, such as Go and C#) is a wrapper around a `DescriptorProto`.
- The same pattern applies for `FieldDescriptor`, `OneofDescriptor`, `EnumDescriptor`, `EnumValueDescriptor`, `ServiceDescriptor`, and `MethodDescriptor`.

These wrapper types are the most common way that applications make use of descriptors. They improve on the Protobuf messages by providing the following:

1.  They provide resolved descriptor instances instead of strings when examining references.For example, the `type_name` field of a `FieldDescriptorProto` is just a string. If we want to know the actual definition of the referenced type, we have to look at other elements in the enclosing file and possibly all of its imports. The string is a fully qualified name, but names in descriptor Protobuf messages aren't qualified, so we have to compute fully qualified names for each element as we search until finding a match.But with a `FieldDescriptor` (the wrapper type, no `Proto` suffix), we can access the referenced type and get back a proper descriptor (another wrapper type)—either an `EnumDescriptor` or a `MessageDescriptor`, for example.
2.  They provide access _up_ the hierarchy.With an `EnumDescriptorProto` for example, one can easily examine _down_ the hierarchy, accessing its children such as `EnumValueDescriptorProto` messages. But there is no simple way to access its enclosing `FileDescriptorProto`.An `EnumDescriptor` on the other hand (wrapper type, no `Proto` suffix) makes traversing upwards in the hierarchy easy. Runtime libraries provide a way to access an element’s immediate parent as well as a way to access the element’s enclosing file.
3.  They provide the element’s fully qualified name. As mentioned already, the `name` field in a raw Protobuf message for a descriptor is a simple, unqualified name. The runtimes’ wrapper types take care of the work of computing the fully qualified names.
4.  Some of the runtimes also provide capabilities for easily querying for source code info for a descriptor, so you don’t have to worry about computing the path for an element yourself.

Perhaps counter-intuitively, the process for instantiating these wrapper types is _file-centric_. To create a descriptor for a message or RPC service, you have to first create the descriptor for the _file_ that contains the message or service (from a `FileDescriptorProto`), and then you can query the file to get the relevant `MessageDescriptor` or `ServiceDescriptor`. Also, you must have `FileDescriptorProto` instances for the entire transitive closure of the file—so you need a descriptor for the file itself, all of its imports, all of their imports, and so on. When creating a `FileDescriptor` this way, it's imperative that the source file’s `import` statements match the paths used when the imported files themselves were compiled. (See [Protobuf files and packages](../protobuf-files-and-packages/) for more details.)Six of the official runtimes (those implemented and supported by Google) support descriptors. The sections below provide links to relevant API documentation as well as briefly describing the process for creating a `FileDescriptor` wrapper type.

### C++

- [`google/protobuf/descriptor.h`](https://protobuf.dev/reference/cpp/api-docs/google.protobuf.descriptor/): This header file defines the descriptor wrapper types.
- [`google/protobuf/descriptor.pb.h`](https://protobuf.dev/reference/cpp/api-docs/google.protobuf.descriptor.pb/): This generated header file defines the descriptor Protobuf messages.

To create a [`FileDescriptor`](https://protobuf.dev/reference/cpp/api-docs/google.protobuf.descriptor#FileDescriptor) from a `FileDescriptorProto`, use [`DescriptorPool::BuildFile`](https://protobuf.dev/reference/cpp/api-docs/google.protobuf.descriptor#DescriptorPool.BuildFile.details). All of the file’s dependencies must have already been built using the same pool.

### Java

- [`com.google.protobuf.Descriptors`](https://protobuf.dev/reference/java/api-docs/com/google/protobuf/Descriptors.html): This class contains the descriptor wrapper types.
- [`com.google.protobuf.DescriptorProtos`](https://protobuf.dev/reference/java/api-docs/com/google/protobuf/DescriptorProtos.html): This class contains the generated code for the descriptor Protobuf messages.

To create a [`FileDescriptor`](https://protobuf.dev/reference/java/api-docs/com/google/protobuf/Descriptors.FileDescriptor.html) from a [`FileDescriptorProto`](https://protobuf.dev/reference/java/api-docs/com/google/protobuf/DescriptorProtos.FileDescriptorProto.html), use [`FileDescriptor.buildFrom`](https://protobuf.dev/reference/java/api-docs/com/google/protobuf/Descriptors.FileDescriptor.html#buildFrom-com.google.protobuf.DescriptorProtos.FileDescriptorProto-com.google.protobuf.Descriptors.FileDescriptor:A-). All of the file’s dependencies must have already been built and are passed to this function along with the `FileDescriptorProto`.

### Go

- [`google.golang.org/protobuf/reflect/protoreflect`](https://pkg.go.dev/google.golang.org/protobuf/reflect/protoreflect): This package defines the descriptor wrapper type interfaces.
- [`google.golang.org/protobuf/types/descriptorpb`](https://pkg.go.dev/google.golang.org/protobuf/types/descriptorpb): This package contains the generated code for the descriptor Protobuf messages.
- [`google.golang.org/protobuf/reflect/protoregistry`](https://pkg.go.dev/google.golang.org/protobuf/reflect/protoregistry): This package defines types that are registries of descriptors, similar to “descriptor pools” in some other runtimes.
- [`google.golang.org/protobuf/reflect/protodesc`](https://pkg.go.dev/google.golang.org/protobuf/reflect/protodesc): This package provides functions for converting between descriptor Protobuf messages and descriptor wrapper types.

To create a [`protoreflect.FileDescriptor`](https://pkg.go.dev/google.golang.org/protobuf/reflect/protoreflect#FileDescriptor) from a [`descriptorpb.FileDescriptorProto`](https://pkg.go.dev/google.golang.org/protobuf/types/descriptorpb#FileDescriptorProto), use [`protodesc.NewFile`](https://pkg.go.dev/google.golang.org/protobuf/reflect/protodesc#NewFile) and provide a [`protoregistry.Files`](https://pkg.go.dev/google.golang.org/protobuf/reflect/protoregistry#Files) as the resolver. This requires that all of the file’s dependencies have already been built and [registered](https://pkg.go.dev/google.golang.org/protobuf/reflect/protoregistry#Files.RegisterFile) in the resolver.

### Python

- [`google.protobuf.descriptor`](https://googleapis.dev/python/protobuf/latest/google/protobuf/descriptor.html): This package contains the descriptor wrapper types.
- [`google.protobuf.descriptor_pb2`](https://googleapis.dev/python/protobuf/latest/google/protobuf/descriptor_pb2.html) This package contains the generated code for the descriptor Protobuf messages.

To create a [`FileDescriptor`](https://googleapis.dev/python/protobuf/latest/google/protobuf/descriptor.html#google.protobuf.descriptor.FileDescriptor) from a [`FileDescriptorProto`](https://googleapis.dev/python/protobuf/latest/google/protobuf/descriptor_pb2.html#google.protobuf.descriptor_pb2.FileDescriptorProto), use [`DescriptorPool.Add`](https://googleapis.dev/python/protobuf/latest/google/protobuf/descriptor_pool.html#google.protobuf.descriptor_pool.DescriptorPool.Add). All of the file’s dependencies must have already been added to the same pool. Once added, you can retrieve the resulting `FileDescriptor` using [`DescriptorPool.FindFileByName`](https://googleapis.dev/python/protobuf/latest/google/protobuf/descriptor_pool.html#google.protobuf.descriptor_pool.DescriptorPool.FindFileByName).

### C#

_C# has partial support._

- [`Google.Protobuf.Reflection`](https://protobuf.dev/reference/csharp/api-docs/namespace/google/protobuf/reflection.html): This package contains the descriptor wrapper types and also contains the generated code for the [descriptor Protobuf messages](https://github.com/protocolbuffers/protobuf/blob/main/csharp/src/Google.Protobuf/Reflection/Descriptor.pb.cs).

In C#, the runtime library doesn't provide the ability to create new descriptors at runtime or to create dynamic messages. There is a function ([`FileDescriptor.FromGeneratedCode`](https://protobuf.dev/reference/csharp/api-docs/class/google/protobuf/reflection/file-descriptor.html#class_google_1_1_protobuf_1_1_reflection_1_1_file_descriptor_1a60f045476a821f2562666e88852f1585)) which allows for creating a [`FileDescriptor`](https://protobuf.dev/reference/csharp/api-docs/class/google/protobuf/reflection/file-descriptor.html) from a binary-encoded `FileDescriptorProto`, but it also requires other metadata about the corresponding generated types and isn't intended for use outside of the generated code. There is an open [issue in GitHub](https://github.com/protocolbuffers/protobuf/issues/658) about this gap.

### PHP

\_PHP has partial support.\_In PHP, there are [internal classes](https://protobuf.dev/reference/php/api-docs/Google/Protobuf/Internal.html) that represent the descriptor wrapper types and the underlying descriptor Protobuf messages. However, the only related public API, [`DescriptorPool`](https://protobuf.dev/reference/php/api-docs/Google/Protobuf/DescriptorPool.html), is for interacting with descriptors embedded in generated code. So PHP doesn't provide the ability to create new descriptors at runtime or to create dynamic messages.

### TypeScript / JavaScript

::: tip Note[Protobuf-ES](https://github.com/bufbuild/protobuf-es) is the ECMAScript implementation of Protobuf, created by Buf.

:::

- The wrapper types are `DescFile` and related types from `@bufbuild/protobuf`.
- `@bufbuild/protobuf/wkt` exports the generated code for the descriptor Protobuf messages.
- `FileRegistry` and `Registry` from `@bufbuild/protobuf` are registries of descriptors, similar to “descriptor pools” in some other runtimes.

To create a `DescFile` from a `FileDescriptorProto` or `FileDescriptorSet` message, use `createFileRegistry()`. For a full example, see the [Registries](https://github.com/bufbuild/protobuf-es/blob/main/MANUAL.md#registries) section of the documentation.

## Use cases for descriptors

The following sections describe some use cases that require the use of descriptors and include links to relevant runtime library APIs and example code.

### Reflection

The most common reason to use descriptors is for reflection. Reflection allows runtime introspection of the Protobuf schema for generated types, such as querying for field options or custom message options. Reflection also allows code to modify a message value in a generic way, without needing to know the concrete message type at compile time.Each language runtime provides a way to access descriptors for generated types.

#### C++

Generated message classes in C++ are sub-classes of [`Message`](https://protobuf.dev/reference/cpp/api-docs/google.protobuf.message#Message) and thus have a method named `GetDescriptor`. They also have a method named `GetReflection`, which allows for reflective access to the message’s fields (both for reading and writing field values).

::: tip NoteNote that if a file uses an option like [`option optimize_for = LITE_RUNTIME;`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L377-L384) then the generated messages are instead sub-classes of [`MessageLite`](https://protobuf.dev/reference/cpp/api-docs/google.protobuf.message_lite#MessageLite) and thus _don't include support for descriptors or reflection_.

:::

#### Java

Generated message classes in Java implement the [`Message`](https://protobuf.dev/reference/java/api-docs/com/google/protobuf/Message.html) interface, which provides descriptor access via the [`getDescriptorForType`](https://protobuf.dev/reference/java/api-docs/com/google/protobuf/MessageOrBuilder.html#getDescriptorForType--) method. Reflection is done via methods like [`getField`](https://protobuf.dev/reference/java/api-docs/com/google/protobuf/MessageOrBuilder.html#getField-com.google.protobuf.Descriptors.FieldDescriptor-) and [`getRepeatedField`](https://protobuf.dev/reference/java/api-docs/com/google/protobuf/MessageOrBuilder.html#getRepeatedField-com.google.protobuf.Descriptors.FieldDescriptor-int-). Messages are immutable in Java. To modify a message via reflection, one must first call the [`toBuilder`](https://protobuf.dev/reference/java/api-docs/com/google/protobuf/Message.html#toBuilder--) method to convert it to a [`Message.Builder`](https://protobuf.dev/reference/java/api-docs/com/google/protobuf/Message.Builder.html) and then use methods like [`clearField`](https://protobuf.dev/reference/java/api-docs/com/google/protobuf/Message.Builder.html#clearField-com.google.protobuf.Descriptors.FieldDescriptor-), [`setField`](https://protobuf.dev/reference/java/api-docs/com/google/protobuf/Message.Builder.html#setField-com.google.protobuf.Descriptors.FieldDescriptor-java.lang.Object-), and [`setRepeatedField`](https://protobuf.dev/reference/java/api-docs/com/google/protobuf/Message.Builder.html#setRepeatedField-com.google.protobuf.Descriptors.FieldDescriptor-int-java.lang.Object-).

::: tip NoteNote that if a file uses an option like [`option optimize_for = LITE_RUNTIME;`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L377-L384) then the generated messages instead implement [`MessageLite`](https://protobuf.dev/reference/java/api-docs/com/google/protobuf/MessageLite.html) and thus _don't include support for descriptors or Protobuf reflection_.

:::

#### Go

Generated message structs in Go implement the [`proto.Message`](https://pkg.go.dev/google.golang.org/protobuf@v1.30.0/proto#Message) interface, which includes a `ProtoReflect()`[`protoreflect.Message`](https://pkg.go.dev/google.golang.org/protobuf@v1.30.0/reflect/protoreflect#Message) method. A descriptor can be accessed by calling `Descriptor()` on the returned value. The other methods on the returned value provide reflection capability, with methods for both querying and mutating the message data.

#### Python

Generated message classes in Python are sub-classes of [`Message`](https://googleapis.dev/python/protobuf/latest/google/protobuf/message.html#google.protobuf.message.Message). This provides methods for querying and mutating the message via reflection and also includes a property named [`DESCRIPTOR`](https://googleapis.dev/python/protobuf/latest/google/protobuf/message.html#google.protobuf.message.Message.DESCRIPTOR), for access the message’s descriptor.

#### C#

Generated message classes in C# implement the [`IMessage`](https://protobuf.dev/reference/csharp/api-docs/interface/google/protobuf/i-message.html) interface, which provides descriptor access via the [`Descriptor`](https://protobuf.dev/reference/csharp/api-docs/interface/google/protobuf/i-message.html#interface_google_1_1_protobuf_1_1_i_message_1a24048acbef2a93302c9bdb95e06515b2) property. Reflection is achieved by using the [`Accessor`](https://protobuf.dev/reference/csharp/api-docs/class/google/protobuf/reflection/field-descriptor.html#class_google_1_1_protobuf_1_1_reflection_1_1_field_descriptor_1a509b69a54b1f9df7391417c041a675b4) method on [`FieldDescriptor`](https://protobuf.dev/reference/csharp/api-docs/class/google/protobuf/reflection/field-descriptor.html) instances, which provides the ability to reflectively query and modify field values.

#### PHP

In PHP code, descriptors can be queried by first calling [`DescriptorPool::getGeneratedPool()`](https://protobuf.dev/reference/php/api-docs/Google/Protobuf/DescriptorPool.html#method_getGeneratedPool) and then using the [`getDescriptorByClassName`](https://protobuf.dev/reference/php/api-docs/Google/Protobuf/DescriptorPool.html#method_getDescriptorByClassName) method of the returned pool. This provides access to descriptors, however _reflection isn't supported in PHP_.

#### Example

The example code below demonstrates using reflection in Go. It’s a simple redaction function that removes field values that may contain sensitive data. The function accepts any kind of message (all generated structs that correspond to Protobuf messages implement the `proto.Message` interface), uses its message descriptor to inspect all fields, and, for each field where the [`debug_redact`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/descriptor.proto#L630-L632) option is set, it clears the field value in the message.

```go
package redact

import (
    "google.golang.org/protobuf/proto"
    "google.golang.org/protobuf/reflect/protoreflect"
    "google.golang.org/protobuf/types/descriptorpb"
)

// Redact removes field values from the given message for fields that are
// marked with the "debug_redact" option.
func Redact(message proto.Message) {
    redact(message.ProtoReflect())
}

func redact(msgReflect protoreflect.Message) {
    msgReflect.Range(func(field protoreflect.FieldDescriptor, value protoreflect.Value) bool {
        // Clear the field if it's redacted
        if field.Options().(*descriptorpb.FieldOptions).GetDebugRedact() {
            msgReflect.Clear(field)
            return true
        }

        // If keeping the field, we need to recurse into any nested messages
        // to clear any redacted fields therein.
        switch {
        case field.IsMap() && isMessageKind(field.MapValue().Kind()):
            // map where values are messages
            value.Map().Range(func(mapKey protoreflect.MapKey, mapValue protoreflect.Value) bool {
                redact(mapValue.Message())
                return true
            })
        case field.IsList() && isMessageKind(field.Kind()):
            // list of messages
            list := value.List()
            for i := 0; i < list.Len(); i++ {
                redact(list.Get(i).Message())
            }
        case isMessageKind(field.Kind()):
            // singular message
            redact(value.Message())
        }
        return true
    })
}

func isMessageKind(kind protoreflect.Kind) bool {
    return kind == protoreflect.MessageKind || kind == protoreflect.GroupKind
    // NOTE: Groups are a legacy feature of proto2. A group field
    // behaves semantically just like a message field, but it has
    // a special encoding in the binary format.
}
```

### Dynamic messaging

Dynamic messages are used to interact with message data for types that are _not known_ at compile time. The typical flow for using Protobuf messages is to generate code for a particular message type and then use that generated code to interact with message data (like reading and validating or writing serialization formats). That obviously requires knowledge of the message type ahead of time.But for generic tooling like a dynamic proxy, where the set of message types that may need to be processed isn't known ahead of time, we have to use dynamic messages.The basic outline for such a generic message processing tool follows:

1.  The tool must be given the schema for the message to be processed. For the simplest case, let’s say we're building a command-line tool. So we can have the user tell the tool the fully qualified name of the message to process. The user must also provide the descriptors which define the message for the schema (which can be produced [by a compiler](#generating-and-exchanging-descriptors)).
2.  The tool needs to process the given descriptors and find the descriptor for the requested message type. The descriptors are provided in the form of a set of `FileDescriptorProto` messages. So we have to convert these to “rich” `FileDescriptor` values and then use the given fully qualified name to find the matching message descriptor.
3.  Now we get to the good part: once we have a message descriptor, we can create a dynamic message. In all runtimes that support dynamic messages, this is usually a straight-forward function or constructor that accepts a message descriptor and returns a message. The returned message acts like any other message, so we can use it to de-serialize data.
4.  For our command-line tool, let’s say we’re going to read binary-encoded message data from _stdin_ and then print it in the form of human-readable text to _stdout_. This involves reading data from _stdin_, using the Protobuf runtime library to unmarshal that data into the dynamic message we created in the previous step, marshalling that message using the Text Format, and then printing the results to _stdout_.

Here’s an example Go program that demonstrates each of these steps:

```go
package main

import (
    "fmt"
    "io"
    "log"
    "os"

    "google.golang.org/protobuf/encoding/prototext"
    "google.golang.org/protobuf/proto"
    "google.golang.org/protobuf/reflect/protodesc"
    "google.golang.org/protobuf/reflect/protoreflect"
    "google.golang.org/protobuf/reflect/protoregistry"
    "google.golang.org/protobuf/types/descriptorpb"
    "google.golang.org/protobuf/types/dynamicpb"
)

func main() {
    if len(os.Args) != 3 {
        log.Fatalf("%s: exactly two arguments expected (descriptor set file and message type) but instead got %d\n", os.Args[0], len(os.Args)-1)
    }
    fileDescriptorSet := os.Args[1]
    messageType := protoreflect.FullName(os.Args[2])
    if !messageType.IsValid() {
        log.Fatalf("message type %q isn't a valid fully qualified type name\n", messageType)
    }

    // Read descriptors from file
    var files descriptorpb.FileDescriptorSet
    data, err := os.ReadFile(fileDescriptorSet)
    if err != nil {
        log.Fatalln(err)
    }
    if err := proto.Unmarshal(data, &files); err != nil {
        log.Fatalf("failed to process descriptors in %s: %v\n", fileDescriptorSet, err)
    }

    // Process descriptors from Protobuf into their runtime representation
    var registry protoregistry.Files
    for _, file := range files.File {
        fileDescriptor, err := protodesc.NewFile(file, &registry)
        if err != nil {
            log.Fatalf("failed to process %q: %v\n", file.GetName(), err)
        }
        if err := registry.RegisterFile(fileDescriptor); err != nil {
            log.Fatalf("failed to process %q: %v\n", file.GetName(), err)
        }
    }

    // Get descriptor for message type
    descriptor, err := registry.FindDescriptorByName(messageType)
    if err != nil {
        log.Fatalf("failed to find message type %q in given descriptors: %v\n", messageType, err)
    }
    messageDescriptor, ok := descriptor.(protoreflect.MessageDescriptor)
    if !ok {
        log.Fatalf("element named %q isn't a message (%T)\n", messageType, descriptor)
    }

    // Now we can create a dynamic message and use that to read the binary format from stdin
    messageData, err := io.ReadAll(os.Stdin)
    if err != nil {
        log.Fatalf("failed to read message data from stdin: %v\n", err)
    }
    message := dynamicpb.NewMessage(messageDescriptor)
    if err := proto.Unmarshal(messageData, message); err != nil {
        log.Fatalf("failed to process input data for message type %q: %v\n", messageType, err)
    }

    // And write text format to stdout
    _, _ = fmt.Print(prototext.Format(message))
}
```

### Code generation

The plugin protocol, for implementing custom code generation with Protobuf, is built on file descriptors: a plugin process reads a serialized [`CodeGeneratorRequest`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/compiler/plugin.proto#L65) from its stdin, and that message includes [`FileDescriptorProto`](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/compiler/plugin.proto#L75-L89) instances for the files being generated (as well as all of their imports).So one could use similar techniques to the code sample above for processing `FileDescriptorProto` instances into richer descriptors, to make working with the schema easier.Luckily, it’s not necessary to get into such low-level details if you are writing a plugin in C++ or Go. These runtimes provide some library support to help with authoring plugins.

#### C++

The C++ runtime library includes [helpers](https://protobuf.dev/reference/cpp/api-docs/google.protobuf.compiler.plugin/) for implementing code generation plugins. Simply create a sub-class of [`CodeGenerator`](https://protobuf.dev/reference/cpp/api-docs/google.protobuf.compiler.code_generator#CodeGenerator) that overrides the pure virtual `Generate` method. Then create a `main` function for your program that calls `PluginMain`, like so:

```cpp
int main(int argc, char* argv[[]]) {
   MyCodeGenerator generator;
   return google::protobuf::compiler::PluginMain(argc, argv, &generator);
}
```

Your generator is provided the `FileDescriptor*` for which code should be generated.The [`GeneratorContext*`](https://protobuf.dev/reference/cpp/api-docs/google.protobuf.compiler.code_generator#GeneratorContext) passed to your generator has methods you can use to create the output files into which you write the generated code contents. It offers both `Open`, for creating generated files, and `OpenForInsert`, for generating content to insert into another generated file.

::: tip NoteYou must use these methods—creating files directly on the file system isn't allowed.

:::

Use of insertions and insertion points isn't supported by all plugins. But for plugins that _do_ support insertions, you’ll see markers in their generated output that look like `@@protoc_insertion_point(NAME)` (for example, [here](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/timestamp.pb.cc#L14) and [here](https://github.com/protocolbuffers/protobuf/blob/v22.0/src/google/protobuf/timestamp.pb.cc#L319)). These are places in the generated code into which another plugin can _inject more code_. This allows one plugin to _augment_ the code generated by another plugin.The C++ runtime also includes a few helper functions to aid in writing plugins for a handful of languages. These functions can be useful if the code you are generating needs to import code generated by the one of the core generators and/or refer to generated types and symbols. These helpers are available for [C#](https://protobuf.dev/reference/cpp/api-docs/google.protobuf.compiler.csharp_names/), [Java](https://protobuf.dev/reference/cpp/api-docs/google.protobuf.compiler.java_names/), and [Objective C](https://protobuf.dev/reference/cpp/api-docs/google.protobuf.compiler.objectivec_helpers/).

#### Go

The Go runtime library includes a package to help implement code generation plugins. Simply create a function that accepts a [`*protogen.Plugin`](https://pkg.go.dev/google.golang.org/protobuf/compiler/protogen#Plugin) and drop the following in your `main` function:

```go
func main() {
    protogen.Options{}.Run(func myCodeGen(plugin *protogen.Plugin) error {
        // ... generate code ...
    })
}
```

The `*protogen.Plugin` passed to your function indicates the source files for which code should be generated. These are in the form of [`protogen.File`](https://pkg.go.dev/google.golang.org/protobuf/compiler/protogen#File) values. This type is a wrapper around a `protoreflect.FileDescriptor`. It provides a parallel structure, for accessing other wrapped descriptors (such as [`protogen.Message`](https://pkg.go.dev/google.golang.org/protobuf/compiler/protogen#Message) and [`protogen.Service`](https://pkg.go.dev/google.golang.org/protobuf/compiler/protogen#Service)). These provide additional metadata about each element to aid with generating Go code.The `*protogen.Plugin` also provides a [`NewGeneratedFile`](https://pkg.go.dev/google.golang.org/protobuf/compiler/protogen#Plugin.NewGeneratedFile) method for creating output files. The [`*GeneratedFile`](https://pkg.go.dev/google.golang.org/protobuf/compiler/protogen#GeneratedFile) type implements `io.Writer`, for writing generated code contents, but also has several other functions to aid in the generation of Go code.

::: tip NoteThe Go runtime library _doesn't support insertion points._ Also note that you must use this method to create output—creating files directly on the file system isn't allowed.

:::

#### TypeScript / JavaScript

::: tip Note[Protobuf-ES](https://github.com/bufbuild/protobuf-es) is the ECMAScript implementation of Protobuf, created by Buf.

:::

The `@bufbuild/protoplugin` package provides a framework for ECMAScript code generation plugins. You create a plugin with the `createEcmaScriptPlugin` function and provide a function for the `generateTs` property. This function receives a `Schema`, which provides descriptors for files to generate in `Schema.files`.To generate a file, call `Schema.generateFile`. The returned object provides several methods to add code to the file. The `runNodeJs` function runs the plugin with stdin and stdout on Node.js.

```typescript
import { createEcmaScriptPlugin, runNodeJs } from "@bufbuild/protoplugin";

const plugin = createEcmaScriptPlugin({
  name: "protoc-gen-hello",
  version: "v1",
  generateTs(schema) {
    // ... generate code ...
  },
});
runNodeJs(plugin);
```

For a full example, see the [Writing plugins](https://github.com/bufbuild/protobuf-es/blob/main/MANUAL.md#writing-plugins) section of the documentation.
