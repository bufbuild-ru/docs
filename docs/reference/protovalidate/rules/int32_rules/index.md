---

title: "Int32 - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/int32_rules/"
  - - meta
    - property: "og:title"
      content: "Int32 - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/protovalidate/rules/int32_rules/"
  - - meta
    - property: "twitter:title"
      content: "Int32 - Buf Docs"

---

# Int32 rules

Int32Rules describes the constraints applied to `int32` values. These rules may also be applied to the `google.protobuf.Int32Value` Well-Known-Type.

## const

`const` requires the field value to exactly match the specified value. If the field value doesn't match, an error message is generated.

::: info int32.const example

```proto
message MyInt32 {
  // value must equal 42
  int32 value = 1 [(buf.validate.field).int32.const = 42];
}
```

:::

## lt

`lt` requires the field value to be less than the specified value (field < value). If the field value is equal to or greater than the specified value, an error message is generated.

::: info int32.lt example

```proto
message MyInt32 {
  // value must be less than 10
  int32 value = 1 [(buf.validate.field).int32.lt = 10];
}
```

:::

## lte

`lte` requires the field value to be less than or equal to the specified value (field <= value). If the field value is greater than the specified value, an error message is generated.

::: info int32.lte example

```proto
message MyInt32 {
  // value must be less than or equal to 10
  int32 value = 1 [(buf.validate.field).int32.lte = 10];
}
```

:::

## gt

`gt` requires the field value to be greater than the specified value (exclusive). If the value of `gt` is larger than a specified `lt` or `lte`, the range is reversed, and the field value must be outside the specified range. If the field value doesn't meet the required conditions, an error message is generated.

::: info int32.gt example

```proto
message MyInt32 {
  // value must be greater than 5 [int32.gt]
  int32 value = 1 [(buf.validate.field).int32.gt = 5];

  // value must be greater than 5 and less than 10 [int32.gt_lt]
  int32 other_value = 2 [(buf.validate.field).int32 = { gt: 5, lt: 10 }];

  // value must be greater than 10 or less than 5 [int32.gt_lt_exclusive]
  int32 another_value = 3 [(buf.validate.field).int32 = { gt: 10, lt: 5 }];
}
```

:::

## gte

`gte` requires the field value to be greater than or equal to the specified value (exclusive). If the value of `gte` is larger than a specified `lt` or `lte`, the range is reversed, and the field value must be outside the specified range. If the field value doesn't meet the required conditions, an error message is generated.

::: info int32.gte example

```proto
message MyInt32 {
  // value must be greater than or equal to 5 [int32.gte]
  int32 value = 1 [(buf.validate.field).int32.gte = 5];

  // value must be greater than or equal to 5 and less than 10 [int32.gte_lt]
  int32 other_value = 2 [(buf.validate.field).int32 = { gte: 5, lt: 10 }];

  // value must be greater than or equal to 10 or less than 5 [int32.gte_lt_exclusive]
  int32 another_value = 3 [(buf.validate.field).int32 = { gte: 10, lt: 5 }];
}
```

:::

## in

`in` requires the field value to be equal to one of the specified values. If the field value isn't one of the specified values, an error message is generated.

::: info int32.in example

```proto
message MyInt32 {
  // value must be in list [1, 2, 3]
  repeated int32 value = 1 (buf.validate.field).int32 = { in: [1, 2, 3] };
}
```

:::

## not_in

`not_in` requires the field value to not be equal to any of the specified values. If the field value is one of the specified values, an error message is generated.

::: info int32.not_in example

```proto
message MyInt32 {
  // value must not be in list [1, 2, 3]
  repeated int32 value = 1 (buf.validate.field).int32 = { not_in: [1, 2, 3] };
}
```

:::

## example

`example` specifies values that the field may have. These values SHOULD conform to other constraints. `example` values will not impact validation but may be used as helpful guidance on how to populate the given field.

::: info int32.example example

```proto
message MyInt32 {
  int32 value = 1 [
    (buf.validate.field).int32.example = 1,
    (buf.validate.field).int32.example = -10
  ];
}
```

:::
