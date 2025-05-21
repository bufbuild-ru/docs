---
description: "Validate and transform messages with Bufstream"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/data-governance/semantic-validation/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bufstream/data-governance/schema-enforcement/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bufstream/iceberg/"
  - - meta
    - property: "og:title"
      content: "Semantic validation - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/data-governance/semantic-validation.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/data-governance/semantic-validation/"
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
      content: "Semantic validation - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/data-governance/semantic-validation.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Semantic validation

## What is semantic validation?

Bufstream's [schema enforcement](../schema-enforcement/) ensures that messages match the expected schema. This is valuable but shallow: it can only verify that each field of a message has the correct data type. For example, it might verify that a user's age is an unsigned integer. Semantic validation builds on that foundation and inspects messages more deeply, ensuring that they're meaningful within the problem domain. For example, it might verify that a user's age is between 0 and 120.

In addition to schema enforcement, Bufstream supports semantic validation of binary Protobuf messages whose schemas use [Protovalidate](../../../protovalidate/) annotations. Coupled with schema enforcement, this guarantees that consumers receive the highest-quality data possible.

Because it requires the message schema, semantic validation requires the Buf Schema Registry (or any other Protobuf registry that supports Confluent's REST API). To associate Protobuf schemas with a Kafka topic in the Buf Schema Registry, follow [the documentation for integrating the BSR with Kafka](../../../bsr/csr/).

## Adding semantic validation to Protobuf schemas

Protovalidate supports a wide variety of predefined rules, from requiring that numbers fall within a predefined range to requiring that strings match a regular expression. Using custom expressions written in Google's [Common Expression Language](https://cel.dev/), validation rules can also compare multiple fields. Critically, Protovalidate doesn't require code generation — so Bufstream can easily check for semantic validity on the fly.

As an example, the schema below validates that the user's email is actually an email address:

For more information on Protovalidate, check the [documentation](../../../protovalidate/).

## Enabling semantic validation in Bufstream

To enable semantic validation, add a `validation` block to a policy configured in your Helm values file. For example, this Helm values snippet automatically envelopes incoming messages, verifies that the message matches the schema, and then verifies that the message is semantically valid.

```yaml
produce:
  - topics: { all: true }
    schema_registry: csr
    values:
      coerce: true
      on_parse_error: REJECT_BATCH
      validation:
        on_error: REJECT_BATCH
```
