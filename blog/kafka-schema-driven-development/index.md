---
sidebar: false
prev: false
next: false

title: "Cheap Kafka is cool. Schema-driven development with Kafka is cooler."
description: "If you're looking for a modern drop-in replacement for Apache Kafka to save costs and complexity, Bufstream is probably your best bet. However, we've got a bigger mission here. Buf wants to bring schema-driven development across your entire stack, from your network APIs, to your streaming data, to your lakehouse, unified behind one schema language that can do it all."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/kafka-schema-driven-development"
  - - meta
    - property: "og:title"
      content: "Cheap Kafka is cool. Schema-driven development with Kafka is cooler."
  - - meta
    - property: "og:description"
      content: "If you're looking for a modern drop-in replacement for Apache Kafka to save costs and complexity, Bufstream is probably your best bet. However, we've got a bigger mission here. Buf wants to bring schema-driven development across your entire stack, from your network APIs, to your streaming data, to your lakehouse, unified behind one schema language that can do it all."
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6814f0e6b837ec79da2e3819_Cooler.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Cheap Kafka is cool. Schema-driven development with Kafka is cooler."
  - - meta
    - property: "twitter:description"
      content: "If you're looking for a modern drop-in replacement for Apache Kafka to save costs and complexity, Bufstream is probably your best bet. However, we've got a bigger mission here. Buf wants to bring schema-driven development across your entire stack, from your network APIs, to your streaming data, to your lakehouse, unified behind one schema language that can do it all."
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6814f0e6b837ec79da2e3819_Cooler.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Cheap Kafka is cool. Schema-driven development with Kafka is cooler.

We've been hard at work on [Bufstream](/docs/bufstream/index.md), our drop-in replacement for Apache Kafka® rebuilt on top of S3-compatible object storage. It's one of the new breed of object-storage-based Kafka replacements, which seem to have become a dime a dozen. WarpStream kicked off the race in 2023, quickly followed by Bufstream, StreamNative Ursa, and Confluent Freight. In the coming months, even Redpanda is finally getting into the game, and there's a proposal to add support for object storage to Apache Kafka itself in the coming years.

Why the surge? The pitch is simple: S3 replicates across availability zones for free. By using S3 as your backing store for your topics, you can eliminate associated inter-zone networking costs, massively reducing your Kafka spend. The trade-off is latency: S3 is slower than local disks, and most object-storage-based Kafka replacements will have a p99 end-to-end latency in the 500-1000ms range. If you can tolerate this (as almost all Kafka users can), then save the money. Along the way, benefit from a leaderless broker design: write any partition to any broker.

If you're interested in these cost savings, we're convinced that Bufstream is (by far) your best option. [We're happy to chat more](https://buf.build/contact), but here's the bullet points:

- **Cost**: If you're just looking to save Kafka costs, Bufstream beats its competition across almost any workload, sometimes by a lot. We'll do a deep dive on this in a future post.
- **Security**: Unlike Bufstream's competition, Bufstream deployments are completely self-hosted. We don't need to jump through any hoops to explain what BYOC is and isn't; Bufstream is entirely deployed within your VPC. Metadata is sensitive data, and we don't want to have access to yours.
- **Simplicity**: Unlike Apache Kafka, Bufstream is as simple to deploy and maintain as a web app. It autoscales from 0 all to way to [100 GiB/s of writes](/blog/bufstream-on-spanner/index.md) with no operator intervention. Under the hood, Bufstream is just a simple binary, which you can also run on your local machine.
- **Reliability**: Bufstream is solely built on widely-used and stable cloud technologies, leaving nothing to chance in production environments. Bufstream's only dependencies are an object store (S3, GCS, or Azure Blob Storage) and an off-the-shelf metadata store (Postgres, Etcd, or Google Cloud Spanner). Bufstream's competition uses proprietary or vendor-managed metadata stores of unknown quality.
- **Correctness**: As of this post, Bufstream is the only object-storage-based Kafka replacement that has been [independently verified for correctness by Jepsen](/blog/bufstream-jepsen-report/index.md). We invest heavily in correctness testing; no message queue deployed in production should be left to chance. Bufstream was the first object-storage based Kafka implementation to support transactions and exactly-once semantics, and the only one to be adequately tested.

If you're looking for a modern drop-in replacement for Apache Kafka to save costs and complexity, Bufstream is probably your best bet. We're happy to go head-to-head against any competitor, and we're confident we can win your business (candidly, in head-to-head POCs with our competitors, we usually do). We're proud of what we've built, but cost savings are generally a race to the bottom, and are not why we got into the Kafka game. We've got a bigger mission here, one that leads us back to where Buf started.

## A new world: one schema language to rule them all

At Buf, we're driving a shift towards universal schema adoption, a world where you:

- Stop sending freeform JSON around and adopt [schema-driven development](/blog/api-design-is-stuck-in-the-past/index.md). Your data should be governed by schemas.
- Never have to make a compromise between using schemas and getting things done. Most of your data can be described by a schema; using a schema language to describe it should make your life easier, not harder.
- Choose one schema language to define your schemas across your entire stack, from your network APIs, to your streaming data, to your data lake.
- Make sure your schemas never break compatibility, and verify this as part of your build.
- Enrich your schemas with every property required to truly understand the data they encapsulate, from [semantic properties](/docs/protovalidate/index.md) to access control.
- Ensure these properties are inherited as your data is transformed between different schemas.
- Make sure every component of your stack understands your schemas and their properties.
- Enforce these properties on your data as close to your source as they can.

Engineers shouldn't have to define their network APIs in OpenAPI or Protobuf, their streaming data types in Avro, and their data lake schemas in SQL. Engineers should be able to represent every property they care about directly on their schema, and have these properties propagated throughout their RPC framework, streaming data platform, and data lake tables.

A unified schema approach can dramatically reshape data engineering:

- Schema-driven development adopted across your entire stack would eliminate so much boilerplate that engineers would have to find new (and better) uses of their time.
- If schemas defined more than just basic properties ("this field is a string", "this field is an int") but semantic properties ("this string field must be a valid email address", "this int field is a human age and must be between 0 and 150", "this other int field must never be 0", "if field 1 exists, field 2 must exist"), we could have confidence that additional application-level logic was not needed to truly represent the shape of our data.
- If a single schema language were used to describe your network, application, and data shapes, producers could define the data's properties and make sure data sent downstream conforms to those properties. The closer to the data source you go, the better the understanding of what the shape and properties of the data is. Bad data could be stopped at the source. Patterns like the [medallion architecture](https://www.databricks.com/glossary/medallion-architecture) could go from mainstream to niche.
- If schemas never broke compatibility, consumers would never have to live in fear of whether the data they're consuming continues to match their expectations. BI dashboards or model training would not end up broken days after the fact due to missing columns (and the Kafka team would not get falsely blamed).
- If access control could be defined at the schema level, and understood by our RPC frameworks, Kafka-compatible message queues, and data lakes, we could have a unified view and understanding of data governance.

The largest data engineering pain point — poor data quality — can be solved, transitioning from perpetual cleanup to consistently trusted data. Data engineers can stop being data quality QA personnel and get back to their jobs.

## We think that schema language should be Protobuf

While what specific schema language is chosen is somewhat unimportant in theory, at Buf, we think it should be [Protobuf](https://protobuf.dev/):

- [Avro](https://avro.apache.org/) has a lot of similarities, but falls short as a schema language to use across your entire stack. Avro's adoption has largely been limited to big data. Importantly, because of quirks in how Avro's binary format works, there are very few schema changes that are backward and forward compatible. In practice, a reader will be unable to reliably decode an Avro message without access to the exact version of the schema used to write it. This makes Avro largely impractical for network APIs, and no production-grade RPC framework using Avro has ever been widely adopted. Additionally, tooling is heavily focused on the JVM.
- JSON is a universal language that is useful as a human-readable representation of your data, but is inefficient as an interchange format, since every key is consistently duplicated across messages as a long-form string. This is especially problematic for high-throughput streaming data use cases. While tools like [JSON Schema](https://json-schema.org/) help solve the inherent freeform nature of JSON interchange, JSON's drawbacks make JSON Schema fall short as a modern schema language.
- SQL has in effect become a schema language of sorts for data lakes via `CREATE TABLE` statements. Given SQL's widespread use in big data, this is useful at one end of the spectrum. However, SQL is not a schema language appropriate for all parts of your stack; you'd never use `CREATE TABLE` statements to describe the shape of your RPCs and there's no tooling to do so. SQL just isn't great for structured data: nested types and lists need to be projected into sub-tables, and the mapping to language-specific objects or structs is less than obvious.
- Other Protobuf-like products like [Apache Thrift™](https://thrift.apache.org/), [Cap'n Proto](https://capnproto.org/), [Flatbuffers](https://flatbuffers.dev/), and many others all have their pros and cons, but in the end, they aren't widely differentiated and aren't widely used.

While Protobuf is far from perfect, Protobuf is the most battle-tested, widely-used schema language in existence today. If you're looking to use a schema language anywhere across your stack and in any language, there's probably a Protobuf library you can use (and [we](https://github.com/bufbuild/protobuf-es) [may](https://connectrpc.com/) [have](https://github.com/bufbuild/protovalidate) [written](https://github.com/bufbuild/protoyaml-go) [it](https://github.com/bufbuild/protocompile)). Protobuf also has a well-defined [JSON mapping](https://protobuf.dev/programming-guides/json), which remains critical for human introspection and migratory use cases.

The world has moved to Protobuf in the last decade, and that transition doesn't look to be slowing down.

## Buf has been working to make Protobuf accessible for over half a decade

Adopting schemas across your stack has historically been a story of fragmentation and frustration. You'd have to use different schema languages at different parts of your stack. REST/JSON dominated the network API space, and fighting against the tide had a huge cost. With the rise of [gRPC](https://grpc.io/), Protobuf became the clear alternative by the late 2010s, however Protobuf development left a lot to be desired. To effectively adopt Protobuf, you'd have to solve compilation, stub generation, distribution, enforcement of common standards, breaking change prevention, documentation, and the list goes on. At best, you'd get CLI tooling seemingly designed in 1970, and perhaps a little bit of documentation. Early adopters had to cobble together patchwork solutions to these problems, which rarely rose to the challenge.

Buf brought together the world's Protobuf experts to solve this once and for all:

- The [Buf CLI](https://github.com/bufbuild/buf) integrates tightly with your [IDE](/docs/cli/editor-integration/index.md) to make local Protobuf development easy. Compilation, stub generation, breaking change detection, linting, formatting, encoding conversion – `buf` is your one-stop shop for anything Protobuf. The Buf CLI has become the de facto standard for local Protobuf development across the industry.
- The [Buf Schema Registry](https://buf.build/product/bsr) is the missing package manager for Protobuf. The BSR provides centralized distribution of your Protobuf APIs, generated SDKs that can be consumed via the native [language package manager](https://buf.build/bufbuild/registry/sdks/main:protobuf) of your choice, generated documentation, plugin management, and breaking change and policy enforcement that is required for proper schema governance. The largest companies in the world rely on the BSR to back their Protobuf deployments.
- [ConnectRPC](https://connectrpc.com/) brings to Protobuf an RPC framework that simply works across backend, frontend, and mobile use cases. It's entirely gRPC-compatible (in fact it's even more compatible with the gRPC spec than [the core gRPC libraries](/blog/grpc-conformance-deep-dive/index.md)) but provides HTTP/1.1 and JSON compatibility where it matters. Implementations are based on the concept of production-grade through simplicity. Connect has [joined the CNCF](/blog/connect-rpc-joins-cncf/index.md) as a vendor-neutral home, and has been adopted by many large organizations.
- [Protovalidate](/docs/protovalidate/index.md) provides the semantic validation libraries required to properly represent your data's properties beyond simple field types. It builds on the success of the widely-adopted [protoc-gen-validate](/blog/protoc-gen-validate-v1-and-v2/index.md), which Buf was asked to take over from the Envoy project. Protovalidate uses [CEL](https://cel.dev/) to provide proper Protobuf validation across [Go](https://github.com/bufbuild/protovalidate-go), [Python](https://github.com/bufbuild/protovalidate-python), [Java](https://github.com/bufbuild/protovalidate-java), [C++](https://github.com/bufbuild/protovalidate-cc), and [TypeScript](https://github.com/bufbuild/protovalidate-es).
- [Bazel rules](https://github.com/bufbuild/rules_buf), [Gradle support](https://github.com/bufbuild/buf-gradle-plugin), [a modern Protobuf compiler](https://github.com/bufbuild/protocompile), [LSP support](https://github.com/bufbuild/buf/releases/tag/v1.43.0), even the world's only [language spec for Protobuf](https://protobuf.com/docs/language-spec).

All built at Buf, to make Protobuf work for everyone.

## Streaming data has a data problem

So where does Bufstream fit in?

Streaming data has a major problem with data quality, namely we have no guarantees of the quality of data being produced. This comes down to typical streaming data architecture. In traditional Kafka, brokers are simple data pipes; brokers have no understanding of what data traverses them. This simplicity helped Kafka gain ubiquity, however in practice, most data that is sent through Kafka topics has some schema that represents it.

Unfortunately, in the Kafka ecosystem, schema validation is precariously left to clients, bolted on as an afterthought to an ecosystem not designed to understand schemas in the first place. Client-side enforcement is in effect "opt-in" enforcement. Producers can choose to do it or not, meaning you have no guarantees as to the quality of data sent to your consumers. This is a state of the world we'd never accept in i.e. network APIs – imagine if your application servers relied on your web clients to validate their data and your applications persisted whatever they were given – we'd all be in trouble!

Bufstream is more than just a drop-in Kafka replacement. Bufstream is built from the ground up to understand the shape of the data traversing it's topics. We call this **broker-side schema awareness**, and it brings some interesting capabilities. Chief among these is its ability to block bad data from entering topics in the first place.

Bufstream provides **governed topics** that enable semantic validation via Protovalidate on the producer API. If a record is produced with a message that doesn't pass validation, the entire batch is rejected or the offending record is sent to a DLQ. Importantly, since this happens on the broker, consumers can rely on the knowledge that data within topics always matches its stated constraints.

It's a tale as old as time: a required field is zeroed out, or some data is corrupted, and a downstream business intelligence dashboard is subtly wrong for days. The maintainer eventually realizes, and yells at the Kafka team for their data quality issues. The Kafka team, however, had nothing to do with it – they don't control the producers of the data. Everyone scrambles to find the lineage of the bad data until order is restored. Bufstream solves this once and for all: this tale is a thing of the past with broker-side semantic validation.

Bufstream's awareness of your schemas provides so much more, from direct mapping to Iceberg tables with zero copies ([your Iceberg tables are your Kafka storage](https://vutr.substack.com/p/bufstream-stream-kafka-messages-to)), to a type-safe transformation engine that's dramatically more performant than any stream data processor in existence. We'll cover these in specific blog posts in the future.

## Schema governance is just as important as data quality

It isn't enough to ensure that bad data for your current schemas doesn't proliferate. You also need to ensure that bad schema changes don't make it to production either. Deleting fields, changing their type, or adding backwards-incompatible semantic properties all can result in downstream consumers being hopelessly broken without any recourse. In almost all cases, breaking schema changes should never hit your network APIs, Kafka topics, or Iceberg tables, until you do a proper v2.

Consumers need the confidence that producers will never break their schemas until v2 (usually, in an entirely new topic or table), but current practices do not incentivize proper schema management and evolution. Schemas are typically shared via a schema registry, such as the Confluent Schema Registry or Glue Schema Registry. Unfortunately, new schemas are registered with these schema registries at **runtime** via **clients** that provide whatever schemas are baked into their code. These schemas have no guarantee of compatibility or having gone through proper review – they could even appear from dev laptops from code on feature branches in the worst case.

Here's a typical flow for a producer using the Confluent Schema Registry (CSR):

- A client wants to produce a new record that has a given associated schema.
- The client would like this record to be enveloped using the [Confluent Wire Format](https://docs.confluent.io/platform/current/schema-registry/fundamentals/serdes-develop/index.html#wire-format), requiring a schema ID to be retrieved for the schema from the CSR.
- The client sends its representation of the schema to the CSR.
- If the CSR has seen this schema before, great, it will send back the associated schema ID.
- If the CSR has not seen this schema before and this schema breaks what CSR considers to be compatible, great (sort of), the CSR will send back an error.
- If the CSR has not seen this schema before but deems it to be compatible, it will send back a new schema ID representing this previously-unknown schema.

This is a recipe for disaster. The CSR's checks for compatibility are basic, and don't take semantic properties into account. For Protobuf, the CSR doesn't check all properties that must be checked to ensure true Protobuf compatibility (a fact we'll dive into in a future post). Schemas can appear at runtime without any vetting.

Buf introduces a different world with the Buf Schema Registry (BSR). Schemas cannot appear out of thin air, instead only being allowed to appear at **build-time** via explicit pushes from source control after passing stringent breaking change and policy checks. Buf will check not only basic properties, but semantic properties as well via Protovalidate. And Buf has the world's Protobuf experts – when we validate that your schemas have no breaking changes, [we mean it](/docs/breaking/rules/index.md). Schemas are code reviewed by relevant teams, just like any other piece of code. In the same flow as above:

- If the BSR has seen this schema before, great, it will send back the associated schema ID.
- If the BSR has not seen this schema before , the BSR will send back an error, end of story.

Without this proper schema governance, there can be no confidence in the underlying data traversing your systems, and consumers have to stay on their toes.

## Buf brings it all together

Buf brings a holistic approach to this problem. We're making it possible to use a single schema language across your entire stack with ease. Given the following Protobuf message:

```protobuf
message User {
  option (buf.kafka.v1.topic) = "user-created";
  option (buf.kafka.v1.topic) = "user-updated";

  option (buf.validate.message).cel = {
    expression: "!has(this.first_name) || has(this.last_name)"
  };

  string id = 1 [
    (buf.validate.field).string.uuid = true,
    (acme.option.v1.safe_for_ai) = true
  ];
  string handle = 2 [
    (buf.validate.field).string.min_len = 1,
    (buf.validate.field).string.max_len = 64,
    (acme.option.v1.safe_for_ai) = true
  ];
  string first_name = 3 [
    (buf.validate.field).string.min_len = 1,
    (buf.validate.field).string.max_len = 64,
    (buf.rbac.v1.field).role = "pii",
    (acme.option.v1.safe_for_ai) = false
  ];
  string last_name = 4 [
    (buf.validate.field).string.min_len = 1,
    (buf.validate.field).string.max_len = 64,
    (buf.rbac.v1.field).role = "pii",
    (acme.option.v1.safe_for_ai) = false
  ];
  string email = 5 [
    (buf.validate.field).required = true,
    (buf.validate.field).string.email = true,
    (buf.rbac.v1.field).role = "pii",
    (acme.option.v1.safe_for_ai) = false
  ];
  uint32 age = 6 [
    (buf.validate.field).uint32.lte = 150,
    (buf.rbac.v1.field).role = "pii",
    (acme.option.v1.safe_for_ai) = true
  ];
}
```

You should be able to:

- Evolve `User` safely and easily in your IDE of choice, using Buf's tools to enforce that changes to `User` comply with your style guide and policies. For example, you may want to make sure that every field has a `safe_for_ai` annotation, noting whether or not it is safe to train AI models on this field.
- As part of CI, check that changes to `User` do not introduce any breaking changes or policy violations. Bad changes to `User` will be blocked at build-time, and never allowed to propagate to generated code, Kafka topics, or data lakes.
- Allow clients to consume generated code for `User` in [any language](https://buf.build/bufbuild/registry/sdks/main:protobuf) without needing to understand Protobuf or its toolchain.
- Prevent malformed `Users` from ever making it down your stack via Protovalidate. Your RPC framework should have interceptors at the application layer to enforce the properties of `Users`, and your Kafka-compatible message queue should either reject malformed `Users` via the Producer API, or send them to a DLQ. No bad data should ever again enter your topics or data lake.
- Store all `Users` produced to the `user-created` and `user-updated` Kafka topics into Iceberg tables in your data lake to be queried within seconds of production, while paying only once for both Kafka and data lake storage. Consumers of your Iceberg tables can be confident that the data they consume will always be correct, and the backing schema will never be broken.
- Mask out all PII fields for **clients of your networks APIs, consumers of your Kafka topics, and users of your data lake tables** for those without PII access. Your RPC framework, Kafka-compatible message queue, and data lake of choice should all understand the RBAC annotations from your single schema language, and these annotations should be propagated. Kafka should automatically apply masking via the Consumer API, and Iceberg tables read into Snowflake or Databricks should take RBAC annotations into account via [Snowflake column-level security](https://docs.snowflake.com/en/user-guide/security-column-intro) or [Databricks column masks](https://docs.databricks.com/aws/en/tables/row-and-column-filters#what-are-column-masks).

And so much more. If this is a world that interests you, [get in touch](https://buf.build/contact), we'd love to get to work.

‍
