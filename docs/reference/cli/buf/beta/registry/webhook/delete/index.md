---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/webhook/delete/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/webhook/create/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/webhook/list/"
  - - meta
    - property: "og:title"
      content: "buf beta registry webhook delete - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/beta/registry/webhook/delete.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/webhook/delete/"
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
      content: "buf beta registry webhook delete - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/beta/registry/webhook/delete.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf beta registry webhook delete

Delete a repository webhook

### Usage

```sh
buf beta registry webhook delete [flags]
```

### Flags

#### \-h, --help

help for delete

#### \--id _string_

The webhook ID to delete

#### \--remote _string_

The remote of the repository the webhook ID belongs to

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf beta registry webhook](../) - Manage webhooks for a repository on the Buf Schema Registry
