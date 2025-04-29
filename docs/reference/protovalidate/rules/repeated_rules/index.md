---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/repeated_rules/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/oneof_rules/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/sfixed32_rules/"
  - - meta
    - property: "og:title"
      content: "Repeated - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/repeated_rules.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/protovalidate/rules/repeated_rules/"
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
      content: "Repeated - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/repeated_rules.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Repeated rules

RepeatedRules describe the rules applied to `repeated` values.

## min_items

`min_items` requires that this field must contain at least the specified minimum number of items.Note that `min_items = 1` is equivalent to setting a field as `required`.

::: info repeated.min_items example

```proto
message MyRepeated {
  // value must contain at least  2 items
  repeated string value = 1 [(buf.validate.field).repeated.min_items = 2];
}
```

:::

## max_items

`max_items` denotes that this field must not exceed a certain number of items as the upper limit. If the field contains more items than specified, an error message will be generated, requiring the field to maintain no more than the specified number of items.

::: info repeated.max_items example

```proto
message MyRepeated {
  // value must contain no more than 3 item(s)
  repeated string value = 1 [(buf.validate.field).repeated.max_items = 3];
}
```

:::

## unique

`unique` indicates that all elements in this field must be unique. This rule is strictly applicable to scalar and enum types, with message types not being supported.

::: info repeated.unique example

```proto
message MyRepeated {
  // repeated value must contain unique items
  repeated string value = 1 [(buf.validate.field).repeated.unique = true];
}
```

:::

## items

`items` details the rules to be applied to each item in the field. Even for repeated message fields, validation is executed against each item unless skip is explicitly specified.

::: info repeated.items example

```proto
message MyRepeated {
  // The items in the field `value` must follow the specified rules.
  repeated string value = 1 [(buf.validate.field).repeated.items = {
    string: {
      min_len: 3
      max_len: 10
    }
  }];
}
```

:::
