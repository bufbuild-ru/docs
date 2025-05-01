---
sidebar: false
prev: false
next: false

title: "Bufstream: Kafka at 8x lower cost"
description: "We're excited to announce the public beta of Bufstream, a drop-in replacement for Apache Kafka deployed entirely in your own VPC that's 8x less expensive to operate."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/bufstream-kafka-lower-cost"
  - - meta
    - property: "og:title"
      content: "Bufstream: Kafka at 8x lower cost"
  - - meta
    - property: "og:description"
      content: "We're excited to announce the public beta of Bufstream, a drop-in replacement for Apache Kafka deployed entirely in your own VPC that's 8x less expensive to operate."
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674fa986d37305da4f71b8e0_Bufstream-kafka%20lower%20cost.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Bufstream: Kafka at 8x lower cost"
  - - meta
    - property: "twitter:description"
      content: "We're excited to announce the public beta of Bufstream, a drop-in replacement for Apache Kafka deployed entirely in your own VPC that's 8x less expensive to operate."
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674fa986d37305da4f71b8e0_Bufstream-kafka%20lower%20cost.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Bufstream: Kafka at 8x lower cost

We're excited to announce the public beta of [Bufstream](https://buf.build/product/bufstream), a drop-in replacement for Apache Kafka deployed entirely in your own VPC that's 8x less expensive to operate.

## Key takeaways

- Bufstream is a Kafka-compatible queue that's 8x less expensive to operate than Apache Kafka.
- While Bufstream slashes costs for any Kafka workload, it excels when paired with Protobuf.
- By integrating with the Buf Schema Registry, Bufstream can enforce data quality and governance policies without relying on opt-in client configuration.
- We're planning to add granular, field-level RBAC and native support for Apache Iceberg tables.
- Bufstream runs in your AWS or GCP projects without sending any data to Buf.

Check out the [demo](/docs/bufstream/quickstart/index.md), dive into the [benchmarks and cost analysis](/docs/bufstream/cost/index.md), and [contact us](https://buf.build/contact-us) to join the beta!

## What is Bufstream?

[Bufstream](https://buf.build/product/bufstream) is a fully self-hosted drop-in replacement for Apache Kafka® that writes data to S3-compatible object storage. It’s 100% compatible with the Kafka protocol, including support for exactly-once semantics (EOS) and transactions. Bufstream enforces data quality and governance requirements directly at the broker with [Protovalidate](https://github.com/bufbuild/protovalidate). Data written to S3 by Bufstream is encoded in [Parquet](https://parquet.apache.org/) format and includes [Apache Iceberg™](https://iceberg.apache.org/) metadata, reducing Time-to-Insight in popular data lakehouse products like Snowflake or ClickHouse.

## Why did we do this?

We began designing Bufstream last year, when we heard the same story from many of our customers. After adopting gRPC and Connect for service-to-service networking, our customers naturally wanted to keep using Protobuf in their streaming data pipelines — but the Kafka ecosystem didn't support their workloads well. Because Kafka itself doesn't understand or inspect message payloads, maintaining high-quality data sets required _every_ data producer to enable client-side schema and data contract enforcement. Opt-in enforcement rarely works at scale, and our customers regularly found bad data polluting downstream systems. In an increasingly complex regulatory environment, they also struggled to govern data access with Kafka's coarse topic-level controls. And of course, they all found Kafka _extraordinarily_ expensive to operate. We built Bufstream to address these challenges head-on.

## Quality and governance as platform capabilities

Bufstream treats data quality as a critical concern — one that's too important to delegate to opt-in client-side configuration. For topics with Protobuf schemas, Bufstream can reject messages that don't match the schema, surfacing errors immediately to the data producer. Bufstream can also go further and enforce any [protovalidate](https://github.com/bufbuild/protovalidate) constraints specified in the schema, ensuring that messages are semantically valid. Together, these two features allow data platform teams to _guarantee_ that consumers will always receive valid, high-quality data.

Bufstream also bakes in granular data access controls: it can redact Protobuf messages on the fly, exposing just a subset of fields to data consumers. Today, this logic is static: each consumer sees the same subset of fields. As part of building support for TLS, SASL, and SCRAM, we plan to evolve this static system into full-fledged, field-level RBAC. Using a taxonomy of privacy-related data types and allowed usages, producers will be able to annotate sensitive fields in their Protobuf schemas. Bufstream will then ensure that each consumer receives only the fields they're permitted to use.

## Optimized for cloud economics

To provide these data quality and governance features while reining in Kafka's runaway costs, we needed to redesign it from the ground up. By writing data directly to S3-compatible object storage, Bufstream can dispense with expensive disks and nearly eliminate inter-zone networking, slashing costs dramatically.

**In our benchmarks,** [**Bufstream is 8x less expensive than Apache Kafka**](/docs/bufstream/cost/index.md)**: a workload which costs $84,796 per month on Apache Kafka costs just $11,147 on Bufstream.** Putting object storage directly in the write path increases Bufstream's end-to-end message delivery latency, but not as much as you might expect: median latency is 260 ms, and p99 latency is 500 ms.

![p50 latency](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6746705f5466e6aed0527133_latency-p50.png)

![p99 latency](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6746705fbb4287658cfd2b63_latency-p99.png)

For the high-volume analytic workloads that drive Kafka costs, we believe that these cost savings are worth a bit of extra latency. For particularly latency-sensitive or latency-tolerant workloads, operators can tune how aggressively Bufstream trades latency for cost.

In the coming months, we'll also allow Bufstream operators to opt into storing some topics as Apache Iceberg tables. Kafka consumers will still be able to read from the topic, but SQL engines will also be able to query the data directly. This doesn't just eliminate the toil of managing a Kafka-to-Iceberg connector; it also lowers costs by eliminating a redundant copy of the data. **In our benchmark workload, sharing storage with a data lake would save $3,498, dropping total cost to $7,649 — 11x less than Apache Kafka.**

## Air-gapped deployment and straightforward pricing

Bufstream deploys into any AWS or GCP Kubernetes cluster with a simple Helm chart, and it works with any S3-compatible object store. Each Bufstream deployment is fully self-contained: it doesn't rely on a cloud control plane, send telemetry to Buf, or have a hard dependency on any Buf-managed SaaS at all. For production use, we charge a usage-based fee of $0.002 per GiB of write traffic, without any additional per-call, per-core, or per-instance costs. For the 1 GiB/s write load in our benchmark, the [monthly fees add up to $5,184](/docs/bufstream/cost/index.md#optimized-for-cloud-economics) and are already included in the $11,147 total cost.

We'd love to partner with you to reduce Kafka costs, improve data quality, and tighten data governance. You can get a feel for Bufstream with our [interactive demo](/docs/bufstream/quickstart/index.md), dig into our [benchmarks and cost analysis](/docs/bufstream/cost/index.md), or chat with us in the [Buf Slack](https://buf.build/b/slack). For production deployments or to schedule a demo with our team, [reach out to us directly](https://buf.build/contact-us)!
