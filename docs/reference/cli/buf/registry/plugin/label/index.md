---

title: "Label - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/plugin/label/"
  - - meta
    - property: "og:title"
      content: "Label - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/registry/plugin/label/"
  - - meta
    - property: "twitter:title"
      content: "Label - Buf Docs"

---

# buf registry plugin label

Manage a plugin's labels

### Usage

```console
$ buf registry plugin label [flags]
```

### Flags

#### \-h, --help

help for label

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

- [buf registry plugin label archive](archive/) - Archive a plugin label
- [buf registry plugin label info](info/) - Show label information
- [buf registry plugin label list](list/) - List plugin labels
- [buf registry plugin label unarchive](unarchive/) - Unarchive a plugin label

### Parent Command

- [buf registry plugin](../) - Manage BSR plugins
