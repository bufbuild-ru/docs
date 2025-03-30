---
layout: home

hero:
  name: "The real reason to use Protobuf is not performance"
---

The real reason to use Protobuf is not performance. Although fast serialization and small request/response payloads are certainly nice benefits that Protobuf happens to provide, they aren’t why Protobuf is so important. You should care about Protobuf because it’s the most widely-used and battle-tested _schema definition language_. Defining your APIs as programmatic schemas, and being able to share and use those schemas at both build-time and runtime, is where Protobuf really shines.

## Why schemas?

Before diving into further details on Protobuf, let’s take a step back to review the API landscape that most organizations are familiar with today. [The majority of APIs are still built around REST/JSON.](https://www.postman.com/state-of-api/api-technologies/#api-technologies) In practice, this means that most teams:

- Don’t have strongly typed definitions for their APIs, outside of fragile OpenAPI specs which do not enforce backward compatibility or consistent code generation
- Manually translate API specs into various languages for the server, web, iOS, and Android
- Implement tests using handwritten mocked data based on the original API specs
- Build their business logic on top of these APIs once they’re implemented

This approach poses several major challenges:

- **There is no single source of truth.** As teams across an organization continue to build new features and APIs to go along with them, these API definitions end up scattered across various locations and documents, making it difficult for engineers to understand what APIs are available and how clients are using them in practice. Understanding how a given API actually works requires tracking down its implementations across the backend and each client.
- **Implementing APIs is error-prone.** Without a way to automatically produce consistent APIs from a central definition, it’s easy for individual engineers to accidentally introduce implementation deviations across platforms—for example, spelling a field as `cancelation` on iOS and as `cancellation` on Android.
- **Hand-writing APIs is time consuming.** Shipping a new feature that spans web, iOS, and Android requires 4 different engineers to write very similar API code in each of their respective languages _in addition to_ the time spent authoring the original spec.
- **Evolving APIs over time can cause outages.** As product requirements change over time and development progresses, existing APIs usually need to be updated. Ensuring that these modifications are backward-compatible is not trivial, and accidentally making a breaking change (such as renaming a field, changing a field from a singular value to an array, or making a field optional) can cause deserialization failures on existing clients and trigger outages.
- **Sending schema-less events through data pipelines can break consumers.** Without strongly typed event definitions and build-time compatibility validation, it’s easy for event producers to send invalid data to downstream consumers and cause data loss or production downtime.

**Creating a strongly-typed source of truth for APIs using a _schema_ would not only provide a common ground for engineers to collaborate on APIs, but it could be used to generate code in-place of handwritten API implementations, and tooling could be created around it to prevent breaking changes.**

## Schema-driven development with Protobuf

At Buf, we’ve seen firsthand that teams who adopt a “schema-driven development” approach to building APIs—by defining APIs using a platform-neutral schema definition language such as Protobuf before implementing services and clients—not only boost engineering productivity significantly, but also reduce outages and increase developer happiness. With Protobuf and schema-driven development, teams:

- **Provide a standard for writing APIs across the organization using a common language.** Using Protobuf as a simple, canonical way to define APIs enables engineers on backend, frontend, and mobile to collaborate on APIs in a vernacular they all understand. Organizations can leverage Protobuf’s language features and tools like `buf lint` to standardize development practices across teams—something that is not possible with unstructured documents.
- **Unlock code generation across backend, frontend, and mobile.** Once schemas have been defined, engineers on each platform can generate strongly typed clients and service stubs in their respective native languages, eliminating the need to hand-write API boilerplate and guaranteeing that each implementation is identical to what’s defined in the schema.
- **Create one source of truth for APIs.** Since all services and clients derive from Protobuf definitions, these schemas become the canonical source of truth for the shape and behavior of APIs. Engineers seeking to understand how an API works need only to look at the Protobuf schema, rather than digging through each implementation.
- **Simplify testing.** Engineers can use generated data models and mock stubs to write tests using structured types without ever needing to manually define, serialize, or deserialize JSON dictionaries.
- **Establish a path to safe API evolution.** Protobuf’s strongly typed nature combined with the fact that it’s the source of truth for APIs across platforms unlocks the ability to use tools like `buf breaking` to verify that changes to the schema will not break existing clients, and to block those schemas from being merged to `main` and causing outages.
- **Guarantee that Kafka consumers always receive valid event data.** Defining events using Protobuf enables teams to enforce backward compatibility at build-time and prevent downstream consumers from ever receiving invalid events.

Notice that “reduce payload sizes by using Protobuf’s binary serialization” did not even make the list—it’s just the icing on the proverbial API development cake. **At the end of the day, Protobuf is about engineering productivity and system reliability. By using schema-driven development to define a source of truth for APIs, generate clients and services, and enable safe schema evolution, teams are able to save engineering hours and reduce outages.**

## Going beyond the basics with Buf

Our goal is to support organizations as they adopt and scale Protobuf, and we recommend taking a look at some of these tools if you’re just getting started:

- [Share schemas across services and maintain one source of truth for all your APIs with the Buf Schema Registry.](https://buf.build/solutions/share-schemas-across-repositories)
- [Eliminate breaking changes with Buf’s governance workflow.](https://buf.build/solutions/prevent-breaking-changes)
- [Explore the open-source Connect libraries for a simpler, JSON-compatible alternative to gRPC.](http://connectrpc.com/)
- [Automatically translate between REST/JSON, gRPC, and Connect in your edge gateway.](https://buf.build/solutions/govern-apis-at-the-edge)
- [Improve data quality in your Kafka pipelines with our Confluent integration.](https://buf.build/solutions/protobuf-kafka)

If you’d like to discuss your existing API setup or have any other questions, please join us in the [Buf Slack](https://buf.build/b/slack/)!

‍
