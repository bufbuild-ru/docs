---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/export/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/curl/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/format/"
  - - meta
    - property: "og:title"
      content: "buf export - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/export.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/export/"
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
      content: "buf export - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/export.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf export

Export proto files from one location to another

### Usage

```sh
buf export <source> [flags]
```

### Description

The first argument is the source or module to export, which must be one of format \[dir,git,mod,protofile,tar,zip\]. This defaults to "." if no argument is specified.

Examples:

Export proto files in `<source>` to an output directory.

```sh
buf export <source> --output=<output-dir>
```

Export current directory to another local directory.

```sh
buf export . --output=<output-dir>
```

Export the latest remote module to a local directory.

```sh
buf export <buf.build/owner/repository> --output=<output-dir>
```

Export a specific version of a remote module to a local directory.

```sh
buf export <buf.build/owner/repository:ref> --output=<output-dir>
```

Export a git repo to a local directory.

```sh
buf export https://github.com/owner/repository.git --output=<output-dir>
```

### Flags

#### \--config _string_

The buf.yaml file or data to use for configuration

#### \--disable-symlinks

Do not follow symlinks when reading sources or configuration from the local filesystem By default, symlinks are followed in this CLI, but never followed on the Buf Schema Registry

#### \--exclude-imports

Exclude imports.

#### \--exclude-path _strings_

Exclude specific files or directories, e.g. "proto/a/a.proto", "proto/a" If specified multiple times, the union is taken

#### \-h, --help

help for export

#### \-o, --output _string_

The output directory for exported files

#### \--path _strings_

Limit to specific files or directories, e.g. "proto/a/a.proto", "proto/a" If specified multiple times, the union is taken

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf](../) - The Buf CLI
