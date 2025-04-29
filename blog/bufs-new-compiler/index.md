---
layout: home

title: "Buf's New Compiler"
description: "Buf has a new Protobuf compiler that is faster and more memory-efficient."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/bufs-new-compiler"
  - - meta
    - property: "og:title"
      content: "Buf's New Compiler"
  - - meta
    - property: "og:description"
      content: "Buf has a new Protobuf compiler that is faster and more memory-efficient."
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Buf's New Compiler"
  - - meta
    - property: "twitter:description"
      content: "Buf has a new Protobuf compiler that is faster and more memory-efficient."
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

hero:
  name: "Buf's New Compiler"
  tagline: "October 19, 2022"
---

It may come as a surprise to some Buf users, but the Buf CLI uses a [custom Protobuf compiler](/docs/reference/internal-compiler/index.md), written in Go. Instead of shelling out to Google's reference compiler, `protoc`, the Buf CLI handles compilation of proto source files in process. We've put a lot of effort over the past couple of years into making sure our compiler matches the behavior of `protoc`, so that the switch to using Buf for new users is transparent and painless. (It was that same effort that led to our creation of a [comprehensive specification for the language](https://protobuf.com/docs/language-spec).)

Many might ask, "Why write a compiler?" One of the biggest reasons was for packaging of Buf: linking in a native Go compiler means that the Buf tool doesn't have any runtime dependencies. One of the big advantages of using Go to write the Buf CLI is that the result is a single, simple, statically linked binary. We don't have to deal with bundling the dependency and installing it when Buf is installed, or trying to download it on-demand at runtime. If you've never installed Google's Protobuf SDK, no problem. And we don't have to worry about different combinations of Buf and `protoc` versions potentially causing issues or confusion for our users.

Another benefit is concurrency. The `protoc` reference compiler is written in C++, and thus is very fast. But it is also single-threaded. So even though the compiled Go code is not as optimal, it more than makes up for this by making use of more than one CPU core. (See the graph below for more details.)

Today, with [v1.9.0](https://github.com/bufbuild/buf/releases/tag/v1.9.0), we have a _new_ compiler powering Buf: [github.com/bufbuild/protocompile](https://pkg.go.dev/github.com/bufbuild/protocompile@v0.1.0).

This new compiler has an all new API that has a few advantages:

1.  It uses the latest [v2 API](https://go.dev/blog/protobuf-apiv2) of the Protobuf runtime for Go. The [old compiler](https://pkg.go.dev/github.com/jhump/protoreflect@v1.13.0/desc/protoparse) was written before this newer API. So it has a different representation for descriptors that does not inter-operate as well with code that uses the v2 API.
2.  It was designed from the start with concurrency in mind, which enables some efficiencies that are not to be had in the old compiler. This is one of the factors that contributes to the new compiler's improved performance. (See more below!)
3.  The [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) model is much more efficient in terms of memory usage. An AST in this new compiler uses less than half the memory of an AST in the old compiler. The way nodes track their position information is now more like how the [go/token](https://pkg.go.dev/go/token) and [go/ast](https://pkg.go.dev/go/ast) packages in the Go standard library work (for parsing Go source code). You must query for node information (like position and attached comments) from an index, instead of each node holding all of that information. This approach shrinks the size of every node in the tree.
4.  The stages of the compiler are now accessible as separate exported APIs. This allows callers to do interesting custom things without requiring the main compiler entry point to expose numerous options and switches. So the main API is simpler and more coherent, while still retaining all capabilities of the previous API. This also led to better code organization, instead of having nearly everything in a single monolithic package.

A big benefit of the new compiler is its [increased performance](https://github.com/bufbuild/protocompile/pull/64). It is about 20% faster than the old compiler when including source code info; it's a whopping 50% faster if excluding source code info.

![Benchmark numbers for compiler speed](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6748b02c22370e881d26f0b2_compiler-perf-graph-TAAASL32.png)

It also allocates 14% less memory when compiling (35% less if excluding source code info). More significant than the reduced allocations (and the much smaller representation for ASTs mentioned above): for large compilation operations, its peak memory usage will be less than half that of the old compiler.

Finally, the new compiler implements some [additional checks](https://github.com/bufbuild/buf/blob/v1.9.0/CHANGELOG.md?plain=1#L16-L26) that are absent from the old one. That means that the set of files the new compiler will accept is even more faithful to [the spec](https://protobuf.com/docs/language-spec) and to Google's `protoc` reference implementation.

Day to day users of Buf will probably not notice a difference. After all, the Protocol Buffers language is simple and is very fast to compile compared to Turing-complete languages. If users do experience latency when using Buf, code generation (and the various plugins that implement it) is more likely to blame than the compiler. But we also use the compiler inside the Buf Schema Registry, to implement features like [generated documentation](/docs/bsr/documentation/overview/index.md), [remote plugins](/docs/bsr/remote-plugins/overview/index.md), and [generated SDKs](/docs/bsr/generated-sdks/overview/index.md). So the new compiler will provide operational improvements in the BSR.

Having a custom, pure Go compiler also provides other operational benefits, such as deployment simplicity. It gives us full control over the compiler's internals and behavior; for where we might take this, the sky is the limit! Other things we're thinking about include a "streaming" compilation mode, which could enable extremely lean memory utilization even if compiling a very large module, and generation of additional artifacts, allowing us to put more interesting metadata in a Buf [image](/docs/reference/images/index.md#what-are-buf-images) beyond just what is present in descriptors.

If you are interested in using the new compiler in your own Go projects, you can [clone it](https://github.com/bufbuild/protocompile/) and give it a try. It is currently at v0.1 and will be promoted to v1 as the API contract stabilizes. We welcome [feedback](https://github.com/bufbuild/protocompile/issues/new) and experience reports from integrating the compiler into your own projects. You can also try it out by [installing the latest version of Buf](/docs/cli/installation/index.md)!

‍
