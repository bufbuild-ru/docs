---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/admin/on-prem/resource-requirements/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/admin/on-prem/installation/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/admin/on-prem/configuration/"
  - - meta
    - property: "og:title"
      content: "Resource requirements - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/on-prem/resource-requirements.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/admin/on-prem/resource-requirements/"
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
      content: "Resource requirements - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/on-prem/resource-requirements.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Resource requirements

This page contains resource sizing recommendations and rough cost estimates for a customer-operated BSR instance.

## Minimum recommendations

Though everyone's usage is different, we've found that the resource limits and requests we include in the helm chart by default work for the majority of our customers. If you use these defaults, you should be able to distribute usage comfortably over 8 vCPUs and 32 GiB of memory. We recommend standard good availability practices by spreading out your deployments over multiple nodes in multiple availability zones.

Major dependencies:

- 1x PostgreSQL instance with 4 CPU, 4 GiB memory, 10 GiB SSD disk. We recommend a high availability deployment.
- 1x Redis (_not_ Redis Cluster) instance with 1 GiB memory.
- Blob Storage. These usually don't require pre-provisioning, and we've found that the average BSR deployment uses less than 500GiB.

The estimated monthly cost with this minimum configuration varies per cloud provider, but should be less than $1000/month at list rates (not including any discounts).

- [GCP pricing calculator example](https://cloud.google.com/products/calculator?hl=en&dl=CjhDaVJqWWpnMk1qbG1NaTAwTVRRM0xUUTJNamt0WWpWa1pTMWpaVEl3T1RrNE1UUTJaamdRQVE9PRAPGiQ3Njk3MUQ3QS0wNDU4LTQ0NjUtOUEyNS04NjM3QUFDMUQzNEY)
- [AWS pricing calculator example](https://calculator.aws/#/estimate?id=a2b89e6ea8cea9b0c8a5e74bc6f76be7f71c1ee0)
- [Azure pricing calculator example](https://azure.com/e/8a75cb4ecf0e47b49a5c806a3f5b98b8)
