---

title: "Internal compiler - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/internal-compiler/"
  - - meta
    - property: "og:title"
      content: "Internal compiler - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/internal-compiler/"
  - - meta
    - property: "twitter:title"
      content: "Internal compiler - Buf Docs"

---

# Internal compiler

Protobuf is the most stable and widely adopted interface description language available today - it's why Buf is concentrating its initial efforts on Protobuf. But Protobuf has never had an officially published Protobuf grammar - [there are proto2 and proto3 specs published](https://protobuf.dev/reference/protobuf/proto3-spec/), but neither actually cover all edge cases, of which there are many (especially around options).In effect, the official Protobuf "grammar" is the `protoc` implementation - this has been the only codified representation of what Protobuf is, and the only way to properly parse Protobuf messages and produce [`FileDescriptorSet`](https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/descriptor.proto)s suitable for stub generation.Additionally, there are many situations outside of stub generation that rely on proper Protobuf parsing, such as [linting](../../lint/overview/) and [breaking change detection](../../breaking/overview/). All existing Protobuf tooling has gone one of two routes:

1.  Use a third-party Protobuf parser instead of `protoc` that produces non-`FileDescriptorSet` results. There are many third-party Protobuf parsers in existence, however no parser has been able to reliably cover all edge cases of the grammar, inevitably there are breakdowns that either result in parse errors, or an invalid representation of Protobuf sources. The edge cases in the Protobuf grammar are so numerous, that some of the most popular third-party parsers actually get around the problem by happily parsing invalid Protobuf, resulting in being unable to make a decision from these parsers as to whether or not a file is valid.
2.  Shell out to (or build against) `protoc`. This results in both accurate parsing, and `FileDescriptorSet` production, however this method presents a number of issues. First, actually managing external `protoc` installs becomes problematic - it makes any tooling reliant on either managing `protoc` installation itself, or relying on `protoc` being deterministically installed. Second, parsing `protoc`'s output is difficult, as there is no structured output format, both warnings and errors are printed to stderr, and the warning and error output changes between minor releases. To accurately parse `protoc`, tooling needs to handle every release of `protoc` as it comes out, which makes any such tooling unmaintainable. Additionally, `protoc` has different behavior depending on the location of the [Well-Known Types](https://protobuf.dev/reference/protobuf/google.protobuf/).

We find neither of these solutions to be tenable in the long-term for a tool that aims to manage your Protobuf schema. Therefore, we've taken a different route.The [internal compiler](https://pkg.go.dev/github.com/bufbuild/protocompile) quite literally replaces `protoc` outside of the built-in plugins (`--java_out`, `--cpp_out`, etc.). The resulting `FileDescriptorSet`s are tested for equivalence to `protoc`, including both `proto2` and `proto3` definitions, imports, [`FileDescriptorProto`](https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/descriptor.proto) ordering, [SourceCodeInfo](https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/descriptor.proto), and custom options. (We even took what we learned from building this compiler to write a [comprehensive language specification](https://protobuf.com/docs/language-spec)!)The resulting `FileDescriptorSet`s are almost byte equivalent to `protoc`, in fact - under most scenarios without `SourceCodeInfo`, you can actually compare the byte representation of a serialized `FileDescriptorSet` produced by `buf` and by `protoc`, and they're equal. There are two known exceptions that make this not always the case:

1.  `buf` produces slightly different SourceCodeInfo for the special `json_name` and `default` field options, to be consistent with SourceCodeInfo of other options. In `protoc`, the SourceCodeInfo for these special options is [inconsistent](https://github.com/protocolbuffers/protobuf/issues/10478).
2.  `buf` represents custom/unknown options slightly differently on the wire, although when deserialized, the result is equivalent for consumers of `FileDescriptorSet`s. The underlying compiler provides a work-around (see method `CanonicalProto` of [`linker.Result`](https://pkg.go.dev/github.com/bufbuild/protocompile@v0.1.0/linker#Result)), but `buf` doesn't enable it because it has both a performance and usability cost, and it has zero effect on any actual usage.

Besides removing the need to manually manage `protoc` and the [Well-Known Types](https://protobuf.dev/reference/protobuf/google.protobuf/) (which `buf` handles in all cases), `buf`'s compiler is _faster_ than `protoc` in most scenarios. `buf` parses your `.proto` files across all available cores, and re-orders the result to match `protoc`'s ordering as a post-processing task. As an example, `buf` can compile all 3,944 `.proto` files in [googleapis](https://github.com/googleapis/googleapis/tree/cb6fbe8784479b22af38c09a5039d8983e894566) in about 0.9s, on a 2022 MacBook Pro with an M1 Max chip, as opposed to about 1.6s for `protoc` v21.7 on the same machine.**We know this is all a series of big claims**. There have been many claims in the Protobuf community about producing non-`protoc`\-based parsing, so this is one of the reasons that we enable `protoc` output to be `buf` input. If you don't trust us, then use `protoc` as your compiler instead, no problem.It's also one of the reasons we've exposed [`buf build`](../../build/overview/)—you can produce `FileDescriptorSet`s yourself and pass them to your Protobuf plugins to verify that the resulting stubs are equivalent. There is one known exception with docs generated based on `json_name`, see [this issue](https://github.com/protocolbuffers/protobuf/issues/5587) to track this being updated within `protoc`.Instead of this...

::: info Adjust -I as necessary; this example includes the current directory

```console
$ rm -rf java
$ mkdir java
$ protoc -I . --java_out=java $(find . -name '*.proto')
```

:::

...you can use `buf`'s compiler to generate your stubs with the `--descriptor_set_in` flag of `protoc`. We need to do `buf build | buf ls-files -` instead of `buf ls-files` to make sure that the filenames are root.

```console
$ rm -rf java
$ mkdir java
$ buf build -o - | protoc --descriptor_set_in=/dev/stdin --java_out=java $(buf ls-files)
```

This results in protoc's internal parser not being used at all, so you can verify our claims further. If you do find an issue, [contact us](../../contact/).Having this new compiler is a key component of Buf's future. Right now, it enables reliable [linting](../../lint/overview/), [breaking change detection](../../breaking/overview/), [generation](../../generate/tutorial/), and the [BSR](../../bsr/). In the future, it enables a lot of other real-time possibilities for us.
