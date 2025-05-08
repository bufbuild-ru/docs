---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/push/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/buf-plugin-v1/"
  - - meta
    - property: "og:title"
      content: "Beta - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/beta/index.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/beta/"
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
      content: "Beta - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/beta/index.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf beta

Beta commands. Unstable and likely to change

### Usage

```sh
buf beta [flags]
```

### Flags

#### \-h, --help

help for beta

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

- [buf beta buf-plugin-v1](buf-plugin-v1/) - Run buf as a check plugin.
- [buf beta buf-plugin-v1beta1](buf-plugin-v1beta1/) - Run buf as a check plugin.
- [buf beta buf-plugin-v2](buf-plugin-v2/) - Run buf as a check plugin.
- [buf beta lsp](lsp/) - Start the language server
- [buf beta price](price/) - Get the price for BSR paid plans for a given source or module
- [buf beta registry](registry/) - Manage assets on the Buf Schema Registry
- [buf beta stats](stats/) - Get statistics for a given source or module
- [buf beta studio-agent](studio-agent/) - Run an HTTP(S) server as the Studio agent

### Parent Command

- [buf](../) - The Buf CLI
