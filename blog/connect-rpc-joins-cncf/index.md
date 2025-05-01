---
sidebar: false
prev: false
next: false

title: "Connect RPC joins CNCF: gRPC you can bet your business on"
description: "Connect RPC, Buf’s family of fully protocol-conformant and battle-tested alternatives to Google’s gRPC project, has joined the Cloud Native Computing Foundation. We joined the CNCF to demonstrate our deep commitment to sustainably and responsibly growing Connect as a well-governed and community-led open source project. Today, Connect integrates seamlessly with gRPC systems in production at companies of all sizes, such as CrowdStrike, PlanetScale, RedPanda, Chick-fil-A, BlueSky, and Dropbox."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/connect-rpc-joins-cncf"
  - - meta
    - property: "og:title"
      content: "Connect RPC joins CNCF: gRPC you can bet your business on"
  - - meta
    - property: "og:description"
      content: "Connect RPC, Buf’s family of fully protocol-conformant and battle-tested alternatives to Google’s gRPC project, has joined the Cloud Native Computing Foundation. We joined the CNCF to demonstrate our deep commitment to sustainably and responsibly growing Connect as a well-governed and community-led open source project. Today, Connect integrates seamlessly with gRPC systems in production at companies of all sizes, such as CrowdStrike, PlanetScale, RedPanda, Chick-fil-A, BlueSky, and Dropbox."
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674fc4d69f25227affd44203_Connect%20RPC%20joins%20CNCF.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Connect RPC joins CNCF: gRPC you can bet your business on"
  - - meta
    - property: "twitter:description"
      content: "Connect RPC, Buf’s family of fully protocol-conformant and battle-tested alternatives to Google’s gRPC project, has joined the Cloud Native Computing Foundation. We joined the CNCF to demonstrate our deep commitment to sustainably and responsibly growing Connect as a well-governed and community-led open source project. Today, Connect integrates seamlessly with gRPC systems in production at companies of all sizes, such as CrowdStrike, PlanetScale, RedPanda, Chick-fil-A, BlueSky, and Dropbox."
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674fc4d69f25227affd44203_Connect%20RPC%20joins%20CNCF.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Connect RPC joins CNCF: gRPC you can bet your business on

[_Connect RPC_](https://connectrpc.com/)_, Buf’s family of fully protocol-conformant and battle-tested alternatives to Google’s gRPC project, has joined the Cloud Native Computing Foundation. We joined the CNCF to demonstrate our deep commitment to sustainably and responsibly growing Connect as a_ [_well-governed and community-led open source project_](https://connectrpc.com/docs/governance/project-governance)_. Today, Connect integrates seamlessly with gRPC systems in production at companies of all sizes, such as_ [_CrowdStrike_](https://github.com/CrowdStrike/perseus/pull/155)_,_ [_PlanetScale_](https://planetscale.com/blog/faster-mysql-with-http3#can-http-be-faster-than-the-mysql-protocol)_,_ [_RedPanda_](https://github.com/redpanda-data/console/blob/master/backend/go.mod)_,_ [_Chick-fil-A_](https://medium.com/chick-fil-atech/connect-ing-chick-fil-a-2008bdf10be9)_,_ [_Bluesky_](https://jazco.dev/2024/01/10/golang-and-epoll/)_, and Dropbox._

## Key takeaways

- **Connect RPC offers organizations a** [**well-governed and truly open source gRPC-compatible project**](https://connectrpc.com/docs/governance/project-governance)**.** We believe the community needs a stable, reliable, and independent RPC platform they can trust for their businesses. Our integration with the CNCF is a significant step towards realizing this vision.
- **Connect RPC libraries are committed to being 100% spec conformant with gRPC and gRPC-web protocols, and** [**we’ve built the infrastructure to keep ourselves honest.**](https://github.com/connectrpc/conformance) All 1.0 implementations of Connect RPC are guaranteed to reach and maintain 100% conformance compliance with the gRPC ecosystem. We have developed a comprehensive suite of tests and tooling to validate all our projects.
- **Connect seeks collaborators to support more languages and ecosystems**. We’ve published [our 2024 roadmap for Connect](https://github.com/orgs/connectrpc/discussions/16) and are looking for collaborators interested in contributing to Rust, Python, Ruby, and Java.

## What is Connect RPC?

[Connect](https://connectrpc.com/) is a set of libraries designed to help you build browser and gRPC-compatible HTTP APIs. You only need to write a brief [Protocol Buffer schema](https://connectrpc.com/docs/go/getting-started#define-a-service) and [implement your application server logic](https://connectrpc.com/docs/go/getting-started#implement-handler) in your programming language of choice. Connect automatically generates code for [marshaling](https://connectrpc.com/docs/go/serialization-and-compression), [routing](https://connectrpc.com/docs/go/routing), [compression](https://connectrpc.com/docs/go/serialization-and-compression#compression), and [content-type negotiation](https://connectrpc.com/docs/multi-protocol). Additionally, it will create an idiomatic, type-safe client in any supported programming language.

## Why did Buf invest in Connect RPC?

We’ve been listening to many of our customers express their frustration with the growing complexity and instability they’ve endured with Google’s gRPC projects. Organizations that depend heavily on gRPC haven’t felt they’ve had a voice in where the project is headed and often find themselves blindsided by breaking changes. Prominent gRPC users (like [etcd](https://etcd.io/)) often cannot update for months. We felt compelled to provide an alternative offering the community deserves.

Read [our announcement blog post](/blog/connect-a-better-grpc/index.md) for more background on why we built Connect.

## Expanding broader HTTP support for the “REST” of us

Although Connect provides fully conformant gRPC protocol support using HTTP/2, it also exposes a [simpler protocol that any HTTP/1.1, HTTP/2, or HTTP/3 clients can utilize](https://connectrpc.com/docs/protocol). This means the Connect protocol and your application are supported everywhere the web is, including browsers, without additional overhead or intermediate latency-introducing proxy or transforms.

## Connect RPC vs Google gRPC: Conformance deep dive

The Connect RPC project features [a fully automated conformance suite](https://github.com/connectrpc/conformance) that validates an implementation’s correctness against the Connect RPC and gRPC protocol specifications. We recently [wrote an article](/blog/grpc-conformance-deep-dive/index.md) that dives deep into how that suite works and provides a detailed overview of the conformance issues we’ve identified in Google gRPC and Connect RPC. **Our tests identified at least 22 conformance issues across Google’s generally available/v1.0 gRPC implementations,** and a handful of issues (mostly related to specification ambiguity) in Connect RPC we’ve already fixed.

## Why join the CNCF?

We’re developing Connect RPC in the open with the community. Given its rapid uptick in popularity and production adoption, we want to guarantee that the open source community can build on a solid, well-trusted foundation committed to [stability and open governance](https://connectrpc.com/docs/governance/project-governance). The Connect project and all its associated repositories will adhere to an RFC-based evolution, voted on by its maintainers, who will have direct decision-making power over the project's direction.

## What’s next?

You tell us! Several of Connect's most enthusiastic contributors are now maintainers, with voices (and votes!) equal to those of Buf-employed maintainers. We’re excited to collaborate with the community to develop broad support for Connect RPC. Several [active polls and discussions are happening on GitHub](https://github.com/orgs/connectrpc/discussions), and we’re looking for serious maintainers who want to play an active role in developing new implementations. The community has expressed interest in seeing the development of [Dart](https://github.com/orgs/connectrpc/discussions/8), [Ruby](https://github.com/orgs/connectrpc/discussions/9), [Java](https://github.com/orgs/connectrpc/discussions/11), and [Rust](https://github.com/orgs/connectrpc/discussions/7), just to name a few.

The maintainers are very active in [our community Slack](https://buf.build/b/slack). Everyone is welcome to join us and help shape the future of Connect!
