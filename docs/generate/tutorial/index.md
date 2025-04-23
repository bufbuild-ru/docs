# Code generation – Tutorial

The Buf CLI's `buf generate` command generates code from your Protobuf files. It uses a `buf.gen.yaml` configuration file to configure input, plugin, and output options, and is a direct replacement for code generation in `protoc`. It can accept many [input types](../../reference/inputs/)—for this tutorial, you'll use a single-module [workspace](../../cli/modules-workspaces/).The tutorial takes you through various ways to set up your generation, from fully local to managed mode.

## Prerequisites

We recommend completing the [Buf CLI quickstart](../../cli/quickstart/#generate-code) to get an overview of the Buf CLI first.This tutorial assumes you already have [Protocol Buffers](https://protobuf.dev/downloads/) installed.

- Install the [Buf CLI](../../cli/installation/)
- Install the `protoc-gen-go` plugin, or have the corresponding `protoc` plugin for your output language of choice installed and in your `$PATH`. The code examples use the Go plugin.

  ```console
  $ go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.31.0
  $ export PATH="$PATH:$(go env GOPATH)/bin"
  ```

## Define a module

Modules represent a collection of files that are configured, built, and versioned as a logical unit when performing Buf operations. Workspaces are collections of modules and are configured by the `buf.yaml` configuration file, which should usually be put above the directories that contain the modules within it.For example, a `buf-codegeneration-tutorial` workspace with a single module would be structured like this (this workspace is the example throughout):

```text
buf-codegeneration-tutorial
├── buf.yaml
└── proto
    └── acme
        └── weather
            └── v1
                └── weather.proto
```

Create a basic boilerplate `buf.yaml` file with all of the required elements by running `buf config init` in your workspace root:

```console
$ mkdir buf-codegeneration-tutorial
$ cd buf-codegeneration-tutorial
$ buf config init
```

The command generates a minimal configuration file to define your module:

::: info Default buf.yaml config file

```yaml
# For details on buf.yaml configuration, visit https://bufbuild.ru/docs/configuration/v2/buf-yaml
version: v2
lint:
  use:
    - STANDARD
breaking:
  use:
    - FILE
```

:::

Next, add the `module` paths for the Protobuf file directories within the workspace (one per module):

::: info buf.yaml

```diff
# For details on buf.yaml configuration, visit https://bufbuild.ru/docs/configuration/v2/buf-yaml
version: v2
+modules:
+  - path: proto
lint:
  use:
    - STANDARD
breaking:
  use:
    - FILE
```

:::

This new module is your input for the `buf generate` commands in the rest of the tutorial.

::: tip NoteFor more information about the specific fields, see the [`buf.yaml`](../../configuration/v2/buf-yaml/) reference.

:::

## Add Protobuf files to your module

Add a `weather.proto` file within the module's path:

::: info Create a weather.proto file

```console
$ mkdir -p proto/acme/weather/v1
$ touch proto/acme/weather/v1/weather.proto
```

:::

Copy and paste this content into that file:

::: info proto/acme/weather/v1/weather.proto

```proto
syntax = "proto3";

package acme.weather.v1;

option go_package = "acme/weather/v1";

enum Condition {
  CONDITION_UNSPECIFIED = 0;
  CONDITION_SUNNY = 1;
  CONDITION_RAINY = 2;
}

message GetWeatherRequest {
  float latitude = 1;
  float longitude = 2;
}

message GetWeatherResponse {
  float temperature = 1;
  Condition condition = 2;
}

service WeatherService {
  rpc GetWeather (GetWeatherRequest) returns (GetWeatherResponse);
}
```

:::

## Configure your `buf.gen.yaml` file

To generate code with the Buf CLI, you use a `buf.gen.yaml` configuration file to specify the languages you want to output, the plugins you want to use, and so on. This file replaces the various command-line flags that are required by `protoc`.Create a new `buf.gen.yaml` file in the workspace root, and copy/paste the following code into it.

```text
buf-codegeneration-tutorial
├── buf.gen.yaml
├── buf.yaml
└── proto
    └── acme
        └── weather
            └── v1
                └── weather.proto
```

::: info buf.gen.yaml

```yaml
version: v2
clean: true
plugins:
  - local: protoc-gen-go
    out: gen/go
    opt: paths=source_relative
inputs:
  - directory: proto
```

:::

The file defines which plugins to use to generate code, where to output it, what the inputs are. It uses `clean` to state that we'd like to delete all previously generated code each time we run `buf generate`. For more information about the available fields, see the [`buf.gen.yaml` reference](../../configuration/v2/buf-gen-yaml/).

::: tip Note`buf generate` can take many types of input beyond a local directory. See the [inputs reference](../../reference/inputs/) for details about how to specify other types of input to Buf CLI commands.

:::

## Generate code using local plugins

Now that your configuration is set up, all you need to do is run the command:

::: info Run from workspace root

```console
$ buf generate
```

:::

You should see a new `gen` directory appear in your tree, containing the generated client code. The file structure under the `gen` directory corresponds to the structure of your Protobuf files:

```text
buf-codegeneration-tutorial
├── buf.gen.yaml
├── buf.yaml
├── gen
│   └── go
│       └── acme
│           └── weather
│               └── v1
│                   └── weather.pb.go
└── proto
    └── acme
        └── weather
            └── v1
                └── weather.proto
```

## Generate code using remote plugins

Now you'll regenerate the code, this time using the same plugin hosted on the Buf Schema Registry (BSR).First, remove the `gen` directory.

::: info Run from workspace root

```console
$ rm -rf gen
```

:::

Then modify your `buf.gen.yaml` file to point the `plugins` keys to the remote plugin. Note that you can specify the version (and revision number, if one exists).

::: info buf.gen.yaml

```diff
version: v2
plugins:
- - local: protoc-gen-go
+ - remote: buf.build/protocolbuffers/go:v1.31.0
    out: gen/go
    opt: paths=source_relative
```

:::

Regenerate the code:

::: info Run from workspace root

```console
$ buf generate
```

:::

The `gen` directory reappears with the same structure and files as before. You've now removed the necessity for locally installed `protoc` plugins for this set of `.proto` files.

::: tip NoteSee the [remote plugins overview](../../bsr/remote-plugins/overview/) for more information about the advantages of remote plugins and where to find them.

:::

## Generate code using managed mode

Managed mode is Buf's way of clearly separating API producer concerns from consumer concerns, and reducing toil and error across organizations:

- Producers are free to publish clean API definitions without including Protobuf options like language-specific package and class prefixes in their `.proto` files.
- Consumers can enable managed mode with two lines of code and generate code with thoughtful default settings for these options, while still having the flexibility to override them if needed. There's no need to remember or share text files of arcane invocation flags.

Because your project may not include these Protobuf options, we'll use the files below to demonstrate the concept. Given the requirement that the `go_package` file option needs to be prepended with `github.com/acme/weather/gen/go`, add the corresponding managed mode settings to your `buf.gen.yaml`:

::: info buf.gen.yaml with managed mode settings for go_package

```diff
version: v2
clean: true
+managed:
+  enabled: true
+  override:
+    - file_option: go_package_prefix
+      value: github.com/acme/weather/gen/go
plugins:
  - remote: buf.build/protocolbuffers/go:v1.31.0
    out: gen/go
-   opt: paths=source_relative
inputs:
  - directory: proto
```

:::

Now, when you run `buf generate`, the compiler applies the [managed mode defaults](../managed-mode/#default-behavior) and the specified `go_package_prefix` on the fly, creating a temporary `.proto` file to generate code that includes the options you would have had to hard-code into each of your `.proto` files:

::: info Temporary (i.e., managed-mode generated) acme/weather/v1/weather.proto

```protobuf
syntax = "proto3";

package acme.weather.v1;

option go_package = "github.com/acme/weather/gen/go/acme/weather/v1"

// Messages, enums, services, etc.
```

:::

This generates Go code in the specified structure:

```text
buf-codegeneration-tutorial
├── buf.gen.yaml
├── buf.yaml
├── gen
│   └── go
│       └── github.com
│           └── acme
│               └── weather
│                   └── gen
│                       └── go
│                           └── acme
│                               └── weather
│                                   └── v1
│                                       └── weather.pb.go
└── proto
    └── acme
        └── weather
            └── v1
                └── weather.proto
```

::: tip NoteFor more information about managed mode's defaults, usage, and fields, see [Managed mode](../managed-mode/) and the [buf.gen.yaml reference](../../configuration/v2/buf-gen-yaml/).

:::

## Related docs

- See detailed usage examples in the [overview](../overview/#command-line-input-examples)
- Learn how to find and consume [remote plugins](../../bsr/remote-plugins/overview/)
- Browse the [`buf generate` command reference](../../reference/cli/buf/generate/)
