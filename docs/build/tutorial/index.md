# Build Buf images – Tutorial

This tutorial takes you through building a Buf [image](../../reference/images/) from your Protobuf files and introspecting the contents of an image.

## Prerequisites

> We recommend completing the [Buf CLI quickstart](../../cli/quickstart/) to get an overview first.

- Install the [Buf CLI](../../cli/installation/)
- Have a directory of `.proto` files

## Define a workspace

To create a workspace and define the modules within it, add a [`buf.yaml`](../../configuration/v2/buf-yaml/) file to the directory that contains your directories of `.proto` files. You can create the default `buf.yaml` file by running this command:

```console
$ buf config init
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

Add a declaration for each directory you want to treat as a [module](../../concepts/modules-workspaces/). The value should be relative to the workspace root. For example, if you have a directory of `.proto` files named `foo`, your configuration should look like this:

::: info Adding a module

```yaml
version: v2
modules: // [!code highlight]
  - path: foo // [!code highlight]
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

```console
$ buf build
```

If there are errors, they're printed out in a `file:line:column:message` format by default. For example:

```console
$ buf build

acme/pet/v1/pet.proto:5:8:acme/payment/v1alpha1/payment.proto: doesn't exist
```

Error output can also be printed as JSON:

```console
$ buf build --error-format=json

{"path":"acme/pet/v1/pet.proto","start_line":5,"start_column":8,"end_line":5,"end_column":8,"type":"COMPILE","message":"acme/payment/v1alpha1/payment.proto: doesn't exist"}
```

## Change the output format

By default, `buf build` outputs its result to `/dev/null`. In this case, it's common to use `buf build` as a validation step, analogous to checking if the input compiles.`buf build` also supports outputting a [`FileDescriptorSet`](https://github.com/protocolbuffers/protobuf/blob/main/src/google/protobuf/descriptor.proto) or an [image](../../reference/images/), which is Buf's custom extension of the `FileDescriptorSet`. Better yet, these outputs can be formatted in a variety of ways.`buf build` can deduce the output format by the file extension:

```console
$ buf build -o image.binpb
$ buf build -o image.binpb.gz
$ buf build -o image.binpb.zst
$ buf build -o image.json
$ buf build -o image.json.gz
$ buf build -o image.json.zst
$ buf build -o image.txtpb
$ buf build -o image.txtpb.gz
$ buf build -o image.txtpb.zst
```

The special value `-` is used to denote stdout, and you can manually set the format:

```console
$ buf build -o -#format=json
```

See the [Inputs](../../reference/inputs/#automatically-derived-formats) page for more information about automatically derived formats.

## Related docs

- Read the [overview](../overview/)
- Browse the [`buf build` command reference](../../reference/cli/buf/build/)
