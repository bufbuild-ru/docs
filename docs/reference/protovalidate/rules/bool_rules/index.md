---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/bool_rules/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/any_rules/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/bytes_rules/"
  - - meta
    - property: "og:title"
      content: "Bool - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/bool_rules.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/protovalidate/rules/bool_rules/"
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
      content: "Bool - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/bool_rules.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Bool rules

BoolRules describes the rules applied to `bool` values. These rules may also be applied to the `google.protobuf.BoolValue` Well-Known-Type.

## const

`const` requires the field value to exactly match the specified boolean value. If the field value doesn't match, an error message is generated.

::: info bool.const example

```proto
message MyBool {
  // value must equal true
  bool value = 1 [(buf.validate.field).bool.const = true];
}
```

:::

## example

`example` specifies values that the field may have. These values SHOULD conform to other rules. `example` values will not impact validation but may be used as helpful guidance on how to populate the given field.

::: info bool.example example

```proto
message MyBool {
  bool value = 1 [
    (buf.validate.field).bool.example = 1,
    (buf.validate.field).bool.example = 2
  ];
}
```

:::
