---
sidebar: false
prev: false
next: false

title: "The Buf CLI has reached version v1.0"
description: "A new foundational tool for the Protobuf ecosystem."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/buf-cli-v1"
  - - meta
    - property: "og:title"
      content: "The Buf CLI has reached version v1.0"
  - - meta
    - property: "og:description"
      content: "A new foundational tool for the Protobuf ecosystem."
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "The Buf CLI has reached version v1.0"
  - - meta
    - property: "twitter:description"
      content: "A new foundational tool for the Protobuf ecosystem."
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# The Buf CLI has reached version v1.0

Our mission at [Buf](https://buf.build/) is to replace the reigning REST/JSON paradigm of API development with **schema-driven development**. To that end, we aim to build a new ecosystem with [Protocol Buffers](https://developers.google.com/protocol-buffers) as its foundation. We've chosen Protobuf because it's by far the most widely used and trusted [interface description language](https://en.wikipedia.org/wiki/Interface_description_language) (IDL) for APIs. But one thing that we felt has been missing is a single, unified tool that can serve as the basis for a dramatically upgraded experience of working with Protobuf. To put the ecosystem on a better path, we created the [Buf CLI](https://github.com/bufbuild/buf), or just `buf`.

Now, after over two years of work, we're excited to announce that `buf` has officially reached the **v1.0 milestone**. In this post, we want to [introduce](/blog/buf-cli-v1/index.md#intro) our CLI to those who are unfamiliar and lay out some of the [implications](/blog/buf-cli-v1/index.md#meaning) of this 1.0 release.

> To try out the `buf` CLI for yourself, see our [installation](/docs/cli/installation/index.md) docs.

## The Buf CLI

We built the `buf` CLI to be a kind of "one-stop shop" for Protobuf development. We'll go over some of the core features here.

### Linting

The `buf lint` command enables you to [lint](/docs/lint/quickstart/index.md) `.proto` files, which helps to ensure that your Protobuf sources comply with chosen best practices. It offers a built-in set of standardized [lint rules](/docs/lint/rules/index.md) rooted in ecosystem-wide best practices for structuring consistent, maintainable Protobuf schemas. You can configure which rules you want to apply to your Protobuf modules and also specify [exceptions](/docs/configuration/v1/buf-yaml/index.md).

### Breaking change detection

The `buf breaking` command enables you to perform [breaking change detection](/docs/breaking/overview/index.md) between any two Protobuf [inputs](/docs/reference/inputs/index.md). You can use this to ensure, for example, that the Protobuf sources in the `development` branch of a [Git](/docs/breaking/overview/index.md#git) repository are compatible with the `main` branch. As with [linting](/blog/buf-cli-v1/index.md#linting), `buf` can apply specific [breaking change rules](/docs/breaking/rules/index.md).

### Code generation

The `buf generate` command enables you to [generate code stubs](/docs/generate/overview/index.md) from Protobuf sources and configure your [plugins](/docs/bsr/remote-plugins/overview/index.md) and code output directories in a [`buf.gen.yaml`](/docs/configuration/v1/buf-gen-yaml/index.md) file. With this functionality, you can remove complex [`protoc`](https://github.com/protocolbuffers/protobuf) invocations from your workflows, which have traditionally been one of the rougher edges in Protobuf-based API development.

### Dependency management

Managing `.proto` files has long been a pain point in the Protobuf ecosystem. In the past, developers needed to manage Protobuf dependencies through vendoring, which is hard to scale and can be brittle. `buf` solves this problem by enabling you to manage your Protobuf dependencies through [configuration](/docs/configuration/v1/buf-yaml/index.md#deps). In your [`buf.yaml`](/docs/configuration/v1/buf-yaml/index.md) file you can list your Protobuf dependencies and pull recent references from the [Buf Schema Registry](/blog/buf-cli-v1/index.md#bsr) or pin your dependencies to specific versions.

### The Buf Schema Registry (BSR)

You can use the `buf` CLI to interact with the [Buf Schema Registry](/docs/bsr/index.md), which provides a centralized platform for managing Protobuf assets, like [versioned Buf modules](/docs/cli/modules-workspaces/index.md) and [Protobuf plugins](/docs/bsr/remote-plugins/overview/index.md), and features like [remote code generation](/blog/announcing-bsr/index.md#remote-code-generation), [generated Protobuf API documentation](/docs/bsr/documentation/overview/index.md), and [hosted Protobuf plugins](/docs/migration-guides/migrate-remote-generation-alpha/index.md). The BSR recently [went beta](/blog/announcing-bsr/index.md) and most BSR-related `buf` actions are under the `buf beta` command, but we aim to bring `buf`'s BSR functionality out of beta soon.

## The meaning of the 1.0 milestone

To us, the CLI isn't an ancillary tool or a sideshow; we treat it like a full-fledged product. Our policy is to _never_ make breaking changes within a version of the CLI. Now that `buf` has reached a stable 1.0, you can expect no breaking changes until v2.0 — and we have no plans to ever release a v2.0. While we do intend to release new features in the `buf` CLI, you can expect total stability for all of the functionality that you rely on.

If you're a current `buf` user, we recommend [upgrading to 1.0](/docs/cli/installation/index.md) now.

## Community

`buf` is fully open source, under the [Apache 2.0 license](https://github.com/bufbuild/buf/blob/main/LICENSE). To stay up to date, star or watch the [`bufbuild/buf`](https://github.com/bufbuild/buf) repository on GitHub and keep tabs on the [Changelog](https://github.com/bufbuild/buf/blob/main/CHANGELOG.md).

If you have questions about the Buf CLI or are having trouble using it, drop into our [Slack](https://buf.build/b/slack) channel and Buf's engineering team will get you squared away.

For feature requests, bugs, or technical questions, reach out to us at [dev@buf.build](mailto:dev@buf.build). For more general inquiries, email us at [info@buf.build](mailto:info@buf.build).

‍
