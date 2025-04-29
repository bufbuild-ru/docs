---
layout: home

title: "Remote plugin execution with the Buf Schema Registry"
description: "Execute plugins on the BSR to enforce consistency and simplify code generation."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/remote-plugin-execution"
  - - meta
    - property: "og:title"
      content: "Remote plugin execution with the Buf Schema Registry"
  - - meta
    - property: "og:description"
      content: "Execute plugins on the BSR to enforce consistency and simplify code generation."
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Remote plugin execution with the Buf Schema Registry"
  - - meta
    - property: "twitter:description"
      content: "Execute plugins on the BSR to enforce consistency and simplify code generation."
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

hero:
  name: "Remote plugin execution with the Buf Schema Registry"
  tagline: "March 9, 2022"
---

A while back, we [announced](/blog/announcing-bsr/index.md) that we had released the [Buf Schema Registry](/docs/bsr/index.md) (BSR), a centralized platform for managing Protobuf assets, into beta. In the announcement post, we briefly [outlined](/blog/announcing-bsr/index.md#hosted-plugins) a BSR feature called **hosted plugins**, which enables you to generate code using [Protobuf plugins](/docs/migration-guides/migrate-remote-generation-alpha/index.md) remotely, on the BSR, rather than on your local machine.

In this post, we'll dive a bit deeper into remote plugin execution and talk about [why](/blog/remote-plugin-execution/index.md#problems) we built it, [how](/blog/remote-plugin-execution/index.md#remote-plugin-execution) it works, and how it can [streamline](/blog/remote-plugin-execution/index.md#why-it-matters) your Protobuf workflows.

## Protobuf plugins

First, let's go over some of the basics of [Protobuf plugins](/docs/migration-guides/migrate-remote-generation-alpha/index.md). A plugin is a program that a Protobuf compiler, like the [`buf` CLI](https://github.com/bufbuild/buf) or [protoc](https://github.com/protocolbuffers/protobuf#protocol-compiler-installation), executes to convert Protobuf sources (`.proto` files) into code stubs in your desired language, like Go, Java, C++, or Python. In order to use plugins, a compiler needs to support Protobuf's plugin protocol, whereby:

- The compiler creates a [`CodeGeneratorRequest`](https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/compiler/plugin.proto#L68) representing the `.proto` files passed into the compiler, such as `foo/bar.proto`, and sends that request to the plugin on stdin.
- The Protobuf plugin accepts that request and writes a [`CodeGeneratorResponse`](https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/compiler/plugin.proto#L99) to stdout.
- The compiler transforms that response into code files and writes them to disk.

### Using plugins

Protobuf's original [protoc](https://github.com/protocolbuffers/protobuf#protocol-compiler-installation) compiler provides some built-in plugins but you need to install any other plugins you need as executables in your environment. So if you needed to generate C++, Java, Python, Go, and Rust code from a Protobuf source, for example, three of those plugins are built into the compiler—C++, Java, and Python—but you'd need to install Go and Rust plugins on your own ([`protoc-gen-go`](https://pkg.go.dev/github.com/golang/protobuf/protoc-gen-go) and [`protoc-gen-rust`](https://crates.io/crates/protobuf-codegen) are widely used options).

With the Go and Rust plugins installed, you could generate code stubs using a command like this:

```protobuf
protoc \
  -I proto \
  --cpp_out=gen/proto/cpp \
  --java_out=gen/proto/java \
  --python_out=gen/proto/python \
  --go_out=gen/proto/go \
  --rust_out=gen/proto/rust \
  proto/api.proto
```

The [`buf` CLI](https://github.com/bufbuild/buf) streamlines this by [replacing](/docs/migration-guides/migrate-from-protoc/index.md) protoc in your workflows. So instead of that complex command invocation, you could use this [`buf.gen.yaml`](/docs/configuration/v1/buf-gen-yaml/index.md) configuration file...

```protobuf
version: v1
plugins:
    - name: cpp
      out: gen/proto/cpp
    - name: java
      out: gen/proto/java
    - name: python
      out: gen/proto/python
    - name: go
      out: gen/proto/go
    - name: rust
      out: gen/proto/rust
```

...and [generate](/docs/generate/overview/index.md) your code stubs with a single command:

```protobuf
$ buf generate <input>
```

Here, `<input>` can be any valid [Buf input](/docs/reference/inputs/index.md), such as a directory, tarball, or Buf module. This is vastly more flexible than protoc, which only supports `.proto` files as sources.

### Problems with local plugin execution

As you can see, the `buf` CLI is a major improvement over protoc, which you no longer need to install or manage. But there is one remaining problem here: to run this example, you'd still need to install plugins locally and ensure that you're using the right plugin versions.

One half-solution is to either manage those executables yourself or rely on custom tooling, which frequently leads to those classic "works on my machine" reproducibility problems where you need to hunt down subtle differences in plugin versions used in different environments.

The difficulty of managing this complex web of compiler and plugin versions—just to make code stub generation work—has been a major barrier to Protobuf adoption. At Buf, we decided to fix this once and for all by removing the need for local plugins entirely.

## Remote plugin execution

With remote plugin execution, you can publish Protobuf plugins to the BSR and then execute those plugins on a trusted server—the BSR itself—rather than on your local machine.

[Authoring](/docs/migration-guides/migrate-remote-generation-alpha/index.md) a plugin involves two steps: building the plugin as a Docker image and pushing the image to `plugins.buf.build`. Once your plugin has been pushed, you need to make one change to your [`buf.gen.yaml`](/docs/configuration/v1/buf-gen-yaml/index.md) configuration file to use it:

```protobuf
version: v1
plugins:
    - remote: buf.build/my-buf-org/plugins/my-proto-plugin:v1.2.3
      out: gen/proto/my-language
```

Note the usage of the `remote` key rather than `name`. With this configuration, the `buf generate` command now makes a remote procedure call (RPC) to the BSR to execute the `remote` plugin on your behalf. Here's an example generation command:

```protobuf
$ buf generate buf.build/acme/petapis
```

Here, the `buf` CLI would generate code for the `buf.build/acme/petapis` module using the local `buf.gen.yaml` configuration. But instead of calling a local `protoc-gen-my-proto-plugin` executable, all code generation would happen on the BSR, and the resulting files would be written to the `gen/proto/my-language` directory.

This diagram illustrates that process:

![The remote plugin execution process](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/673fd23bda16bdd382ca7f57_remote-plugin-execution-J6RRLLQC.png)

## Why it matters

The Buf team has developed processes to automatically sync and publish all of [protoc](https://github.com/protocolbuffers/protobuf#protocol-compiler-installation)'s built-in plugins to the BSR under the [`buf.build/protocolbuffers`](https://buf.build/protocolbuffers/plugins) organization. This means that you can remove any and all plugin executables from your environment—local, [CI/CD](/docs/bsr/ci-cd/setup/index.md), whatever—and rely solely on remote plugins.

These protoc built-in plugins are hosted on the BSR:

- [`buf.build/protocolbuffers/plugins/cpp`](https://buf.build/protocolbuffers/plugins/cpp)
- [`buf.build/protocolbuffers/plugins/csharp`](https://buf.build/protocolbuffers/plugins/csharp)
- [`buf.build/protocolbuffers/plugins/dart`](https://buf.build/protocolbuffers/plugins/dart)
- [`buf.build/protocolbuffers/plugins/go`](https://buf.build/protocolbuffers/plugins/go)
- [`buf.build/protocolbuffers/plugins/java`](https://buf.build/protocolbuffers/plugins/java)
- [`buf.build/protocolbuffers/plugins/js`](https://buf.build/protocolbuffers/plugins/js)
- [`buf.build/protocolbuffers/plugins/kotlin`](https://buf.build/protocolbuffers/plugins/kotlin)
- [`buf.build/protocolbuffers/plugins/objc`](https://buf.build/protocolbuffers/plugins/objc)
- [`buf.build/protocolbuffers/plugins/php`](https://buf.build/protocolbuffers/plugins/php)
- [`buf.build/protocolbuffers/plugins/python`](https://buf.build/protocolbuffers/plugins/python)
- [`buf.build/protocolbuffers/plugins/ruby`](https://buf.build/protocolbuffers/plugins/ruby)

We also host many popular [gRPC](https://grpc.io/) plugins, including:

- [`buf.build/grpc/plugins/cpp`](https://buf.build/grpc/plugins/cpp)
- [`buf.build/grpc/plugins/csharp`](https://buf.build/grpc/plugins/csharp)
- [`buf.build/grpc/plugins/go`](https://buf.build/grpc/plugins/go)
- [`buf.build/grpc/plugins/java`](https://buf.build/grpc/plugins/java)
- [`buf.build/grpc/plugins/kotlin`](https://buf.build/grpc/plugins/kotlin)
- [`buf.build/grpc/plugins/node`](https://buf.build/grpc/plugins/node)
- [`buf.build/grpc/plugins/objc`](https://buf.build/grpc/plugins/objc)
- [`buf.build/grpc/plugins/php`](https://buf.build/grpc/plugins/php)
- [`buf.build/grpc/plugins/python`](https://buf.build/grpc/plugins/python)
- [`buf.build/grpc/plugins/ruby`](https://buf.build/grpc/plugins/ruby)
- [`buf.build/grpc/plugins/web`](https://buf.build/grpc/plugins/web)

Beyond that, some community members have made [their own plugins](https://buf.build/search?query=plugin) publicly available on the BSR. We expect the number of community plugins to steadily expand over time.

## Wrapping up

You can replace protoc with the `buf` CLI regardless of how you're using plugins. But using local plugins with `buf` does have the drawback that you still need to install and manage those plugins yourself. Remote plugin execution goes one step further and enables you to eliminate not just protoc but even local plugin executables from your Protobuf workflows, making it easier than ever to introduce Protobuf into your environments.

Later in this series, we'll highlight some other BSR features, such as generated documentation for Protobuf and remote code generation.

‍
