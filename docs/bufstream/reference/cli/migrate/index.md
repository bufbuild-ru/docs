---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/reference/cli/migrate/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bufstream/reference/cli/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bufstream/reference/cli/serve/"
  - - meta
    - property: "og:title"
      content: "bufstream migrate - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/reference/cli/migrate.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/reference/cli/migrate/"
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
      content: "bufstream migrate - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/reference/cli/migrate.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# bufstream migrate

Migrate Bufstream cluster storage

### Usage

```sh
bufstream migrate [flags]
```

### Description

Performs migrations on the underlying Bufstream metadata and data storage implementations

### Flags

#### \-c, --config _string_

Path to the config file.

#### \-h, --help

help for migrate

#### \--inmemory

Use in-memory storage (for development only).

### Parent Command

- [bufstream](../) - The Bufstream process.
