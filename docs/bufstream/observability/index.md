---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/observability/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bufstream/iceberg/reference/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bufstream/observability/metrics/"
  - - meta
    - property: "og:title"
      content: "Bufstream Observability - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/observability/index.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/observability/"
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
      content: "Bufstream Observability - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/observability/index.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Observability – Overview

Bufstream is instrumented for monitoring cluster health, performance, and errors. Metrics are instrumented using [OpenTelemetry](https://opentelemetry.io/), with support for standard exporters like OTLP and Prometheus. Specific configuration recommendations including dashboards and monitors/alerts for [Datadog](datadog/) and [Grafana](grafana/) are available.

## Configuring metrics

### OTLP

To configure Bufstream to report to an OpenTelemetry collector, configure Bufstream as follows:

+++tabs key:e18ad947cbc142ea04c99762c94a29ac

== bufstream.yaml

```yaml
observability:
  exporter:
    address: "<collector-hostname>:4318"
    # Set to true to report over HTTP, false to report over TLS.
    insecure: true
  metrics:
    exporter_type: "OTLP_HTTP"
```

== Helm values.yaml

```yaml
observability:
  exporter:
    address: "<collector-hostname>:4318"
    # Set to true to report over HTTP, false to report over TLS.
    insecure: true
  metrics:
    exporterType: "OTLP_HTTP"
```

+++

### Prometheus

To enable the Prometheus endpoint for collecting metrics, configure Bufstream as follows:

+++tabs key:e18ad947cbc142ea04c99762c94a29ac

== bufstream.yaml

```yaml
observability:
  metrics:
    exporter_type: "PROMETHEUS"
```

== Helm values.yaml

```yaml
observability:
  metrics:
    exporterType: "PROMETHEUS"
```

+++

The Prometheus endpoint (`/metrics`) will be available on the Bufstream broker on port 9090.

## Logging

Logging is output to standard error in the Bufstream brokers in JSON format. Use the following to configure the log level:

+++tabs key:e18ad947cbc142ea04c99762c94a29ac

== bufstream.yaml

```yaml
observability:
  # One of "DEBUG", "INFO", "WARN", or "ERROR".
  log_level: "INFO"
```

== Helm values.yaml

```yaml
observability:
  # One of "DEBUG", "INFO", "WARN", or "ERROR".
  logLevel: "INFO"
```

+++

## Tracing

Use the following to configure tracing:

+++tabs key:e18ad947cbc142ea04c99762c94a29ac

== bufstream.yaml

```yaml
observability:
  exporter:
    address: "<collector-hostname>:4318"
    # Set to true to report over HTTP, false to report over TLS.
    insecure: true
  traces:
    exporter_type: "OTLP_HTTP"
    # Optional, trace sampling ratio, defaults to 0.1
    # trace_ratio: 0.1
```

== Helm values.yaml

```yaml
observability:
  exporter:
    address: "<collector-hostname>:4318"
    # Set to true to report over HTTP, false to report over TLS.
    insecure: true
  tracing:
    exporterType: "OTLP_HTTP"
    # Optional, trace sampling ratio, defaults to 0.1
    # traceRatio: 0.1
```

+++

## Redacting sensitive information

Because consumer group IDs and topic names are user-provided and may contain information that users don't wish to report to monitoring systems, Bufstream can redact that information before reporting via metrics, logs, or traces. When redaction is set to `OPAQUE`, topic names are replaced with topic IDs (UUIDs) and consumer group ids are replaced with hashed values. To configure sensitive information redaction, configure Bufstream as follows:

+++tabs key:e18ad947cbc142ea04c99762c94a29ac

== bufstream.yaml

```yaml
observability:
  # -- Redact sensitive information, such as topic names, before adding to to metrics, traces, and logs.
  # Supports [NONE, OPAQUE].
  # Default: NONE.
  sensitive_information_redaction: "OPAQUE"
```

== Helm values.yaml

```yaml
observability:
  # -- Redact sensitive information, such as topic names, before adding to to metrics, traces, and logs.
  # Supports [NONE, OPAQUE].
  # Default: NONE.
  sensitiveInformationRedaction: "OPAQUE"
```

+++
