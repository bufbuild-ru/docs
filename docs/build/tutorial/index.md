---
description: "Quickstart showing how to build Buf images"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/build/tutorial/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/build/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/cli/editor-integration/"
  - - meta
    - property: "og:title"
      content: "Quickstart - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/build/tutorial.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/build/tutorial/"
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
      content: "Quickstart - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/build/tutorial.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Build Buf images quickstart

This quickstart takes you through building a Buf [image](../../reference/images/) from your Protobuf files and introspecting the contents of an image.

## Prerequisites

> We recommend completing the [Buf CLI quickstart](../../cli/quickstart/) to get an overview first.

- Install the [Buf CLI](../../cli/installation/)
- Have a directory of `.proto` files

## Define a workspace

To create a workspace and define the modules within it, add a [`buf.yaml`](../../configuration/v2/buf-yaml/) file to the directory that contains your directories of `.proto` files. You can create the default `buf.yaml` file by running this command:

```sh
buf config init
```

::: info Default buf.yaml

```yaml
version: v2
breaking:
  use:
    - FILE
lint:
  use:
    - STANDARD
```

:::

Add a declaration for each directory you want to treat as a [module](../../cli/modules-workspaces/). The value should be relative to the workspace root. For example, if you have a directory of `.proto` files named `foo`, your configuration should look like this:

::: info Adding a module

```yaml{2,3}
version: v2
modules:
  - path: foo
breaking:
  use:
    - FILE
lint:
  use:
    - STANDARD
```

:::

## Build an image

To build the modules in your workspace, go to its root directory and run this command:

```sh
buf build
```

If there are errors, they're printed out in a `file:line:column:message` format by default. For example:

```sh
buf build

acme/pet/v1/pet.proto:5:8:acme/payment/v1alpha1/payment.proto: doesn't exist
```

Error output can also be printed as JSON:

```sh
buf build --error-format=json

{"path":"acme/pet/v1/pet.proto","start_line":5,"start_column":8,"end_line":5,"end_column":8,"type":"COMPILE","message":"acme/payment/v1alpha1/payment.proto: doesn't exist"}
```

## Change the output format

By default, `buf build` outputs its result to `/dev/null`. In this case, it's common to use `buf build` as a validation step, analogous to checking if the input compiles.

`buf build` also supports outputting a [`FileDescriptorSet`](https://github.com/protocolbuffers/protobuf/blob/main/src/google/protobuf/descriptor.proto) or an [image](../../reference/images/), which is Buf's custom extension of the `FileDescriptorSet`. Better yet, these outputs can be formatted in a variety of ways.

`buf build` can deduce the output format by the file extension:

```sh
buf build -o image.binpb
buf build -o image.binpb.gz
buf build -o image.binpb.zst
buf build -o image.json
buf build -o image.json.gz
buf build -o image.json.zst
buf build -o image.txtpb
buf build -o image.txtpb.gz
buf build -o image.txtpb.zst
```

The special value `-` is used to denote stdout, and you can manually set the format:

```sh
buf build -o -#format=json
```

See the [Inputs](../../reference/inputs/#automatically-derived-formats) page for more information about automatically derived formats.
