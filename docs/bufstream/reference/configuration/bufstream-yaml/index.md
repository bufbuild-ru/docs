---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/reference/configuration/bufstream-yaml/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bufstream/reference/cli/client/metadata/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bufstream/reference/configuration/helm-values/"
  - - meta
    - property: "og:title"
      content: "Bufstream configuration files - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/reference/configuration/bufstream-yaml.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/reference/configuration/bufstream-yaml/"
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
      content: "Bufstream configuration files - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/reference/configuration/bufstream-yaml.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# bufstream.yaml

The `bufstream.yaml` file defines configuration for a Bufstream broker. The Bufstream CLI can be instructed to use the configuration file with the `-c` flag.

## Fields

### `name`

\_string_The name of this Bufstream broker.Names should be unique for each broker in the cluster. Defaults to the hostname. **Do not store sensitive information in this field.** The name may be stored in logs, traces, metrics, etc.

### `cluster`

\_string_The name of the cluster.All brokers in the same cluster should have the same value. **Do not store sensitive information in this field.** The cluster path may be stored in keys, logs, traces, metrics, etc.

### `zone`

\_string_The location of the broker, e.g., the datacenter/rack/availability zone where the broker is running.If unspecified, the broker will attempt to resolve an availability zone from the host's metadata service. **Do not store sensitive information in this field.** The zone may be stored in keys, logs, traces, metrics, etc.

### `observability`

\_[`ObservabilityConfig`](#buf.bufstream.config.v1alpha1.ObservabilityConfig)\_Configuration of observability and debugging utilities exposed by the broker.

### `etcd`

\_[`EtcdConfig`](#buf.bufstream.config.v1alpha1.EtcdConfig)\_If specified, the broker will use etcd as the metadata storage of the cluster.

### `postgres`

\_[`PostgresConfig`](#buf.bufstream.config.v1alpha1.PostgresConfig)\_If specified, the broker will use Postgres as the metadata storage of the cluster.

### `spanner`

\_[`SpannerConfig`](#buf.bufstream.config.v1alpha1.SpannerConfig)\_If specified, the broker will use Google Cloud Spanner as the metadata storage of the cluster.

### `in_memory`

\_bool_If true, the broker will use an in-memory cache for metadata storage.This option is intended for local use and testing, and only works with single broker clusters.

### `auto_migrate_metadata_storage`

\_bool_If true, the broker will run migrations for the metadata storage on startup.Only one broker per cluster should have this option enabled.

### `storage`

\_[`StorageConfig`](#buf.bufstream.config.v1alpha1.StorageConfig)\_The data storage configuration.

### `actors`

\_list<[`Actor`](#buf.bufstream.config.v1alpha1.Actor)\>\_The actors that are enabled on this broker.If empty, all actors are enabled. This field is mutually exclusive with `disabled_actors`.

### `disabled_actors`

\_list<[`Actor`](#buf.bufstream.config.v1alpha1.Actor)\>\_The actors that are disabled on this broker.This field is mutually exclusive with `actors`.

### `dispatch`

\_[`DispatchConfig`](#buf.bufstream.config.v1alpha1.DispatchConfig)\_Configuration for dispatching of requests and data flow between brokers.

### `intake`

\_[`IntakeConfig`](#buf.bufstream.config.v1alpha1.IntakeConfig)\_Configuration for intake and processing of produced data.

### `cache`

\_[`CacheConfig`](#buf.bufstream.config.v1alpha1.CacheConfig)\_Configuration for caches maintained by the broker.

### `archive`

\_[`ArchiveConfig`](#buf.bufstream.config.v1alpha1.ArchiveConfig)\_Configuration for archiving and compaction performed by the broker.

### `kafka`

\_[`KafkaConfig`](#buf.bufstream.config.v1alpha1.KafkaConfig)\_Configuration for the Kafka interface.

### `data_enforcement`

\_[`DataEnforcementConfig`](#buf.bufstream.config.v1alpha1.DataEnforcementConfig)\_Configuration for data enforcement via schemas of records flowing in and out of the broker.

### `iceberg_integration`

\_[`IcebergIntegrationConfig`](#buf.bufstream.config.v1alpha1.IcebergIntegrationConfig)\_Configuration for Iceberg integration, for exposing Kafka topics as tables in Apache Iceberg v2 format.

### `available_memory_bytes`

\_uint64_The maximum amount of memory bufstream should consider usable.By default this is expected to be 4GiB per vCPU, as determined at startup. The configured value is not a hard limit, and is used to influence the default sizes of various caches. Explicitly setting a cache size elsewhere overrides any settings derived from this value.

### `labels`

\_map<string, string>\_Labels associated with the Bufstream broker.Labels may appear in logs, metrics, and traces.

### `connect_address`

\_[`HostPort`](#buf.bufstream.net.v1alpha1.HostPort)\_The address to listen on for inter-broker Connect RPCs.By default, brokers bind to a random, available port on localhost.

### `connect_public_address`

\_[`HostPort`](#buf.bufstream.net.v1alpha1.HostPort)\_The public address advertised to other brokers.This field should only be set if different from `connect_address`.

### `connect_tls`

\_[`ConnectTlsConfig`](#buf.bufstream.config.v1alpha1.ConnectTlsConfig)\_The TLS configuration for inter-broker Connect RPCs.By default TLS is not used.

### `admin_address`

\_[`HostPort`](#buf.bufstream.net.v1alpha1.HostPort)\_The address to listen on for Admin RPCs.

### `admin_tls`

\_[`TLSListenerConfig`](#buf.bufstream.config.v1alpha1.TLSListenerConfig)\_If populated, enables and enforces TLS termination on the Admin RPCs server.

### `connect_http_version`

\_[`ConnectHttpVersion`](#buf.bufstream.config.v1alpha1.ConnectHttpVersion)\_The HTTP version to use for inter-broker Connect RPCs.By default, HTTP/1.1 is used.

### `connect_isolation`

\_bool_Whether inter-broker Connect clients should be unique for reads and writes.Disabled by default. Recommended when using HTTP/2 in `connect_http_version`.

### `record_expiry_delay_max`

\_duration_How often to scan all owned partitions to (try to) delete expired records.Defaults to 6h.

### `fetch_sync_group_count`

\_int32_The number of 'groups' to cluster fetchers into for synchronization at the same log append time.Dynamically configurable as `bufstream.fetch.sync.group.count`.

### `data_dir`

\_string_Root directory where data is stored when the embedded etcd server is used or the storage provider is LOCAL_DISK. In all other cases, bufstream does not write data to disk.The default for Darwin and Linux is $XDG_DATA_HOME/bufstream if $XDG_DATA_HOME is set, otherwise $HOME/.local/share/bufstream.If Bufstream supports Windows in the future, the default will be %LocalAppData%\\bufstream.

## Sub-Messages

### `ObservabilityConfig`

Configuration for observability primitives

#### `log_level`

\_[`Level`](#buf.bufstream.log.v1alpha1.Log.Level)\_log level, defaults to INFO

#### `log_format`

\_[`Format`](#buf.bufstream.log.v1alpha1.Log.Format)\_log format, defaults to TEXT when connected to a terminal, otherwise JSON.

#### `log_git_version`

\_bool_If set, include "version=" in log output.

#### `metrics_exporter`

\_[`Exporter`](#buf.bufstream.config.v1alpha1.OTEL.Exporter)\_OpenTelemetry exporter for metrics, defaults to NONE. Deprecated: use metrics.exporter_type instead.

#### `metrics`

\_[`MetricsConfig`](#buf.bufstream.config.v1alpha1.MetricsConfig)\_Configuration for metrics.

#### `debug_address`

\_[`HostPort`](#buf.bufstream.net.v1alpha1.HostPort)\_If configured, pprof and prometheus exported metrics will be exposed on this address.

#### `trace_exporter`

\_[`Exporter`](#buf.bufstream.config.v1alpha1.OTEL.Exporter)\_OpenTelemetry exporter for traces, defaults to NONE. Deprecated: use traces.exporter_type instead.

#### `traces`

\_[`TracesConfig`](#buf.bufstream.config.v1alpha1.TracesConfig)\_Configuration for traces.

#### `trace_ratio`

\_float64_OpenTelemetry trace sample ratio, defaults to 1. Deprecated: use traces.trace_ratio instead.

#### `exporter`

\_[`ExporterDefaults`](#buf.bufstream.config.v1alpha1.ExporterDefaults)\_Default values for metrics and traces exporters.

#### `sensitive_information_redaction`

\_[`Redaction`](#buf.bufstream.config.v1alpha1.SensitiveInformationRedaction.Redaction)\_Redact sensitive information such as topic names, before adding to metrics, traces and logs.

### `EtcdConfig`

Configuration options specific to etcd metadata storage.

#### `addresses`

\_list<[`HostPort`](#buf.bufstream.net.v1alpha1.HostPort)\>\_The etcd node addresses.Currently, Bufstream assumes no path-prefix when connecting to the etcd cluster.

#### `session_ttl_seconds`

\_int32_The amount of time an etcd node can be unreachable before it is considered down.After this TTL, the broker's presence in the cluster is essentially lost. Currently, the broker will shutdown if this TTL is exceeded.

#### `tls`

\_[`TLSDialerConfig`](#buf.bufstream.config.v1alpha1.TLSDialerConfig)\_TLS configuration options for connecting to etcd. The empty value of this message means connecting to etcd cluster without TLS.

### `PostgresConfig`

Configuration options specific to postgres metadata storage.

#### `dsn`

\_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource) (required)\_DSN is the data source name or database URL used to configure connections to the database.

#### `cloud_sql_proxy`

\_[`CloudSQLProxy`](#buf.bufstream.config.v1alpha1.CloudSQLProxy)\_Configuration to connect to a Cloud SQL database. If set, the database will be dialed via the proxy.

#### `pool`

\_[`PostgresDBConnectionPool`](#buf.bufstream.config.v1alpha1.PostgresDBConnectionPool)\_Configuration settings for the database connection pool.

### `SpannerConfig`

Configuration options specific to Spanner metadata storage.

#### `project_id`

\_string (required)\_The Spanner project ID.

#### `instance_id`

\_string (required)\_The Spanner instance ID.

#### `database_name`

\_string_The Spanner database name.

### `StorageConfig`

Configuration options specific to data storage.

#### `provider`

\_[`Provider`](#buf.bufstream.config.v1alpha1.StorageConfig.Provider)\_The data storage provider.If unspecified, a provider is automatically resolved with the following heuristics:

- If `bucket` is set, we attempt to resolve metadata from the host
  - If the AWS metadata service responds, we assume `S3`
  - Otherwise, we assume `GCS`
- If `in_memory` is set on the root configuration, we assume `INLINE`
- Otherwise, we assume `LOCAL_DISK`

#### `region`

\_string_The region in which the `bucket` exists.This field defaults to the region of the broker's host.

#### `bucket`

\_string_The object storage bucket where data is stored.This field is required for `GCS` and `S3` providers.

#### `directory_bucket`

\_bool_If the bucket is a directory bucket.A directory bucket does not sort objects by path and only supports prefixes ending in `/`. See https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-buckets-overview.html

#### `prefix`

\_string_The path prefix of objects stored in the data storage.Defaults to `bufstream/`.This field is only used by the `GCS` and `S3` providers.

#### `endpoint`

\_string_The provider's HTTPS endpoint to use instead of the default.

#### `force_path_style`

\_bool_Enable path-based routing (instead of subdomains) for buckets.

#### `access_key_id`

\_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource)\_Specifies the AWS access key ID for authentication to the bucket.By default, authentication is performed using the metadata service of the broker's host. If set, `secret_access_key` must also be provided.

#### `secret_access_key`

\_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource)\_Specifies the AWS secret access key for authentication to the bucket.By default, authentication is performed using the metadata service of the broker's host. If set, `access_key_id` must also be provided.

#### `get_hedge_delay`

\_duration_How long before a GET request to the data storage provider is hedged with an additional request.Hedging improves p99 performance of requests to the storage provider. Defaults to 250ms.

#### `debug_logging`

\_[`Level`](#buf.bufstream.log.v1alpha1.Log.Level)\_Enables data storage debug logging at the specified level.This level must be equal to or higher than the level specified in `observability.log_level`.

#### `put_hedge_delay`

\_duration_Enables hedging of PUT requests to the data storage provider with the specified delay.Hedging of PUT requests should only be hedged for S3 and GCS providers.

#### `write_isolation`

\_bool_If writes should use the same clients as reads.By default, different clients are used between reads and writes.

### `DispatchConfig`

Configuration options specific to request dispatching and data flow between brokers.Dispatch controls Bufstream `<->` Bufstream communication and is used to improve the efficiency of a Bufstream cluster by fanning in requests for the same data to shared 'authoritative' brokers. For example, setting all `local_*` options to false, disables all Bufstream `<->` Bufstream communication.

#### `local_intake_cache`

\_bool_Whether the intake cache should be handled separately by each broker or dispatched to shared brokers.

#### `local_produce`

\_bool_Whether calls to produce records should be handled separately by each broker or dispatched to shared brokers.

#### `local_fetch_recent`

\_bool_Whether calls to fetch recent records should be handled separately by each broker or dispatched to shared brokers.

#### `local_fetch_archive`

\_bool_Whether calls to fetch archive records should be handled separately by each broker or dispatched to shared brokers.

#### `unavailable_retry_count`

\_int32_The number of retry attempts to make when an Unavailable error is encountered.When N, N retries, N+1 attempts in total.

### `IntakeConfig`

Configuration options specific to intake and processing of produced data.

#### `delay_max`

\_duration_The maximum delay to wait before writing an intake file.Dynamically configurable as `bufstream.intake.delay.max.ms`.

#### `delay_max_bytes`

\_int64_The maximum number of bytes to enqueue before writing an intake file.Dynamically configurable as `bufstream.intake.delay.max.bytes`.

#### `txn_timeout_max`

\_duration_The maximum timeout for all transactions.

#### `txn_timeout_default`

\_duration_The default timeout for a new transactions.

#### `log_append_time_difference_max`

\_duration_The maximum difference between intake write time and log append time.Dynamically configurable as `bufstream.intake.log.append.time.difference.max.ms`.

#### `recent_sequence_eager`

\_bool_Whether recent messages should be sequenced actively.When true, recent messages will be sequenced as soon as they are available. When false, recent messages will be sequenced only when requested.

#### `producer_id_batch_size`

\_int32_How many producer IDs a Bufstream process reserves at a time.

#### `file_delete_delay_max`

\_duration_How often to scan all intake files to (try to) delete old files.

#### `write_through_cache`

\_bool_Whether intake entries should be written through the cache.

#### `write_stream`

\_bool_Whether intake entries should be streamed when written.

#### `write_stream_chunk_bytes`

\_int32_The maximum number of bytes to write in a single intake write stream chunk.

#### `shelf_msg_max`

\_int32_The maximum number of recent messages to shelve in at a time.

#### `recent_msg_min`

\_int32_The minimum number of recent messages to keep for each topic/partition.

#### `end_txn_skew_max`

_duration_The maximum amount of time an end transaction request can appear to come \_before_ the last modification to the transaction.

#### `end_txn_revision_check`

\_bool_Whether to record the revision that the end transaction request was started at and to fail the request if the transaction changed while active since then.

#### `sequence_delay_max`

\_duration_The maximum delay to wait before sequencing a message.

#### `default_sequence_shard_count`

\_int32_The default number of sequence shards to use for new clusters.

### `CacheConfig`

Configuration options specific to the cache behavior of the broker.

#### `intake_max_bytes`

\_int64_The maximum number of intake file bytes to keep in memory.

#### `intake_load_max`

\_int32_The maximum number of intake files to load concurrently.No limit is enforced when set to 0.

#### `shelf_max_bytes`

\_int64_The maximum number of shelf bytes to keep in memory.

#### `archive_max_bytes`

\_int64_The maximum number of archive log entry bytes to keep in memory.

#### `fetch_record_max_bytes`

\_int64_The maximum number of record bytes fetched from recent or shelf messages to keep in memory.

#### `kafka_fetch_eager_max_bytes`

\_int64_The maximum number of record bytes to keep in memory for eagerly fetched records.

#### `producer_max`

\_int32_The maximum number of producers tracked per topic/partition. (May be exceeded due to other constraints.)Each topic/partition tracks the sequence number and transaction state for each producer writing to it.The sequence number may be forgotten for the least-recently-used producer, when this limit is exceeded.

#### `topic_max`

\_int32_The maximum number of topics to keep in memory.

### `ArchiveConfig`

Configuration options specific to the archiving of the broker.

#### `min_bytes`

\_int64_Determines when to start writing an archive for any topart.When -1, no archive ever starts. When 0, an archive starts as soon as a shelf write is detected (see start_delay_max) or a previous archive completes (unless the topic/partition was idle). When >0, an archive starts once the accumulation of that many bytes is detected (see start_delay_max) in the shelves.An archive completes when:

- It contains more than `max_bytes` (at a suitable data boundary).
- No new records are produced for `idle_max`. (The topic/partition is idle.)
- The archive is `upload_delay_max` old.

Dynamically configurable as `bufstream.archive.min.bytes`.

#### `max_bytes`

\_int64_The maximum size of an archive.Actually the threshold after which an archive is completed.Dynamically configurable as `bufstream.archive.max.bytes`.

#### `start_delay_max`

\_duration_How often to check a topic/partition to start a new archive.

#### `complete_delay_max`

\_duration_The maximum time before an archive upload is completed.Dynamically configurable as `bufstream.archive.complete.delay.max.ms`.

#### `idle_max`

\_duration_The duration to wait for more data before completing an archive.When 0, an archive completes as soon as there are no more records to archive. When >0, an archive completes after waiting this duration with no new records.Dynamically configurable as `bufstream.archive.idle.max.ms`.

#### `concurrent_max`

\_int32_The maximum number of topic/partitions to archive at once.When unset (or 0), the default limit is used. When -1, no limit is enforced. When >0, only that many topic/partitions are archived at once per broker.

#### `fetch_sync`

\_bool_Whether archive fetches should be synchronized to read at the same log append time.Dynamically configurable as `bufstream.archive.fetch.sync`.

#### `fetch_max_batches`

_int32_The maximum number of batches to fetch from an archive in a single request, per topic/partition.When set to 0, no maximum is enforced. When set to -1, no maximum is enforced \_and_ batches entirely before the requested offset may be returned by the server for performance reasons. These batches are ignored by the client.

#### `follow_active`

\_bool_Whether archive creation should try to read/write from the last active zone.The last active zone is the zone that most recently read the topic/partition. Or is no zone has read the topic/partition, the zone that most recently wrote to it.

#### `default_log_level`

\_[`Level`](#buf.bufstream.log.v1alpha1.Log.Level)\_The default log level for background archive operations.

#### `parquet_partition_granularity`

\_[`PartitionGranularity`](#buf.bufstream.config.v1alpha1.ArchiveConfig.PartitionGranularity)\_The granularity of partitions for Parquet files. Parquet files will be organized into a directory hierarchy to enable efficient pruning for time-based queries (compatible with Hive-style partitioning). The partitions are based on the ingestion timestamp. If unspecified, the default granularity is daily. Using a coarser granularity (i.e. monthly) is useful for low-volume topics, to enable reasonably large files (query systems generally prefer to operate on fewer, larger files instead of many small files). Finer granularity (i.e. hour) is for topics that are both high-volume and where queries are expected to frequently filter on intra-day timestamps.

### `KafkaConfig`

Configuration options specific to the broker's Kafka interface

#### `address`

\_[`HostPort`](#buf.bufstream.net.v1alpha1.HostPort)\_The address the Kafka server should listen on.Defaults to a random available port on localhost.

#### `public_address`

\_[`HostPort`](#buf.bufstream.net.v1alpha1.HostPort)\_The public address clients should use to connect to the Kafka server, if different from `address`.

#### `tls`

\_[`TLSListenerConfig`](#buf.bufstream.config.v1alpha1.TLSListenerConfig)\_If populated, enables and enforces TLS termination on the Kafka server.

#### `fetch_eager`

\_bool_If a fetch should return as soon as any records are available.When false, fetch wait for every topic/partition to be queried. When true, fetch returns as soon as any topic/partition has records, and the rest are fetched in the background under the assumption the client will try to fetch them in a subsequent request.Dynamically configurable as `bufstream.kafka.fetch.eager`.

#### `fetch_eager_offset_strategy`

\_[`FetchEagerOffsetStrategy`](#buf.bufstream.config.v1alpha1.KafkaConfig.FetchEagerOffsetStrategy)\_The strategy to use when no data is available for a topic partition.

#### `fetch_sync`

\_bool_If fetches from different readers should be synchronized to improve cache hit rates.Dynamically configurable as `bufstream.kafka.fetch.sync`.

#### `produce_concurrent`

\_bool_If records from a producer to different topic/partitions may be sequenced concurrently instead of serially.Dynamically configurable as `bufstream.kafka.produce.concurrent`.

#### `zone_balance_strategy`

\_[`BalanceStrategy`](#buf.bufstream.config.v1alpha1.KafkaConfig.BalanceStrategy)\_How to balance clients across zones, when then client does not specify a zone.Dynamically configurable as `bufstream.kafka.zone.balance.strategy`.

#### `partition_balance_strategy`

\_[`BalanceStrategy`](#buf.bufstream.config.v1alpha1.KafkaConfig.BalanceStrategy)\_How to balance topic/partitions across bufstream brokers.Dynamically configurable as `bufstream.kafka.partition.balance.strategy`.

#### `request_buffer_size`

\_uint32_The number of Kafka requests to unmarshal and buffer before processing.Defaults to 5.

#### `idle_timeout`

\_duration_How long a Kafka connection can be idle before being closed by the server.If set a value less than or equal to zero, the timeout will be disabled.

#### `request_timeout`

\_duration_The maximum amount of time to wait for a Kafka request to complete.If set a value less than or equal to zero, the default timeout will be used.

#### `num_partitions`

\_int32_The default number of partitions to use for a new topic.Dynamically configurable as `num.partitions`.

#### `exact_log_sizes`

\_bool_If exact log sizes should be fetched when listing sizes for all topics/partitions.

#### `exact_log_offsets`

\_bool_If exact log high water mark and start offsets should be computed when fetching records.

#### `distinct_hosts`

\_bool_If the casing of hostnames should be randomized per 'broker'.

#### `wait_for_latest`

\_bool_If 'broker' should ensure a topic/partition is fully loaded before serving.

#### `group_consumer_session_timeout`

\_duration_The default group consumer session timeout.Dynamically configurable as `group.consumer.session.timeout.ms`.

#### `group_consumer_session_timeout_min`

\_duration_The minimum group consumer session timeout.Dynamically configurable as `group.consumer.min.session.timeout.ms`.

#### `group_consumer_session_timeout_max`

\_duration_The maximum group consumer session timeout.Dynamically configurable as `group.consumer.max.session.timeout.ms`.

#### `shutdown_grace_period`

\_duration_The grace period to allow clients before shutting down.

#### `producer_request_timeout`

\_duration_The maximum period to wait for a producer RPC to complete.This includes:

- Produce
- EndTxn

Set lower than `request.timeout.ms` to mitigate race conditions in some clients that erroneously assume a timeout means the request was not processed.

#### `default_broker_count`

\_int32_The default number of brokers to report to clients.When set to zero, each bufstream broker is reported as a broker.

#### `group_consumer_offset_update_concurrent_max`

\_int32_The maximum number of consumer group offset updates to process concurrently.

#### `authentication`

\_[`AuthenticationConfig`](#buf.bufstream.config.v1alpha1.AuthenticationConfig)\_If populated, enables and enforces authentication.

### `DataEnforcementConfig`

Configuration of data enforcement policies applied to records.

#### `schema_registries`

\_list<[`SchemaRegistry`](#buf.bufstream.config.v1alpha1.SchemaRegistry)\>\_The schema registries used for data enforcement.

#### `produce`

\_list<[`DataEnforcementPolicy`](#buf.bufstream.config.v1alpha1.DataEnforcementPolicy)\>\_Policies to attempt to apply to produce requests. The first policy that matches the topic will be used. If none match, no data enforcement will occur.

#### `fetch`

\_list<[`DataEnforcementPolicy`](#buf.bufstream.config.v1alpha1.DataEnforcementPolicy)\>\_Policies to attempt to apply to fetch responses. The first policy that matches the topic will be used. If none match, no data enforcement will occur.

### `IcebergIntegrationConfig`

Configuration of Iceberg integration settings, for archiving Kafka topic data to Iceberg tables.

#### `catalogs`

\_list<[`IcebergCatalog`](#buf.bufstream.config.v1alpha1.IcebergCatalog)\>\_The catalogs that host Iceberg table metadata.

### `HostPort`

A network host and optional port pair.

#### `host`

\_string_A hostname or IP address to connect to or listen on.

#### `port`

\_uint32_The associated port. If unspecified, refer to the field documentation for default behavior.

### `ConnectTlsConfig`

#### `server_name`

\_string_The server name clients should use for TLS verification when connecting to this ConnectRPC server. If unset, the listener address will be used.

#### `server`

\_[`TLSListenerConfig`](#buf.bufstream.config.v1alpha1.TLSListenerConfig) (required)\_Enables and enforces TLS termination on the Connect server.

#### `client`

\_[`TLSDialerConfig`](#buf.bufstream.config.v1alpha1.TLSDialerConfig) (required)\_The TLS client configuration options for connecting to the other Bufstream brokers in the cluster.

### `TLSListenerConfig`

TLSListenerConfig is TLS/SSL configuration options for servers. At least one certificate must be specified.

#### `certificates`

\_list<[`Certificate`](#buf.bufstream.config.v1alpha1.Certificate)\>\_Certificates to present to the client. The first certificate compatible with the client's requirements is selected automatically.

#### `client_auth`

\_[`Type`](#buf.bufstream.config.v1alpha1.ClientAuth.Type)\_Declare the policy the server will follow for mutual TLS (mTLS).

#### `client_cas`

\_list<[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource)\>\_The PEM-encoded certificate authorities used by the server to validate the client certificates. This field cannot be empty if client_auth performs verification.

### `MetricsConfig`

Configuration for metrics.

#### `exporter_type`

\_[`ExporterType`](#buf.bufstream.config.v1alpha1.MetricsConfig.ExporterType)\_The type of exporter to use.

#### `address`

\_string_The endpoint for OTLP exporter, with a host name and an optional port number. If this is not set, it falls back to observability.exporter.address. If that is not set, it falls back to OTEL's default behavior, using the the host and port of OTEL_EXPORTER_OTLP_METRICS_ENDPOINT, if not found then OTEL_EXPORTER_OTLP_ENDPOINT and finally localhost:4318 for OTLP_HTTP or locahost:4317 for OTLP_GRPC.For OTLP_HTTP, metrics.path will be appended to this address.

#### `path`

\_string_This url path used by the OTLP_HTTP exporter, this defaults to "/v1/metrics". This is appended to the host and port of the endpoint that the exporter connects to.

#### `insecure`

\_bool_If set to true, TLS is disabled for the OTLP exporter.

#### `omit_partition_attribute`

\_bool_This omits metrics that depend on the kafka.topic.partition attribute, which may have high cardinality depending on the configuration. One example is kafka.topic.partition.offset.high_water_mark. This omits only the attribute for metrics that have this attribute without depending on it. One example is kafka.produce.record.size. Deprecated: use aggregation.partitions instead.

#### `enable_internal_metrics`

\_bool_Whether to emit `bufstream.internal.*` metrics.

#### `enable_labels`

\_map<string, [`LabelValueList`](#buf.bufstream.config.v1alpha1.LabelValueList)\>\_A map from label name to the allowed list of values for the label.Labels are custom key-value pairs that are added to logs, metrics, and traces.Keys have a minimum length of 1 character and a maximum length of 63 characters, and cannot be empty. Values can be empty, and have a maximum length of 63 characters.Keys and values can contain only lowercase letters, numeric characters, underscores, and dashes. All characters must use UTF-8 encoding, and international characters are allowed. Keys must start with a lowercase letter or international character.Labels can be specified in Kafka client ids (e.g. "my-client-id;label.foo=bar") or in topic configuration.Only labels in this list are added to metrics. If not set, no labels are added to metrics.

#### `aggregation`

\_[`Aggregation`](#buf.bufstream.config.v1alpha1.MetricsConfig.Aggregation)\_This option, typically set to reduce cardinality, aggregates some metrics over certain attributes, such as kafka.topic.name.

### `TracesConfig`

Configuration for traces.

#### `exporter_type`

\_[`ExporterType`](#buf.bufstream.config.v1alpha1.TracesConfig.ExporterType)\_The type of exporter to use.

#### `address`

\_string_The endpoint for OTLP exporter, with a host name and an optional port number. If this is not set, it falls back to observability.exporter.address. If that is not set, it falls back to the OTEL's default behavior, using the host and port of OTEL_EXPORTER_OTLP_TRACES_ENDPOINT, if not found then OTEL_EXPORTER_OTLP_ENDPOINT and finally localhost:4318 for OTLP_HTTP or locahost:4317 for OTLP_GRPC.For OTLP_HTTP, traces.path will be appended to this address.

#### `path`

\_string_This url path used by the OTLP_HTTP exporter, this defaults to "/v1/traces". This is appended to the host and port of the endpoint that the exporter connects to.

#### `insecure`

\_bool_If set to true, TLS is disabled for the OTLP exporter.

#### `trace_ratio`

\_float64_OpenTelemetry trace sample ratio, defaults to 1.

### `ExporterDefaults`

Default configuration for metrics and traces exporters.

#### `address`

\_string_The default base address used by OTLP_HTTP and OTLP_GRPC exporters, with a host name and an optional port number. For OTLP_HTTP, "/v1/{metrics, traces}" will be appended to this address, unless the path is overriden by metrics.path or traces.path. If port is unspecified, it defaults to 4317 for OTLP_GRPC and 4318 for OTLP_HTTP.

#### `insecure`

\_bool_If set to true, TLS is disabled for the OTLP exporter. This can be overwritten by metrics.insecure or traces.insecure.

### `TLSDialerConfig`

TLSDialerConfig is TLS/SSL configuration options for clients. The empty value of this message is a valid configuration for most applications.

#### `certificate`

\_[`Certificate`](#buf.bufstream.config.v1alpha1.Certificate)\_Certificate to present if client certificate verification is enabled on the server (i.e., mTLS).

#### `insecure_skip_verify`

\_bool_Controls whether a client verifies the server's certificate chain and host name. If true, the dialer accepts any certificate presented by the server and host name in that certificate. In this mode, TLS is susceptible to machine-in-the-middle attacks and should only be used for testing.

#### `root_cas`

\_list<[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource)\>\_The PEM-encoded root certificate authorities used by the client to validate the server certificates. If empty, the host's root CA set is used.

### `DataSource`

Configuration values sourced from various locations.

#### `path`

\_string_A file path to the data relative to the current working directory. Trailing newlines are stripped from the file contents.

#### `env_var`

\_string_An environment variable containing the data.

#### `string`

\_string_An inline string of the data.

#### `bytes`

\_base64-bytes_An inline byte blob of the data.

#### `encoding`

\_[`Encoding`](#buf.bufstream.config.v1alpha1.DataSource.Encoding)\_The encoding of the data source value. Defaults to PLAINTEXT.

### `CloudSQLProxy`

Configuration options specific to the Cloud SQL Proxy.

#### `icn`

\_string (required)\_ICN is the Cloud SQL instance's connection name, typically in the format "project-name:region:instance-name".

#### `iam`

\_bool_Use IAM auth to connect to the Cloud SQL database.

#### `private_ip`

\_bool_Use private IP to connect to the Cloud SQL database.

### `PostgresDBConnectionPool`

Configuration settings for the PostgreSQL connection pool.

#### `max_connections`

\_int32_The maximum size of the connection pool. Defaults to 10.

#### `min_connections`

\_int32_The minimum size of the connection pool. Defaults to 0.

### `AuthenticationConfig`

#### `sasl`

_[`SASLConfig`](#buf.bufstream.config.v1alpha1.SASLConfig)_

#### `mtls`

\_[`MutualTLSAuthConfig`](#buf.bufstream.config.v1alpha1.MutualTLSAuthConfig)\_If set, will use the configured mTLS for authentication.This acts as a fallback if SASL is also enabled.

#### `max_receive_bytes`

\_int64_The maximum receive size allowed before and during initial authentication. Default receive size is 512KB. Set to -1 for no limit.

### `SchemaRegistry`

A single schema registry used in data enforcement.

#### `name`

\_string_Name of this registry, used to disambiguate multiple registries used across policies.

#### `confluent`

\_[`CSRConfig`](#buf.bufstream.config.v1alpha1.CSRConfig)\_Confluent Schema Registry

### `DataEnforcementPolicy`

A set of policies to apply data enforcement rules on records flowing into or out Kafka.

#### `topics`

\_[`StringMatcher`](#buf.bufstream.config.v1alpha1.StringMatcher)\_Apply these policies only if the topic of the record(s) matches. If no topics are specified, the policy will always be applied.

#### `schema_registry`

\_string (required)\_The schema registry to use for retrieving schemas for this policy.

#### `keys`

\_[`Element`](#buf.bufstream.config.v1alpha1.DataEnforcementPolicy.Element)\_The policy to apply to a record's key. If unset, enforcement will not occur.

#### `values`

\_[`Element`](#buf.bufstream.config.v1alpha1.DataEnforcementPolicy.Element)\_The policy to apply to a record's value. If unset, enforcement will not occur.

### `IcebergCatalog`

A single catalog server, used to maintain an Iceberg table by updating its schema and adding and removing data files from the table.

#### `name`

\_string_Name of this catalog, used to disambiguate multiple catalogs used across topics and tables.

#### `rest`

\_[`RESTCatalogConfig`](#buf.bufstream.config.v1alpha1.RESTCatalogConfig)\_REST catalog. Valid table names must be in the form "namespace.table". The namespace may contain multiple components such as "ns1.ns2.ns3.table". The underlying catalog implementation that provides the REST API may impose further constraints on table and namespace naming.Also see https://github.com/apache/iceberg/blob/main/open-api/rest-catalog-open-api.yaml

#### `biglake_metastore`

\_[`BigLakeMetastoreConfig`](#buf.bufstream.config.v1alpha1.BigLakeMetastoreConfig)\_Google Cloud BigLake Metastore. Valid table names must be in the form "database.table".

#### `bigquery_metastore`

\_[`BigQueryMetastoreConfig`](#buf.bufstream.config.v1alpha1.BigQueryMetastoreConfig)\_Google Cloud BigQuery Metastore. Valid table names must be in the form "dataset.table". This catalog is still in Preview/Beta but is expected to eventually replace usages of Google Cloud BigLake Metastore.

### `Certificate`

A certificate chain and private key pair.

#### `chain`

\_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource) (required)\_The PEM-encoded leaf certificate, which may contain intermediate certificates following the leaf certificate to form a certificate chain.

#### `private_key`

\_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource) (required)\_The PEM-encoded (unencrypted) private key of the certificate chain.

### `Aggregation`

Configuration for metrics aggregation, taking precedence over senstive information redaction.

#### `topics`

_bool_Aggregate metrics across all topics to avoid cardinality issues with clusters with a large number of topics. Metrics that support this aggregation will report the 'kafka.topic.name' attribute as '\_all_topics_'. NOTE: This implies partitions aggregation, which omits metrics like 'bufstream.kafka.topic.partition.offset.high_water_mark'.

#### `partitions`

\_bool_Aggregate metrics across all parttions to avoid cardinality issues with clusters with a large number of partitions. Metrics that support aggregation will report the 'kafka.partition.id' attribute as -1, while some metrics, such as 'bufstream.kafka.topic.partition.offset.high_water_mark' will be omitted if partition level aggregation is enabled.

#### `consumer_groups`

_bool_Aggregate metrics across all consumer groups to avoid cardinality issues with clusters with a large number of groups. Metrics that support aggregation will report the 'kafka.consumer.group.id' as '\_all_groups_', while some metrics such as 'bufstream.kafka.consumer.group.generation' will be omitted if consumer group level aggregation is enabled.

#### `principal_ids`

_bool_Aggregate metrics across all authentication principals to avoid cardinality issues with clusters with a large number of principals. Metrics that support aggregation will report the 'authentication.principal_id' as '\_all_principal_ids_'.

### `SASLConfig`

#### `plain`

\_[`PlainMechanism`](#buf.bufstream.config.v1alpha1.PlainMechanism)\_Configuration for the PLAIN mechanism. See https://datatracker.ietf.org/doc/html/rfc4616.

#### `anonymous`

\_bool_Whether to accept ANONYMOUS as a mechanism. Not recommended. See https://datatracker.ietf.org/doc/html/rfc4505.

#### `scram`

\_[`SCRAMMechanism`](#buf.bufstream.config.v1alpha1.SCRAMMechanism)\_Configuration for the SCRAM-\* mechanisms. See https://datatracker.ietf.org/doc/html/rfc5802.

#### `oauth_bearer`

\_[`OAuthBearerMechanism`](#buf.bufstream.config.v1alpha1.OAuthBearerMechanism)\_Configuration for the OAUTHBEARER mechanism.

### `MutualTLSAuthConfig`

#### `principal_source`

\_[`PrincipalSource`](#buf.bufstream.config.v1alpha1.MutualTLSAuthConfig.PrincipalSource)\_Where to extract the principal from the client certificate.

### `CSRConfig`

Configuration for the Confluent Schema Registry (CSR) API.

#### `url`

\_string_Root URL (including protocol and any required path prefix) of the CSR API.

#### `instance_name`

\_string_Name of the CSR instance within the BSR. This name is used to disambiguate subjects of the same name within the same schema file. Used exclusively for schema coercion.

#### `tls`

\_[`TLSDialerConfig`](#buf.bufstream.config.v1alpha1.TLSDialerConfig)\_TLS configuration. If unset and the url field specifies https, a default configuration is used.

#### `basic_auth`

\_[`BasicAuth`](#buf.bufstream.config.v1alpha1.BasicAuth)\_Authenticate against the CSR API using basic auth credentials

### `StringMatcher`

Provides match rules to be applied to string values

#### `invert`

\_bool_Inverts the matching behavior (effectively "not").

#### `all`

\_bool_Matches all values; useful as a catch-all.

#### `equal`

\_string_Matches case-sensitively.

#### `in`

\_[`StringSet`](#buf.bufstream.config.v1alpha1.StringSet)\_Matches case-sensitively any of the values in the set.

### `Element`

Rules applied to either the key or value of a record.

#### `name_strategy`

\_[`SubjectNameStrategy`](#buf.bufstream.config.v1alpha1.Enforcement.SubjectNameStrategy)\_The strategy used to associate this element with the subject name when looking up the schema.

#### `coerce`

\_bool_If the element is not wrapped in the schema registries expected format and a schema is associated with it, setting this field to true will attempt to resolve a schema for the element and wrap it correctly.

#### `on_internal_error`

\_[`Action`](#buf.bufstream.config.v1alpha1.Enforcement.Action)\_The action to perform for internal errors (e.g., unavailability of the schema registry). If unset, the default behavior is REJECT_BATCH in produce and PASS_THROUGH in fetch.

#### `on_no_schema`

\_[`Action`](#buf.bufstream.config.v1alpha1.Enforcement.Action)\_The action to perform for elements that do not have a schema associated with them. If skip_parse is true, this action will apply if the message is not in the appropriate schema wire format. If unset, the default behavior is PASS_THROUGH.

#### `skip_parse`

\_bool_If true, will skip verifying that the schema applies to the element's contents. If set with coerce, coerced messages will be identified as the latest version of the element's schema and may be erroneous. Setting this field is mutually exclusive with validation and redaction.

#### `on_parse_error`

\_[`Action`](#buf.bufstream.config.v1alpha1.Enforcement.Action)\_The action to perform for elements that fail to parse with their associated schema. Fetch policies should not REJECT_BATCH to avoid blocking consumers.

#### `validation`

\_[`ValidationPolicy`](#buf.bufstream.config.v1alpha1.ValidationPolicy)\_If set, parsed messages will have semantic validation applied to them based off their schema.

#### `redaction`

\_[`RedactPolicy`](#buf.bufstream.config.v1alpha1.RedactPolicy)\_If set, parsed messages will have the specified fields redacted. For produce, this will result in data loss.

### `RESTCatalogConfig`

Configuration for the REST Iceberg catalog API.

#### `url`

\_string_Root URL (including protocol and any required path prefix) of the catalog server.

#### `uri_prefix`

\_string_Optional URI prefix. This is separate from any URI prefix present in `url`. This prefix appears after the "/v1/" API path component but before the remainder of the URI path.

#### `tls`

\_[`TLSDialerConfig`](#buf.bufstream.config.v1alpha1.TLSDialerConfig)\_TLS configuration. If unset and the url field specifies https, a default configuration is used.

#### `basic_auth`

\_[`BasicAuth`](#buf.bufstream.config.v1alpha1.BasicAuth)\_Authenticate against the Iceberg catalog using basic auth credentials.

#### `bearer_token`

\_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource)\_Authenticate against the Iceberg catalog with the given static bearer token (which could be a long-lived OAuth2 token).

#### `oauth2`

\_[`OAuth2Config`](#buf.bufstream.config.v1alpha1.OAuth2Config)\_Authenticate against the Iceberg catalog with the given OAuth2 configuration.

#### `sigv4`

\_[`AWSSigV4Config`](#buf.bufstream.config.v1alpha1.AWSSigV4Config)\_Authenticate against the Iceberg catalog using AWS Signature V4 request signing.

#### `jwt`

\_[`JWTConfig`](#buf.bufstream.config.v1alpha1.JWTConfig)\_Authenticate against the Iceberg catalog using JWTs.

### `BigLakeMetastoreConfig`

Configuration for using BigLake Metastore as an Iceberg catalog.

#### `project`

\_string_The GCP project of the BigLake Metastore. If empty, this is assumed to be the current project in which the bufstream workload is running.

#### `location`

\_string (required)\_The location of the BigLake Metastore. (Note that BigQuery can only access Metastore instances in the same location.)

#### `catalog`

\_string (required)\_The name of an Iceberg catalog in the Metastore.

### `BigQueryMetastoreConfig`

Configuration for using BigQuery Metastore as an Iceberg catalog.

#### `project`

\_string_The GCP project of the BigQuery Metastore. If empty, this is assumed to be the current project in which the bufstream workload is running.

#### `location`

\_string_The location for any BigQuery datasets that are created. Must be present if cloud_resource_connection is present. Otherwise, if absent, datasets cannot be auto-created, so any dataset referenced by an Iceberg table name must already exist.

#### `cloud_resource_connection`

\_string_The name of a BigQuery Cloud Resource connection. This is only the simple name of the connection, not the full name. Since a BigQuery dataset can only use connections in the same project and location, the full connection name (which includes its project and location) is not necessary.If absent, no override connection will be associated with created tables.

### `LabelValueList`

#### `values`

\_list`<string>`\_The list of values to allow for the label.If this is not set, all values are allowed.

### `PlainMechanism`

#### `credentials`

_list<[`BasicAuth`](#buf.bufstream.config.v1alpha1.BasicAuth)\>_

### `SCRAMMechanism`

#### `admin_credentials`

\_[`SCRAMCredentials`](#buf.bufstream.config.v1alpha1.SCRAMCredentials) (required)\_The admin's credentials boostrapped.

### `OAuthBearerMechanism`

#### `static`

\_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource)\_Static JWKS file or content.

#### `remote`

\_[`HttpsEndpoint`](#buf.bufstream.config.v1alpha1.OAuthBearerMechanism.HttpsEndpoint)\_An endpoint serving JWKS that is periodically refreshed.

#### `audience`

\_string_If provided, will match the 'aud' claim to this value.

#### `issuer`

\_string_If provided, will match the 'iss' claim to this value.

### `BasicAuth`

Basic Authentication username/password pair.

#### `username`

\_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource) (required)\_The source of the basicauth username.

#### `password`

\_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource) (required)\_The source of the basicauth password.

### `StringSet`

Effectively a wrapped `repeated string` to accomodate usage in a oneof or differentiating a null and empty list.

#### `values`

_list`<string>`_

### `ValidationPolicy`

The semantic validation rules applied to parsed elements during data enforcement.

#### `on_error`

\_[`Action`](#buf.bufstream.config.v1alpha1.Enforcement.Action)\_The action to perform if the element fails semantic validation defined in the schema. Fetch policies should not REJECT_BATCH to avoid blocking consumers.

### `RedactPolicy`

The redaction rules applied to parsed elements during data enforcement.

#### `fields`

\_[`StringMatcher`](#buf.bufstream.config.v1alpha1.StringMatcher)\_Strip fields with matching names.

#### `debug_redact`

\_bool_Strip fields from the element annotated with the debug_redact field option (proto only).

#### `shallow`

\_bool_By default, fields will be redacted recursively in the message. If shallow is set to true, only the top level fields will be evaluated.

### `OAuth2Config`

Configuration for a client using OAuth2 to generate access tokens for authenticating with a server.

#### `token_endpoint_url`

\_string_The URL of the token endpoint, used to provision access tokens for use with requests to the catalog. If not specified, this defaults to the catalog's base URL with "v1/oauth/tokens" appended to the URI path, which matches the URI of the endpoint as specified in the Iceberg Catalog's OpenAPI spec.

#### `scope`

\_string_The scope to request when provisioning an access token. If not specified, defaults to "catalog".

#### `client_id`

\_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource) (required)\_The credentials used to authenticate to the token endpoint.

#### `client_secret`

\_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource) (required)\_The credentials used to authenticate to the token endpoint.

#### `tls`

\_[`TLSDialerConfig`](#buf.bufstream.config.v1alpha1.TLSDialerConfig)\_Optional alternate TLS configuration for the token endpoint. If not specified, accessing the token endpoint will use the same TLS configuration as used for accessing other REST catalog endpoints. (See RESTCatalogConfig.tls).

### `AWSSigV4Config`

Configuration for a client to use AWS Signature V4 to authenticate with a server by signing the request contents.

#### `region`

\_string_The AWS region to indicate in the credential scope of the signature.This field defaults to the region of the broker's host.

#### `service`

\_string_The AWS service to indicate in the credential scope of the signature. The default service depends on how this configuration is used. For authenticating with an Iceberg REST catalog, it defaults to "execute-api".

#### `access_key_id`

\_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource)\_Specifies the AWS access key ID for authentication to the bucket.By default, authentication is performed using the metadata service of the broker's host. If set, `secret_access_key` must also be provided.

#### `secret_access_key`

\_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource)\_Specifies the AWS secret access key for authentication to the bucket.By default, authentication is performed using the metadata service of the broker's host. If set, `access_key_id` must also be provided.

### `JWTConfig`

Configuration for minting JWTs for authenticating with a server.

#### `alg`

\_[`JWTAlgorithm`](#buf.bufstream.config.v1alpha1.JWTAlgorithm) (required)\_Specifies the algorithm to use when generating a JWT.

#### `key`

\_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource) (required)\_Specifies the key used to sign JWTs. For HMAC keyed hashes, the value is a sequence of opaque bytes used as a shared secret. For the others (asymmetric digital signature algorithms), the value must be a PEM-encoded private key. The type of the key must match the configured algorithm.

#### `expiry`

\_duration_The duration after which a newly minted JWT will expire. If not specified and use_jti is not set, JWTs will default to a duration of one hour.

#### `use_jti`

\_bool_When set, JWTs will be used exactly once. Furthermore, each JWT will be assigned a unique ID, which servers can record to prevent re-use (and to more strongly prevent replay attacks). Note that this involves creating and signing a new JWT for every request, which will use extra CPU resources and can add latency to each request.

#### `issuer`

\_string (required)\_The issuer claim in the JWT.

#### `subject`

\_string (required)\_The subject claim in the JWT.

#### `audience`

\_string_The optional audience claim in the JWT.

### `SCRAMCredentials`

#### `username`

_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource) (required)_

#### `hash`

_[`HashFunction`](#buf.bufstream.config.v1alpha1.SCRAMCredentials.HashFunction)_

#### `plaintext`

_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource)_

#### `salted`

_[`SaltedPassword`](#buf.bufstream.config.v1alpha1.SCRAMCredentials.SaltedPassword)_

### `HttpsEndpoint`

#### `url`

\_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource)\_A HTTPS url for the JWKS file

#### `refresh_interval`

\_duration_The keys are loaded from the URL once on startup and cached. This controls the cache duration.Defaults to an hour. Set to a negative number to never refresh.

#### `tls`

\_[`TLSDialerConfig`](#buf.bufstream.config.v1alpha1.TLSDialerConfig)\_TLS configuration. If unset, a default configuration is used.

### `SaltedPassword`

#### `salted_password`

_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource) (required)_

#### `salt`

_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource) (required)_

#### `iterations`

_uint32_

## Enums

### `Actor`

The processes running in a Bufstream cluster.

#### `ACTOR_WRITER`

The writer accepts records for any topic/partition and fans them into intake files. It then asks a sequencer to append those records to the appropriate topic/partition.

#### `ACTOR_READER`

The reader combines information from sequencers and cashiers to provide a unified interface for fetching records from any topic/partition.

#### `ACTOR_SEQUENCER`

The sequencer:

- reads recent append requests from metadata storage and assigns offsets to them.
- collects the results of recently sequenced requests and saves them to object storage.
- combines intake records from object storage with results from memory to create 'FetchChunks'.

#### `ACTOR_CASHIER`

The cashier:

- reads intake files from object storage and serves the topic/partition specific chunks.
- reads archive data from object storage and serves the topic/partition specific chunks.

#### `ACTOR_CLEANER`

The cleaner:

- reads records from a sequencer and saves archives to object storage.
- tracks the oldest un-archived record for all topic/partitions in the cluster, and deletes intake files older than the oldest un-archived record.
- processes transactional consumer group offset updates.

### `ConnectHttpVersion`

HTTP version options used by ConnectRPC clients.

#### `CONNECT_HTTP_VERSION_1_1`

HTTP/1.1

#### `CONNECT_HTTP_VERSION_2_0`

HTTP/2

### `Level`

#### `DEBUG`

#### `INFO`

#### `WARN`

#### `ERROR`

### `Format`

#### `TEXT`

#### `JSON`

### `Exporter`

#### `NONE`

#### `STDOUT`

#### `HTTP`

#### `HTTPS`

#### `PROMETHEUS`

### `Redaction`

Redact sensitive information such as topic names, before adding to to metrics, traces and logs.

#### `REDACTION_UNSPECIFIED`

#### `NONE`

This shows sensitive information as is. For example, topic names will be included as attributes in metrics.

#### `OPAQUE`

This shows sensitive information as opaque strings. For example, topic IDs (UUIDs) will be included, instead of topic names.

### `Provider`

The provider options for data storage.

#### `S3`

AWS S3 or S3-compatible service (e.g., LocalStack)

#### `GCS`

GCP GCS service

#### `LOCAL_DISK`

Local, on-disk storageThis option is for debugging purposes and should only be used by clusters that share the same filesystem.

#### `INLINE`

Use metadata storage (e.g., in_memory or etcd).This option should only be used for testing purposes.

#### `AZURE`

Azure Blob Storage

### `PartitionGranularity`

The granularity of time-based partitioning of Parquet files.

#### `PARTITION_GRANULARITY_UNSPECIFIED`

#### `MONTHLY`

Files will be partitioned into yearly and monthly directories. E.g.: year=2025/month=1

#### `DAILY`

Files will be partitioned into yearly, monthly, and daily directories. E.g.: year=2025/month=1/day=15

#### `HOURLY`

Files will be partitioned into yearly, monthly, daily, and hourly directories. E.g.: year=2025/month=1/day=15/hour=23

### `FetchEagerOffsetStrategy`

#### `FETCH_EAGER_OFFSET_STRATEGY_FAKE`

Return fake offsets when no data is available.

#### `FETCH_EAGER_OFFSET_STRATEGY_CACHE`

Recturn cached offsets when no data is available.

#### `FETCH_EAGER_OFFSET_STRATEGY_LATEST`

Return latest offsets when no data is available.

### `BalanceStrategy`

Balance strategies for distributing client connections and partition assignments within the cluster.

#### `BALANCE_STRATEGY_PARTITION`

Balance based on a hash of the partition ID

#### `BALANCE_STRATEGY_HOST`

Balance based on a hash of the host name

#### `BALANCE_STRATEGY_CLIENT_ID`

Balance based on a hash of the client ID

### `Type`

#### `NO_CERT`

No client certificate will be requested during the handshake. If any certificates are sent, they will not be verified.

#### `REQUEST_CERT`

Server will request a client certificate during the handshake, but does not require that the client send any certificates. Any certificates sent will not be verified.

#### `REQUIRE_CERT`

Server requires clients to send any certificate during the handshake, but the certificate will not be verified.

#### `VERIFY_CERT_IF_GIVEN`

Server will request a client certificate during the handshake, but does not require that the client send any certificates. If the client does send a certificate, it must be valid.

#### `REQUIRE_AND_VERIFY_CERT`

Server will request and require clients to send a certificate during the handshake. The certificate is required to be valid.

### `ExporterType`

#### `NONE`

#### `STDOUT`

#### `OTLP_HTTP`

#### `OTLP_GRPC`

#### `PROMETHEUS`

### `ExporterType`

#### `NONE`

#### `STDOUT`

#### `OTLP_HTTP`

#### `OTLP_GRPC`

### `Encoding`

#### `PLAINTEXT`

Value is treated as-is.

#### `BASE64`

Value is treated as standard RFC4648 (not URL) base64-encoded with '=' padding.

### `PrincipalSource`

#### `ANONYMOUS`

Always set the principal to `User:Anonymous`, even if client doesn't provide a certificate.

#### `SUBJECT_COMMON_NAME`

The authenticated principal is the same as subject common name (CN) of the client certificate.

#### `SAN_DNS`

The authenticated principal is the first DNS Subject Alt Name.

#### `SAN_URI`

The authenticated principal is the first URI Subject Alt Name.

### `SubjectNameStrategy`

The strategy used to create the identifier (subject) used to lookup the schema of a record. Typically the strategy is derived from the topic name and which element (key or value) of the record is being deserialized.

#### `TOPIC_NAME_STRATEGY`

The default Confluent Schema Registry strategy, of the form "\-".

### `Action`

The action to perform when an error occurs.

#### `PASS_THROUGH`

Log and emit metrics on failure, but allow the record and its batch to pass through regardless. Useful for testing a new policy before rolling out to production.

#### `REJECT_BATCH`

Rejects the record batch containing the error, returning an error to the caller. This action should not be used with fetch responses, as rejecting batches on the fetch side will result in blocked consumers.

#### `FILTER_RECORD`

Filters out the record from the batch, while preserving the rest of the data. Note that this will result in data loss if used on the producer side. On the consumer side, invalid records will be skipped.

### `JWTAlgorithm`

Supported algorithms for computing a signature or keyed hash when creating a new JWT.

#### `ED25519`

The ED25519 algorithm. The JWT key must be an ED25519 private key.

#### `ECDSA_SHA256`

The ECDSA algorithm combined with SHA256. The JWT key must be an ECDSA private key.

#### `ECDSA_SHA384`

The ECDSA algorithm combined with SHA384. The JWT key must be an ECDSA private key.

#### `ECDSA_SHA512`

The ECDSA algorithm combined with SHA512. The JWT key must be an ECDSA private key.

#### `RSA_SHA256`

The RSA PKCS algorithm combined with SHA256. The JWT key must be an RSA private key.

#### `RSA_SHA384`

The RSA PKCS algorithm combined with SHA384. The JWT key must be an RSA private key.

#### `RSA_SHA512`

The RSA PKCS algorithm combined with SHA512. The JWT key must be an RSA private key.

#### `RSAPSS_SHA256`

The RSA PSS algorithm combined with SHA256. The JWT key must be an RSA private key.

#### `RSAPSS_SHA384`

The RSA PSS algorithm combined with SHA384. The JWT key must be an RSA private key.

#### `RSAPSS_SHA512`

The RSA PSS algorithm combined with SHA512. The JWT key must be an RSA private key.

#### `HMAC_SHA256`

The HMAC+SHA256 keyed hash algorithm. The JWT key is the binary shared secret.

#### `HMAC_SHA384`

The HMAC+SHA384 keyed hash algorithm. The JWT key is the binary shared secret.

#### `HMAC_SHA512`

The HMAC+SHA512 keyed hash algorithm. The JWT key is the binary shared secret.

### `HashFunction`

#### `HASH_FUNCTION_UNSPECIFIED`

#### `SHA256`

#### `SHA512`
