---
layout: home

title: "Connect-Web: It's time for Protobuf and gRPC to be your first choice in the browser"
description: "Use connect-web to generate compact, idiomatic TypeScript clients for your Protobuf APIs."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/connect-web-protobuf-grpc-in-the-browser"
  - - meta
    - property: "og:title"
      content: "Connect-Web: It's time for Protobuf and gRPC to be your first choice in the browser"
  - - meta
    - property: "og:description"
      content: "Use connect-web to generate compact, idiomatic TypeScript clients for your Protobuf APIs."
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Connect-Web: It's time for Protobuf and gRPC to be your first choice in the browser"
  - - meta
    - property: "twitter:description"
      content: "Use connect-web to generate compact, idiomatic TypeScript clients for your Protobuf APIs."
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

hero:
  name: "Connect-Web: It's time for Protobuf and gRPC to be your first choice in the browser"
  tagline: "August 4, 2022"
---

Today we're releasing [`connect-web`](https://github.com/connectrpc/connect-es), an idiomatic TypeScript library for calling RPC servers from web browsers. If you've been unimpressed by gRPC and Protobuf on the web before, now's the time to take another look: `connect-web` generates modern TypeScript that's just as ergonomic as a hand-written REST client. Clients work seamlessly with the gRPC ecosystem, and they also support Connect's more browser-friendly protocol. [**`connect-web`**](https://github.com/connectrpc/connect-es) **is available now under an Apache 2 open source license, and both documentation and a sample app are available on** [**connectrpc.com**](https://connectrpc.com/)**.** One layer at a time, we're making Protobuf the best choice for API development throughout your stack — from browsers and phones all the way into your backend services.

## RPC as awesome as the web

TypeScript and Protocol Buffers might seem like a natural pairing, but the gRPC ecosystem has treated the web platform as a distant afterthought. Google's `grpc-web` made an early attempt to solve gRPC on the web, but developing with `grpc-web` is miserable: TypeScript support is a half-hearted experiment, there's no support for JSON or ECMAScript modules, the generated JavaScript looks more like decade-old Java, and bundles are enormous. Every response has a `200 OK` status and an opaque binary body, so the network inspector is nearly unusable, and just sending requests to a gRPC backend requires a proxy. It's no surprise that most web developers continue to write REST clients by hand.

The web deserves better. `connect-web` finally unlocks the potential of Protobuf and TypeScript: fully generated, type-safe clients with the ergonomics of hand-crafted code.

- From top to bottom, the `connect-web` runtime and generated code are idiomatic TypeScript — no setters, getters, or other Java-isms. Our [Protobuf implementation](https://github.com/bufbuild/protobuf-es) passes the full suite of conformance tests, so serialized data is compatible with Protobuf implementations in dozens of languages.
- The runtime and generated code support Protobuf's standard JSON mapping, so you can send human-readable data over the network.
- `connect-web` clients support two RPC protocols: gRPC-Web and the Connect ecosystem's own protocol. The two clients have the same interface, so swapping protocols is as simple as changing constructors. Calling our live demo service is a type-safe one-liner:

```protobuf
const answer = await client.say({ sentence: "I feel happy." });
console.log(answer);
// {sentence: 'When you feel happy, what do you do?'}
```

- The [Connect protocol](https://connectrpc.com/docs/protocol) is a simple, POST-only protocol that works over HTTP/1.1 or HTTP/2. It takes the best portions of gRPC and gRPC-Web, including streaming, and packages them into a protocol that's simple enough to debug with the network inspector. If your backends are built with [`connect-go`](https://github.com/connectrpc/connect-go), you can use the Connect protocol to call them directly — no proxy required. We could hand-write the call above using `fetch`:

```protobuf
const res = await fetch(
    "https://demo.connectrpc.com/connectrpc.eliza.v1.ElizaService/Say",
    {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: `{"sentence": "I feel happy."}`,
    }
);
const answer = res.json();
console.log(answer);
// {sentence: 'When you feel happy, what do you do?'}
```

- `connect-web` clients also support the full gRPC-Web protocol, including server streaming and error details. `connect-go` and `Grpc.AspNetCore` servers speak the gRPC-Web protocol natively, and Envoy [can proxy requests](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/grpc_web_filter) to any other gRPC backend. We validate our gRPC-Web implementation using an [extended version](https://github.com/connectrpc/conformance) of gRPC's own compatibility test suite.
- Clients offer both promise- and callback-based APIs, so they [integrate easily](https://github.com/connectrpc/examples-es) with React, Angular, Svelte, and other UI frameworks. With promises, consuming a server stream is as simple as a `for await` loop.
- Despite all these features, tree-shaking and the web platform's more modern APIs keeps `connect-web` bundles small. Our demo service's bundle shrank by [80% smaller](https://github.com/connectrpc/connect-es/blob/main/packages/connect-web-bench/README.md) when we switched away from `grpc-web`, and larger APIs benefit even more.

In the [Buf Schema Registry](https://buf.build/) and our other products, we've completely replaced `grpc-web` with `connect-web`. For the first time, using Protobuf in our frontend doesn't feel like a compromise: we get the simplicity and ergonomics of a well-written REST client without any of the drudgery.

`connect-web` is currently in beta: our products rely on it, but we may make a few changes as we gather feedback from early adopters. We take semantic versioning _very_ seriously: we're planning to release a `v1.0` in a few months, after which we'll never break your builds.

## Coming soon: Node.js, Android, and iOS

Along with `connect-go` and `connect-web`, we've been working on a Connect implementation for server-side TypeScript. We're still testing out the Web Streams API in Node.js, but we anticipate having an early release ready in a few months.

More broadly, working on `connect-web` highlighted just how poor the client experience is for Protobuf-based APIs — not just on the web, but also on Android and iOS. Our business thrives when companies can use Protobuf ubiquitously, so we're beginning to work on Connect for Kotlin and Swift too.

## Get involved!

We'd love to hear what you think of Connect: check out the [Getting Started guide](https://connectrpc.com/docs/web/getting-started), try Connect in your next project, poke through the [live demonstration project](https://github.com/connectrpc/examples-go) or the various [framework-specific examples](https://github.com/connectrpc/examples-es), and please [file issues](https://github.com/connectrpc/connect-es/issues) or chat with us in the [Buf Slack](https://buf.build/b/slack) if something doesn't work as you expect.

‍
