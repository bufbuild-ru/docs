# Buf Schema Registry quickstart

The Buf Schema Registry (BSR) is the missing package manager for Protobuf, allowing you to manage schemas, dependencies, and governance at scale. In this quickstart, you'll learn to:

1.  Add a dependency to your Protobuf modules, using others' schemas without vendoring locally.
2.  Share documented Protobuf modules through the registry, so others can integrate your schemas.
3.  Integrate client SDKs for your APIs using generated SDKs, the same way other teams would.

## Prerequisites

- Install the [Buf CLI](../../cli/installation/). If you already have, run `buf --version` to verify that you're using at least `1.32.0`.
- Have [`git`](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [`go`](https://go.dev/dl/) installed and in your `$PATH`.
- [Create a Buf account](https://buf.build/signup?original_uri=/signup/), allowing you to access and share modules.
- Click here -> USERNAME and set it to your BSR username to update the code examples.
- Clone the [`buf-quickstart`](https://github.com/bufbuild/buf-quickstart) repo and go to the example code directory:

  ```console
  $ git clone git@github.com:bufbuild/buf-quickstart.git && \
      cd buf-quickstart/bsr/start/server
  ```

The quickstart contains a `start` directory, where you work on the example files, and a `finish` directory that you can use to compare against.

## Add a dependency

The quickstart's `InvoiceService` has a critical bug—it allows clients to create empty invoices. To fix the bug, you decide to use [Protovalidate](https://github.com/bufbuild/protovalidate) to validate invoice requests. It's available in the BSR, so you can add it as a dependency.

### Update buf.yaml

The `buf.yaml` file in the `server` folder configures your module and local workspace, so add the dependency there:

::: info bsr/start/server/buf.yaml

```diff
version: v2
modules:
  - path: proto
+deps:
+  - buf.build/bufbuild/protovalidate
lint:
  use:
    - STANDARD
breaking:
  use:
    - FILE
```

:::

Update the workspace to install the new dependency and pin its version in `buf.lock` (don't worry about the warning for now):

::: info bsr/start/server/

```console
$ buf dep update
WARN    Module buf.build/bufbuild/protovalidate is declared in your buf.yaml deps but is unused.
```

:::

### Add a validation rule

With Protovalidate in place, you can import it and add a rule to your schema to validate the invoices:

::: info bsr/start/server/proto/invoice/v1/invoice.proto

```diff
syntax = "proto3";

package invoice.v1;

+import "buf/validate/validate.proto";
import "tag/v1/tag.proto";

// Invoice is a collection of goods or services sold to a customer.
message Invoice {
  string invoice_id = 1;
  string customer_id = 2;
- repeated LineItem line_items = 3;
+ repeated LineItem line_items = 3 [(buf.validate.field).repeated.min_items = 1];
}

// Code omitted for brevity
}
```

:::

The Protovalidate rule checks that the invoice includes at least one line item, and raises an error if it doesn't. You can learn more about the rule in the [Protovalidate module documentation](https://buf.build/bufbuild/protovalidate/docs/main:buf.validate#buf.validate.RepeatedRules).

### Generate code

Before you publish your fix, you should generate code from your Protobuf files and test it out.You define the code generation configuration in the `buf.gen.yaml` config file by specifying inputs, the plugins you want to generate with, and output location and options.Generating Go code requires setting a `go_package` or `go_package_prefix` option. When you use dependencies, you may encounter Go compiler errors because the package option is also applied to the dependency:

::: info Incorrect Protovalidate import

```go
import (
    _ "github.com/bufbuild/buf-quickstart/bsr/server/gen/buf/validate" // [!code highlight]
)
```

:::

To fix this, disable the `go_package` file option for the dependency in the [managed mode](../../generate/managed-mode/) section of `buf.gen.yaml`:

::: info bsr/start/server/buf.gen.yaml

```diff
// Code omitted for brevity

managed:
  enabled: true
  override:
    - file_option: go_package_prefix
      value: github.com/bufbuild/buf-quickstart/server/gen
+ disable:
+   - file_option: go_package
+     module: buf.build/bufbuild/protovalidate
```

:::

You're all set—time to generate code for your Protobuf changes:

::: info bsr/start/server/

```console
$ buf generate
```

:::

A new `gen` directory appears, which contains your generated code.Next, validate your code. Start the server (which imports the code stubs you just generated):

::: info bsr/start/server/

```console
$ go run cmd/main.go
... Listening on localhost:8080
```

:::

::: tip NoteThe server code in `cmd/main.go` is [preconfigured](https://github.com/bufbuild/buf-quickstart/blob/main/buf-schema-registry/bsr/start/server/cmd/main.go#L30-L34) with the Protovalidate interceptor. Normally you need to add that to your code also—see the [Protovalidate documentation](https://github.com/bufbuild/protovalidate) for specifics.

:::

Then, open a new terminal, stay in the `server` directory and try a bad request:

::: info bsr/start/server/

```console
$ buf curl \
    --data '{ "invoice": { "customer_id": "fake-customer-id" }}' \
    --schema . \
    --http2-prior-knowledge \
    http://localhost:8080/invoice.v1.InvoiceService/CreateInvoice
{
   "code": "invalid_argument",
   "message": "validation error:\n - invoice.line_items: value must contain at least 1 item(s) [repeated.min_items]",
   "details":
   // Response omitted for brevity
}
```

:::

Your fix worked! The bad request returned a validation error. Now try a good request:

::: info bsr/start/server/

```console
$ buf curl \
    --data '{ "invoice": { "customer_id": "bob", "line_items": [{"unit_price": "999", "quantity": "2"}] }, "tags": { "tag": ["spring-promo","valued-customer"] } }' \
    --schema . \
    --http2-prior-knowledge \
    http://localhost:8080/invoice.v1.InvoiceService/CreateInvoice
{}
```

:::

Go back to the terminal where the server is running—you should see the output from the request:

::: info bsr/start/server/

```console
2025/03/04 17:21:59 Creating invoice for customer bob for 1998
2025/03/04 17:21:59   - spring-promo
2025/03/04 17:21:59   - valued-customer
```

:::

Stop the server with `Ctrl-c`.Your `CreateInvoiceRequest` accepts an array of tags that your company's business analysts use to categorize invoices. It returns the tag values when a valid invoice is created.Seeing that the tags may have use for other teams, you decide to split them out into a separate API so that they can be used without requiring the invoice API.

## Publish a module

To share just the tags functionality, you need to move the `tag.proto` file into a new module.

::: tip NoteThe BSR doesn't dictate any particular strategies with regard to monorepo, multi-repo, or "many repos with a 'common' repo." The use of the `common` BSR repo here is for illustrative purposes, and you should conform to your organization's norms instead.

:::

### Create a BSR repository

Before you can move the `tags.proto` file, you need to create a new BSR repository for it.Sign in to the BSR:

```console
$ buf registry login
```

You'll be asked to create a token, and the BSR then logs you in with it. Next, create an empty repository in the BSR:

```console
$ buf registry module create buf.build/USERNAME/common --visibility public
Created buf.build/USERNAME/common.
```

Create a new directory for your `common` module at the same level as `server`. The `/start` directory should now contain `/client`, `/server`, and `/common`.

::: info bsr/start/server/

```console
$ cd ..
$ mkdir common && cd common
```

:::

### Create the module

First, initialize the module (this creates its `buf.yaml` file):

::: info bsr/start/common/

```console
$ buf config init
```

:::

Set up the module to match the repository you just created:

::: info bsr/start/common/buf.yaml

```diff
version: v2
+modules: // [!code highlight]
+  - path: proto // [!code highlight]
+    name: buf.build/USERNAME/common // [!code highlight]
lint:
  use:
    - STANDARD
breaking:
  use:
    - FILE
```

:::

Move the `tag.proto` file to the `common/proto` module directory:

::: info bsr/start/common

```console
$ mkdir proto && mv ../server/proto/tag/ ./proto
```

:::

Test the module by building it (you should receive no output):

::: info bsr/start/common

```console
$ buf build
```

:::

Push the module to the BSR (you should receive a commit ID):

::: info bsr/start/common

```console
$ buf push
buf.build/USERNAME/common:e1fb01dc1bac43ad9b8ca03b7911834c
```

:::

### Add documentation

The BSR auto-generates schema documentation from your Protobuf files, which you can see in your repository at `https://buf.build/USERNAME/common/docs`. You'll add a basic `README` file to describe the module as well. See the [Schema documentation](../documentation/overview/) section for more information on other ways to document your schemas.Create a new `README.md` file in the `common` directory with some basic content:

::: info bsr/start/common

```console
$ echo -e "# Tags\n\nThis module allows you to add custom tags for tracking or analysis." > README.md
```

:::

Run `buf push` again. You can view your new documentation in the BSR by going to the web app: `https://buf.build/USERNAME/common`.Congrats—you've made a dependency that other teams can integrate into their code. Now you need to refactor your own code to use it too.

### Update the API

Go back to the `server` directory and update `buf.yaml` to depend on your new `common` module:

::: info bsr/start/server/buf.yaml

```diff
version: v2
modules:
  - path: proto
deps:
  - buf.build/bufbuild/protovalidate
+ - buf.build/USERNAME/common
lint:
  use:
    - STANDARD
breaking:
  use:
    - FILE
```

:::

Update your dependencies:

```console
$ buf dep update
```

If you look at `buf.lock` again, you see the new dependency on the `common` module, pinned to your commit (which is the latest).

::: info bsr/start/server/buf.lock

```diff
# Generated by buf. DO NOT EDIT.
version: v2
deps:
  - name: buf.build/bufbuild/protovalidate
    commit: d39267d9df8f4053bbac6b956a23169f
    digest: b5:c2542c2e9935dd9a7f12ef79f76aa5b53cf1c8312d720da54e03953f27ad952e2b439cbced06e3b4069e466bd9b64019cf9f687243ad51aa5dc2b5f364fac71e
+ - name: buf.build/USERNAME/common
+   commit: ee6cb9c90d16495f82d419d9262dbd27
+   digest: b5:ef7a05bd56d547893a8a2bceaf77860e7051b282120c4f0ed59bc974acf2f57f246e71a691eff52eb069659d6710572baeed26e9e38bb2111318422775805685
```

:::

Regenerate your code stubs, update their Go dependencies, and restart the server:

::: info bsr/start/server/

```console
$ buf generate
$ go mod tidy
$ go run cmd/main.go
```

:::

Then go back to the other terminal and retry the good request:

```console
$ buf curl \
    --data '{ "invoice": { "customer_id": "bob", "line_items": [{"unit_price": "999", "quantity": "2"}] }, "tags": { "tag": ["spring-promo","valued-customer"] } }' \
    --schema . \
    --http2-prior-knowledge \
    http://localhost:8080/invoice.v1.InvoiceService/CreateInvoice
{}
```

All's well—you've made a common module that other teams can use, and refactored your code to use it too. Next, you'll walk through how it can be integrated using generated SDKs.

## Use generated SDKs

One way Protobuf beats REST is that it relies on [generated SDKs](../generated-sdks/overview/). Instead of having to manage HTTP requests, anyone wanting to use your Protobuf API can simply download your generated SDK, import it with your URL, and immediately begin using strongly typed, idiomatic code to call your API.

### Configure SDK generation

All that's required from your end is to publish your API like any other BSR module. This example client also uses the invoice API, so to enable its generated SDKs, follow the same steps you used for the tags API.Back in the `/server` directory:

1.  Create a BSR repository for the invoice module:

    ::: info bsr/start/server/

    ```console
    $ buf registry module create buf.build/USERNAME/invoice --visibility public
    Created buf.build/USERNAME/invoice.
    ```

    :::

2.  Configure `buf.yaml` to push this module to the BSR:

    ::: info bsr/start/server/buf.yaml

    ```diff
    version: v2
    modules:
      - path: proto
    +   name: buf.build/USERNAME/invoice // [!code highlight]
    deps:
      - buf.build/bufbuild/protovalidate
      - buf.build/USERNAME/common
    lint:
      use:
        - STANDARD
    breaking:
      use:
        - FILE
    ```

    :::

3.  Push the module:

    ::: info bsr/start/server

    ```console
    $ buf push
    buf.build/USERNAME/invoice:e1fb01dc1bac43ad9b8ca03b7911834c
    ```

    :::

The BSR now automatically creates generated SDKs for each module commit. (You read that right: versioning is free and automatic.)Teams consuming your APIs can import generated SDKs using their package manager of choice, like Go Modules, `npm`, Gradle, or `pip`. In the next section, you'll create a Go client to import both modules' SDKs, the same way another team would.

### Install client SDKs

You'll be using a client Go module for this section, so switch to the `start/client` directory. To use the BSR's generated SDKs, you integrate them like any other package, so `go get` them by name:

::: info bsr/start/client/

```console
# Base Protobuf types
$ go get buf.build/gen/go/USERNAME/invoice/protocolbuffers/go
# The generated invoice SDK
$ go get buf.build/gen/go/USERNAME/invoice/connectrpc/go
# The generated tags SDK
$ go get buf.build/gen/go/USERNAME/common/protocolbuffers/go/tag/v1
```

:::

They're lazily generated, so it takes a moment or two.

### Call APIs with client SDKs

Replace the code in `client/cmd/main.go` with the following boilerplate—you can see that it imports the SDKs you just installed:

::: info bsr/start/client/cmd/main.go

```go
package main

import (
    tagv1 "buf.build/gen/go/xUSERNAMEx/common/protocolbuffers/go/tag/v1" // [!code highlight]
    "buf.build/gen/go/xUSERNAMEx/invoice/connectrpc/go/invoice/v1/invoicev1connect" // [!code highlight]
    invoicev1 "buf.build/gen/go/xUSERNAMEx/invoice/protocolbuffers/go/invoice/v1" // [!code highlight]
    "connectrpc.com/connect"
    "context"
    "log"
    "net/http"
)

func main() {
    client := invoicev1connect.NewInvoiceServiceClient(
        http.DefaultClient,
        "http://localhost:8080",
    )

    _, err := client.CreateInvoice(
        context.Background(),
        connect.NewRequest(&invoicev1.CreateInvoiceRequest{
            Invoice: &invoicev1.Invoice{
                InvoiceId:  "invoice-one",
                CustomerId: "customer-one",
                LineItems: []*invoicev1.LineItem{
                    {
                        UnitPrice: 999,
                        Quantity:  2,
                    },
                },
            },
            Tags: &tagv1.Tags{
                Tag: []string{
                    "bogo-campaign",
                    "valued-customer",
                },
            },
        }),
    )
    if err != nil {
        log.Fatalf("error creating valid invoice: %v", err)
    }
    log.Println("Valid invoice created")
}
```

:::

Make sure your server's running, then update your Go dependencies and run the client:

::: info bsr/start/client/

```console
$ go mod tidy
$ go run cmd/main.go
2025/03/20 09:58:03 Valid invoice created
```

:::

Go back to the `server` terminal, and you should see a successful request like before:

::: info bsr/start/server/

```console
2025/03/20 09:58:03 Creating invoice for customer customer-one for 1998
2025/03/20 09:58:03   - bogo-campaign
2025/03/20 09:58:03   - valued-customer
```

:::

## Wrapping up

This is a basic walkthrough, and you've learned key functions of the BSR:

1.  Depend on a BSR module (Protovalidate) in your API.
2.  Refactor part of your API into a documented BSR module you can share with your organization.
3.  Use a BSR-generated SDK to access your API.

## Related docs

To find out more about how you can build better with Buf, check out some of our other guides:

- [Buf CLI quickstart](../../cli/quickstart/)
- [Buf Schema Registry overview](../)
- [Modules and workspaces](../../concepts/modules-workspaces/) concepts guide
- [Repositories](../../concepts/repositories/) concepts guide
- [Dependency management](../module/dependency-management/) in the BSR
