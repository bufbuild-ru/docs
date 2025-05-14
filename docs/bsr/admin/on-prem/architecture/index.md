---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/admin/on-prem/architecture/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/admin/on-prem/observability/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/admin/on-prem/upgrade/"
  - - meta
    - property: "og:title"
      content: "Architecture - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/on-prem/architecture.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/admin/on-prem/architecture/"
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
      content: "Architecture - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/on-prem/architecture.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Architecture

On-prem deployments of the BSR are effectively air-gapped from Buf. No sharing of data or analytics occurs without manual action by the customer.

Here is a simplified architecture diagram for the Buf Schema Registry (BSR):

![BSR architecture diagram](../../../../images/bsr/architecture.png)

## Dependencies

- **PostgreSQL** (version 14+): Stores application data such as users, organizations, repositories, and commit references
- **Redis** (version 6+): Caches compiled modules and other performance-enhancing data
- **S3-compatible storage** or **Azure Blob Storage**: Persists BSR [modules](../../../../cli/modules-workspaces/) as binary representations of a set of Protobuf files

### External dependencies

The following images can be mirrored internally, if desired:

- **[library/registry](https://hub.docker.com/_/registry)**: OCI Image Registry that holds container images for [remote plugins](../../../remote-plugins/overview/).

## Main components

### bufd

- The main [API](https://buf.build/bufbuild/buf/docs/main:buf.alpha.registry.v1alpha1) used by the frontend app and Buf CLI
- Provides the ability to remotely generate code from modules using **bufsandboxd**
- [Remote package](../../../generated-sdks/overview/) APIs to support pulling generated code using package managers in several languages (for example **npm install**, **go get**)
- [buf studio](../../../studio/), a browser tool that allows developers to create, edit and send gRPC and connect messages to arbitrary servers

### bufsandboxd

- Provides a sandboxed environment where images from the registry can be executed to generate code

### bufjavacompilerd

- Receives Kotlin and Java plugin generated code, which it compiles and packages into artifacts (jar, sources jar, pom) to be served via the maven repository
