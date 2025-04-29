---

title: "Organization - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/organization/"
  - - meta
    - property: "og:title"
      content: "Organization - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/registry/organization/"
  - - meta
    - property: "twitter:title"
      content: "Organization - Buf Docs"

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
