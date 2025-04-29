---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/build/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/breaking/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/convert/"
  - - meta
    - property: "og:title"
      content: "buf build - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/build.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/build/"
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
      content: "buf build - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/build.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf build

Build Protobuf files into a Buf image

### Usage

```console
$ buf build <input> [flags]
```

### Description

The first argument is the source or module to build or image to convert, which must be one of format \[binpb,dir,git,json,mod,protofile,tar,txtpb,yaml,zip\]. This defaults to "." if no argument is specified.

### Flags

#### \--as-file-descriptor-set

Output as a google.protobuf.FileDescriptorSet instead of an image Note that images are wire compatible with FileDescriptorSets, but this flag strips the additional metadata added for Buf usage

#### \--config _string_

The buf.yaml file or data to use for configuration

#### \--disable-symlinks

Do not follow symlinks when reading sources or configuration from the local filesystem By default, symlinks are followed in this CLI, but never followed on the Buf Schema Registry

#### \--error-format _string_

The format for build errors printed to stderr. Must be one of \[text,json,msvs,junit,github-actions\]

#### \--exclude-imports

Exclude imports.

#### \--exclude-path _strings_

Exclude specific files or directories, e.g. "proto/a/a.proto", "proto/a" If specified multiple times, the union is taken

#### \--exclude-source-info

Exclude source info

#### \--exclude-source-retention-options

Exclude options whose retention is source

#### \-h, --help

help for build

#### \-o, --output _string_

The output location for the built image. Must be one of format \[binpb,json,txtpb,yaml\]

#### \--path _strings_

Limit to specific files or directories, e.g. "proto/a/a.proto", "proto/a" If specified multiple times, the union is taken

#### \--type _strings_

The types (package, message, enum, extension, service, method) that should be included in this image. When specified, the resulting image will only include descriptors to describe the requested types

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf](../) - The Buf CLI
