---
sidebar: false
prev: false
next: false

title: "Introducing the next generation of the Buf CLI: still v1 and backwards-compatible"
description: "The Buf CLI and its associated configuration have been completely overhauled to support monorepos as first-class citizens. Everything we've changed is 100% backwards compatible."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/buf-cli-next-generation"
  - - meta
    - property: "og:title"
      content: "Introducing the next generation of the Buf CLI: still v1 and backwards-compatible"
  - - meta
    - property: "og:description"
      content: "The Buf CLI and its associated configuration have been completely overhauled to support monorepos as first-class citizens. Everything we've changed is 100% backwards compatible."
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674fc4f6caf79fd32f1fb5b0_Next%20gen%20CLI.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Introducing the next generation of the Buf CLI: still v1 and backwards-compatible"
  - - meta
    - property: "twitter:description"
      content: "The Buf CLI and its associated configuration have been completely overhauled to support monorepos as first-class citizens. Everything we've changed is 100% backwards compatible."
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674fc4f6caf79fd32f1fb5b0_Next%20gen%20CLI.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Introducing the next generation of the Buf CLI: still v1 and backwards-compatible

The Buf CLI and its associated configuration have been completely overhauled to support monorepos as first-class citizens. We'd call it a v2 of `buf`, but it's not. Buf is enterprise-grade software, and we want you to be minimally impacted. The `v1.32.0` release of `buf` introduces v2 config formats for both `buf.yaml` and `buf.gen.yaml`. All your current commands and configuration continue to work, so you can upgrade to v2 configuration when appropriate.

We've also shipped some big updates to the Buf Schema Registry (BSR), which [you can read about in this companion blog post](/blog/enhanced-buf-push-bsr-ui/index.md).

## What's new in the `v1.32.0` release of `buf`

- **First-class monorepo support:** Maintain as many modules in one source control repository as you like, and push them to the BSR atomically using v2 `buf.yaml`.
- **Better code generation configuration:** The v2 `buf.gen.yaml` configuration is drastically simplified, and it captures all of your configuration in one place so you don't need to wrap your `buf generate` calls in a `Makefile` or custom script.
- **Automated migration to v2 config:** In most cases, updating to v2 configuration is as simple as running `buf config migrate` at the root of your repository. Manual controls are available for more complicated setups — [read our migration guide](/docs/migration-guides/migrate-v2-config-files/index.md) to learn more.
- **Support for Protobuf Editions:** Editions are the latest evolution of Protobuf, and `buf` fully supports them, but [we recommend sticking with `proto3` for now](/blog/protobuf-editions-are-here/index.md).

## Introduction

[`buf`](https://github.com/bufbuild/buf) was released into beta five years ago, and candidly, we didn't know what to expect. Would anyone really care about what our company was trying to do with Protobuf? Would anyone benefit from what the `buf` CLI was trying to accomplish?

What happened surprised us — fast-forward five years, and `buf` has become something of a Protobuf standard — users from hobbyists, to the largest companies in the world, rely on `buf` for an easier Protobuf workflow, to enforce common API standards, ensure their APIs never break, and manage their APIs across their entire organization with the [BSR](https://buf.build/product/bsr).

However, [Hyrum's Law](https://www.hyrumslaw.com/) kicked in, and people starting using the `buf` CLI in ways we didn't anticipate. At its core, the Buf model is pretty simple — organize your Protobuf files into [modules](/docs/cli/modules-workspaces/index.md), and compose these modules just like you would in any programming language that supports packaged dependencies. The `buf` CLI was largely designed around each module being managed in a separate source control repository, which is still a common use case. Many users, however, wanted more — they wanted to manage a large Protobuf projects in a single repository. These users typically had "Protobuf monorepos", where all of their Protobuf files lived in a single Protobuf-specific repository, while others had large language-independent monorepos with Protobuf APIs stored within them. This much was clear: The module abstraction wasn't sufficiently meeting our customers needs.

We eventually grafted on the concept of [workspaces](/docs/configuration/v1/buf-work-yaml/index.md) in an attempt to address this shortcoming. Workspaces made working with multiple modules locally easier via a `buf.work.yaml` file, and the `buf` CLI added support for most operations via workspaces.

Sadly, workspace support as-is still wasn't enough, here's why:

- Workspaces didn't support all `buf` commands. Most importantly, it wasn't possible to push all modules in a workspace to the BSR together. For monorepos, this resulted in complex setup that led to manually untangling the DAG of their module dependencies within their workspace. This chipped away at our goal of making simple things easy, and it put a lot of the management burden on the end-user.
- Given each module had its own set of dependencies, there were dependency conflicts across modules within workspaces. The `buf` CLI silently resolved this, without exposing to the user which version of the dependency was chosen.
- Modules had to declare dependencies on other modules within the workspace, even though these dependency pins were ignored locally — it was a confusing experience.

This situation was so critical to our users that we took a step back and looked at our overall design of workspaces. We concluded that the existing configuration setup was fundamentally unable to properly provide effective monorepo support, and the actual UX was never going to feel right.

So, we redesigned it. The result is v2 of the `buf.yaml` configuration file, combining the configuration of modules and workspaces into one easily understood file, with all modules within the workspace sharing the same external dependencies.

## First-class monorepo support with `buf.yaml` v2

A v2 `buf.yaml` combines the power of `buf.work.yaml` and v1 `buf.yaml` into one configuration file that manages all Protobuf files in your source control repository. It shares most of the shape of v1, but with key differences that enable monorepos to be supported properly.

Here's a simple example:

```protobuf
version: v2
# modules contains all of the modules defined within your source control repository.
#
# For the common case where there is a single module whose path is ".", this section
# can be omitted, and a module name can be specified at the top-level.
modules:
  # Each module has a path.
  # This is the path to the module relative to the location of the buf.yaml
  #
  # The name key is also available here. If names are specified for all modules in
  # this buf.yaml, the entire workspace can be pushed to the BSR.
  - path: proto
    # A second module containing files that are locally vendored.
  - path: vendor
    # This module has its own lint configuration that is separate from the default lint
    # configuration applied to modules without individual lint configurations.
    lint:
      use:
        - MINIMAL
      ignore:
        # All file paths in buf.yaml are now relative to the location of buf.yaml.
        - vendor/files-not-on-bsr/a.proto
# Modules now share a common set of dependencies. This was the major concern with the v1
# buf.work.yaml and v1 buf.yaml setup - every module had its own (potentially conflicting)
# set of dependencies, which made simultaneously pushing the modules impossible, and led
# many commands within the buf CLI to effectively mash the dependencies together in ways
# not exposed to users.
#
# There will be a single buf.lock file produced, which lives alongside this buf.yaml.
deps:
  - buf.build/googleapis/googleapis
  - buf.build/grpc/grpc
# The default lint configuration applied to modules specified in this file.
lint:
  use:
    - DEFAULT
    - UNARY_RPC
# The default breaking configuration applied to modules specified in this file.
breaking:
  use:
    - PACKAGE
```

In v1, you'd achieve this with three separate files:

**proto/buf.yaml**

```protobuf
# proto/buf.yaml
version: v1
deps:
  - buf.build/googleapis/googleapis
lint:
  use:
    - DEFAULT
    - UNARY_RPC
breaking:
  use:
    - PACKAGE
```

**vendor/buf.yaml**

```protobuf
# vendor/buf.yaml
version: v1
deps:
  # vendor also depends on googleapis. This would mean that both proto/buf.lock and vendor/buf.lock
  # would exist, potentially with conflicts.
  - buf.build/googleapis/googleapis
  - buf.build/grpc/grpc
lint:
  use:
    - MINIMAL
breaking:
  use:
    - PACKAGE
```

**buf.work.yaml**

```protobuf
# buf.work.yaml
version: v1
directories:
  - proto
  - vendor
```

**We always recommend storing your `buf.yaml` at the root of your source control repository going forward, even for single-module cases where a module lives in a subdirectory.**

Here's an example of a single module living under a `proto` directory:

```protobuf
version: v2
modules:
  - path: proto
    name: buf.build/acme/finance
deps:
  - buf.build/googleapis/googleapis
  - buf.build/grpc/grpc
lint:
  use:
    - DEFAULT
    - UNARY_RPC
breaking:
  use:
    - PACKAGE
```

## Better code generation configuration with `buf.gen.yaml` v2

Alongside v2 `buf.yaml`, we're releasing v2 `buf.gen.yaml`, which improves the configuration of managed mode, allows input definitions, and allows flags/arguments to be configured directly in the file. There's no longer a need to wrap `buf generate` calls in a `Makefile` - all information needed to invoke `buf generate` can be directly stored in your `buf.gen.yaml`.

### Managed mode UX improvements

The need to provide language-specific file options in your language-agnostic Protobuf APIs has always been a source of frustration. [Managed mode](/docs/generate/managed-mode/index.md) has proven to be an extremely popular solution for this. With managed mode, you move this concern away from the API producer, into a single configuration file written by the API consumer: the `buf.gen.yaml` file.

In the past, configuration of managed mode could be confusing. Here's an example from v1:

```protobuf
# This is a v1 example - we agree it is not great! Keep scrolling to see this
# cleaned up in v2.

version: v1
managed:
  # Enable managed mode.
  # This will result in file options being overridden for all Protobuf files.
  enabled: true
  # Override managed mode's default setting for the "optimize_for" file option by setting it to
  # "CODE_SIZE" for all Protobuf files.
  optimize_for: CODE_SIZE
  # Override managed mode's default setting for the "go_package" file option for all Protobuf
  # files.
  go_package_prefix:
    # go_package will be "github.com/acme/finance/gen/go/path/to/dir/of/proto_file" by default.
    default: github.com/acme/finance/gen/go
    except:
      # Do not override go_package for any file coming from the
      # buf.build/googleapis/googleapis module.
      - buf.build/googleapis/googleapis
    override:
      # go_package will be "github.com/acme/billing/path/to/dir/of/proto_file" for any file
      # coming from the buf.build/acme/billing module
      buf.build/acme/billing: github.com/acme/billing
  # Override managed mode's default setting for the "java_package" file option for all Protobuf
  # files.
  java_package_prefix:
    # "java_package" will be "org.proto.package.name" by default.
    default: "org"
    override:
      JAVA_PACKAGE:
        # For the file at path acme/finance/v1/finance.proto, directly set the "java_package"
        # file option to "org.finance".
        acme/finance/v1/finance.proto: "org.finance"
```

Without comments, would you understand the exact behavior of the above configuration? Would you remember how to do this configuration if you had to reproduce it? We wrote the spec, and we both don't intuitively understand it, nor remember how to reproduce it without looking at our own docs. If we can't understand it, we shouldn't expect you to.

In v2, we've improved the managed mode experience by standardizing all customizations into two categories:

- `disable`: Disable managed mode for a specified file or field option, optionally filtered to a module and/or path.
- `override`: Override manage mode's default behavior for a specified file or field option, optionally filtered to a module and/or path.

Here's the above example replicated in v2:

```protobuf
version: v2
managed:
  enabled: true
  disable:
    - file_option: go_package
      module: buf.build/googleapis/googleapis
  override:
    - file_option: optimize_for
      value: CODE_SIZE
    - file_option: go_package_prefix
      value: github.com/acme/finance/gen/go
    # This rule takes precedence over the previous rule as it appears later in the override list.
    - file_option: go_package_prefix
      module: buf.build/acme/billing
      value: github.com/acme/billing
    - file_option: java_package_prefix
      value: org
    - file_option: java_package
      path: acme/finance/v1/finance.proto
      value: org.finance
```

### Configuring `buf generate` arguments in `buf.gen.yaml`

A common issue with `buf generate` was that while you could configure your plugins and managed mode options within your `buf.gen.yaml`, you couldn't configure the inputs that you would then be generating against — inputs had to be specified on the command-line. v2 `buf.gen.yaml` solves this; instead of having to invoke:

```protobuf
buf generate proto \
  --path proto/acme \
  --exclude-path proto/acme/billing
buf generate vendor
buf generate https://github.com/acme/tax#branch=dev \
  --path proto/acme/bar
```

You can now specify this information directly in a v2 `buf.gen.yaml`, like so:

```protobuf
version: v2
inputs:
  - directory: proto
    paths:
      - proto/acme
    exclude_paths:
      - proto/acme/billing
  - directory: vendor
  - git_repo: https://github.com/acme/tax
    branch: dev
```

Values for all of the [types of inputs](/docs/reference/inputs/index.md) that `buf` accepts are available, as well as their options.

Other flags can be specified as well:

`--include-imports, include-wkt`: Now a plugin-specific option:

```protobuf
version: v2
plugins:
  - remote: buf.build/protocolbuffers/dart
    include_imports: true
    include_wkt: true
```

`--type`: A flag many of you may not know about! `buf generate` has the ability to only generate for specific _types_ (packages, messages, enums, extensions, services, or methods) within an input. For example, this is useful when mobile clients would like to perform tree-shaking to reduce their binary size. Type filters can be applied directly to an input:

```protobuf
version: v2
inputs:
  - directory: proto
    types:
      - acme.billing.v1.BillingService
      - acme.billing.v2
```

### Backwards compatibility

Don't panic! You can still specify inputs on the command-line and all other `buf generate` flags and arguments continue to work. Flags and arguments override any value specified within a `buf.gen.yaml`, making it so that your current call patterns continue to work, while providing you a path to override values in specific `buf.gen.yaml` files as needed.

## Migrating your configuration files

Migrating to the v2 `buf.yaml` and `buf.gen.yaml` file is easy! In your source control repository, just call:

```protobuf
buf config migrate
```

This command will find all `buf.yaml`, `buf.gen.yaml`, and `buf.work.yaml` files, and upgrade them to v2 `buf.yaml` and `buf.gen.yaml` files - in 99% of cases, it's that easy.

In a few cases, you may not want to migrate all your files, or you may have files that aren't detected:

- You may have `buf.gen.yaml` files with a name other than `buf.gen.yaml` - for example, at Buf we have bunch of templates we pass to `buf generate`, all with special file names.
- You may want to keep v1 `buf.yaml` files around for testing purposes. In all likelihood, the only people who will want to do this are ourselves - we keep v1 (and v1beta1!) files in the `buf` source control repository to ensure compatibility.

In this case, you can bypass `buf config migrate`'s file search, and manually specify exactly what you'd like to migrate:

```protobuf
buf config migrate --buf-gen-yaml templates/buf.client.gen.yaml
buf config migrate --workspace proto
buf config migrate --module proto/module1 --module proto/module2
```

More information is available in [our migration guide](/docs/migration-guides/migrate-v2-config-files/index.md).

## The `buf mod` subcommand has been deprecated and all subcommands have been moved

As part of this work to make `buf.yaml` manage entire monorepos, the commands in `buf mod` didn't really make sense to be listed as module-specific commands. As such, we moved all of the commands to new locations:

- `buf mod init` has become `buf config init`.
- `buf mod prune` has become `buf dep prune`.
- `buf mod update` has become `buf dep update`.
- `buf mod ls-breaking-rules` has become `buf config ls-breaking-rules`.
- `buf mod ls-lint-rules` has become `buf config ls-lint-rules`.
- `buf mod {clear-cache,cc}` has become `buf registry cc`.

All existing `buf mod` subcommands will continue to work. You'll just see a deprecation message printed to STDERR informing you of the command's new location.

```protobuf
$ buf mod update
Command "update" is deprecated, use "buf dep update" instead. However, "buf mod update" will continue to work.
```

## Conclusion

We're excited to share the next generation of the `buf` CLI with you! A few of our early customers have been using betas of `v1.32.0` for a few weeks, and have been enjoying the experience. If we were successful, you shouldn't notice any changes. If you do, that's a bug — [file an issue](https://github.com/bufbuild/buf/issues), and we'll get right on it. Similarly, if there are any improvements you'd like to see in the CLI, we would love that feedback too!

The first generation of `buf` gave us almost five years of better Protobuf development across the industry. We hope the second generation lasts us the next five, while continuing to support all your existing workflows.

‍
