---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/uint64_rules/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/uint32_rules/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/protovalidate/enums/"
  - - meta
    - property: "og:title"
      content: "Uint64 - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/uint64_rules.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/protovalidate/rules/uint64_rules/"
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
      content: "Uint64 - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/uint64_rules.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# UInt64 rules

UInt64Rules describes the rules applied to `uint64` values. These rules may also be applied to the `google.protobuf.UInt64Value` Well-Known-Type.

## const

`const` requires the field value to exactly match the specified value. If the field value doesn't match, an error message is generated.

::: info uint64.const example

```proto
message MyUInt64 {
  // value must equal 42
  uint64 value = 1 [(buf.validate.field).uint64.const = 42];
}
```

:::

## lt

`lt` requires the field value to be less than the specified value (field < value). If the field value is equal to or greater than the specified value, an error message is generated.

::: info uint64.lt example

```proto
message MyUInt64 {
  // value must be less than 10
  uint64 value = 1 [(buf.validate.field).uint64.lt = 10];
}
```

:::

## lte

`lte` requires the field value to be less than or equal to the specified value (field <= value). If the field value is greater than the specified value, an error message is generated.

::: info uint64.lte example

```proto
message MyUInt64 {
  // value must be less than or equal to 10
  uint64 value = 1 [(buf.validate.field).uint64.lte = 10];
}
```

:::

## gt

`gt` requires the field value to be greater than the specified value (exclusive). If the value of `gt` is larger than a specified `lt` or `lte`, the range is reversed, and the field value must be outside the specified range. If the field value doesn't meet the required conditions, an error message is generated.

::: info uint64.gt example

```proto
message MyUInt64 {
  // value must be greater than 5 [uint64.gt]
  uint64 value = 1 [(buf.validate.field).uint64.gt = 5];

  // value must be greater than 5 and less than 10 [uint64.gt_lt]
  uint64 other_value = 2 [(buf.validate.field).uint64 = { gt: 5, lt: 10 }];

  // value must be greater than 10 or less than 5 [uint64.gt_lt_exclusive]
  uint64 another_value = 3 [(buf.validate.field).uint64 = { gt: 10, lt: 5 }];
}
```

:::

## gte

`gte` requires the field value to be greater than or equal to the specified value (exclusive). If the value of `gte` is larger than a specified `lt` or `lte`, the range is reversed, and the field value must be outside the specified range. If the field value doesn't meet the required conditions, an error message is generated.

::: info uint64.gte example

```proto
message MyUInt64 {
  // value must be greater than or equal to 5 [uint64.gte]
  uint64 value = 1 [(buf.validate.field).uint64.gte = 5];

  // value must be greater than or equal to 5 and less than 10 [uint64.gte_lt]
  uint64 other_value = 2 [(buf.validate.field).uint64 = { gte: 5, lt: 10 }];

  // value must be greater than or equal to 10 or less than 5 [uint64.gte_lt_exclusive]
  uint64 another_value = 3 [(buf.validate.field).uint64 = { gte: 10, lt: 5 }];
}
```

:::

## in

`in` requires the field value to be equal to one of the specified values. If the field value isn't one of the specified values, an error message is generated.

::: info uint64.in example

```proto
message MyUInt64 {
  // value must be in list [1, 2, 3]
  uint64 value = 1 [(buf.validate.field).uint64 = { in: [1, 2, 3] }];
}
```

:::

## not_in

`not_in` requires the field value to not be equal to any of the specified values. If the field value is one of the specified values, an error message is generated.

::: info uint64.not_in example

```proto
message MyUInt64 {
  // value must not be in list [1, 2, 3]
  uint64 value = 1 [(buf.validate.field).uint64 = { not_in: [1, 2, 3] }];
}
```

:::

## example

`example` specifies values that the field may have. These values SHOULD conform to other rules. `example` values will not impact validation but may be used as helpful guidance on how to populate the given field.

::: info uint64.example example

```proto
message MyUInt64 {
  uint64 value = 1 [
    (buf.validate.field).uint64.example = 1,
    (buf.validate.field).uint64.example = -10
  ];
}
```

:::
