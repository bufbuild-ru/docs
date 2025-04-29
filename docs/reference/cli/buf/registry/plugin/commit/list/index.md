---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/plugin/commit/list/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/plugin/commit/info/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/plugin/commit/resolve/"
  - - meta
    - property: "og:title"
      content: "buf registry plugin commit list - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/registry/plugin/commit/list.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/registry/plugin/commit/list/"
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
      content: "buf registry plugin commit list - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/registry/plugin/commit/list.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf registry plugin commit list

List plugins commits

### Usage

```console
$ buf registry plugin commit list <remote/owner/plugin[:ref]> [flags]
```

### Description

This command lists commits in a plugin based on the reference specified. For a commit reference, it lists the commit itself. For a label reference, it lists the current and past commits associated with this label. If no reference is specified, it lists all commits in this plugin.

### Flags

#### \--digest-changes-only

Only commits that have changed digests. By default, all commits are listed

#### \--format _string_

The output format to use. Must be one of \[text,json\]

#### \-h, --help

help for list

#### \--page-size _uint32_

The page size

#### \--page-token _string_

The page token. If more results are available, a "next_page" key is present in the --format=json output

#### \--reverse

Reverse the results. By default, they are ordered with the newest first

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf registry plugin commit](../) - Manage a plugin's commits
