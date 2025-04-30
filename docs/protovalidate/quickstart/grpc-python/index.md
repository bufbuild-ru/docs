---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/protovalidate/quickstart/grpc-python/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/protovalidate/quickstart/grpc-java/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/protovalidate/quickstart/bufstream/"
  - - meta
    - property: "og:title"
      content: "gRPC and Python - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/protovalidate/quickstart/grpc-python.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/protovalidate/quickstart/grpc-python/"
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
      content: "gRPC and Python - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/protovalidate/quickstart/grpc-python.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Protovalidate in gRPC and Python

This tutorial shows how to add Protovalidate to a Python RPC powered by [gRPC](https://grpc.io/docs/languages/python/quickstart/):

1.  Adding the Protovalidate dependency.
2.  Annotating Protobuf files and regenerating code.
3.  Adding a Connect interceptor.
4.  Testing your validation logic.

::: tip Just need an example?There's an example of Protovalidate for gRPC and Python in [GitHub](https://github.com/bufbuild/buf-examples/tree/main/protovalidate/grpc-python/finish).

:::

## Prerequisites

- Install the [Buf CLI](../../../cli/). If you already have, run `buf --version` to verify that you're using at least `1.32.0`.
- Have [`git`](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [`Python 3.7+`](https://www.python.org/downloads/) installed and in your `$PATH`.
- Clone the `buf-examples` repo and navigate to the `protovalidate/grpc-python/start` directory:

  ```console
  $ git clone git@github.com:bufbuild/buf-examples.git && cd buf-examples/protovalidate/grpc-python/start
  ```

- Create, start, and initialize a virtual environment to isolate this tutorial from any other Python environments:

  ```console
  $ python3 -m venv .venv
  $ source .venv/bin/activate
  (venv) $ pip3 install -r requirements.txt --extra-index-url https://buf.build/gen/python
  ```

## Goal

This tutorial's `CreateInvoice` RPC doesn't have any input validation. Your goal is to pass a unit test verifying that you've added two validation rules using Protovalidate:

1.  Requests must provide an `Invoice` with a UUID `invoice_id`.
2.  Within the `Invoice` message, all of its `repeated LineItem line_items` must have unique combinations of `product_id` and `unit_price`.

Run the test now, and you can see that it fails:

```console
$ python3 -m unittest -v invoice_server_test.py
test_a_valid_invoice_can_be_created (invoice_server_test.InvoiceServerTest.test_a_valid_invoice_can_be_created) ... ok
test_invoice_id_must_be_a_uuid (invoice_server_test.InvoiceServerTest.test_invoice_id_must_be_a_uuid) ... FAIL
test_two_line_items_cannot_have_the_same_product_id_and_unit_price (invoice_server_test.InvoiceServerTest.test_two_line_items_cannot_have_the_same_product_id_and_unit_price) ... FAIL
```

When this test passes, you've met your goal.

## Run the server

Before you begin to code, verify that the example is working. Run the server with the following command:

```console
(.venv) $ python invoice_server.py
```

After a few seconds, you should see that it has started:

```console
2025-02-12 10:48:24,885 - __main__ - INFO - Invoice server started on port 50051
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

This tutorial uses the example in `grpc-python/start`.

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

### Python

You'll be working in `invoice_server.py`. It's an executable that runs a server on port 50051. You'll edit it to add a Protovalidate interceptor to gRPC.

::: tip Where's the service itself?`invoice/v1/invoice_service.py` provides `InvoiceService`, an subclass of the generated `invoice_service_pb2_grpc.InvoiceServiceServicer`. Its `CreateInvoice` function sends back a static response.

:::

Now that you know your way around the example code, it's time to integrate Protovalidate.

## Integrate Protovalidate

It's time to add Protovalidate to your project. It may be useful to read the Protovalidate [overview](../../) and its [quickstart](../) before continuing.

### Add Protovalidate dependency

Because Protovalidate is a publicly available [Buf Schema Registry (BSR)](../../../bsr/) module, it's simple to add it to any Buf CLI project.

1.  In your virtual environment console, add Protovalidate to your Python project. In your own projects, you'd need to add the [protocolbuffers/pyi](https://buf.build/bufbuild/protovalidate/sdks/v0.10.7:protocolbuffers/pyi) and [protocolbuffers/python](https://buf.build/bufbuild/protovalidate/sdks/v0.10.7:protocolbuffers/python) generated SDKs for Protovalidate.

    ```console
    (.venv) $ pip3 install protovalidate
    ```

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
      - buf.build/bufbuild/protovalidate:v0.10.7
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

4.  Verify that configuration is complete by running `buf generate`. It should complete with no error.

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

### Compile Protobuf and Python

Next, compile your Protobuf and regenerate code, adding the Protovalidate options to all of your message descriptors:

```console
$ buf generate
```

With regenerated code, your server should still compile and build. (If you're still running the server, stop it with `Ctrl-c`.)

```console
(.venv) $ python invoice_server.py
```

After a few seconds, you should see that it has started:

```console
2025-02-12 10:52:36,929 - __main__ - INFO - Invoice server started on port 50051
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

::: tip No Connect or gRPC implementations automatically enforce Protovalidate rules. To enforce your validation rules, you'll need to add an interceptor.

:::

### Add a Protovalidate interceptor

The `buf-examples` repository provides a sample `ValidationInterceptor` class, a gRPC `ServerInterceptor` that's ready to use with Protovalidate. It inspects requests, runs Protovalidate, and returns a gRPC `INVALID_ARGUMENT` status on failure. Validation failure responses use the same response format as the Connect RPC [Protovalidate interceptor](https://github.com/connectrpc/validate-go/).Follow these steps to begin enforcing Protovalidate rules:

1.  In your first terminal window, use `Ctrl-c` to stop your server.
2.  In `invoice_server.py`, import the interceptor:

    ::: info invoice_server.py

    ```diff
    from concurrent import futures
    from grpc_reflection.v1alpha import reflection
    from invoice.v1.invoice_service import InvoiceService
    + from validation.interceptor import ValidationInterceptor
    ```

    :::

3.  In the `serve()` function, instantiate a `ValidationInterceptor` and use it when creating `InvoiceService`'s `serviceDefinition`:

    ::: info invoice_server.py

    ```diff
    def serve():
        server = grpc.server(
            futures.ThreadPoolExecutor(max_workers=10),
    +       interceptors=(ValidationInterceptor(),),
        )
        invoice_service_pb2_grpc.add_InvoiceServiceServicer_to_server(
            InvoiceService(), server
        )
        SERVICE_NAMES = (
            invoice_service_pb2.DESCRIPTOR.services_by_name["InvoiceService"].full_name,
            reflection.SERVICE_NAME,
        )
        reflection.enable_server_reflection(SERVICE_NAMES, server)

        server.add_insecure_port("[::]:" + port)
        logger.info("Invoice server started on port " + port)
        server.start()
        server.wait_for_termination()
    ```

    :::

4.  Stop (`Ctrl-c`) and restart your server:

    ```console
    (.venv) $ python invoice_server.py
    ```

    After a few seconds, you should see that it has started:

    ```console
    2025-02-12 11:00:47,673 - __main__ - INFO - Invoice server started on port 50051
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

You've now added Protovalidate to a gRPC in Python, but `buf curl` isn't a great way to make sure you're meeting all of your requirements. Next, you'll see one way to verify Protovalidate rules in tests.

## Test Protovalidate errors

The starting code for this tutorial contains a `InvoiceServerTest` unit test in `invoice_server_test.py`. It starts a server with a Protovalidate interceptor and iterates through a series of test cases.In the prior section, you saw that the `violations` list returned by Protovalidate follows a predictable structure. Each violation in the list is a Protobuf message named `Violation`, [defined within Protovalidate itself](../../../reference/protovalidate/violations/).The test already provides a convenient way to declare expected violations through a `ViolationSpec` class:

::: info ViolationSpec in invoice_server_test.py

```python
class ViolationSpec:
    constraint_id: str
    field_path: str
    message: str
```

:::

Examine the highlighted lines in `invoice_server_test.py`, noting that the tests check for specific expected violations:

::: info invoice_server_test.py

```python{13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40}
class InvoiceServerTest(unittest.TestCase):
    // Code omitted for brevity

    def test_a_valid_invoice_can_be_created(self):
        req = invoice_service_pb2.CreateInvoiceRequest()
        req.invoice.CopyFrom(valid_invoice())
        response = self.client.CreateInvoice(req)
        assert hasattr(response, "invoice_id")
        assert response.invoice_id
        assert hasattr(response, "version")
        assert response.version == 1

    def test_invoice_id_must_be_a_uuid(self):
        invoice = valid_invoice()
        invoice.invoice_id = ""
        self.check_violations(
            invoice,
            [
                ViolationSpec(
                    "string.uuid_empty",
                    "invoice.invoice_id",
                    "value is empty, which is not a valid UUID",
                ),
            ],
        )

    def test_two_line_items_cannot_have_the_same_product_id_and_unit_price(self):
        invoice = valid_invoice()
        invoice.line_items[0].product_id = invoice.line_items[1].product_id
        invoice.line_items[0].unit_price = invoice.line_items[1].unit_price
        self.check_violations(
            invoice,
            [
                ViolationSpec(
                    "line_items.logically_unique",
                    "invoice.line_items",
                    "line items must be unique combinations of product_id and unit_price",
                ),
            ],
        )

    // Code omitted for brevity
}
```

:::

To check your work, run all tests.

```console
(.venv) $ python -m unittest -v invoice_server_test.py
```

If all tests pass, you've met your goal:

::: info Test results

```console
test_a_valid_invoice_can_be_created (invoice_server_test.InvoiceServerTest) ... ok
test_invoice_id_must_be_a_uuid (invoice_server_test.InvoiceServerTest) ... ok
test_two_line_items_cannot_have_the_same_product_id_and_unit_price (invoice_server_test.InvoiceServerTest) ... ok
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
