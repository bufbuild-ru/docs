---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/admin/on-prem/configuration/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/admin/on-prem/installation/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/admin/on-prem/observability/"
  - - meta
    - property: "og:title"
      content: "Optional configuration - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/on-prem/configuration.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/admin/on-prem/configuration/"
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
      content: "Optional configuration - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/on-prem/configuration.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Optional configuration

## Maintenance mode

The BSR has a maintenance mode in which the BSR starts up, but API calls are prevented, users of the web interface are informed that maintenance is in progress, and no database/object storage writes occur.

To enable the maintenance mode, set the `maintenance` Helm value and re-apply the helm chart:

```yaml
maintenance: true
```

## Feature flags

Certain BSR functionality is gated behind feature flags, which can be enabled through the `featureFlags` Helm value. The currently supported feature flags are:

```yaml
featureFlags:
  # Prevent users from creating organizations in the BSR
  # Server admins can still create organizations when this flag is enabled
  disable_user_org_creation: true
  # Prevent creating a repository with an owner that is scoped to a user
  disable_user_scoped_repository_creation: true
```

## Automatically adding members to organizations

To automatically add all members to an organization upon login, set the `auth.autoProvisionedMembershipOrganizations` Helm value:

```yaml
auth:
  # Map of organizations which all members will be added to on login
  autoProvisionedMembershipOrganizations:
    exampleorg: ORGANIZATION_ROLE_MEMBER
```

## SMTP server for email notification

To send email notifications for the breaking change policy check [review flow](../../../policy-checks/breaking/overview/#review-flow) via an SMTP server, set the `notifications` Helm value:

```yaml
notifications:
  use: smtp
  smtp:
    hostname: "smtp.example.com"
    port: 25
    # The username for authenticating with the SMTP server
    username: example-user
    # The domain under which the sender's email for the email notification will be included
    fromDomain: "notification.example.com"
```

Then create a k8s secret containing the SMTP user's password:

```console
$ kubectl create secret --namespace bsr generic bufd-smtp-password \
  --from-literal=password=<smtp password>
```

## Maximum body size

By default, the BSR limits the body size of incoming requests to 256 MB. For some use cases, such as uploading large custom plugins, this may need to be increased. To increase the body size limit, set the `maxBodySizeBytes` Helm value:

```yaml
maxBodySizeBytes: "2147483648" # 2 GB
```

## Maven registry generation timeout

By default, the BSR times out when code generation for the Maven registry exceeds 2 minutes. For some use cases, such as working with large modules, this may need to be increased. To increase the generation timeout, set the `mavenRegistry.generationTimeout` Helm value:

```yaml
mavenRegistry:
  generationTimeout: "10m" # 10 minutes
```

## Using Artifactory for Maven generation

By default, the BSR uses [Maven Central](https://repo.maven.apache.org/maven2/) to fetch dependencies required for building Java or Kotlin generated SDKs. An Artifactory remote repository mirroring Maven Central can be used instead by setting the `bufjavacompilerd.registry` Helm values:

```yaml
bufjavacompilerd:
  registry:
    url: "https://example.jfrog.io/artifactory/my-repository/"
    username: "username" # Optional. If username is set, the kubernetes secret containing the password must also be present
  trustStore:
    custom: false # Optional. If true, the kubernetes secret for the trust store must also be present
```

To create the kubernetes secret containing the Artifactory password:

```console
$ kubectl create secret --namespace bsr generic bufjavacompilerd-registry \
  --from-literal=password=my-password
```

To create the kubernetes secret containing a custom Java JKS trust store:

```console
$ kubectl create secret --namespace bsr generic bufjavacompilerd-truststore \
--from-file=cacerts=trustStore.jks \
--from-literal=password=my-truststore-password
```

Replace `trustStore.jks` with the path to the custom JKS trust store and `my-truststore-password` with the trust store password.

## Public access

By default, the BSR only allows access for authenticated users. To allow unauthenticated users to view public modules in the BSR, and consume related artifacts such as generated SDKs for those modules, set the `auth.allowPublicAccess` Helm value:

```yaml
auth:
  allowPublicAccess: true
```

## Other configuration

There may be additional low-level values defined in the `values.yaml` chart or Helm templates that are subject to change. Please contact us before depending on these configuration values so we can better support your needs.
