---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/module/commit/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/module/undeprecate/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/module/commit/add-label/"
  - - meta
    - property: "og:title"
      content: "Commit - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/registry/module/commit/index.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/registry/module/commit/"
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
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/registry/module/commit/index.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf registry module commit

Manage a module's commits

### Usage

```console
$ buf registry module commit [flags]
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

- [buf registry module commit add-label](add-label/) - Add labels to a commit
- [buf registry module commit info](info/) - Get commit information
- [buf registry module commit list](list/) - List modules commits
- [buf registry module commit resolve](resolve/) - Resolve commit from a reference

### Parent Command

- [buf registry module](../) - Manage BSR modules
