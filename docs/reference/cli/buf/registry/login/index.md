---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/login/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/cc/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/logout/"
  - - meta
    - property: "og:title"
      content: "buf registry login - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/registry/login.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/registry/login/"
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
      content: "buf registry login - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/registry/login.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf registry login

Log in to the Buf Schema Registry

### Usage

```console
$ buf registry login [domain] [flags]
```

### Description

This command will open a browser to complete the login process. Use the flags --prompt or --token-stdin to complete an alternative login flow. The token is saved to your .netrc file. The \[domain\] argument will default to buf.build if not specified.

### Flags

#### \-h, --help

help for login

#### \--prompt

Prompt for the token. The device must be a TTY. Exclusive with the flag --token-stdin.

#### \--token-stdin

Read the token from stdin. This command prompts for a token by default. Exclusive with the flag --prompt.

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf registry](../) - Manage assets on the Buf Schema Registry
