---

layout: home

hero:
  name: Bufstream
  tagline: Store directly to Apache Iceberg™ tables and guarantee data quality with Bufstream, a drop-in replacement for Apache Kafka®.
  actions:
    - theme: alt
      text: Read the docs
      link: /docs/bufstream/

features:
  - title: 8x lower cloud costs
    details: Bufstream replaces traditional disks with object storage, the most reliable and cost-effective cloud storage primitive. By eliminating expensive network-attached volumes and delegating cross-zone data replication to object storage Bufstream reduces cloud costs 8x compared to Apache Kafka — while remaining fully compatible with Kafka clients, connectors, and tools.
  - title: Apache Iceberg™ as your Kafka storage layer
    details: Bufstream natively writes your data to S3-compatible object storage as Iceberg tables with zero copies. Eliminate the need for a costly ETL pipeline and start querying your data in seconds.
  - title: Guaranteed data quality
    details: "Bufstream eliminates bad data at the source: rather than hoping that every producer will opt into validation, Bufstream agents work with the Buf Schema Registry to enforce quality controls for all topics with Protobuf schemas. Bad data is immediately rejected, so consumers can trust that the data they receive will always match the appropriate schema and adhere to any semantic constraints."
  - title: Fully air-gapped deployment
    details: Your data is your most valuable, sensitive asset — you should own it. Bufstream runs fully within your AWS or GCP VPC, without any dependencies on external services.
  - title: Field-level RBAC
    details: With Bufstream, you can enforce fine-grained access controls at the field level, ensuring that only the right people see the right data.
  - title: Simple Pricing
    details: "Bufstream pricing is simple and predictable: just $0.002 per uncompressed GiB written (about $2 per TiB). We don't charge any per-core, per-agent, or per-call fees."

---