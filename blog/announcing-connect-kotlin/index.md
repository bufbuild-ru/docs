---
layout: home

hero:
  name: "Announcing Connect-Kotlin: Connect is now fully supported on mobile!"
  tagline: "February 22, 2023"
---

When writing software, engineers often make mistakes implementing an agreed upon API by incorrectly defining the data structure, misnaming a key, or even specifying the wrong endpoint path. These errors make collaborating across iOS, Android, frontend, and backend difficult as they necessitate back-and-forth coordination and exhaustive testing. Connect’s goal is to eliminate these hardships by using a single Protobuf schema to generate idiomatic and deterministic code for all platforms, replacing handwritten boilerplate. So far, [Connect-Swift](https://connectrpc.com/swift) has made it incredibly easy to build iOS APIs, and [Connect-Web](https://connectrpc.com/docs/web/getting-started) and [Connect-Go](https://connectrpc.com/docs/go/getting-started) have done the same for the frontend and backend.

**Today we are releasing** [**Connect-Kotlin**](https://github.com/connectrpc/connect-kotlin) **which brings this experience to Kotlin and enables Android engineers to collaborate with their Swift, Go, and TypeScript counterparts to build mobile applications completely end-to-end using Protobuf, Connect, gRPC, and gRPC-Web.** With Connect-Kotlin, the [family of Connect libraries](https://connectrpc.com/) now has full first class support on mobile!

- **Idiomatic, typed APIs.** No more hand-writing REST/JSON endpoints and JSON data models. Connect-Kotlin generates idiomatic APIs and eliminates the need to worry about serialization.
- **Easy-to-use tooling.** Connect-Kotlin integrates with the Buf CLI, enabling remote code generation without having to install and configure local dependencies.
- **Flexibility.** Connect-Kotlin uses OkHttp, making it easy to integrate existing OkHttp configurations and interceptors. The library also provides extension points for using custom compression algorithms, adding interceptors, and swapping out the networking library.
- **Simple and small.** The Connect-Kotlin library itself is very small with only a few familiar dependencies (e.g., OkHttp, Okio, and Coroutines).

**_If you want to go right to a hands-on demo, we created a_** [**_getting started guide_**](https://connectrpc.com/docs/kotlin/getting-started) **_for building a Connect-enabled Kotlin chat app in ~10 minutes._**

## Easy-to-use typed APIs

The following `.proto` file defines an `ElizaService` containing a `Say` RPC (Remote Procedure Call, essentially an HTTP endpoint) that accepts a `SayRequest` and returns a `SayResponse`, each containing a `sentence` string field:

```protobuf
package connectrpc.eliza.v1;

message SayRequest {
  string sentence = 1;
}

message SayResponse {
  string sentence = 1;
}

service ElizaService {
  rpc Say(SayRequest) returns (SayResponse) {}
}
```

Connect-Kotlin’s `protoc-gen-connect-kotlin` generator plugin then uses this file to generate a simple client interface (`ElizaServiceClientInterface.kt`) and implementation class (`ElizaServiceClient.kt`) to communicate with the defined `ElizaService`:

```protobuf
// ElizaServiceClientInterface.kt
public interface ElizaServiceClientInterface {
  public suspend fun say(request: SayRequest, headers: Headers = emptyMap()):
    ResponseMessage<SayResponse>
}

// ElizaServiceClient.kt
public class ElizaServiceClient(
	private val client: ProtocolClientInterface,
) : ElizaServiceClientInterface {

  public override suspend fun say(request: SayRequest, headers: Headers):
      ResponseMessage<SayResponse> = client.unary(
    request,
    headers,
    MethodSpec(
      "connectrpc.eliza.v1.ElizaService/Say",
      connectrpc.eliza.v1.SayRequest::class,
      connectrpc.eliza.v1.SayResponse::class,
    ),
  )
}
```

Code hints are provided within the IDE to indicate how to use these generated classes for making requests, and they’re typically consumed within an Android Activity:

```protobuf
fun suspend talkToEliza(sentence: String) {
  // Make a request to Eliza.
  val sayRequest = SayRequest.newBuilder()
		.setSentence(sentence)
		.build()
  val response = elizaServiceClient.say(sayRequest)
  val elizaSentence = response.success { success ->
    // Get Eliza's reply from the response.
    success.message.sentence
  }
	view.setText(elizaSentence)
}
```

## Supported message generator plugins

Although the `SayRequest` and `SayResponse` models above reference outputs from Google’s Java Protobuf generator plugin (`protoc-gen-java`), Connect-Kotlin supports several Protobuf model generators, including:

- Google’s Java Protobuf generator (`protoc-gen-java`), along with the `javalite` option.
- Google’s Kotlin Protobuf generator (`protoc-gen-kotlin`), along with the `kotlinlite` option.
- Coming soon: We are also building support for the [`square/wire`](https://github.com/square/wire) generator.

## Supported protocols

Connect-Kotlin supports three protocols out of the box:

- The [Connect protocol](https://connectrpc.com/): A simple, protocol that works over HTTP/1.1 or HTTP/2. It takes the best parts of gRPC/gRPC-Web, including streaming, and packages them into a protocol that works well on all platforms, including mobile. By default, JSON- and binary-encoded Protobuf is supported.
- The [gRPC protocol](https://github.com/grpc/grpc): Allows clients to communicate with existing gRPC services.
- The [gRPC-Web protocol](https://github.com/grpc/grpc-web): Allows clients to communicate with existing gRPC-Web services.

## Get started with Connect-Kotlin

We’re excited for you to try out Connect-Kotlin! Here are some resources to help you dive in:

- **A full** [**getting started guide**](https://connectrpc.com/docs/kotlin/getting-started/) **designed to take you from zero to a working Android chat application that uses Connect-Kotlin in 10 minutes**
- [Example projects](https://github.com/connectrpc/connect-kotlin/tree/main/examples) with Android and Kotlin applications
- The [open-source GitHub project](https://github.com/connectrpc/connect-kotlin) with the full source code
- Additional documentation for everything, including [interceptors](https://connectrpc.com/docs/kotlin/interceptors), [streaming](https://connectrpc.com/docs/kotlin/using-clients#using-generated-clients), and [error handling](https://connectrpc.com/docs/kotlin/errors)

Connect-Kotlin is in beta, so we’re all ears for feedback - you can reach us through the [Buf Slack](https://buf.build/b/slack/) or by filing a [GitHub issue](https://github.com/connectrpc/connect-kotlin/issues) and we’d be more than happy to chat!

## Other posts from us that you might be interested in

- [Connect-Swift announcement](/blog/announcing-connect-swift/index.md)
- [Connect-Web announcement](/blog/connect-web-protobuf-grpc-in-the-browser/index.md)
- [Connect-Query announcement](/blog/introducing-connect-query/index.md)

‍
