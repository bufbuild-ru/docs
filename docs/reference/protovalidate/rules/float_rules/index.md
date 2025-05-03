---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/float_rules/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/fixed64_rules/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/int32_rules/"
  - - meta
    - property: "og:title"
      content: "Float - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/float_rules.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/protovalidate/rules/float_rules/"
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
      content: "Float - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/float_rules.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Float rules

FloatRules describes the rules applied to `float` values. These rules may also be applied to the `google.protobuf.FloatValue` Well-Known-Type.

## const

`const` requires the field value to exactly match the specified value. If the field value doesn't match, an error message is generated.

::: info float.const example

```proto
message MyFloat {
  // value must equal 42.0
  float value = 1 [(buf.validate.field).float.const = 42.0];
}
```

:::

## lt

`lt` requires the field value to be less than the specified value (field < value). If the field value is equal to or greater than the specified value, an error message is generated.

::: info float.lt example

```proto
message MyFloat {
  // value must be less than 10.0
  float value = 1 [(buf.validate.field).float.lt = 10.0];
}
```

:::

## lte

`lte` requires the field value to be less than or equal to the specified value (field <= value). If the field value is greater than the specified value, an error message is generated.

::: info float.lte example

```proto
message MyFloat {
  // value must be less than or equal to 10.0
  float value = 1 [(buf.validate.field).float.lte = 10.0];
}
```

:::

## gt

`gt` requires the field value to be greater than the specified value (exclusive). If the value of `gt` is larger than a specified `lt` or `lte`, the range is reversed, and the field value must be outside the specified range. If the field value doesn't meet the required conditions, an error message is generated.

::: info float.gt example

```proto
message MyFloat {
  // value must be greater than 5.0 [float.gt]
  float value = 1 [(buf.validate.field).float.gt = 5.0];

  // value must be greater than 5 and less than 10.0 [float.gt_lt]
  float other_value = 2 [(buf.validate.field).float = { gt: 5.0, lt: 10.0 }];

  // value must be greater than 10 or less than 5.0 [float.gt_lt_exclusive]
  float another_value = 3 [(buf.validate.field).float = { gt: 10.0, lt: 5.0 }];
}
```

:::

## gte

`gte` requires the field value to be greater than or equal to the specified value (exclusive). If the value of `gte` is larger than a specified `lt` or `lte`, the range is reversed, and the field value must be outside the specified range. If the field value doesn't meet the required conditions, an error message is generated.

::: info float.gte example

```proto
message MyFloat {
  // value must be greater than or equal to 5.0 [float.gte]
  float value = 1 [(buf.validate.field).float.gte = 5.0];

  // value must be greater than or equal to 5.0 and less than 10.0 [float.gte_lt]
  float other_value = 2 [(buf.validate.field).float = { gte: 5.0, lt: 10.0 }];

  // value must be greater than or equal to 10.0 or less than 5.0 [float.gte_lt_exclusive]
  float another_value = 3 [(buf.validate.field).float = { gte: 10.0, lt: 5.0 }];
}
```

:::

## in

`in` requires the field value to be equal to one of the specified values. If the field value isn't one of the specified values, an error message is generated.

::: info float.in example

```proto
message MyFloat {
  // value must be in list [1.0, 2.0, 3.0]
  float value = 1 [(buf.validate.field).float = { in: [1.0, 2.0, 3.0] }];
}
```

:::

## not_in

`in` requires the field value to not be equal to any of the specified values. If the field value is one of the specified values, an error message is generated.

::: info float.not_in example

```proto
message MyFloat {
  // value must not be in list [1.0, 2.0, 3.0]
  float value = 1 [(buf.validate.field).float = { not_in: [1.0, 2.0, 3.0] }];
}
```

:::

## finite

`finite` requires the field value to be finite. If the field value is infinite or NaN, an error message is generated.

## example

`example` specifies values that the field may have. These values SHOULD conform to other rules. `example` values will not impact validation but may be used as helpful guidance on how to populate the given field.

::: info float.example example

```proto
message MyFloat {
  float value = 1 [
    (buf.validate.field).float.example = 1.0,
    (buf.validate.field).float.example = "Infinity"
  ];
}
```

:::
