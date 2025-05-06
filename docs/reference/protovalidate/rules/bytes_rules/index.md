---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/bytes_rules/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/bool_rules/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/double_rules/"
  - - meta
    - property: "og:title"
      content: "Bytes - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/bytes_rules.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/protovalidate/rules/bytes_rules/"
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
      content: "Bytes - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/bytes_rules.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Bytes rules

BytesRules describe the rules applied to `bytes` values. These rules may also be applied to the `google.protobuf.BytesValue` Well-Known-Type.

## const

`const` requires the field value to exactly match the specified bytes value. If the field value doesn't match, an error message is generated.

::: info bytes.const example

```proto
message MyBytes {
  // value must be "\x01\x02\x03\x04"
  bytes value = 1 [(buf.validate.field).bytes.const = "\x01\x02\x03\x04"];
}
```

:::

## len

`len` requires the field value to have the specified length in bytes. If the field value doesn't match, an error message is generated.

::: info bytes.len example

```proto
message MyBytes {
  // value length must be 4 bytes.
  optional bytes value = 1 [(buf.validate.field).bytes.len = 4];
}
```

:::

## min_len

`min_len` requires the field value to have at least the specified minimum length in bytes. If the field value doesn't meet the requirement, an error message is generated.

::: info bytes.min_len example

```proto
message MyBytes {
  // value length must be at least 2 bytes.
  optional bytes value = 1 [(buf.validate.field).bytes.min_len = 2];
}
```

:::

## max_len

`max_len` requires the field value to have at most the specified maximum length in bytes. If the field value exceeds the requirement, an error message is generated.

::: info bytes.max_len example

```proto
message MyBytes {
  // value must be at most 6 bytes.
  optional bytes value = 1 [(buf.validate.field).bytes.max_len = 6];
}
```

:::

## pattern

`pattern` requires the field value to match the specified regular expression ([RE2 syntax](https://github.com/google/re2/wiki/Syntax)). The value of the field must be valid UTF-8 or validation will fail with a runtime error. If the field value doesn't match the pattern, an error message is generated.

::: info bytes.pattern example

```proto
message MyBytes {
  // value must match regex pattern "^[a-zA-Z0-9]+$".
  optional bytes value = 1 [(buf.validate.field).bytes.pattern = "^[a-zA-Z0-9]+$"];
}
```

:::

## prefix

`prefix` requires the field value to have the specified bytes at the beginning of the string. If the field value doesn't meet the requirement, an error message is generated.

::: info bytes.prefix example

```proto
message MyBytes {
  // value does not have prefix \x01\x02
  optional bytes value = 1 [(buf.validate.field).bytes.prefix = "\x01\x02"];
}
```

:::

## suffix

`suffix` requires the field value to have the specified bytes at the end of the string. If the field value doesn't meet the requirement, an error message is generated.

::: info bytes.suffix example

```proto
message MyBytes {
  // value does not have suffix \x03\x04
  optional bytes value = 1 [(buf.validate.field).bytes.suffix = "\x03\x04"];
}
```

:::

## contains

`contains` requires the field value to have the specified bytes anywhere in the string. If the field value doesn't meet the requirement, an error message is generated.

\`\`\`proto title="bytes.contains example"buf message MyBytes { // value does not contain \\x02\\x03 optional bytes value = 1 \[(buf.validate.field).bytes.contains = "\\x02\\x03"\]; }

````text
## in

`in` requires the field value to be equal to one of the specified
values. If the field value doesn't match any of the specified values, an
error message is generated.

```proto title="bytes.in example"buf
message MyBytes {
  // value must in ["\x01\x02", "\x02\x03", "\x03\x04"]
  optional bytes value = 1 [(buf.validate.field).bytes.in = {"\x01\x02", "\x02\x03", "\x03\x04"}];
}
````

## not_in

`not_in` requires the field value to be not equal to any of the specified values. If the field value matches any of the specified values, an error message is generated.

::: info bytes.not_in example

```proto
message MyBytes {
  // value must not in ["\x01\x02", "\x02\x03", "\x03\x04"]
  optional bytes value = 1 [(buf.validate.field).bytes.not_in = {"\x01\x02", "\x02\x03", "\x03\x04"}];
}
```

:::

## ip

`ip` ensures that the field `value` is a valid IP address (v4 or v6) in byte format. If the field value doesn't meet this rule, an error message is generated.

::: info bytes.ip example

```proto
message MyBytes {
  // value must be a valid IP address
  optional bytes value = 1 [(buf.validate.field).bytes.ip = true];
}
```

:::

## ipv4

`ipv4` ensures that the field `value` is a valid IPv4 address in byte format. If the field value doesn't meet this rule, an error message is generated.

::: info bytes.ipv4 example

```proto
message MyBytes {
  // value must be a valid IPv4 address
  optional bytes value = 1 [(buf.validate.field).bytes.ipv4 = true];
}
```

:::

## ipv6

`ipv6` ensures that the field `value` is a valid IPv6 address in byte format. If the field value doesn't meet this rule, an error message is generated.

::: info bytes.ipv6 example

```proto
message MyBytes {
  // value must be a valid IPv6 address
  optional bytes value = 1 [(buf.validate.field).bytes.ipv6 = true];
}
```

:::

## example

`example` specifies values that the field may have. These values SHOULD conform to other rules. `example` values will not impact validation but may be used as helpful guidance on how to populate the given field.

::: info bytes.example example

```proto
message MyBytes {
  bytes value = 1 [
    (buf.validate.field).bytes.example = "\x01\x02",
    (buf.validate.field).bytes.example = "\x02\x03"
  ];
}
```

:::
