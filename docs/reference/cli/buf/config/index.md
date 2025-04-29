---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/config/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/webhook/list/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/config/init/"
  - - meta
    - property: "og:title"
      content: "Config - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/config/index.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/config/"
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
      content: "Config - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/config/index.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf config

Work with configuration files

### Usage

```console
$ buf config [flags]
```

### Flags

#### \-h, --help

help for config

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

- [buf config init](init/) - Initialize buf configuration files for your local development
- [buf config ls-breaking-rules](ls-breaking-rules/) - List breaking rules
- [buf config ls-lint-rules](ls-lint-rules/) - List lint rules
- [buf config ls-modules](ls-modules/) - List configured modules
- [buf config migrate](migrate/) - Migrate all buf.yaml, buf.work.yaml, buf.gen.yaml, and buf.lock files at the specified directories or paths to v2

### Parent Command

- [buf](../) - The Buf CLI
