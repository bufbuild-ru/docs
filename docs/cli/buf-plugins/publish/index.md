---
description: "Publish a plugin to the BSR"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/cli/buf-plugins/publish/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/cli/buf-plugins/webassembly/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/policy-checks/breaking/"
  - - meta
    - property: "og:title"
      content: "Publish to the BSR - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/cli/buf-plugins/publish.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/cli/buf-plugins/publish/"
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
      content: "Publish to the BSR - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/cli/buf-plugins/publish.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Publishing a plugin to the BSR

Publishing a plugin to the BSR allows you to share it with other developers. To publish a plugin, it must be compiled as a [WebAssembly](https://webassembly.org/) (Wasm) binary. See the docs on [compiling plugins to WebAssembly](../webassembly/) for more information.

## Pushing a plugin

To push a plugin to the BSR, you use the `buf plugin push` command. We'll use the `rpc-suffix.wasm` plugin built in Go from the [quickstart](../tutorial-create-buf-plugin/) and compiled to [Wasm](../webassembly/) to demonstrate how to push a plugin to the BSR.

```sh
$ buf plugin push buf.build/acme/rpc-suffix \
  --binary=rpc-suffix.wasm \
  --create \
  --create-type=check \
  --create-visibility=public
```

This command pushes the plugin `rpc-suffix.wasm` to the BSR organization `acme` at `buf.build/acme/rpc-suffix`. It uses the following flags:

- `--binary`: The local path to the Wasm plugin binary.
- `--create`: Creates the plugin if it doesn't exist.
- `--create-type`: The type of plugin to create. For lint and breaking changes, set to `check`.
- `--create-visibility`: The visibility of the plugin being created. Defaults to `private`.

Once pushed, the plugin is now available in the BSR and can be used by other developers.

## Pushing with labels

You can also push a plugin with labels. To do this, add the `--label` flag with the label name. This allows you to version your plugin and make it easier for other developers to find the right version.

```sh
buf plugin push buf.build/acme/rpc-suffix \
  --binary=rpc-suffix.wasm \
  --label=v1.0.0 \
  --label=v1.0 \
  --label=v1

buf.build/acme/rpc-suffix:2c86638bd5464f0b89bc8aa43486c2d3
```

As a best practice, we recommend always explicitly specifying the labels you want to push to rather than relying on the current default label in the BSR. See [Commits and labels](../../../bsr/commits-labels/) for more details about label properties and behavior.

## Using the plugin

To use the plugin, you update your `buf.yaml` file to point to the remote plugin.

```yaml
 version: v2
 modules:
   - path: proto
     name: buf.build/tutorials/lint-plugin
 lint:
   use:
     - STANDARD
     - RPC_SUFFIX
 plugins:
  // [!code --]
  - plugin: rpc-suffix.wasm
  // [!code ++]
  - plugin: buf.build/acme/rpc-suffix
```

Next, you need to update the `buf.lock` file to set the plugin version:

```sh
buf plugin update
```

When you run `buf lint` and `buf breaking` checks, they now use the plugin you just pushed to the BSR.

```sh
buf lint

proto/pet/v1/pet.proto:30:3:method name should not end with "Method" (buf.build/acme/rpc-suffix)
```
