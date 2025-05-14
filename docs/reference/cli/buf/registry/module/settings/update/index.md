---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/module/settings/update/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/module/settings/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/organization/"
  - - meta
    - property: "og:title"
      content: "buf registry module settings update - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/registry/module/settings/update.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/registry/module/settings/update/"
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
      content: "buf registry module settings update - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/registry/module/settings/update.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf registry module settings update

Update BSR module settings

### Usage

```sh
buf registry module settings update <remote/owner/module> [flags]
```

### Flags

#### \--default-label-name _string_

The label that commits are pushed to by default

#### \--description _string_

The new description for the module

#### \-h, --help

help for update

#### \--url _string_

The new URL for the module

#### \--visibility _string_

The module's visibility setting. Must be one of \[public,private\]

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf registry module settings](../) - Manage a module's settings
