---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/configuration/v1beta1/lint-rules/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/configuration/v1beta1/buf-lock/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/inputs/"
  - - meta
    - property: "og:title"
      content: "buf.work.yaml - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/configuration/v1beta1/lint-rules.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/configuration/v1beta1/lint-rules/"
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
      content: "buf.work.yaml - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/configuration/v1beta1/lint-rules.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# v1beta1 Lint rules and categories

`buf` provides a carefully curated set of lint rules designed to provide consistency and maintainability across a Protobuf schema of any size and any purpose, but without being so opinionated as to restrict organizations from making the design decisions they need to make for their individual APIs.

`buf lint` applies individual lint rules across your Protobuf schema, reporting any violations as errors. All lint rules have an **ID**, and belong to one or more **categories**. On this page, we'll discuss the available categories, and the individual rules within each category.

Although categories aren't required to be in tree form, they can be represented as such. Note this is just a human representation and isn't actual configuration.

- `STANDARD`
  - `STYLE_DEFAULT`
  - `BASIC`
    - `STYLE_BASIC`
    - `MINIMAL`
      - `FILE_LAYOUT`
      - `PACKAGE_AFFINITY`
      - `SENSIBLE`
- `COMMENTS`
- `UNARY_RPC`
- `OTHER`

::: tip Note
Lint rules and categories were simplified between `v1beta1` and `v1` configurations, and they're unchanged for `v2` configurations. We strongly recommend migrating to a `v2` configuration — see the [migration guide](../../../migration-guides/migrate-v2-config-files/) to get started.
:::

## Style guide

Our [style guide](../../../best-practices/style-guide/) provides a concise document that effectively includes all rules in the `STANDARD` category, as well as additional recommendations that aren't enforced. We provide this for ease of consumption across your various teams, while linking back to this document for rationale for individual rules.

## Categories

Buf provides three "main top-level" categories of increasing strictness:

- `MINIMAL`
- `BASIC`
- `STANDARD`

These provide the majority of lint rules you may want to apply.

Additionally, Buf provides "extra top-level" categories, currently:

- `COMMENTS`
- `UNARY_RPC`
- `OTHER`

These enforce additional constraints that users may want to apply to their Protobuf schema.

### `MINIMAL`

The `MINIMAL` category represents what we consider to be **fundamental rules for modern Protobuf development, regardless of style**. We find these rules so important that if it were up to us (which it isn't), and `protoc` could make breaking changes (which it can't, and shouldn't), these would be required for protoc to produce valid output.

Not applying these rules can lead to a myriad of bad situations across the variety of available Protobuf plugins, especially plugins not built into `protoc` itself. There is no downside to applying these rules. If you can't tell, we **highly** recommend abiding by the `MINIMAL` group for your development sanity.

The `MINIMAL` category includes three "sub-categories".

#### `FILE_LAYOUT`

The `FILE_LAYOUT` category includes three rules:

- `DIRECTORY_SAME_PACKAGE` checks that all files in a given directory are in the same package.
- `PACKAGE_SAME_DIRECTORY` checks that all files with a given package are in the same directory.
- `PACKAGE_DIRECTORY_MATCH` checks that all files with are in a directory that matches their package name.

In short, this verifies that all files that declare a given package `foo.bar.baz.v1` are in the directory `foo/bar/baz/v1` relative to root, and that only one such directory exists. For example, assuming we have a single [root](../buf-yaml/#roots), `proto`:

```text
.
└── proto
    └── foo
        └── bar
            ├── bat
            │   └── v1
            │       └── bat.proto // package foo.bar.bat.v1
            └── baz
                └── v1
                    ├── baz.proto         // package foo.bar.baz.v1
                    └── baz_service.proto // package foo.bar.baz.v1
```

`protoc` doesn't enforce file structure in any way, however you're like to have a rough time with many Protobuf plugins across various languages if you don't do this.

This also has the effect of allowing imports to self-document their package, for example you know that the import `foo/bar/bat/v1/bat.proto` has types in the package `foo.bar.bat.v1`.

There is no downside to maintaining this structure, and in fact many languages explicitly or effectively enforce such a file structure (for example, Go and Java).

#### `PACKAGE_AFFINITY`

Buf doesn't lint file option values, but it's important to make sure that certain file option values are consistent across all files in a given Protobuf package if you do use them.

The `PACKAGE_AFFINITY` category includes these rules:

- `PACKAGE_SAME_CSHARP_NAMESPACE` checks that all files with a given package have the same value for the `csharp_namespace` option.
- `PACKAGE_SAME_GO_PACKAGE` checks that all files with a given package have the same value for the `go_package` option.
- `PACKAGE_SAME_JAVA_MULTIPLE_FILES` checks that all files with a given package have the same value for the `java_multiple_files` option.
- `PACKAGE_SAME_JAVA_PACKAGE` checks that all files with a given package have the same value for the `java_package` option.
- `PACKAGE_SAME_PHP_NAMESPACE` checks that all files with a given package have the same value for the `php_namespace` option.
- `PACKAGE_SAME_RUBY_PACKAGE` checks that all files with a given package have the same value for the `ruby_package` option.
- `PACKAGE_SAME_SWIFT_PREFIX` checks that all files with a given package have the same value for the `swift_prefix` option.

Each of these rules also verifies that if a given option is used in one file in a given package, it's used in every file.

For example, if we have file `foo_one.proto`:

::: info foo_one.proto

```protobuf
syntax = "proto3";

package foo.v1;

option go_package = "foov1";
option java_multiple_files = true;
option java_package = "com.foo.v1";
```

:::

Another file `foo_two.proto` with package `foo.v1` must have these three options set to the same value, and the other options unset:

::: info foo_two.proto

```protobuf
syntax = "proto3";

package foo.v1;

option go_package = "foov1";
option java_multiple_files = true;
option java_package = "com.foo.v1";
```

:::

#### `SENSIBLE`

The `SENSIBLE` category outlaws certain Protobuf features that you should never use in modern Protobuf development. It includes these rules:

- `ENUM_NO_ALLOW_ALIAS` checks that enums don't have the `allow_alias` option set.
- `FIELD_NO_DESCRIPTOR` checks that field names aren't name capitalization of "descriptor" with any number of prefix or suffix underscores.
- `IMPORT_NO_PUBLIC` checks that imports aren't public.
- `IMPORT_NO_WEAK` checks that imports aren't weak.
- `PACKAGE_DEFINED` checks that all files with have a package defined.

##### `ENUM_NO_ALLOW_ALIAS`

This rule outlaws aliased enums like this:

```protobuf
enum Foo {
  option allow_alias = true;
  FOO_UNSPECIFIED = 0;
  FOO_ONE = 1;
  FOO_TWO = 1; // no!
}
```

The `allow_alias` option allows multiple enum values to have the same number. This can lead to issues when working with the JSON representation of Protobuf, a first-class citizen of proto3. If you get a serialized Protobuf value over the wire in binary format, it's unknown what specific value in the enum it applies to, and JSON usually serialized enum values by name. While in practice, if you declare an alias, you expect names to be interchangeable, this can lead to hard-to-track bugs.

Instead of having an alias, we recommend deprecating your current enum, and making a new one with the enum value name you want. Or just stick with the current name for your enum value.

##### `FIELD_NO_DESCRIPTOR`

This rules outlaws field names being any capitalization of "descriptor", with any number of prefix or suffix underscores. For example:

```protobuf
// ALL FIELDS ARE INVALID
message Foo {
  string descriptor = 1;
  string Descriptor = 2;
  string descRiptor = 3;
  string _descriptor = 4;
  string __descriptor = 5;
  string descriptor_ = 6;
  string descriptor__ = 7;
  string __descriptor__ = 8;
}
```

This prevents a long-standing issue with Protobuf where certain languages generate an accessor named `descriptor` that conflicts with generated code for this field name. There is actually an option [no_standard_descriptor_accessor](https://github.com/protocolbuffers/protobuf/blob/044c766fd4777713fef2d1a9a095e4308d770c68/src/google/protobuf/descriptor.proto#L467) on MessageOptions that allows mitigation of this issue for fields that are named `descriptor`. Following the documentation there, developers should avoid naming fields "descriptor". This actually happens more often than you may think.

##### `IMPORT_NO_PUBLIC`, `IMPORT_NO_WEAK`

These rules outlaw declaring imports as `public` or `weak`. If you didn't know this was possible, forget what you just learned in this sentence, and regardless don't use these.

##### `PACKAGE_DEFINED`

This rule requires all Protobuf files to specify a `package`. It's possible to have a Protobuf file that doesn't declare a package. If you didn't know this was possible, forget what you just learned, and regardless don't do this.

### `BASIC`

The `BASIC` category includes everything from the `MINIMAL` category, as well as the `STYLE_BASIC` category. That is, this configuration...

::: info buf.yaml

```yaml
version: v1beta1
lint:
  use:
    - BASIC
```

:::

...is equivalent to:

::: info buf.yaml

```yaml
version: v1beta1
lint:
  use:
    - MINIMAL
    - STYLE_BASIC
```

:::

#### `STYLE_BASIC`

The `STYLE_BASIC` category includes basic style checks that are widely accepted as standard Protobuf style. These checks should generally be applied for all Protobuf schemas.

These checks represent the "old" [Google Style Guide](https://developers.google.com/protocol-buffers/docs/style) that has been around for years, before elements from the [Uber Style Guide](https://github.com/uber/prototool/tree/dev/style) were merged in during the spring of 2019.

The `STYLE_BASIC` category includes these rules:

- `ENUM_PASCAL_CASE` checks that enums are PascalCase.
- `ENUM_VALUE_UPPER_SNAKE_CASE` checks that enum values are UPPER_SNAKE_CASE.
- `FIELD_LOWER_SNAKE_CASE` checks that field names are lower_snake_case.
- `MESSAGE_PASCAL_CASE` checks that messages are PascalCase.
- `ONEOF_LOWER_SNAKE_CASE` checks that oneof names are lower_snake_case.
- `PACKAGE_LOWER_SNAKE_CASE` checks that packages are lower_snake.case.
- `RPC_PASCAL_CASE` checks that RPCs are PascalCase.
- `SERVICE_PASCAL_CASE` checks that services are PascalCase.

### `STANDARD`

The `STANDARD` category includes everything from the `BASIC` category, as well as the `STYLE_DEFAULT` category. That is, this configuration...

::: info buf.yaml

```yaml
version: v1beta1
lint:
  use:
    - STANDARD
```

:::

...is equivalent to:

::: info buf.yaml

```yaml
version: v1beta1
lint:
  use:
    - BASIC
    - STYLE_DEFAULT
```

:::

`STANDARD` is also the default set of lint rules used by Buf if no configuration is present, and **represents the our baseline enforced recommendations for modern Protobuf development without being overly burdensome**.

#### `STYLE_DEFAULT`

The `STYLE_DEFAULT` category includes everything in `STYLE_BASIC`, as well as style checks that we recommend for consistent, maintainable Protobuf schemas. We recommend applying all of these checks to any schema you develop.

The `STYLE_DEFAULT` category includes these rules on top of `STYLE_BASIC`:

- `ENUM_VALUE_PREFIX` checks that enum values are prefixed with ENUM_NAME_UPPER_SNAKE_CASE.
- `ENUM_ZERO_VALUE_SUFFIX` checks that enum zero values are suffixed with \_UNSPECIFIED (suffix is configurable).
- `FILE_LOWER_SNAKE_CASE` checks that filenames are lower_snake_case.
- `RPC_REQUEST_RESPONSE_UNIQUE` checks that RPCs request and response types are only used in one RPC (configurable).
- `RPC_REQUEST_STANDARD_NAME` checks that RPC request type names are RPCNameRequest or ServiceNameRPCNameRequest (configurable).
- `RPC_RESPONSE_STANDARD_NAME` checks that RPC response type names are RPCNameResponse or ServiceNameRPCNameResponse (configurable).
- `PACKAGE_VERSION_SUFFIX` checks that the last component of all packages is a version of the form v\\d+, v\\d+test.\*, v\\d+(alpha|beta)\\d+, or v\\d+p\\d+(alpha|beta)\\d+, where numbers are >=1.
- `SERVICE_SUFFIX` checks that services are suffixed with Service (suffix is configurable).

##### `ENUM_VALUE_PREFIX`

This rule requires that all enum value names are prefixed with the enum name. For example:

```protobuf
enum Foo {
  FOO_UNSPECIFIED = 0;
  FOO_ONE = 1;
}

message Bar {
  enum Baz {
    BAZ_UNSPECIFIED = 0;
    BAZ_ONE = 1;
  }
}
```

Protobuf enums use C++ scoping rules, which makes it not possible to have two enums in the same package with the same enum value name (an exception is when enums are nested, in which case this rule applies within the given message). While you may expect a given enum value to always be unique across a package, APIs can develop over years, and there are countless examples of developers having to compromise on their enum names due to backwards compatibility issues. For example, you might have this enum:

```protobuf
enum Scheme {
  // Right off the bat, you can't use "UNSPECIFIED" in multiple enums
  // in the same package, so you always would have to prefix this anyways.
  SCHEME_UNSPECIFIED = 0;
  HTTP = 1;
  HTTPS = 2;
  ...
}
```

Two years later, you have an enum in the same package you want to add, but can't:

```protobuf
// This is a made up example, bear with us.
enum SecureProtocol {
  SECURE_PROTOCOL_UNSPECIFIED = 0;
  // If this enum is in the same package as Scheme, this produces
  // a protoc compile-time error!
  HTTPS = 1;
  ...
}
```

##### `ENUM_ZERO_VALUE_SUFFIX`

This rule requires that all enum values have a zero value of `ENUM_NAME_UNSPECIFIED`. For example:

```protobuf
enum Foo {
  FOO_UNSPECIFIED = 0;
}
```

The suffix is [configurable](../../../lint/overview/#defaults-and-configuration).

All enums should have a zero value. Proto3 doesn't differentiate between set and unset fields, so if an enum field is not explicitly set, it defaults to the zero value. If an explicit zero value isn't part of the enum definition, this defaults to the actual zero value of the enum. For example, if you had:

```protobuf
enum Scheme {
  // *** DO NOT DO THIS ***
  SCHEME_FTP = 0
}

message Uri {
  Scheme scheme = 1;
}
```

Any `Uri` with `scheme` not explicitly set defaults to `SCHEME_FTP`.

##### `FILE_LOWER_SNAKE_CASE`

This rule says that all `.proto` files must be named in `lower_snake_case.proto`. This is the widely accepted standard.

##### `RPC_REQUEST_STANDARD_NAME`, `RPC_RESPONSE_STANDARD_NAME`, `RPC_REQUEST_RESPONSE_UNIQUE`

These rules enforce the message name of RPC request/responses, and that all request/responses are unique.

**One of the single most important rules to enforce in modern Protobuf development is to have a unique request and response message for every RPC.** Separate RPCs shouldn't have their request and response parameters controlled by the same Protobuf message, and if you share a Protobuf message between multiple RPCs, this results in multiple RPCs being affected when fields on this Protobuf message change. **Even in straightforward cases**, best practice is to always have a wrapper message for your RPC request and response types. Buf enforces this with these three rules by verifying that:

- All request and response messages are unique across your Protobuf schema.
- All request and response messages are named after the RPC, either by naming them `MethodNameRequest`, `MethodNameResponse` or `ServiceNameMethodNameRequest`, `ServiceNameMethodNameResponse`.

For example, this service definition abides by these rules:

```protobuf
// request/response message definitions omitted for brevity

service FooService {
  rpc Bar(BarRequest) returns (BarResponse) {}
  rpc Baz(FooServiceBazRequest) returns (FooServiceBazResponse) {}
}
```

There are [configuration options](../../../lint/overview/#defaults-and-configuration) associated with these three rules.

##### `PACKAGE_VERSION_SUFFIX`

This rule enforces that the last component of a package must be a version of the form `v\d+, v\d+test.*, v\d+(alpha|beta)\d*, or v\d+p\d+(alpha|beta)\d*`, where numbers are >=1.

Examples (all taken directly from `buf` testing):

```text
foo.v1
foo.v2
foo.bar.v1
foo.bar.v1alpha
foo.bar.v1alpha1
foo.bar.v1alpha2
foo.bar.v1beta
foo.bar.v1beta1
foo.bar.v1beta2
foo.bar.v1p1alpha
foo.bar.v1p1alpha1
foo.bar.v1p1alpha2
foo.bar.v1p1beta
foo.bar.v1p1beta1
foo.bar.v1p1beta2
foo.bar.v1test
foo.bar.v1testfoo
```

One of the core promises of Protobuf API development is to never have breaking changes in your APIs, and Buf helps enforce this through the [breaking change detector](../../../breaking/overview/). There are scenarios, however, where you do want to properly version your API. Instead of making changes, the proper method to do so is to make a completely new Protobuf package that's a copy of your existing Protobuf package, serve both packages server-side, and manually migrate your callers. This rule enforces that all packages have a version attached so that it's clear when a package represents a new version.

A common idiom is to use alpha and beta packages for packages that are still in development and can have breaking changes. You can [configure the breaking change detector](../../../breaking/overview/#defaults-and-configuration) to ignore breaking changes in files for these packages with the `ignore_unstable_packages` option:

::: info buf.yaml

```yaml
version: v1beta1
breaking:
  ignore_unstable_packages: true
```

:::

##### `SERVICE_SUFFIX`

This rule enforces that all services are suffixed with `Service`. For example:

```protobuf
service FooService {}
service BarService {}
service BazService {}
```

Service names inherently end up having a lot of overlap with package names, and service naming often ends up inconsistent as a result across a larger Protobuf schema. Enforcing a consistent suffix takes away some of this inconsistency.

The suffix is configurable via the `lint.service_suffix` option. For example, if you have this configuration in your `buf.yaml`...

::: info buf.yaml

```yaml
version: v1beta1
lint:
  service_suffix: Endpoint
```

:::

...the `SERVICE_SUFFIX` rule enforces this naming instead:

```protobuf
service FooEndpoint {}
service BarEndpoint {}
service BazEndpoint {}
```

### `COMMENTS`

This is an "extra top-level" category that enforces that comments are present on various parts of your Protobuf schema.

The `COMMENTS` category includes these rules:

- `COMMENT_ENUM` checks that enums have non-empty comments.
- `COMMENT_ENUM_VALUE` checks that enum values have non-empty comments.
- `COMMENT_FIELD` checks that fields have non-empty comments.
- `COMMENT_MESSAGE` checks that messages have non-empty comments.
- `COMMENT_ONEOF` checks that oneof have non-empty comments.
- `COMMENT_RPC` checks that RPCs have non-empty comments.
- `COMMENT_SERVICE` checks that services have non-empty comments.

Note that only leading comments are considered - trailing comments don't count towards passing these rules.

Buf intends to host a documentation service (both public and on-prem) in the future, which may include a structured documentation scheme, however for now you may want to at least enforce that certain parts of your schema contain comments. This group allows such enforcement. Of note is that general usage may be not to use all rules in this category, instead selecting the rules you specifically want. For example:

::: info buf.yaml

```yaml
version: v1beta1
lint:
  use:
    - STANDARD
    - COMMENT_ENUM
    - COMMENT_MESSAGE
    - COMMENT_RPC
    - COMMENT_SERVICE
```

:::

### `UNARY_RPC`

This is an "extra top-level" category that outlaws streaming RPCs.

This `UNARY_RPC` category includes these rules:

- `RPC_NO_CLIENT_STREAMING` checks that RPCs aren't client streaming.
- `RPC_NO_SERVER_STREAMING` checks that RPCs aren't server streaming.

Some RPC protocols don't allow streaming RPCs, for example [Twirp](https://twitchtv.github.io/twirp). This extra category enforces that no developer accidentally adds a streaming RPC if your setup doesn't support them. Additionally, streaming RPCs have a number of issues in general usage. See [this discussion](https://github.com/twitchtv/twirp/issues/70#issuecomment-470367807) for more details.

### `OTHER`

This is an "extra top-level" category that includes lint rules not in a main collection.

This category can be modified between collection versions.

###### `ENUM_FIRST_VALUE_ZERO`

This rule enforces that the first enum value is the zero value.

This is a `proto3` requirement on build, but isn't required in `proto2` on build. This rule enforces that this is also followed in `proto2`.

As an example:

```protobuf
syntax = "proto2";

enum Scheme {
  // *** DO NOT DO THIS ***
  SCHEME_FTP = 1;
  SCHEME_UNSPECIFIED = 0;
}
```

The above results in generated code in certain languages defaulting to `SCHEME_FTP` instead of `SCHEME_UNSPECIFIED`.
