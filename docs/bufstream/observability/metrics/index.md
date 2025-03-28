# Metrics

## Bufstream metrics

Bufstream exposes metrics to monitor Kafka producers, consumers, topics, and the status of the Bufstream broker. It reports all metrics with a `cluster.name` attribute set by the Helm chart [cluster](../../reference/configuration/helm-values/#helm.values.cluster) attribute or the [cluster](../../reference/configuration/bufstream-yaml/#buf.bufstream.config.v1alpha1.BufstreamConfig.cluster) setting in the `bufstream.yaml` config file. We recommend setting this name to a unique value for each cluster—for example, `staging` for a pre-production cluster and `prod` for a production cluster.

## Available Metrics

| Name                               | Type                                                  | Attributes                  | Description                                                    |
| ---------------------------------- | ----------------------------------------------------- | --------------------------- | -------------------------------------------------------------- |
| bufstream.intake.delete.latency    | Gauge                                                 | cluster.name                | The latency between an intake entry being written and deleted. |
| bufstream.kafka.active_connections | Gauge                                                 | authentication.principal_id |
| cluster.name                       | Active number of connections to the Bufstream broker. |
| bufstream.kafka.active_requests    | Gauge                                                 | cluster.name                |

kafka.api.key  
kafka.api.version | Active requests by API key and version. |
| bufstream.kafka.consumer.group.count | Gauge | cluster.name  
kafka.consumer.group.state | Number of consumer groups by state. |
| bufstream.kafka.consumer.group.generation | Gauge | cluster.name  
kafka.consumer.group.id | The generation number of a consumer group. Not reported if consumer group aggregation is enabled. |
| bufstream.kafka.consumer.group.joins | Counter | cluster.name  
kafka.consumer.group.id | The number of joins for a consumer group. |
| bufstream.kafka.consumer.group.lag | Gauge | cluster.name  
kafka.consumer.group.id  
kafka.topic.name  
kafka.topic.partition | The lag between a group member's committed offset and the partition's high watermark. |
| bufstream.kafka.consumer.group.member.count | Gauge | cluster.name  
kafka.consumer.group.id | The number of consumers in a group. Not reported if consumer group aggregation is enabled. |
| bufstream.kafka.consumer.group.offset | Gauge | cluster.name  
kafka.consumer.group.id  
kafka.topic.name  
kafka.topic.partition | The latest offset committed for a consumer group. Not reported if consumer group, topic, or partition aggregation is enabled. |
| bufstream.kafka.consumer.group.offset.lag | Gauge | cluster.name  
kafka.topic.name  
kafka.topic.partition | The lag between a group member committing an offset in a transaction and the offset being applied. |
| kafka.consumer.group.offset.commit.latency | Gauge | cluster.name  
kafka.topic.name  
kafka.topic.partition | The latency between committing and processing the latest offset update in seconds. |
| bufstream.kafka.fetch.bytes | Counter | cluster.name  
fetch.source  
kafka.topic.name  
kafka.topic.partition | Amount of data fetched by topic and partition. |
| bufstream.kafka.fetch.record.count | Counter | cluster.name  
fetch.source  
kafka.topic.name  
kafka.topic.partition | The number of records fetched by topic and partition. |
| bufstream.kafka.fetch.record.data_enforcement.errors | Counter | cluster.name  
data_enforcement.action  
data_enforcement.error_type  
kafka.topic.name  
kafka.topic.partition | Number of errors fetching from a topic with [data enforcement](../../data-governance/schema-enforcement/) enabled. |
| bufstream.kafka.fetch.requests | Counter | cluster.name  
kafka.error_code  
kafka.topic.name | The number of fetch requests for a given topic. For successful fetches, `kafka.error_code` will be `none`. |
| bufstream.kafka.mtls.authentication.count | Counter | authentication.principal_id  
cluster.name | The number of mTLS authentications. |
| bufstream.kafka.produce.bytes | Counter | cluster.name  
kafka.topic.name  
kafka.topic.partition | The number of bytes produced by topic and partition. |
| bufstream.kafka.produce.delay.duration | Histogram | cluster.name  
kafka.topic.name | The delay between record creation time and log append time in seconds. |
| bufstream.kafka.produce.record.count | Counter | cluster.name  
kafka.topic.name  
kafka.topic.partition | The number of records produced by topic and partition. |
| bufstream.kafka.produce.record.data_enforcement.errors | Counter | cluster.name  
data_enforcement.action  
data_enforcement.error_type  
kafka.topic.name  
kafka.topic.partition | Number of errors producing to a topic with [data enforcement](../../data-governance/schema-enforcement/) enabled. |
| bufstream.kafka.produce.requests | Counter | cluster.name  
kafka.error_code  
kafka.topic.name | The number of produce requests by topic name and error code. For successful produces, `kafka.error_code` will be `none`. |
| bufstream.kafka.produce.uncompressed_bytes | Counter | cluster.name  
kafka.topic.name | The number of uncompressed bytes produced (by topic). |
| bufstream.kafka.request.bytes | Histogram | authentication.principal_id  
cluster.name  
kafka.api.key  
kafka.api.version | The number of bytes in a Kafka request. |
| bufstream.kafka.request.count | Counter | authentication.principal_id  
cluster.name  
kafka.api.key  
kafka.api.version  
kafka.error_code  
server.error_kind  
kafka.consumer.group.id (only Join/Sync/LeaveGroup and Heartbeat) | Number of processed Kafka requests. Includes the error code and server error kind for troubleshooting failed requests. |
| bufstream.kafka.request.latency | Histogram | cluster.name  
kafka.api.key  
kafka.api.version | The latency of processed requests in seconds. |
| bufstream.kafka.response.bytes | Histogram | authentication.principal_id  
cluster.name  
kafka.api.key  
kafka.api.version | The number of bytes in each Kafka response. |
| bufstream.kafka.sasl.authentication.count | Counter | authentication.principal_id  
cluster.name  
sasl.mechanism  
sasl.outcome | The number of SASL authentications. |
| bufstream.kafka.topic.count | Gauge | cluster.name | The number of topics in the cluster. |
| bufstream.kafka.topic.partition.count | Gauge | cluster.name  
kafka.topic.name | The number of partitions in a topic. |
| bufstream.kafka.topic.partition.offset.high_water_mark | Gauge | cluster.name  
kafka.topic.name  
kafka.topic.partition | A lower bound on the high water mark of a partition. Not reported if topic or partition aggregation is enabled. |
| bufstream.kafka.topic.partition.offset.last_stable_offset | Gauge | cluster.name  
kafka.topic.name  
kafka.topic.partition | A lower bound on the last stable offset of a partition. Not reported if topic or partition aggregation is enabled. |
| bufstream.kafka.topic.partition.offset.low_water_mark | Gauge | cluster.name  
kafka.topic.name  
kafka.topic.partition | A lower bound on the low water mark of a partition. Not reported if topic or partition aggregation is enabled. |
| bufstream.kafka.topic.partition.retained_bytes | Gauge | cluster.name  
kafka.topic.name  
kafka.topic.partition | A lower bound on the size of records in a partition. |
| bufstream.kafka.topic.partition.retained_records | Gauge | cluster.name  
kafka.topic.name  
kafka.topic.partition | An estimate of the number of records retained in a partition. |
| bufstream.status | Gauge | cluster.name  
status.probe | The result (0 = healthy, 1 = warning, 2 = error) of status probes on each Bufstream broker. |
| bufstream.storage.bytes | Gauge | cluster.name  
storage.type | The number of bytes stored in the Bufstream storage layers. |
| bufstream.storage.keys | Gauge | cluster.name  
storage.type | The number of keys stored in the Bufstream storage layers. |

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
