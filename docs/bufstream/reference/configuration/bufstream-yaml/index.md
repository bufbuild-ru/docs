---
description: "Enterprise-grade Kafka and gRPC for the modern age."

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
      content: "bufstream.yaml - Buf Docs"
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
      content: "bufstream.yaml - Buf Docs"
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

_string_

The name of this Bufstream broker.

Names should be unique for each broker in the cluster. Defaults to the hostname. **Do not store sensitive information in this field.** The name may be stored in logs, traces, metrics, etc.

### `cluster`

_string_

The name of the cluster.

All brokers in the same cluster should have the same value. **Do not store sensitive information in this field.** The cluster path may be stored in keys, logs, traces, metrics, etc.

### `zone`

_string_

The location of the broker, e.g., the datacenter/rack/availability zone where the broker is running.

If unspecified, the broker will attempt to resolve an availability zone from the host's metadata service. **Do not store sensitive information in this field.** The zone may be stored in keys, logs, traces, metrics, etc.

### `observability`

_[`ObservabilityConfig`](#buf.bufstream.config.v1alpha1.ObservabilityConfig)_

Configuration of observability and debugging utilities exposed by the broker.

### `etcd`

_[`EtcdConfig`](#buf.bufstream.config.v1alpha1.EtcdConfig)_

If specified, the broker will use etcd as the metadata storage of the cluster.

### `postgres`

_[`PostgresConfig`](#buf.bufstream.config.v1alpha1.PostgresConfig)_

If specified, the broker will use Postgres as the metadata storage of the cluster.

### `spanner`

_[`SpannerConfig`](#buf.bufstream.config.v1alpha1.SpannerConfig)_

If specified, the broker will use Google Cloud Spanner as the metadata storage of the cluster.

### `in_memory`

_bool_

If true, the broker will use an in-memory cache for metadata storage.

This option is intended for local use and testing, and only works with single broker clusters.

### `auto_migrate_metadata_storage`

_bool_

If true, the broker will run migrations for the metadata storage on startup.

### `storage`

_[`StorageConfig`](#buf.bufstream.config.v1alpha1.StorageConfig)_

The data storage configuration.

### `kafka`

_[`KafkaConfig`](#buf.bufstream.config.v1alpha1.KafkaConfig)_

Configuration for the Kafka interface.

### `data_enforcement`

_[`DataEnforcementConfig`](#buf.bufstream.config.v1alpha1.DataEnforcementConfig)_

Configuration for data enforcement via schemas of records flowing in and out of the broker.

### `iceberg`

_[`IcebergConfig`](#buf.bufstream.config.v1alpha1.IcebergConfig)_

Configuration for Iceberg integration, for exposing Kafka topics as tables in Apache Iceberg v2 format.

### `labels`

_map<string, string>_

Labels associated with the Bufstream broker.

Labels may appear in logs, metrics, and traces.

### `connect_address`

_[`HostPort`](#buf.bufstream.net.v1alpha1.HostPort)_

The address to listen on for inter-broker Connect RPCs.

By default, brokers bind to a random, available port on localhost.

### `admin_address`

_[`HostPort`](#buf.bufstream.net.v1alpha1.HostPort)_

The address to listen on for Admin RPCs.

### `admin_tls`

_[`TLSListenerConfig`](#buf.bufstream.config.v1alpha1.TLSListenerConfig)_

If populated, enables and enforces TLS termination on the Admin RPCs server.

### `data_dir`

_string_

Root directory where data is stored when the embedded etcd server is used or the storage provider is LOCAL_DISK. In all other cases, bufstream does not write data to disk.

The default for Darwin and Linux is $XDG_DATA_HOME/bufstream if $XDG_DATA_HOME is set, otherwise $HOME/.local/share/bufstream.

If Bufstream supports Windows in the future, the default will be %LocalAppData%\\bufstream.

## Sub-Messages

### `ObservabilityConfig`

Configuration for observability primitives

#### `log_level`

_[`Level`](#buf.bufstream.log.v1alpha1.Log.Level)_

log level, defaults to INFO

#### `metrics`

_[`MetricsConfig`](#buf.bufstream.config.v1alpha1.MetricsConfig)_

Configuration for metrics.

#### `debug_address`

_[`HostPort`](#buf.bufstream.net.v1alpha1.HostPort)_

If configured, pprof and prometheus exported metrics will be exposed on this address.

#### `traces`

_[`TracesConfig`](#buf.bufstream.config.v1alpha1.TracesConfig)_

Configuration for traces.

#### `exporter`

_[`ExporterDefaults`](#buf.bufstream.config.v1alpha1.ExporterDefaults)_

Default values for metrics and traces exporters.

#### `sensitive_information_redaction`

_[`Redaction`](#buf.bufstream.config.v1alpha1.SensitiveInformationRedaction.Redaction)_

Redact sensitive information such as topic names, before adding to metrics, traces and logs.

### `EtcdConfig`

Configuration options specific to etcd metadata storage.

#### `addresses`

_list<[`HostPort`](#buf.bufstream.net.v1alpha1.HostPort)\>_

The etcd node addresses.

Currently, Bufstream assumes no path-prefix when connecting to the etcd cluster.

### `PostgresConfig`

Configuration options specific to postgres metadata storage.

#### `dsn`

_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource) (required)_

DSN is the data source name or database URL used to configure connections to the database.

#### `cloud_sql_proxy`

_[`CloudSQLProxy`](#buf.bufstream.config.v1alpha1.CloudSQLProxy)_

Configuration to connect to a Cloud SQL database. If set, the database will be dialed via the proxy.

#### `pool`

_[`PostgresDBConnectionPool`](#buf.bufstream.config.v1alpha1.PostgresDBConnectionPool)_

Configuration settings for the database connection pool.

### `SpannerConfig`

Configuration options specific to Spanner metadata storage.

#### `project_id`

_string (required)_

The Spanner project ID.

#### `instance_id`

_string (required)_

The Spanner instance ID.

#### `database_name`

_string_

The Spanner database name.

### `StorageConfig`

Configuration options specific to data storage.

#### `provider`

_[`Provider`](#buf.bufstream.config.v1alpha1.StorageConfig.Provider)_

The data storage provider.

If unspecified, a provider is automatically resolved with the following heuristics:

- If `bucket` is set, we attempt to resolve metadata from the host
  - If the AWS metadata service responds, we assume `S3`
  - Otherwise, we assume `GCS`
- If `in_memory` is set on the root configuration, we assume `INLINE`
- Otherwise, we assume `LOCAL_DISK`

#### `region`

_string_

The region in which the `bucket` exists.

This field defaults to the region of the broker's host.

#### `bucket`

_string_

The object storage bucket where data is stored.

This field is required for `GCS` and `S3` providers.

#### `directory_bucket`

_bool_

If the bucket is a directory bucket.

A directory bucket does not sort objects by path and only supports prefixes ending in `/`. See https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-buckets-overview.html

#### `prefix`

_string_

The path prefix of objects stored in the data storage.

Defaults to `bufstream/`.

This field is only used by the `GCS` and `S3` providers.

#### `endpoint`

_string_

The provider's HTTPS endpoint to use instead of the default.

#### `force_path_style`

_bool_

Enable path-based routing (instead of subdomains) for buckets.

#### `access_key_id`

_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource)_

Specifies the AWS access key ID for authentication to the bucket.

By default, authentication is performed using the metadata service of the broker's host. If set, `secret_access_key` must also be provided.

#### `secret_access_key`

_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource)_

Specifies the AWS secret access key for authentication to the bucket.

By default, authentication is performed using the metadata service of the broker's host. If set, `access_key_id` must also be provided.

### `KafkaConfig`

Configuration options specific to the broker's Kafka interface

#### `address`

_[`HostPort`](#buf.bufstream.net.v1alpha1.HostPort)_

The address the Kafka server should listen on.

Defaults to a random available port on localhost.

#### `public_address`

_[`HostPort`](#buf.bufstream.net.v1alpha1.HostPort)_

The public address clients should use to connect to the Kafka server, if different from `address`.

#### `tls`

_[`TLSListenerConfig`](#buf.bufstream.config.v1alpha1.TLSListenerConfig)_

If populated, enables and enforces TLS termination on the Kafka server.

#### `fetch_eager`

_bool_

If a fetch should return as soon as any records are available.

When false, fetch wait for every topic/partition to be queried. When true, fetch returns as soon as any topic/partition has records, and the rest are fetched in the background under the assumption the client will try to fetch them in a subsequent request.

Dynamically configurable as `bufstream.kafka.fetch.eager`.

#### `fetch_sync`

_bool_

If fetches from different readers should be synchronized to improve cache hit rates.

Dynamically configurable as `bufstream.kafka.fetch.sync`.

#### `produce_concurrent`

_bool_

If records from a producer to different topic/partitions may be sequenced concurrently instead of serially.

Dynamically configurable as `bufstream.kafka.produce.concurrent`.

#### `zone_balance_strategy`

_[`BalanceStrategy`](#buf.bufstream.config.v1alpha1.KafkaConfig.BalanceStrategy)_

How to balance clients across zones, when then client does not specify a zone.

Dynamically configurable as `bufstream.kafka.zone.balance.strategy`.

#### `partition_balance_strategy`

_[`BalanceStrategy`](#buf.bufstream.config.v1alpha1.KafkaConfig.BalanceStrategy)_

How to balance topic/partitions across bufstream brokers.

Dynamically configurable as `bufstream.kafka.partition.balance.strategy`.

#### `num_partitions`

_int32_

The default number of partitions to use for a new topic.

Dynamically configurable as `num.partitions`.

#### `authentication`

_[`AuthenticationConfig`](#buf.bufstream.config.v1alpha1.AuthenticationConfig)_

If populated, enables and enforces authentication.

### `DataEnforcementConfig`

Configuration of data enforcement policies applied to records.

#### `schema_registries`

_list<[`SchemaRegistry`](#buf.bufstream.config.v1alpha1.SchemaRegistry)\>_

The schema registries used for data enforcement.

#### `produce`

_list<[`DataEnforcementPolicy`](#buf.bufstream.config.v1alpha1.DataEnforcementPolicy)\>_

Policies to attempt to apply to produce requests. The first policy that matches the topic will be used. If none match, no data enforcement will occur.

#### `fetch`

_list<[`DataEnforcementPolicy`](#buf.bufstream.config.v1alpha1.DataEnforcementPolicy)\>_

Policies to attempt to apply to fetch responses. The first policy that matches the topic will be used. If none match, no data enforcement will occur.

### `IcebergConfig`

Configuration of Iceberg integration settings, for archiving Kafka topic data to Iceberg tables.

#### `catalogs`

_list<[`IcebergCatalog`](#buf.bufstream.config.v1alpha1.IcebergCatalog)\>_

The catalogs that host Iceberg table metadata.

### `HostPort`

A network host and optional port pair.

#### `host`

_string_

A hostname or IP address to connect to or listen on.

#### `port`

_uint32_

The associated port. If unspecified, refer to the field documentation for default behavior.

### `TLSListenerConfig`

TLSListenerConfig is TLS/SSL configuration options for servers. At least one certificate must be specified.

#### `certificates`

_list<[`Certificate`](#buf.bufstream.config.v1alpha1.Certificate)\>_

Certificates to present to the client. The first certificate compatible with the client's requirements is selected automatically.

#### `client_auth`

_[`Type`](#buf.bufstream.config.v1alpha1.ClientAuth.Type)_

Declare the policy the server will follow for mutual TLS (mTLS).

#### `client_cas`

_list<[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource)\>_

The PEM-encoded certificate authorities used by the server to validate the client certificates. This field cannot be empty if client_auth performs verification.

### `MetricsConfig`

Configuration for metrics.

#### `exporter_type`

_[`ExporterType`](#buf.bufstream.config.v1alpha1.MetricsConfig.ExporterType)_

The type of exporter to use.

#### `address`

_string_

The endpoint for OTLP exporter, with a host name and an optional port number. If this is not set, it falls back to observability.exporter.address. If that is not set, it falls back to OTEL's default behavior, using the the host and port of OTEL_EXPORTER_OTLP_METRICS_ENDPOINT, if not found then OTEL_EXPORTER_OTLP_ENDPOINT and finally localhost:4318 for OTLP_HTTP or locahost:4317 for OTLP_GRPC.

For OTLP_HTTP, metrics.path will be appended to this address.

#### `path`

_string_

This url path used by the OTLP_HTTP exporter, this defaults to "/v1/metrics". This is appended to the host and port of the endpoint that the exporter connects to.

#### `insecure`

_bool_

If set to true, TLS is disabled for the OTLP exporter.

#### `enable_labels`

_map<string, [`LabelValueList`](#buf.bufstream.config.v1alpha1.LabelValueList)\>_

A map from label name to the allowed list of values for the label.

Labels are custom key-value pairs that are added to logs, metrics, and traces.

Keys have a minimum length of 1 character and a maximum length of 63 characters, and cannot be empty. Values can be empty, and have a maximum length of 63 characters.

Keys and values can contain only lowercase letters, numeric characters, underscores, and dashes. All characters must use UTF-8 encoding, and international characters are allowed. Keys must start with a lowercase letter or international character.

Labels can be specified in Kafka client ids (e.g. "my-client-id;label.foo=bar") or in topic configuration.

Only labels in this list are added to metrics. If not set, no labels are added to metrics.

#### `aggregation`

_[`Aggregation`](#buf.bufstream.config.v1alpha1.MetricsConfig.Aggregation)_

This option, typically set to reduce cardinality, aggregates some metrics over certain attributes, such as kafka.topic.name.

### `TracesConfig`

Configuration for traces.

#### `exporter_type`

_[`ExporterType`](#buf.bufstream.config.v1alpha1.TracesConfig.ExporterType)_

The type of exporter to use.

#### `address`

_string_

The endpoint for OTLP exporter, with a host name and an optional port number. If this is not set, it falls back to observability.exporter.address. If that is not set, it falls back to the OTEL's default behavior, using the host and port of OTEL_EXPORTER_OTLP_TRACES_ENDPOINT, if not found then OTEL_EXPORTER_OTLP_ENDPOINT and finally localhost:4318 for OTLP_HTTP or localhost:4317 for OTLP_GRPC.

For OTLP_HTTP, traces.path will be appended to this address.

#### `path`

_string_

This url path used by the OTLP_HTTP exporter, this defaults to "/v1/traces". This is appended to the host and port of the endpoint that the exporter connects to.

#### `insecure`

_bool_

If set to true, TLS is disabled for the OTLP exporter.

#### `trace_ratio`

_float64_

OpenTelemetry trace sample ratio, defaults to 1.

### `ExporterDefaults`

Default configuration for metrics and traces exporters.

#### `address`

_string_

The default base address used by OTLP_HTTP and OTLP_GRPC exporters, with a host name and an optional port number. For OTLP_HTTP, "/v1/{metrics, traces}" will be appended to this address, unless the path is overridden by metrics.path or traces.path. If port is unspecified, it defaults to 4317 for OTLP_GRPC and 4318 for OTLP_HTTP.

#### `insecure`

_bool_

If set to true, TLS is disabled for the OTLP exporter. This can be overwritten by metrics.insecure or traces.insecure.

### `DataSource`

Configuration values sourced from various locations.

#### `path`

_string_

A file path to the data relative to the current working directory. Trailing newlines are stripped from the file contents.

#### `env_var`

_string_

An environment variable containing the data.

#### `string`

_string_

An inline string of the data.

#### `bytes`

_base64-bytes_

An inline byte blob of the data.

#### `encoding`

_[`Encoding`](#buf.bufstream.config.v1alpha1.DataSource.Encoding)_

The encoding of the data source value. Defaults to PLAINTEXT.

### `CloudSQLProxy`

Configuration options specific to the Cloud SQL Proxy.

#### `icn`

_string (required)_

ICN is the Cloud SQL instance's connection name, typically in the format "project-name:region:instance-name".

#### `iam`

_bool_

Use IAM auth to connect to the Cloud SQL database.

#### `private_ip`

_bool_

Use private IP to connect to the Cloud SQL database.

### `PostgresDBConnectionPool`

Configuration settings for the PostgreSQL connection pool.

#### `max_connections`

_int32_

The maximum size of the connection pool. Defaults to 20.

#### `min_connections`

_int32_

The minimum size of the connection pool. Defaults to 0.

### `AuthenticationConfig`

#### `sasl`

_[`SASLConfig`](#buf.bufstream.config.v1alpha1.SASLConfig)_

#### `mtls`

_[`MutualTLSAuthConfig`](#buf.bufstream.config.v1alpha1.MutualTLSAuthConfig)_

If set, will use the configured mTLS for authentication.

This acts as a fallback if SASL is also enabled.

#### `max_receive_bytes`

_int64_

The maximum receive size allowed before and during initial authentication. Default receive size is 512KB. Set to -1 for no limit.

### `SchemaRegistry`

A single schema registry used in data enforcement.

#### `name`

_string_

Name of this registry, used to disambiguate multiple registries used across policies.

#### `confluent`

_[`CSRConfig`](#buf.bufstream.config.v1alpha1.CSRConfig)_

Confluent Schema Registry

### `DataEnforcementPolicy`

A set of policies to apply data enforcement rules on records flowing into or out Kafka.

#### `topics`

_[`StringMatcher`](#buf.bufstream.config.v1alpha1.StringMatcher)_

Apply these policies only if the topic of the record(s) matches. If no topics are specified, the policy will always be applied.

#### `schema_registry`

_string (required)_

The schema registry to use for retrieving schemas for this policy.

#### `keys`

_[`Element`](#buf.bufstream.config.v1alpha1.DataEnforcementPolicy.Element)_

The policy to apply to a record's key. If unset, enforcement will not occur.

#### `values`

_[`Element`](#buf.bufstream.config.v1alpha1.DataEnforcementPolicy.Element)_

The policy to apply to a record's value. If unset, enforcement will not occur.

### `IcebergCatalog`

A single catalog server, used to maintain an Iceberg table by updating its schema and adding and removing data files from the table.

#### `name`

_string_

Name of this catalog, used to disambiguate multiple catalogs used across topics and tables.

#### `rest`

_[`RESTCatalogConfig`](#buf.bufstream.config.v1alpha1.RESTCatalogConfig)_

REST catalog. Valid table names must be in the form "namespace.table". The namespace may contain multiple components such as "ns1.ns2.ns3.table". The underlying catalog implementation that provides the REST API may impose further constraints on table and namespace naming.

Also see https://github.com/apache/iceberg/blob/main/open-api/rest-catalog-open-api.yaml

#### `bigquery_metastore`

_[`BigQueryMetastoreConfig`](#buf.bufstream.config.v1alpha1.BigQueryMetastoreConfig)_

Google Cloud BigQuery Metastore. Valid table names must be in the form "dataset.table". This catalog is still in Preview/Beta but is expected to eventually replace usages of Google Cloud BigLake Metastore.

#### `aws_glue_data_catalog`

_[`AWSGlueDataCatalogConfig`](#buf.bufstream.config.v1alpha1.AWSGlueDataCatalogConfig)_

AWS Glue Data Catalog. Valid table names must be in the form "database.table".

### `Certificate`

A certificate chain and private key pair.

#### `chain`

_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource) (required)_

The PEM-encoded leaf certificate, which may contain intermediate certificates following the leaf certificate to form a certificate chain.

#### `private_key`

_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource) (required)_

The PEM-encoded (unencrypted) private key of the certificate chain.

### `Aggregation`

Configuration for metrics aggregation, taking precedence over sensitive information redaction.

#### `topics`

_bool_

Aggregate metrics across all topics to avoid cardinality issues with clusters with a large number of topics. Metrics that support this aggregation will report the `kafka.topic.name` attribute as `_all_topics_`. NOTE: This implies partitions aggregation, which omits metrics like `bufstream.kafka.topic.partition.offset.high_water_mark`.

#### `partitions`

_bool_

Aggregate metrics across all partitions to avoid cardinality issues with clusters with a large number of partitions. Metrics that support aggregation will report the `kafka.partition.id` attribute as -1, while some metrics, such as `bufstream.kafka.topic.partition.offset.high_water_mark` will be omitted if partition level aggregation is enabled.

#### `consumer_groups`

_bool_

Aggregate metrics across all consumer groups to avoid cardinality issues with clusters with a large number of groups. Metrics that support aggregation will report the `kafka.consumer.group.id` as `_all_groups_`, while some metrics such as `bufstream.kafka.consumer.group.generation` will be omitted if consumer group level aggregation is enabled.

#### `principal_ids`

_bool_

Aggregate metrics across all authentication principals to avoid cardinality issues with clusters with a large number of principals. Metrics that support aggregation will report the `authentication.principal_id` as `_all_principal_ids_`.

### `SASLConfig`

#### `plain`

_[`PlainMechanism`](#buf.bufstream.config.v1alpha1.PlainMechanism)_

Configuration for the PLAIN mechanism. See https://datatracker.ietf.org/doc/html/rfc4616.

#### `anonymous`

_bool_

Whether to accept ANONYMOUS as a mechanism. Not recommended. See https://datatracker.ietf.org/doc/html/rfc4505.

#### `scram`

_[`SCRAMMechanism`](#buf.bufstream.config.v1alpha1.SCRAMMechanism)_

Configuration for the SCRAM-\* mechanisms. See https://datatracker.ietf.org/doc/html/rfc5802.

#### `oauth_bearer`

_[`OAuthBearerMechanism`](#buf.bufstream.config.v1alpha1.OAuthBearerMechanism)_

Configuration for the OAUTHBEARER mechanism.

### `MutualTLSAuthConfig`

#### `principal_source`

_[`PrincipalSource`](#buf.bufstream.config.v1alpha1.MutualTLSAuthConfig.PrincipalSource)_

Where to extract the principal from the client certificate.

### `CSRConfig`

Configuration for the Confluent Schema Registry (CSR) API.

#### `url`

_string_

Root URL (including protocol and any required path prefix) of the CSR API.

#### `instance_name`

_string_

Name of the CSR instance within the BSR. This name is used to disambiguate subjects of the same name within the same schema file. Used exclusively for schema coercion.

#### `tls`

_[`TLSDialerConfig`](#buf.bufstream.config.v1alpha1.TLSDialerConfig)_

TLS configuration. If unset and the url field specifies https, a default configuration is used.

#### `basic_auth`

_[`BasicAuth`](#buf.bufstream.config.v1alpha1.BasicAuth)_

Authenticate against the CSR API using basic auth credentials

### `StringMatcher`

Provides match rules to be applied to string values

#### `invert`

_bool_

Inverts the matching behavior (effectively "not").

#### `all`

_bool_

Matches all values; useful as a catch-all.

#### `equal`

_string_

Matches case-sensitively.

#### `in`

_[`StringSet`](#buf.bufstream.config.v1alpha1.StringSet)_

Matches case-sensitively any of the values in the set.

### `Element`

Rules applied to either the key or value of a record.

#### `name_strategy`

_[`SubjectNameStrategy`](#buf.bufstream.config.v1alpha1.Enforcement.SubjectNameStrategy)_

The strategy used to associate this element with the subject name when looking up the schema.

#### `coerce`

_bool_

If the element is not wrapped in the schema registries expected format and a schema is associated with it, setting this field to true will attempt to resolve a schema for the element and wrap it correctly.

#### `on_internal_error`

_[`Action`](#buf.bufstream.config.v1alpha1.Enforcement.Action)_

The action to perform for internal errors (e.g., unavailability of the schema registry). If unset, the default behavior is REJECT_BATCH in produce and PASS_THROUGH in fetch.

#### `on_no_schema`

_[`Action`](#buf.bufstream.config.v1alpha1.Enforcement.Action)_

The action to perform for elements that do not have a schema associated with them. If skip_parse is true, this action will apply if the message is not in the appropriate schema wire format. If unset, the default behavior is PASS_THROUGH.

#### `skip_parse`

_bool_

If true, will skip verifying that the schema applies to the element's contents. If set with coerce, coerced messages will be identified as the latest version of the element's schema and may be erroneous. Setting this field is mutually exclusive with validation and redaction.

#### `on_parse_error`

_[`Action`](#buf.bufstream.config.v1alpha1.Enforcement.Action)_

The action to perform for elements that fail to parse with their associated schema. Fetch policies should not REJECT_BATCH to avoid blocking consumers.

#### `validation`

_[`ValidationPolicy`](#buf.bufstream.config.v1alpha1.ValidationPolicy)_

If set, parsed messages will have semantic validation applied to them based off their schema.

#### `redaction`

_[`RedactPolicy`](#buf.bufstream.config.v1alpha1.RedactPolicy)_

If set, parsed messages will have the specified fields redacted. For produce, this will result in data loss.

### `RESTCatalogConfig`

Configuration for the REST Iceberg catalog API.

#### `url`

_string_

Root URL (including protocol and any required path prefix) of the catalog server.

#### `uri_prefix`

_string_

Optional URI prefix. This is separate from any URI prefix present in `url`. This prefix appears after the "/v1/" API path component but before the remainder of the URI path.

#### `warehouse`

_string_

Optional warehouse location. Some REST catalogs require this property in the client's initial configuration requests.

#### `tls`

_[`TLSDialerConfig`](#buf.bufstream.config.v1alpha1.TLSDialerConfig)_

TLS configuration. If unset and the url field specifies https, a default configuration is used.

#### `basic_auth`

_[`BasicAuth`](#buf.bufstream.config.v1alpha1.BasicAuth)_

Authenticate against the Iceberg catalog using basic auth credentials.

#### `bearer_token`

_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource)_

Authenticate against the Iceberg catalog with the given static bearer token (which could be a long-lived OAuth2 token).

#### `oauth2`

_[`OAuth2Config`](#buf.bufstream.config.v1alpha1.OAuth2Config)_

Authenticate against the Iceberg catalog with the given OAuth2 configuration.

### `BigQueryMetastoreConfig`

Configuration for using BigQuery Metastore as an Iceberg catalog.

#### `project`

_string_

The GCP project of the BigQuery Metastore. If empty, this is assumed to be the current project in which the bufstream workload is running.

#### `location`

_string_

The location for any BigQuery datasets that are created. Must be present if cloud_resource_connection is present. Otherwise, if absent, datasets cannot be auto-created, so any dataset referenced by an Iceberg table name must already exist.

#### `cloud_resource_connection`

_string_

The name of a BigQuery Cloud Resource connection. This is only the simple name of the connection, not the full name. Since a BigQuery dataset can only use connections in the same project and location, the full connection name (which includes its project and location) is not necessary.

If absent, no override connection will be associated with created tables.

### `AWSGlueDataCatalogConfig`

Configuration for using AWS Glue Data Catalog as an Iceberg catalog.

#### `aws_account_id`

_string_

The AWS account ID of the AWS Glue catalog.

This is normally not necessary as it defaults to the account ID for the IAM user of the workload. But if the workload's credentials are not those of an IAM user or if the Glue catalog is defined in a different AWS account, then this must be specified.

#### `region`

_string_

The AWS region to indicate in the credential scope of the signature.

This field defaults to the region of the broker's host.

#### `access_key_id`

_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource)_

Specifies the AWS access key ID for authentication to the resource.

By default, authentication is performed using the metadata service of the broker's host. If set, `secret_access_key` must also be provided.

#### `secret_access_key`

_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource)_

Specifies the AWS secret access key for authentication to the resource.

By default, authentication is performed using the metadata service of the broker's host. If set, `access_key_id` must also be provided.

#### `session_token`

_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource)_

Specifies the AWS session token when using AWS temporary credentials to access the cloud resource. Omit when not using temporary credentials.

Temporary credentials are not recommended for production workloads, but can be useful in development and test environments to authenticate local processes with remote AWS resources.

This value should only be present when `access_key_id` and `secret_access_key` are also set.

### `LabelValueList`

#### `values`

_list`<string>`_

The list of values to allow for the label.

If this is not set, all values are allowed.

### `PlainMechanism`

#### `credentials`

_list<[`BasicAuth`](#buf.bufstream.config.v1alpha1.BasicAuth)\>_

### `SCRAMMechanism`

#### `admin_credentials`

_[`SCRAMCredentials`](#buf.bufstream.config.v1alpha1.SCRAMCredentials) (required)_

The admin's credentials boostrapped.

### `OAuthBearerMechanism`

#### `static`

_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource)_

Static JWKS file or content.

#### `remote`

_[`HttpsEndpoint`](#buf.bufstream.config.v1alpha1.OAuthBearerMechanism.HttpsEndpoint)_

An endpoint serving JWKS that is periodically refreshed.

#### `audience`

_string_

If provided, will match the 'aud' claim to this value.

#### `issuer`

_string_

If provided, will match the 'iss' claim to this value.

### `TLSDialerConfig`

TLSDialerConfig is TLS/SSL configuration options for clients. The empty value of this message is a valid configuration for most applications.

#### `insecure_skip_verify`

_bool_

Controls whether a client verifies the server's certificate chain and host name. If true, the dialer accepts any certificate presented by the server and host name in that certificate. In this mode, TLS is susceptible to machine-in-the-middle attacks and should only be used for testing.

### `BasicAuth`

Basic Authentication username/password pair.

#### `username`

_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource) (required)_

The source of the basicauth username.

#### `password`

_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource) (required)_

The source of the basicauth password.

### `StringSet`

Effectively a wrapped `repeated string` to accomodate usage in a oneof or differentiating a null and empty list.

#### `values`

_list`<string>`_

### `ValidationPolicy`

The semantic validation rules applied to parsed elements during data enforcement.

#### `on_error`

_[`Action`](#buf.bufstream.config.v1alpha1.Enforcement.Action)_

The action to perform if the element fails semantic validation defined in the schema. Fetch policies should not REJECT_BATCH to avoid blocking consumers.

### `RedactPolicy`

The redaction rules applied to parsed elements during data enforcement.

#### `fields`

_[`StringMatcher`](#buf.bufstream.config.v1alpha1.StringMatcher)_

Strip fields with matching names.

#### `debug_redact`

_bool_

Strip fields from the element annotated with the debug_redact field option (proto only).

#### `shallow`

_bool_

By default, fields will be redacted recursively in the message. If shallow is set to true, only the top level fields will be evaluated.

### `OAuth2Config`

Configuration for a client using OAuth2 to generate access tokens for authenticating with a server.

#### `token_endpoint_url`

_string_

The URL of the token endpoint, used to provision access tokens for use with requests to the catalog. If not specified, this defaults to the catalog's base URL with "v1/oauth/tokens" appended to the URI path, which matches the URI of the endpoint as specified in the Iceberg Catalog's OpenAPI spec.

#### `scope`

_string_

The scope to request when provisioning an access token. If not specified, defaults to "catalog".

#### `client_id`

_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource) (required)_

The credentials used to authenticate to the token endpoint.

#### `client_secret`

_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource) (required)_

The credentials used to authenticate to the token endpoint.

#### `tls`

_[`TLSDialerConfig`](#buf.bufstream.config.v1alpha1.TLSDialerConfig)_

Optional alternate TLS configuration for the token endpoint. If not specified, accessing the token endpoint will use the same TLS configuration as used for accessing other REST catalog endpoints. (See RESTCatalogConfig.tls).

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

_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource)_

A HTTPS url for the JWKS file

#### `refresh_interval`

_duration_

The keys are loaded from the URL once on startup and cached. This controls the cache duration.

Defaults to an hour. Set to a negative number to never refresh.

#### `tls`

_[`TLSDialerConfig`](#buf.bufstream.config.v1alpha1.TLSDialerConfig)_

TLS configuration. If unset, a default configuration is used.

### `SaltedPassword`

#### `salted_password`

_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource) (required)_

#### `salt`

_[`DataSource`](#buf.bufstream.config.v1alpha1.DataSource) (required)_

#### `iterations`

_uint32_

## Enums

### `Level`

#### `DEBUG`

#### `INFO`

#### `WARN`

#### `ERROR`

### `Redaction`

Redact sensitive information such as topic names, before adding to to metrics, traces and logs.

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

Local, on-disk storage

This option is for debugging purposes and should only be used by clusters that share the same filesystem.

#### `INLINE`

Use metadata storage (e.g., in_memory or etcd).

This option should only be used for testing purposes.

#### `AZURE`

Azure Blob Storage

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

### `HashFunction`

#### `SHA256`

#### `SHA512`
