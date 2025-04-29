---

title: "Custom rules - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/protovalidate/schemas/custom-rules/"
  - - meta
    - property: "og:title"
      content: "Custom rules - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/protovalidate/schemas/custom-rules/"
  - - meta
    - property: "twitter:title"
      content: "Custom rules - Buf Docs"

---

# Custom CEL rules

When validation logic can't be expressed with [standard rules](../standard-rules/), Protovalidate allows you to write custom rules in [Common Expression Language (CEL)](http://cel.dev). With CEL rules, you can integrate complex domain knowledge into your schema.

Code availableCompanion code for this page is available in [GitHub](https://github.com/bufbuild/buf-examples/tree/main/protovalidate/rules-custom).

## Introduction to CEL expressions

CEL rules allow you to go beyond static rules and embed validation code in your schemas by writing CEL expressions. They use a JavaScript-like syntax and are easy to write and understand:

- `this < 100`: Validate that a `uint32` is less than `100`.
- `this != 'localhost'`: Validate that a `string` isn't `localhost`.

### CEL functions

CEL functions allow CEL expressions to do much more than simple comparisons. You can create complex, real-world rules that are difficult or impossible to express in a standard rule:

- `!this.isInf()`: A `double` can't be infinity.
- `this.isHostname()`: A `string` must be a valid `hostname`.
- `this <= duration('23h59m59s')`: A `Duration` must be less than a day.

Protovalidate includes the [common library of CEL functions](https://github.com/google/cel-spec/blob/master/doc/langdef.md#functions) and its own unique [extension functions](../../../reference/protovalidate/cel_extensions/).

### Message-level CEL

Validity is often a function of multiple fields. In these scenarios, CEL expressions can be used at the message level:

- `this.min_bedroom_count <= this.max_bedroom_count`: When searching for an apartment, the minimum bedroom value must be less than the maximum bedroom value.
- `this.require_even == false || size(this.numbers.filter(i, i % 2 == 0)) > 0`: Combining multiple fields, simple CEL functions, and advanced functions like `filter()`, require that one number in a `repeated int32` is even, but only when `require_even` is `true`.

With CEL available at the field and message levels, it's hard to think of validation rules that can't be expressed within Protobuf files.

::: tip NoteLearn how to create complex CEL expressions in [advanced CEL rules](../../cel/).

:::

## Creating field rules

Adding custom field rules is native Protobuf—custom rules are just field options. Their structure is defined by the [`Constraint`](https://buf.build/bufbuild/protovalidate/docs/main:buf.validate#buf.validate.Constraint) message's three fields:

- `id`: A unique (within the field) identifier for this rule.
- `message`: An optional human-readable message to return when this rule fails.
- `expression`: A CEL expression to evaluate, returning either a `bool` or a `string`. If a non-empty string is returned, validation is assumed to have failed and the string overrides any `message`.

This makes it easy to turn the `this.isHostname()` example into a custom rule:

::: info Custom field rule example

```protobuf
message DeviceInfo {
  string hostname = 1 [(buf.validate.field).cel = {
    id: "hostname.ishostname"
    message: "hostname must be valid"
    expression: "this.isHostname()"
  }];
}
```

:::

::: tip What is "this?"Within field-level custom rules, `this` refers to the value of the field. For more information about `this`, see [advanced CEL rules](../../cel/).

:::

### Combining field rules

Just like standard rules, you can freely combine custom rules with other custom or standard rules:

::: info Combining custom and standard rules

```protobuf
message DeviceInfo {
    string hostname = 1 [
        // Required: minimum length of one.
        (buf.validate.field).string.min_len = 1,

        // The value must be a validate hostname.
        (buf.validate.field).cel = {
            id: "hostname.ishostname"
            message: "hostname must be valid"
            expression: "this.isHostname()"
        },

        // Reject "localhost" as invalid.
        (buf.validate.field).cel = {
            id: "hostname.notlocalhost"
            message: "localhost is not permitted"
            expression: "this != 'localhost'"
        }
    ];
}
```

:::

## Creating message rules

Message-level custom rules work almost identically to field-level custom rules but have two notable differences:

1.  Their `id` values must be unique within the message.
2.  Within their CEL expressions, `this` refers to the message itself. Properties within the message can be accessed via dot notation.

Because message rules can access multiple properties at once, they can express more complex validation logic than field rules. For example, multiple field values can be combined with CEL functions to enforce a validation rule requiring that a request for an indirect flight doesn't result in a trip longer than 48 hours:

::: info Example multi-field message rule

```protobuf
message IndirectFlightRequest {
    // The sum of both flight durations and the layover must not exceed
    // a maximum duration of 48 hours.
    option (buf.validate.message).cel = {
        id: "trip.duration.maximum"
        message: "the entire trip must be less than 48 hours"
        expression:
            "this.first_flight_duration"
            "+ this.second_flight_duration"
            "+ this.layover_duration < duration('48h')"
    };

    google.protobuf.Duration first_flight_duration = 1;
    google.protobuf.Duration layover_duration = 2;
    google.protobuf.Duration second_flight_duration = 3;
}
```

:::

## Next steps

- Reuse custom rules across your project with [predefined rules](../predefined-rules/).
- Learn more about [Protovalidate's relationship with CEL](../../cel/).
