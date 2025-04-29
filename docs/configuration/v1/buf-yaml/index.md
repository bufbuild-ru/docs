---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/configuration/v1/buf-yaml/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/configuration/v2/buf-lock/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/configuration/v1/buf-gen-yaml/"
  - - meta
    - property: "og:title"
      content: "buf.yaml - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/configuration/v1/buf-yaml.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/configuration/v1/buf-yaml/"
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
      content: "buf.yaml - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/configuration/v1/buf-yaml.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf.yaml v1 config file

::: tip NoteThis file now has a `v2` configuration available. See the [v2 `buf.yaml` reference](../../v2/buf-yaml/) and the [migration guide](../../../migration-guides/migrate-v2-config-files/) for details about the new configuration and migration instructions.

:::

The `buf.yaml` file defines a [module](../../../cli/modules-workspaces/), and is placed at the root of the Protobuf source files it defines. The placement of the `buf.yaml` configuration tells `buf` where to search for `.proto` files and how to handle imports.This file contains [lint](../../../lint/rules/) and [breaking change](../../../breaking/rules/) rules, and if applicable, the name of your module and a list of dependencies.

## Default values

The `buf.yaml`config file below demonstrates all default values being explicitly set. This file is the equivalent of no options being set in your `buf.yaml` at all.

::: info buf.yaml

```yaml
version: v1
name: ""
deps: []
build:
  excludes: []
lint:
  use:
    - STANDARD
  except: []
  ignore: []
  ignore_only: {}
  allow_comment_ignores: false
  enum_zero_value_suffix: _UNSPECIFIED
  rpc_allow_same_request_response: false
  rpc_allow_google_protobuf_empty_requests: false
  rpc_allow_google_protobuf_empty_responses: false
  service_suffix: Service
breaking:
  use:
    - FILE
  except: []
  ignore: []
  ignore_only: {}
  ignore_unstable_packages: false
```

:::

## Fields

### `version`

**Required.** Defines the current configuration version. The only accepted values are `v1beta1` and `v1`.

### `name`

**Optional.** Uniquely identifies your module. The `name` **must** be a valid [module name](../../../cli/modules-workspaces/) and is directly associated with the BSR repository that owns it.

### `deps`

**Optional.** Declares one or more modules that your module depends on. Each `deps` entry **must** be a module reference that's directly associated with a repository, and can include a [reference](../../../cli/modules-workspaces/#referencing-a-module), which is either a tag or commit. A complete example of the different `deps` formats is shown below:

::: info buf.yaml

```yaml
version: v1
name: buf.build/acme/petapis
deps:
  - buf.build/acme/paymentapis # The latest commit.
  - buf.build/acme/pkg:47b927cbb41c4fdea1292bafadb8976f # The '47b927cbb41c4fdea1292bafadb8976f' commit.
  - buf.build/googleapis/googleapis:v1beta1.1.0 # The 'v1beta1.1.0' tag.
```

:::

::: tip NoteDepending on specific references is an advanced feature—you should depend on the latest commit whenever possible. In other words, your `deps` don't need to include the `:<reference>` suffix in most cases.

:::

### `build`

**Optional** Used to control how the Buf CLI builds modules. The `build` section only has one option, `excludes`.

#### `excludes`

**Optional.** Lists directories to ignore from `.proto` file discovery. Any directories added to this list are completely skipped and excluded in the module. **We don't recommend using this option**, but in some situations it's unavoidable.

### `lint`

**Optional.** Specifies the [lint rules](../../../lint/rules/) enforced on the files in the module.

#### `use`

**Optional.** Lists the rules or categories to use for linting. For example, this config selects the `BASIC` lint category as well as the `FILE_LOWER_SNAKE_CASE` rule:

::: info buf.yaml

```yaml
version: v1
lint:
  use:
    - BASIC
    - FILE_LOWER_SNAKE_CASE
```

:::

The default is the `STANDARD` category.

#### `except`

**Optional.** Removes rules or categories from the `use` list. For example, this config results in all lint rules in the `STANDARD` lint category being used except for `ENUM_NO_ALLOW_ALIAS` and the lint rules in the `BASIC` category:

::: info buf.yaml

```yaml
version: v1
lint:
  use:
    - STANDARD
  except:
    - ENUM_NO_ALLOW_ALIAS
    - BASIC
```

:::

Note that since `STANDARD` is the default value for `use`, this is equivalent to the above:

::: info buf.yaml

```yaml
version: v1
lint:
  except:
    - ENUM_NO_ALLOW_ALIAS
    - BASIC
```

:::

#### `ignore`

**Optional.** Allows directories or files to be excluded from all lint rules when running `buf lint`. If a directory is ignored, then all files and subfolders of the directory are also ignored. The specified directory or file paths **must** be relative to the `buf.yaml` file. For example, the lint result in `foo/bar.proto` is ignored with this config:

::: info buf.yaml

```yaml
version: v1
lint:
  ignore:
    - foo/bar.proto
```

:::

#### `ignore_only`

**Optional.** Allows directories or files to be excluded from specific lint rules when running `buf lint` by taking a map from lint rule ID or category to path. As with `ignore`, the paths **must** be relative to the `buf.yaml`.For example, this config sets up specific ignores for the `ENUM_PASCAL_CASE` rule and the `BASIC` category:

::: info buf.yaml

```yaml
version: v1
lint:
  ignore_only:
    ENUM_PASCAL_CASE:
      - foo/foo.proto
      - bar
    BASIC:
      - foo
```

:::

#### `allow_comment_ignores`

**Optional.** Turns on comment-driven ignores. If this option is set, you can add leading comments within Protobuf files to ignore lint errors for certain components.

::: info buf.yaml

```yaml
version: v1
lint:
  allow_comment_ignores: true
```

:::

If this option is set to `true`, the linter ignores the specified rule for any comment that starts with `// buf:lint:ignore RULE_ID`. For example:

```protobuf
syntax = "proto3";

// Skip these rules for this package name. Changing name creates a breaking change. // [!code highlight]
// buf:lint:ignore PACKAGE_LOWER_SNAKE_CASE // [!code highlight]
package A; // buf:lint:ignore PACKAGE_VERSION_SUFFIX // [!code highlight]
```

If this option is unset or `false`, any such comments are ignored. See the [lint overview](../../../lint/overview/#comment-ignores) to learn how and when to use comment ignores.

#### `enum_zero_value_suffix`

**Optional.** Controls the behavior of the `ENUM_ZERO_VALUE_SUFFIX` lint rule. By default, this rule verifies that the zero value of all enums ends in `_UNSPECIFIED`, as recommended by the [Google Protobuf Style Guide](https://protobuf.dev/programming-guides/style/#enums). However, organizations can choose a different preferred suffix—for example, `_NONE`. To set that:

::: info buf.yaml

```yaml
version: v1
lint:
  enum_zero_value_suffix: _NONE
```

:::

That config allows this:

```protobuf
enum Foo {
  FOO_NONE = 0;
}
```

#### `rpc_allow_same_request_response`

**Optional.** Allows the same message type to be used for a single RPC's request and response type. **We don't recommend using this option**.

#### `rpc_allow_google_protobuf_empty_requests`

**Optional.** Allows RPC requests to be [`google.protobuf.Empty`](https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/empty.proto) messages. You can set this if you want to allow messages to be void forever and never take any parameters. **We don't recommend using this option**.

#### `rpc_allow_google_protobuf_empty_responses`

**Optional.** Allows RPC responses to be [`google.protobuf.Empty`](https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/empty.proto) messages. You can set this if you want to allow messages to never return any parameters. **We don't recommend using this option**.

#### `service_suffix`

**Optional.** Controls the behavior of the `SERVICE_SUFFIX` lint rule. By default, this rule verifies that all service names are suffixed with `Service`. However, organizations can choose a different preferred suffix—for example, `API`. To set that:

::: info buf.yaml

```yaml
version: v1
lint:
  service_suffix: API
```

:::

That config allows this:

```protobuf
service FooAPI {}
```

### `breaking`

**Optional.** Specifies the breaking change detection rules enforced on the files contained within the module.

#### `use`

**Optional.** Lists the IDs or categories to use for breaking change detection. For example, this config selects the `WIRE` category and the `FILE_NO_DELETE` rule:

::: info buf.yaml

```yaml
version: v1
breaking:
  use:
    - WIRE
    - FILE_NO_DELETE
```

:::

The default value is the `FILE` category, which is conservative and appropriate for most teams.

#### `except`

**Optional.** Removes IDs or categories from the `use` list. **We don't recommend using this option**. For example, this config results in all breaking rules in the `FILE` breaking category being used except for `FILE_NO_DELETE`:

::: info buf.yaml

```yaml
version: v1
breaking:
  use:
    - FILE
  except:
    - FILE_NO_DELETE
```

:::

#### `ignore`

**Optional.** Allows directories or files to be excluded from all rules when running `buf breaking`. If a directory is ignored, then all files and subfolders of the directory are also ignored. The specified directory or file paths **must** be relative to the `buf.yaml`. For example, the breaking result in `foo/bar.proto` is ignored with this config:

::: info buf.yaml

```yaml
version: v1
breaking:
  ignore:
    - foo/bar.proto
```

:::

This option can be useful for ignoring packages that are in active development but not deployed in production, especially alpha or beta packages, and we expect `ignore` to be commonly used for this case. For example:

::: info buf.yaml

```yaml
version: v1
breaking:
  use:
    - FILE
  ignore:
    - foo/bar/v1beta1
    - foo/bar/v1beta2
    - foo/baz/v1alpha1
```

:::

#### `ignore_only`

Allows directories or files to be excluded from specific breaking rules when running `buf breaking` by taking a map from breaking rule ID or category to path. As with `ignore`, the paths **must** be relative to the `buf.yaml`. **We don't recommend this option.**For example, this config sets us specific ignores for the `FILE_SAME_TYPE` rule and the `WIRE` category:

::: info buf.yaml

```yaml
version: v1
breaking:
  ignore_only:
    FILE_SAME_TYPE:
      - foo/foo.proto
      - bar
    WIRE:
      - foo
```

:::

#### `ignore_unstable_packages`

**Optional.** Ignores packages with a last component that's one of the unstable forms recognized by [`PACKAGE_VERSION_SUFFIX`](../../../lint/rules/#package_version_suffix):

- `v\d+test.*`
- `v\d+(alpha|beta)\d*`
- `v\d+p\d+(alpha|beta)\d*`

For example, if this option is set, these packages are ignored:

- `foo.bar.v1alpha1`
- `foo.bar.v1beta1`
- `foo.bar.v1test`
