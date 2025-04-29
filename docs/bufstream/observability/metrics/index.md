---

title: "Metrics - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/observability/metrics/"
  - - meta
    - property: "og:title"
      content: "Metrics - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/observability/metrics/"
  - - meta
    - property: "twitter:title"
      content: "Metrics - Buf Docs"

---

# Metrics

Bufstream exposes metrics to monitor Kafka producers, consumers, topics, and the status of the Bufstream broker. It reports all metrics with a `cluster.name` attribute set by the Helm chart [cluster](../../reference/configuration/helm-values/#helm.values.cluster) attribute or the [cluster](../../reference/configuration/bufstream-yaml/#buf.bufstream.config.v1alpha1.BufstreamConfig.cluster) setting in the `bufstream.yaml` config file. We recommend setting this name to a unique value for each cluster—for example, `staging` for a pre-production cluster and `prod` for a production cluster.

## Available metrics

#### bufstream.intake.delete.latency

| Type  | Attributes   | Description                                                    |
| ----- | ------------ | -------------------------------------------------------------- |
| Gauge | cluster.name | The latency between an intake entry being written and deleted. |

#### bufstream.kafka.active_connections

| Type  | Attributes                                   | Description                                           |
| ----- | -------------------------------------------- | ----------------------------------------------------- |
| Gauge | authentication.principal_id <br>cluster.name | Active number of connections to the Bufstream broker. |

#### bufstream.kafka.active_requests

| Type  | Attributes                                           | Description                             |
| ----- | ---------------------------------------------------- | --------------------------------------- |
| Gauge | cluster.name <br>kafka.api.key <br>kafka.api.version | Active requests by API key and version. |

#### bufstream.kafka.consumer.group.count

| Type  | Attributes                                  | Description                         |
| ----- | ------------------------------------------- | ----------------------------------- |
| Gauge | cluster.name <br>kafka.consumer.group.state | Number of consumer groups by state. |

#### bufstream.kafka.consumer.group.generation

| Type  | Attributes                               | Description                                                                                       |
| ----- | ---------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Gauge | cluster.name <br>kafka.consumer.group.id | The generation number of a consumer group. Not reported if consumer group aggregation is enabled. |

#### bufstream.kafka.consumer.group.joins

| Type    | Attributes                               | Description                               |
| ------- | ---------------------------------------- | ----------------------------------------- |
| Counter | cluster.name <br>kafka.consumer.group.id | The number of joins for a consumer group. |

#### bufstream.kafka.consumer.group.lag

| Type  | Attributes                                                                              | Description                                                                           |
| ----- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Gauge | cluster.name <br>kafka.consumer.group.id <br>kafka.topic.name <br>kafka.topic.partition | The lag between a group member's committed offset and the partition's high watermark. |

#### bufstream.kafka.consumer.group.member.count

| Type  | Attributes                               | Description                                                                                |
| ----- | ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| Gauge | cluster.name <br>kafka.consumer.group.id | The number of consumers in a group. Not reported if consumer group aggregation is enabled. |

#### bufstream.kafka.consumer.group.offset

| Type  | Attributes                                                                              | Description                                                                                                                   |
| ----- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Gauge | cluster.name <br>kafka.consumer.group.id <br>kafka.topic.name <br>kafka.topic.partition | The latest offset committed for a consumer group. Not reported if consumer group, topic, or partition aggregation is enabled. |

#### bufstream.kafka.consumer.group.offset.lag

| Type  | Attributes                                                  | Description                                                                                        |
| ----- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Gauge | cluster.name <br>kafka.topic.name <br>kafka.topic.partition | The lag between a group member committing an offset in a transaction and the offset being applied. |

| kafka.consumer.group.offset.commit.latency

| Type  | Attributes                                                  | Description                                                                        |
| ----- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Gauge | cluster.name <br>kafka.topic.name <br>kafka.topic.partition | The latency between committing and processing the latest offset update in seconds. |

#### bufstream.kafka.fetch.bytes

| Type    | Attributes                                                                   | Description                                    |
| ------- | ---------------------------------------------------------------------------- | ---------------------------------------------- |
| Counter | cluster.name <br>fetch.source <br>kafka.topic.name <br>kafka.topic.partition | Amount of data fetched by topic and partition. |

#### bufstream.kafka.fetch.record.count

| Type    | Attributes                                                                   | Description                                           |
| ------- | ---------------------------------------------------------------------------- | ----------------------------------------------------- |
| Counter | cluster.name <br>fetch.source <br>kafka.topic.name <br>kafka.topic.partition | The number of records fetched by topic and partition. |

#### bufstream.kafka.fetch.record.data_enforcement.errors

| Type    | Attributes                                                                                                              | Description                                                                                                        |
| ------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Counter | cluster.name <br>data_enforcement.action <br>data_enforcement.error_type <br>kafka.topic.name <br>kafka.topic.partition | Number of errors fetching from a topic with [data enforcement](../../data-governance/schema-enforcement/) enabled. |

#### bufstream.kafka.fetch.requests

| Type    | Attributes                                             | Description                                                                                                |
| ------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Counter | cluster.name <br>kafka.error_code <br>kafka.topic.name | The number of fetch requests for a given topic. For successful fetches, `kafka.error_code` will be `none`. |

#### bufstream.kafka.mtls.authentication.count

| Type    | Attributes                                   | Description                         |
| ------- | -------------------------------------------- | ----------------------------------- |
| Counter | authentication.principal_id <br>cluster.name | The number of mTLS authentications. |

#### bufstream.kafka.produce.bytes

| Type    | Attributes                                                  | Description                                          |
| ------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| Counter | cluster.name <br>kafka.topic.name <br>kafka.topic.partition | The number of bytes produced by topic and partition. |

#### bufstream.kafka.produce.delay.duration

| Type      | Attributes                        | Description                                                            |
| --------- | --------------------------------- | ---------------------------------------------------------------------- |
| Histogram | cluster.name <br>kafka.topic.name | The delay between record creation time and log append time in seconds. |

#### bufstream.kafka.produce.record.count

| Type    | Attributes                                                  | Description                                            |
| ------- | ----------------------------------------------------------- | ------------------------------------------------------ |
| Counter | cluster.name <br>kafka.topic.name <br>kafka.topic.partition | The number of records produced by topic and partition. |

#### bufstream.kafka.produce.record.data_enforcement.errors

| Type    | Attributes                                                                                                              | Description                                                                                                       |
| ------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Counter | cluster.name <br>data_enforcement.action <br>data_enforcement.error_type <br>kafka.topic.name <br>kafka.topic.partition | Number of errors producing to a topic with [data enforcement](../../data-governance/schema-enforcement/) enabled. |

#### bufstream.kafka.produce.requests

| Type    | Attributes                                             | Description                                                                                                              |
| ------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Counter | cluster.name <br>kafka.error_code <br>kafka.topic.name | The number of produce requests by topic name and error code. For successful produces, `kafka.error_code` will be `none`. |

#### bufstream.kafka.produce.uncompressed_bytes

| Type    | Attributes                        | Description                                           |
| ------- | --------------------------------- | ----------------------------------------------------- |
| Counter | cluster.name <br>kafka.topic.name | The number of uncompressed bytes produced (by topic). |

#### bufstream.kafka.request.bytes

| Type      | Attributes                                                                           | Description                             |
| --------- | ------------------------------------------------------------------------------------ | --------------------------------------- |
| Histogram | authentication.principal_id <br>cluster.name <br>kafka.api.key <br>kafka.api.version | The number of bytes in a Kafka request. |

#### bufstream.kafka.request.count

| Type    | Attributes                                                                                                                                                                                            | Description                                                                                                            |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Counter | authentication.principal_id <br>cluster.name <br>kafka.api.key <br>kafka.api.version <br>kafka.error_code <br>server.error_kind <br>kafka.consumer.group.id (only Join/Sync/LeaveGroup and Heartbeat) | Number of processed Kafka requests. Includes the error code and server error kind for troubleshooting failed requests. |

#### bufstream.kafka.request.latency

| Type      | Attributes                                           | Description                                   |
| --------- | ---------------------------------------------------- | --------------------------------------------- |
| Histogram | cluster.name <br>kafka.api.key <br>kafka.api.version | The latency of processed requests in seconds. |

#### bufstream.kafka.response.bytes

| Type      | Attributes                                                                           | Description                                 |
| --------- | ------------------------------------------------------------------------------------ | ------------------------------------------- |
| Histogram | authentication.principal_id <br>cluster.name <br>kafka.api.key <br>kafka.api.version | The number of bytes in each Kafka response. |

#### bufstream.kafka.sasl.authentication.count

| Type    | Attributes                                                                       | Description                         |
| ------- | -------------------------------------------------------------------------------- | ----------------------------------- |
| Counter | authentication.principal_id <br>cluster.name <br>sasl.mechanism <br>sasl.outcome | The number of SASL authentications. |

#### bufstream.kafka.topic.count

| Type  | Attributes   | Description                          |
| ----- | ------------ | ------------------------------------ |
| Gauge | cluster.name | The number of topics in the cluster. |

#### bufstream.kafka.topic.partition.count

| Type  | Attributes                        | Description                          |
| ----- | --------------------------------- | ------------------------------------ |
| Gauge | cluster.name <br>kafka.topic.name | The number of partitions in a topic. |

#### bufstream.kafka.topic.partition.offset.high_water_mark

| Type  | Attributes                                                  | Description                                                                                                     |
| ----- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Gauge | cluster.name <br>kafka.topic.name <br>kafka.topic.partition | A lower bound on the high water mark of a partition. Not reported if topic or partition aggregation is enabled. |

#### bufstream.kafka.topic.partition.offset.last_stable_offset

| Type  | Attributes                                                  | Description                                                                                                        |
| ----- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Gauge | cluster.name <br>kafka.topic.name <br>kafka.topic.partition | A lower bound on the last stable offset of a partition. Not reported if topic or partition aggregation is enabled. |

#### bufstream.kafka.topic.partition.offset.low_water_mark

| Type  | Attributes                                                  | Description                                                                                                    |
| ----- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Gauge | cluster.name <br>kafka.topic.name <br>kafka.topic.partition | A lower bound on the low water mark of a partition. Not reported if topic or partition aggregation is enabled. |

#### bufstream.kafka.topic.partition.retained_bytes

| Type  | Attributes                                                  | Description                                          |
| ----- | ----------------------------------------------------------- | ---------------------------------------------------- |
| Gauge | cluster.name <br>kafka.topic.name <br>kafka.topic.partition | A lower bound on the size of records in a partition. |

#### bufstream.kafka.topic.partition.retained_records

| Type  | Attributes                                                  | Description                                                   |
| ----- | ----------------------------------------------------------- | ------------------------------------------------------------- |
| Gauge | cluster.name <br>kafka.topic.name <br>kafka.topic.partition | An estimate of the number of records retained in a partition. |

#### bufstream.status

| Type  | Attributes                    | Description                                                                                 |
| ----- | ----------------------------- | ------------------------------------------------------------------------------------------- |
| Gauge | cluster.name <br>status.probe | The result (0 = healthy, 1 = warning, 2 = error) of status probes on each Bufstream broker. |

#### bufstream.storage.bytes

| Type  | Attributes                    | Description                                                 |
| ----- | ----------------------------- | ----------------------------------------------------------- |
| Gauge | cluster.name <br>storage.type | The number of bytes stored in the Bufstream storage layers. |

#### bufstream.storage.keys

| Type  | Attributes                    | Description                                                |
| ----- | ----------------------------- | ---------------------------------------------------------- |
| Gauge | cluster.name <br>storage.type | The number of keys stored in the Bufstream storage layers. |

## Attributes

| Name                        | Description                                                                                                                                                                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| authentication.principal_id | The authentication principal, `_no_principal_id_` if unauthenticated.                                                                                                                                                                                        |
| cluster.name                | The configured Bufstream cluster name.                                                                                                                                                                                                                       |
| data_enforcement.action     | One of `pass_through`, `reject`, or `filter`.                                                                                                                                                                                                                |
| data_enforcement.error_type | One of `decode`, `validate`, or `internal`.                                                                                                                                                                                                                  |
| fetch.source                | The source of the record data (`recent`, `shelf`, or `archive`).                                                                                                                                                                                             |
| kafka.api.key               | Kafka API key (string format). For example, `Produce` or `Fetch`.                                                                                                                                                                                            |
| kafka.api.version           | The API version for the request or response message.                                                                                                                                                                                                         |
| kafka.consumer.group.id     | The Kafka consumer group ID ([group.id](https://kafka.apache.org/documentation/#consumerconfigs_group.id)).                                                                                                                                                  |
| kafka.consumer.group.state  | The state of a consumer group (`Stable`, `Empty`, `PreparingRebalance`, `CompletingRebalance`, `Dead`).                                                                                                                                                      |
| kafka.error_code            | The Kafka [error code](https://kafka.apache.org/37/protocol.html#protocol_error_codes), converted to lower snake case.                                                                                                                                       |
| kafka.topic.name            | The name of the topic. Contains the topic ID if [sensitive information redaction](../../reference/configuration/helm-values/#helm.values.observability.sensitiveInformationRedaction) is set to `OPAQUE` and `_all_topics_` if topic aggregation is enabled. |
| kafka.topic.partition       | The partition index of the topic. Set to `-1` if topic or partition aggregation is enabled.                                                                                                                                                                  |
| sasl.mechanism              | The SASL mechanism used for authentication (`SCRAM-SHA-256`, `SCRAM-SHA-512`, `OAUTH`, `PLAIN`, `ANONYMOUS`).                                                                                                                                                |
| sasl.outcome                | The outcome of a SASL authentication attempt (`authenticated`, `failed`, `unsupported`, `illegal_state`).                                                                                                                                                    |
| server.error_kind           | The kind of the server error, such as `canceled` or `deadline_exceeded`.                                                                                                                                                                                     |
| status.probe                | The name of the Bufstream status probe. For example, `storage` or `etcd`.                                                                                                                                                                                    |
| storage.type                | The type of storage: `data` or `metadata`.                                                                                                                                                                                                                   |

## Controlling metric cardinality

By default, Bufstream reports metrics for individual topics, partitions, and consumer groups. In some environments, reporting metrics at the default cardinality may be too expensive. For example, if topics typically have hundreds of partitions, reporting per-partition metrics requires a significant cost in the monitoring system.To support environments with high cardinality, Bufstream supports aggregating metrics for topics, partitions, and consumer groups. To configure aggregation in the Helm chart, use the following settings:

```yaml
observability:
  metrics:
    aggregation:
      # If true, per-topic metrics won't be reported but aggregated across all topics and partitions.
      # Metrics that don't support aggregation such as `bufstream.kafka.topic.partition.offset.high_water_mark` won't be reported.
      topics: false

      # If true, per-partition metrics won't be reported but aggregated across all partitions.
      # Metrics that don't support aggregation such as `bufstream.kafka.topic.partition.offset.high_water_mark` won't be reported.
      partitions: false

      # If true, per-consumer group metrics won't be reported but aggregated across all consumer groups.
      # Metrics that don't support aggregation such as `bufstream.kafka.consumer.group.offset` won't be reported.
      consumerGroups: false

      # If true, per-principal metrics won't be reported but aggregated across all principal IDs.
      principalIDs: false
```

If aggregation is enabled, Bufstream reports the following attributes with metrics:

| Aggregation          | Attribute name              | Attribute value       |
| -------------------- | --------------------------- | --------------------- |
| Consumer Groups      | kafka.consumer.group.id     | `_all_groups_`        |
| Topics               | kafka.topic.name            | `_all_topics_`        |
| Topics or partitions | kafka.topic.partition       | `-1`                  |
| Principal IDs        | authentication.principal_id | `_all_principal_ids_` |
