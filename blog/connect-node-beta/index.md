---
layout: home

title: "Connect for Node.js is now available"
description: "Connect is now full-stack TypeScript"

head:
  - - meta
    - property: "og:title"
      content: "Connect for Node.js is now available"
  - - meta
    - property: "og:description"
      content: "Connect is now full-stack TypeScript"
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6750ce1c774a5b2a43d3649e_Connect%20for%20Node%20js.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Connect for Node.js is now available"
  - - meta
    - property: "twitter:description"
      content: "Connect is now full-stack TypeScript"
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6750ce1c774a5b2a43d3649e_Connect%20for%20Node%20js.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

hero:
  name: "Connect for Node.js is now available"
  tagline: "February 28, 2023"
---

When we [announced Connect-Web](/blog/connect-web-protobuf-grpc-in-the-browser/index.md) a few months ago, we were thrilled to finally bring Connect to JavaScript and, more specifically, to the browser. Since then, we’ve seen usage continue to grow and have received valuable feedback from the community. When Connect-Web was released, however, we promised that we’d soon provide a solution to extend the benefits of Connect from the frontend to the backend.

**Today we are happy to fulfill that promise with the beta release of Connect for Node.js, a series of packages for serving Connect, gRPC, and gRPC-Web APIs using Node.js. It provides first-class support for vanilla Node.js servers and popular frameworks such as** [**Express**](https://expressjs.com/) **and** [**Fastify**](https://www.fastify.io/)**.**

With Connect for Node.js, Connect is now full-stack TypeScript and can be run from the frontend to the backend, allowing TypeScript clients and servers to take advantage of all the [benefits that the Connect Protocol offers](https://connectrpc.com/docs/introduction/).

# Features

Our goal with Connect for Node.js is to provide a framework for implementing server-side endpoints that will be recognizable to Node.js developers and the JavaScript community at large. Below are a few particularly noteworthy benefits offered by Connect for Node.js:

## Full TypeScript compatibility

Connect for Node.js includes a comprehensive set of its own TypeScript type definitions for a smooth developer experience. The types and interfaces provided by Connect for Node.js enable all the benefits of type safety for server-side JavaScript code. In addition, every API in Connect for Node.js is typed accordingly.

## An adaptable built-in router

The backbone of Connect for Node.js is the `ConnectRouter`, an adaptable built-in router that’s designed to be a single registration point for RPCs. One function written to accept a `ConnectRouter` can be used to implement the handlers for all endpoints. This function can then be passed to adapters and plugins for a variety of libraries, allowing for easy integration with your favorite web framework. More details on using `ConnectRouter` are illustrated in the [examples below](/blog/connect-node-beta/index.md#examples).

## Protobuf-ES runtime integration

Connect for Node.js leverages the [Protobuf-ES runtime](https://github.com/bufbuild/protobuf-es/blob/main/docs/runtime_api.md) which enables it to take advantage of all the features provided by the library, including [Well Known Type (WKT) support](https://github.com/bufbuild/protobuf-es/blob/main/docs/runtime_api.md#well-known-types), [reflection](https://github.com/bufbuild/protobuf-es/blob/main/docs/runtime_api.md#reflection), [conformant JSON serialization/deserialization support](https://github.com/bufbuild/protobuf-es/blob/main/docs/runtime_api.md#serializing-messages), and the robust [plugin framework](https://github.com/bufbuild/protobuf-es/blob/main/docs/writing_plugins.md) for creating custom plugins to generate code from Protobuf files.

# Packages

To pave the way for the release of Connect for Node.js, we reorganized the repository and renamed it from Connect-Web to **Connect-ES**. We also created a new package structure that is more representative of the codebase. Here’s what's inside:

[**@connectrpc/connect**](https://www.npmjs.com/package/@connectrpc/connect): The main package containing all common functionality.

[**@connectrpc/protoc-gen-connect-es**](https://www.npmjs.com/package/@connectrpc/protoc-gen-connect-es): The code generator plugin required to generate code from Protobuf files.

[**@connectrpc/connect-node**](https://www.npmjs.com/package/@connectrpc/connect-node): The package providing exports for use with vanilla Node.js.

[**@connectrpc/connect-fastify**](https://www.npmjs.com/package/@connectrpc/connect-fastify): The package providing a plugin for Fastify, enabling Connect integrations with Fastify backends.

[**@connectrpc/connect-express**](https://www.npmjs.com/package/@connectrpc/connect-express): The package providing middleware for Express, enabling Connect integrations with Express.

[**@connectrpc/connect-web**](https://www.npmjs.com/package/@connectrpc/connect-web): The package providing exports for use in the web/browser.

# Examples

Implementing APIs in Connect for Node.js will feel very natural to JavaScript developers. Unary endpoints are simple functions that accept a request and return a response. All the boilerplate is abstracted away, allowing engineers to focus on business logic without worrying about the plumbing between. To illustrate, consider the following Protobuf schema definition:

```protobuf
package chat.v1;

message SayRequest {
    string sentence = 1;
}

message SayResponse {
    string sentence = 1;
}

service ChatService {
    rpc Say(SayRequest) returns (SayResponse) {}
}
```

Once the above schema is run through the Connect-ES code generator plugin, the generated code can be integrated by importing it in the same way one would import any other JavaScript library.

Creating handlers that service requests to the API can then be implemented with the help of `ConnectRouter` — a versatile utility that facilitates standing up Connect endpoints with a variety of frameworks. As a complement to `ConnectRouter`, Connect comes bundled with plugins and adapters for working with libraries such as [Fastify](https://www.fastify.io/), [Express](https://expressjs.com/), and Node's vanilla `http` and `http2` packages.

Below is an example of integrating Connect with the Fastify framework. Using `ConnectRouter` and the [@connectrpc/connect-fastify](https://www.npmjs.com/package/@connectrpc/connect-fastify) plugin, implementing endpoints can be done in no time:

```protobuf
import { ElizaService } from "./gen/connectrpc/eliza/v1/eliza_connect";
import { ConnectRouter } from "@connectrpc/connect";
import { fastifyConnectPlugin } from "@connectrpc/connect-fastify";
import { fastify } from "fastify";

const routes = (router: ConnectRouter) =>
  router.service(ElizaService, {
    async say(req) {
      return {
        sentence: `you said "${req.sentence}"`
      }
    }
  });

fastify({ http2: true })
  .register(fastifyConnectPlugin, { routes })
  .listen({port: 3000});
```

The `routes` variable above is a function that registers a service on the `ConnectRouter`. This function is then passed as an option to the `fastifyConnectPlugin`.

And that’s it! With just a few lines of code, we were able to stand up a fully functional Fastify application using Connect for Node.js. To use vanilla Node.js and the `http2` package instead of Fastify, replace the `fastifyConnectPlugin` with the `connectNodeAdapter` from [@connectrpc/connect-node](https://www.npmjs.com/package/@connectrpc/connect-node) and start the server:

```protobuf
import http2 from "http2";
import { connectNodeAdapter } from "@connectrpc/connect-node";

http2.createServer(connectNodeAdapter({ routes }))
  .listen(3000);
```

# Shared clients

The same clients utilized by web browsers with Connect-Web can be used with Connect for Node.js by simply switching the underlying transport. Consider the client for the endpoint above:

```protobuf
const client = createPromiseClient(ElizaService, transport);
const res = await client.say({ sentence: "I feel happy." });
```

This client can use a transport designed for the web/browser:

```protobuf
import { createConnectTransport } from "@connectrpc/connect-web";
const transport = createConnectTransport({
  baseUrl: "http://localhost:3000",
});
```

Or a transport tailored to Node.js:

```protobuf
import { createConnectTransport } from "@connectrpc/connect-node";
const transport = createConnectTransport({
  httpVersion: "2",
  baseUrl: "http://localhost:3000",
});
```

# What’s next?

Connect for Node.js is currently in beta, and this release will allow us to start gathering feedback from the community. We are actively working on refining and enhancing the library, and subsequent releases with more improvements will be coming soon. Please note that we may make breaking changes as we iterate based on feedback.

# Get started with Connect for Node.js

We’d love for you to try out Connect for Node.js! We have several new resources to help you get started:

- **A full** [**getting started guide**](https://connectrpc.com/docs/node/getting-started) **designed to take you from an empty directory to a fully-operational Node.js backend in 10 minutes.**
- The [open-source GitHub project](https://github.com/connectrpc/connect-es) with the full source code.
- Additional documentation for [implementing services](https://connectrpc.com/docs/node/implementing-services) and [server plugins](https://connectrpc.com/docs/node/server-plugins).

As mentioned, Connect for Node.js is still in beta, so we want your feedback! We’d love to learn about your use cases and what you’d like to do with it. For example, do you plan to use it with React, Remix, or on the edge with Vercel’s Edge Runtime? You can reach us either through the [Buf Slack](https://buf.build/b/slack/) or by filing a [GitHub issue](https://github.com/connectrpc/connect-es/issues) and we’d be more than happy to chat!
