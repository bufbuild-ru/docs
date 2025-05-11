---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/iceberg/configuration/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bufstream/iceberg/quickstart/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bufstream/iceberg/reference/"
  - - meta
    - property: "og:title"
      content: "Configuration - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/iceberg/configuration.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/iceberg/configuration/"
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
      content: "Configuration - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/iceberg/configuration.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Configuration

For Bufstream to store data as Iceberg tables, you must update the top-level Bufstream configuration as well as the topic-level configuration to instruct Bufstream to update a corresponding Iceberg catalog. Once you've set these options, Bufstream begins storing data as Parquet file archives for long term storage. Each archive only contains data for a single topic partition and is then further partitioned by date, ensuring that Iceberg tables contain only committed messages.

### Bufstream configuration options

To store Iceberg tables and interact with your preferred catalog, Bufstream needs configuration information about the specific catalog you wish to update. The example below illustrates how to configure Bufstream to use [BigQuery Metastore](https://cloud.google.com/bigquery/docs/about-bqms):

```yaml
iceberg_integration:
  catalogs:
    - name: gcp
      bigquery_metastore: {}
```

Though BigQuery Metastore doesn't have any required properties, to ensure that there are no interruptions to archiving or reading data, we recommend setting the following values:

```yaml
iceberg_integration:
  catalogs:
    - name: gcp
      bigquery_metastore:
        # The name of the GCP project that the Bufstream workload is running in.
        project: my-project,
        # This field is necessary if you would like Bufstream to auto-create data sets.
        # Bufstream must know the location of BigQuery data sets
        # and have the appropriate permissionss to create them.
        location: US,
        # This field is not required. However, when specified the BigQuery Cloud Resource connection's
        # GCP service account is used to read data from the Bufstream's GCS bucket.
        # BigQuery data sets can only use connections in the same GCP project and location.
        cloud_resource_connection: my-connection
```

For additional information about config values and requirements, consult the [Bufstream reference documentation](../../reference/configuration/bufstream-yaml/).

### Topic level configuration

If a topic uses Protobuf as its message data format, Bufstream ensures that the Iceberg schema mirrors the Protobuf message schema. However, for other message formats (e.g. Avro, JSON), Bufstream represents the message keys and values as binary columns that are opaque to human readers. Bufstream's direct-to-Iceberg integration also respects any data enforcement configuration set in the cluster configuration. If topics use the `pass through` data enforcement setting, Bufstream stores the non-compliant message data in an `__unrecognized__` binary field with encoded bytes. Data in the `__unrecognized__` field may include the following: invalid data, fields that have since been deleted from the schema stored in the schema registry, or new fields that aren't yet in sync with the schema registry.

At this time, Bufstream doesn't support creating fields in the Iceberg schema for Protobuf extensions. If schemas contain extensions, the extensions also populate the `__unrecognized__` field. Additionally, at this time, Bufstream doesn't support using Iceberg as the archive format for compacted topics.

To enable Iceberg storage for topics, you will need to explicitly set the archive format, catalog name, and table name when creating a new topic. The following constraints apply to topic configuration:

- `bufstream.archive.kind` must be set to `ICEBERG`
- `bufstream.archive.iceberg.catalog` must have the same name as the catalog configured in `bufstream.yaml`
- `bufstream.archive.iceberg.table` must be a valid namespace and table for the configured catalog. This value must be in the form `namespace.table`. There must be at least one component in the namespace — therefore, a value of `table` is considered invalid since it includes no namespace component. Backend systems may impose other constraints on table names not imposed by Bufstream (e.g. BigQuery doesn't allow a table named "table" because that is a reserved word in their query syntax).

You can read and update the topic configuration values from Kafka GUIs like AKHQ or Redpanda Console. The values will be listed as `bufstream.archive.kind`, `bufstream.archive.iceberg.catalog`, and `bufstream.archive.iceberg.table`.
