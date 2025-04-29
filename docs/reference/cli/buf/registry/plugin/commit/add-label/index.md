---

title: "buf registry plugin commit add-label - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/plugin/commit/add-label/"
  - - meta
    - property: "og:title"
      content: "buf registry plugin commit add-label - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/registry/plugin/commit/add-label/"
  - - meta
    - property: "twitter:title"
      content: "buf registry plugin commit add-label - Buf Docs"

---

# buf registry plugin commit add-label

Add labels to a commit

### Usage

```console
$ buf registry plugin commit add-label <remote/owner/plugin:commit> --label <label> [flags]
```

### Flags

#### \--format _string_

The output format to use. Must be one of \[text,json\]

#### \-h, --help

help for add-label

#### \--label _strings_

The labels to add to the commit. Must have at least one

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf registry plugin commit](../) - Manage a plugin's commits
