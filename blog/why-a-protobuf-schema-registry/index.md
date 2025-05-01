---
sidebar: false
prev: false
next: false

title: "Why a Protobuf schema registry?"
description: "Learn why teams across industries and sizes have chosen the Buf Schema Registry as the home for their Protobuf schemas."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/why-a-protobuf-schema-registry"
  - - meta
    - property: "og:title"
      content: "Why a Protobuf schema registry?"
  - - meta
    - property: "og:description"
      content: "Learn why teams across industries and sizes have chosen the Buf Schema Registry as the home for their Protobuf schemas."
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674fc56323b2bfd93482c3cd_Why%20BSR.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Why a Protobuf schema registry?"
  - - meta
    - property: "twitter:description"
      content: "Learn why teams across industries and sizes have chosen the Buf Schema Registry as the home for their Protobuf schemas."
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674fc56323b2bfd93482c3cd_Why%20BSR.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Why a Protobuf schema registry?

In a [previous post](/blog/the-real-reason-to-use-protobuf/index.md), we discussed why Protobuf should be considered a cornerstone of API development in engineering organizations that are striving for productivity and reliability. However, Protobuf has some of its own shortcomings when it comes to managing and deploying schemas at scale, and many of our engineers have seen (and solved) these challenges firsthand in roles at previous companies.

**Our mission at Buf is to enable teams to build and scale products quickly and reliably using Protobuf. In order to create tools for teams to produce, share, and consume Protobuf APIs, it’s critical to establish a source of truth for API schemas across a given organization. This source of truth is commonly referred to as a “schema registry”, and its goal is to provide a top-down view into APIs, along with a suite of tools to enhance the development process.**

The Buf Schema Registry (BSR) is _the_ Protobuf developer platform, and in this post we’ll discuss some of the key reasons that teams across industries and sizes have chosen it as the home for their Protobuf schemas.

### Dependency management

Many companies are adopting microservice-based architectures, which inevitably lead to dependencies across services. Sharing Protobuf models and invoking RPCs defined in separate services is challenging since Protobuf does not have a native way to share dependencies, and teams feel that their only option is to copy/paste (vendor) these schemas manually.

The Buf Schema registry introduces the concept of [**modules**](/docs/bsr/module/publish/index.md)** — collections of Protobuf files that are grouped together and provide the** [**ability to depend on other modules**](/docs/bsr/module/dependency-management/index.md)**.** This enables, for example, owners of the `Price` Protobuf message to manage its definition, while allowing separate teams that own the `Inventory` and `ProductDetails` messages in separate repositories to depend on `Price` without duplicating it. If the canonical `Price` definition changes, its consumers can update their references to consume the latest version.

### Documentation & discoverability

When attempting to understand how a specific API behaves and how consumers call that API, engineers typically have to read through the service’s implementation, as well as the implementations of the clients that invoke it. Documentation for the API likely lives somewhere else entirely — such as in a markdown file or team wiki — and there is no guarantee that the documentation stays up to date with the actual API as it evolves over time.

Protobuf supports inline comments, and having a top-down view with the BSR into all APIs across the company opens up the possibility of creating a place where engineers can search for any schema and find information on how the API works and how it should be used. In addition to providing search and the ability to click-through Protobuf types in results, the [BSR](https://buf.build/product/bsr) also allows teams to push supplementary documentation to be displayed alongside the documentation that is automatically generated from the schemas themselves.

### Client & server SDK generation

The typical Protobuf development workflow requires engineers to manually configure and invoke the `protoc` compiler with their Protobuf source files and locally installed `protoc` plugins, to generate code for their APIs which can then be integrated into their projects. At scale, managing these local environments across many engineers’ machines is difficult, and most teams resort to using custom scripts to aid with the process.

Ideally, engineers should not need to worry about their local Protobuf environment at all, and should instead be able to consume generated code in the same way they would any other third party dependency. The Buf Schema Registry [automatically generates and publishes SDKs](/docs/bsr/generated-sdks/overview/index.md) for NPM, Go, Maven, Gradle, and Swift Package Manager, eliminating the need to manually generate code and enabling teams to integrate generated code using their native package managers of choice.

### Governance & schema evolution

Just as managing Protobuf development environments across an organization is challenging, so is enforcing standard API development practices and ensuring APIs evolve safely alongside the products they support. Teams must rely on code review and communication to avoid accidentally breaking production clients by introducing backward-incompatible schema changes, such as deleting a field, renaming it, or changing its type.

The BSR provides tools to ensure best practices in CI (such as running linters, formatters, and ensuring documentation is present), and to eliminate the possibility of introducing breaking schema changes and subsequent outages. Engineers can ship code confidently by running [backward compatibility checks in CI](/docs/bsr/ci-cd/setup/index.md), and schema owners can audit, approve, and reject breaking changes before they’re deployed to production clients with the [BSR’s governance workflow](/docs/bsr/policy-checks/breaking/overview/index.md).

### Runtime extensibility

A schema registry’s holistic view of schemas across teams allows it to expose this information at runtime to downstream services using APIs like the [BSR Reflection API](/docs/bsr/reflection/overview/index.md). With this information, edge gateways can perform protocol translation between clients and servers, debugging tools and proxies can deserialize requests and responses into human-readable formats, and custom integrations can be written to inspect and transform data.

### Going beyond APIs with Kafka

The BSR provides [first-class support for Protobuf in data pipelines](/docs/bsr/csr/overview/index.md) and allows teams to attach schemas to Kafka topics, ensure backward compatible schema evolution, and eliminate runtime registration errors. It also implements the same API as the Confluent Schema Registry, so it works with most Kafka producers and consumers, downstream systems like kSQL and Kafka Connect, and management tools like AKHQ.

### Getting started

Our [BSR product page](https://buf.build/product/bsr) provides additional details about the Buf Schema Registry and the features it offers. You can also [get started with the BSR for free](https://buf.build/signup), or check out our [pricing plans](https://buf.build/pricing) to see which one is right for your team.

If you’d like to discuss your existing API setup or have any other questions, please join us in the [Buf Slack](https://buf.build/b/slack/)!

‍
