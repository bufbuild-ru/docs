---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/deployment/gcp/deploy-spanner/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bufstream/deployment/gcp/deploy-postgres/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bufstream/deployment/azure/deploy-etcd/"
  - - meta
    - property: "og:title"
      content: "Deploy with Spanner - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/deployment/gcp/deploy-spanner.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/deployment/gcp/deploy-spanner/"
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
      content: "Deploy with Spanner - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/deployment/gcp/deploy-spanner.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Deploy Bufstream to Google Cloud with Spanner

This page walks you through installing Bufstream into your Google Cloud Platform (GCP) deployment, using Spanner for metadata stores. See [Tuning and performance](../../tuning-performance/) for defaults and recommendations about resources, replicas, storage, and scaling.

Data from your Bufstream cluster never leaves your network or reports back to Buf.

## Prerequisites

To deploy Bufstream on GCP, you need the following capabilities before you start:

- A Kubernetes cluster (v1.27 or newer)
- A Google Cloud Storage bucket
- A Bufstream service account, with read/write permission to the GCS bucket above.
- Helm (v3.12.0 or newer)

If you don't yet have your GCP environment, you'll need at least the following IAM permissions:

- `Kubernetes Engine Admin` role (`roles/container.admin`)
- `Storage Admin` role (`roles/storage.admin`)
- `Service Account Admin` role (`roles/iam.serviceAccountAdmin`)
- `Spanner Admin` role (`roles/spanner.admin`)
- Optionally, you may also have either of these roles, but neither is required:
  - `Role Administrator` role (`roles/iam.roleAdmin`)
  - `Service Account Key Admin` role (`roles/iam.serviceAccountKeyAdmin`) (_not_ recommended)

## Create a GKE cluster

Create a GKE standard cluster if you don't already have one. A GKE cluster involves many settings that vary depending on your use case. See the [official documentation](https://cloud.google.com/kubernetes-engine/docs/how-to/creating-a-regional-cluster) for details, but you'll need at least these settings:

- \[Optional, but recommended\] Workload identity federation:
  - Toggle `Enable Workload Identity` in the console under the Security tab when creating the cluster; or
  - Include `--workload-pool=<gcp-project-name.svc.id.goog>` on the gcloud command.
  - [See the official documentation](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity#enable_on_clusters_and_node_pools)
- Bufstream brokers use 2 CPUs and 8 GiB of memory by default, so you'll need a node pool with machine types at least as big as `n2d-standard-4`. Learn more about configuring resources in [Tuning and performance](../../tuning-performance/#resources-and-replicas).

## Create a GCS bucket

If you don't already have one, you need the `Storage Admin` role (`roles/storage.admin`).

### Single-region

```console
$ gcloud storage buckets create gs://<bucket-name> --project <gcp-project-name> --location=<gcp region>
```

### Dual-region/multi-region

```console
$ gcloud storage buckets create gs://<bucket-name> --project <gcp-project-name> --location=<gcp location> --placement=<region1>,<region2>
```

Read the [GCP docs](https://cloud.google.com/storage/docs/locations) for more details about the possible bucket locations.

## Create a Spanner instance

The instance `config` field specifies whether the Spanner instance is single-region, dual-region, or multi-region. Read the [GCP Spanner guide](https://cloud.google.com/spanner/docs/instance-configurations) to decide which base configuration name to use as the value. Then create a Spanner instance using the following command:

```console
$ gcloud spanner instances create <instance name> \
  --edition=STANDARD \
  --config=<single region or multi region instance config name> \
  --description='Bufstream-instance' \
  --default-backup-schedule-type=AUTOMATIC \
  --nodes=1
```

## Create a Bufstream Service Account

Bufstream needs a dedicated service account. If you don't have one yet, make sure you have the `Service Account Admin` role (`roles/iam.serviceAccountAdmin`) and create a service account:

```console
$ gcloud iam service-accounts create bufstream-service-account --project <project>
$ gcloud iam service-accounts add-iam-policy-binding bufstream-service-account@<gcp-project-name>.iam.gserviceaccount.com \
    --role roles/iam.workloadIdentityUser \
    --member "serviceAccount:<gcp-project-name>.svc.id.goog[bufstream/bufstream-service-account]"
```

+++tabs key:8cf0547693a3bad3be72abd98380d1de

== Specific permissions (recommended)

If you have the Storage Admin role, you can use add permissions directly on the bucket:

```console
$ gcloud storage buckets add-iam-policy-binding gs://<bucket-name> --member=serviceAccount:bufstream-service-account@<gcp-project-name>.iam.gserviceaccount.com --role=roles/storage.objectAdmin
$ gcloud spanner instances add-iam-policy-binding <spanner instance id> --member=serviceAccount:bufstream-service-account@<gcp-project-name>.iam.gserviceaccount.com --role=roles/spanner.databaseAdmin
```

== Project-wide permissions

If you have the the `Project IAM Admin` role (`roles/resourcemanager.projectIamAdmin`), you can also set the permission on the entire project:

```console
$ gcloud projects add-iam-policy-binding <gcp-project-name> --member=serviceAccount:bufstream-service-account --role=roles/storage.objectAdmin
$ gcloud projects add-iam-policy-binding <gcp-project-name> --member=serviceAccount:bufstream-service-account --role=roles/spanner.databaseAdmin
```

+++

Using Custom Object Storage permissions If you have the \`Role Administrator\` role (\`roles/iam.roleAdmin\`), you can also create a role with the minimal set of permissions required:

```console
$ gcloud iam roles create 'bufstream.gcs' \
  --project <gcp-project-name> \
  --permissions \
  storage.objects.create,\
  storage.objects.get,\
  storage.objects.delete,\
  storage.objects.list,\
  storage.multipartUploads.abort,\
  storage.multipartUploads.create,\
  storage.multipartUploads.list,\
  storage.multipartUploads.listParts
```

Then replace \`--role=roles/storage.objectAdmin\` with \`--role=projects//roles/bufstream.gcs\` in the preceding commands.

## Create a namespace

Create a Kubernetes namespace in the k8s cluster for the `bufstream` deployment to use:

```console
$ kubectl create namespace bufstream
```

## Deploy Bufstream

### 1\. Authenticate `helm`

To get started, authenticate `helm` with the Bufstream OCI registry using the keyfile that was sent alongside this documentation. _The keyfile should contain a base64 encoded string._

```console
$ cat keyfile | helm registry login -u _json_key_base64 --password-stdin \
  https://us-docker.pkg.dev/buf-images-1/bufstream
```

### 2\. Configure Bufstream's Helm values

Bufstream is configured using Helm values that are passed to the `bufstream` Helm chart. To configure the values:

1.  Create a Helm values file named `bufstream-values.yaml`, which is required by the `helm install` command in step 5. This file can be in any location, but we recommend creating it in the same directory where you run the `helm` commands.
2.  Put the values from the steps below in the `bufstream-values.yaml` file. Skip to [Install the Helm chart](#install-helm-chart) for a full example chart.

#### Configure object storage

Bufstream requires GCS object storage. See [Tuning and performance](../../tuning-performance/#permissions) for a minimal set of permissions required.

+++tabs key:7aa715642264784801820a6eecd2ac16

== GKE Workload Identity Federation (recommended)

Bufstream attempts to acquire credentials from the environment using GKE Workload Identity Federation. To configure storage, set the following Helm values, filling in your GCS variables and service account annotations for the service account binding:

::: info bufstream-values.yaml

```yaml
storage:
  use: gcs
  gcs:
    bucket: <bucket-name>
bufstream:
  serviceAccount:
    annotations:
      iam.gke.io/gcp-service-account: bufstream-service-account@<gcp-project-name>.iam.gserviceaccount.com
```

:::

The k8s service account to be bound to the GCP service account is named `bufstream-service-account`.

== Service account credentials

Alternatively, you can use service account credentials. You'll need the `Service Account Key Admin` role (`roles/iam.serviceAccountKeyAdmin`) for this.

1.  Create a key credential for the service account:

```console
$ gcloud iam service-accounts keys create credentials.json --iam-account=bufstream-service-account@<gcp-project-name>.iam.gserviceaccount.com --key-file-type=json
```

1.  Create a k8s secret containing the service account credentials:

```console
$ kubectl create secret --namespace bufstream generic bufstream-service-account-credentials \
  --from-file=credentials.json=credentials.json
```

1.  Set the `secretName` in the configuration:

::: info bufstream-values.yaml

```yaml
storage:
  use: gcs
  gcs:
    bucket: <bucket-name>
    secretName: "bufstream-service-account-credentials"
```

:::

+++

#### Configure Spanner

Spanner metadata configuration is the same for all types of Spanner instances:

::: info bufstream-values.yaml

```yaml
metadata:
  use: spanner
  spanner:
    # Values from the Spanner database
    project_id: <gcp project id>
    instance_id: <spanner instance id>
    database_name: bufstream
```

:::

### 3\. Install the Helm chart

After following the steps above, the set of Helm values should be similar to the example below. Follow the instructions below to deploy the basic Helm chart.

+++tabs key:7aa715642264784801820a6eecd2ac16

== GKE Workload Identity Federation (recommended)

::: info bufstream-values.yaml

```yaml
storage:
  use: gcs
  gcs:
    bucket: <bucket-name>
bufstream:
  serviceAccount:
    annotations:
      iam.gke.io/gcp-service-account: bufstream-service-account@<gcp-project-name>.iam.gserviceaccount.com
metadata:
  use: spanner
  spanner:
    # Values from the Spanner database
    project_id: <gcp project id>
    instance_id: <spanner instance id>
    database_name: bufstream
```

:::

== Service account credentials

::: info bufstream-values.yaml

```yaml
storage:
  use: gcs
  gcs:
    bucket: <bucket-name>
    secretName: "bufstream-service-account-credentials"
metadata:
  use: spanner
  spanner:
    # Values from the Spanner database
    project_id: <gcp project id>
    instance_id: <spanner instance id>
    atabase_name: bufstream
```

:::

+++

Using the `bufstream-values.yaml` Helm values file, install the Helm chart for the cluster and set the target Bufstream version:

### Single-region

```console
$ helm install bufstream oci://us-docker.pkg.dev/buf-images-1/bufstream/charts/bufstream \
  --version "<version>" \
  --namespace=bufstream \
  --values bufstream-values.yaml
```

### Multi-region

Install the helm chart to separate regional kubernetes clusters by specifying the `--kube-context=<gke cluster context>` argument.

```console
$ helm install --kube-context="<gke cluster region1>" bufstream oci://us-docker.pkg.dev/buf-images-1/bufstream/charts/bufstream \
  --version "<version>" \
  --namespace=bufstream \
  --values bufstream-values.yaml
$ helm install --kube-context="<gke cluster region2>" bufstream oci://us-docker.pkg.dev/buf-images-1/bufstream/charts/bufstream \
  --version "<version>" \
  --namespace=bufstream \
  --values bufstream-values.yaml
```

If you change any configuration in the `bufstream-values.yaml` file, re-run the Helm install command to apply the changes.

## Ingress using NEG

To access the Bufstream cluster from outside the kubernetes cluster, Network Endpoint Groups (NEGs) can be created. The easiest way to create NEGs is to use the built-in [GKE NEG controller](https://cloud.google.com/kubernetes-engine/docs/how-to/standalone-neg). Add the following configuration to `bufstream-values.yaml` file:

::: info bufstream-values.yaml

```yaml
bufstream:
  # ensure that both serviceAccount and service are under the bufstream section
  serviceAccount:
    annotations:
      iam.gke.io/gcp-service-account: ...
  service:
    annotations:
      cloud.google.com/neg: '{"exposed_ports": {"9089":{}, "9092":{}}}'
```

:::

and run the `helm upgrade` command for Bufstream:

```console
$ helm upgrade bufstream oci://us-docker.pkg.dev/buf-images-1/bufstream/charts/bufstream \
  --version "<version>" \
  --namespace=bufstream \
  --values bufstream-values.yaml
```

Follow [the Container-native load balancing through standalone zonal NEGs docs](https://cloud.google.com/kubernetes-engine/docs/how-to/standalone-neg#attaching-ext-https-lb) to attach external application load balancers to the created standalone NEG groups. Make sure that `TCP` protocol is used for port `9092` (kafka) and `HTTP` for `9089` (admin).

## Running CLI commands

Once you've deployed, you can run the [Bufstream CLI commands](../../../reference/cli/) directly using `kubectl exec bufstream <command>` on the running Bufstream pods. You don't need to install anything else.
