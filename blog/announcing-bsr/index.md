---
sidebar: false
prev: false
next: false

title: "Introducing the Buf Schema Registry 🎉"
description: "The Buf Schema Registry: a platform for managing your Protocol Buffer APIs."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/announcing-bsr"
  - - meta
    - property: "og:title"
      content: "Introducing the Buf Schema Registry 🎉"
  - - meta
    - property: "og:description"
      content: "The Buf Schema Registry: a platform for managing your Protocol Buffer APIs."
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Introducing the Buf Schema Registry 🎉"
  - - meta
    - property: "twitter:description"
      content: "The Buf Schema Registry: a platform for managing your Protocol Buffer APIs."
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Introducing the Buf Schema Registry 🎉

Buf's mission is to dramatically improve the experience of developing APIs using [Protocol Buffers](https://github.com/protocolbuffers/protobuf), or **Protobuf** for short. Our first major contribution to the Protobuf ecosystem was the [`buf`](/docs/cli/quickstart/index.md) tool, which enables you to replace complex [`protoc`](https://github.com/protocolbuffers/protobuf) invocations and shell scripts with an intuitive CLI and [YAML](https://yaml.org/)\-based configuration for common actions like [generating code stubs](/docs/generate/tutorial/index.md), detecting [breaking changes](/docs/breaking/index.md), and [linting](/docs/lint/index.md) Protobuf files. Now, we're extremely excited to announce our next major contribution: the **Buf Schema Registry**, or the [BSR](/docs/bsr/index.md), which is officially in **beta**.

The BSR is a SaaS platform for managing your [Protocol Buffer](https://github.com/protocolbuffers/protobuf) APIs. It provides not just a centralized registry for publishing and sharing modules but also a set of [features](/blog/announcing-bsr/index.md#features) that go above and beyond what you may expect from a schema registry — features that we think could transform not just the Protobuf ecosystem but API development more broadly.

We soft-launched the BSR a few months ago and the response has been phenomenal. Alpha testers in many organizations have told us that the BSR has made their Protobuf workflows simpler and more robust, and now we're ready to provide those capabilities to all developers. In this post, we'll tell you [what the BSR is](/blog/announcing-bsr/index.md#registry), introduce some of its core [features](/blog/announcing-bsr/index.md#features), and tease some of our [bold plans](/blog/announcing-bsr/index.md#future-plans) for it.

## The BSR: a centralized registry for Protobuf

We've talked with many organizations that see Protobuf as extremely compelling technology _in theory_ but have nonetheless found that the current ecosystem simply doesn't solve some crucial problems.

One such problem is managing your Protobuf sources. If you have `.proto` files in one repo and need to use them in other repos, the ecosystem solution thus far has been to copy/paste files or to use Git submodules. But this brittle approach typically involves ad-hoc scripts and all-too-familiar synchronization pains.

This problem is compounded as you expand the number of source and consumer repos involved. But with the BSR you have a centralized source of truth for Protobuf, which should enable you to unify developer workflows in a far more streamlined way than the ecosystem has provided thus far. But even in beta, the BSR is far more than just a storehouse for your modules.

## Features

The BSR is coming out the gate with a variety of features that we're confident will prove indispensable for your API development workflows:

- [Dependency management](/blog/announcing-bsr/index.md#dependency-management)
- [Automatically generated documentation](/blog/announcing-bsr/index.md#documentation)
- [Remote code generation](/blog/announcing-bsr/index.md#remote-code-generation)
- [Hosted plugins](/blog/announcing-bsr/index.md#hosted-plugins)
- [Single-tenant offering](/blog/announcing-bsr/index.md#single-tenant-solution)

### Dependency management

The Protobuf ecosystem has lacked a robust way to manage dependencies. Even seasoned Protobuf users frequently use manual copy/pasting or Git submodules to coordinate `.proto` files across repos. Buf, by contrast, enables you to declare your Protobuf dependencies in a [`buf.yaml` file](/docs/configuration/v1/buf-yaml/index.md) and the [`buf` CLI](/docs/cli/quickstart/index.md) takes care of the rest. Here's an example config:

```yaml
buf.yaml

version: v1
# Your module
name: buf.build/acme/petapis
# Your module's dependencies
deps:
    - buf.build/acme/paymentapis
```

You'll notice here that the `name` and `deps` keys refer to remote modules. A [**module**](/docs/bsr/quickstart/index.md#push-a-module) on the BSR is a collection of Protobuf files that's configured, built, and versioned as a logical unit. Run [`buf push`](/docs/bsr/quickstart/index.md#push-a-module) and the [`buf.build/acme/petapis`](https://buf.build/acme/petapis) module is immediately available for consumers to use as a dependency in their own repos.

### Documentation

Providing Protobuf consumers with easy-to-consume and up-to-date documentation is a real challenge in the current ecosystem. There are some open source tools available but they're often lightly maintained or full-on abandoned, and even the decent tools require you to generate and host your own docs. The end result is that most organizations that use Protobuf don't provide docs at all, leaving API consumers to browse source code or engage in guesswork.

The BSR solves this problem by automatically generating documentation every time you push Protobuf modules to the BSR. Those generated docs provide a comprehensive picture of your modules through an intuitive UI. For an example, you can browse the generated docs for the `validate` package of the [`buf.build/envoyproxy/protoc-gen-validate`](https://buf.build/envoyproxy/protoc-gen-validate/docs/main/validate) module, which is part of the [Envoy](https://envoyproxy.io/) project.

With the BSR, API docs no longer require you to maintain yet another static site generation and publishing pipeline.

### Remote code generation

Protobuf APIs enforce a contract between producers (those creating API business logic) and consumers (those with a dependency on the API). Both sides can use the same Protobuf definitions to generate server and client stubs for their languages of choice. This approach offers huge ergonomic gains over traditional RESTful APIs, which require developers to hand-roll SDKs and client libraries.

In the current Protobuf landscape, providing consumers of your Protobuf API with generated SDK clients can be extremely resource intensive, usually requiring them to locally install [`protoc`](https://github.com/protocolbuffers/protobuf) and various Protobuf plugins and to carefully navigate local code generation.

The BSR provides a much better solution, **remote code generation**, which frees consumers of your API from generating code on their own. Instead, they can fetch code generated by the BSR using their preferred language's dependency management system. Here's an example for [Go](https://golang.org/):

```bash
$ go get go.buf.build/grpc/go/acme/petapis/pet/v1
```

This Go module was generated by the BSR when someone [pushed](/docs/bsr/quickstart/index.md#push-a-module) the underlying Protobuf module to the BSR. This `go get` command fetches the generated code via the hosted BSR Go module proxy. At no point in the process did anyone need to manually generate that Go code themselves.

![How a Protobuf module becomes usable Go code](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/673fd1d894427e8b10e150e8_bsr-generated-go-code-55DHPRNR.png)

With remote code generation, API producers can offer SDK clients with minimal work. The BSR currently supports [Go](https://golang.org/) but we have plans to add support for other languages, including a BSR private registry for [npm](https://npmjs.org/) packages.

### Hosted plugins

Custom [plugins](/docs/migration-guides/migrate-remote-generation-alpha/index.md) are a powerful way to build custom generators for Protobuf definitions. But they've been tricky to manage in the ecosystem, with organizations and open source projects developing homegrown tools to make plugins more usable and to make their output more consistent. But this is another area where we wanted to provide a much more robust solution: **hosted plugins** on the BSR.

With this feature, you can upload plugins and use them for [remote plugin execution](/docs/migration-guides/migrate-remote-generation-alpha/index.md) in an isolated environment. The output — the generated source code — is written locally to disk, providing a quick feedback loop during development.

By isolating code generation from its environment, you eliminate an entire class of problems raised by subtle differences across specific compiler versions and custom Protobuf plugins. With hosted plugins, even thousands of developers at a large organization can have stable and reproducible code generation.

The Buf team has published a set of official plugins for you to use, starting with the built-in `protoc` Protobuf plugins and the official gRPC plugins:

- [https://buf.build/protocolbuffers/plugins](https://buf.build/protocolbuffers/plugins)
- [https://buf.build/grpc/plugins](https://buf.build/grpc/plugins)

Here's an example configuration that uses the BSR's official [`java`](https://buf.build/protocolbuffers/java) plugin:

```yaml
buf.gen.yaml

version: v1
plugins:
    - remote: buf.build/protocolbuffers/plugins/java:v3.19.1-1
      out: gen/java
```

Since hosted plugins are just containers, everyone is welcome to [write and publish plugins](/docs/migration-guides/migrate-remote-generation-alpha/index.md) to the BSR, for free.

### Single-tenant solution

Some organizations are unable to adopt the centralized public version of the BSR due to security and compliance requirements. The good news is Buf offers a hosted single-tenant solution, which is a **fully isolated Buf Schema Registry** for your organization on dedicated cloud infrastructure managed by us.

To learn more, check out our [pricing](https://buf.build/pricing) page and don't hesitate to reach out at [info@buf.build](mailto:info@buf.build).

## Future plans

We believe that Protocol Buffers have the potential to transform API development top to bottom, and we've set out to build tools that truly fulfill that potential. The BSR and the `buf` CLI are the foundation on which we'll continue to build but stay tuned, because there's a lot more on the way, including:

- Remote code generation for languages beyond Go:
  - [npm](https://npmjs.org/) packages
  - [Maven](https://search.maven.org/) repositories
  - Python packages ([PyPi](https://pypi.org/))
  - Ruby ([RubyGems](https://rubygems.org/))
- Enforced server-side [linting](/docs/lint/index.md) and compatibility checks
- Fully qualified Protobuf import paths
- A Protobuf standard library
- Mock servers for your Protobuf APIs

And much more beyond that!

For updates, follow us on [Twitter](https://twitter.com/bufbuild) and join our active [Slack community](https://buf.build/b/slack). Interested in joining our team? Check out the [careers page](https://buf.build/careers) or reach out directly at [info@buf.build](mailto:info@buf.build), as we're always happy to chat.

‍
