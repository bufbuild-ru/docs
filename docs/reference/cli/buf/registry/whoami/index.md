---

title: "buf registry whoami - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/whoami/"
  - - meta
    - property: "og:title"
      content: "buf registry whoami - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/registry/whoami/"
  - - meta
    - property: "twitter:title"
      content: "buf registry whoami - Buf Docs"

---

# buf registry whoami

Check if you are logged in to the Buf Schema Registry

### Usage

```console
$ buf registry whoami <domain> [flags]
```

### Description

This command checks if you are currently logged into the Buf Schema Registry at the provided `<domain>`. The `<domain>` argument will default to buf.build if not specified.

### Flags

#### \--format _string_

The output format to use. Must be one of \[text,json\]

#### \-h, --help

help for whoami

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf registry](../) - Manage assets on the Buf Schema Registry
