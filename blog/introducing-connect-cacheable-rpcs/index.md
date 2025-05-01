---
sidebar: false
prev: false
next: false

title: "Introducing Cacheable RPCs in Connect"
description: "We’ve expanded the Connect protocol to support the use of HTTP GET requests, enabling web browsers and CDNs to cache Connect requests with ease."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/introducing-connect-cacheable-rpcs"
  - - meta
    - property: "og:title"
      content: "Introducing Cacheable RPCs in Connect"
  - - meta
    - property: "og:description"
      content: "We’ve expanded the Connect protocol to support the use of HTTP GET requests, enabling web browsers and CDNs to cache Connect requests with ease."
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6750cc63468564195baa47e0_Cacheable%20RPCs.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Introducing Cacheable RPCs in Connect"
  - - meta
    - property: "twitter:description"
      content: "We’ve expanded the Connect protocol to support the use of HTTP GET requests, enabling web browsers and CDNs to cache Connect requests with ease."
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6750cc63468564195baa47e0_Cacheable%20RPCs.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Introducing Cacheable RPCs in Connect

Resource caching is an effective strategy to improve performance and reduce load when running a service. Unfortunately, because gRPC requests use `POST` requests, implementing caching for gRPC services the way one would with RESTful services is often cumbersome or impossible.

As part of our commitment to build a better RPC protocol, **we’re pleased to announce that we have expanded the Connect protocol to support the use of HTTP `GET` requests, enabling web browsers and CDNs to cache Connect requests with ease.** Using [connect-go](https://github.com/connectrpc/connect-go) 1.7.0 or greater, it is now possible to both handle and make `GET` requests using RPCs, almost exactly the way it is done today with `POST`, allowing web browsers and CDN services to cache Connect requests with ease.

In this article, we’ll discuss how to use this feature, where it’s useful, and show how existing gRPC services can be adapted to take advantage of this feature using Envoy.

## Getting started with GET requests

To use HTTP `GET`, RPC methods have to be annotated with the built-in Protobuf [`idempotency_level`](https://github.com/protocolbuffers/protobuf/blob/e5679c01e8f47e8a5e7172444676bda1c2ada875/src/google/protobuf/descriptor.proto#L803) option and specify `NO_SIDE_EFFECTS` . This asserts that the RPC is safe to use as a `GET` request (which can now be assumed when using both a Connect client and service). For example, here is how one might annotate the `PetStore` example service:

```protobuf
service PetStore {
  rpc GetPet(GetPetRequest) returns (GetPetResponse) {
    option idempotency_level = NO_SIDE_EFFECTS;
  }
  rpc PutPet(PutPetRequest) returns (PutPetResponse) {}
  rpc DeletePet(DeletePetRequest) returns (DeletePetResponse) {}
}
```

With this annotation, when `buf generate` is invoked with connect-go 1.7 or newer, Connect servers will automatically support HTTP `GET` requests — no other code modifications are needed.

On the client side, we need to instruct the Connect client to use `GET` requests. In connect-go, this is done by specifying the `WithHTTPGet()` option when creating a client:

```protobuf
client := petv1.NewPetStoreClient(
    http.DefaultClient,
    connect.WithHTTPGet(),
)
```

That’s it! This client will transparently use HTTP `GET` when `PetStore` methods without side effects are called.

Reference our [documentation](https://connectrpc.com/docs/go/get-requests-and-caching) for more information.

## Benefits of using GET requests with Connect

Now that we’ve discussed _how_ to use `GET` requests, let’s discuss _why_ one might use `GET` requests.

- **Caching:** `GET` requests are easy to cache, both in the browser and in most CDNs. It’s easy to set standard response headers like [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) to inform browsers, CDNs, and other middleboxes how to manage caching for a given request, and for how long the response is valid.
- **Ease of use:** `GET` requests with JSON payloads are so easy to formulate, they can be written directly in a browser URL bar. This makes developing and testing programs simpler.

![Screenshot of a browser showing a Connect endpoint](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6747a3e74202f4330658eecf_browse-to-endpoint-Y7767U24.png)

- **Lower CORS overhead:** Connect `GET` requests meet the requirements to avoid [CORS](https://www.w3.org/TR/2020/SPSD-cors-20200602/) preflight requests, as they don’t require any non-simple headers and use `GET`, a simple method. This means fewer network round-trips for RPCs, a big win when dealing with unpredictable latency (such as when communicating over cellular networks).
- **And more!** `GET` requests are versatile; it’s now possible to use Connect with tools that don’t necessarily speak the Connect protocol. Many programs can fetch an arbitrary URL and consume a JSON response; these tools can be used to make Connect `GET` requests. For example, now it’s possible to make Connect requests inside of Microsoft Power Query, or even use Connect APIs inside of Shortcuts on an iPhone or iPad.

## Better gRPC interoperability with Envoy

Connect clients generally support communicating with vanilla gRPC and gRPC-web servers, but doing so prevents one from taking advantage of features unique to the Connect protocol. Users of the Envoy proxy will be pleased to know that Envoy 1.26 now ships with a [Connect-gRPC bridge](https://www.envoyproxy.io/docs/envoy/v1.26.0/configuration/http/http_filters/connect_grpc_bridge_filter#config-http-filters-connect-grpc-bridge) that allows clients to speak the Connect protocol (including `GET` requests) to existing gRPC servers. This filter can be used without modifying any existing code. In addition, it doesn’t require configuration, gRPC reflection, or access to the underlying schema. That means it doesn’t need to be re-deployed when the underlying service changes, either — just set it and forget it!

To showcase this new capability, [we created a demo](https://github.com/connectrpc/envoy-demo) showing how to use gRPC-Go with Envoy 1.26 to make `GET` requests directly to a vanilla gRPC service.

Please note that this bridge filter is brand new and is not yet considered “stable” in Envoy, as it has not seen substantial testing in production environments.

We’re excited to see what these new features can enable and, more importantly, what we can do to continue to make Connect the best RPC protocol. Try the new [`GET` request feature](https://connectrpc.com/docs/go/get-requests-and-caching) and [Envoy filter](https://www.envoyproxy.io/docs/envoy/v1.26.0/configuration/http/http_filters/connect_grpc_bridge_filter#config-http-filters-connect-grpc-bridge) and let us know what you think via the [Buf Slack](https://buf.build/b/slack/). We’re always happy to chat about it!

‍
