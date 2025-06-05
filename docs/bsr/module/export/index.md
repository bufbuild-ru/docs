---
description: "Documentation about how to export Protobuf files from the BSR"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/module/export/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/documentation/create-docs/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/module/descriptor/"
  - - meta
    - property: "og:title"
      content: "Export modules from the BSR - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/module/export.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/module/export/"
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
      content: "Export modules from the BSR - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/module/export.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Export modules from the BSR

Within the Buf ecosystem, moving `.proto` files around is unnecessary. You can manage dependencies in your modules and vendor commonly used modules like `googleapis/googleapis` from the Buf Schema Registry (BSR) community modules. However, tools other than the Buf CLI may require all `.proto` files to be present locally.

To export `.proto` files from the BSR, you can either:

- Use the Buf CLI's `buf export` command.
- Download and extract an archive file.

## Export with the Buf CLI

The `buf export` command allows you to copy `.proto` files to your local environment from many types of sources, including the BSR, a Git repository, or a `.tar` file. From there you can inspect them or move them into other tools or legacy systems.

The basic `buf export` command requires a local destination directory path for the output and defaults to the current local directory as the source:

```sh
buf export -o /path/to/directory
```

You can also specify a BSR module or a Git repository as the source:

::: info Export a module @latest

```sh
buf export buf.build/grpc/grpc -o /path/to/directory
```

:::

::: info Export a module at a specific commit

```sh
buf export buf.build/grpc/grpc:334e348dc5854e4b99a3a0d25d8ff376 -o /path/to/directory
```

:::

::: info Export the Protobuf files from a Git repo

```sh
buf export https://github.com/bufbuild/protovalidate.git -o /path/to/directory
```

:::

When exporting from the BSR, you can append a specific commit or label reference to the module name, preceded by a colon (`:`). By default, exporting from the BSR includes all dependencies.

You can also limit the output to a subset of the source by either excluding or including specific paths to a directory or file (multiple paths must be separated by commas):

::: info Exclude the 'geo' directory

```sh
buf export buf.build/googleapis/googleapis -o /path/to/directory --exclude-path google/geo
```

:::

::: info Only export the 'geo' and 'longrunning' directories

```sh
buf export buf.build/googleapis/googleapis -o /path/to/directory --path google/geo,google/longrunning
```

:::

## Export with `curl`

You can also request an archive of a module from the BSR using the `curl` command. It downloads a zip or tarball archive to your local environment. The download command requires a BSR module as the source, and has this syntax:

::: info Syntax

```bash
$ curl -fsSL -O https://BSR_INSTANCE/MODULE_OWNER/MODULE_NAME/archive/REFERENCE.FILE_EXT

# Examples:
# The latest commit on the default label.
curl -fsSL -O https://buf.build/acme/petapis/archive/main.tar.gz
# A specific commit.
curl -fsSL -O https://buf.build/acme/petapis/archive/7abdb7802c8f4737a1a23a35ca8266ef.tar.gz
```

:::

The URL contains these elements:

- _BSR_INSTANCE_ is the domain name of your BSR instance. (Default: buf.build)
- _MODULE_OWNER_ is the owner of the module.
- _MODULE_NAME_ is the name of the module.
- _REFERENCE_ must be one of the following:
  - A label name: uses the latest commit for the given label.
  - A commit ID: uses the explicit BSR module commit. This must be the full module commit ID.
- FILE_EXT is the file extension of the archive. This can be either `tar.gz` or `zip`.

### Including dependencies

By default, the module archive includes only the specified module's content, excluding any dependencies. You can include all of the target module's dependencies, including the [Well Known Types](https://protobuf.com/docs/descriptors#standard-imports), by adding the `imports=true` query parameter:

::: info Download a module archive that includes dependencies

```sh
curl -fsSL -O "https://buf.build/acme/petapis/archive/main.zip?imports=true"
```

:::
