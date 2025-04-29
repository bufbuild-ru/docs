---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/remote-plugins/custom-plugins/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/remote-plugins/usage/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/overview/"
  - - meta
    - property: "og:title"
      content: "Custom plugins - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/remote-plugins/custom-plugins.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/remote-plugins/custom-plugins/"
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
      content: "Custom plugins - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/remote-plugins/custom-plugins.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Custom plugins

This feature is only available on the Pro and Enterprise plans.

All public plugins on the BSR are maintained by Buf for security purposes—we want to make sure that the code generators everyone uses are verified by us. However, organizations often write custom Protobuf plugins to generate logic specific to their business. Custom plugins are available on our Pro and Enterprise plans—[reach out](mailto:support@buf.build) if you're interested in adding this feature.You can upload unlimited custom plugins, which can be public or private within your private BSR instance:

- Public: All user accounts with access to the instance have access to the plugin
- Private: Only user accounts who are members of the organization that owns a plugin have access to the plugin

Custom plugins are interleaved with Buf-managed plugins in the [filter categories](../overview/#finding-remote-plugins) of the plugin catalog. They appear in the language category of the plugin (if one is assigned in the [`buf.plugin.yaml` file](https://github.com/bufbuild/plugins/blob/main/CONTRIBUTING.md#bufpluginyaml-file)), otherwise they're listed in the **Other** category.

## Plugin protocol requirements

The [plugin protocol](../../../reference/descriptors/#code-generation) defines how the compiler and a plugin interact with each other, and we can only support plugins that adhere to it.The main requirement of a plugin is that it deterministically outputs files via a `CodeGeneratorResponse` message based only on the input `CodeGeneratorRequest` message. This strict protocol is what allows the BSR to parallelize local code generation, and implement [generated SDKs](../../generated-sdks/overview/) and [remote plugins](../overview/) on the BSR.

WarningPlugins that access the file system, make network requests, or otherwise cause the `CodeGeneratorResponse` to depend on information other than what is in the `CodeGeneratorRequest`, do not conform to the protocol and are **not supported**.Plugins that don't conform to the protocol may work on your local machine, but you may run into issues that we're not able to help you troubleshoot or fix, and these plugins will not work with [generated SDKs](../../generated-sdks/overview/) or [remote plugins](../overview/) on the BSR.

## Creating a custom plugin

The following are the steps we'll cover to build and push a custom plugin:

1.  Prerequisites
2.  Build Docker image (optional)
3.  Prepare `buf.plugin.yaml` file
4.  Push the plugin

### Prerequisites

- A minimum [Buf CLI](https://github.com/bufbuild/buf) version of **v1.21.0** or higher.
- Docker must be installed and running.
- A BSR organization must exist, and the user pushing the plugin must have at least an Admin role.

You can create an organization through the BSR UI (see [Manage organizations](../../admin/manage-organizations/)) or the Buf CLI (see the [buf registry](../../../reference/cli/buf/registry/organization/create/) command reference).

```console
$ buf registry organization create <BSR_INSTANCE/ORG_NAME>
```

### Build a Docker image

If you already have a Docker image built with a Protobuf plugin that accepts a `CodeGeneratorRequest` from standard input and writes a `CodeGeneratorResponse` to standard output, then you can skip this step.We'll use a Go-based plugin ([protoc-gen-go-json](https://github.com/mitchellh/protoc-gen-go-json)) as an example. If you have a more advanced setup and need help packaging a plugin, don't hesitate to [get in touch](mailto:support@buf.build).

```Dockerfile
# syntax=docker/dockerfile:1.6
FROM golang:1.21-bullseye AS builder
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go install -ldflags "-s -w" -trimpath github.com/mitchellh/protoc-gen-go-json@v1.1.0

# When building a Docker image on a host that doesn't match linux/amd64 (such as an M1),
# go install will put the binary in $GOPATH/bin/$GOOS_$GOARCH/. The mv command copies
# the binary to /go/bin so subsequent steps don't fail when copying from the builder.
RUN mv /go/bin/linux_amd64/* /go/bin || true

FROM scratch
COPY --from=builder --link /etc/passwd /etc/passwd
COPY --from=builder /go/bin/ /
USER nobody
ENTRYPOINT [ "/protoc-gen-go-json" ]
```

- Make sure the OS/arch targets `linux/amd64` (hard coded above). This is important, especially if you're building Docker images on an ARM-based machine, such as an Apple M1 computer.
- If possible, use minimal images such as [scratch](https://hub.docker.com/_/scratch) or [distroless](https://github.com/GoogleContainerTools/distroless) and leverage [multi-stage builds](https://docs.docker.com/build/building/multi-stage/).
- Set a non-root `USER`, such as nobody, and make sure that user exists.

Once you've prepared the Dockerfile, build and tag the image:

```console
$ docker build --platform linux/amd64 -t buf.example.com/acme/go-json:v1.1.0 .
```

### Prepare `buf.plugin.yaml`

At a minimum, the `buf.plugin.yaml` file defines the plugin name and plugin version.

::: info buf.plugin.yaml

```yaml
version: v1
name: buf.example.com/acme/go-json
plugin_version: v1.1.0
```

:::

- The `version` key is the YAML configuration version, always set to `v1`.
- The `plugin_version` key has the format `v{semver}`—the **v** prefix is required and the version must be valid [semantic versioning](https://semver.org/).
- The `name` key format is `BSR_INSTANCE/ORG_NAME/PLUGIN_NAME`

There is additional metadata that may be captured by the `buf.plugin.yaml` configuration file, such as the plugin source URL, the output language, description, dependencies, etc. See the [`buf.plugin.yaml` file](https://github.com/bufbuild/plugins/blob/main/CONTRIBUTING.md#bufpluginyaml-file) documentation.

### Push plugin to the BSR

Make sure you have [authenticated to the BSR](../../authentication/).Once you have a Docker image and a `buf.plugin.yaml` file, run the following command:

```console
$ buf beta registry plugin push \
    --visibility [public,private] \
    --image buf.example.com/acme/go-json:v1.1.0
```

The `--image` flag is referencing an image built in an earlier step, but this can also be an image from an external source, such as Docker Hub or Quay. Make sure to `docker pull` the image so it's available locally.Setting the visibility to private makes the plugin accessible to organization members only.A successful push outputs details about the plugin, and the plugin is immediately available in the Plugins section within the organization.

```text
Owner  Name     Version  Revision
acme   go-json  v1.1.0   1
```

## Upload a custom plugin for generated SDKs

Generated SDKs allow schema consumers to fetch pre-generated packages in their native ecosystem so they don't need to generate code manually. You can take any module on the BSR and a _supported_ plugin and fetch bundled code. However, this means that the BSR needs to specify configuration and plugin defaults in advance.Occasionally, users want different code generation behavior in generated SDKs. Because there is no way to change configuration or plugin options, the only solution is to upload (and maintain) a different flavor of the plugin to force a different behavior during code generation. The example below shows how to add CommonJS support to the [bufbuild/es plugin](https://github.com/bufbuild/protobuf-es) (which is hard-coded to output ESM) by making a copy and changing the defaults, but the process is similar for any plugin you want to modify.

### Create a BSR organization for custom plugins

Keeping the custom plugins together makes maintenance simpler, but it's not required. For this example we'll use a sample Pro BSR instance and organization at `https://jsexample.buf.dev/custom-plugins`.

### Clone and modify the base plugin

The BSR's plugins are publicly accessible, so you can start from the existing plugin code and make modifications to suit your needs. You can find general best practices and a list of the `buf.plugin.yaml` fields in the [plugin repo documentation](https://github.com/bufbuild/plugins/blob/main/CONTRIBUTING.md).

1.  Clone the following repository: [`https://github.com/bufbuild/plugins`](https://github.com/bufbuild/plugins).
2.  Go to the directory of the version you want to use—we'll use the current version, `v1.6.0`:

    ```console
    $ cd plugins/bufbuild/es/v1.6.0
    ```

3.  Update the `buf.plugin.yaml` file with the following changes:
    - Change the `name` field to a new upload destination (making sure not to override the version of the plugin that Buf manages).
    - Add the necessary plugin options for CommonJS under `registry`.
    - Change the import style under `npm` to `common_js`.

The complete patch looks like this:

```diff
--- A/plugins/bufbuild/es/v1.6.0/buf.plugin.yaml
+++ B/plugins/bufbuild/es/v1.6.0/buf.plugin.yaml
@@ -1,5 +1,5 @@
 version: v1
+name: jsexample.buf.dev/custom-plugins/bufbuild-es
-name: buf.build/bufbuild/es
 plugin_version: v1.6.0
 source_url: https://github.com/bufbuild/protobuf-es
 integration_guide_url: https://github.com/bufbuild/protobuf-es#quickstart
@@ -8,8 +8,10 @@
   - javascript
   - typescript
 registry:
+  opt:
+    - js_import_style=legacy_commonjs
   npm:
+    import_style: commonjs
-    import_style: module
     rewrite_import_path_suffix: pb.js
     deps:
       - package: '@bufbuild/protobuf'
```

### Build a Docker image

Make sure to build the image for the correct platform (`linux/amd64`)

```console
$ docker build \
    --platform linux/amd64 \
    -t jsexample.buf.dev/custom-plugins/bufbuild-es:v1.6.0 .
```

### Push the Docker image to the BSR

```console
$ buf beta registry plugin push \
    --visibility=public \
    --image=jsexample.buf.dev/custom-plugins/bufbuild-es:v1.6.0 \
    --override-remote=jsexample.buf.dev
```

Now, when you `npm install` a generated SDK from this custom plugin:

```console
$ npm install @buf/acme_petapis.custom-plugins_bufbuild-es@latest
```

It has `commonjs` imports instead of ESM:

```javascript
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const { proto3 } = require("@bufbuild/protobuf");
const {
  Money,
} = require("@buf/googleapis_googleapis.custom-plugins_bufbuild-es/google/type/money_pb.js");
```

## Delete a custom plugin

You can delete a custom plugin with the Buf CLI by passing a plugin reference or a plugin reference and version.

WarningIf the version is omitted, then all versions for that plugin will be deleted.

::: info Delete all versions

```console
$ buf beta registry plugin delete buf.example.com/acme/go-json
```

:::

::: info Delete specific version

```console
$ buf beta registry plugin delete buf.example.com/acme/go-json:v1.1.0
```

:::
