---

title: "Sint32 - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/sint32_rules/"
  - - meta
    - property: "og:title"
      content: "Sint32 - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/protovalidate/rules/sint32_rules/"
  - - meta
    - property: "twitter:title"
      content: "Sint32 - Buf Docs"

---

# SInt32 rules

SInt32Rules describes the constraints applied to `sint32` values.

## const

`const` requires the field value to exactly match the specified value. If the field value doesn't match, an error message is generated.

::: info sint32.const example

```proto
message MySInt32 {
  // value must equal 42
  sint32 value = 1 [(buf.validate.field).sint32.const = 42];
}
```

:::

## lt

`lt` requires the field value to be less than the specified value (field < value). If the field value is equal to or greater than the specified value, an error message is generated.

::: info sint32.lt example

```proto
message MySInt32 {
  // value must be less than 10
  sint32 value = 1 [(buf.validate.field).sint32.lt = 10];
}
```

:::

## lte

`lte` requires the field value to be less than or equal to the specified value (field <= value). If the field value is greater than the specified value, an error message is generated.

::: info sint32.lte example

```proto
message MySInt32 {
  // value must be less than or equal to 10
  sint32 value = 1 [(buf.validate.field).sint32.lte = 10];
}
```

:::

## gt

`gt` requires the field value to be greater than the specified value (exclusive). If the value of `gt` is larger than a specified `lt` or `lte`, the range is reversed, and the field value must be outside the specified range. If the field value doesn't meet the required conditions, an error message is generated.

::: info sint32.gt example

```proto
message MySInt32 {
  // value must be greater than 5 [sint32.gt]
  sint32 value = 1 [(buf.validate.field).sint32.gt = 5];

  // value must be greater than 5 and less than 10 [sint32.gt_lt]
  sint32 other_value = 2 [(buf.validate.field).sint32 = { gt: 5, lt: 10 }];

  // value must be greater than 10 or less than 5 [sint32.gt_lt_exclusive]
  sint32 another_value = 3 [(buf.validate.field).sint32 = { gt: 10, lt: 5 }];
}
```

:::

## gte

`gte` requires the field value to be greater than or equal to the specified value (exclusive). If the value of `gte` is larger than a specified `lt` or `lte`, the range is reversed, and the field value must be outside the specified range. If the field value doesn't meet the required conditions, an error message is generated.

::: info sint32.gte example

```proto
message MySInt32 {
 // value must be greater than or equal to 5 [sint32.gte]
 sint32 value = 1 [(buf.validate.field).sint32.gte = 5];

 // value must be greater than or equal to 5 and less than 10 [sint32.gte_lt]
 sint32 other_value = 2 [(buf.validate.field).sint32 = { gte: 5, lt: 10 }];

 // value must be greater than or equal to 10 or less than 5 [sint32.gte_lt_exclusive]
 sint32 another_value = 3 [(buf.validate.field).sint32 = { gte: 10, lt: 5 }];
}
```

:::

## in

`in` requires the field value to be equal to one of the specified values. If the field value isn't one of the specified values, an error message is generated.

::: info sint32.in example

```proto
message MySInt32 {
  // value must be in list [1, 2, 3]
  repeated sint32 value = 1 (buf.validate.field).sint32 = { in: [1, 2, 3] };
}
```

:::

## not_in

`not_in` requires the field value to not be equal to any of the specified values. If the field value is one of the specified values, an error message is generated.

::: info sint32.not_in example

```proto
message MySInt32 {
  // value must not be in list [1, 2, 3]
  repeated sint32 value = 1 (buf.validate.field).sint32 = { not_in: [1, 2, 3] };
}
```

:::

## example

`example` specifies values that the field may have. These values SHOULD conform to other constraints. `example` values will not impact validation but may be used as helpful guidance on how to populate the given field.

::: info sint32.example example

```proto
message MySInt32 {
  sint32 value = 1 [
    (buf.validate.field).sint32.example = 1,
    (buf.validate.field).sint32.example = -10
  ];
}
```

:::
