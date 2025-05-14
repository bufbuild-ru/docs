---
description: "Streamline your Protobuf compilation and code generation with Buf—a guide to migrating from protoc"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/migration-guides/migrate-from-protoc/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/migration-guides/migrate-from-protolock/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/migration-guides/migrate-from-protoc-gen-validate/"
  - - meta
    - property: "og:title"
      content: "Migrate from protoc - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/migration-guides/migrate-from-protoc.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/migration-guides/migrate-from-protoc/"
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
      content: "Migrate from protoc - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/migration-guides/migrate-from-protoc.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Migrate from protoc

The Buf CLI acts as a build system for all your `.proto` compilation and code generation needs. This guide describes how to migrate your existing `protoc` setup and migrate to using `buf`.

This guide assumes that you've [installed `buf`](../../cli/installation/) and generate code by calling`protoc` manually from scripts or a tool like `make`. Other guides are available for users currently using [Protolock](../migrate-from-protolock/) or [Prototool](../migrate-from-prototool/).

We'll cover these common use cases:

- Compile `.proto` files to detect build failures.
- Generate code with `protoc` plugins.

Consider this file layout:

```text
.
├── proto
│   └── acme
│       └── weather
│           └── v1
│               └── weather.proto
└── vendor
    └── protoc-gen-validate
        └── validate
            └── validate.proto
```

This `protoc` command is used to generate Go/gRPC client and server stubs:

```sh
protoc \
    -I proto \
    -I vendor/protoc-gen-validate \
    --go_out=. \
    --go_opt=paths=source_relative \
    --go-grpc_out=. \
    --go-grpc_opt=paths=source_relative \
    $(find proto -name '*.proto')
```

With `protoc`, each `-I` flag represents a directory used to search for imports. For example, given the above `protoc` invocation, the `proto/acme/weather/v1/weather.proto` and `vendor/protoc-gen-validate/validate/validate.proto` files are imported as `acme/weather/v1/weather.proto` and `validate/validate.proto`, respectively.

The placement of the `buf.yaml` is analogous to a `protoc` include (`-I`) path. **With `buf`, there is no `-I` flag** — each `protoc` `-I` path maps to a `path` field in the `buf.yaml` configuration file (called a [module](../../cli/modules-workspaces/)) and collectively defines a workspace.

The example shown above can be adapted to `buf` by adding a `buf.yaml` config file at the root of the `-I` directories (which becomes the root of the workspace) and specifying both directories as modules:

```text
.
├── buf.yaml
├── proto
│   └── acme
│       └── weather
│           └── v1
│               └── weather.proto
└── vendor
    └── protoc-gen-validate
        └── validate
            └── validate.proto
```

::: info buf.yaml

```yaml
version: v2
modules:
  - path: proto
  - path: vendor/protoc-gen-validate
```

:::

You can verify that the workspace compiles with this command:

```sh
buf build
```

The `buf build` command:

- Discovers the `buf.yaml` file found in the current directory.
- Collects all Protobuf files in the modules specified in the `buf.yaml` configuration.
- Copies the Protobuf files into memory.
- Compiles all Protobuf files.
- Outputs the compiled result to a configurable location (defaults to `/dev/null`)

Now that we've migrated the file layout to `buf`, we can simplify the `protoc` invocation used to generate Go/gRPC code with this [`buf.gen.yaml`](../../configuration/v2/buf-gen-yaml/) template:

::: info buf.gen.yaml

```yaml
version: v2
plugins:
  - local: protoc-gen-go
    out: .
    opt:
      - paths=source_relative
  - local: go-grpc
    out: .
    opt:
      - paths=source_relative
```

:::

The `buf.gen.yaml` file is typically placed next to the `buf.yaml`, so that your file layout looks like this:

```text
.
├── buf.gen.yaml
├── buf.yaml
├── proto
│   └── acme
│       └── weather
│           └── v1
│               └── weather.proto
└── vendor
    └── protoc-gen-validate
        └── validate
            └── validate.proto
```

With this, you can generate the Go/gRPC client and server stubs with this command:

```sh
buf generate
```

Most users only need a single `buf.gen.yaml` code generation template. If your project has more complex code generation requirement, however, you can use the `--template` flag to use more than one `buf.gen.yaml` templates.

For example, if you need different `buf.gen.yaml` configurations for your _public_ and _private_ API definitions, you might consider a setup like this, where the `public` directory contains your public APIs and the `private` directory contains your private APIs:

```sh
buf generate public --template buf.public.gen.yaml
buf generate private --template buf.private.gen.yaml
```
