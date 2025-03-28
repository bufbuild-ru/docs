# Migrate from remote generation alpha

::: tip NoteThe remote generation alpha was deprecated as of April 30, 2023. Please migrate to [remote plugins](../../bsr/remote-plugins/overview/) or [generated SDKs](../../bsr/generated-sdks/overview/).

:::

The remote generation alpha included two features: remote plugin execution (now called remote plugins), and remote code execution (now called generated SDKs). This document describes the changes and migration requirements for each feature.

## Plugin changes

### Public plugins are now solely maintained by the Buf team

In the alpha, public plugins could be uploaded by individual users with no verification. This caused a subpar experience for users who discovered plugins on their own, and also caused a security headache for some of our customers. All public remote plugins are now maintained and verified by the Buf team directly.To see all publicly available plugins, go to [buf.build/plugins](https://buf.build/plugins). We think we've covered the vast majority of use cases—however, if you find a useful plugin that should be added, please [file an issue](https://github.com/bufbuild/plugins/issues/new/choose)!

### Custom plugins available for Pro and Enterprise customers

This feature is only available on the Enterprise plan.

The BSR will still allow you to upload custom private plugins. [Contact us](mailto:support@buf.build) if you are interested in working with us.

## Migrate to remote plugins

The documentation for [remote plugins](../../bsr/remote-plugins/overview/) (the update to remote plugin execution) has the usage details. It's extremely similar to the alpha, but there are a few changes to the buf.gen.yaml file to note:

1.  The `name` and `remote` keys used to reference plugins changed to just `plugin`. The `plugin` key understands both local and remote references. Requires [buf CLI version 1.8](https://github.com/bufbuild/buf/releases/tag/v1.8.0) or later.
2.  When referencing remote plugins, remove the `/plugins/` path.
3.  Remove any revision numbers (the revision is now a separate key and typically not specified).

Full example covering all changes:

```diff
plugins:
-  - remote: buf.build/bufbuild/plugins/connect-go:v1.3.1-1
+  - plugin: buf.build/connectrpc/go:v1.3.1
```

## Migrate to generated SDKs

The documentation for [generated SDKs](../../bsr/generated-sdks/overview/) (the update to remote code execution) fully covers its usage. This section walks you through what changed, and outlines exactly how to migrate from remote code execution to generated SDKs.

### Templates removed

Templates were a complex concept for users to understand when interacting with the BSR, so we removed them. Instead, you reference plugins directly by name (and plugins can depend on the output of other plugins). A list of publicly-available plugins can be found at [buf.build/plugins](https://buf.build/plugins). Note that not all plugins can be used with generated SDKs—check the individual plugin for more details.

### Versioning

The synthetic versioning scheme has been replaced by a more explicit versioning scheme comprised of the plugin version, module reference (datetime+short commit name) and revision. Example:

```text
0.4.0-20220908151351-622fe7149695.1
```

This new semver-compatible versioning scheme can be pinned in lock files and always references a specific plugin + module for reproducibility.Most users fetch the `@latest` version and will be unaffected by the versioning change.

### Go module proxy

There are a couple of key changes from the alpha:

- The base URL has changed from `go.buf.build` to `buf.build/gen/go`.
- The path has changed to begin with the module name.
- The template reference in the path has been replaced with plugins and moved to the end.
- The version has changed to include plugin version and module commit information.

The new format is:`buf.build/gen/go/{moduleOwner}/{moduleName}/{pluginOwner}/{pluginName}`

```diff
- go.buf.build/protocolbuffers/go/acme/petapis
+ buf.build/gen/go/acme/petapis/protocolbuffers/go
```

This means you'll need to search and replace the old import path with the new one and run `go mod tidy`.The versioning has also changed to a more descriptive form:`{pluginVersion}-{moduleCommitTimestamp}-{moduleCommitName}.{pluginRevision}`Instead of relying on the commit sequence, it now relies directly on commits. For ways to pin to a commit and other documentation see the new \[Go proxy\]\[../bsr/remote-plugins/go.md#using-go-modules\] docs.

#### connect-go template

If you've used the [connect-go template](https://buf.build/bufbuild/templates/connect-go) you'll need to update all **connect** imports to the generated code of the connect plugin.The `go.mod` file also now requires two different imports, one for the [`go`](https://buf.build/protocolbuffers/go) plugin and the other for the [`connect-go`](https://buf.build/connectrpc/go) plugin.

::: info go.mod

```diff
- go.buf.build/connectrpc/go/acme/petapis
+ buf.build/gen/go/acme/petapis/protocolbuffers/go
+ buf.build/gen/go/acme/petapis/connectrpc/go
```

:::

Example:

```diff
package main

import (
-  petv1 "go.buf.build/connectrpc/go/acme/petapis/pet/v1"
-  petv1connect "go.buf.build/connectrpc/go/acme/petapis/pet/v1/petv1connect"
+  petv1 "buf.build/gen/go/acme/petapis/protocolbuffers/go/pet/v1"
+  petv1connect "buf.build/gen/go/acme/petapis/connectrpc/go/pet/v1/petv1connect"
)
```

#### grpc-go template

If you've used the [`grpc-go` template](https://buf.build/grpc/templates/go) you'll need to update all **grpc** imports to the generated code of the grpc plugin.The `go.mod` file also now requires two different imports, one for the [`go`](https://buf.build/protocolbuffers/go) plugin and the other for the [`grpc-go`](https://buf.build/grpc/go) plugin.

::: info go.mod

```diff
- go.buf.build/grpc/go/acme/petapis
+ buf.build/gen/go/acme/petapis/protocolbuffers/go
+ buf.build/gen/go/acme/petapis/grpc/go
```

:::

We patched the [`grpc-go`](https://buf.build/grpc/go) plugin to generate code to a subpackage. It previously generated code to the same package as the [`go`](https://buf.build/protocolbuffers/go) plugin. The new import path is a subpackage that is named in the format: `{goPackageName}grpc`Example:

```diff
package main

import (
-  petv1 "go.buf.build/grpc/go/acme/petapis/pet/v1"
+  petv1 "buf.build/gen/go/acme/petapis/protocolbuffers/go/pet/v1"
+  petv1grpc "buf.build/gen/go/acme/petapis/grpc/go/pet/v1/petv1grpc"
)

func main() {
  ...
-  client := petv1.NewPetStoreServiceClient(conn)
+  client := petv1grpc.NewPetStoreServiceClient(conn)
  res, err := client.GetPet(ctx, &petv1.GetPetRequest{})
  ...
}
```

#### protoc-gen-validate plugin

If you used a custom template that included the [`protoc-gen-validate`](https://github.com/envoyproxy/protoc-gen-validate) plugin, there is no current direct migration path. We've taken [stewardship](https://github.com/envoyproxy/protoc-gen-validate/issues/616) of protoc-gen-validate from the Envoy team, and will continue to work to improve it, but protoc-gen-validate generated code is required to be generated to the same package as protoc-gen-go code, which doesn't fit cleanly into the generated SDKs model. In the meantime, switch to [remote plugins](../../bsr/remote-plugins/overview/) using `buf generate`.

#### protoc-gen-grpc-gateway plugin

If you used a custom template that included the [`grpc-gateway`](https://buf.build/grpc-ecosystem/gateway) plugin, you can update **grpc-gateway** imports to the generated code of the `grpc-gateway` plugin.The `go.mod` file also now requires three different imports, for the [`go`](https://buf.build/protocolbuffers/go) plugin, the [`grpc-go`](https://buf.build/grpc/go) plugin, and the [`grpc-gateway`](https://buf.build/grpc-ecosystem/gateway) plugin.

::: info go.mod

```diff
- go.buf.build/grpc-ecosystem/gateway/acme/petapis
+ buf.build/gen/go/acme/petapis/protocolbuffers/go
+ buf.build/gen/go/acme/petapis/grpc/go
+ buf.build/gen/go/acme/petapis/grpc-ecosystem/gateway/v2
```

:::

We patched the [`grpc-gateway`](https://buf.build/grpc-ecosystem/gateway) plugin to generate code to a subpackage. It previously generated code to the same package as the [`go`](https://buf.build/protocolbuffers/go) and [`grpc-go`](https://buf.build/grpc/go) plugins. The new import path is a subpackage that's named in the format: `{goPackageName}gateway`The import path for the [`grpc-gateway`](https://buf.build/grpc-ecosystem/gateway) plugin generated code changes like so:

```diff
package main

import (
-  petv1 "go.buf.build/grpc/go/acme/petapis/pet/v1"
+  petv1gateway "buf.build/gen/go/acme/petapis/grpc-ecosystem/gateway/v2/pet/v1/petv1gateway"
)
```

### BSR NPM registry

#### Base URL

The base URL for the BSR NPM registry has changed, so you need to update your `.npmrc` file:

```diff
- @buf:registry=https://npm.buf.build
+ @buf:registry=https://buf.build/gen/npm/v1
```

#### Naming convention

The naming convention has changed because templates were removed in favor of plugins. The new format is:`{moduleOwner}_{moduleName}.{pluginOwner}_{pluginName}`Note that the dot (`.`) delimiter is used to break up the module and the plugin components.This means you'll need to do 2 things:

1.  `npm remove` the old package and `npm install` the new package
2.  Search and replace application imports

```diff
- npm install @buf/bufbuild_es_connectrpc_eliza
+ npm install @buf/connectrpc_eliza.bufbuild_es
```

New documentation is available at [NPM registry](../../bsr/generated-sdks/go/).

#### connect-web template

If you consumed [connect-web template](https://buf.build/bufbuild/templates/connect-web) you'll need to update all imports for **base types** within your application code. This plugin now outputs plugin dependencies, namely [Protobuf-ES](https://www.npmjs.com/package/@bufbuild/protoc-gen-es), into a separate package.Also, please note that the `connect-web` plugin has been renamed to `connect-es`. As a result, this plugin now outputs files with a `_connect` suffix rather than `_connectweb`.Show example

\#### One package (old behavior)

```diff
- node_modules
- └── @buf
-     └── bufbuild_connect-es_connectrpc_eliza
-         ├── connectrpc
-         │   └── eliza
-         │       └── v1
-         │           ├── eliza_connectweb.d.ts
-         │           ├── eliza_connectweb.js
-         │           ├── eliza_pb.d.ts
-         │           └── eliza_pb.js
-         └── package.json
```

\#### Two packages (new behavior)

```diff
+ node_modules
+ └── @buf
+     ├── connectrpc_eliza.bufbuild_connect-es
+     │   ├── connectrpc
+     │   │   └── eliza
+     │   │       └── v1
+     │   │           ├── eliza_connect.d.ts
+     │   │           └── eliza_connect.js
+     │   └── package.json
+     └── connectrpc_eliza.bufbuild_es
+         ├── connectrpc
+         │   └── eliza
+         │       └── v1
+         │           ├── eliza_pb.d.ts
+         │           └── eliza_pb.js
+         └── package.json
```

Using this example, there are two important things to note, assuming you have run `npm uninstall` and `npm install` based on the naming change mentioned above.

- If your application code imported `eliza_pb.js` from `@buf/bufbuild_connect-es_connectrpc_eliza/eliza_connectweb.js`, then you'll want to update that import within your application code to reference the base types from `@buf/connectrpc_eliza.bufbuild_es/eliza_pb.js`.
- If your application code imported `eliza_connectweb.js` from `@buf/bufbuild_connect-es_connectrpc_eliza/eliza_connectweb.js`, then you'll want to update that import within your application code to reference the Connect artifacts from `@buf/connectrpc_eliza.bufbuild_connect-es/eliza_connect.js`.
