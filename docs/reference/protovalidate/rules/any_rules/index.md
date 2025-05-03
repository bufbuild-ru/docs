---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/any_rules/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/field_rules/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/bool_rules/"
  - - meta
    - property: "og:title"
      content: "Any - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/any_rules.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/protovalidate/rules/any_rules/"
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
      content: "Any - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/any_rules.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Any rules

AnyRules describe rules applied exclusively to the `google.protobuf.Any` well-known type.

## in

`in` requires the field's `type_url` to be equal to one of the specified values. If it doesn't match any of the specified values, an error message is generated.

::: info any.in example

```proto
message MyAny {
  //  The `value` field must have a `type_url` equal to one of the specified values.
  google.protobuf.Any value = 1 [(buf.validate.field).any.in = ["type.googleapis.com/MyType1", "type.googleapis.com/MyType2"]];
}
```

:::

## not_in

requires the field's type_url to be not equal to any of the specified values. If it matches any of the specified values, an error message is generated.

::: info any.not_in example

```proto
message MyAny {
  // The field `value` must not have a `type_url` equal to any of the specified values.
  google.protobuf.Any value = 1 [(buf.validate.field).any.not_in = ["type.googleapis.com/ForbiddenType1", "type.googleapis.com/ForbiddenType2"]];
}
```

:::
