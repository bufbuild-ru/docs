---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/release-notes/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bufstream/reference/configuration/client-id-options/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/protovalidate/"
  - - meta
    - property: "og:title"
      content: "Release notes - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/release-notes.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/release-notes/"
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
      content: "Release notes - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/release-notes.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Release notes

## v0.3.23

**_Release date:_** 2025-04-30 | **_Status:_** latest

#### Bug fixes

- Partial rollback of [KIP-896](https://cwiki.apache.org/confluence/display/KAFKA/KIP-896%3A+Remove+old+client+protocol+API+versions+in+Kafka+4.0) deprecations for the Produce RPC. librdkafka clients (as of v2.10.0) [erroneously disable compression](https://github.com/confluentinc/librdkafka/issues/4956) if the minimum version of the Produce RPC isn't v0. This release reestablishes that minimum, but always returns an error for v0-v2 Produce RPCs.
- Fix Apache Iceberg™ [snapshot summary metrics](https://iceberg.apache.org/spec/#metrics) for deleted files and records. Previously, these metrics erroneously reflected the added files and records.
- Correct Apache Iceberg™ deletion flow to remove a Parquet file reference from the table metadata prior to removing the file from object storage. Previously, the cleanup process deleted the file before updating the table.
- Fix bug in data enforcement causing Produce responses to contain partial results. In order to fail open, the enforcement logic "cleans" the Produce request of any failed batches prior to handing it to the actual Kafka logic. However, the enforcement logic was erroneously removing batches without an assigned policy, causing them to be excluded from the result. This release corrects the behavior and ensures responses are complete.

#### Features and improvements

- Improve broker startup behavior when the metadata store is transitively unavailable. The previous behavior caused the broker to exit non-zero, requiring a restart. Now, brokers will retry with backoff to establish a connection to the store.
- Remove long-deprecated observability configuration options. Though the removed settings are no longer supported in the Bufstream config, the deprecated Helm values will remain supported until the next minor release.
- Additional performance improvements.

## v0.3.22

**_Release date:_** 2025-04-24

#### Bug fixes

- Raise limit on inter-broker connections causing head-of-line blocking

#### Features and improvements

- Reduce operations made to PostgreSQL via batching
- Optimize observability and error handling allocations
- Improve startup resiliency when metadata store is unavailable
- Point Helm chart and documentation at Docker Hub image
- Additional performance improvements

## v0.3.21

**_Release date:_** 2025-04-22

::: tip Note
**Breaking changes:** This release removes all of the `--config.*` CLI flags.
:::

#### Bug fixes

- Fix OffsetFetch response to conform to client expectations when a partition is unknown to a consumer group
- Allow old data enforcement validators to be evicted from the cache, freeing up their memory
- Fix a bug in SigV4 authorization for Iceberg REST catalogs
- Avoid erroneous logs when `fetch_eager` is disabled

#### Features and improvements

- Remove `--config.*` flags from `serve` and `migrate` commands
- Prevent PostgreSQL connection cycling when transactions are short-circuited
- Add additional tracing around the produce flow
- Reduce `bufstream` binary size by ~30MiB
- Additional performance improvements

## v0.3.20

**_Release date:_** 2025-04-16

#### Bug fixes

- Partial rollback of changes to in-flight gauges to avoid a deadlock
- Fix the PostgreSQL status probe query which would cause healthchecks to fail

## v0.3.19

**_Release date:_** 2025-04-15 | **_Status:_** archived*This release has been archived due to a permanent start-up bug when using PostgreSQL (other metadata stores are not impacted). All production workloads should upgrade to use version [0.3.20](#v0320).*

::: tip Note
**Breaking changes:** This release removes the following `serve` CLI command flags:

- `--available-memory`: Should be configured instead with `BUFSTREAM_AVAILABLE_MEMORY` or the Go runtime's `GOMEMLIMIT` environment variable
- `--etcd.address`: Only impacted the embedded etcd implementation
- `--nokafka`: Vestigial flag removed
  :::

#### Bug fixes

- Fix categorization of certain compound storage errors causing inaccurate observability labeling

#### Features and improvements

- Release preview of PostgreSQL support on AWS and GCP
- Reduce contention on the metadata service from idle partitions
- Minimize allocations from in-flight gauge metrics and storage key computations
- Remove `--available-memory`, `--etcd.address`, and `--nokafka` flags from `serve` command
- Additional performance improvements

## v0.3.18

**_Release date:_** 2025-04-08

#### Bug fixes

- Fix [KIP-724](https://issues.apache.org/jira/browse/KAFKA-12872) implementation to return an error instead of closing the connection when receiving legacy v0 or v1 message formats

#### Features and improvements

- Add bearer token and OAuth (including AWS SigV4 and JWT) support to REST Iceberg catalog integrations
- Instrument additional trace spans around Produce API flow
- Include client label attributes on request latency metrics
- Additional performance improvements

## v0.3.17

**_Release date:_** 2025-04-02

#### Bug fixes

- Match KIP-32 produce timestamp behavior and support `message.timestamp.difference.max.ms` config setting

#### Features and improvements

- Release preview of Microsoft Azure cloud support
- Additional performance improvements

## v0.3.16

**_Release date:_** 2025-03-27

#### Bug fixes

- Fix metrics aggregation on partition level

#### Features and improvements

- Update the Prometheus exporter's behavior to always use underscored metric names

## v0.3.15

**_Release date:_** 2025-03-25

#### Bug fixes

- Fix possible but rare infinite loop in archive cleaning
- Fix configuring the S3 endpoint in Bufstream's Helm chart values.

#### Features and improvements

- Improve robustness of handling unexpected Protocol Buffer data when writing to Parquet files
- Allow Iceberg™ tables to self-heal if there are errors during archiving
- Schema enforcement now ensures the specified schema ID on a record matches the subject/topic it's produced to
- Additional performance improvements

## v0.3.14

**_Release date:_** 2025-03-18

#### Bug fixes

- Fix `SASL/SCRAM` validation for usernames including `,` or `=`
- Fix `SASL/SCRAM` admin password normalization to match major clients' behavior

#### Features and improvements

- Add `kafka.partition` column to Parquet and Iceberg™ table schemas
- Set identifier fields of Iceberg™ tables as a composite of `kafka.partition` and `kafka.offset` fields
- Set sort order of Iceberg™ tables as a composite of `kafka.ingest_timestamp` and `kafka.offset` fields
- Support `delete` retention policies for Iceberg™ tables
- Update Kafka API version handling to better reflect our support matrix
- Additional performance improvements

## v0.3.13

**_Release date:_** 2025-03-11

#### Bug fixes

- Enhance validation of records to reject corrupted payloads sent by a producer

#### Features and improvements

- Significantly decrease read traffic to metadata storage
- Update Docker image to move `serve` subcommand to the `CMD` stanza
- Adjust intake cache size and memory usage to use more of the resources available on the host
- Optimize vacuuming of recently produced records post-archiving
- Add `kafka.authentication.max_receive_bytes` configuration option to limit request sizes prior to authentication
- Additional performance improvements

## v0.3.12

**_Release date:_** 2025-03-04

#### Bug fixes

- Fix zstd codec pooling to properly release resources when garbage collected
- Fix config validation to not fail when the metrics exporter address is unspecified
- Expanded `SASLHandshake` API minimum version to support librdkafka
- Cleanup spurious `SASL/SCRAM` logging

#### Features and improvements

- Add `OAUTH` mechanism to SASL authentication
- Decrease metadata storage read traffic by ~50%
- Improve usability and amount of data shown in the `bufstream client metadata` command
- Expand logs around data enforcement with more context to assist debugging
- Reduce string allocations in Kafka API deserialization
- Embedded etcd and local disk storage implementations now default to XDG directories
- Enhance archive creation to avoid offset overlaps between log files
- Additional performance improvements

## v0.3.11

**_Release date:_** 2025-02-28

#### Bug fixes

- Fix mTLS client authentication configuration in Helm chart values

## v0.3.10

**_Release date:_** 2025-02-25

#### Bug fixes

- Fix config validation on CreateTopics and AlterConfig APIs
- Properly error if `storage.endpoint` config value is set for the GCS provider
- Return correct response for non-error empty DescribeClientQuotas API responses
- Fail CSR-based parsing of records that are not Protocol Buffers if the `skip_parse` option is not enabled
- Avoid querying the CSR API for out-of-range schema IDs, typically due to malformed data

#### Features and improvements

- Release preview of mTLS and SASL authentication
- Release preview of Google Cloud Spanner metadata storage
- Switch to use enum logical type instead of int32 for enum fields in Parquet archives
- Include support for partitions in Apache Iceberg™ table archives
- Improve caching of consumer group metadata that is read often and written rarely
- Add more aggressive caching of schema registry lookups used by data enforcement
- Additional performance improvements

## v0.3.9

**_Release date:_** 2025-02-13

#### Bug fixes

- Fix regression in schema enforcement coercion behavior

#### Features and improvements

- Release preview of Apache Parquet and Iceberg™ archiving
- Reduce memory allocations when decoding compressed record batches
- Reduce memory allocations when marshaling Kafka protocol payloads
- Cache topic configurations on produce to minimize metadata queries
- Additional performance improvements

## v0.3.8

**_Release date:_** 2025-02-11

::: tip Note
Bufstream instances will now be referred to as "brokers" instead of "agents" in release notes, documentation, and logs.
:::

#### Bug fixes

- Fix several issues that would block graceful shutdown of a broker
- Fix panic in data enforcement when a fetch or produce policy is unset
- Return proper `INVALID_REQUEST` error code for Describe/Alter/IncrementalAlterConfig requests targeting unknown resource types

#### Features and improvements

- Added support for `compression.type` cluster and per-topic configuration to change archival compression mode
- Optimized (de)compression behavior for produced records to reduce CPU and memory usage
- Improved performance when creating and destroying a large number of topics sequentially
- Increased default reserved overhead memory and reduced default archival memory
- Set a `bufstream-<version>` user agent when making API calls to a schema registry
- Made `intake.sequence_delay_max` a runtime-configurable option via `bufstream.intake.sequence.delay.max.ms`
- Limited Metadata responses to brokers in the client's zone to minimize cross-zone administrative operations
- Normalized S3 client logs to use same logging mechanism as the rest of Bufstream
- Reduced excessive DEBUG level and S3 SDK log spam
- Additional performance improvements

## v0.3.7

**_Release date:_** 2025-01-28

::: tip Note
Clusters on v0.1.x must first upgrade to a v0.2.x release before upgrading to this or any later release.
:::

#### Bug fixes

- Fixed archive timestamp calculation when intake files need to be deleted
- Fixed rare data race where shelving would compete with incomplete transactions in a sequence
- Fixed malformed `nonce` log attributes
- Treat concurrent archiving as success instead of an error

#### Features and improvements

- Updated archive storage key format
- Added `kafka.consumer.group.id` attribute to `bufstream.kafka.request.count` metrics for Kafka APIs that operate against consumer groups
- Support adding `label.<name>=<value>` to a Kafka client ID to expose it as an attribute on the `bufstream.kafka.request.count` metric and logs associated with the client (labels must be opted-in via the Bufstream config)
- Improved performance when deleting topics
- Increase concurrency of intake fetches used by partition sequencing
- Minimize metadata changes required to add multiple partitions to a transaction
- Improve performance of intake vacuuming via increased concurrency and skipping noop calculations
- Allow changing the archive concurrency via the `bufstream.archive.concurrent.max` runtime configuration option
- Added `admin clean intake` to Bufstream CLI
- `admin` commands that take `topic` flags may optionally specify partitions and ranges with the format `<topic_name>:<partition_index>` or `<topic_name>:<start_index>-<end_index>` (inclusive)

## v0.3.6

**_Release date:_** 2025-01-14

#### Bug fixes

- Fix fetching from compacted topics containing offset gaps (introduced by pre-v0.2.0 bugs or from retention-deletions)
- Rate-limit internal administrative tasks to prevent OOM-ing the broker

#### Features and improvements

- Introduce `bufstream admin repair topics` command to detect and fix errors
- Move `bufstream admin clean-topics` to `bufstream admin clean topics`
- Include `bufstream.storage.keys` and `bufstream.storage.bytes` metrics for the metadata storage
- Rename `*.errors` metrics to `*.requests` to reduce confusion when not filtering out the `kafka.error_code=none` attribute
- Unify log and metric attribute key names for consistency and easier redaction of sensitive information
- Refine fetch responses to more closely target byte size limits specified by clients
- Improve archive file size calculations to closer match configured target
- Additional performance improvements

## v0.3.5

**_Release date:_** 2025-01-10

#### Bug fixes

- Fix Kafka service shutdown handling so it waits for in-flight requests to complete before returning
- Capture transport-level timeouts and cancellations of in-flight Kafka requests, including a new `server.error_kind` attribute
- Compute `bufstream.kafka.consumer.group.offset.lag` metric attributes correctly
- Only return fatal `ILLEGAL_GENERATION` errors on consumer group heartbeats and syncs for fenced members, reducing rebalancing noise
- Fix unit mismatch in latency calculations for archiver, sequencer, and consumer groups used in performing background operations

#### Features and improvements

- Limit number of consumer group offset updates per group to control load on the metadata storage
- Add options to skip archiving/shelving/vacuuming when running the `admin clean-topics` CLI command
- Include `bufstream.intake.delete.latency` and `bufstream.kafka.consumer.group.offset.commit.latency` metrics
- Minimize operations against etcd when deleting keys to improve metadata storage performance
- Permit fetches of unstable offsets via the `unstable_offsets=true` client ID option
- Allow override of log size reporting behavior via `exact_log_sizes=false` client ID option
- Additional miscellaneous performance improvements

## v0.3.4

**_Release date:_** 2025-01-02

#### Bug fixes

- Fix shelving and archiving delays when a partition has no existing archive data or is idle
- Only expire group members after a heartbeat request

#### Features and improvements

- Process consumer group offset updates in concurrent batches to improve throughput by several orders of magnitude
- Improve Datadog dashboard's display of cluster-wide metrics, metrics aggregations, and display settings
- Reduce logging on intentionally canceled fetch calls
- `admin clean-topics` now always blocks and vacuums intake files (unless explicitly skipped)
- Return retriable error codes from certain Kafka APIs to encourage clients to attempt retries in certain scenarios
- Additional miscellaneous performance improvements

## v0.3.3

**_Release date:_** 2024-12-19

#### Bug fixes

- Return correct error code for `Heartbeat`, `SyncGroup`, and `OffsetCommit` responses when the consumer group is empty, which may cause some clients to fail to join
- Fix data enforcement `PASS_THROUGH` behavior for invalid produce records which were instead being rejected
- Ensure caches always respect key expirations
- Always include error code attribute in request count metrics
- Fix consumer group lag metric units

#### Features and improvements

- Include first stable release of user-facing metrics, dashboards, and alerts for Datadog and Grafana
- Update metrics aggregation behavior to allow user control over cardinality
- Improve storage provider auto-detection logic
- Add configurable timeout for all Kafka RPCs
- Add `fetch.source` attribute to metrics to identify source of potential issues
- Improve concurrency and performance of `Fetch` request and admin commands
- Deprecate `observability.metrics.omit_partition_attribute` configuration and `OMITTED` redaction option replacing with the more fine-grained `observability.metrics.aggregation` options
- Additional miscellaneous performance improvements

## v0.3.2

**_Release date:_** 2024-12-12

#### Bug fixes

- Reduce logging when metrics cannot resolve a deleted topic name
- Fix unpopulated fields in `DescribeCluster` and `DescribeLogDirs` responses
- Fix an issue where `localhost` might resolve to both `127.0.0.1` and `::1` but IPv6 is disabled on the loopback device
- Fix proper creation of an empty batch in a compacted archive containing no records

#### Features and improvements

- Improve error messages on broker startup and invalid configuration
- Limit concurrent archiving operations based on available memory
- Add a `cluster.name` attribute to all metrics
- Remove redundant attributes from metrics and traces
- Improve aggregation behavior for topic and partition gauges
- Replace `bufstream.schema.validation.invalid_records` with `bufstream.kafka.produce.record.data_enforcement.errors` and `bufsstream.kafka.fetch.record.data_enforcement.errors` metrics
- Introduce `admin resolve` command to resolve opaque topic, partition, and consumer group IDs and hashes seen in logs into their user-defined names
- Additional miscellaneous performance improvements

## v0.3.1

**_Release date:_** 2024-12-03

#### Bug fixes

- Fix etcd garbage collection bug which could lead to large database sizes

#### Features and improvements

- Update metrics units to match OTEL recommendations
- Allow configuring OTLP temporality preference
- Expose bufstream health status via `bufsteam.status` metric

## v0.3.0

**_Release date:_** 2024-12-03

#### Bug fixes

- Fix routing bug that caused inconsistent load distribution among brokers
- Fix regression in the DescribeCluster API that returned non-unique broker hostnames, affecting certain clients
- Fix DescribeProducers API to be strongly consistent, making some clients more reliable
- Make consumer group offset processing more robust when groups are abruptly deleted
- Redact sensitive record data in debug logs

#### Features and improvements

- Improve compatibility with Kafka 3.9.0 clients
- Improve consumer group performance
- Improve Fetch API performance
- Add idempotent producer memory to match Apache Kafka behavior
- Bind Kafka listeners to all resolved addresses of a hostname, instead of just the first IPv4 address
- Improve metadata storage write scalability by ~100x by grouping partition sequencing together
- Add `admin clean-topics`, `admin get`, and `admin set` CLI commands to flush the Bufstream intake and sequencing system to safely migrate towards grouping partition sequencing (see migration guide below)
- Add `admin usage` CLI command for computing write statistics cluster-wide and by-topic.
- Add `timeout` and `quiet` flags for `admin` commands
- Retry startup checks to prevent spurious crashes when cluster initializes
- Improve reliability of inter-cluster RPCs
- Improve observability metrics, disabling internal debugging metrics by default
- Add probes for etcd and OTLP endpoints
- Use Kubernetes `StatefulSet` for deployments by default for more stable scaling behavior
- Other miscellaneous performance improvements

### Upgrading to v0.3.x

New clusters will automatically opt-in to the new partition sequencing groups, however existing clusters will need to manually perform this migration after upgrading the cluster to v0.3.x:

1.  Read these instructions completely before beginning the migration process
2.  Upgrade Bufstream cluster to 0.3.x
3.  Identify your [admin URL](../reference/configuration/bufstream-yaml/#buf.bufstream.config.v1alpha1.BufstreamConfig.admin_address) (default: http://localhost:9089)
4.  Run `bufstream admin clean-topics --skip-vacuuming --url=<admin URL>` and check results
5.  Optionally, disable Kafka traffic to the cluster to reduce noise
6.  Save an [etcd snapshot](https://etcd.io/docs/v3.5/op-guide/recovery/) as backup
7.  Run `bufstream admin set sequence-shard-count 64 --url=<admin URL>` and check results
8.  Re-enable Kafka traffic to the cluster if disabled

---

# Older releases

Expand to see previous releases

### v0.2.0

**_Release date:_** 2024-11-08

#### Bug fixes

- Fix a data race when flushing the intake cache
- Log the correct Kafka address on startup
- Reduce compaction errors by improving etcd locking
- Fix crash when cluster is shut down unexpectedly
- Wait for DNS resolution before registering new nodes
- Fix a bug in epoch calculation that erroneously invalidated in-progress offset updates
- Improve archiving behavior during cluster auto-scaling

#### Features and improvements

- Support TLS for all cluster communications, including broker-to-broker and among etcd nodes
- Implement [KIP-394](https://cwiki.apache.org/confluence/display/KAFKA/KIP-394%3A+Require+member.id+for+initial+join+group+request)
- Improve etcd performance when reading from archives
- Improve memory utilization and cluster performance by increasing default cache sizes
- Add a virtual broker configuration to client IDs, so that Bufstream can present itself as a single broker when necessary
- Improve error output for `bufstream serve` failures
- Support deploying Bufstream as a Kubernetes Stateful Set
- Expose configurable liveness and readiness probe timeouts
- Output human readable cluster UUIDs for debugging
- Update configuration defaults for improved read performance
- Shutdown gracefully if Kafka or HTTP listeners fail to avoid cluster panics
- Reduce startup and auto-scaling log verbosity
- Various improvements to CLI reference documentation
- Other miscellaneous performance optimizations

### v0.1.3

**_Release date:_** 2024-10-30

#### Bug fixes

- Fix a bug in v0.1.2's transaction numbering that silently discarded some commits and aborts
- Return errors when clients attempt to change the outcome of a committed or aborted transaction
- Fix stuck producers and consumers by polling etcd, rather than relying exclusively on leases
- Fix a race that led to serving stale high watermarks and last stable offsets on startup
- Fix compatibility with Java clients by always setting offset to -1 when returning produce errors
- Improve AKHQ reliability by limiting the size of archive chunks
- Various fixes to data management for low-throughput partitions
- Fix archiving of internal usage-tracking topic
- Miscellaneous fixes to log and metrics output

#### Features and improvements

- Order transaction-related RPCs with logical clocks, preventing re-ordering within Bufstream
- Support more concurrent producers by decreasing etcd heartbeat frequency
- Support L4 load balancers by defaulting to advertising only public hosts
- Add support for zone-local load balancers
- Improve graceful shutdown logic
- Improve produce reliability by retrying more transient errors
- Improve cluster throughput by increasing default cache size
- Increase cluster throughput and reduce object storage costs by optimizing hedging
- Guard against overlapping storage between clusters with a fingerprint check on startup
- Reduce metrics cardinality by decreasing number of histogram buckets
- Assorted improvements to logging and internal tracing

### v0.1.2

**_Release date:_** 2024-08-19 | **_Status:_** archived*This release has been archived due to a regression in the transaction processing system. All production workloads should continue to use version [0.1.1](#v011).*

#### Bug fixes

- Fixes error-handling bug in topic auto-creation
- Reduces error probability when Bufstream attempts to calculate the last stable or next unstable offset
- Resolves error when Bufstream attempts to read the `kafka.public_address` value in the Helm chart
- Prevents Bufstream from sending empty values for CPU memory limits by setting a reasonable default in the Helm chart
- Assigns all transactions a monotonic number so that concurrent complete operations no longer result in transactions completing multiple times for a topic partition -- Bufstream now applies only the first completion for a given transaction number
- Addresses checkpoint error when Bufstream attempts to archive internal topics

#### Features and improvements

- Expands Bufstream's Kafka conformance testing suite
- Exposes Kafka configs in the Helm chart so that they can be set directly
- Adds documentation for the Helm chart and recommended defaults
- Improves debug log output for transaction state changes
- Uncaches transactional producers to expose state transition errors
- Allows topic replication factor to be set to `-1` -- in cases where the topic replication factor is not set to -1 or 1, Bufstream will return an error
- Improves compatibility with RedPanda console when displaying topics and offsets

### v0.1.1

**_Release date:_** 2024-08-14

#### Bug fixes

- Fixes off-by-one error in archive requests

#### Features and improvements

- Adds config option `kafka.exact_log_offsets` that when set to true will always return the exact offset for fetch requests
- Updates and documents recommended default values in the helm chart
- Improves error handling for produce requests and transactions

### v0.1.0

**_Release date:_** 2024-08-09

#### Bug fixes

- Fixes panic when coercing a message payload to Confluent Schema Registry format
- Respects `acks=0` setting on produce and does not wait for or guarantee the success of the produce request

#### Features and improvements

- Adds helm value `exact_log_sizes` that determines whether exact log sizes should be fetched for all topics and partitions
- Documents dynamic configuration options
- Adds configuration options for consumer group session timeout: `group.consumer.session.timeout.ms`, `group.consumer.min.session.timeout.ms`, `group.consumer.max.session.timeout.ms`

### v0.0.4

**_Release date:_** 2024-08-06

#### Bug fixes

- Fixed memory leak when uploading objects to S3 storage
- Removed redundant zone lookups when resolving metadata requests
- Fixed `Fetch` response to work with `librdkafka`\-based clients (including the `confluent-kafka` Python client)
- Amended various API responses to match expectations of the `segmentio/kafka-go` and `IBM/sarama` Go clients

#### Features and improvements

- Allow command-line flags to override YAML configuration
- Support deleting topics by name with `DeleteTopics`
- Expose additional Bufstream-specific broker and topic configuration options
- Reduce debug log volume
- Improve cache throughput

### v0.0.3

**_Release date:_** 2024-07-25

#### Bug fixes

- Change `dataEnforcement` key in helm chart to an empty object so that it does not emit a warning when coalescing values

#### Features and improvements

- Enable retries with backoff by default
- Return an error if Bufstream cannot resolve the producer ID
- Set etcd connection wait time to 2 minutes -- Bufstream will return an error and shut down if it cannot establish a connection to etcd within the 2 minute interval
- Provide traces for all etcd storage errors
- Improve topic metadata management
- Change shut down behavior such that Bufstream will wait for the archiver to finish before shutting down

### v0.0.2

**_Release date:_** 2024-07-10

#### Features and improvements

- Emit build version in helm chart logs

### v0.0.1

**_Release date:_** 2024-07-09

- Initial release
