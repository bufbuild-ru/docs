---
layout: home

hero:
  name: "BSR Generated Documentation now supports Protobuf options"
---

We are excited to share an update to the Generated Documentation feature within the BSR, which now includes support for most built-in Protobuf options. 🎉

## What is BSR Generated Documentation?

A major feature provided by the [Buf Schema Registry](/docs/bsr/index.md) (BSR) is automatic documentation generation for Protobuf APIs. Documentation is a fantastic developer productivity tool that can be applied by all levels of software engineers during the development process. Good documentation makes a major impact, but it can become a maintenance headache when decoupled from code. Therein lies the beauty of generated documentation!

When a [module](/docs/concepts/modules-workspaces/index.md) is pushed to the BSR, we automatically generate comprehensive documentation for that module and display it in the recently redesigned BSR interface, making it easily discoverable for consumers. Visit our earlier blog post for more details on [how to document APIs](/blog/document-your-apis/index.md) in Protobuf source code.

## What are Protobuf options?

Protobuf options are annotations that can be added to elements in Protobuf source files to control various aspects of how they are handled - for example, changing how data is serialized, marking types or fields as deprecated, and aliasing enum cases. One can learn more about how options work in the [Protobuf Language Guide](https://developers.google.com/protocol-buffers/docs/proto3#options).

BSR Generated Documentation now supports a selected list of Protobuf options to relay important information to consumers. At this time, we have limited the rendering of options to the [list of supported options](/docs/bsr/documentation/create-docs/index.md#annotated-protobuf-options) below:

**Message options**

- `deprecated`

**Field options**

- `deprecated`
- `packed`
- `ctype`
- `jstype`

**Enum options**

- `allow_alias`
- `deprecated`

**EnumValue options**

- `deprecated`

**Service options**

- `deprecated`

**Method options**

- `deprecated`
- `idempotency_level`

‍

The most notable addition to BSR Generated Documentation is the rendering of the deprecated option. This clearly indicates which elements are deprecated in both the index and the element definitions. Implicit deprecation, where all nested elements inside of a deprecated element become deprecated, is automatically handled by the generation as well.

As an example, check out the generated documentation for the [`google.api.expr.v1alpha1`](https://buf.build/googleapis/googleapis/docs/main:google.api.expr.v1alpha1) package in the [`buf.build/googleapis/googleapis`](https://buf.build/googleapis/googleapis) module:

![Deprecated option in index](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6747cf921bab1a092eb1d509_deprecated-option-index-LAIRH76U.png)

![Deprecated option in message](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6747cf9200c3853cb3b971f0_deprecated-option-message-GJVGCBVF.png)

Other built-in options are rendered inline with the same source code style as shown above with the Explain message. Please note that custom options are not included in BSR Generated Documentation, only the selected list of built-in options are supported at this time.

## Try out Generated Documentation today!

We’re excited for you to try out the new BSR Generated Documentation, available now! You can take advantage of the new functionality by pushing a module to the BSR. If you haven’t yet pushed your first module to the BSR, you can [read more about modules](/docs/concepts/modules-workspaces/index.md) or [walk through the Buf tour](/docs/cli/quickstart/index.md). For any questions or concerns, don't hesitate to reach out to us on [Slack](https://buf.build/b/slack) - we'd love to hear from you!

‍
