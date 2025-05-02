---
sidebar: false
prev: false
next: false

title: "Connect: A better gRPC"
description: "Use Connect to build simple, stable, browser and gRPC-compatible APIs."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/connect-a-better-grpc"
  - - meta
    - property: "og:title"
      content: "Connect: A better gRPC"
  - - meta
    - property: "og:description"
      content: "Use Connect to build simple, stable, browser and gRPC-compatible APIs."
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Connect: A better gRPC"
  - - meta
    - property: "twitter:description"
      content: "Use Connect to build simple, stable, browser and gRPC-compatible APIs."
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Connect: A better gRPC

Today we're releasing Connect, a slim framework for building browser and gRPC-compatible HTTP APIs. Connect is production-ready — focused, simple, and debuggable — and it's fully compatible with gRPC clients and servers. If you're frustrated by the complexity and instability of today's gRPC libraries, we think you'll find Connect a breath of fresh air. [**connect-go**](https://github.com/connectrpc/connect-go) **is available now under an Apache 2 open source license, and documentation is available on** [**connectrpc.com**](https://connectrpc.com/)**.** We'll release Connect for TypeScript soon, with more languages to follow.

## Another RPC framework?

In the seven years since its announcement, gRPC has brought much-needed consensus to Protobuf RPC. Starting from a soup of competing, mutually incompatible hobby projects, the gRPC team has rallied the community around a common protocol, introduced many developers to RPC-style APIs, and driven the popularity of Protobuf outside Google. Thanks to their tireless efforts, we can specify our APIs with Protobuf, implement them with gRPC, and be confident that most languages will have a compatible client library.

Conceptually, the [gRPC protocol is HTTP](https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md) with Protobuf-encoded bodies and a sprinkling of metadata. Despite that straightforward premise, the protocol and today's gRPC libraries share a maximalist design ethos that has led to extraordinary complexity. Rather than making production systems simple and stable, gRPC over-complicates development, deployment, debugging, and maintenance.

As an example, consider Google's gRPC implementation in Go:

- Excluding comments, `grpc-go` is 130 thousand lines of hand-written code. It has dozens of subpackages, nearly a hundred configuration options, and bespoke name resolution and load balancing mechanisms. Just sifting through the kitchen sink of features takes hours, and the sheer quantity of code makes [subtle bugs](https://github.com/grpc/grpc-go/issues/632) and [resource leaks](https://github.com/grpc/grpc-go/pull/5339) inevitable.
- Rather than using the Go standard library's `net/http`, `grpc-go` uses its own implementation of HTTP/2. It's incompatible with the rest of Go's HTTP ecosystem, so you can't cleanly serve gRPC requests alongside other HTTP traffic and can't use most third-party packages.
- The gRPC protocol requires end-to-end support for HTTP/2 and trailers. Supporting common HTTP clients — like web browsers — requires elaborate translating proxies.
- In addition to using obscure HTTP features, the gRPC protocol is difficult to debug. Even with [JSON support enabled](https://grpc.io/blog/grpc-with-json/), simple request-response RPCs mix the JSON you care about with binary framing data. Forget `curl | jq` or the Chrome network inspector — the available tools are all immature and gRPC-specific.
- As a policy, `grpc-go` [doesn't follow](https://github.com/grpc/grpc-go/blob/master/Documentation/versioning.md) semantic versioning; the release notes even include a special section for "Behavior Changes." At least four releases in the past year have broken backward compatibility, and prominent gRPC users (including [etcd](https://etcd.io/)) are often unable to update for months at a time.

Balancing the needs of `grpc-go`'s open source community and Google's internal users is a difficult and thankless task. And perhaps its breadth of features and options are required for adoption within Google. For the rest of us, the complexity and instability of `grpc-go` represents an unpleasant distraction from our core business.

## Production-grade simplicity

Connect brings simplicity back to Protobuf-powered APIs. Each Connect implementation is _focused_: just the essential features, built on top of time-tested HTTP libraries and designed to get out of your way.

- In Go, Connect is just one package, with a few thousand lines of code and a handful of commonly-used options. Even [the generated code](https://github.com/connectrpc/examples-go/blob/main/internal/gen/connectrpc/eliza/v1/elizav1connect/eliza.connect.go) is meant to be read.
- It's built on `net/http`. Connect handlers implement `http.Handler`, and Connect clients wrap `http.Client`. They work with any third-party router, middleware, or server.
- On top of `net/http`'s foundation, `connect-go` supports three RPC protocols: gRPC, gRPC-Web, and Connect's own protocol. Handlers support all three protocols by default, and clients can switch protocols with [one config option](https://pkg.go.dev/connectrpc.com/connect#WithGRPC) — no other code changes necessary.
- The [Connect protocol](https://connectrpc.com/docs/protocol) is a simple, POST-only protocol that works over HTTP/1.1 or HTTP/2. It takes the best portions of gRPC and gRPC-Web, including streaming, and packages them into a protocol that works equally well in browsers, monoliths, and microservices. The Connect protocol is what we think the gRPC Protocol should be. By default, JSON- and binary-encoded Protobuf is supported. Calling a Connect API is as easy as using `curl`:

```bash
# Try it out! This is a live demo!
curl \
    --header "Content-Type: application/json" \
    --data '{"sentence": "I feel happy."}' \
    https://demo.connectrpc.com/connectrpc.eliza.v1.ElizaService/Say
```

`‍   `

- `connect-go` also supports the full gRPC protocol, including streaming, headers, trailers, and error details. gRPC-compatible [server reflection](https://github.com/connectrpc/grpcreflect-go) and [health checks](https://github.com/connectrpc/grpchealth-go) are available as standalone packages. Instead of cURL, we could call our Connect API with [`grpcurl`](https://github.com/fullstorydev/grpcurl):

```bash
# This is also a live demo!
go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latest
grpcurl \
    -d '{"sentence": "I feel happy."}' \
    demo.connectrpc.com:443 \
    connectrpc.eliza.v1.ElizaService/Say
```

`‍   `

- Handlers and clients also support the gRPC-Web protocol, so browsers can connect directly to your server. We validate our gRPC and gRPC-Web implementations using an [extended version](https://github.com/connectrpc/conformance) of Google's own interoperability tests.
- Headers, trailers, and other metadata are passed explicitly, without attaching anything to Go contexts. With generics, the resulting code is ergonomic, type-safe, and easy to reason about.

If you've used the [Buf CLI or Schema Registry](https://buf.build/), you've used Connect — internally, we've completely replaced `grpc-go` with `connect-go`. We've found Connect a joy in production: it's small, simple, and debuggable.

In Go, Connect is currently in beta: we rely on it in production, but we may make a few changes as we gather feedback from early adopters. We're planning to tag a stable `v1.0` in October, soon after the Go 1.19 release. We take semantic versioning _very_ seriously: once we release `v1.0`, we'll never break your builds.

## Coming soon

We've got big plans for the Connect ecosystem! Along with Connect in Go, we've been working on a TypeScript implementation for browsers. It shares the same design priorities: it's idiomatic TypeScript all the way down, stays close to the browser's fetch API, fits neatly into React hooks, and supports both gRPC-Web and Connect's own protocol. It also produces _tiny_ bundles. We've already replaced `grpc-web` in the Buf Schema Registry frontend, and we're planning to release `connect-web` soon — stay tuned.

Eventually, we'd like to release Connect implementations for Express, Rails, Django, Laravel, and similar frameworks. You shouldn't have to choose between these productive toolkits and Protocol Buffers — they should work seamlessly together.

## Get involved!

We'd love to hear what you think of Connect: check out the [Getting Started guide](https://connectrpc.com/docs/go/getting-started), try Connect in your next Go project, poke through the [demonstration project](https://github.com/connectrpc/examples-go), and please [file issues](https://github.com/connectrpc/connect-go/issues) if something doesn't work as you expect. We're always available in the [Buf Slack](https://buf.build/b/slack), and we're usually in the #grpc and #connect channels in the [Gophers Slack](https://invite.slack.golangbridge.org/) too.

‍
