---

title: "Bufstream CLI commands - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/reference/cli/"
  - - meta
    - property: "og:title"
      content: "Bufstream CLI commands - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/reference/cli/"
  - - meta
    - property: "twitter:title"
      content: "Bufstream CLI commands - Buf Docs"

---

# bufstream

The Bufstream process.

### Usage

```console
$ bufstream [flags]
```

### Description

A process that supports various actors needed to run a Bufstream cluster.

### Flags

#### \-h, --help

help for bufstream

#### \--help-tree

Print the entire sub-command tree

#### \--version

Print the version

### Subcommands

- [bufstream admin](admin/) - Perform Bufstream administrative tasks
- [bufstream client](client/) - client commands
- [bufstream migrate](migrate/) - Migrate Bufstream cluster storage
- [bufstream serve](serve/) - Serve a Bufstream cluster
