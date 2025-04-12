---
layout: home

hero:
  name: "Introducing the Buf Reflection API & Prototransform"
  tagline: "February 2, 2023"
---

The Protobuf binary format has many advantages — it is compact and efficient, and it has clever features that allow for a wide variety of schema changes to be both backward- and forward-compatible. However, it is not possible to make meaningful sense of the data without knowing its schema. Not only is it not human-friendly since all fields are identified by an integer instead of by a semantic name, but it also uses a very simple wire format which reuses various value encoding strategies for different value types. This means it is not even possible to usefully interpret encoded values without a schema. For example, one cannot know if a value is a text string, a binary blob, or a nested message structure.

But there exists a category of systems and use cases where it is necessary or useful to decode the data at runtime, by a process or user agent that does not have prior (compile-time) knowledge of the schemas:

1.  **RPC debugging**. It is useful for a human to be able to meaningfully interpret/examine/modify RPC requests and responses with tools like `tcpdump`, Wireshark, or Charles Proxy. However, without the schema, these payloads are inscrutable byte sequences.
2.  **Persistent store debugging** (including message queues): This is similar to the above use case, but the human is looking at data blobs in a database or durable queue.
3.  **Data pipeline schemas and transformations**: This is less for human interaction and more for data validation and transformation. A producer may be pushing binary blobs of encoded Protobuf into a queue or publish/subscribe system. The system may want to verify that the blob is actually valid for the expected type of data, which requires a schema. The consumer may need the data in an alternate format, and the only way to transform the binary data into an alternate format is to have the schema. Further, the only way to avoid dropping data is to have a version of the schema that is no older than the version used by the publisher. Otherwise, newly added fields may not be recognized and get silently dropped during a format transformation.

All of these cases call for a mechanism where every version of a schema for a particular message type can be easily downloaded to interpret the binary data.

**Today we are announcing the** [**Buf Reflection API**](/docs/bsr/reflection/overview/#api-usageindex.md) **which enables developers to programmatically query the Buf Schema Registry (**[**BSR**](/docs/bsr/index.md)**) to provide versioned Protobuf schemas on demand.**

Many kinds of powerful tools can be built on top of this API to solve the above problems, among others. As a first step, we're also releasing one such tool: A Go package called [_Prototransform_](/docs/bsr/reflection/prototransform/index.md) which makes use of the new API and allows for transcoding and manipulation of arbitrary Protobuf messages across several formats, including the Protobuf binary format.

## Buf Reflection API in action

The new API consists of the [`FileDescriptorSetService`](https://buf.build/bufbuild/reflect/docs/main:buf.reflect.v1beta1#buf.reflect.v1beta1.FileDescriptorSetService), which is implemented by the BSR. This API allows clients to download Protobuf schemas for [modules](/docs/bsr/index.md#modules) in the BSR. Each schema is returned in the form of a [`FileDescriptorSet`](https://github.com/protocolbuffers/protobuf/blob/v21.0/src/google/protobuf/descriptor.proto#L55-L59), which is also a form that can be produced by compilers like `buf` and `protoc`.

```protobuf
// This is a simplified view of the API. For full API documentation, see
// https://buf.build/bufbuild/reflect/docs.
package buf.reflect.v1beta1;

service FileDescriptorSetService {
  rpc GetFileDescriptorSet(GetFileDescriptorSetRequest) returns (GetFileDescriptorSetResponse);
}

message GetFileDescriptorSetRequest {
  // The name of the module that contains the schema of interest.
  string module = 1;
  // The version of the module to use.
  // For the BSR, this can be commits, tags, or branches.
  // If not set, the latest version of the module is returned.
  string version = 2;
  // Zero or more symbol names to filter on.
  // The names may refer to packages, messages, enums, services,
	// methods, or extensions.
  repeated string symbols = 3;
}

message GetFileDescriptorSetResponse {
  // The FileDescriptorSet produced.
  google.protobuf.FileDescriptorSet file_descriptor_set = 1;
  // The version that is being returned.
  // For the BSR, this can be commits, tags, or branches.
  string version = 2;
}
```

Descriptors are the basis of reflection in Protobuf. A file descriptor contains representations for all of the messages, enums, and services defined in a `.proto` source file. Descriptors are instrumental to the Protobuf plugin ecosystem for code generation, and also to dynamic use cases which require Protobuf message data to be processed without compile-time knowledge of all message types.

To see what a `FileDescriptorSet` looks like, we'll use the new API to query for the details of the [Connect demo API](https://github.com/connectrpc/examples-go), named the “Eliza” service:

_Note: This and all below examples expect an environment variable named `BUF_TOKEN` to contain the value of an authentication token. The public BSR at `buf.build` requires clients to provide such a token. If you don't already have an account, you can_ [_create one for free_](https://buf.build/signup?original_uri=/signup/) _and then_ [_create a token_](/docs/bsr/authentication/index.md#create-an-api-token)_._

```protobuf
$ curl \
   https://buf.build/buf.reflect.v1beta1.FileDescriptorSetService/GetFileDescriptorSet \
   -H "Authorization: Bearer ${BUF_TOKEN}" \
   -H "Content-Type: application/json" \
   -X POST -d '{"module": "buf.build/connectrpc/eliza"}'
```

These descriptors describe the Eliza service and all of the types in the [buf.build/connectrpc/eliza module](https://buf.build/connectrpc/eliza). Here's a snippet from the response, in which it's not hard to correlate data in the descriptor with sections of the actual source file from which it was compiled:

```protobuf
"name": "connectrpc/eliza/v1/eliza.proto",
"package": "connectrpc.eliza.v1",
"messageType": [
  {
    "name": "SayRequest",
    "field": [
      {
        "name": "sentence",
        "number": 1,
        "label": "LABEL_OPTIONAL",
        "type": "TYPE_STRING",
        "jsonName": "sentence"
      }
    ]
  },
```

This describes the file named [`connectrpc/eliza/v1/eliza.proto`](https://buf.build/connectrpc/eliza/file/main:connectrpc/eliza/v1/eliza.proto). We can see the above portion corresponds to [these](https://buf.build/connectrpc/eliza/file/main:connectrpc/eliza/v1/eliza.proto#L17) [parts](https://buf.build/connectrpc/eliza/file/main:connectrpc/eliza/v1/eliza.proto#L37) of the source:

```protobuf
package connectrpc.eliza.v1;

// SayRequest describes the sentence said to the ELIZA program.
message SayRequest {
  string sentence = 1;
}
```

Combined with a Protobuf runtime that [supports descriptors and dynamic messages](/docs/bsr/reflection/overview/#api-usageindex.md#dynamic-messages), one can build amazing things such as dynamic message processors, dynamic RPC clients, and RPC gateways/bridges.

This `FileDescriptorSetService` interface is implemented by the BSR, but it can theoretically also be implemented by other software, such as other schema registries or caching proxies.

## Prototransform

The first tool to be built on top of the new API is our new [`github.com/bufbuild/prototransform`](https://pkg.go.dev/github.com/bufbuild/prototransform) Go package. It allows for dynamic message filtering and conversion, which we expect to be extremely valuable in data pipelines where Protobuf has historically been more difficult to use.

Let's look at an example message processor that converts binary Protobuf messages to JSON to support a wider variety of downstream consumers:

```protobuf
// Supply auth credentials to the BSR.
token := os.Getenv("BUF_TOKEN")
// Create an RPC client for buf.reflect.v1beta1.FileDescriptorSetService.
// This client will send requests to the public BSR at buf.build.
client := prototransform.NewDefaultFileDescriptorSetServiceClient(token)

// Create a schema watcher which downloads a schema and then periodically
// polls for updates.
cfg := &prototransform.Config{
    Client:  client,
    Module:  "buf.build/connectrpc/eliza", // BSR module
}
watcher, err := prototransform.NewSchemaWatcher(ctx, cfg)
if err != nil {
    return fmt.Errorf("failed to create schema watcher: %v", err)
}
defer watcher.Stop()

// Before processing messages, make sure the schema has been
// successfully downloaded.
ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
defer cancel()
if err := watcher.AwaitReady(ctx); err != nil {
    return fmt.Errorf("schema watcher never became ready: %v", err)
}

// Finally create a Converter that will convert data from the Protobuf
// binary format to JSON.
converter := &prototransform.Converter{
    Resolver:       watcher,
    InputFormat:    prototransform.BinaryInputFormat(proto.UnmarshalOptions{}),
    OutputFormat:   prototransform.JSONOutputFormat(protojson.MarshalOptions{}),
}
```

The `converter` created above can then be used to process messages from a message queue or pub/sub system:

```protobuf
for {
    message, err := inputQueue.Receive()
    if err != nil {
        return err
    }
    // We can configure the message type per queue, or have the
    // publisher include the message type in metadata:
    messageName := message.Attributes("protobuf.type_name")
    jsonData, err := converter.ConvertMessage(messageName, message.Payload())
    if err != nil {
        log.Printf("failed to convert message: %v", err)
        continue
    }
    if err := outputQueue.Send(jsonData); err != nil {
        log.Printf("failed to publish JSON message: %v", err)
        continue
    }
    message.Ack()
}
```

Users can also provide custom filters for manipulating message contents before the output is produced. For example, take a look at [our docs](/docs/bsr/reflection/prototransform/index.md#filters) for a demonstration of a filter that redacts sensitive data from a message.

## A bright future

The BSR's new reflection API and the Prototransform library make for indispensable components for improving operations of large-scale data systems that use Protobuf messages, and greatly simplify other workflows such as debugging binary-encoded files or RPC messages.

Not only are there many cool things we can build on top of the new API, but we're also excited to see the kinds of awesome things that _you_, the community, can build on top of it, too.

Check out the [Buf](https://github.com/bufbuild/reflect-api) [Reflection API](/docs/bsr/reflection/overview/#api-usageindex.md) and [Prototransform](https://github.com/bufbuild/prototransform) package to get started! If you have any questions, don't hesitate to reach out to us on the [Buf Slack](https://buf.build/b/slack/). We'd love to hear your feedback!

‍
