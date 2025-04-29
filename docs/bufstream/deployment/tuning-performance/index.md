---

title: "Tuning and performance - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/deployment/tuning-performance/"
  - - meta
    - property: "og:title"
      content: "Tuning and performance - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/deployment/tuning-performance/"
  - - meta
    - property: "twitter:title"
      content: "Tuning and performance - Buf Docs"

---

# Tuning and performance

This page provides recommendations for configuring your Bufstream cluster to optimize cost and performance.

## Resources and replicas

For initial Bufstream deployments, we recommend a deployment size of 3 replicas with a minimum resource request size of 2 cores and 8 GiB of memory. The `bufstream` Helm chart defaults to these settings, and can be adjusted with the following Helm values:

```yaml
bufstream:
  deployment:
    # Number of replicas to deploy
    replicaCount: 3
    resources:
      requests:
        cpu: 2
        memory: 8Gi
      limits:
        # Optional
        # cpu: 2
        memory: 8Gi
```

Bufstream runs best on network-optimized instance types, such as the following:

- **AWS:** `m6in`
- **Azure:** `Dasv5` (generally anything in the D family that ends in v5 or v6 should be fine)
- **Google Cloud:** Based on our CPU recommendation, the default bandwidth for any instance type should be sufficient.

If you choose larger instances or other types, the cost of running Bufstream changes according to the region and instance type you select.

### Network-intensive workloads

Because Bufstream doesn't have a local disk, most I/O occurs over the network to support Kafka produce and fetch requests. Bufstream uses compression, compaction, and caching to minimize the load on the instances. However, because Bufstream needs to write to and read from remote storage, it puts more load on the network than out-of-the-box Kafka.

## Horizontal pod autoscaling

We recommend configuring your Bufstream deployment with a minimum deployment size of 6 replicas, and a node group that runs across multiple Availability Zones (AZs). For example, for a node group over 3 AZs, a minimum replica count of 6 keeps cross-AZ network charges down if an instance is unavailable (such as during a deploy). Properly configured clients are directed to Bufstream instances in the same zone. We also recommend maintaining a ratio of 1:4 vCPU to GiB of memory. For example, for a 6 replica deployment, a 1GiB/s workload may demand 16 cores and 64 GiB of memory.If you run Bufstream using the instance type recommended above, we also recommend autoscaling based on CPU usage with a 50% average usage target. Adjusting the autoscaling threshold impacts the overall cost of your cluster and its ability to respond to bursty workloads effectively. You can configure autoscaling for the Bufstream deployment using the following Helm values:

```yaml
bufstream:
  deployment:
    autoscaling:
      enabled: true
      # Optional, replicas and target % cpu usage
      minReplicas: 6
      maxReplicas: 18
      targetCPU: "50"
```

## Object storage

Because Bufstream doesn't store data on a local disk, all data from the cluster is written to object storage. Though Bufstream's only requirement is an isolated bucket to write to, we recommend configuring additional settings.

### Object retention

Bufstream manages the object lifecycle directly, including deleting expired or compacted objects, so we don't recommend setting a retention policy for the bucket. If you do set a retention policy, it must be longer than the maximum retention of any topic in your Bufstream cluster to guard against data loss.

### Storage lifecycle

To support multi-part uploads, you must configure a lifecycle policy to clean up failed or partially successful uploads. Configuring this policy stops failed uploads from polluting the bucket and increasing storage costs. We recommend a maximum of 7 days or the topic retention value.

### Permissions

For Bufstream to interact with your object storage, you need to update the configuration with the appropriate permissions.

+++tabs key:0c3de125175bbe0c120a1ded72b43dd3

== AWS

Bufstream uses an S3 bucket for object storage, and needs to perform the following operations:

- `s3:GetObject`: Read existing objects
- `s3:PutObject`: Create new objects
- `s3:DeleteObject`: Remove old objects according to retention and compaction rules
- `s3:ListBucket`: List objects in the bucket
- `s3:AbortMultipartUpload`: Allow failing of multi-part uploads that won't succeed

For more information about S3 bucket permissions and actions, consult the [AWS S3 documentation](https://docs.aws.amazon.com/AmazonS3/latest/API/API_Operations_Amazon_Simple_Storage_Service.html).

== Azure

Bufstream uses Azure Blob Storage for object storage, and at minimum, requires the `Storage Blob Data Contributor` [RBAC role](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles) on the Storage account container.

== Google Cloud

Bufstream uses a Google Cloud Storage bucket for object storage, and needs to perform the following operations:

- `storage.objects.create`: Create new storage objects
- `storage.objects.get`: Retrieve existing storage objects
- `storage.objects.delete`: Remove old storage objects according to retention and compaction rules
- `storage.objects.list`: View all storage objects to enforce retention and compaction rules
- `storage.multipartUploads.*`: Allow multi-part uploads

+++

### Reducing produce latency

Produce latency can be decreased by reducing Bufstream's configured flush interval. Lowering the flush interval incurs greater cost in the form of more frequent writes to object storage.

```yaml
configOverrides:
  intake:
    delay_max: 50ms
```

## Metadata storage

### etcd

We recommend [configuring `etcd`](https://etcd.io/docs/v3.5/op-guide/configuration/) with the following settings:

```yaml
auto-compaction-mode: periodic
auto-compaction-retention: 30s
```

Because `etcd` is sensitive to disk performance, we also recommend using these disks:

- **AWS:** `gp3` or `io1/io2` EBS disks
- **Azure:** `Premium SSD v2` disks
- **Google Cloud:** SSD-backed disks

#### Permissions

Bufstream uses the [Bitnami etcd package](https://bitnami.com/stack/etcd/helm). Most Bitnami containers are non-root, so privileged tasks like mounting volumes may fail during deployment as the containers don't have the correct privileges to modify ownership of the filesystem.If a Bufstream deploy fails as a result of etcd attempting to mount a persistent volume, the following error appears in your logs:

```text
"error":"cannot access data directory: mkdir /bitnami/etcd/data: permission denied
```

To resolve this error and grant the Bitnami etcd containers the right permissions, add the following to your Helm values to allow the container to change the owner and group of etcd's mountpoint to one with appropriate filesystem permissions:

```yaml
volumePermissions:
  enabled: true
```

To learn more about this Helm value or other configurable permissions in Bitnami's etcd chart, consult the Bitnami etcd [README](https://github.com/bitnami/charts/tree/main/bitnami/etcd#bitnami-package-for-etcd). For more information about troubleshooting Bitnami helm chart issues, read the [troubleshooting guide](https://docs.bitnami.com/general/how-to/troubleshoot-helm-chart-issues/).

### Postgres

Resource requirements depend on the expected load, but we recommend the following instances.

+++tabs key:0c3de125175bbe0c120a1ded72b43dd3

== AWS

#### RDS for PostgreSQL

We recommend a compute-optimized instance with a minimum of 4 vCPUs and 8 GiB RAM (`db.c6gd.xlarge` instance class).

== Azure

#### Azure Database for PostgreSQL flexible server

We recommend using an instance with a minimum of 4 vCPUs and 16 GiB RAM (`Standard_D4ds_v5` compute size) with the `P20 (2300 iops)` Performance tier or greater.

== Google Cloud

#### CloudSQL

We recommend using an instance with a minimum of 4 vCPUs and 8 GiB RAM (`db-custom-4-8192` instance class) with a minimum of 100 GB of provisioned storage.

+++
