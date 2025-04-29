---
layout: home

title: "Introducing custom lint and breaking change plugins for Buf"
description: "Buf is introducing custom lint and breaking change plugins via the Bufplugin framework. Check it out to see how easy it is to author, test, and consume your own lint and breaking change rules."

head:
  - - meta
    - property: "og:title"
      content: "Introducing custom lint and breaking change plugins for Buf"
  - - meta
    - property: "og:description"
      content: "Buf is introducing custom lint and breaking change plugins via the Bufplugin framework. Check it out to see how easy it is to author, test, and consume your own lint and breaking change rules."
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674fa928d1564442b97e2c24_Custom%20lint.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Introducing custom lint and breaking change plugins for Buf"
  - - meta
    - property: "twitter:description"
      content: "Buf is introducing custom lint and breaking change plugins via the Bufplugin framework. Check it out to see how easy it is to author, test, and consume your own lint and breaking change rules."
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674fa928d1564442b97e2c24_Custom%20lint.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

hero:
  name: "Introducing custom lint and breaking change plugins for Buf"
  tagline: "September 18, 2024"
---

Buf has brought standards enforcement and compatibility checking for Protobuf into the mainstream - for almost half a decade, Buf's toolchain has set the standard across the industry for how to govern your Protobuf APIs effectively. However, Buf has always only worked using the lint and breaking rules that we've provided to users, not allowing for authorship of a company's own rules as they see fit. While we've heard the desire for users to implement their own rules, we wanted to make sure that if we brought this functionality to the Buf platform, it was done right. As we've heard more and more use cases, we decided to pursue this head-on.

The result is what we're excited to announce today: Buf is introducing custom lint and breaking change plugins via the [Bufplugin](https://github.com/bufbuild/bufplugin-go) framework. Check it out to see how easy it is to author, test, and consume your own lint and breaking change rules.

## Key takeaways

- Buf has introduced the ability to author custom lint and breaking change rules via the [Bufplugin](https://github.com/bufbuild/bufplugin-go) framework.
- Buf plugins fit right into your existing `buf` CLI workflow. Once a plugin is added, rules can be added and removed, ignored for certain files, and errors suppressed via code comments just like the existing lint and breaking change rules built into the `buf` CLI.
- We took the time to get this right, designing an interface we believe will stand the test of time. Buf plugins are built on top of a Protobuf API, and a new plugin RPC framework, [PluginRPC](https://github.com/pluginrpc), that was designed and built with Bufplugin in mind.
- We built [bufplugin-go](https://github.com/bufbuild/bufplugin-go) that glues PluginRPC and the Bufplugin API together into a library that allows rules to be extremely easily implemented _and_ tested.
- We're confident that this framework is powerful enough to represent any rule you'd like to implement because we migrated all 100+ of Buf's built-in [lint](/docs/lint/rules/index.md) and [breaking change](/docs/breaking/rules/index.md) rules to `bufplugin-go` itself.
- Stay tuned for tons of exciting updates: Bufplugin is coming to the BSR, letting you distribute your plugins across teams, and govern your APIs effectively using organization-wide custom lint and breaking change rules. Bufplugin will also expand to other types of plugins for the Buf platform in the future.

## Get me up to speed

A Buf plugin is just a binary on your system that implements the [Bufplugin API](https://buf.build/bufbuild/bufplugin). Once you've installed a plugin, simply add a reference to it and its rules within your `buf.yaml`. For example, if you've installed the [buf-plugin-timestamp-suffix](https://github.com/bufbuild/bufplugin-go/tree/main/check/internal/example/cmd/buf-plugin-timestamp-suffix) example plugin on your `$PATH`:

```protobuf
  use:
    - TIMESTAMP_SUFFIX
  # Make sure you install buf-plugin-timestamp-suffix
  # go install buf.build/go/bufplugin/check/internal/example/cmd/buf-plugin-timestamp-suffix@latest
  - plugin: buf-plugin-timestamp-suffix
    options:
      timestamp_suffix: _time # set to the suffix you'd like to enforce
```

All [configuration](/docs/configuration/v2/buf-yaml/index.md) works as you'd expect: you can continue to configure `use`, `except`, `ignore`, `ignore_only` and use `// buf:lint:ignore` comment ignores, just as you would for the built-in rules.

Given the following file:

```protobuf
// foo.proto
syntax = "proto3";

package foo;

import "google/protobuf/timestamp.proto";

message Foo {
  google.protobuf.Timestamp start = 1;
  google.protobuf.Timestamp end_time = 2;
}
```

The following error will be returned from `buf lint`:

```protobuf
foo.proto:8:3:Fields of type google.protobuf.Timestamp must end in "_time" but field name was "start". (buf-plugin-timestamp-suffix)
```

To author a plugin, use [bufplugin-go](https://github.com/bufbuild/bufplugin-go). This library uses the [protoreflect API](https://pkg.go.dev/google.golang.org/protobuf@v1.34.2/reflect/protoreflect) that powers most of the Go Protobuf ecosystem. Authoring rules is as simple as using the `Descriptor` types you're already familiar with. While a Buf plugin can be authored in any language, using the Bufplugin API and the [PluginRPC](https://github.com/pluginrpc) framework, we'd recommend letting us do the heavy lifting for now: as there's demand for additional languages, we'll introduce additional language-specific libraries in the future.

## Examples

We think examples are worth a thousand words here, and to this end, we've put together a few:

- [buf-plugin-timestamp-suffix](https://github.com/bufbuild/bufplugin-go/tree/main/check/internal/example/cmd/buf-plugin-timestamp-suffix): A simple plugin that implements a single lint rule, `TIMESTAMP_SUFFIX`, that checks that all `google.protobuf.Timestamp` fields have a consistent suffix for their field name. This suffix is configurable via plugin options.
- [buf-plugin-field-lower-snake-case](https://github.com/bufbuild/bufplugin-go/tree/main/check/internal/example/cmd/buf-plugin-field-lower-snake-case): A simple plugin that implements a single lint rule, `PLUGIN_FIELD_LOWER_SNAKE_CASE`, that checks that all field names are `lower_snake_case`.
- [buf-plugin-field-option-safe-for-ml](https://github.com/bufbuild/bufplugin-go/tree/main/check/internal/example/cmd/buf-plugin-field-option-safe-for-ml): Likely the most interesting of the examples. A plugin that implements a lint rule `FIELD_OPTION_SAFE_FOR_ML_SET` and a breaking change rule `FIELD_OPTION_SAFE_FOR_ML_STAYS_TRUE`, both belonging to the `FIELD_OPTION_SAFE_FOR_ML` category. This enforces properties around an example custom option `acme.option.v1.safe_for_ml`, meant to denote whether or not a field is safe to use in ML models. An organization may want to say that all fields must be explicitly marked as safe or unsafe across all of their schemas, and no field changes from safe to unsafe. This plugin would enforce this organization-side. The example shows off implementing multiple rules, categorizing them, and taking custom option values into account.
- [buf-plugin-syntax-specified](https://github.com/bufbuild/bufplugin-go/tree/main/check/internal/example/cmd/buf-plugin-syntax-specified): A simple plugin that implements a single lint rule, `PLUGIN_SYNTAX_SPECIFIED`, that checks that all files have an explicit `syntax` declaration. This demonstrates using additional metadata present in the `bufplugin` API beyond what a `FileDescriptorProto` provides.

## How does it all work?

Implementing a plugin framework is relatively easily. Building a plugin framework that will ensure forward- and backward-compatibility, idiomatic CLI semantics, and ease of implementation and testing is a bit more of a challenge. To do this right, we took a step back and really thought about what we'd want Buf's plugin ecosystem to look like not just in 2024, but over the next decade.

Protobuf is at the heart of this: we felt that any plugin API that Buf exposes should revolve around the Protobuf services we all know and love. Protobuf services are a great way to represent your network APIs, and your plugin APIs should be no different. To this end, we developed Buf's lint and breaking change APIs in Protobuf, as you'd expect.

However, to expose a Protobuf API, you also need an RPC framework. Traditional network-based RPC frameworks didn't really serve the purposes we wanted for a plugin-based system: introducing network calls for local plugins was unidiomatic and unreliable. So, we developed [PluginRPC](https://github.com/pluginrpc): a Protobuf-based RPC framework purpose-built for authoring plugins. Protobuf services are invoked using CLI arguments, stdin, and stdout, providing a simple protocol that can evolve over time, while using the best of what CLIs have to offer. PluginRPC's first implementation is [pluginrpc-go](https://github.com/pluginrpc/pluginrpc-go). We'd recommend checking it out!

Finally, we felt that any plugin framework had to be good enough for the most discerning of lint and breaking change rule authors: ourselves. If we didn't want to use the plugin framework to represent the 100+ rules we've developed over the previous half-decade, no one else should be expected to. To that end, we developed `bufplugin-go` that makes authoring and testing plugins a cinch. Then, to make sure that this library was powerful enough for all of our rules, we did what any responsible author would do: we ported our rules to use it. Since v1.40.0, `buf` has used `bufplugin-go` to power all of its rules transparently to all of our users. There has been no impact on functionality, and we've been very pleased with the result.

## Get in touch

We're excited to see what custom lint and breaking change rules you develop. Get in touch on our [Slack channel](https://buf.build/b/slack) or shoot us an email at [feedback@buf.build](mailto:feedback@buf.build) with questions and suggestions!
