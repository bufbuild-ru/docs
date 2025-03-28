# Bufstream Apache Iceberg integration

Bufstream streams data directly to Apache Iceberg™ from any topic, eliminating the need for an additional, expensive ETL pipeline and transforming data to as it passes through the broker. Once data is transformed and at rest in object storage, Bufstream layers Iceberg metadata on top of the Parquet. Transformed data is queryable and discoverable by tools like Apache Spark, Amazon Athena, Dremio, Trino, and Starburst without having to copy data into a separate lakehouse table and duplicate storage. Bufstream can also optionally update your existing Iceberg catalog and exposes configuration options to do so, reducing the time it takes to gain insight from your data.Bufstream supports updates to the following catalogs today:

- REST Catalog
- BigLake Metastore (GCP)
- BigQuery Metastore (GCP)

We plan to add support for the following catalogs in an upcoming release:

- Databricks Unity Catalog
- Snowflake Polaris
- Snowflake Horizon
- Glue (AWS)

Bufstream's Iceberg REST catalog support allows you to deploy a [REST adapter](https://hub.docker.com/r/tabulario/iceberg-rest) in front of Iceberg catalogs that don't have an explicit integration with Bufstream. As a result, Bufstream is able to integrate with _any_ existing catalog as well as bespoke implementations.

## Why Iceberg?

The existing processes for getting data out of Kafka and into a data lake, warehouse, or analytics tool are prone to human error, introduce duplicative storage, and increase operational expenses. Bufstream eliminates these complex and brittle processes and delegates data transformation to the broker and makes object storage the single source of truth for ready to query data -- leading your team to critical insights faster.Over the last few years, Iceberg has grown to be the leading standard for storing big data sets in the data lakehouse, and as a result we've seen the ecosystem grow to unite data platform teams and analytics teams with tools like Apache Spark, Amazon Athena, Dremio, Trino, and Starburst. These conditions made Iceberg a great fit for Bufstream.Today to shift data out of Kafka and into a data warehouse teams must do some or all of the following:

- Set up a consumption workflow that requires additional compute and storage, utilizing Kafka Connect or bespoke direct to data lakehouse engines.
- Create and maintain a complex pipeline of operations that transform the data to a columnar format (like Parquet), materialize the data, and address any schema changes or evolution.
- Manually clean up the small files that pile up in object storage as a result of the continuous transformations of the streaming data to guard against degraded performance.

As a result, teams require twice the time and expense to use the same data in a downstream system.

### What does Bufstream do differently?

Bufstream shifts all of the work to materialize, transform, and validate data into the streaming data pipeline, reducing the maintenance, cost, and operations burden for data platform and analytics teams. Bufstream's brokers are schema-aware, semantically intelligent, and able to transform data in transit meaning there is only one tool and process needed to stream and process your data to get it ready for the lakehouse and analytics engines.Bufstream's broker-side data quality enforcement ensures that data entering your lakehouse or used by query engines conforms to a known schema from your schema registry as well as meets validation requirements for each field, forbidding malformed or invalid data from entering your lakehouse. Once the data has been assessed for quality, Bufstream transforms your data into Parquet and materializes the Iceberg metadata from the approved schema, eliminating manual transformation tools that need routine maintenance for every change made to application data. As a result, lakehouse compatible data rests in object storage as a source of truth without having to transform, materialize, and persist a new copy of the raw data _just_ for analytics use-cases.Bufstream supports the Iceberg REST catalog allowing you to deploy a REST adapter in front of Iceberg catalogs that don't have an explicit integration with Bufstream. Therefore, Bufstream is able to integrate with _any_ existing catalog as well as bespoke implementations making it easy to get high quality data from your application events into your lakehouse without any extra time or effort on your part.

## What's Next?

- Learn how to [configure direct to Iceberg streaming](configuration/).
- Take a deep dive into the [Iceberg integration architecture](reference/).
