---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/migration-guides/migrate-from-protolock/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/migration-guides/migrate-from-prototool/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/migration-guides/migrate-from-protoc/"
  - - meta
    - property: "og:title"
      content: "Migrate from Protolock - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/migration-guides/migrate-from-protolock.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/migration-guides/migrate-from-protolock/"
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
      content: "Migrate from Protolock - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/migration-guides/migrate-from-protolock.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Migrate from Protolock

[Protolock](https://github.com/nilslice/protolock) is a widely used Protobuf tool that primarily concentrates on breaking change detection. It deserves a lot of praise — in the OSS world, it largely pioneered the breaking change detection effort, and has been well maintained. We can't heap enough praise on this effort, it's helped the Protobuf ecosystem move forward in a big way.

In this document, we'll discuss the pros and cons of Protolock vs. `buf`'s [breaking change detector](../../breaking/overview/), as well as `buf`\-equivalent commands and migration.

## Protolock pros

- Protolock has a [plugin interface](https://github.com/nilslice/protolock/wiki/Plugins) allowing you to create external binaries that Protolock then calls itself to verify rules. The equivalent way to do this for `buf` is to ask us to add a lint or breaking rule, which we're more than happy to do in most scenarios. It's our feeling that calling out to external binaries for individual lint rules leads to issues with tool distribution and management, but this use case may be something you want, and `buf` doesn't support it.

## Protolock cons

- Protolock uses a third-party Protobuf parser that isn't tested to cover every edge case of the Protobuf grammar, and as had such issues in the past. Additionally, this parser doesn't verify that what it's parsing is actually valid Protobuf, meaning that Protolock can both have breakages for valid Protobuf file, and happily parse Protobuf files that aren't valid. Instead, `buf` lets you use either the internal compiler that's tested to cover every edge case and parses only valid files, or use `protoc` output as `buf` input. See our [compiler](../../reference/internal-compiler/) discussion for more details.
- Protolock uses a custom structure, represented in [JSON](https://github.com/nilslice/protolock/blob/1a3dd1a15d36f26d0a616be4584da6a4589e7844/parse.go#L19), to store your Protobuf schema state. This structure is populated based on the results of the third-party Protobuf parser, meaning that file data can be corrupted for an invalid parse. This structure also doesn't cover all known elements of a Protobuf schema, especially Protobuf options that can have an effect on your API compatibility. Instead, `buf` uses [`FileDescriptorSet`](https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/descriptor.proto)s, extended to [Buf images](../../reference/images/), which are the core primitive of the Protobuf ecosystem, and have been stable for over a decade. `buf`'s equivalent to lock files are serialized `FileDescriptorSet`s.
- Protolock only enforces 8 rules related to API compatibility in strict mode, and 5 with strict mode disabled. `buf` enforces 46 rules related to API compatibility in its strictest mode (`FILE`), and 15 rules related to wire-only compatibility in its weakest mode (`WIRE`). We believe that the additional rules that `buf` enforces are critical to API compatibility.
- Breaking change rules aren't a binary proposition — there are different kinds of breaking changes that you may care about. `buf` provides [four categories](../../breaking/rules/) of breaking change rules to select — per-file generated stub breaking changes, per-package generated stub breaking changes, wire breaking changes, and wire + JSON breaking changes. Within these categories, you can go further and enable or disable individual rules through configuration.
- `buf` provides `file:line:column:message` references for breaking change violations, letting you know where a violation occurred, including potentially integrating this into your editor in the future. These reference your current Protobuf schema, including if types move across files between versions of your Protobuf schema. The error output can be outputted as text or JSON, with other formats coming in the future. Protolock prints out unreferenced messages.
- Protolock relies on `proto.lock` files as the only way to store the representation of your previous Protobuf schema, and these files are represented by a custom structure. `buf` allows you to use lock files through `buf build`, but also allows [other methods](../../breaking/overview/) to store and retrieve your previous Protobuf schema, including:
  - Cloning the head of a branch of a Git repository, either local or remote, and compiling on the fly.
  - Reading a tar or zip archive, either local or remote and optionally compressed, and compiling on the fly.
  - Reading a "lock file", represented as a [Buf image](../../reference/images/), from either a local location or a remote http/https location.
- Both Protolock and `buf` run file discovery for your Protobuf files, however `buf` allows you to skip file discovery and specify your files [manually](../../build/overview/#limit-to-specific-files) for use cases that require this, such as [Bazel](../../cli/build-systems/bazel/).
- Since `buf` can process `FileDescriptorSet`s as input, `buf` provides a [protoc plugin](../../cli/protoc-plugins/#breaking) to allow you to use `buf`'s breaking change detection functionality with your current `protoc` setup.

## Configuration

See the [breaking configuration](../../breaking/overview/#defaults-and-configuration) documentation for more details. Note that configuration can be provided via the `--config` flag on the command line if you don't want to have a configuration file.

### Protolock rules to `buf` configured rules

See the [breaking rules](../../breaking/rules/) documentation for an overview of all available breaking rules.

While we recommend using one of `buf`'s preset breaking categories, the below configuration selects the same rules as the rules enforced by Protolock:

::: info buf.yaml

```yaml
version: v2
breaking:
  use:
    - ENUM_VALUE_NO_DELETE_UNLESS_NAME_RESERVED
    - ENUM_VALUE_NO_DELETE_UNLESS_NUMBER_RESERVED
    - FIELD_NO_DELETE_UNLESS_NAME_RESERVED
    - FIELD_NO_DELETE_UNLESS_NUMBER_RESERVED
    - FIELD_SAME_NAME
    - FIELD_SAME_TYPE
    - RESERVED_ENUM_NO_DELETE
    - RESERVED_MESSAGE_NO_DELETE
    - RPC_NO_DELETE
    - RPC_SAME_CLIENT_STREAMING
    - RPC_SAME_REQUEST_TYPE
    - RPC_SAME_RESPONSE_TYPE
    - RPC_SAME_SERVER_STREAMING
```

:::

This roughly corresponds to the `WIRE_JSON` group, with some rules added and some deleted. The below configuration is equivalent to the above configuration:

::: info buf.yaml

```yaml
version: v2
breaking:
  use:
    - WIRE_JSON
    - RPC_NO_DELETE
  except:
    - ENUM_VALUE_SAME_NAME
    - FIELD_SAME_JSON_NAME
    - FIELD_SAME_LABEL
    - FIELD_SAME_ONEOF
    - MESSAGE_SAME_MESSAGE_SET_WIRE_FORMAT
    - RPC_SAME_IDEMPOTENCY_LEVEL
```

:::

### Protolock flags that are `buf` configuration options

The Protolock flag `--ignore` can be handled by the `breaking.ignore` and `breaking.ignore_only` configuration options.

The Protolock flag `--protoroot` doesn't have a direct equivalent, but is effectively handled by defining the workspace with a [`buf.yaml`](../../configuration/v2/buf-yaml/) configuration file.

The Protolock flag `--lockdir` is handled by your against input, as `buf` can take multiple types of input to compare against. The equivalent in `buf` is to specify your Buf image location with `--against path/to/lock.binpb`.

## Equivalent commands

There are multiple methods to compare versions in `buf`, see the [breaking usage](../../breaking/quickstart/) documentation for more details.

This section assumes you are using stored [Buf image](../../reference/images/) files as your method of comparing versions of your Protobuf schema.

### `protolock init`

```console
$ buf build -o lock.binpb
```

This writes a binary [Buf image](../../reference/images/) of your current Protobuf schema. If you prefer this to be stored as JSON, as Protolock does, instead write to a file with a `.json` extension, such as `buf build -o lock.json`. Note that by default, `buf build` include source code info, which makes the resulting file significantly larger. If this isn't a concern, we recommend keeping the source code info for usage with other parts of Buf, but if you are only using `buf` for breaking change detection, you can safely suppress source code info with the `--exclude-source-info` flag.

### `protolock status`

```console
$ buf breaking --against lock.binpb
```

This checks for breaking changes against the `lock.binpb` [Buf image](../../reference/images/) file. Use `buf breaking --against lock.json` if you wrote a JSON file.

### `protolock commit`

```console
$ buf breaking --against lock.binpb && buf build -o lock.binpb
```

## Docker

Protolock provides a [Docker image](https://hub.docker.com/r/nilslice/protolock) with `protolock` installed. The equivalent Docker image for `buf` is [bufbuild/buf](https://hub.docker.com/r/bufbuild/buf). For example:

```console
$ docker pull bufbuild/buf
$ docker run --volume "$(pwd):/workspace" --workdir "/workspace" bufbuild/buf lint
```
