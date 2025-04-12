# Breaking change detection – Overview

This page provides an overview of Buf's breaking change detection. At every step of the development process, starting with developer IDEs and culminating in the Buf Schema Registry's instance-wide enforcement, breaking change detection ensures that your organization can evolve Protobuf schemas quickly and safely.Protobuf has many ways to evolve schemas without breaking existing code. Many of Buf's [breaking change rules](../../lint/rules/) maximize your evolution options to do exactly that. However, sometimes it's a better choice to make a breaking change rather than go to the extra effort of backwards compatibility. If you have few clients and can easily update and deploy them, it may be perfectly okay to break your schemas. And if you have a public API or too many clients to easily update, you should probably avoid breaking them.Whichever path you choose, Buf's breaking change detection allows you to make informed decisions, while removing the need for constant vigilance during code review. It reliably and mechanically identifies breaking changes so you and your team can focus on making an informed decision about whether to allow them or not.

## Key concepts

Buf's breaking change detection evaluates your schemas' compatibility at three phases of development:

- **During development:** You can spot-check in your local environment by running `buf breaking`.
- **In code review:** You can [integrate with your CI/CD workflows](../../ci-cd/setup/) (like [GitHub Actions](https://github.com/bufbuild/buf-action)) to ensure that breaking changes get flagged directly in your review flow.
- **When shipping to the Buf Schema Registry (BSR):** This makes them available to other teams and downstream systems like Kafka. The BSR lets your organization enforce [policy checks](../../bsr/policy-checks/breaking/overview/) that prevent developers from committing unintended breaking changes to the BSR. Instead, they go to a [review flow](../../bsr/policy-checks/breaking/review-commits/) so that the repository owners can review the changes and approve or reject them before they enter your production environment.

`buf breaking` runs a set of compatibility checks comparing the current version of your Protobuf schema to a past version. The past version can be any type of [input](../../reference/inputs/) that the Buf CLI accepts, such as a BSR module, a GitHub repo, or a Buf [image](../../reference/images/).The checker has a built-in set of rules and categories and can also accept rules and categories via [Buf plugins](../../cli/buf-plugins/overview/). You can use them alongside or in place of Buf's defaults.

## Rules and categories

The checker's categories reflect the nature of the breaking changes, so choosing a strictness level is straightforward. You can also select rules individually to more closely match your organization's policies. See the [rules and categories](../rules/) page for detailed information.The configuration categories, from strictest to most lenient, are:

- `FILE`: **Default.** Detects generated source code breakage on a per-file basis
- `PACKAGE`: Detects generated source code breakage on a per-package basis
- `WIRE_JSON`: Detects breakage to wire (binary) or JSON encoding
- `WIRE`: Detects breakage to wire (binary) encoding

Changes that pass breaking change detection under a stricter policy also pass with all less-strict policies. For example, passing the `FILE` rules means you also pass the `PACKAGE` rules.

## Defaults and configuration

You configure breaking change detection in the [`buf.yaml`](../../configuration/v2/buf-yaml/) configuration file. If the input doesn't contain a `buf.yaml` file, the Buf CLI operates as if there's a `buf.yaml` file with these default values:

::: info buf.yaml

```yaml
version: v2
breaking:
  use:
    - FILE
```

:::

You can skip the Buf checker's built-in rules and categories entirely by omitting them and listing categories or rules provided by Buf plugins instead. If any configured Buf plugins have rules where [`default`](https://github.com/bufbuild/bufplugin/blob/main/buf/plugin/check/v1/rule.proto#L87) is `true`, those rules are automatically checked if the `breaking` sections of `buf.yaml` don't list any of the plugin's rules or categories.Below is an example of each `buf breaking` configuration option. For more information on specific options and Buf's rules and categories, see the [`buf.yaml` reference](../../configuration/v2/buf-yaml/) and the [rules and categories](../rules/) page.

::: info buf.yaml

```yaml
version: v2
breaking:
  use:
    - FILE
  except:
    - RPC_NO_DELETE
  ignore:
    - foo/bar.proto
  ignore_only:
    FIELD_SAME_JSON_NAME:
      - baz
  ignore_unstable_packages: true
plugins:
  - plugin: buf-plugin-foo
```

:::

### Using Buf plugins

To use rules and categories from a Buf plugin, you first need to install the plugin locally (ideally on your `$PATH`), then configure it in the `buf.yaml` file. As with Buf's built-in rules and categories, you can specify combinations of rules and categories using `use`, `except`, `ignore`, and `ignore_only`. For example, if you want to use the `CATEGORY_ID_FROM_PLUGIN` category from `buf-plugin-foo` but don't want to check against its `RULE_ID_FROM_PLUGIN` rule, you'd define it like this:

::: info buf.yaml

```yaml
version: v2
breaking:
  use:
    - FILE
    - CATEGORY_ID_FROM_PLUGIN # Applies all rules contained in this buf-plugin-foo category
  except:
    - RULE_ID_FROM_PLUGIN # Omits this buf-plugin-foo rule
plugins:
  - plugin: buf-plugin-foo
```

:::

You can get a list of all of your workspace's rules and categories (including those from configured Buf plugins) by running `buf config ls-breaking-rules`.

## Integration with CI/CD workflows

Because `buf breaking` is part of a CLI, you can easily integrate it into CI/CD workflows. For instructions, see the [General CI/CD setup](../../ci-cd/setup/) and [GitHub Action](../../ci-cd/github-actions/) pages.

## Usage examples

The most basic usage of `buf breaking` is to check your local files against your local Git repository. However, you can specify both the input and the schema you're checking against in multiple ways, so you can use `buf breaking` in many types of workflows. You must use either the `--against` or [`--against-registry`](#buf-schema-registry) flags.

### Custom options

Breaking change detection doesn't work on changes to custom options like `google.api.http`. Doing breaking change detection for options such as this can't happen easily inside of Buf, because there are an infinite number of these options and the semantics are different for each. So, we don't validate changes to custom options as part of breaking change detection.

### Git and GitHub

::: tip NoteCheck out Buf's dedicated [GitHub Action](../../ci-cd/github-actions/) to seamlessly add breaking change detection into your CI/CD pipeline.

:::

#### Local repositories

You can directly compare against the `.proto` files at the head of a `git` branch or a `git` tag. See the [inputs](../../reference/inputs/) documentation for details on `git` branches and `git` tags. It's especially useful for iterating on your schema locally.

#### Remote repositories

Note that many CI services like [Travis CI](https://travis-ci.com/) don't do a full clone of your repo, instead cloning a certain number of commits (typically around 50) on the specific branch that you're testing. In this scenario, other branches aren't present in your clone within CI, so the previous local example doesn't work. You can fix this by giving the remote path directly to the Buf CLI so it can clone the repo itself, for example against `https://github.com/foo/bar.git`:

```console
$ buf breaking --against 'https://github.com/foo/bar.git'
```

It only clones the single commit at the `HEAD` of the branch, so even for large repositories, this should be quick.For remote locations that require authentication, see [HTTPS Authentication](../../reference/inputs/#https) and [SSH Authentication](../../reference/inputs/#ssh) for details.

#### Using tags

You can compare against a `git` tag, for example `v1.0.0`:

```console
$ buf breaking --against '.git#tag=v1.0.0'
```

#### Within subdirectories

You can compare against a subdirectory in your git repository. For example, if your `buf.yaml` file is in the `proto` subdirectory:

```console
$ buf breaking --against '.git#tag=v1.0.0,subdir=proto'
```

### Buf Schema Registry

You can compare a single module against the latest version stored in the BSR:

```console
$ buf breaking --against <REMOTE>/<ORGANIZATION>/<REPOSITORY>
```

::: info Example

```console
$ buf breaking --against buf.build/acme/petapis
```

:::

You can also compare all modules in an input (such as your local workspace) at once:

```console
$ buf breaking --against-registry
```

To use the `--against-registry` flag, all modules in the input must have a `name` to be resolvable to the BSR, or `buf breaking` errors.

### Archives (`.tar` and `.zip`)

You can compare against tarballs and zip archives of your `.proto` files as well. This is especially useful for GitHub, where you can retrieve them for any commit or branch. This example assumes your repo is `github.com/foo/bar` and `COMMIT` is a variable storing the commit to compare against:

```console
$ buf breaking --against "https://github.com/foo/bar/archive/${COMMIT}.tar.gz#strip_components=1"
$ buf breaking --against "https://github.com/foo/bar/archive/${COMMIT}.zip#strip_components=1"
```

### Output as JSON

You can also output the errors as JSON. The output defaults to a single-line comma-separated message, but you can pipe it to other tools for formatting. For example, you can send the output to [`jq`](https://jqlang.github.io/jq/):

```console
$ buf breaking --against '.git#branch=main' --error-format=json | jq .

{
  "path":"acme/pet/v1/pet.proto",
  "start_line":18,
  "start_column":3,
  "end_line":18,
  "end_column":9,
  "type":"FIELD_SAME_TYPE",
  "message":"Field \"1\" on message \"Pet\" changed type from \"enum\" to \"string\"."
}
```

### Limit to specific files

By default, the Buf CLI builds all files under the `buf.yaml` configuration file. Instead, you can manually specify the file or directory paths to check. This is an advanced feature intended for editor or [Bazel](../../build-systems/bazel/) integration. In general, it's better to let the Buf CLI discover all files under management and handle this for you, especially when using the `FILE` category.The `--path` flag limits breaking change detection to the specified files if applied:

```console
$ buf breaking --against .git#branch=main --path path/to/foo.proto --path path/to/bar.proto
```

### Advanced use cases

Due to the nature of inputs, `buf breaking` happily compares just about anything. You may have an advanced use case, so this example demonstrates its ability to compare a `git` repository against a remote archive.Copy/paste this into your terminal:

```console
$ buf breaking \
  "https://github.com/googleapis/googleapis.git" \
  --against "https://github.com/googleapis/googleapis/archive/b89f7fa5e7cc64e9e38a59c97654616ad7b5932d.tar.gz#strip_components=1" \
  --config '{"version":"v2","breaking":{"use":["PACKAGE"]}}'

google/cloud/asset/v1/assets.proto:27:1:File option "cc_enable_arenas" changed from "false" to "true".
```

To explicitly target a branch, you can adapt the command to include `branch=<branch_name>` in the `git` input:

```console
$ buf breaking \
  "https://github.com/googleapis/googleapis.git#branch=main" \ // [!code highlight]
  --against "https://github.com/googleapis/googleapis/archive/b89f7fa5e7cc64e9e38a59c97654616ad7b5932d.tar.gz#strip_components=1" \
  --config '{"version":"v2","breaking":{"use":["PACKAGE"]}}'

google/cloud/asset/v1/assets.proto:27:1:File option "cc_enable_arenas" changed from "false" to "true".
```

## Related docs

- Try out breaking change detection with the [tutorial](../tutorial/)
- Get detailed explanations of the breaking change [rules and categories](../rules/)
- Learn about the [breaking change policy check](../../bsr/policy-checks/breaking/overview/) and the [review flow](../../bsr/policy-checks/breaking/review-commits/)
- Browse the [buf.yaml configuration file reference](../../configuration/v2/buf-yaml/#breaking) and [`buf breaking` command reference](../../reference/cli/buf/breaking/)
- See more about the types of [inputs](../../reference/inputs/) that the Buf CLI accepts
