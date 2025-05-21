---
description: "How to install Bufstream using etcd into your Azure deployment"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/deployment/azure/deploy-etcd/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bufstream/deployment/azure/deploy-postgres/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bufstream/auth/sasl/"
  - - meta
    - property: "og:title"
      content: "Deploy with etcd - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/deployment/azure/deploy-etcd.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/deployment/azure/deploy-etcd/"
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
      content: "Deploy with etcd - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/deployment/azure/deploy-etcd.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Deploy Bufstream to Azure with etcd

This page walks you through installing Bufstream into your Azure deployment, using etcd for metadata storage.

Data from your Bufstream cluster never leaves your network or reports back to Buf.

## Prerequisites

To deploy Bufstream on Azure, you need the following before you start:

- A Kubernetes cluster (v1.27 or newer)
- An Azure Storage account and blob storage container
- A Bufstream managed identity, with read/write permission to the storage container above.
- Helm (v3.12.0 or newer)

## Create an Azure Kubernetes Service (AKS) cluster

Create an AKS cluster if you don't already have one. An AKS cluster involves many settings that vary depending on your use case. See the [official documentation](https://learn.microsoft.com/en-us/azure/aks/) for details.

### Set up Workload Identity Federation (WIF) for Bufstream

You can authenticate to Azure Blob Storage with storage account shared access keys, or you can use Kubernetes WIF via Microsoft Entra Workload ID with Azure Kubernetes Service. See the official documentation:

- [Microsoft Entra ID](https://learn.microsoft.com/en-us/azure/storage/blobs/authorize-access-azure-active-directory)
- [Shared Keys](https://learn.microsoft.com/en-us/rest/api/storageservices/authorize-with-shared-key?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json)

## Create a storage account

If you don't already have one, create a new resource group:

```sh
az group create \
  --name <group-name> \
  --location <region>
```

Then, create a new storage account within the group:

```sh
az storage account create \
  --name <account-name> \
  --resource-group <group-name> \
  --location <region> \
  --sku Standard_RAGRS \
  --kind StorageV2 \
  --min-tls-version TLS1_2 \
  --allow-blob-public-access false
```

## Create a storage container

Create a storage container inside the storage account created above:

```sh
az storage container create \
    --name <container-name> \
    --account-name <account-name> \
    --auth-mode login
```

## Create a managed identity and assign role to Microsoft Entra Workload ID for WIF

The managed identity must be given the `Storage Blob Data Contributor` role with access to the target container.

```sh
az identity create \
  --name <identity name> \
  --resource-group <group name> \
  --location <region>

export MANAGED_IDENTITY_CLIENT_ID="$(az identity show --resource-group <group name> --name <identity name> --query 'clientId' -otsv)"

az role assignment create \
    --role "Storage Blob Data Contributor" \
    --assignee $MANAGED_IDENTITY_CLIENT_ID \
    --scope "/subscriptions/<azure-subscription-id>/resourceGroups/<group-name>/providers/Microsoft.Storage/storageAccounts/<account-name>/blobServices/default/containers/<container-name>"

export AKS_OIDC_ISSUER="$(az aks show --name <aks cluster name> --resource-group <aks cluster resource group name> --query "oidcIssuerProfile.issuerUrl" -otsv)"

az identity federated-credential create \
  --name bufstream \
  --identity-name <identity name> \
  --resource-group <group name> \
  --issuer "${AKS_OIDC_ISSUER}" \
  --subject system:serviceaccount:bufstream:bufstream-service-account" \
  --audience api://AzureADTokenExchange

echo $MANAGED_IDENTITY_CLIENT_ID # Save and use for helm values below
```

## Create a namespace

Create a Kubernetes namespace in the k8s cluster for the `bufstream` deployment to use:

```sh
kubectl create namespace bufstream
```

## Deploy etcd

Bufstream requires an [etcd](https://etcd.io/) cluster. To set up an example deployment of etcd on Kubernetes, use the [Bitnami etcd Helm chart](https://github.com/bitnami/charts/tree/main/bitnami/etcd) with the following values:

```sh
helm install \
  --namespace bufstream \
  bufstream-etcd \
  oci://registry-1.docker.io/bitnamicharts/etcd \
  -f - <<EOF
replicaCount: 3
persistence:
  enabled: true
  size: 10Gi
  storageClass: ""
autoCompactionMode: periodic
autoCompactionRetention: 30s
removeMemberOnContainerTermination: false
resourcesPreset: none
auth:
  rbac:
    create: false
    enabled: false
  token:
    enabled: false
metrics:
  useSeparateEndpoint: true
customLivenessProbe:
  httpGet:
    port: 9090
    path: /livez
    scheme: "HTTP"
  initialDelaySeconds: 10
  periodSeconds: 30
  timeoutSeconds: 15
  failureThreshold: 10
customReadinessProbe:
  httpGet:
    port: 9090
    path: /readyz
    scheme: "HTTP"
  initialDelaySeconds: 20
  timeoutSeconds: 10
extraEnvVars:
  - name: ETCD_LISTEN_CLIENT_HTTP_URLS
    value: "http://0.0.0.0:8080"
EOF
```

Check that etcd is running after installation.

etcd is sensitive to disk performance, so we recommend using the [Azure Disks Container Storage Interface](https://learn.microsoft.com/en-us/azure/aks/azure-disk-csi) with `Premium SSD v2` disks.

The storage class in the example above can be changed by setting the `persistence.storageClass` value to a custom storage class using those disks.

## Deploy Bufstream

### 1\. Authenticate `helm`

To get started, authenticate `helm` with the Bufstream OCI registry using the keyfile that was sent alongside this documentation. _The keyfile should contain a base64 encoded string._

```sh
cat keyfile | helm registry login -u _json_key_base64 --password-stdin \
  https://us-docker.pkg.dev/buf-images-1/bufstream
```

### 2\. Configure Bufstream's Helm values

Bufstream is configured using Helm values that are passed to the `bufstream` Helm chart. To configure the values:

1.  Create a Helm values file named `bufstream-values.yaml`, which is required by the `helm install` command in step 4. This file can be in any location, but we recommend creating it in the same directory where you run the `helm` commands.
2.  Add the values from the steps below to the `bufstream-values.yaml` file. Skip to [Install the Helm chart](#install-helm-chart) for a full example chart.

#### Configure object storage

+++tabs key:4dbe2c9630832368586e4a94cc61b32b

== Microsoft Entra Workload ID (recommended)

Bufstream attempts to acquire credentials from the environment using WIF.

To configure storage, set the following Helm values, filling in your Blob Storage variables:

::: info bufstream-values.yaml

```yaml
storage:
  use: azure
  azure:
    # Azure storage account container name.
    bucket: <container name>
    # Azure storage account endpoint to use — for example, https://<account-name>.blob.core.windows.net
    endpoint: <endpoint>
bufstream:
  deployment:
    podLabels:
      azure.workload.identity/use: "true"
  serviceAccount:
    annotations:
      azure.workload.identity/client-id: <managed identity client id>
```

:::

The k8s service account to create the Federated identity credential association for is named `bufstream-service-account`.

== Storage account shared keys

Alternatively, you can use a shared key pair.

1.  Fetch the shared key for the storage account. It is recommended to only use the first key returned. The second key should only be used when you are rotating keys.

    ```sh
    az storage account keys list \
      --resource-group <group-name> \
      --account-name <account-name>
    ```

2.  Create a k8s secret containing the storage account's shared key:

    ```sh
    kubectl create secret --namespace bufstream generic bufstream-storage \
      --from-literal=secret_access_key=<Azure storage account key>
    ```

3.  Add the `accessKeyId` to the configuration:

    ```yaml
    storage:
      use: azure
      azure:
        # Azure storage account container name.
        bucket: <container name>
        # Azure storage account endpoint to use — for example, https://<account-name>.blob.core.windows.net
        endpoint: <endpoint>
        # Azure storage account name to use for auth instead of the metadata server.
        accessKeyId: <account-name>
        # Kubernetes secret containing a `secret_access_key` (as the Azure storage account key) to use instead of the metadata server.
        secretName: bufstream-storage
    ```

+++

#### Configure etcd

Then, configure Bufstream to connect to the etcd cluster:

::: info bufstream-values.yaml

```yaml
metadata:
  use: etcd
  etcd:
    # etcd addresses to connect to
    addresses:
      - host: "bufstream-etcd.bufstream.svc.cluster.local"
        port: 2379
```

:::

### 3\. Install the Helm chart

Proceed to the [zonal deployment steps](#zonal-deployment) if you want to deploy Bufstream with zone-aware routing. If not, follow the instructions below to deploy the basic Helm chart.

Add the following to the `bufstream-values.yaml` Helm values file to make bufstream brokers automatically detect their zone:

```yaml
discoverZoneFromNode: true
```

After following the steps above, the set of Helm values should be similar to the example below:

+++tabs key:4dbe2c9630832368586e4a94cc61b32b

== Microsoft Entra Workload ID (recommended)

::: info bufstream-values.yaml

```yaml
storage:
  use: azure
  azure:
    # Azure storage account container name.
    bucket: my-container
    endpoint: https://mystorageaccount.blob.core.windows.net
bufstream:
  deployment:
    podLabels:
      azure.workload.identity/use: "true"
  serviceAccount:
    annotations:
      azure.workload.identity/client-id: <managed identity client id>
metadata:
  use: etcd
  etcd:
    # etcd addresses to connect to
    addresses:
      - host: "bufstream-etcd.bufstream.svc.cluster.local"
        port: 2379
discoverZoneFromNode: true
```

:::

== Storage account shared keys

::: info bufstream-values.yaml

```yaml
storage:
  use: azure
  azure:
    bucket: my-container
    endpoint: https://mystorageaccount.blob.core.windows.net
    accessKeyId: mystorageaccount
    secretName: bufstream-storage
metadata:
  use: etcd
  etcd:
    # etcd addresses to connect to
    addresses:
      - host: "bufstream-etcd.bufstream.svc.cluster.local"
        port: 2379
discoverZoneFromNode: true
```

:::

+++

Using the `bufstream-values.yaml` Helm values file, install the Helm chart for the cluster and set the correct Bufstream version:

```sh
helm install bufstream oci://us-docker.pkg.dev/buf-images-1/bufstream/charts/bufstream \
  --version "<version>" \
  --namespace=bufstream \
  --values bufstream-values.yaml
```

If you change any configuration in the `bufstream-values.yaml` file, re-run the Helm install command to apply the changes.

## Deploy Bufstream with zone-aware routing

### 1\. Specify a list of target zones

First, specify a list of target zones in a `ZONES` variable, which are used for future commands.

```sh
ZONES=(<zone1> <zone2> <zone3>)
```

### 2\. Create WIF Association for all zones

If you're using WIF, you'll need to create a federated identity credential for each service account in each zone.

```sh
export AKS_OIDC_ISSUER="$(az aks show --name <aks cluster name> --resource-group <group name> --query "oidcIssuerProfile.issuerUrl" -otsv)"

for ZONE in $ZONES; do
  az identity federated-credential create \
    --name bufstream-${ZONE} \
    --identity-name <identity name> \
    --resource-group <group name> \
    --issuer "${AKS_OIDC_ISSUER}" \
    --subject system:serviceaccount:bufstream:bufstream-service-account-${ZONE} \
    --audience api://AzureADTokenExchange
done
```

### 3\. Create Helm values files for each zone

Then, use this script to iterate through the availability zones saved in the `ZONES` variable and create a Helm values file for each zone:

```sh
for ZONE in $ZONES; do
  cat <<EOF > "bufstream-${ZONE}-values.yaml"
nameOverride: bufstream-${ZONE}
name: bufstream-${ZONE}
zone: ${ZONE}
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

Using the example `ZONES` variable above creates three values files: `bufstream-<zone1>-values.yaml`, `bufstream-<zone2>-values.yaml` and `bufstream-<zone3>-values.yaml`.

### 4\. Install the Helm chart for each zone

After following the steps above and creating the zone-specific values files, the collection of Helm values should be structurally similar to the example below:

::: info bufstream-values.yaml

```yaml
storage:
  use: azure
  azure:
    # Azure storage account container name.
    bucket: my-container
    endpoint: https://mystorageaccount.blob.core.windows.net
bufstream:
  deployment:
    podLabels:
      azure.workload.identity/use: "true"
  serviceAccount:
    annotations:
      azure.workload.identity/client-id: <managed identity client id>
metadata:
  use: etcd
  etcd:
    # etcd addresses to connect to
    addresses:
      - host: "bufstream-etcd.bufstream.svc.cluster.local"
        port: 2379
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

```sh
for ZONE in $ZONES; do
  helm install "bufstream-${ZONE}" oci://us-docker.pkg.dev/buf-images-1/bufstream/charts/bufstream \
    --version "<version>" \
    --namespace=bufstream \
    --values bufstream-values.yaml \
    --values "bufstream-${ZONE}-values.yaml"
done
```

If you change any configuration in the `bufstream-values.yaml` file, re-run the Helm install command to apply the changes.

### 5\. Create a regional service for the cluster

Create a regional service which creates a bootstrap address for Bufstream across all the zones.

```sh
cat <<EOF | kubectl apply -f -
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
