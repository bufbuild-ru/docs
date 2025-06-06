---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/dep/update/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/dep/prune/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/plugin/"
  - - meta
    - property: "og:title"
      content: "buf dep update - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/dep/update.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/dep/update/"
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
      content: "buf dep update - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/dep/update.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf dep update

Update pinned module dependencies in a buf.lock

### Usage

```sh
buf dep update <directory> [flags]
```

### Description

Fetch the latest digests for the specified module references in buf.yaml, and write them and their transitive dependencies to buf.lock.

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

- [buf dep](../) - Work with dependencies
