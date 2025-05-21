---
description: "Documentation about how to get the File Descriptor Sets of a module from the BSR"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/module/descriptor/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/module/export/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/"
  - - meta
    - property: "og:title"
      content: "Get module's FileDescriptorSet from the BSR - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/module/descriptor.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/module/descriptor/"
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
      content: "Get module's FileDescriptorSet from the BSR - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/module/descriptor.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Get module's FileDescriptorSet from the BSR

You can use [`buf build`](../../../reference/cli/buf/build/) to build the FileDescriptorSet or a [Buf image](../../../build/) that's wire compatible with FileDescriptorSet. However, there are certain scenarios or environments where it may be difficult to access the Buf CLI.

The BSR API allows you to access the FileDescriptorSet of a module hosted on the BSR directly. Using `curl`, the basic download command requires a BSR module as the source:

::: info Get the FileDescriptorSet and output the binary in the terminal

```sh
curl -s "https://buf.build/acme/petapis/descriptor/main" --output -
```

:::

You can also specify the commit or label reference of the BSR module:

::: info Get a module's FileDescriptorSet at a specific commit

```sh
curl -s "https://buf.build/acme/petapis/descriptor/7abdb7802c8f4737a1a23a35ca8266ef" --output -
```

:::

## Exclude dependencies

By default, the FileDescriptorSet includes all of the module's dependencies along with the module content. You can exclude the target module’s dependencies by adding the `imports=false` query parameter:

::: info Exclude dependencies

```sh
curl -s "https://buf.build/acme/petapis/descriptor/main?imports=false" --output -
```

:::

## Include source code info

By default, the FileDescriptorSet includes no source code info. You can include the source code info by adding the `source_info=true` query parameter:

::: info Include source code info

```sh
curl -s "https://buf.build/acme/petapis/descriptor/main?source_info=true" --output -
```

:::

## Include source retention options

By default, the FileDescriptorSet includes no [source retention options](https://github.com/protocolbuffers/protobuf/blob/main/src/google/protobuf/descriptor.proto#L732-L739).

You can extend the FileDescriptorSet output to include the source retention options by adding the `source_retention_options=true` query parameter:

::: info Include source retention options

```sh
curl -s "https://buf.build/acme/petapis/descriptor/main?source_retention_options=true" --output -
```

:::

## Content negotiation

The module descriptor endpoint supports content negotiation, so that you can request the desired format of the FileDescriptorSet by providing the `Accept` HTTP header. By default, or when `application/proto` is explicitly provided in the `Accept` HTTP header, the FileDescriptorSet output is in the wire (binary) format. You can request the JSON format of the FileDescriptorSet by providing `application/json` in the `Accept` HTTP header:

::: info Request JSON format

```sh
curl -s "https://buf.build/acme/petapis/descriptor/main" -H "Accept: application/json"
```

:::

You can also request the response to be compressed by providing `gzip` in the `Accept-Encoding` HTTP header:

::: info Request compressed response

```sh
curl -s "https://buf.build/acme/petapis/descriptor/main" -H "Accept-Encoding: gzip" --output -
```

:::
