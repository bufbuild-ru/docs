---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/images/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/inputs/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/internal-compiler/"
  - - meta
    - property: "og:title"
      content: "Buf images - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/images.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/images/"
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
      content: "Buf images - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/images.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Buf images

Buf images are a powerful tool for distributing and sharing compiled Protocol Buffer (Protobuf) schemas across your organization. They provide a compact and efficient representation of a Protobuf schema, allowing you to easily manage the evolution of your schema and ensure compatibility across multiple systems.

A Buf image is a binary representation of a compiled Protobuf schema, optimized for distribution and use in multiple systems. It captures the complete state of a Protobuf schema, including all messages, enums, and services and their relationships to each other.

Buf images are designed to be forwards- and backwards-compatible, allowing you to manage the evolution of your schema over time without breaking compatibility with existing systems. They also include a rich set of metadata, such as source code locations and comments, that can be used to provide additional context and understanding of your schema.

Linting and breaking change detection internally operate on Buf images that the Buf CLI either produces on the fly or reads from an external location. They represent a stable, widely used method to represent a compiled Protobuf schema. For the breaking change detector, images are the storage format used if you want to manually store the state of your Protobuf schema. See the [input documentation](../inputs/) for more details.

## How Buf images work

Buf images are built using the `buf build` command, which compiles your `.proto` files into a single binary file. It takes as input a `buf.yaml` configuration file that defines the set of `.proto` files to include in the image and any additional configuration options.

Once the Buf image is built, it can be distributed and used in multiple systems, either by copying the binary file or by publishing it to a repository, such as a artifact repository or version control system.

To use a Buf image in a system, you need to install the Buf tooling and configure your build system to include the Buf image in your dependencies. The Buf tooling provides a number of features for working with Buf images, including validation, generation of language bindings, and more.

An image is Buf's custom extension to the Protobuf `FileDescriptorSet`. Due to the forwards- and backwards-compatible nature of Protobuf, we add a field to `FileDescriptorSet` while maintaining compatibility in both directions — existing Protobuf plugins drop this field, and the Buf CLI doesn't require the field to be set to work with images.

[Modules](../../cli/modules-workspaces/) are the primitive of Buf, and Buf images represent the compiled artifact of a module. In fact, images contain information about the module used to create it, which powers a variety of [Buf Schema Registry](../../bsr/) features. For clarity, the `Image` Protobuf definition is shown below (notice the `ModuleInfo` in the `ImageFileExtension`):

```protobuf
// Image is an extended FileDescriptorSet.
message Image {
  repeated ImageFile file = 1;
}

// ImageFile is an extended FileDescriptorProto.
//
// Since FileDescriptorProto doesn't have extensions, we copy the fields from
// FileDescriptorProto, and then add our own extensions via the buf_extension
// field. This is compatible with a FileDescriptorProto.
message ImageFile {
  optional string name = 1;
  optional string package = 2;
  repeated string dependency = 3;
  repeated int32 public_dependency = 10;
  repeated int32 weak_dependency = 11;
  repeated google.protobuf.DescriptorProto message_type = 4;
  repeated google.protobuf.EnumDescriptorProto enum_type = 5;
  repeated google.protobuf.ServiceDescriptorProto service = 6;
  repeated google.protobuf.FieldDescriptorProto extension = 7;
  optional google.protobuf.FileOptions options = 8;
  optional google.protobuf.SourceCodeInfo source_code_info = 9;
  optional string syntax = 12;

  // buf_extension contains buf-specific extensions to FileDescriptorProtos.
  //
  // The prefixed name and high tag value is used to all but guarantee there
  // will never be any conflict with Google's FileDescriptorProto definition.
  // The definition of a FileDescriptorProto has not changed in years, so
  // we're not too worried about a conflict here.
  optional ImageFileExtension buf_extension = 8042;
}

message ImageFileExtension {
  // is_import denotes whether this file is considered an "import".
  optional bool is_import = 1;
  // ModuleInfo contains information about the Buf module this file belongs to.
  optional ModuleInfo module_info = 2;
  // is_syntax_unspecified denotes whether the file did not have a syntax explicitly specified.
  optional bool is_syntax_unspecified = 3;
  // unused_dependency are the indexes within the dependency field on
  // FileDescriptorProto for those dependencies that aren't used.
  repeated int32 unused_dependency = 4;
}
```

Images always include the `ImageExtension` field. But if you want a pure `FileDescriptorSet` without this field set, and thus to mimic `protoc` entirely, you can build using the `--as-file-descriptor-set` flag:

```console
$ buf build -o image.binpb --as-file-descriptor-set
```

The `ImageExtension` field doesn't affect Protobuf plugins or any other operations, as they merely see this as an unknown field, but we provide the option in case you want it.

## How Protobuf plugins work

When you invoke this command:

```console
$ protoc -I . --go_out=gen/go foo.proto
```

here's (roughly) what happens:

- `protoc` compiles the file `foo.proto` (and any imports) and internally produces a [`FileDescriptorSet`](https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/descriptor.proto), which is a list of [`FileDescriptorProto`](https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/descriptor.proto#L62) messages. These messages contain all information about your `.proto` files, including optional source code information such as the start/end line/column of each element of your `.proto` file, as well as associated comments.
- The `FileDescriptorSet` is turned into a [`CodeGeneratorRequest`](https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/compiler/plugin.proto#L68), which contains the `FileDescriptorProto`s that `protoc` produced for `foo.proto` and any imports, a list of the files specified (just `foo.proto` in this example), as well as any options provided after the `=` sign of `--go_out` or with `--go_opt`.
- `protoc` then looks for a binary named `protoc-gen-go`, and invokes it, giving the serialized CodeGeneratorRequest as stdin.
- `protoc-gen-go` runs, and either errors or produces a [`CodeGeneratorResponse`](https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/compiler/plugin.proto#L99), which specifies what files are to be generated and their content. The serialized CodeGeneratorResponse is written to stdout of `protoc-gen-go`.
- On success of `protoc-gen-go`, `protoc` reads stdout and then writes these generated files.

The built-in generators to `protoc`, such as `--java_out`, `--cpp_out`, etc., work in roughly the same manner, although instead of executing an external binary, this is done internally to `protoc`.

**`FileDescriptorSet`s are the core primitive used throughout the Protobuf ecosystem to represent a compiled Protobuf schema. They're also the primary artifact that `protoc` produces.**

Everything you do with `protoc`, and any plugins you use, talk in terms of `FileDescriptorSet`s. [gRPC Reflection](https://github.com/grpc/grpc/blob/master/doc/server-reflection.md) uses them under the hood as well.

## Creating `FileDescriptorSet`s with protoc

`protoc` provides the `--descriptor_set_out` flag, aliased as `-o`, to allow writing serialized `FileDescriptorSet`s. For example, given a single file `foo.proto`, you can write a `FileDescriptorSet` to stdout like this:

```console
$ protoc -I . -o /dev/stdout foo.proto
```

The resulting `FileDescriptorSet` contains a single `FileDescriptorProto` with name `foo.proto`.

By default, `FileDescriptorSet`s don't include any imports not specified on the command line, and don't include source code information. Source code information is useful for generating documentation inside your generated stubs, and for things like linters and breaking change detectors. As an example, assume `foo.proto` imports `bar.proto`. To produce a `FileDescriptorSet` that includes both `foo.proto` and `bar.proto`, as well as source code information:

```console
$ protoc -I . --include_imports --include_source_info -o /dev/stdout foo.proto
```

## Using protoc output as `buf` input

Since `buf` speaks in terms of [Buf images](./) and [`FileDescriptorSet`](https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/descriptor.proto)s are images, we can use `protoc` output as `buf` input. Here's an example for `buf lint`:

```console
$ protoc -I . --include_source_info -o /dev/stdout foo.proto | buf lint -
```

## `protoc` lint and breaking change detection plugins

Since `buf` "understands" [`FileDescriptorSet`](https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/descriptor.proto)s, we also provide [`protoc-gen-buf-lint`](../../cli/protoc-plugins/#lint) and [`protoc-gen-buf-breaking`](../../cli/protoc-plugins/#breaking) as standard Protobuf plugins.
