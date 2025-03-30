---
layout: home

hero:
  name: "Introducing buf curl - Call your gRPC endpoints with the simplicity of buf"
---

Today, we’re introducing a new tool for Protobuf APIs: [`buf curl`](/docs/curl/usage/index.md).

This addition to the Buf CLI makes it easy to invoke [gRPC](https://grpc.io/), [gRPC-Web](https://github.com/grpc/grpc-web), and [Connect](https://connectrpc.com/) endpoints when debugging, when testing, or in cases where using a generated RPC client is too heavy. It is designed to match the same workflow as [`curl`](https://everything.curl.dev/), even providing many of its familiar flags. Upgrade to v1.12.0 of [`buf`](https://github.com/bufbuild/buf) to use `buf curl` today!

### Why buf curl?

`buf curl` makes it effortless to call RPC endpoints using the same setup and workflow as for building, linting, breaking change detection, and code generation - if your code builds with `buf`, you can use `buf curl` right away.

There have been previous tools that allow you to call gRPC endpoints. In fact, in a previous life, I built a popular one named [`grpcurl`](https://www.fullstory.com/blog/tale-of-grpcurl/). `buf curl` is the next generation of `grpcurl` - with `grpcurl`, you either need your servers to support [server reflection](https://github.com/grpc/grpc/blob/master/doc/server-reflection.md) (which comes with its own security considerations), _or_ you have to practically re-create your Protobuf build system in the form of `-proto` and `-import-path` arguments. With `buf curl`, you don't have to think about any of that. While `buf curl` _does_ support server reflection, it also seamlessly integrates with the [Buf Schema Registry](/docs/bsr/index.md), eliminating the need for server reflection or for a local Protobuf schema.

**`buf curl` is to `grpcurl` as `buf` is to `protoc`** - all the power that you need without any complexity. For teams that already use Buf, `buf curl` is sure to make workflows simpler.

### Examples

To get a sense for how `buf curl` works, let’s take a look at a few examples.

First, let’s use `buf curl` to invoke a gRPC endpoint with local Protobuf sources and no server reflection. This uses the [module](/docs/concepts/modules-workspaces/index.md) defined in the `proto` directory of [github.com/connectrpc/examples-go](https://github.com/connectrpc/examples-go) to invoke our demo ElizaService:

```protobuf
$ git clone https://github.com/connectrpc/examples-go && \
  cd ./examples-go && \
  buf curl --protocol grpc --schema ./proto \
    https://demo.connectrpc.com/connectrpc.eliza.v1.ElizaService/Say \
    -d '{"sentence":"Hello."}'
Cloning into 'examples-go'...
remote: Enumerating objects: 446, done.
remote: Counting objects: 100% (314/314), done.
remote: Compressing objects: 100% (195/195), done.
remote: Total 446 (delta 187), reused 185 (delta 89), pack-reused 132
Receiving objects: 100% (446/446), 120.50 KiB | 1.45 MiB/s, done.
Resolving deltas: 100% (197/197), done.
{"sentence":"Hello, how are you feeling today?"}
```

`‍`We also push this module to the Buf Schema Registry, located at [buf.build/connectrpc/eliza](https://buf.build/connectrpc/eliza). Using modules hosted on the Buf Schema Registry is a snap:

```protobuf
$ buf curl --protocol grpc --schema buf.build/connectrpc/eliza \
    https://demo.connectrpc.com/connectrpc.eliza.v1.ElizaService/Say \
    -d '{"sentence":"Hello."}'
{"sentence": "Hello, how are you feeling today?"}
```

`‍`Finally, let’s try a request that uses the Connect protocol (the default) and this time retrieve the RPC schema using server reflection (which is enabled on our demo ElizaService). In this scenario, you don’t need any protocol or schema flags:

```protobuf
$ buf curl \
    https://demo.connectrpc.com/connectrpc.eliza.v1.ElizaService/Say \
    -d '{"sentence":"Hello."}'
{"sentence": "Hello, how are you feeling today?"}
```

`‍   `

### How it works

Protobuf-based RPCs binary-encode messages and wrap streamed messages in a binary envelope, making it difficult to craft ad-hoc requests using tools like `curl` and [`wget`](https://www.gnu.org/software/wget/).

`buf curl` differs from normal `curl` by handling the relevant RPC protocol details for the user so they don’t need to remember the right way to craft a request (such as which HTTP method and headers need to be specified). It also takes care of message formatting and framing by accepting a simple JSON document (or multiple JSON values concatenated together for request streams) and translating the messages to the Protobuf binary format. For responses, it does the reverse, translating the Protobuf binary format into JSON to make the response data easier for humans to read and, combined with tools like [`jq`](https://stedolan.github.io/jq/), easier to include in scripts.

In order to do this format conversion, the Protobuf schema for the RPC service is needed since the Protobuf binary format cannot be interpreted without a schema. The `buf curl` command can automatically download the schema from the server if it supports server reflection. If the server does not support server reflection, the tool can use a compiled descriptor set or even compile Protobuf sources on the fly, pulling the sources from a module in the Buf Schema Registry, a Git repo, or files on disk.

The `buf curl` command supports three protocols, selected via command-line option: [Connect](https://connectrpc.com/docs/protocol), [gRPC](https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md), and [gRPC-Web](https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-WEB.md). If your environment doesn't support HTTP/2 end-to-end, including through all load balancers and reverse proxies, then the gRPC protocol won't work. For that reason, `buf curl` also supports Connect and gRPC-Web, which don’t require HTTP/2 and can work over HTTP/1.1.

The [Connect](/blog/connect-a-better-grpc/index.md) protocol was developed to be friendlier both for humans and commonplace HTTP software libraries. It includes out-of-the-box support for JSON encoding and does not use framing or message enveloping for unary RPCs (i.e., non-streaming RPCs that have one request message and one response message). However, Connect still needs framing for streaming RPCs, which means it can be challenging to use with vanilla `curl`. `buf curl` is a one-stop shop for interacting with RPCs, even when using a simpler protocol like Connect.

The command-line interface and options for `buf curl` were designed to mirror the standard `curl` command as closely as possible, so users who are familiar with `curl` will be able to easily find their way around `buf curl`.

### Try it out

Take `buf curl` for [a spin](/docs/cli/installation/index.md)! More details about the command can be found on our [documentation site](/docs/curl/usage/index.md) or by running `buf help curl` after installing v1.12.0. If you have any requests or find a bug, please let us know by filing a [GitHub issue](https://github.com/bufbuild/buf/issues).

‍
