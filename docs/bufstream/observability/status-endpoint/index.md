---
description: "How to monitor the Bufstream health and status"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/observability/status-endpoint/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bufstream/observability/metrics/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bufstream/observability/datadog/"
  - - meta
    - property: "og:title"
      content: "Status endpoint - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/observability/status-endpoint.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/observability/status-endpoint/"
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
      content: "Status endpoint - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/observability/status-endpoint.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Status endpoint

To help verify that a Bufstream cluster is up, running, and working correctly, its status can be checked via its status endpoint or through the [admin CLI command](../../reference/cli/admin/status/).

## Using the endpoint

The status endpoint is accessible on the admin port `9089` on each Bufstream broker without authentication, at `http://{bufstream-broker}:9089/-/status`.

![Bufstream status page](../../../images/bufstream/observability/status-page.png)

## Admin CLI

Bufstream also exposes a CLI command to interact with the status endpoint, outputting a table using the following command:

```console
bufstream admin status --url http://{bufstream-broker}:9089
```

The `status` command displays the following cluster information:

```console
Name                         Status   Message
kafka_server                 healthy  Connected to localhost:9092
metadata_storage             healthy
metadata_storage_migrations  healthy  Migrations: current: 1, target: 1
object_storage               healthy
postgresql                   healthy  PostgreSQL: v14.18, connections: 20/100, connected apps: other: 19/25, uptime: 1m10s
version                      healthy  Version: 0.3.29
```

Bufstream status information is also available as JSON, and can be displayed using the `--format json` flag.

For a list of all available status CLI flags, consult the [Bufstream CLI reference documentation](../../reference/cli/admin/status/).
