---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/push/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/lint/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/"
  - - meta
    - property: "og:title"
      content: "buf push - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/push.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/push/"
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
      content: "buf push - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/push.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf push

Push to a registry

### Usage

```sh
buf push <source> [flags]
```

### Description

The first argument is the source to push, which must be one of format \[dir,git,protofile,tar,zip\]. This defaults to "." if no argument is specified.

### Flags

#### \--create

Create the module if it does not exist. Defaults to creating a private module if --create-visibility is not set.

#### \--create-default-label _string_

The module's default label setting, if created. If this is not set, then the module will be created with the default label "main".

#### \--create-visibility _string_

The module's visibility setting, if created. Can only be set with --create. Must be one of \[public,private\]

#### \--disable-symlinks

Do not follow symlinks when reading sources or configuration from the local filesystem By default, symlinks are followed in this CLI, but never followed on the Buf Schema Registry

#### \--error-format _string_

The format for build errors printed to stderr. Must be one of \[text,json,msvs,junit,github-actions\]

#### \--exclude-unnamed

Only push named modules to the BSR. Named modules must not have any unnamed dependencies.

#### \--git-metadata

Uses the Git source control state to set flag values. If this flag is set, we will use the following values for your flags:

```text
--source-control-url to <git remote URL>/<repository name>/<route>/<checked out commit sha> (e.g. https://github.com/acme/weather/commit/ffac537e6cbbf934b08745a378932722df287a53).
--label for each Git tag and branch pointing to the currently checked out commit. You can set additional labels using --label with this flag.
--create-default-label to the Git default branch (e.g. main) - this is only in effect if --create is also set.
```

The source control URL and default branch is based on the required Git remote "origin". This flag is only compatible with checkouts of Git source repositories. If you set the --source-control-url flag and/or --create-default-label flag yourself, then the value(s) will be used instead and the information will not be derived from the Git source control state.

#### \-h, --help

help for push

#### \--label _strings_

Associate the label with the modules pushed. Can be used multiple times.

#### \--source-control-url _string_

The URL for viewing the source code of the pushed modules (e.g. the specific commit in source control).

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf](../) - The Buf CLI
