---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/reflection/prototransform/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/reflection/overview/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/admin/user-account/"
  - - meta
    - property: "og:title"
      content: "Prototransform - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/reflection/prototransform.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/reflection/prototransform/"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "og:image:type"
      content: "image/png"
  - - meta
    - property: "og:image:width"
      content: "1200"
  - - meta
    - property: "og:image:height"
      content: "630"
  - - meta
    - property: "twitter:title"
      content: "Prototransform - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/reflection/prototransform.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Prototransform

Like any Connect API, you can use the Buf Reflection API using a client [generated](../../../generate/tutorial/) via the Buf CLI (for example `buf generate buf.build/bufbuild/reflect`) or by downloading a [generated SDK](../../generated-sdks/overview/). This API client allows you to download `FileDescriptorProtos`.

A richer client library, that makes use of dynamic messages (provided by various Protobuf runtimes), is needed to fully unlock some powerful use cases enabled by the API.

We've created a Go client library in a package named [`prototransform`](https://pkg.go.dev/github.com/bufbuild/prototransform) which is exactly that. It combines a generated Connect client for the Buf Reflection API with the dynamic message support provided by the Go runtime for Protocol Buffers.

This library allows you to dynamically process message data. The current key use case is for converting message data from one format to another, but it also allows you to hook in your own filters which can transform the message. One such transformation, for which additional helpers are provided, is to redact fields (such as stripping message data before it's shipped to a data warehouse). The interface is general and allows for arbitrary manipulation of the message before output is produced.

## `SchemaWatcher`

The first step in using this library is to import `"github.com/bufbuild/prototransform"`. Then you create a `SchemaWatcher`, which downloads a schema from the BSR and then periodically polls for updates to the schema:

```go
// Supply auth credentials to the BSR.
token := os.Getenv("BUF_TOKEN")
// Create an RPC client for buf.reflect.v1beta1.FileDescriptorSetService.
// This client will send requests to the public BSR at buf.build.
client := prototransform.NewDefaultFileDescriptorSetServiceClient(token)

// Create the schema watcher, which downloads a schema and then
// periodically polls for updates.
cfg := &prototransform.Config{
    Client:  client,
    Module:  "buf.build/connectrpc/eliza", // Eliza service (Connect demo module)
}
watcher, err := prototransform.NewSchemaWatcher(ctx, cfg)
if err != nil {
    return fmt.Errorf("failed to create schema watcher: %v", err)
}
defer watcher.Stop()
```

Before using the watcher, you need to make sure that it has successfully initialized the schema, via initial download from the BSR or via loading from an optional cache.

```go
ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
defer cancel()
if err := watcher.AwaitReady(ctx); err != nil {
    return fmt.Errorf("schema watcher never became ready: %v", err)
}
```

Instead of waiting during your server's startup, you could allow the server to start but also wire up a call to the watcher's `LastResolved` method in a [server health check](https://learn.microsoft.com/en-us/azure/architecture/patterns/health-endpoint-monitoring), so that your service won't advertise itself as ready to serve traffic until the schema has been successfully initialized.

## `Converter`

Once you have a watcher, you can create a `Converter`, which uses the schema downloaded by the watcher to process message data:

```go
// This converter will accept data in the Protobuf binary format and produce
// data in JSON format.
converter := &prototransform.Converter{
    Resolver:       watcher,
    InputFormat:    prototransform.BinaryInputFormat(proto.UnmarshalOptions{}),
    OutputFormat:   prototransform.JSONOutputFormat(protojson.MarshalOptions{}),
}
```

To use the converter, you need the expected message type's fully qualified name. This can be data-driven — for example, producers of messages in a queue could add metadata to the queued item that contains the message type's name.

Provide the message name and message contents in the configured input format (as `[]byte`), and the converter returns data in the configured output format:

```go
convertedData, err := converter.ConvertMessage(messageName, messageData)
```

## Filters

In addition to converting data formats, the converter can also be configured to apply custom mutations/transformations to the message.

Let's say there's a custom option that's used to mark fields as sensitive (such as fields that contain secrets or PII — personally identifiable information):

```protobuf
syntax = "proto3";
package example.v1;

import "google/protobuf/descriptor.proto";
extend google.protobuf.FieldOptions {
  bool sensitive = 30000;
}

message ExampleMessage {
  string credit_card_account_number = 1 [(sensitive) = true];
}
```

We can then configure the converter to redact any fields that are marked with this custom option:

```go
isSensitive := func (in protoreflect.FieldDescriptor) bool {
    return proto.GetExtension(in.Options(), examplev1.E_Sensitive).(bool)
}
converter := &prototransform.Converter{
    Resolver:       watcher,
    InputFormat:    prototransform.BinaryInputFormat(proto.UnmarshalOptions{}),
    OutputFormat:   prototransform.JSONOutputFormat(protojson.MarshalOptions{}),
    Filters:        prototransform.Filters{prototransform.Redact(isSensitive)}
}
```

When we convert a message using the above converter, all sensitive fields are omitted in the output data.

The signature of a filter is `func(protoreflect.Message) protoreflect.Message`, so it allows any arbitrary transformation. You could even write a filter that returns a completely different type of message, derived from the input. If your filter only needs to mutate the message, you can directly modify the input message and then return it (no need to make a copy of it in the filter).
