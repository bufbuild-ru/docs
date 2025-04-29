---
isHome: true

layout: home

hero:
  text: Buf is building a better way to work with Protobuf
  tagline: Create, maintain, and consume APIs with our modern Protobuf ecosystem
  actions:
    - theme: brand
      text: Read the docs
      link: /docs/

features:
  - title: Create
    details: Consistent APIs with centrally enforced linting and breaking change detection.
  - title: Maintain
    details: Centrally managed dependencies, with automatically enforced forwards and backwards compatibility to ensure clients never break.
  - title: Consume
    details: Generated libraries produced by a managed compiler. Buf will provide generated CLIs, documentation, validation, custom plugins, mock servers, stress-testing and more.

---

<br />

---

<br />

::: info Postscript

Our goal is to create a mirror of the [buf.build](https://buf.build/) website because it is blocked in many countries:

::: details
![](/ip-address-blocking.png)
:::

## Roadmap

- :white_check_mark: [Documentation](/docs/)
- :white_check_mark: [Blog](/blog/)
- :hammer_and_wrench: Remote plugins for generating code
- :hammer_and_wrench: Schema registry for hosting your .proto files and generated SDKs
- :hammer_and_wrench: On-premises installation for self-hosted code generation
