---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/csr/overview/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/policy-checks/uniqueness/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/csr/manage-instances/"
  - - meta
    - property: "og:title"
      content: "Overview - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/csr/overview.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/csr/overview/"
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
      content: "Overview - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/csr/overview.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Confluent Schema Registry integration overview

::: warning
This feature is only available on the Enterprise plan.
:::

The Buf Schema Registry (BSR) includes a Protobuf-first implementation of the Confluent Schema Registry ([CSR](https://docs.confluent.io/platform/current/schema-registry/index.html)) APIs. It's designed to strengthen your streaming data quality where it helps the most — at build time, and at the source of truth for your schemas. Because the BSR implements the entirety of the CSR API, you can take advantage of the Confluent ecosystem, including stream processing systems like kSQL and Kafka Connect, without the risk of runtime errors.

- Creating a CSR instance is a 1-step process, and instances can be easily managed by your BSR admins.
- The BSR maps Confluent subjects to messages in your schema with straightforward annotations — no migration or conversion to other schema formats required. It brings the breadth and power of the Confluent ecosystem into your existing BSR workflow.
- In addition to other breaking change checks, the BSR checks schemas for [backwards compatibility](#compatibility) with CSR subjects when publishing to the BSR, ensuring that only safe and approved changes flow downstream.
- The CSR integration works with any Confluent-compatible Kafka client, downstream systems like kSQL and Kafka Connect, and management tools like AKHQ, making all the capabilities of the Confluent ecosystem available to your organization.

## Getting started

Taking advantage of Buf's CSR implementation has three overall steps:

1.  Go to the BSR and [create your CSR instance](../manage-instances/).
2.  Associate your schemas with Confluent subjects by integrating the [bufbuild/confluent](https://buf.build/bufbuild/confluent) managed module and annotating your Protobuf messages (see [Manage schemas](../manage-schemas/) for detailed steps):

    ```protobuf{5,15,16,17,18}
    syntax = "proto3"

    package demo.analytics;

    import "buf/confluent/v1/extensions.proto";
    import "google/protobuf/timestamp.proto";

    message EmailUpdated {
      google.protobuf.Timestamp updated_at = 1;
      fixed64 user_id = 2;
      string previous_email = 3;
      string new_email = 4;
      bool new_email_verified = 5;

      option (buf.confluent.v1.subject) = {
        instance_name: "default",
        name: "email-updated-value",
      };
    }
    ```

3.  Push the annotated `.proto` files to the BSR. Buf's breaking change detection validates the annotated schemas and sends them to the [review flow](../../policy-checks/breaking/review-commits/) if they're not backward compatible.

Once the push that includes the subject mapping is successful, the Confluent integration automatically creates a subject associated with the message on your CSR instance. For example, the example `.proto` file above creates a subject named `email-updated-value` associated with the `demo.analytics.EmailUpdated` message on the `default` CSR instance.Because subjects are defined in your schemas, you're able to view, code review, and manage them the way you do any other source code. In the BSR, you could view the subject above at:`https://buf.example.com/integrations/confluent/default/subjects/email-updated-value/versions/latest`After you create the subject, you use the CSR URL and a Buf token to configure Confluent-aware Kafka producers and consumers to serialize and deserialize the topics defined in your Protobuf schemas. See [Integrating with Kafka clients](../kafka-clients/) for examples.

## Integration with breaking change detection

To preserve compatibility with previous schema versions, the BSR enforces that any changes to a Confluent Schema Registry subject don't introduce a breaking change without being reviewed. The CSR integration works with Buf's breaking change detection and [policy check](../../policy-checks/breaking/overview/) to ensure backwards compatibility and identify problems early in your development cycle:

- Developers can enable one of [Buf's editor plugins](../../../cli/editor-integration/) to enforce formatting, linting, and breaking change rules locally and test as they're building schemas. Buf's `FILE` setting for breaking change detection detects all breakages relevant to Kafka.
- Your organization can hook into [Buf's GitHub Actions](../../ci-cd/github-actions/) to enforce breaking change detection before schemas containing subjects are merged into the default label and registered in the BSR. Again, Buf's `FILE`\-level breaking change detection guarantees that changes are safe for Kafka.

### CSR policy check

With the CSR integration enabled, on `buf push` to the default label, the BSR checks that any changes to a subject don't introduce breaking changes to that subject's schema. The CSR policy check occurs whether or not other policy checks are enabled, and is enforced on Protobuf files that include CSR subjects and their dependencies. It checks against a special subset of [Buf breaking change rules](../../../breaking/rules/) that address CSR concerns:

- The entire `WIRE_JSON` category
- Relevant rules from the `FILE` category:
- `WIRE_JSON`
- `ENUM_NO_DELETE`
- `ENUM_VALUE_NO_DELETE`
- `EXTENSION_MESSAGE_NO_DELETE`
- `FILE_NO_DELETE`
- `FIELD_NO_DELETE`
- `FIELD_SAME_TYPE`
- `FILE_SAME_SYNTAX`
- `MESSAGE_NO_DELETE`
- `MESSAGE_NO_REMOVE_STANDARD_DESCRIPTOR_ACCESSOR`
- `ONEOF_NO_DELETE`

When the CSR policy check finds a breaking change, it puts the breaking commit into the [policy check review flow](../../policy-checks/breaking/review-commits/), which requires it to be manually approved before it's published.

```
sequenceDiagram
    participant User
    box CSR instance lives inside the BSR
    participant BSR
    participant CSR
    end
    Note over BSR: Typical push flow
    User->>BSR: buf push
    BSR->>CSR: Update subjects
    Note over CSR: Detect subjects<br>& check compatibility
    alt Breaking changes
        CSR->>BSR: Review flow
        alt Reviewer approves
            BSR->>CSR: Change compatibility mode
            Note over CSR: Register new schemas<br>& link to subjects
            CSR->>BSR: OK
            BSR->>User: OK
        else Reviewer rejects
            BSR->>User: ERROR
        end
    else No breaking changes
        Note over CSR: Register new schemas<br>& link to subjects
        CSR->>BSR: OK
        BSR->>User: OK
    end
```

### Backwards compatibility modes

All Confluent subjects start with the compatibility mode of the [CSR instance](../manage-instances/) they belong to. The default compatibility mode of instances when created is `BACKWARD_TRANSITIVE`, meaning that each subject in that instance is backwards-compatible across all past versions of that subject.

- If the reviewer rejects the commit, the BSR blocks the breaking change and the subject's compatibility mode remains `BACKWARD_TRANSITIVE`. The commit must be reverted or fixed for any new schema change to be available to the CSR or other downstream systems.
- If the reviewer approves the commit, they must choose a new compatibility mode for each affected CSR subject to deal with the breaking change:
  - `BACKWARD`: **Default and recommended.** Enforces the schema's backwards compatibility against the latest BSR version on the default label. This _may_ break both existing producers using old versions of that subject's schemas, and existing consumers in general.
  - `NONE`: No compatibility checks are performed on the schema. This won't break producers, but _may_ break consumers as bad data can enter the pipeline. This setting is only useful if you're actively developing a schema, expect a lot of breaking changes, and don't want this check to block them — ideally you have no consumers yet at that point.

Once approved, the BSR publishes a one-time update for the affected subjects without doing compatibility checks and sets their mode to the reviewer's selection. Future pushes to the subjects apply compatibility checks based on their new mode. A CSR subject that has had a breaking change approved can never return to the `BACKWARD_TRANSITIVE` mode.

## Next steps

- [Create a CSR instance](../manage-instances/)
- [Manage schemas](../manage-schemas/)
- [Integrating with Kafka clients](../kafka-clients/)
