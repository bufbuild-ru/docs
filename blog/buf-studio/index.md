---
layout: home

title: "Buf Studio: Interact with gRPC and Protobuf APIs directly from your browser"
description: "Buf studio is an interactive web UI that lets you easily call your gRPC and Protobuf services from a browser."

head:
  - - meta
    - property: "og:title"
      content: "Buf Studio: Interact with gRPC and Protobuf APIs directly from your browser"
  - - meta
    - property: "og:description"
      content: "Buf studio is an interactive web UI that lets you easily call your gRPC and Protobuf services from a browser."
  - - meta
    - property: "og:image"
      content: ""
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Buf Studio: Interact with gRPC and Protobuf APIs directly from your browser"
  - - meta
    - property: "twitter:description"
      content: "Buf studio is an interactive web UI that lets you easily call your gRPC and Protobuf services from a browser."
  - - meta
    - property: "twitter:image"
      content: ""
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

hero:
  name: "Buf Studio: Interact with gRPC and Protobuf APIs directly from your browser"
  tagline: "July 28, 2022"
---

[Buf Studio](https://buf.build/studio) is an interactive web UI for all your gRPC and Protobuf services stored on the [Buf Schema Registry](https://buf.build/product/bsr). Buf Studio makes it easy to:

- **Debug**: Developers can use Protobuf definitions they have stored on the BSR to make requests to production servers, and understand the responses being returned.
- **Develop**: As you make changes to your APIs and/or business logic, you can validate them with real requests to your various testing/staging environments.
- **Gain business insights**: Buf Studio allows non-engineers to make requests against key APIs that can provide business intelligence, and save and share those pre-populated requests with teammates for common queries.

Head over to buf.build/studio and [give the demo a try!](https://buf.build/studio/connectrpc/eliza/connectrpc.eliza.v1.ElizaService/Say?target=https%3A%2F%2Fdemo.connectrpc.com&demo=true)

We took a lot of inspiration and learnings from other tools that came before Buf Studio, such as grpcui, Postman, and others, but made the premise even simpler and more tailored:

- No desktop application required — Studio is based entirely in the browser and has access to any Protobuf definitions hosted on the BSR. Push your module up to the BSR and you're ready to go!
- Studio supports making requests with both gRPC and [Connect](https://connectrpc.com/), our framework that [simplifies](/blog/connect-a-better-grpc/index.md) RPC with Protobuf.

Studio was created with both engineers and non-engineers in mind. Features we're excited about:

- Use any module you have access to on the BSR, so **no need to download your Protobuf definitions locally.**
- You can customize your request body in JSON form. The editor provides **autocompletion** and **schema validation** based on your selected Protobuf definition. You can also customize headers for your request and configure cookies.
- For gRPC services, we provide a small, simple proxy in the [`buf` CLI](https://github.com/bufbuild/buf), Buf Studio Agent, that **allows Buf Studio to communicate with your gRPC servers from the browser**.
- Lastly, all **requests and can be shared** using a sharable link with other users.

Buf Studio gives BSR users the ability to better introspect the behaviors of their Protobuf APIs by providing a simple-to-use, clean UI to their servers. The gRPC protocol is incompatible with any major browser, so we built the Buf Studio Agent into the `buf` CLI to provide a thin layer to handle the requests from Buf Studio to your gRPC server. The sharing functionality also helps enable collaboration across users and build trust by testing live Protobuf APIs.

We are excited for you to try Buf Studio and to hear from you on feedback you have for us. Buf Studio is in the early stages, and many improvements are coming down the pipeline - we'd love to hear what would be most useful for your workflows! Reach out to us on our [Slack](https://buf.build/b/slack) or if you'd like more details on Buf Studio, and check out the [Buf Studio documentation](/docs/bsr/studio/index.md).
