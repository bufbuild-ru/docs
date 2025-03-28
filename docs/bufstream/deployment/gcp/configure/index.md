# Configure Bufstream for Google Cloud

This page describes Bufstream's defaults and provides specific recommendations for configuring your Bufstream cluster in Google Cloud Platform (GCP) to get the best combination of price and performance.

## Resources and replicas

For initial Bufstream deployments we recommend a deployment size of 3 replicas with a minimum resource request size of 2 cores, 8 GiB of memory. The `bufstream` Helm chart defaults to these settings, and can be adjusted with the following Helm values:

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

### Network-intensive workloads

Because Bufstream doesn't have a local disk, most I/O occurs over the network to support Kafka produce and fetch requests. Bufstream uses compression, compaction, and caching to minimize the load on the instances. However, because Bufstream needs to write to and read from remote storage, it puts more load on the network than out-of-the-box Kafka.

## Horizontal Pod Autoscaler

We recommend configuring your Bufstream deployment with a minimum deployment size of 6 replicas, and a node pool that runs across multiple Availability Zones (AZs). For example, for a node group over 3 AZs, a minimum replica count of 6 keeps cross-AZ network charges down if an instance is unavailable (such as during a deploy). Properly configured clients are directed to Bufstream instances in the same zone. We also recommend maintaining a ratio of 1:4 vCPU to GiB of memory. For example, for a 6 replica deployment, a 1GiB/s workload may demand 16 cores and 64 GiB of memory.We also recommend autoscaling based on CPU usage with a 50% average usage target. Adjusting the autoscaling threshold impacts the overall cost of your cluster and its ability to respond to bursty workloads effectively. You can configure autoscaling for the Bufstream deployment using the following Helm values:

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

### Bucket lifecycle

To support multi-part uploads, you must configure a lifecycle policy to clean up failed or partially successful uploads. Configuring this policy stops failed uploads from polluting the bucket and increasing storage costs. We recommend a maximum of 7 days or the topic retention value.

### Bucket permissions

For Bufstream to interact with your bucket, you need to update the configuration with the appropriate permissions. Bufstream needs to perform the following bucket operations:

- `storage.objects.create`: Create new storage objects
- `storage.objects.get`: Retrieve existing storage objects
- `storage.objects.delete`: Remove old storage objects according to retention and compaction rules
- `storage.objects.list`: View all storage objects to enforce retention and compaction rules
- `storage.multipartUploads.\*`: Allow multi-part uploads

### Reducing produce latency

Produce latency can be decreased by reducing Bufstream's configured flush interval. Lowering the flush interval incurs greater cost in the form of more frequent writes to object storage.

```yaml
configOverrides:
  intake:
    delay_max: 50ms
```

## Metadata storage (`etcd`)

Bufstream requires an `etcd` cluster in which to persist cluster metadata. We recommend [configuring `etcd`](https://etcd.io/docs/v3.5/op-guide/configuration/) with the following settings:

```yaml
auto-compaction-mode: periodic
auto-compaction-retention: 30s
```

As `etcd` is sensitive to disk performance, we recommend using SSD-backed disks.

### Permissions

Bufstream uses the [Bitnami etcd package](https://bitnami.com/stack/etcd/helm). Most Bitnami containers are non-root and therefore privileged tasks like mounting volumes may fail during deployment as the containers don't have the correct privileges to modify ownership of the filesystem.If a Bufstream deploy fails as a result of etcd attempting to mount a persistent volume, the following error appears in your logs:

```text
"error":"cannot access data directory: mkdir /bitnami/etcd/data: permission denied"
```

To resolve this error and grant the Bitnami etcd containers the right permissions, add the following to your Helm values to allow the container to change the owner and group of etcd's mountpoint to one with appropriate filesystem permissions:

```yaml
volumePermissions:
  enabled: true
```

To learn more about this Helm value or other configurable permissions in Bitnami's etcd chart, consult the Bitnami etcd [README](https://github.com/bitnami/charts/tree/main/bitnami/etcd#bitnami-package-for-etcd). For more information about troubleshooting Bitnami helm chart issues, read the [troubleshooting guide](https://docs.bitnami.com/general/how-to/troubleshoot-helm-chart-issues/).

## Observability

The `observability` block is used to configure the collection and exporting of metrics and traces from your application, using Prometheus or OTLP:

::: info bufstream-values.yaml

```yaml
observability:
  # Optional, set the log level
  # logLevel: INFO
  # otlpEndpoint: "" # Optional, OTLP endpoint to send traces and metrics to
  metrics:
    # Optional, can be either "NONE", "STDOUT", "HTTP", "HTTPS" or "PROMETHEUS"
    # When set to HTTP or HTTPS, will send OTLP metrics
    # When set to PROMETHEUS, will expose prometheus metrics for scraping on port 9090 under /metrics
    exporter: "NONE"
  tracing:
    # Optional, can be either "NONE", STDOUT", "HTTP", or "HTTPS"
    # When set to HTTP or HTTPS, will send OTLP metrics
    exporter: "NONE"
    # Optional, trace sampling ratio, defaults to 0.1
    # traceRatio: 0.1
```

:::
