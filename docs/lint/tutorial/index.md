# Linting – Tutorial

Buf offers linting for Protobuf files via the `buf lint` command in the Buf CLI. In this tutorial, we'll explore how to use linting to maintain code quality and consistency in your projects. Read the [overview](../overview/#key-concepts) to learn about editor integration and see usage examples.

## Prerequisites

> We recommend completing the [Buf CLI quickstart](../../cli/quickstart/) to get an overview of the Buf CLI first.

- Install the [Buf CLI](../../cli/installation/)
- Clone the `buf-tour` repo:

  ```console
  $ git clone git@github.com:bufbuild/buf-tour.git
  ```

## Inspect the workspace

Modules represent a collection of files that are configured, built, and versioned as a logical unit when performing Buf operations. Workspaces are collections of modules and are configured by the `buf.yaml` configuration file, which should usually be put above the directories that contain the modules within it. The example code provides a workspace and module to work with, so start there. From the directory you cloned into, go to the tutorial code:

```console
$ cd buf-tour/start/tutorial-lint
```

Your module has the directory structure shown below, and is defined by the `buf.yaml` file at the root. This workspace is your [input](../../reference/inputs/) for the `buf lint` commands in the rest of the tutorial.

```text
tutorial-lint
├── buf.yaml
└── proto
    └── acme
        └── weather
            └── v1
                └── weather.proto
```

The example `buf.yaml` file contains all of its required fields. The `lint` field controls your lint settings. It's set to our recommended default of `STANDARD`, which includes every rule we feel is important for modern Protobuf development.

::: info proto/buf.yaml

```yaml
version: v2
modules:
  - path: proto
    name: buf.build/tutorials/lint
lint:
  use:
    - STANDARD
breaking: // [!code highlight]
  use: // [!code highlight]
    - FILE // [!code highlight]
```

:::

For more information about specific fields, see the [`buf.yaml`](../../configuration/v2/buf-yaml/) reference.

## Run lint

Run `buf lint` on your workspace—it lints the `proto` directory since that's defined as the module path:

::: info ~/.../buf-tour/start/tutorial-lint/

```console
$ buf lint

proto/acme/weather/v1/weather.proto:3:1:Files with package "weather" must be within a directory "weather" relative to root but were in directory "proto/acme/weather/v1".
proto/acme/weather/v1/weather.proto:3:1:Package name "weather" should be suffixed with a correctly formed version, such as "weather.v1".
proto/acme/weather/v1/weather.proto:6:3:Enum value name "SUNNY" should be prefixed with "CONDITION_".
proto/acme/weather/v1/weather.proto:6:3:Enum zero value name "SUNNY" should be suffixed with "_UNSPECIFIED".
proto/acme/weather/v1/weather.proto:7:3:Enum value name "RAINY" should be prefixed with "CONDITION_".
proto/acme/weather/v1/weather.proto:21:19:RPC request type "Location" should be named "GetWeatherRequest" or "WeatherServiceGetWeatherRequest".
```

:::

## Fix lint errors

Now that you know what needs to be fixed, you can go through your `.proto` files and fix them. Let's start with the package name—it should match the directory structure under which the schema lives (relative to the module root), so change the package declaration:

::: info ~/.../buf-tour/start/tutorial-lint/proto/acme/weather/v1/weather.proto

```protobuf
syntax = "proto3";

- package weather; // [!code highlight]
+ package acme.weather.v1; // [!code highlight]
```

:::

If you run `buf lint` again, the first two errors about the package no longer appear. You can work through the rest of the errors in a similar way—the messages provide specific suggestions to help you fix them.

::: tip NoteThe changes the linter recommends are breaking changes for this package, which illustrates why it's best (if possible) to start linting when you first create your Protobuf files.However, it's not always possible, so we also provide a way to temporarily ignore rules when you first bring your `.proto` files into Buf—see [step 5](#step5) below.

:::

## Customize lint configuration

We recommend that you use the `STANDARD` category for linting—it represents what we consider to be best practice for Protobuf development. However, if your organization's style has other requirements, you can choose a different category or add and remove individual rules from your configuration.For example, if your org agrees with `STANDARD` rules but doesn't want to check for a suffix on service names, you can selectively ignore that rule in the configuration like this:

::: info buf.yaml

```yaml
version: v2
lint:
  use:
    - STANDARD
  except: // [!code highlight]
    - SERVICE_SUFFIX // [!code highlight]
```

:::

You can also add individual rules to the more minimal categories if they better match your style. For example, to add only the `SERVICE_SUFFIX` rule to the `BASIC` category, you can use this configuration:

::: info buf.yaml

```yaml
version: v2
lint:
  use: // [!code highlight]
    - BASIC // [!code highlight]
    - SERVICE_SUFFIX // [!code highlight]
```

:::

## Temporarily ignore lint errors

There may be times when you want to ignore errors temporarily, such as adding `buf lint` to an existing project where fixing lint errors might introduce breaking changes. We've provided a flag to make it simple to ignore them in this case. Once you've fixed everything you want to fix, run this command to get a set of lint settings that you can copy and paste into your `buf.yaml` file to ignore the remaining errors:

::: info ~/.../buf-tour/start/tutorial-lint

```console
$ buf lint --error-format=config-ignore-yaml

version: v2
lint:
  ignore_only:
    ENUM_VALUE_PREFIX:
      - acme/weather/v1/weather.proto
    ENUM_ZERO_VALUE_SUFFIX:
      - acme/weather/v1/weather.proto
    RPC_REQUEST_STANDARD_NAME:
      - acme/weather/v1/weather.proto
```

:::

## Related docs

- Get detailed explanations of the lint [rules and categories](../rules/)
- Browse the [buf.yaml configuration file reference](../../configuration/v2/buf-yaml/#lint) and [`buf lint` command reference](../../reference/cli/buf/lint/)
- See more about the types of [inputs](../../reference/inputs/) that the Buf CLI accepts
