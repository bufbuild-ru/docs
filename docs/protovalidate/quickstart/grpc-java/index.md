---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/protovalidate/quickstart/grpc-java/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/protovalidate/quickstart/grpc-go/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/protovalidate/quickstart/grpc-python/"
  - - meta
    - property: "og:title"
      content: "gRPC and Java - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/protovalidate/quickstart/grpc-java.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/protovalidate/quickstart/grpc-java/"
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
      content: "gRPC and Java - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/protovalidate/quickstart/grpc-java.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Protovalidate in gRPC and Java

This quickstart shows how to add Protovalidate to a Java RPC powered by [gRPC](https://grpc.io/docs/languages/java/quickstart/):

1.  Adding the Protovalidate dependency.
2.  Annotating Protobuf files and regenerating code.
3.  Adding a gRPC interceptor.
4.  Testing your validation logic.

Just need an example? There's an example of Protovalidate for gRPC and Java in [GitHub](https://github.com/bufbuild/buf-examples/tree/main/protovalidate/grpc-java/finish).

## Prerequisites

- Install the [Buf CLI](../../../cli/). If you already have, run `buf --version` to verify that you're using at least `1.54.0`.
- Have [`git`](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [`Java 11+`](https://www.oracle.com/in/java/) installed and in your `$PATH`.
- Clone the `buf-examples` repo and navigate to the `protovalidate/grpc-java/start` directory:

  ```sh
  git clone https://github.com/bufbuild/buf-examples.git && cd buf-examples/protovalidate/grpc-java/start
  ```

## Goal

This quickstart's `CreateInvoice` RPC doesn't have any input validation. Your goal is to pass a unit test verifying that you've added two validation rules using Protovalidate:

1.  Requests must provide an `Invoice` with a UUID `invoice_id`.
2.  Within the `Invoice` message, all of its `repeated LineItem line_items` must have unique combinations of `product_id` and `unit_price`.

Run the test now, and you can see that it fails:

```sh
./gradlew test
InvoiceServerTest > InvoiceId is required FAILED
    org.opentest4j.AssertionFailedError at InvoiceServerTest.java:98
InvoiceServerTest > Two line items cannot have the same product_id and unit price FAILED
    org.opentest4j.AssertionFailedError at InvoiceServerTest.java:123
```

When this test passes, you've met your goal.

## Run the server

Before you begin to code, verify that the example is working. Compile and run the server using its [Gradle](https://gradle.org/) wrapper:

```sh
./gradlew run
```

After a few seconds, you should see that it has started:

```console
INFO: Server started on port 50051
```

In a second terminal window, use `buf curl` to send an invalid `CreateInvoiceRequest`:

```sh
buf curl \
    --data '{ "invoice": { "invoice_id": "" } }' \
    --protocol grpc \
    --http2-prior-knowledge \
    http://localhost:50051/invoice.v1.InvoiceService/CreateInvoice
```

The server should respond with the version number of the invoice that was created, despite the invalid request. That's what you're here to fix.

```console
{
  "version": "1"
}
```

Before you start coding, take a few minutes to explore the code in the example.

## Explore quickstart code

This quickstart uses the example in `grpc-java/start`. Following standard Java project structure, source code is in `src/main`. Tests are in `src/test`.

### Protobuf

The project provides a single unary RPC:

::: info proto/invoice/v1/invoice_service.proto

```protobuf
// InvoiceService is a simple CRUD service for managing invoices.
service InvoiceService {
  // CreateInvoice creates a new invoice.
  rpc CreateInvoice(CreateInvoiceRequest) returns (CreateInvoiceResponse);
}
```

:::

`CreateInvoiceRequest` includes an `invoice` field that's an `Invoice` message. An `Invoice` has a repeated field of type `LineItem`:

::: info proto/invoice/v1/invoice.proto (excerpt)

```protobuf
message Invoice {
  // invoice_id is a unique identifier for this invoice.
  string invoice_id = 1;
  // line_items represent individual items on this invoice.
  repeated LineItem line_items = 4;
}

// LineItem is an individual good or service added to an invoice.
message LineItem {
  // product_id is the unique identifier for the good or service on this line.
  string product_id = 2;

  // quantity is the unit count of the good or service provided.
  uint64 quantity = 3;
}
```

:::

### YAML

When you add Protovalidate, you'll update the following files:

- `buf.yaml`: Protovalidate must be added as a dependency.
- `buf.gen.yaml`: To avoid a common Go issue in projects using the Buf CLI's [managed mode](../../../generate/managed-mode/), you'll see how to exclude Protovalidate from package renaming.

### Java

You'll be working in `invoice.v1.InvoiceServer`. It's an executable that runs a server on port 50051. You'll edit it to add a Protovalidate interceptor to gRPC.

`src/main/java/invoice/v1/InvoiceService.java` provides `InvoiceService`, an implementation of the generated `InvoiceServiceGrpc.InvoiceServiceImplBase`. Its `createInvoice` function sends back a static response.

Now that you know your way around the example code, it's time to integrate Protovalidate.

## Integrate Protovalidate

It's time to add Protovalidate to your project. It may be useful to read the Protovalidate [overview](../../) and its [quickstart](../) before continuing.

### Add Protovalidate dependency

Because Protovalidate is a publicly available [Buf Schema Registry (BSR)](../../../bsr/) module, it's simple to add it to any Buf CLI project.

1.  Open `build.gradle.kts` and verify that `build.buf:protovalidate` has already been added as a dependency. In your own projects, you'd need to add [build.buf:protovalidate:0.6.0](https://central.sonatype.com/artifact/build.buf/protovalidate/0.8.0/overview) as a dependency.

    ::: info build.gradle

    ```groovy{4}
    dependencies {
        implementation(libs.annotation.api)
        implementation(libs.protobuf.java)
        implementation(libs.protovalidate)

        // Code omitted for brevity
    }
    ```

    :::

2.  Add Protovalidate as a dependency to `buf.yaml`.

    ::: info buf.yaml

    ```yaml
    # For details on buf.yaml configuration, visit https://bufbuild.ru/docs/configuration/v2/buf-yaml
    version: v2
    modules:
      - path: proto
    // [!code ++]
    deps:
      // [!code ++]
      - buf.build/bufbuild/protovalidate:v0.11.1
    lint:
      use:
        - STANDARD
    breaking:
      use:
        - FILE
    ```

    :::

3.  Update dependencies with the Buf CLI. You'll be warned that Protovalidate is declared but unused. That's fine.

    ::: info Updating CLI dependencies

    ```sh
    buf dep update
    WARN    Module buf.build/bufbuild/protovalidate is declared in your buf.yaml deps but is unused...
    ```

    :::

4.  Because this example uses [managed mode](../../../generate/managed-mode/), exclude Protovalidate from any updates to `java_package`.

    ::: info buf.gen.yaml

    ```yaml
    version: v2
    inputs:
      - directory: src/main/proto
    plugins:
      - remote: buf.build/protocolbuffers/java:v29.3
        out: src/main/java
      - remote: buf.build/grpc/java:v1.70.0
        out: src/main/java
    managed:
      enabled: true
      override:
        - file_option: java_package_suffix
          value: gen
        - file_option: java_package_prefix
          value: ""
    // [!code ++]
    disable:
      // [!code ++]
      - file_option: java_package
        // [!code ++]
        module: buf.build/bufbuild/protovalidate
    ```

    :::

5.  Verify that configuration is complete by running `buf generate`. It should complete with no error.

### Add a standard rule

You'll now add a [standard rule](../../schemas/standard-rules/) to `proto/invoice.proto` to require that the `invoice_id` field is a UUID. Start by importing Protovalidate:

::: info proto/invoice/v1/invoice.proto

```protobuf
syntax = "proto3";

package invoice.v1;

import "buf/validate/validate.proto"; // [!code ++]
import "google/protobuf/timestamp.proto";
```

:::

You could use the `required` rule to verify that requests provide this field, but Protovalidate makes it easy to do more specific validations. Use `string.uuid` to declare that `invoice_id` must be present and a valid UUID.

::: info proto/invoice/v1/invoice.proto

```protobuf
// Invoice is a collection of goods or services sold to a customer.
message Invoice {
  // invoice_id is a unique identifier for this invoice.
  string invoice_id = 1; // [!code --]
  string invoice_id = 1 [
   (buf.validate.field).string.uuid = true
  ];

  // account_id is the unique identifier for the account purchasing goods.
  string account_id = 2;

  // invoice_date is the date for an invoice. It should represent a date and
  // have no values for time components.
  google.protobuf.Timestamp invoice_date = 3;

  // line_items represent individual items on this invoice.
  repeated LineItem line_items = 4;
}
```

:::

Learn more about [string](../../../reference/protovalidate/rules/string_rules/) and [standard](../../schemas/standard-rules/) rules.

### Enforce complex rules

In `Invoice`, the `line_items` field needs to meet two business rules:

1.  There should always be at least one `LineItem`.
2.  No two `LineItems` should ever share the same `product_id` and `price`.

Protovalidate can enforce both of these rules by combining a [standard rule](../../schemas/standard-rules/) with a [custom rule](../../schemas/custom-rules/) written in [Common Expression Language (CEL)](https://cel.dev/).

First, use the `min_items` standard rule to require at least one `LineItem`:

::: info proto/invoice.proto

```protobuf
// Invoice is a collection of goods or services sold to a customer.
message Invoice {
  // invoice_id is a unique identifier for this invoice.
  string invoice_id = 1 [
    (buf.validate.field).string.uuid = true
  ];

  // account_id is the unique identifier for the account purchasing goods.
  string account_id = 2;

  // invoice_date is the date for an invoice. It should represent a date and
  // have no values for time components.
  google.protobuf.Timestamp invoice_date = 3;

  // line_items represent individual items on this invoice.
  repeated LineItem line_items = 4; // [!code --]
  repeated LineItem line_items = 4 [
    (buf.validate.field).repeated.min_items = 1
  ];
}
```

:::

Next, use a CEL expression to add a custom rule. Use the `map`, `string`, and `unique` CEL functions to check that no combination of `product_id` and `unit_price` appears twice within the array of `LineItems`:

::: info proto/invoice.proto

```protobuf
// Invoice is a collection of goods or services sold to a customer.
message Invoice {
  // invoice_id is a unique identifier for this invoice.
  string invoice_id = 1 [
    (buf.validate.field).string.uuid = true
  ];

  // account_id is the unique identifier for the account purchasing goods.
  string account_id = 2;

  // invoice_date is the date for an invoice. It should represent a date and
  // have no values for time components.
  google.protobuf.Timestamp invoice_date = 3;

  // line_items represent individual items on this invoice.
  repeated LineItem line_items = 4 [
    (buf.validate.field).repeated.min_items = 1
    (buf.validate.field).repeated.min_items = 1,

    (buf.validate.field).cel = {
      id: "line_items.logically_unique"
      message: "line items must be unique combinations of product_id and unit_price"
      expression: "this.map( it, it.product_id + '-' + string(it.unit_price) ).unique()"
    }
  ];
}
```

:::

You've added validation rules to your Protobuf. To enforce them, you still need to regenerate code and add a Protovalidate interceptor to your server.

Learn more about [custom rules](../../schemas/custom-rules/).

### Compile Protobuf and Java

Next, compile your Protobuf and regenerate code, adding the Protovalidate options to all of your message descriptors:

```sh
buf generate
```

With regenerated code, your server should still compile and build. (If you're still running the server, stop it with `Ctrl-c`.)

```sh
./gradlew run
```

After a few seconds, you should see that it has started:

```console
INFO: Server started on port 50051
```

In a second terminal window, use `buf curl` to send the same invalid `CreateInvoiceRequest`:

```sh
buf curl \
    --data '{ "invoice": { "invoice_id": "" } }' \
    --protocol grpc \
    --http2-prior-knowledge \
    http://localhost:50051/invoice.v1.InvoiceService/CreateInvoice
```

The response may be a surprise: the server still considers the request valid and returns a version number for the new invoice:

```console
{
  "version": "1"
}
```

The RPC is still successful because no Connect or gRPC implementations automatically enforce Protovalidate rules. To enforce your validation rules, you'll need to add an interceptor.

### Add a Protovalidate interceptor

The `buf-examples` repository provides a sample `ValidationInterceptor` class, a gRPC `ServerInterceptor` that's ready to use with Protovalidate. It inspects requests, runs Protovalidate, and returns a gRPC `INVALID_ARGUMENT` status on failure. Validation failure responses use the same response format as the Connect RPC [Protovalidate interceptor](https://github.com/connectrpc/validate-go/).

Follow these steps to begin enforcing Protovalidate rules:

1.  In your first console window, use `Ctrl-c` to stop your server.
2.  In `InvoiceServer`, add necessary imports:

    ::: info InvoiceServer.java

    ```diff
    package invoice.v1;


    + import buf.build.example.protovalidate.ValidationInterceptor;
    + import build.buf.protovalidate.Validator;
    + import build.buf.protovalidate.ValidatorFactory;
    import io.grpc.*;
    import io.grpc.protobuf.services.ProtoReflectionServiceV1;
    ```

    :::

3.  In `InvoiceServer`'s `main` method, instantiate a `ValidationInterceptor` and use it when creating `InvoiceService`'s `serviceDefinition`:

    ::: info InvoiceService.java

    ```diff
    public static void main(String[] args) throws IOException, InterruptedException {
        final BindableService service = new InvoiceService();
    -   final ServerServiceDefinition serviceDefinition = ServerInterceptors.intercept(service);
    +   final ValidationInterceptor validationInterceptor = new ValidationInterceptor( ValidatorFactory.newBuilder().build() );
    +   final ServerServiceDefinition serviceDefinition = ServerInterceptors.intercept(service, validationInterceptor);
        final InvoiceServer invoiceServer = new InvoiceServer(50051, InsecureServerCredentials.create(), serviceDefinition);

        invoiceServer.run();
        invoiceServer.awaitTermination();

    }
    ```

    :::

4.  Stop (`Ctrl-c`) and restart your server:

    ```sh
    ./gradlew run
    ```

    After a few seconds, you should see that it has started:

    ```console
    INFO: Server started on port 50051
    ```

Now that you've added the Protovalidate interceptor and restarted your server, try the `buf curl` command again:

```sh
buf curl \
    --data '{ "invoice": { "invoice_id": "" } }' \
    --protocol grpc \
    --http2-prior-knowledge \
    http://localhost:50051/invoice.v1.InvoiceService/CreateInvoice
```

This time, you should receive a block of JSON representing Protovalidate's enforcement of your rules. In the abridged excerpt below, you can see that it contains details about every field that violated Protovalidate rules:

::: info Protovalidate violations

```json
{
  "violations": [
    {
      "ruleId": "string.uuid_empty",
      "message": "value is empty, which is not a valid UUID"
    },
    {
      "ruleId": "repeated.min_items",
      "message": "value must contain at least 1 item(s)"
    }
  ]
}
```

:::

Last, use `buf curl` to test the custom rule that checks for logically unique `LineItems`:

```sh
buf curl \
    --data '{ "invoice": { "invoice_id": "079a91c2-cb8b-4f01-9cf9-1b9c0abdd6d2", "line_items": [{"product_id": "A", "unit_price": "1" }, {"product_id": "A", "unit_price": "1" }] } }' \
    --protocol grpc \
    --http2-prior-knowledge \
    http://localhost:50051/invoice.v1.InvoiceService/CreateInvoice
```

You can see that this more complex expression is enforced at runtime:

::: info Custom CEL rule violation

```json
{
  "violations": [
    {
      "ruleId": "line_items.logically_unique",
      "message": "line items must be unique combinations of product_id and unit_price"
    }
  ]
}
```

:::

You've now added Protovalidate to a gRPC in Java, but `buf curl` isn't a great way to make sure you're meeting all of your requirements. Next, you'll see one way to verify Protovalidate rules in tests.

## Test Protovalidate errors

The starting code for this quickstart contains `InvoiceServerTest`, a JUnit 5 test. It starts a server with a Protovalidate interceptor and iterates through a series of test cases.

In the prior section, you saw that the `violations` list returned by Protovalidate follows a predictable structure. Each violation in the list is a Protobuf message named `Violation`, [defined within Protovalidate itself](../../../reference/protovalidate/violations/).

The test already provides a convenient way to declare expected violations through a `ViolationSpec` class:

::: info ViolationSpec in InvoiceServerTest.java

```java
private static class ViolationSpec {
    public final String ruleId;
    public final String fieldPath;
    public final String message;

    public ViolationSpec(String ruleId, String fieldPath, String message) {
        this.ruleId = ruleId;
        this.fieldPath = fieldPath;
        this.message = message;
    }
}
```

:::

Examine the highlighted lines in `InvoiceServerTest`, noting that the tests check for specific expected violations:

::: info InvoiceServerTest.java

```java{12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45}
public class InvoiceServerTest {
    // Code omitted for brevity

    @Test
    @DisplayName("A valid invoice passes validation")
    public void testValidInvoice() {
        Invoice invoice = newValidInvoice();
        CreateInvoiceRequest req = CreateInvoiceRequest.newBuilder().setInvoice(invoice).build();
        assertDoesNotThrow(() -> invoiceClient.createInvoice(req));
    }

    @Test
    @DisplayName("InvoiceId is required")
    public void testInvoiceIdIsRequired() {
        Invoice invoice = Invoice.newBuilder().mergeFrom(newValidInvoice())
                .setInvoiceId("")
                .build();
        CreateInvoiceRequest req = CreateInvoiceRequest.newBuilder().setInvoice(invoice).build();

        StatusRuntimeException exception = assertThrows(StatusRuntimeException.class, () -> invoiceClient.createInvoice(req));
        checkStatusRuntimeException(exception, List.of(
                new ViolationSpec("string.uuid_empty", "invoice.invoice_id", "value is empty, which is not a valid UUID")
        ));
    }

    @Test
    @DisplayName("Two line items cannot have the same product_id and unit price")
    public void testTwoLineItemsCannotHaveTheSameProductIdAndUnitPrice() {
        Invoice template = newValidInvoice();
        Invoice invoice = Invoice.newBuilder().mergeFrom(template)
                .setLineItems(1,
                        LineItem.newBuilder()
                                .mergeFrom(template.getLineItems(1))
                                .setLineItemId(template.getLineItems(0).getLineItemId())
                                .setUnitPrice(template.getLineItems(0).getUnitPrice())
                )
                .build();

        CreateInvoiceRequest req = CreateInvoiceRequest.newBuilder().setInvoice(invoice).build();

        StatusRuntimeException exception = assertThrows(StatusRuntimeException.class, () -> invoiceClient.createInvoice(req));
        checkStatusRuntimeException(exception, List.of(
                new ViolationSpec("line_items.logically_unique", "invoice.line_items", "line items must be unique combinations of product_id and unit_price")
        ));
    }

    // Code omitted for brevity
}
```

:::

To check your work, run all tests.

```sh
 ./gradlew test --rerun
```

If all tests pass, you've met your goal:

::: info Test results

```console
InvoiceServerTest > InvoiceId is required PASSED

InvoiceServerTest > Two line items cannot have the same product_id and unit price PASSED

InvoiceServerTest > A valid invoice passes validation PASSED
```

:::

::: tip More testing examples
The `finish` directory contains a thorough test that you can use as an example for your own tests. Its `invoice.proto` file also contains extensive Protovalidate rules.
:::

## Wrapping up

In this quickstart, you've learned the basics of working with Protovalidate:

1.  Adding Protovalidate to your project.
2.  Declaring validation rules in your Protobuf files.
3.  Enabling their enforcement within an RPC API.
4.  Testing their functionality.

## Further reading

- Integrate [Protovalidate validation within Kafka brokers](../bufstream/)
- Add Protovalidate's [standard rules](../../schemas/standard-rules/) to schemas
- Use CEL expressions to declare field and message-level [custom rules](../../schemas/custom-rules/)
- Reuse logic with [predefined rules](../../schemas/predefined-rules/)
- Learn more about [Protovalidate's relationship with CEL](../../cel/).
