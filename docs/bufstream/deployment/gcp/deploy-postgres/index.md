---

title: "Deploy with Postgres - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/deployment/gcp/deploy-postgres/"
  - - meta
    - property: "og:title"
      content: "Deploy with Postgres - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/deployment/gcp/deploy-postgres/"
  - - meta
    - property: "twitter:title"
      content: "Deploy with Postgres - Buf Docs"

---

# Deploy Bufstream to Google Cloud with Cloud SQL for PostgreSQL

This page walks you through installing Bufstream into your Google Cloud Platform (GCP) deployment, using PostgreSQL for metadata storage. See [Tuning and performance](../../tuning-performance/) for defaults and recommendations about resources, replicas, storage, and scaling.Data from your Bufstream cluster never leaves your network or reports back to Buf.

## Prerequisites

To deploy Bufstream on GCP, you need the following capabilities before you start:

- A Kubernetes cluster (v1.27 or newer)
- A Google Cloud Storage bucket
- A Google Cloud SQL PostgreSQL instance (version 14 or higher)
- A Bufstream service account, with read/write permission to the GCS bucket above.
- Helm (v3.12.0 or newer)

If you don't yet have your GCP environment, you'll need at least the following IAM permissions:

- `Kubernetes Engine Admin` role (`roles/container.admin`)
- `Storage Admin` role (`roles/storage.admin`)
- `Service Account Admin` role (`roles/iam.serviceAccountAdmin`)
- `Cloud SQL Admin` role (`roles/cloudsql.admin`)
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

```console
$ gcloud storage buckets create gs://<bucket-name> --project <gcp-project-name>
```

## Create a CloudSQL instance for PostgreSQL

If you don't already have one, you need the `Cloud SQL Admin` role (`roles/cloudsql.admin`).Create a new Cloud SQL instance with IAM authentication support:

```console
$ gcloud sql instances create <instance name> \
    --storage-size=100 \
    --database-version=POSTGRES_17 \
    --region=<region> \
    --tier=db-custom-4-8192 \
    --edition=ENTERPRISE \
    --database-flags=cloudsql.iam_authentication=on \
    --availability-type=REGIONAL
```

Set a password for the `postgres` user:

```console
$ gcloud sql users set-password postgres \
    --instance=<instance name> \
    --prompt-for-password
```

Create a database for Bufstream:

```console
$ gcloud sql databases create bufstream \
    --instance=<instance name>
```

For more details about instance creation, see the [official docs](https://cloud.google.com/sql/docs/postgres/create-instance).

## Create a Bufstream Service Account

Bufstream needs a dedicated service account. If you don't have one yet, make sure you have the `Service Account Admin` role (`roles/iam.serviceAccountAdmin`) and create a service account:

```console
$ gcloud iam service-accounts create bufstream-service-account --project <project>
$ gcloud iam service-accounts add-iam-policy-binding bufstream-service-account@<gcp-project-name>.iam.gserviceaccount.com \
    --role roles/iam.workloadIdentityUser \
    --member "serviceAccount:<gcp-project-name>.svc.id.goog[bufstream/bufstream-service-account]"
```

+++tabs key:e5352254d6572a18deae68e5bdb1dc4f

== Bucket-specific permissions (recommended)

If you have the Storage Admin role, you can use add permissions directly on the bucket:

```console
$ gcloud storage buckets add-iam-policy-binding gs://<bucket-name> --member=serviceAccount:bufstream-service-account@<gcp-project-name>.iam.gserviceaccount.com --role=roles/storage.objectAdmin
```

== Project-wide permissions

If you have the the `Project IAM Admin` role (`roles/resourcemanager.projectIamAdmin`), you can also set the permission on the entire project:

```console
$ gcloud projects add-iam-policy-binding <gcp-project-name> --member=serviceAccount:bufstream-service-account --role=roles/storage.objectAdmin
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

### Grant Cloud SQL PostgreSQL permissions to access the database

Create a database user for the `bufstream` service account:

```console
$ gcloud sql users create bufstream-service-account@<gcp-project-name>.iam \
    --instance=<instance name> \
    --type=cloud_iam_service_account
```

Using the [client in the Cloud Shell](https://cloud.google.com/sql/docs/postgres/connect-admin-ip#cloud-shell), connect to the instance via the private IP address (requires Cloud SQL proxy) and execute the following SQL queries to grant the permissions to Bufstream:

```sql
GRANT ALL PRIVILEGES ON DATABASE bufstream TO "bufstream-service-account@<gcp-project-name>.iam";
GRANT ALL ON SCHEMA public TO "bufstream-service-account@<gcp-project-name>.iam";
```

Allow the Bufstream service account to connect to the Cloud SQL instance:

```console
$ gcloud projects add-iam-policy-binding <gcp-project-name> \
    --member=serviceAccount:bufstream-service-account --role=roles/cloudsql.client
$ gcloud projects add-iam-policy-binding <gcp-project-name> \
    --member=serviceAccount:bufstream-service-account --role=roles/cloudsql.instanceUser
```

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

#### Configure PostgreSQL

Then, configure Bufstream to connect to PostgreSQL:

::: info bufstream-values.yaml

```yaml
metadata:
  use: postgres
  postgres:
    dsn: user=bufstream-service-account@<gcp-project-name>.iam database=bufstream
    cloudsql:
      instance: <gcp-project-name>:<region>:<instance name>
      iam: true
```

:::

### 3\. Install the Helm chart

If you want to deploy Bufstream with zone-aware routing, go to the [zonal deployment steps](#zonal-deployment). If not, follow the instructions below to deploy the basic Helm chart.After following the steps above, the set of Helm values should be similar to the example below:

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
  use: postgres
  postgres:
    dsn: user=bufstream-service-account@<gcp-project-name>.iam database=bufstream
    cloudsql:
      instance: <gcp-project-name>:<region>:<instance name>
      iam: true
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
  use: postgres
  postgres:
    dsn: user=bufstream-service-account@<gcp-project-name>.iam database=bufstream
    cloudsql:
      instance: <gcp-project-name>:<region>:<instance name>
      iam: true
```

:::

+++

Using the `bufstream-values.yaml` Helm values file, install the Helm chart for the cluster and set the target Bufstream version:

```console
$ helm install bufstream oci://us-docker.pkg.dev/buf-images-1/bufstream/charts/bufstream \
  --version "<version>" \
  --namespace=bufstream \
  --values bufstream-values.yaml
```

If you change any configuration in the `bufstream-values.yaml` file, re-run the Helm install command to apply the changes.

## Ingress using NEG

To access the Bufstream cluster from outside the kubernetes cluster, you can create Network Endpoint Groups (NEGs). The easiest way to create NEGs is to use the built-in [GKE NEG controller](https://cloud.google.com/kubernetes-engine/docs/how-to/standalone-neg). Add the following configuration to `bufstream-values.yaml`:

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

Then run the `helm upgrade` command for Bufstream:

```console
$ helm upgrade bufstream oci://us-docker.pkg.dev/buf-images-1/bufstream/charts/bufstream \
  --version "<version>" \
  --namespace=bufstream \
  --values bufstream-values.yaml
```

Follow the [Container-native load balancing through standalone zonal NEGs docs](https://cloud.google.com/kubernetes-engine/docs/how-to/standalone-neg#attaching-ext-https-lb) to attach external application load balancers to the created standalone NEG groups. Make sure that `TCP` protocol is used for port `9092` (kafka) and `HTTP` for `9089` (admin).

## Deploy Bufstream with zone-aware routing

### 1\. Specify a list of target zones

First, specify a list of target zones in a `ZONES` variable, which are used for future commands.

```console
$ ZONES=(<zone1> <zone2> <zone3>)
```

### 2\. Create GCP service account association for all zones

Create a Bufstream account association for the GCP service account in each zone:

```console
$ for ZONE in $ZONES; do
gcloud iam service-accounts add-iam-policy-binding bufstream-service-account@<gcp-project-name>.iam.gserviceaccount.com \
    --role roles/iam.workloadIdentityUser \
    --member "serviceAccount:<gcp-project-name>.svc.id.goog[bufstream/bufstream-service-account-${ZONE}]"
done
```

### 3\. Create Helm values files for each zone

Then, use this script to iterate through the availability zones saved in the `ZONES` variable and create a Helm values file for each zone:

```console
$ for ZONE in $ZONES; do
  cat <<EOF > "bufstream-${ZONE}-values.yaml"
nameOverride: bufstream-${ZONE}
name: bufstream-${ZONE}
bufstream:
  serviceAccount:
    name: bufstream-service-account-${ZONE}
  deployment:
    replicaCount: 2
    affinity:
      nodeAffinity:
        requiredDuringSchedulingIgnoredDuringExecution:
          nodeSelectorTerms:
          - matchExpressions:
            - key: topology.kubernetes.io/zone
              operator: In
              values:
              - ${ZONE}
kafka:
  publicAddress:
    host: bufstream-${ZONE}.bufstream.svc.cluster.local
    port: 9092
EOF
done
```

Using the example `ZONES` variable above creates three values files: `bufstream-<zone1>-values.yaml`, `bufstream-<zone2>-values.yaml` and `bufstream-<zone3>-values.yaml`. However, Bufstream is available in all GCP regions, so you can specify AZs in any region such as `us-central1` or `europe-central2` in the variable.

### 4\. Install the Helm chart for each zone

After following the steps above and creating the zone-specific values files, the collection of Helm values should be structurally similar to the example below:

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
  use: postgres
  postgres:
    dsn: user=bufstream-service-account@<gcp-project-name>.iam database=bufstream
    cloudsql:
      instance: <gcp-project-name>:<region>:<instance name>
      iam: true
observability:
  metrics:
    exporter: "PROMETHEUS"
```

:::

::: info bufstream-_zone1_-values.yaml

```yaml
nameOverride: bufstream-<zone1>
name: bufstream-<zone1>
bufstream:
  serviceAccount:
    name: bufstream-service-account-<zone1>
  deployment:
    replicaCount: 2
    affinity:
      nodeAffinity:
        requiredDuringSchedulingIgnoredDuringExecution:
          nodeSelectorTerms:
            - matchExpressions:
                - key: topology.kubernetes.io/zone
                  operator: In
                  values:
                    - <zone1>
kafka:
  publicAddress:
    host: bufstream-<zone1>.bufstream.svc.cluster.local
    port: 9092
```

:::

To deploy a zone-aware Bufstream using the `bufstream-values.yaml` Helm values file, install the Helm chart for the cluster, set the target Bufstream version, and supply the `ZONES` variable:

```console
$ for ZONE in $ZONES; do
  helm install "bufstream-${ZONE}" oci://us-docker.pkg.dev/buf-images-1/bufstream/charts/bufstream \
    --version "<version>" \
    --namespace=bufstream \
    --values bufstream-values.yaml \
    --values "bufstream-${ZONE}-values.yaml"
done
```

If you change any configurations in the `bufstream-values.yaml` file, re-run the Helm install command to apply the changes.

### 5\. Create a regional service for the cluster

Create a regional service which creates a bootstrap address for bufstream across all the zones.

```console
$ cat <<EOF | kubectl apply -f -
---
apiVersion: v1
kind: Service
metadata:
  labels:
    bufstream.buf.build/cluster: bufstream
  name: bufstream
  namespace: bufstream
spec:
  type: ClusterIP
  ports:
  - name: connect
    port: 8080
    protocol: TCP
    targetPort: 8080
  - name: admin
    port: 9089
    protocol: TCP
    targetPort: 9089
  - name: kafka
    port: 9092
    protocol: TCP
    targetPort: 9092
  selector:
    bufstream.buf.build/cluster: bufstream
EOF
```

## Running CLI commands

Once you've deployed, you can run the [Bufstream CLI commands](../../../reference/cli/) directly using `kubectl exec bufstream <command>` on the running Bufstream pods. You don't need to install anything else.
