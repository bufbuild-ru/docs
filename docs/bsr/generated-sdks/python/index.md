---
description: "Installation and usage instructions for using Buf's generated SDKs with Python"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/python/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/nuget/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/swift/"
  - - meta
    - property: "og:title"
      content: "Python - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/generated-sdks/python.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/generated-sdks/python/"
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
      content: "Python - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/generated-sdks/python.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Python

The Buf Schema Repository (BSR) provides generated SDKs for Python in the form of a [PEP 503](https://peps.python.org/pep-0503/)\-compatible repository. You can consume generated SDKs from modules and plugins using dependency management tools like [`pip`](https://pip.pypa.io/en/stable/). It generates SDKs automatically when you push schema changes, which eliminates the need to manage a Protobuf toolchain or generate code locally.

## Setup using `pip`

`pip` is configured to use the [Python Package Index](https://pypi.org) by default. To use Buf's Python repository with `pip`, you can either specify `--extra-index-url https://buf.build/gen/python` in all of your `pip` invocations, or [configure `pip`](https://pip.pypa.io/en/stable/topics/configuration/) to include the argument by default:

::: info pip.conf

```ini
[global]
extra-index-url = https://buf.build/gen/python
```

:::

## Private generated SDKs

`pip` supports [.netrc authentication](https://pip.pypa.io/en/stable/topics/authentication/#netrc-support). To set up your .netrc with your BSR credentials, run `buf registry login`. For more information, check out our [authentication docs](../../authentication/#authenticating-locally).

## Installing generated SDKs

To install a generated SDK, use `pip install` and reference the SDK name. For example, to install the [`connectrpc/eliza`](https://buf.build/connectrpc/eliza) Protobuf module using the [`protocolbuffers/python`](https://buf.build/protocolbuffers/python) plugin, you could install the generated SDK like this:

```sh
pip install connectrpc-eliza-protocolbuffers-python
```

See the [names and versions](#remote) section for syntax specifics.

## Importing from SDKs

In general, Python Protobuf plugins generate code that matches the package structure of their input Protobuf files, so having your import path match the package structure of your Protobuf files should work. For example, to import from the `connectrpc-eliza-protocolbuffers-python` package generated from the [buf.build/connectrpc/eliza](https://buf.build/connectrpc/eliza) module, the path looks like this:

```python
from connectrpc.eliza.v1.eliza_pb2 import SayRequest
```

## Names and versions

The BSR Python repository has a special syntax for SDK names:

```text
{moduleOwner}-{moduleName}-{pluginOwner}-{pluginName}
```

For example, the SDK name `connectrpc-eliza-protocolbuffers-python` contains code for the [`connectrpc/eliza`](https://buf.build/connectrpc/eliza) module using the [`protocolbuffers/python`](https://buf.build/protocolbuffers/python) plugin.

### Versions

To discover SDK versions for the Python repository, you can browse a repository's generated SDK page, which has installation instructions and an interactive UI for selecting SDK versions.

### Full syntax

```text
{pluginVersion}.{pluginRevision}.{commitTimestamp}+{commitShortName}
```

As an example:

```text
25.0.0.3.20231106214313+d8fbf2620c60
```

That represents:

- Plugin version: `25.0.0`
- Plugin revision: `3`
- Commit timestamp: `20231106214313`
- Commit short name: `d8fbf2620c60`

If you need a more specific version than the latest, such as needing to install a specific plugin version, you can use the [`buf registry sdk version` command](../../../reference/cli/buf/registry/sdk/version/).

The BSR supports [commits on labels](../../../cli/modules-workspaces/#referencing-a-module). This feature enables you to push unreleased Protobuf file changes and consume generated code without affecting the [default label](../../repositories/#default-label).

Only commits that are on the default label at the time they're pushed to the BSR have populated timestamps. Timestamps on commits pushed to other labels are set to `dev` to easily distinguish them as changes in labels that are still in development.

## Other package managers

Because the BSR Python repository implements [PEP 503](https://peps.python.org/pep-0503/), you should be able to use it with package management tools outside of `pip`, such as [poetry](https://python-poetry.org), [pipenv](https://pipenv.pypa.io/en/latest/), [conda](https://docs.conda.io/en/latest/) and others.

## Available plugins

For a full list of supported plugins, navigate to the [BSR plugins page](https://buf.build/plugins) and search for Python.

To learn more about how these plugins are packaged and distributed, go to the [bufbuild/plugins repository](https://github.com/bufbuild/plugins). If you find a useful plugin that you think should be added, [file an issue](https://github.com/bufbuild/plugins/issues/new/choose).

## Troubleshooting

### I get a 422 status code when trying to install a Python generated SDK. How do I get more information about what went wrong?

A 422 status code means that the plugin failed to run. You can `curl` the wheel endpoint (which `pip` provides in the error message as a URL ending in `.whl`) or open it in your browser to get more details about the failure.

### Python generated SDK dependency resolution is slow - what could be causing this?

There are certain ecosystems like python and npm that make use of an index page in their underlying package registry protocols. The size of an SDK's index page grows as the number of plugin versions and module commits increases, potentially increasing times to resolve packages.

The BSR provides a custom endpoint for Python package managers to fetch a flattened list of all packages in the dependency graph for a given SDK. This list can be used to aid package managers in dependency resolution by constraining the search for dependencies to within the given package constraints. This list can be fetched from:

```text
https://buf.build/gen/python/deps/{moduleOwner}-{moduleName}-{pluginOwner}-{pluginName}/{version}`
```

This endpoint follows the BSR's conventions for Python [names](#remote) and [versions](#full-syntax). You can exercise the endpoint with curl:

```console
 $ curl https://buf.build/gen/python/deps/acme-petapis-grpc-python/1.72.1.1.20220907172654+7abdb7802c8f
```

This should return a successful response in the form of:

```console
{
    "packages": [
        {
            "name": "acme-petapis-grpc-python",
            "version": "1.69.0.1.20250511171428+1269324e55bf"
        },
        {
            "name": "acme-petapis-protocolbuffers-python",
            "version": "29.2.0.1.20250511171428+1269324e55bf"
        },
        {
            "name": "acme-petapis-protocolbuffers-pyi",
            "version": "29.2.0.1.20250511171428+1269324e55bf"
        },
        {
            "name": "acme-paymentapis-grpc-python",
            "version": "1.69.0.1.20250511171427+1beaca87b579"
        },
        {
            "name": "googleapis-googleapis-grpc-python",
            "version": "1.69.0.1.20250511171426+6310aaead7ba"
        },
        {
            "name": "acme-paymentapis-protocolbuffers-python",
            "version": "29.2.0.1.20250511171427+1beaca87b579"
        },
        {
            "name": "googleapis-googleapis-protocolbuffers-python",
            "version": "29.2.0.1.20250511171426+6310aaead7ba"
        },
        {
            "name": "acme-paymentapis-protocolbuffers-pyi",
            "version": "29.2.0.1.20250511171427+1beaca87b579"
        },
        {
            "name": "googleapis-googleapis-protocolbuffers-pyi",
            "version": "29.2.0.1.20250511171426+6310aaead7ba"
        }
    ]
}
```

In practice to use this endpoint with Poetry, you can combine the `curl` command with `jq` to create a flattened dependency list that can be directly added to the `tool.poetry.dependencies` section of your `pyproject.toml` file. The command would look like:

```console
 $ curl -s https://buf.build/gen/python/deps/acme-petapis-grpc-python/1.72.1.1.20220907172654+7abdb7802c8f | jq -r '.packages[] | "\(.name) = {version = \"~\(.version)\", source = \"buf\"}"'
```

This response would be added to `pyproject.toml`:

```console
acme-petapis-grpc-python = {version = "~1.72.1.1.20220907172654+7abdb7802c8f", source = "buf"}
acme-petapis-protocolbuffers-python = {version = "~31.1.0.1.20220907172654+7abdb7802c8f", source = "buf"}
acme-petapis-protocolbuffers-pyi = {version = "~31.1.0.1.20220907172654+7abdb7802c8f", source = "buf"}
acme-paymentapis-grpc-python = {version = "~1.72.1.1.20220907172603+9a877cf260e1", source = "buf"}
googleapis-googleapis-grpc-python = {version = "~1.72.1.1.20220906171522+62f35d8aed11", source = "buf"}
acme-paymentapis-protocolbuffers-python = {version = "~31.1.0.1.20220907172603+9a877cf260e1", source = "buf"}
googleapis-googleapis-protocolbuffers-python = {version = "~31.1.0.1.20220906171522+62f35d8aed11", source = "buf"}
acme-paymentapis-protocolbuffers-pyi = {version = "~31.1.0.1.20220907172603+9a877cf260e1", source = "buf"}
googleapis-googleapis-protocolbuffers-pyi = {version = "~31.1.0.1.20220906171522+62f35d8aed11", source = "buf"}
```
