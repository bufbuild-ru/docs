---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/timestamp_rules/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/string_rules/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/uint32_rules/"
  - - meta
    - property: "og:title"
      content: "Timestamp - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/timestamp_rules.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/protovalidate/rules/timestamp_rules/"
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
      content: "Timestamp - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/timestamp_rules.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Timestamp rules

TimestampRules describe the rules applied exclusively to the `google.protobuf.Timestamp` well-known type.

## const

`const` dictates that this field, of the `google.protobuf.Timestamp` type, must exactly match the specified value. If the field value doesn't correspond to the specified timestamp, an error message will be generated.

::: info timestamp.const example

```proto
message MyTimestamp {
  // value must equal 2023-05-03T10:00:00Z
  google.protobuf.Timestamp created_at = 1 [(buf.validate.field).timestamp.const = {seconds: 1727998800}];
}
```

:::

## lt

requires the duration field value to be less than the specified value (field < value). If the field value doesn't meet the required conditions, an error message is generated.

::: info timestamp.lt example

```proto
message MyDuration {
  // duration must be less than 'P3D' [duration.lt]
  google.protobuf.Duration value = 1 [(buf.validate.field).duration.lt = { seconds: 259200 }];
}
```

:::

## lte

requires the timestamp field value to be less than or equal to the specified value (field <= value). If the field value doesn't meet the required conditions, an error message is generated.

::: info timestamp.lte example

```proto
message MyTimestamp {
  // timestamp must be less than or equal to '2023-05-14T00:00:00Z' [timestamp.lte]
  google.protobuf.Timestamp value = 1 [(buf.validate.field).timestamp.lte = { seconds: 1678867200 }];
}
```

:::

## lt_now

`lt_now` specifies that this field, of the `google.protobuf.Timestamp` type, must be less than the current time. `lt_now` can only be used with the `within` rule.

::: info timestamp.lt_now example

```proto
message MyTimestamp {
 // value must be less than now
  google.protobuf.Timestamp created_at = 1 [(buf.validate.field).timestamp.lt_now = true];
}
```

:::

## gt

`gt` requires the timestamp field value to be greater than the specified value (exclusive). If the value of `gt` is larger than a specified `lt` or `lte`, the range is reversed, and the field value must be outside the specified range. If the field value doesn't meet the required conditions, an error message is generated.

::: info timestamp.gt example

```proto
message MyTimestamp {
  // timestamp must be greater than '2023-01-01T00:00:00Z' [timestamp.gt]
  google.protobuf.Timestamp value = 1 [(buf.validate.field).timestamp.gt = { seconds: 1672444800 }];

  // timestamp must be greater than '2023-01-01T00:00:00Z' and less than '2023-01-02T00:00:00Z' [timestamp.gt_lt]
  google.protobuf.Timestamp another_value = 2 [(buf.validate.field).timestamp = { gt: { seconds: 1672444800 }, lt: { seconds: 1672531200 } }];

  // timestamp must be greater than '2023-01-02T00:00:00Z' or less than '2023-01-01T00:00:00Z' [timestamp.gt_lt_exclusive]
  google.protobuf.Timestamp other_value = 3 [(buf.validate.field).timestamp = { gt: { seconds: 1672531200 }, lt: { seconds: 1672444800 } }];
}
```

:::

## gte

`gte` requires the timestamp field value to be greater than or equal to the specified value (exclusive). If the value of `gte` is larger than a specified `lt` or `lte`, the range is reversed, and the field value must be outside the specified range. If the field value doesn't meet the required conditions, an error message is generated.

::: info timestamp.gte example

```proto
message MyTimestamp {
  // timestamp must be greater than or equal to '2023-01-01T00:00:00Z' [timestamp.gte]
  google.protobuf.Timestamp value = 1 [(buf.validate.field).timestamp.gte = { seconds: 1672444800 }];

  // timestamp must be greater than or equal to '2023-01-01T00:00:00Z' and less than '2023-01-02T00:00:00Z' [timestamp.gte_lt]
  google.protobuf.Timestamp another_value = 2 [(buf.validate.field).timestamp = { gte: { seconds: 1672444800 }, lt: { seconds: 1672531200 } }];

  // timestamp must be greater than or equal to '2023-01-02T00:00:00Z' or less than '2023-01-01T00:00:00Z' [timestamp.gte_lt_exclusive]
  google.protobuf.Timestamp other_value = 3 [(buf.validate.field).timestamp = { gte: { seconds: 1672531200 }, lt: { seconds: 1672444800 } }];
}
```

:::

## gt_now

`gt_now` specifies that this field, of the `google.protobuf.Timestamp` type, must be greater than the current time. `gt_now` can only be used with the `within` rule.

::: info timestamp.gt_now example

```proto
message MyTimestamp {
  // value must be greater than now
  google.protobuf.Timestamp created_at = 1 [(buf.validate.field).timestamp.gt_now = true];
}
```

:::

## within

`within` specifies that this field, of the `google.protobuf.Timestamp` type, must be within the specified duration of the current time. If the field value isn't within the duration, an error message is generated.

::: info timestamp.within example

```proto
message MyTimestamp {
  // value must be within 1 hour of now
  google.protobuf.Timestamp created_at = 1 [(buf.validate.field).timestamp.within = {seconds: 3600}];
}
```

:::

## example

@generated from field: repeated google.protobuf.Timestamp example = 10;
