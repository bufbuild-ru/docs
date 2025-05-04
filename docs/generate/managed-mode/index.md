---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/generate/managed-mode/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/generate/tutorial/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/configuration/v2/buf-gen-yaml/"
  - - meta
    - property: "og:title"
      content: "Managed mode - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/generate/managed-mode.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/generate/managed-mode/"
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
      content: "Managed mode - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/generate/managed-mode.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Managed mode

::: tip Note
This feature has changed significantly between `v1` and `v2` configurations. See the [v1 to v2 migration guide](../../migration-guides/migrate-v2-config-files/) for migration instructions or the [v1 `buf.gen.yaml` reference](../../configuration/v1/buf-gen-yaml/) if you're still using `v1` configuration files.
:::

Managed mode is a feature of `buf generate` that allows API consumers to control file and field options when generating code from Protobuf files, even without control of the API itself. It's easy to implement and provides a thoughtful set of defaults for these options, with enough granularity to manage them more directly as needed. It hides some of Protobuf's quirks and allows consumers to start generating code quickly.It removes the need for API producers to make these decisions for consumers. Instead, producers can leave this information out and different types of consumers can rely on managed mode to generate code in the ways that they need to use it.

## Enable managed mode

You can enable managed mode with two lines of code in your `buf.gen.yaml` file:

```yaml
version: v2
managed:
  enabled: true
```

If your desired code generation behavior matches managed mode's [default behavior](#default-behavior), enabling it is all you need to do. When you generate code, these defaults are automatically applied as file options to your Protobuf files.If you need different behavior, managed mode allows you to selectively override or disable the options necessary to generate the code as you require. The sections below have details about how to construct `override` and `disable` rules for each of the options, and this example illustrates a few key interactions:

```yaml
version: v2
managed:
  enabled: true
  disable:
    # Don't modify any file option or field option for googleapis
    - module: buf.build/googleapis/googleapis
    # Don't modify csharp_namespace for any file
    - file_option: csharp_namespace
    # Don't modify java_package for files in weather/v1beta1/ in this module
    - module: buf.build/acme/weather
      path: weather/v1beta1/
      file_option: java_package
  override:
    # Use this prefix by default for all files
    - file_option: go_package_prefix
      value: company.com/foo/bar
    # Because the last matching rule wins, files in only this module have the prefix x/y/z
    - file_option: go_package_prefix
      module: buf.build/acme/weather
      value: x/y/z
    # For files in this path only, go_package is directly set to this value and the previous
    # go_package_prefix rule isn't applied
    - file_option: go_package
      path: special/path/
      value: special/value/package/v1
    # Same rules apply to field options as well
    # This sets JSType to JS_STRING for package.Message.field
    - field_option: jstype
      field: package.Message.field
      value: JS_STRING
```

For a complex configuration showing greater granularity of file/field options, see the annotated example in the [`buf.gen.yaml` reference](../../configuration/v1/buf-gen-yaml/).

### Precedence rules

If a managed mode option has both `override` and `disable` specified, `disable` takes precedence and `override` settings won't be applied. For options that set package prefixes or suffixes, this means that disabling the base option (such as `go_package`) also disables any overrides that set a prefix or suffix.Some of managed mode's options allow you to extend a file option by adding a prefix and/or suffix in addition to modifying it directly, like `go_package` and `go_package_prefix`. If a file matches multiple rules that modify the same option (`go_package` in this case), then the last one specified is applied. For example, if you set both Go options like this, only the `go_package_prefix` value is applied because they're both trying to modify `go_package`:

::: info Both Go options set

```yaml
managed:
  enabled: true
  override:
    - file_option: go_package
      value: foo/bar
    - file_option: go_package_prefix
      value: data
```

:::

There is one special case: when the last rules that modify `java_package` are `java_package_prefix` and `java_package_suffix`, `java_package` is modified to `<prefix>.proto_package.<suffix>`. In that case, any `java_package` rules defined before the prefix/suffix rules are ignored for files that match all three.

## Override managed mode defaults

You may need to override an option to make your generated code conform to your company's source control directory structure or API endpoints. To override an option, you create a rule with its name and the new value in the `override` section of your `buf.gen.yaml` file. If no input is specified in the rule, the value is modified for all inputs, but each rule can specify inputs down to the field level of a single `.proto` file if you need to be that granular.

::: tip Note
See the [Defaults and override behavior](#default-behavior) section below for default behavior and specific `override` examples for each language.
:::

For example, managed mode's defaults set `java_package` to `com.<proto_package>`, which means that given this configuration and an input with this `.proto` file `package` value:

::: info buf.gen.yaml

```yaml
version: v2
managed:
  enabled: true
plugins:
  - remote: buf.build/protocolbuffers/java
    out: gen/proto
```

:::

::: info .proto file

```protobuf
syntax = "proto3";

package acme.weather.v1;
```

:::

it generates code from the `buf.build/protocolbuffers/java` plugin for the `.proto` file and puts it in the `gen/proto/com/acme/weather/v1` directory of your workspace. Your generated Java code files have a `package com.acme.weather.v1;` declaration.However, if you need the code to live in `gen/proto/net/acme/weather/v1` with a `package net.acme.weather.v1;` declaration, you add an `override` rule for `java_package_prefix` :

```yaml
version: v2
managed:
  enabled: true
  override:
    - file_option: java_package_prefix
      value: net
plugins:
  - remote: buf.build/protocolbuffers/java
    out: gen/proto
```

Overrides are applied in the order you specify in the `buf.gen.yaml` file, which allows you to start with more general rules and then be more specific for a subset of inputs. Using this flexibility, you can create specific sets of outputs. For example, this series of rules creates different generated code directories for each input:

```yaml
version: v2
managed:
  enabled: true
  override:
    # Modify the java_package value to '<net>.<proto_package>' for all files
    - file_option: java_package_prefix
      value: net
    # Modify the java_package value to '<com>.<proto_package>.<com>' for all files
    # in buf.build/acme/petapis. These rules take precedence over the rule above.
    # Note that both the prefix and suffix are applied because the rules specify
    # the same module.
    - file_option: java_package_prefix
      module: buf.build/acme/petapis
      value: com
    - file_option: java_package_suffix
      module: buf.build/acme/petapis
      value: com
    # For the file foo/bar/baz.proto, set java_package specifically to
    # 'com.x.y.z'. This takes precedence over the previous rules above.
    - file_option: java_package
      path: foo/bar/baz.proto
      value: com.x.y.z
plugins:
  - remote: buf.build/protocolbuffers/java
    out: gen/proto
inputs:
  - directory: proto
  - module: buf.build/acme/petapis
```

Assuming the workspace is structured as below and the `package` values in the `.proto` files match the directory structure:

```text
workspace_root
├── buf.gen.yaml
├── buf.yaml
├── gen
│   └── proto
└── proto
    ├── acme
    │   └── weather
    │       └── v1
    │           └── weather.proto
    └── foo
        └── bar
            └── baz.proto
```

the directory structure of the generated code looks like this, and the `package` declarations in the generated Java files match the directory structure they're contained within:

```text
workspace_root
├── buf.gen.yaml
├── buf.yaml
├── gen
│   └── proto
│       ├── com
│       │   └── pet
│       │       └── v1
│       │           └── com
│       │               # buf.build/acme/petapis Java files
│       │               # package com.pet.v1.com;
│       ├── x
│       │   └── y
│       │       └── z
│       │           # baz.proto Java files
│       │           # package com.x.y.z;
│       └── net
│           └── acme
│               └── weather
│                   └── v1
│                       # weather.proto Java files
│                       # package net.acme.weather.v1;
└── proto
    ├── acme
    │   └── weather
    │       └── v1
    │           └── weather.proto
    └── foo
       └── bar
           └── baz.proto
```

The examples above show how to override file options, and field options work similarly. The only Protobuf field option that managed mode supports is [`JSType`](https://github.com/protocolbuffers/protobuf/blob/v27.0/src/google/protobuf/descriptor.proto#L668-L689).

```yaml
version: v2
managed:
  enabled: true
  override:
    # For all fields in the buf.build/acme/paymentapis module where the field is
    # one of the compatible types, set 'jstype' to 'JS_NORMAL'.
    - field_option: jstype
      module: buf.build/acme/paymentapis
      value: JS_NORMAL
    # Set the package.Message.field field 'jstype' value to 'JS_STRING'.
    # You can additionally specify the module and path, but the field name
    # is sufficient.
    - field_option: jstype
      value: JS_STRING
      field: package.Message.field
```

## Disable managed mode for specific inputs

In addition to overriding specific options, you can also disable managed mode entirely for any combination of inputs by input, file, and/or field. Commonly this is used to keep managed mode from overriding options for inputs like the [buf.build/googleapis/googleapis](https://buf.build/googleapis/googleapis) module.To disable a specific option for all inputs, list it under the `disable` key:

```yaml
version: v2
managed:
  enabled: true
  disable:
    - file_option: csharp_namespace
```

To disable managed mode entirely for specific inputs, list the inputs under the `disable`key:

```yaml
version: v2
managed:
  enabled: true
  disable:
    # Don't modify any files in buf.build/googleapis/googleapis
    - module: buf.build/googleapis/googleapis
    # Don't modify any files in the foo/v1 directory within this workspace.
    # This can be a path to a directory or a .proto file. If it's a directory
    # path, all .proto files in the directory are ignored.
    - path: foo/v1
```

From there, you can set rules that are as specific as you need to target the combinations of options, inputs, and fields that you want:

```yaml
version: v2
managed:
  enabled: true
  disable:
    # Don't modify the field options for the foo.bar.Baz.field_name field.
    - field: foo.bar.Baz.field_name
```

```yaml
version: v2
managed:
  enabled: true
  disable:
    # Don't modify the java_package file option for files in foo/v1 in
    # buf.build/acme/weather
    - module: buf.build/acme/weather
      path: foo/v1
      file_option: java_package
```

```yaml
version: v2
managed:
  enabled: true
  disable:
    # disable jstype for all files that match the module, path, and field name.
    - module: buf.build/acme/petapis
      field: foo.bar.Baz.field_name
      path: foo/v1
      field_option: jstype
```

## Defaults and override behavior

Managed mode usually modifies several aspects of your generated code based on the package name in your `.proto` files. Specifically, it often changes the directory structure and package references in the generated files. The examples below show the output of the following workspace, `.proto` file, and managed mode options, with these assumptions:

- A `plugin` has been set for each language where managed mode is relevant: C++, C#, Go, Java, Objective-C, PHP, and Ruby
- The output directory (`out`) for each language is `gen/proto/<language>`
- **Default behavior** refers to the option's results when managed mode is enabled, but no other settings have been specified.

::: info Workspace directory structure

```text
workspace_root
├── buf.gen.yaml
├── buf.yaml
├── gen
│   └── proto
│       ├── csharp
│       ├── go
│       ├── java
│       ├── objc
│       ├── php
│       └── ruby
└── proto
    └── acme
        └── weather
            └── v1
                └── weather.proto
```

:::

::: info proto/acme/weather/v1/proto

```protobuf
syntax = "proto3";

package acme.weather.v1;

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
  Condition conditions = 2;
}

service WeatherService {
  rpc GetWeather (GetWeatherRequest) returns (GetWeatherResponse);
}
```

:::

### C++

C++ only has one option that managed mode supports: `cc_enable_arenas`. This option is now [enabled by default in Protobuf](https://github.com/protocolbuffers/protobuf/issues/8119), and changing its value no longer has an effect. However, the descriptor byte array in the generated code differs on this byte.

### C#

C# has two options: `csharp_namespace` and `csharp_namespace_prefix`. It makes no changes to directory structure (files are output to the `out` path), and it sets the namespace as follows:

::: info Default setting

```yaml
managed:
  enabled: true
```

:::

::: info Namespace in generated files

```csharp
namespace Acme.Weather.V1
```

:::

::: info Set csharp_namespace

```yaml
managed:
  enabled: true
  override:
    - file_option: csharp_namespace
      value: weather.v1
```

:::

::: info Namespace in generated files

```csharp
namespace weather.v1
```

:::

::: info Set csharp_namespace_prefix

```yaml
managed:
  enabled: true
  override:
    - file_option: csharp_namespace_prefix
      value: data
```

:::

::: info Namespace in generated files

```csharp
namespace data.Acme.Weather.V1
```

:::

### Go

Go has two options: `go_package` and `go_package_prefix`. It requires you to [specify a Go import path](https://protobuf.dev/reference/go/go-generated/#package) using `go_package`, but managed mode doesn't set a default, so you must set a value for one of these options in the `override` section. If `go_package_prefix` is set, managed mode defaults to building out directories for each part of the package name. The examples below show the output of these two options, and assume that the Go plugin's `opt` value is the default of `paths=import`.

::: tip Note
Because both options modify the package name, only one should be set for any given input. If both options are set, the last one specified wins.
:::

::: info Set go_package_prefix

```yaml
managed:
  enabled: true
  override:
    - file_option: go_package_prefix
      value: data
```

:::

::: info Package in generated files

```go
package weatherv1
```

:::

::: info Directory structure

```text
workspace_root
├── buf.gen.yaml
├── buf.yaml
└── gen
    └── proto
        └── go
            └── data
                └── acme
                    └── weather
                        └── v1
                            └── weather.pb.go
```

:::

::: info Set go_package

```yaml
managed:
  enabled: true
  override:
    - file_option: go_package
      value: foo/bar
```

:::

::: info Package in generated files

```go
package bar
```

:::

::: info Directory structure

```text
workspace_root
├── buf.gen.yaml
├── buf.yaml
└── gen
    └── proto
        └── go
            └── foo
                └── bar
                    └── weather.pb.go
```

:::

### Java

Java has several options — managed mode sets the following default values:

| Option                   | Default                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------- |
| `java_multiple_files`    | `true`                                                                                  |
| `java_outer_classname`   | Pascal case of Protobuf file name                                                       |
| `java_package`           | None.                                                                                   |
| `java_package_prefix`    | `com`. Sets `java_package` to `<java_package_prefix>.<proto_package>`, unless disabled. |
| `java_package_suffix`    | None. Sets `java_package` to `<proto_package>.<suffix>` if specified                    |
| `java_string_check_utf8` | `false`                                                                                 |

Similar to Go, `java_package` can't be combined with `java_package_prefix` or `java_package_suffix`, and if it's specified with either of them, the last one wins. However, `java_package_prefix` and `java_package_suffix` can be combined with each other to output `<prefix>.<proto_package>.<suffix>`.

::: info Default setting

```yaml
managed:
  enabled: true
```

:::

::: info Package in generated files

```java
package com.acme.weather.v1;
```

:::

::: info Directory structure

```text
workspace_root
├── buf.gen.yaml
├── buf.yaml
└── gen
    └── proto
        └── java
            └── com
                └── acme
                    └── weather
                        └── v1
                            └── Condition.java
                            └── GetWeatherRequest.java
                            └── GetWeatherRequestOrBuilder.java
                            └── GetWeatherResponse.java
                            └── GetWeatherResponseOrBuilder.java
                            └── WeatherProto.java
```

:::

::: info Set java_multiple_files to false

```yaml
managed:
  enabled: true
  override:
    - file_option: java_multiple_files
      value: false
```

:::

::: info Directory structure

```text
workspace_root
├── buf.gen.yaml
├── buf.yaml
└── gen
    └── proto
        └── java
            └── com
                └── acme
                    └── weather
                        └── v1
                            └── WeatherProto.java
```

:::

::: info Set java_package_prefix and java_package_suffix

```yaml
managed:
  enabled: true
  override:
    - file_option: java_package_prefix
      value: net
    - file_option: java_package_suffix
      value: data
```

:::

::: info Package in generated files

```java
package net.acme.weather.v1.data;
```

:::

::: info Directory structure

```text
workspace_root
├── buf.gen.yaml
├── buf.yaml
└── gen
    └── proto
        └── java
            └── net
                └── acme
                    └── weather
                        └── v1
                            └── data
                                └── Condition.java
                                └── GetWeatherRequest.java
                                └── GetWeatherRequestOrBuilder.java
                                └── GetWeatherResponse.java
                                └── GetWeatherResponseOrBuilder.java
                                └── WeatherProto.java
```

:::

::: info Set java_outer_classname

```yaml
managed:
  enabled: true
  override:
    - file_option: java_outer_classname
      value: Allweather
```

:::

::: info Directory structure

```text
workspace_root
├── buf.gen.yaml
├── buf.yaml
└── gen
    └── proto
        └── java
            └── com
                └── acme
                    └── weather
                        └── v1
                            └── Allweather.java
                            └── Condition.java
                            └── GetWeatherRequest.java
                            └── GetWeatherRequestOrBuilder.java
                            └── GetWeatherResponse.java
                            └── GetWeatherResponseOrBuilder.java
```

:::

### Objective-C

Objective-C has one option: `objc_class_prefix`., which controls the prefix of all classes in the generated code. Managed mode sets its default value according to the following rules:

- Start with the first letter of each sub-package combined to one string, all upper case.
- If the result is shorter than 3 letters, append an `X` until it's three letters long. For example, `acme.weather.v1` becomes `AWX`.
- If the result is `GPB`, change it to `GPX`.

::: info Default setting

```yaml
managed:
  enabled: true
```

:::

::: info weather.pbobjc.m

```objective-c
static GPBFileDescription AWXWeatherRoot_FileDescription = {
  .package = "acme.weather.v1",
  .prefix = "AWX",
  .syntax = GPBFileSyntaxProto3
};
```

:::

::: info Set objc_class_prefix

```yaml
managed:
  enabled: true
  override:
    - file_option: objc_class_prefix
      value: AWD
```

:::

::: info weather.pbobjc.m

```objective-c
static GPBFileDescription AWDWeatherRoot_FileDescription = {
  .package = "acme.weather.v1",
  .prefix = "AWD",
  .syntax = GPBFileSyntaxProto3
};
```

:::

### PHP

PHP has three options: `php_namespace`, `php_metadata_namespace`, and `php_metadata_namespace_suffix`. Only one of these options should be set; if all are set, the last one specified wins. Managed mode sets their default values as follows:

- `php_namespace`: Package name connected by `\`, with each part in Pascal Case (if a part is a reserved keyword, appends `_` at the end)
- `php_metadata_namespace` : `<default_php_namespace>\GPBMetadata`
- `php_metadata_namespace_suffix` : Has no default value, but if set, modifies `php_metadata_namespace` to `<default_php_namespace>\<suffix>`.

::: info Default setting

```yaml
managed:
  enabled: true
```

:::

::: info Acme/Weather/V1/Condition.php

```php
namespace Acme\Weather\V1;
```

:::

::: info Acme/Weather/V1/GPBMetadata/weather.php

```php
namespace Acme\Weather\V1\GPBMetadata;
```

:::

::: info Directory structure

```text
workspace_root
├── buf.gen.yaml
├── buf.yaml
└── gen
    └── proto
        └── php
            └── Acme
                └── Weather
                    └── V1
                        └── Condition.php
                        └── GetWeatherRequest.php
                        └── GetWeatherResponse.php
                        └── GPBMetadata
                            └── Weather.php
```

:::

::: info Set php_namespace

```yaml
managed:
  enabled: true
  override:
    - file_option: php_namespace
      value: weather.v1
```

:::

::: info weather.v1/Condition.php

```php
namespace weather.v1;
```

:::

::: info Acme/Weather/V1/GPBMetadata/weather.php

```php
namespace Acme\Weather\V1\GPBMetadata;
```

:::

::: info Directory structure

```text
workspace_root
├── buf.gen.yaml
├── buf.yaml
└── gen
    └── proto
        └── php
            ├── Acme
            │   └── Weather
            │       └── V1
            │           └── GPBMetadata
            │               └── Weather.php
            └── weather.v1
                └── Condition.php
                └── GetWeatherRequest.php
                └── GetWeatherResponse.php
```

:::

::: info Set php_metadata_namespace

```yaml
managed:
  enabled: true
  override:
    - file_option: php_metadata_namespace
      value: Metadata
```

:::

::: info Acme/Weather/V1/Condition.php

```php
namespace Acme\Weather\V1;
```

:::

::: info Metadata/weather.php

```php
namespace Metadata;
```

:::

::: info Directory structure

```text
workspace_root
├── buf.gen.yaml
├── buf.yaml
└── gen
    └── proto
        └── php
            ├── Acme
            │   └── Weather
            │       └── V1
            │           └── Condition.php
            │           └── GetWeatherRequest.php
            │           └── GetWeatherResponse.php
            └── Metadata
                └── Weather.php
```

:::

::: info Set php_metadata_namespace_suffix

```yaml
managed:
  enabled: true
  override:
    - file_option: php_metadata_namespace_suffix
      value: Data
```

:::

::: info Acme/Weather/V1/Condition.php

```php
namespace Acme\Weather\V1;
```

:::

::: info Data/weather.php

```php
namespace Acme\Weather\V1\Data;
```

:::

::: info Directory structure

```text
workspace_root
├── buf.gen.yaml
├── buf.yaml
└── gen
    └── proto
        └── php
            └── Acme
                └── Weather
                    └── V1
                        ├── Condition.php
                        ├─── Data
                        │   └── Weather.php
                        ├── GetWeatherRequest.php
                        └── GetWeatherResponse.php
```

:::

### Ruby

Ruby has two options: `ruby_package` and `ruby_package_suffix`. Neither option changes the directory structure, but both change the nesting of the Ruby modules in the generated files.

::: info Default setting

```yaml
managed:
  enabled: true
```

:::

::: info weather_pb.rb

```ruby
module Acme
  module Weather
    module V1
      …
    end
  end
end
```

:::

::: info Set ruby_package

```yaml
managed:
  enabled: true
  override:
    - file_option: ruby_package
      value: Acme::Weather::FooBar::V1
```

:::

::: info weather_pb.rb

```ruby
module Acme
  module Weather
    module FooBar
      module V1
        …
      end
    end
  end
end
```

:::

::: info Set ruby_package_suffix

```yaml
managed:
  enabled: true
  override:
    - file_option: ruby_package_suffix
      value: data
```

:::

::: info weather_pb.rb

```ruby
module Acme
  module Weather
    module V1
      module Data
        …
      end
    end
  end
end
```

:::

### Optimization and field options

These options aren't specific to the languages you generate and don't affect directory structure.

#### `optimize_for`

This option doesn't have a default value.

- If set, it expects a value from `SPEED`, `CODE_SIZE` and `LITE_RUNTIME`, and modifies its file option namesake to this value.
- Not all code generators use this option. For example, the generators for C# and Go don't, but Java's does.
- If `a.proto` imports `b.proto`, and `b.proto` sets `LITE_RUNTIME`, then `a.proto` must set `LITE_RUNTIME` or it won't compile.
- In Java, `SPEED` and `LITE_RUNTIME` have no difference but there is a difference between `SPEED` and `CODE_SIZE.`

#### `jstype` field option

This option doesn't have a default value. The accepted values are `JS_NORMAL`, `JS_NUMBER` and `JS_STRING`.

## Troubleshooting

### When I run `buf generate`, my Go code has incorrect imports for dependencies. How do I fix this?

Managed mode overwrites Go import paths using the configuration in `buf.gen.yaml`. If you don't want to use the managed configuration for some dependencies, you must add an `go_package_prefix` entry in `buf.gen.yaml` in the [`disable` field](#disable-managed-mode-for-specific-inputs).

### Why are `googleapis` imported from the local import path instead of the BSR?

This can happen if you're using managed mode to set the default for the `go_package_prefix`. To mitigate this, add `buf.build/googleapis/googleapis` to the `disable` field:

::: info buf.gen.yaml

```yaml{4,5,6}
version: v2
managed:
  enabled: true
  disable:
    - file_option: go_package_prefix
      module: buf.build/googleapis/googleapis
```

:::
