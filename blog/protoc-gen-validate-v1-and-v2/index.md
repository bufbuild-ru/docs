---
layout: home

hero:
  name: "Announcing protoc-gen-validate v1.0 and our plans for v2.0"
  tagline: "April 24, 2023"
---

**We’re excited to announce that after half a decade of** [**`protoc-gen-validate`**](https://github.com/bufbuild/protoc-gen-validate) **(“PGV”) wallowing with an “alpha” label, we’re promoting PGV to v1.0, ensuring all current workflows with PGV will be stable into the future.**

The community has learned a lot from PGV, and the project is showing its warts after many years of organic growth. We think validation is a fundamental component of the Protobuf ecosystem, so **we’re also announcing the imminent release of the future of validation: v2.0 of PGV, soon to be known as `protovalidate`.**

The first release candidate of `protovalidate` with support for Go will be coming in early June, followed shortly by other languages. The core of this new tool will be based on [Common Expression Language](https://github.com/google/cel-spec) (“CEL”), and will provide a much better foundation for validation going forward. The release will also come with quick and easy steps to migrate existing v1.0 workflows, making the transition as painless as possible.

## A brief history of PGV

PGV emerged from a 2017 Lyft hackathon project that sought to answer the question “what would validation look like for Protocol Buffers?” Initially, its rules loosely emulated JSON Schema’s [validation keywords](https://json-schema.org/draft/2019-09/json-schema-validation.html). Coincidentally, around the same time, the Envoy Proxy project began [migrating their configuration schemas to Protobuf](https://blog.envoyproxy.io/the-universal-data-plane-api-d15cec7a) from JSON Schema and desired a similar way to define constraints. The resulting collaboration led to the open-sourcing of PGV, with support for Go and C++ by the end of that year.

Interest and development around the plugin grew rapidly, expanding with official support for Java in 2018 and Python in 2019 (with the first PyPI release in 2021). To encourage more open-source contributions, PGV relocated from Lyft to the Envoy GitHub organization in 2019. A few years later, the Envoy team decided that Buf would be the best organization to pick up the torch, and Buf subsequently took over maintenance of PGV in 2022.

## PGV v1.0

Since its inception, PGV’s readme has carried an ominous warning:

_“This project is currently in_ **_alpha_**_. The API should be considered unstable and likely to change.”_

Despite that, the code generation and supporting libraries have remained largely unchanged over the past six years, and many organizations and production deployments rely heavily on PGV’s current shape and libraries. We believe it’s time to announce that PGV is stable. We understand the value that the current iteration of PGV brings to the Protobuf ecosystem and are dedicated to its ongoing utility.

**The release of v1.0 does not include any material changes to the existing annotations, code generation, or libraries.** Projects can continue to rely on PGV as they do today without any changes—this is just tagging the existing state of the world.

We'd like to extend our heartfelt thanks to the many contributors who have made this possible. Your passion and support fuel the growth and improvement of this essential tool.

## PGV’s limitations

PGV is not without its warts. The current code generator’s template-based implementation has fossilized in the face of feature requests and bug fixes. Nuances in each language’s Protobuf code generation, build-time, and runtime behavior produce edge cases that have led to an inconsistent support for rules even across the official targets, and present a Herculean lift to add anything new to the mix. These early design decisions have also made it infeasible to achieve many of the most requested features on the community’s [wishlist](https://github.com/bufbuild/protoc-gen-validate/issues/638), including custom error messages, arbitrary constraint expressions, shareable rules, and compatibility with the Buf Schema Registry’s [remote packages](/docs/bsr/generated-sdks/tutorial/index.md).

Armed with this knowledge and valuable feedback from the community, we are reimagining and rebuilding PGV from the ground up.

## PGV v2.0: protovalidate

As we celebrate the v1.0 release of PGV, we’re thrilled that development of the next iteration of Protobuf validation is underway. Our team is hard at work incorporating feedback, exploring new features, and building upon the existing functionality of PGV. Here’s a sneak peek at some of the features to come:

- Continued support for all the same validation rules that exist in PGV today
- A CEL-based implementation, promoting consistent behavior across all targeted languages
- User-defined CEL expressions for defining complex constraints against individual fields, as well as cross-field comparisons within a message
- Custom error messages defined within CEL which are mutable at runtime to provide features that improve the end-user experience, such as internationalization

This next version, `protovalidate`, aims to further enhance the Protobuf ecosystem, offering an even more robust and user-friendly experience for developers.

Community involvement has been essential to the ongoing development of PGV, and the same will be true for `protovalidate`. Stay tuned for updates as we get closer to a release candidate! For now, please let us know what features or improvements you’d like to see in the [wishlist](https://github.com/bufbuild/protoc-gen-validate/issues/638) GitHub issue.

‍
