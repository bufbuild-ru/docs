---

title: "Overview - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/lint/overview/"
  - - meta
    - property: "og:title"
      content: "Overview - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/lint/overview/"
  - - meta
    - property: "twitter:title"
      content: "Overview - Buf Docs"

---

# Linting – Overview

Linting tools help to maintain the quality of code by enforcing a set of rules for style, syntax, and best practices. They can catch errors early, make the code easier to understand, and reduce the amount of manual code review required. The Buf CLI lints Protobuf files using a set of rules designed to encourage common conventions and maximize forward compatibility without restricting your organization's ability to adopt an in-house style guide.This document provides an overview of Buf's Protobuf linting features.

## Key concepts

The Buf CLI's linter can check your schemas at two phases of development:

- **During development:** You can [integrate with your editor](../../cli/editor-integration/) for immediate feedback as you're iterating, and also spot-check by running `buf lint`.
- **In code review:** You can [integrate with your CI/CD workflows](../../bsr/ci-cd/setup/) (like GitHub Actions) to ensure that linting errors get flagged directly in your review flow without the need for constant human vigilance.

The linter has a built-in set of rules and categories and can also accept rules and categories via [Buf plugins](../../cli/buf-plugins/overview/). You can use them alongside or in place of Buf's defaults.

## Rules and categories

The linter's built-in rules are split up into categories to make choosing a strictness level straightforward, but rules can also be selected individually to more closely match your organization's policies. See the [rules and categories](../rules/) page for detailed information.The configuration categories, from strictest to most lenient, are:

- `STANDARD`
- `BASIC`
- `MINIMAL`

Changes that pass linting under a stricter policy also pass with all less-strict policies. For example, passing the `STANDARD` rules means you pass the `MINIMAL` rules. There are also two top-level categories outside of the strictness hierarchy that address comments and unary RPCs specifically.

## Defaults and configuration

You configure lint rules in the [`buf.yaml`](../../configuration/v2/buf-yaml/) configuration file, which is placed at the root of the Protobuf module it defines. If the input to `buf lint` doesn't contain a `buf.yaml` file, the Buf CLI operates as if there's a `buf.yaml` file with these values:

::: info buf.yaml

```yaml
version: v2
lint:
  use:
    - STANDARD
  enum_zero_value_suffix: _UNSPECIFIED
  rpc_allow_same_request_response: false
  rpc_allow_google_protobuf_empty_requests: false
  rpc_allow_google_protobuf_empty_responses: false
  service_suffix: Service
```

:::

You can skip the Buf linter's built-in rules and categories entirely by omitting them and listing categories or rules provided by Buf plugins instead. If any configures Buf plugins have rules where [`default`](https://github.com/bufbuild/bufplugin/blob/main/buf/plugin/check/v1/rule.proto#L87) is set to `true`, those rules are automatically checked if none of the plugin's rules or categories are listed in the `lint` sections of `buf.yaml`.Below is an example of each `buf lint` configuration option. For more information on specific options and Buf's rules and categories, see the [`buf.yaml` reference](../../configuration/v2/buf-yaml/) and the [rules and categories](../rules/) page.

::: info buf.yaml

```yaml
version: v2
lint:
  use:
    - STANDARD # Omit all Buf categories if you don't want to use Buf's built-in rules
  except:
    - FILE_LOWER_SNAKE_CASE
  ignore:
    - bat
    - ban/ban.proto
  ignore_only:
    ENUM_PASCAL_CASE:
      - foo/foo.proto
      - bar
    BASIC:
      - foo
  disallow_comment_ignores: false # The default behavior of this key has changed from v1
  enum_zero_value_suffix: _UNSPECIFIED
  rpc_allow_same_request_response: false
  rpc_allow_google_protobuf_empty_requests: false
  rpc_allow_google_protobuf_empty_responses: false
  service_suffix: Service
plugins:
  - plugin: buf-plugin-foo
    OPTION_KEY: OPTION_VALUE
```

:::

### Using Buf plugins

To use rules and categories from a Buf plugin, you first need to install the plugin locally (ideally on your `$PATH`), then configure it in the `buf.yaml` file. As with Buf's built-in rules and categories, you can specify combinations of rules and categories using `use`, `except`, `ignore`, `ignore_only` and `// buf:lint:ignore` comment ignores. For example, if you want to use the `CATEGORY_ID_FROM_PLUGIN` category from `buf-plugin-foo` but don't want to check against its `RULE_ID_FROM_PLUGIN` rule, you'd define it like this:

::: info buf.yaml

```yaml
version: v2
lint:
  use:
    - STANDARD
    - CATEGORY_FROM_PLUGIN # Applies all rules contained in this buf-plugin-foo category
  except:
    - RULE_ID_FROM_PLUGIN # Omits this buf-plugin-foo rule
plugins:
  - plugin: buf-plugin-foo
```

:::

The rules in a Buf plugin can also have options that modify their behavior (similar to what the Buf linter's `service_suffix` option does). All options for the rules in a Buf plugin are set on the plugin and are key-value pairs. For example, if `buf-plugin-foo` had a rule with a `timestamp_suffix` option and you wanted to use it to change the `timestamp_suffix` to `_time_`, it would look like this:

::: info buf.yaml

```yaml
version: v2
lint:
  use:
    - STANDARD
    - CATEGORY_FROM_PLUGIN
plugins:
  - plugin: buf-plugin-foo
    options: // [!code highlight]
      timestamp_suffix: _time // [!code highlight]
```

:::

You can get a list of all of your workspace's rules and categories (including those from configured Buf plugins) by running `buf config ls-lint-rules`.

## Usage examples

The Buf CLI can lint [inputs](../../reference/inputs/) beyond your local Protobuf files, such as [Git repositories](../../reference/inputs/#git) and [tarballs](../../reference/inputs/#tar). This can be useful in a variety of scenarios, such as using [`protoc`](https://github.com/protocolbuffers/protobuf) output as Buf CLI input. Here are some example scripts:

::: info Lint output from protoc passed to stdin

```console
$ protoc -I . --include_source_info $(find . -name '*.proto') -o /dev/stdout | buf lint -
```

:::

::: info Lint a remote Git repository on the fly and override its config to use your local config file

```console
$ buf lint 'https://github.com/googleapis/googleapis.git' --config buf.yaml
```

:::

::: info Lint a module published to the Buf Schema Registry

```console
$ buf lint buf.build/acme/petapis
```

:::

::: info Output lint error messages as JSON

```console
$ buf lint --error-format=json
```

:::

For remote locations that require authentication, see [HTTPS Authentication](../../reference/inputs/#https) and [SSH Authentication](../../reference/inputs/#ssh).

### Limit to specific files

By default, the Buf CLI builds all files under your [`buf.yaml`](../../configuration/v2/buf-yaml/) configuration file, but you can choose to lint only specific files or directories. This is an advanced feature that's mostly intended to be used by other systems like editors. In general, it's better to let the Buf CLI discover all files and handle this for you. If you do need this, however, you can use the `--path` flag:

```console
$ buf lint \
  --path path/to/foo.proto \
  --path path/to/bar.proto
```

You can also combine this with an inline configuration override:

```console
$ buf lint \
  --path path/to/foo.proto \
  --path path/to/bar.proto \
  --config '{"version":"v2","lint":{"use":["BASIC"]}}'
```

### Ignoring rules with Protobuf comments

This feature allows you to turn off lint warnings for a specific line of a Protobuf file when changing the component to fix them would create unwanted downstream effects (like a breaking change).

- In `v2` configurations, comment ignores are enabled by default, but won't work if your `buf.yaml` file has `disallow_comment_ignores` set to `true`.
- In `v1` configurations, comment ignores are disabled by default, so you need to set `allow_comment_igrnoes` to `true` to enable them.

To ignore a lint rule, add the comment ignore directly above the line it should apply to, using the `// buf:lint:ignore RULE_ID` syntax. You can use comment ignores for any lint rules—both Buf's [built-in rules](../rules/) and custom rules from configured [Buf plugins](../../cli/buf-plugins/overview/). Adding a comment for context is also helpful, and it must be above the comment ignore:

```protobuf
syntax = "proto3";

// Skip these rules for this package name. Changing name creates a breaking change. // [!code highlight]
// buf:lint:ignore PACKAGE_LOWER_SNAKE_CASE // [!code highlight]
package A; // buf:lint:ignore PACKAGE_VERSION_SUFFIX // [!code highlight]
```

::: tip NoteAlthough it's possible to ignore lint rules at this granular level, generally it should be an exception. As an alternative to comment ignores, you could move the offending components to a separate `.proto` file and use an authors or owners file to control access to it, limiting approval to a small group of reviewers.You could then set the corresponding `ignore` or `ignore_only` values in `buf.yaml` to point to that file. This allows `buf.yaml` to have its own access group and stay focused on the organization's defaults rather than the exceptions.

:::

## Integration with CI/CD workflows

Because `buf lint` is part of a CLI, you can easily integrate it into CI/CD workflows. For instructions, see the [General CI/CD setup](../../bsr/ci-cd/setup/) and [GitHub Actions](../../bsr/ci-cd/github-actions/) pages.
