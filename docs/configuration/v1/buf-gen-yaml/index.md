# buf.gen.yaml v1 config file

::: tip NoteThis file now has a `v2` configuration available. See the [v2 `buf.gen.yaml` reference](../../v2/buf-gen-yaml/) and the [v1 to v2 migration guide](../../../migration-guides/migrate-v2-config-files/) for details about the new configuration and migration instructions.

:::

`buf.gen.yaml` is a configuration file used by the `buf generate` command to generate integration code for the languages of your choice. This file is most often used with a [module](../../../concepts/modules-workspaces/) (but can be used with other [input](../../../reference/inputs/) types), and is typically placed next to your [`buf.work.yaml`](../buf-work-yaml/) file at the root of your Protobuf files:

```text
.
├── buf.gen.yaml
├── buf.work.yaml
├── proto
│   └── location
│           └── location.proto
│   └── weather
│           └── weather.proto
├── buf.lock
└── buf.yaml
```

## `version`

**Required.** Defines the current configuration version. Accepted values are `v1beta1` and `v1`.

## `plugins`

**Required.** Each entry in the `plugins` key is a `protoc` plugin configuration. Plugins are invoked in parallel and their outputs are written in the order you specify here.

### `plugin`

**Required.** The name of the plugin to use—can be local or remote.

- **Local plugins:** If using a `protoc` plugin, the `protoc-gen-` prefix is assumed and you should omit it (for example, `go` instead of `protoc-gen-go`). By default, the Buf CLI expects a `protoc-gen-<name>` program to be on your `PATH` so that it can be discovered and executed. This can be overridden with the `path` field below.
- **Remote plugins:** Specify the path to the plugin on the Buf Schema Registry (BSR).
  - For all public BSR plugins, this takes the form: `buf.build/<owner-org>/<plugin-name>:<plugin-version>`
  - For custom plugins, this takes the form: `<bsr-server>/<owner-org>/<plugin-name>:<plugin-version>`
  - `<plugin-version>` is optional. If it isn't present, the latest version is used. If it's specified, the `revision` field can be specified to pin an exact version.

    - The plugin version is specified by the upstream project.
    - The revision is a sequence number that Buf increments when rebuilding or repackaging the plugin.

    ::: tip Note

    ```text
      If you don't specify a plugin version, the latest version is pulled in. To avoid unexpected updates
      and possible breaking changes, pin to a specific version.
    ```

    :::

### `out`

**Required.** Controls where the generated files are deposited for a given plugin. Although absolute paths are supported, this configuration is typically a relative output directory to where `buf generate` is run.

### `opt`

**Optional.** Specifies one or more plugin options for each plugin independently. You can provide options as either a single string or a list of strings.

### `path`

**Optional.** Only works with local plugins. Overrides the default location and explicitly specifies where to locate the plugin. For example, if a custom plugin called `protoc-gen-foo` isn't located on your `PATH`, but is found at `bin/proto/protoc-gen-foo`, you can refer to it like this:

```yaml
path: bin/proto/protoc-gen-foo
```

The path can include some arguments. If it has more than one element, the first should be the plugin binary and the others are optional arguments to pass to the binary. For example, you can run the version of `protoc-gen-go` that matches the `google.golang.org/protobuf` specified by `go.mod` by:

```yaml
path: ["go", "run", "google.golang.org/protobuf/cmd/protoc-gen-go"]
```

### `revision`

**Optional.** May be used along with the `plugin` field to pin an exact version of a remote plugin. In most cases, we recommend omitting `revision`, in which case the latest revision of that version of the plugin is used (automatically pulling in the latest bug fixes). Example:

```yaml
- plugin: buf.build/protocolbuffers/go:v1.28.1
  revision: 1
```

### `strategy`

**Optional.** Specifies the invocation strategy to use. There are two options:

- `directory` **(default for local plugins):** This results in `buf` splitting the input files by directory and making separate plugin invocations in parallel, roughly the concurrent equivalent of this operation:

  ```console
  $ for dir in $(find . -name '*.proto' -print0 | xargs -0 -n1 dirname | sort | uniq); do protoc -I . $(find "${dir}" -name '*.proto'); done
  ```

  Almost every `protoc` plugin requires this, so it's the recommended setting for local generation.

- `all`: This results in `buf generate` making a single plugin invocation with all input files, which is roughly equivalent to this:

  ```console
  $ protoc -I . $(find . -name '*.proto')
  ```

  This option is needed for certain plugins that expect all files to be given at once. The BSR also sets the value to `all` for remote plugin generation to improve performance.

### `protoc_path`

**Optional.** Only applies to the code generators that are _built in_ to `protoc`. Normally, a plugin is a separate executable with a binary name like `protoc-gen-<name>`. But for a handful of plugins, the executable used is `protoc` itself. The following plugins result in invoking `protoc` instead of a dedicated plugin binary:

- `cpp`
- `csharp`
- `java`
- `js` (before v21)
- `kotlin` (after v3.17)
- `objc`
- `php`
- `pyi`
- `python`
- `ruby`

Normally for the above plugins, the Buf CLI executes the `protoc` binary that's found in your `$PATH`, but this configuration option lets you point to a specific binary. It's particularly useful if you need to support a specific version of `protoc`, which could differ from the version in `$PATH`. For example:

```yaml
protoc_path: /path/to/specific/version/bin/protoc
```

It can also be used to supply additional arguments to `protoc`, by setting this value to an array of strings, where the first array element is the path. For example:

```yaml
protoc_path:
  - /path/to/specific/version/bin/protoc
  - --experimental_editions
```

## `managed`

The `managed` key is used to configure managed mode, an advanced feature for Protobuf options (see [Managed mode](../../../generate/managed-mode/) for more details).

::: info Managed mode example—buf.gen.yaml

```yaml
version: v1
managed:
  enabled: true
  optimize_for: CODE_SIZE
  go_package_prefix:
    default: github.com/acme/weather/private/gen/proto/go
    except:
      - buf.build/googleapis/googleapis
    override:
      buf.build/acme/weather: github.com/acme/weather/gen/proto/go
  override:
    JAVA_PACKAGE:
      acme/weather/v1/weather.proto: "org"
```

:::

The definitions below refer to the following two sample `.proto` files.

::: info proto/location/location.proto

```protobuf
syntax = "proto3";

package ac_me.location;

message Location {
  float latitude = 1;
  float longitude = 2;
}
```

:::

::: info proto/weather/weather.proto

```protobuf
syntax = "proto3";

package ac_me.weather;

import "location/location.proto";

message CurrentWeatherRequest {
  location.Location location = 1;
}

message CurrentWeatherResponse {
  float temperature = 1;
  string detail = 2;
}

service WeatherVisionService {
  rpc CurrentWeather(CurrentWeatherRequest) returns (CurrentWeatherResponse);
}
```

:::

### `enabled`

**Required** if _any_ other `managed` keys are set. Setting `enabled` equal to `true` with no other keys set enables managed mode according to [default behavior](../../../generate/managed-mode/#default-behavior).

### `cc_enable_arenas`

**Optional**. If unset, this option is left as specified in your `.proto` files. As of [Protocol Buffers release v3.14.0](https://github.com/protocolbuffers/protobuf/releases/tag/v3.14.0), changing this value no longer has any effect.

### `csharp_namespace`

**Optional**. Controls the [default C# namespace](https://github.com/protocolbuffers/protobuf/blob/v24.2/src/google/protobuf/descriptor.proto#L468) for classes generated from all of the `.proto` files contained within the input. Managed mode generates C# files with a top-level `namespace` based on each `.proto` file’s package, with each part transformed to PascalCase. The default can't be set differently, but can be overridden or excepted for specific `.proto` files.For example, `weather.proto` defines its package as `package ac_me.weather;`, which in the generated C# code becomes `namespace AcMe.Weather`. See the [default behavior](../../../generate/managed-mode/#default-behavior) section for details.This namespace doesn't affect the directory structure of the generated file.

#### `except`

**Optional.** Removes the specified modules from the default `csharp_namespace` option behavior. The `except` keys **must** be valid [module names](../../../concepts/modules-workspaces/).

#### `override`

**Optional.** Overrides the `csharp_namespace` value used for specific modules. The `override` keys **must** be valid [module names](../../../concepts/modules-workspaces/).

### `go_package_prefix`

**Optional.** Controls what the [`go_package`](https://github.com/protocolbuffers/protobuf/blob/v24.2/src/google/protobuf/descriptor.proto#L436) value is set to for all of the `.proto` files contained within the input. If unset, this option is left as specified in your `.proto` files.

#### `default`

**Required** if the `go_package_prefix` key is set. The `default` value is used as a prefix for the `go_package` value set in each of the files. It **must** be a relative file path that **must not** jump context from the current directory—it must be subdirectories relative to the current working directory. As an example, `../external` is invalid. In the [configuration example](#managed), the `github.com/acme/weather/gen/proto/go` prefix is _joined_ with the given Protobuf file's relative path from the module root. The `acme/weather/v1/weather.proto` file then has this `go_package` set:

::: info acme/weather/v1/weather.proto

```protobuf
syntax = "proto3";
package acme.weather.v1;
option go_package = "github.com/acme/weather/gen/proto/go/acme/weather/v1;weatherv1";`
```

:::

If the Protobuf file's package declaration conforms to the [`PACKAGE_VERSION_SUFFIX`](../../../lint/rules/#package_version_suffix) lint rule, the final two path elements are concatenated and included after the `;` element in the `go_package` result. The above example generates a Go package with a package declaration equal to `weatherv1`, which enables you to import Go definitions from a variety of generated packages that otherwise collide (a lot of Protobuf packages contain the `v1` suffix).

#### `except`

**Optional.** Removes certain modules from the `go_package` option behavior. The `except` values **must** be valid [module names](../../../concepts/modules-workspaces/). There are situations where you may want to enable managed mode for the `go_package` option in _most_ of your Protobuf files, but not necessarily for _all_ of your Protobuf files. This is particularly relevant for the `buf.build/googleapis/googleapis` module, which points its `go_package` value to an [external repository](https://github.com/googleapis/go-genproto). Popular libraries such as [grpc-go](https://github.com/grpc/grpc-go) depend on these `go_package` values, so it's important that managed mode does not overwrite them.

#### `override`

**Optional.** Overrides the `go_package` file option value used for specific modules. The `override` keys **must** be valid module names. Additionally, the corresponding `override` values **must** be a valid [Go import path](https://golang.org/ref/spec#ImportPath) and **must not** jump context from the current directory. As an example, `../external` is invalid. This setting is used for [workspace](../../../reference/workspaces/) environments, where you have a module that imports from another module in the same workspace, and you need to generate the Go code for each module in different directories. This is particularly relevant for repositories that decouple their private API definitions from their public API definitions.

### `java_multiple_files`

**Optional.** Controls what the [`java_multiple_files`](https://github.com/protocolbuffers/protobuf/blob/v24.2/src/google/protobuf/descriptor.proto#L409) value is set to for all of the `.proto` files contained within the input. The only accepted values are `false` and `true`. Managed mode defaults to `true` (Protobuf's default is `false`).

- When set to `true`, managed mode generates one or more Java files for each top level message or enum, but not services. These types won't be nested inside the wrapper class defined by [`java_outer_classname`](#java_outer_classname). For example:
  - `CurrentWeatherRequest.java`
  - `CurrentWeatherRequestOrBuilder.java`
  - `CurrentWeatherResponse.java`
  - `CurrentWeatherResponseOrBuilder.java`
  - `WeatherProto.java`
- When set to `false`, only `Weather.java` is generated for `weather.proto`.

### `java_outer_classname`

::: tip NoteThis option can't be specified. It can only be overridden using the [per-file override](#per-file-override).

:::

When managed mode is enabled, [`java_outer_classname`](https://github.com/protocolbuffers/protobuf/blob/v24.2/src/google/protobuf/descriptor.proto#L401) is set to the PascalCase-equivalent of the file's name, removing the `.`from the`.proto`extension. This converts the `weather.proto` filename, for example, to `WeatherProto`.

::: info buf.gen.yaml override example

```yaml
version: v1
managed:
  enabled: true
  override:
    JAVA_OUTER_CLASSNAME:
      acme/weather/v1/weather.proto: "WeatherProtov1"
```

:::

### `java_package_prefix`

**Optional.** Controls what's prepended to the [`java_package`](https://github.com/protocolbuffers/protobuf/blob/v24.2/src/google/protobuf/descriptor.proto#L394) value is set to for all of the `.proto` files contained within the input. If this is unset, managed mode's default value is `com`.

#### `default`

**Required** if the `java_package_prefix` key is set. The `default` value is used as a prefix for the `java_package` value set in each of the files.

#### `except`

**Optional.** Removes the specified modules from the `java_package` option behavior. The `except` keys **must** be valid [module names](../../../concepts/modules-workspaces/).

#### `override`

**Optional.** Overrides the `java_package` option value used for specific modules. The `override` keys **must** be valid module names.

### `java_string_check_utf8`

**Optional.** Controls what the [`java_string_check_utf8`](https://github.com/protocolbuffers/protobuf/blob/v24.2/src/google/protobuf/descriptor.proto#L420) value is set to for all of the `.proto` files contained within the input. The only accepted values are `false` and `true`. If unset, this option is left as specified in your `.proto` files. Protobuf's default is `false`.

### `objc_class_prefix`

**Optional.** When managed mode is enabled, this defaults to an abbreviation of the package name as described in the [default behavior](../../../generate/managed-mode/#default-behavior) section. The value is prepended to all generated classes.

#### `default`

**Optional**. Overrides managed mode's default value for the class prefix.

#### `except`

**Optional.** Removes the specified modules from the `objc_class_prefix` option behavior. The `except` keys **must** be valid [module names](../../../concepts/modules-workspaces/).

#### `override`

**Optional.** Overrides any default `objc_class_prefix` option value for specific modules. The `override` keys **must** be valid module names.

### `optimize_for`

**Optional.** Controls what the [`optimize_for`](https://github.com/protocolbuffers/protobuf/blob/v24.2/src/google/protobuf/descriptor.proto#L429) value is set to for all of the `.proto` files contained within the input. The only accepted values are `SPEED`, `CODE_SIZE` and `LITE_RUNTIME`. Managed mode won't modify this option if unset.

| Value        | Description                                                                                                                 |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| SPEED        | Generate highly optimized code for parsing, serializing, and performing common operations on messages                       |
| CODE_SIZE    | Generate minimal classes and instead rely on shared, reflection-based code for serialization, parsing, and other operations |
| LITE_RUNTIME | Generate classes that depend only on the “lite” Protobuf runtime                                                            |

### `php_metadata_namespace`

::: tip Note

:::

This option can't be specified. It can only be overridden using the [per-file override](#per-file-override).When managed mode is enabled, [`php_metadata_namespace`](https://github.com/protocolbuffers/protobuf/blob/v24.2/src/google/protobuf/descriptor.proto#L488) defaults to the default managed mode `php_namespace` value with `\GPBMetadata` appended to it. For example, `acme.weather.foo_bar.v1` becomes `Acme\Weather\FooBar\V1\GPBMetadata`.

::: info buf.gen.yaml override example

```yaml
version: v1
managed:
  enabled: true
  override:
    PHP_METADATA_NAMESPACE:
      acme/weather/v1/weather.proto: "Acme\Weather\FooBar\GPBMetadata"
```

:::

### `php_namespace`

::: tip NoteThis option can't be specified. It can only be overridden using the [per-file override](#per-file-override).

:::

When managed mode is enabled, [`php_namespace`](https://github.com/protocolbuffers/protobuf/blob/v24.2/src/google/protobuf/descriptor.proto#L483) defaults to the package name connected by `\` with each part in PascalCase. If part of the name is a reserved keyword, it appends `_` at the end of that part. For example:

- `acme.weather.foo_bar.v1` becomes `Acme\Weather\FooBar\V1`
- `acme.error.v1` becomes `Acme\Error_\V1`

::: info buf.gen.yaml override example

```yaml
version: v1
managed:
  enabled: true
  override:
    PHP_NAMESPACE:
      acme/weather/v1/weather.proto: "Acme\Weather\FooBar"
```

:::

### `ruby_package`

**Optional.** Controls what the [`ruby_package`](https://github.com/protocolbuffers/protobuf/blob/v24.2/src/google/protobuf/descriptor.proto#L493) value is set to for all of the `.proto` files contained within the input. Managed mode's default value is the package name with each package sub-name capitalized, with `::` substituted for `.`. For example, `acme.weather.v1` becomes `Acme::Weather::V1`. The default can't be set differently, but can be overridden or excepted for specific `.proto` files.

#### `except`

**Optional.** Removes the specified modules from the `ruby_package` file option override behavior. The `except` keys **must** be valid [module names](../../../concepts/modules-workspaces/).

#### `override`

**Optional.** Overrides the `ruby_package` file option value used for specific modules. The `override` keys **must** be valid [module names](../../../concepts/modules-workspaces/).

### `override`

**Optional.** This is a list of per-file overrides for each modifier. In the example below, an override is set for `acme/weather/v1/weather.proto` so that `optimize_for` is set to `CODE_SIZE` for **only** the `acme/weather/v1/weather.proto` file and **not** for the rest of the module.Note that when using the per-file override, the option **must** be formatted as upper case. The following options can be overridden:

- `CSHARP_NAMESPACE`
- `GO_PACKAGE` (the option name that `go_package_prefix` modifies)
- `JAVA_MULTIPLE_FILES`
- `JAVA_OUTER_CLASSNAME`
- `JAVA_PACKAGE` (the option name that `java_package_prefix` modifies)
- `JAVA_STRING_CHECK_UTF8`
- `OBJC_CLASS_PREFIX`
- `OPTIMIZE_FOR`
- `PHP_METADATA_NAMESPACE`
- `PHP_NAMESPACE`
- `RUBY_PACKAGE`

::: info buf.gen.yaml override example

```yaml
version: v1
managed:
  enabled: true
    override:
      OPTIMIZE_FOR:
        acme/weather/v1/weather.proto: "CODE_SIZE"
```

:::
