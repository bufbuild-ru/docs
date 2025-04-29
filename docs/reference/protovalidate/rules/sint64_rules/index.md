---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/sint64_rules/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/sint32_rules/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/string_rules/"
  - - meta
    - property: "og:title"
      content: "Sint64 - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/sint64_rules.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/protovalidate/rules/sint64_rules/"
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
      content: "Sint64 - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/sint64_rules.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# SInt64 rules

SInt64Rules describes the rules applied to `sint64` values.

## const

`const` requires the field value to exactly match the specified value. If the field value doesn't match, an error message is generated.

::: info sint64.const example

```proto
message MySInt64 {
  // value must equal 42
  sint64 value = 1 [(buf.validate.field).sint64.const = 42];
}
```

:::

## lt

`lt` requires the field value to be less than the specified value (field < value). If the field value is equal to or greater than the specified value, an error message is generated.

::: info sint64.lt example

```proto
message MySInt64 {
  // value must be less than 10
  sint64 value = 1 [(buf.validate.field).sint64.lt = 10];
}
```

:::

## lte

`lte` requires the field value to be less than or equal to the specified value (field <= value). If the field value is greater than the specified value, an error message is generated.

::: info sint64.lte example

```proto
message MySInt64 {
  // value must be less than or equal to 10
  sint64 value = 1 [(buf.validate.field).sint64.lte = 10];
}
```

:::

## gt

`gt` requires the field value to be greater than the specified value (exclusive). If the value of `gt` is larger than a specified `lt` or `lte`, the range is reversed, and the field value must be outside the specified range. If the field value doesn't meet the required conditions, an error message is generated.

::: info sint64.gt example

```proto
message MySInt64 {
  // value must be greater than 5 [sint64.gt]
  sint64 value = 1 [(buf.validate.field).sint64.gt = 5];

  // value must be greater than 5 and less than 10 [sint64.gt_lt]
  sint64 other_value = 2 [(buf.validate.field).sint64 = { gt: 5, lt: 10 }];

  // value must be greater than 10 or less than 5 [sint64.gt_lt_exclusive]
  sint64 another_value = 3 [(buf.validate.field).sint64 = { gt: 10, lt: 5 }];
}
```

:::

## gte

`gte` requires the field value to be greater than or equal to the specified value (exclusive). If the value of `gte` is larger than a specified `lt` or `lte`, the range is reversed, and the field value must be outside the specified range. If the field value doesn't meet the required conditions, an error message is generated.

::: info sint64.gte example

```proto
message MySInt64 {
  // value must be greater than or equal to 5 [sint64.gte]
  sint64 value = 1 [(buf.validate.field).sint64.gte = 5];

  // value must be greater than or equal to 5 and less than 10 [sint64.gte_lt]
  sint64 other_value = 2 [(buf.validate.field).sint64 = { gte: 5, lt: 10 }];

  // value must be greater than or equal to 10 or less than 5 [sint64.gte_lt_exclusive]
  sint64 another_value = 3 [(buf.validate.field).sint64 = { gte: 10, lt: 5 }];
}
```

:::

## in

`in` requires the field value to be equal to one of the specified values. If the field value isn't one of the specified values, an error message is generated.

::: info sint64.in example

```proto
message MySInt64 {
  // value must be in list [1, 2, 3]
  sint64 value = 1 [(buf.validate.field).sint64 = { in: [1, 2, 3] }];
}
```

:::

## not_in

`not_in` requires the field value to not be equal to any of the specified values. If the field value is one of the specified values, an error message is generated.

::: info sint64.not_in example

```proto
message MySInt64 {
  // value must not be in list [1, 2, 3]
  sint64 value = 1 [(buf.validate.field).sint64 = { not_in: [1, 2, 3] }];
}
```

:::

## example

`example` specifies values that the field may have. These values SHOULD conform to other rules. `example` values will not impact validation but may be used as helpful guidance on how to populate the given field.

::: info sint64.example example

```proto
message MySInt64 {
  sint64 value = 1 [
    (buf.validate.field).sint64.example = 1,
    (buf.validate.field).sint64.example = -10
  ];
}
```

:::
