---

title: "Registry - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/"
  - - meta
    - property: "og:title"
      content: "Registry - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/registry/"
  - - meta
    - property: "twitter:title"
      content: "Registry - Buf Docs"

---

# buf registry

Manage assets on the Buf Schema Registry

### Usage

```console
$ buf registry [flags]
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

- [buf registry cc](cc/) - Clear the registry cache
- [buf registry login](login/) - Log in to the Buf Schema Registry
- [buf registry logout](logout/) - Log out of the Buf Schema Registry
- [buf registry module](module/) - Manage BSR modules
- [buf registry organization](organization/) - Manage organizations
- [buf registry plugin](plugin/) - Manage BSR plugins
- [buf registry sdk](sdk/) - Manage Generated SDKs
- [buf registry whoami](whoami/) - Check if you are logged in to the Buf Schema Registry

### Parent Command

- [buf](../) - The Buf CLI
