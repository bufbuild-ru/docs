---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/deployment/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bufstream/integrations/factor-house-kpow/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bufstream/deployment/docker/"
  - - meta
    - property: "og:title"
      content: "Deployment - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/deployment/index.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/deployment/"
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
      content: "Deployment - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/deployment/index.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Bufstream deployment

## Docker

Docker is the fastest way to deploy Bufstream. See [Deploy Bufstream with Docker](docker/) to get started.

## Cloud providers

You can deploy Bufstream on your chosen cloud provider with your preferred metadata store. We recommend Postgres as the metadata store for most workloads.

- [AWS](aws/deploy-postgres/)
- [Google Cloud](gcp/deploy-postgres/)
- [Azure](azure/deploy-postgres/)

If you're on Google Cloud and need to deploy Bufstream in a multi-region or active/active configuration, we recommend Spanner as the metadata store:

- [Spanner on Google Cloud](gcp/deploy-spanner/)

## Recommended settings

See [Cluster recommendations](cluster-recommendations/) for guidance on cluster sizing and performance tuning.
