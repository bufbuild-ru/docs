---

title: "buf beta registry webhook delete - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/webhook/delete/"
  - - meta
    - property: "og:title"
      content: "buf beta registry webhook delete - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/webhook/delete/"
  - - meta
    - property: "twitter:title"
      content: "buf beta registry webhook delete - Buf Docs"

---

# buf beta registry webhook delete

Delete a repository webhook

### Usage

```console
$ buf beta registry webhook delete [flags]
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
