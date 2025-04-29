---

title: "Helm chart - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/reference/configuration/helm-values/"
  - - meta
    - property: "og:title"
      content: "Helm chart - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/reference/configuration/helm-values/"
  - - meta
    - property: "twitter:title"
      content: "Helm chart - Buf Docs"

---

# Bufstream Helm values

The Bufstream Helm chart is used to deploy Bufstream on Kubernetes. The Bufstream Helm `values.yaml` file defines the configuration for the Bufstream Kubernetes cluster. The configuration parameters and defaults documented below are the common and recommended settings for deploying a Bufstream cluster.

## Values and defaults

### `adminTLS`

\_object_adminTLS contains TLS configuration for Admin Server.Defaults to `{}`.

### `autoMigrateMetadataStorage`

\_bool_autoMigrateMetadataStorage enables the brokers to run migrations for the metadata storage on startup when it's true.Defaults to `true`.

### `bufstream.controlServerService.annotations`

\_object_Kubernetes Service annotations.Defaults to `{}`.

### `bufstream.controlServerService.enabled`

\_bool_Whether to create a Kubernetes Headless Service for the Bufstream Control Server (inter-broker RPC server using the Connect protocol).Defaults to `false`.

### `bufstream.deployment.affinity`

\_object_Bufstream Deployment Affinity.Defaults to `{}`.

### `bufstream.deployment.args`

\_list_Bufstream Deployment args to be appended.Defaults to `[]`.

### `bufstream.deployment.autoscaling.behavior`

_object_[Horizontal Pod Autoscaler behavior.](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/#configurable-scaling-behavior)Defaults to `{}`.

### `bufstream.deployment.autoscaling.enabled`

\_bool_Whether to enable the horizontal pod autoscaler.Defaults to `false`.

### `bufstream.deployment.autoscaling.maxReplicas`

\_int_Maximum number of autoscaler allowed replicas.Defaults to `18`.

### `bufstream.deployment.autoscaling.minReplicas`

\_int_Minimum number of autoscaler allowed replicas.Defaults to `6`.

### `bufstream.deployment.autoscaling.targetCPU`

\_string_Target CPU threshold for managing replica count.Defaults to `"50"`.

### `bufstream.deployment.autoscaling.targetMemory`

\_string_Target memory threshold for managing replica count.Defaults to `""`.

### `bufstream.deployment.command`

\_list_Bufstream Deployment command.Defaults to `["/usr/local/bin/bufstream"]`.

### `bufstream.deployment.extraContainerPorts`

\_object_Bufstream Deployment Extra container ports for the bufstream container.Defaults to `{}`.

### `bufstream.deployment.extraContainers`

\_list_Bufstream Deployment additional containers to run alongside the bufstream container.Defaults to `[]`.

### `bufstream.deployment.extraEnv`

\_list_Bufstream Deployment Extra environment variables for the bufstream container.Defaults to `[]`.

### `bufstream.deployment.extraVolumeMounts`

\_list_Bufstream Deployment Extra volume mounts for the bufstream container.Defaults to `[]`.

### `bufstream.deployment.extraVolumes`

\_list_Bufstream Deployment Extra volumes.Defaults to `[]`.

### `bufstream.deployment.kind`

\_string_Bufstream Deployment kind. Supports \[Deployment, StatefulSet\]Defaults to `"StatefulSet"`.

### `bufstream.deployment.livenessProbe.failureThreshold`

\_int_Bufstream Deployment Liveness Probe Maximum failure threshold.Defaults to `3`.

### `bufstream.deployment.livenessProbe.timeoutSeconds`

\_int_Bufstream Deployment Liveness Probe timeout.Defaults to `5`.

### `bufstream.deployment.nodeSelector`

\_object_Bufstream Deployment Node selector.Defaults to `{}`.

### `bufstream.deployment.podAnnotations`

\_object_Bufstream Deployment Pod annotations.Defaults to `{}`.

### `bufstream.deployment.podLabels`

\_object_Bufstream Deployment Pod labels.Defaults to `{}`.

### `bufstream.deployment.podManagementPolicy`

\_string_Bufstream Deployment pod management policy to use when StatefulSet kind is used.Defaults to `"Parallel"`.

### `bufstream.deployment.readinessProbe.failureThreshold`

\_int_Bufstream Deployment Readiness Probe Maximum failure threshold.Defaults to `3`.

### `bufstream.deployment.readinessProbe.timeoutSeconds`

\_int_Bufstream Deployment Readiness Probe timeout.Defaults to `5`.

### `bufstream.deployment.replicaCount`

\_int_Bufstream Deployment replica count.Defaults to `3`.

### `bufstream.deployment.resources.limits.cpu`

\_string_Bufstream Deployment Resource request CPU.Defaults to `""`.

### `bufstream.deployment.resources.limits.memory`

\_string_Bufstream Deployment Resource limits memory.Defaults to `"8Gi"`.

### `bufstream.deployment.resources.requests.cpu`

\_int_Bufstream Deployment Resource request CPU.Defaults to `2`.

### `bufstream.deployment.resources.requests.memory`

\_string_Bufstream Deployment Resource request memory.Defaults to `"8Gi"`.

### `bufstream.deployment.selectorLabels`

\_object_Bufstream Deployment Selector labels.Defaults to `{}`.

### `bufstream.deployment.serviceName`

\_string_Bufstream Deployment service name to link for per pod DNS registration when StatefulSet kind is used.Defaults to `""`.

### `bufstream.deployment.shareProcessNamespace`

\_bool_Bufstream Deployment setting for sharing the process namespace.Defaults to `false`.

### `bufstream.deployment.startupProbe.failureThreshold`

\_int_Bufstream Deployment Liveness Probe ConfigurationDefaults to `3`.

### `bufstream.deployment.terminationGracePeriodSeconds`

\_int_Bufstream Deployment termination grace period.Defaults to `420`.

### `bufstream.deployment.tolerations`

\_list_Bufstream Deployment Tolerations.Defaults to `[]`.

### `bufstream.image.pullPolicy`

\_string_Bufstream Deployment container image pull policy.Defaults to `"IfNotPresent"`.

### `bufstream.image.repository`

\_string_Bufstream Deployment container image repository.Defaults to `"us-docker.pkg.dev/buf-images-1/bufstream-public/images/bufstream"`.

### `bufstream.image.tag`

\_string_Overrides the image tag whose default is the chart version.Defaults to `"latest"`.

### `bufstream.podDisruptionBudget.enabled`

\_bool_Whether to enable pod disruption budget.Defaults to `false`.

### `bufstream.podDisruptionBudget.maxUnavailable`

\_string_Number of pods that are unavailable after eviction as number or percentage (e.g.: 50%). Has higher precedence over `minAvailable`Defaults to `""`.

### `bufstream.podDisruptionBudget.minAvailable`

\_string_Number of pods that are available after eviction as number or percentage (eg.: 50%).Defaults to `""` (defaults to 0 if not specified).

### `bufstream.service.annotations`

\_object_Kubernetes Service annotations.Defaults to `{}`.

### `bufstream.service.enabled`

\_bool_Whether to create a Kubernetes Service for this bufstream deployment.Defaults to `true`.

### `bufstream.service.loadBalancerIP`

\_string_Kubernetes Service Load Balancer IP for when type is LoadBalancer.Defaults to `""`.

### `bufstream.service.type`

\_string_Kubernetes Service type.Defaults to `"ClusterIP"`.

### `bufstream.serviceAccount.annotations`

\_object_Kubernetes Service Account annotations.Defaults to `{}`.

### `bufstream.serviceAccount.create`

\_bool_Whether to create a Kubernetes Service Account for this bufstream deployment.Defaults to `true`.

### `bufstream.serviceAccount.name`

\_string_Kubernetes Service Account name.Defaults to `"bufstream-service-account"`.

### `cluster`

\_string_The name of the cluster. Used by bufstream to identify itself.Defaults to `"bufstream"`.

### `configOverrides`

\_object_Bufstream configuration overrides. Any value here will be set directly on the bufstream config.yaml, taking precedence over any other helm defined values.Defaults to `{}`.

### `connectTLS`

\_object_connectTLS contains TLS configuration for Control Server which is used for inter-broker communication using Connect protocol.Defaults to `{"client":{},"server":{}}`.

### `connectTLS.client`

\_object_Client contains client side TLS configuration to connect to the Control Server.Defaults to `{}`.

### `connectTLS.server`

\_object_Server contains server side TLS configuration.Defaults to `{}`.

### `dataEnforcement`

\_object_Configuration for data enforcement via schemas of records flowing in and out of the broker.Defaults to `{}`.

### `discoverZoneFromNode`

\_bool_When true, it enables additional permissions so Bufstream can get the zone via the Kubernetes API server by reading the zone topology label of the node the bufstream pod is running on. Bufstream won't attempt to do the discovery if the zone option is false.Defaults to `false`.

### `extraObjects`

\_list_Extra Kubernetes objects to install as part of this chart.Defaults to `[]`.

### `imagePullSecrets`

\_list_Reference to one or more secrets to be used when pulling images. For more information, see [Pull an Image from a Private Registry](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/).Defaults to `[]`.

### `kafka.address`

\_object_The address the Kafka server should listen on. This defaults to 0.0.0.0 (any) and port 9092.Defaults to `{"host":"0.0.0.0","port":9092}`.

### `kafka.authentication`

\_object_The authentication config.Defaults to `{}`.

### `kafka.exactLogOffsets`

\_bool_If exact log hwm and start offsets should be computed when fetching records.Defaults to `false`.

### `kafka.exactLogSizes`

\_bool_If exact log sizes should be fetched when listing sizes for all topics/partitions.Defaults to `true`.

### `kafka.fetchEager`

\_bool_If a fetch should return as soon as any records are available.Defaults to `true`.

### `kafka.fetchSync`

\_bool_If fetches from different readers should be synchronized to improve cache hit rates.Defaults to `true`.

### `kafka.groupConsumerSessionTimeout`

\_string_The default group consumer session timeout.Defaults to `"45s"`.

### `kafka.groupConsumerSessionTimeoutMax`

\_string_The maximum group consumer session timeout.Defaults to `"2m"`.

### `kafka.groupConsumerSessionTimeoutMin`

\_string_The minimum group consumer session timeout.Defaults to `"10s"`.

### `kafka.idleTimeout`

\_int_How long a Kafka connection can be idle before being closed by the server. If set a value less than or equal to zero, the timeout will be disabled.Defaults to `0`.

### `kafka.numPartitions`

\_int_The default number of partitions to use for a new topic.Defaults to `1`.

### `kafka.partitionBalanceStrategy`

\_string_How to balance topic/partitions across bufstream nodes. One of: \["BALANCE_STRATEGY_UNSPECIFIED", "BALANCE_STRATEGY_PARTITION", "BALANCE_STRATEGY_HOST", "BALANCE_STRATEGY_CLIENT_ID"\]Defaults to `"BALANCE_STRATEGY_PARTITION"`.

### `kafka.produceConcurrent`

\_bool_If records from a producer to different topic/partitions may be sequenced concurrently instead of serially.Defaults to `true`.

### `kafka.publicAddress`

\_object_The public address clients should use to connect to the Kafka server. This defaults to the K8S service DNS and port 9092.Defaults to `{host: "<service>.<namespace>.svc.cluster.local", port: 9092}`.

### `kafka.requestBufferSize`

\_int_The number of kafka requests to unmarshal and buffer before processing.Defaults to `5`.

### `kafka.tlsCertificateSecrets`

\_list_Kubernetes secrets containing a `tls.crt` and `tls.key` (as the secret keys, see https://kubernetes.io/docs/concepts/configuration/secret/#tls-secrets) to present to the client. The first certificate compatible with the client's requirements is selected automatically.Defaults to `[]`.

### `kafka.tlsClientAuth`

\_string_Declare the policy the server will follow for mutual TLS (mTLS). Supported values are \[NO_CERT, REQUEST_CERT, REQUIRE_CERT, VERIFY_CERT_IF_GIVEN, REQUIRE_AND_VERIFY_CERT\]. Only supported when using tlsCertificateSecret.Defaults to `"NO_CERT"`.

### `kafka.tlsClientCasSecret`

\_string_Kubernetes secret containing `tlsClientCasSecretKey` as the secret key (defaults to `tls.crt`) PEM-encoded certificate authorities used by the server to validate the client certificates. This field cannot be empty if tlsClientAuth is set for client performing verification. Only supported when using tlsCertificateSecret.Defaults to `""`.

### `kafka.tlsClientCasSecretKey`

\_string_Key within the `tlsClientCasSecret` kubernetes secret containing the certificate authority.Defaults to `"tls.crt"`.

### `kafka.zoneBalanceStrategy`

\_string_How to balance clients across zones, when the client does not specify a zone. One of: \["BALANCE_STRATEGY_UNSPECIFIED", "BALANCE_STRATEGY_PARTITION", "BALANCE_STRATEGY_HOST", "BALANCE_STRATEGY_CLIENT_ID"\]Defaults to `"BALANCE_STRATEGY_PARTITION"`.

### `metadata.etcd.addresses`

\_list_Etcd addresses to connect to.Defaults to `[]`.

### `metadata.etcd.tls`

\_object_TLS client configuration for bufstream to connect to etcd.Defaults to `{}`.

### `metadata.postgres.cloudsql`

\_object_Cloud SQL configuration.Defaults to `{"iam":false,"instance":"","privateIP":false}`.

### `metadata.postgres.cloudsql.iam`

\_bool_Connect using CloudSQL IAM authentication.Defaults to `false`.

### `metadata.postgres.cloudsql.instance`

\_string_Cloud SQL instance connection name to connect to, typically in the format "project-name:region:instance-name".Defaults to `""`.

### `metadata.postgres.cloudsql.privateIP`

\_bool_Connect to the CloudSQL instance using a private IP.Defaults to `false`.

### `metadata.postgres.dsn`

\_string_Postgres DSN.Defaults to `""`.

### `metadata.postgres.env`

\_string_Environment variable name containing a Postgres DSN. See `bufstream.deployment.extraEnv` for configuring environment variables.Defaults to `""`.

### `metadata.postgres.pool`

\_object_Connection pool configuration.Defaults to `{"maxConnections":0,"minConnections":0}`.

### `metadata.postgres.pool.maxConnections`

\_int_The maximum size of the connection pool. Defaults to 10.Defaults to `0`.

### `metadata.postgres.pool.minConnections`

\_int_The minimum size of the connection pool.Defaults to `0`.

### `metadata.postgres.secretName`

\_string_Kubernetes secret with a `dsn` key containing a Postgres DSN.Defaults to `""`.

### `metadata.spanner.databaseName`

\_string_Database name of the Spanner database. Defaults to `bufstream` if not specified.Defaults to `""`.

### `metadata.spanner.instanceId`

\_string_Instance ID of the Spanner database.Defaults to `""`.

### `metadata.spanner.projectId`

\_string_Project ID of the Spanner database.Defaults to `""`.

### `metadata.use`

\_string_Which metadata storage that bufstream is using. `etcd` and `spanner` are supported.Defaults to `"etcd"`.

### `nameOverride`

\_string_Overrides .Chart.Name throughout the chart.Defaults to `""`.

### `namespaceCreate`

\_bool_Whether to create the namespace where resources are located.Defaults to `false`.

### `namespaceOverride`

\_string_Will be used as the namespace for all resources instead of .Release.namespace if setDefaults to `""`.

### `observability.exporter.address`

\_string_Open Telemetry base endpoint to push metrics and traces. The value has a host and an optional port. It should not include the URL path, such as "/v1/traces" or the scheme. This can be overridden by metrics.address or tracing.address.Defaults to `""`.

### `observability.exporter.insecure`

\_bool_Whether to disable TLS for the exporter's HTTP connection. This can be overridden by metrics.insecure or tracing.insecure.Defaults to `false`.

### `observability.logLevel`

\_string_Log level to use.Defaults to `"INFO"`.

### `observability.metrics.address`

\_string_The endpoint the exporter connects to. The value has a host and an optional port. It should not include the URL path, such as "/v1/metrics" or the scheme. Specify path and insecure instead.Defaults to `""`.

### `observability.metrics.aggregation.consumerGroups`

\_bool_Defaults to `false`.

### `observability.metrics.aggregation.partitions`

\_bool_Defaults to `false`.

### `observability.metrics.aggregation.principalIDs`

\_bool_Defaults to `false`.

### `observability.metrics.aggregation.topics`

\_bool_Defaults to `false`.

### `observability.metrics.enableLabels`

\_object_Defaults to `{}`.

### `observability.metrics.exporter`

\_string_Open Telemetry exporter. Supports \[NONE, STDOUT, HTTP, HTTPS, PROMETHEUS\]. Deprecated: use exporterType instead.Defaults to `""`.

### `observability.metrics.exporterType`

\_string_Open Telemetry exporter. Supports \[NONE, STDOUT, OTLP_GRPC, OTLP_HTTP, PROMETHEUS\]Defaults to `"NONE"`.

### `observability.metrics.insecure`

\_bool_Whether to disable TLS. This can only be specified for OTLP_HTTP exporter type.Defaults to `false`.

### `observability.metrics.otlpTemporalityPreference`

\_string_Defaults to `""`.

### `observability.metrics.path`

\_string_Defaults to `""`.

### `observability.otlpEndpoint`

\_string_Open Telemetry base endpoint to push metrics and traces to. Deprecated: use exporter.address and exporter.insecure instead.Defaults to `""`.

### `observability.sensitiveInformationRedaction`

\_string_Redact sensitive information such as topic names, before adding to metrics, traces and logs. Supports \[NONE, OPAQUE\]Defaults to `"NONE"`.

### `observability.tracing.address`

\_string_The endpoint the exporter connects to. The value has a host and an optional port. It should not include the URL path, such as "/v1/traces" or the scheme. Specify path and insecure instead.Defaults to `""`.

### `observability.tracing.exporter`

\_string_Open Telemetry exporter. Supports \[NONE, STDOUT, HTTP, HTTPS\]. Deprecated: use exporterType instead.Defaults to `""`.

### `observability.tracing.exporterType`

\_string_Open Telemetry exporter. Supports \[NONE, STDOUT, OTLP_GRPC, OTLP_HTTP\]Defaults to `"NONE"`.

### `observability.tracing.insecure`

\_bool_Whether to disable TLS. This can only be specified for OTLP_HTTP exporter type.Defaults to `false`.

### `observability.tracing.path`

\_string_Defaults to `""`.

### `observability.tracing.traceRatio`

\_float_Trace sample ratio.Defaults to `0.1`.

### `storage.azure.accessKeyId`

\_string_Azure storage account name to use for auth instead of the metadata server.Defaults to `""`.

### `storage.azure.bucket`

\_string_Azure storage account container name.Defaults to `""`.

### `storage.azure.endpoint`

\_string_Azure storage account endpoint to use—for example, https://.blob.core.windows.netDefaults to `""`.

### `storage.azure.prefix`

\_string_Azure prefix to use for all stored files.Defaults to `""`.

### `storage.azure.secretName`

\_string_Kubernetes secret containing a `secret_access_key` (as the Azure storage account key) to use instead of the metadata server.Defaults to `""`.

### `storage.gcs.bucket`

\_string_GCS bucket name.Defaults to `""`.

### `storage.gcs.prefix`

\_string_GCS prefix to use for all stored files.Defaults to `""`.

### `storage.gcs.secretName`

\_string_Kubernetes secret containing a `credentials.json` (as the secret key) service account key to use instead of the metadata server.Defaults to `""`.

### `storage.s3.accessKeyId`

\_string_S3 Access Key ID to use instead of the metadata server.Defaults to `""`.

### `storage.s3.bucket`

\_string_S3 bucket name.Defaults to `""`.

### `storage.s3.endpoint`

\_string_S3 endpoint to use instead of the default—for example, https://example.comDefaults to `""`.

### `storage.s3.forcePathStyle`

\_bool_S3 Force Path Style setting. See https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/examples-s3.html.Defaults to `false`.

### `storage.s3.prefix`

\_string_S3 prefix to use for all stored files.Defaults to `""`.

### `storage.s3.region`

\_string_S3 bucket region.Defaults to `""`.

### `storage.s3.secretName`

\_string_Kubernetes secret containing a `secret_access_key` (as the secret key) to use instead of the metadata server.Defaults to `""`.

### `storage.use`

\_string_Which object storage that bufstream is using. Currently, `gcs` and `s3` are supported.Defaults to `"s3"`.

### `zone`

\_string_The zone location of brokers, e.g., the datacenter/availability zone where the broker is running. If not given, bufstream will try to infer this from node metadata. This is currently for bufstream internal functionality, and does not control cloud providers such as GCP directly.Defaults to `""`.

## Annotated `values.yaml`

The Helm `values.yaml` file below contains all of the configuration parameters for a Bufstream cluster with recomemnded defaults. You can copy this annotated YAML into your Helm values file to use as a reference when configuring and deploying Bufstream.

```yaml
# -- Overrides .Chart.Name throughout the chart.
nameOverride: ""
# -- Will be used as the namespace for all resources instead of .Release.namespace if set
namespaceOverride: ""
# -- Whether to create the namespace where resources are located.
namespaceCreate: false
# -- Reference to one or more secrets to be used when pulling images.
# For more information, see [Pull an Image from a Private Registry](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/).
imagePullSecrets: []
# -- The name of the cluster. Used by bufstream to identify itself.
cluster: bufstream
# -- The zone location of brokers, e.g., the datacenter/availability zone where the broker is running.
# If not given, bufstream will try to infer this from node metadata.
# This is currently for bufstream internal functionality, and does not control cloud providers such as GCP directly.
zone: ""
# -- When true, it enables additional permissions so Bufstream can get the zone via the Kubernetes API server by reading the zone topology label of the node the bufstream pod is running on. Bufstream won't attempt to do the discovery if the zone option is false.
discoverZoneFromNode: false
# -- Configuration for data enforcement via schemas of records flowing in and out of the broker.
dataEnforcement: {}
kafka:
  # -- The address the Kafka server should listen on. This defaults to 0.0.0.0 (any) and port 9092.
  address:
    host: 0.0.0.0
    port: 9092
  # -- The public address clients should use to connect to the Kafka server. This defaults to the K8S service DNS and port 9092.
  # @default -- `{host: "<service>.<namespace>.svc.cluster.local", port: 9092}`
  publicAddress: {}
  # -- Kubernetes secrets containing a `tls.crt` and `tls.key` (as the secret keys, see https://kubernetes.io/docs/concepts/configuration/secret/#tls-secrets) to present to the client. The first certificate compatible with the client's requirements is selected automatically.
  tlsCertificateSecrets: []
  # -- Declare the policy the server will follow for mutual TLS (mTLS). Supported values are [NO_CERT, REQUEST_CERT, REQUIRE_CERT, VERIFY_CERT_IF_GIVEN, REQUIRE_AND_VERIFY_CERT]. Only supported when using tlsCertificateSecret.
  # @default -- `"NO_CERT"`
  tlsClientAuth: ""
  # -- Kubernetes secret containing `tlsClientCasSecretKey` as the secret key (defaults to `tls.crt`) PEM-encoded certificate authorities used by the server to validate the client certificates. This field cannot be empty if tlsClientAuth is set for client performing verification. Only supported when using tlsCertificateSecret.
  tlsClientCasSecret: ""
  # -- Key within the `tlsClientCasSecret` kubernetes secret containing the certificate authority.
  tlsClientCasSecretKey: "tls.crt"
  # -- If a fetch should return as soon as any records are available.
  fetchEager: true
  # -- If fetches from different readers should be synchronized to improve cache hit rates.
  fetchSync: true
  # -- If records from a producer to different topic/partitions may be sequenced concurrently instead of serially.
  produceConcurrent: true
  # -- How to balance clients across zones, when the client does not specify a zone. One of: ["BALANCE_STRATEGY_UNSPECIFIED", "BALANCE_STRATEGY_PARTITION", "BALANCE_STRATEGY_HOST", "BALANCE_STRATEGY_CLIENT_ID"]
  zoneBalanceStrategy: BALANCE_STRATEGY_PARTITION
  # -- How to balance topic/partitions across bufstream nodes. One of: ["BALANCE_STRATEGY_UNSPECIFIED", "BALANCE_STRATEGY_PARTITION", "BALANCE_STRATEGY_HOST", "BALANCE_STRATEGY_CLIENT_ID"]
  partitionBalanceStrategy: BALANCE_STRATEGY_PARTITION
  # -- The number of kafka requests to unmarshal and buffer before processing.
  requestBufferSize: 5
  # -- How long a Kafka connection can be idle before being closed by the server. If set a value less than or equal to zero, the timeout will be disabled.
  idleTimeout: 0
  # -- The default number of partitions to use for a new topic.
  numPartitions: 1
  # -- If exact log sizes should be fetched when listing sizes for all topics/partitions.
  exactLogSizes: true
  # -- If exact log hwm and start offsets should be computed when fetching records.
  exactLogOffsets: false
  # -- The default group consumer session timeout.
  groupConsumerSessionTimeout: 45s
  # -- The minimum group consumer session timeout.
  groupConsumerSessionTimeoutMin: 10s
  # -- The maximum group consumer session timeout.
  groupConsumerSessionTimeoutMax: 2m

  # -- The authentication config.
  authentication:
    {}
    # sasl:
    #   # Configuration for the PLAIN mechanism.
    #   # See https://datatracker.ietf.org/doc/html/rfc4616.
    #   plain:
    #     # Kubernetes secrets containing `username` and `password` as secret keys.
    #     credentialsSecrets: []
    #   # Whether to accept ANONYMOUS as a mechanism. Not recommended.
    #   # See https://datatracker.ietf.org/doc/html/rfc4505.
    #   anonymous: false
    #   # Configuration for the SCRAM-* mechanisms.
    #   # See https://datatracker.ietf.org/doc/html/rfc5802.
    #   scram:
    #     adminCredentials:
    #       # The hash algorithm used by the admin credentials. Supports [SHA256, SHA512].
    #       hash: ""
    #       # Only one of plaintextCredentialsSecret or salted can be set.
    #       # Kubernetes secret containing `username` and `plaintext` as secret keys.
    #       plaintextCredentialsSecret: ""
    #       # Salted admin credentials.
    #       salted:
    #         iterations: 0
    #         # Kubernetes secret containing 'username', 'salt', 'salted-password' as secret keys.
    #         saltedSecret: ""
    #   oauthBearer:
    #     # How to acquire the JWKS.
    #     jwks:
    #       # If the JWKS is static, the configMap containing the JWKS at key 'jwks.json'.
    #       staticConfig:
    #       # A hosted JWKS, that is accessible to the cluster.
    #       remote:
    #         # Kubernetes configMap with key 'url' of JWKS's URL, which must be an HTTPS url.
    #         urlConfig:
    #         # The keys are loaded once on startup and are refreshed every hour by default.
    #         # This controls the refresh interval.
    #         refreshInterval: 60m
    #         # Optional TLS config to access the url.
    #         tls:
    #           # Controls whether a client verifies the server's certificate chain and host name.
    #           insecureSkipVerify: false
    #           # The existing secret name that contains ca.crt key of the PEM-encoded root certificate
    #           # authorities used by the client to validate the server certificates.
    #           rootCaSecret: ""
    #       # if provided will check for the "aud" claim to match the provided value.
    #       audience: ""
    #       # if provided will check for the "iss" claim to match the provided value.
    #       issuer: ""
    # mtls:
    #   # Where to extract the principal from a verified certificate.
    #   # If the certificate is not required to be verified, this will
    #   # be a noop and the principal will default to `User:Anonymous`.
    #   # Supports [ANONYMOUS, SUBJECT_COMMON_NAME, SAN_DNS, SAN_URI].
    #   principalSource: ""
    # # The maximum receive size allowed before and during initial authentication.
    # # Default receive size is 512KB. Set to -1 for no limit.
    # maxReceiveBytes: 0

# -- connectTLS contains TLS configuration for Control Server which is used for inter-broker communication using Connect protocol.
connectTLS:
  # -- Server contains server side TLS configuration.
  server:
    {}
    # server:
    #   # Kubernetes secrets containing a `tls.crt` and `tls.key` (as the secret keys, see https://kubernetes.io/docs/concepts/configuration/secret/#tls-secrets) to present to the client. The first certificate compatible with the client's requirements is selected automatically.
    #   certificateSecrets: []
  # -- Client contains client side TLS configuration to connect to the Control Server.
  client:
    {}
    # client:
    #   # Controls whether a client verifies the server's certificate chain and host name.
    #   insecureSkipVerify: true
    #   # The existing secret name that contains ca.crt key of the PEM-encoded root certificate authorities used by the client to validate
    #   # the server certificates.
    #   rootCaSecret: ""

# -- adminTLS contains TLS configuration for Admin Server.
adminTLS:
  {}
  # adminTLS:
  #   # Kubernetes secrets containing a `tls.crt` and `tls.key` (as the secret keys, see https://kubernetes.io/docs/concepts/configuration/secret/#tls-secrets) to present to the client. The first certificate compatible with the client's requirements is selected automatically.
  #   certificateSecrets: []

# -- autoMigrateMetadataStorage enables the brokers to run migrations for the metadata storage on startup when it's true.
autoMigrateMetadataStorage: true

metadata:
  # -- Which metadata storage that bufstream is using.
  # `etcd` and `spanner` are supported.
  use: etcd
  etcd:
    # -- Etcd addresses to connect to.
    addresses: []
    # addresses:
    # - host: ""
    #   port: 2379

    # -- TLS client configuration for bufstream to connect to etcd.
    tls: {}
    # tls:
    #   # Controls whether a client verifies the server's certificate chain and host name.
    #   insecureSkipVerify: true
    #   # The existing secret name that contains ca.crt key of the PEM-encoded root certificate authorities used by the client to validate
    #   # the server certificates.
    #   rootCaSecret: ""
  spanner:
    # -- Project ID of the Spanner database.
    projectId: ""
    # -- Instance ID of the Spanner database.
    instanceId: ""
    # -- Database name of the Spanner database. Defaults to `bufstream` if not specified.
    databaseName: ""
  postgres:
    # -- Postgres DSN.
    dsn: ""
    # -- Kubernetes secret with a `dsn` key containing a Postgres DSN.
    secretName: ""
    # -- Environment variable name containing a Postgres DSN. See `bufstream.deployment.extraEnv` for configuring environment variables.
    env: ""
    # -- Cloud SQL configuration.
    cloudsql:
      # -- Cloud SQL instance connection name to connect to, typically in the format "project-name:region:instance-name".
      instance: ""
      # -- Connect using CloudSQL IAM authentication.
      iam: false
      # -- Connect to the CloudSQL instance using a private IP.
      privateIP: false
    # -- Connection pool configuration.
    pool:
      # -- The maximum size of the connection pool. Defaults to 10.
      maxConnections: 0
      # -- The minimum size of the connection pool.
      minConnections: 0
storage:
  # -- Which object storage that bufstream is using.
  # Currently, `gcs` and `s3` are supported.
  use: s3
  gcs:
    # -- GCS bucket name.
    bucket: ""
    # -- GCS prefix to use for all stored files.
    prefix: ""
    # -- Kubernetes secret containing a `credentials.json` (as the secret key) service account key to use instead of the metadata server.
    secretName: ""
  s3:
    # -- S3 bucket name.
    bucket: ""
    # -- S3 bucket region.
    region: ""
    # -- S3 endpoint to use instead of the default—for example, https://example.com
    endpoint: ""
    # -- S3 prefix to use for all stored files.
    prefix: ""
    # -- S3 Force Path Style setting. See https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/examples-s3.html.
    forcePathStyle: false
    # -- S3 Access Key ID to use instead of the metadata server.
    accessKeyId: ""
    # -- Kubernetes secret containing a `secret_access_key` (as the secret key) to use instead of the metadata server.
    secretName: ""
  azure:
    # -- Azure storage account container name.
    bucket: ""
    # -- Azure storage account endpoint to use—for example, https://<storage account>.blob.core.windows.net
    endpoint: ""
    # -- Azure prefix to use for all stored files.
    prefix: ""
    # -- Azure storage account name to use for auth instead of the metadata server.
    accessKeyId: ""
    # -- Kubernetes secret containing a `secret_access_key` (as the Azure storage account key) to use instead of the metadata server.
    secretName: ""
observability:
  # -- Log level to use.
  logLevel: INFO
  # -- Open Telemetry base endpoint to push metrics and traces to.
  # Deprecated: use exporter.address and exporter.insecure instead.
  otlpEndpoint: ""
  exporter:
    # -- Open Telemetry base endpoint to push metrics and traces. The value has a host and an optional port.
    # It should not include the URL path, such as "/v1/traces" or the scheme.
    # This can be overridden by metrics.address or tracing.address.
    address: ""
    # -- Whether to disable TLS for the exporter's HTTP connection.
    # This can be overridden by metrics.insecure or tracing.insecure.
    insecure: false
  metrics:
    # -- Open Telemetry exporter. Supports [NONE, STDOUT, HTTP, HTTPS, PROMETHEUS].
    # Deprecated: use exporterType instead.
    exporter: ""
    # -- Open Telemetry exporter. Supports [NONE, STDOUT, OTLP_GRPC, OTLP_HTTP, PROMETHEUS]
    exporterType: "NONE"
    # -- The endpoint the exporter connects to. The value has a host and an optional port.
    # It should not include the URL path, such as "/v1/metrics" or the scheme.
    # Specify path and insecure instead.
    address: ""
    # The URL path appended to address. Defaults to "/v1/metrics".
    # This can only be specified for the OTLP_HTTP exporter type.
    path: ""
    # -- Whether to disable TLS.
    # This can only be specified for OTLP_HTTP exporter type.
    insecure: false
    # This omits metrics that depend on the kafka.topic.partition attribute, which may have high cardinality
    # depending on the configuration. One example is kafka.topic.partition.offset.high_water_mark.
    # This omits only the attribute for metrics that have this attribute without depending on it.
    # One example is kafka.produce.record.size.
    # Deprecated: set aggregation.partitions to true instead.
    # @ignored
    omitPartitionAttribute: false
    # Whether to emit bufstream.internal.* metrics.
    # @ignored
    enableInternalMetrics: false
    # Then labels to enable for metrics.
    enableLabels: {}
    # Allows changing the default temporality preference for OTLP metrics.
    # This is recommended to be set to "delta" for reporting to Datadog agents.
    # See https://docs.datadoghq.com/opentelemetry/guide/otlp_delta_temporality/ for more details.
    otlpTemporalityPreference: ""
    # This option, typically set to reduce cardinality, aggregates some metrics over certain attributes, such as kafka.topic.name.
    aggregation:
      # Aggregate metrics across all topics to avoid cardinality issues with clusters with a large number of topics.
      # Metrics that support this aggregation will report the 'kafka.topic.name' attribute as '_all_topics_'.
      # NOTE: This implies partitions aggregation, which omits metrics like 'bufstream.kafka.topic.partition.offset.high_water_mark'.
      topics: false
      # Aggregate metrics across all partitions to avoid cardinality issues with clusters with a large number of partitions.
      # Metrics that support aggregation will report the 'kafka.partition.id' attribute as -1, while some metrics, such as
      # 'bufstream.kafka.topic.partition.offset.high_water_mark' will be omitted if partition level aggregation is enabled.
      partitions: false
      # Aggregate metrics across all consumer groups to avoid cardinality issues with clusters with a large number of groups.
      # Metrics that support aggregation will report the 'kafka.consumer.group.id' as '_all_groups_', while some metrics
      # such as 'bufstream.kafka.consumer.group.generation' will be omitted if consumer group level aggregation is enabled.
      consumerGroups: false
      # Aggregate metrics across all authentication principals to avoid cardinality issues with clusters with a large number
      # of principals. Metrics that support aggregation will report the 'authentication.principal_id' as '_all_principal_ids_'.
      principalIDs: false
  tracing:
    # -- Open Telemetry exporter. Supports [NONE, STDOUT, HTTP, HTTPS].
    # Deprecated: use exporterType instead.
    exporter: ""
    # -- Open Telemetry exporter. Supports [NONE, STDOUT, OTLP_GRPC, OTLP_HTTP]
    exporterType: "NONE"
    # -- The endpoint the exporter connects to. The value has a host and an optional port.
    # It should not include the URL path, such as "/v1/traces" or the scheme.
    # Specify path and insecure instead.
    address: ""
    # The URL path appended to address. Defaults to "/v1/traces".
    # This can only be specified for the OTLP_HTTP or OTLP_GRPC exporter type.
    path: ""
    # -- Whether to disable TLS.
    # This can only be specified for OTLP_HTTP exporter type.
    insecure: false
    # -- Trace sample ratio.
    traceRatio: 0.1
  # -- Redact sensitive information such as topic names, before adding to metrics, traces and logs.
  # Supports [NONE, OPAQUE]
  sensitiveInformationRedaction: "NONE"
bufstream:
  service:
    # -- Whether to create a Kubernetes Service for this bufstream deployment.
    enabled: true
    # -- Kubernetes Service type.
    type: ClusterIP
    # -- Kubernetes Service annotations.
    annotations: {}
    # -- Kubernetes Service Load Balancer IP for when type is LoadBalancer.
    loadBalancerIP: ""
  serviceAccount:
    # -- Whether to create a Kubernetes Service Account for this bufstream deployment.
    create: true
    # -- Kubernetes Service Account name.
    name: bufstream-service-account
    # -- Kubernetes Service Account annotations.
    annotations: {}
  deployment:
    # -- Bufstream Deployment kind.
    # Supports [Deployment, StatefulSet]
    kind: StatefulSet
    # -- Bufstream Deployment command.
    # @default -- `["/usr/local/bin/bufstream"]`
    command: []
    # -- Bufstream Deployment args to be appended.
    args: []
    # -- Bufstream Deployment replica count.
    replicaCount: 3
    # -- Bufstream Deployment Pod annotations.
    podAnnotations: {}
    # -- Bufstream Deployment Selector labels.
    selectorLabels: {}
    # -- Bufstream Deployment Pod labels.
    podLabels: {}
    # -- Bufstream Deployment pod management policy to use when StatefulSet kind is used.
    podManagementPolicy: Parallel
    # -- Bufstream Deployment service name to link for per pod DNS registration when StatefulSet kind is used.
    serviceName: ""

    resources:
      requests:
        # -- Bufstream Deployment Resource request CPU.
        cpu: 2
        # -- Bufstream Deployment Resource request memory.
        memory: 8Gi
      limits:
        # -- Bufstream Deployment Resource request CPU.
        cpu: ""
        # -- Bufstream Deployment Resource limits memory.
        memory: 8Gi
    # -- Bufstream Deployment Node selector.
    nodeSelector: {}
    # -- Bufstream Deployment Affinity.
    affinity: {}
    # -- Bufstream Deployment Tolerations.
    tolerations: []
    # -- Bufstream Deployment Extra environment variables for the bufstream container.
    extraEnv: []
    # -- Bufstream Deployment Extra volume mounts for the bufstream container.
    extraVolumeMounts: []
    # -- Bufstream Deployment Extra volumes.
    extraVolumes: []
    # -- Bufstream Deployment Extra container ports for the bufstream container.
    extraContainerPorts: {}
    # -- Bufstream Deployment additional containers to run alongside the bufstream container.
    extraContainers: []
    livenessProbe:
      # -- Bufstream Deployment Liveness Probe Maximum failure threshold.
      failureThreshold: 3
      # -- Bufstream Deployment Liveness Probe timeout.
      timeoutSeconds: 5
    readinessProbe:
      # -- Bufstream Deployment Readiness Probe Maximum failure threshold.
      failureThreshold: 3
      # -- Bufstream Deployment Readiness Probe timeout.
      timeoutSeconds: 5
    startupProbe:
      # -- Bufstream Deployment Liveness Probe Configuration
      failureThreshold: 3
    # -- Bufstream Deployment termination grace period.
    terminationGracePeriodSeconds: 420 # 7 minutes
    # -- Bufstream Deployment setting for sharing the process namespace.
    shareProcessNamespace: false
    autoscaling:
      # -- Whether to enable the horizontal pod autoscaler.
      enabled: false
      # -- Minimum number of autoscaler allowed replicas.
      minReplicas: 6
      # -- Maximum number of autoscaler allowed replicas.
      maxReplicas: 18
      # -- Target CPU threshold for managing replica count.
      targetCPU: "50"
      # -- Target memory threshold for managing replica count.
      targetMemory: ""
      # -- [Horizontal Pod Autoscaler behavior.](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/#configurable-scaling-behavior)
      behavior: {}
  controlServerService:
    # -- Whether to create a Kubernetes Headless Service for the Bufstream Control Server (inter-broker RPC server using the Connect protocol).
    enabled: false
    # -- Kubernetes Service annotations.
    annotations: {}
  podDisruptionBudget:
    # -- Whether to enable pod disruption budget.
    enabled: false
    # -- Number of pods that are available after eviction as number or percentage (eg.: 50%).
    # @default -- `""` (defaults to 0 if not specified)
    minAvailable: ""
    # -- Number of pods that are unavailable after eviction as number or percentage (e.g.: 50%). Has higher precedence over `minAvailable`
    maxUnavailable: ""
  image:
    # -- Bufstream Deployment container image repository.
    repository: us-docker.pkg.dev/buf-images-1/bufstream-public/images/bufstream
    # -- Overrides the image tag whose default is the chart version.
    tag: "latest"
    # -- Bufstream Deployment container image pull policy.
    pullPolicy: IfNotPresent
# -- Extra Kubernetes objects to install as part of this chart.
extraObjects: []
# -- Bufstream configuration overrides. Any value here will be set directly on the bufstream config.yaml, taking precedence over any other helm defined values.
configOverrides: {}
```

## Related documentation

To configure Bufstream with recommended, cloud-specific settings, consult the [AWS](../../../deployment/aws/configure/) and [GCP](../../../deployment/gcp/configure/) documentation.
