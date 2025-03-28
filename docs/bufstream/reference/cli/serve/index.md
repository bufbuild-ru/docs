# bufstream serve

Serve a Bufstream cluster

### Usage

```console
$ bufstream serve [flags]
```

### Description

A process that serves a Bufstream cluster.

### Flags

#### \--available-memory _uint_

Maximum memory available to the process.

#### \-c, --config _string_

Path to the config file.

#### \--config.actors _strings_

#### \--config.admin_address.host _string_

A hostname or IP address to connect to or listen on.

#### \--config.admin_address.port _uint32_

The associated port. If unspecified, refer to the field documentation for default behavior.

#### \--config.admin_tls.client_auth _string_

Declare the policy the server will follow for mutual TLS (mTLS).

#### \--config.archive.complete_delay_max _duration_

The maximum time before an archive upload is completed.

#### \--config.archive.concurrent_max _int32_

The maximum number of topic/partitions to archive at once.

#### \--config.archive.default_log_level _string_

The default log level for background archive operations.

#### \--config.archive.fetch_max_batches _int32_

The maximum number of batches to fetch from an archive in a single request, per topic/partition.

#### \--config.archive.fetch_sync

Whether archive fetches should be synchronized to read at the same log append time.

#### \--config.archive.follow_active

Whether archive creation should try to read/write from the last active zone.

#### \--config.archive.idle_max _duration_

The duration to wait for more data before completing an archive.

#### \--config.archive.max_bytes _int_

The maximum size of an archive.

#### \--config.archive.min_bytes _int_

Determines when to start writing an archive for any topart.

#### \--config.archive.parquet_partition_granularity _string_

The granularity of partitions for Parquet files. Parquet files will be organized into a directory hierarchy to enable efficient pruning for time-based queries (compatible with Hive-style partitioning). The partitions are based on the ingestion timestamp. If unspecified, the default granularity is daily. Using a coarser granularity (i.e. monthly) is useful for low-volume topics, to enable reasonably large files (query systems generally prefer to operate on fewer, larger files instead of many small files). Finer granularity (i.e. hour) is for topics that are both high-volume and where queries are expected to frequently filter on intra-day timestamps.

#### \--config.archive.start_delay_max _duration_

How often to check a topic/partition to start a new archive.

#### \--config.auto_migrate_metadata_storage

If true, the broker will run migrations for the metadata storage on startup.

#### \--config.available_memory_bytes _uint_

The maximum amount of memory bufstream should consider usable.

#### \--config.cache.archive_max_bytes _int_

The maximum number of archive log entry bytes to keep in memory.

#### \--config.cache.fetch_record_max_bytes _int_

The maximum number of record bytes fetched from recent or shelf messages to keep in memory.

#### \--config.cache.intake_load_max _int32_

The maximum number of intake files to load concurrently.

#### \--config.cache.intake_max_bytes _int_

The maximum number of intake file bytes to keep in memory.

#### \--config.cache.kafka_fetch_eager_max_bytes _int_

The maximum number of record bytes to keep in memory for eagerly fetched records.

#### \--config.cache.producer_max _int32_

The maximum number of producers tracked per topic/partition. (May be exceeded due to other constraints.)

#### \--config.cache.shelf_max_bytes _int_

The maximum number of shelf bytes to keep in memory.

#### \--config.cache.topic_max _int32_

The maximum number of topics to keep in memory.

#### \--config.cluster _string_

The name of the cluster.

#### \--config.connect_address.host _string_

A hostname or IP address to connect to or listen on.

#### \--config.connect_address.port _uint32_

The associated port. If unspecified, refer to the field documentation for default behavior.

#### \--config.connect_http_version _string_

The HTTP version to use for inter-broker Connect RPCs.

#### \--config.connect_isolation

Whether inter-broker Connect clients should be unique for reads and writes.

#### \--config.connect_public_address.host _string_

A hostname or IP address to connect to or listen on.

#### \--config.connect_public_address.port _uint32_

The associated port. If unspecified, refer to the field documentation for default behavior.

#### \--config.connect_tls.client.certificate.chain.bytes _bytesBase64_

An inline byte blob of the data. (base64)

#### \--config.connect_tls.client.certificate.chain.encoding _string_

The encoding of the data source value. Defaults to PLAINTEXT.

#### \--config.connect_tls.client.certificate.chain.env_var _string_

An environment variable containing the data.

#### \--config.connect_tls.client.certificate.chain.path _string_

A file path to the data relative to the current working directory. Trailing newlines are stripped from the file contents.

#### \--config.connect_tls.client.certificate.chain.string _string_

An inline string of the data.

#### \--config.connect_tls.client.certificate.private_key.bytes _bytesBase64_

An inline byte blob of the data. (base64)

#### \--config.connect_tls.client.certificate.private_key.encoding _string_

The encoding of the data source value. Defaults to PLAINTEXT.

#### \--config.connect_tls.client.certificate.private_key.env_var _string_

An environment variable containing the data.

#### \--config.connect_tls.client.certificate.private_key.path _string_

A file path to the data relative to the current working directory. Trailing newlines are stripped from the file contents.

#### \--config.connect_tls.client.certificate.private_key.string _string_

An inline string of the data.

#### \--config.connect_tls.client.insecure_skip_verify

Controls whether a client verifies the server's certificate chain and host name. If true, the dialer accepts any certificate presented by the server and host name in that certificate. In this mode, TLS is susceptible to machine-in-the-middle attacks and should only be used for testing.

#### \--config.connect_tls.server.client_auth _string_

Declare the policy the server will follow for mutual TLS (mTLS).

#### \--config.connect_tls.server_name _string_

The server name clients should use for TLS verification when connecting to this ConnectRPC server. If unset, the listener address will be used.

#### \--config.data_dir _string_

Root directory where data is stored when the embedded etcd server is used or the storage provider is LOCAL_DISK. In all other cases, bufstream does not write data to disk.

#### \--config.debug.checkpoint_error.read_error_probability _float32_

#### \--config.debug.checkpoint_error.write_error_probability _float32_

#### \--config.debug.cluster_error.read_error_probability _float32_

#### \--config.debug.cluster_error.write_error_probability _float32_

#### \--config.debug.consumer_offset_stride _int32_

#### \--config.debug.datastore_error.read_error_probability _float32_

#### \--config.debug.datastore_error.write_error_probability _float32_

#### \--config.debug.log_api_requests_regex _string_

#### \--config.debug.log_api_responses_regex _string_

#### \--config.disabled_actors _strings_

#### \--config.dispatch.local_fetch_archive

Whether calls to fetch archive records should be handled separately by each broker or dispatched to shared brokers.

#### \--config.dispatch.local_fetch_recent

Whether calls to fetch recent records should be handled separately by each broker or dispatched to shared brokers.

#### \--config.dispatch.local_intake_cache

Whether the intake cache should be handled separately by each broker or dispatched to shared brokers.

#### \--config.dispatch.local_produce

Whether calls to produce records should be handled separately by each broker or dispatched to shared brokers.

#### \--config.dispatch.unavailable_retry_count _int32_

The number of retry attempts to make when an Unavailable error is encountered.

#### \--config.etcd.session_ttl_seconds _int32_

The amount of time an etcd node can be unreachable before it is considered down.

#### \--config.etcd.tls.certificate.chain.bytes _bytesBase64_

An inline byte blob of the data. (base64)

#### \--config.etcd.tls.certificate.chain.encoding _string_

The encoding of the data source value. Defaults to PLAINTEXT.

#### \--config.etcd.tls.certificate.chain.env_var _string_

An environment variable containing the data.

#### \--config.etcd.tls.certificate.chain.path _string_

A file path to the data relative to the current working directory. Trailing newlines are stripped from the file contents.

#### \--config.etcd.tls.certificate.chain.string _string_

An inline string of the data.

#### \--config.etcd.tls.certificate.private_key.bytes _bytesBase64_

An inline byte blob of the data. (base64)

#### \--config.etcd.tls.certificate.private_key.encoding _string_

The encoding of the data source value. Defaults to PLAINTEXT.

#### \--config.etcd.tls.certificate.private_key.env_var _string_

An environment variable containing the data.

#### \--config.etcd.tls.certificate.private_key.path _string_

A file path to the data relative to the current working directory. Trailing newlines are stripped from the file contents.

#### \--config.etcd.tls.certificate.private_key.string _string_

An inline string of the data.

#### \--config.etcd.tls.insecure_skip_verify

Controls whether a client verifies the server's certificate chain and host name. If true, the dialer accepts any certificate presented by the server and host name in that certificate. In this mode, TLS is susceptible to machine-in-the-middle attacks and should only be used for testing.

#### \--config.fetch_sync_group_count _int32_

The number of 'groups' to cluster fetchers into for synchronization at the same log append time.

#### \--config.in_memory

If true, the broker will use an in-memory cache for metadata storage.

#### \--config.intake.default_sequence_shard_count _int32_

The default number of sequence shards to use for new clusters.

#### \--config.intake.delay_max _duration_

The maximum delay to wait before writing an intake file.

#### \--config.intake.delay_max_bytes _int_

The maximum number of bytes to enqueue before writing an intake file.

#### \--config.intake.end_txn_revision_check

Whether to record the revision that the end transaction request was started at and to fail the request if the transaction changed while active since then.

#### \--config.intake.end_txn_skew_max _duration_

The maximum amount of time an end transaction request can appear to come _before_ the last modification to the transaction.

#### \--config.intake.file_delete_delay_max _duration_

How often to scan all intake files to (try to) delete old files.

#### \--config.intake.log_append_time_difference_max _duration_

The maximum difference between intake write time and log append time.

#### \--config.intake.producer_id_batch_size _int32_

How many producer IDs a Bufstream process reserves at a time.

#### \--config.intake.recent_msg_min _int32_

The minimum number of recent messages to keep for each topic/partition.

#### \--config.intake.recent_sequence_eager

Whether recent messages should be sequenced actively.

#### \--config.intake.sequence_delay_max _duration_

The maximum delay to wait before sequencing a message.

#### \--config.intake.shelf_msg_max _int32_

The maximum number of recent messages to shelve in at a time.

#### \--config.intake.txn_timeout_default _duration_

The default timeout for a new transactions.

#### \--config.intake.txn_timeout_max _duration_

The maximum timeout for all transactions.

#### \--config.intake.write_stream

Whether intake entries should be streamed when written.

#### \--config.intake.write_stream_chunk_bytes _int32_

The maximum number of bytes to write in a single intake write stream chunk.

#### \--config.intake.write_through_cache

Whether intake entries should be written through the cache.

#### \--config.kafka.address.host _string_

A hostname or IP address to connect to or listen on.

#### \--config.kafka.address.port _uint32_

The associated port. If unspecified, refer to the field documentation for default behavior.

#### \--config.kafka.authentication.max_receive_bytes _int_

The maximum receive size allowed before and during initial authentication. Default receive size is 512KB. Set to -1 for no limit.

#### \--config.kafka.authentication.mtls.principal_source _string_

Where to extract the principal from the client certificate.

#### \--config.kafka.authentication.sasl.anonymous

Whether to accept ANONYMOUS as a mechanism. Not recommended. See https://datatracker.ietf.org/doc/html/rfc4505.

#### \--config.kafka.authentication.sasl.oauth_bearer.audience _string_

If provided, will match the 'aud' claim to this value.

#### \--config.kafka.authentication.sasl.oauth_bearer.issuer _string_

If provided, will match the 'iss' claim to this value.

#### \--config.kafka.authentication.sasl.oauth_bearer.remote.refresh_interval _duration_

#### \--config.kafka.authentication.sasl.oauth_bearer.remote.tls.certificate.chain.bytes _bytesBase64_

An inline byte blob of the data. (base64)

#### \--config.kafka.authentication.sasl.oauth_bearer.remote.tls.certificate.chain.encoding _string_

The encoding of the data source value. Defaults to PLAINTEXT.

#### \--config.kafka.authentication.sasl.oauth_bearer.remote.tls.certificate.chain.env_var _string_

An environment variable containing the data.

#### \--config.kafka.authentication.sasl.oauth_bearer.remote.tls.certificate.chain.path _string_

A file path to the data relative to the current working directory. Trailing newlines are stripped from the file contents.

#### \--config.kafka.authentication.sasl.oauth_bearer.remote.tls.certificate.chain.string _string_

An inline string of the data.

#### \--config.kafka.authentication.sasl.oauth_bearer.remote.tls.certificate.private_key.bytes _bytesBase64_

An inline byte blob of the data. (base64)

#### \--config.kafka.authentication.sasl.oauth_bearer.remote.tls.certificate.private_key.encoding _string_

The encoding of the data source value. Defaults to PLAINTEXT.

#### \--config.kafka.authentication.sasl.oauth_bearer.remote.tls.certificate.private_key.env_var _string_

An environment variable containing the data.

#### \--config.kafka.authentication.sasl.oauth_bearer.remote.tls.certificate.private_key.path _string_

A file path to the data relative to the current working directory. Trailing newlines are stripped from the file contents.

#### \--config.kafka.authentication.sasl.oauth_bearer.remote.tls.certificate.private_key.string _string_

An inline string of the data.

#### \--config.kafka.authentication.sasl.oauth_bearer.remote.tls.insecure_skip_verify

Controls whether a client verifies the server's certificate chain and host name. If true, the dialer accepts any certificate presented by the server and host name in that certificate. In this mode, TLS is susceptible to machine-in-the-middle attacks and should only be used for testing.

#### \--config.kafka.authentication.sasl.oauth_bearer.remote.url.bytes _bytesBase64_

An inline byte blob of the data. (base64)

#### \--config.kafka.authentication.sasl.oauth_bearer.remote.url.encoding _string_

The encoding of the data source value. Defaults to PLAINTEXT.

#### \--config.kafka.authentication.sasl.oauth_bearer.remote.url.env_var _string_

An environment variable containing the data.

#### \--config.kafka.authentication.sasl.oauth_bearer.remote.url.path _string_

A file path to the data relative to the current working directory. Trailing newlines are stripped from the file contents.

#### \--config.kafka.authentication.sasl.oauth_bearer.remote.url.string _string_

An inline string of the data.

#### \--config.kafka.authentication.sasl.oauth_bearer.static.bytes _bytesBase64_

An inline byte blob of the data. (base64)

#### \--config.kafka.authentication.sasl.oauth_bearer.static.encoding _string_

The encoding of the data source value. Defaults to PLAINTEXT.

#### \--config.kafka.authentication.sasl.oauth_bearer.static.env_var _string_

An environment variable containing the data.

#### \--config.kafka.authentication.sasl.oauth_bearer.static.path _string_

A file path to the data relative to the current working directory. Trailing newlines are stripped from the file contents.

#### \--config.kafka.authentication.sasl.oauth_bearer.static.string _string_

An inline string of the data.

#### \--config.kafka.authentication.sasl.scram.admin_credentials.hash _string_

#### \--config.kafka.authentication.sasl.scram.admin_credentials.plaintext.bytes _bytesBase64_

An inline byte blob of the data. (base64)

#### \--config.kafka.authentication.sasl.scram.admin_credentials.plaintext.encoding _string_

The encoding of the data source value. Defaults to PLAINTEXT.

#### \--config.kafka.authentication.sasl.scram.admin_credentials.plaintext.env_var _string_

An environment variable containing the data.

#### \--config.kafka.authentication.sasl.scram.admin_credentials.plaintext.path _string_

A file path to the data relative to the current working directory. Trailing newlines are stripped from the file contents.

#### \--config.kafka.authentication.sasl.scram.admin_credentials.plaintext.string _string_

An inline string of the data.

#### \--config.kafka.authentication.sasl.scram.admin_credentials.salted.iterations _uint32_

#### \--config.kafka.authentication.sasl.scram.admin_credentials.salted.salt.bytes _bytesBase64_

An inline byte blob of the data. (base64)

#### \--config.kafka.authentication.sasl.scram.admin_credentials.salted.salt.encoding _string_

The encoding of the data source value. Defaults to PLAINTEXT.

#### \--config.kafka.authentication.sasl.scram.admin_credentials.salted.salt.env_var _string_

An environment variable containing the data.

#### \--config.kafka.authentication.sasl.scram.admin_credentials.salted.salt.path _string_

A file path to the data relative to the current working directory. Trailing newlines are stripped from the file contents.

#### \--config.kafka.authentication.sasl.scram.admin_credentials.salted.salt.string _string_

An inline string of the data.

#### \--config.kafka.authentication.sasl.scram.admin_credentials.salted.salted_password.bytes _bytesBase64_

An inline byte blob of the data. (base64)

#### \--config.kafka.authentication.sasl.scram.admin_credentials.salted.salted_password.encoding _string_

The encoding of the data source value. Defaults to PLAINTEXT.

#### \--config.kafka.authentication.sasl.scram.admin_credentials.salted.salted_password.env_var _string_

An environment variable containing the data.

#### \--config.kafka.authentication.sasl.scram.admin_credentials.salted.salted_password.path _string_

A file path to the data relative to the current working directory. Trailing newlines are stripped from the file contents.

#### \--config.kafka.authentication.sasl.scram.admin_credentials.salted.salted_password.string _string_

An inline string of the data.

#### \--config.kafka.authentication.sasl.scram.admin_credentials.username.bytes _bytesBase64_

An inline byte blob of the data. (base64)

#### \--config.kafka.authentication.sasl.scram.admin_credentials.username.encoding _string_

The encoding of the data source value. Defaults to PLAINTEXT.

#### \--config.kafka.authentication.sasl.scram.admin_credentials.username.env_var _string_

An environment variable containing the data.

#### \--config.kafka.authentication.sasl.scram.admin_credentials.username.path _string_

A file path to the data relative to the current working directory. Trailing newlines are stripped from the file contents.

#### \--config.kafka.authentication.sasl.scram.admin_credentials.username.string _string_

An inline string of the data.

#### \--config.kafka.default_broker_count _int32_

The default number of brokers to report to clients.

#### \--config.kafka.distinct_hosts

If the casing of hostnames should be randomized per 'broker'.

#### \--config.kafka.exact_log_offsets

If exact log high water mark and start offsets should be computed when fetching records.

#### \--config.kafka.exact_log_sizes

If exact log sizes should be fetched when listing sizes for all topics/partitions.

#### \--config.kafka.fetch_eager

If a fetch should return as soon as any records are available.

#### \--config.kafka.fetch_eager_offset_strategy _string_

The strategy to use when no data is available for a topic partition.

#### \--config.kafka.fetch_sync

If fetches from different readers should be synchronized to improve cache hit rates.

#### \--config.kafka.group_consumer_offset_update_concurrent_max _int32_

The maximum number of consumer group offset updates to process concurrently.

#### \--config.kafka.group_consumer_session_timeout _duration_

The default group consumer session timeout.

#### \--config.kafka.group_consumer_session_timeout_max _duration_

The maximum group consumer session timeout.

#### \--config.kafka.group_consumer_session_timeout_min _duration_

The minimum group consumer session timeout.

#### \--config.kafka.idle_timeout _duration_

How long a Kafka connection can be idle before being closed by the server.

#### \--config.kafka.num_partitions _int32_

The default number of partitions to use for a new topic.

#### \--config.kafka.partition_balance_strategy _string_

How to balance topic/partitions across bufstream brokers.

#### \--config.kafka.produce_concurrent

If records from a producer to different topic/partitions may be sequenced concurrently instead of serially.

#### \--config.kafka.producer_request_timeout _duration_

The maximum period to wait for a producer RPC to complete.

#### \--config.kafka.public_address.host _string_

A hostname or IP address to connect to or listen on.

#### \--config.kafka.public_address.port _uint32_

The associated port. If unspecified, refer to the field documentation for default behavior.

#### \--config.kafka.request_buffer_size _uint32_

The number of Kafka requests to unmarshal and buffer before processing.

#### \--config.kafka.request_timeout _duration_

The maximum amount of time to wait for a Kafka request to complete.

#### \--config.kafka.shutdown_grace_period _duration_

The grace period to allow clients before shutting down.

#### \--config.kafka.tls.client_auth _string_

Declare the policy the server will follow for mutual TLS (mTLS).

#### \--config.kafka.wait_for_latest

If 'broker' should ensure a topic/partition is fully loaded before serving.

#### \--config.kafka.zone_balance_strategy _string_

How to balance clients across zones, when then client does not specify a zone.

#### \--config.name _string_

The name of this Bufstream broker.

#### \--config.observability.debug_address.host _string_

A hostname or IP address to connect to or listen on.

#### \--config.observability.debug_address.port _uint32_

The associated port. If unspecified, refer to the field documentation for default behavior.

#### \--config.observability.exporter.address _string_

The default base address used by OTLP_HTTP and OTLP_GRPC exporters, with a host name and an optional port number. For OTLP_HTTP, "/v1/{metrics, traces}" will be appended to this address, unless the path is overriden by metrics.path or traces.path. If port is unspecified, it defaults to 4317 for OTLP_GRPC and 4318 for OTLP_HTTP.

#### \--config.observability.exporter.insecure

If set to true, TLS is disabled for the OTLP exporter. This can be overwritten by metrics.insecure or traces.insecure.

#### \--config.observability.log_format _string_

log format, defaults to TEXT when connected to a terminal, otherwise JSON.

#### \--config.observability.log_git_version

If set, include "version=" in log output.

#### \--config.observability.log_level _string_

log level, defaults to INFO

#### \--config.observability.metrics.address _string_

The endpoint for OTLP exporter, with a host name and an optional port number. If this is not set, it falls back to observability.exporter.address. If that is not set, it falls back to OTEL's default behavior, using the the host and port of OTEL_EXPORTER_OTLP_METRICS_ENDPOINT, if not found then OTEL_EXPORTER_OTLP_ENDPOINT and finally localhost:4318 for OTLP_HTTP or locahost:4317 for OTLP_GRPC.

#### \--config.observability.metrics.aggregation.consumer_groups

#### \--config.observability.metrics.aggregation.partitions

#### \--config.observability.metrics.aggregation.principal_ids

#### \--config.observability.metrics.aggregation.topics

#### \--config.observability.metrics.enable_internal_metrics _bufstream.internal._\*

Whether to emit bufstream.internal.\* metrics.

#### \--config.observability.metrics.exporter_type _string_

The type of exporter to use.

#### \--config.observability.metrics.insecure

If set to true, TLS is disabled for the OTLP exporter.

#### \--config.observability.metrics.omit_partition_attribute

This omits metrics that depend on the kafka.topic.partition attribute, which may have high cardinality depending on the configuration. One example is kafka.topic.partition.offset.high_water_mark. This omits only the attribute for metrics that have this attribute without depending on it. One example is kafka.produce.record.size. Deprecated: use aggregation.partitions instead.

#### \--config.observability.metrics.path _string_

This url path used by the OTLP_HTTP exporter, this defaults to "/v1/metrics". This is appended to the host and port of the endpoint that the exporter connects to.

#### \--config.observability.metrics_exporter _string_

OpenTelemetry exporter for metrics, defaults to NONE. Deprecated: use metrics.exporter_type instead.

#### \--config.observability.sensitive_information_redaction _string_

Redact sensitive information such as topic names, before adding to metrics, traces and logs.

#### \--config.observability.trace_exporter _string_

OpenTelemetry exporter for traces, defaults to NONE. Deprecated: use traces.exporter_type instead.

#### \--config.observability.trace_ratio _float_

OpenTelemetry trace sample ratio, defaults to 1. Deprecated: use traces.trace_ratio instead.

#### \--config.observability.traces.address _string_

The endpoint for OTLP exporter, with a host name and an optional port number. If this is not set, it falls back to observability.exporter.address. If that is not set, it falls back to the OTEL's default behavior, using the host and port of OTEL_EXPORTER_OTLP_TRACES_ENDPOINT, if not found then OTEL_EXPORTER_OTLP_ENDPOINT and finally localhost:4318 for OTLP_HTTP or locahost:4317 for OTLP_GRPC.

#### \--config.observability.traces.exporter_type _string_

The type of exporter to use.

#### \--config.observability.traces.insecure

If set to true, TLS is disabled for the OTLP exporter.

#### \--config.observability.traces.path _string_

This url path used by the OTLP_HTTP exporter, this defaults to "/v1/traces". This is appended to the host and port of the endpoint that the exporter connects to.

#### \--config.observability.traces.trace_ratio _float_

OpenTelemetry trace sample ratio, defaults to 1.

#### \--config.record_expiry_delay_max _duration_

How often to scan all owned partitions to (try to) delete expired records.

#### \--config.spanner.database_name _string_

The Spanner database name.

#### \--config.spanner.instance_id _string_

The Spanner instance ID.

#### \--config.spanner.project_id _string_

The Spanner project ID.

#### \--config.storage.access_key_id.bytes _bytesBase64_

An inline byte blob of the data. (base64)

#### \--config.storage.access_key_id.encoding _string_

The encoding of the data source value. Defaults to PLAINTEXT.

#### \--config.storage.access_key_id.env_var _string_

An environment variable containing the data.

#### \--config.storage.access_key_id.path _string_

A file path to the data relative to the current working directory. Trailing newlines are stripped from the file contents.

#### \--config.storage.access_key_id.string _string_

An inline string of the data.

#### \--config.storage.bucket _string_

The object storage bucket where data is stored.

#### \--config.storage.debug_logging _string_

Enables data storage debug logging at the specified level.

#### \--config.storage.endpoint _string_

The provider's HTTPS endpoint to use instead of the default.

#### \--config.storage.force_path_style

Enable path-based routing (instead of subdomains) for buckets.

#### \--config.storage.get_hedge_delay _duration_

How long before a GET request to the data storage provider is hedged with an additional request.

#### \--config.storage.prefix _string_

The path prefix of objects stored in the data storage.

#### \--config.storage.provider _string_

The data storage provider.

#### \--config.storage.put_hedge_delay _duration_

Enables hedging of PUT requests to the data storage provider with the specified delay.

#### \--config.storage.region _bucket_

The region in which the bucket exists.

#### \--config.storage.secret_access_key.bytes _bytesBase64_

An inline byte blob of the data. (base64)

#### \--config.storage.secret_access_key.encoding _string_

The encoding of the data source value. Defaults to PLAINTEXT.

#### \--config.storage.secret_access_key.env_var _string_

An environment variable containing the data.

#### \--config.storage.secret_access_key.path _string_

A file path to the data relative to the current working directory. Trailing newlines are stripped from the file contents.

#### \--config.storage.secret_access_key.string _string_

An inline string of the data.

#### \--config.storage.write_isolation

If writes should use the same clients as reads.

#### \--config.zone _string_

The location of the broker, e.g., the datacenter/rack/availability zone where the broker is running.

#### \--etcd.address _strings_

Address(es) of an etcd cluster.

#### \-h, --help

help for serve

#### \--inmemory

Use in-memory storage.

#### \--nokafka

Disable the Kafka server.

### Parent Command

- [bufstream](../) - The Bufstream process.
