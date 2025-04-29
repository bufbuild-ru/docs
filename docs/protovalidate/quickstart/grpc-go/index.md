---

title: "gRPC and Go - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/protovalidate/quickstart/grpc-go/"
  - - meta
    - property: "og:title"
      content: "gRPC and Go - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/protovalidate/quickstart/grpc-go/"
  - - meta
    - property: "twitter:title"
      content: "gRPC and Go - Buf Docs"

---

# Protovalidate in gRPC and Go

This tutorial shows how to add Protovalidate to a Go RPC powered by [gRPC](https://grpc.io/docs/languages/go/quickstart/):

1.  Adding the Protovalidate dependency.
2.  Annotating Protobuf files and regenerating code.
3.  Adding a gRPC interceptor.
4.  Testing your validation logic.

::: tip Just need an example?There's an example of Protovalidate for gRPC and Go in [GitHub](https://github.com/bufbuild/buf-examples/tree/main/protovalidate/grpc-go/finish).

:::

## Prerequisites

- Install the [Buf CLI](../../../cli/). If you already have, run `buf --version` to verify that you're using at least `1.32.0`.
- Have [`git`](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [`go`](https://go.dev/dl/) installed and in your `$PATH`.
- Clone the `buf-examples` repo and navigate to the `protovalidate/grpc-go/start` directory:

  ```console
  $ git clone git@github.com:bufbuild/buf-examples.git && cd buf-examples/protovalidate/grpc-go/start
  ```

## Goal

This tutorial's `CreateInvoice` RPC doesn't have any input validation. Your goal is to pass a unit test verifying that you've added two validation rules using Protovalidate:

1.  Requests must provide an `Invoice` with a UUID `invoice_id`.
2.  Within the `Invoice` message, all of its `repeated LineItem line_items` must have unique combinations of `product_id` and `unit_price`.

Run the test now, and you can see that it fails:

```console
$ go test -v ./...
--- PASS: TestCreateInvoice/A_valid_invoice_passes_validation (0.00s)
--- FAIL: TestCreateInvoice/InvoiceId_is_required (0.00s)
--- FAIL: TestCreateInvoice/Two_line_items_cannot_have_the_same_product_id_and_unit_price (0.00s)
```

When this test passes, you've met your goal.

## Run the server

Before you begin to code, verify that the example is working. Compile and start the included server:

```console
$ go run cmd/server.go
```

After a few seconds, you should see that it has started:

```console
2025/02/04 19:52:02 INFO starting invoice service address=:50051
```

In a second terminal window, use `buf curl` to send an invalid `CreateInvoiceRequest`:

```console
$ buf curl \
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

## Explore tutorial code

This tutorial uses the example in `grpc-go/start`. All filenames are relative to this directory.

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

### Go

You'll be working in `cmd/server.go`. It's an executable that runs a server on port 50051. You'll edit it to add a Protovalidate interceptor to gRPC.

::: tip Where's the service itself?`internal/invoice/invoice.go` provides `invoice.Service`, a handler for the `InvoiceService`. Its `CreateInvoice` function sends back a static response.

:::

Now that you know your way around the example code, it's time to integrate Protovalidate.

## Integrate Protovalidate

It's time to add Protovalidate to your project. It may be useful to read the Protovalidate [overview](../../) and its [quickstart](../) before continuing.

### Add Protovalidate dependency

Because Protovalidate is a publicly available [Buf Schema Registry (BSR)](../../../bsr/) module, it's simple to add it to any Buf CLI project.

1.  Add Protovalidate to your Go project:

    ```console
    $ go get buf.build/gen/go/bufbuild/protovalidate/protocolbuffers/go/buf/validate
    ```

2.  Add Protovalidate as a dependency to `buf.yaml`.

    ::: info buf.yaml

    ```diff
    # For details on buf.yaml configuration, visit https://bufbuild.ru/docs/configuration/v2/buf-yaml
    version: v2
    modules:
      - path: proto
    + deps:
    +   - buf.build/bufbuild/protovalidate
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

    ```console
    $ buf dep update
    WARN    Module buf.build/bufbuild/protovalidate is declared in your buf.yaml deps but is unused...
    ```

    :::

4.  Because this example uses [managed mode](../../../generate/managed-mode/), exclude Protovalidate from any updates to `go_package`.

    ::: info buf.gen.yaml

    ```diff
    version: v2
    inputs:
      - directory: proto
    plugins:
      - remote: buf.build/protocolbuffers/go
        out: gen
        opt: paths=source_relative
      - remote: buf.build/grpc/go
        out: gen
        opt: paths=source_relative
    managed:
      enabled: true
      override:
        - file_option: go_package_prefix
          value: github.com/bufbuild/buf-examples/protovalidate/grpc-go/start/gen
    +  disable:
    +    - file_option: go_package
    +      module: buf.build/bufbuild/protovalidate
    ```

    :::

5.  Verify that configuration is complete by running `buf generate`. It should complete with no error.

::: tip Further reading and `protoc`Learn more about incorporating Protovalidate and `protoc` support in the [Adding protovalidate](../../schemas/adding-protovalidate/) page.

:::

### Add a standard rule

You'll now add a [standard rule](../../schemas/standard-rules/) to `proto/invoice.proto` to require that the `invoice_id` field is a UUID. Start by importing Protovalidate:

::: info proto/invoice/v1/invoice.proto

```diff
syntax = "proto3";

package invoice.v1;

+ import "buf/validate/validate.proto";
import "google/protobuf/timestamp.proto";
```

:::

You could use the `required` rule to verify that requests provide this field, but Protovalidate makes it easy to do more specific validations. Use `string.uuid` to declare that `invoice_id` must be present and a valid UUID.

::: info proto/invoice/v1/invoice.proto

```diff
// Invoice is a collection of goods or services sold to a customer.
message Invoice {
  // invoice_id is a unique identifier for this invoice.
- string invoice_id = 1;
+ string invoice_id = 1 [
+   (buf.validate.field).string.uuid = true
+ ];

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

::: tip Learn more about [string](../../../reference/protovalidate/rules/string_rules/) and [standard](../../schemas/standard-rules/) rules.

:::

### Enforce complex rules

In `Invoice`, the `line_items` field needs to meet two business rules:

1.  There should always be at least one `LineItem`.
2.  No two `LineItems` should ever share the same `product_id` and `price`.

Protovalidate can enforce both of these rules by combining a [standard rule](../../schemas/standard-rules/) with a [custom rule](../../schemas/custom-rules/) written in [Common Expression Language (CEL)](https://cel.dev/).First, use the `min_items` standard rule to require at least one `LineItem`:

::: info proto/invoice.proto

```diff
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
- repeated LineItem line_items = 4;
+ repeated LineItem line_items = 4 [
+    (buf.validate.field).repeated.min_items = 1
+ ];
}
```

:::

Next, use a CEL expression to add a custom rule. Use the `map`, `string`, and `unique` CEL functions to check that no combination of `product_id` and `unit_price` appears twice within the array of `LineItems`:

::: info proto/invoice.proto

```diff
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
-    (buf.validate.field).repeated.min_items = 1
+    (buf.validate.field).repeated.min_items = 1,
+
+    (buf.validate.field).cel = {
+      id: "line_items.logically_unique"
+      message: "line items must be unique combinations of product_id and unit_price"
+      expression: "this.map( it, it.product_id + '-' + string(it.unit_price) ).unique()"
+    }
  ];
}
```

:::

You've added validation rules to your Protobuf. To enforce them, you still need to regenerate code and add a Protovalidate interceptor to your server.

::: tip Learn more about [custom rules](../../schemas/custom-rules/).

:::

### Compile Protobuf and Go

Next, compile your Protobuf and regenerate code, adding the Protovalidate options to all of your message descriptors:

```console
$ buf generate
```

If you're still running the server, stop it with `Ctrl-c`. Compile the new generated code and restart:

```console
$ go run cmd/server.go
```

After a few seconds, you should see that it has started:

```console
2025/02/05 06:51:44 INFO starting invoice service address=:50051
```

In a second terminal window, use `buf curl` to send the same invalid `CreateInvoiceRequest`:

```console
$ buf curl \
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

The RPC is still successful because gRPC hasn't been told to validate inbound requests.

::: tip NoteNo Connect or gRPC implementations automatically enforce Protovalidate rules. To enforce your validation rules, you'll need to add an interceptor.

:::

### Add a Protovalidate interceptor

Thanks to the gRPC Ecosystem project's prebuilt [Protovalidate interceptor](https://github.com/grpc-ecosystem/go-grpc-middleware), adding a Protovalidate interceptor for gRPC and Go is just a few lines of code.Follow these steps to begin enforcing Protovalidate rules:

1.  In your first console window, use `Ctrl-c` to stop your server.
2.  Install the interceptor.

    ```console
    $ go get github.com/grpc-ecosystem/go-grpc-middleware/v2/interceptors/protovalidate
    ```

3.  Import `protovalidate_middleware` in `cmd/server.go`.

    ::: info cmd/server.go

    ```diff
    import (
        "context"
        "errors"
        "fmt"
        "github.com/bufbuild/protovalidate-go"
    +   protovalidate_middleware "github.com/grpc-ecosystem/go-grpc-middleware/v2/interceptors/protovalidate"
        "log/slog"
        "net"
        "os"
        "os/signal"

        invoicev1 "github.com/bufbuild/buf-examples/protovalidate/grpc-go/finish/gen/invoice/v1"
        invoice "github.com/bufbuild/buf-examples/protovalidate/grpc-go/finish/internal"
        "golang.org/x/sync/errgroup"
        "google.golang.org/grpc"
        "google.golang.org/grpc/reflection"
    )
    ```

    :::

4.  Add the interceptor when creating a gRPC `Server`:

    ::: info cmd/server.go

    ```diff
    func run(ctx context.Context) error {
    +   validator, err := protovalidate.New()
    +   if err != nil {
    +       return errors.New("failed to create protovalidate validator")
    +   }
    +
    -   grpcServer := grpc.NewServer()
    +   grpcServer := grpc.NewServer(
    +       grpc.UnaryInterceptor(protovalidate_middleware.UnaryServerInterceptor(validator)),
    +   )
        reflection.Register(grpcServer)

        invoicev1.RegisterInvoiceServiceServer(grpcServer, invoice.NewService())
        // Code omitted for brevity
    }
    ```

    :::

5.  Stop (`Ctrl-c`) and restart your server:

    ```console
    $ go run cmd/server.go
    ```

    After a few seconds, you should see that it has started:

    ```console
    2025/02/03 15:30:15 INFO starting invoice server addr=localhost:8080
    ```

Now that you've added the Protovalidate interceptor and restarted your server, try the `buf curl` command again:

```console
$ buf curl \
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
      "fieldPath": "invoice.invoice_id",
      "constraintId": "string.uuid_empty",
      "message": "value is empty, which is not a valid UUID"
    },
    {
      "fieldPath": "invoice.line_items",
      "constraintId": "repeated.min_items",
      "message": "value must contain at least 1 item(s)"
    }
  ]
}
```

:::

Examining the beginning of the response shows that the interceptor also sends the correct gRPC status code and a plain-text error message:

```console
ERROR:
  Code: InvalidArgument
  Message: validation error:
 - invoice: invoice_id and account_id should not be the same [invoice_id.not.account_id]
 - invoice.invoice_id: value is empty, which is not a valid UUID [string.uuid_empty]
 - invoice.account_id: value is empty, which is not a valid UUID [string.uuid_empty]
 - invoice.invoice_date: value is required [required]
 - invoice.line_items: value must contain at least 1 item(s) [repeated.min_items]
```

Last, use `buf curl` to test the custom rule that checks for logically unique `LineItems`:

```console
$ buf curl \
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
      "fieldPath": "invoice.line_items",
      "constraintId": "line_items.logically_unique",
      "message": "line items must be unique combinations of product_id and unit_price"
    }
  ]
}
```

:::

You've now added Protovalidate to a gRPC in Go, but `buf curl` isn't a great way to make sure you're meeting all of your requirements. Next, you'll see one way to verify Protovalidate rules in tests.

## Test Protovalidate errors

The starting code for this tutorial contains a table test in `internal/invoice/invoice_test.go`. It starts a server with a Protovalidate interceptor and iterates through a series of test cases.In the prior section, you saw that the `violations` list returned by Protovalidate follows a predictable structure. Each violation in the list is a Protobuf message named `Violation`, [defined within Protovalidate itself](../../../reference/protovalidate/violations/).The test already provides a convenient way to declare expected violations through a `violationSpec` type:

::: info violationSpec in internal/invoice/invoice_test.go

```go
// violationSpec is a simple representation of fields tested when inspecting
// a connect.Error that we expect to contain Protovalidate validate.Violations
// messages.
type violationSpec struct {
    constraintID string
    fieldPath    string
    message      string
}
```

:::

Examine the highlighted lines in `invoice_test.go`, noting that the tests check for specific expected violations:

::: info internal/invoice/invoice_test.go

```go
func TestCreateInvoice(t *testing.T) {
    // Code omitted for brevity...

    testCases := map[string]struct {
        producer          func(invoice *invoicev1.Invoice) *invoicev1.Invoice
        violations []violationSpec
    }{
        "An invoice can be created": {
            producer: func(invoice *invoicev1.Invoice) *invoicev1.Invoice {
                return invoice
            },
        },
        "InvoiceId is required": { // [!code highlight]
            producer: func(invoice *invoicev1.Invoice) *invoicev1.Invoice { // [!code highlight]
                invoice.InvoiceId = "" // [!code highlight]
                return invoice // [!code highlight]
            }, // [!code highlight]
            violations: []violationSpec{ // [!code highlight]
                { // [!code highlight]
                    constraintID: "string.uuid_empty", // [!code highlight]
                    fieldPath:    "invoice.invoice_id", // [!code highlight]
                    message:      "value is empty, which is not a valid UUID", // [!code highlight]
                }, // [!code highlight]
            }, // [!code highlight]
        }, // [!code highlight]
        "Two line items cannot have the same product_id and unit price": { // [!code highlight]
            producer: func(invoice *invoicev1.Invoice) *invoicev1.Invoice { // [!code highlight]
                invoice.GetLineItems()[0].ProductId = invoice.GetLineItems()[1].GetProductId() // [!code highlight]
                invoice.GetLineItems()[0].UnitPrice = invoice.GetLineItems()[1].GetUnitPrice() // [!code highlight]
                return invoice // [!code highlight]
            }, // [!code highlight]
            violations: []violationSpec{ // [!code highlight]
                { // [!code highlight]
                    constraintID: "line_items.logically_unique", // [!code highlight]
                    fieldPath:    "invoice.line_items", // [!code highlight]
                    message:      "line items must be unique combinations of product_id and unit_price", // [!code highlight]
                }, // [!code highlight]
            }, // [!code highlight]
        }, // [!code highlight]
    }
    // Code omitted for brevity
}
```

:::

To check your work, run all tests with the `-v` flag.

```console
$  go test -v ./...
```

If all tests pass, you've met your goal:

::: info Test results

```console
--- PASS: TestCreateInvoice (0.00s)
    --- PASS: TestCreateInvoice/InvoiceId_is_required (0.01s)
    --- PASS: TestCreateInvoice/InvoiceId_must_be_a_UUID (0.00s)
    --- PASS: TestCreateInvoice/Two_line_items_cannot_have_the_same_identifier (0.01s)
PASS
ok      github.com/bufbuild/buf-examples/protovalidate/grpc-go/finish/internal  0.479s
```

:::

::: tip More testing examplesThe `finish` directory contains a thorough test that you can use as an example for your own tests. Its `invoice.proto` file also contains extensive Protovalidate rules.

:::

## Wrapping up

In this tutorial, you've learned the basics of working with Protovalidate:

1.  Adding Protovalidate to your project.
2.  Declaring validation rules in your Protobuf files.
3.  Enabing their enforcement within an RPC API.
4.  Testing their functionality.

## Further reading

- Integrate [Protovalidate validation within Kafka brokers](../bufstream/)
- Add Protovalidate's [standard rules](../../schemas/standard-rules/) to schemas
- Use CEL expressions to declare field and message-level [custom rules](../../schemas/custom-rules/)
- Reuse logic with [predefined rules](../../schemas/predefined-rules/)
- Learn more about [Protovalidate's relationship with CEL](../../cel/).
