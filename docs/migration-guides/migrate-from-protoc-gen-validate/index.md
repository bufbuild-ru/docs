---

title: "Migrate from protoc-gen-validate - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/migration-guides/migrate-from-protoc-gen-validate/"
  - - meta
    - property: "og:title"
      content: "Migrate from protoc-gen-validate - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/migration-guides/migrate-from-protoc-gen-validate/"
  - - meta
    - property: "twitter:title"
      content: "Migrate from protoc-gen-validate - Buf Docs"

---

# Migrate from protoc-gen-validate

Migrating from `protoc-gen-validate` to Protovalidate should be safe, incremental, and relatively painless. We recommend migrating to Protovalidate using the migration tool, but there may be cases where manual migration is required or preferred. Each workflow is outlined below.

::: tip NoteProtovalidate performs all validations using reflection, so there's no `protoc` plugin to use or manage, and it doesn't require any code generation. You don't need the `protoc-gen-validate` plugin, and shouldn't use it with Protovalidate.

:::

## Using the migration tool

### Prerequisites

- Have [`git`](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [`go`](https://go.dev/dl/) installed and in your `$PATH`.
- Clone the `protovalidate` repo and go to its directory:

  ```console
  $ git clone https://github.com/bufbuild/protovalidate.git && cd protovalidate
  ```

### Migration workflow

1.  **(Optional) Format Protobuf files**Though the migration tool does a best-effort attempt to preserve the formatting of the original file, it may produce valid but ill-formatted code. To reduce noise related to reformatting, run a formatter (such as [`buf format`](../../format/style/)) over the corpus of `.proto` files and commit its changes before proceeding.
2.  **Run the migration tool**This first run adds matching Protovalidate annotations alongside any existing `protoc-gen-validate` annotations. Optionally, run the formatter again after the migration tool to clean up any strange output.

    ```console
    $ go run ./tools/protovalidate-migrate -w /path/to/protos
    ```

3.  **Use Protovalidate**Update code that uses `protoc-gen-validate` code generation to consume the Protovalidate library instead (or simultaneously).
4.  **(Optional) Update pre-existing Protovalidate annotations**Rerunning the migration tool is a no-op for any `.proto` files that already import Protovalidate. Replace any pre-existing annotations by running the tool with the `--replace-protovalidate` flag. This ensures that these annotations match `protoc-gen-validate` annotations.

    ```console
    $ go run ./tools/protovalidate-migrate -w --replace-protovalidate /path/to/protos
    ```

5.  **Remove `protoc-gen-validate` annotations**Once you're ready to make the switch and have removed references to the `protoc-gen-validate` generated code, run the migration tool again with the `--remove-legacy` flag to remove legacy annotations from `.proto` files.

    ```console
    $ go run ./tools/protovalidate-migrate -w --remove-legacy /path/to/protos
    ```

### Usage and flags

::: info Example usage

```console
$ go run ./tools/protovalidate-migrate <flags> /path/to/proto
```

:::

#### `-v`, `--verbose`

Enables verbose logging. Defaults to `false`.

#### `-w`, `--write`

Overwrites target files in-place. Defaults to `false`.

#### `-o`, `--output`

Writes output to the given path. If omitted, and `-w` isn't specified, modified Protobuf is emitted to stdout.

#### `--legacy-import`

Specifies a `protoc-gen-validate` Protobuf import path. Defaults to `validate/validate.proto`.

#### `--protovalidate-import`

Specifies a Protovalidate Protobuf import path. Defaults to `buf/validate/validate.proto`.

#### `--remove-legacy`

Allows the program to remove `protoc-gen-validate` options. Defaults to `false`.

#### `--replace-protovalidate`

Replaces Protovalidate options to match `protoc-gen-validate` options (only if present). Defaults to `false`.

::: tip NoteIf neither `-w` nor `-o` is specified, modified Protobuf is emitted to stdout.

:::

## Migrating manually

1.  **Understand the changes**The first step to manual migration is understanding the changes between `protoc-gen-validate` and Protovalidate. Review the [Standard constraint changes](#standard-constraint-changes) section of this guide to understand how constraints have changed.
2.  **Update imports**Replace any imports of `validate/validate.proto` with `buf/validate/validate.proto` in your `.proto` files.
3.  **Update message-level constraints**Replace `(validate.ignored)` and `(validate.disabled)` with the new `(buf.validate.message)` option as described in the [Message constraints](#message-constraints) section.
4.  **Update oneof constraints**Replace `(validate.required)` for oneof fields with the new `(buf.validate.oneof)` option as described in the [Oneof constraints](#oneof-constraints) section.
5.  **Update field-level constraints**Replace all field-level constraints, including `(validate.rules).<TYPE>.required`, `(validate.rules).message.skip`, and `(validate.rules).<TYPE>.ignore_empty`, with the new `(buf.validate.field)` option as described in the [Field constraints](#field-constraints) section.
6.  **Remove unnecessary constraints**Remove the `(validate.rules).map.no_sparse` constraint, as it's not supported in Protovalidate.
7.  **Test and validate**After performing the above steps, test your Protobuf code to ensure it's functioning as expected. Review any warnings or errors, making corrections as necessary.

## Standard constraint changes

As part of the migration process, note the following changes to the standard constraints between `protoc-gen-validate` and Protovalidate:

### Message constraints

- All message-level constraints have moved into a single option: `(buf.validate.message)`.
- `(validate.ignored)` has been removed. Protovalidate doesn't generate code, so generation doesn't need to be skipped.
- `(validate.disabled)` has moved to `(buf.validate.message).disabled`.

### Oneof constraints

- All oneof-level constraints have moved into a single option: `(buf.validate.oneof)`.
- `(validate.required)` has moved to `(buf.validate.oneof).required`.

### Field constraints

- All field-level constraints have moved into a single option: `(buf.validate.field)`.
- `(validate.rules).<TYPE>.required` has moved to `(buf.validate.field).required`. The semantics of "required" have changed and been clarified. Consult the [field constraints API definition](https://buf.build/bufbuild/protovalidate/docs/main:buf.validate#buf.validate.FieldConstraints) to ensure they match expectations compared to their behavior in `protoc-gen-validate`.
- `(validate.rules).message.skip` has been replaced by setting `(buf.validate.field).ignore` to `IGNORE_ALWAYS`. Consult the [ignore API definition](https://buf.build/bufbuild/protovalidate/docs/main:buf.validate#buf.validate.Ignore) to see which semantics match expectations.
- `(validate.rules).<TYPE>.ignore_empty` has been replaced by setting `(buf.validate.field).ignore` to `IGNORE_IF_UNPOPULATED`. Consult the [ignore API definition](https://buf.build/bufbuild/protovalidate/docs/main:buf.validate#buf.validate.Ignore) to see which semantics match expectations.
- `(validate.rules).map.no_sparse` has been removed. The original rule accommodated for a situation that was exclusively possible in Go code generation. Protovalidate now treats a sparse map value as an empty value, matching the semantics of the Go Protobuf runtime.
