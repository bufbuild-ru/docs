# Buf plugins – Overview

With Buf plugins, you can create custom lint and breaking change rules and categories to augment Buf's built-in rules. Buf plugins are locally installed binaries that fit into your existing Buf CLI workflow. Once you install a plugin, you can configure it in the `buf.yaml` file just like any of Buf's built-in rules. You can add and remove rules, ignore them for certain files, and suppress errors via code comments.Buf plugins are built on top of the [Bufplugin](https://github.com/bufbuild/bufplugin) Protobuf API and the [PluginRPC](https://github.com/pluginrpc) framework. [`bufplugin-go`](https://github.com/bufbuild/bufplugin-go) connects them into a library that makes implementing and testing rules simple and straightforward. All of Buf's built-in [lint](../../../lint/rules/) and [breaking change](../../../breaking/rules/) rules run on this platform.The `bufplugin-go` library provides several detailed [implementation examples](https://github.com/bufbuild/bufplugin-go?tab=readme-ov-file#examples) to help get you started, and the [tutorial](../tutorial-create-buf-plugin/) is a step-by-step walkthrough of creating a plugin from scratch.

## Related docs

- Learn how to create a plugin in the [tutorial](../tutorial-create-buf-plugin/)
- See the [breaking change](../../../breaking/overview/#using-buf-plugins) and [lint](../../../lint/overview/#using-buf-plugins) overviews for usage information
- [Bufplugin framework](https://github.com/bufbuild/bufplugin): The APIs for plugins to the Buf platform
- [`bufplugin-go`](https://github.com/bufbuild/bufplugin-go): The Go library for creating plugins on the Bufplugin platform
- [PluginRPC](https://github.com/pluginrpc): The underlying framework for writing plugins
- [`pluginrpc-go`](https://github.com/pluginrpc/pluginrpc-go): The Go library for writing SDKs using PluginRPC
