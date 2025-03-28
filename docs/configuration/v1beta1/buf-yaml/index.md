# buf.yaml v1beta1 configuration

::: tip NoteThe `v1beta1` configuration file described in this page is deprecated and we recommend upgrading to a [`v2`](../../v2/buf-yaml/) configuration. For instructions and context, see the [migration guide](../../../migration-guides/migrate-v2-config-files/).

:::

The `buf.yaml` file defines a [module](../../../concepts/modules-workspaces/), and is placed at the root of the Protobuf source files it defines. The placement of the `buf.yaml` configuration tells `buf` where to search for `.proto` files, and how to handle imports.This file contains [lint](../../../lint/rules/) and [breaking change detection](../../../breaking/rules/) rules, and if applicable, the name of your module and a list of dependencies.

## Default values

The `buf.yaml`config file below demonstrates all default values being explicitly set, this file is the equivalent of no options being set in your `buf.yaml` at all.

::: info buf.yaml

```yaml
version: v1beta1
name: ""
deps: []
build:
  roots:
    - .
  excludes: []
lint:
  use:
    - STANDARD
  enum_zero_value_suffix: _UNSPECIFIED
  rpc_allow_same_request_response: false
  rpc_allow_google_protobuf_empty_requests: false
  rpc_allow_google_protobuf_empty_responses: false
  service_suffix: Service
breaking:
  use:
    - FILE
```

:::

## Fields

### `version`

The `version` key is **required**, and defines the current configuration version. The only accepted values are `v1beta1` and `v1`.

### `name`

The `name` is **optional**, and uniquely identifies your module. The `name` **must** be a valid [module name](../../../concepts/modules-workspaces/) and is directly associated with the repository that owns it.

### `deps`

The `deps` key is **optional**, and declares one or more modules that your module depends on. Each `deps` entry **must** be a module reference, and, is directly associated with a repository, as well as a [reference](../../../concepts/modules-workspaces/#referencing-a-module), which is either a tag or commit. A complete example of the different `deps` format is shown below:

::: info buf.yaml

```yaml
version: v1beta1
name: buf.build/acme/petapis
deps:
  - buf.build/acme/paymentapis # The latest commit.
  - buf.build/acme/pkg:47b927cbb41c4fdea1292bafadb8976f # The '47b927cbb41c4fdea1292bafadb8976f' commit.
  - buf.build/googleapis/googleapis:v1beta1.1.0 # The 'v1beta1.1.0' label.
```

:::

> Depending on specific references is an advanced feature; you should depend on the latest commit whenever possible. In other words, your `deps` don't need to include the `:<reference>` suffix in most cases.

### `build`

The `build` key is **optional**, and is used to include and exclude specific Protobuf source files in the module defined by the `buf.yaml`. Here is an example of all configuration options for `build`:

::: info buf.yaml

```yaml
version: v1beta1
build:
  roots:
    - proto
    - vendor/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis
  excludes:
    - proto/foo/bar
```

:::

#### `excludes`

This is a list of the directories to ignore from `.proto` file discovery. Any directories added to this list are completely skipped and not included in the module. **We don't recommend using this option**, however in some situations it's unavoidable.

#### `roots`

> `roots` are no longer recommended and have been removed in `v1` in favor of [workspaces](../../../reference/workspaces/). If you have any `roots` configured, see the [`v2` migration guide](../../../migration-guides/migrate-v2-config-files/).

This is a list of the directories that contain your `.proto` files. The directory paths must be relative to the root of your `buf.yaml`, and can't point to a location outside of your `buf.yaml`. They also represent the root of your import paths within your `.proto` files.For those familiar with `protoc`, `roots` corresponds to your `--proto_paths`, aliased as `-I` with `protoc`— these are the directories that the compiler uses to search for imports.As an example, suppose your module defines two files, `proto/foo/bar/bar.proto` and `proto/foo/baz/baz.proto`. If you want these files to refer to each other without the common `proto` root, you could apply this configuration:

::: info buf.yaml

```yaml
version: v1beta1
build:
  roots:
    - proto
```

:::

If `baz.proto` wants to import `bar.proto`, it does so relative to `proto/`:

::: info proto/foo/baz/baz.proto

```protobuf
syntax = "proto3";

package foo.baz;

import "foo/bar/bar.proto";
```

:::

#### Root requirements

> These requirements are no longer relevant in `v1` because `roots` have been removed. These guidelines remain for users that are still using `v1beta1`. For more information, see the [`v2` migration guide](../../../migration-guides/migrate-v2-config-files/).

There are two additional requirements that `buf` imposes on your `.proto` file structure for compilation to succeed that aren't enforced by `protoc`, both of which are essential to successful modern Protobuf development across a number of languages.**1\. Roots must not overlap—one root can not be a sub-directory of another root.**

````text
For example, this isn't a valid configuration:

```yaml title="buf.yaml"
version: v1beta1
# THIS IS INVALID AND RESULTS IN A PRE-COMPILATION ERROR
build:
  roots:
    - foo
    - foo/bar
````

This is important to make sure that across all your `.proto` files, imports are consistent In the above example, for a
given file `foo/bar/bar.proto`, it would be valid to import this file as either `bar/bar.proto` or `bar.proto`. Having
inconsistent imports leads to a number of major issues across the Protobuf plugin ecosystem.

````

**2\. All `.proto` file paths must be unique relative to the roots.**

```text
For example, consider this configuration:

```yaml title="buf.yaml"
version: v1beta1
build:
  roots:
    - foo
    - bar
````

_Given the above configuration, it's invalid to have these two files:_

- `foo/baz/baz.proto`
- `bar/baz/baz.proto`

This results in two files having the path `baz/baz.proto`. Now add this file to the mix:

```protobuf title="bar/baz/bat.proto"
// THIS IS DEMONSTRATING SOMETHING BAD
syntax = "proto3";

package bar.baz;

import "baz/baz.proto";
```

Which file is being imported? Is it `foo/baz/baz.proto`? `bar/baz/baz.proto`? The answer depends on the order of the
`-I` flags given to `protoc`. If the authors are being honest, we can't remember if it's the first `-I` or second `-I`
that wins - we have outlawed this in our own builds for a long time.

````

While the above example is relatively contrived, the common error that comes up is when you have vendored `.proto` files. For example, [grpc-gateway](https://github.com/grpc-ecosystem/grpc-gateway/tree/master/third_party/googleapis/google) has its own copy of the [google.api](https://github.com/googleapis/googleapis/tree/master/google/api) definitions it needs. While these are usually in sync, the `google.api` schema can change. Imagine that we allowed this:

::: info buf.yaml

```yaml
version: v1beta1
# THIS IS INVALID AND RESULTS IN A PRE-COMPILATION ERROR
build:
  roots:
    - proto
    - vendor/github.com/googleapis/googleapis
    - vendor/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis
````

:::

Which copy of `google/api/*.proto` wins? The answer is no one wins. So Buf doesn't allow this.

### `lint`

The `lint` key is **optional**, and specifies the `lint` rules enforced on the files contained within the module. The `lint` configuration shape is unchanged between `v1beta1` and `v1`, so refer to the [lint configuration](../../../lint/overview/#defaults-and-configuration) for more information.

### `breaking`

The `breaking` key is **optional**, and specifies the breaking change detection rules enforced on the files contained within the module. The `breaking` configuration shape is unchanged between `v1beta1` and `v1`, so refer to the [breaking configuration](../../../breaking/overview/#defaults-and-configuration) for more information.
