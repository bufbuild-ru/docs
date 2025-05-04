---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/protovalidate/schemas/standard-rules/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/protovalidate/schemas/adding-protovalidate/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/protovalidate/schemas/custom-rules/"
  - - meta
    - property: "og:title"
      content: "Standard rules - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/protovalidate/schemas/standard-rules.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/protovalidate/schemas/standard-rules/"
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
      content: "Standard rules - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/protovalidate/schemas/standard-rules.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Using Protovalidate standard rules

Once you've [added Protovalidate to your project](../adding-protovalidate/), you're ready to begin adding validation rules to your Protobuf files. On this page, you'll learn how rules are defined and explore the standard rules for scalar types, `oneofs`, `maps`, `enums`, and even entire messages.

::: info Code available
Companion code for this page is available in [GitHub](https://github.com/bufbuild/buf-examples/tree/main/protovalidate/rules-standard).
:::

## Protovalidate rules

Protovalidate rules are Protobuf option annotations representing validation rules and business requirements. When a message is validated, every rule must pass for it to be considered valid.All Protovalidate rules are defined in the [Common Expression Language (CEL)](https://cel.dev/). Protovalidate's built-in rules provide a shorthand syntax for dozens of common validation rules, and you're free to [examine their CEL definitions](https://buf.build/bufbuild/protovalidate/docs/main:buf.validate) within the API itself.On this page, we'll explore Protovalidate's built-in rules, starting with simple scalar fields.

## Field rules

Field rules are the simplest and most commonly used Protovalidate rules. A field rule applies one requirement to one field in a message.For example, you can require that `first_name` meet a minimum length:

::: info Simple field rule

```protobuf
message User {
    string first_name = 1 [
        (buf.validate.field).string.min_len = 1
    ];
}
```

:::

### Multiple rules

You can combine field rules to express a complete set of requirements:

::: info Multiple field rules

```protobuf
message User {
    string first_name = 1 [
        (buf.validate.field).string.min_len = 1,
        (buf.validate.field).string.max_len = 50
    ];
}
```

:::

### Scalar (simple) rules

Scalar fields — `bool`, `string`, `bytes`, and numeric types — are the simplest to validate. Protovalidate's standard rules handle most common validation requirements, including regular expression matching.

::: info Scalar rule examples

```protobuf
message User {
    string name = 1 [
        (buf.validate.field).string.min_len = 1,
        (buf.validate.field).string.max_len = 100
    ];
    string email = 2 [(buf.validate.field).string.email = true];
    bool verified = 3 [(buf.validate.field).bool.const = true];
    bytes password = 4 [(buf.validate.field).bytes.pattern = "^[a-zA-Z0-9]*$"];
}
```

:::

View reference documentation for each scalar type's rules:

- [bool](../../../reference/protovalidate/rules/bool_rules/)
- [string](../../../reference/protovalidate/rules/string_rules/)
- [bytes](../../../reference/protovalidate/rules/bytes_rules/)
- [double](../../../reference/protovalidate/rules/double_rules/), [fixed32](../../../reference/protovalidate/rules/fixed32_rules/), [fixed64](../../../reference/protovalidate/rules/fixed64_rules/), [float](../../../reference/protovalidate/rules/float_rules/), [int32](../../../reference/protovalidate/rules/int32_rules/), [int64](../../../reference/protovalidate/rules/int64_rules/), [sfixed32](../../../reference/protovalidate/rules/sfixed32_rules/), [sfixed64](../../../reference/protovalidate/rules/sfixed64_rules/), [sint32](../../../reference/protovalidate/rules/sint32_rules/), [sint64](../../../reference/protovalidate/rules/sint64_rules/), [uint32](../../../reference/protovalidate/rules/uint32_rules/), [uint64](../../../reference/protovalidate/rules/uint64_rules/)

### Enum rules

Protovalidate provides validation rules for `enum` types, allowing you to validate that a message's value is within the defined values (`defined_only`), in a set of values (`in`), not within a set of values (`not_in`), and more.

::: info Enum rule example

```protobuf
message Order {
    enum Status {
        STATUS_UNSPECIFIED = 0;
        STATUS_PENDING = 1;
        STATUS_PROCESSING = 2;
        STATUS_SHIPPED = 3;
        STATUS_CANCELED = 4;
    }

    // `status` should only allow values within the Status enum.
    Status status = 1 [
        (buf.validate.field).enum.defined_only = true
    ];
}
```

:::

View reference documentation for [enum rules](../../../reference/protovalidate/rules/enum_rules/).

### Repeated rules

Repeated fields can be validated for minimum and maximum length, uniqueness, and even have their contents validated. In this example, a repeated field must meet a minimum number of items, and each item must meet a set of string rules:

::: info Repeated rule example

```protobuf
message RepeatedExample {
    repeated string terms = 1 [
        (buf.validate.field).repeated.min_items = 1,
        (buf.validate.field).repeated.items = {
            string: {
                min_len: 5
                max_len: 20
            }
        }
    ];
}
```

:::

View reference documentation for [repeated rules](../../../reference/protovalidate/rules/repeated_rules/).

### Map rules

Protovalidate's `map` rules provide common `map` validation tasks. You can validate minimum or maximum numbers of key-value pairs and even express sets of rules applied to keys and values.In this example, each value in a map must meet a minimum and maximum length, and the map must have at least one key-value pair:

::: info Map rule example

```protobuf
message MapExample {
    map<string, string> terms = 1 [
        (buf.validate.field).map.min_pairs = 1,
        (buf.validate.field).map.values = {
            string: {
                min_len: 5
                max_len: 20
            }
        }
    ];
}
```

:::

View reference documentation for [map rules](../../../reference/protovalidate/rules/map_rules/).

### Oneof rules

Protovalidate currently provides a single `oneof` rule: `required`. It states that exactly one field in the `oneof` must be set. Note that fields within the `oneof` may have their own rules applied. In this example, `a` or `b` must be set, but any `a` value must be non-empty:

::: info Oneof rule example

```protobuf
message OneofExample {
    oneof value {
        // Either `a` or `b` must be set. If `a` is set, it must also be
        // non-empty; whereas if `b` is set, it can still be an empty string.
        option (buf.validate.oneof).required = true;
        string a = 1 [(buf.validate.field).string.min_len = 1];
        string b = 2;
    }
}
```

:::

View reference documentation for [oneof rules](../../../reference/protovalidate/rules/oneof_rules/).

### Well-Known Type rules

Protovalidate provides standard rules for [Protobuf's Well-Known Types](https://protobuf.dev/reference/protobuf/google.protobuf/) such as `Any`, `Duration`, and `Timestamp`:

::: info Well-Known Type rules

```protobuf
message Event {
    google.protobuf.Any data = 1 [
        (buf.validate.field).any.required = true
    ];
    google.protobuf.Duration duration = 2 [
        (buf.validate.field).duration.gte = "1s",
        (buf.validate.field).duration.lte = "1h"
    ];
    google.protobuf.Timestamp timestamp = 3 [
        (buf.validate.field).timestamp.lte = "2021-01-01T00:00:00Z"
    ];
}
```

:::

View reference documentation for each well-known type's rules:

- [timestamp](../../../reference/protovalidate/rules/timestamp_rules/)
- [duration](../../../reference/protovalidate/rules/duration_rules/)
- [any](../../../reference/protovalidate/rules/any_rules/)

## Message rules

The last type of standard rule is the `buf.validate.message` option. The only standard rules provided are `disabled` and `cel`.The `disabled` rule causes the entire message to be ignored by Protovalidate:

::: info Disabling validation for a message

```protobuf
message DisableValidationMessage {
    option (buf.validate.message).disabled = true;
}
```

:::

The `cel` rule provides the foundation for custom validation rules capable of evaluating multiple fields within a message:

::: info Message-level CEL rule example

```protobuf
message CelRuleExample {
    // `first_name + last_name` cannot exceed 100 characters in length.
    option (buf.validate.message).cel = {
        id: "name.total.length",
        message: "first_name and last_name, combined, cannot exceed 100 characters"
        expression: "this.first_name.size() + this.last_name.size() < 100"
    };

    string first_name = 1;
    string last_name = 2;
}
```

:::

View reference documentation for [message rules](../../../reference/protovalidate/rules/message_rules/).

## Nested messages

Protovalidate validates the entire message, including nested messages.

### Ignoring

You can ignore nested messages by adding the `ignore` rule using a value from the [Ignore enum](https://buf.build/bufbuild/protovalidate/docs/main:buf.validate#buf.validate.Ignore).

```diff
message Person {
    string name = 1 [(buf.validate.field).required = true];
-    Address address = 2 [(buf.validate.field).required = true];
+    Address address = 2 [
+        (buf.validate.field).ignore = IGNORE_ALWAYS
+    ];
}
```

View reference documentation for the [ignore enum](https://buf.build/bufbuild/protovalidate/docs/main:buf.validate#buf.validate.Ignore).

## Next steps

- Learn to validate domain logic with CEL-based [custom rules](../custom-rules/).
