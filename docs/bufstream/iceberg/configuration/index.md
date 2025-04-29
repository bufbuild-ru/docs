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

For Bufstream to store data as Iceberg tables, you must update the top-level Bufstream configuration as well topic-level configuration to instruct Bufstream to update a corresponding Iceberg catalog. Once you have set these options, Bufstream will begin storing data as Parquet file archives for long term storage. Each archive will only contain data for a single topic partition and is then further partitioned by date, ensuring that Iceberg tables contain only committed messages.

### Bufstream configuration options

To store Iceberg tables and interact with you preferred catalog, Bufstream will need configuration information about the specific catalog you wish to update. The example below illustrates how to configure Bufstream to use [BigQuery Metastore](https://cloud.google.com/bigquery/docs/about-bqms):

```yaml
iceberg_integration:
  catalogs:
    - name: gcp
      bigquery_metastore: {}
```

While BigQuery Metastore does not have any required properties, to ensure that there are no interruptions to archiving or reading data, we recommend setting the following values:

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

If a topic is using Protobuf as its message data format, Bufstream will ensure that the Iceberg schema mirrors the Protobuf message schema. However, for other message formats (e.g. AVRO, JSON), Bufstream will represent the message keys and values as binary columns which are opaque to human readers. Bufstream's direct to Iceberg integration also respects any data enforcement configuration set in the cluster configuration. If topics are using the `pass through` data enforcement setting, Bufstream will store the non-compliant message data in an `__unrecognized__` binary field with encoded bytes. Data in the `__unrecognized__` field may include the following: invalid data, fields that have since been deleted from the schema stored in the schema registry, or new fields that are not yet in sync with the schema registry.At this time, Bufstream does not support creating fields in the Iceberg schema for Protobuf extensions. If schemas contain extensions, the extensions will also populate the `__unrecognized__` field. Additionally, at this time, Bufstream does not support using Iceberg as the archive format for compacted topics.To enable Iceberg storage for topics, you will need to explicitly set the archive format, catalog name, and table name when creating a new topic. The following constraints apply to topic configuration:

- `bufstream.archive.kind` must be set to `ICEBERG`
- `bufstream.archive.iceberg.catalog` must have the same name as the catalog configured in `bufstream.yaml`
- `bufstream.archive.iceberg.table`must be a valid namespace and table for the configured catalog. This value be in the form `namespace.table`. There must be at least one component in the namespace, therefore a value of `table` is considered invalid since it includes no namespace component. Backend systems may impose other constraints on table names not imposed by Bufstream (e.g. BigQuery does not allow a table named "table" as that is a reserved word in their query syntax).

You can read and update the topic configuration values from Kafka GUIs like AKHQ or Redpanda Console. The values will be listed as `bufstream.archive.kind`, `bufstream.archive.iceberg.catalog`, and `bufstream.archive.iceberg.table`.
