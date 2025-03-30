---
layout: home

hero:
  name: "OpenTelemetry for connect-go: Observability out of the box"
---

Observability is a critical element for any robust system and monitoring incoming calls, error scenarios, and traces is a foundational component of it. As part of building a better RPC protocol, it’s important to provide a level of observability that customers need to successfully run their services. **Today, we’re launching** [**connect-opentelemetry-go**](https://github.com/connectrpc/otelconnect-go) **to provide out-of-the-box support for** [**OpenTelemetry**](https://opentelemetry.io/) **instrumentation with** [**connect-go**](https://github.com/connectrpc/connect-go)**.**

[connect-opentelemetry-go](https://github.com/connectrpc/otelconnect-go) conforms to the OpenTelemetry specification for both the gRPC and Connect protocols. Connect can now be used with observability platforms like Grafana, Datadog, Zipkin, Jaeger, and many others!

The library supports:

- **Tracing and metrics:** The full stable OpenTelemetry API is supported out of the box.
- **gRPC, gRPC-Web, and Connect:** Traces and logs will reflect the correct information regardless of the protocol being used.
- **Unary and streaming endpoints:** Get the important Connect-specific data that simple HTTP instrumentation cannot provide.
- **Client and servers:** Observability is available for the entire end-to-end system.

We chose [OpenTelemetry](https://opentelemetry.io/) (OTel) because of its compatibility with a wide range of tools and platforms, as well as its strong focus on vendor neutrality. Unlike some proprietary observability solutions, OpenTelemetry is not tied to any specific vendor or cloud platform. It provides the freedom to choose the tools and platforms that best meet one’s needs, without being locked into a specific solution. With OpenTelemetry enabled in a [connect-go](https://github.com/connectrpc/connect-go) project, the backend observability platform can be replaced without any changes to the application code.

## Example integration

To get started with [connect-opentelemetry-go](https://github.com/connectrpc/otelconnect-go), enable telemetry tracing and metrics using the `otelconnect.NewInterceptor()` option as shown in the example below:

```protobuf
func main() {
	// Set up OpenTelemetry globals
	setupOtel()
	// Construct a handler with otelconnect.NewInterceptor
	mux := http.NewServeMux()
	mux.Handle(
		pingv1connect.NewPingServiceHandler(
			&Pingservice{},
			// Add the otelconnect interceptor
			connect.WithInterceptors(otelconnect.NewInterceptor()),
		),
	)
	log.Fatal(http.ListenAndServe(":8080", mux))
}

func setupOtel() {
	// Exporting to different platforms can be configured here
	otel.SetTracerProvider(trace.NewTracerProvider())
	global.SetMeterProvider(metric.NewMeterProvider())
	otel.SetTextMapPropagator(propagation.TraceContext{})
}
```

On the client side, the same option can be passed into the constructor:

```protobuf
func makeRequest() {
	// Set up OpenTelemetry globals
	setupOtel()
	client := pingv1connect.NewPingServiceClient(
		http.DefaultClient,
		"http://localhost:8080",
		// Add the otelconnect interceptor
		connect.WithInterceptors(otelconnect.NewInterceptor()),
	)
	resp, err := client.Ping(
		context.Background(),
		connect.NewRequest(&pingv1.PingRequest{}),
	)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(resp)
}
```

This yields traces and metrics such as those shown below:

```protobuf
  "Name": "observability.ping.v1.PingService/Ping",
  "SpanContext": {
          "TraceID": "69b452e89c49ecb385d08ea29454a26c",
          "SpanID": "0ba9117c170f8eeb",
          "TraceFlags": "01",
          "TraceState": "",
          "Remote": false
        }, # ...
    {
      "Name": "rpc.server.duration",
      "Description": "",
      "Unit": "ms",
      "Data": {
              "DataPoints": [
# ...
```

`‍`With just these few lines of code, tracing and metrics can be added to [connect-go](https://github.com/connectrpc/connect-go) applications. To see more examples and tutorials on how to set up metrics and tracing dashboards, head over to the [**OpenTelemetry**](https://opentelemetry.io/) **website**. More information about implementing OpenTelemetry for [connect-go](https://github.com/connectrpc/connect-go) can be found by reading the docs and visiting the [connect-opentelemetry-go](https://github.com/connectrpc/otelconnect-go) GitHub repository.

## What about existing observability?

Since connect-go uses the standard `net/http` library, it automatically works with any observability tools that are designed for `net/http`. On top of the information that HTTP observability exposes, OpenTelemetry answers some important RPC-specific questions:

- `rpc.system`: Was this call gRPC, gRPC-Web, or Connect?
- `rpc.service` / `rpc.method`: What service and method was called?
- `responses_per_rpc`: How many responses is each RPC service getting?
- `error_code`: What specific gRPC or Connect error was returned?

This type of information isn’t available at the HTTP level, but [connect-opentelemetry-go](https://github.com/connectrpc/otelconnect-go) fills that gap and allows for the creation of more powerful and effective observability tooling. To see a full list of supported attributes, see the OpenTelemetry specifications for Connect [metrics](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/metrics/semantic_conventions/rpc-metrics.md#connect-rpc-conventions) and [tracing](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/semantic_conventions/rpc.md#connect-rpc-conventions).

## Support and versioning

[connect-opentelemetry-go](https://github.com/connectrpc/otelconnect-go) adheres to both the gRPC OpenTelemetry [metrics](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/metrics/semantic_conventions/rpc-metrics.md#grpc-conventions) and [tracing](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/semantic_conventions/rpc.md#grpc) specifications and the Connect OpenTelemetry [metrics](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/metrics/semantic_conventions/rpc-metrics.md#connect-rpc-conventions) and [tracing](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/semantic_conventions/rpc.md#connect-rpc-conventions) specifications, so any dependency on the library will be backed up by a specification.

## Get started with connect-go and OpenTelemetry

We’d love for you to try OpenTelemetry with connect-go! Check out the [Connect observability docs](https://connectrpc.com/docs/go/observability), the [connect-go](https://github.com/connectrpc/connect-go) repository, and [connect-opentelemetry-go](https://github.com/connectrpc/otelconnect-go). If you have any questions or feedback, you can reach us through the [Buf Slack](https://buf.build/b/slack/) or by filing a [GitHub issue](https://github.com/connectrpc/otelconnect-go/issues); we’d be more than happy to chat!
