---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/field_rules/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/protovalidate/violations/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/any_rules/"
  - - meta
    - property: "og:title"
      content: "Field rules - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/field_rules.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/protovalidate/rules/field_rules/"
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
      content: "Field rules - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/field_rules.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Field rules

FieldRules encapsulates the rules for each type of field. Depending on the field, the correct set should be used to ensure proper validations.

## cel

`cel` is a repeated field used to represent a textual expression in the Common Expression Language (CEL) syntax. For more information on CEL, [see our documentation](https://github.com/bufbuild/protovalidate/blob/main/docs/cel.md).

::: info field.cel example

```proto
message MyMessage {
  // The field `value` must be greater than 42.
  optional int32 value = 1 [(buf.validate.field).cel = {
    id: "my_message.value",
    message: "value must be greater than 42",
    expression: "this > 42",
  }];
}
```

:::

## required

If `required` is true, the field must be populated. A populated field can be described as "serialized in the wire format," which includes:

- the following "nullable" fields must be explicitly set to be considered populated:
  - singular message fields (whose fields may be unpopulated/default values)
  - member fields of a oneof (may be their default value)
  - proto3 optional fields (may be their default value)
  - proto2 scalar fields (both optional and required)
- proto3 scalar fields must be non-zero to be considered populated
- repeated and map fields must be non-empty to be considered populated

::: info field.required example

```proto
message MyMessage {
  // The field `value` must be set to a non-null value.
  optional MyOtherMessage value = 1 [(buf.validate.field).required = true];
}
```

:::

## ignore

Skip validation on the field if its value matches the specified criteria. See Ignore enum for details.

::: info field.ignore example

```proto
message UpdateRequest {
  // The uri rule only applies if the field is populated and not an empty
  // string.
  optional string url = 1 [
    (buf.validate.field).ignore = IGNORE_IF_DEFAULT_VALUE,
    (buf.validate.field).string.uri = true,
  ];
}
```

:::
