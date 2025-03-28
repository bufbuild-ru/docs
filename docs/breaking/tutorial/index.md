# Breaking change detection – Tutorial

As you evolve your Protobuf schemas, you might introduce breaking changes—either by breaking your generated code, or by breaking your ability to read existing data. Protobuf has many ways to evolve schemas without breaking existing code, but sometimes it's a better choice to make a breaking change rather than go to the extra effort of backwards compatibility. If you have few clients and can easily update and deploy them, it may be perfectly okay to break your schemas. Buf's breaking change detection reliably and mechanically identifies breaking changes so you and your team can focus on the important human decision of whether to allow them or not.This tutorial takes you through running breaking change detection locally using common use cases. Read the [overview](../overview/#key-concepts) to learn about editor integration, policy checks, and the review flow.

## Prerequisites

> We recommend completing the [Buf CLI quickstart](../../cli/quickstart/) to get an overview of the Buf CLI first.

- Install the [Buf CLI](../../cli/installation/)
- Clone the `buf-tour` repo:

  ```console
  $ git clone git@github.com:bufbuild/buf-tour.git
  ```

## Inspect the workspace

[Modules](../../concepts/modules-workspaces/) represent a collection of files that are configured, built, and versioned as a logical unit when performing Buf CLI operations. Workspaces are collections of modules and are configured by the `buf.yaml` configuration file, which should usually be put above the directories that contain the modules within it. The example code provides a workspace and module to work with, so start there. From the directory you cloned into, go to the tutorial code:

```console
$ cd buf-tour/start/tutorial-breaking
```

Your workspace has the directory structure shown below, and is defined by the `buf.yaml` file at its root. The module described by `buf.yaml` is your [input](../../reference/inputs/) for the `buf breaking` commands in the rest of the tutorial.

```text
tutorial-breaking
├── buf.yaml
└── proto
    └── pet
        └── v1
            └── pet.proto
```

The example `buf.yaml` file contains all of its required fields. The `breaking` field controls your breaking change detection settings. It's set to our recommended default of `FILE`, which provides the highest level of protection against breaking changes.

::: info ~/.../buf-tour/start/tutorial-breaking/buf.yaml

```yaml
version: v2
modules:
  - path: proto
    name: buf.build/tutorials/breaking
lint:
  use:
    - STANDARD
breaking: // [!code highlight]
  use: // [!code highlight]
    - FILE // [!code highlight]
```

:::

::: tip NoteFor more information about specific fields, see the [`buf.yaml`](../../configuration/v2/buf-yaml/) reference.

:::

## Compare against a local Git repository

The example code is a Git repository, so you can check whether your uncommitted changes break the schemas. First, make a non-breaking change to your schema and add a new type of pet to the enum:

::: info ~/.../buf-tour/start/tutorial-breaking/proto/pet/v1/pet.proto

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

::: info ~/.../buf-tour/start/tutorial-breaking

```console
$ buf breaking --against '../../.git#subdir=start/tutorial-breaking/proto'
```

:::

::: tip NoteNote that in the `--against` target, you need to point to the root of your Git repository, then traverse back down to the directory you're comparing against using the `subdir` option.

:::

## Compare against the Buf Schema Registry (BSR)

For organizations that use the BSR, comparing against the version of the module stored there is the most common use case. The example module you're working with exists in the BSR already at https://buf.build/tutorials/breaking, and if you look in the `buf.yaml` file for your module, the `name` field points there.

::: info ~/.../buf-tour/start/tutorial-breaking/proto/buf.yaml

```yaml
version: v2
modules:
  - path: proto
    name: buf.build/tutorials/breaking // [!code highlight]
lint:
  use:
    - STANDARD
breaking:
  use:
    - FILE
```

:::

This time, make a breaking change to the schema by changing the fourth item in the enum.

::: info ~/.../buf-tour/start/tutorial-breaking/proto/pet/v1/pet.proto

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

Run `buf breaking` again, this time comparing against the latest version of the tutorial module in the BSR. You should receive an error.

::: info ~/.../buf-tour/start/tutorial-breaking

```console
$ buf breaking --against buf.build/tutorials/breaking

proto/pet/v1/pet.proto:11:21:Enum value "4" on enum "PetType" changed name from "PET_TYPE_HAMSTER" to "PET_TYPE_RODENT".
```

:::

Revert the change.

## Compare against a remote Git repository

If your `.proto` files aren't in the BSR yet, usually you'd compare against your remote Git repository instead, since that represents the latest version of your code. That's a straightforward change to the `--against` target, so we'll also explore what happens when you change the configuration to a different [rule set](../rules/)—from `FILE` to `PACKAGE`. `PACKAGE` allows elements to move within a package, unlike `FILE`, which is stricter.First, move the `PetType` enum to a new `pet_type.proto` file.

::: info ~/.../buf-tour/start/tutorial-breaking

```console
$ touch proto/pet/v1/pet_type.proto
```

:::

Delete the enum from `pet.proto`, and add an `import` statement to reference the new `.proto` file:

::: info ~/.../buf-tour/start/tutorial-breaking/proto/pet/v1/pet.proto

```diff
+ import "pet/v1/pet_type.proto";
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

::: info ~/.../buf-tour/start/tutorial-breaking/proto/pet/v1/pet_type.proto

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

::: info ~/.../buf-tour/start/tutorial-breaking

```console
$ buf breaking --against 'https://github.com/bufbuild/buf-tour.git#branch=main,subdir=start/tutorial-breaking/proto'
proto/pet/v1/pet.proto:1:1:Previously present enum "PetType" was deleted from file.
```

:::

Let's assume that moving an enum within the same package isn't considered a breaking change in your organization. For `buf breaking` to align to this policy, it needs to be set to the `PACKAGE` rule set instead of `FILE`. Make that change in your `buf.yaml` file:

::: info ~/.../buf-tour/start/tutorial-breaking/proto/buf.yaml

```diff
version: v2
modules:
  - path: proto
    name: buf.build/tutorials/breaking
breaking:
  use:
+   - PACKAGE
-   - FILE
lint:
  use:
    - STANDARD
```

:::

Run the same `buf breaking` command, and you should no longer get the error.These scenarios represent the most common use cases for using `buf breaking` locally. If your organization also has instance-wide breaking change detection, you may see different results when running locally versus when you push a module to the BSR. See the [breaking change policy check](../../bsr/policy-checks/breaking/overview/#local-settings) documentation for the details.

## Related docs

- Get detailed explanations of the breaking change [rules and categories](../rules/)
- Browse the [buf.yaml configuration file reference](../../configuration/v2/buf-yaml/#breaking) and [`buf breaking` command reference](../../reference/cli/buf/breaking/)
- See more about the types of [inputs](../../reference/inputs/) that the Buf CLI accepts
