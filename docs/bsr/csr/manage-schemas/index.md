---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/csr/manage-schemas/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/csr/manage-instances/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/csr/kafka-clients/"
  - - meta
    - property: "og:title"
      content: "Manage schemas - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/csr/manage-schemas.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/csr/manage-schemas/"
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
      content: "Manage schemas - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/csr/manage-schemas.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Manage schemas

::: warning
This feature is only available on the Enterprise plan.
:::

In the Confluent ecosystem, schemas are associated with data via [_subjects_](https://docs.confluent.io/platform/current/schema-registry/fundamentals/index.html#schemas-subjects-and-topics), which are typically derived from a Kafka topic's name. For example, the default strategy, _TopicNameStrategy_, suffixes the topic name with `-value`.

## Register schemas

You create subjects within the BSR's Confluent Schema Registry by annotating messages with a custom option that identifies the instance and subject name.

The subject is claimed by the module that contains the annotated message, preventing use of that subject by other modules. It's an error to annotate multiple messages in a module with the same instance and subject name.

::: tip Note
All references to buf.example.com below should be replaced with the hostname for your private BSR instance.
:::

1.  Add a dependency on the [bufbuild/confluent](https://buf.build/bufbuild/confluent) managed module to your Buf workspace's [`buf.yaml`](../../../configuration/v2/buf-yaml/#deps) file.

    ```yaml{6}
    version: v2
    modules:
      path: /path/to/local/directory
      name: buf.example.com/demo/analytics
    deps:
      - buf.example.com/bufbuild/confluent
    ```

2.  Run [`buf dep update`](../../../reference/cli/buf/dep/update/) to verify and lock the dependency.

    ```sh
    buf dep update
    ```

3.  Add one or more [`buf.confluent.v1.subject`](https://buf.build/bufbuild/confluent/docs/main:buf.confluent.v1) options to a new or existing Protobuf message, including your Confluent Schema Registry [instance name](../manage-instances/#create-an-instance) and the subject's name.

    ```protobuf{15,16,17,18}
    syntax = "proto3";

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
        instance_name: "CSR_INSTANCE_NAME",
        name: "email-updated-value",
      };
    }
    ```

4.  Run [`buf push`](../../../reference/cli/buf/push/) to update the module in the BSR. If successful, the subject is created or updated with the message as its schema.

    ```sh
    buf push
    ```

    You can check it in the browser using your instance URL (you must be logged into the BSR):

    `https://buf.example.com/integrations/confluent/INSTANCE_NAME/subjects/email-updated-value/versions/latest`

## Deregister a schema

::: warning Warning
Deregistering a subject makes it available for use by other messages in the same or different modules. This can lead to compatibility issues if the subject is reused with a different schema.
:::

To deregister a schema, remove the `buf.confluent.v1.subject` option from the message and re-push the module to the BSR with `buf push`. The subject's schema no longer updates, but is still accessible from the BSR's Confluent Schema Registry API.
