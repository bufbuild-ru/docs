---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/cli/buf-plugins/tutorial-create-buf-plugin/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/cli/buf-plugins/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/cli/buf-plugins/webassembly/"
  - - meta
    - property: "og:title"
      content: "Quickstart - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/cli/buf-plugins/tutorial-create-buf-plugin.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/cli/buf-plugins/tutorial-create-buf-plugin/"
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
      content: "https://buf.build/docs/assets/images/social/cli/buf-plugins/tutorial-create-buf-plugin.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Buf plugin quickstart

Buf's [lint](../../../lint/) and [breaking change](../../../breaking/) checks come with pre-defined rules and categories that cover the vast majority of customer needs. However, organizations sometimes need to enforce different or additional rules. For these cases, you can create [Buf plugins](../) that work with the Buf checkers so you can integrate your own rules and categories into your workflows.

This quickstart demonstrates how to define your own rules in a Buf plugin and how to install and use it locally.

## Prerequisites

- Install the [Buf CLI](../../installation/) or update your existing version to >=1.40
- Clone the `buf-examples` repo and go to this quickstart's directory:

  ```sh
  git clone git@github.com:bufbuild/buf-examples.git &&
      cd buf-examples/bsr/buf-check-plugin/start
  ```

This quickstart shows how to write a Buf plugin in Go, taking advantage of the [`bufplugin-go`](https://github.com/bufbuild/bufplugin-go) library, but you can write them in any language as long as the plugin conforms to the [Bufplugin framework](https://github.com/bufbuild/bufplugin).

## Inspect the workspace

The sample module contains a `buf.yaml` and a `pet.proto` with definitions related to a pet store:

```text
.
├── buf.yaml
└── proto
    └── pet
        └── v1
            └── pet.proto
```

For the sake of this quickstart, `pet.proto` includes an undesirable naming style:

::: info bsr/buf-check-plugin/startproto/pet/v1/pet.proto

```protobuf{2}
service PetStoreService {
  rpc GetPetMethod(GetPetRequest) returns (GetPetResponse) {}
}
```

:::

Notice that `GetPetMethod` is an RPC method but shouldn't end with the word `Method`, so you'll write a lint plugin that checks for this style error.

## Write a simple plugin

Run the following to scaffold the plugin:

```sh
go mod init plugin/quickstart
mkdir -p cmd/rpc-suffix
touch cmd/rpc-suffix/main.go
```

Copy and paste the following content into `cmd/rpc-suffix/main.go`:

::: info bsr/buf-check-plugin/start/cmd/rpc-suffix/main.go

```go
package main

import (
    "context"

    "buf.build/go/bufplugin/check"
    "buf.build/go/bufplugin/check/checkutil"
    "google.golang.org/protobuf/reflect/protoreflect"
)

var (
    rpcSuffixRuleSpec = &check.RuleSpec{
        ID:      "RPC_SUFFIX",
        Default: true,
        Purpose: "Checks that RPC names don't end with an illegal suffix.",
        Type:    check.RuleTypeLint,
        Handler: checkutil.NewMethodRuleHandler(checkRPCSuffix, checkutil.WithoutImports()),
    }
)

func main() {
    check.Main(&check.Spec{
        Rules: []*check.RuleSpec{
            rpcSuffixRuleSpec,
        },
    })
}

func checkRPCSuffix(
    _ context.Context,
    responseWriter check.ResponseWriter,
    _ check.Request,
    methodDescriptor protoreflect.MethodDescriptor,
) error {
    responseWriter.AddAnnotation(
        check.WithMessage("hello world"),
    )
    return nil
}
```

:::

The plugin's `main.go` file imports the [`bufplugin-go` SDK](https://github.com/bufbuild/bufplugin-go) and has three components:

- An `rpcSuffixRuleSpec` definition, which defines the lint rule with fields like its ID and purpose.
- A `main` function that calls `check.Main`, which creates a fully functional plugin function using the lint rule you just defined.
- A `checkRPCSuffix` handler function that will contain our linting logic but for now just returns "hello world" regardless of the Protobuf file's content.

To see the plugin in action, first install its binary:

```sh
go mod tidy
go install ./cmd/rpc-suffix
```

Then add the plugin and its rule ID to the `buf.yaml` config file:

```yaml
version: v2
modules:
  - path: proto
    name: buf.build/tutorials/lint
lint:
  use:
    - MINIMAL
  // [!code ++]
  - RPC_SUFFIX
// [!code ++]
plugins:
  // [!code ++]
  - plugin: rpc-suffix
```

You can now verify that the new rule is being checked when you lint:

```sh
buf lint
<input>:1:1:hello world (rpc-suffix)
```

With the dummy plugin working, you now need to add the rule logic:

```go
package main

import (
    "context"
    "strings" // [!code ++]

    "buf.build/go/bufplugin/check"
    "buf.build/go/bufplugin/check/checkutil"
    "google.golang.org/protobuf/reflect/protoreflect"
)

const forbiddenRPCSuffix = "Method"

var (
    rpcSuffixRuleSpec = &check.RuleSpec{
        ID:      "RPC_SUFFIX",
        Default: true,
        Purpose: "Checks that RPC names don't end with an illegal suffix.",
        Type:    check.RuleTypeLint,
        Handler: checkutil.NewMethodRuleHandler(checkRPCSuffix, checkutil.WithoutImports()),
    }
)

func main() {
    check.Main(&check.Spec{
        Rules: []*check.RuleSpec{
                rpcSuffixRuleSpec,
        },
    })
}

func checkRPCSuffix(
    _ context.Context,
    responseWriter check.ResponseWriter,
    _ check.Request,
    methodDescriptor protoreflect.MethodDescriptor,
) error {
    responseWriter.AddAnnotation( // [!code --]
        check.WithMessage("hello world"), // [!code --]
    ) // [!code --]
    methodName := string(methodDescriptor.Name()) // [!code ++]
    if strings.HasSuffix(methodName, forbiddenRPCSuffix) { // [!code ++]
        responseWriter.AddAnnotation( // [!code ++]
            check.WithDescriptor(methodDescriptor), // [!code ++]
            check.WithMessagef("method name should not end with %q", forbiddenRPCSuffix), // [!code ++]
        ) // [!code ++]
    } // [!code ++]
    return nil
}
```

Now the Buf linter only prints error when a method ends with the keyword `Method`. In addition, the plugin passes the `check.WithDescriptor(methodDescriptor)` option for printing, which provides location information about where the error happened. To verify this, re-install and run the plugin:

```sh
go install ./cmd/rpc-suffix
buf lint

proto/pet/v1/pet.proto:44:3:method name should not end with "Method" (rpc-suffix)
```

Now that you've implemented the rule logic, let's look at how to make a rule configurable.

## Add options to a rule

Instead of hard-coding the check against the `Method` suffix, suppose you want the user to be able to set which suffixes to check for. You can enable this by making the plugin configurable from the `buf.yaml` config file. From the user's perspective, it looks like this:

```yaml
 version: v2
 modules:
   - path: proto
     name: buf.build/tutorials/lint
 lint:
   use:
     - STANDARD
     - RPC_SUFFIX
 plugins:
   - plugin: rpc-suffix
    // [!code ++]
    options:
      // [!code ++]
      forbidden_rpc_suffixes:
        // [!code ++]
         - Method
        // [!code ++]
         - RPC
```

[Plugin options](https://github.com/bufbuild/bufplugin/blob/main/buf/plugin/option/v1/option.proto) are key-value pairs, so this configuration passes the `forbidden_rpc_suffixes` key and its values `["Method", "RPC"]` to the plugin. To enable the plugin to interpret the option, you remove the hard-coded value and add the key in its place, then check to see if the user has configured it:

```go
package main

import (
    "context"
    "strings"

    "buf.build/go/bufplugin/check"
    "buf.build/go/bufplugin/check/checkutil"
    "buf.build/go/bufplugin/option" // [!code ++]
    "google.golang.org/protobuf/reflect/protoreflect"
)

const forbiddenRPCSuffix = "Method"
const (
    defaultForbiddenRPCSuffix     = "Method" // [!code ++]
    forbiddenRPCSuffixesOptionKey = "forbidden_rpc_suffixes" // [!code ++]
)

var (
    rpcSuffixRuleSpec = &check.RuleSpec{
        ID:      "RPC_SUFFIX",
        Default: true,
        Purpose: "Checks that RPC names don't end with an illegal suffix.",
        Type:    check.RuleTypeLint,
        Handler: checkutil.NewMethodRuleHandler(checkRPCSuffix, checkutil.WithoutImports()),
    }
)

func main() {
    check.Main(&check.Spec{
        Rules: []*check.RuleSpec{
            rpcSuffixRuleSpec,
        },
    })
}

func checkRPCSuffix(
    _ context.Context,
    responseWriter check.ResponseWriter,
    _ check.Request, // [!code --]
    request check.Request, // [!code ++]
    methodDescriptor protoreflect.MethodDescriptor,
) error {
    methodName := string(methodDescriptor.Name())
    if strings.HasSuffix(methodName, forbiddenRPCSuffix) { // [!code --]
        responseWriter.AddAnnotation( // [!code --]
            check.WithDescriptor(methodDescriptor), // [!code --]
            check.WithMessagef("method name should not end with %q", forbiddenRPCSuffix), // [!code --]
        ) // [!code --]
    forbiddenRPCSuffixes, err := option.GetStringSliceValue(request.Options(), forbiddenRPCSuffixesOptionKey) // [!code ++]
    if err != nil { // [!code ++]
        return err // [!code ++]
    } // [!code ++]
    if len(forbiddenRPCSuffixes) == 0 { // [!code ++]
        forbiddenRPCSuffixes = append(forbiddenRPCSuffixes, defaultForbiddenRPCSuffix) // [!code ++]
    } // [!code ++]
    for _, forbiddenRPCSuffix := range forbiddenRPCSuffixes { // [!code ++]
        if strings.HasSuffix(methodName, forbiddenRPCSuffix) { // [!code ++]
            responseWriter.AddAnnotation( // [!code ++]
                check.WithDescriptor(methodDescriptor), // [!code ++]
                check.WithMessagef("method name should not end with %q", forbiddenRPCSuffix), // [!code ++]
            ) // [!code ++]
        } // [!code ++]
    }
    return nil
}
```

Now the plugin uses `option.GetStringSliceValue(request.Options(), forbiddenRPCSuffixesOptionKey)` to check whether the option is specified by the user, and uses its list of values if so. To verify that it uses the option values, change `pet.proto` so that it violates the additional rule:

::: info bsr/buf-check-plugin/start/proto/pet/v1/pet.proto

```protobuf
// Code omitted for brevity

service PetStoreService {
  rpc GetPetMethod(GetPetRequest) returns (GetPetResponse) {}
  rpc GetPetRPC(GetPetRequest) returns (GetPetResponse) {}
}
```

:::

Then re-install and run the plugin:

```sh
go install ./cmd/rpc-suffix
buf lint

proto/pet/v1/pet.proto:44:3:method name should not end with "RPC" (rpc-suffix)
```

## Add a breaking change rule to the same plugin

Buf plugins can support breaking change rules in addition to lint rules. Adding a breaking change rule to your plugin is almost identical to adding a lint rule, but there are three key differences:

- A breaking change checking function requires an additional descriptor prefixed with `against` because it compares the input against another set of files.
- Checking functions for breaking change rules should be passed to `checkutil.NewFieldPairRuleHandler` handler helpers instead of `checkutil.NewMethodRuleHandler`.
- The checking function's `Type` should be set to type should `check.RuleTypeBreaking`.

For example, this rule checks that a field option stays set to `True` in both versions of a file:

```go{3,4,12}
fieldOptionSafeForMLStaysTrueRuleSpec = &check.RuleSpec{
    ...
    Type:    check.RuleTypeBreaking,
    Handler: checkutil.NewFieldPairRuleHandler(checkFieldOptionSafeForMLStaysTrue, checkutil.WithoutImports()),
}

func checkFieldOptionSafeForMLStaysTrue(
    _ context.Context,
    responseWriter check.ResponseWriter,
    _ check.Request,
    fieldDescriptor protoreflect.FieldDescriptor,
    againstFieldDescriptor protoreflect.FieldDescriptor,
) error {
```

## `Default` property

Each rule can set a `Default` boolean property that controls whether the rule is called by default if no rules are specified in `buf.yaml`. For example, adding it to the preceding example ensures that the field option is always checked when the plugin is present:

```go{2}
fieldOptionSafeForMLStaysTrueRuleSpec = &check.RuleSpec{
    Default: True,
    Type:    check.RuleTypeBreaking,
    Handler: checkutil.NewFieldPairRuleHandler(checkFieldOptionSafeForMLStaysTrue, checkutil.WithoutImports()),
}
```

Now that you've built your first Buf plugin, learn how to [compile it to WebAssembly](../webassembly/) so you can upload it to the BSR.
