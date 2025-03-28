# Installation

The BSR is designed to run on Kubernetes, and is distributed as a Helm Chart and accompanying Docker images through an OCI registry. The Helm Chart and Docker images are versioned, and are expected to be used together. The default values in the Chart use Docker images with the same version as the Chart itself.Review the list of [BSR dependencies](../architecture/#dependencies) before getting started.

## Prerequisites

Alongside this documentation you should have received two files:

1.  A _keyfile_ to pull the BSR Helm Chart and accompanying Docker images from an OCI registry. This keyfile should contain a base64 encoded string.
2.  A _license_ to operate the BSR. The license file should contain `buflicense-` followed by a base64 encoded string.

You will need both to proceed.

## 1\. Authenticate `helm`

To get started, authenticate `helm` with the Buf OCI registry using the keyfile that was sent alongside this documentation. _The keyfile should contain a base64 encoded string._

```console
$ cat keyfile | helm registry login -u _json_key_base64 --password-stdin \
  https://us-docker.pkg.dev/buf-images-1/bsr
```

## 2\. Create a namespace

Create a Kubernetes namespace in the k8s cluster for the `bsr` Helm Chart to use:

```console
$ kubectl create namespace bsr
```

## 3\. Create a pull secret

Create a pull secret using the same provided keyfile from step 1. The cluster uses it to pull images from the Buf OCI registry:

```console
$ kubectl create secret --namespace bsr docker-registry bufpullsecret \
  --docker-server=us-docker.pkg.dev/buf-images-1/bsr \
  --docker-username=_json_key_base64 \
  --docker-password="$(cat keyfile)"
```

## 4\. Configure the BSR’s Helm values

The BSR is configured using Helm values through the `bsr` Helm Chart.Create a file named `bsr.yaml` to store the Helm values, which is required by the `helm install` step below.

::: tip NoteThis file can be in any location, but we recommend creating it in the same directory where the helm commands are run.

:::

Set the desired `host` and configure the chart to use the license provided to you by Buf and the image pull secret created above:

```yaml
host: example.com # Hostname that the BSR will be served from
license:
  key: "buflicense-..." # License key that was provided to you by Buf
imagePullSecrets:
  - name: bufpullsecret # The image pull secret that was created above
```

Put the values from the steps below in the `bsr.yaml` file. You can skip to [Install the Helm Chart](#install-helm) for a full example Helm chart.

### Configure object storage

The BSR requires either S3-compatible object storage, Azure Blob Storage, or GCS.

#### S3

+++tabs key:14dd5889446981744016b24ab2b163db

== Instance profile (recommended)

The bufd client and oci-registry will attempt to acquire credentials from the environment. To configure the storage set the following Helm values, filling in your S3 variables:

```yaml
storage:
  use: s3
  s3:
    bucketName: "my-bucket-name"
    region: "us-east-1"
    # forcePathStyle: false # Optional, use path-style bucket URLs (http://s3.amazonaws.com/BUCKET/KEY)
    # insecure: false # Optional, disable TLS
    # endpoint: "example.com" # Optional
```

== Access key pair

Alternatively, you may instead use an access key pair.

1.  Add the `accessKeyId` to the configuration:

    ```yaml
    storage:
      use: s3
      s3:
        accessKeyId: "AKIAIOSFODNN7EXAMPLE"
        bucketName: "my-bucket-name"
        region: "us-east-1"
        # forcePathStyle: false # Optional, use path-style bucket URLs (http://s3.amazonaws.com/BUCKET/KEY)
        # insecure: false # Optional, disable TLS
        # endpoint: "example.com" # Optional
    ```

2.  Create a k8s secret containing the s3 access secret key:

    ```console
    $ kubectl create secret --namespace bsr generic bufd-storage \
      --from-literal=secret_access_key=<s3 secret access key>
    ```

+++

#### Azure Blob Storage

A [standard general storage account type](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview#types-of-storage-accounts) is required to support block blobs.

+++tabs key:1439cf47372efa97b38bedbc1f965f80

== Workload identity

The `bufd` client and `oci-registry` will attempt to acquire credentials from the environment. To configure the storage, set the following Helm values by filling in your Azure variables and adding the required annotations for the `bufd` and `ociregistry` service accounts and deployments:

```yaml
storage:
  use: azure
  azure:
    accountName: "my-storage-account-name"
    container: "my-container"
    useAccountKey: false
bufd:
  serviceAccount:
    annotations:
      azure.workload.identity/client-id: "my-client-id"
  deployment:
    podLabels:
      azure.workload.identity/use: "true"
ociregistry:
  serviceAccount:
    annotations:
      azure.workload.identity/client-id: "my-client-id"
  deployment:
    podLabels:
      azure.workload.identity/use: "true"
```

The service accounts to be bound to the federated identity credentials are named `bufd-service-account` and `oci-registry-service-account`.

== Account key

Alternatively, you may instead use the storage account key.

1.  Set the required helm values:

    ```yaml
    storage:
      use: azure
      azure:
        accountName: "my-storage-account-name"
        container: "my-container"
        useAccountKey: true
    ```

2.  Create a k8s secret containing an Azure storage account key:

    ```console
    $ kubectl create secret --namespace bsr generic bufd-storage \
      --from-literal=account_key=<azure storage account key>
    ```

+++

#### GCS

##### Workload Identity Federation

To allow access to the GCS bucket, the `bufd` and `oci-registry` services require [Workload Identity Federation](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity#kubernetes-sa-to-iam) to be configured, with a GCP service account attached to the pods. To configure the storage, set the following Helm values, filling in your GCS bucket name and GCP service account:

```yaml
storage:
  use: gcs
  gcs:
    bucketName: <bucket name>
bufd:
  serviceAccount:
    annotations:
      iam.gke.io/gcp-service-account: <gcp-service-account-name>@<gcp project>.iam.gserviceaccount.com
ociregistry:
  serviceAccount:
    annotations:
      iam.gke.io/gcp-service-account: <gcp-service-account-name>@<gcp project>.iam.gserviceaccount.com
```

With this configuration, the helm chart creates two k8s service accounts that need to be bound to the GCP Service account: `bufd-service-account` and `oci-registry-service-account`. You also need to grant `roles/storage.objectAdmin` permissions on the GCS bucket to the GCP service account.

### Create a Postgres database

The BSR requires a [PostgreSQL](https://www.postgresql.org/) database. The BSR `postgres` user requires full access to the database, and additionally must be able to create the `pgcrypto` and `pg_trgm` extensions.

+++tabs key:b58181b82cef81bd1b6e2899a9282451

== Username and password

To configure Postgres, set the following helm values:

```yaml
postgres:
  host: "postgres.example.com"
  port: 5432
  database: postgres
  user: postgres
```

Then create a k8s secret containing the Postgres user password:

```console
$ kubectl create secret --namespace bsr generic bufd-postgres \
  --from-literal=password=<postgres password>
```

Note that if you're using [CosmosDB](https://azure.microsoft.com/en-us/products/cosmos-db), it must be configured as a single-node cluster with [high availability (HA)](https://learn.microsoft.com/en-us/azure/cosmos-db/postgresql/concepts-high-availability) enabled.

== GCP Cloud SQL IAM Authentication

You can configure the BSR to use GCP Cloud SQL IAM Authentication. The GCP service account needs the following permissions to connect to Cloud SQL properly:

```text
roles/cloudsql.client
roles/cloudsql.instanceUser
```

Bufd also creates extensions as part of the migrations it runs in postgres, so you need to run the following command from an existing GCP Cloud SQL Superuser on the postgres shell:

```text
GRANT cloudsqlsuperuser to "<gcp-service-account-name>@<gcp project>.iam";
```

Finally, if you were already running the BSR with another existing Cloud SQL user (eg, `postgres`), you need to reassign all ownerships:

```text
GRANT "<gcp-service-account-name>@<gcp project>.iam" TO postgres;
REASSIGN OWNED by "postgres" TO "<gcp-service-account-name>@<gcp project>.iam";
REVOKE "<gcp-service-account-name>@<gcp project>.iam" FROM postgres;
```

Your configuration then looks like this:

```yaml
postgres:                                                                                                                                                                                                                                                       │
  cloudSqlInstance: <gcp project>:<gcp region>:<gcp cloud sql instance name>
  database: postgres                                                                                                                                                                                                                                            │
  user: <gcp-service-account-name>@<gcp project>.iam
  # Optional, if you need
  # impersonateServiceAccount: <gcp-service-account-to-impersonate-name>@<gcp project>.iam.gserviceaccount.com                                                                                                                                                                                                │
```

Please refer to [the GCP docs](https://cloud.google.com/sql/docs/postgres/iam-authentication) for more details on the setup.

+++

### Configure Redis

The BSR requires a [Redis](https://redis.com/) instance.

- Only the Redis Standalone deployment mode is supported.
- Redis [Cluster](https://redis.io/docs/latest/operate/oss_and_stack/management/scaling/) and [Sentinel](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/) modes aren't supported for the BSR.

To configure Redis, create a k8s secret containing the address:

```console
$ kubectl create secret --namespace bsr generic bufd-redis \
  --from-literal=address=redis.example.com:6379
```

Optionally, we also support authentication and TLS for Redis. These can be set with the following Helm values:

```yaml
redis:
  # Set to true to enable auth for redis.
  # The auth token will be read from the "auth" field in the "bufd-redis" secret
  auth: true
  tls:
    # Whether to use TLS for connecting to Redis
    # Set to "false" to disable TLS
    # Set to "local" to use certs from the "ca" field in the "bufd-redis" secret
    # Set to "system" to use the system trust store
    use: "false"
```

- If authentication is enabled, the Redis auth string should be added to the `bufd-redis` secret in the `auth` field.
- If TLS is enabled and `use` is set to `local`, the CA certificates to trust should be added to the `bufd-redis` secret in the `ca` field.

Example of a secret containing both an authentication token and a CA certificate:

```console
$ kubectl create secret --namespace bsr generic bufd-redis \
  --from-literal=address=redis.example.com:6379 \
  --from-literal=auth=<redis auth string> \
  --from-file=ca=<redis ca.crt>
```

Example of a secret containing an authentication token, assuming a connection string like `redis.example.com:6379,password=<password>,ssl=True,abortConnect=False`:

```console
$ kubectl create secret --namespace bsr generic bufd-redis \
  --from-literal=address=redis.example.com:6379 \
  --from-literal=auth=<redis password>
```

### Configure authentication

The BSR supports authentication using an external identity provider (IdP), through Security Assertion Markup Language (SAML) or OpenID Connect (OIDC).

+++tabs key:d9702a7565e3ec655e9aed66c859b258

== SAML

In the SAML IdP, create a new application to represent the BSR. It should return a single sign-on URL and IdP metadata. Either a public URL or raw XML can be specified for the SAML config. If SAML is being configured in Okta, please follow our [Okta - SAML guide](../../instance/sso/okta-saml/).To configure SAML authentication in the BSR, set the following Helm values:

```yaml
auth:
  method: saml
  saml:
    # Endpoint where the XML metadata is available
    idpMetadataURL: "https://example-provider.com/app/12345/sso/saml/metadata"
    # If the authentication provider doesn't have a metadata url,
    # the raw XML metadata can be configured using the idpRawMetadata,
    # value instead.
    idpRawMetadata: |
      <?xml version="1.0" encoding="utf-8"?>
      <EntityDescriptor etc>
    # Optionally, configure the attribute containing groups membership information,
    # to enable support for automated organization membership provisioning.
    # Note that if configured, a user will not be permitted to log in to the BSR if the attribute is missing from the SAML assertion.
    # https://buf.build/docs/bsr/private/user-lifecycle#autoprovisioning
    groupsAttributeName: ""
  # Optional
  # A list of emails that will be granted BSR admin permissions on login
  # Note that this list is case-sensitive
  autoProvisionedAdminEmails:
    - "user@example.com"
```

SAML requires the application to have access to a certificate used for signing/encryption as part of the authentication process. For the BSR, this is stored as a [Kubernetes TLS secret](https://kubernetes.io/docs/concepts/configuration/secret/#tls-secrets) named `bsr-saml-cert`, and may be self-signed. For example, you can generate a certificate and create the required secret using [OpenSSL](https://www.openssl.org/).

```console
$ openssl req -newkey rsa:2048 -nodes -keyout ca.key -subj "/CN=example.com" -x509 -days 3650 -out ca.crt \
$ kubectl create secret --namespace bsr tls bsr-saml-cert \
  --key ca.key \
  --cert ca.crt
```

== OIDC

In the OIDC IdP, create a new application to represent the BSR and provide the callback URL. If OIDC is being configured in Okta, please follow our [Okta - OIDC guide](../../instance/sso/okta-oidc/).To configure OIDC authentication in the BSR, set the following Helm values:

```yaml
auth:
  method: oidc
  oidc:
    issuerURL: "https://example.okta.com"
    clientID: "0oa2ho2ylo0HFI61d5d7"
    # Optional
    # groups:
    #   claim: "custom_claim" # The name of the OIDC claim containing groups information, default groups
    #   source: "userinfo" # Fetch group claim from the userinfo endpoint instead of id token claims
    #   requiredScope: "groups" # Additional scope to request from the IdP, to include groups information in the token/userinfo endpoint.
  # Optional
  # A list of emails that will be granted BSR admin permissions on login
  # Note that this list is case-sensitive
  autoProvisionedAdminEmails:
    - "user@example.com"
```

Additionally, a [Kubernetes secret](https://kubernetes.io/docs/concepts/configuration/secret/#opaque-secrets) must be created for OIDC to function:

```console
$ kubectl create secret --namespace bsr generic bufd-client-secret \
  --from-literal=client_secret=<oidc client secret>
```

+++

### Configure Ingress

The BSR uses a Kubernetes [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) resource to handle incoming traffic and for terminating TLS. The domain used here must match the `host` set in the Helm values above.

WarningTLS is required for the BSR to function properly. HTTP2 is preferred to allow for gRPC support.

```yaml
bufd:
  ingress:
    enabled: true
    className: "" # Optional ingress class to use
    annotations: {} # Optional ingress annotations
    hosts:
      - host: example.com
        paths:
          - path: /
            portName: http
    # Optional TLS configuration for the ingress.
    # May be omitted to configure TLS termination, depending on the ingress.
    # Requires a kubernetes TLS secret.
    tls:
      - secretName: bsr-tls-cert
        hosts:
          - example.com
```

If the load balancer doesn't support H2C, TLS can optionally be used for communication between the load balancer and the BSR by enabling TLS on the listening ports of the `bufd` application. This requires a [Kubernetes TLS secret](https://kubernetes.io/docs/concepts/configuration/secret/#tls-secrets) named `bsr-tls-cert`.

```yaml
bufd:
  tls:
    enabled: true
    # Optional. Secret name for the TLS cert
    # secretName: bsr-tls-cert
  # Optional. Used to add annotations to the ingress service.
  # May be needed for some ingress controllers to function correctly.
  service:
    annotations: {}
```

### Configure observability

The `metrics` block is used to configure the collection and exporting of metrics from your application using Prometheus:

```yaml
observability:
  metrics:
    use: prometheus
    runtime: true
    prometheus:
      podLabels: # This is required if enabling network policies.
        app: prometheus
      port: 9090
      path: /metrics
```

### Trusting additional certificates

If you bump into issues regarding self signed certificates, such as seeing the error `tls: failed to verify certificate: x509: certificate signed by unknown authority`, you can add your root certificates on the BSR. To trust additional certificates, mount the files on the `bufd` pod and include them in the client TLS configuration.

+++tabs key:ef945c58f0e958bc93079d56bead345f

== v1.15.2 and newer

The `clientTLSSecrets` value will handle all the volumes and mounts. It is a map of secret name to key containing the certificate.

```yaml
clientTLSSecrets:
  tls-cert: cert.pem
```

== v1.15.1 and older

```yaml
bufd:
  deployment:
    extraVolumeMounts:
      - mountPath: /config/secrets/certificates/cert.pem
        name: certificate
        readOnly: true
        subPath: cert.pem
    extraVolumes:
      - name: certificate
        secret:
          secretName: tls-cert
          items:
            - key: cert.pem
              path: cert.pem
  clientTLS:
    extraCerts:
      - /config/secrets/certificates/cert.pem
```

+++

## 5\. Install the Helm Chart

After following the steps above, the set of Helm values should be similar to the example below:

```yaml
host: example.com
imagePullSecrets:
  - name: bufpullsecret
storage:
  use: s3
  s3:
    bucketName: "my-bucket-name"
    region: "us-east-1"
postgres:
  host: "postgres.example.com"
  port: 5432
  database: postgres
  user: postgres
auth:
  method: saml
  saml:
    idpMetadataURL: "https://example-provider.com/app/12345/sso/saml/metadata"
  autoProvisionedAdminEmails:
    - "user@example.com"
bufd:
  ingress:
    enabled: true
    hosts:
      - host: example.com
        paths:
          - path: /
            portName: http
    tls:
      - secretName: bsr-tls-cert
        hosts:
          - example.com
  deployment:
    extraVolumeMounts:
      - mountPath: /config/secrets/certificates/cert.pem
        name: certificate
        readOnly: true
        subPath: cert.pem
    extraVolumes:
      - name: certificate
        secret:
          secretName: tls-cert
          items:
            - key: cert.pem
              path: cert.pem
  clientTLS:
    extraCerts:
      - /config/secrets/certificates/cert.pem
observability:
  metrics:
    use: prometheus
    runtime: true
    prometheus:
      podLabels: # This is required if enabling network policies.
        app: prometheus
      port: 9090
      path: /metrics
```

Using the `bsr.yaml` Helm values file, install the Helm Chart for the cluster and set the correct BSR Version:

```console
$ helm install bsr oci://us-docker.pkg.dev/buf-images-1/bsr/charts/bsr \
  --version "1.x.x" \
  --namespace=bsr \
  --values bsr.yaml
```

The BSR instance should now be up and running on `https://<host>`. To help verify that the BSR is working correctly, we expose a status page to BSR admins at `https://<host>/-/status`. It's also accessible on port 3003 on each bufd pod without authentication, at `http://<bufd pod ip>:3003/-/status`. More information about the status page can be found [here](../observability/#status-page).
