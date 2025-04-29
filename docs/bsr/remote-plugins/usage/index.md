---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/remote-plugins/usage/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/remote-plugins/overview/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/remote-plugins/custom-plugins/"
  - - meta
    - property: "og:title"
      content: "Tutorial - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/remote-plugins/usage.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/remote-plugins/usage/"
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
      content: "Tutorial - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/remote-plugins/usage.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Generating code with remote plugins

> We recommend completing the [Buf CLI quickstart](../../../cli/quickstart/#generate-code) to get an overview of `buf generate` with remote plugins.

Protobuf code generation is a challenging process for developers due to the complexities of working with `protoc` and plugins. This challenge is compounded as code generation is scaled across multiple developers, with different languages and runtime requirements for plugins.Buf's remote plugins remove this key obstacle to generating code. Instead of wasting your time maintaining plugins for yourself or your organization, you can reference plugins hosted in the Buf Schema Registry (BSR).

## Configuration

The `buf.gen.yaml` file controls how the `buf generate` command executes Protobuf plugins for any [input](../../../reference/inputs/). In it, you specify [remote plugins](../overview/) to perform code generation. For more information on the `buf.gen.yaml` configuration, see the [reference](../../../configuration/v2/buf-gen-yaml/).Buf verifies and maintains the commonly used plugins used across the Protobuf ecosystem. To discover all publicly available plugins, go to [buf.build/plugins](https://buf.build/plugins).

## Choose your input

Remote plugins generate code for [inputs](../../../reference/inputs/). An input can be a Git repository, tarball, zip file, or a local directory containing Protobuf files configured with a [`buf.yaml`](../../../configuration/v2/buf-yaml/) configuration file. Buf refers to such directories of Protobuf files as [modules](../../../cli/modules-workspaces/).For our purposes, we'll assume you have a directory of `.proto` files with a `buf.yaml` configuration file that defines them as a workspace with at least one module. To create a `buf.yaml` in your current directory if you don't have one, run this command:

```console
$ buf config init
```

It creates a `buf.yaml` with the default settings:

::: info buf.yaml

```yaml
version: v2
lint:
  use:
    - STANDARD
breaking:
  use:
    - FILE
```

:::

Add a `modules` declaration with the path to the directory that contains your `.proto` files.

::: info buf.yaml

```yaml
version: v2
modules:
  path: /path/to/proto/files
lint:
  use:
    - STANDARD
breaking:
  use:
    - FILE
```

:::

Your directory structure should look like this:

```text
workspace_root
├── buf.yaml
└── proto_file_directory
```

## Create a `buf.gen.yaml` file

Now that you have an [input](../../../reference/inputs/) to generate code for, you need to define a `buf.gen.yaml` file and specify which `protoc` plugins you want to use. See the [overview](../overview/#finding-remote-plugins) for instructions on finding remote plugins. Copy the code for the language or framework you want to generate for and create a new `buf.gen.yaml` in the same directory as the `buf.yaml` file:

+++tabs key:0fd70150e5874c9759c404fa81e260ae

== Go

::: info buf.gen.yaml

```yaml
version: v2
plugins:
  - remote: buf.build/protocolbuffers/go
    out: gen/go
    opt: paths=source_relative
  - remote: buf.build/grpc/go
    out: gen/go
    opt: paths=source_relative
```

:::

== Java

::: info buf.gen.yaml

```yaml
version: v2
plugins:
  - remote: buf.build/protocolbuffers/java
    out: gen/java
  - remote: buf.build/grpc/java
    out: gen/java
```

:::

== JavaScript

::: info buf.gen.yaml

```yaml
version: v2
plugins:
  - remote: buf.build/bufbuild/es
    out: gen/js
```

:::

== Python

::: info buf.gen.yaml

```yaml
version: v2
plugins:
  - remote: buf.build/protocolbuffers/python
    out: gen/python
  - remote: buf.build/grpc/python
    out: gen/python
```

:::

== Ruby

::: info buf.gen.yaml

```yaml
version: v2
plugins:
  - remote: buf.build/protocolbuffers/ruby
    out: gen/ruby
  - remote: buf.build/grpc/ruby
    out: gen/ruby
```

:::

== Swift

::: info buf.gen.yaml

```yaml
version: v2
plugins:
  - remote: buf.build/apple/swift
    opt: Visibility=Public
    out: gen/swift
  - remote: buf.build/connectrpc/swift
    opt: Visibility=Public
    out: gen/swift
```

:::

+++

Note that the code uses the `remote` key to reference a remote plugin. When referencing remote plugins, we recommend including the version of the plugin to ensure reproducible code generation. For more details about the `buf.gen.yaml` fields, see the [configuration file docs](../../../configuration/v2/buf-gen-yaml/).Plugins are invoked in the order they're specified in `buf.gen.yaml`, with results from each invocation combined before writing the result. It's possible to reference both local and remote plugins within a single `buf.gen.yaml` file.

## Generate code

To generate using the module and `buf.gen.yaml` you defined, run this command from the root of the workspace:

```console
$ buf generate
```

The `buf generate` command:

- Sends the Protobuf files specified in your input to the Buf Schema Registry remote plugin executor.
- Invokes each plugin specified in your `buf.gen.yaml`.
- Sends the results back, and unpack them on your local file system.

By default, `buf generate` looks for a [`buf.gen.yaml`](../../../configuration/v2/buf-gen-yaml/) in your current directory. An alternate location can be specified by using the `--template` flag:

```console
$ buf generate --template templates/buf.go.gen.yaml
```

If you used one of the example `buf.gen.yaml` files from above, you should end up with this file structure:

+++tabs key:0fd70150e5874c9759c404fa81e260ae

== Go

```text
workspace_root
├── buf.gen.yaml
└── gen
    └── go
        └── pet
            └── v1
                ├── pet.pb.go
                └── pet_grpc.pb.go
```

== Java

```text
workspace_root
├── buf.gen.yaml
└── gen
    └── java
        └── pet
            └── v1
                ├── PetOuterClass.java
                └── PetStoreServiceGrpc.java
```

== JavaScript

```text
workspace_root
├── buf.gen.yaml
└── gen
    └── js
        └── pet
            └── v1
                ├── pet_connect.d.ts
                ├── pet_connect.js
                ├── pet_pb.d.ts
                └── pet_pb.js
```

== Python

```text
workspace_root
├── buf.gen.yaml
└── gen
    └── python
        └── pet
            └── v1
                ├── pet_pb2.py
                └── pet_pb2_grpc.py
```

== Ruby

```text
workspace_root
├── buf.gen.yaml
└── gen
    └── ruby
        └── pet
            └── v1
                ├── pet_pb.rb
                └── pet_services_pb.rb
```

== Swift

```text
workspace_root
├── buf.gen.yaml
└── gen
    └── swift
        └── pet
            └── v1
                ├── pet.connect.swift
                └── pet.pb.swift
```

+++

## Common use cases

### Connect-Go

[Connect-Go](https://connectrpc.com/docs/go/getting-started) is a slim library for building browser and gRPC-compatible HTTP APIs. Handlers and clients support three protocols: gRPC, gRPC-Web, and Connect's own protocol.[`protoc-gen-connect-go`](https://github.com/connectrpc/connect-go) generates Go service stubs for Connect. The BSR hosts this plugin at [buf.build/connectrpc/go](https://buf.build/connectrpc/go).

::: info buf.gen.yaml

```yaml
version: v2
plugins:
  # The protoc-gen-go stubs are required for grpc-go
  - remote: buf.build/protocolbuffers/go // [!code highlight]
    out: gen/go
    # You almost always want to set this option with protoc-gen-go
    opt: paths=source_relative
  - remote: buf.build/connectrpc/go // [!code highlight]
    # Unlike grpc-go, connect stubs don't need to be generated to the
    # same directory, however you are free to do so
    out: gen/go
    # You almost always want to set this option with protoc-gen-connect-go
    opt: paths=source_relative
```

:::

### Connect-ES

[Connect-ES](https://connectrpc.com/docs/node/getting-started) brings the Connect ecosystem to TypeScript, the web browser, and to Node.js. It contains packages for working with Connect and gRPC-Web clients from the browser as well as Connect-, gRPC-, and gRPC-Web-compatible clients and servers in Node.jsIt requires the [`protoc-gen-es`](https://www.npmjs.com/package/@bufbuild/protoc-gen-es) plugin to generate message and service types for TypeScript and JavaScript, and the runtime libraries [`@connectrpc/connect`](https://www.npmjs.com/package/@connectrpc/connect), and [`@bufbuild/protobuf`](https://www.npmjs.com/package/@bufbuild/protobuf).The BSR hosts the plugin at [buf.build/bufbuild/es](https://buf.build/bufbuild/es).To get started with Connect-ES, check out the [tutorial for web](https://connectrpc.com/docs/web), or the [tutorial for Node.js](https://connectrpc.com/docs/node).

::: info buf.gen.yaml

```yaml
version: v2
plugins:
  - remote: buf.build/bufbuild/es // [!code highlight]
    out: gen/es
```

:::

### Connect-Swift

[Connect-Swift](https://connectrpc.com/docs/swift/getting-started) is a small library that provides support for using generated, type-safe, and idiomatic Swift APIs to communicate with your app's servers. It can be used with both the gRPC-Web and Connect protocols.[`protoc-gen-connect-swift`](https://github.com/connectrpc/connect-swift) is responsible for generating Swift clients, and relies on the models generated by [`protoc-gen-swift`](https://github.com/apple/swift-protobuf). The BSR hosts both of these plugins at [buf.build/connectrpc/connect-swift](https://buf.build/connectrpc/swift) and [buf.build/apple/swift](https://buf.build/apple/swift), respectively.To get started with Connect-Swift, check out the [demo tutorial](https://connectrpc.com/docs/swift/getting-started).

::: info buf.gen.yaml

```yaml
version: v2
plugins:
  - remote: buf.build/apple/swift // [!code highlight]
    opt: Visibility=Public
    out: gen/swift
  - remote: buf.build/connectrpc/swift // [!code highlight]
    opt: Visibility=Public
    out: gen/swift
```

:::

### protoc-gen-go

[`protoc-gen-go`](https://github.com/protocolbuffers/protobuf-go) generates message and enum stubs for Go. The BSR hosts this plugin at [buf.build/protocolbuffers/go](https://buf.build/protocolbuffers/go).

::: info buf.gen.yaml

```yaml
version: v2
plugins:
  - remote: buf.build/protocolbuffers/go // [!code highlight]
    out: gen/go
    # You almost always want to set this option with protoc-gen-go
    opt: paths=source_relative
```

:::

### grpc-go

[`protoc-gen-go-grpc`](https://github.com/grpc/grpc-go/tree/master/cmd/protoc-gen-go-grpc) generates Go service stubs for gRPC. The BSR hosts this plugin at [buf.build/grpc/go](https://buf.build/grpc/go). We recommend checking out Connect-Go instead of using grpc-go.

::: info buf.gen.yaml

```yaml
version: v2
plugins:
  # The protoc-gen-go stubs are required for grpc-go
  - remote: buf.build/protocolbuffers/go // [!code highlight]
    out: gen/go
    # You almost always want to set this option with protoc-gen-go
    opt: paths=source_relative
  - remote: buf.build/grpc/go // [!code highlight]
    # Make sure to generate your grpc-go code to the same
    # directory as protoc-gen-go
    out: gen/go
    # You almost always want to set this option with protoc-gen-go-grpc
    opt: paths=source_relative
```

:::

## Related docs

- Check out the [generated SDKs tutorial](../../generated-sdks/tutorial/).
