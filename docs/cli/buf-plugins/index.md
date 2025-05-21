---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/cli/buf-plugins/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/migration-guides/migrate-remote-generation-alpha/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/cli/buf-plugins/tutorial-create-buf-plugin/"
  - - meta
    - property: "og:title"
      content: "Buf check plugins - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/cli/buf-plugins/index.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/cli/buf-plugins/"
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
      content: "Buf check plugins - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/cli/buf-plugins/index.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Buf plugins – Overview

With Buf plugins, you can create custom lint and breaking change rules and categories to augment Buf's built-in rules. Buf plugins are locally installed binaries that fit into your existing Buf CLI workflow. Once you install a plugin, you can configure it in the `buf.yaml` file just like any of Buf's built-in rules. You can add and remove rules, ignore them for certain files, and suppress errors via code comments.

Buf plugins are built on top of the [Bufplugin](https://github.com/bufbuild/bufplugin) Protobuf API and the [PluginRPC](https://github.com/pluginrpc) framework. [`bufplugin-go`](https://github.com/bufbuild/bufplugin-go) connects them into a library that makes implementing and testing rules simple and straightforward. All of Buf's built-in [lint](../../lint/rules/) and [breaking change](../../breaking/rules/) rules run on this platform.

The `bufplugin-go` library provides several detailed [implementation examples](https://github.com/bufbuild/bufplugin-go?tab=readme-ov-file#examples) to help get you started, and the [quickstart](tutorial-create-buf-plugin/) is a step-by-step walkthrough of creating a plugin from scratch.
