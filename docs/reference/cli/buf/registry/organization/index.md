---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/organization/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/module/settings/update/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/organization/create/"
  - - meta
    - property: "og:title"
      content: "Organization - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/registry/organization/index.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/registry/organization/"
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
      content: "Organization - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/registry/organization/index.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf registry organization

Manage organizations

### Usage

```console
$ buf registry organization [flags]
```

### Flags

#### \-h, --help

help for organization

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

- [buf registry organization create](create/) - Create a new BSR organization
- [buf registry organization delete](delete/) - Delete a BSR organization
- [buf registry organization info](info/) - Show information about a BSR organization
- [buf registry organization update](update/) - Update a BSR organization

### Parent Command

- [buf registry](../) - Manage assets on the Buf Schema Registry
