---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/architecture/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bufstream/releases/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bufstream/architecture/kafka-flow/"
  - - meta
    - property: "og:title"
      content: "Bufstream architecture - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/architecture/index.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/architecture/"
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
      content: "Bufstream architecture - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/architecture/index.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Architecture

Bufstream is a Kafka-compatible message queue that uses object storage for data persistence and PostgreSQL for coordination, decoupling compute from storage while eliminating the need for ZooKeeper or KRaft.

The following architecture guides provide deeper insights into how it works:

- [Kafka data flow](kafka-flow/): How Bufstream combines object storage and a metadata service to support Kafka's producer and consumer data flows.
- [Network architecture](bufstream-network-deployment-guide/): How Bufstream is air-gapped within your VPC and guides for connecting clients both within and outside the same Kubernetes cluster.
