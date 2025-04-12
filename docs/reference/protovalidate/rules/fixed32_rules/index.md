# Fixed32 rules

Fixed32Rules describes the constraints applied to `fixed32` values.

## const

`const` requires the field value to exactly match the specified value. If the field value doesn't match, an error message is generated.

::: info fixed32.const example

```proto
message MyFixed32 {
  // value must equal 42
  fixed32 value = 1 [(buf.validate.field).fixed32.const = 42];
}
```

:::

## lt

`lt` requires the field value to be less than the specified value (field < value). If the field value is equal to or greater than the specified value, an error message is generated.

::: info fixed32.lt example

```proto
message MyFixed32 {
  // value must be less than 10
  fixed32 value = 1 [(buf.validate.field).fixed32.lt = 10];
}
```

:::

## lte

`lte` requires the field value to be less than or equal to the specified value (field <= value). If the field value is greater than the specified value, an error message is generated.

::: info fixed32.lte example

```proto
message MyFixed32 {
  // value must be less than or equal to 10
  fixed32 value = 1 [(buf.validate.field).fixed32.lte = 10];
}
```

:::

## gt

`gt` requires the field value to be greater than the specified value (exclusive). If the value of `gt` is larger than a specified `lt` or `lte`, the range is reversed, and the field value must be outside the specified range. If the field value doesn't meet the required conditions, an error message is generated.

::: info fixed32.gt example

```proto
message MyFixed32 {
  // value must be greater than 5 [fixed32.gt]
  fixed32 value = 1 [(buf.validate.field).fixed32.gt = 5];

  // value must be greater than 5 and less than 10 [fixed32.gt_lt]
  fixed32 other_value = 2 [(buf.validate.field).fixed32 = { gt: 5, lt: 10 }];

  // value must be greater than 10 or less than 5 [fixed32.gt_lt_exclusive]
  fixed32 another_value = 3 [(buf.validate.field).fixed32 = { gt: 10, lt: 5 }];
}
```

:::

## gte

`gte` requires the field value to be greater than or equal to the specified value (exclusive). If the value of `gte` is larger than a specified `lt` or `lte`, the range is reversed, and the field value must be outside the specified range. If the field value doesn't meet the required conditions, an error message is generated.

::: info fixed32.gte example

```proto
message MyFixed32 {
  // value must be greater than or equal to 5 [fixed32.gte]
  fixed32 value = 1 [(buf.validate.field).fixed32.gte = 5];

  // value must be greater than or equal to 5 and less than 10 [fixed32.gte_lt]
  fixed32 other_value = 2 [(buf.validate.field).fixed32 = { gte: 5, lt: 10 }];

  // value must be greater than or equal to 10 or less than 5 [fixed32.gte_lt_exclusive]
  fixed32 another_value = 3 [(buf.validate.field).fixed32 = { gte: 10, lt: 5 }];
}
```

:::

## in

`in` requires the field value to be equal to one of the specified values. If the field value isn't one of the specified values, an error message is generated.

::: info fixed32.in example

```proto
message MyFixed32 {
  // value must be in list [1, 2, 3]
  repeated fixed32 value = 1 (buf.validate.field).fixed32 = { in: [1, 2, 3] };
}
```

:::

## not_in

`not_in` requires the field value to not be equal to any of the specified values. If the field value is one of the specified values, an error message is generated.

::: info fixed32.not_in example

```proto
message MyFixed32 {
  // value must not be in list [1, 2, 3]
  repeated fixed32 value = 1 (buf.validate.field).fixed32 = { not_in: [1, 2, 3] };
}
```

:::

## example

`example` specifies values that the field may have. These values SHOULD conform to other constraints. `example` values will not impact validation but may be used as helpful guidance on how to populate the given field.

::: info fixed32.example example

```proto
message MyFixed32 {
  fixed32 value = 1 [
    (buf.validate.field).fixed32.example = 1,
    (buf.validate.field).fixed32.example = 2
  ];
}
```

:::
