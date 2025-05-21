---
sidebar: false
prev: false
next: false

title: "Seamless Gradle integration with the Buf CLI"
description: "The Buf CLI can now integrate seamlessly with your Gradle builds."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/seamless-gradle-integration-with-the-buf-cli"
  - - meta
    - property: "og:title"
      content: "Seamless Gradle integration with the Buf CLI"
  - - meta
    - property: "og:description"
      content: "The Buf CLI can now integrate seamlessly with your Gradle builds."
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6750cc227e76493329a37d52_Gradle%20integration.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Seamless Gradle integration with the Buf CLI"
  - - meta
    - property: "twitter:description"
      content: "The Buf CLI can now integrate seamlessly with your Gradle builds."
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6750cc227e76493329a37d52_Gradle%20integration.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Seamless Gradle integration with the Buf CLI

We built the [Buf CLI](https://buf.build/product/cli) to be a one-stop shop for Protobuf development. In addition to code generation, the CLI offers features such as linting, formatting, and backward compatibility validation. **This unified tool serves as the basis for a dramatically upgraded experience of working with Protobuf, and we’re excited to bring this experience to Gradle projects!**

## Gradle and the Buf CLI

When using Protobuf schemas to build Java and Kotlin clients with the Buf CLI, developers typically generate outputs manually and check them into source control. Additionally, other housekeeping tasks such as linting and validating backward compatibility are done manually. **We now provide a** [**Gradle plugin**](https://github.com/bufbuild/buf-gradle-plugin) **with a set of tasks that encapsulate Buf CLI invocations to simplify these workflows and eliminate the need to check in generated code:**

- `bufGenerate`: Generates Java/Kotlin sources from Protobuf schemas with [`buf generate`](/docs/generate/index.md). **This can be run as part of the build process, eliminating the need for checking in generated code.**
- `bufBreaking`: Checks Protobuf schemas against a previous version for backward-incompatible changes using the [`buf breaking`](/docs/breaking/index.md) functionality.
- `bufFormatCheck`/`bufFormatApply`: Validates and enforces formatting of Protobuf files using [`buf format`](/docs/format/index.md).
- `bufLint`: Runs lint checks using [`buf lint`](/docs/lint/index.md).

To learn more about the Gradle plugin and how to integrate it, check out our [documentation](/docs/cli/build-systems/gradle/index.md).

## Community collaboration

This plugin was originally created and developed by [Andrew Parmet](https://github.com/andrewparmet), an enthusiastic member of the Buf community. We’re very grateful for Andrew’s contributions to this effort, and for his collaboration in making this an officially supported Buf tool. Andrew will continue to be involved as a contributor and maintainer of the [repository](https://github.com/bufbuild/buf-gradle-plugin) along with Buf!

## Get started

Head over to the [usage documentation](https://github.com/bufbuild/buf-gradle-plugin#usage) to integrate Buf into your Gradle project. You can also check out the [plugin on GitHub](https://github.com/bufbuild/buf-gradle-plugin) and come join us on [Slack](https://buf.build/b/slack/) — we’d love to chat, answer questions, and hear feedback!
