---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/iceberg/quickstart/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bufstream/quickstart/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bufstream/data-governance/schema-enforcement/"
  - - meta
    - property: "og:title"
      content: "Iceberg quickstart - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/iceberg/quickstart.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/iceberg/quickstart/"
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
      content: "Iceberg quickstart - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/iceberg/quickstart.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Iceberg quickstart

Bufstream's Iceberg integration lets you skip data pipelines and use modern analytics tools like Spark, Clickhouse, Trino, BigQuery, and Athena to query your streaming data. In-process, it writes Kafka messages to Parquet files and maintains Iceberg metadata. There's no data duplication and zero ETL.

All of this, plus schema and data quality enforcement, happens within the broker itself. There's no additional infrastructure, hidden Flink job, availability restrictions, or cost — just high-quality data, ready for analysis.

In this quickstart, you'll learn to create a local Bufstream and Iceberg environment:

1.  Deploying a Docker-based Bufstream environment with local object storage and Iceberg REST catalog.
2.  Configuring Bufstream and a topic for Iceberg archival.
3.  Running the Iceberg archival process on demand.
4.  Querying Iceberg with Apache Spark and a Jupyter Notebook.

## Prerequisites

- Make sure [Docker](https://docs.docker.com/engine/install/) is installed.
- Have [`git`](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [`go`](https://go.dev/dl/) installed and in your `$PATH`.
- Clone the `buf-examples` repo and go to the example code directory:

  ```sh
  git clone https://github.com/bufbuild/buf-examples.git && \
      cd ./buf-examples/bufstream/iceberg-quickstart
  ```

## Configure Bufstream for Iceberg

Bufstream works with your existing Iceberg catalogs. To use it, you'll need to create at least one named Iceberg catalog in your [Bufstream configuration](../../reference/configuration/bufstream-yaml/).

This example includes a REST Iceberg catalog as part of its Docker compose project. Edit `config/bufstream.yaml` and uncomment the following at the bottom of the file:

::: info config/bufstream.yaml

```yaml
iceberg:
  catalogs:
    - name: local-rest-catalog
      rest:
        url: http://iceberg-rest:8181
```

:::

## Start Docker project

Integrating Bufstream with Iceberg requires the Bufstream broker, object storage, and an Iceberg catalog implementation. These are all available via Docker images, so we've included a `docker-compose.yml` that makes it easy to run all of this infrastructure locally. Additionally, it starts AKHQ (a GUI for Kafka management) and Apache Spark (an analytics engine compatible with Iceberg).

Start all of this in a new terminal with one command:

```sh
docker compose up
```

## Publish Kafka messages

This quickstart includes a sample producer that fills the `email-updated` topic with events. Start the producer:

```sh
go run ./cmd/producer \
  --topic email-updated \
  --group email-verifier \
  --csr-url "https://demo.buf.dev/integrations/confluent/bufstream-demo"
```

You should see output like the following. It produces 100 events to a topic.

```console
time=2025-04-04T09:04:39.777-04:00 level=INFO msg="Creating messages" max=100
time=2025-04-04T09:04:42.276-04:00 level=INFO msg="Published message" number=1 of=100 "new email"=yasminheller@bosco.biz
time=2025-04-04T09:04:42.377-04:00 level=INFO msg="Published message" number=2 of=100 "new email"=marianvandervort@hand.io
time=2025-04-04T09:04:42.542-04:00 level=INFO msg="Published message" number=3 of=100 "new email"=herminiofeeney@gleichner.name
```

If the process hangs or shows error messages, check your Docker output for the Bufstream container. Mistyping changes to `bufstream.yaml` can cause it to fail.

## Configure topic for Iceberg

We've included AKHQ, a GUI for Kafka management, to make it easy to configure a Bufstream topic for Iceberg archival.

1.  Browse to [http://localhost:8282/ui/bufstream-local/topic/email-updated/configs](http://localhost:8282/ui/bufstream-local/topic/email-updated/configs) to view the `email-updated` topic's configuration.
2.  Set `bufstream.archive.iceberg.catalog` to `local-rest-catalog` (the name you configured in `bufstream.yaml`)
3.  Set `bufstream.archive.iceberg.table` to `bufstream.email_updated` (the fully qualified namespace and table name you'll use)
4.  Set `bufstream.archive.kind` to `ICEBERG`.
5.  Click the **Update configs** button at the lower right to save your changes.

You should see a success message appear — if you don't, double-check your changes. Your topic is now configured for Iceberg archival.

In production, you should include this configuration as part of your infrastructure management.

## Archive all topics

In production, Bufstream automatically archives topic data to Iceberg based on a scheduled interval.

In development, it's handy to be able to control this manually. Using Bufstream's `admin` command, you can immediately archive all pending (hot) topic data to Iceberg (cold) storage:

```sh
docker exec bufstream /usr/local/bin/bufstream admin clean topics
```

You should see no errors, just INFO messages like the following:

```console
time=2025-04-02T10:28:03.362-04:00 level=INFO msg=clean-topics job_id=qu5ALLd4dnELAUyMmKIu0V
time=2025-04-02T10:28:03.370-04:00 level=INFO msg=clean-topics taskCount=2 successCount=0 errorCount=0 elapsed=2.005247ms estimatedRemaining=0s
time=2025-04-02T10:28:03.392-04:00 level=INFO msg=clean-topics taskCount=2 successCount=2 errorCount=0 elapsed=24.429247ms estimatedRemaining=0s
```

Now you're ready to query Iceberg.

## Query Iceberg

Iceberg isn't a database — it's a table format for analytical databases. To query your tables, you'll need a query engine like Apache Spark, Google's BigQuery, AWS Athena, Clickhouse, or Trino. For quickstart purposes, a local Apache Spark instance and its Jupyter Notebook interface works just fine.

Open the provided Jupyter Notebook at [http://localhost:8888/notebooks/notebooks/bufstream-iceberg-quickstart.ipynb](http://localhost:8888/notebooks/notebooks/bufstream-iceberg-quickstart.ipynb). It contains all you need to configure a Spark session and query your topic's data.

### Connect to Iceberg

Click in the first cell (which contains the following code) and then either click the **▶︎** icon or use `Shift-Return` to execute its commands:

```python
from pyspark.sql import SparkSession

conf = (
    pyspark.SparkConf()
        .setAppName('Jupyter')
        .set("spark.sql.extensions", "org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions")
        .set("spark.sql.catalog.bufstream-quickstart", "org.apache.iceberg.spark.SparkCatalog")
        .set("spark.sql.catalog.bufstream-quickstart.type", "rest")
        .set("spark.sql.catalog.bufstream-quickstart.uri", "http://iceberg-rest:8181")
)
spark = SparkSession.builder.config(conf=conf).getOrCreate()
```

You may see the following warning, and that's fine.

```text
WARN SparkSession: Using an existing Spark session; only runtime SQL configurations will take effect.
```

### List databases

Click into the next cell (containing the following code) and execute its code:

```sql
%%sql
SHOW DATABASES;
```

You should see that `bufstream` is now available as a database/namespace:

```text
namespace
---------
bufstream
```

### List tables

Next, click into the `SHOW TABLES` cell:

```sql
%%sql
SHOW TABLES in `bufstream`
```

Execute it, and you should see that your topic is available as a table:

```text
namespace   tableName       isTemporary
---------   -------------   -----------
bufstream   email_updated   False
```

### Query Iceberg

Time for the final step. Let's find out which top-level domains were the most used. Click in the last cell in the notebook and execute it:

```sql
%%sql
SELECT
    reverse(split(val.new_email_address,'\\.'))[0] tld,
    count(1) tld_count
FROM
    `bufstream`.`email_updated`
GROUP BY
    tld
ORDER BY
    tld_count desc
LIMIT 3
```

The results should be printed in the results pane. The email addresses are randomly generated, so yours won't exactly match.

```text
tld    tld_count
---    ---------
org    14
biz    11
com    10
```

## Clean up

To remove the containers you've created and shutdown all services, ctrl+c `docker-compose` in your other terminal:

```sh
docker compose down
```

## Wrapping up

In this quickstart, you've learned to configure Bufstream for Iceberg, manage a local Bufstream environment, and run queries against Iceberg data — everything you need to start planning, building, and deploying high-quality, stream-based data products within your organization.

## Further reading

- Explore true broker-side [schema enforcement](../../data-governance/schema-enforcement/) and [semantic data validation](../../data-governance/semantic-validation/) in the Bufstream [quickstart](../../quickstart/).
- Learn about production Bufstream deployment with Kubernetes on [Amazon Web Services](../../deployment/aws/deploy-etcd/), [Google Cloud with etcd](../../deployment/gcp/deploy-etcd/), or [Google Cloud with Spanner](../../deployment/gcp/deploy-spanner/).
