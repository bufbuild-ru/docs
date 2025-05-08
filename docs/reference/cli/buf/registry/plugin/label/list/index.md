---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/plugin/label/list/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/plugin/label/info/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/registry/plugin/label/unarchive/"
  - - meta
    - property: "og:title"
      content: "buf registry plugin label list - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/registry/plugin/label/list.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/registry/plugin/label/list/"
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
      content: "buf registry plugin label list - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/registry/plugin/label/list.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf registry plugin label list

List plugin labels

### Usage

```sh
buf registry plugin label list <remote/owner/plugin[:ref]> [flags]
```

### Flags

#### \--archive-status _string_

The archive status of the labels listed. Must be one of \[archived,unarchived,all\]

#### \--format _string_

The output format to use. Must be one of \[text,json\]

#### \-h, --help

help for list

#### \--page-size _uint32_

The page size.

#### \--page-token _string_

The page token. If more results are available, a "next_page" key is present in the --format=json output

#### \--reverse

Reverse the results

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf registry plugin label](../) - Manage a plugin's labels
