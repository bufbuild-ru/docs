---

title: "Sdk - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/sdk/"
  - - meta
    - property: "og:title"
      content: "Sdk - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/registry/sdk/"
  - - meta
    - property: "twitter:title"
      content: "Sdk - Buf Docs"

---

# buf registry sdk

Manage Generated SDKs

### Usage

```console
$ buf registry sdk [flags]
```

### Flags

#### \-h, --help

help for sdk

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

- [buf registry sdk version](version/) - Resolve module and plugin reference to a specific Generated SDK version

### Parent Command

- [buf registry](../) - Manage assets on the Buf Schema Registry
