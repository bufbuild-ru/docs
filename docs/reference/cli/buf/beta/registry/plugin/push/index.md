---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/plugin/push/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/plugin/delete/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/webhook/"
  - - meta
    - property: "og:title"
      content: "buf beta registry plugin push - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/beta/registry/plugin/push.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/plugin/push/"
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
      content: "buf beta registry plugin push - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/beta/registry/plugin/push.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf beta registry plugin push

Push a plugin to a registry

### Usage

```sh
buf beta registry plugin push <source> [flags]
```

### Description

The first argument is the source to push (directory containing buf.plugin.yaml or plugin release zip), which must be a directory. This defaults to "." if no argument is specified.

### Flags

#### \--disable-symlinks

Do not follow symlinks when reading sources or configuration from the local filesystem By default, symlinks are followed in this CLI, but never followed on the Buf Schema Registry

#### \--format _string_

The output format to use. Must be one of \[text,json\]

#### \-h, --help

help for push

#### \--image _string_

Existing image to push

#### \--override-remote _string_

Override the default remote found in buf.plugin.yaml name and dependencies

#### \--visibility _string_

The plugin's visibility setting. Must be one of \[public,private\]

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf beta registry plugin](../) - Manage plugins on the Buf Schema Registry
