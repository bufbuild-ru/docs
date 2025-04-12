---
layout: home

hero:
  name: "Connect-Swift 1.0 is now generally available"
  tagline: "November 11, 2024"
---

We’re excited to share that [Connect-Swift](https://github.com/connectrpc/connect-swift) has officially reached v1.0—its first stable release! With this milestone, the library’s battle-tested APIs will remain stable until its next major release. Projects can rely on Connect-Swift without worrying that future releases will cause breakages or require migrations.

## Changes on the path to 1.0

Connect-Swift has evolved significantly over the almost two years since its initial v0.1 beta release in January 2023. Since that release, several large companies have adopted the library in their codebases and now use it to power their client applications for millions of users worldwide. Improvements implemented since the initial releases address feedback from teams using the library in various projects, enhancing Connect-Swift's behavior and ergonomics. Here are a few of the most noteworthy milestones from this journey:

- **Connect-Swift reached 100% compliance with the** [**conformance test suite**](https://github.com/connectrpc/conformance) **across the Connect, gRPC, and gRPC-Web protocols.** These tests verify that the library's runtime properly handles a myriad of edge cases. We take ecosystem conformance very seriously, and [we’ve written extensively](/blog/grpc-conformance-deep-dive/index.md) about our efforts in this space.
- **We overhauled interceptors to provide new powerful, user-friendly APIs for asynchronously reading and modifying requests and responses.** Interceptors can interact with fully typed Protobuf messages without worrying about protocol-level implementation details, or leverage raw HTTP-layer APIs to inspect and alter on-the-wire data — a convenient addition since `URLSession` does not natively support interceptors.
- **Connect joined the CNCF!** Connect-Swift and all the other libraries in [the Connect ecosystem joined the Cloud Native Computing Foundation](/blog/connect-rpc-joins-cncf/index.md) to guarantee that the community can continue building on top of a foundation committed to stability and open governance.
- We made many other improvements, including HTTP GET support, the ability to generate service metadata and deprecation warnings, support for tvOS and watchOS, and support for older OSes such as iOS 12 and 13.

## Why projects choose Connect-Swift

It’s important to choose the right tools when designing and building APIs, as these decisions can significantly impact development efficiency and product reliability. We’ve seen projects choose Connect-Swift for a few key reasons:

- **Idiomatic generated APIs.** Connect-Swift generates lightweight, idiomatic APIs that use the latest Swift features (such as async/await), and it eliminates the need to worry about serialization.
- **First-class testing support.** Connect-Swift generates production and mock implementations that conform to the same protocol interfaces, enabling easy testability with minimal handwritten boilerplate.
- **Flexibility.** Connect-Swift uses `URLSession` by default. The library provides the option to swap this out with `SwiftNIO`, as well as the ability to register custom options, compression algorithms, and interceptors.
- **Multi-protocol support.** The library’s runtime supports the gRPC, gRPC-Web, and Connect RPC protocols, and switching between them is a simple one-line configuration change.
- **Binary Size.** The Connect-Swift library is small (less than 200KB) and doesn't require any third-party networking dependencies.
- **Governance.** Connect is part of the Cloud Native Computing Foundation, so its direction is determined by the community—not by a single corporate entity.

## Thank you to our contributors and users

We're grateful to all of the contributors who worked to get Connect-Swift to this milestone and to each user who provided the support and feedback to make the project what it is today. We look forward to continuing to evolve and improve the library alongside the Swift language and the rest of the Connect ecosystem! If you’d like to learn more, [check the project out on GitHub](https://github.com/connectrpc/connect-swift), read the [getting started guide](https://connectrpc.com/docs/swift/getting-started/), or [explore the Connect website](https://connectrpc.com/docs/introduction).
