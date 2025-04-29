---

title: "Webhook - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/webhook/"
  - - meta
    - property: "og:title"
      content: "Webhook - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/webhook/"
  - - meta
    - property: "twitter:title"
      content: "Webhook - Buf Docs"

---

# buf beta registry webhook

Manage webhooks for a repository on the Buf Schema Registry

### Usage

```console
$ buf beta registry webhook [flags]
```

### Flags

#### \-h, --help

help for webhook

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

- [buf beta registry webhook create](create/) - Create a repository webhook
- [buf beta registry webhook delete](delete/) - Delete a repository webhook
- [buf beta registry webhook list](list/) - List repository webhooks

### Parent Command

- [buf beta registry](../) - Manage assets on the Buf Schema Registry
