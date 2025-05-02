---
sidebar: false
prev: false
next: false

title: "Protobuf for Javascript: Protobuf-ES 2.0 is now generally available"
description: "Today we’re announcing the 2.0 release of the Protobuf-ES project, our fully compliant Protobuf implementation for JavaScript and TypeScript. This release introduces full support for Protobuf Editions, new APIs for field presence & default values, TypeScript typing for Protobuf’s JSON Format, a full reflection API, support for Protobuf custom options, and more convenient APIs for managing extension registries. The 2.0 release is a major version bump, and comes with breaking changes. Read on to learn what’s changed and how to migrate to the 2.0 release."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/protobuf-es-v2"
  - - meta
    - property: "og:title"
      content: "Protobuf for Javascript: Protobuf-ES 2.0 is now generally available"
  - - meta
    - property: "og:description"
      content: "Today we’re announcing the 2.0 release of the Protobuf-ES project, our fully compliant Protobuf implementation for JavaScript and TypeScript. This release introduces full support for Protobuf Editions, new APIs for field presence & default values, TypeScript typing for Protobuf’s JSON Format, a full reflection API, support for Protobuf custom options, and more convenient APIs for managing extension registries. The 2.0 release is a major version bump, and comes with breaking changes. Read on to learn what’s changed and how to migrate to the 2.0 release."
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674fa94eefd10dd2fb6fc860_Protobuf%20ES%202.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Protobuf for Javascript: Protobuf-ES 2.0 is now generally available"
  - - meta
    - property: "twitter:description"
      content: "Today we’re announcing the 2.0 release of the Protobuf-ES project, our fully compliant Protobuf implementation for JavaScript and TypeScript. This release introduces full support for Protobuf Editions, new APIs for field presence & default values, TypeScript typing for Protobuf’s JSON Format, a full reflection API, support for Protobuf custom options, and more convenient APIs for managing extension registries. The 2.0 release is a major version bump, and comes with breaking changes. Read on to learn what’s changed and how to migrate to the 2.0 release."
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674fa94eefd10dd2fb6fc860_Protobuf%20ES%202.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Protobuf for Javascript: Protobuf-ES 2.0 is now generally available

_Today we’re announcing the 2.0 release of the_ [_Protobuf-ES_](https://github.com/bufbuild/protobuf-es) _project, our fully compliant Protobuf implementation for JavaScript and TypeScript. This release introduces full support for_ [_Protobuf Editions_](/blog/protobuf-editions-are-here/index.md)_, new APIs for field presence and default values, TypeScript typing for Protobuf’s JSON Format, a full reflection API, support for Protobuf custom options, and more convenient APIs for managing extension registries. The 2.0 release is a major version bump and comes with breaking changes. Read on to learn what’s changed and how to migrate to the 2.0 release._

## Key takeaways

- **Protobuf-ES 2.0 introduces several major improvements and is more compatible with popular JavaScript frameworks.** It integrates more seamlessly with your project if you’re using Redux or React Server Components.
- **You don't have to upgrade immediately unless you need Protobuf Editions support today.** We decided to bump the project’s major version and introduce necessary breaking changes to fully support [Protobuf Editions](/blog/protobuf-editions-are-here/index.md). We’ll continue supporting Protobuf-ES `v1.x` for the foreseeable future. If you’re interested in migrating, [we’ve written a detailed guide](https://github.com/bufbuild/protobuf-es/blob/main/MANUAL.md#migrating-from-version-1) to help you.
- **Connect-ES and its ecosystem don’t yet support Protobuf-ES 2.0, but they will soon.** If you depend on Connect-ES, we recommend pinning to Protobuf-ES 1.0 for now in `package.json` and `buf.gen.yaml`, or you can try out the [latest pre-release of Connect-ES 2.0](https://github.com/connectrpc/connect-es/releases).

## How Protobuf-ES 2.0 supports Protobuf Editions and JavaScript

Protobuf-ES 2.0 is currently the only JavaScript and TypeScript runtime that offers [full ecosystem conformance](https://github.com/bufbuild/protobuf-conformance) and support for [Protobuf Editions](/blog/protobuf-editions-are-here/index.md). Introducing a major version bump (with backward incompatible API changes) was a difficult decision for us, but we felt it was essential for the JavaScript ecosystem to have a fully conformant Protobuf implementation that correctly supported Protobuf Editions. Unfortunately, we could not achieve that goal while remaining backward compatible. Given this reality, we took this opportunity to revisit some of our original design decisions and address some of the feedback we’ve heard from our users to make Protobuf-ES even easier to work with.

### New code generation APIs with TypeScript typing

In version 1.0 of Protobuf-ES, we relied heavily on ES6 classes as the basis for our generated types. Though many other language ecosystems tend to represent Protobuf messages this way, popular JavaScript frameworks such as Redux and React Server Components don’t support them well, making it cumbersome to use our generated types.

In version 2.0 of Protobuf-ES, we no longer generate classes for Protobuf messages. Instead, we generate a schema object and an associated TypeScript type definition for each message. Schema objects are a powerful feature you may already be familiar with — they’re used extensively in [protoplugin](https://www.npmjs.com/package/@bufbuild/protoplugin), our framework for [writing Protobuf plugins in TypeScript](https://github.com/bufbuild/protobuf-es/blob/v2.0.0/MANUAL.md#writing-plugins). These schema objects and types can be easily combined with our APIs and exposed as simple functions.

Here’s a quick example that constructs a new message and serializes it using our new 2.0 APIs:

```typescript
import { create, toBinary } from "@bufbuild/protobuf";
import { type User, UserSchema } from "./gen/example_pb";

let user: User = create(UserSchema, {
  firstName: "Homer",
  lastName: "Simpson",
  active: true,
});

const bytes = toBinary(UserSchema, user);
```

In this example, the value of `user` is a plain object that plays much nicer with popular frameworks like Redux and React Server Components. To learn more about these APIs, visit the [Working with messages](https://github.com/bufbuild/protobuf-es/blob/v2.0.0/MANUAL.md#working-with-messages) section of the docs.

### Field presence and default values support for Protobuf messages

Protobuf-ES 2.0 now provides support for tracking and detecting field presence for Protobuf messages and returns default values for unset fields when configured to do so. Here’s an example of how this works:

```protobuf
// Given this message definition:
syntax = "proto3";

message Presence {
  // Implicit presence - false is not serialized.
  bool a = 1;
  // Explicit presence - false is serialized.
  optional bool b = 2;
}
```

```typescript
import { isFieldSet } from "@bufbuild/protobuf";
import { PresenceSchema } from "./gen/example_pb";

const msg = create(PresenceSchema);
isFieldSet(msg, PresenceSchema.field.a); // false
isFieldSet(msg, PresenceSchema.field.b); // false

msg.a = false;
msg.b = false;
isFieldSet(msg, PresenceSchema.field.a); // false
isFieldSet(msg, PresenceSchema.field.b); // true
```

Field presence is a (surprisingly) complex topic in Protobuf. If you’d like to learn more about how it works, we recommend reading the [official field presence guide](https://protobuf.dev/programming-guides/field_presence/). To learn more about our presence APIs, visit the [Field presence and default values](https://github.com/bufbuild/protobuf-es/blob/v2.0.0/MANUAL.md#field-presence-and-default-values) section of the docs.

### New reflection APIs built for Protobuf schemas

Protobuf-ES 2.0 now comes with a complete runtime reflection API that enables you to dynamically work with Protobuf schemas via [descriptors](/docs/reference/descriptors/index.md#deep-dive-into-the-model). It also comes with a [collection of hierarchical wrapper types](https://github.com/bufbuild/protobuf-es/blob/v2.0.0/MANUAL.md#descriptors) which makes reflection tasks far easier to deal with. Here’s an example of walking through a schema:

```typescript
import { file_example as file } from "./gen/example_pb";

// Loop through all messages defined at the root
for (const message of file.messages) {
  message; // DescMessage
  message.typeName; // The fully qualified name, e.g. "example.User"

  // Loop through all fields for this message
  for (const field of message.fields) {
    field; // DescField
  }

  // Messages, enumerations, and extensions can be nested in a message definition
  message.nestedMessages; // DescMessage[]
  message.nestedEnums; // DescEnum[]
  message.nestedExtensions; // DescExtension[]
}

// Loop through all enumerations defined at the root
for (const enumeration of file.enums) {
  enumeration; // DescEnum
  enumeration.typeName; // The fully qualified name, e.g. "example.PhoneType"

  // Loop through all values of this enumeration
  for (const value of enumeration.values) {
    value; // DescEnumValue
    value.name; // The name as specified in the source, e.g. "PHONE_TYPE_MOBILE"
  }
}

// Loop through all services
for (const service of file.services) {
  service; // DescService
  service.typeName; // The fully qualified name, e.g. "example.UserService"

  // Loop through all methods of this service
  for (const method of service.methods) {
    method; // DescMethod
    method.name; // The name as specified in the source, e.g. "CreateUser"
  }
}

// Loop through all extensions defined at the root
for (const extension of file.extensions) {
  method; // DescExtension
  extension.typeName; // The fully qualified name, e.g. "example.sensitive"
}
```

If you’d like to learn more about what Protobuf descriptors can do, we recommend checking out our [detailed guide](/docs/reference/descriptors/index.md#what-are-descriptors) on the topic. For more details on how to use the new reflection APIs, check out the [Reflection](https://github.com/bufbuild/protobuf-es/blob/v2.0.0/MANUAL.md#reflection) section of the docs.

### More capable and convenient registry APIs

Protobuf-ES 2.0 provides brand new registry APIs, which are necessary when working with [Protobuf Extensions](https://protobuf.dev/programming-guides/proto2/#extensions) or using Google’s [Any](https://protobuf.dev/programming-guides/proto3/#any) message type in a JSON payload. Protobuf-ES has a number of different kinds of registries available for different use cases. Here’s an example of the core registry API:

```typescript
import type { Registry } from "@bufbuild/protobuf";

declare const registry: Registry;

// Retrieve a type by its qualified name
registry.getMessage("example.User"); // DescMessage | undefined
registry.getEnum("example.PhoneType"); // DescEnum | undefined
registry.getService("example.MyService"); // DescService | undefined
registry.getExtension("example.sensitive"); // DescExtension | undefined

// Loop through types
for (const type of registry) {
  type.kind; // "message" | "enum" | "extension" | "service"
}
```

For more details on how they work, check out the [Registries](https://github.com/bufbuild/protobuf-es/blob/v2.0.0/MANUAL.md#registries) section of the docs.

### Support for Protobuf custom options

[Custom options](https://protobuf.dev/programming-guides/proto3/#customoptions) is a feature of Protobuf schemas that allow files to define additional metadata that’s retained as part of Protobuf descriptors and made available through Reflection APIs. Protobuf-ES 2.0 now provides APIs for interacting with them. Here’s a quick example:

```protobuf
// First, define a custom field option.
syntax = "proto3";
package example.options;
import "google/protobuf/descriptor.proto";

extend google.protobuf.FieldOptions {
  // This field should be redacted
  bool sensitive = 8765;
}
```

```protobuf
// Then, use it in a message.
syntax = "proto3";
package example;

message User {
  string first_name = 1;
  string last_name = 2 [(example.options.sensitive) = true];
}
```

```typescript
import { getOption } from "@bufbuild/protobuf";
import { UserSchema } from "./gen/example_pb";
import { sensitive } from "./gen/example-option_pb";

getOption(UserSchema.field.lastName, sensitive); // true
```

Custom options is a very useful and powerful feature of Protobuf — for more details on how to work with them, check out the [official documentation on Custom options](https://protobuf.dev/programming-guides/proto3/#customoptions). For more details on how to use Custom options with Protobuf-ES, check out the [Custom options](https://github.com/bufbuild/protobuf-es/blob/v2.0.0/MANUAL.md#custom-options) section of the docs.

### TypeScript types for Protobuf JSON format

Protobuf-ES 2.0 now provides a [new plugin option](https://github.com/bufbuild/protobuf-es/blob/v2.0.0/MANUAL.md#json_typestrue) that instructs the compiler to emit strictly JSON-compatible TypeScript types that match exactly what you expect to receive when passing a Protobuf message to the `toJson` function. Here’s an example of how they work:

```protobuf
// Given this message:
syntax = "proto3";

message Example {
  int32 amount = 1;
  bytes data = 2;
}
```

```typescript
/**
 * JSON type for the message Example.
 */
export type ExampleJson = {
  /**
   * @generated from field: int32 amount = 1;
   */
  amount?: number;

  /**
   * @generated from field: bytes data = 2;
   */
  data?: string;
};

const example = create(ExampleSchema, { amount: 123 });
const json: ExampleJson = toJson(ExampleSchema, example);

// Without json_types=true, the following type
// information would be unavailable:
json.amount; // number | undefined
json.data; // string | undefined
```

For more details on how to use JSON typing with your Protobuf schemas, visit the [JSON types](https://github.com/bufbuild/protobuf-es/blob/v2.0.0/MANUAL.md#json-types) section of the docs.

## Upgrading to Protobuf-ES 2.0 for JavaScript projects

If your project doesn’t need to make use of Protobuf Editions, you don’t have to upgrade to 2.0. We recommend pinning to the `1.x` releases to ensure you’ll continue to get the latest update for 1.0. At this time, we have no plans to stop maintaining v1. **If you're planning to upgrade, you’ll need to upgrade your runtime dependencies _and_ re-generate all the code for your schemas.**

For more detailed guidance on how to migrate to the 2.0 release, please take a look at our [migration guide](https://github.com/bufbuild/protobuf-es/blob/v2.0.0/MANUAL.md#migrating-from-version-1) to learn more.

## What's next?

We’re excited to share Protobuf-ES 2.0 with the JavaScript ecosystem, and we’re not stopping here! In the coming weeks, we’ll be updating Connect-ES to support Protobuf-ES 2.0. We’re also excited to use the new capabilities of Protobuf-ES 2.0 to provide a TypeScript implementation of the popular [Protovalidate](https://github.com/bufbuild/protovalidate) project.

If you have any feedback or need any additional help migrating to Protobuf-ES 2.0, please reach out to [feedback@buf.build](mailto:feedback@buf.build) or [join us in Slack](https://buf.build/links/slack).
