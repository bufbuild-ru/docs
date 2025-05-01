---
sidebar: false
prev: false
next: false

title: "Introducing buf format"
description: "Rewrite Protobuf files in-place with 'buf format'."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/introducing-buf-format"
  - - meta
    - property: "og:title"
      content: "Introducing buf format"
  - - meta
    - property: "og:description"
      content: "Rewrite Protobuf files in-place with 'buf format'."
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Introducing buf format"
  - - meta
    - property: "twitter:description"
      content: "Rewrite Protobuf files in-place with 'buf format'."
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Introducing buf format

Today we're excited to announce the release of `buf format` as part of version [1.3.1](https://github.com/bufbuild/buf/releases/tag/v1.3.1) of the `buf` CLI. This feature enables you to format your Protobuf files in accordance with what we at Buf take to be the industry standards.

The `buf format` command performs the same function as formatters in other languages, such as `prettier` for Javascript, `gofmt` for Go, and `rustfmt` for Rust. Those tools have been essential to standardizing the way each of those languages are written, and we're excited to do the same for Protobuf by providing the simplest, most complete Protobuf formatter yet.

To see it in action, take this very poorly formatted `.proto` file:

```protobuf
syntax =
    "proto3";

package

           users.v1;

message User {

// A unique ID for the user.
 string user_id =

    1;
              // The user's email.
string      email = 2; }
```

Here's what the `buf format` command produces:

```protobuf
syntax = "proto3";

package users.v1;

message User {
  // A unique ID for the user.
  string user_id = 1;
  // The user's email.
  string email = 2;
}
```

Hopefully you won't need the formatter to make improvements that are quite _that_ drastic, but it shows the formatter can clean up any syntactically valid Protobuf, no matter how mangled.

## Usage

When you run `buf format` on its own, the `buf` CLI outputs the properly formatted version of the specific Protobuf input to stdout. Like other buf commands, if an input is not explicitly specified the current directory (`.`) is used by default.

```protobuf
$ buf format
syntax = "proto3";

package simple.v1;

message Object {
  string key = 1;
  bytes value = 2;
}
```

In addition to local Protobuf file inputs, you can run `buf format` against inputs like directories, individual files, tarballs, Git repositories, and Buf modules hosted on the Buf Schema Registry (BSR). This command, for example, formats an individual file:

```protobuf
$ buf format ./proto/simple/v1/simple.proto
```

Display a diff between the original and formatted content with `--diff`. For example,

```protobuf
$ buf format --diff
diff -u proto/simple/v1/simple.proto.orig proto/simple/v1/simple.proto
--- proto/simple/v1/simple.proto.orig    ...
+++ proto/simple/v1/simple.proto         ...
@@ -2,8 +2,7 @@

 package simple.v1;

-
 message Object {
-    string key = 1;
-   bytes value = 2;
+  string key = 1;
+  bytes value = 2;
 }
```

But the bread and butter use case is formatting Protobuf files _in-place_ (`-w` is short for `--write`):

```protobuf
$ buf format -w
```

Copy to clipboard

You can also use the `--exit-code` flag to exit with a non-zero exit code if there is a diff:

**`$`**`  buf format --exit-code    `**`$`**`  buf format --diff --exit-code    `**`$`**`  buf format -w --exit-code    `

In combination, you can rewrite a single file in-place and write the diff to stdout with the following command:

```protobuf
$ buf format --diff -w --exit-code ./proto/simple/v1/simple.proto
```

## Zero configuration

The `buf format` command has no configuration options. There's only one way to format `.proto` files, so that every `.proto` file looks and feels the same way. Stop wasting time and energy on deciding how `.proto` files ought to be formatted - `buf` decides for you so you don't have to.

## IDE integration

We're actively working on integrations in Vim, VSCode, and IntelliJ - keep an eye out for those releases.

## The importance of the formatter

Our mission at Buf is to push API development out of the REST/JSON paradigm and into a schema-driven paradigm based on Protocol Buffers. A crucial part of that mission is making Protobuf consistent wherever it's written, and `buf format` gets us one step closer.

We believe that `buf format` will reduce the cognitive load of working with Protobuf sources in several ways. People reading Protobuf sources should never be puzzled by what they encounter, while people developing Protobuf sources shouldn't have to worry about trivialities like import sorting and indentation. Fewer choices and fewer surprises is the name of the game, and we're happy to offer this to the Protobuf community.

‍
