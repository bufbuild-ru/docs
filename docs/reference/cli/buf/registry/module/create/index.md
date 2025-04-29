---

title: "buf registry module create - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/module/create/"
  - - meta
    - property: "og:title"
      content: "buf registry module create - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/registry/module/create/"
  - - meta
    - property: "twitter:title"
      content: "buf registry module create - Buf Docs"

---

# buf registry module create

Create a BSR module

### Usage

```console
$ buf registry module create <remote/owner/module> [flags]
```

### Flags

#### \--default-label-name _string_

The default label name of the module

#### \--format _string_

The output format to use. Must be one of \[text,json\]

#### \-h, --help

help for create

#### \--visibility _string_

The module's visibility setting. Must be one of \[public,private\]

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf registry module](../) - Manage BSR modules
