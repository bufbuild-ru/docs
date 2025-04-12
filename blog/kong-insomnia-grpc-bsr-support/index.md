---
layout: home

hero:
  name: "The BSR now integrates with Kong Insomnia, making gRPC even easier to use"
  tagline: "May 3, 2024"
---

Kong Insomnia’s 9.0 release, which [shipped](https://konghq.com/blog/product-releases/insomnia-9-0-pre-request-scripting-api-mocking) last week, [integrates support for the Buf Schema Registry](https://github.com/Kong/insomnia/pull/6975). Organizations adopting gRPC can now take advantage of Insomnia's rich feature set while keeping schema access simple and secure. Under the hood, this integration is powered by the [BSR's new Reflection API](/docs/bsr/reflection/overview/index.md) — the first production-ready API for dynamic Protobuf schema access.

Insomnia integration is available now for all BSR users, so [**sign up for free (no credit card required) and try it out!**](https://buf.build/pricing)

## Using the BSR with Insomnia

Point your request at your BSR instance, provide it with your [BSR API Token](/docs/bsr/authentication/index.md), and specify which Buf module contains your schemas.

![Insomnia's gRPC request settings](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/67468636115d4cae4307ae0b_insomnia-settings-JD6GXRRS.png)

Once configured, you can query the BSR for a list of available services and RPCs. Using the schemas provided by the BSR, Insomnia automatically converts binary requests and responses to and from human-readable JSON.

![Using the BSR to explore RPCs and render JSON](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674686366695c1d063509cfc_insomnia-buf-demo-53FKJ2K2.gif)

## Buf's Reflection API vs. gRPC Server Reflection

gRPC server reflection is difficult to use at scale: it doesn't work in web browsers, encourages clients to implement bespoke caching logic, doesn't handle versioning across multiple projects, and doesn't have any built-in authentication or authorization mechanisms. It's fine for local development, but poorly designed for production workloads.

The [Buf Reflection API](https://github.com/bufbuild/reflect-proto) solves these problems neatly. It relies on request-response RPCs that work well in browsers, uses standard HTTP caching directives, correctly handles projects using different versions of common dependencies, and uses [BSR API tokens](/docs/bsr/authentication/index.md) to manage authentication and authorization. For critical developer tools and dynamic schema access in production, the BSR Reflection API is the simpler, safer, and more robust choice.

## What’s next?

We're always looking for new products and tools to integrate with, and we can’t wait to see else our community comes up with. Reach out to [feedback@buf.build](mailto:feedback@buf.build) to share your ideas and feedback with us!

‍
