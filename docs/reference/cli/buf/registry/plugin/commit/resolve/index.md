---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/plugin/commit/resolve/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/plugin/commit/list/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/plugin/label/"
  - - meta
    - property: "og:title"
      content: "buf registry plugin commit resolve - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/registry/plugin/commit/resolve.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/registry/plugin/commit/resolve/"
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
      content: "buf registry plugin commit resolve - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/registry/plugin/commit/resolve.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf registry plugin commit resolve

Resolve commit from a reference

### Usage

```sh
buf registry plugin commit resolve <remote/owner/repository[:ref]> [flags]
```

### Flags

#### \--format _string_

The output format to use. Must be one of \[text,json\]

#### \-h, --help

help for resolve

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf registry plugin commit](../) - Manage a plugin's commits
