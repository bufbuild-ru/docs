---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/cli/build-systems/gradle/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/quickstart/"
  - - meta
    - property: "og:title"
      content: "Overview - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/index.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/"
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
      content: "https://buf.build/docs/assets/images/social/bsr/index.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Buf Schema Registry (BSR)

Welcome to the **Buf Schema Registry (BSR)**! This overview covers what the BSR is and the challenges it solves within the Protobuf ecosystem. If you just want to see the BSR in action with code examples, check out the [BSR quickstart](quickstart/).

## What is the BSR?

The BSR stores and manages Protobuf files as versioned [modules](../cli/modules-workspaces/) so that individuals and organizations can consume and publish their APIs without friction. Every BSR user has access to the key features listed below.

### Centralized registry

The BSR is the source of truth for tracking and evolving your Protobuf APIs. A centralized registry enables you to maintain compatibility and manage dependencies, while enabling your clients to consume APIs reliably and efficiently. Having a centralized Protobuf-aware registry has the added benefit of protecting against broken builds.

### Dependency management

The BSR _finally_ introduces [dependency management](module/dependency-management/) to the Protobuf ecosystem. You can now declare, resolve and use hosted BSR modules as dependencies in your projects. Put simply, **you don't need to copy your `.proto` file dependencies around anymore**. The Buf CLI interacts directly with the BSR to fetch your dependencies (analogous to `npm` for Node.js, `pip` for Python, `cargo` for Rust, and Go modules in Go).

### UI and documentation

The BSR offers complete documentation for your Protobuf files through a browsable and searchable UI with syntax highlighting, definitions, and references.

### Remote plugins

The Buf team manages [hosted Protobuf plugins](remote-plugins/overview/) that can be referenced in [`buf.gen.yaml`](../configuration/v2/buf-gen-yaml/#plugins) files. Code generation takes place remotely on the BSR and generated source code is written out to disk.

### Generated SDKs

The BSR exposes [generated artifacts](generated-sdks/overview/) through managed software repositories you fetch like any other library with tools you already know like `go get`, `npm install`, `mvn`, or `gradle`.

## Why use the BSR?

You're probably wondering why adopting the Buf Schema Registry (BSR) is an improvement over your existing Protobuf workflows. We've highlighted available features above, but let's break down how the BSR solves existing problems.

### The Protobuf ecosystem deserves build guarantees

Traditional workflows push Protobuf files to version control systems, but these systems lack Protobuf-awareness and thus consumers often waste time working with Protobuf files that don't compile. Yes, some organizations add checks to catch broken Protobuf files, but these are error-prone and don't scale well because _each_ repository needs to be configured, setup and maintained.

Since the BSR is a Protobuf-aware registry, it prevents Protobuf files that don't compile from being pushed to the origin in the first place. Your consumers can have confidence that Protobuf files consumed from the BSR aren't broken and can compile. Everyone in the ecosystem benefits because compilation guarantees are pushed from the individual to the BSR.

### Developers need schema documentation

Sadly, readily consumable _and_ up-to-date documentation is rarely available for Protobuf files. Some organizations setup workflows to generate documentation, but this is yet another manual step that has to be configured and maintained. Furthermore, much of the tooling and plugins are unsupported and generate incomplete documentation.

The BSR comes built-in with [generated documentation](documentation/overview/). You get live documentation for every commit to the BSR. Which means live and up-to-date documentation for latest and historic commits. Even better, the documentation the BSR provides has syntax highlighting, definitions, and references.

### Schemas should be distributed from one place

Every organization that adopts Protobuf needs to solve distribution, whether internally across teams or externally exposed to the public. Protobuf files are usually checked into repositories, often dispersed, and it becomes challenging to keep Protobuf files synced across projects. API drift is a common issue and even worse, forked Protobuf repositories accidentally get consumed by downstream dependents (instead of the upstream). It's a mess.

The BSR solves this by offering a centralized registry to store all your Protobuf files, simplifying the process of publishing and consuming. By making the BSR the single source of truth, it's possible to power developer workflows and business processes around Protobuf without worrying _how_ to keep everything in-sync.

### Client SDKs shouldn't be an afterthought

Define. Generate. Consume.

Defining a Protobuf-based API enforces a contract between producer and consumers, but consumers are typically an afterthought in the process.

Before a client can consume a Protobuf-based API they need to generate an SDK for their language of choice. Traditionally consumers are left to figure out how to build and generate clients, but this is often cumbersome as little guidance is provided and not all Protobuf files correctly encode options for a given language.

Fetching a client SDK from the BSR is a single `npm install` or `go get` command.

## Start using the BSR

Once you've [installed](../cli/installation/) the latest version of the Buf CLI, you're ready to use the BSR! We recommend starting with the [BSR quickstart](quickstart/), if you haven't already done it. The quickstart provides an overview of the BSR and takes approximately 10 minutes to complete.
