---
description: "Learn how to compile Buf plugins to WebAssembly"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/cli/buf-plugins/webassembly/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/cli/buf-plugins/tutorial-create-buf-plugin/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/cli/buf-plugins/publish/"
  - - meta
    - property: "og:title"
      content: "Compiling to WebAssembly - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/cli/buf-plugins/webassembly.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/cli/buf-plugins/webassembly/"
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
      content: "Compiling to WebAssembly - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/cli/buf-plugins/webassembly.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Compiling Buf plugins to WebAssembly

[WebAssembly](https://webassembly.org/) (Wasm) is a portable binary instruction format that allows you to run code written in multiple languages. Compiling Buf plugins to Wasm allows them to run on any platform the Buf CLI supports, including Windows, macOS, and Linux. You can use any language that supports Wasm, including Go, Rust, and C++.

To use WebAssembly with Buf plugins, you need to compile the plugin to Wasm. The process varies depending on the language you're using — in this example, we'll use the `rpc-suffix` plugin built in Go from the [quickstart](../tutorial-create-buf-plugin/).

## Compiling the plugin

To compile your plugin to Wasm, you need to target the [WebAssembly System Interface (WASI)](https://wasi.dev/) syscall API. WASI provides a standard interface for Wasm modules to interact with the host system. The supported version is [WASI 0.1](https://wasi.dev/interfaces#wasi-01).

For [Go](https://go.dev/wiki/WebAssembly#wasi-gooswasip1-port) plugins, you can compile your plugin by setting the `GOOS` and `GOARCH` environment variables to `wasip1` and `wasm`, respectively. This tells the Go compiler to target the WASI syscall API and compile the code to Wasm. For example, this command compiles the `rpc-suffix` plugin outputting a `rpc-suffix.wasm` file:

```console
GOOS=wasip1 GOARCH=wasm go build -o rpc-suffix.wasm ./cmd/rpc-suffix
```

The output of this command is a Wasm binary file named `rpc-suffix.wasm`. The `.wasm` suffix is an important [convention](https://webassembly.github.io/spec/core/binary/conventions.html), as it tells the Buf CLI the plugin type. If the plugin doesn't have the `.wasm` suffix, the Buf CLI interprets it as a native plugin.

## Using the plugin

To use your Wasm plugin with Buf, update your `buf.yaml` file to point to the compiled Wasm binary. The plugin must contain the `.wasm` extension in the `plugin` field. For example, update the plugin field in your `buf.yaml` file to the path of the `rpc-suffix.wasm` binary:

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
  - plugin: rpc-suffix
  // [!code ++]
  - plugin: rpc-suffix.wasm
```

Now that you have a working WebAssembly plugin, you can learn how to [publish it to the BSR](../publish/). Check out these docs for more detailed information on the Buf plugin framework:

- [Bufplugin framework](https://github.com/bufbuild/bufplugin): The APIs for plugins to the Buf platform
- [`bufplugin-go`](https://github.com/bufbuild/bufplugin-go): The Go library for creating plugins on the Bufplugin platform
- [PluginRPC](https://github.com/pluginrpc): The underlying framework for writing plugins
- [`pluginrpc-go`](https://github.com/pluginrpc/pluginrpc-go): The Go library for writing SDKs using PluginRPC
- [Go WASI support](https://go.dev/wiki/WebAssembly#wasi-gooswasip1-port): Go support for the WASI syscall API
