---
description: "Quickstart demonstrating how to use the Buf Schema Registry's generated SDKs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/tutorial/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/sdk-documentation/"
  - - meta
    - property: "og:title"
      content: "Quickstart - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/generated-sdks/tutorial.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/generated-sdks/tutorial/"
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
      content: "Quickstart - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/generated-sdks/tutorial.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Generated SDKs quickstart

The Buf Schema Registry (BSR) generates SDKs that contain code generated from Protobuf schemas (stored as Buf modules) and plugins. They can be installed as dependencies using popular package managers like Cargo, Go, Gradle, Maven, NPM, pip, and Swift Package Manager, enabling you to easily consume Protobuf APIs without manually generating code or interacting with the schemas directly. For example, mobile or web teams who don't directly own Protobuf schemas can use generated SDKs to consume Protobuf APIs from other teams.

This quickstart shows how to depend on the generated SDK for the `connectrpc/eliza` module using NPM. The process is similar for other SDKs.

## Prerequisites

- [Create a Buf account](https://buf.build/signup), if you haven't already
- [Sign in to the BSR](https://buf.build/login)

## Select generated SDKs

Usually, you'll have a direct URL for the module you want to use, either from the schema owner or your internal documentation. You can also search for its repository if you know the name.

1.  In the search bar at the top of the BSR, enter `connectrpc/eliza`. A dropdown of results appears — click **connectrpc/eliza** to go to the repository.

    ![Screenshot of search dropdown](../../../images/bsr/sdks/sdk-search.png)

2.  Click the **SDKs** tab to see the categories of generated SDKs:

    ![Screenshot of default view of SDKs tab](../../../images/bsr/sdks/sdk-all.png)

3.  Click on the JavaScript icon — a gallery of JavaScript-compatible plugins appears. Then click **bufbuild/es** to choose the `bufbuild/es` plugin. The install instructions for the plugin display.

    ![Screen shot of bufbuild/es install instructions](../../../images/bsr/sdks/sdk-install.png)

::: tip Recommended SDKs
If you're on a private BSR instance, you may see a "Recommended" category in addition to the ecosystem collections and languages. The SDKs in this category have been recommended by the instance, organization, or module admins as the preferred ones to use.

If a recommended SDK has a build issue, it displays an error message and provides a share link so you can copy the SDK URL and notify the module admin.

![Example of a recommended SDK with an error message](../../../images/bsr/sdks/sdk-recommended-error.png)
:::

Each SDK has a different set of instructions depending on the language and the ecosystem. Some plugins provide multiple package manager options, each in a separate tab. For plugins where generated SDKs aren't available, the installation instructions provide an archive download link — see the [Downloading an archive](#download-archive) section for more details about archives.

Some SDKs also have the option to create an authorization token. If you choose to create one from this screen, it appends it to the command for you to copy. Otherwise, add a token you already have in place of `{token}`.

If the plugin has dependencies installed as part of the SDK, they're listed in a **Dependencies** section below the installation instructions.

Follow the provided installation instructions to install the SDK. Some SDKs also provide a "Getting started" guide to help you integrate further.

## Change the module version or label

The BSR defaults to providing SDKs at the latest module and plugin versions unless otherwise specified. To pin SDKs to a specific module version, click the dropdown in the top right of the **SDKs** tab and choose a commit or label:

![Screen shot of label dropdown](../../../images/bsr/commit-tag-dropdown.png)

Notice that when you make these changes, the installation command updates to reflect the new version:

```sh
npm install @buf/connectrpc_eliza.bufbuild_es@2.2.2-20230822171018-8b8b971d6fde
```

This syntax identifies the plugin version first, then the exact commit in the repository that the `demo` label represents.

## Change the plugin version

You can pin the SDK to a specific plugin version by going to the **Version** dropdown at the top of the **Installation instructions** section:

![Screenshot of Version dropdown](../../../images/bsr/sdks/sdk-version-dropdown.png)

## Download an archive

Some plugins aren't compatible with package managers, so instead you can download an archive that contains the output of code generation for a combination of any module and Protobuf plugin. This enables you to transform your pre-validated Protobuf schemas into other formats such as JSON Schema or BigQuery for use in later processing steps. You can also use archives with CI/CD workflows or data pipelines.

For plugins that _are_ compatible with package managers, we recommend installing the generated SDK for a better user experience. The archive download link doesn't appear in the BSR for them, but if you prefer an archive, you can use the `curl` commands below.

To generate an archive, you can either:

- Download the archive from the BSR web app, or
- Download via the BSR API using `curl` (this is necessary if you want to include imports or Well Known Types, or pin to a specific module commit)

### Download from the BSR web app

To download an archive from the web app:

1.  Go to the module you want and click the **SDKs** tab.
2.  Choose the plugin for the SDK.
3.  If desired, change the plugin version and/or module label by using the dropdowns, the same as for a generated SDK above.
4.  Click **Download archive** at the top right of the SDK section, choose the archive format, and click **Download** or copy the URL to use with `curl`.

### Download with the BSR API

To download an archive using the BSR API and `curl`, you need to construct a command with the module, plugin, and reference information. The URL contains these elements:

- _BSR_INSTANCE_ is the domain name of your BSR instance. (Default: `buf.build`)
- _MODULE_OWNER_ is the owner of the module.
- _MODULE_NAME_ is the name of the module.
- _PLUGIN_OWNER_ is the owner of the plugin.
- _PLUGIN_NAME_ is the name of the plugin.
- _REFERENCE_ must be one of the following:
  - `latest`: Uses the most recent versions of both the module (on its default label) and the plugin.
  - A [label name](../../commits-labels/#labels): Uses the latest commit for the given label and the most recent plugin version.
  - A commit ID: Uses the explicit BSR module commit and the most recent plugin version. The commit must be the full module commit name.
- _FILE_EXT_ is the file extension of the archive. This can be either `tar.gz` or `zip`.

Hitting this endpoint always returns a 302 redirect to the download URL, so clients must handle the redirect independently.

::: info Syntax for latest version of plugin

```bash
$ curl -fsSL -O https://BSR_INSTANCE/gen/archive/MODULE_OWNER/MODULE_NAME/PLUGIN_OWNER/PLUGIN_NAME/REFERENCE.FILE_EXT

# Get latest version of module's default label
$ curl -fsSL -O https://buf.build/gen/archive/connectrpc/eliza/bufbuild/protoschema-jsonschema/latest.zip

# Get latest version of specific module label ('demo')
$ curl -fsSL -O https://buf.build/gen/archive/connectrpc/eliza/bufbuild/protoschema-jsonschema/demo.zip

# Get specific module commit
$ curl -fsSL -O https://buf.build/gen/archive/connectrpc/eliza/bufbuild/protoschema-jsonschema/d8fbf2620c604277a0ece1ff3a26f2ff.zip
```

:::

You can also set the `imports` and `wkt` parameters to include the module's imports and/or the Well Known Types. This behaves the same as applying the `--include_imports` and `--include_wkt` flags to `buf generate` at the command line or setting them in `buf.gen.yaml`. Both flags must be set to include the Well Known Types.

::: info Syntax for imports and Well Known Types

```bash
$ curl -fsSL -O "https://buf.build/gen/archive/connectrpc/eliza/bufbuild/protoschema-jsonschema/latest.zip?imports=true&wkt=true"
```

:::

#### Specific plugin version and module commit

If you need to pin the archive to a specific plugin version and module commit, the `curl` syntax changes slightly. The `latest` and label name references aren't available in this case, so you must specify the reference in the format `vX.Y.Z-commit.N`:

- _X.Y.Z_ and _N_ are the plugin version and revision number respectively, which you can view in the sample URL on the SDK's installation page.
- `commit` is the shortened 12-character module commit name.

::: info Syntax for specific plugin version and module commit

```bash
$ curl -fsSL -O https://BSR_INSTANCE/gen/archive/MODULE_OWNER/MODULE_NAME/PLUGIN_OWNER/PLUGIN_NAME/vX.Y.Z-commit.N.FILE_EXT

# Get specific module commit and plugin version
$ curl -fsSL -O https://buf.build/gen/archive/connectrpc/eliza/bufbuild/protoschema-jsonschema/v0.3.1-d8fbf2620c60.1.zip
$ curl -fsSL -O "https://buf.build/gen/archive/connectrpc/eliza/bufbuild/protoschema-jsonschema/v0.3.1-d8fbf2620c60.1.zip?imports=true"
$ curl -fsSL -O "https://buf.build/gen/archive/connectrpc/eliza/bufbuild/protoschema-jsonschema/v0.3.1-d8fbf2620c60.1.zip?imports=true&wkt=true"
```

:::
