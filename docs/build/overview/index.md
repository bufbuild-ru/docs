---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/build/overview/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/curl/usage/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/build/tutorial/"
  - - meta
    - property: "og:title"
      content: "Overview - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/build/overview.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/build/overview/"
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
      content: "Overview - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/build/overview.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Build Buf images – Overview

Buf CLI operations are based on Protobuf files that have been successfully compiled, or built. Building an [image](../../reference/images/) from the `.proto` files that define the schema is the first step `buf` executes when running commands like `buf lint` and `buf breaking`. The tooling compiles the `.proto` files into a single binary file that can be easily shared and stored. Generating an image with `buf build`, in its simplest form, is a way to verify that the [input](../../reference/inputs/) successfully compiles.

Generally you won't need to generate images directly, but if needed, you can build an image with `buf build`, where `-o` tells it to output to the provided file (and its implied format):

```sh
buf build -o image.binpb
```

The resulting Buf image is written to the `image.binpb` file. The ordering of the `FileDescriptorProto`s is carefully written to mimic the ordering that `protoc` produces, for both the cases where imports are and aren't written.

Images can be output in one of three formats:

- [Binary](https://protobuf.dev/programming-guides/encoding/)
- [JSON](https://protobuf.dev/programming-guides/proto3#json)
- [Text](https://protobuf.dev/reference/protobuf/textformat-spec/)

Any format can be compressed using Gzip or Zstandard. The special value `-` is used to denote stdout and you can manually set the format. For example:

```sh
buf build -o -#format=json
```

## Usage examples

### Strip imports and source code info

By default, `buf` produces a [Buf image](../../reference/images/) with both imports and source code info. You can strip each of these:

```sh
buf build --exclude-imports --exclude-source-info -o image.binpb
```

In general, we don't recommend stripping them, as this information can be useful for various operations. Source code info, however, takes up a lot of additional space (about ~5x more), so if you know you don't need this data, it can be useful to leave it out.

### Remove `ImageFileExtension` field

Images always include the `ImageFileExtension` field. If you want a pure `FileDescriptorSet` without this field set, to mimic `protoc` entirely:

```sh
buf build -o image.binpb --as-file-descriptor-set
```

The `ImageFileExtension` field doesn't affect Protobuf plugins or any other operations. They merely see this as an unknown field, but we provide this option in case you need it.

### Limit to specific files

By default, `buf` builds all files under the `buf.yaml` configuration file. You can instead manually specify the file or directory paths to build. This is an advanced feature intended to be used for editor or [Bazel](../../cli/build-systems/bazel/) integration — it's better to let `buf` discover all files under management and handle this for you.

The compiled result is limited to the given files if the `--path` flag is specified, as in this command:

```sh
buf build --path path/to/foo.proto --path path/to/bar.proto
```

### Limit to specific types

When you run `buf build` to create a [`FileDescriptorSet`](https://github.com/protocolbuffers/protobuf/blob/main/src/google/protobuf/descriptor.proto) or Buf image, the output contains all the Protobuf types declared in the module by default. However, for some advanced use cases you may want the image or `FileDescriptorSet` to contain only a subset of the types described in your Protobuf schemas.

Versions 1.1.0 and later of the Buf CLI include a `--type` option for the `buf build` command. It enables you to supply a fully qualified Protobuf name and limit the resulting image or `FileDescriptorSet` to only those descriptors required to represent those types and their required dependencies. This example usage restricts the output types to those required to represent `pkg.foo.Bar`:

```sh
buf build --type pkg.foo.Bar
```

The `--type` flag accepts fully qualified names for [messages](https://developers.google.com/protocol-buffers/docs/proto3#simple), [enums](https://protobuf.dev/programming-guides/proto3/#enum), and [services](https://protobuf.dev/programming-guides/proto3/#services). These dependent descriptors are included in the build:

- [Messages](https://developers.google.com/protocol-buffers/docs/proto3#simple)
  - Messages and enums referenced in message fields
  - Any [proto2](https://protobuf.dev/programming-guides/proto2/) extension declarations for message fields
  - The parent message if this message is a nested definition
  - Any custom options for the message, its fields, and the file in which the message is defined
- [Enums](https://protobuf.dev/programming-guides/proto3/#enum)
  - The enum value descriptors for this enum
  - The parent message is this enum is a nested definition
  - Any custom options for the enum, enum values, and the file in which the enum is defined
- [Services](https://protobuf.dev/programming-guides/proto3/#services)
  - Request and response types referenced in service methods
  - Any custom options for the services, its methods, and the file in which the service is defined

You can specify multiple types by applying the `--type` option multiple times, as in this example:

```sh
buf build \
  --type acme.weather.v1.Units \
  --type acme.weather.v1.CurrentWeather.Temperature
```

In this case, dependent descriptors for both `acme.weather.v1.Units` and `acme.weather.v1.CurrentWeather.Temperature` are included in the output.

As a final example, consider these two `.proto` files:

::: info foo.proto

```protobuf
package pkg;
message Foo {
  optional Bar bar = 1;
  extensions 2 to 3;
}
message Bar {...}
message Baz {
  other.Qux qux = 1 [(other.my_option).field = "buf"];
}
```

:::

::: info bar.proto

```protobuf
package other;
extend Foo {
  optional Qux baz = 2;
}
message Qux{...}
message Quux{...}
extend google.protobuf.FieldOptions {
  optional Quux my_option = 51234;
}
```

:::

This table shows which files, messages, and extensions are included for various types from `foo.proto` and `bar.proto` if specified as the argument to `--type`:

| Type                       | Files                    | Messages                             | Extensions        |
| :------------------------- | :----------------------- | :----------------------------------- | :---------------- |
| `buf build --type pkg.Foo` | `foo.proto`, `bar.proto` | `pkg.Foo`, `pkg.Bar`, `other.Qux`    | `other.baz`       |
| `buf build --type pkg.Bar` | `foo.proto`              | `pkg.Bar`                            |                   |
| `buf build --type pkg.Baz` | `foo.proto`, `bar.proto` | `pkg.Baz`, `other.Quux`, `other.Qux` | `other.my_option` |
