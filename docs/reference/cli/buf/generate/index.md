---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/generate/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/format/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/lint/"
  - - meta
    - property: "og:title"
      content: "buf generate - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/generate.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/generate/"
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
      content: "buf generate - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/generate.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf generate

Generate code with protoc plugins

### Usage

```sh
buf generate <input> [flags]
```

### Description

This command uses a template file of the shape:

```console
# buf.gen.yaml
# The version of the generation template.
# The valid values are v1beta1, v1 and v2.
# Required.
version: v2
# When clean is set to true, delete the directories, zip files, and/or jar files specified in the
# "out" field for all plugins before running code generation. Defaults to false.
# Optional.
clean: true
# The plugins to run.
# Required.
plugins:
    # Use the plugin hosted at buf.build/protocolbuffers/go at version v1.28.1.
    # If version is omitted, uses the latest version of the plugin.
    # One of "remote", "local" and "protoc_builtin" is required.
  - remote: buf.build/protocolbuffers/go:v1.28.1
    # The relative output directory.
    # Required.
    out: gen/go
    # The revision of the remote plugin to use, a sequence number that Buf
    # increments when rebuilding or repackaging the plugin.
    revision: 4
    # Any options to provide to the plugin.
    # This can be either a single string or a list of strings.
    # Optional.
    opt: paths=source_relative
    # Whether to generate code for imported files as well.
    # Optional.
    include_imports: false
    # Whether to generate code for the well-known types.
    # Optional.
    include_wkt: false
    # Include only these types for this plugin.
    # Optional.
    types:
      - "foo.v1.User"
    # Exclude these types for this plugin.
    # Optional.
    exclude_types:
      - "buf.validate.oneof"
      - "buf.validate.message"
      - "buf.validate.field""

    # The name of a local plugin if discoverable in "${PATH}" or its path in the file system.
  - local: protoc-gen-es
    out: gen/es
    include_imports: true
    include_wkt: true

    # The full invocation of a local plugin can be specified as a list.
  - local: ["go", "run", "path/to/plugin.go"]
    out: gen/plugin
    # The generation strategy to use. There are two options:
    #
    # 1. "directory"
    #
    #   This will result in buf splitting the input files by directory, and making separate plugin
    #   invocations in parallel. This is roughly the concurrent equivalent of:
    #
    #     for dir in $(find . -name '*.proto' -print0 | xargs -0 -n1 dirname | sort | uniq); do
    #       protoc -I . $(find "${dir}" -name '*.proto')
    #     done
    #
    #   Almost every Protobuf plugin either requires this, or works with this,
    #   and this is the recommended and default value.
    #
    # 2. "all"
    #
    #   This will result in buf making a single plugin invocation with all input files.
    #   This is roughly the equivalent of:
    #
    #     protoc -I . $(find . -name '*.proto')
    #
    #   This is needed for certain plugins that expect all files to be given at once.
    #   This is also the only strategy for remote plugins.
    #
    # If omitted, "directory" is used. Most users should not need to set this option.
    # Optional.
    strategy: directory

    # "protoc_builtin" specifies a plugin that comes with protoc, without the "protoc-gen-" prefix.
  - protoc_builtin: java
    out: gen/java
    # Path to protoc. If not specified, the protoc installation in "${PATH}" is used.
    # Optional.
    protoc_path: path/to/protoc

# Managed mode modifies file options and/or field options on the fly.
managed:
  # Enables managed mode.
  enabled: true

  # Each override rule specifies an option, the value for this option and
  # optionally the files/fields for which the override is applied.
  #
  # The accepted file options are:
  #  - java_package
  #  - java_package_prefix
  #  - java_package_suffix
  #  - java_multiple_files
  #  - java_outer_classname
  #  - java_string_check_utf8
  #  - go_package
  #  - go_package_prefix
  #  - optimize_for
  #  - csharp_namespace
  #  - csharp_namespace_prefix
  #  - ruby_package
  #  - ruby_package_suffix
  #  - objc_class_prefix
  #  - php_namespace
  #  - php_metadata_namespace
  #  - php_metadata_namespace_suffix
  #  - cc_enable_arenas
  #
  # An override rule can apply to a field option.
  # The accepted field options are:
  #  - jstype
  #
  # If multiple overrides for the same option apply to a file or field,
  # the last rule takes effect.
  # Optional.
  override:
      # Sets "go_package_prefix" to "foo/bar/baz" for all files.
    - file_option: go_package_prefix
      value: foo/bar/baz

      # Sets "java_package_prefix" to "net.foo" for files in "buf.build/foo/bar".
    - file_option: java_package_prefix
      value: net.foo
      module: buf.build/foo/bar

      # Sets "java_package_prefix" to "dev" for "file.proto".
      # This overrides the value "net.foo" for "file.proto" from the previous rule.
    - file_option: java_package_prefix
      value: dev
      module: buf.build/foo/bar
      path: file.proto

      # Sets "go_package" to "x/y/z" for all files in directory "x/y/z".
    - file_option: go_package
      value: foo/bar/baz
      path: x/y/z

      # Sets a field's "jstype" to "JS_NORMAL".
    - field_option: jstype
      value: JS_STRING
      field: foo.v1.Bar.baz

  # Disables managed mode under certain conditions.
  # Takes precedence over "overrides".
  # Optional.
  disable:
      # Do not modify any options for files in this module.
    - module: buf.build/googleapis/googleapis

      # Do not modify any options for this file.
    - module: buf.build/googleapis/googleapis
      path: foo/bar/file.proto

      # Do not modify "java_multiple_files" for any file
    - file_option: java_multiple_files

      # Do not modify "csharp_namespace" for files in this module.
    - module: buf.build/acme/weather
      file_option: csharp_namespace

# The inputs to generate code for.
# The inputs here are ignored if an input is specified as a command line argument.
# Each input is one of "directory", "git_repo", "module", "tarball", "zip_archive",
# "proto_file", "binary_image", "json_image", "text_image" and "yaml_image".
# Optional.
inputs:
    # The path to a directory.
  - directory: x/y/z

    # The URL of a Git repository.
  - git_repo: https://github.com/acme/weather.git
    # The branch to clone.
    # Optional.
    branch: dev
    # The subdirectory in the repository to use.
    # Optional.
    subdir: proto
    # How deep of a clone to perform.
    # Optional.
    depth: 30

    # The URL of a BSR module.
  - module: buf.build/acme/weather
    # Only generate code for these types.
    # Optional.
    types:
      - "foo.v1.User"
      - "foo.v1.UserService"
    # Exclude these types.
    # Optional.
    exclude_types:
      - "buf.validate"
    # Only generate code for files in these paths.
    # If empty, include all paths.
    paths:
      - a/b/c
      - a/b/d
    # Do not generate code for files in these paths.
    exclude_paths:
      - a/b/c/x.proto
      - a/b/d/y.proto

    # The URL or path to a tarball.
  - tarball: a/b/x.tar.gz
    # The relative path within the archive to use as the base directory.
    # Optional.
    subdir: proto

    # The compression scheme, derived from the file extension if unspecified.
    # ".tgz" and ".tar.gz" extensions automatically use Gzip.
    # ".tar.zst" automatically uses Zstandard.
    # Optional.
    compression: gzip

    # Reads at the relative path and strips some number of components.
    # Optional.
    strip_components: 2

    # The URL or path to a zip archive.
  - zip_archive: https://github.com/googleapis/googleapis/archive/master.zip
    # The number of directories to strip.
    # Optional.
    strip_components: 1

    # The path to a specific proto file.
  - proto_file: foo/bar/baz.proto
    # Whether to generate code for files in the same package as well, default to false.
    # Optional.
    include_package_files: true

    # A Buf image in binary format.
    # Other image formats are "yaml_image", "text_image" and "json_image".
  - binary_image: image.binpb.gz
    # The compression scheme of the image file, derived from file extension if unspecified.
    # Optional.
    compression: gzip
```

As an example, here's a typical "buf.gen.yaml" go and grpc, assuming "protoc-gen-go" and "protoc-gen-go-grpc" are on your "$PATH":

```console
# buf.gen.yaml
version: v2
plugins:
  - local: protoc-gen-go
    out: gen/go
    opt: paths=source_relative
  - local: protoc-gen-go-grpc
    out: gen/go
    opt:
      - paths=source_relative
      - require_unimplemented_servers=false
```

By default, buf generate will look for a file of this shape named "buf.gen.yaml" in your current directory. This can be thought of as a template for the set of plugins you want to invoke.

The first argument is the source, module, or image to generate from. Defaults to "." if no argument is specified.

Use buf.gen.yaml as template, current directory as input:

```sh
buf generate
```

Same as the defaults (template of "buf.gen.yaml", current directory as input):

```sh
buf generate --template buf.gen.yaml .
```

The --template flag also takes YAML or JSON data as input, so it can be used without a file:

```sh
buf generate --template '{"version":"v2","plugins":[{"local":"protoc-gen-go","out":"gen/go"}]}'
```

Download the repository and generate code stubs per the bar.yaml template:

```sh
buf generate --template bar.yaml https://github.com/foo/bar.git
```

Generate to the bar/ directory, prepending bar/ to the out directives in the template:

```sh
buf generate --template bar.yaml -o bar https://github.com/foo/bar.git
```

The paths in the template and the -o flag will be interpreted as relative to the current directory, so you can place your template files anywhere.

If you only want to generate stubs for a subset of your input, you can do so via the --path. e.g.

Only generate for the files in the directories proto/foo and proto/bar:

```sh
buf generate --path proto/foo --path proto/bar
```

Only generate for the files proto/foo/foo.proto and proto/foo/bar.proto:

```sh
buf generate --path proto/foo/foo.proto --path proto/foo/bar.proto
```

Only generate for the files in the directory proto/foo on your git repository:

```sh
buf generate --template buf.gen.yaml https://github.com/foo/bar.git --path proto/foo
```

Note that all paths must be contained within the same module. For example, if you have a module in "proto", you cannot specify "--path proto", however "--path proto/foo" is allowed as "proto/foo" is contained within "proto".

Plugins are invoked in the order they are specified in the template, but each plugin has a per-directory parallel invocation, with results from each invocation combined before writing the result.

Insertion points are processed in the order the plugins are specified in the template.

### Flags

#### \--clean

Prior to generation, delete the directories, jar files, or zip files that the plugins will write to. Allows cleaning of existing assets without having to call rm -rf

#### \--config _string_

The buf.yaml file or data to use for configuration

#### \--disable-symlinks

Do not follow symlinks when reading sources or configuration from the local filesystem By default, symlinks are followed in this CLI, but never followed on the Buf Schema Registry

#### \--error-format _string_

The format for build errors, printed to stderr. Must be one of \[text,json,msvs,junit,github-actions\]

#### \--exclude-path _strings_

Exclude specific files or directories, e.g. "proto/a/a.proto", "proto/a" If specified multiple times, the union is taken

#### \--exclude-type _strings_

The types (package, message, enum, extension, service, method) that should be excluded from this image. When specified, the resulting image will omit descriptors for the specified types and remove any references to them, such as fields typed to an excluded message or enum, or custom options tied to an excluded extension. The image is first filtered by the included types, then further reduced by the excluded. Flag usage overrides buf.gen.yaml

#### \-h, --help

help for generate

#### \--include-imports

Also generate all imports except for Well-Known Types

#### \--include-wkt

Also generate Well-Known Types. Cannot be set to true without setting --include-imports to true

#### \-o, --output _string_

The base directory to generate to. This is prepended to the out directories in the generation template

#### \--path _strings_

Limit to specific files or directories, e.g. "proto/a/a.proto", "proto/a" If specified multiple times, the union is taken

#### \--template _string_

The generation template file or data to use. Must be in either YAML or JSON format

#### \--type _strings_

The types (package, message, enum, extension, service, method) that should be included in this image. When specified, the resulting image will only include descriptors to describe the requested types. Flag usage overrides buf.gen.yaml

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf](../) - The Buf CLI
