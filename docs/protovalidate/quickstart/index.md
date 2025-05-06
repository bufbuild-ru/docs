---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/protovalidate/quickstart/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/protovalidate/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/protovalidate/schemas/adding-protovalidate/"
  - - meta
    - property: "og:title"
      content: "Quickstart - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/protovalidate/quickstart.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/protovalidate/quickstart/"
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
      content: "Quickstart - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/protovalidate/quickstart.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Quickstart

This quickstart steps through adding Protovalidate to existing Protobuf projects using the [Buf CLI](../../cli/):

1.  Adding Protovalidate rules to schemas.
2.  Using CEL to add domain-specific validation logic.
3.  Enabling server-side validation.

## Download the code (optional)

If you'd like to code along in Go, Java, or Python, complete the following steps. If you're only here for a quick tour, feel free to skip ahead.

1.  Install the [Buf CLI](../../cli/). If you already have, run `buf --version` to verify that you're using at least `1.32.0`.
2.  Have [`git`](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and your choice of [`go`](https://go.dev/dl/), [`Java 17+`](https://www.oracle.com/in/java/), or [`Python 3.7+`](https://www.python.org/downloads/) installed.
3.  Clone the `buf-examples` repository:

    ```console
    $ git clone git@github.com:bufbuild/buf-examples.git
    ```

4.  Open a terminal to the repository and navigate to the `protovalidate/quickstart-go/start`, `protovalidate/quickstart-java/start`, or `protovalidate/quickstart-python/start` directory.

Each language's quickstart code contains Buf CLI configuration files (`buf.yaml`, `buf.gen.yaml`), a simple `weather_service.proto`, and an idiomatic unit test.

## Adding Protovalidate to schemas

### Depending on Protovalidate

Published publicly on the [Buf Schema Registry](../../bsr/), the Protovalidate module provides the Protobuf extensions, options, and messages powering validation.

Add it as a dependency in `buf.yaml`:

+++tabs key:70a55f19e07dd7ea6318bf95a4fe1060

== Go

::: info buf.yaml

```yaml
version: v2
modules:
  - path: proto
# v.10.7 is compatible with the current version of Protovalidate's Go implementation (0.9.3).
// [!code ++]
deps:
  // [!code ++]
  - buf.build/bufbuild/protovalidate:v0.10.7
lint:
  use:
    - STANDARD
breaking:
  use:
    - FILE
```

:::

== Java

::: info buf.yaml

```yaml
version: v2
modules:
  - path: proto
# v.10.7 is compatible with the current version of Protovalidate's Java implementation (0.6.0).
// [!code ++]
deps:
  // [!code ++]
  - buf.build/bufbuild/protovalidate:v0.10.7
lint:
  use:
    - STANDARD
breaking:
  use:
    - FILE
```

:::

== Python

::: info buf.yaml

```yaml
version: v2
modules:
  - path: proto
# v.10.7 is compatible with the current version of Protovalidate's Python implementation (0.7.1).
// [!code ++]
deps:
  // [!code ++]
  - buf.build/bufbuild/protovalidate:v0.10.7
lint:
  use:
    - STANDARD
breaking:
  use:
    - FILE
```

:::

+++

Next, update dependencies. You may see a warning that Protovalidate hasn't yet been used. That's fine.

```console
$ buf dep update
WARN    Module buf.build/bufbuild/protovalidate is declared in your buf.yaml deps but is unused...
```

If you're using Go or Java, update [managed mode](../../generate/managed-mode/) options in `buf.gen.yaml`:

+++tabs key:571c3ea8d7957662bdd4618c1dff523b

== Go

::: info buf.gen.yaml

```yaml
version: v2
inputs:
  - directory: proto
plugins:
  - remote: buf.build/protocolbuffers/go:v1.36.5
    out: gen
    opt:
      - paths=source_relative
managed:
  enabled: true
  override:
    - file_option: go_package_prefix
      value: github.com/bufbuild/buf-examples/protovalidate/quickstart-go/start/gen
// [!code ++]
# Don't modify any file option or field option for protovalidate. Without
// [!code ++]
# this, generated Go will fail to compile.
// [!code ++]
disable:
  // [!code ++]
  - file_option: go_package
    // [!code ++]
    module: buf.build/bufbuild/protovalidate
```

:::

== Java

::: info buf.gen.yaml

```yaml
version: v2
inputs:
  - directory: src/main/proto
plugins:
  - remote: buf.build/protocolbuffers/java:v29.3
  out: src/main/java
managed:
  enabled: true
// [!code ++]
disable:
  // [!code ++]
  - file_option: java_package
    // [!code ++]
    module: buf.build/bufbuild/protovalidate
```

:::

+++

### Adding rules to a message

To add rules to a message, you'll first import Protovalidate and then add Protovalidate annotations.

Make the following changes to `proto/bufbuild/weather/v1/weather_service.proto` to add rules to a `GetWeatherRequest` message. (Java note: this directory is relative to `src/main`.)

::: info proto/bufbuild/weather/v1/weather_service.proto

```diff
syntax = "proto3";

package bufbuild.weather.v1;

+ import "buf/validate/validate.proto";
import "google/protobuf/timestamp.proto";

// GetWeatherRequest is a request for weather at a point on Earth.
message GetWeatherRequest {
  // latitude must be between -90 and 90, inclusive, to be valid. Use of a
  // float allows precision to about one square meter.
- float latitude = 1;
+ float latitude = 1 [
+   (buf.validate.field).float.gte = -90,
+   (buf.validate.field).float.lte = 90
+ ];

  // longitude must be between -180 and 180, inclusive, to be valid. Use of a
  // float allows precision to about one square meter.
- float longitude = 2;
+ float longitude = 2 [
+   (buf.validate.field).float.gte = -180,
+   (buf.validate.field).float.lte = 180
+ ];

  // forecast_date for the weather request. It must be within the next
  // three days.
  google.protobuf.Timestamp forecast_date = 3;
}
```

:::

## Generating code

Protovalidate doesn't introduce any new code generation plugins because its rules are compiled as part of your service and message descriptors — `buf generate` works without any changes.

Run it to include your new rules in the `GetWeatherRequest` descriptor:

```console
$ buf generate
```

To learn more about generating code with the Buf CLI, read the [code generation overview](../../generate/overview/).

## Adding business logic with CEL

If Protovalidate only provided logical validations on known types, such as maximum and minimum values or verifying required fields were provided, it'd be an incomplete library. Real world validation rules are often more complicated:

1.  A `BuyMovieTicketsRequest` request must be for a `showtime` in the future but no more than two weeks in the future.
2.  A `SaveBlogEntryRequest` must have a `status` of `DRAFT`, `PUBLISHED`, or `ARCHIVED`.
3.  An `AddProductToInventoryRequest` must have a serial number starting with a constant prefix and matching a complicated regular expression.

Protovalidate can meet all of these requirements because all Protovalidate rules are defined in [Common Expression Language (CEL)](https://cel.dev). CEL is a lightweight, high-performance expression language that allows expressions like `this.first_flight_duration + this.second_flight_duration < duration('48h')` to evaluate consistently across languages.

Adding a CEL-based rule to a field is straightforward. Instead of a providing a static value, you provide a unique identifier (`id`), an error message, and a CEL expression. Building on the prior `GetWeatherRequest` example, add a custom rule stating that users must ask for weather forecasts within the next 72 hours:

::: info proto/bufbuild/weather/v1/weather_service.proto

```diff
syntax = "proto3";

package bufbuild.weather.v1;

import "buf/validate/validate.proto";
import "google/protobuf/timestamp.proto";

// GetWeatherRequest is a request for weather at a point on Earth.
message GetWeatherRequest {
  // latitude must be between -90 and 90, inclusive, to be valid. Use of a
  // float allows precision to about one square meter.
  float latitude = 1 [
    (buf.validate.field).float.gte = -90,
    (buf.validate.field).float.lte = 90
  ];
  // longitude must be between -180 and 180, inclusive, to be valid. Use of a
  // float allows precision to about one square meter.
  float longitude = 2 [
    (buf.validate.field).float.gte = -180,
    (buf.validate.field).float.lte = 180
  ];

  // forecast_date for the weather request. It must be within the next
  // three days.
- google.protobuf.Timestamp forecast_date = 3;
+ google.protobuf.Timestamp forecast_date = 3 [(buf.validate.field).cel = {
+     id: "forecast_date.within_72_hours"
+     message: "Forecast date must be in the next 72 hours."
+     expression: "this >= now && this <= now + duration('72h')"
+ }];
}
```

:::

Remember to recompile and regenerate code:

```console
$ buf generate
```

## Running validations

All Protovalidate languages provide an idiomatic API for validating a Protobuf message.

In the final code exercise, you'll use it directly, checking enforcement of `GetWeatherRequest`'s validation rules.

+++tabs key:70a55f19e07dd7ea6318bf95a4fe1060

== Go

1.  Make sure you've navigated to `protovalidate/quickstart-go/start` within the `buf-examples` repository.
2.  Install Protovalidate using `go get`.

    ```console
    $ go get github.com/bufbuild/protovalidate-go@v0.9.3
    ```

3.  Run `weather/weather_test.go` with `go test`. It should fail — it expects invalid latitudes and longitudes to be rejected, but you haven't yet added any validation.

    ```console
    $ go test ./weather
    --- FAIL: TestRequests (0.00s)
        --- FAIL: TestRequests/latitude_too_low (0.00s)
            weather_test.go:65:
                    Error Trace:    /Users/janedoe/dev/bufbuild/buf-examples/protovalidate/quickstart-go/start/weather/weather_test.go:65
                    Error:          An error is expected but got nil.
                    Test:           TestRequests/latitude_too_low
        --- FAIL: TestRequests/latitude_too_high (0.00s)
            weather_test.go:65:
                    Error Trace:    /Users/janedoe/dev/bufbuild/buf-examples/protovalidate/quickstart-go/start/weather/weather_test.go:65
                    Error:          An error is expected but got nil.
                    Test:           TestRequests/latitude_too_high
    FAIL
    FAIL    github.com/bufbuild/buf-examples/protovalidate/quickstart-go/start/weather  0.244s
    FAIL
    ```

4.  Open `weather/weather.go`. Update the `validateWeather` function to return the result of `protovalidate.Validate()`:

    ::: info weather/weather.go

    ```go
    package weather

    import (
        weatherv1 "github.com/bufbuild/buf-examples/protovalidate/quickstart-go/start/gen/bufbuild/weather/v1"
        "github.com/bufbuild/protovalidate-go" // [!code ++]
    )

    func validateWeather(_ *weatherv1.GetWeatherRequest) error { // [!code --]
          // TODO: validate the request // [!code --]
          return nil // [!code --]
    } // [!code --]
    func validateWeather(req *weatherv1.GetWeatherRequest) error { // [!code ++]
          return protovalidate.Validate(req) // [!code ++]
    } // [!code ++]
    ```

    :::

5.  Run `go test`. Now that you've added validation, all tests should pass.

    ```console
    $ go test ./weather
    ```

== Java

1.  Make sure you've navigated to `protovalidate/quickstart-java/start` within the `buf-examples` repository.
2.  Open `build.gradle.kts` and verify that `libs.protovalidate` has already been added as a dependency. In your own projects, you'd need to add [build.buf:protovalidate:0.6.0](https://central.sonatype.com/artifact/build.buf/protovalidate/0.6.0/overview) as a dependency.

    ::: info build.gradle

    ```groovy{3}
    dependencies {
        implementation(libs.protobuf.java)
        implementation(libs.protovalidate)

        testImplementation platform('org.junit:junit-bom:5.10.0')
        testImplementation 'org.junit.jupiter:junit-jupiter'
    }
    ```

    :::

3.  Run `WeatherTest` with `./gradlew test`. It should fail — it expects invalid latitudes and longitudes to be rejected, but you haven't yet added any validation.

    ```text
    $ ./gradlew test
    > Task :test FAILED

    WeatherTest > TestBadLatitude() FAILED
        org.opentest4j.AssertionFailedError at WeatherTest.java:56

    WeatherTest > TestValidRequest() PASSED

    WeatherTest > TestBadLongitude() FAILED
        org.opentest4j.AssertionFailedError at WeatherTest.java:73

    WeatherTest > TestBadForecastDate() FAILED
        org.opentest4j.AssertionFailedError at WeatherTest.java:90
    ```

4.  Open `WeatherService` (`src/main/java/bufbuild/weather`). Update the `validateGetWeatherRequest` function to return the result of `validator.validate()`:

    ::: info WeatherService

    ```diff
    public class WeatherService {

        private static final Validator validator = new Validator();

        public ValidationResult validateGetWeatherRequest(GetWeatherRequest request) throws ValidationException {
    -       return new ValidationResult(Collections.emptyList());
    +       return validator.validate(request);
        }
    }
    ```

    :::

5.  Run `./gradlew test`. Now that you've added validation, all tests should pass.

    ```console
    $ ./gradlew test
    ```

== Python

1.  Make sure you've navigated to `protovalidate/quickstart-python/start` within the `buf-examples` repository.
2.  Using a virtual environment, install dependencies. In your own projects, you'd need to add the [protocolbuffers/pyi](https://buf.build/bufbuild/protovalidate/sdks/v0.10.7:protocolbuffers/pyi) and [protocolbuffers/python](https://buf.build/bufbuild/protovalidate/sdks/v0.10.7:protocolbuffers/python) generated SDKs for Protovalidate.

    ```console
    $ python3 -m venv venv
    $ source ./venv/bin/activate
    (venv) $ pip install -r requirements.txt --extra-index-url https://buf.build/gen/python
    ```

3.  Run `weather_test.py`. It should fail — it expects invalid latitudes and longitudes to be rejected, but you haven't yet added any validation.

    ```console
    $ python3 -m unittest -v weather_test.py
    test_bad_forecast_date (weather_test.WeatherTest.test_bad_forecast_date) ... FAIL
    test_bad_latitude (weather_test.WeatherTest.test_bad_latitude) ... FAIL
    test_bad_longitude (weather_test.WeatherTest.test_bad_longitude) ... FAIL
    test_valid_request (weather_test.WeatherTest.test_valid_request) ... ok
    ```

4.  Open `weather.py`. Update the `validateWeather` function to return the result of `protovalidate.validate()`:

    ::: info weather.py

    ```diff
    + import protovalidate

    def validateWeather(request):
    -   pass
    +   protovalidate.validate(request)
    ```

    :::

5.  Run `weather_test.py`. Now that you've added validation, all tests should pass.

    ```console
    $ python3 -m unittest -v weather_test.py
    ```

+++

You've now walked through the basic steps for using Protovalidate: adding it as a dependency, annotating your schemas with rules, and validating Protobuf messages.

### Validating API requests

One of Protovalidate's most common use cases is for validating requests made to RPC APIs. Though it's possible to use the above examples to add a validation request at the start of every request handler, it's not efficient. Instead, use Protovalidate within a ConnectRPC or gRPC interceptor, providing global input validation.

Open-source Protovalidate interceptors are available for [Connect Go](https://github.com/connectrpc/validate-go/) and [gRPC-Go](https://github.com/grpc-ecosystem/go-grpc-middleware). In the quickstarts for specific languages and gRPC frameworks, you'll also find example interceptors for [Java](grpc-java/), and [Python](grpc-python/).

Adding these interceptors is no different from configuring any other RPC interceptor:

+++tabs key:60847cc0c9011a92578351a21479db50

== Go / ConnectRPC

```go
// Create the validation interceptor provided by connectrpc.com/validate.
interceptor, err := validate.NewInterceptor()
if err != nil {
    log.Fatal(err)
}

// Include the interceptor when adding handlers.
path, handler := weatherv1connect.NewWeatherServiceHandler(
    weatherServer,
    connect.WithInterceptors(interceptor),
)
```

== Go / gRPC

```go
// Create a Protovalidate Validator
validator, err := protovalidate.New()
assert.Nil(t, err)

// Use the protovalidate_middleware interceptor provided by grpc-ecosystem
interceptor := protovalidate_middleware.UnaryServerInterceptor(validator)

// Include the interceptor when configuring the gRPC server.
grpcServer := grpc.NewServer(
    grpc.UnaryInterceptor(interceptor),
)
```

== Java

```java
// Include a Protovalidate-based interceptor when configuring the gRPC server.
Server server = ServerBuilder.forPort(port)
    .intercept(new ProtovalidateInterceptor())
    .build();
```

== Python

```python
// Include a Protovalidate-based interceptor when configuring the gRPC server.
server = grpc.server(
    futures.ThreadPoolExecutor(max_workers=10),
    interceptors=(ValidationInterceptor(),),
)
```

+++

For a deep dive into using Protovalidate for RPC APIs with executable tutorials, explore one of these example Protovalidate integrations:

- [Connect RPC and Go](connect-go/)
- [gRPC and Go](grpc-go/)
- [gRPC and Java](grpc-java/)
- [gRPC and Python](grpc-python/)

### Validating Kafka messages

In traditional Kafka, brokers are simple data pipes — they have no understanding of what data traverses them. Though this simplicity helped Kafka gain ubiquity, most data sent through Kafka topics is structured and should follow a schema.

Using [Bufstream](../../bufstream/) — the Kafka-compatible message queue built for the data lakehouse era — you can add Protovalidate rule enforcement to broker-side schema awareness. With a Bufstream broker already using the [Buf Schema Registry's Confluent Schema Registry support](../../bsr/csr/overview/), enabling Protovalidate is a two-line configuration change within `data_enforcement`:

::: info Bufstream Configuration YAML

```diff
data_enforcement:
  produce:
    - topics: { all: true }
      values:
        on_parse_error: REJECT_BATCH
+       validation:
+         on_error: REJECT_BATCH
```

:::

For a deep dive into using Protovalidate with Bufstream, follow the [Protovalidate in Kafka quickstart](bufstream/).

## Next steps

Read on to learn more about enabling schema-first validation with Protovalidate:

- Discover how to [add Protovalidate](../schemas/adding-protovalidate/) to Protobuf schemas.
- Learn how to write [custom validation rules](../schemas/custom-rules/) with Common Expression Language.
- Explore how Protovalidate works in [advanced CEL topics](../cel/).
