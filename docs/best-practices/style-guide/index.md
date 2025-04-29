---

title: "Style guide - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/best-practices/style-guide/"
  - - meta
    - property: "og:title"
      content: "Style guide - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/best-practices/style-guide/"
  - - meta
    - property: "twitter:title"
      content: "Style guide - Buf Docs"

---

# Style guide

This is Buf's style guide for Protobuf. It's a purposefully concise reference for developers to refer to when writing Protobuf schemas. The Buf Schema Registry doesn't enforce these recommendations.The requirements follow the [`STANDARD`](../../lint/rules/#standard) lint category in the Buf CLI. For details on each rule and its rationale, see that documentation. Within this style guide, each check provides a **(Why?)** link where relevant.The style guide helps provide consistency and maintainability across a Protobuf schema of any size and purpose, without restricting organizations from making the design decisions they need to make for their individual APIs.

## Requirements

### Files and packages

All files should have a package defined. [(Why?)](../../lint/rules/#minimal)All files of the same package should be in the same directory. All files should be in a directory that matches their package name. [(Why?)](../../lint/rules/#minimal)For example, with this [module](../../cli/modules-workspaces/) defined in the `proto` directory, expect these `package` values:

```text
.
├── buf.yaml
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

Packages should be in `lower_snake_case` format. [(Why?)](../../lint/rules/#package_lower_snake_case)The last component of a package should be a version. [(Why?)](../../lint/rules/#package_version_suffix)Filenames should be in `lower_snake_case.proto` format. [(Why?)](../../lint/rules/#file_lower_snake_case)All of the file options below should have the same value, or all be unset, for all files that have the same package: [(Why?)](../../lint/rules/#package_same_file_option)

- `csharp_namespace`
- `go_package`
- `java_multiple_files`
- `java_package`
- `php_namespace`
- `ruby_package`
- `swift_prefix`

For example, given a file `foo_one.proto`:

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

### Imports

Don't declare imports as `public` or `weak`. [(Why?)](../../lint/rules/#import_no_weak)

### Enums

Enums shouldn't have the `allow_alias` option set. [(Why?)](../../lint/rules/#enum_no_allow_alias)Enum names should be `PascalCase`. [(Why?)](../../lint/rules/#enum_pascal_case)Enum value names should be `UPPER_SNAKE_CASE`. [(Why?)](../../lint/rules/#enum_value_upper_snake_case)Prefix enum value names with the `UPPER_SNAKE_CASE` of the enum name. [(Why?)](../../lint/rules/#enum_value_prefix). For example, given the enum `FooBar`, prefix all enum value names with `FOO_BAR_`.Suffix the zero value for all enums with `_UNSPECIFIED`. [(Why?)](../../lint/rules/#enum_zero_value_suffix) The suffix is configurable. For example, given the enum `FooBar`, the zero value should be `FOO_BAR_UNSPECIFIED = 0;`.

### Messages

Message names should be `PascalCase`. [(Why?)](../../lint/rules/#message_pascal_case)Field names should be `lower_snake_case`. [(Why?)](../../lint/rules/#field_lower_snake_case)Oneof names should be `lower_snake_case`. [(Why?)](../../lint/rules/#oneof_lower_snake_case)

### Services

Service names should be `PascalCase`. [(Why?)](../../lint/rules/#service_pascal_case)Suffix service names with `Service`. [(Why?)](../../lint/rules/#service_suffix) The suffix is configurable.RPC names should be `PascalCase`. [(Why?)](../../lint/rules/#rpc_pascal_case)All RPC request and responses messages should be unique across your Protobuf schema. [(Why?)](../../lint/rules/#rpc_request_response)Name all RPC request and response messages after the RPC, either by naming them `MethodNameRequest`, `MethodNameResponse` or `ServiceNameMethodNameRequest`, `ServiceNameMethodNameResponse`. [(Why?)](../../lint/rules/#rpc_request_response)

#### Use of the `Empty` Well Known Type as a request and response type

Using a separate request and response message for each RPC gives you maximum flexibility to evolve your RPCs without breaking backward compatibility. This applies to Protobuf in general—both gRPC and ConnectRPC.As a consequence, you shouldn't import and use `Empty` if your RPC doesn't happen to have any request or response data yet. You should instead define a custom empty request and/or response message per RPC. That way, when your request or response message does eventually contain fields, you can add them without fear of breaking changes.If you're trying to model an empty message (as opposed to a message whose shape you're not yet sure about) and you're sure the message will always remain empty, then using `Empty` is fine. However, using custom empty request and response types is much more future-proof.If you want to use `Empty` and you're using the Buf CLI to lint, you should set the corresponding flags in your `buf.yaml` file to avoid lint errors:

::: info buf.yaml with flags set to allow Empty

```yaml
version: v2
lint:
  use:
    - STANDARD
  rpc_allow_google_protobuf_empty_requests: true // [!code highlight]
  rpc_allow_google_protobuf_empty_responses: true // [!code highlight]
```

:::

## Recommendations

While not strictly related to style, you should always set up breaking change detection for your Protobuf schema. See the [breaking change detection documentation](../../breaking/overview/) for more details on how Buf helps enforce this.Use `//` instead of `/* */` for comments.Over-document, and use complete sentences for comments. Put documentation above the type, instead of inline.Avoid widely used keywords for all types, especially packages. For example, if your package name is `foo.internal.bar`, the `internal` component blocks importing the generated stubs in other packages for Go.Lay out files in this order (this matches [Google's current recommendations](https://protobuf.dev/programming-guides/style/#file-structure)), and the [`buf format`](../../format/style/) command checks for all but the first two:

- License header (if applicable)
- File overview
- Syntax
- Package
- Imports (sorted)
- File options
- Everything else

Use pluralized names for repeated fields.Name fields after their type as much as possible. For example, for a field of message type `FooBar`, name the field `foo_bar` unless there is a specific reason to do otherwise.Avoid using nested enums and nested messages. You may end up wanting to use them outside of their context message in the future, even if you don't think so at the moment.Avoid streaming RPCs. They're difficult to implement and call, and they often require special configuration in proxies, firewall rules, and other network infrastructure. Polling and pagination are usually much simpler and nearly as efficient. For the handful of cases where streaming RPCs are worth the complexity, add exceptions to your lint configuration.
