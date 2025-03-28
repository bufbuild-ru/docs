# Create a Buf plugin – Tutorial

Buf's [lint](../../../lint/overview/) and [breaking change](../../../breaking/overview/) checks come with pre-defined rules and categories that cover the vast majority of customer needs. However, organizations sometimes need to enforce different or additional rules. For these cases, you can create [Buf plugins](../overview/) that work with the Buf checkers so you can integrate your own rules and categories into your workflows.This tutorial demonstrates how to define your own rules in a Buf plugin and how to install and use it locally.

## Prerequisites

- Install the [Buf CLI](../../installation/) or update your existing version to >=1.40
- Clone the `buf-tour` repo:

  ```console
  $ git clone git@github.com:bufbuild/buf-tour.git
  ```

This tutorial shows how to write a Buf plugin in Go, taking advantage of the [`bufplugin-go`](https://github.com/bufbuild/bufplugin-go) library, but you can write them in any language as long as the plugin conforms to the [Bufplugin framework](https://github.com/bufbuild/bufplugin).

## Inspect the workspace

In this tutorial, we provide you with a sample Protobuf module, so start in its directory:

```console
$ cd buf-tour/start/tutorial-create-buf-plugin
```

It contains a `buf.yaml` and a `pet.proto` with definitions related to a pet store:

```text
.
├── buf.yaml
└── proto
    └── pet
        └── v1
            └── pet.proto
```

For the sake of this tutorial, `pet.proto` includes an undesirable naming style:

::: info ~/.../buf-tour/start/tutorial-create-buf-plugin/proto/pet/v1/pet.proto

```protobuf
service PetStoreService {
  rpc GetPetMethod(GetPetRequest) returns (GetPetResponse) {} // [!code highlight]
}
```

:::

Notice that `GetPetMethod` is an RPC method but shouldn't end with the word `Method`, so you'll write a lint plugin that checks for this style error.

## Write a simple plugin

Run the following to scaffold the plugin:

```console
$ go mod init plugin/tutorial
$ mkdir -p cmd/rpc-suffix
$ touch cmd/rpc-suffix/main.go
```

Copy and paste the following content into `cmd/rpc-suffix/main.go`:

::: info ~/.../buf-tour/start/tutorial-create-buf-plugin/cmd/rpc-suffix/main.go

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

The plugin's `main.go` file imports the SDK and has three components:

- An `rpcSuffixRuleSpec` definition, which defines the lint rule with fields like its ID and purpose.
- A `main` function that calls `check.Main`, which creates a fully functional plugin function using the lint rule you just defined.
- A `checkRPCSuffix` handler function that will contain our linting logic but for now just returns "hello world" regardless of the Protobuf file's content.

To see the plugin in action, first install its binary:

```console
$ go mod tidy
$ go install ./cmd/rpc-suffix
```

then add the plugin and its rule ID to the `buf.yaml` config file:

```diff
 version: v2
 modules:
   - path: proto
     name: buf.build/tutorials/breaking
 lint:
   use:
     - STANDARD
+    - RPC_SUFFIX
+ plugins:
+   - plugin: rpc-suffix
```

You can now verify that the new rule is being checked when you lint:

```console
$ buf lint
<input>:1:1:hello world (rpc-suffix)
```

With the dummy plugin working, you now need to add the rule logic:

```diff
package main

import (
    "context"
+   "strings"
+
    "buf.build/go/bufplugin/check"
    "buf.build/go/bufplugin/check/checkutil"
    "google.golang.org/protobuf/reflect/protoreflect"
)

+const forbiddenRPCSuffix = "Method"
+
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
-   responseWriter.AddAnnotation(
-       check.WithMessage("hello world"),
-   )
+   methodName := string(methodDescriptor.Name())
+   if strings.HasSuffix(methodName, forbiddenRPCSuffix) {
+       responseWriter.AddAnnotation(
+           check.WithDescriptor(methodDescriptor),
+           check.WithMessagef("method name should not end with %q", forbiddenRPCSuffix),
+       )
+   }
    return nil
}
```

Now the Buf linter only prints error when a method ends with the keyword `Method`. In addition, the plugin passes the `check.WithDescriptor(methodDescriptor)` option for printing, which provides location information about where the error happened. To verify this, re-install and run the plugin:

```console
$ go install ./cmd/rpc-suffix
$ buf lint

proto/pet/v1/pet.proto:6:3:method name should not end with "Method" (rpc-suffix)
```

Now that you've implemented the rule logic, let's look at how to make a rule configurable.

## Add options to a rule

Instead of hard-coding the check against the `Method` suffix, suppose you want the user to be able to set which suffixes to check for. You can enable this by making the plugin configurable from the `buf.yaml` config file. From the user's perspective, it looks like this:

```diff
 version: v2
 modules:
   - path: proto
     name: buf.build/tutorials/lint-plugin
 lint:
   use:
     - STANDARD
     - RPC_SUFFIX
 plugins:
   - plugin: rpc-suffix
+    options:
+      forbidden_rpc_suffixes:
+        - Method
+        - RPC
```

[Plugin options](https://github.com/bufbuild/bufplugin/blob/main/buf/plugin/option/v1/option.proto) are key-value pairs, so this configuration passes the `forbidden_rpc_suffixes` key and its values `["Method", "RPC"]` to the plugin. To enable the plugin to interpret the option, you remove the hard-coded value and add the key in its place, then check to see if the user has configured it:

```diff
package main

import (
    "context"
    "strings"

    "buf.build/go/bufplugin/check"
    "buf.build/go/bufplugin/check/checkutil"
+   "buf.build/go/bufplugin/option"
    "google.golang.org/protobuf/reflect/protoreflect"
)

-const forbiddenRPCSuffix = "Method"
+const (
+   defaultForbiddenRPCSuffix     = "Method"
+   forbiddenRPCSuffixesOptionKey = "forbidden_rpc_suffixes"
+)

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
-   _ check.Request,
+   request check.Request,
    methodDescriptor protoreflect.MethodDescriptor,
) error {
    methodName := string(methodDescriptor.Name())
-   if strings.HasSuffix(methodName, forbiddenRPCSuffix) {
-       responseWriter.AddAnnotation(
-           check.WithDescriptor(methodDescriptor),
-           check.WithMessagef("method name should not end with %q", forbiddenRPCSuffix),
-       )
+   forbiddenRPCSuffixes, err := option.GetStringSliceValue(request.Options(), forbiddenRPCSuffixesOptionKey)
+   if err != nil {
+       return err
+   }
+   if len(forbiddenRPCSuffixes) == 0 {
+       forbiddenRPCSuffixes = append(forbiddenRPCSuffixes, defaultForbiddenRPCSuffix)
+   }
+   for _, forbiddenRPCSuffix := range forbiddenRPCSuffixes {
+       if strings.HasSuffix(methodName, forbiddenRPCSuffix) {
+           responseWriter.AddAnnotation(
+               check.WithDescriptor(methodDescriptor),
+               check.WithMessagef("method name should not end with %q", forbiddenRPCSuffix),
+           )
+       }
    }
    return nil
}
```

Now the plugin uses `option.GetStringSliceValue(request.Options(), forbiddenRPCSuffixesOptionKey)` to check whether the option is specified by the users and use its list of values if so. To verify that it uses the option values, re-install and run the plugin:

```console
$ go install ./cmd/rpc-suffix
$ buf lint

proto/pet/v1/pet.proto:6:3:method name should not end with "Method" (rpc-suffix)
proto/pet/v1/pet.proto:7:3:method name should not end with "RPC" (rpc-suffix)
```

## Add a breaking change rule to the same plugin

Buf plugins can support breaking change rules in addition to lint rules. Adding a breaking change rule to your plugin is almost identical to adding a lint rule, but there are three key differences:

- A breaking change checking function requires an additional descriptor prefixed with `against` because it compares the input against another set of files.
- Checking functions for breaking change rules should be passed to `checkutil.NewFieldPairRuleHandler` handler helpers instead of `checkutil.NewMethodRuleHandler`.
- The checking function's `Type` should be set to type should `check.RuleTypeBreaking`.

For example, this rule checks that a field option stays set to `True` in both versions of a file:

```go
fieldOptionSafeForMLStaysTrueRuleSpec = &check.RuleSpec{
    ...
    Type:    check.RuleTypeBreaking, // [!code highlight]
    Handler: checkutil.NewFieldPairRuleHandler(checkFieldOptionSafeForMLStaysTrue, checkutil.WithoutImports()), // [!code highlight]
}

func checkFieldOptionSafeForMLStaysTrue(
    _ context.Context,
    responseWriter check.ResponseWriter,
    _ check.Request,
    fieldDescriptor protoreflect.FieldDescriptor,
    againstFieldDescriptor protoreflect.FieldDescriptor, // [!code highlight]
) error {
```

## `Default` property

Each rule can set a `Default` boolean property that controls whether the rule is called by default if no rules are specified in `buf.yaml`. For example, adding it to the preceding example ensures that the field option is always checked when the plugin is present:

```go
fieldOptionSafeForMLStaysTrueRuleSpec = &check.RuleSpec{
    Default: True, // [!code highlight]
    Type:    check.RuleTypeBreaking,
    Handler: checkutil.NewFieldPairRuleHandler(checkFieldOptionSafeForMLStaysTrue, checkutil.WithoutImports()),
}
```

## Related docs

Now that you've built your first Buf plugin, check out these docs for more detailed information on the Buf plugin framework and example code:

- [Bufplugin framework](https://github.com/bufbuild/bufplugin): The APIs for plugins to the Buf platform
- [`bufplugin-go`](https://github.com/bufbuild/bufplugin-go): The Go library for creating plugins on the Bufplugin platform
- [PluginRPC](https://github.com/pluginrpc): The underlying framework for writing plugins
- [`pluginrpc-go`](https://github.com/pluginrpc/pluginrpc-go): The Go library for writing SDKs using PluginRPC
- [WebAssembly Buf plugins](../webassembly/): Learn how to create a custom Buf plugin using WebAssembly
