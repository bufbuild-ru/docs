# Migrate to v2 configuration files

The migration from v1 to v2 configuration files encompasses a lot of changes under the hood of the Buf CLI (see our [blog post](/blog/buf-cli-next-generation/index.md) for the "Why?"), but the migration itself is straightforward and simple in most cases, and we've provided a tool that does almost all of the work for you. This page describes the changes and shows you how to migrate your configuration to v2.**Your v1 configuration files still work.** Buf is enterprise-grade software, and we want you to be minimally impacted, so you can upgrade at your leisure. However, upgrading is simple and we recommend it.

::: tip NoteBecause `v1beta` and v1 configurations are similar, this migration path will also work for `v1beta` configurations. If you still have a `v1beta` configuration, we strongly encourage you to migrate, so you can take advantage of the features below.

:::

## How to migrate to a v2 configuration

For the vast majority of configurations, the migration tool does everything you need. Run it from the root of your Git repository, and it finds all `buf.yaml`, `buf.gen.yaml`, and `buf.work.yaml` files and upgrades them to v2 `buf.yaml` and `buf.gen.yaml` files at the Git root:

```console
$ buf config migrate
```

If you want to see what the v2 files and directory structure look like before making any changes, you can print the diff to stdout first:

```console
$ buf config migrate --diff
```

The migration tool does have one case where it doesn't detect the configuration files: if you have configuration files with a non-standard name (for example, if you've specified language-specific templates for code generation like `buf.gen.go.yaml`).You also may not want to migrate all of your files at once for various reasons, such as:

- you want to keep v1 `buf.yaml` files around for testing purposes
- you want to separate migration of `buf.yaml`/`buf.work.yaml`/`buf.lock` files from `buf.gen.yaml` files

In these cases, you can manually specify exactly which files you want to migrate by `buf.gen.yaml` file, module, or workspace:

::: info Migrate only buf.gen.yaml files at the specified paths

```console
$ buf config migrate --buf-gen-yaml </paths/to/files>
```

:::

::: info Migrate only some modules at the specified paths

```console
# Migrates buf.yaml and buf.lock files
$ buf config migrate --module </paths/to/modules>
```

:::

::: info Migrate only some workspaces at the specified paths

```console
# Migrates buf.work.yaml, buf.yaml, and buf.lock files
$ buf config migrate --workspace </paths/to/workspaces>
```

:::

After migration, run `buf build` and `buf lint` in the root of your repository to make sure everything works.In v2 configurations, we've added the `PACKAGE_NO_IMPORT_CYCLE` rule to the `STANDARD` lint category. The tool ignores this rule during migration by disabling it in the generated `buf.yaml` file, but you should test whether your workspace passes the rule by removing the declaration and rerunning `buf lint`:

```yaml
version: v2
lint:
  use:
    - STANDARD
   except: // [!code highlight]
     - PACKAGE_NO_IMPORT_CYCLE // [!code highlight]
```

- If it passes, leave the declaration out.
- If it doesn't, leave the declaration in until the import cycling can be addressed and the lint check passes.

## v2 configuration file changes

### `buf.yaml`, modules, and workspaces

Workspaces are now the primary unit for working with your Protobuf files locally. They function the same way whether they contain one or multiple modules, and the configuration for both the workspace and its modules is now in the `buf.yaml` file—`buf.work.yaml` files aren't used in v2 configurations. Instead, each module within the workspace is defined by its directory path in reference to the workspace root:

#### v1 configuration

::: info v1 workspace directory structure

```text
workspace_root
├── buf.work.yaml
├── proto
│   ├── foo
│   │   └── foo.proto
│   ├── bar
│   │   └── bar.proto
│   └── buf.yaml
└── vendor
    └── baz.proto
    └── buf.yaml
```

:::

::: info v1 proto/buf.yaml

```yaml
version: v1
deps:
  - buf.build/googleapis/googleapis
```

:::

::: info v1 vendor/buf.yaml

```yaml
version: v1
```

:::

::: info v1 buf.work.yaml

```yaml
version: v1
directories:
  - proto
  - vendor
```

:::

#### v2 configuration

::: info v2 workspace directory structure

```text
workspace_root
├── buf.yaml
├── proto
│   ├── foo
│   │   └── foo.proto
│   └── bar
│       └── bar.proto
└── vendor
    └── baz.proto
```

:::

::: info v2 buf.yaml

```yaml
version: v2
modules:
  - path: proto
  - path: vendor
deps:
  - buf.build/googleapis/googleapis
```

:::

For simple modules where there is no `buf.work.yaml` and the `buf.yaml` file is in the same directory as the Protobuf files, the only change you need to make is to the `version` key—if no `modules` key is set, the Buf CLI behaves as if there is a single module with the current directory as the path:

```yaml
version: v2
# This is the default behavior if the modules key isn't specified.
# Deleting the modules section here has no effect.
modules:
  - path: .
```

Unlike v1 configuration files, v2 files support multi-module push. In multi-module workspaces, you no longer need to push modules in dependency order and run `buf dep update` on each dependent module before pushing it to the Buf Schema Registry (BSR). v2 workspaces share a list of dependencies via a single `deps` key and can implicitly depend on other modules within the same workspace without declaration, so when you push the workspace, each module is automatically pushed in dependency order. Running `buf dep update` generates a single `buf.lock` dependency manifest for the whole workspace.Your v1 module-level lint and breaking changes configurations still work as-is, but we've also added these settings at the workspace level so you can set defaults for all of the modules in your workspace. This enables you to standardize rules across your modules more easily while retaining flexibility.**Lint and breaking rules applied at the module level completely replace the workspace-level rules for the schemas in that module.** Using the set of files above, you could apply looser lint rules to the files in the `vendor` module like this:

::: info buf.yaml – Module-level overrides of workspace lint rules

```yaml
version: v2
breaking:
  use: // [!code highlight]
    - FILE
# By default, all modules in the workspace use the STANDARD lint rules. // [!code highlight]
lint: // [!code highlight]
  use: // [!code highlight]
    - STANDARD // [!code highlight]
modules:
  - path: proto
  - path: vendor
    breaking:
      use: // [!code highlight]
        - WIRE_JSON
    # However, the module under vendor/ uses the MINIMAL lint rules. // [!code highlight]
    lint: // [!code highlight]
      use: // [!code highlight]
        - MINIMAL // [!code highlight]
```

:::

::: tip NoteSee [Modules and workspaces](../../concepts/modules-workspaces/) and the [v2 buf.yaml reference](../../configuration/v2/buf-yaml/) for more details about file layout and configuration settings.

:::

### `buf.gen.yaml` and managed mode

Code generation configuration has changed substantially in v2 configurations to consolidate settings in the `buf.gen.yaml` file and simplify setting up managed mode.Plugins are still specified as a list of keys under the `plugins` key, but the plugin type must be one of `remote`, `local`, or `protoc_builtin`. The configurations below are equivalent:

::: info buf.gen.yaml – v1 plugins: key examples

```yaml
version: v1
plugins:
  # Remote plugin on the BSR
  - plugin: buf.build/protocolbuffers/java // [!code highlight]
    out: gen/proto
  # Local binary plugin in ${PATH}
  - plugin: validate // [!code highlight]
    out: gen/proto
  # protoc built-in plugin for C++ (note lack of "protoc-gen-" prefix)
  - plugin: cpp // [!code highlight]
    out: gen/proto
```

:::

::: info buf.gen.yaml – v2 plugins: key examples

```yaml
version: v2
plugins:
  # Remote plugin on the BSR
  - remote: buf.build/protocolbuffers/java // [!code highlight]
    out: gen/proto
  # Local binary plugin in ${PATH}
  - local: protoc-gen-validate // [!code highlight]
    out: gen/proto
  # protoc built-in plugin for C++ (note lack of "protoc-gen-" prefix)
  - protoc_builtin: cpp // [!code highlight]
    out: gen/proto
```

:::

You can now specify the code generation inputs in `buf.gen.yaml`, although you can also do so on the command line (which overrides whatever is in `buf.gen.yaml`). The configuration accepts modules, local directories, individual `.proto` files, Git repositories, tarball and zip archives, and Buf [images](../../reference/images/) as input. For this workspace, the v1 and v2 examples below are functionally equivalent, assuming they're run from `workspace_root`:

::: info Local workspace example

```text
workspace_root
├── buf.gen.yaml
├── buf.yaml
├── proto
│   ├── foo
│   │   └── foo.proto
│   └── bar
│       └── bar.proto
└── baz
    └── baz.proto
```

:::

In v1 configs, the command must be run twice to capture both directories because the input is provided in the command line:

::: info v1—must run command twice

```console
$ buf generate proto
$ buf generate baz
```

:::

The advantage in v2 configurations is that you no longer need to do this or store your input configuration separately, such as in a Makefile. `buf.gen.yaml` now contains all the information that `buf generate` needs.

::: info buf.yaml with inputs specified

```yaml
version: v2
inputs:
  - proto
  - baz
```

:::

::: info v2—generates code for all inputs specified in buf.yaml

```console
$ buf generate
```

:::

Managed mode has been simplified and expanded to cover field options as well as file options. Instead of having per-file and per-module overrides interwoven among the options, we've added two top-level keys, `disable` and `override`, which control these configurations. This allows you to more easily specify a hierarchy of managed mode settings, and also specify them down to the field level.If a file option has no [default behavior](../../generate/managed-mode/#default-behavior), then managed mode only modifies it from the Protobuf default if an `override` rule is specified. The following managed mode configurations are equivalent:

::: info buf.gen.yaml – v1 managed mode example

```yaml
version: v1
managed:
  enabled: true
  optimize_for: CODE_SIZE
  go_package_prefix:
    default: github.com/acme/weather/private/gen/proto/go
    except:
      - buf.build/googleapis/googleapis
    override:
      buf.build/acme/weather: github.com/acme/weather/gen/proto/go
  override:
    JAVA_PACKAGE:
      acme/weather/v1/weather.proto: "org"
```

:::

::: info buf.gen.yaml – v2 managed mode example

```yaml
version: v2
 managed:
   enabled: true
   disable:
     # Disables all go_package changes for this module only
     - file_option: go_package
       module: buf.build/googleapis/googleapis
   override:
     - file_option: optimize_for
       value: CODE_SIZE
     # Sets default go_package_prefix for all inputs
     - file_option: go_package_prefix
       value: github.com/acme/weather/private/gen/proto/go
     # Overrides default go_package_prefix for this module only
     - file_option: go_package_prefix
       module: buf.build/acme/weather
       value: github.com/acme/weather/gen/proto/go
     # File options with prefix and suffix can now specify defaults directly
     - file_option: java_package
       path: acme/weather/v1/weather.proto
       value: org
```

:::

::: tip NoteSee the [code generation overview](../../generate/overview/), [managed mode](../../generate/managed-mode/), and [v2 `buf.gen.yaml` reference](../../configuration/v2/buf-gen-yaml/) pages for more details about configuration and usage.

:::

## Buf CLI command changes

Because `buf.yaml` is now the configuration file for multiple modules, the commands in `buf mod` didn't make sense as module-specific commands anymore, so we moved them to new locations:

- `buf mod init` is now `buf config init`.
- `buf mod prune` is now `buf dep prune`.
- `buf mod update` is now `buf dep update`.
- `buf mod ls-breaking-rules` is now `buf config ls-breaking-rules`.
- `buf mod ls-lint-rules` is now `buf config ls-lint-rules`.
- `buf mod {clear-cache,cc}` is now `buf registry cc`.

All `buf mod` subcommands still work, but output a deprecation message to stderr reminding you of the new command location.

```console
$ buf mod update
Command "update" is deprecated, use "buf dep update" instead. However, "buf mod update" will continue to work.
```

## Related docs

- [`buf.yaml`](../../configuration/v2/buf-yaml/) and [`buf.gen.yaml`](../../configuration/v2/buf-gen-yaml/) configuration file references
- [Modules and workspaces](../../concepts/modules-workspaces/), [repositories](../../concepts/repositories/), and [commits and labels](../../concepts/commits-labels/) concepts pages
- [Pushing to the BSR](../../bsr/module/publish/) guide
