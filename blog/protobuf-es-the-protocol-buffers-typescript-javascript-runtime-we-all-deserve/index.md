---
sidebar: false
prev: false
next: false

title: "Protobuf-ES: The Protocol Buffers TypeScript/JavaScript runtime we all deserve"
description: "An idiomatic Protocol Buffers library for TypeScript and JavaScript is now available."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/protobuf-es-the-protocol-buffers-typescript-javascript-runtime-we-all-deserve"
  - - meta
    - property: "og:title"
      content: "Protobuf-ES: The Protocol Buffers TypeScript/JavaScript runtime we all deserve"
  - - meta
    - property: "og:description"
      content: "An idiomatic Protocol Buffers library for TypeScript and JavaScript is now available."
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Protobuf-ES: The Protocol Buffers TypeScript/JavaScript runtime we all deserve"
  - - meta
    - property: "twitter:description"
      content: "An idiomatic Protocol Buffers library for TypeScript and JavaScript is now available."
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Protobuf-ES: The Protocol Buffers TypeScript/JavaScript runtime we all deserve

Today we're excited to announce the release of [Protobuf-ES](https://github.com/bufbuild/protobuf-es), an implementation of Protocol Buffers for TypeScript and JavaScript with full support for the [ECMAScript standard](https://262.ecma-international.org/13.0/).

**Protobuf-ES** was built with JavaScript developers in mind. Its intent is to not only fix the areas that are sorely inadequate in current implementations, but to also include important features that are currently lacking such as:

- [ECMAScript module support](/blog/protobuf-es-the-protocol-buffers-typescript-javascript-runtime-we-all-deserve/index.md#ecmascript-module-support)
- [Usage of standard JavaScript APIs](/blog/protobuf-es-the-protocol-buffers-typescript-javascript-runtime-we-all-deserve/index.md#usage-of-standard-javascript-apis)
- [Descriptor and Reflection support](/blog/protobuf-es-the-protocol-buffers-typescript-javascript-runtime-we-all-deserve/index.md#descriptor-and-reflection-support)
- [Idiomatic generated code](/blog/protobuf-es-the-protocol-buffers-typescript-javascript-runtime-we-all-deserve/index.md#idiomatic-generated-code)
- [First-class TypeScript support](/blog/protobuf-es-the-protocol-buffers-typescript-javascript-runtime-we-all-deserve/index.md#first-class-typescript-support)
- [Conformance test compatibility](/blog/protobuf-es-the-protocol-buffers-typescript-javascript-runtime-we-all-deserve/index.md#compatibility)

JavaScript is everywhere. It is used in basically every web application and is now becoming almost ubiquitous in backend, mobile, and even desktop applications. It has been the [top language on GitHub](https://octoverse.github.com/#top-languages-over-the-years) for the last 8 years. Atwood's Law is more relevant than ever: any application that _can_ be written in JavaScript, _will_ eventually be written in JavaScript.

Currently, the predominant technologies to facilitate this growth are [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) and [JSON](https://www.json.org/json-en.html). While these technologies may seem easy to use, over time they can present a host of problems. They require heavy maintenance, offer no protection against breaking changes, and tend to waste countless engineering hours with manual implementation of data structures — all difficulties that belie their perceived simplicity.

At Buf, we believe there is a simple solution to the problems that REST and JSON present and that solution is Protocol Buffers. Protocol Buffers (or Protobuf for short) provide a schema-driven approach to services. So rather than freeform APIs with varying standards, inconsistent naming conventions, and no ability to handle breaking changes, Protobuf provides a pre-defined schema for your APIs. This has numerous benefits, such as:

- Enhancing developer experience as well as developer productivity through capabilities such as auto-generated boilerplate code.
- Opening up the door to tooling, which can provide abilities such as autocomplete and go-to-definition when coding your APIs.
- Support for breaking changes, allowing clients and servers alike to make changes without fear of unknown breakages.
- Consistency across API boundaries enforced by linters and formatters.

But, for this to come to fruition, Protobuf needs to be just as easy to use from the frontend as it is from the backend. Browser-to-server communication with Protobuf needs to be seamless, not just server-to-server.

The problem, though, is that browser-to-server communication is _not_ seamless. The current state of Protobuf in JavaScript is _not_ easy to use. The constant churn, lack of attention and support, and poor standards aren't really allowing this particular area of Protocol Buffers to flourish. With all the importance and dominance of JavaScript in the application space, it would be remiss of us to promote Protocol Buffers as a panacea until these problems are addressed.

That's why we created **Protobuf-ES**. We believe it is the solid foundation that help move the industry forward.

## Features and Improvements

**Protobuf-ES** addresses various issues that exist today in the Protocol Buffers for JavaScript ecosystem. At the same time, it adds necessary features that will help make Protobuf the obvious choice when developing JavaScript applications.

### ECMAScript module support

**Protobuf-ES** provides full support for ECMAScript module syntax. Aside from adhering to widely-accepted specifications, this also provides the benefit of promoting tree-shaking, which is essentially dead-code elimination. Tree-shaking is made possible due to the static nature of ES import syntax. This results in [much smaller bundle sizes](https://github.com/bufbuild/protobuf-es/tree/main/packages/bundle-size) when using **Protobuf-ES**.

### Usage of standard JavaScript APIs

**Protobuf-ES** makes use of standard APIs and objects, such as [TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder) and [Typed Arrays](https://tc39.es/ecma262#sec-typedarray-objects). It doesn't rely on esoteric, internal APIs under the hood. Instead, it utilizes code that the community is familiar with, not code that is homegrown and optimized for certain environments.

The benefits of the above can be illustrated by a real world example we encountered. For the [Buf Schema Registry](https://buf.build/product/bsr/), we use [React](https://github.com/facebook/react) as our web framework and [Connect](https://connectrpc.com/) as our RPC layer. Prior to **Protobuf-ES**, we used the [official Protobuf code generator for JavaScript](https://github.com/protocolbuffers/protobuf-javascript).

As we were debugging a performance issue one day, we took a look at our bundle (the JavaScript files that make up our web application). In doing so, we noticed that the Protobuf implementation and the generated code dominated the bundle size with a whopping **62%** share:

![pre-migration](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6747d26a4287b656e5d4aa61_pre-migration-2Z3PKPZG.png)

That is a fantastically bad ratio for a technology used everywhere in mobile and web applications -- two areas highly concerned with speed and bandwidth. More specifically, this affects our users because large bundle sizes mean that our customer-facing application takes longer to load. [Research suggests](https://www.thinkwithgoogle.com/marketing-strategies/app-and-mobile/mobile-page-speed-new-industry-benchmarks/) that the probability of a mobile site visitor bouncing increases by **123%** if the page load time goes from one second to 10 seconds.

After some digging, we realized the reason for the large bundle sizes is largely attributed to two things:

- The Protobuf runtime library [does not use the standard module system](https://github.com/protocolbuffers/protobuf/issues/4274), which hampers tree-shaking by [modern bundlers](https://webpack.js.org/guides/tree-shaking/).
- The generated code relies on Google's [Closure Library](https://developers.google.com/closure/library) instead of built-in APIs.

Compare that with the bundle allocation after we migrated our stack to **Protobuf-ES**. If we generate JavaScript and TypeScript declaration files (the default), not only does the overall bundle size drop by more than half, the generated code and runtime libraries shrink to a much-more-reasonable **15%**.

![post-migration-with-dts](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6747d26a68e9755d6d496161_post-migration-with-dts-RRRZUEYZ.png)

### Descriptor and Reflection support

**Protobuf-ES** offers a reduced set of descriptors that provide just enough information for tasks such as [creating types at run time from a set of descriptors](https://github.com/bufbuild/protobuf-es/blob/main/docs/runtime_api.md#registries) produced by a Protobuf compiler.

During development of [Buf Studio](/blog/buf-studio/index.md), we wanted to serialize and deserialize messages, but only have an [image](/docs/reference/images/index.md) available at run time, and no generated code. This type of approach requires Protobuf descriptors and reflection. Some Protobuf implementations provide facilities for this situation such as [Java](https://developers.google.com/protocol-buffers/docs/reference/java/com/google/protobuf/DynamicMessage) and [Go](https://pkg.go.dev/google.golang.org/protobuf/types/dynamicpb), but the JavaScript implementation does not. In fact, it [does not support descriptors at all](https://github.com/protocolbuffers/protobuf-javascript/issues/99). There is also [no support for reflection](https://github.com/protocolbuffers/protobuf/issues/1711), and [no way to get package and type metadata](https://github.com/protocolbuffers/protobuf-javascript/issues/89).

### Idiomatic generated code

**Protobuf-ES** generates idiomatic code with [initializers and plain properties](https://github.com/bufbuild/protobuf-es/blob/main/docs/runtime_api.md#message-class), adopting the best features from the community generators. This means no more clunky getters and setters. You can now use things like the spread operator and make use of the same JavaScript semantics you've grown used to.

For example, given a Protobuf file such as:

```protobuf
syntax="proto3";
package docs;

message Example {
  string foo = 1;
  bool bar = 2;
  Example baz = 3;
  repeated string names = 4;
  map<string, string> statuses = 5;
}
```

you can use direct property access:

```typescript
msg.foo = "Hello";
msg.bar = true;
msg.baz.foo = "World";
```

and you won't get confusing methods like `getNamesList`, `setNamesList`, `getStatusMap`, and `clearStatusMap`. You won't have to access nested messages by doing things like `msg.getBaz().getNamesList()`. You will work with the same familiar syntax:

```typescript
msg.names = [];

const names = foo.names;

msg.statuses = {
  bar: "created",
};
```

and you can initialize your objects conveniently using the `new` operator or passing an initializer object to constructors:

```typescript
// Using new
const message = new Example();

// Using an object in the constructor
new Example({
  foo: "Hello",
  bar: true,
  baz: {
    // you can simply pass an initializer object for this message field
    foo: "world",
  },
});
```

All of this might seem like a small issue at face value, but over time and as your codebase grows, all of these deviations add up and can become a real hassle. For example, compare this with some of the problems in current JavaScript Protobuf code generators:

**Atypical Getters and Setters**

The generated JavaScript code creates `get` and `set` methods for all your properties but it does so in a manner that JavaScript developers will **not** find intuitive. The access methods [do not follow ES6 class semantics](https://github.com/protocolbuffers/protobuf-javascript/issues/93), `repeated` field accessors are [curiously named with `List` appended to them](https://github.com/protocolbuffers/protobuf-javascript/issues/42), [`map` fields have no setters generated](https://github.com/protocolbuffers/protobuf/issues/4356), [CamelCase generation is inconsistent](https://github.com/protocolbuffers/protobuf-javascript/issues/17), and [accessing inner messages is cumbersome](https://github.com/protocolbuffers/protobuf-javascript/issues/79).

**Missing Initializers**

Initializing values in your generated objects can be a chore, especially if you have large messages. You [cannot pass objects to constructors](https://github.com/protocolbuffers/protobuf/issues/5783), so creating messages can be confusing and error-prone. Further, even when helpful enhancements are added such as method chaining, they are [scarcely documented or mentioned](https://github.com/protocolbuffers/protobuf/issues/6860#issuecomment-568600937).

**Confusing Methods**

The `toObject` method is an exposed method that, on the surface, seems like it converts your generated code to a JSON object. However, it was [never really intended for that](https://github.com/protocolbuffers/protobuf-javascript/issues/95#issuecomment-1128003168) and to make matters worse, it comes with numerous problems as evidenced by these issues on both the [Protocol Buffers repo](https://github.com/protocolbuffers/protobuf/issues?q=2056+6357) and the new [Protobuf JavaScript repo](https://github.com/protocolbuffers/protobuf-javascript/issues?q=11+14+30+33+37+96).

In sum, the generated code is unlikely to mesh well with the typical paradigms used in the business and presentation logic of a JavaScript application. This hurts developer productivity.

### First-Class TypeScript support

As you might suspect, [TypeScript](https://www.typescriptlang.org/) is an excellent match for Protocol Buffers. It provides beneficial type-safety to the otherwise dynamically-typed language. As a result, **Protobuf-ES** supports TypeScript as a first-class citizen right alongside vanilla JavaScript. You have the option to generate TypeScript files as well as TypeScript declaration files (`.d.ts`).

Compare this with the current code generator, which [does not support it](https://github.com/protocolbuffers/protobuf/pull/9412#issuecomment-1013300071). Further, the Protobuf JavaScript repo has [no concrete plans to provide support](https://github.com/protocolbuffers/protobuf-javascript/issues?q=69+98). That means you need to find a 3rd party plugin to generate type declaration files (for example [`ts-protoc-gen`](https://www.npmjs.com/package/ts-protoc-gen)). In addition to this being yet another tool and yet another configuration, it always leaves a lingering doubt that the types you now rely on are really in sync with the code generator.

In addition to the above, there is a whole list of other issues in the current ecosystem that **Protobuf-ES** solves or that we pledge to improve, such as:

- [confusing plugin options](https://github.com/protocolbuffers/protobuf/issues/2556)
- [bad IDE integration](https://github.com/protocolbuffers/protobuf/issues/8389)
- [global scope pollution](https://github.com/protocolbuffers/protobuf/issues/4271)
- [no wrapper unboxing](https://github.com/protocolbuffers/protobuf/issues/5162)
- the [lack of JSON support](https://github.com/protocolbuffers/protobuf-javascript/issues?q=28+95)
- the problematic representation of [64-bit integral types](https://github.com/protocolbuffers/protobuf/issues?q=4338+5674+3666+7244+4895)
- [poor communication and cooperation with the community](https://github.com/protocolbuffers/protobuf/pull/9874)

## Compatibility

So, why should you trust this library? We've already talked about what sets it apart from the rest, but what about compatibility with other Protocol Buffer implementations? We're glad you asked. We ensure compatibility with other implementations through the [conformance test suite](https://github.com/bufbuild/protobuf-es/tree/main/packages/protobuf-conformance) which runs Google's [conformance tests](https://github.com/protocolbuffers/protobuf/tree/main/conformance) to guarantee the completeness and correctness of our generated code.

## Alternatives

Granted, some amazing alternatives have sprung up from the community, all of which we evaluated before deciding to write our own. However, none of them checks all the boxes for us:

| Feature / Generator                                                                                                                       | [protobuf.js](https://github.com/protobufjs/protobuf.js) | [ts-proto](https://github.com/stephenh/ts-proto) | [protobuf-ts](https://github.com/timostamm/protobuf-ts) | [protoc-gen-ts](https://github.com/thesayyn/protoc-gen-ts) | [Protobuf-ES](https://github.com/bufbuild/protobuf-es) |
| ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------ |
| [Standard plugin](/docs/reference/images/index.md#plugins)                                                                                | ❌                                                       | ✅                                               | ✅                                                      | ✅                                                         | ✅                                                     |
| [Conformance tests](https://github.com/protocolbuffers/protobuf/tree/main/conformance#protocol-buffers---googles-data-interchange-format) | ❌                                                       | ❌                                               | ✅                                                      | ❌                                                         | ✅                                                     |
| Fully tree-shakeable                                                                                                                      | ❌                                                       | ✅                                               | ✅                                                      | ❌                                                         | ✅                                                     |
| Actively maintained                                                                                                                       | ❌                                                       | ✅                                               | ✅                                                      | ✅                                                         | ✅                                                     |
| Vanilla JavaScript support                                                                                                                | ✅                                                       | ❌                                               | ✅                                                      | ❌                                                         | ✅                                                     |
| Fast code generation                                                                                                                      | ✅                                                       | ✅                                               | ❌                                                      | ❌                                                         | ✅                                                     |

[ts-proto](https://github.com/stephenh/ts-proto) and [protobuf-ts](https://github.com/timostamm/protobuf-ts) are close, but they try to solve code generation for Protobuf types _and_ code generation for Remote Procedure Calls (RPC) at once, adding options like [`--ts_opt=target=web`](https://github.com/thesayyn/protoc-gen-ts/pull/102), or [`--ts_proto_opt=nestJs=true`](https://github.com/stephenh/ts-proto/blob/main/NESTJS.markdown#supported-options).

This approach works out to some degree, but only until the number of options becomes detrimental to the developer experience. Ultimately, this approach leads to an isolated, tightly-coupled solution that tries to do everything at once. This makes for a frustrating developer experience. **Protobuf-ES** improves on this through a plugin ecosystem that allows decoupling of the base type generator and the RPC generators. This plugin framework allows you to easily write your own JavaScript plugins, providing the ability to generate TypeScript, JavaScript, and declaration files. It also provides the option to solely generate TypeScript files and transpile the rest. Check out the [plugin docs](https://github.com/bufbuild/protobuf-es/blob/main/docs/writing_plugins.md) for more information.

### What's next?

As mentioned above, **Protobuf-ES** is a foundational piece, but one which we intend to build soundly upon. We take breaking changes and developer relations very seriously, so rest assured this will be our focus for years to come.

We have many enhancements in store, so if there's something you'd like to see, reach out on our [Slack](https://buf.build/b/slack) or on [GitHub](https://github.com/bufbuild/protobuf-es/issues).

After all, doesn't JavaScript demand a well-defined, well-maintained solution?
