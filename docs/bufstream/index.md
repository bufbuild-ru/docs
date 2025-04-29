---

title: "Overview - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/"
  - - meta
    - property: "og:title"
      content: "Overview - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/"
  - - meta
    - property: "twitter:title"
      content: "Overview - Buf Docs"

---

# Bufstream

Bufstream is the Kafka-compatible message queue built for the data lakehouse era. It's a drop-in replacement for Apache Kafka®, but instead of requiring expensive machines with large attached disks, Bufstream builds on top of off-the-shelf technologies such as S3 and Postgres to provide a Kafka implementation that is built for 2025.

## As a pure Kafka replacement

As compared to Apache Kafka, Bufstream:

- Is **[8x less expensive to operate](cost/)**, including Buf's licensing fees.
- Scales throughput from zero to **100s of GB/s in a single cluster** with no fuss with virtually zero maintenance.
- Is **active-active**: Bufstream brokers are **leaderless**. Writes can happen to any broker in any zone, reducing networking fees. For GCP clusters, writes can happen to any broker in **multiple regions** without significantly affecting cost characteristics.

Bufstream is best-in-class of a new wave of object-store-based Kafka implementations that have come to market promising lower costs. As opposed to WarpStream, StreamNative Ursa, Confluent Freight, and others, Bufstream:

- Can be **completely self-hosted**, just like Apache Kafka. Bufstream deployments do not talk to Buf the company in any way - we can even eliminate phone homes for billing! Competitors are either managed, or merely provide the ability for your data to be self-hosted while still-sensitive metadata continues to be sent back to their respective companies.
- Is based completely on off-the-shelf primitives that can be deployed in all major clouds: **AWS, GCP, and Azure**. Bufstream needs a metadata store (Etcd, Postgres, Google Cloud Spanner, Aurora) and an object store (S3, GCS, Azure Blob Storage), and is otherwise off to the races. Deploying Bufstream is as simple as deploying a Helm chart. No bespoke, untested infrastructure to maintain.
- Has undergone extensive correctness testing, including **[independent verification by Jepsen](https://jepsen.io/analyses/bufstream-0.1.0)**. You shouldn't just take our word that Bufstream is production-ready, and we've invested the resources to make sure the best in the business agree with Bufstream's performance under pressure.
- Has the lowest cost and latency characteristics. While benchmarks can be massaged, we are confident after extensive testing that Bufstream leads the bunch.

Bufstream is the only enterprise-ready new-age Kafka implementation available today that is verified to be able to handle your production workloads.

## First-class schema support

Bufstream is already the best in the business for your pure Kafka needs. However, if you send Protobuf payloads over Kafka, Bufstream is so much more.Bufstream offers **first-class schema support on the broker-side**. When paired with a schema registry that implements the Confluent Schema Registry API (such as the [BSR](../bsr/), or the Confluent Schema Registry itself), Bufstream's brokers deeply understand your Protobuf payloads.

### Broker-side schema awareness

In traditional Kafka, brokers are simple data pipes; brokers have no understanding of what data traverses them. This simplicity helped Kafka gain ubiquity, however in practice, most data that is sent through Kafka topics has some schema that represents it. Understanding the schema of the payloads is critical to ensuring data quality. Unfortunately, in the Kafka ecosystem, this job is precariously left to clients, bolted on as an afterthought to an ecosystem not designed to understand schemas in the first place.We think this is a broken model:

- Your producer's client should be extremely simple: just post a raw message to your Kafka topic, and let the broker deal with the rest. By forcing clients to understand your schemas, you're requiring the ecosystem to maintain fat, hard-to-maintain Kafka clients across many languages. Their complexity means that language support suffers.
- Systems should never rely on client-side enforcement! Client-side enforcement is in effect "opt-in" enforcement. Producers can choose to do it or not, meaning you have no guarantees as to the quality of data sent to your consumers.

Bufstream aims to flip the script. Instead, Bufstream brokers are schema-aware. Bufstream directly connects to your schema registry to understand the shape of your data across your topics.

### Kafka for the modern age

Broker-side schema-awareness lets Bufstream provide some unique capabilities:

- **Schema Enforcement**: Bufstream brokers can enforce that your payloads match the schemas associated with your topics. If schema enforcement fails, records are rejected at the producer, resulting in data never making it to your consumers in the first place.
- **Automatic Enveloping** When sent raw payloads, Bufstream can provide automatic enveloping on the broker, wrapping your payloads with a Confluent schema ID in the format expected by much of the Kafka ecosystem, including [Kafka Connect](https://docs.confluent.io/platform/current/connect/index.html), [AKHQ](https://akhq.io/), [kSQLdb](https://ksqldb.io/), and [Snowflake's Kafka Connector](https://docs.confluent.io/cloud/current/connectors/cc-snowflake-sink/cc-snowflake-sink.html#schema-config).
- **Semantic Validation**: Merely enforcing that your payloads match the expected shapes is rarely enough. Fields have properties; you may want to make sure an `int` field is always between 0 and 100, or you may want to make sure that a `string` field always matches a regex or represents a valid email address. Bufstream pairs with [Protovalidate](https://github.com/bufbuild/protovalidate) to provide semantic validation of your fields on the fly. Semantic validation extends schema enforcement to provide **robust data quality guarantees never before seen in the Kafka ecosystem**; your consumers can be confident that the data they process conforms to properties they expect.
- **Directly write [Apache Iceberg™](https://iceberg.apache.org/) tables to S3** or any S3-compatible object storage: Since Bufstream understands the shape of your data and stores its own data in S3-compatible storage, Bufstream can persist records in S3 as Iceberg tables as it receives them, making them ready for consumption by your compute engine of choice. This is transformative; instead of setting up a separate, expensive ETL pipeline to consume your records and produce separate Iceberg tables with extra storage, Bufstream takes care of this process on the fly. In effect, by saving the additional data copy, Bufstream **effectively eliminates the cost of Kafka storage**. Bufstream eliminates any effect of such ETL pipelines on your time-to-insight.

## Take the next step

We're excited to bring Bufstream to the streaming data ecosystem. If these capabilities excite you, we'd suggest:

- [Trying the quickstart](quickstart/): It provides an interactive overview of what we've discussed, from using basic Kafka tools to the schema-aware specialties that make Bufstream shine.
- Following us on [LinkedIn](https://linkedin.com/company/bufbuild) and [Twitter](https://twitter.com/bufbuild) to get the latest updates.
- [Getting in touch](../contact/): We'd love to try to win your business.
