---
description: "Guide for using the Buf CLI with Bazel"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/cli/build-systems/bazel/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/cli/protoc-plugins/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/cli/build-systems/gradle/"
  - - meta
    - property: "og:title"
      content: "Bazel - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/cli/build-systems/bazel.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/cli/build-systems/bazel/"
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
      content: "Bazel - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/cli/build-systems/bazel.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Bazel

Buf provides official support for the [Bazel](https://bazel.build) build tool with [`rules_buf`](https://github.com/bufbuild/rules_buf), which enables you to:

- [Lint](../../../lint/overview/) Protobuf sources using the [`buf_lint_test`](#buf-lint-test) rule.
- Perform [breaking change detection](../../../breaking/overview/) for Protobuf [Inputs](../../../reference/inputs/) using the [`buf_breaking_test`](#buf-breaking-test) rule.
- Use the [Gazelle](#gazelle) extension to generate Bazel rules.

## Setup

To get started, add a series of imports to your Bazel `WORKSPACE`,

::: info WORKSPACE

```python
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "rules_buf",
    sha256 = "523a4e06f0746661e092d083757263a249fedca535bd6dd819a8c50de074731a",
    strip_prefix = "rules_buf-0.1.1",
    urls = [
        "https://github.com/bufbuild/rules_buf/archive/refs/tags/v0.1.1.zip",
    ],
)

load("@rules_buf//buf:repositories.bzl", "rules_buf_dependencies", "rules_buf_toolchains")

rules_buf_dependencies()

rules_buf_toolchains()

load("@rules_proto//proto:repositories.bzl", "rules_proto_dependencies", "rules_proto_toolchains")

rules_proto_dependencies()

rules_proto_toolchains()
```

:::

### Using a specific version of the `rules_proto`

[`rules_proto`](https://github.com/bazelbuild/rules_proto) is required to use `rules_buf`. By default, `rules_buf` automatically loads `rules_proto`, but you can use a specific version of it by loading it _before_ `rules_buf`:

::: info WORKSPACE

```python
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "rules_proto",
    sha256 = "66bfdf8782796239d3875d37e7de19b1d94301e8972b3cbd2446b332429b4df1",
    strip_prefix = "rules_proto-4.0.0",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_proto/archive/refs/tags/4.0.0.tar.gz",
        "https://github.com/bazelbuild/rules_proto/archive/refs/tags/4.0.0.tar.gz",
    ],
)

load("@rules_proto//proto:repositories.bzl", "rules_proto_dependencies", "rules_proto_toolchains")

rules_proto_dependencies()

rules_proto_toolchains()

http_archive(
    name = "rules_buf",
    sha256 = "523a4e06f0746661e092d083757263a249fedca535bd6dd819a8c50de074731a",
    strip_prefix = "rules_buf-0.1.1",
    urls = [
        "https://github.com/bufbuild/rules_buf/archive/refs/tags/v0.1.1.zip",
    ],
)

# Load the other rules_buf assets
```

:::

### Pinning the `buf` version

By default, `rules_buf_toolchains` loads the latest `buf` version. For hermetic builds, pin the `buf` version using the version attribute.

::: info WORKSPACE

```diff
# rules_buf fetches the sha based on the version number--the version is enough for hermetic builds.
-rules_buf_toolchains()
+rules_buf_toolchains(version = "v1.54.0")
```

:::

## Rules

The rules work alongside `proto_library` rules. You can configure `rules_buf` using a [`buf.yaml`](../../../configuration/v2/buf-yaml/) configuration file. Export the `buf.yaml` using `exports_files(["buf.yaml"])` to reference it.

> We recommend using the [Gazelle extension](#gazelle) to generate the following rules.

### `buf_dependencies`

`buf_dependencies` is a [repository rule](https://bazel.build/rules/repository_rules) that downloads one or more modules from the [Buf Schema Registry (BSR)](../../../bsr/) and generates build files using Gazelle. [Set up Gazelle](https://github.com/bazelbuild/bazel-gazelle#setup) to use this rule. To also use Gazelle to generate this rule and update `deps` in `proto_library` targets, see the [Dependencies](#gazelle-dependencies) section.

#### Attributes

| Name    | Description                                  | Type                                        | Mandatory | Default |
| :------ | :------------------------------------------- | :------------------------------------------ | :-------- | :------ |
| name    | A unique name for this repository.           | [Name](https://bazel.build/concepts/labels) | required  |         |
| modules | The module pins `remote/owner/repo:revision` | List of strings                             | required  |         |

#### Example

::: info WORKSPACE

```python
load("@rules_buf//buf:defs.bzl", "buf_dependencies")

buf_dependencies(
    name = "buf_deps",
    modules = [
        "buf.build/envoyproxy/protoc-gen-validate:dc09a417d27241f7b069feae2cd74a0e",
        "buf.build/acme/petapis:84a33a06f0954823a6f2a089fb1bb82e",
    ],
)
```

:::

::: info BUILD

```python
load("@rules_proto//proto:defs.bzl", "proto_library")

# imports "validate/validate.proto"
proto_library(
    name = "foo_proto",
    srcs = ["pet.proto"],
    deps = ["@buf_deps//validate:validate_proto"],
)
```

:::

We recommend using a single `buf_dependencies` rule for each `buf.yaml` file. The [Gazelle extension](#gazelle-dependencies) does this by default.

### `buf_lint_test`

`buf_lint_test` is a test rule that lints one or more `proto_library` targets.

Unused imports can't be detected due to the way the lint plugin captures warnings ([Issue #32](https://github.com/bufbuild/rules_buf/issues/32)).

#### Attributes

| Name      | Description                                                 | Type                                                             | Mandatory | Default                                                               |
| :-------- | :---------------------------------------------------------- | :--------------------------------------------------------------- | :-------- | :-------------------------------------------------------------------- |
| `name`    | A unique name for this target.                              | [Name](https://bazel.build/concepts/labels)                      | required  |                                                                       |
| `config`  | The [`buf.yaml`](../../../configuration/v2/buf-yaml/) file. | [Label](https://bazel.build/docs/build-ref.html#labels)          | optional  | Applies the [default](../../../configuration/v2/buf-yaml/) `buf.yaml` |
| `targets` | `proto_library` targets to lint                             | [List of labels](https://bazel.build/docs/build-ref.html#labels) | required  |                                                                       |

#### Example

```python
load("@rules_buf//buf:defs.bzl", "buf_lint_test")
load("@rules_proto//proto:defs.bzl", "proto_library")

proto_library(
    name = "foo_proto",
    srcs = ["pet.proto"],
    deps = ["@go_googleapis//google/type:datetime_proto"],
)

buf_lint_test(
    name = "foo_proto_lint",
    targets = [":foo_proto"],
    config = "buf.yaml",
)
```

This can be run as:

```sh
bazel test :foo_proto_lint
```

We recommend having a single `buf_lint_test` for each `proto_library` target. The [Gazelle extension](#gazelle) can generate them in the same pattern.

### `buf_breaking_test`

`buf_breaking_test` is a test rule that checks one or more `proto_library` targets for breaking changes. It requires an [image](../../../reference/images/) file to check against.

#### Attributes

| Name                   | Description                                                                                                                                           | Type                                                             | Mandatory | Default                                                               |
| :--------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------- | :-------- | :-------------------------------------------------------------------- |
| `name`                 | A unique name for this target.                                                                                                                        | [Name](https://bazel.build/concepts/labels)                      | required  |                                                                       |
| `against`              | The image file to check against.                                                                                                                      | [Label](https://bazel.build/docs/build-ref.html#labels)          | required  |                                                                       |
| `config`               | The `buf.yaml` file.                                                                                                                                  | [Label](https://bazel.build/docs/build-ref.html#labels)          | optional  | Applies the [default](../../../configuration/v2/buf-yaml/) `buf.yaml` |
| `exclude_imports`      | Exclude imports from breaking change detection.                                                                                                       | Boolean                                                          | optional  | `False`                                                               |
| `limit_to_input_files` | Only run breaking checks against the files in the targets. This has the effect of filtering the against image to only contain the files in the input. | Boolean                                                          | optional  | `True`                                                                |
| `targets`              | `proto_library` targets to check for breaking changes                                                                                                 | [List of labels](https://bazel.build/docs/build-ref.html#labels) | required  | `[]`                                                                  |

#### Example

```python
load("@rules_buf//buf:defs.bzl", "buf_breaking_test")
load("@rules_proto//proto:defs.bzl", "proto_library")

proto_library(
    name = "foo_proto",
    srcs = ["foo.proto"],
)

buf_breaking_test(
    name = "foo_proto_breaking",
    against = "//:image.binpb", # The Image file to check against.
    targets = [":foo_proto"], # The Protobuf library
    config = ":buf.yaml",
)
```

This can be run as:

```sh
bazel test :foo_proto_breaking
```

We recommend having a single `buf_breaking_test` for each `buf.yaml`.

Alternatively, a single `buf_breaking_test` can be used against each `proto_library` target. For this to work, `limit_to_input_files` attribute must be set to `True` as the `against` image file may contain other Protobuf files. Although this is closer to how Bazel operates, for this particular use case it isn't recommended. See the [module vs package mode example](#example-module-vs-package-mode) for a concrete example of the differences.

The [Gazelle extension](#gazelle) can generate `buf_breaking_test` in either levels of granularity.

#### Image inputs

You can generate a Buf [image](../../../reference/images/) file like this:

```sh
buf build --exclude-imports -o image.binpb <input>
```

The `<input>` is often a directory containing a `buf.yaml` file, but all of the other [Input formats](../../../reference/inputs/#format) are also supported.

We recommend storing the Image file in a `testdata` directory and checking it in to version control and updating it as needed. In the case of repositories that follow a versioning scheme like [semver](https://semver.org), you can update it on each new release either manually or with a post-release hook.

As an alternative to checking the Image file into version control, you can use CI artifacts. Many CI servers, like [Travis CI](https://travis-ci.com), enable you to upload build artifacts to a backend like [S3](https://aws.amazon.com/s3). In CI, you can set up a pipeline to build the Image on each commit and then add those artifacts to your `WORKSPACE`:

::: info WORKSPACE

```python
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_file")

# Assuming you're using s3 and bucket is at http://s3-us-east-1.amazonaws.com/bucket/foo/bar
# and COMMIT is a variable storing the commit to compare against
http_file(
    name = "buf_module",
    urls = ["http://s3-us-east-1.amazonaws.com/bucket/foo/bar/images/${COMMIT}/image.binpb"],
    sha256 = "...",
)
```

:::

This file can be referenced from `buf_breaking_test`. The commit and sha256 need to be updated as needed.

A single image file should be maintained for each `buf.yaml` file. This is true for both module and package level granularity of `buf_breaking_test`.

## Gazelle

[Gazelle](https://github.com/bazelbuild/bazel-gazelle) is a build file generator for Bazel projects that natively supports Protobuf. [`rules_buf`](https://github.com/bufbuild/rules_buf) includes a Gazelle extension for generating [`buf_breaking_test`](#buf-breaking-test) and [`buf_lint_test`](#buf-lint-test) rules out of [`buf.yaml`](../../../configuration/v2/buf-yaml/) configuration files.

### Setup

Start by [setting up](#rules-setup) `rules_buf`, then set up Gazelle using the [official instructions](https://github.com/bazelbuild/bazel-gazelle#setup). Once Gazelle is set up, add the following snippet at the end of the `WORKSPACE` file:

::: info WORKSPACE

```python
load("@rules_buf//gazelle/buf:repositories.bzl", "gazelle_buf_dependencies")

gazelle_buf_dependencies()
```

:::

Now modify the `BUILD` file with the `gazelle` target to include the `buf` extension:

::: info BUILD

```python
load("@bazel_gazelle//:def.bzl", "gazelle") # [!code --]
load("@bazel_gazelle//:def.bzl", "gazelle", "gazelle_binary") # [!code ++]

gazelle_binary( # [!code ++]
    name = "gazelle-buf", # [!code ++]
    languages = [ # [!code ++]
# [!code ++]
        # Loads the native proto extension
        "@bazel_gazelle//language/proto:go_default_library", # [!code ++]
# [!code ++]
        # Loads the Buf extension
        "@rules_buf//gazelle/buf:buf", # [!code ++]
# [!code ++]
        # NOTE: This needs to be loaded after the proto language
    ], # [!code ++]
) # [!code ++]

gazelle(
    name = "gazelle",
    gazelle = ":gazelle-buf", # [!code ++]
)
```

:::

Export the `buf.yaml` file by adding `exports_files(["buf.yaml"])` to the `BUILD` file.

> Inside Buf \[workspaces\]\[workspaces\], make sure to export each `buf.yaml` file.

Now run Gazelle:

```sh
bazel run //:gazelle
```

This takes care of updating your Protobuf build files — just run `//:gazelle` whenever Protobuf files are added/removed.

### Dependencies

Gazelle can also be used to generate `buf_dependencies` rules. It imports dependencies from `buf.lock` files.

Add the following code to the `BUILD` file,

::: info BUILD

```python
gazelle(
    name = "gazelle-update-repos",
    args = [
        # This can also be `buf.lock`.
        "--from_file=buf.yaml",
        # This is optional but recommended, if absent gazelle
        # will add the rules directly to WORKSPACE
        "-to_macro=buf_deps.bzl%buf_deps",
        # Deletes outdated repo rules
        "-prune",
    ],
    command = "update-repos",
    gazelle = ":gazelle-buf",
)
```

:::

Add the following line of code anywhere after `rules_buf_toolchains` in the `WORKSPACE` file:

::: info WORKSPACE

```python
load("@rules_buf//buf:defs.bzl", "buf_dependencies")
```

:::

Now run Gazelle `update-repos` command:

```sh
bazel run //:gazelle-update-repos
```

This creates the file `buf_deps.bzl` with the `buf_deps` macro that loads the `buf_dependencies` rules. It also calls the macro from the `WORKSPACE` file.

#### Arguments

| Argument                                                                                                                                          | Mandatory                                                                                                           | Default  |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------- |
| `-from_file file` <br> <br>Must be one of `buf.yaml` or `buf.lock`. When using `buf.yaml`, the rule imports from the associated `buf.lock` file.  | Required                                                                                                            |          |
| `-to_macro macroFile%defName` <br> <br>Tells Gazelle to write new repository rules into a `.bzl` macro function rather than the `WORKSPACE` file. | Optional                                                                                                            | ''       |
| `-prune true`                                                                                                                                     | False <br> <br>When true, Gazelle removes `buf_dependencies` rules that no longer have equivalent `buf.yaml` files. | Optional |

### Lint

By default, a `buf_lint_test` rule is generated for each of the `proto_library` rule generated by Gazelle. It picks up the `buf.yaml` that the Protobuf package belongs to.

Run this command to list the generated lint rules:

```sh
bazel query 'kind(buf_lint_test, //...)'
```

### Breaking change detection

To run [breaking change detection](../../../breaking/overview/) against Protobuf sources, you need to add a Gazelle [directive](https://github.com/bazelbuild/bazel-gazelle#directives) that points to an [Image](../../../reference/images/) target to generate breaking change detection rules. Gazelle directives are top-level comments in Bazel [`BUILD` files](https://docs.bazel.build/versions/main/build-ref.html#BUILD_files) that provide Gazelle with configuration.

See the [Image inputs](#image-input) section for instructions on maintaining image files themselves.

Add this Gazelle directive to the top of the `BUILD` file at the root of the [Buf Module](../../modules-workspaces/), which is the directory with a [`buf.yaml`](../../../configuration/v2/buf-yaml/) file.

::: info BUILD

```python
# gazelle:buf_breaking_against //:against_image_file
```

:::

You can generate `buf_breaking_test` in two different modes: [module mode](#module-mode) (preferred) and [package mode](#package-mode).

#### Module mode (preferred)

This is the default and preferred mode. `buf_breaking_test` is generated for each buf module. The rule references all the `proto_library` rules that are part of a buf module. This way the test can detect if any files are deleted.

Once the `buf_breaking_against` directive is added, run `gazelle`:

```sh
bazel run //:gazelle
```

Run this command to list the generated breaking rules:

```sh
bazel query 'kind(buf_breaking_test, //...)'
```

This mimics running `buf breaking` on a module. This is the most accurate way to check for breaking changes. However, depending on multiple targets at once is an anti-pattern in Bazel, so that's why we've provided package mode as an alternative.

#### Package mode

Package mode generates a `buf_breaking_test` rule for each of the `proto_library` rule, which lets you test only the `proto_library` that has changed.

Add this Gazelle directive to switch to package mode:

```python
# gazelle:buf_breaking_mode package
```

Now run Gazelle again:

```sh
bazel run //:gazelle
```

Running this command shows `buf_breaking_test` rules generated in multiple packages:

```sh
bazel query 'kind(buf_breaking_test, //...)'
```

#### Example: Module vs. Package mode

Let's consider a Buf [module](../../modules-workspaces/) with this directory structure:

```text
├── buf.yaml
├── BUILD
├── foo
│   └── v1
│       ├── foo.proto
│       └── BUILD
└── bar
    └── v1
        ├── bar.proto
        └── BUILD
```

##### Module mode

A single `buf_breaking_test` rule is generated in `BUILD`. If a breaking change occurs in either `foo.proto` or `bar.proto` this test detects it (even if `foo.proto` is deleted entirely).

Let's break down this scenario,

- A typical CI setup would be to use `bazel test //...` to run tests.
- When `foo.proto` is deleted, Gazelle needs to be run again to update the build files.
- This time when Gazelle runs, `buf_breaking_test` rule has one less target: `["bar/v1:bar_proto"]`.
- The CI runs `bazel test //...`.
- The `buf_breaking_test` detects the missing file and fail.

##### Package mode

`buf_breaking_test` rules are generated in both `foo/v1/BUILD` and `bar/v1/BUILD` against their respective `proto_library` targets. If a breaking change occurs in either `foo.proto` or `bar.proto` these tests detects it. However, if either `foo.proto` or `bar.proto` is deleted the tests fail to detect it.

Let's break down this scenario,

- A typical CI setup would be to use `bazel test //...` to run tests.
- When `foo.proto` is deleted, Gazelle needs to be run again to update the build files.
- This time when Gazelle runs, `foo/v1/BUILD` no longer contains a `buf_breaking_test` rule.
- The CI runs `bazel test //...`.
- This always passes as long as the test is removed along with the file.

## Examples

Check out some of the [sample workspaces](https://github.com/bufbuild/rules_buf/tree/main/examples) that demonstrate usage in various scenarios.
