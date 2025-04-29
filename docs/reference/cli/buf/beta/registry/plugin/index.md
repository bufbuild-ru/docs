---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/plugin/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/plugin/delete/"
  - - meta
    - property: "og:title"
      content: "Plugin - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/beta/registry/plugin/index.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/plugin/"
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
      content: "Plugin - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/beta/registry/plugin/index.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf beta registry plugin

Manage plugins on the Buf Schema Registry

### Usage

```console
$ buf beta registry plugin [flags]
```

### Flags

#### \-h, --help

help for plugin

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

- [buf beta registry plugin delete](delete/) - Delete a plugin from the registry
- [buf beta registry plugin push](push/) - Push a plugin to a registry

### Parent Command

- [buf beta registry](../) - Manage assets on the Buf Schema Registry
