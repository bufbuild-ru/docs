# Fixed64 rules

Fixed64Rules describes the constraints applied to `fixed64` values.

## const

`const` requires the field value to exactly match the specified value. If the field value doesn't match, an error message is generated.

::: info fixed64.const example

```proto
message MyFixed64 {
  // value must equal 42
  fixed64 value = 1 [(buf.validate.field).fixed64.const = 42];
}
```

:::

## lt

`lt` requires the field value to be less than the specified value (field < value). If the field value is equal to or greater than the specified value, an error message is generated.

::: info fixed64.lt example

```proto
message MyFixed64 {
  // value must be less than 10
  fixed64 value = 1 [(buf.validate.field).fixed64.lt = 10];
}
```

:::

## lte

`lte` requires the field value to be less than or equal to the specified value (field <= value). If the field value is greater than the specified value, an error message is generated.

::: info fixed64.lte example

```proto
message MyFixed64 {
  // value must be less than or equal to 10
  fixed64 value = 1 [(buf.validate.field).fixed64.lte = 10];
}
```

:::

## gt

`gt` requires the field value to be greater than the specified value (exclusive). If the value of `gt` is larger than a specified `lt` or `lte`, the range is reversed, and the field value must be outside the specified range. If the field value doesn't meet the required conditions, an error message is generated.

::: info fixed64.gt example

```proto
message MyFixed64 {
  // value must be greater than 5 [fixed64.gt]
  fixed64 value = 1 [(buf.validate.field).fixed64.gt = 5];

  // value must be greater than 5 and less than 10 [fixed64.gt_lt]
  fixed64 other_value = 2 [(buf.validate.field).fixed64 = { gt: 5, lt: 10 }];

  // value must be greater than 10 or less than 5 [fixed64.gt_lt_exclusive]
  fixed64 another_value = 3 [(buf.validate.field).fixed64 = { gt: 10, lt: 5 }];
}
```

:::

## gte

`gte` requires the field value to be greater than or equal to the specified value (exclusive). If the value of `gte` is larger than a specified `lt` or `lte`, the range is reversed, and the field value must be outside the specified range. If the field value doesn't meet the required conditions, an error message is generated.

::: info fixed64.gte example

```proto
message MyFixed64 {
  // value must be greater than or equal to 5 [fixed64.gte]
  fixed64 value = 1 [(buf.validate.field).fixed64.gte = 5];

  // value must be greater than or equal to 5 and less than 10 [fixed64.gte_lt]
  fixed64 other_value = 2 [(buf.validate.field).fixed64 = { gte: 5, lt: 10 }];

  // value must be greater than or equal to 10 or less than 5 [fixed64.gte_lt_exclusive]
  fixed64 another_value = 3 [(buf.validate.field).fixed64 = { gte: 10, lt: 5 }];
}
```

:::

## in

`in` requires the field value to be equal to one of the specified values. If the field value isn't one of the specified values, an error message is generated.

::: info fixed64.in example

```proto
message MyFixed64 {
  // value must be in list [1, 2, 3]
  repeated fixed64 value = 1 (buf.validate.field).fixed64 = { in: [1, 2, 3] };
}
```

:::

## not_in

`not_in` requires the field value to not be equal to any of the specified values. If the field value is one of the specified values, an error message is generated.

::: info fixed64.not_in example

```proto
message MyFixed64 {
  // value must not be in list [1, 2, 3]
  repeated fixed64 value = 1 (buf.validate.field).fixed64 = { not_in: [1, 2, 3] };
}
```

:::

## example

`example` specifies values that the field may have. These values SHOULD conform to other constraints. `example` values will not impact validation but may be used as helpful guidance on how to populate the given field.

::: info fixed64.example example

```proto
message MyFixed64 {
  fixed64 value = 1 [
    (buf.validate.field).fixed64.example = 1,
    (buf.validate.field).fixed64.example = 2
  ];
}
```

:::
