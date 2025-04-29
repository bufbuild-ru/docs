---

title: "Registry - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/"
  - - meta
    - property: "og:title"
      content: "Registry - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/"
  - - meta
    - property: "twitter:title"
      content: "Registry - Buf Docs"

---

# buf beta registry

Manage assets on the Buf Schema Registry

### Usage

```console
$ buf beta registry [flags]
```

### Flags

#### \-h, --help

help for registry

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

- [buf beta registry plugin](plugin/) - Manage plugins on the Buf Schema Registry
- [buf beta registry webhook](webhook/) - Manage webhooks for a repository on the Buf Schema Registry

### Parent Command

- [buf beta](../) - Beta commands. Unstable and likely to change
