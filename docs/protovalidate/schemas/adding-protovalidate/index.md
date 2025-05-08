---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/protovalidate/schemas/adding-protovalidate/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/protovalidate/quickstart/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/protovalidate/schemas/standard-rules/"
  - - meta
    - property: "og:title"
      content: "Adding Protovalidate - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/protovalidate/schemas/adding-protovalidate.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/protovalidate/schemas/adding-protovalidate/"
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
      content: "Adding Protovalidate - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/protovalidate/schemas/adding-protovalidate.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Adding Protovalidate to Protobuf projects

This page describes how to add Protovalidate as a dependency and then compile Protovalidate-enabled files with the [Buf CLI](../../../cli/) or [protoc](https://grpc.io/docs/protoc-installation/).

## Compiling with the Buf CLI

If you add Protovalidate rule annotations to a Protobuf file and immediately try to compile your workspace, you'll receive an error similar to the following:

```console
$ buf build
proto/example/v1/building_example.proto:7:5:field building.BuildingExample.string_field:
  unknown extension buf.validate.field
```

Because Protovalidate uses Protobuf options, Protobuf projects must include Protovalidate as a dependency and import Protovalidate within Protobuf files.

::: info Code available
Companion code for this page is available in [GitHub](https://github.com/bufbuild/buf-examples/tree/main/protovalidate/compiling-buf).
:::

### Add Protovalidate

Protovalidate is published to the [Buf Schema Registry](../../../bsr/) as a public dependency at `buf.build/bufbuild/protovalidate`. Follow the steps below to install it. If you're already familiar with BSR modules, you'll notice that they're no different from any other dependency.

First, add Protovalidate to the `deps` section of your `buf.yaml` file:

::: info Add Protovalidate's BSR module

```yaml
version: v2
modules:
  - path: proto
// [!code ++]
deps:
  // [!code ++]
  - buf.build/bufbuild/protovalidate
lint:
  use:
    - STANDARD
breaking:
  use:
    - FILE
```

:::

Next, run `buf dep update`:

::: info Update dependencies with the Buf CLI

```console
$ buf dep update
```

:::

Protovalidate is now installed as a dependency in your Buf CLI workspace.

### Import `validate.proto`

Now that Protovalidate is available as a dependency, it can be imported within Protobuf files:

::: info Import buf/validate/validate.proto

```diff
syntax = "proto3";

package bufbuild.weather.v1;

+import "buf/validate/validate.proto";
```

:::

With Protovalidate installed as a dependency and `validate.proto` imported within `.proto` files, the Buf CLI can now `lint`, `build`, and `generate`:

```console
$ buf build
$ echo $?
0
```

## Compiling with protoc

If you add Protovalidate rule annotations to a Protobuf file and immediately try to compile with `protoc`, you'll receive an error similar to the following:

```console
$ protoc proto/example/v1/building_example.proto \
                --cpp_out=:./gen
proto/example/v1/building_example.proto:7:5: Option "(buf.validate.field)" unknown.
  Ensure that your proto definition file imports the proto which defines the
  option.
```

Because Protovalidate uses Protobuf options, Protobuf projects must include Protovalidate as a dependency and import Protovalidate within Protobuf files.

::: info Code available
Companion code for this page is available in [GitHub](https://github.com/bufbuild/buf-examples/tree/main/protovalidate/compiling-protoc).
:::

### Download `validate.proto`

Protovalidate's source `.proto` file is available in [GitHub](https://github.com/bufbuild/protovalidate). Follow the steps below to use it with `protoc`. If you already know how to vendor and include Protobuf dependencies, you'll notice that this is no different from any other dependency.

First, download `validate.proto` to the `vendor` directory:

::: info Download validate.proto as a vendored file

```shell
    $ curl --create-dirs \
        -O \
        --output-dir ./vendor/github.com/bufbuild/protovalidate/buf/validate \
        https://raw.githubusercontent.com/bufbuild/protovalidate/refs/heads/main/proto/protovalidate/buf/validate/validate.proto
```

:::

### Import `validate.proto`

Now that Protovalidate is on the filesystem, you can import it within Protobuf files:

::: info Import buf/validate/validate.proto

```diff
syntax = "proto3";

package bufbuild.weather.v1;

+import "buf/validate/validate.proto";
```

:::

### Update Makefile (optional)

If you use a Makefile to compile with `protoc`, update it to include Protovalidate:

::: info Updating Makefile to include Protovalidate

```diff
.PHONY: protoc
protoc:
   protoc proto/example/v1/building_example.proto \
+  -I. -I./vendor/github.com/bufbuild/protovalidate/ \
   --cpp_out=:./gen
```

:::

### Compile with protoc

With `validate.proto` in the `vendor` directory and imported within `.proto` files, you can now compile with `protoc`'s `-I` flag:

::: info Including Protovalidate protoc

```console
$ protoc proto/example/v1/building_example.proto \
    -I. -I./vendor/github.com/bufbuild/protovalidate/ \
    --cpp_out=:./gen
$ echo $?
0
```

:::

## Next steps

- Learn about the dozens of built-in [standard rules](../standard-rules/) provided with Protovalidate.
- Add [custom validation rules](../custom-rules/) to Protobuf files with CEL.
