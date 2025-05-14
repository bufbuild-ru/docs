---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/config/ls-breaking-rules/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/config/init/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/config/ls-lint-rules/"
  - - meta
    - property: "og:title"
      content: "buf config ls-breaking-rules - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/config/ls-breaking-rules.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/config/ls-breaking-rules/"
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
      content: "buf config ls-breaking-rules - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/config/ls-breaking-rules.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf config ls-breaking-rules

List breaking rules

### Usage

```sh
buf config ls-breaking-rules [flags]
```

### Flags

#### \--config _string_

The buf.yaml file or data to use for configuration. --configured-only must be set

#### \--configured-only

List rules that are configured instead of listing all available rules

#### \--format _string_

The format to print rules as. Must be one of \[text,json\]

#### \-h, --help

help for ls-breaking-rules

#### \--include-deprecated

Also print deprecated rules. Has no effect if --configured-only is set.

#### \--module-path _string_

The path to the specific module to list configured rules for as specified in the buf.yaml. If the buf.yaml has more than one module defined, this must be set. --configured-only must be set

#### \--version _string_

List all the rules for the given configuration version. By default, the version in the buf.yaml in the current directory is used, or the latest version otherwise (currently v2). Cannot be set if --configured-only is set. Must be one of \[v1beta1 v1 v2\]

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf config](../) - Work with configuration files
