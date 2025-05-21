---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/cli/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/cli/installation/"
  - - meta
    - property: "og:title"
      content: "Introduction - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/cli/index.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/cli/"
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
      content: "Introduction - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/cli/index.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Buf CLI

The Buf CLI is the ultimate tool for modern, fast, and efficient Protobuf API management. It makes crucial tasks like code generation, breaking change detection, and linting easy to configure, and integrates seamlessly with your existing workflows, so you can focus on what matters most: writing great APIs.

## Commands

The links below go to detailed usage guides. See the [Buf CLI reference](../reference/cli/buf/) for complete options and flags for each command.

- [`build`](../build/): Build Protobuf files into a Buf image (key to many other `buf` operations)
- [`generate`](../generate/): Generate code stubs from Protobuf files using `protoc` plugins
- [`breaking`](../breaking/): Verify no breaking changes have been made, to guard against compatibility issues
- [`lint`](../lint/) and [`format`](../format/): Lint and format your Protobuf files according to best practice and your org rules
- [`curl`](../curl/): Test your APIs by invoking an RPC endpoint, similar to using `curl`
- `convert`: Convert a message from binary to JSON or vice versa — useful when debugging or testing
- `config`, `registry`, `push`, and [`export`](../bsr/module/export/): Manage your repositories in the Buf Schema Registry

## Configuration files

The Buf CLI interacts with several configuration files, depending on the operation.

### `buf.yaml`

[`buf.yaml`](../configuration/v2/buf-yaml/) defines a workspace and the configurations for each [module](modules-workspaces/) within it. It's the primary configuration file, and defines each module's directory, name, `lint` and `breaking` configurations, and any files to exclude, along with the workspace's shared dependencies.

### `buf.lock`

[`buf.lock`](../configuration/v2/buf-lock/) contains the workspace's dependency manifest, and represents a single, reproducible build of its dependencies.

### `buf.gen.yaml`

[`buf.gen.yaml`](../configuration/v2/buf-gen-yaml/) defines the set of code generation plugins, their options, and the inputs used by the `buf generate` command to generate code from your Protobuf files. It also allows you to enable and configure [managed mode](../generate/managed-mode/).

## Default configuration

The default configuration location depends on the [input](../reference/inputs/). If the Buf CLI is executed with an input that contains a `buf.yaml` file, it's used for the given operation. Running `buf lint`, for example, uses the `lint` configuration for the workspace and (if specified) each module in the input's `buf.yaml`.

If the input doesn't contain a `buf.yaml` file, the Buf CLI operates as if there is a `buf.yaml` file with these default values:

::: info buf.yaml default configuration if missing

```yaml
version: v2
lint:
  use:
    - STANDARD
breaking:
  use:
    - FILE
# This is the default behavior if the modules key isn't specified.
# Deleting the modules section here has no effect.
modules:
  - path: .
```

:::
