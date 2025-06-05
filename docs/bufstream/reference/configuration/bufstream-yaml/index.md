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

::: info Annotated bufstream.yaml configuration

````yaml
# Type Reference:
# - value_1|value_2: A YAML string, either "value_1" or "value_2".
# - <bool>: A YAML boolean value, either true or false.
# - <int>: A YAML number for an integer value
# - <double>: A YAML number for a floating point value.
# - <string>: A YAML string value.
# - <hostport>: A YAML string containing a hostname with required port.
# - <data-source>: A YAML object with the following shape:
#   ```
#   # A file path to the data relative to the current working directory.
#   # Trailing newlines are stripped from the file contents.
#   path: <string>
#   # An environment variable containing the data.
#   env_var: <string>
#   # An inline string of the data.
#   string: <string>
#   # The encoding of the data source value. Defaults to PLAINTEXT.
#   encoding: PLAINTEXT|BASE64
#   ```

# The name of this Bufstream broker.
#
# Names should be unique for each broker in the cluster. Defaults to the
# hostname. **Do not store sensitive information in this field.** The name
# may be stored in logs, traces, metrics, etc.
name: <string>
# The name of the cluster.
#
# All brokers in the same cluster should have the same value. **Do not store
# sensitive information in this field.** The cluster path may be stored in
# keys, logs, traces, metrics, etc.
cluster: <string>
# The location of the broker, e.g., the datacenter/rack/availability zone
# where the broker is running.
#
# If unspecified, the broker will attempt to resolve an availability zone
# from the host's metadata service. **Do not store sensitive information in
# this field.** The zone may be stored in keys, logs, traces, metrics, etc.
zone: <string>

# Configuration of observability and debugging utilities exposed by the broker.
observability:
  # Log level, defaults to INFO.
  log_level: DEBUG|INFO|WARN|ERROR

  # Configuration for metrics.
  metrics:
    # The type of exporter to use.
    exporter_type: NONE|STDOUT|OTLP_HTTP|OTLP_GRPC|PROMETHEUS
    # The endpoint for OTLP exporter, with a host name and an optional port number.
    # If this is not set, it falls back to observability.exporter.address. If that is
    # not set, it falls back to OTEL's default behavior, using the the host and port
    # of OTEL_EXPORTER_OTLP_METRICS_ENDPOINT, if not found then OTEL_EXPORTER_OTLP_ENDPOINT
    # and finally localhost:4318 for OTLP_HTTP or locahost:4317 for OTLP_GRPC.
    #
    # For OTLP_HTTP, metrics.path will be appended to this address.
    #
    # May only be set if exporter_type is OTLP_HTTP or OTLP_GRPC.
    address: <hostport>
    # This url path used by the OTLP_HTTP exporter and defaults to "/v1/metrics".
    # This is appended to the host and port of the endpoint that the exporter connects to.
    #
    # May only be set if exporter_type is OTLP_HTTP.
    path: <string>
    # If set to true, TLS is disabled for the OTLP exporter.
    #
    # May only be set if exporter_type is OTLP_HTTP or OTLP_GRPC.
    insecure: <bool>
    # A map from label name to the allowed list of values for the label.
    #
    # Labels are custom key-value pairs that are added to logs, metrics, and traces.
    #
    # Keys have a minimum length of 1 character and a maximum length of 63 characters,
    # and cannot be empty. Values can be empty, and have a maximum length of 63 characters.
    #
    # Keys and values can contain only lowercase letters, numeric characters, underscores, and dashes.
    # All characters must use UTF-8 encoding, and international characters are allowed. Keys must
    # start with a lowercase letter or international character.
    #
    # Labels can be specified in Kafka client ids (e.g. "my-client-id;label.foo=bar") or
    # in topic configuration.
    #
    # Only labels in this list are added to metrics. If not set, no labels are added to metrics.
    enable_labels:
      foo:
        - <string>
    # This option, typically set to reduce cardinality, aggregates some metrics over certain attributes, such as kafka.topic.name.
    aggregation:
      # Aggregate metrics across all topics to avoid cardinality issues with clusters with a large number of topics.
      # Metrics that support this aggregation will report the 'kafka.topic.name' attribute as '_all_topics_'.
      # Note: This implies partitions aggregation, which omits metrics like 'bufstream.kafka.topic.partition.offset.high_water_mark'.
      topics: <bool>
      # Aggregate metrics across all partitions to avoid cardinality issues with clusters with a large number of partitions.
      # Metrics that support aggregation will report the 'kafka.partition.id' attribute as -1, while some metrics, such as
      # 'bufstream.kafka.topic.partition.offset.high_water_mark' will be omitted if partition level aggregation is enabled.
      partitions: <bool>
      # Aggregate metrics across all consumer groups to avoid cardinality issues with clusters with a large number of groups.
      # Metrics that support aggregation will report the 'kafka.consumer.group.id' as '_all_groups_', while some metrics
      # such as 'bufstream.kafka.consumer.group.generation' will be omitted if consumer group level aggregation is enabled.
      consumer_groups: <bool>
      # Aggregate metrics across all authentication principals to avoid cardinality issues with clusters with a large number
      # of principals. Metrics that support aggregation will report the 'authentication.principal_id' as '_all_principal_ids_'.
      principal_ids: <bool>

  # If configured, pprof and prometheus exported metrics will be exposed on this address.
  debug_address: <hostport>

  # Configuration for traces.
  traces:
    # The type of exporter to use.
    exporter_type: NONE|STDOUT|OTLP_HTTP|OTLP_GRPC
    # The endpoint for OTLP exporter, with a host name and an optional port number.
    # If this is not set, it falls back to observability.exporter.address. If that is
    # not set, it falls back to the OTEL's default behavior, using the host and port
    # of OTEL_EXPORTER_OTLP_TRACES_ENDPOINT, if not found then OTEL_EXPORTER_OTLP_ENDPOINT
    # and finally localhost:4318 for OTLP_HTTP or localhost:4317 for OTLP_GRPC.
    #
    # For OTLP_HTTP, traces.path will be appended to this address.
    #
    # May only be set if exporter_type is OTLP_HTTP or OTLP_GRPC.
    address: <hostport>
    # This url path used by the OTLP_HTTP exporter and defaults to "/v1/traces".
    # This is appended to the host and port of the endpoint that the exporter connects to.
    #
    # May only be set if exporter_type is OTLP_HTTP.
    path: <string>
    # If set to true, TLS is disabled for the OTLP exporter.
    #
    # May only be set if exporter_type is OTLP_HTTP or OTLP_GRPC.
    insecure: <bool>
    # OpenTelemetry trace sample ratio, defaults to 1.
    trace_ratio: <double>

  # Default values for metrics and traces exporters.
  exporter:
    # The default base address used by OTLP_HTTP and OTLP_GRPC exporters, with a
    # host name and an optional port number.
    # For OTLP_HTTP, "/v1/{metrics, traces}" will be appended to this address, unless
    # the path is overriden by metrics.path or traces.path.
    # If port is unspecified, it defaults to 4317 for OTLP_GRPC and 4318 for OTLP_HTTP.
    address: <hostport>
    # If set to true, TLS is disabled for the OTLP exporter.
    # This can be overwritten by metrics.insecure or traces.insecure.
    insecure: <bool>

  # Redact sensitive information such as topic names, before adding to metrics, traces and logs.
  sensitive_information_redaction: NONE|OPAQUE

# If specified, the broker will use etcd as the metadata storage of the cluster.
etcd:
  # The etcd node addresses.
  #
  # Currently, Bufstream assumes no path-prefix when connecting to
  # the etcd cluster.
  addresses:
    - <hostport>

# If specified, the broker will use Postgres as the metadata storage of the cluster.
postgres:
  # Dsn is the data source name or database URL used to configure connections
  # to the database.
  dsn: <data-source>

  # GCP CloudSqlProxy configuration to connect to a Cloud SQL database.
  # If set, the database will be dialed via the proxy.
  cloud_sql_proxy:
    # Icn is the Cloud SQL instance's connection name, typically in
    # the format "project-name:region:instance-name".
    icn: <data-source>
    # Use IAM auth to connect to the cloud sql database.
    iam: <bool>
    # Use private ip to connect to cloud sql database.
    private_ip: <bool>

# If specified, the broker will use Google Cloud Spanner as the metadata storage
# of the cluster.
spanner:
  # The Spanner project ID.
  project_id: <string>
  # The Spanner instance ID.
  instance_id: <string>
  # The Spanner database name.
  database_name: <string>

# If true, the broker will use an in-memory cache for metadata storage.
#
# This option is intended for local use and testing, and only works with
# single broker clusters.
in_memory: <bool>

# The data storage configuration.
storage:
  # The data storage provider.
  #
  # If unspecified, a provider is automatically resolved with the following heuristics:
  #
  # - If `bucket` is set, we attempt to resolve metadata from the host
  #     - If the AWS metadata service responds, we assume `S3`
  #     - Otherwise, we assume `GCS`
  # - If `in_memory` is set on the root configuration, we assume `INLINE`
  # - Otherwise, we assume `LOCAL_DISK`
  provider: S3|GCS|AZURE|LOCAL_DISK|INLINE
  # The region in which the `bucket` exists.
  #
  # This field defaults to the region of the broker's host.
  region: <string>
  # The object storage bucket where data is stored.
  #
  # This field is required for `S3`, `GCS`, and `AZURE` providers.
  bucket: <string>
  # The path prefix of objects stored in the data storage.
  #
  # Defaults to `bufstream/`.
  #
  # This field is required for `S3`, `GCS`, and `AZURE` providers.
  prefix: <string>
  # The provider's HTTPS endpoint to use instead of the default.
  endpoint: <string>
  # Enable path-based routing (instead of subdomains) for buckets.
  force_path_style: <bool>
  # Specifies the AWS access key ID for authentication to the bucket.
  #
  # By default, authentication is performed using the metadata service of the
  # broker's host. If set, `secret_access_key` must also be provided.
  access_key_id: <data-source>
  # Specifies the AWS secret access key for authentication to the bucket.
  #
  # By default, authentication is performed using the metadata service of the
  # broker's host. If set, `access_key_id` must also be provided.
  secret_access_key: <data-source>

# Configuration for the Kafka interface.
kafka:
  # The address the Kafka server should listen on.
  #
  # Defaults to a random available port on localhost.
  address: <hostport>
  # The public address clients should use to connect to the Kafka server, if different from `address`.
  public_address: <hostport>
  # If populated, enables and enforces TLS termination on the Kafka server.
  tls:
    # Certificates to present to the client. The first certificate compatible
    # with the client's requirements is selected automatically.
    certificates:
      # The PEM-encoded leaf certificate, which may contain intermediate certificates
      # following the leaf certificate to form a certificate chain.
      - chain: <data-source>
        # The PEM-encoded (unencrypted) private key of the certificate chain.
        private_key: <data-source>
    # Declare the policy the server will follow for mutual TLS (mTLS).
    client_auth: NO_CERT|REQUEST_CERT|REQUIRE_CERT|VERIFY_CERT_IF_GIVEN|REQUIRE_AND_VERIFY_CERT
    # The PEM-encoded certificate authorities used by the server to validate
    # the client certificates. This field cannot be empty if client_auth
    # performs verification.
    client_cas:
      - <data-source>
      - <data-source>
  # The default number of partitions to use for a new topic.
  #
  # Dynamically configurable as `num.partitions`.
  num_partitions: <int>
  # If populated, enables and enforces authentication.
  authentication:
    sasl:
      # Configuration for the PLAIN mechanism.
      # See https://datatracker.ietf.org/doc/html/rfc4616.
      plain:
        # Muat have at least one value if sasl is used.
        credentials:
          - username: <data-source>
            password: <data-source>
      # Whether to accept ANONYMOUS as a mechanism. Not recommended.
      # See https://datatracker.ietf.org/doc/html/rfc4505.
      anonymous: <bool>
      # Configuration for the SCRAM-* mechanisms.
      # See https://datatracker.ietf.org/doc/html/rfc5802.
      scram:
        # The admin's credentials bootstrapped.
        admin_credentials:
          username: <data-source>
          hash: SHA256|SHA512
          plaintext: <data-source>
          salted:
            salted_password: <data-source>
            salt: <data-source>
            iterations: <int>
      # Configuration for the OAUTHBEARER mechanism.
      oauth_bearer:
        # Supported signing algorithms:
        # - RS256, RS384, RS512
        # - ES256, ES384, ES512
        # - HS256, HS384, HS512
        # - EdDSA
        # Static JWKS file or content.
        static: <data-source>
        # An endpoint serving JWKS that is periodically refreshed.
        remote:
          # A HTTPS url for the JWKS file
          url: <data-source>
          # The keys are loaded from the URL once on startup and cached.
          # This controls the cache duration.
          #
          # Defaults to an hour. Set to a negative number to never refresh.
          refresh_interval: <duration>
          tls:
            # Controls whether a client verifies the server's certificate chain and host
            # name. If true, the dialer accepts any certificate presented by the server
            # and host name in that certificate. In this mode, TLS is susceptible to
            # machine-in-the-middle attacks and should only be used for testing.
            insecure_skip_verify: <bool>
        # If provided, will match the 'aud' claim to this value.
        audience: <string>
        # If provided, will match the 'iss' claim to this value.
        issuer: <string>
    # If set, will use the configured mTLS for authentication.
    #
    # This acts as a fallback if SASL is also enabled.
    mtls:
      # Where to extract the principal from the client certificate.
      principal_source: ANONYMOUS|SUBJECT_COMMON_NAME|SAN_DNS|SAN_URI
    # The maximum receive size allowed before and during initial authentication.
    # Default receive size is 512KB. Set to -1 for no limit.
    max_receive_bytes: <int>

# Configuration for data enforcement via schemas of records flowing in and
# out of the broker.
data_enforcement:
  # The schema registries used for data enforcement.
  schema_registries:
    # Name of this registry, used to disambiguate multiple registries used
    # across policies.
    name: <string>
    # Confluent Schema Registry
    confluent:
      # Root URL (including protocol and any required path prefix) of the CSR API.
      url: <string>
      # Name of the CSR instance within the BSR. This name is used to disambiguate
      # subjects of the same name within the same schema file. Used exclusively
      # for schema coercion.
      instance_name: <string>
      # TLS configuration. If unset and the url field specifies https, a default
      # configuration is used.
      tls:
        # Controls whether a client verifies the server's certificate chain and host
        # name. If true, the dialer accepts any certificate presented by the server
        # and host name in that certificate. In this mode, TLS is susceptible to
        # machine-in-the-middle attacks and should only be used for testing.
        insecure_skip_verify: <bool>
      # Authenticate against the CSR API using basic auth credentials.
      basic_auth:
        # The source of the basicauth username.
        username: <data-source>
        # The source of the basicauth password.
        password: <data-source>

  # Policies to attempt to apply to produce requests. The first policy that
  # matches the topic will be used. If none match, no data enforcement will
  # occur.
  produce:
    # If the element is not wrapped in the schema registries expected format
    # and a schema is associated with it, setting this field to true will
    # attempt to resolve a schema for the element and wrap it correctly.
    coerce: <bool>
    # The action to perform for internal errors (e.g., unavailability of the
    # schema registry). If unset, the default behavior is REJECT_BATCH in
    # produce and PASS_THROUGH in fetch.
    on_internal_error: PASS_THROUGH|REJECT_BATCH|FILTER_RECORD
    # The action to perform for elements that do not have a schema associated
    # with them. If skip_parse is true, this action will apply if the message
    # is not in the appropriate schema wire format. If unset, the default
    # behavior is PASS_THROUGH.
    on_no_schema: PASS_THROUGH|REJECT_BATCH|FILTER_RECORD
    # If true, will skip verifying that the schema applies to the element's
    # contents. If set with coerce, coerced messages will be identified as
    # the latest version of the element's schema and may be erroneous.
    # Setting this field is mutually exclusive with validation and redaction.
    skip_parse: <bool>
    # The action to perform for elements that fail to parse with their
    # associated schema. Fetch policies should not REJECT_BATCH to avoid
    # blocking consumers.
    on_parse_error: PASS_THROUGH|REJECT_BATCH|FILTER_RECORD
    # If set, parsed messages will have semantic validation applied to them
    # based off their schema.
    validation:
      # The action to perform if the element fails semantic validation defined in
      # the schema. Fetch policies should not REJECT_BATCH to avoid blocking
      # consumers.
      on_error: PASS_THROUGH|REJECT_BATCH|FILTER_RECORD
    # If set, parsed messages will have the specified fields redacted. For
    # produce, this will result in data loss.
    redaction:
      # Strip fields with matching names.
      fields:
        # Inverts the matching behavior (effectively "not").
        invert: <bool>
        # Matches all values; useful as a catch-all.
        all: <bool>
        # Matches case-sensitively.
        equal: <string>
        # Matches case-sensitively any of the values in the set.
        in:
          values:
            - foo1
            - foo2
      # Strip fields from the element annotated with the debug_redact field option
      # (proto only).
      debug_redact: <bool>
      # By default, fields will be redacted recursively in the message. If shallow
      # is set to true, only the top level fields will be evaluated.
      shallow: <bool>

  # Policies to attempt to apply to fetch responses. The first policy that
  # matches the topic will be used. If none match, no data enforcement will
  # occur.
  fetch:
    # If the element is not wrapped in the schema registries expected format
    # and a schema is associated with it, setting this field to true will
    # attempt to resolve a schema for the element and wrap it correctly.
    coerce: <bool>
    # The action to perform for internal errors (e.g., unavailability of the
    # schema registry). If unset, the default behavior is REJECT_BATCH in
    # produce and PASS_THROUGH in fetch.
    on_internal_error: PASS_THROUGH|REJECT_BATCH|FILTER_RECORD
    # The action to perform for elements that do not have a schema associated
    # with them. If skip_parse is true, this action will apply if the message
    # is not in the appropriate schema wire format. If unset, the default
    # behavior is PASS_THROUGH.
    on_no_schema: PASS_THROUGH|REJECT_BATCH|FILTER_RECORD
    # If true, will skip verifying that the schema applies to the element's
    # contents. If set with coerce, coerced messages will be identified as
    # the latest version of the element's schema and may be erroneous.
    # Setting this field is mutually exclusive with validation and redaction.
    skip_parse: <bool>
    # The action to perform for elements that fail to parse with their
    # associated schema. Fetch policies should not REJECT_BATCH to avoid
    # blocking consumers.
    on_parse_error: PASS_THROUGH|REJECT_BATCH|FILTER_RECORD
    # If set, parsed messages will have semantic validation applied to them
    # based off their schema.
    validation:
      # The action to perform if the element fails semantic validation defined in
      # the schema. Fetch policies should not REJECT_BATCH to avoid blocking
      # consumers.
      on_error: PASS_THROUGH|REJECT_BATCH|FILTER_RECORD
    # If set, parsed messages will have the specified fields redacted. For
    # produce, this will result in data loss.
    redaction:
      # Strip fields with matching names.
      fields:
        # Inverts the matching behavior (effectively "not").
        invert: <bool>
        # Matches all values; useful as a catch-all.
        all: <bool>
        # Matches case-sensitively.
        equal: <string>
        # Matches case-sensitively any of the values in the set.
        in:
          values:
            - <string>
      # Strip fields from the element annotated with the debug_redact field option
      # (proto only).
      debug_redact: <bool>
      # By default, fields will be redacted recursively in the message. If shallow
      # is set to true, only the top level fields will be evaluated.
      shallow: <bool>

# Configuration for Iceberg integration, for exposing Kafka topics as tables
# in Apache Iceberg v2 format.
iceberg:
  # Name of this catalog, used to disambiguate multiple catalogs used
  # across topics and tables.
  name: <string>
  # REST catalog. Valid table names must be in the form "namespace.table". The
  # namespace may contain multiple components such as "ns1.ns2.ns3.table". The
  # underlying catalog implementation that provides the REST API may impose
  # further constraints on table and namespace naming.
  #
  # Also see
  # https://github.com/apache/iceberg/blob/main/open-api/rest-catalog-open-api.yaml
  rest:
    # Root URL (including protocol and any required path prefix) of the catalog server.
    uri: <string>
    # Optional URI prefix. This is separate from any URI prefix present in `url`. This
    # prefix appears after the "/v1/" API path component but before the remainder of
    # the URI path.
    uri_prefix: <string>
    # Optional warehouse location. Some REST catalogs require this property in the
    # client's initial configuration requests.
    warehouse: <string>
    # TLS configuration. If unset and the url field specifies https, a default
    # configuration is used.
    tls:
      # Controls whether a client verifies the server's certificate chain and host
      # name. If true, the dialer accepts any certificate presented by the server
      # and host name in that certificate. In this mode, TLS is susceptible to
      # machine-in-the-middle attacks and should only be used for testing.
      insecure_skip_verify: <bool>
    # Authenticate against the Iceberg catalog using basic auth credentials.
    basic_auth:
      # The source of the basicauth username.
      username: <data-source>
      # The source of the basicauth password.
      password: <data-source>
    # Authenticate against the Iceberg catalog with the given static bearer token
    # (which could be a long-lived OAuth2 token).
    bearer_token: <data-source>
    # Authenticate against the Iceberg catalog with the given OAuth2 configuration.
    oauth2:
      # The URL of the token endpoint, used to provision access tokens for use with
      # requests to the catalog. If not specified, this defaults to the catalog's
      # base URL with "v1/oauth/tokens" appended to the URI path, which matches the
      # URI of the endpoint as specified in the Iceberg Catalog's OpenAPI spec.
      token_endpoint_url: <string>
      # The scope to request when provisioning an access token. If not specified,
      # defaults to "catalog".
      scope: <string>
      # The credentials used to authenticate to the token endpoint.
      client_id: <data-source>
      # The credentials used to authenticate to the token endpoint.
      client_secret: <data-source>
      # Optional alternate TLS configuration for the token endpoint. If not
      # specified, accessing the token endpoint will use the same TLS configuration
      # as used for accessing other REST catalog endpoints.
      # (See RESTCatalogConfig.tls).
      tls:
        # Controls whether a client verifies the server's certificate chain and host
        # name. If true, the dialer accepts any certificate presented by the server
        # and host name in that certificate. In this mode, TLS is susceptible to
        # machine-in-the-middle attacks and should only be used for testing.
        insecure_skip_verify: <bool>

  # Google Cloud BigQuery Metastore. Valid table names must be in the form
  # "dataset.table". This catalog is still in Preview/Beta but is expected
  # to eventually replace usages of Google Cloud BigLake Metastore.
  bigquery_metastore:
    # The GCP project of the BigQuery Metastore. If empty, this is assumed to be the
    # current project in which the bufstream workload is running.
    project: <string>
    # The location for any BigQuery datasets that are created. Must be present if
    # cloud_resource_connection is present. Otherwise, if absent, datasets cannot be
    # auto-created, so any dataset referenced by an Iceberg table name must already
    # exist.
    location: <string>
    # The name of a BigQuery Cloud Resource connection. This is only the simple name
    # of the connection, not the full name. Since a BigQuery dataset can only use
    # connections in the same project and location, the full connection name (which
    # includes its project and location) is not necessary.
    #
    # If absent, no override connection will be associated with created tables.
    cloud_resource_connection: <string>

  # AWS Glue Data Catalog. Valid table names must be in the form
  # "database.table".
  aws_glue_data_catalog:
    # The AWS account ID of the AWS Glue catalog.
    #
    # This is normally not necessary as it defaults to the account ID for the
    # IAM user of the workload. But if the workload's credentials are not those
    # of an IAM user or if the Glue catalog is defined in a different AWS
    # account, then this must be specified.
    aws_account_id: <string>
    # The AWS region to indicate in the credential scope of the signature.
    #
    # This field defaults to the region of the broker's host.
    region: <string>
    # Specifies the AWS access key ID for authentication to the resource.
    #
    # By default, authentication is performed using the metadata service of the
    # broker's host. If set, `secret_access_key` must also be provided.
    access_key_id: <data-source>
    # Specifies the AWS secret access key for authentication to the resource.
    #
    # By default, authentication is performed using the metadata service of the
    # broker's host. If set, `access_key_id` must also be provided.
    secret_access_key: <data-source>
    # Specifies the AWS session token when using AWS temporary credentials to
    # access the cloud resource. Omit when not using temporary credentials.
    #
    # Temporary credentials are not recommended for production workloads, but
    # can be useful in development and test environments to authenticate local
    # processes with remote AWS resources.
    #
    # This value should only be present when `access_key_id` and
    # `secret_access_key` are also set.
    session_token: <data-source>

# Labels associated with the Bufstream broker.
#
# Labels may appear in logs, metrics, and traces.
labels:
  <key>: <value>

# The address to listen on for inter-broker Connect RPCs.
#
# By default, brokers bind to a random, available port on localhost.
connect_address: <hostport>

# The address to listen on for Admin RPCs.
admin_address: <hostport>

admin_tls:
  # Certificates to present to the client. The first certificate compatible
  # with the client's requirements is selected automatically.
  certificates:
    # The PEM-encoded leaf certificate, which may contain intermediate certificates
    # following the leaf certificate to form a certificate chain.
    - chain: <data-source>
      # The PEM-encoded (unencrypted) private key of the certificate chain.
      private_key: <data-source>
  # Declare the policy the server will follow for mutual TLS (mTLS).
  client_auth: NO_CERT|REQUEST_CERT|REQUIRE_CERT|VERIFY_CERT_IF_GIVEN|REQUIRE_AND_VERIFY_CERT
  # The PEM-encoded certificate authorities used by the server to validate
  # the client certificates. This field cannot be empty if client_auth
  # performs verification.
  client_cas:
    - <data-source>

# Root directory where data is stored when the embedded etcd server is used or the
# storage provider is LOCAL_DISK.
# In all other cases, Bufstream does not write data to disk.
#
# The default for Darwin and Linux is $XDG_DATA_HOME/bufstream if $XDG_DATA_HOME is
# set, otherwise $HOME/.local/share/bufstream.
#
# If Bufstream supports Windows in the future, the default will be %LocalAppData%\bufstream.
data_dir: <string>
````

:::
