---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/lint/quickstart/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/lint/overview/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/lint/rules/"
  - - meta
    - property: "og:title"
      content: "Tutorial - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/lint/quickstart.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/lint/quickstart/"
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
      content: "https://buf.build/docs/assets/images/social/lint/quickstart.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Linting quickstart

Buf offers linting for Protobuf files via the `buf lint` command in the Buf CLI. In this quickstart, you'll explore how to use linting to maintain code quality and consistency in your projects. Read the [overview](../overview/#key-concepts) to learn about editor integration and see usage examples.

## Prerequisites

> We recommend completing the [Buf CLI quickstart](../../cli/quickstart/) to get an overview of the Buf CLI first.

- Install the [Buf CLI](../../cli/installation/)
- Clone the `buf-examples` repo and go to this quickstart's directory:

  ```console
  $ git clone git@github.com:bufbuild/buf-examples.git && cd buf-examples/cli/linting/start
  ```

## Inspect the workspace

Your workspace has the directory structure shown below, and is defined by the `buf.yaml` file at the root. It's your [input](../../reference/inputs/) for the `buf lint` commands in the rest of the quickstart.

```text
.
├── proto
│   └── acme
│       └── weather
│           └── v1
│               └── weather.proto
└── buf.yaml
```

The example `buf.yaml` file contains all of its required fields. The `lint` field controls your lint settings. It's set to our recommended default of `STANDARD`, which includes every rule we feel is important for modern Protobuf development.

::: info proto/buf.yaml

```yaml{5,6,7}
version: v2
modules:
  - path: proto
    name: buf.build/tutorials/lint
lint:
  use:
    - STANDARD
breaking:
  use:
    - FILE
```

:::

For more information about specific fields, see the [`buf.yaml`](../../configuration/v2/buf-yaml/) reference.

## Run lint

Run `buf lint` on your workspace — it lints the `proto` directory since that's defined as the module path:

::: info cli/linting/start/

```console
$ buf lint

proto/acme/weather/v1/weather.proto:17:1:Files with package "weather" must be within a directory "weather" relative to root but were in directory "acme/weather/v1".
proto/acme/weather/v1/weather.proto:17:1:Package name "weather" should be suffixed with a correctly formed version, such as "weather.v1".
proto/acme/weather/v1/weather.proto:20:3:Enum value name "SUNNY" should be prefixed with "CONDITION_".
proto/acme/weather/v1/weather.proto:20:3:Enum zero value name "SUNNY" should be suffixed with "_UNSPECIFIED".
proto/acme/weather/v1/weather.proto:21:3:Enum value name "RAINY" should be prefixed with "CONDITION_".
proto/acme/weather/v1/weather.proto:35:19:RPC request type "Location" should be named "GetWeatherRequest" or "WeatherServiceGetWeatherRequest".
```

:::

## Fix lint errors

Now that you know what needs to be fixed, you can go through your `.proto` file and fix them. Let's start with the package name — it should match the directory structure under which the schema lives (relative to the module root), so change the package declaration:

::: info cli/linting/start/proto/acme/weather/v1/weather.proto

```diff
syntax = "proto3";

- package weather;
+ package acme.weather.v1;
```

:::

If you run `buf lint` again, the first two errors about the package no longer appear. You can work through the rest of the errors in a similar way — the messages provide specific suggestions to help you fix them.

::: tip Note
The changes the linter recommends are breaking changes for this package, which illustrates why it's best (if possible) to start linting when you first create your Protobuf files. It's not always possible, so we also provide a way to temporarily ignore rules when you first bring your `.proto` files into Buf — [see below](#step5).
:::

## Customize lint configuration

We recommend that you use the `STANDARD` category for linting — it represents what we consider to be best practice for Protobuf development. However, if your organization's style has other requirements, you can choose a different category or add and remove individual rules from your configuration.For example, if your org agrees with `STANDARD` rules but doesn't want to check for a suffix on service names, you can selectively ignore that rule in the configuration like this:

::: info cli/linting/start/buf.yaml

```yaml{5,6}
version: v2
lint:
  use:
    - STANDARD
  except:
    - SERVICE_SUFFIX
```

:::

You can also add individual rules to the more minimal categories if they better match your style. For example, to add only the `SERVICE_SUFFIX` rule to the `BASIC` category, you can use this configuration:

::: info cli/linting/start/buf.yaml

```yaml{3,4,5}
version: v2
lint:
  use:
    - BASIC
    - SERVICE_SUFFIX
```

:::

## Temporarily ignore lint errors

There may be times when you want to ignore errors temporarily, such as adding `buf lint` to an existing project where fixing lint errors might introduce breaking changes. We've provided a flag to make it simple to ignore them in this case. Once you've fixed everything you want to fix, run this command to get a set of lint settings that ignore the rules that still trigger errors:

::: info cli/linting/start

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

Copy and paste the `ignore_only` section into `buf.yaml`, prefixing each file so that its path is in reference to `buf.yaml` (in this case, by adding the module path, `proto/`):

::: info buf.yaml

```yaml{5,7,9}
version: v2
lint:
  ignore_only:
    ENUM_VALUE_PREFIX:
      - proto/acme/weather/v1/weather.proto
    ENUM_ZERO_VALUE_SUFFIX:
      - proto/acme/weather/v1/weather.proto
    RPC_REQUEST_STANDARD_NAME:
      - proto/acme/weather/v1/weather.proto
```

:::
