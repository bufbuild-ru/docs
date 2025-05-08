---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/reference/cli/serve/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bufstream/reference/cli/migrate/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bufstream/reference/cli/admin/"
  - - meta
    - property: "og:title"
      content: "bufstream serve - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/reference/cli/serve.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/reference/cli/serve/"
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
      content: "bufstream serve - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/reference/cli/serve.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# bufstream serve

Serve a Bufstream cluster

### Usage

```sh
bufstream serve [flags]
```

### Description

A process that serves a Bufstream cluster.

### Flags

#### \-c, --config _string_

Path to the config file.

#### \-h, --help

help for serve

#### \--inmemory

Use in-memory storage (for development only).

### Parent Command

- [bufstream](../) - The Bufstream process.
