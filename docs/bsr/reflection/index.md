---
description: "Overview of using the Buf Schema Registry Reflection API for runtime Protobuf decoding"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/reflection/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/subscription/faq/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/apis/api-access/"
  - - meta
    - property: "og:title"
      content: "Reflection API - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/reflection/index.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/reflection/"
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
      content: "Reflection API - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/reflection/index.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Reflection API

The Protobuf binary format is compact and efficient, and it has clever features that allow for a wide variety of schema changes to be both backward- and forward-compatible. However, it isn't possible to make meaningful sense of the data without a schema.

Protobuf identifies fields by an integer instead of a semantic name, and also uses a simple wire format which re-uses various value encoding strategies for different value types. This means it isn't even possible to usefully interpret encoded values without a schema. For example, you can't know with certainty if a value is a text string, a binary blob, or a nested message structure — it's not human-friendly.

All of the use cases below require a mechanism by which the schema for a particular message type can be downloaded on demand so that the binary data can be interpreted. The [Buf Reflection API](https://buf.build/bufbuild/reflect) is exactly that mechanism. It provides a means of programmatically downloading the schema for any module in the BSR. See the [usage](#call-the-api) section below for instructions.

::: tip Note
The Reflection API is currently in beta. It should be considered unstable and possibly impermanent.
:::

## Reflection use cases

For some systems and use cases, a process or user agent may not have prior (compile-time) knowledge of the schemas, but still needs to be able to decode the data at runtime.

### RPC debugging

It's useful for humans to be able to meaningfully interpret, examine, and/or modify RPC requests and responses with tools like `tcpdump`, Wireshark, or Charles proxy. Without the schema, these payloads are inscrutable byte sequences.

### Persistent store debugging

This is similar to the previous use case, but instead looking at data blobs in a database or durable queue (such as a message queue). A key difference is that it's likely to involve observing messages produced over a longer period of time, using many versions of the schema as it evolved.

### Data pipeline schemas and transformations

This applies less to human interaction and more to data validation and transformation. A producer may be pushing binary blobs of encoded Protobuf into a queue or publish/subscribe system. The system may want to verify that the blob is actually valid for the expected type of data, which requires a schema.

The consumer may need the data in an alternate format, but the only way to transform the binary data into an alternate format is to have the schema. Further, the only way to avoid dropping data is to have a version of the schema that's no older than the version used by the publisher. Otherwise, newly added fields may not be recognized and then silently dropped during a format transformation.

## Call the API

You can find the Buf Reflection API in the [public BSR](https://buf.build/bufbuild/reflect) and consume its [generated SDKs](https://buf.build/bufbuild/reflect/sdks/main) directly, or view it in [GitHub](https://github.com/bufbuild/reflect-api).

It contains a single RPC service: `buf.reflect.v1beta1.FileDescriptorSetService`. This service contains a single endpoint named `GetFileDescriptorSet`, which is for downloading the schema for a particular module (optionally, at a specific version). The response is in the form of a [`FileDescriptorSet`](https://github.com/protocolbuffers/protobuf/blob/v21.0/src/google/protobuf/descriptor.proto#L55-L59). The BSR contains [reference documentation](https://buf.build/bufbuild/reflect/docs/main:buf.reflect.v1beta1#buf.reflect.v1beta1.FileDescriptorSetService) for all request and response fields.

The endpoint accepts a module name in `BSR_INSTANCE/OWNER/REPOSITORY` format. For example, `buf.build/connectrpc/eliza` is the module name for the Eliza service (a demo service for [Connect](https://connectrpc.com)). The domain of the BSR is "buf.build" (the public BSR), the owner is the "connectrpc" organization, and the repo name is "eliza".

Here's an [example API request](../apis/api-access/) for downloading the [`buf.build/connectrpc/eliza`](https://buf.build/connectrpc/eliza) module:

```sh
curl \
    https://buf.build/buf.reflect.v1beta1.FileDescriptorSetService/GetFileDescriptorSet \
    -H "Authorization: Bearer ${BUF_TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{"module": "buf.build/connectrpc/eliza"}'
```

Assuming a valid BSR token is used in the `Authorization` header, this returns a `FileDescriptorSet` that describes the files in the requested module, which describe the Eliza RPC service and all related message types.

The above request doesn't contain a `version` field in the request, which means it returns the latest version. This is the same as asking for `"version": "main"`, which also returns the latest version. The version can also refer to a [commit](https://buf.build/connectrpc/eliza/commits/main), either via the commit name or an associated label.

These are the same ways you can pin a particular version in the `deps` section of a `buf.yaml` file. See [Dependency management](../module/dependency-management/) for more information.

In addition to querying for the schema by module name and version, the Reflection API also allows the caller to signal what part of the schema they're interested in, such as a specific message type or a specific service or method.

### Filter the schema

It's particularly useful with large modules, to reduce the amount of schema data that a client needs to download. For example, a client might need the schema for a single service, but it's defined in a large module that defines many services.

The request can indicate the name of the parts of interest in the `symbols` field by providing an array of fully qualified names. If present and non-empty, the returned schema is pruned to include only the data required to describe the requested symbols.

Here's an example that returns only the `google.longrunning.Operations` service from the [`buf.build/googleapis/googleapis`](https://buf.build/googleapis/googleapis) module:

```sh
curl \
    https://buf.build/buf.reflect.v1beta1.FileDescriptorSetService/GetFileDescriptorSet \
    -H "Authorization: Bearer ${BUF_TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{"module": "buf.build/googleapis/googleapis", "version": "75b4300737fb4efca0831636be94e517", "symbols": ["google.longrunning.Operations"]}'
```

This currently returns a response that's about 11k. If we leave out the `symbols` field from the request, the response is about 10x that size.

## Build dynamic messages

Once you've downloaded a `FileDescriptorSet`, the next step is choosing what to do with it. Having the whole schema allows for building dynamic messages, which are backed by a descriptor at runtime instead of by generated code.

The general shape of this solution is twofold:

1.  Convert `FileDescriptorProto` instances to "rich" data structures that are cross-linked and indexed. This makes it easy to traverse type references in the schema. This process also validates the schema, to make sure it isn't missing any necessary elements and is valid per the rules of the Protobuf language.
2.  Use a "rich" descriptor that describes a message to construct a _dynamic_ message. This message acts in most ways like a regular generated message. You can unmarshal message data from an array of bytes or marshal the message's data to bytes. You can examine the field values of the message, too. Since it isn't a generated type, however, you can't access fields in the normal way since your code doesn't even know what fields the message has at compile time.

The power of a dynamic message is that it enables an "appliance" that can process message data of arbitrary types in cross-cutting ways. A particularly powerful and common use case is to examine fields and field options to redact sensitive data/PII, convert to JSON, and then store in a data warehouse for use with business intelligence tools.

_Without_ a dynamic message, you have to write a bespoke message processor that must be recompiled and re-deployed whenever any of the message definitions are changed.

_With_ a dynamic message, you can compile and deploy the service once, but then must provide the service with updated message definitions as they change; that's where the BSR and the Buf Reflect API come in.

To get a sense of how the API can be used to perform the functionality described in this section, take a look at our example [client library](prototransform/). Unfortunately, not all languages/runtimes have support for descriptors and dynamic messages. Here are ones that do, with links to relevant API documentation.

- C++
  - [Descriptors](https://protobuf.dev/reference/cpp/api-docs/google.protobuf.descriptor/)
  - [Dynamic Messages](https://protobuf.dev/reference/cpp/api-docs/google.protobuf.dynamic_message/)
- Go
  - [Descriptors](https://pkg.go.dev/google.golang.org/protobuf/reflect/protoreflect)
  - [Dynamic Messages](https://pkg.go.dev/google.golang.org/protobuf/types/dynamicpb)
- Java
  - [Descriptors](https://protobuf.dev/reference/java/api-docs/com/google/protobuf/Descriptors.html)
  - [Dynamic Messages](https://protobuf.dev/reference/java/api-docs/com/google/protobuf/DynamicMessage.html)
- Python
  - [Descriptors](https://googleapis.dev/python/protobuf/latest/google/protobuf/descriptor_pool.html)
  - [Dynamic Messages](https://googleapis.dev/python/protobuf/latest/google/protobuf/message_factory.html)

There are other languages (C#, PHP) that include some support for descriptors, but only for runtime reflection — they don't provide dynamic message support. There also may be third-party language runtimes that offer this support.
