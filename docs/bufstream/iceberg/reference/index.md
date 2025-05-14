---
description: "Technical reference information about Bufstream's Apache Iceberg integration"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/iceberg/reference/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bufstream/iceberg/configuration/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bufstream/kafka-compatibility/configure-clients/"
  - - meta
    - property: "og:title"
      content: "Reference - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/iceberg/reference.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/iceberg/reference/"
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
      content: "Reference - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/iceberg/reference.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Reference

## Intake and archive

Bufstream stores topic data in archive files in object storage. Before data is archived by Bufstream it enters the system as an intake file. Intake files include messages from any number of topics and partitions and are grouped according to a time boundary. If you are using transactions, intake files will also include uncommitted messages. Intake files are refined into archives per the configured [delay](../../reference/configuration/bufstream-yaml/#buf.bufstream.config.v1alpha1.ArchiveConfig) values. Once intake files are refined into archives, each archive file will contain committed messages for a single topic partition.

When the specified archive format is `iceberg`, Bufstream will also update the configured Iceberg catalog when it publishes an archive to sync the new data file to the table's metadata. The catalog update process is performed synchronously. If the catalog update fails, it is addressed later via a reconciliation process.

### Data transformations

At the start of each archiving job, Bufstream queries the configured schema registry to fetch the latest message schema and caches it in memory to reduce concurrent queries for the same topic. The retrieved Protobuf schema is used to compute an Iceberg schema, and Bufstream stores the state of the Iceberg schema in the system's metadata store (e.g. etcd) to ensure proper re-use of allocated field IDs. The stored state also tracks deleted fields and columns and decides whether to create or rename fields if there are incompatible changes to a column's type. Once the Iceberg schema is computed, Bufstream checks the catalog to determine whether or not the schema has changed. If there are changes, Bufstream updates the schema in the table's metadata. If no Iceberg table exists yet, Bufstream creates it and sets the schema ID to 0 for the computed schema.

From the computed Iceberg schema, Bufstream derives a Parquet schema that is used to write the data files. Bufstream synthesizes elements from the Protobuf data to map it to Parquet column values. At this time, Bufstream does not support customizing the name of Iceberg or Parquet field types via the use of Protobuf options. Transformations are only available for Protobuf encoded data.

## Table Schema

Because the archived Parquet files are used by Bufstream to serve Kafka subscribers, the schema for these files and for the corresponding Iceberg table includes additional metadata in order to reconstruct the stream data.

The following sections describe the fields of the Iceberg table schema.

### `key`

_struct_

Represents the _key_ in the original published record.

There is a child field named `__raw__` (_bytes_) that will always be populated, and it represents the original bytes of the key.

Optionally, additional fields will be present if a Protobuf message schema is associated with the key of this Bufstream topic. A schema can be associated with the topic via the [data enforcement](../../reference/configuration/bufstream-yaml/#buf.bufstream.config.v1alpha1.BufstreamConfig.data_enforcement) configuration in `bufstream.yaml`.

When a Protobuf message schema is used, in addition to fields that mirror the structure of the message, there will also be fields named `__prefix__` (_bytes_) and `__err__` (_string_). The former includes any preamble to the message data in the format of a CSR envelope. The field is only populated when the original message included such a prefix or if the `coerce` option is configured in data enforcement. The latter field is present when the message data cannot be decoded, which should only be possible if data enforcement configuration allows invalid data to pass through. When the `__err__` field is present with a decoding error message, none of the other fields, aside from `__raw__` will be populated.

### `value`

_struct_

Represents the _value_ in the original published record.

There is a child field named `__raw__` (_bytes_) that is optional, and it represents the original bytes of the value. It will only be populated when there is no Protobuf message schema or there was an error when processing and decoding the Protobuf data. When not populated, the value can be reconstructed from other fields.

Optionally, additional fields will be present if a Protobuf message schema is associated with the value of the Bufstream topic. A schema can be associated with the topic via the [data enforcement](../../reference/configuration/bufstream-yaml/#buf.bufstream.config.v1alpha1.BufstreamConfig.data_enforcement) configuration in `bufstream.yaml`.

When a Protobuf message schema is used, in addition to fields that mirror the structure of the message, there will also be fields named `__prefix__` (_bytes_) and `__err__` (_string_). The former includes any preamble to the message data in the format of a CSR envelope. The field is only populated when the original message included such a prefix or if the `coerce` option is configured in data enforcement. The latter field is present when the message data cannot be decoded, which should only be possible if data enforcement configuration allows invalid data to pass through. When the `__err__` field is present with a decoding error message, none of the other fields, aside from `__raw__` will be populated.

### `headers`

_list of structs_

Key value pairs that Kafka producers attach to records.

#### `key`

_string_

#### `value`

_bytes_

### `kafka`

_struct_

Metadata pertaining to the Kafka topics, partitions, and records.

#### `partition`

_int32_

The zero-based index of the topic partition for this record. A topic with N partitions will have records with values from 0 to N-1 (inclusive).

#### `offset`

_int64_

The unique identifier for a record within a single topic-partition. This value is assigned by the system at ingestion in order to preserve record ordering when serving subscribers.

#### `event_timestamp`

_timestamp_

A timestamp (defined in microseconds) associated with the record set by the Kafka producer so that events originating in a remote system are preserved when published in a topic.

#### `ingest_timestamp`

_timestamp_

A timestamp (defined in microseconds) assigned by the system when the record is accepted. Ingestion timestamps are not strictly ordered due to clock skew between Bufstream nodes. Because records in the Parquet file are explicitly ordered, the system will adjust the ingestion timestamp so that it is monotonic. Monotonic timestamps are necessary for querying as well as time-based partitioning strategies.

#### `batch_start`

_int64_

This field identifies the first offset in the batch that contained this record. The system can preserve the grouping when reconstructing the batches to send to Kafka consumers.

## Memory and Performance

Enabling Bufstream's Iceberg integration may result in higher read latency (particularly for consumers that are lagging) and memory usage as a result of the additional broker and reconciliation processes needed to transform data, archive Parquet files, and read from and update Iceberg catalogs.

To maintain Iceberg table freshness and consistency, we recommend adjusting the Bufstream cleanup interval. The default for Bufstream's cleanup jobs is 6 hours. We recommend a 1 hour cleanup interval for any topics archived as Iceberg.

The above adjustments decrease the latency in getting data into the source Iceberg table in the face of temporary errors, like a momentary network partition or outage of the Iceberg catalog. In particular, the reconciliation process (when a synchronous catalog update fails) happens on the same schedule as compaction and cleaning.

Because Bufstream doesn't currently compact Iceberg topics, this process isn't designed to improve query performance. Without regular compaction, there's a tradeoff between the latency of getting records into the Iceberg table vs. query performance. Configuring larger `max_bytes`, `complete_delay_max`, and `idle_max` values in [archive configuration](../../reference/configuration/bufstream-yaml/#buf.bufstream.config.v1alpha1.ArchiveConfig) increases the latency between a record being published to Bufstream and it being added to the Iceberg table, but the underlying Parquet data files will be larger and improve query performance for the Iceberg table.
