# Observability – Overview

Bufstream is instrumented for monitoring cluster health, performance, and errors. Metrics are instrumented using [OpenTelemetry](https://opentelemetry.io/), with support for standard exporters like OTLP and Prometheus. Specific configuration recommendations including dashboards and monitors/alerts for [Datadog](../datadog/) and [Grafana](../grafana/) are available.

## Configuring metrics

### OTLP

To configure Bufstream to report to an OpenTelemetry collector, specify the following in the Helm values:

```yaml
observability:
  exporter:
    address: "<collector-hostname>:4318"
    # Set to true to report over HTTP, false to report over TLS.
    insecure: true
  metrics:
    exporterType: "OTLP_HTTP"
```

### Prometheus

To enable the Prometheus endpoint for collecting metrics, configure the Helm chart as follows:

```yaml
observability:
  metrics:
    exporterType: "PROMETHEUS"
```

The Prometheus endpoint (`/metrics`) will be available on the Bufstream broker on port 9090.

## Logging

Logging is output to standard error in the Bufstream brokers in JSON format. Use the following to configure the log level in the Helm chart:

```yaml
observability:
  # One of "DEBUG", "INFO", "WARN", or "ERROR.
  logLevel: "INFO"
```

## Tracing

Use the following to enable tracing in the Helm chart:

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

## Sensitive information redaction

Because consumer group IDs and topic names are user-provided and may contain information that users don't wish to report to monitoring systems, Bufstream can redact that information before reporting via metrics, logs, or traces. When redaction is set to `OPAQUE`, topic names are replaced with topic IDs (UUIDs) and consumer group ids are replaced with hashed values. To configure sensitive information redaction, set the following in the Helm values:

```yaml
observability:
  # -- Redact sensitive information such as topic names, before adding to to metrics, traces and logs.
  # Supports [NONE, OPAQUE].
  # Default: NONE.
  sensitiveInformationRedaction: "OPAQUE"
```
