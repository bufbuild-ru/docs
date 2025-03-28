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

```console
$ pip install connectrpc-eliza-protocolbuffers-python
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

If you need a more specific version than the latest, such as needing to install a specific plugin version, you can use the [`buf registry sdk version` command](../../../reference/cli/buf/registry/sdk/version/).The BSR supports [commits on labels](../../../concepts/modules-workspaces/#referencing-a-module). This feature enables you to push unreleased Protobuf file changes and consume generated code without affecting the [default label](../../../concepts/repositories/#default-label).Only commits that are on the default label at the time they're pushed to the BSR have populated timestamps. Timestamps on commits pushed to other labels are set to `dev` to easily distinguish them as changes in labels that are still in development.

## Other package managers

Because the BSR Python repository implements [PEP 503](https://peps.python.org/pep-0503/), you should be able to use it with package management tools outside of `pip`, such as [poetry](https://python-poetry.org), [pipenv](https://pipenv.pypa.io/en/latest/), [conda](https://docs.conda.io/en/latest/) and others.

## Available plugins

For a full list of supported plugins, navigate to the [BSR plugins page](https://buf.build/plugins) and search for Python.To learn more about how these plugins are packaged and distributed, go to the [bufbuild/plugins repository](https://github.com/bufbuild/plugins). If you find a useful plugin that you think should be added, [file an issue](https://github.com/bufbuild/plugins/issues/new/choose).

## Troubleshooting

### I get a 422 status code when trying to install a Python generated SDK. How do I get more information about what went wrong?

A 422 status code means that the plugin failed to run. You can `curl` the wheel endpoint (which `pip` provides in the error message as a URL ending in `.whl`) or open it in your browser to get more details about the failure.

## Related docs

- Try the [generated SDKs tutorial](../tutorial/) to learn how to generate SDKs from the BSR.
