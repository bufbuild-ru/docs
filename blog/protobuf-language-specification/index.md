---
sidebar: false
prev: false
next: false

title: "The Protobuf Language Specification"
description: "A comprehensive definition of the language, to empower a vibrant Protobuf ecosystem."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/protobuf-language-specification"
  - - meta
    - property: "og:title"
      content: "The Protobuf Language Specification"
  - - meta
    - property: "og:description"
      content: "A comprehensive definition of the language, to empower a vibrant Protobuf ecosystem."
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "The Protobuf Language Specification"
  - - meta
    - property: "twitter:description"
      content: "A comprehensive definition of the language, to empower a vibrant Protobuf ecosystem."
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# The Protobuf Language Specification

At Buf, our goal is to improve the way software systems integrate by making schema-driven development a ["pit of success"](https://ricomariani.medium.com/pit-of-success-for-organizations-a046a0eae7b2). And we've put our money on Protobuf as the winning way to describe those schemas. We are expanding on the work of the Protobuf team by providing the community a [complete language spec](https://protobuf.com/docs/language-spec).

Protobuf is the most stable and widely adopted IDL today. By building on Protobuf, we are standing on the shoulders of giants, those who have built and battle-tested it, and brought it to its current mature state. The official documentation, [Google's developer site](https://developers.google.com/protocol-buffers), is a great source of reference material. However, it does not contain a complete and thorough spec for the language. There are pages on the site that provide specs for the [proto2](https://developers.google.com/protocol-buffers/docs/reference/proto2-spec) and [proto3](https://developers.google.com/protocol-buffers/docs/reference/proto3-spec) syntax, but they are [incomplete and sometimes inaccurate](https://github.com/protocolbuffers/protobuf/issues?q=is%3Aissue+is%3Aopen+grammar+-label%3A%22enhancement%22).

In an unrelated [discussion](https://groups.google.com/g/golang-nuts/c/6dKNSN0M_kg/m/EUzcym2FBAAJ) about Go being "Google's Language", Ian Lance Taylor (one of the senior members of the Go team) wrote the following:

> A programming language is a type of shared software infrastructure. It's most useful when everybody is using the same language, so code written by person A can be reused by person B. That means that programming languages are most useful when we all agree on exactly what the language is. All successful languages have either a single specification or a single primary implementation. (Go and C++ are examples of language based on a specification; Perl, at least before Perl 6, is an example of a language based on an implementation). These serve as the definition of what the language is: whatever the specification says or whatever the implementation does.

Protobuf is solidly in the latter camp: it has a single primary implementation in the form of the compiler, `protoc`. The ecosystem around Protobuf has been unfortunately held back by this. [There](https://pkg.go.dev/github.com/jhump/protoreflect/desc/protoparse) [are](https://github.com/antlr/grammars-v4/tree/master/protobuf2) [a](https://github.com/antlr/grammars-v4/tree/master/protobuf3) [multitude](https://github.com/square/wire/) [of](https://github.com/emicklei/proto) [tools](https://github.com/tafia/quick-protobuf) [and](https://github.com/mafintosh/protocol-buffers-schema) [libraries](https://github.com/protostuff/protostuff-compiler) [that](https://github.com/stijnsanders/DelphiProtocolBuffer) [try](https://github.com/LiuRoy/proto_parser) [to](https://github.com/tallstoat/pbparser) [parse](https://github.com/jeremyong/eprotoc) [Protobuf](https://github.com/tafia/protobuf-parser) [source](https://github.com/yoheimuta/go-protoparser). But most of them are based on the incomplete specs from Google's developer site. _None_ of them can correctly predict what source files `protoc` will actually accept or reject 100% of the time.

In the interest of a vibrant ecosystem and community building around Protobuf, we are excited to correct these omissions. As of today, Protobuf is now a fully-defined language:

🎉 [**protobuf.com/docs/language-spec**](https://protobuf.com/docs/language-spec) 🎉

This means that users and tool makers now have a comprehensive source for what the Protobuf language is. With this knowledge, the quality of tools can vastly improve, and the existing tools can be made 100% correct.

As a side note, this work is a result of our work on the compiler that powers the `buf` [CLI](https://github.com/bufbuild/buf). We've built the compiler within the `buf` CLI to accurately match `protoc`. We've tested it against an extremely large corpus of real Protobuf sources, including some that use the most esoteric language syntax and features. Through the course of making Buf this robust alternative, we've learned a lot about the actual behavior of `protoc`, read all of its C++ code, and discovered how it behaves (sometimes surprisingly) in all manner of scenarios. We're excited to be able to share the Protobuf language specification as a formalized result of all of this hard work.

‍
