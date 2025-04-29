---

title: "buf beta stats - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/stats/"
  - - meta
    - property: "og:title"
      content: "buf beta stats - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/beta/stats/"
  - - meta
    - property: "twitter:title"
      content: "buf beta stats - Buf Docs"

---

# buf beta stats

Get statistics for a given source or module

### Usage

```console
$ buf beta stats <source> [flags]
```

### Description

The first argument is the source or module to get statistics for, which must be one of format \[dir,git,mod,protofile,tar,zip\]. This defaults to "." if no argument is specified.

### Flags

#### \--disable-symlinks

Do not follow symlinks when reading sources or configuration from the local filesystem By default, symlinks are followed in this CLI, but never followed on the Buf Schema Registry

#### \--format _string_

The output format to use. Must be one of \[text,json\]

#### \-h, --help

help for stats

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf beta](../) - Beta commands. Unstable and likely to change
