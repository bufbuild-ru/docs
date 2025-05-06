---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/npm/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/maven/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/nuget/"
  - - meta
    - property: "og:title"
      content: "NPM - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/generated-sdks/npm.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/generated-sdks/npm/"
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
      content: "NPM - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/generated-sdks/npm.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# NPM

The Buf Schema Registry provides generated SDKs for JavaScript-based languages in the form of an NPM registry, just like any other JavaScript library. It generates SDKs automatically when you push schema changes, which eliminates the need to manage a Protobuf toolchain or generate code locally.

The BSR's NPM registry is hosted at buf.build/gen/npm/v1. See the [tutorial](../tutorial/) for instructions on how to access generated SDKs from the BSR directly.

## Setup

NPM is configured to use the public NPM registry at [registry.npmjs.org](https://registry.npmjs.org) by default. To configure NPM to use Buf's NPM registry for the `@buf` package scope, use this command to [set](https://docs.npmjs.com/cli/v8/commands/npm-config#set) your NPM config:

```console
$ npm config set @buf:registry https://buf.build/gen/npm/v1
```

This updates your global [`.npmrc`](https://docs.npmjs.com/cli/v8/configuring-npm/npmrc) to fetch `@buf/*` SDKs from the BSR. You can configure [Yarn](https://yarnpkg.com) in an analogous way:

```console
$ yarn config set @buf:registry https://buf.build/gen/npm/v1
```

### Using private packages

To install SDKs generated from private [Buf modules](../../../cli/modules-workspaces/), you need to configure NPM to send an authentication token with each request to the BSR NPM registry:

```console
$ npm config set //buf.build/gen/npm/v1/:_authToken {token}
```

This command adds an entry to your [`.npmrc`](https://docs.npmjs.com/cli/v8/configuring-npm/npmrc) file:

::: info .npmrc token syntax

```console
//buf.build/gen/npm/v1/_authToken=AUTH_TOKEN

# Example
//buf.build/gen/npm/v1/:_authToken=84612b6cbe8f4...
```

:::

You can use an existing auth token or generate a new one. To create a new one, log into the [BSR](../../), navigate to your [user settings](https://buf.build/settings/user) page, and click **Create Token**.

## Using the NPM registry

The BSR NPM registry has a special syntax for SDK names:

::: info Package name syntax

```console
npm install @buf/MODULE-OWNER_MODULE-NAME.PLUGIN-OWNER_PLUGIN-NAME

Example:
npm install @buf/connectrpc_eliza.bufbuild_es
```

:::

In this example, `@buf/connectrpc_eliza.bufbuild_es`, the BSR generates code for the [`connectrpc/eliza`](https://buf.build/connectrpc/eliza) module using the [`bufbuild/es`](https://buf.build/bufbuild/es) plugin.

## Installing SDKs

With your NPM config [set](#setup), you can install `@buf/*` SDKs in any standard NPM project. Here's an example installation command:

```console
$ npm install @buf/connectrpc_eliza.bufbuild_es
```

::: tip Slow installation?
You may notice that installing SDKs from the BSR NPM registry using `npm install` can take longer than installing from the standard NPM registry. This happens because they're lazily generated and then cached. The first `npm install` typically takes longer than subsequent requests because of this.
:::

## Versions

By default, when you `npm install` a [Buf module](../../../cli/modules-workspaces/), the BSR generates code from the most recent [reference](../../../cli/modules-workspaces/#referencing-a-module) for the module. However, you can also install a specific SDK version using NPM's standard `@` syntax, referencing an explicit version or a commit or label name. To discover SDK versions, you can browse a repository's SDK page, which has installation instructions and an interactive UI.

The basic install command is:

```console
$ npm install @buf/connectrpc_eliza.bufbuild_es
```

### Latest

If you don't specify a version, NPM fetches `@latest` by default, but you can also specify it:

```console
$ npm install @buf/connectrpc_eliza.bufbuild_es@latest
```

### Commit

The SDK uses the `commit-` prefix to indicate that a commit is being referenced.

To get the generated SDK for the module at a commit, using the latest plugin version:

```console
$ npm install @buf/connectrpc_eliza.bufbuild_es@commit-8b8b971d6fde4dc8ba5d96f9fda7d53c
```

### Label

The BSR supports [commits on labels](../../../cli/modules-workspaces/#referencing-a-module). This feature enables you to push unreleased Protobuf file changes and consume generated code without affecting the [default label](../../repositories/#default-label). The SDK uses the `label-` prefix to indicate that a label is being referenced.

To get the generated SDK for the module at a label, using the latest plugin version:

```console
$ npm install @buf/connectrpc_eliza.bufbuild_es@label-demo
```

::: tip Note
Labels with names that contain `/` aren't compatible with the NPM registry versioning scheme.
:::

### Full syntax

```console
PLUGIN_VERSION-MODULE_TIMESTAMP-COMMIT_ID.PLUGIN_REVISION

# Example
2.2.2-20230913231627-233fca715f49.1
```

With SDK versions (valid [semver](https://semver.org)):

- The version core is the plugin version **1.11.0**
- The semver pre-release version is composed of:
  - module commit timestamp (YYYYMMDDHHMMSS) **20230727062025**
  - module commit short name (12 characters) **d8fbf2620c60**
- The final identifier is the plugin revision **1** for the plugin version

Most users likely want to use `@latest`, but if you need to reference an SDK version explicitly, you can do so like this:

```console
$ npm install @buf/connectrpc_eliza.bufbuild_es@2.2.2-20230913231627-233fca715f49.1
```

If you need a more specific version than the `@latest`, `@commit-` or `@label-` shorthands, such as needing to install a specific plugin version, you can use the [`buf registry sdk version` command](../../../reference/cli/buf/registry/sdk/version/).

Only commits that are on the default label at the time they're pushed to the BSR have populated timestamps. Timestamps on commits pushed to other labels are zeroed out with `00000000000000` to easily distinguish them as changes in labels still in development.

## Other package managers

Because the BSR NPM registry implements NPM's [public registry API](https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md), you should be able to use it with package management tools outside of NPM, such as [Yarn](https://yarnpkg.com) and [pnpm](https://pnpm.io), though with some known limitations.

Be aware that [Yarn](https://yarnpkg.com) versions greater than [v1.10.0](https://github.com/yarnpkg/yarn/releases/tag/v1.10.0) and less than [v2](https://github.com/yarnpkg/berry) _aren't_ supported. These versions of Yarn require the `shasum` field in the dist object to be set, but the BSR can't compute a digest without generating the code for all possible versions of the package.

## Available plugins

For a full list of supported plugins, navigate to the [BSR plugins page](https://buf.build/plugins) and search for JavaScript or TypeScript.

To learn more about how these plugins are packaged and distributed check out the [bufbuild/plugins repository](https://github.com/bufbuild/plugins). If you find a useful plugin that you think should be added, [file an issue](https://github.com/bufbuild/plugins/issues/new/choose).
