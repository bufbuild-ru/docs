---

title: "Publish plugins to the BSR - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/cli/buf-plugins/publish/"
  - - meta
    - property: "og:title"
      content: "Publish plugins to the BSR - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/cli/buf-plugins/publish/"
  - - meta
    - property: "twitter:title"
      content: "Publish plugins to the BSR - Buf Docs"

---

# Publishing a plugin to the BSR

Publishing a plugin to the BSR allows you to share it with other developers. To publish a plugin, it must be compiled as a [WebAssembly](https://webassembly.org/) (Wasm) binary. See the docs on [compiling plugins to WebAssembly](../webassembly/) for more information.

## Pushing a plugin

To push a plugin to the BSR, you use the `buf plugin push` command. We'll use the `rpc-suffix.wasm` plugin built in Go from the [tutorial](../tutorial-create-buf-plugin/) and compiled to [Wasm](../webassembly/) to demonstrate how to push a plugin to the BSR.

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

```console
$ buf plugin push buf.build/acme/rpc-suffix \
  --binary=rpc-suffix.wasm \
  --label=v1.0.0 \
  --label=v1.0 \
  --label=v1

buf.build/acme/rpc-suffix:2c86638bd5464f0b89bc8aa43486c2d3
```

As a best practice, we recommend always explicitly specifying the labels you want to push to rather than relying on the current default label in the BSR. See [Commits and labels](../../../bsr/commits-labels/) for more details about label properties and behavior.

## Using the plugin

To use the plugin, you update your `buf.yaml` file to point to the remote plugin.

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
-  - plugin: rpc-suffix.wasm
+  - plugin: buf.build/acme/rpc-suffix
```

Next, you need to update the `buf.lock` file to set the plugin version:

```console
$ buf plugin update
```

When you run `buf lint` and `buf breaking` checks, they now use the plugin you just pushed to the BSR.

```console
$ buf lint

proto/pet/v1/pet.proto:30:3:method name should not end with "Method" (buf.build/acme/rpc-suffix)
```

## Related docs

- \[Bufplugin framework\]\[bufplugin\]: The APIs for plugins to the Buf platform
- \[`bufplugin-go`\]\[bufplugin-go\]: The Go library for creating plugins on the Bufplugin platform
- \[PluginRPC\]\[pluginrpc\]: The underlying framework for writing plugins
- \[`pluginrpc-go`\]\[pluginrpc-go\]: The Go library for writing SDKs using PluginRPC
