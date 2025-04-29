---

layout: home

hero:
  name: Buf CLI
  text: The all-in-one Protobuf toolchain
  tagline: ‍Generate code, prevent breaking changes, lint Protobuf schemas, enforce best practices, and invoke APIs with the Buf CLI.
  actions:
    - theme: brand
      text: Try the CLI
      link: /docs/cli/quickstart/

features:
  - title: Safely evolve your APIs across platforms
    details: Ensure you never cause an outage by shipping a breaking, backward-incompatible change to production by using the Buf CLI to validate API changes both locally and in continuous integration (CI).
    link: /docs/breaking/overview/
    linkText: Learn more about preventing breaking changes
  - title: Generate code without managing a Protobuf environment
    details: Generate code locally using the Buf CLI or remotely in an isolated environment on the BSR without worrying about managing compiler versions and plugins.
    link: /docs/bsr/remote-plugins/overview/
    linkText: Learn about generating code
  - title: Enforce consistency and best practices
    details: Guarantee best practices across all your APIs by running Buf's Protobuf linter and automatically reformatting files to correct violations.
    link: /docs/lint/overview/
    linkText: Learn about enforcing best practices
  - title: Invoke gRPC and Connect APIs with ease
    details: Call your gRPC and Connect APIs using Buf's cURL-like interface which automatically handles headers and message-enveloping while providing a readable JSON representation of binary responses.
    link: /docs/curl/usage/
    linkText: Explore the tool
  - title: Enhance Protobuf data readability
    details: Introspect Protobuf binary responses by easily converting between the binary and JSON formats.
    link: /docs/reference/cli/buf/convert/
    linkText: See the reference manual
  - title: Leverage the BSR from the command line
    details: Interact with the Buf Schema Registry to push your schemas, create branches, and release tags — all from the CLI.
    link: /product/bsr/
    linkText: Learn about the Buf Schema Registry

---