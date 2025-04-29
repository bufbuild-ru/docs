---

title: "Message - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/message_rules/"
  - - meta
    - property: "og:title"
      content: "Message - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/protovalidate/rules/message_rules/"
  - - meta
    - property: "twitter:title"
      content: "Message - Buf Docs"

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
