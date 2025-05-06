---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/config/init/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/config/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/config/ls-breaking-rules/"
  - - meta
    - property: "og:title"
      content: "buf config init - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/config/init.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/config/init/"
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
      content: "buf config init - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/config/init.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf config init

Initialize buf configuration files for your local development

### Usage

```console
$ buf config init [buf.build/owner/foobar] [flags]
```

### Description

This command will write a new buf.yaml file to start your local development.

If a buf.yaml already exists, this command will not overwrite it, and will produce an error.

The effects of this command may change over time - this command may initialize i.e. buf.gen.yaml files in the future.

### Flags

#### \-h, --help

help for init

#### \-o, --output _string_

The directory to write the configuration files to

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf config](../) - Work with configuration files
