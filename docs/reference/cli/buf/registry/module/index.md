---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/module/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/whoami/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/module/create/"
  - - meta
    - property: "og:title"
      content: "Module - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/registry/module/index.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/registry/module/"
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
      content: "Module - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/registry/module/index.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf registry module

Manage BSR modules

### Usage

```sh
buf registry module [flags]
```

### Flags

#### \-h, --help

help for module

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

- [buf registry module commit](commit/) - Manage a module's commits
- [buf registry module create](create/) - Create a BSR module
- [buf registry module delete](delete/) - Delete a BSR module
- [buf registry module deprecate](deprecate/) - Deprecate a BSR module
- [buf registry module info](info/) - Get a BSR module
- [buf registry module label](label/) - Manage a module's labels
- [buf registry module settings](settings/) - Manage a module's settings
- [buf registry module undeprecate](undeprecate/) - Undeprecate a BSR module

### Parent Command

- [buf registry](../) - Manage assets on the Buf Schema Registry
