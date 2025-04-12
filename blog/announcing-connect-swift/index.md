---
layout: home

hero:
  name: "Announcing Connect-Swift: You’ll actually want to use Protobuf on iOS"
  tagline: "January 18, 2023"
---

If you’re an iOS engineer, you’ve likely heard about [Protobuf](https://developers.google.com/protocol-buffers) or [gRPC](/blog/connect-a-better-grpc/index.md) at some point in the past 5 years, only to roll your eyes while your Go counterpart described how great Protobuf was. _Why would I use a cumbersome command-line tool to generate code that requires me to add several third-party libraries, replace my networking stack, and bloat my app’s binary by several megabytes, only to use clunky APIs?_ As iOS engineers, all we want to do is focus on shipping features that customers will actually use.

While this may be painful to hear, your Go counterpart is actually on to something. It turns out there is a reason for their Protobuf madness — the promise of using statically-typed APIs to generate clients and eliminate the need to handwrite API glue just hasn’t been fully realized yet, especially on mobile.

[`grpc-swift`](https://github.com/grpc/grpc-swift) was supposed to eliminate handwritten networking boilerplate, but the generated code was too awkward for most of us to seriously consider. While companies such as Lyft have seen great success across their [iOS apps using Protobuf](https://eng.lyft.com/lyfts-journey-through-mobile-networking-d8e13c938166) with proprietary solutions, nobody has made those options available to the industry. Now, we at Buf want to bring this new reality to everyone.

**Today, we’re announcing** [**Connect-Swift**](https://github.com/connectrpc/connect-swift)**: A simple, lightweight, idiomatic library that finally unlocks Protobuf’s long-promised productivity wins and will change your mind about Protobuf on iOS.**

- **Idiomatic, typed APIs.** No more hand-writing REST/JSON endpoints and `Codable` conformances. Connect-Swift generates idiomatic APIs that utilize the latest Swift features such as async/await and eliminates the need to worry about serialization.
- **First-class testing support.** Connect-Swift generates both production and mock implementations that conform to the same protocol interfaces, enabling easy testability with minimal handwritten boilerplate.
- **Easy-to-use tooling.** Connect-Swift integrates with the Buf CLI, enabling remote code generation without having to install and configure local dependencies.
- **Flexibility.** Connect-Swift uses `URLSession`. The library provides the option to swap this out, as well as the ability to register custom options, compression algorithms, and interceptors.
- **Binary size.** The Connect-Swift library is very small (<200KB) and does not require any third party networking dependencies.

_If you want to go right to a hands-on demo, we created a_ [_getting started guide_](https://connectrpc.com/docs/swift/getting-started) _for building a Connect-enabled SwiftUI chat app in ~10 minutes._

## Current workflow

As iOS engineers, we’re all familiar with the typical workflow of building a new feature, which looks something like this:

- Define the product requirements (or receive them from a product manager)
- Collaborate with server engineers to define one or more REST endpoints to meet the established product requirements as part of a larger tech spec
- Create Swift models and write `Codable` conformances to mirror the expected JSON response payloads
- Write a function that accepts some parameters, calls a specific URL from the tech spec using `URLSession` or another wrapper, deserializes the response into the expected `Codable` model, and returns the model to the caller
- Write mocks and unit tests to simulate and validate the API’s behavior (more on this later)
- Write application logic on top of the defined API layer

Although this pattern is repetitive and time-consuming, we have started to accept it as a fact of our craft. Even so, we know that handwriting APIs is prone to human errors and inconsistencies between the client and server. Furthermore, validating this behavior without a real staging environment can only be as good as the mocks we define. Alas, we can do much better.

## Typed APIs you’ll love

Our goal with [Connect-Swift](https://github.com/connectrpc/connect-swift) is to provide a significant productivity boost by eliminating the need to handwrite Swift code for interacting with servers, thus enabling engineers to simply focus on their application logic. This is done using a small, [open-source](https://github.com/connectrpc/connect-swift) runtime library paired with a code generator that consumes API schemas defined in Protobuf.

To illustrate, consider the following Protobuf schema definition:

```protobuf
package eliza.v1;

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

This simple file defines a `ChatService` containing a `Say` RPC (Remote Procedure Call, essentially an HTTP endpoint) that accepts a `SayRequest` and returns a `SayResponse`, each containing a `sentence` string field.

When this file is run through Connect-Swift’s Protobuf generator plugin, `protoc-gen-connect-swift`, it yields something like this:

```protobuf
public protocol Eliza_V1_ChatServiceClientInterface {
    func say(request: Eliza_V1_SayRequest, headers: Headers)
        async -> ResponseMessage<Eliza_V1_SayResponse>
}

public final class Eliza_V1_ChatServiceClient: Eliza_V1_ChatServiceClientInterface {
    private let client: ProtocolClientInterface

    public init(client: ProtocolClientInterface) {
        self.client = client
    }

    public func say(request: Eliza_V1_SayRequest, headers: Headers = [:])
        async -> ResponseMessage<Eliza_V1_SayResponse>
    {
        return await self.client.unary(path: "connectrpc.eliza.v1.ElizaService/Say", request: request, headers: headers)
    }
}
```

The request and response models referenced in the above code are generated alongside the Connect-Swift outputs using [SwiftProtobuf](https://github.com/apple/swift-protobuf) (`protoc-gen-swift`), Apple’s generator for Protobuf models.

This code can then be integrated into a SwiftUI view model with just a few lines:

```protobuf
final class MessagingViewModel: ObservableObject {
    private let elizaClient: Eliza_V1_ChatServiceClientInterface

    init(elizaClient: Eliza_V1_ChatServiceClientInterface) {
        self.elizaClient = elizaClient
    }

    @Published private(set) var messages: [Message] {...}

    func send(_ userSentence: String) async {
        let request = Eliza_V1_SayRequest.with { $0.sentence = userSentence }
        let response = await self.elizaClient.say(request: request, headers: [:])
        if let elizaSentence = response.message?.sentence {
            self.messages.append(Message(sentence: userSentence, author: .user))
            self.messages.append(Message(sentence: elizaSentence, author: .eliza))
        }
    }
}
```

That’s it! We no longer need to manually define Swift response models, add `Codable` conformances, type out `URL(string: ...)` initializers, or even create protocol interfaces to wrap service classes - all of this is taken care of by Connect-Swift, and the underlying network transport is handled **automatically**.

The outputs shown above can also be customized to specify ACLs for the generated types (e.g., `internal` versus `public`) and whether to use Swift’s async/await APIs or traditional callback closures. A [full list of available generator options](https://connectrpc.com/docs/swift/generating-code#generation-options) is available in the documentation.

### Testing APIs

Writing Swift unit tests for APIs can be very tedious, as it requires manually introducing abstractions and boilerplate code. Testing networking code can be particularly painful since it involves serializing data and is prone to the same mistakes as handwriting response models.

Connect-Swift breaks these existing testing paradigms. With both a production client implementation _and a protocol interface for it to conform to_, we’re able to generate mock implementations that can be swapped out for testing:

```protobuf
open class Eliza_V1_ChatServiceClientMock: Eliza_V1_ChatServiceClientInterface {
    public var mockAsyncSay = { (_: Eliza_V1_SayRequest) -> ResponseMessage<Eliza_V1_Response> in .init(message: .init()) }

    open func say(request: Eliza_V1_SayRequest, headers: Headers = [:])
        async -> ResponseMessage<Eliza_V1_SayResponse>
    {
        return self.mockAsyncSay(request)
    }
}
```

Suddenly, testing becomes much easier:

```protobuf
func testMessagingViewModel() async {
    let client = Eliza_V1_ChatServiceClientMock()
    client.mockAsyncSay = { request in
        XCTAssertEqual(request.sentence, "hello!")
        return ResponseMessage(message: .with { $0.sentence = "hi, i'm eliza!" })
    }

    let viewModel = MessagingViewModel(elizaClient: client)
    await viewModel.send("hello!")

    XCTAssertEqual(viewModel.messages.count, 2)
    XCTAssertEqual(viewModel.messages[0].message, "hello!")
    XCTAssertEqual(viewModel.messages[0].author, .user)
    XCTAssertEqual(viewModel.messages[1].message, "hi, i'm eliza!")
    XCTAssertEqual(viewModel.messages[1].author, .eliza)
}
```

Using generated mocks saves a significant amount of time while also ensuring the mocks conform to the exact server spec. For instructions on how to generate mocks and for additional testing examples (including for streaming), see the [testing docs](https://connectrpc.com/docs/swift/testing).

## Supported protocols

Connect-Swift supports two protocols out of the box:

- The [Connect protocol](https://connectrpc.com/): A simple, POST-only protocol that works over HTTP/1.1 or HTTP/2. It takes the best parts of gRPC/gRPC-Web, including streaming, and packages them into a protocol that works well on all platforms, including mobile. By default, JSON- and binary-encoded Protobuf is supported.
- The [gRPC-Web protocol](https://github.com/grpc/grpc-web): Allows clients to communicate with existing gRPC-Web services. If your back-end services are already using gRPC today, [Envoy provides support for converting between gRPC and gRPC-Web](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/grpc_web_filter), enabling you to use gRPC-Web through Connect-Swift without having to change any existing gRPC APIs.

## Going beyond Swift

We recently released [Connect-Web](/blog/connect-web-protobuf-grpc-in-the-browser/index.md), which provides many of the same benefits to front-end engineers. For back-end services, [Connect-Go](https://connectrpc.com/docs/go/getting-started) is available. We firmly believe that full cross-platform collaboration is critical to the success of using Connect and Protobuf, and we will be launching Connect-Kotlin very soon. If you have an Android engineer counterpart who might be interested, let us know on the [Buf Slack](https://buf.build/b/slack)!

## Get started with Connect-Swift

We’d love for you to try out Connect-Swift! We have several new resources to help you get started:

- **A full** [**getting started guide**](https://connectrpc.com/docs/swift/getting-started) **designed to take you from zero to a working SwiftUI chat application that uses Connect-Swift in ~10 minutes**
- [Example demo projects](https://github.com/connectrpc/connect-swift/tree/main/Examples) for both Swift Package Manager and CocoaPods
- The [open-source GitHub project](https://github.com/connectrpc/connect-swift) with the full source code
- Additional documentation for everything, including [interceptors](https://connectrpc.com/docs/swift/interceptors), [mocking/testing](https://connectrpc.com/docs/swift/testing), [streaming](https://connectrpc.com/docs/swift/using-clients#using-generated-clients), and [error handling](https://connectrpc.com/docs/swift/errors)

Connect-Swift is still in beta, so we’re all ears for feedback - you can reach us through the [Buf Slack](https://buf.build/b/slack) or by filing a [GitHub issue](https://github.com/connectrpc/connect-swift/issues) and we’d be more than happy to chat!

‍
