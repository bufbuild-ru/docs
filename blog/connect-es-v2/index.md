---
sidebar: false
prev: false
next: false

title: "Connect RPC for JavaScript: Connect-ES 2.0 is now generally available"
description: "Today, we’re announcing the 2.0 release of the Connect-ES project, the TypeScript implementation of Connect for Web browsers and Node.js. This release introduces improved support for major frameworks and simplified code generation. Connect-ES 2.0 now uses Protobuf-ES 2.0 APIs to leverage reflection, extension registries, and Protobuf custom options. The 2.0 release is a major version bump and comes with breaking changes. Read on to learn what’s changed and how to migrate to the 2.0 release."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/connect-es-v2"
  - - meta
    - property: "og:title"
      content: "Connect RPC for JavaScript: Connect-ES 2.0 is now generally available"
  - - meta
    - property: "og:description"
      content: "Today, we’re announcing the 2.0 release of the Connect-ES project, the TypeScript implementation of Connect for Web browsers and Node.js. This release introduces improved support for major frameworks and simplified code generation. Connect-ES 2.0 now uses Protobuf-ES 2.0 APIs to leverage reflection, extension registries, and Protobuf custom options. The 2.0 release is a major version bump and comes with breaking changes. Read on to learn what’s changed and how to migrate to the 2.0 release."
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674fa5b52c2eb6d153024a13_Connect%20RPC%20for%20JavaScript.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Connect RPC for JavaScript: Connect-ES 2.0 is now generally available"
  - - meta
    - property: "twitter:description"
      content: "Today, we’re announcing the 2.0 release of the Connect-ES project, the TypeScript implementation of Connect for Web browsers and Node.js. This release introduces improved support for major frameworks and simplified code generation. Connect-ES 2.0 now uses Protobuf-ES 2.0 APIs to leverage reflection, extension registries, and Protobuf custom options. The 2.0 release is a major version bump and comes with breaking changes. Read on to learn what’s changed and how to migrate to the 2.0 release."
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674fa5b52c2eb6d153024a13_Connect%20RPC%20for%20JavaScript.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Connect RPC for JavaScript: Connect-ES 2.0 is now generally available

_Today, we’re announcing the_ [_2.0 release of the Connect-ES project_](https://github.com/connectrpc/connect-es/releases/tag/v2.0.0)_, the TypeScript implementation of Connect for Web browsers and Node.js. This release introduces improved support for major frameworks and simplified code generation._ [_Connect-ES 2.0_](https://github.com/connectrpc/connect-es) _now uses_ [_Protobuf-ES 2.0_](https://github.com/bufbuild/protobuf-es) _APIs to leverage reflection, extension registries, and Protobuf custom options. The 2.0 release is a major version bump and comes with breaking changes. Read on to learn what’s changed and how to migrate to the 2.0 release._

## Key takeaways

- [Connect-ES 2.0](https://github.com/connectrpc/connect-es) relies on [Protobuf-ES 2.0](https://github.com/bufbuild/protobuf-es/) and is [not backward compatible](/blog/protobuf-es-v2/index.md). To ease upgrades, we’ve provided a [comprehensive migration guide](https://github.com/connectrpc/connect-es/blob/main/MIGRATING.md) and [automated tooling](https://www.npmjs.com/package/@connectrpc/connect-migrate). Migration requires Node.js 18+ and TypeScript 4.9.6+. Connect-ES 1.x and Protobuf-ES 1.x will continue to be maintained for the foreseeable future while projects migrate.
- Connect-ES 2.0 more seamlessly integrates with popular JavaScript frameworks like Sveltekit, Redux, and React Server Components [by using plain JavaScript objects instead of ES6 classes](https://github.com/bufbuild/protobuf-es/blob/v2.0.0/MANUAL.md#working-with-messages).
- [Connect interceptors](https://connectrpc.com/docs/go/interceptors/) can now use custom options, reflection, field presence, and other APIs to provide security, data quality, data governance, and other middleware within Connect-ES clients and servers.
- A unified code generation plugin, [protoc-gen-es](https://www.npmjs.com/package/@bufbuild/protoc-gen-es), simplifies configuration and minimizes the potential for compatibility errors.

## Why Connect-ES 2.0 is a major version bump

We were forced to [introduce breaking changes within the Protobuf-ES project](/blog/protobuf-es-v2/index.md) to ensure compatibility with [Protobuf Editions](/blog/protobuf-editions-are-here/index.md), so naturally this resulted in a reverberating breaking change for Connect-ES users. However, this enabled us to provide better support popular JavaScript frameworks like SvelteKit, Redux, and React Server Components.

Incorporating [Protobuf-ES 2.0](https://github.com/bufbuild/protobuf-es) into [Connect-ES 2.0](https://github.com/connectrpc/connect-es) brings these improvements to Connect-ES, starting with plain JavaScript object messages and the schema object APIs.

## Using the new schema object APIs

For a simple application that doesn't use generated message types, Connect-ES 2.0 only changes the import path for services.

Within our [Eliza demo](https://buf.build/connectrpc/eliza), the only change necessary is the import path for the `ElizaService`:

```protobuf
// changes from "./gen/eliza_connect" to "./gen/eliza_pb"
import { ElizaService } from "./gen/eliza_pb";

const request = {sentence: "Hello"}
const response = await client.say(request);
```

Working with generated types introduces a more significant change.

Instead of using the `new` keyword to create an instance of a generated ES6 class, you now use Protobuf-ES 2.0’s `create` function to instantiate plain JavaScript objects meeting a contract provided by a schema object.

Here’s an example using a generated schema and TypeScript type definition within our Eliza code:

```protobuf
import { create } from "@bufbuild/protobuf";
import { type SayRequest, SayRequestSchema } from "./gen/eliza_pb.js";

const request: SayRequest = create(SayRequestSchema, {
  sentence: "Hello",
});

const response = await client.say(request);
```

To quickly learn more about using the schema object API to create messages, serialize and deserialize data, detect field presence, and work with default values, visit the the [Protobuf-ES 2.0](/blog/protobuf-es-v2/index.md) announcement.

For a deep dive, visit the [Working with messages](https://github.com/bufbuild/protobuf-es/blob/v2.0.0/MANUAL.md#working-with-messages) section of the [Protobuf-ES 2.0 docs](https://github.com/bufbuild/protobuf-es/blob/v2.0.0/MANUAL.md).

## Improved framework support

Using plain JavaScript objects improves Connect-ES’s compatibility with JavaScript frameworks.

This is especially important for serialization-dependent features like Server-Side Rendering (SSR). ES6 classes aren't well supported within this context, whereas the plain JavaScript object nature of Protobuf-ES 2.0 allows messages to cross the “serialization boundary.”

For example, a Next.js application can fetch data with a Connect client, and pass the result to an interactive client component, without any extra steps:

```protobuf
import type { SayResponse } from "./gen/eliza_pb";
import ClientComponent from "./client-component";

export default function Page() {
  const response: SayResponse = await client.say({
    sentence: "Hello",
  });
  return (
    <main>
      <ClientComponent response={response}></ClientComponent>
    </main>
  )
}
```

Serialization isn't limited to simple types: all properties retain their value and type when crossing the boundary. Specialized numerics (such as BigInts, NaN, and Infinity), typed arrays, and even nested (proto3) messages can be passed.

We’ve also added features supporting frameworks that don't handle the serialization boundary gracefully. You can learn more in our [server-side rendering documentation](https://connectrpc.com/docs/web/ssr).

# Extending capabilities with custom options

[Custom options](https://protobuf.dev/programming-guides/proto3/#customoptions) is a feature of Protobuf schemas that allows definition of additional metadata retained within Protobuf descriptors that’s made available through reflection APIs.

By leveraging the Protobuf-ES 2.0 APIs along with Connect-ES, you can now implement cross-cutting concerns across your RPC architecture.

As an example, you could define a custom option that allowed you to mark any field of any message as a sensitive field that should never be returned to a client:

```protobuf
syntax = "proto3";

package example.options;

import "google/protobuf/descriptor.proto";

extend google.protobuf.FieldOptions {
  // Allow a field to be marked as [(example.options.sensitive) = true | false]
  bool sensitive = 8765;
}
```

Fields within messages can then be marked with this new option as an annotation. In this example, we define a user’s last name as sensitive:

```protobuf
syntax = "proto3";

package example;

message User {
  // Last name is sensitive PII and should not be exposed
  string last_name = 2 [(example.options.sensitive) = true];
  string first_name = 1;
}
```

With a custom option in place, you can now introspect a message’s fields to detect the `example.options.sensitive` annotation, inspect the annotation’s value, and take appropriate action.

By combining the [reflection and custom options APIs](https://github.com/bufbuild/protobuf-es/blob/v2.2.2/MANUAL.md#custom-options) with a [Connect-ES interceptor](https://connectrpc.com/docs/web/interceptors) in a few dozen lines of code, you can prevent all fields marked as `sensitive` from ever being returned by either unary or streaming RPCs.

Other common use cases for custom options include:

- Annotating RPCs that require authentication: client-side Connect-ES interceptors could introspect custom options and automatically send authentication tokens only when necessary. Server-side Connect-ES interceptors, acting as middleware, can then verify that requests to annotated RPCs provide a valid authentication token.
- Developing additional “dimensions” of your schema not directly supported within Protobuf, such as logical field constraints or regulatory compliance indicators.

While we’ve identified common uses for custom options above, we’re sure the Connect-ES community will continue to invent new uses for these APIs.

## Simplified code generation

Connect-ES 2.0 simplifies the tooling for code generation and its configuration.

Previously, two `protoc` plugins were required to generate code for Connect-ES:

1.  [protoc-gen-es](https://www.npmjs.com/package/@bufbuild/protoc-gen-es) - Provided Protobuf messages and enumerations
2.  [protoc-gen-connect-es](https://www.npmjs.com/package/@connectrpc/protoc-gen-connect-es) - Provided service definitions

The new version of [protoc-gen-es](https://www.npmjs.com/package/@bufbuild/protoc-gen-es) used in Connect-ES 2.0 generates both of the above, providing three benefits:

### Simplified imports

Given a single plugin, there’s now a single generated file to import.

Our [Eliza demo](https://buf.build/connectrpc/eliza) can now import both the `SayRequest` and the `ElizaService` with a single statement:

```protobuf
import { ElizaService, type SayRequest } from "./gen/eliza_pb";
```

While this isn’t a large change, it reduces the chance that mismatched imports could cause subtle, hard-to-find bugs: matching versions of services and their expected messages are always imported.

### Reduced configuration

By unifying these plugins, [buf.gen.yaml configurations](/docs/configuration/v2/buf-gen-yaml/index.md) are simpler. The `protoc-gen-connect-es` plugin can simply be removed from the file.

```yaml
version: v2
plugins:
  - local: protoc-gen-es
    opt: target=ts
    out: src/gen
- This plugin is no longer needed:
- - local: protoc-gen-connect-es
-   opt: target=ts
-   out: src/gen
```

## Migrating to Connect-ES 2.0

We want to make sure your upgrade to Connect-ES 2.0 is as as easy as possible. To help you and your team, we’ve invested in [@connectrpc/connect-migrate](https://www.npmjs.com/package/@connectrpc/connect-migrate), a tool that automates many changes for you. We’re also providing a [migration guide](https://github.com/connectrpc/connect-es/blob/main/MIGRATING.md) that details topics ranging from [running the connect-migrate tool](https://github.com/connectrpc/connect-es/blob/main/MIGRATING.md#running-the-migration-tool) to [common migration pitfalls](https://github.com/connectrpc/connect-es/blob/main/MIGRATING.md#gotchas).

Though we suggest reading the entire [migration guide](https://github.com/connectrpc/connect-es/blob/main/MIGRATING.md), here’s a summary of the process:

### Run the connect-migrate tool

Run the [@connectrpc/connect-migrate](https://www.npmjs.com/package/@connectrpc/connect-migrate) tool to assist with initial dependency, import, and `buf.gen.yaml` updates:

```protobuf
npx @connectrpc/connect-migrate@latest
```

### Complete your migration

While [connect-migrate](https://www.npmjs.com/package/@connectrpc/connect-migrate) will do a lot of the dependency legwork for you, there are use cases it doesn't cover. You may need to upgrade generated SDKs, re-generate code, or clean out old `*_connect.ts` files. All of these topics and more are covered within the complete [migration guide](https://github.com/connectrpc/connect-es/blob/main/MIGRATING.md).

## What’s next?

We’re excited to bring the benefits of Protobuf-ES to the Connect-ES platform, and we’re continuing to build from here! We’re already working on a TypeScript implementation of the popular [Protovalidate](https://github.com/bufbuild/protovalidate) project, and look forward to combining it with Connect-ES interceptors to provide automated data quality and governance.

Additionally, we’re continuing to maintain the 1.x branches of both Protobuf-ES and Connect-ES, allowing you to plan and execute your upgrade at a reasonable pace.

If you have any feedback or need any additional help migrating to Connect-ES 2.0, please reach out to [feedback@buf.build](mailto:feedback@buf.build) or [join us in Slack](https://buf.build/links/slack).
