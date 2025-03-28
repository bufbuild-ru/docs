# Buf CLI quickstart

The Buf CLI is the ultimate tool for modern, fast, and efficient Protobuf API management. With features like formatting, linting, breaking change detection, and code generation, Buf offers a comprehensive solution for Protobuf development and maintenance. Buf integrates seamlessly with your existing workflow, so you can focus on what matters most: writing great APIs. Whether you are working with a small, focused project or a massive, complex system, Buf is the perfect choice. In the next 10 minutes, you'll learn how to use the Buf CLI to easily build, lint, format and generate code for your project.

## Prerequisites

- [Install the Buf CLI](../installation/) if you haven't already. You need version 1.32.0 or higher to do the tour, so if you previously installed the Buf CLI, check the version and update if necessary:

  ```console
  $ buf --version
  ```

- Have [`git`](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [`go`](https://go.dev/dl/) installed and in your `$PATH`.
- Clone the `buf-tour` repo:

  ```console
  $ git clone git@github.com:bufbuild/buf-tour.git
  ```

The repository contains a `start` directory and a `finish` directory. During this quickstart you'll work on files in the `start/getting-started-with-buf-cli` directory, and at the end they should match the files in the `finish/getting-started-with-buf-cli` directory.

## Configure and build

Start by configuring the Buf CLI and building the `.proto` files that define the pet store API, which specifies a way to create, get, and delete pets in the store.

```console
$ cd buf-tour/start/getting-started-with-buf-cli
```

### Configure the workspace

You configure a Buf CLI workspace with a [`buf.yaml`](../../configuration/v2/buf-yaml/) file, which defines the list of Protobuf file directories that you want to treat as logical units, or [modules](../../concepts/modules-workspaces/). Create the file with this command:

::: info ~/.../buf-tour/start/getting-started-with-buf-cli

```console
$ buf config init
```

:::

After you run the command, there's a `buf.yaml` in the workspace directory with the following content:

::: info Default buf.yaml

```yaml
version: v2
lint:
  use:
    - STANDARD
breaking:
  use:
    - FILE
```

:::

The `buf.yaml` file sits at the root of your workspace, and the workspace it defines is the default [input](../../reference/inputs/) for all Buf operations.

### Update directory path and build module

The generated buf.yaml file behaves like a workspace with one module with its path set to the current directory. To explicitly define the modules within your workspace, provide the paths to the directories containing your `.proto` files. Add the `proto` directory to the `buf.yaml` file using the `modules` key:

::: info Update path to proto subdirectory

```diff
version: v2
+modules:
+  - path: proto
lint:
  use:
    - STANDARD
breaking:
  use:
    - FILE
```

:::

Before you continue, verify that everything is set up properly and the module builds. If there are no errors, you know that you've set up the Buf module correctly:

::: info ~/.../buf-tour/start/getting-started-with-buf-cli/

```console
$ buf build
$ echo $?
0
```

:::

## Generate code

The Buf CLI provides a user-friendly experience for generating code locally that's compatible with any reasonable existing usage of `protoc`, so next you'll generate some code.

### Configure a `buf.gen.yaml` file

Now that you've configured the module, the next step is creating a [`buf.gen.yaml`](../../configuration/v2/buf-gen-yaml/) file to configure local code generation. It controls how the `buf generate` command executes `protoc` plugins on a given module. You can use it to configure where each `protoc` plugin writes its results and specify options for each plugin.Create a `buf.gen.yaml` file in the current directory:

::: info ~/.../buf-tour/start/getting-started-with-buf-cli

```console
$ touch buf.gen.yaml
```

:::

Update the contents of your `buf.gen.yaml` to generate code using the Go and Connect-Go plugins:

::: info buf.gen.yaml

```yaml
version: v2
managed:
  enabled: true
  override:
    - file_option: go_package_prefix
      value: github.com/bufbuild/buf-tour/gen
plugins:
  - remote: buf.build/protocolbuffers/go
    out: gen
    opt: paths=source_relative
  - remote: buf.build/connectrpc/go
    out: gen
    opt: paths=source_relative
inputs:
  - directory: proto
```

:::

Given this config, the Buf CLI does two things:

- It executes the [`protocolbuffers/go`](https://buf.build/protocolbuffers/go) plugin to generate Go-specific code for your `.proto` files and places its output in the `gen` directory.
- It executes the [`connectrpc/go`](https://buf.build/connectrpc/go) plugin to generate client and server stubs for Connect-Go into the `gen` directory.

There are a few things to note in this configuration:

- **Managed mode:** [Managed mode](../../generate/managed-mode/) is a configuration option that tells the Buf CLI to set all the [file options](https://protobuf.dev/programming-guides/proto3/#options) in your workspace according to an opinionated set of values suitable for each of the supported Protobuf languages. The file options have long been a source of confusion and frustration for Protobuf users, so managed mode sets them on the fly per the configuration, allowing you to remove them from your `.proto` files.
- **Remote plugins:** The plugins specified here are [remote plugins](../../bsr/remote-plugins/overview/) hosted on the [Buf Schema Registry](https://buf.build/plugins). Using them removes the need to download, maintain, or run plugins on your local machine.
- **Inputs:** The `buf generate` command can accept many types of input, such as Buf modules, GitHub repositories, and tarball/zip archives. The example code points to the `proto` subdirectory in the workspace.

### Generate Go and Connect RPC stubs

Now that you have a `buf.gen.yaml` file configured, you can generate the Connect RPC and Go code associated with the `PetStoreService` API. Run this command:

::: info ~/.../buf-tour/start/getting-started-with-buf-cli

```console
$ buf generate
```

:::

If successful, you'll notice a few new files in the `gen` directory—they're your generated code stubs:

```text
getting-started-with-buf-cli
├── buf.gen.yaml
├── buf.yaml
├── gen
│   ├── google
│   │   └── type
│   │       └── datetime.pb.go
│   └── pet
│       └── v1
│           ├── pet.pb.go
│           └── petv1connect
│               └── pet.connect.go
└── proto
    ├── google
    │   └── type
    │       └── datetime.proto
    └── pet
        └── v1
            └── pet.proto
```

That's how easy it is to generate code using the Buf CLI. There's no need to build up a set of complicated `protoc` commands—your entire configuration is contained within the `buf.gen.yaml` file.

## Lint your API

Though the Buf CLI is a great drop-in replacement for `protoc`, it's far more than a just a Protobuf compiler. It also provides linting functionality through the [`buf lint`](../../lint/overview/) command. When you run `buf lint`, it checks all of the modules listed in the `buf.yaml` file against the specified set of lint rules.Run this command to check all `.proto` files in the quickstart workspace for lint errors:

::: info ~/.../buf-tour/start/getting-started-with-buf-cli

```console
$ buf lint

proto/google/type/datetime.proto:17:1:Package name "google.type" should be suffixed with a correctly formed version, such as "google.type.v1".
proto/pet/v1/pet.proto:42:10:Field name "petID" should be lower_snake_case, such as "pet_id".
proto/pet/v1/pet.proto:47:9:Service name "PetStore" should be suffixed with "Service".
```

:::

The current pet store API has a few lint failures across both of its files. These failures break rules in the [`STANDARD`](../../lint/rules/#standard) category that's configured in the `buf.yaml` file.

### Fix lint failures

Start by fixing the lint failures for the `pet/v1/pet.proto` file, which stem from the [`FIELD_LOWER_SNAKE_CASE`](../../lint/rules/#field_lower_snake_case) and [`SERVICE_SUFFIX`](../../lint/rules/#service_suffix) rules. The results indicate exactly what you need to change to fix the errors, so update the `pet.proto` file:

::: info ~/.../buf-tour/start/getting-started-with-buf-cli/proto/pet/v1/pet.proto

```diff
syntax = "proto3";

package pet.v1;

...

message DeletePetRequest {
-  string petID = 1;
+  string pet_id = 1;
}

message DeletePetResponse {}

-service PetStore {
+service PetStoreService {
  rpc GetPet(GetPetRequest) returns (GetPetResponse) {}
  rpc PutPet(PutPetRequest) returns (PutPetResponse) {}
  rpc DeletePet(DeletePetRequest) returns (DeletePetResponse) {}
}
```

:::

Run `buf lint` again to verify that two of the failures are resolved:

::: info ~/.../buf-tour/start/getting-started-with-buf-cli

```console
$ buf lint

google/type/datetime.proto:17:1:Package name "google.type" should be suffixed with a correctly formed version, such as "google.type.v1".
```

:::

Because you changed the name of the `petID` field and the service, you need to regenerate the code stubs:

::: info ~/.../buf-tour/start/getting-started-with-buf-cli

```console
$ buf generate
```

:::

### Ignore lint failures

The `google/type/datetime.proto` isn't actually a file in your local project. Instead, it's one of your dependencies, provided by [googleapis](https://buf.build/googleapis/googleapis), so you can't change its `package` declaration to fix the lint failure. Instead, you can tell the Buf CLI to ignore the `google/type/datetime.proto` file with this configuration change:

::: info ~/.../buf-tour/start/getting-started-with-buf-cli/buf.yaml

```diff
version: v2
modules:
  - path: proto
lint:
  use:
    - STANDARD
+  ignore:
+    - proto/google/type/datetime.proto
breaking:
  use:
    - FILE
```

:::

Run `buf lint` one final time and there should be no more errors.For more info on lint rules and configuration, check out the [lint documentation](../../lint/overview/).

## Detect breaking changes

The Buf CLI also enables you to detect breaking changes between different versions of your API. The `buf breaking` command checks all of the modules listed in the `buf.yaml` file against the specified set of [breaking rules](../../breaking/rules/) in comparison to a past version of your Protobuf schema. The rules are selectable and are split up into [logical categories](../../breaking/rules/#categories) depending on the type of breaking changes you care about:

- `FILE`: Detects changes that move generated code between files, breaking generated source code on a per-file basis.
- `PACKAGE`: Detects changes that break generated source code changes on a per-package basis. It detects changes that would break the generated stubs, but only accounting for package-level changes.
- `WIRE_JSON`: Detects changes that break wire (binary) or JSON encoding. Because JSON is ubiquitous, we recommend this as the minimum level.
- `WIRE`: Detects changes that break wire (binary) encoding.

The default value is `FILE`, which we recommend to guarantee maximum compatibility across consumers of your APIs. We suggest choosing only one of these options rather than including/excluding specific breaking change rules, as you would when specifying a [linting](../../lint/overview/) configuration. Your `buf.yaml` file currently has the `FILE` option configured:

::: info buf.yaml

```yaml
version: v2
modules:
  - path: proto
lint:
  use:
    - STANDARD
  ignore:
    - proto/google/type/datetime.proto
breaking: // [!code highlight]
  use: // [!code highlight]
    - FILE // [!code highlight]
```

:::

### Break your API

To see the feature in action, you'll need to introduce a breaking change. First, make a change that's breaking at the `WIRE` level. This is the most fundamental type of breaking change, as it changes how the Protobuf messages are encoded in transit ("on the wire"). This type of breaking change affects _all users in all languages_.Change the type of the `Pet.pet_type` field from `PetType` to `string`:

::: info ~/.../buf-tour/start/getting-started-with-buf-cli/proto/pet/v1/pet.proto

```diff
message Pet {
- PetType pet_type = 1;
+ string pet_type = 1;
  string pet_id = 2;
  string name = 3;
}
```

:::

### Run `buf breaking`

Now, verify that this is a breaking change by running `buf breaking` on your workspace, by choosing an [input](../../reference/inputs/) to compare it against. In this example, you'll compare against your local `main` Git branch:

::: info ~/.../buf-tour/start/getting-started-with-buf-cli

```console
# Compare against the 'proto' subdirectory in the Git repo because 'proto' is defined as the module in buf.yaml
$ buf breaking --against "../../.git#subdir=start/getting-started-with-buf-cli/proto"

proto/pet/v1/pet.proto:1:1:Previously present service "PetStore" was deleted from file.
proto/pet/v1/pet.proto:18:3:Field "1" on message "Pet" changed type from "enum" to "string".
proto/pet/v1/pet.proto:42:3:Field "1" with name "pet_id" on message "DeletePetRequest" changed option "json_name" from "petID" to "petId".
proto/pet/v1/pet.proto:42:10:Field "1" on message "DeletePetRequest" changed name from "petID" to "pet_id".
```

:::

### Revert changes

Once you've determined that your change is breaking, revert it:

::: info ~/.../buf-tour/start/getting-started-with-buf-cli/proto/pet/v1/pet.proto

```diff
message Pet {
- string pet_type = 1;
+ PetType pet_type = 1;
  string pet_id = 2;
  string name = 3;
}
```

:::

The other changes you made to fix lint errors are also breaking changes and would normally need to be addressed. However, for the purpose of this tutorial, assume they're approved and leave them in place.

## Implement an API

In this section, you'll implement a `PetStoreService` client and server, both of which you can run on the command line.

### Initialize a `go.mod` file

Before you write Go code, initialize a `go.mod` file with the `go mod init` command:

::: info ~/.../buf-tour/start/getting-started-with-buf-cli

```console
$ go mod init github.com/bufbuild/buf-tour
```

:::

Similar to the `buf.yaml` file, the `go.mod` file tracks your code's Go dependencies.

### Implement the server

Start implementing a server by creating a `server/main.go` file:

::: info ~/.../buf-tour/start/getting-started-with-buf-cli

```console
$ mkdir server
$ touch server/main.go
```

:::

Copy and paste this content into that file:

::: info server/main.go

```go
package main

import (
    "context"
    "fmt"
    "log"
    "net/http"

    connect "connectrpc.com/connect"
    petv1 "github.com/bufbuild/buf-tour/gen/pet/v1"
    "github.com/bufbuild/buf-tour/gen/pet/v1/petv1connect"
    "golang.org/x/net/http2"
    "golang.org/x/net/http2/h2c"
)

const address = "localhost:8080"

func main() {
    mux := http.NewServeMux()
    path, handler := petv1connect.NewPetStoreServiceHandler(&petStoreServiceServer{})
    mux.Handle(path, handler)
    fmt.Println("... Listening on", address)
    http.ListenAndServe(
        address,
        // Use h2c so we can serve HTTP/2 without TLS.
        h2c.NewHandler(mux, &http2.Server{}),
    )
}

// petStoreServiceServer implements the PetStoreService API.
type petStoreServiceServer struct {
    petv1connect.UnimplementedPetStoreServiceHandler
}

// PutPet adds the pet associated with the given request into the PetStore.
func (s *petStoreServiceServer) PutPet(
    ctx context.Context,
    req *connect.Request[petv1.PutPetRequest],
) (*connect.Response[petv1.PutPetResponse], error) {
    name := req.Msg.GetName()
    petType := req.Msg.GetPetType()
    log.Printf("Got a request to create a %v named %s", petType, name)
    return connect.NewResponse(&petv1.PutPetResponse{}), nil
}
```

:::

### Resolve Go dependencies

Now that you have code for a server, run this command to resolve the dependencies you need to build the code:

::: info ~/.../buf-tour/start/getting-started-with-buf-cli

```console
$ go mod tidy
```

:::

### Call the API

With the `server/main.go` implementation shown above, run the server and call the `PutPet` endpoint from the buf CLI.First, run the server:

::: info ~/.../buf-tour/start/getting-started-with-buf-cli

```console
$ go run server/main.go

...
Listening on 127.0.0.1:8080
```

:::

In a separate terminal, in the workspace root, add a pet to the store by calling the API with `buf curl`:

::: info ~/.../buf-tour/start/getting-started-with-buf-cli

```console
$ buf curl \
  --schema . \
  --data '{"pet_type": "PET_TYPE_SNAKE", "name": "Ekans"}' \
  http://localhost:8080/pet.v1.PetStoreService/PutPet

{}
```

:::

Go back to the server terminal window, and the request has been received:

```console
2024/04/23 14:23:35 Got a request to create a PET_TYPE_SNAKE named Ekans
```

The Buf CLI is a powerful tool that streamlines the workflow for protocol buffer development. It provides a simple way to manage your `.proto` files, perform linting and breaking change detection, and generate code as a drop-in replacement for `protoc`. To see how you can more effectively work with Protobuf schemas in larger organizations, do the [Buf Schema Registry quicks](../../bsr/quickstart/) next.

## Related docs

- Learn about [modules and workspaces](../../concepts/modules-workspaces/) in more detail.
- Read the [`buf.yaml`](../../configuration/v2/buf-yaml/) and [`buf.gen.yaml`](../../configuration/v2/buf-gen-yaml/) configuration file reference pages.
