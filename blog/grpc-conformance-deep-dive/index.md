---
sidebar: false
prev: false
next: false

title: "Connect RPC vs. Google gRPC: Conformance Deep Dive"
description: "We’ve open sourced Connect RPC’s protocol conformance suite. Connect is a multi-protocol RPC project that includes support for the gRPC and gRPC-Web protocols. Anyone can now use it to validate the correctness of a gRPC implementation. This article explores how the test suite operates and details our findings for a selection of Connect RPC and Google’s gRPC runtimes."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/grpc-conformance-deep-dive"
  - - meta
    - property: "og:title"
      content: "Connect RPC vs. Google gRPC: Conformance Deep Dive"
  - - meta
    - property: "og:description"
      content: "We’ve open sourced Connect RPC’s protocol conformance suite. Connect is a multi-protocol RPC project that includes support for the gRPC and gRPC-Web protocols. Anyone can now use it to validate the correctness of a gRPC implementation. This article explores how the test suite operates and details our findings for a selection of Connect RPC and Google’s gRPC runtimes."
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674fc4e8a04815b7906e0f1a_Conformance%20deep%20dive.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Connect RPC vs. Google gRPC: Conformance Deep Dive"
  - - meta
    - property: "twitter:description"
      content: "We’ve open sourced Connect RPC’s protocol conformance suite. Connect is a multi-protocol RPC project that includes support for the gRPC and gRPC-Web protocols. Anyone can now use it to validate the correctness of a gRPC implementation. This article explores how the test suite operates and details our findings for a selection of Connect RPC and Google’s gRPC runtimes."
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674fc4e8a04815b7906e0f1a_Conformance%20deep%20dive.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Connect RPC vs. Google gRPC: Conformance Deep Dive

_We’ve open sourced Connect RPC’s protocol conformance suite. Connect is a multi-protocol RPC project that includes support for the gRPC and gRPC-Web protocols. Anyone can now use it to validate the correctness of a gRPC implementation. This article explores how the test suite operates and details our findings for a selection of Connect RPC and Google’s gRPC runtimes._

## Key takeaways

- **The** [**Connect Conformance Suite**](https://github.com/connectrpc/conformance) **validates interoperability, compatibility, and conformance across the Connect, gRPC, and gRPC-Web protocols.** Connect RPC's multi-protocol nature enables us to validate any gRPC-compatible project. In addition to thoroughly testing Connect RPC, we’ve tested several of Google’s gRPC implementations.
- **Our tests identified a handful of conformance issues in Connect RPC (we’ve already fixed them) and at least 22 conformance issues across Google’s generally available/v1.0 gRPC implementations.** We’ve filed numerous issues with the gRPC team about our findings and hope to collaborate with the team to resolve them for the ecosystem’s benefit. We’ve also opened issues for everything we couldn’t immediately resolve in the Connect RPC implementations. However, no outstanding conformance violations exist in any of our 1.0 releases.
- **The Connect RPC project is committed to ensuring all of its projects pass all conformance tests before reaching v1.0 status.** We take specifications seriously. These are the building blocks that many organizations rely on to develop their products. Connect RPC implementations must pass all conformance tests before being marked stable and generally available.

## Introducing the Connect Conformance Suite

The [Connect Conformance Suite](https://github.com/connectrpc/conformance) is an automated series of tests run using a client and server to validate interoperability, compatibility, and conformance across the Connect, gRPC, and gRPC-Web protocols. It’s meant to exercise various client-server interactions to ensure the results follow the protocol’s specification, even when mixing clients and servers written with different programming languages or runtimes.

Tests are divided into two types: client tests and server tests. Those that verify clients are run against a reference server implementation of the Conformance Service written with [connect-go](https://github.com/connectrpc/connect-go). Likewise, servers under test will be verified by a reference client implementing the Conformance Service written with connect-go.

To verify compatibility with other protocol implementations, the conformance tests also use reference client and server implementations that use the [gRPC-Go module](https://github.com/grpc/grpc-go) and a reference server implementation that uses the [gRPC-Web Go server](https://github.com/improbable-eng/grpc-web).

We’ve adopted this new conformance suite for all our implementations as part of this effort. We previously relied on a “cross test” system modeled after gRPC’s interop testing. However, it had several drawbacks: it was not data-driven, lacked an authoritative client or server to identify issues, could lead to unacceptably slow CI times, and involved complexities with Docker. The new conformance suite addresses these issues by defining test cases in YAML, using reference clients and servers, reducing the need to test against multiple implementations, and providing a test runner that doesn't use Docker.

## Running the tests

Most of the work to get the conformance suite up and running is to write a client or server to test. This program uses the RPC implementation that is being tested and implements a protocol for communicating with the test runner by reading messages from `STDIN` and writing messages to `STDOUT`.

Once you’ve written a conformance client or server and a configuration file describing the relevant features, it’s time to run the tests. What parameters to pass to the `connectconformance` test runner depends on whether you are testing a client or a server. The following commands will get you started:

### Testing a client

```bash
connectconformance --mode client --config <path/to/config/file> \
   -- <path/to/your/executable/client>
```

### Testing a server

```bash
connectconformance --mode server --config <path/to/config/file> \
   -- <path/to/your/executable/server>
```

### Anatomy of a test run

The conformance suite is provided as a self-contained test runner named `connectconformance`. This program includes the data for all of the test cases and the reference client and reference server implementations.

A server under test reads a single message from `STDIN` that provides configuration details used to start the server. Once the server is listening to the network and ready to accept requests, it writes a single message to `STDOUT` that contains details on how RPC clients can access the server. Similarly, a client under test reads multiple messages from `STDIN`, each one describing an RPC to issue. After invoking the RPC and recording the results, it writes a description of each result to `STDOUT`.

The test runner starts a single client process that will send RPCs and one server process for each distinct configuration it needs to test. It decides if an implementation is conformant by examining the results of the RPCs. When testing a server, the client it starts is a reference client; when testing a client, that gets paired with a reference server.

serverclienttest runnerserverclienttest runnerstart processstart processsend config via stdinsend result via stdoutsend RPC details via stdininvoke RPC, send request(s)process RPCsend response(s)send RPC results via stdoutassess RPC resultsterminateterminate

The reference client and server behave just like any other client or server under test, except they perform additional checks for each request or response, making sure they are well-formed and compliant. Any identified issues uncovered by the checks are reported to the test runner.

In addition to writing a client or server process to test, you must also provide a YAML configuration file that describes the features your implementation supports, which is used to determine which test cases to validate the implementations against.

For more info on how to do this, check out our [onboarding guides](https://github.com/connectrpc/conformance?tab=readme-ov-file#documentation).

## Connect RPC results

We run the conformance tests across all of our existing Connect RPC projects, for every commit as part of our CI process. While adding the tests to these projects, it became clear that the expected behavior for many edge cases was not adequately specified, and our implementations behaved inconsistently. We’ve opened issues against the [Connect specification](https://connectrpc.com/docs/protocol) ([GH#169](https://github.com/connectrpc/connectrpc.com/issues/169)), to add those details and bring greater clarity to how clients and servers should act in these conditions. To get consistent behavior in our implementations, even for these unspecified situations, we’ve codified interim expectations into the conformance tests. These expectations are our proposed behavior for these missing parts of the spec, until further consensus is established.

For Connect RPC, most of the issues the conformance tests caught were subtle misuse of status codes for certain error conditions. Interestingly, every implementation tested exhibited issues in the following categories:

- **Cardinality violations:** These violations occur when a stream has an unexpected number of messages. For example, a unary RPC should have exactly one request message and either one response message or an error status, but the actual wire-level protocol allows for zero or more messages to be sent. The documentation for the gRPC status codes states that [these kinds of issues should result in an “unimplemented” error code](https://github.com/grpc/grpc/blob/v1.64.0/doc/statuscodes.md#:~:text=Request%20cardinality%20violation%20(method%20requires%20exactly%20one%20request%20but%20client,Client). Some implementations weren’t checking for or handling these conditions and some were using different error codes.
- **Classifying “trailers-only” responses in the gRPC and gRPC-Web protocols:** A “trailers-only” response is a special kind of compact response that a server can use when there is no response data, only a status and metadata. Our implementations were using an incorrect heuristic to classify a response as a “trailers-only”, which could lead to incorrect computation of the RPC result in rare corner cases.
- **Malformed “end stream” or “error” messages in the Connect protocol:** In the face of certain kinds of malformed response messages, the implementations would return an unexpected error code.

## Google's gRPC results

We’ve also created conformance clients and servers to test Google’s gRPC implementations using our suite. We’ve identified similar shortcomings in gRPC’s specification, as well as a number of issues in gRPC’s generally-available/v1 implementations. The table below enumerates the issues we identified and reported to the gRPC team (some are links to pre-existing issue reports, where other users had already encountered and reported the issue).

| Topic                                                         | Issues Found                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Specification](https://github.com/grpc/grpc/tree/master/doc) | [GH#24007](https://github.com/grpc/grpc/issues/24007), [GH#36765](https://github.com/grpc/grpc/issues/36765), [GH#36766](https://github.com/grpc/grpc/issues/36766), [GH#36767](https://github.com/grpc/grpc/issues/36767)                                                                                                                               |
| [Go](https://github.com/grpc/grpc-go)                         | [GH#6987](https://github.com/grpc/grpc-go/issues/6987), [GH#7286](https://github.com/grpc/grpc-go/issues/7286)                                                                                                                                                                                                                                           |
| [Java](https://github.com/grpc/grpc-java)                     | [GH#11245](https://github.com/grpc/grpc-java/issues/11245), [GH#11246](https://github.com/grpc/grpc-java/issues/11246), [GH#11247](https://github.com/grpc/grpc-java/issues/11247), [GH#11248](https://github.com/grpc/grpc-java/issues/11248)                                                                                                           |
| [C++](https://github.com/grpc/grpc)                           | [GH#36769](https://github.com/grpc/grpc/issues/36769), [GH#36770](https://github.com/grpc/grpc/issues/36770)                                                                                                                                                                                                                                             |
| [Node](https://github.com/grpc/grpc-node)                     | [GH#882](https://github.com/grpc/grpc-node/issues/882), [GH#2764](https://github.com/grpc/grpc-node/issues/2764), [GH#2765](https://github.com/grpc/grpc-node/issues/2765), [GH#2766](https://github.com/grpc/grpc-node/issues/2766), [GH#2767](https://github.com/grpc/grpc-node/issues/2767), [GH#2768](https://github.com/grpc/grpc-node/issues/2768) |
| [Web JS](https://github.com/grpc/grpc-web)                    | [GH#1399](https://github.com/grpc/grpc-web/issues/1399), [GH#1427](https://github.com/grpc/grpc-web/issues/1427), [GH#1428](https://github.com/grpc/grpc-web/issues/1428), [GH#1429](https://github.com/grpc/grpc-web/issues/1429)                                                                                                                       |

The most common issues uncovered were related to cardinality violations and compression. In fact, **_every_** implementation tested had at least one issue related to both of these topics.

To reiterate: cardinality violations are when a stream has an unexpected number of messages. Just like we found in our own Connect implementations, some of Google’s implementations aren’t checking for or handling these conditions and some are using different error codes.

The compression issues uncovered had to do with: (1) what happens when a message is received that uses an unsupported compression encoding and (2) what happens when a message is received that is marked as compressed (via a protocol-level flag) but no compression encoding is actually in use. The docs for compression in gRPC state the expected behavior for these scenarios, but the implementations don’t all conform.

## Conclusion

We believe specifications aren’t suggestions, they’re contracts. For Connect RPC, it’s essential to us that every implementation we release strictly provides protocol compatibility with the existing gRPC ecosystem. We are pleased with the findings that our test suite has produced, and we’re certain that it will be a critical resource for the project as we onboard new Connect RPC implementations in the coming months. This conformance suite is now available to everyone, and we hope you’ll join us in using it to grow the confidence and quality of work we’re producing as a community.

‍
