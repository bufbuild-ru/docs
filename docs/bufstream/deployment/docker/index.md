---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/deployment/docker/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bufstream/deployment/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bufstream/deployment/aws/deploy-postgres/"
  - - meta
    - property: "og:title"
      content: "Deploy Bufstream with Docker - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/deployment/docker/index.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/deployment/docker/"
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
      content: "Deploy Bufstream with Docker - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/deployment/docker/index.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Deploy with Docker

Docker is the fastest way to deploy Bufstream, whether you need an in-memory broker for testing and development or a persistent environment using an existing storage bucket and Postgres database.

For production Kubernetes deployments with Helm, we provide [deployment guides](../#cloud-providers) for AWS, Google Cloud, and Azure. For a full-stack local environment, we also provide a [Docker Compose example](https://github.com/bufbuild/buf-examples/tree/main/bufstream/docker-compose).

## In-memory deployment

You can run a Bufstream broker suitable for local testing and development with one line:

```sh
docker run --network host bufbuild/bufstream serve --inmemory
```

This creates an _ephemeral_ instance listening for Kafka connections on 9092 and admin API requests on port 9089. Once it's stopped, all data is lost.

## Deploying with existing resources

For a long-lived broker, Bufstream requires the following:

1.  Object storage such as [AWS S3](https://aws.amazon.com/s3/), [Google Cloud Storage](https://cloud.google.com/storage), or [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs).
2.  A metadata storage service such as [PostgreSQL](https://www.postgresql.org/).

Follow the instructions below to run Bufstream with an existing storage bucket and Postgres database.

+++tabs key:2756ffe33a6a7f64cac077b762a63004

== AWS

Create a `bufstream.yaml` file providing bucket configuration and Postgres connection information:

::: info bufstream.yaml

```yaml
storage:
  provider: S3
  region: <region>
  bucket: <bucket-name>
  access_key_id:
    string: <S3 access key id>
  secret_access_key:
    string: <S3 secret access key>
postgres:
  dsn:
    string: postgresql://<postgres-user>:<postgres-password>@<postgres-host>:<postgres-port>/<database-name>
```

:::

== Google Cloud

Start by creating a service account that has the appropriate [bucket permissions](#bucket-permissions). Once it's created, [add a key](https://cloud.google.com/iam/docs/keys-create-delete#iam-service-account-keys-create-console). Creating the key results in a downloaded JSON file.

Next, create a `bufstream.yaml` file providing bucket configuration and Postgres connection information:

::: info bufstream.yaml

```yaml
storage:
  provider: GCS
  bucket: <bucket-name>
postgres:
  dsn:
    string: postgresql://<postgres-user>:<postgres-password>@<postgres-host>:<postgres-port>/<database-name>
```

:::

== Azure

Create a `bufstream.yaml` file providing bucket configuration and Postgres connection information:

::: info bufstream.yaml

```yaml
storage:
  provider: AZURE
  bucket: <blob-container-name>
  endpoint: https://<storage-account-name>.blob.core.windows.net
  access_key_id:
    string: <storage-account-name>
  secret_access_key:
    string: <access-key>
postgres:
  dsn:
    string: postgresql://<postgres-user>:<postgres-password>@<postgres-host>:<postgres-port>/<database-name>
```

:::

== Localhost (MinIO)

Create a `bufstream.yaml` file providing bucket configuration and Postgres connection information:

::: info bufstream.yaml

```yaml
storage:
  provider: S3
  region: <region>
  bucket: <bucket-name>
  endpoint: http://localhost:<minio-port>
  force_path_style: true
  access_key_id:
    string: <minio-username>
  secret_access_key:
    string: <minio-password>
postgres:
  dsn:
    string: postgresql://<postgres-user>:<postgres-password>@<postgres-host>:<postgres-port>/<database-name>
```

:::

+++

It's never a good idea to commit credentials, so be sure to follow your organization's policies before adding configuration files like `bufstream.yaml` to version control.

Now that you have a configuration file, use Docker to start Bufstream. Note that this command uses `-v` to mount the `bufstream.yaml` file and the `--config` flag to specify the file for `bufstream serve`.

+++tabs key:2756ffe33a6a7f64cac077b762a63004

== AWS

```text
$ docker run \
    -v $PWD/bufstream.yaml:/bufstream.yaml \
    --network host \
    bufbuild/bufstream serve \
    --config /bufstream.yaml
```

== Google Cloud

Replace `<service-account-key-file>` with the path to your service account key file.

```text
$ docker run \
    -v $PWD/bufstream.yaml:/bufstream.yaml \
    -v $PWD/<service-account-key-file>:/service-account-key.json \
    -e GOOGLE_APPLICATION_CREDENTIALS=/service-account-key.json \
    --network host \
    bufbuild/bufstream serve \
    --config /bufstream.yaml
```

== Azure

```text
$ docker run \
    -v $PWD/bufstream.yaml:/bufstream.yaml \
    --network host \
    bufbuild/bufstream serve \
    --config /bufstream.yaml
```

== Localhost (MinIO)

```text
$ docker run \
    -v $PWD/bufstream.yaml:/bufstream.yaml \
    --network host \
    bufbuild/bufstream serve \
    --config /bufstream.yaml
```

+++

This creates a broker listening for Kafka connections on 9092 and [admin API](../../reference/cli/admin/) requests on port 9089. It's safe to stop this instance — all of its topic data is stored in the bucket you configured, and its metadata state is stored in Postgres.

### Bucket permissions

Bufstream needs the following permissions to work with objects in its storage bucket.

+++tabs key:2756ffe33a6a7f64cac077b762a63004

== AWS

Bufstream uses an S3 bucket for object storage, and needs to perform the following operations:

- `s3:GetObject`: Read existing objects
- `s3:PutObject`: Create new objects
- `s3:DeleteObject`: Remove old objects according to retention and compaction rules
- `s3:ListBucket`: List objects in the bucket
- `s3:AbortMultipartUpload`: Allow failing of multi-part uploads that won't succeed

For more information about S3 bucket permissions and actions, consult the [AWS S3 documentation](https://docs.aws.amazon.com/AmazonS3/latest/API/API_Operations_Amazon_Simple_Storage_Service.html).

== Google Cloud

Bufstream uses a Google Cloud Storage bucket for object storage, and needs to perform the following operations:

- `storage.objects.create`: Create new storage objects
- `storage.objects.get`: Retrieve existing storage objects
- `storage.objects.delete`: Remove old storage objects according to retention and compaction rules
- `storage.objects.list`: View all storage objects to enforce retention and compaction rules
- `storage.multipartUploads.*`: Allow multi-part uploads

== Azure

Bufstream uses Azure Blob Storage for object storage, and at minimum, requires the `Storage Blob Data Contributor` [RBAC role](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles) on the Storage account container.

== Localhost (MinIO)

If you're using a local MinIO container and connecting as an administrator, you don't need to configure these. Otherwise, make sure you've granted the following:

- `s3:GetObject`: Read existing objects
- `s3:PutObject`: Create new objects
- `s3:DeleteObject`: Remove old objects according to retention and compaction rules
- `s3:ListBucket`: List objects in the bucket
- `s3:AbortMultipartUpload`: Allow failing of multi-part uploads that won't succeed

+++

### Postgres role

Bufstream needs full access to the database in Postgres so that it can manage its metadata schema.

### Network ports

If you're not running Bufstream locally, the following ports need to be open to allow Kafka clients and admin API requests to connect:

- **Kafka traffic**: Defaults to 9092. Change this by setting `kafka.address.port` in `bufstream.yaml`.
- **Admin API traffic**: Defaults to 9089. Change this by setting `kafka.admin_address.port` in `bufstream.yaml`.

### Other considerations

For additional configuration topics like instance types and sizes, metadata storage configuration, and autoscaling, see [Cluster recommendations](../cluster-recommendations/).

When running in Kubernetes, Bufstream supports workload identity federation within AWS, GCP, or Azure. It also supports GCP Cloud SQL IAM users. Refer to [cloud provider deployment guides](../#cloud-providers) for more information.

## Deploying with Docker Compose

We also provide a [full-stack Docker Compose example](https://github.com/bufbuild/buf-examples/tree/main/bufstream/docker-compose) that sets up MinIO, PostgreSQL and Bufstream for you.
