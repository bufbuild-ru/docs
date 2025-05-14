---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/oneof_rules/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/message_rules/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/repeated_rules/"
  - - meta
    - property: "og:title"
      content: "Oneof - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/oneof_rules.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/protovalidate/rules/oneof_rules/"
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
      content: "Oneof - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/oneof_rules.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Oneof rules

The `OneofRules` message type enables you to manage rules for oneof fields in your protobuf messages.

## required

If `required` is true, exactly one field of the oneof must be present. A validation error is returned if no fields in the oneof are present. The field itself may still be a default value; further rules should be placed on the fields themselves to ensure they are valid values, such as `min_len` or `gt`.

::: info oneof.required example

```proto
message MyMessage {
  oneof value {
    // Either `a` or `b` must be set. If `a` is set, it must also be
    // non-empty; whereas if `b` is set, it can still be an empty string.
    option (buf.validate.oneof).required = true;
    string a = 1 [(buf.validate.field).string.min_len = 1];
    string b = 2;
  }
}
```

:::
