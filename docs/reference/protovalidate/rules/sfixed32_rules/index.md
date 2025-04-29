---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/sfixed32_rules/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/repeated_rules/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/sfixed64_rules/"
  - - meta
    - property: "og:title"
      content: "Sfixed32 - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/sfixed32_rules.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/protovalidate/rules/sfixed32_rules/"
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
      content: "Sfixed32 - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/sfixed32_rules.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# SFixed32 rules

SFixed32Rules describes the rules applied to `fixed32` values.

## const

`const` requires the field value to exactly match the specified value. If the field value doesn't match, an error message is generated.

::: info sfixed32.const example

```proto
message MySFixed32 {
  // value must equal 42
  sfixed32 value = 1 [(buf.validate.field).sfixed32.const = 42];
}
```

:::

## lt

`lt` requires the field value to be less than the specified value (field < value). If the field value is equal to or greater than the specified value, an error message is generated.

::: info sfixed32.lt example

```proto
message MySFixed32 {
  // value must be less than 10
  sfixed32 value = 1 [(buf.validate.field).sfixed32.lt = 10];
}
```

:::

## lte

`lte` requires the field value to be less than or equal to the specified value (field <= value). If the field value is greater than the specified value, an error message is generated.

::: info sfixed32.lte example

```proto
message MySFixed32 {
  // value must be less than or equal to 10
  sfixed32 value = 1 [(buf.validate.field).sfixed32.lte = 10];
}
```

:::

## gt

`gt` requires the field value to be greater than the specified value (exclusive). If the value of `gt` is larger than a specified `lt` or `lte`, the range is reversed, and the field value must be outside the specified range. If the field value doesn't meet the required conditions, an error message is generated.

::: info sfixed32.gt example

```proto
message MySFixed32 {
  // value must be greater than 5 [sfixed32.gt]
  sfixed32 value = 1 [(buf.validate.field).sfixed32.gt = 5];

  // value must be greater than 5 and less than 10 [sfixed32.gt_lt]
  sfixed32 other_value = 2 [(buf.validate.field).sfixed32 = { gt: 5, lt: 10 }];

  // value must be greater than 10 or less than 5 [sfixed32.gt_lt_exclusive]
  sfixed32 another_value = 3 [(buf.validate.field).sfixed32 = { gt: 10, lt: 5 }];
}
```

:::

## gte

`gte` requires the field value to be greater than or equal to the specified value (exclusive). If the value of `gte` is larger than a specified `lt` or `lte`, the range is reversed, and the field value must be outside the specified range. If the field value doesn't meet the required conditions, an error message is generated.

::: info sfixed32.gte example

```proto
message MySFixed32 {
  // value must be greater than or equal to 5 [sfixed32.gte]
  sfixed32 value = 1 [(buf.validate.field).sfixed32.gte = 5];

  // value must be greater than or equal to 5 and less than 10 [sfixed32.gte_lt]
  sfixed32 other_value = 2 [(buf.validate.field).sfixed32 = { gte: 5, lt: 10 }];

  // value must be greater than or equal to 10 or less than 5 [sfixed32.gte_lt_exclusive]
  sfixed32 another_value = 3 [(buf.validate.field).sfixed32 = { gte: 10, lt: 5 }];
}
```

:::

## in

`in` requires the field value to be equal to one of the specified values. If the field value isn't one of the specified values, an error message is generated.

::: info sfixed32.in example

```proto
message MySFixed32 {
  // value must be in list [1, 2, 3]
  sfixed32 value = 1 [(buf.validate.field).sfixed32 = { in: [1, 2, 3] }];
}
```

:::

## not_in

`not_in` requires the field value to not be equal to any of the specified values. If the field value is one of the specified values, an error message is generated.

::: info sfixed32.not_in example

```proto
message MySFixed32 {
  // value must not be in list [1, 2, 3]
  sfixed32 value = 1 [(buf.validate.field).sfixed32 = { not_in: [1, 2, 3] }];
}
```

:::

## example

`example` specifies values that the field may have. These values SHOULD conform to other rules. `example` values will not impact validation but may be used as helpful guidance on how to populate the given field.

::: info sfixed32.example example

```proto
message MySFixed32 {
  sfixed32 value = 1 [
    (buf.validate.field).sfixed32.example = 1,
    (buf.validate.field).sfixed32.example = 2
  ];
}
```

:::
