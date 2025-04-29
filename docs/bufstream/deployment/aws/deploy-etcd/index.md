---

title: "Deploy with etcd - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/deployment/aws/deploy-etcd/"
  - - meta
    - property: "og:title"
      content: "Deploy with etcd - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/deployment/aws/deploy-etcd/"
  - - meta
    - property: "twitter:title"
      content: "Deploy with etcd - Buf Docs"

---

# Deploy Bufstream to AWS with etcd

This page walks you through installing Bufstream into your AWS deployment, using etcd for metadata storage. See the [AWS configuration](../configure/) page for defaults and recommendations about resources, replicas, storage, and scaling.Data from your Bufstream cluster never leaves your network or reports back to Buf.

## Prerequisites

To deploy Bufstream on AWS, you need the following before you start:

- A Kubernetes cluster (v1.27 or newer)
- An S3 bucket
- A Bufstream role, with read/write permission to the S3 bucket above.
- Helm (v3.12.0 or newer)

If you don't yet have your AWS environment, you'll need the following:

- For the EKS cluster
  - AmazonEC2FullAccess
  - A custom policy including `eks:*`, since there's no default AWS EKS policy including it.
- For the S3 bucket
  - AmazonS3FullAccess
- For the Bufstream role
  - IAMFullAccess

## Terraform module

We also provide a Terraform module at [https://github.com/bufbuild/terraform-modules-bufstream](https://github.com/bufbuild/terraform-modules-bufstream). It sets up all necessary components from an empty AWS account, or adds all necessary components to any subset of the required ones that are already installed.If you're setting up from an empty account, the following IAM policy should contain the minimum permissions needed:

```text
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EKSFullAccess",
      "Effect": "Allow",
      "Action": [
        "eks:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "VPCManagement",
      "Effect": "Allow",
      "Action": [
        "ec2:CreateVpc",
        "ec2:DeleteVpc",
        "ec2:DescribeVpcs",
        "ec2:CreateSubnet",
        "ec2:DeleteSubnet",
        "ec2:DescribeSubnets",
        "ec2:CreateRouteTable",
        "ec2:DeleteRouteTable",
        "ec2:DescribeRouteTables",
        "ec2:CreateRoute",
        "ec2:DeleteRoute",
        "ec2:DescribeRoutes",
        "ec2:CreateInternetGateway",
        "ec2:AttachInternetGateway",
        "ec2:DetachInternetGateway",
        "ec2:DeleteInternetGateway",
        "ec2:CreateNatGateway",
        "ec2:DeleteNatGateway",
        "ec2:DescribeNatGateways",
        "ec2:CreateSecurityGroup",
        "ec2:DeleteSecurityGroup",
        "ec2:DescribeSecurityGroups",
        "ec2:AuthorizeSecurityGroupIngress",
        "ec2:RevokeSecurityGroupIngress",
        "ec2:AuthorizeSecurityGroupEgress",
        "ec2:RevokeSecurityGroupEgress",
        "ec2:CreateTags",
        "ec2:DeleteTags",
        "ec2:CreateVpcEndpoint",
        "ec2:DeleteVpcEndpoint",
        "ec2:DescribeVpcEndpoints",
        "ec2:ModifyVpcEndpoint",
        "ec2:DescribeVpcEndpointServices"
      ],
      "Resource": "*"
    },
    {
      "Sid": "S3Management",
      "Effect": "Allow",
      "Action": [
        "s3:CreateBucket",
        "s3:DeleteBucket",
        "s3:ListAllMyBuckets",
        "s3:ListBucket",
        "s3:GetBucketAcl",
        "s3:PutBucketAcl",
        "s3:GetBucketPolicy",
        "s3:PutBucketPolicy",
        "s3:DeleteBucketPolicy",
        "s3:GetBucketCors",
        "s3:PutBucketCors",
        "s3:DeleteBucketCors"
      ],
      "Resource": "*"
    },
    {
      "Sid": "IAMPassRole",
      "Effect": "Allow",
      "Action": [
        "iam:PassRole"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "iam:PassedToService": [
            "eks.amazonaws.com",
            "ec2.amazonaws.com"
          ]
        }
      }
    }
  ]
}
```

## Create an EKS cluster

Create an EKS cluster if you don't already have one. An EKS cluster involves many settings that vary depending on your use case. See the [official documentation](https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html) for details.

### Set up Workload Identity Federation for Bufstream role

You can authenticate to S3 with access keys, or you can use Kubernetes Workload Identity Federation with either OIDC or EKS Pod Identity. We recommend using EKS Pod Identity. See the official documentation:

- [EKS Pod Identity](https://docs.aws.amazon.com/eks/latest/userguide/pod-id-agent-setup.html) (recommended)
- [OIDC provider](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html)
- [Access keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html)

## Create an S3 Bucket

If you don't already have one, you need the `AmazonS3FullAccess` role. To create a new S3 bucket, you need the `AmazonS3FullAccess` role.

```console
$ aws s3api create-bucket \
  --bucket <bucket-name> \
  --region <region> \
  --create-bucket-configuration LocationConstraint=<region>
```

## Create a Bufstream role and policy

You'll need the `IAMFullAccess` role.

+++tabs key:856b4f5d9314b0e898cfa429826c66f3

== EKS Pod Identity (recommended)

```console
$ aws iam create-role \
  --role-name BufstreamRole \
  --assume-role-policy-document file://<(echo '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "pods.eks.amazonaws.com"
        },
        "Action": [
          "sts:AssumeRole",
          "sts:TagSession"
        ],
        "Condition": {
          "StringEquals": {
            "aws:SourceAccount": "<aws-account-id>"
          },
          "ArnEquals": {
            "aws:SourceArn": "<eks-cluster-arn>"
          }
        }
      }
    ]
  }')

$ aws eks create-pod-identity-association \
  --cluster-name <cluster-name> \
  --namespace bufstream \
  --service-account bufstream-service-account \
  --role-arn <role-arn>
```

== OIDC provider

Refer to the [OIDC provider guide](https://docs.aws.amazon.com/eks/latest/userguide/associate-service-account-role.html) for details

```console
$ aws iam create-role \
  --role-name BufstreamRole \
  --assume-role-policy-document file://<(echo '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Federated": "<oidc-provider-arn>"
        },
        "Action": [
          "sts:AssumeRoleWithWebIdentity"
        ],
        "Condition": {
          "StringEquals": {
            "<oidc-url>:aud" : "sts.amazonaws.com",
            "<oidc-url>:sub" : "system:serviceaccount:bufstream:bufstream-service-account"
          }
        }
      }
    ]
  }')
```

== Access key pair

Refer to the [guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html) on creating and managing user access keys.

+++

---

```console
$ aws iam create-policy \
  --policy-name BufstreamS3 \
  --policy-document file://<(echo '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket",
          "s3:AbortMultipartUpload"
        ],
        "Resource": [
          "arn:aws:s3:::<bucket-name>",
          "arn:aws:s3:::<bucket-name>/*"
        ]
      }
    ]
  }')

$ aws iam attach-role-policy \
  --policy-arn arn:aws:iam::<aws-account-id>:policy/BufstreamS3 \
  --role-name BufstreamRole
```

## Create a namespace

Create a Kubernetes namespace in the k8s cluster for the `bufstream` deployment to use:

```console
$ kubectl create namespace bufstream
```

## Deploy etcd

Bufstream requires an [`etcd`](https://etcd.io/) cluster. To set up an example deployment of `etcd` on Kubernetes, use the [Bitnami `etcd` Helm chart](https://github.com/bitnami/charts/tree/main/bitnami/etcd) with the following values:

```console
$ helm install \
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

Warning`etcd` is sensitive to disk performance, so we recommend using the [AWS EBS CSI Driver](https://docs.aws.amazon.com/eks/latest/userguide/ebs-csi.html) with `gp3` or `io1/io2` disks, instead of the default `gp2` disks EKS uses.

The storage class in the example above can be changed by setting the `persistence.storageClass` value to a custom storage class using those disks.

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
2.  Add the values from the steps below to the `bufstream-values.yaml` file. Skip to [Install the Helm chart](#install-helm-chart) for a full example chart.

#### Configure object storage

Bufstream requires S3-compatible object storage.

+++tabs key:856b4f5d9314b0e898cfa429826c66f3

== EKS Pod Identity (recommended)

Bufstream attempts to acquire credentials from the environment using EKS Pod Identity.To configure storage, set the following Helm values, filling in your S3 variables:

::: info bufstream-values.yaml

```yaml
storage:
  use: s3
  s3:
    bucket: <bucket-name>
    region: <region>
    # forcePathStyle: false # Optional, use path-style bucket URLs (http://s3.amazonaws.com/BUCKET/KEY)
    # endpoint: "https://example.com" # Optional
```

:::

The k8s service account to create the pod identity association for is named `bufstream-service-account`.

== OIDC provider

Bufstream attempts to acquire credentials from the environment using the OIDC provider.To configure storage, set the following Helm values, filling in your S3 variables:

::: info bufstream-values.yaml

```yaml
bufstream:
  serviceAccount:
    annotations:
      eks.amazonaws.com/role-arn: arn:aws:iam::<aws-account-id>:role/BufstreamRole
storage:
  use: s3
  s3:
    bucket: <bucket-name>
    region: <region>
    # forcePathStyle: false # Optional, use path-style bucket URLs (http://s3.amazonaws.com/BUCKET/KEY)
    # endpoint: "https://example.com" # Optional
```

:::

The k8s service account to create the pod identity association for is named `bufstream-service-account`.

== Access key pair

Alternatively, you can use an access key pair.

1.  Create a k8s secret containing the s3 access secret key:

```console
$ kubectl create secret --namespace bufstream generic bufstream-storage \
  --from-literal=secret_access_key=<s3 secret access key>
```

1.  Add the `accessKeyId` to the configuration:

::: info bufstream-values.yaml

```yaml
storage:
  use: s3
  s3:
    accessKeyId: "AKIAIOSFODNN7EXAMPLE"
    secretName: bufstream-storage
    bucket: <bucket-name>
    region: <region>
    # forcePathStyle: false # Optional, use path-style bucket URLs (http://s3.amazonaws.com/BUCKET/KEY)
    # endpoint: "https://example.com" # Optional
```

:::

+++

#### Configure `etcd`

Then, configure Bufstream to connect to the `etcd` cluster:

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

Proceed to the [zonal deployment steps](#zonal-deployment) if you want to deploy Bufstream with zone-aware routing. If not, follow the instructions below to deploy the basic Helm chart.After following the steps above, the set of Helm values should be similar to the example below:

+++tabs key:856b4f5d9314b0e898cfa429826c66f3

== EKS Pod Identity (recommended)

::: info bufstream-values.yaml

```yaml
storage:
  use: s3
  s3:
    bucket: <bucket-name>
    region: <region>
metadata:
  use: etcd
  etcd:
    # etcd addresses to connect to
    addresses:
      - host: "bufstream-etcd.bufstream.svc.cluster.local"
        port: 2379
```

:::

== OIDC provider

::: info bufstream-values.yaml

```yaml
bufstream:
  serviceAccount:
    annotations:
      eks.amazonaws.com/role-arn: arn:aws:iam::<aws-account-id>:role/BufstreamRole
storage:
  use: s3
  s3:
    bucket: <bucket-name>
    region: <region>
metadata:
  use: etcd
  etcd:
    # etcd addresses to connect to
    addresses:
      - host: "bufstream-etcd.bufstream.svc.cluster.local"
        port: 2379
observability:
  metrics:
    exporter: "PROMETHEUS"
```

:::

The k8s service account to create the pod identity association for is named `bufstream-service-account`.

== Access key pair

::: info bufstream-values.yaml

```yaml
storage:
  use: s3
  s3:
    bucket: <bucket-name>
    region: <region>
    accessKeyId: "AKIAIOSFODNN7EXAMPLE"
    secretName: bufstream-storage
metadata:
  use: etcd
  etcd:
    # etcd addresses to connect to
    addresses:
      - host: "bufstream-etcd.bufstream.svc.cluster.local"
        port: 2379
observability:
  metrics:
    exporter: "PROMETHEUS"
```

:::

+++

Using the `bufstream-values.yaml` Helm values file, install the Helm chart for the cluster and set the correct Bufstream version:

```console
$ helm install bufstream oci://us-docker.pkg.dev/buf-images-1/bufstream/charts/bufstream \
  --version "<version>" \
  --namespace=bufstream \
  --values bufstream-values.yaml
```

If you change any configuration in the `bufstream-values.yaml` file, re-run the Helm install command to apply the changes.

### Network load balancer

To access the Bufstream cluster from outside the Kubernetes cluster, create an AWS Network Load Balancer (NLB). The easiest way to create an NLB is to use the [AWS Load Balancer Controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/deploy/installation/). Once the controller is successfully installed in the EKS cluster, add the following configuration to `bufstream-values.yaml` file:

::: info bufstream-values.yaml

```yaml
bufstream:
  service:
    type: LoadBalancer
    annotations:
      service.beta.kubernetes.io/aws-load-balancer-type: "external"
      service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: "ip"
      service.beta.kubernetes.io/aws-load-balancer-scheme: "internal"
```

:::

and run the `helm upgrade` command for Bufstream:

```console
$ helm upgrade bufstream oci://us-docker.pkg.dev/buf-images-1/bufstream/charts/bufstream \
  --version "<version>" \
  --namespace=bufstream \
  --values bufstream-values.yaml
```

check the progress of the NLB creation using the following command:

```console
$ kubectl describe service bufstream
```

once the NLB is created, to get its DNS name and more details, use the following commands:

```console
# save the dns name into a variable
$ NLBDNSNAME=$(kubectl -n bufstream get service bufstream -o "jsonpath={.status.loadBalancer.ingress[*].hostname}")
# print the dns name
$ echo "$NLBDNSNAME"
# show more details like arn of the created NLB:
$ aws elbv2 describe-load-balancers --query "LoadBalancers[?DNSName=='${NLBDNSNAME}']"
```

The Bufstream cluster needs to advertise its public address to the connecting clients. Make sure the address advertised is the same as the one that the clients are connecting to by adding the following configuration to `bufstream-values.yaml`:

::: info bufstream-values.yaml

```yaml
kafka:
  publicAddress:
    host: <dns name of the NLB address>
    port: 9092
```

:::

and run the `helm upgrade` command for Bufstream to update the public address:

```console
$ helm upgrade bufstream oci://us-docker.pkg.dev/buf-images-1/bufstream/charts/bufstream \
  --version "<version>" \
  --namespace=bufstream \
  --values bufstream-values.yaml
```

## Deploy Bufstream with zone-aware routing

### 1\. Specify a list of target zones

First, specify a list of target zones in a `ZONES` variable, which are used for future commands.

```console
$ ZONES=(<zone1> <zone2> <zone3>)
```

### 2\. Create EKS Pod Association for all zones

If you're using EKS Pod association, you'll need to create a pod association for each service account in each zone.

```console
$ for ZONE in $ZONES; do
  aws eks create-pod-identity-association \
    --cluster-name <cluster-name> \
    --namespace bufstream \
    --service-account bufstream-service-account-${ZONE} \
    --role-arn <role-arn>
done
```

### 3\. Create Helm values files for each zone

Then, use this script to iterate through the availability zones saved in the `ZONES` variable and create a Helm values file for each zone:

```console
$ for ZONE in $ZONES; do
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

Using the example `ZONES` variable above creates three values files: `bufstream-<zone1>-values.yaml`, `bufstream-<zone2>-values.yaml` and `bufstream-<zone3>-values.yaml`. However, Bufstream is available in all AWS regions, so you can specify AZs in any region such as `us-east-1`, `us-west-2` or `eu-central-2` in the variable.

### 4\. Install the Helm chart for each zone

After following the steps above and creating the zone-specific values files, the collection of Helm values should be structurally similar to the example below:

::: info bufstream-values.yaml

```yaml
storage:
  use: s3
  s3:
    bucket: "<bucket-name>"
    region: "<region>"
metadata:
  use: etcd
  etcd:
    # etcd addresses to connect to
    addresses:
      - host: "bufstream-etcd.bufstream.svc.cluster.local"
        port: 2379
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

If you change any configuration in the `bufstream-values.yaml` file, re-run the Helm install command to apply the changes.

### 5\. Create a regional service for the cluster

Create a regional service which creates a bootstrap address for Bufstream across all the zones.

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
