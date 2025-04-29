---
layout: home

title: "Bazel rules"
description: "Use buf with Bazel."

head:
  - - meta
    - property: "og:title"
      content: "Bazel rules"
  - - meta
    - property: "og:description"
      content: "Use buf with Bazel."
  - - meta
    - property: "og:image"
      content: ""
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Bazel rules"
  - - meta
    - property: "twitter:description"
      content: "Use buf with Bazel."
  - - meta
    - property: "twitter:image"
      content: ""
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

hero:
  name: "Bazel rules"
  tagline: "June 20, 2022"
---

Today we're excited to release Bazel rules for `buf`, [rules_buf](https://github.com/bufbuild/rules_buf).

[Bazel](https://bazel.build/) is a scalable multi-language build tool for large projects that focuses on reproducibility and speed. This resonates strongly at Buf where we help teams develop robust, language agnostic, scalable APIs.

The rules work alongside the `proto_library` rule of [rules_proto](https://github.com/bazelbuild/rules_proto).

## Managing dependencies

The `buf_dependencies` [repository rule](https://bazel.build/docs/external) helps manage `Protobuf` dependencies using the [Buf Schema Registry (BSR)](/docs/bsr/index.md). Here's a small example that demonstrates using the rule to gather dependencies into a target called `buf_deps`.

```protobuf
WORKSPACE

load("@rules_buf//buf:defs.bzl", "buf_dependencies")

buf_dependencies(
    name = "buf_deps",
    modules = [
        "buf.build/envoyproxy/protoc-gen-validate:dc09a417d27241f7b069feae2cd74a0e",
        "buf.build/acme/petapis:84a33a06f0954823a6f2a089fb1bb82e",
    ],
)
```

This can now be used as part of the `deps` attribute in the `proto_library` rule like this,

```protobuf
BUILD

load("@rules_proto//proto:defs.bzl", "proto_library")

proto_library(
    name = "foo_proto",
    srcs = [
        "pet.proto" # imports "validate/validate.proto"
    ],
    deps = [
        "@buf_deps//validate:validate_proto"
    ],
)
```

You can read more about this in the [docs](/docs/cli/build-systems/bazel/index.md#buf-dependencies).

## Lint and Breaking Checks

[`buf lint`](/docs/lint/overview/index.md) and [`buf breaking`](/docs/breaking/overview/index.md) are widely used to ensure quality standards of `Protobuf` APIs are met. Now, you can use them within Bazel. Here's an example,

**Breaking rule**

```protobuf
BUILD

load("@rules_buf//buf:defs.bzl", "buf_breaking_test")

exports_files(["buf.yaml"])

buf_breaking_test(
    name = "foo_proto_breaking",
    against = "//:image.bin", # The Image file to check against.
    targets = ["//foo/v1:foo_proto"], # The Protobuf library targets to check
    config = ":buf.yaml",
)
```

Running `bazel test --test_output=errors //:foo_proto_breaking` will print the errors,

```protobuf
...
Executing tests from //:foo_proto_breaking
-----------------------------------------------------------------------------
--buf-plugin_out: foo/v1/foo.proto:1:1:Field "3" with name "Bar" on message "Foo" changed option "json_name" from "bar" to "Bar".
foo/v1/foo.proto:1:1:Field "3" on message "Foo" changed name from "bar" to "Bar".
```

**Lint rule**

```protobuf
foo/v1/BUILD

load("@rules_buf//buf:defs.bzl", "buf_lint_test")
load("@rules_proto//proto:defs.bzl", "proto_library")

proto_library(
    name = "foo_proto",
    srcs = ["foo.proto"],
)

buf_lint_test(
    name = "foo_proto_lint",
    targets = [":foo_proto"],
    config = "//:buf.yaml",
)
```

Running `bazel test --test_output=errors //foo/v1:foo_proto_lint` will print the errors,

```protobuf
...
Executing tests from //foo/v1:foo_proto_lint
-----------------------------------------------------------------------------
--buf-plugin_out: foo/v1/foo.proto:1:1:Field name "Bar" should be lower_snake_case, such as "bar".
```

For more on these rules check out the docs for [buf_lint_test](/docs/cli/build-systems/bazel/index.md#buf-lint-test) and [buf_breaking_test](/docs/cli/build-systems/bazel/index.md#buf-breaking-test)

## Generate rules

At Buf we are strong believers of automation and hence we couldn't resist developing a [Gazelle](https://github.com/bazelbuild/bazel-gazelle) extension. The extension can be used to generate all of above rules! It understands both `buf.work.yaml` and `buf.yaml` configuration files.

Check out the [Gazelle section](/docs/cli/build-systems/bazel/index.md#gazelle) of the docs for setup and usage instructions.

## Next steps

Get started by [setting up](/docs/cli/build-systems/bazel/index.md) `rules_buf` or check out the [examples](https://github.com/bufbuild/rules_buf/tree/main/examples) illustrating various scenarios.

‍
