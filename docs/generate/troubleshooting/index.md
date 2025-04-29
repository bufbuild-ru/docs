---

title: "Troubleshooting code generation - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/generate/troubleshooting/"
  - - meta
    - property: "og:title"
      content: "Troubleshooting code generation - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/generate/troubleshooting/"
  - - meta
    - property: "twitter:title"
      content: "Troubleshooting code generation - Buf Docs"

---

# Troubleshooting code generation

## How to check if generated code is up-to-date

Run `buf generate` and check for a diff in your VCS (either locally or as part of your CI workflow).

## C# error: `Failure: file "..." was generated multiple times`

C# plugins require you to set a `base_namespace` option in `buf.gen.yaml` to tell the plugin to generate files in a directory hierarchy matching the class namespace. A configuration similar to this should fix the issue:

```yaml
version: v1
managed:
  enabled: true
plugins:
  - plugin: buf.build/protocolbuffers/csharp
    out: gen/proto/csharp
    opt: base_namespace=NAMESPACE // [!code highlight]
```

## Python error: `ModuleNotFoundError: No module named 'buf…'`

This is a [known issue](https://github.com/protocolbuffers/protobuf/issues/881) with generating Python code. For a simple workaround, we recommend [creating an `__init__.py` file](https://github.com/protocolbuffers/protobuf/issues/881#issuecomment-1615919615) in the root of your generated code.

## PHP gRPC plugin doesn't generate interfaces with the Buf CLI but does generate them with `protoc`.

The `php_generic_services` file option must be set to generate interfaces, but [Protobuf removed the option](https://github.com/protocolbuffers/protobuf/pull/15164). It only works with older versions of `protoc` and doesn't work with the Buf CLI.
