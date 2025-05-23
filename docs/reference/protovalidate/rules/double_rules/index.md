---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/double_rules/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/bytes_rules/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/duration_rules/"
  - - meta
    - property: "og:title"
      content: "Double - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/double_rules.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/protovalidate/rules/double_rules/"
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
      content: "Double - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/double_rules.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Double rules

DoubleRules describes the rules applied to `double` values. These rules may also be applied to the `google.protobuf.DoubleValue` Well-Known-Type.

## const

`const` requires the field value to exactly match the specified value. If the field value doesn't match, an error message is generated.

::: info double.const example

```proto
message MyDouble {
  // value must equal 42.0
  double value = 1 [(buf.validate.field).double.const = 42.0];
}
```

:::

## lt

`lt` requires the field value to be less than the specified value (field < value). If the field value is equal to or greater than the specified value, an error message is generated.

::: info double.lt example

```proto
message MyDouble {
  // value must be less than 10.0
  double value = 1 [(buf.validate.field).double.lt = 10.0];
}
```

:::

## lte

`lte` requires the field value to be less than or equal to the specified value (field <= value). If the field value is greater than the specified value, an error message is generated.

::: info double.lte example

```proto
message MyDouble {
  // value must be less than or equal to 10.0
  double value = 1 [(buf.validate.field).double.lte = 10.0];
}
```

:::

## gt

`gt` requires the field value to be greater than the specified value (exclusive). If the value of `gt` is larger than a specified `lt` or `lte`, the range is reversed, and the field value must be outside the specified range. If the field value doesn't meet the required conditions, an error message is generated.

::: info double.gt example

```proto
message MyDouble {
  // value must be greater than 5.0 [double.gt]
  double value = 1 [(buf.validate.field).double.gt = 5.0];

  // value must be greater than 5 and less than 10.0 [double.gt_lt]
  double other_value = 2 [(buf.validate.field).double = { gt: 5.0, lt: 10.0 }];

  // value must be greater than 10 or less than 5.0 [double.gt_lt_exclusive]
  double another_value = 3 [(buf.validate.field).double = { gt: 10.0, lt: 5.0 }];
}
```

:::

## gte

`gte` requires the field value to be greater than or equal to the specified value (exclusive). If the value of `gte` is larger than a specified `lt` or `lte`, the range is reversed, and the field value must be outside the specified range. If the field value doesn't meet the required conditions, an error message is generated.

::: info double.gte example

```proto
message MyDouble {
  // value must be greater than or equal to 5.0 [double.gte]
  double value = 1 [(buf.validate.field).double.gte = 5.0];

  // value must be greater than or equal to 5.0 and less than 10.0 [double.gte_lt]
  double other_value = 2 [(buf.validate.field).double = { gte: 5.0, lt: 10.0 }];

  // value must be greater than or equal to 10.0 or less than 5.0 [double.gte_lt_exclusive]
  double another_value = 3 [(buf.validate.field).double = { gte: 10.0, lt: 5.0 }];
}
```

:::

## in

`in` requires the field value to be equal to one of the specified values. If the field value isn't one of the specified values, an error message is generated.

::: info double.in example

```proto
message MyDouble {
  // value must be in list [1.0, 2.0, 3.0]
  double value = 1 [(buf.validate.field).double = { in: [1.0, 2.0, 3.0] }];
}
```

:::

## not_in

`not_in` requires the field value to not be equal to any of the specified values. If the field value is one of the specified values, an error message is generated.

::: info double.not_in example

```proto
message MyDouble {
  // value must not be in list [1.0, 2.0, 3.0]
  double value = 1 [(buf.validate.field).double = { not_in: [1.0, 2.0, 3.0] }];
}
```

:::

## finite

`finite` requires the field value to be finite. If the field value is infinite or NaN, an error message is generated.

## example

`example` specifies values that the field may have. These values SHOULD conform to other rules. `example` values will not impact validation but may be used as helpful guidance on how to populate the given field.

::: info double.example example

```proto
message MyDouble {
  double value = 1 [
    (buf.validate.field).double.example = 1.0,
    (buf.validate.field).double.example = "Infinity"
  ];
}
```

:::
