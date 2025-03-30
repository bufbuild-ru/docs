# buf.gen.yaml v2 config file

::: tip NoteThis file has changed significantly between `v1` and `v2` configurations. See the [v1 to v2 migration guide](../../../migration-guides/migrate-v2-config-files/) for migration instructions or the [v1 reference](../../v1/buf-gen-yaml/) if you're still using `v1` configuration files.

:::

`buf.gen.yaml` is a configuration file used by the `buf generate` command to generate integration code for the languages of your choice. This file is most often used with a Buf [workspace](../../../concepts/modules-workspaces/), but can be used with other [input](../../../reference/inputs/) types. It's typically placed with your [`buf.yaml`](../buf-yaml/) file at the root of your Protobuf files:

```text
workspace_root
├── buf.gen.yaml
├── buf.lock
├── buf.yaml
└── proto
    ├── location
    │       └── location.proto
    └── weather
            └── weather.proto
```

::: info Annotated buf.gen.yaml file

```yaml
version: v2
# 'clean', when set to true, deletes the directories, zip files, and/or jar files specified in the `out` field for
# all plugins before running code generation.
clean: true
# 'managed' contains the configuration for managed mode: https://bufbuild.ru/docs/generate/managed-mode
# It has three top-level keys: 'enabled', 'disable', and 'override'.
#
# When managed mode is enabled, it uses default values for certain file and field options during code
# generation. Options, accepted values, and defaults are documented here:
# https://bufbuild.ru/docs/generate/managed-mode#default-behavior
# The 'disable' key configures modules, paths, fields, and/or options that are excluded from managed
# mode's behavior. The 'override' key configures field and file option values that override the
# default values managed mode uses during code generation.
#
# In the case of options that combine with other options (for example java_package + java_package_prefix
# + java_package_suffix), they're all applied if possible. If not (for example when all three are set)
# then the last configuration rule wins.
managed:
  # 'enabled: true' turns managed mode on, 'enabled: false' ignores all managed mode options.
  enabled: true # default: false
  # 'disable' is a list of 'disable' rules managing either file options or field options.
  # A 'disable' rule must have at least one key set.
  disable:
    # Don't modify any files in buf.build/googleapis/googleapis
    - module: buf.build/googleapis/googleapis
    # Don't modify any files in the foo/v1 directory. This can be a path to a directory
    # or a .proto file. If it's a directory path, all .proto files in the directory are
    # ignored.
    - path: foo/v1
    # Ignore the csharp_namespace file option for all modules and files in the input.
    - file_option: csharp_namespace
    # Ignore the js_type field option for any file.
    - field_option: js_type
    # Ignore the foo.bar.Baz.field_name field.
    - field: foo.bar.Baz.field_name
    # Setting all 3 for file options: don't modify java_package and go_package (by disabling
    # setting the go_package_prefix) for files in foo/v1 in buf.build/acme/weather
    - module: buf.build/acme/weather
      path: foo/v1
      file_option: java_package
    # Setting all 4 for field options: disable js_type for all files that match the
    # module, path, and field name.
    - module: buf.build/acme/petapis
      field: foo.bar.Baz.field_name
      path: foo/v1
      field_option: js_type
  # 'override' is a list of 'override' rules for the list of field and file options that
  # managed mode handles.
  override:
    # When 'file_option' and 'value' are set, managed mode uses the value set with
    # this rule instead of the default value or sets it to this value if the default
    # value is none.
    #
    # Example: Modify the java_package options to <net>.<proto_package> for all files.
    # Also modify go_package_prefix to be company.com/foo/bar for all files.
    - file_option: java_package_prefix
      value: net
    - file_option: go_package_prefix
      value: company.com/foo/bar
    # When 'file_option', 'value', and 'module' are set, managed mode uses the value
    # set in this rule instead of the default value for all files in the specified module.
    # It sets it to this value if the default value is none.
    #
    # Example: Modify the java_package option to <com>.<proto_package>.<com> for all files
    # in buf.build/acme/petapis. Also modify go_package_prefix to be company.com/foo/baz
    # for all files in buf.build/acme/petapis.
    # These rules take precedence over the rule above.
    - file_option: java_package_prefix
      module: buf.build/acme/petapis
      value: com
    - file_option: java_package_suffix
      module: buf.build/acme/petapis
      value: com
    - file_option: go_package_prefix
      module: buf.build/acme/petapis
      value: company.com/foo/baz
    # When 'file_option', 'value', and 'path' are set, managed mode uses the value set
    # in this rule instead of the default value for the specific file path. If the path
    # is a directory, the rule affects all .proto files in the directory. Otherwise, it
    # only affects the specified .proto file.
    #
    # Example: For the file foo/bar/baz.proto, set java_package specifically to
    # "com.x.y.z". Also for the file foo/bar/baz.proto modify go_package_prefix to be
    # company.com/bar/baz.
    # This takes precedence over the previous rules above.
    - file_option: java_package
      path: foo/bar/baz.proto
      value: com.x.y.z
    - file_option: go_package_prefix
      path: foo/bar/baz.proto
      value: company.com/bar/baz
    # When 'field_option', 'value', and 'module' are set, managed mode uses the value
    # set in this rule instead of the default value for all files in the specified module.
    # It sets it to this value if the default value is none.
    #
    # Example: For all fields in the buf.build/acme/paymentapis module where the field is
    # one of the compatible types, set the 'js_type' to "JS_NORMAL".
    - field_option: js_type
      module: buf.build/acme/paymentapis
      value: JS_NORMAL
    # When 'field_option', 'value', and 'field' are set, managed mode uses the value set
    # in this rule instead of the default value of the specified field. It sets it to
    # this value if the default value is none.
    #
    # Example: Set the package1.Message2.field3 field 'js_type' value to "JS_STRING". You can
    # additionally specify the module and path, but the field name is sufficient.
    - field_option: js_type
      value: JS_STRING
      field: package1.Message2.field3
# 'plugins' is a list of plugin configurations used for buf generate.
#
# A 'plugin' configuration has 8 possible keys:
#  - one of (required):
#    - 'remote': remote plugin name (for example buf.build/protocolbuffers/go)
#    - 'protoc_builtin': a 'protoc' built-in plugin (for example 'cpp' for 'protoc-gen-cpp')
#    - 'local': a string or list of strings that point to a protoc plugin binary on your
#      '${PATH}'. If a list of strings is specified, the first is the binary name, and the
#      subsequent strings are considered arguments passed to the binary.
#  - 'out': <string> path to the file output, which is the same as v1 (required)
#  - 'opt': a list of plugin options, which is the same as v1 (optional)
#  - 'strategy': a string for the invocation strategy, which is the same as v1 (optional)
#  - 'include_imports': <boolean> (optional, precedence given to CLI flag)
#  - 'include_wkt': <boolean> (optional, precedence given to CLI flag)
plugins:
  # BSR remote plugin
  - remote: buf.build/protocolbuffers/go
    out: gen/proto
  # Built-in protoc plugin for C++
  - protoc_builtin: cpp
    protoc_path: /path/to/protoc
    out: gen/proto
  # Local binary plugin, search in ${PATH} by default
  - local: protoc-gen-validate
    out: gen/proto
  # Relative paths automatically work
  - local: path/to/protoc-gen-validate
    out: gen/proto
  # Absolute paths automatically work
  - local: /usr/bin/path/to/protoc-gen-validate
    out: gen/proto
  # Binary plugin with arguments and includes
  - local: ["go", "run", "google.golang.org/protobuf/cmd/protoc-gen-go"]
    out: gen/proto
    opt:
      - paths=source_relative
      - foo=bar
      - baz
    strategy: all
    include_imports: true
    include_wkt: true
# 'inputs' is a list of inputs that will be run for buf generate. It's an
# optional key for v2 buf.gen.yaml and allows you to specify options based on the type
# of input (https://buf.build/docs/reference/inputs.md#source) being configured.
inputs:
  # Git repository
  - git_repo: https://github.com/acme/weather.git
    branch: dev
    subdir: proto
    depth: 30
  # BSR module with types and include, and exclude keys specified
  - module: buf.build/acme/weather:main
    types:
      - "foo.v1.User"
      - "foo.v1.UserService"
    # If empty, include all paths.
    paths:
      - a/b/c
      - a/b/d
    exclude_paths:
      - a/b/c/x.proto
      - a/b/d/y.proto
  # Local module at provided directory path
  - directory: x/y/z
    paths:
      # 'paths' are relative to the current directory, same as the '--path' flag.
      - x/y/z/foo
  # Tarball at provided directory path. Automatically derives compression algorithm from
  # the file extension:
  # - '.tgz' and '.tar.gz' extensions automatically use Gzip
  # - '.tar.zst' automatically uses Zstandard.
  - tarball: a/b/x.tar.gz
  # Tarball with 'compression', 'strip_components', and 'subdir' keys set explicitly.
  # - 'strip_components=<int>' reads at the relative path and strips some number of
  #    components—in this example, 2.
  # - 'subdir=<string>' reads at the relative path and uses the subdirectory specified
  #    within the archive as the base directory—in this case, 'proto'.
  - tarball: c/d/x.tar.zst
    compression: zstd
    strip_components: 2
    subdir: proto
  # The same applies to 'zip' inputs. A 'zip' input is read at the relative path or http
  # location, and can set 'strip_components' and 'subdir' optionally.
  - zip_archive: https://github.com/googleapis/googleapis/archive/master.zip
    strip_components: 1
  # 'proto_file' is a path to a specific proto file. Optionally, you can include package
  # files as part of the files to be generated (the default is false).
  - proto_file: foo/bar/baz.proto
    include_package_files: true
  # We also support Buf images as inputs. Images can be any of the following formats:
  #  - 'binary_image'
  #  - 'json_image'
  #  - 'txt_image'
  #  - 'yaml_image'
  # Each image format also supports compression optionally.
  #
  # The example below is a binary Buf image with compression set for Gzip.
  - binary_image: image.binpb.gz
    compression: gzip
```

:::

## `version`

**Required.** Defines the current configuration version. The only accepted values are `v2`, `v1`, or `v1beta1`, and to use the configuration as specified below, it must be set to `v2`. See the `buf.gen.yaml` specifications for [v1](../../v1/buf-gen-yaml/) or [v1beta1](../../v1beta1/buf-gen-yaml/) if you haven't yet migrated from those versions.

## `clean`

**Optional.** When set to true, `buf generate` deletes all directories, zip files, and/or jar files specified by the `out` field for each plugin before running code generation.

## `managed`

The `managed` key is used to enable managed mode, an advanced feature that allows you to specify Protobuf file and field options without defining them in the Protobuf files. See the [Managed mode](../../../generate/managed-mode/) page for details about default behavior and accepted values for each available option key.

### `enabled`

**Required if any other `managed` keys are set.** Default is `false`. If a file or field option has no default, then managed mode doesn't modify that option and only modifies it if an `override` rule is specified.

### `disable`

**Optional.** Allows you to granularly disable managed mode for either file options or field options by specifying a list of rules. There are two types of rules: file option or field option. For both types of `disable` rules, you can set any combination of keys, and the union is used to determine the combination of file and field options that managed mode doesn't modify. A `disable` rule must have at least one key set.

- File option `disable` rules have 3 possible keys: `module`, `file_option`, and `path`.
- Field option `disable` rules have 4 possible keys: `module`, `field_option`, `path`, and `field`.

### `override`

**Optional.** Allows you to granularly override the file and field options that managed mode handles. Similar to `disable` rules, there are two types of `override` rules: field option or file option.For each `override` rule, you must provide an option and a valid value based on the option. You can then choose to set a path and/or module to filter the files that the `override` rule applies to. The rules are applied instead of managed mode's [default behavior](../../../generate/managed-mode/#default-behavior) unless an option or file has an applicable `disable` rule.For file option `override` rules, there are 4 possible keys:

- `file_option` (required)
- `value` (required)
- `path` (optional)
- `module` (optional)

For field option `override` rules, there are 5 possible keys:

- `field_option` (required)
- `value` (required)
- `path` (optional)
- `module` (optional)
- `field` (optional)

## `plugins`

**Required.** Each entry in the `plugins` key is a `protoc` plugin configuration. Plugins are invoked in parallel and their outputs are written in the order you specify here. A `plugin` configuration has 8 possible keys, listed below.

### Type of plugin

**Required.** One of:

- `remote`: Indicates a remote plugin hosted on either the public BSR at <https://buf.build> or a private BSR.
  - For all public BSR plugins, this must take the form: `buf.build/<owner-org>/<plugin-name>:<plugin-version>`
  - For custom plugins, this takes the form: `<bsr-server>/<owner-org>/<plugin-name>:<plugin-version>`
  - `<plugin-version>` is optional. If it isn't present, the latest version is used. If it's specified, the `revision` field can be specified to pin an exact version.
    - The plugin version is specified by the upstream project.
    - The revision is a sequence number that Buf increments when rebuilding or repackaging the plugin.
- `protoc_builtin`: Only applies to the code generators that are built into `protoc`. The following values for this field result in invoking `protoc` instead of a dedicated plugin binary:

  - `cpp`
  - `csharp`
  - `java`
  - `js` (before v21)
  - `kotlin` (after v3.17)
  - `objc`
  - `php`
  - `pyi`
  - `python`
  - `ruby`

  If you specify this type of plugin, you must also provide the `protoc_path` value. This must be the string path to the `protoc` binary or an array of strings where the first element is the path to the `protoc` binary and subsequent elements are additional arguments to pass to `protoc` when it's invoked. For example: `["/path/to/protoc", "--experimental_editions"]`

- `local`: A string or list of strings that point to the names of plugin binaries on your `${PATH}`, or to its relative or absolute location on disk. If you specify a list of strings, the first is the local name, and the subsequent strings are considered arguments passed to the binary.

### `out`

**Required.** Controls where the generated files are deposited for a given plugin. Although absolute paths are supported, this configuration is typically a relative output directory to where `buf generate` is run.

### `opt`

**Optional.** Specifies one or more plugin options for a plugin. You can provide options as either a single string or a list of strings.In `protoc`, you specify options with the `--<plugin name>_opt` flag and at least 1 argument:

```text
protoc --foo_out=bar --foo_opt=x=y,a=b <proto files>
```

or equivalently, as part of the `--<plugin name>_out` flag and in front of `:<output directory>`.

```text
protoc --foo_out=x=y,a=b:bar <proto files>
```

In `buf.gen.yaml`, you specify options with the `opt` key:

```text
plugins:
  - local: protoc-gen-foo
    out: bar
    opt:
      - x=y
      - a=b
    # This is the same as:
    # opt: x=y,a=b
```

### `strategy`

**Optional.** Specifies the invocation strategy to use. There are two options:

- `directory` (default for `protoc_builtin` and `local` plugins): This splits the input files by directory and makes separate plugin invocations in parallel, roughly the concurrent equivalent of this operation:

  ```console
  $ for dir in $(find . -name '*.proto' \
    -print0 | xargs -0 -n1 dirname | sort | uniq); \
    do protoc -I . $(find "${dir}" -name '\*.proto'); done
  ```

  Almost every `protoc` plugin requires this, so it's the recommended setting for local generation.

- `all`: This makes a single plugin invocation with all input files, which is roughly equivalent to this:

  ```console
  protoc -I . $(find . -name '\*.proto')
  ```

  This option is needed for certain plugins that expect all files to be given at once. The BSR also sets the value to `all` for remote plugin generation to improve performance.

### `include_imports`

**Optional.** Generates all imports except for Well-Known Types. This setting works the same as the `--include-imports` flag on `buf generate`—if they conflict with each other, the flag gets precedence.

### `include_wkt`

**Optional.** Generates Well-Known Types. Can't be set without `--include-imports`. This setting works the same as the `--include-wkt` flag on `buf generate`—if they conflict with each other, the flag gets precedence.

## `inputs`

**Optional.** A list of inputs to generate code for. In previous Buf configurations, the input was passed to `buf generate` from the CLI, but in the `v2` configuration, it's specified in `buf.gen.yaml` so that all code generation settings are in one place.The accepted input types are the same as the [input types](../../../reference/inputs/#source) currently supported by the Buf CLI, with each key listed on a separate line. Every input can also optionally take the following sub-keys:

- `types`: Include only the specified types when generating.
- `paths`: Include only the specified paths when generating.
- `exclude_paths`: Exclude the specified paths when generating.

These have the same behavior as their corresponding Buf CLI flags, `--type`, `--path`, and `--exclude-path`. The flag always takes precedence over the configuration key.

### `directory`

String. Specifies a local directory path as the input, with the location as the value. The path should be a valid module or workspace root, or a directory of Protobuf files. The path can be relative to the workspace or absolute.

### `module`

String. Specifies a remote BSR module as the input, with the location as the value. A [commit or label](../../../concepts/commits-labels/) can also be specified.Example: `buf.build/acme/weather`, `buf.build/acme/weather:main`, `buf.build/acme/weather:7abdb7802c8f4737a1a23a35ca8266ef`

### `tarball`

Specifies a local or remote (http/https) tarball, with the location as the value. You can optionally specify the following sub-keys:

- `strip_components`: Integer. Reads at the relative path and strips some number of components.
- `subdir`: String. Reads at the relative path and uses the subdirectory specified within the archive as the base directory.
- `compression`: `gzip` or `zstd`. Compression is automatically detected if the file extension is `.tgz`, `.tar.gz`, or `.tar.zst` but can be manually specified here.

When generating, `strip_components` is applied before `subdir`.

### `zip_archive`

Specifies a local or remote (http/https) zip archive, with the location as the value. You can optionally specify the following sub-keys:

- `strip_components`: Integer. Reads at the relative path and strips some number of components.
- `subdir`: String. Reads at the relative path and uses the subdirectory specified within the archive as the base directory.

When generating, `strip_components` is applied before `subdir`.

### `git_repo`

Specifies a Git repo as the input, with the location as the key value. The path to the Git repository can be either a local `.git` directory or a remote location (http/https/ssh/git). You can optionally specify the following sub-keys:

- `branch`: String. Use a specific branch of the repo as the input.
- `tag`: String. Use a specific commit or tag in the repo as the input.
- `ref`: String. Use an explicit reference in the repo as the input. Any valid input to git checkout is accepted, but most Git hosts (including GitHub) only allow fetching by reference and not commits by `sha`. Use `git ls-remote --refs` to get a list of available references and their corresponding commits.
- `subdir`: String. Use a specific subdirectory of the repo as the base directory of the input
- `depth`: Integer. Specifies how deep within the repo to generate. Defaults to `50` if `ref` is specified.
- `recurse_submodules`: Boolean. Controls whether to generate for modules recursively.

Note that remote `http://`, `https://`, `ssh://`, and `git://` locations must be prefixed with their scheme.

### `proto_file`

Specifies a single `.proto` file as the input, with the location as the value. The path can be relative to the workspace or absolute, and you can optionally specify the following sub-key:

- `include_package_files`: Boolean. Include all other files in the package and their imports for the specified `.proto` file.

### `binary_image`, `json_image`, `txt_image`, `yaml_image`

These keys specify a Buf [image](../../../reference/images/) in the noted format (binary, JSON, text, or YAML) as the input, with the location as the value. You can optionally specify the following sub-key:

- `compression`: `gzip` or `zstd`. Compression is automatically detected if the file extension is `.gz` or `.zst` but can be manually specified here.
