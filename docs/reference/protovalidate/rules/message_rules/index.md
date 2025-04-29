---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/message_rules/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/map_rules/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/oneof_rules/"
  - - meta
    - property: "og:title"
      content: "Message - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/message_rules.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/protovalidate/rules/message_rules/"
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
      content: "Message - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/message_rules.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Message rules

MessageRules represents validation rules that are applied to the entire message. It includes disabling options and a list of Rule messages representing Common Expression Language (CEL) validation rules.

## disabled

`disabled` is a boolean flag that, when set to true, nullifies any validation rules for this message. This includes any fields within the message that would otherwise support validation.

::: info message.disabled example

```proto
message MyMessage {
  // validation will be bypassed for this message
  option (buf.validate.message).disabled = true;
}
```

:::

## cel

`cel` is a repeated field of type Rule. Each Rule specifies a validation rule to be applied to this message. These rules are written in Common Expression Language (CEL) syntax. For more information on CEL, [see our documentation](https://github.com/bufbuild/protovalidate/blob/main/docs/cel.md).

::: info message.cel example

```proto
message MyMessage {
  // The field `foo` must be greater than 42.
  option (buf.validate.message).cel = {
    id: "my_message.value",
    message: "value must be greater than 42",
    expression: "this.foo > 42",
  };
  optional int32 foo = 1;
}
```

:::
