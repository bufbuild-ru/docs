---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/protovalidate/schemas/compile-with-protoc/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/migration-guides/migrate-from-protoc-gen-validate/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/protovalidate/cel/"
  - - meta
    - property: "og:title"
      content: "Compile with protoc - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/protovalidate/schemas/compile-with-protoc.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/protovalidate/schemas/compile-with-protoc/"
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
      content: "Compile with protoc - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/protovalidate/schemas/compile-with-protoc.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Compile with protoc

Though we recommend using Buf to [compile your Protobuf files](../../quickstart/), you can use Protovalidate with protoc. However, without the Buf CLI, you won't be able to use linting to validate your rules.

This page describes how to add Protovalidate as a dependency and then compile Protovalidate-enabled files with [protoc](https://grpc.io/docs/protoc-installation/).

::: info Code available
Companion code for this page is available in [GitHub](https://github.com/bufbuild/buf-examples/tree/main/protovalidate/compiling-protoc).
:::

## Download `validate.proto`

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

## Import `validate.proto`

Now that Protovalidate is on the filesystem, you can import it within Protobuf files:

::: info Import buf/validate/validate.proto

```protobuf
syntax = "proto3";

package bufbuild.weather.v1;

import "buf/validate/validate.proto"; // [!code ++]
```

:::

## Update Makefile (optional)

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

## Compile .proto files

With `validate.proto` in the `vendor` directory and imported within `.proto` files, you can now compile with `protoc`'s `-I` flag:

::: info Including Protovalidate protoc

```sh
protoc proto/example/v1/building_example.proto \
    -I. -I./vendor/github.com/bufbuild/protovalidate/ \
    --cpp_out=:./gen
echo $?
0
```

:::
