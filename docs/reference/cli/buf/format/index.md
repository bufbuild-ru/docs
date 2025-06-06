---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/format/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/export/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/generate/"
  - - meta
    - property: "og:title"
      content: "buf format - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/format.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/format/"
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
      content: "buf format - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/format.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf format

Format Protobuf files

### Usage

```sh
buf format <source> [flags]
```

### Description

By default, the source is the current directory and the formatted content is written to stdout.

Examples:

Write the current directory's formatted content to stdout:

```sh
buf format
```

Most people will want to rewrite the files defined in the current directory in-place with -w:

```sh
buf format -w
```

Display a diff between the original and formatted content with -d Write a diff instead of the formatted file:

```sh
buf format simple/simple.proto -d

diff -u simple/simple.proto.orig simple/simple.proto
--- simple/simple.proto.orig    2022-03-24 09:44:10.000000000 -0700
+++ simple/simple.proto 2022-03-24 09:44:10.000000000 -0700
@@ -2,8 +2,7 @@

package simple;

-
message Object {
-    string key = 1;
-   bytes value = 2;
+  string key = 1;
+  bytes value = 2;
}
```

Use the --exit-code flag to exit with a non-zero exit code if there is a diff:

```sh
buf format --exit-code
buf format -w --exit-code
buf format -d --exit-code
```

Format a file, directory, or module reference by specifying a source e.g. Write the formatted file to stdout:

```sh
buf format simple/simple.proto

syntax = "proto3";

package simple;

message Object {
  string key = 1;
  bytes value = 2;
}
```

Write the formatted directory to stdout:

```sh
buf format simple
...
```

Write the formatted module reference to stdout:

```sh
buf format buf.build/acme/petapis
...
```

Write the result to a specified output file or directory with -o e.g.

Write the formatted file to another file:

```sh
buf format simple/simple.proto -o simple/simple.formatted.proto
```

Write the formatted directory to another directory, creating it if it doesn't exist:

```sh
buf format proto -o formatted
```

This also works with module references:

```sh
buf format buf.build/acme/weather -o formatted
```

Rewrite the file(s) in-place with -w. e.g.

Rewrite a single file in-place:

```sh
buf format simple.proto -w
```

Rewrite an entire directory in-place:

```sh
buf format proto -w
```

Write a diff and rewrite the file(s) in-place:

```sh
buf format simple -d -w

diff -u simple/simple.proto.orig simple/simple.proto
...
```

The -w and -o flags cannot be used together in a single invocation.

### Flags

#### \--config _string_

The buf.yaml file or data to use for configuration

#### \-d, --diff

Display diffs instead of rewriting files

#### \--disable-symlinks

Do not follow symlinks when reading sources or configuration from the local filesystem By default, symlinks are followed in this CLI, but never followed on the Buf Schema Registry

#### \--error-format _string_

The format for build errors printed to stderr. Must be one of \[text,json,msvs,junit,github-actions\]

#### \--exclude-path _strings_

Exclude specific files or directories, e.g. "proto/a/a.proto", "proto/a" If specified multiple times, the union is taken

#### \--exit-code

Exit with a non-zero exit code if files were not already formatted

#### \-h, --help

help for format

#### \-o, --output _string_

The output location for the formatted files. Must be one of format \[dir,protofile\]. If omitted, the result is written to stdout

#### \--path _strings_

Limit to specific files or directories, e.g. "proto/a/a.proto", "proto/a" If specified multiple times, the union is taken

#### \-w, --write

Rewrite files in-place

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf](../) - The Buf CLI
