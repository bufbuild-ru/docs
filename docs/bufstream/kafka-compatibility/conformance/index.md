---

title: "Supported APIs - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/kafka-compatibility/conformance/"
  - - meta
    - property: "og:title"
      content: "Supported APIs - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/kafka-compatibility/conformance/"
  - - meta
    - property: "twitter:title"
      content: "Supported APIs - Buf Docs"

---

# Supported APIs in Bufstream

Bufstream is built to work with any Kafka client software, such as the Apache Kafka reference clients, `librdkakfa`, or `franz-go`. It was built to support the latest version of each Kafka API (as of Kafka 3.7.1), while making a best effort to support all previous endpoint versions. Our formal conformance tests run on Kafka clients going back to version 3.2.0, but older client versions haven't been tested extensively. Future releases of Bufstream may establish a minimum supported API version for some or all endpoints.Bufstream supports all of these modern Kafka features:

- Transactions
- Exactly-once semantics
- Topic compaction by key
- Topic retention by time or size
- Seeking within a topic by offset (exact) or timestamp (approximate)
- Most [administrative APIs](#supported-admin-apis)

The sections below detail more specifics of Bufstream's Kafka conformance.

## Supported Kafka endpoints

The current release of Bufstream implements the following Kafka endpoints:

```text
AddOffsetsToTxn
AddPartitionsToTxn
AlterConfigs
AlterUserScramCredentials
ApiVersions
CreatePartitions
CreateTopics
DeleteGroups
DeleteRecords
DeleteTopics
DescribeCluster
DescribeConfigs
DescribeGroups
DescribeLogDirs
DescribeProducers
DescribeTransactions
DescribeUserScramCredentials
EndTxn
Fetch
FindCoordinator
Heartbeat
IncrementalAlterConfigs
InitProducerId
JoinGroup
LeaveGroup
ListGroups
ListOffsets
ListPartitionReassignments
ListTransactions
Metadata
OffsetCommit
OffsetDelete
OffsetFetch
Produce
SaslAuthenticate
SaslHandshake
SyncGroup
TxnOffsetCommit
```

At present, Bufstream doesn't implement Kafka endpoints related to these feature areas:

- ACLs
- Quotas
- Delegation token-based authentication
- Metrics and telemetry

Bufstream deliberately doesn't provide support for a number of Kafka endpoints that aren't applicable to how Bufstream operates. For example, Bufstream brokers don't perform tasks such as leader election and data replication directly, relying instead on other services such as `etcd` and S3 to handle these tasks. This means that endpoints associated with the KRaft consensus algorithm (such as `BrokerRegistration`, `BeginQuorumEpoch`, and `Vote`) aren't relevant to Bufstream, and are omitted. Older Zookeeper management endpoints are similarly not supported. Many of these unsupported endpoints are typically not of interest to Kafka clients, but are used by Kafka brokers to communicate with each other. Note that because Bufstream doesn't implement these broker-to-broker APIs, a Bufstream cluster must consist of Bufstream brokers only. It isn't possible to mix Bufstream and non-Bufstream Kafka brokers in the same cluster.

## Supported configs

Bufstream currently supports the following topic configs:

- **`cleanup.policy`:** Can be set to `compact`, `delete`, or `compact,delete`.
- **`compression.type`**: Sets the final compression type for the topic. The default is set to `producer`, which retains the original compression set by the producer. Bufstream also accepts the standard compression codecs (`gzip`, `snappy`, `lz4`, and `zstd`) as well as `uncompressed`.
- **`timestamp.type`:** Can be set to `CreateTime` or `LogAppendTime` (case-insensitive).
- **`retention.ms`**, **`retention.bytes`:** Set the topic retention limit based on time or bytes written. When creating a new topic, you can set the default values used at broker level using the broker configs `log.retention.ms` and `log.retention.bytes`.
- **`min.compaction.lag.ms`**: Set the minimum time a message remains uncompacted in the log.
- **`max.compaction.lag.ms`:** Set the maximum time a message is ineligible for compaction.

## Supported admin APIs

Bufstream currently supports the following admin APIs:

- `abortTransaction`
- `alterConfigs`, `incrementalAlterConfigs`
- `createTopics`, `createPartitions`
- `describeCluster`, `describeConfigs`, `describeLogDirs`, `describeProducers`, `describeTopics`, `describeTransactions`
- `listConsumerGroupOffsets`, `listConsumerGroups`, `listOffsets`, `listTopics`, `listTransactions`
- `deleteConsumerGroups`, `deleteRecords`, `deleteTopics`
