---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/plugin/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/dep/update/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/plugin/prune/"
  - - meta
    - property: "og:title"
      content: "Plugin - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/plugin/index.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/plugin/"
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
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/plugin/index.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf plugin

Work with check plugins

### Usage

```sh
buf plugin [flags]
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

- [buf plugin prune](prune/) - Prune unused plugins from buf.lock
- [buf plugin push](push/) - Push a check plugin to a registry
- [buf plugin update](update/) - Update pinned remote plugins in a buf.lock

### Parent Command

- [buf](../) - The Buf CLI
