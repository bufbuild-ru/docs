# Any rules

AnyRules describe constraints applied exclusively to the `google.protobuf.Any` well-known type.

## in

`in` requires the field's `type_url` to be equal to one of the specified values. If it doesn't match any of the specified values, an error message is generated.

::: info any.in example

```proto
message MyAny {
  //  The `value` field must have a `type_url` equal to one of the specified values.
  google.protobuf.Any value = 1 [(buf.validate.field).any.in = ["type.googleapis.com/MyType1", "type.googleapis.com/MyType2"]];
}
```

:::

## not_in

requires the field's type_url to be not equal to any of the specified values. If it matches any of the specified values, an error message is generated.

::: info any.not_in example

```proto
message MyAny {
  // The field `value` must not have a `type_url` equal to any of the specified values.
  google.protobuf.Any value = 1 [(buf.validate.field).any.not_in = ["type.googleapis.com/ForbiddenType1", "type.googleapis.com/ForbiddenType2"]];
}
```

:::
