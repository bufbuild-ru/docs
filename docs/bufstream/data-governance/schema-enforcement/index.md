---

title: "Schema enforcement - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/data-governance/schema-enforcement/"
  - - meta
    - property: "og:title"
      content: "Schema enforcement - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/data-governance/schema-enforcement/"
  - - meta
    - property: "twitter:title"
      content: "Schema enforcement - Buf Docs"

---

# Schema enforcement

## Data quality enforcement

Rather than trusting producers to send valid data, Bufstream can reject messages that don't match the topic's schema. This _guarantees_ that consumers always receive well-formed data, eliminating a large class of data outages. This feature works with binary-encoded Protobuf messages and the Buf Schema Registry (or any other Protobuf registry that supports Confluent's REST API). To associate Protobuf schemas with a Kafka topic in the Buf Schema Registry, follow [the documentation for integrating the BSR with Kafka](../../../bsr/csr/overview/).

## Self-describing data

It's often helpful to make Kafka messages self-describing, so that tools and frameworks can unmarshal, manipulate, and display them. The most common approach to making messages self-describing is to prefix the serialized message with a few extra bytes (commonly called an "envelope"). The prefix encodes the ID of the message's schema, which can then be retrieved from a schema registry. Because Confluent introduced and popularized this format, it's commonly called the [Confluent wire format](https://docs.confluent.io/platform/current/schema-registry/fundamentals/serdes-develop/index.html#wire-format). Much of the Kafka ecosystem supports this format, including most client libraries, [Kafka Connect](https://docs.confluent.io/platform/current/connect/index.html), [AKHQ](https://akhq.io/), [kSQLdb](https://ksqldb.io/), and [Snowflake's Kafka Connector](https://docs.confluent.io/cloud/current/connectors/cc-snowflake-sink/cc-snowflake-sink.html#schema-config). Bufstream and the Buf Schema Registry also support the Confluent wire format, and Bufstream's brokers can optionally perform automatic message enveloping.

## Enabling schema enforcement

1.  Create a secret containing CSR credentials:

    ```console
    $ kubectl create secret --namespace bufstream generic bufstream-csr \
      --from-literal=username=<your user> \
      --from-literal=password=<your password>
    ```

2.  To reject data that doesn't match the topic's schema, add the following to your Helm values file:

    ```yaml
    dataEnforcement:
      schema_registries:
        - name: my-registry
          confluent:
            url: https://my-schema-registry.com/registry-id
            basic_auth:
              username:
                path: "/config/secrets/csr/username"
              password:
                path: "/config/secrets/csr/password"
      produce:
        - topics: { equal: my-topic }
          schema_registry: my-registry
          values:
            coerce: true
            on_parse_error: REJECT_BATCH
    bufstream:
      deployment:
        extraVolumes:
          - name: csr
            secret:
              secretName: bufstream-csr
              items:
                - key: username
                  path: username
                - key: password
                  path: password
        extraVolumeMounts:
          - name: csr
            mountPath: /config/secrets/csr
            readOnly: true
    ```

With this configuration, consumers _always_ receive well-formed, self-describing data. If the producer sends un-enveloped messages, Bufstream automatically envelopes them using the latest revision of the topic's schema. Bufstream then parses the message using the schema from the envelope. If the message doesn't match the schema, Bufstream rejects it and the data producer sees an error.

## Advanced configurations

### Automatic enveloping without parsing

To enable automatic enveloping _without_ verifying that the data matches the schema, change the produce filter above to the following:

```yaml
produce:
  - topics: { all: true }
    schema_registry: my-registry
    values:
      coerce: true
      skip_parse: true
```

### Enforce producer enveloping without parsing

To require that data producers send enveloped messages _without_ verifying that the data matches the schema, change the produce filter to the following:

```yaml
produce:
  - topics: { all: true }
    schema_registry: my-registry
    values:
      coerce: false
      on_no_schema: REJECT_BATCH
```

### Automatically enveloping old messages

If a topic contains un-enveloped data, Bufstream can envelope the existing data on the fly as it's read. To automatically envelope the data and verify that it matches the schema, hiding messages with invalid data from the consumer, add the following to your Helm values file:

```yaml
dataEnforcement:
  schema_registries:
    - name: my-registry
      confluent:
        url: https://my-schema-registry.com/registry-id
        basic_auth:
          username:
            path: "/config/secrets/csr/username"
          password:
            path: "/config/secrets/csr/password"
  fetch:
    - topics: { all: true }
      schema_registry: my-registry
      values:
        coerce: true
        on_parse_error: FILTER_RECORD
bufstream:
  deployment:
    extraVolumes:
      - name: csr
        secret:
          secretName: bufstream-csr
          items:
            - key: username
              path: username
            - key: password
              path: password
    extraVolumeMounts:
      - name: csr
        mountPath: /config/secrets/csr
        readOnly: true
```

To instead allow the consumer to see enveloped but invalid data, change `FILTER_RECORD` to `PASS_THROUGH`.

### Topic-specific policies

For finer-grained control, Bufstream supports topic-specific policies. Only the first policy that matches a given produce or fetch request takes effect. This Helm values snippet shows how to configure a policy for a specific topic:

```yaml
produce:
  - topics: { equal: "topic" }
    schema_registry: my-registry
    values:
      coerce: true
      on_parse_error: REJECT_BATCH
```

### Using multiple registries

There may be cases where you have more than one registry in place—for example, a development and production registry. Bufstream allows you to configure each registry independently and choose which registry to use with each policy. As an example, this Helm values snippet configures two registries and uses each in one policy:

```yaml
produce:
  # pass through any errors from the development registry for a specific topic ("dev-topic").
  - topics: { equal: "dev-topic" }
    schema_registry: dev-registry
    values:
      coerce: true
      on_parse_error: PASS_THROUGH
    # reject messages that error for all topics in the production registry
  - topics: { all: true }
    schema_registry: prod-registry
    values:
      coerce: true
      on_parse_error: REJECT_BATCH
```
