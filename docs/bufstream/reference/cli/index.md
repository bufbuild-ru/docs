---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/reference/cli/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bufstream/blog-posts/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bufstream/reference/cli/migrate/"
  - - meta
    - property: "og:title"
      content: "CLI commands - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/reference/cli/index.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/reference/cli/"
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
      content: "CLI commands - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/reference/cli/index.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# bufstream

The Bufstream process.

### Usage

```sh
bufstream [flags]
```

### Description

A process that supports various actors needed to run a Bufstream cluster.

### Flags

#### \-h, --help

help for bufstream

#### \--help-tree

Print the entire sub-command tree

#### \--version

Print the version

### Subcommands

- [bufstream admin](admin/) - Perform Bufstream administrative tasks
- [bufstream client](client/) - client commands
- [bufstream migrate](migrate/) - Migrate Bufstream cluster storage
- [bufstream serve](serve/) - Serve a Bufstream cluster
