---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/protovalidate/violations/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/internal-compiler/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/any_rules/"
  - - meta
    - property: "og:title"
      content: "Violations - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/violations.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/protovalidate/violations/"
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
      content: "Violations - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/violations.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Violations messages

## Violations Message

`Violations` is a collection of `Violation` messages. This message type is returned by protovalidate when a proto message fails to meet the requirements set by the `Rule` validation rules. Each individual violation is represented by a `Violation` message.

### violations

`violations` is a repeated field that contains all the `Violation` messages corresponding to the violations detected.

## Violation Message

`Violation` represents a single instance where a validation rule, expressed as a `Rule`, was not met. It provides information about the field that caused the violation, the specific rule that wasn't fulfilled, and a human-readable error message.

```json
{
  "fieldPath": "bar",
  "ruleId": "foo.bar",
  "message": "bar must be greater than 0"
}
```

### field

`field` is a machine-readable path to the field that failed validation. This could be a nested field, in which case the path will include all the parent fields leading to the actual field that caused the violation.For example, consider the following message:

```proto
message Message {
  bool a = 1 [(buf.validate.field).required = true];
}
```

It could produce the following violation:

```text
violation {
  field { element { field_number: 1, field_name: "a", field_type: 8 } }
  ...
}
```

### rule

`rule` is a machine-readable path that points to the specific rule rule that failed validation. This will be a nested field starting from the FieldRules of the field that failed validation. For custom rules, this will provide the path of the rule, e.g. `cel[0]`.For example, consider the following message:

```proto
message Message {
  bool a = 1 [(buf.validate.field).required = true];
  bool b = 2 [(buf.validate.field).cel = {
    id: "custom_rule",
    expression: "!this ? 'b must be true': ''"
  }]
}
```

It could produce the following violations:

```text
violation {
  rule { element { field_number: 25, field_name: "required", field_type: 8 } }
  ...
}
violation {
  rule { element { field_number: 23, field_name: "cel", field_type: 11, index: 0 } }
  ...
}
```

### rule_id

`rule_id` is the unique identifier of the `Rule` that was not fulfilled. This is the same `id` that was specified in the `Rule` message, allowing easy tracing of which rule was violated.

### message

`message` is a human-readable error message that describes the nature of the violation. This can be the default error message from the violated `Rule`, or it can be a custom message that gives more context about the violation.

### for_key

`for_key` indicates whether the violation was caused by a map key, rather than a value.
