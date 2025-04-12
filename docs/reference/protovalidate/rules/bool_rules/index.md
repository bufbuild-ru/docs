# Bool rules

BoolRules describes the constraints applied to `bool` values. These rules may also be applied to the `google.protobuf.BoolValue` Well-Known-Type.

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

`example` specifies values that the field may have. These values SHOULD conform to other constraints. `example` values will not impact validation but may be used as helpful guidance on how to populate the given field.

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
