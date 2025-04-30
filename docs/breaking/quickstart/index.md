---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/breaking/quickstart/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/breaking/overview/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/breaking/rules/"
  - - meta
    - property: "og:title"
      content: "Tutorial - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/breaking/quickstart.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/breaking/quickstart/"
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
      content: "Tutorial - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/breaking/quickstart.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Breaking change detection quickstart

As you evolve your Protobuf schemas, you might introduce breaking changes—either by breaking your generated code, or by breaking your ability to read existing data. Protobuf has many ways to evolve schemas without breaking existing code, but sometimes it's a better choice to make a breaking change rather than go to the extra effort of backwards compatibility. If you have few clients and can easily update and deploy them, it may be perfectly okay to break your schemas. Buf's breaking change detection reliably and mechanically identifies breaking changes so you and your team can focus on the important human decision of whether to allow them or not.This quickstart takes you through running breaking change detection locally using common use cases. Read the [overview](../overview/#key-concepts) to learn about editor integration, policy checks, and the review flow.

## Prerequisites

> We recommend completing the [Buf CLI quickstart](../../cli/quickstart/) to get an overview of the Buf CLI first.

- Install the [Buf CLI](../../cli/installation/)
- Clone the `buf-examples` repo and go to this quickstart's directory:

  ```console
  $ git clone git@github.com:bufbuild/buf-examples.git &&
      cd buf-examples/cli/breaking-change-detection/start
  ```

The quickstart contains a `start` directory, where you work on the example files, and a `finish` directory that you can use to compare against.

## Inspect the workspace

[Modules](../../cli/modules-workspaces/) represent a collection of files that are configured, built, and versioned as a logical unit when performing Buf CLI operations. Workspaces are collections of modules and are configured by the `buf.yaml` configuration file, which should usually be put above the directories that contain the modules within it.Your workspace has the directory structure shown below, and is defined by the `buf.yaml` file at its root. The module described by `buf.yaml` is your [input](../../reference/inputs/) for the `buf breaking` commands in the rest of the quickstart.

::: info cli/breaking-change-detection/start/

```text
.

├── buf.yaml
└── proto
    └── pet
        └── v1
            └── pet.proto
```

:::

The example `buf.yaml` file contains all of its required fields. The `breaking` field controls your breaking change detection settings. It's set to our recommended default of `FILE`, which provides the highest level of protection against breaking changes.

::: info cli/breaking-change-detection/start/buf.yaml

```yaml{8,9,10}
version: v2
modules:
  - path: proto
    name: buf.build/tutorials/breaking
lint:
  use:
    - STANDARD
breaking:
  use:
    - FILE
```

:::

For more information about specific fields, see the [`buf.yaml`](../../configuration/v2/buf-yaml/) reference.

## Compare against a local Git repository

The example code is a Git repository, so you can check whether your uncommitted changes break the schemas. First, make a non-breaking change to your schema and add a new type of pet to the enum:

::: info cli/breaking-change-detection/start/proto/pet/v1/pet.proto

```diff
// PetType represents the different types of pets in the pet store.
enum PetType {
  PET_TYPE_UNSPECIFIED = 0;
  PET_TYPE_CAT = 1;
  PET_TYPE_DOG = 2;
  PET_TYPE_SNAKE = 3;
  PET_TYPE_HAMSTER = 4;
+ PET_TYPE_BIRD = 5;
}
```

:::

Then run `buf breaking` to compare the workspace to the one in the original repo you downloaded. You should see no errors.

::: info cli/breaking-change-detection/start/

```console
$ buf breaking --against '../../../.git#subdir=cli/breaking-change-detection/start/proto'
```

:::

::: tip Note that in the `--against` target, you need to point to the root of your Git repository, then traverse back down to the directory you're comparing against using the `subdir` option.

:::

## Compare against the Buf Schema Registry (BSR)

For organizations that use the BSR, comparing against the version of the module stored there is the most common use case. The example module you're working with exists in the BSR already at [https://buf.build/tutorials/breaking](https://buf.build/tutorials/breaking), and if you look in the `buf.yaml` file for your module, the `name` field points there.

::: info cli/breaking-change-detection/start/proto/buf.yaml

```yaml{4}
version: v2
modules:
  - path: proto
    name: buf.build/tutorials/breaking
lint:
  use:
    - STANDARD
breaking:
  use:
    - FILE
```

:::

This time, make a breaking change to the schema by changing the fourth item in the enum.

::: info cli/breaking-change-detection/start/proto/pet/v1/pet.proto

```diff
// PetType represents the different types of pets in the pet store.
enum PetType {
  PET_TYPE_UNSPECIFIED = 0;
  PET_TYPE_CAT = 1;
  PET_TYPE_DOG = 2;
  PET_TYPE_SNAKE = 3;
- PET_TYPE_HAMSTER = 4;
+ PET_TYPE_RODENT = 4;
  PET_TYPE_BIRD = 5;
}
```

:::

Run `buf breaking` again, this time comparing against the latest version of the quickstart module in the BSR. You should receive an error.

::: info cli/breaking-change-detection/start/

```console
$ buf breaking --against buf.build/tutorials/breaking

proto/pet/v1/pet.proto:11:21:Enum value "4" on enum "PetType" changed name from "PET_TYPE_HAMSTER" to "PET_TYPE_RODENT".
```

:::

Revert the change.

## Compare against a remote Git repository

If your `.proto` files aren't in the BSR yet, usually you'd compare against your remote Git repository instead, since that represents the latest version of your code. That's a straightforward change to the `--against` target, so we'll also explore what happens when you change the configuration to a different [rule set](../rules/)—from `FILE` to `PACKAGE`. `PACKAGE` allows elements to move within a package, unlike `FILE`, which is stricter.First, move the `PetType` enum to a new `pet_type.proto` file.

::: info cli/breaking-change-detection/start/

```console
$ touch proto/pet/v1/pet_type.proto
```

:::

Delete the enum from `pet.proto`, and add an `import` statement to reference the new `.proto` file:

::: info cli/breaking-change-detection/start/proto/pet/v1/pet.proto

```diff
+import "pet/v1/pet_type.proto";
- // PetType represents the different types of pets in the pet store.
- enum PetType {
-   PET_TYPE_UNSPECIFIED = 0;
-   PET_TYPE_CAT = 1;
-   PET_TYPE_DOG = 2;
-   PET_TYPE_SNAKE = 3;
-   PET_TYPE_RODENT = 4;
-   PET_TYPE_BIRD = 5;
- }
```

:::

Then copy/paste the following into `pet_type.proto` (note that the package is still `pet.v1`):

::: info cli/breaking-change-detection/start/proto/pet/v1/pet_type.proto

```protobuf
syntax = "proto3";

package pet.v1;

// PetType represents the different types of pets in the pet store.
enum PetType {
  PET_TYPE_UNSPECIFIED = 0;
  PET_TYPE_CAT = 1;
  PET_TYPE_DOG = 2;
  PET_TYPE_SNAKE = 3;
  PET_TYPE_HAMSTER = 4;
}
```

:::

Run `buf breaking` again, this time comparing against the latest version of the remote Git repository. You should get an error showing that the enum was deleted.

::: info cli/breaking-change-detection/start/

```console
$ buf breaking --against 'https://github.com/bufbuild/buf-examples.git#branch=main,subdir=cli/breaking-change-detection/start/proto'
proto/pet/v1/pet.proto:1:1:Previously present enum "PetType" was deleted from file.
```

:::

Let's assume that moving an enum within the same package isn't considered a breaking change in your organization. For `buf breaking` to align to this policy, it needs to be set to the `PACKAGE` rule set instead of `FILE`. Make that change in your `buf.yaml` file:

::: info cli/breaking-change-detection/start/proto/buf.yaml

```yaml
version: v2
modules:
  - path: proto
    name: buf.build/tutorials/breaking
lint:
  use:
    - STANDARD
breaking:
  use:
  // [!code ++]
  - PACKAGE
  // [!code --]
  - FILE
```

:::

Run the same `buf breaking` command, and you should no longer get the error.These scenarios represent the most common use cases for using `buf breaking` locally. If your organization also has instance-wide breaking change detection, you may see different results when running locally versus when you push a module to the BSR. See the [breaking change policy check](../../bsr/policy-checks/breaking/overview/#local-settings) documentation for the details.

## Related docs

- Get detailed explanations of the breaking change [rules and categories](../rules/)
- Browse the [buf.yaml configuration file reference](../../configuration/v2/buf-yaml/#breaking) and [`buf breaking` command reference](../../reference/cli/buf/breaking/)
- See more about the types of [inputs](../../reference/inputs/) that the Buf CLI accepts
