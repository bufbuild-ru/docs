---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/config/ls-modules/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/config/ls-lint-rules/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/config/migrate/"
  - - meta
    - property: "og:title"
      content: "buf config ls-modules - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/config/ls-modules.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/config/ls-modules/"
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
      content: "buf config ls-modules - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/config/ls-modules.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf config ls-modules

List configured modules

### Usage

```sh
buf config ls-modules [flags]
```

### Flags

#### \--config _string_

The buf.yaml file or data to use for configuration.

#### \--format _string_

The format to print rules as. Must be one of \[path,name,json\]

#### \-h, --help

help for ls-modules

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf config](../) - Work with configuration files
