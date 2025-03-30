---
layout: home

hero:
  name: "Protobuf-ES has reached version 1.0"
---

Back in October, [we announced](/blog/protobuf-es-the-protocol-buffers-typescript-javascript-runtime-we-all-deserve/index.md) the release of [Protobuf-ES](https://github.com/bufbuild/protobuf-es/), an idiomatic Protocol Buffers library for TypeScript and JavaScript with full support for the ECMAScript standard.

**Now, as we enter the new year, we are pleased to announce that Protobuf-ES has officially reached the v1.0 milestone!**

## Background

**Protobuf-ES** is a complete implementation of Protocol Buffers in TypeScript, suitable for web browsers and Node.js. Its goal is to serve as a modern Protobuf implementation for the JavaScript ecosystem.

A few of the features that set **Protobuf-ES** apart:

- [ECMAScript module support](/blog/protobuf-es-the-protocol-buffers-typescript-javascript-runtime-we-all-deserve/index.md#ecmascript-module-support)
- [First-class TypeScript support](/blog/protobuf-es-the-protocol-buffers-typescript-javascript-runtime-we-all-deserve/index.md#first-class-typescript-support)
- Generation of [idiomatic JavaScript and TypeScript code](https://github.com/bufbuild/protobuf-es/blob/main/docs/generated_code.md)
- Generation of [much smaller bundles](https://github.com/bufbuild/protobuf-es/blob/main/packages/bundle-size)
- Implementation of all proto3 features, including the [canonical JSON format](https://developers.google.com/protocol-buffers/docs/proto3#json)
- Implementation of all proto2 features, except for extensions and the text format
- Usage of standard JavaScript APIs instead of the [Closure Library](http://googlecode.blogspot.com/2009/11/introducing-closure-tools.html)
- Compatibility coverage via the Protocol Buffers [conformance tests](https://github.com/bufbuild/protobuf-es/blob/main/packages/protobuf-conformance)
- [Descriptor and reflection support](https://github.com/bufbuild/protobuf-es/blob/main/docs/runtime_api.md#reflection)

After our October announcement, we invested time to polish the library and ensure everything was ready for v1.0. We fixed a few bugs, beefed up the documentation, and made some minor improvements behind the scenes. As we launch v1.0, the code and the APIs are stable - we take SemVer very seriously, and the burden for stability is on us, not on users.

### Did you know?

One of the most intriguing features of Protobuf-ES is its comprehensive plugin framework which allows users to write their own code generator plugins for Protobuf to output TypeScript files (`.ts`), JavaScript files (`.js`), and TypeScript declaration files (`d.ts`).

Generator functions can be specified for any of the 3 targets. Only the TypeScript generator is required, and the plugin framework can automatically transpile generated TypeScript files into the desired outputs if the `.js` or `.d.ts` generators are not provided. Additionally, these functions are able to retrieve any [custom options](https://developers.google.com/protocol-buffers/docs/proto3#customoptions) specified in Protobuf files when generating code. More details on writing plugins can be found in [the docs](https://github.com/bufbuild/protobuf-es/blob/main/docs/writing_plugins.md#providing-generator-functions).

The plugin capabilities of Protobuf-ES are the first of their kind in the JavaScript / Protobuf ecosystem. The built-in [`protoc-gen-es`](https://github.com/bufbuild/protobuf-es/tree/main/packages/protoc-gen-es) plugin is a complete decoupling of Protobuf message types from RPC types. Stated differently, [`protoc-gen-es`](https://github.com/bufbuild/protobuf-es/tree/main/packages/protoc-gen-es) is a foundational plugin that can be used either standalone or in conjunction with other plugins that generate RPC types, such as Connect-ES’ [`protoc-gen-connect-es`](https://github.com/connectrpc/connect-es/tree/main/packages/protoc-gen-connect-es).

To explore a few concrete examples, consider the official [`protoc-gen-es` plugin](https://github.com/bufbuild/protobuf-es/tree/main/packages/protoc-gen-es) and [an example](https://github.com/bufbuild/protobuf-es/tree/main/packages/protoplugin-example) of using the framework to create a [Twirp](https://twitchtv.github.io/twirp/docs/spec_v7.html) plugin in the Protobuf-ES repo. Both provide a great starting point for understanding how these components fit together.

The framework is a powerful tool for users to create their own plugins and generate different kinds of outputs from Protobuf files. To get started writing your own plugin, visit the [documentation](https://github.com/bufbuild/protobuf-es/blob/main/docs/writing_plugins.md).

## Alternatives

Although there are a number of alternatives to Protobuf-ES, none of them offer the same comprehensive suite of features:

| Feature / Generator                                                                                                                       | [protobuf.js](https://github.com/protobufjs/protobuf.js) | [ts-proto](https://github.com/stephenh/ts-proto) | [protobuf-ts](https://github.com/timostamm/protobuf-ts) | [protoc-gen-ts](https://github.com/thesayyn/protoc-gen-ts) | [Protobuf-ES](https://github.com/bufbuild/protobuf-es) |
| ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------ |
| [Standard plugin](/docs/reference/images/index.md#plugins)                                                                                | ❌                                                       | ✅                                               | ✅                                                      | ✅                                                         | ✅                                                     |
| [Conformance tests](https://github.com/protocolbuffers/protobuf/tree/main/conformance#protocol-buffers---googles-data-interchange-format) | ❌                                                       | ❌                                               | ✅                                                      | ❌                                                         | ✅                                                     |
| Fully tree-shakeable                                                                                                                      | ❌                                                       | ✅                                               | ✅                                                      | ❌                                                         | ✅                                                     |
| Actively maintained                                                                                                                       | ❌                                                       | ✅                                               | ✅                                                      | ✅                                                         | ✅                                                     |
| Vanilla JavaScript support                                                                                                                | ✅                                                       | ❌                                               | ✅                                                      | ❌                                                         | ✅                                                     |
| Fast code generation                                                                                                                      | ✅                                                       | ✅                                               | ❌                                                      | ❌                                                         | ✅                                                     |

If you are currently using one of these and would like to give Protobuf-ES a try, please see our [migration guide](https://github.com/bufbuild/protobuf-es/blob/main/docs/migrating.md) for some helpful tips.

## Community support

We would like to thank the community for the strong support we've received — Protobuf-ES is currently getting over [10K weekly downloads on NPM](https://www.npmjs.com/package/@bufbuild/protobuf)! All of the feedback and contributions have been extremely valuable. Our early adopters played a big role in helping us iron out the kinks and stabilize a product that we believe will become foundational for JavaScript and TypeScript development.

## Upgrade or try Protobuf-ES now

If you're a current Protobuf-ES user, we recommend upgrading now. If you haven't tried it yet, you can get started by visiting the [Protobuf-ES repo](https://github.com/bufbuild/protobuf-es/) (and [docs](https://github.com/bufbuild/protobuf-es#documentation)), or by [downloading it directly from NPM](https://www.npmjs.com/package/@bufbuild/protobuf). For any questions or concerns, don't hesitate to reach out to us on [Slack](https://buf.build/b/slack) - we’re happy to help.

Again, a big thank you to all our contributors, and here's to a great 2023! 🎉

‍
