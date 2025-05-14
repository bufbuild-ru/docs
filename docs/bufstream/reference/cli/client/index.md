---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/reference/cli/client/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bufstream/reference/cli/admin/repair/topics/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bufstream/reference/cli/client/metadata/"
  - - meta
    - property: "og:title"
      content: "Client - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/reference/cli/client/index.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/reference/cli/client/"
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
      content: "Client - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/reference/cli/client/index.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# bufstream client

client commands

### Usage

```sh
bufstream client [flags]
```

### Description

Client commands to interact with a bufstream server.

### Flags

#### \--bootstrap-address _string_

Bootstrap address of the bufstream broker

#### \--client-id _string_

ClientID value to send to the bufstream broker

#### \-h, --help

help for client

#### \--help-tree

Print the entire sub-command tree

#### \--root-ca-path _strings_

A path to Root CA certificate to load

### Subcommands

- [bufstream client metadata](metadata/) - client metadata command

### Parent Command

- [bufstream](../) - The Bufstream process.
