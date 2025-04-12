# Further reading

To learn about contributing to Protovalidate, its technical foundations, and interesting uses of Protovalidate, we encourage you to explore the following.

## Protovalidate on GitHub

[Protovalidate](https://github.com/bufbuild/protovalidate/) is an open source project licensed under Version 2.0 of the Apache license.Buf welcomes bug reports, suggested enhancements, and pull requests within any of its GitHub repositories.

### Core repository

The core [Protovalidate](https://github.com/bufbuild/protovalidate/) repository contains Protobuf definitions for its standard rules, extensibility, and violation messages. It also provides a library of custom rule examples, conformance tooling for runtime implementations, and a migration tool for `protoc-gen-validate` users.

### Runtime repositories

Each of the following provides an idiomatic Protovalidate runtime that meets the specification enforced by the [core repository](https://github.com/bufbuild/protovalidate/)'s conformance tooling.

- [protovalidate-go](https://github.com/bufbuild/protovalidate-go/)
- [protovalidate-java](https://github.com/bufbuild/protovalidate-java/)
- [protovalidate-python](https://github.com/bufbuild/protovalidate-python/)
- [protovalidate-cc](https://github.com/bufbuild/protovalidate-cc/)
- protovalidate-es _(Coming soon!)_

::: tip Language contributions welcomeInterested in adding support for another language? Check out our [Contributing guidelines](https://github.com/bufbuild/protovalidate/blob/main/.github/CONTRIBUTING.md).

:::

## Common Expression Language (CEL)

[Common Expression Language (CEL)](https://cel.dev/) is a lightweight, high-performance expression language designed to be embedded within applications.Supporting Protobuf well-known types, calculations, and even transformations with a JavaScript-like syntax, CEL allows expressions like `this.first_flight_duration + this.second_flight_duration < duration('48h')` to evaluate consistently across languages.All Protovalidate rules are based on CEL expressions.Learn more at about CEL at [cel.dev](https://cel.dev/).

## Community projects

### FauxRPC

[FauxRPC](https://fauxrpc.com/) enables rapid development for Connect, gRPC, gRPC-Web, and REST by creating fake implementations of RPC services defined in Protobuf files. It doesn't just enforce Protovalidate rules: it uses your Protovalidate rules to generate its fake responses.Learn more about [Protovalidate in FauxRPC](https://fauxrpc.com/docs/protovalidate/).
