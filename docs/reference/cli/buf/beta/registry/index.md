---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/studio-agent/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/plugin/"
  - - meta
    - property: "og:title"
      content: "Registry - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/beta/registry/index.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/"
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
      content: "Registry - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/beta/registry/index.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf beta registry

Manage assets on the Buf Schema Registry

### Usage

```sh
buf beta registry [flags]
```

### Flags

#### \-h, --help

help for registry

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

- [buf beta registry plugin](plugin/) - Manage plugins on the Buf Schema Registry
- [buf beta registry webhook](webhook/) - Manage webhooks for a repository on the Buf Schema Registry

### Parent Command

- [buf beta](../) - Beta commands. Unstable and likely to change
