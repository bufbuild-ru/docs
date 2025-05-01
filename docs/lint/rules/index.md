---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/lint/rules/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/lint/quickstart/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/configuration/v2/buf-yaml/"
  - - meta
    - property: "og:title"
      content: "Rules and categories - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/lint/rules.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/lint/rules/"
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
      content: "Rules and categories - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/lint/rules.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Rules and categories

::: tip The rules and categories described here belong to the [`v1`](../../configuration/v1/buf-yaml/) and [`v2`](../../configuration/v2/buf-yaml/) configurations. If you're still using `v1beta1` configuration files and haven't [migrated](../../migration-guides/migrate-v2-config-files/) yet, refer to the previous [reference](../../configuration/v1beta1/lint-rules/).

:::

The Buf CLI applies individual lint rules across your Protobuf schema, reporting any violations as errors. This page describes the available categories and the individual rules within each category. You can also use custom rules and categories defined in [Buf plugins](../../cli/buf-plugins/overview/), either alongside or in place of Buf's. See the [overview](../overview/#usage-examples) for usage and the [`buf.yaml` reference](../../configuration/v2/buf-yaml/) for configuration options.

## Categories

Buf's built-in rules provide three top-level categories of increasing strictness, which are most of the lint rules you'll probably want to apply:

- [`MINIMAL`](#minimal)
- [`BASIC`](#basic)
- [`STANDARD`](#standard)

They also provide two categories outside of the strictness hierarchy that enforce additional useful constraints:

- [`COMMENTS`](#comments)
- [`UNARY_RPC`](#unary_rpc)

### `MINIMAL`

The `MINIMAL` category represents what we consider to be **fundamental rules for modern Protobuf development.** Not applying them can lead to many bad situations across Protobuf plugins, especially plugins that aren't built into `protoc` itself, and there's no downside to applying them. They're described in more detail below:

- [`DIRECTORY_SAME_PACKAGE`](#directory_same_package)
- [`PACKAGE_DEFINED`](#package_defined)
- [`PACKAGE_DIRECTORY_MATCH`](#package_directory_match)
- [`PACKAGE_SAME_DIRECTORY`](#package_same_directory)

The `MINIMAL` category verifies that all files with package `foo.bar.baz.v1` are in the directory `foo/bar/baz/v1` (relative to the [`buf.yaml`](../../configuration/v2/buf-yaml/) file), and that only one such directory exists. `protoc` doesn't enforce file structure in any way, but you're likely to have a rough time with many Protobuf plugins across various languages if you don't do this. Many languages such as Go and Java explicitly or effectively enforce such a file structure.For example, consider this tree:

```text
.
├── buf.yaml
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

Arranging the files this way also has the effect of allowing imports to self-document their package. For example, you can discern that the import `foo/bar/bat/v1/bat.proto` has types in the package `foo.bar.bat.v1`.

### `BASIC`

The `BASIC` category includes everything from the `MINIMAL` category, and adds rules that are widely accepted as standard Protobuf style. These rules should be applied for all Protobuf schemas.The additional rules in the `BASIC` category are:

- [`ENUM_FIRST_VALUE_ZERO`](#enum_first_value_zero)
- [`ENUM_NO_ALLOW_ALIAS`](#enum_no_allow_alias)
- [`ENUM_PASCAL_CASE`](#enum_pascal_case)
- [`ENUM_VALUE_UPPER_SNAKE_CASE`](#enum_value_upper_snake_case)
- [`FIELD_LOWER_SNAKE_CASE`](#field_lower_snake_case)
- [`IMPORT_NO_PUBLIC`](#import_no_public)
- [`IMPORT_NO_WEAK`](#import_no_weak)
- [`IMPORT_USED`](#import_used)
- [`MESSAGE_PASCAL_CASE`](#message_pascal_case)
- [`ONEOF_LOWER_SNAKE_CASE`](#oneof_lower_snake_case)
- [`PACKAGE_LOWER_SNAKE_CASE`](#package_lower_snake_case)
- [`PACKAGE_SAME_CSHARP_NAMESPACE`](#package_same_file_option)
- [`PACKAGE_SAME_GO_PACKAGE`](#package_same_file_option)
- [`PACKAGE_SAME_JAVA_MULTIPLE_FILES`](#package_same_file_option)
- [`PACKAGE_SAME_JAVA_PACKAGE`](#package_same_file_option)
- [`PACKAGE_SAME_PHP_NAMESPACE`](#package_same_file_option)
- [`PACKAGE_SAME_RUBY_PACKAGE`](#package_same_file_option)
- [`PACKAGE_SAME_SWIFT_PREFIX`](#package_same_file_option)
- [`RPC_PASCAL_CASE`](#rpc_pascal_case)
- [`SERVICE_PASCAL_CASE`](#service_pascal_case)

### `STANDARD`

The `STANDARD` category includes everything from the `BASIC` category and some additional rules that represent our recommendations for modern Protobuf development. `STANDARD` is also the default set of lint rules used by the Buf CLI if the `buf.yaml` file has no lint settings configured.The additional rules in the `STANDARD` category are:

- [`ENUM_VALUE_PREFIX`](#enum_value_prefix)
- [`ENUM_ZERO_VALUE_SUFFIX`](#enum_zero_value_suffix)
- [`FILE_LOWER_SNAKE_CASE`](#file_lower_snake_case)
- [`RPC_REQUEST_RESPONSE_UNIQUE`](#rpc_request_response)
- [`RPC_REQUEST_STANDARD_NAME`](#rpc_request_response)
- [`RPC_RESPONSE_STANDARD_NAME`](#rpc_request_response)
- [`PACKAGE_NO_IMPORT_CYCLE`](#package_no_import_cycle) (only in `STANDARD` category for `v2` configuration files, otherwise uncategorized)
- [`PACKAGE_VERSION_SUFFIX`](#package_version_suffix)
- [`PROTOVALIDATE`](#protovalidate)
- [`SERVICE_SUFFIX`](#service_suffix)

### `COMMENTS`

This is an extra top-level category that enforces the presence of comments on various parts of your Protobuf schema. It includes these rules:

- [`COMMENT_ENUM`](#comment_enum)
- [`COMMENT_ENUM_VALUE`](#comment_enum_value)
- [`COMMENT_FIELD`](#comment_field)
- [`COMMENT_MESSAGE`](#comment_message)
- [`COMMENT_ONEOF`](#comment_oneof)
- [`COMMENT_RPC`](#comment_rpc)
- [`COMMENT_SERVICE`](#comment_service)

Only leading comments count towards passing these rules. The rules are separated by object type so that you can selectively enforce which parts of your schema contain comments. You can select individual rules in the `COMMENTS` category like this:

::: info buf.yaml

```yaml
version: v2
lint:
  use:
    - STANDARD
    - COMMENT_ENUM
    - COMMENT_MESSAGE
```

:::

### `UNARY_RPC`

This is an extra top-level category that outlaws streaming RPCs. It includes these rules:

- [`RPC_NO_CLIENT_STREAMING`](#rpc_no_client_streaming)
- [`RPC_NO_SERVER_STREAMING`](#rpc_no_server_streaming)

Some RPC protocols don't allow streaming RPCs, such as [Twirp](https://twitchtv.github.io/twirp). This category enforces that no developer accidentally adds a streaming RPC if your setup doesn't support them. Additionally, streaming RPCs have a number of issues in general usage. See [this discussion](https://github.com/twitchtv/twirp/issues/70#issuecomment-470367807) for more details.

## Rules

### `COMMENT_ENUM`

**Categories:** `COMMENTS`This rule checks that enums have non-empty comments.

### `COMMENT_ENUM_VALUE`

**Categories:** `COMMENTS`This rule checks that enum values have non-empty comments.

### `COMMENT_FIELD`

**Categories:** `COMMENTS`This rule checks that fields have non-empty comments.

### `COMMENT_MESSAGE`

**Categories:** `COMMENTS`This rule checks that messages have non-empty comments.

### `COMMENT_ONEOF`

**Categories:** `COMMENTS`This rule checks that oneofs have non-empty comments.

### `COMMENT_RPC`

**Categories:** `COMMENTS`This rule checks that RPCs have non-empty comments.

### `COMMENT_SERVICE`

**Categories:** `COMMENTS`This rule checks that services have non-empty comments.

### `DIRECTORY_SAME_PACKAGE`

**Categories:** `MINIMAL`, `BASIC`, `STANDARD`This rule checks that all files in a given directory are in the same package.

### `ENUM_FIRST_VALUE_ZERO`

**Categories:** `BASIC`, `STANDARD`This rule enforces that the first enum value is the zero value, which is a `proto3` requirement on build, but isn't required in `proto2` on build. The rule enforces that the requirement is also followed in `proto2`.This example results in a linting error if the rule is active:

```protobuf
syntax = "proto2";

enum Scheme {
  // *** DON'T DO THIS ***
  SCHEME_FTP = 1;
  SCHEME_UNSPECIFIED = 0;
}
```

### `ENUM_NO_ALLOW_ALIAS`

**Categories:** `BASIC`, `STANDARD`This rule outlaws aliased enums like this:

```protobuf
enum Foo {
  option allow_alias = true;
  FOO_UNSPECIFIED = 0;
  FOO_ONE = 1;
  FOO_TWO = 1; // *** DON'T DO THIS ***
}
```

The Protobuf `allow_alias` option lets multiple enum values have the same number. This can lead to issues when working with the JSON representation of Protobuf, which is a first-class citizen of `proto3`. If you get a serialized Protobuf value over the wire in binary format, the specific enum value it applies to is unknown, and JSON usually serializes enum values by name. This can lead to hard-to-track bugs if you declare an alias and expect names to be interchangeable.Instead of having an alias, we recommend deprecating your current enum and making a new one with the enum value name you want, or just sticking with the current name for your enum value.

### `ENUM_PASCAL_CASE`

**Categories:** `BASIC`, `STANDARD`This rule checks that enums are PascalCase.

### `ENUM_VALUE_PREFIX`

**Categories:** `STANDARD`This rule requires that all enum value names are prefixed with the enum name. For example:

```protobuf
enum Foo {
  FOO_UNSPECIFIED = 0;
  FOO_ONE = 1;
}
```

Protobuf enums use C++ scoping rules, which makes it impossible to have two enums in the same package with the same enum value name (an exception is when enums are nested, in which case this rule applies within the given message). Though you might assume that a given enum value name is always unique across a package, schemas can develop over years, and there are countless examples of developers having to compromise on their enum names due to backwards compatibility issues. For example, you might have this enum:

```protobuf{6}
enum Scheme {
  // Right off the bat, you can't use "UNSPECIFIED" in multiple enums
  // in the same package, so you always would have to prefix this anyway.
  SCHEME_UNSPECIFIED = 0;
  HTTP = 1;
  HTTPS = 2;
  ...
}
```

Two years later, you have an enum in the same package you want to add, but can't:

```protobuf{6}
// This is a made up example, bear with us.
enum SecureProtocol {
  SECURE_PROTOCOL_UNSPECIFIED = 0;
  // If this enum is in the same package as Scheme, this produces
  // a protoc compile-time error!
  HTTPS = 1;
  ...
}
```

### `ENUM_VALUE_UPPER_SNAKE_CASE`

**Categories:** `BASIC`, `STANDARD`This rule checks that enum values are UPPER_SNAKE_CASE.

### `ENUM_ZERO_VALUE_SUFFIX`

**Categories:** `STANDARD`This rule requires that all enum values have a zero value with a defined suffix. By default, it verifies that the zero value of all enums ends in `_UNSPECIFIED`, but the suffix is [configurable](../overview/).

```protobuf
enum Foo {
  FOO_UNSPECIFIED = 0;
}
```

All enums should have a zero value. `proto3` doesn't differentiate between set and unset fields, so if an enum field isn't explicitly set, it defaults to the zero value. If an explicit zero value isn't part of the enum definition, this defaults to the actual zero value of the enum. For example, if you had the following `.proto` file, any `Uri` with `scheme` not explicitly set defaults to `SCHEME_FTP`:

```protobuf
enum Scheme {
  // *** don't DO THIS ***
  SCHEME_FTP = 0
}

message Uri {
  Scheme scheme = 1;
}
```

### `FIELD_LOWER_SNAKE_CASE`

**Categories:** `BASIC`, `STANDARD`This rule checks that field names are lower_snake_case.

### `FIELD_NOT_REQUIRED`

**Categories:** `BASIC`, `STANDARD`This rule checks that field isn't configured as required. This means that using the "required" label in proto2 sources isn't allowed and using the feature `field_presence = LEGACY_REQUIRED` isn't allowed in Editions sources.

::: tip This is a new rule that can only be used with `v2` configuration files.

:::

### `FILE_LOWER_SNAKE_CASE`

**Categories:** `STANDARD`This rule says that all `.proto` files must be named as `lower_snake_case.proto`. This is the widely accepted standard.

### `IMPORT_NO_PUBLIC`

**Categories:** `BASIC`, `STANDARD`This rule outlaws declaring imports as `public`. If you didn't know that was possible, forget what you just learned in this sentence.

### `IMPORT_NO_WEAK`

**Categories:** `BASIC`, `STANDARD`Similar to the `IMPORT_NO_PUBLIC` rule, this rule outlaws declaring imports as `weak`. If you didn't know that was possible, forget what you just learned in this sentence.

### `IMPORT_USED`

**Categories:** `BASIC`, `STANDARD`This rule checks that all the imports declared across your Protobuf files are actually used. This `.proto` file, for example, fails:

```protobuf
syntax = "proto3";

package payments.v1;

import "product.proto"; // Unused import

message Payment {
  string payment_id = 1;
  // other fields
}
```

### `MESSAGE_PASCAL_CASE`

**Categories:** `BASIC`, `STANDARD`This rule checks that messages are PascalCase.

### `ONEOF_LOWER_SNAKE_CASE`

**Categories:** `BASIC`, `STANDARD`This rule checks that oneof names are lower_snake_case.

### `PACKAGE_DEFINED`

**Categories:** `MINIMAL`, `BASIC`, `STANDARD`This rule checks that all files have a package declaration.

### `PACKAGE_DIRECTORY_MATCH`

**Categories:** `MINIMAL`, `BASIC`, `STANDARD`This rule checks that all files are in a directory that matches their package name.

### `PACKAGE_LOWER_SNAKE_CASE`

**Categories:** `BASIC`, `STANDARD`This rule checks that packages are lower_snake_case.

### `PACKAGE_NO_IMPORT_CYCLE`

**Categories:** `STANDARD` (only for `v2` configuration files, otherwise uncategorized)This rule detects package import cycles. The Protobuf compiler outlaws circular file imports, but it's still possible to introduce package cycles, such as these:

```text
.
├── bar
│   ├── four.proto
│   └── three.proto
└── foo
    ├── one.proto
    └── two.proto
```

```protobuf
# foo/one.proto
syntax = "proto3";

package foo;

import "bar/three.proto";

message One {
    bar.Three three = 3;
}
```

```protobuf
# bar/four.proto
syntax = "proto3";

package bar;

import "foo/one.proto";

message Four {
    foo.One one = 1;
}
```

These packages successfully compile, but this file structure introduces problems for languages that rely on package-based imports, such as Go. If possible, **this rule should always be configured**.

### `PACKAGE_SAME_<file_option>`

**Categories:** `BASIC`, `STANDARD`The Buf CLI doesn't lint file option values, as explained in the [What we left out](#what-we-left-out) section below. However, it's important to have consistent file option values across all files in a given Protobuf package if you do use them.

- `PACKAGE_SAME_CSHARP_NAMESPACE` checks that all files with a given package have the same value for the `csharp_namespace` option.
- `PACKAGE_SAME_GO_PACKAGE` checks that all files with a given package have the same value for the `go_package` option.
- `PACKAGE_SAME_JAVA_MULTIPLE_FILES` checks that all files with a given package have the same value for the `java_multiple_files` option.
- `PACKAGE_SAME_JAVA_PACKAGE` checks that all files with a given package have the same value for the `java_package` option.
- `PACKAGE_SAME_PHP_NAMESPACE` checks that all files with a given package have the same value for the `php_namespace` option.
- `PACKAGE_SAME_RUBY_PACKAGE` checks that all files with a given package have the same value for the `ruby_package` option.
- `PACKAGE_SAME_SWIFT_PREFIX` checks that all files with a given package have the same value for the `swift_prefix` option.

Each of these rules verify that if a given file option is used in one file in a given package, it's used in every file in that package.For example, if you have file `foo_one.proto`:

```protobuf
// foo_one.proto
syntax = "proto3";

package foo.v1;

option go_package = "foov1";
option java_multiple_files = true;
option java_package = "com.foo.v1";
```

Another file `foo_two.proto` with package `foo.v1` must have these three options set to the same value, and the other options unset:

```protobuf
// foo_two.proto
syntax = "proto3";

package foo.v1;

option go_package = "foov1";
option java_multiple_files = true;
option java_package = "com.foo.v1";
```

### `PACKAGE_SAME_DIRECTORY`

**Categories:** `MINIMAL`, `BASIC`, `STANDARD`This rule checks that all files with a given package are in the same directory.

### `PACKAGE_VERSION_SUFFIX`

**Categories:** `STANDARD`This rule enforces that the last component of a package must be a version of the form `v\d+, v\d+test.*, v\d+(alpha|beta)\d*, or v\d+p\d+(alpha|beta)\d*`, where numbers are >=1.Valid examples:

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

One of the core promises of Protobuf schema development is to never have breaking changes in your APIs. There are scenarios, however, where you do want to properly version your schema. Instead of making changes, the proper method is to make a completely new Protobuf package that's a copy of your existing Protobuf package, serve both packages server-side, and manually migrate your callers. This rule enforces that all packages have a version attached so that it's clear when a package represents a new version.

### `PROTOVALIDATE`

**Categories:** `STANDARD`This rule requires that all [`protovalidate`](https://github.com/bufbuild/protovalidate#readme) constraints specified are valid.For a [`buf.validate.field`](https://buf.build/bufbuild/protovalidate/docs/main:buf.validate#buf.validate.FieldConstraints) to be valid, it must ensure:

- `ignore` is the only option if set to `IGNORE_ALWAYS`
- `required` can not be set if `ignore` is set to `IGNORE_IF_UNPOPULATED`.
- `required` isn't set if the field belongs to a `oneof`.
- Neither `required` is set or `ignore` is set to `IGNORE_IF_UNPOPULATED` if the field is an extension.
- Its [CEL constraints](https://buf.build/bufbuild/protovalidate/docs/main:buf.validate#buf.validate.Constraint) are valid.
- Its type specific rules, such as `(buf.validate.field).int32`, are valid.

For a [`buf.validate.message`](https://buf.build/bufbuild/protovalidate/docs/main:buf.validate#buf.validate.MessageConstraints) to be valid, it must ensure:

- `disabled` is the only field if set.
- Its CEL constraints are valid.

For a set of CEL constraints on a message or field to be valid, each constraint must:

- Have a CEL expression that compiles successfully and evaluates to a string or boolean. These are the only two types that the `protovalidate` runtime allows, and it's a runtime error for a CEL expression to evaluate to another type.
- Have a non-empty `message` if the CEL expression evaluates to a boolean value. This `message` is used by the `protovalidate` runtime report validation failure.
- Have an empty `message` if the CEL expression evaluates to a string value. The validation failure message in this case is the value this CEL expression evaluates to, while `message` won't be used in any way.
- Have a non-empty `id`, consisting of only alphanumeric characters, `_`, `-` and `.`. The `id` must be unique within the `buf.validate.message` or `buf.validate.field` it's specified on. A unique `id` is useful for debugging and locating the CEL constraint that fails, and can be used as a key for i18n.

For a set of rules specified on a field, such as `(buf.validate.field).int32`, to be valid, it must additionally:

- Have a type compatible with the type it validates: `(buf.validate.field).int32` rules can only be set on a field of type `int32` or `google.protobuf.Int32Value`. A type mismatch causes a runtime error.
- Permit _some_ value: setting `contains: "foo"` and `not_contains: "foo"` isn't valid because it rejects all values.
- Have no obviously redundant rules. For example, it's redundant to set `lt: 5` and `const: 3`.

#### Numeric rules, timestamp rules and duration rules

- The field to validate must match the rules type or its corresponding wrapper type (if any).
- If a lower bound (`gt` or `gte`) and an upper bound(`lt` or `lte`) are both specified, they must not be equal. If they're both inclusive (`gte` and `lte`), they must be replaced by `const`. Otherwise, all values are invalid.
- Durations and timestamps defined in options, such as `(buf.validate.field).timestamp.lt`, must be valid.
- If the rule is `timestamp`:
  - `within` must be a positive duration.
  - `lt_now` and `gt_now` must not both be specified.

#### String rules

- The field to validate must be `string` or `google.protobuf.StringValue`.
- If `len` is specified, `min_len` or `max_len` must not be specified. If both are specified, `min_len` must be lower than `max_len`.
- If `len_bytes` is specified, `min_bytes` or `max_bytes` must not be specified. If both are specified, `min_bytes` must be lower than `max_bytes`.
- If `min_len` and `max_bytes` are both defined, `min_len` must be less than or equal to `max_bytes`. It's impossible for a string to have 3 or more UTF-8 characters while having less than 2 bytes.
- If `min_bytes` and `max_len` are both defined, `min_bytes` must be less than or equal to 4 times `max_len`. It's impossible for a string to have 2 or less UTF-8 characters while having 9 or more bytes, since each UTF-8 character takes at most 4 bytes.
- If `prefix`, `suffix`, or `contains` is specified, its length must not exceed `max_len` and `max_bytes`. Otherwise, all values are invalid.
- Any value of `prefix`, `suffix` and `contains` must not contain, or be a substring of `not_contains`, if they're both specified.
- If `strict` is set to false, `well_known_regex` must also be specified.
- If `pattern` is specified, is must be a valid regular expression in [RE2 syntax](https://github.com/google/re2/wiki/Syntax).

#### Bytes rules

- The field to validate must be `bytes` or `google.protobuf.BytesValue`.
- If `len` is specified, `min_len` or `max_len` must not be specified. If both are specified, `min_len` must be lower than `max_len`.
- If any of `prefix`, `suffix` and `contains` is specified, its length must not exceed `max_len`. Otherwise, all values are invalid.
- If `pattern` is specified, is must be a valid regular expression in [RE2 syntax](https://github.com/google/re2/wiki/Syntax).

#### Map rules

- The field to validate must be a map.
- `min_pairs` must not be higher than `max_pairs`.
- The set of rules in `keys` must be valid and compatible with the map field's key type.
- The set of rules in `values` must be valid and compatible with the map field's value type.

#### Repeated rules

- The field to validate must have label `repeated`.
- `min_items` must not be higher than `max_items`.
- The set of rules in `items` must be compatible with the field's type.
- If `unique` is set to true, the field must be a scalar or a [wrapper type](https://buf.build/protocolbuffers/wellknowntypes/file/main:google/protobuf/wrappers.proto).

### `RPC_NO_CLIENT_STREAMING`

**Categories:** `UNARY_RPC`This rule checks that RPCs aren't client streaming.

### `RPC_NO_SERVER_STREAMING`

**Categories:** `UNARY_RPC`This rule checks that RPCs aren't server streaming.

### `RPC_PASCAL_CASE`

**Categories:** `BASIC`, `STANDARD`This rule checks that RPCs are PascalCase.

### `RPC_REQUEST_STANDARD_NAME` `RPC_RESPONSE_STANDARD_NAME` `RPC_REQUEST_RESPONSE_UNIQUE`

**Categories:** `STANDARD`These rules enforce the message name of RPC request/responses, and that all request/responses are unique.**One of the single most important rules to enforce in modern Protobuf development is to have a unique request and response message for every RPC.** Separate RPCs shouldn't have their request and response parameters controlled by the same Protobuf message, and if you share a Protobuf message between multiple RPCs, this results in multiple RPCs being affected when fields on this Protobuf message change. **Even in straightforward cases**, best practice is to always have a wrapper message for your RPC request and response types. The Buf CLI enforces this with these three rules by verifying that:

- All request and response messages are unique across your Protobuf schema.
- All request and response messages are named after the RPC, either by naming them `MethodNameRequest`, `MethodNameResponse` or `ServiceNameMethodNameRequest`, `ServiceNameMethodNameResponse`.

This service definition, for example, abides by these rules:

```protobuf
// request/response message definitions omitted for brevity

service FooService {
  rpc Bar(BarRequest) returns (BarResponse) {}
  rpc Baz(FooServiceBazRequest) returns (FooServiceBazResponse) {}
}
```

Though we **don't** recommend it, we provide a few configuration options to loosen these restrictions somewhat:

- [`rpc_allow_same_request_response`](../../configuration/v2/buf-yaml/#rpc_allow_same_request_response)
- [`rpc_allow_google_protobuf_empty_requests`](../../configuration/v2/buf-yaml/#rpc_allow_google_protobuf_empty_requests)
- [`rpc_allow_google_protobuf_empty_responses`](../../configuration/v2/buf-yaml/#rpc_allow_google_protobuf_empty_responses)

### `SERVICE_PASCAL_CASE`

**Categories:** `BASIC`, `STANDARD`This rule checks that services are PascalCase.

### `SERVICE_SUFFIX`

**Categories:** `STANDARD`This rule enforces that all services are suffixed with `Service`. For example:

```protobuf
service FooService {}
service BarService {}
service BazService {}
```

Service names inherently end up having a lot of overlap with package names, and service naming often ends up inconsistent as a result across a larger Protobuf schema. Enforcing a consistent suffix takes away some of this inconsistency.The suffix is [configurable](../overview/). For example, if you have this configuration in your `buf.yaml`:

::: info buf.yaml

```yaml
version: v2
lint:
  service_suffix: Endpoint
```

:::

then the `SERVICE_SUFFIX` rule enforces this naming instead:

```protobuf
service FooEndpoint {}
service BarEndpoint {}
service BazEndpoint {}
```

### `STABLE_PACKAGE_NO_IMPORT_UNSTABLE`

**Categories:** noneThis rule checks that all files that have stable versioned packages (e.g. `v1`) do not import packages with unstable version packages (e.g. `alpha`, `beta`, `v1alpha1`).

### `SYNTAX_SPECIFIED`

**Categories:** `BASIC`, `STANDARD`This rule checks that all files have a syntax specified.

## What we left out

We think that the above lint rules represent a set that sufficiently enforces consistent and maintainable Protobuf schemas, while still enabling your organization to make design decisions. However, there are some rules we purposefully didn't write that deserve mention.

### File option values

The Buf CLI doesn't include linting for specific file option values. It's not that we don't think consistency across these file options is important — in fact, we think it simplifies Protobuf stub consumption. One of our core principles is that **language-specific file options shouldn't be part of your core Protobuf schema**. Your Protobuf schema should only describe language-independent elements as much as possible.The values for most file options, in fact, should be deduced in a stable and deterministic manner. For example, we think that `java_package` should likely be a constant prefix followed by the package name as a suffix. Your `go_package` should use the last component of your package name. And `java_multiple_files` should always be `true`. These aren't defaults for backwards-compatibility reasons, but if you're using a tool like the Buf CLI to produce your stubs, you shouldn't have to think about any of this.This is exactly why we created [managed mode](../../generate/managed-mode/), which sets all of these file options _on the fly_ with `buf generate`.The Buf CLI still enforces that specific file options are the same across a given package through the `BASIC` and `STANDARD` categories described above. We do find this to be important, regardless of what values you choose. Fortunately, with managed mode you can remove file option declarations from your Protobuf files altogether.

### Custom options

There are no lint rules for widely used custom options such as [google.api options](https://github.com/googleapis/googleapis/tree/master/google/api) or [protoc-gen-validate](https://github.com/envoyproxy/protoc-gen-validate/blob/master/validate/validate.proto). We currently only support the standard set of file options. [Contact us](../../contact/) if this is a big need for your organization.

### Naming opinions

We stay away from enforcing naming opinions, such as package name restrictions (beyond versioning requirements and `lower_snake_case`), or field naming such as `google.protobuf.Duration` name standardization. This is to provide maximum usefulness of the `STANDARD` category out of the box.

## Adding or requesting new rules

If you'd like a new rule added, [contact us](../../contact/) to discuss it. We'll add rules if we think they're maintainable and could have widespread value. Most rules can be easily added, and although [Buf is OSS](https://github.com/bufbuild/buf), it's usually more efficient for us to add it ourselves.

## Style guide

The [style guide](../../best-practices/style-guide/) provides a concise document that includes all rules in the [`STANDARD`](#standard) category, as well as additional recommendations that aren't enforced by the linter. We provide this for ease of consumption across your teams.
