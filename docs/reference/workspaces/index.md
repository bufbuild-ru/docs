---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/workspaces/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/configuration/v1/buf-work-yaml/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/configuration/v1beta1/buf-yaml/"
  - - meta
    - property: "og:title"
      content: "v1 workspace configuration - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/workspaces.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/workspaces/"
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
      content: "v1 workspace configuration - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/workspaces.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# v1 workspace configuration

WarningThis document describes the way workspaces are configured using `v1` configuration files. We recommend migrating to `v2` configuration files for a more intuitive way of working with multiple modules and sharing dependencies. See the [blog post](/blog/buf-cli-next-generation/index.md) and [migration guide](../../migration-guides/migrate-v2-config-files/) for information and instructions.

Workspaces are collections of modules that enable you to iterate on modules and manage cross-module dependencies without having to commit to the Buf Schema Registry (BSR). They also allow you to more easily do `buf` operations like breaking change detection and linting across related modules.When iterating on related modules without workspaces, you can get into a dependency loop where you have to push modules that are dependencies to the BSR, and then update the local dependencies of the modules that rely on them. This is both frustrating and prone to error.With workspaces, you define all of the related modules in a simple configuration file, and they can locally vendor each other as you iterate without involving the BSR. And for all local `buf` operations, the workspace is treated as the [input](../inputs/) without the need to specify each module.If you're familiar with `protoc`, a workspace is similar to specifying multiple include `-I` paths, but with the added consistency of defining dependencies in version-controlled config files.

## Configuration

A workspace requires at least one [module](../../cli/modules-workspaces/), which is defined by a `buf.yaml` file. The workspace config file, `buf.work.yaml`, is generally one level above the module directories, often at the root of a VCS. Below is a complete example of a workspace that includes a Pets API and a Payments API, where the Pets API is importing the Payments API. It contains a `buf.work.yaml` configuration file and a `buf.yaml` configuration file, and shows our recommended directory structure.The [`buf.work.yaml`](../../configuration/v1/buf-work-yaml/) file lists the directories of the modules it includes, and the `buf.yaml` files define the dependencies between modules.

```text
.
├── buf.work.yaml
├── paymentapis
│   ├── acme
│   │   └── payment
│   │       └── v2
│   │           └── payment.proto
│   └── buf.yaml
└── petapis
    ├── acme
    │   └── pet
    │       └── v1
    │           └── pet.proto
    └── buf.yaml
```

::: info buf.work.yaml

```yaml
version: v1
directories:
  - paymentapis
  - petapis
```

:::

::: info petapis/buf.yaml

```yaml{3,4}
version: v1
name: buf.build/acme/petapis
deps:
  - buf.build/acme/paymentapis
```

:::

::: tip You don't need to add modules to the `deps` field to use them locally within a workspace, but you will need to do so when you're ready to [push your modules](#pushing-modules) to the BSR.

:::

See the [`buf.work.yaml` config file reference](../../configuration/v1/buf-work-yaml/) for more information about its fields.

### Additional requirements

The Buf CLI imposes two additional requirements on your `.proto` file structure for compilation to succeed, both of which are essential to successful modern Protobuf development across a number of languages.**1\. Workspace modules must not overlap. A workspace module can't be a sub-directory of another workspace module.**This, for example, **isn't** a valid configuration:

::: info buf.work.yaml

```yaml
version: v1 # THIS IS INVALID AND RESULTS IN A PRE-COMPILATION ERROR
  directories:
    - foo
    - foo/bar
```

:::

Following this rule ensures that imports are consistent across all your `.proto` files. Without it, in the above example a file `foo/bar/bar.proto` could be imported as either `bar/bar.proto` or `bar.proto`. Having inconsistent imports leads to a number of major issues across the Protobuf plugin ecosystem, so we don't allow it.**2\. All `.proto` file paths must be unique relative to each workspace module.**Consider this configuration:

::: info buf.work.yaml

```yaml
version: v1
directories:
  - foo
  - bar
```

:::

Given the above configuration, it's invalid to have these two files:

- `foo/baz/baz.proto`
- `bar/baz/baz.proto`

because it results in two files having the path `baz/baz.proto`. If you add the following file to the mix, the issue becomes apparent:

::: info bar/baz/bat.proto

```protobuf
// THIS IS DEMONSTRATING SOMETHING BAD
syntax = "proto3";

package bar.baz;

import "baz/baz.proto";
```

:::

Which file is being imported, `foo/baz/baz.proto` or `bar/baz/baz.proto`? With `protoc` the answer depends on the order of the `-I` flags. The Buf CLI errors out pre-compilation instead, alerting you to the issue. Though the above example is relatively contrived, vendoring `.proto` files is a common practice that can cause this situation.

## Importing across modules

In a workspace, **imports are resolved relative to each module's root**, or the placement of the `buf.yaml` file. For the example directory structure shown [above](#configuration), `paymentapis/acme/payment/v2/payment.proto` is included in the workspace as `acme/payment/v2/payment.proto` and the `petapis/acme/pet/v1/pet.proto` file imports it like this:

::: info petapis/acme/pet/v1/pet.proto

```protobuf{1}
import "acme/payment/v2/payment.proto";

message PurchasePetRequest {
  string pet_id = 1;
  acme.payment.v2.Order order = 2;
}
```

:::

## Multiple-module operations

If the [input](../inputs/) for a `buf` command is a directory containing a `buf.work.yaml` file, the command acts upon all of the modules defined in the `buf.work.yaml`.For example, suppose that we update both the `paymentapis` and `petapis` directories with some `lint` failures, such as using a camel case field name. We can easily lint all of the modules defined in a `buf.work.yaml` with a single command:

```console
$ ls
---
buf.work.yaml  paymentapis  petapis
```

```console
$ buf lint
---
paymentapis/acme/payment/v2/payment.proto:29:10:Field name "recipientID" should be lower_snake_case, such as "recipient_id".
petapis/acme/pet/v1/pet.proto:51:27:Field name "orderV2" should be lower_snake_case, such as "order_v2".
```

::: tip When using `buf breaking` in workspace mode, the two [inputs](../inputs/) you're comparing must contain the same number of modules. Otherwise, the Buf CLI can't reliably verify compatibility between the workspaces.

:::

## Interaction with module cache

As mentioned above, workspaces enable you to work on multiple modules in parallel, such as introducing a new Protobuf message in one module and depending on it in another.Without a workspace, the Buf CLI relies on the module's [`buf.lock`](../../configuration/v1/buf-lock/) manifest to read its dependencies from the local [module cache](../../cli/modules-workspaces/#module-cache). This requires that you push changes that create new dependencies to the BSR and run `buf dep update` in the module that requires them before they can be used.With a workspace, the module cache is only used for dependencies **not defined in the workspace**. For all directories listed in the `buf.work.yaml` file, the workspace overrides the module cache and allows you to use the new changes without pushing and updating.

::: tip Modules that are dependencies **must be named** (have a value for the `name` field in their buf.yaml file) for the workspace to override the module cache. If the `name` either doesn't match the importing module's dependency or doesn't exist, the Buf CLI uses the module cache instead.

:::

## Pushing modules from workspaces

It's important to note that **workspaces only apply to local operations**. Though you don't need to define modules in the `deps` section of the `buf.yaml` file to use them locally, you do need to do so before pushing modules to the BSR.

::: info petapis/buf.yaml

```yaml{3,4}
version: v1
name: buf.build/acme/petapis
deps:
  - buf.build/acme/paymentapis
```

:::

A current limitation of workspaces is that each module needs to be pushed to the BSR independently in dependency order, starting with the leaf modules. As you push each module, run the `buf dep update` command in the next downstream module to update its dependencies, and continue to push each of your modules until all of your local changes are published to the BSR.
