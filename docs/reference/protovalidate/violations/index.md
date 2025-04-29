---

title: "Violations - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/protovalidate/violations/"
  - - meta
    - property: "og:title"
      content: "Violations - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/protovalidate/violations/"
  - - meta
    - property: "twitter:title"
      content: "Violations - Buf Docs"

---

# Violations messages

## Violations Message

`Violations` is a collection of `Violation` messages. This message type is returned by protovalidate when a proto message fails to meet the requirements set by the `Constraint` validation rules. Each individual violation is represented by a `Violation` message.

### violations

`violations` is a repeated field that contains all the `Violation` messages corresponding to the violations detected.

## Violation Message

`Violation` represents a single instance where a validation rule, expressed as a `Constraint`, was not met. It provides information about the field that caused the violation, the specific constraint that wasn't fulfilled, and a human-readable error message.

```json
{
  "fieldPath": "bar",
  "constraintId": "foo.bar",
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

`rule` is a machine-readable path that points to the specific constraint rule that failed validation. This will be a nested field starting from the FieldConstraints of the field that failed validation. For custom constraints, this will provide the path of the constraint, e.g. `cel[0]`.For example, consider the following message:

```proto
message Message {
  bool a = 1 [(buf.validate.field).required = true];
  bool b = 2 [(buf.validate.field).cel = {
    id: "custom_constraint",
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

### constraint_id

`constraint_id` is the unique identifier of the `Constraint` that was not fulfilled. This is the same `id` that was specified in the `Constraint` message, allowing easy tracing of which rule was violated.

### message

`message` is a human-readable error message that describes the nature of the violation. This can be the default error message from the violated `Constraint`, or it can be a custom message that gives more context about the violation.

### for_key

`for_key` indicates whether the violation was caused by a map key, rather than a value.
