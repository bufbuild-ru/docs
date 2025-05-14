---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/plugin/prune/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/plugin/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/plugin/push/"
  - - meta
    - property: "og:title"
      content: "buf plugin prune - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/plugin/prune.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/plugin/prune/"
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
      content: "buf plugin prune - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/plugin/prune.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf plugin prune

Prune unused plugins from buf.lock

### Usage

```sh
buf plugin prune <directory> [flags]
```

### Description

Plugins that are no longer configured in buf.yaml are removed from the buf.lock file.

The first argument is the directory of your buf.yaml configuration file. Defaults to "." if no argument is specified.

### Flags

#### \-h, --help

help for prune

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf plugin](../) - Work with check plugins
