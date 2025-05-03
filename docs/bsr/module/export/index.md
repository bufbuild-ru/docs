---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/module/export/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/module/publish/"
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

Within the Buf ecosystem, moving `.proto` files around is unnecessary. You can manage dependencies in your modules and vendor commonly used modules like `googleapis/googleapis` from the Buf Schema Registry (BSR) community modules. However, tools other than the Buf CLI may require all `.proto` files to be present locally.To export `.proto` files from the BSR, you can either:

- use the Buf CLI's `buf export` command
- download and extract an archive file

## Export with the Buf CLI

The `buf export` command allows you to copy `.proto` files to your local environment from many types of sources, including the BSR, a Git repository, or a `.tar` file. From there you can inspect them or move them into other tools or legacy systems.The basic `buf export` command requires a local destination directory path for the output and defaults to the current local directory as the source:

```console
$ buf export -o /path/to/directory
```

You can also specify a BSR module or a Git repository as the source:

::: info Export a module @latest

```console
$ buf export buf.build/grpc/grpc -o /path/to/directory
```

:::

::: info Export a module at a specific commit

```console
$ buf export buf.build/grpc/grpc:334e348dc5854e4b99a3a0d25d8ff376 -o /path/to/directory
```

:::

::: info Export the Protobuf files from a Git repo

```console
$ buf export https://github.com/bufbuild/protovalidate.git -o /path/to/directory
```

:::

When exporting from the BSR, you can append a specific commit or label reference to the module name, preceded by a colon (`:`). By default, exporting from the BSR includes all dependencies.You can also limit the output to a subset of the source by either excluding or including specific paths to a directory or file (multiple paths must be separated by commas):

::: info Exclude the 'geo' directory

```console
$ buf export buf.build/googleapis/googleapis -o /path/to/directory --exclude-path google/geo
```

:::

::: info Only export the 'geo' and 'longrunning' directories

```console
$ buf export buf.build/googleapis/googleapis -o /path/to/directory --path google/geo,google/longrunning
```

:::

## Export with `curl`

You can also request an archive of a module from the BSR using the `curl` command. It downloads a zip or tarball archive to your local environment. The download command requires a BSR module as the source, and has this syntax (the example shows a request for the latest commit on the default label):

::: info Syntax

```bash
$ curl -fsSL -OJ https://BSR_INSTANCE//MODULE_OWNER/MODULE_NAME/REFERENCE.FILE_EXT

# Examples
curl -fsSL -OJ https://buf.build/acme/petapis/main.tar.gz
curl -fsSL -OJ https://buf.build/acme/petapis/fc19856dc93042e290c9197d39a2beca.tar.gz
curl -fsSL -OJ https://buf.build/acme/petapis/v1.2.3-fc19856dc930.1.tar.gz
```

:::

The URL contains these elements:

- _BSR_INSTANCE_ is the domain name of your BSR instance. (Default: buf.build)
- _MODULE_OWNER_ is the owner of the module.
- _MODULE_NAME_ is the name of the module.
- _REFERENCE_ must be one of the following:
  - \[label name\]\[label\]: uses the latest commit for the given label
  - commit ID: uses the explicit BSR module commit and the most recent plugin version. The commit must be the full module commit name.
- FILE_EXT is the file extension of the archive. This can be either `tar.gz` or `zip`.

### Including dependencies

By default, the module archive includes only the specified module's content, excluding any dependencies. You can include all of the target module's dependencies, including the [Well Known Types](https://protobuf.com/docs/descriptors#standard-imports), by adding the `imports=true` query parameter:

::: info Download a module archive that includes dependencies

```console
$ curl -sOJ "https://buf.build/acme/petapis/archive/main.zip?imports=true"
```

:::
