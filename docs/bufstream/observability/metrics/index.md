---
description: "Reference page of available Bufstream metrics and attributes"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/observability/metrics/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bufstream/observability/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bufstream/observability/status-endpoint/"
  - - meta
    - property: "og:title"
      content: "Metrics - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/observability/metrics.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/observability/metrics/"
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
      content: "Metrics - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/observability/metrics.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Metrics

Bufstream exposes metrics to monitor Kafka producers, consumers, topics, and the status of the Bufstream broker. It reports all metrics with a `cluster.name` attribute set by the Helm chart [cluster](../../reference/configuration/helm-values/#helm.values.cluster) attribute or the cluster setting in the [`bufstream.yaml`](../../reference/configuration/bufstream-yaml/) config file. We recommend setting this name to a unique value for each cluster — for example, `staging` for a pre-production cluster and `prod` for a production cluster.

## Available metrics

<div class="joplin-table-wrapper"><table id="metrics"><thead><tr><th>Type</th><th><a href="#attributes" title="Attribute definitions">Attributes</a></th><th>Description</th></tr></thead><tbody><tr class="metric-name"><th colspan="3"><h4 id="bufstreamintakedeletelatency">bufstream.intake.delete.latency<a class="headerlink" href="#bufstreamintakedeletelatency">#</a></h4></th></tr><tr><td>Gauge</td><td>cluster.name</td><td>The latency between an intake entry being written and deleted.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkaactive_connections">bufstream.kafka.active_connections<a class="headerlink" href="#bufstreamkafkaactive_connections">#</a></h4></th></tr><tr><td>Gauge</td><td>authentication.principal_id<br>cluster.name</td><td>Active number of connections to the Bufstream broker.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkaactive_requests">bufstream.kafka.active_requests<a class="headerlink" href="#bufstreamkafkaactive_requests">#</a></h4></th></tr><tr><td>Gauge</td><td>cluster.name<br>kafka.api.key<br>kafka.api.version</td><td>Active requests by API key and version.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkaconsumergroupcount">bufstream.kafka.consumer.group.count<a class="headerlink" href="#bufstreamkafkaconsumergroupcount">#</a></h4></th></tr><tr><td>Gauge</td><td>cluster.name<br>kafka.consumer.group.state</td><td>Number of consumer groups by state.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkaconsumergroupgeneration">bufstream.kafka.consumer.group.generation<a class="headerlink" href="#bufstreamkafkaconsumergroupgeneration">#</a></h4></th></tr><tr><td>Gauge</td><td>cluster.name<br>kafka.consumer.group.id</td><td>The generation number of a consumer group. Not reported if consumer group aggregation is enabled.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkaconsumergroupjoins">bufstream.kafka.consumer.group.joins<a class="headerlink" href="#bufstreamkafkaconsumergroupjoins">#</a></h4></th></tr><tr><td>Counter</td><td>cluster.name<br>kafka.consumer.group.id</td><td>The number of joins for a consumer group.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkaconsumergrouplag">bufstream.kafka.consumer.group.lag<a class="headerlink" href="#bufstreamkafkaconsumergrouplag">#</a></h4></th></tr><tr><td>Gauge</td><td>cluster.name<br>kafka.consumer.group.id<br>kafka.topic.name<br>kafka.topic.partition</td><td>The lag between a group member's committed offset and the partition's high watermark.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkaconsumergroupmember.count">bufstream.kafka.consumer.group.member.count<a class="headerlink" href="#bufstreamkafkaconsumergroupmember.count">#</a></h4></th></tr><tr><td>Gauge</td><td>cluster.name<br>kafka.consumer.group.id</td><td>The number of consumers in a group. Not reported if consumer group aggregation is enabled.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkaconsumergroupoffset">bufstream.kafka.consumer.group.offset<a class="headerlink" href="#bufstreamkafkaconsumergroupoffset">#</a></h4></th></tr><tr><td>Gauge</td><td>cluster.name<br>kafka.consumer.group.id<br>kafka.topic.name<br>kafka.topic.partition</td><td>The latest offset committed for a consumer group. Not reported if consumer group, topic, or partition aggregation is enabled.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkaconsumergroupoffsetlag">bufstream.kafka.consumer.group.offset.lag<a class="headerlink" href="#bufstreamkafkaconsumergroupoffsetlag">#</a></h4></th></tr><tr><td>Gauge</td><td>cluster.name<br>kafka.topic.name<br>kafka.topic.partition</td><td>The lag between a group member committing an offset in a transaction and the offset being applied.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkaconsumergroupoffsetcommitlatency">bufstream.kafka.consumer.group.offset.commit.latency<a class="headerlink" href="#bufstreamkafkaconsumergroupoffsetcommitlatency">#</a></h4></th></tr><tr><td>Gauge</td><td>cluster.name<br>kafka.topic.name<br>kafka.topic.partition</td><td>The latency between committing and processing the latest offset update in seconds.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkafetchbytes">bufstream.kafka.fetch.bytes<a class="headerlink" href="#bufstreamkafkafetchbytes">#</a></h4></th></tr><tr><td>Counter</td><td>cluster.name<br>fetch.source<br>kafka.topic.name<br>kafka.topic.partition</td><td>Amount of data fetched by topic and partition.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkafetchrecordcount">bufstream.kafka.fetch.record.count<a class="headerlink" href="#bufstreamkafkafetchrecordcount">#</a></h4></th></tr><tr><td>Counter</td><td>cluster.name<br>fetch.source<br>kafka.topic.name<br>kafka.topic.partition</td><td>The number of records fetched by topic and partition.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkafetchrecorddata_enforcementerrors">bufstream.kafka.fetch.record.data_enforcement.errors<a class="headerlink" href="#bufstreamkafkafetchrecorddata_enforcementerrors">#</a></h4></th></tr><tr><td>Counter</td><td>cluster.name<br>data_enforcement.action<br>data_enforcement.error_type<br>kafka.topic.name<br>kafka.topic.partition</td><td>Number of errors fetching from a topic with [data enforcement][bufstream_data_enforcement] enabled.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkafetchrequests">bufstream.kafka.fetch.requests<a class="headerlink" href="#bufstreamkafkafetchrequests">#</a></h4></th></tr><tr><td>Counter</td><td>cluster.name<br>kafka.error_code<br>kafka.topic.name</td><td>The number of fetch requests for a given topic. For successful fetches, `kafka.error_code` will be `none`.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkamtlsauthenticationcount">bufstream.kafka.mtls.authentication.count<a class="headerlink" href="#bufstreamkafkamtlsauthenticationcount">#</a></h4></th></tr><tr><td>Counter</td><td>authentication.principal_id<br>cluster.name</td><td>The number of mTLS authentications.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkaproducebytes">bufstream.kafka.produce.bytes<a class="headerlink" href="#bufstreamkafkaproducebytes">#</a></h4></th></tr><tr><td>Counter</td><td>cluster.name<br>kafka.topic.name<br>kafka.topic.partition</td><td>The number of bytes produced by topic and partition.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkaproducedelayduration">bufstream.kafka.produce.delay.duration<a class="headerlink" href="#bufstreamkafkaproducedelayduration">#</a></h4></th></tr><tr><td>Histogram</td><td>cluster.name<br>kafka.topic.name</td><td>The delay between record creation time and log append time in seconds.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkaproducerecordcount">bufstream.kafka.produce.record.count<a class="headerlink" href="#bufstreamkafkaproducerecordcount">#</a></h4></th></tr><tr><td>Counter</td><td>cluster.name<br>kafka.topic.name<br>kafka.topic.partition</td><td>The number of records produced by topic and partition.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkaproduce.recorddata_enforcementerrors">bufstream.kafka.produce.record.data_enforcement.errors<a class="headerlink" href="#bufstreamkafkaproduce.recorddata_enforcementerrors">#</a></h4></th></tr><tr><td>Counter</td><td>cluster.name<br>data_enforcement.action<br>data_enforcement.error_type<br>kafka.topic.name<br>kafka.topic.partition</td><td>Number of errors producing to a topic with [data enforcement][bufstream_data_enforcement] enabled.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkaproducerequests">bufstream.kafka.produce.requests<a class="headerlink" href="#bufstreamkafkaproducerequests">#</a></h4></th></tr><tr><td>Counter</td><td>cluster.name<br>kafka.error_code<br>kafka.topic.name</td><td>The number of produce requests by topic name and error code. For successful produces, `kafka.error_code` will be `none`.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkaproduceuncompressed_bytes">bufstream.kafka.produce.uncompressed_bytes<a class="headerlink" href="#bufstreamkafkaproduceuncompressed_bytes">#</a></h4></th></tr><tr><td>Counter</td><td>cluster.name<br>kafka.topic.name</td><td>The number of uncompressed bytes produced (by topic).</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkarequestbytes">bufstream.kafka.request.bytes<a class="headerlink" href="#bufstreamkafkarequestbytes">#</a></h4></th></tr><tr><td>Histogram</td><td>authentication.principal_id<br>cluster.name<br>kafka.api.key<br>kafka.api.version</td><td>The number of bytes in a Kafka request.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkarequestcount">bufstream.kafka.request.count<a class="headerlink" href="#bufstreamkafkarequestcount">#</a></h4></th></tr><tr><td>Counter</td><td>authentication.principal_id<br>cluster.name<br>kafka.api.key<br>kafka.api.version<br>kafka.error_code<br>server.error_kind<br>kafka.consumer.group.id</td><td>Number of processed Kafka requests. Includes the error code and server error kind for troubleshooting failed requests.<p>The <code>kafka.consumer.group.id</code> attribute is only included for Join, Sync, LeaveGroup, and Heartbeat.</p></td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkarequestlatency">bufstream.kafka.request.latency<a class="headerlink" href="#bufstreamkafkarequestlatency">#</a></h4></th></tr><tr><td>Histogram</td><td>cluster.name<br>kafka.api.key<br>kafka.api.version</td><td>The latency of processed requests in seconds.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkaresponsebytes">bufstream.kafka.response.bytes<a class="headerlink" href="#bufstreamkafkaresponsebytes">#</a></h4></th></tr><tr><td>Histogram</td><td>authentication.principal_id<br>cluster.name<br>kafka.api.key<br>kafka.api.version</td><td>The number of bytes in each Kafka response.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkasaslauthenticationcount">bufstream.kafka.sasl.authentication.count<a class="headerlink" href="#bufstreamkafkasaslauthenticationcount">#</a></h4></th></tr><tr><td>Counter</td><td>authentication.principal_id<br>cluster.name<br>sasl.mechanism<br>sasl.outcome</td><td>The number of SASL authentications.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkatopiccount">bufstream.kafka.topic.count<a class="headerlink" href="#bufstreamkafkatopiccount">#</a></h4></th></tr><tr><td>Gauge</td><td>cluster.name</td><td>The number of topics in the cluster.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkatopicpartitioncount">bufstream.kafka.topic.partition.count<a class="headerlink" href="#bufstreamkafkatopicpartitioncount">#</a></h4></th></tr><tr><td>Gauge</td><td>cluster.name<br>kafka.topic.name</td><td>The number of partitions in a topic.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkatopicpartitionoffsethigh_water_mark">bufstream.kafka.topic.partition.offset.high_water_mark<a class="headerlink" href="#bufstreamkafkatopicpartitionoffsethigh_water_mark">#</a></h4></th></tr><tr><td>Gauge</td><td>cluster.name<br>kafka.topic.name<br>kafka.topic.partition</td><td>A lower bound on the high water mark of a partition. Not reported if topic or partition aggregation is enabled.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkatopicpartitionoffsetlast_stable_offset">bufstream.kafka.topic.partition.offset.last_stable_offset<a class="headerlink" href="#bufstreamkafkatopicpartitionoffsetlast_stable_offset">#</a></h4></th></tr><tr><td>Gauge</td><td>cluster.name<br>kafka.topic.name<br>kafka.topic.partition</td><td>A lower bound on the last stable offset of a partition. Not reported if topic or partition aggregation is enabled.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkatopicpartitionoffsetlow_water_mark">bufstream.kafka.topic.partition.offset.low_water_mark<a class="headerlink" href="#bufstreamkafkatopicpartitionoffsetlow_water_mark">#</a></h4></th></tr><tr><td>Gauge</td><td>cluster.name<br>kafka.topic.name<br>kafka.topic.partition</td><td>A lower bound on the low water mark of a partition. Not reported if topic or partition aggregation is enabled.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkatopicpartitionretained_bytes">bufstream.kafka.topic.partition.retained_bytes<a class="headerlink" href="#bufstreamkafkatopicpartitionretained_bytes">#</a></h4></th></tr><tr><td>Gauge</td><td>cluster.name<br>kafka.topic.name<br>kafka.topic.partition</td><td>A lower bound on the size of records in a partition.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamkafkatopicpartitionretained_records">bufstream.kafka.topic.partition.retained_records<a class="headerlink" href="#bufstreamkafkatopicpartitionretained_records">#</a></h4></th></tr><tr><td>Gauge</td><td>cluster.name<br>kafka.topic.name<br>kafka.topic.partition</td><td>An estimate of the number of records retained in a partition.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamstatus">bufstream.status<a class="headerlink" href="#bufstreamstatus">#</a></h4></th></tr><tr><td>Gauge</td><td>cluster.name<br>status.probe</td><td>The result (0 = healthy, 1 = warning, 2 = error) of status probes on each Bufstream broker.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamstoragebytes">bufstream.storage.bytes<a class="headerlink" href="#bufstreamstoragebytes">#</a></h4></th></tr><tr><td>Gauge</td><td>cluster.name<br>storage.type</td><td>The number of bytes stored in the Bufstream storage layers.</td></tr><tr class="metric-name"><th colspan="3"><h4 id="bufstreamstoragekeys">bufstream.storage.keys<a class="headerlink" href="#bufstreamstoragekeys">#</a></h4></th></tr><tr><td>Gauge</td><td>cluster.name<br>storage.type</td><td>The number of keys stored in the Bufstream storage layers.</td></tr></tbody></table></div>

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

By default, Bufstream reports metrics for individual topics, partitions, and consumer groups. In some environments, reporting metrics at the default cardinality may be too expensive. For example, if topics typically have hundreds of partitions, reporting per-partition metrics requires a significant cost in the monitoring system.

To support environments with high cardinality, Bufstream supports aggregating metrics for topics, partitions, and consumer groups. To use aggregate metrics, configure Bufstream as follows:

+++tabs key:e18ad947cbc142ea04c99762c94a29ac

== bufstream.yaml

```yaml
observability:
  metrics:
    aggregation:
      # If true, per-topic metrics won't be reported but aggregated across all
      # topics and partitions.
      # Metrics that don't support aggregation such as `bufstream.kafka.topic.partition.offset.high_water_mark`
      # won't be reported.
      topics: false

      # If true, per-partition metrics won't be reported but aggregated across
      # all partitions.
      # Metrics that don't support aggregation such as `bufstream.kafka.topic.partition.offset.high_water_mark`
      # won't be reported.
      partitions: false

      # If true, per-consumer group metrics won't be reported but aggregated
      # across all consumer groups.
      # Metrics that don't support aggregation such as `bufstream.kafka.consumer.group.offset`
      # won't be reported.
      consumer_groups: false

      # If true, per-principal metrics won't be reported but aggregated across
      # all principal IDs.
      principal_ids: false
```

== Helm values.yaml

```yaml
observability:
  metrics:
    aggregation:
      # If true, per-topic metrics won't be reported but aggregated across all
      # topics and partitions.
      # Metrics that don't support aggregation such as `bufstream.kafka.topic.partition.offset.high_water_mark`
      # won't be reported.
      topics: false

      # If true, per-partition metrics won't be reported but aggregated across
      # all partitions.
      # Metrics that don't support aggregation such as `bufstream.kafka.topic.partition.offset.high_water_mark`
      # won't be reported.
      partitions: false

      # If true, per-consumer group metrics won't be reported but aggregated
      # across all consumer groups.
      # Metrics that don't support aggregation such as `bufstream.kafka.consumer.group.offset`
      # won't be reported.
      consumerGroups: false

      # If true, per-principal metrics won't be reported but aggregated across
      # all principal IDs.
      principalIDs: false
```

+++

If aggregation is enabled, Bufstream reports the following attributes with metrics:

| Aggregation          | Attribute name              | Attribute value       |
| -------------------- | --------------------------- | --------------------- |
| Consumer Groups      | kafka.consumer.group.id     | `_all_groups_`        |
| Topics               | kafka.topic.name            | `_all_topics_`        |
| Topics or partitions | kafka.topic.partition       | `-1`                  |
| Principal IDs        | authentication.principal_id | `_all_principal_ids_` |
