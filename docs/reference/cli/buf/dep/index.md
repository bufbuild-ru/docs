---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/dep/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/config/migrate/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/dep/graph/"
  - - meta
    - property: "og:title"
      content: "Dep - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/dep/index.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/dep/"
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
      content: "Dep - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/dep/index.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf dep

Work with dependencies

### Usage

```sh
buf dep [flags]
```

### Flags

#### \-h, --help

help for dep

#### \--help-tree

Print the entire sub-command tree

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Subcommands

- [buf dep graph](graph/) - Print the dependency graph
- [buf dep prune](prune/) - Prune unused dependencies from a buf.lock
- [buf dep update](update/) - Update pinned module dependencies in a buf.lock

### Parent Command

- [buf](../) - The Buf CLI
