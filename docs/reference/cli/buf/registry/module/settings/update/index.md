---

title: "buf registry module settings update - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/module/settings/update/"
  - - meta
    - property: "og:title"
      content: "buf registry module settings update - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/registry/module/settings/update/"
  - - meta
    - property: "twitter:title"
      content: "buf registry module settings update - Buf Docs"

---

# buf registry module settings update

Update BSR module settings

### Usage

```console
$ buf registry module settings update <remote/owner/module> [flags]
```

### Flags

#### \--default-label-name _string_

The label that commits are pushed to by default

#### \--description _string_

The new description for the module

#### \-h, --help

help for update

#### \--url _string_

The new URL for the module

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

- [buf registry module settings](../) - Manage a module's settings
