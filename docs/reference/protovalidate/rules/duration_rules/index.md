---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/duration_rules/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/double_rules/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/enum_rules/"
  - - meta
    - property: "og:title"
      content: "Duration - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/duration_rules.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/protovalidate/rules/duration_rules/"
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
      content: "Duration - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/duration_rules.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Duration rules

DurationRules describe the rules applied exclusively to the `google.protobuf.Duration` well-known type.

## const

`const` dictates that the field must match the specified value of the `google.protobuf.Duration` type exactly. If the field's value deviates from the specified value, an error message will be generated.

::: info duration.const example

```proto
message MyDuration {
  // value must equal 5s
  google.protobuf.Duration value = 1 [(buf.validate.field).duration.const = "5s"];
}
```

:::

## lt

`lt` stipulates that the field must be less than the specified value of the `google.protobuf.Duration` type, exclusive. If the field's value is greater than or equal to the specified value, an error message will be generated.

::: info duration.lt example

```proto
message MyDuration {
  // value must be less than 5s
  google.protobuf.Duration value = 1 [(buf.validate.field).duration.lt = "5s"];
}
```

:::

## lte

`lte` indicates that the field must be less than or equal to the specified value of the `google.protobuf.Duration` type, inclusive. If the field's value is greater than the specified value, an error message will be generated.

::: info duration.lte example

```proto
message MyDuration {
  // value must be less than or equal to 10s
  google.protobuf.Duration value = 1 [(buf.validate.field).duration.lte = "10s"];
}
```

:::

## gt

`gt` requires the duration field value to be greater than the specified value (exclusive). If the value of `gt` is larger than a specified `lt` or `lte`, the range is reversed, and the field value must be outside the specified range. If the field value doesn't meet the required conditions, an error message is generated.

::: info duration.gt example

```proto
message MyDuration {
  // duration must be greater than 5s [duration.gt]
  google.protobuf.Duration value = 1 [(buf.validate.field).duration.gt = { seconds: 5 }];

  // duration must be greater than 5s and less than 10s [duration.gt_lt]
  google.protobuf.Duration another_value = 2 [(buf.validate.field).duration = { gt: { seconds: 5 }, lt: { seconds: 10 } }];

  // duration must be greater than 10s or less than 5s [duration.gt_lt_exclusive]
  google.protobuf.Duration other_value = 3 [(buf.validate.field).duration = { gt: { seconds: 10 }, lt: { seconds: 5 } }];
}
```

:::

## gte

`gte` requires the duration field value to be greater than or equal to the specified value (exclusive). If the value of `gte` is larger than a specified `lt` or `lte`, the range is reversed, and the field value must be outside the specified range. If the field value doesn't meet the required conditions, an error message is generated.

::: info duration.gte example

```proto
message MyDuration {
 // duration must be greater than or equal to 5s [duration.gte]
 google.protobuf.Duration value = 1 [(buf.validate.field).duration.gte = { seconds: 5 }];

 // duration must be greater than or equal to 5s and less than 10s [duration.gte_lt]
 google.protobuf.Duration another_value = 2 [(buf.validate.field).duration = { gte: { seconds: 5 }, lt: { seconds: 10 } }];

 // duration must be greater than or equal to 10s or less than 5s [duration.gte_lt_exclusive]
 google.protobuf.Duration other_value = 3 [(buf.validate.field).duration = { gte: { seconds: 10 }, lt: { seconds: 5 } }];
}
```

:::

## in

`in` asserts that the field must be equal to one of the specified values of the `google.protobuf.Duration` type. If the field's value doesn't correspond to any of the specified values, an error message will be generated.

::: info duration.in example

```proto
message MyDuration {
  // value must be in list [1s, 2s, 3s]
  google.protobuf.Duration value = 1 [(buf.validate.field).duration.in = ["1s", "2s", "3s"]];
}
```

:::

## not_in

`not_in` denotes that the field must not be equal to any of the specified values of the `google.protobuf.Duration` type. If the field's value matches any of these values, an error message will be generated.

::: info duration.not_in example

```proto
message MyDuration {
  // value must not be in list [1s, 2s, 3s]
  google.protobuf.Duration value = 1 [(buf.validate.field).duration.not_in = ["1s", "2s", "3s"]];
}
```

:::

## example

`example` specifies values that the field may have. These values SHOULD conform to other rules. `example` values will not impact validation but may be used as helpful guidance on how to populate the given field.

::: info duration.example example

```proto
message MyDuration {
  google.protobuf.Duration value = 1 [
    (buf.validate.field).duration.example = { seconds: 1 },
    (buf.validate.field).duration.example = { seconds: 2 },
  ];
}
```

:::
