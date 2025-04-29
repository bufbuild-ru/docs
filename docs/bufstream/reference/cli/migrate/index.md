---

title: "bufstream migrate - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/reference/cli/migrate/"
  - - meta
    - property: "og:title"
      content: "bufstream migrate - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/reference/cli/migrate/"
  - - meta
    - property: "twitter:title"
      content: "bufstream migrate - Buf Docs"

---

# bufstream migrate

Migrate Bufstream cluster storage

### Usage

```console
$ bufstream migrate [flags]
```

### Description

Performs migrations on the underlying Bufstream metadata and data storage implementations

### Flags

#### \-c, --config _string_

Path to the config file.

#### \-h, --help

help for migrate

#### \--inmemory

Use in-memory storage (for development only).

### Parent Command

- [bufstream](../) - The Bufstream process.
