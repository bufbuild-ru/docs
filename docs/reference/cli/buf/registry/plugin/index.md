---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/plugin/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/organization/update/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/plugin/create/"
  - - meta
    - property: "og:title"
      content: "Plugin - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/registry/plugin/index.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/registry/plugin/"
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
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/registry/plugin/index.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf registry plugin

Manage BSR plugins

### Usage

```sh
buf registry plugin [flags]
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

- [buf registry plugin commit](commit/) - Manage a plugin's commits
- [buf registry plugin create](create/) - Create a BSR plugin
- [buf registry plugin delete](delete/) - Delete a BSR plugin
- [buf registry plugin info](info/) - Get a BSR plugin
- [buf registry plugin label](label/) - Manage a plugin's labels
- [buf registry plugin settings](settings/) - Manage a plugin's settings

### Parent Command

- [buf registry](../) - Manage assets on the Buf Schema Registry
