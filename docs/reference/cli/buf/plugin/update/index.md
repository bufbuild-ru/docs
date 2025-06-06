---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/plugin/update/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/plugin/push/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/"
  - - meta
    - property: "og:title"
      content: "buf plugin update - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/plugin/update.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/plugin/update/"
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
      content: "buf plugin update - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/plugin/update.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf plugin update

Update pinned remote plugins in a buf.lock

### Usage

```sh
buf plugin update <directory> [flags]
```

### Description

Fetch the latest digests for the specified plugin references in buf.yaml.

The first argument is the directory of the local module to update. Defaults to "." if no argument is specified.

### Flags

#### \-h, --help

help for update

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf plugin](../) - Work with check plugins
