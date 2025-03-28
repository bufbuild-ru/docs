# Get module's FileDescriptorSet from the BSR

You can use [`buf build`](../../../reference/cli/buf/build/) to build the FileDescriptorSet or a [Buf image](../../../build/overview/) that's wire compatible with FileDescriptorSet. However, there are certain scenarios or environments where it may be difficult to access the Buf CLI.The BSR API allows you to access the FileDescriptorSet of a module hosted on the BSR directly. Using `curl`, the basic download command requires a BSR module as the source:

::: info Get the FileDescriptorSet and output the binary in the terminal

```console
$ curl -s "https://buf.build/acme/petapis/descriptor/main" --output -
```

:::

You can also specify the commit or label reference of the BSR module:

::: info Get a module's FileDescriptorSet at a specific commit

```console
$ curl -s "https://buf.build/acme/petapis/descriptor/7abdb7802c8f4737a1a23a35ca8266ef" --output -
```

:::

## Exclude dependencies

By default, the FileDescriptorSet includes all of the module's dependencies along with the module content. You can exclude the target module’s dependencies by adding the `imports=false` query parameter:

::: info Exclude dependencies

```console
$ curl -s "https://buf.build/acme/petapis/descriptor/main?imports=false" --output -
```

:::

## Include source code info

By default, the FileDescriptorSet includes no source code info. You can include the source code info by adding the `source_info=true` query parameter:

::: info Include source code info

```console
$ curl -s "https://buf.build/acme/petapis/descriptor/main?source_info=true" --output -
```

:::

## Include source retention options

By default, the FileDescriptorSet includes no [source retention options](https://github.com/protocolbuffers/protobuf/blob/main/src/google/protobuf/descriptor.proto#L732-L739).You can extend the FileDescriptorSet output to include the source retention options by adding the `source_retention_options=true` query parameter:

::: info Include source retention options

```console
$ curl -s "https://buf.build/acme/petapis/descriptor/main?source_retention_options=true" --output -
```

:::

## Content negotiation

The module descriptor endpoint supports content negotiation, so that you can request the desired format of the FileDescriptorSet by providing the `Accept` HTTP header. By default, or when `application/proto` is explicitly provided in the `Accept` HTTP header, the FileDescriptorSet output is in the wire (binary) format. You can request the JSON format of the FileDescriptorSet by providing `application/json` in the `Accept` HTTP header:

::: info Request JSON format

```console
$ curl -s "https://buf.build/acme/petapis/descriptor/main" -H "Accept: application/json"
```

:::

You can also request the response to be compressed by providing `gzip` in the `Accept-Encoding` HTTP header:

::: info Request compressed response

```console
$ curl -s "https://buf.build/acme/petapis/descriptor/main" -H "Accept-Encoding: gzip" --output -
```

:::
