---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/enum_rules/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/duration_rules/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/fixed32_rules/"
  - - meta
    - property: "og:title"
      content: "Enum - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/enum_rules.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/protovalidate/rules/enum_rules/"
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
      content: "Enum - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/enum_rules.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Enum rules

EnumRules describe the rules applied to `enum` values.

## const

`const` requires the field value to exactly match the specified enum value. If the field value doesn't match, an error message is generated.

::: info enum.const example

```proto
enum MyEnum {
  MY_ENUM_UNSPECIFIED = 0;
  MY_ENUM_VALUE1 = 1;
  MY_ENUM_VALUE2 = 2;
}

message MyMessage {
  // The field `value` must be exactly MY_ENUM_VALUE1.
  MyEnum value = 1 [(buf.validate.field).enum.const = 1];
}
```

:::

## defined_only

`defined_only` requires the field value to be one of the defined values for this enum, failing on any undefined value.

::: info enum.defined_only example

```proto
enum MyEnum {
  MY_ENUM_UNSPECIFIED = 0;
  MY_ENUM_VALUE1 = 1;
  MY_ENUM_VALUE2 = 2;
}

message MyMessage {
  // The field `value` must be a defined value of MyEnum.
  MyEnum value = 1 [(buf.validate.field).enum.defined_only = true];
}
```

:::

## in

`in` requires the field value to be equal to one of the specified enum values. If the field value doesn't match any of the specified values, an error message is generated.

::: info enum.in example

```proto
enum MyEnum {
  MY_ENUM_UNSPECIFIED = 0;
  MY_ENUM_VALUE1 = 1;
  MY_ENUM_VALUE2 = 2;
}

message MyMessage {
  // The field `value` must be equal to one of the specified values.
  MyEnum value = 1 [(buf.validate.field).enum = { in: [1, 2]}];
}
```

:::

## not_in

`not_in` requires the field value to be not equal to any of the specified enum values. If the field value matches one of the specified values, an error message is generated.

::: info enum.not_in example

```proto
enum MyEnum {
  MY_ENUM_UNSPECIFIED = 0;
  MY_ENUM_VALUE1 = 1;
  MY_ENUM_VALUE2 = 2;
}

message MyMessage {
  // The field `value` must not be equal to any of the specified values.
  MyEnum value = 1 [(buf.validate.field).enum = { not_in: [1, 2]}];
}
```

:::

## example

`example` specifies values that the field may have. These values SHOULD conform to other rules. `example` values will not impact validation but may be used as helpful guidance on how to populate the given field.

::: info enum.example example

```proto
enum MyEnum {
  MY_ENUM_UNSPECIFIED = 0;
  MY_ENUM_VALUE1 = 1;
  MY_ENUM_VALUE2 = 2;
}

message MyMessage {
    (buf.validate.field).enum.example = 1,
    (buf.validate.field).enum.example = 2
}
```

:::
