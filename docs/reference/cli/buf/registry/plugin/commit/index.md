---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/plugin/commit/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/plugin/info/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/plugin/commit/add-label/"
  - - meta
    - property: "og:title"
      content: "Commit - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/registry/plugin/commit/index.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/registry/plugin/commit/"
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
      content: "Commit - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/registry/plugin/commit/index.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf registry plugin commit

Manage a plugin's commits

### Usage

```sh
buf registry plugin commit [flags]
```

### Flags

#### \-h, --help

help for commit

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

- [buf registry plugin commit add-label](add-label/) - Add labels to a commit
- [buf registry plugin commit info](info/) - Get commit information
- [buf registry plugin commit list](list/) - List plugins commits
- [buf registry plugin commit resolve](resolve/) - Resolve commit from a reference

### Parent Command

- [buf registry plugin](../) - Manage BSR plugins
