---
layout: home

hero:
  name: "Remote packages and remote plugins are approaching v1!"
---

Remote packages are now called "generated SDKs". See the [documentation](/docs/bsr/generated-sdks/overview/index.md) for more information.

We're excited to share an update to the Buf Schema Registry remote generation alpha - namely, that the alpha is ending, and we're approaching v1! Today, we're launching the release candidate for what we now call **remote plugins** and **remote packages**.

## What are remote plugins?

One of the greatest challenges with Protobuf code generation is the complexity of working with `protoc` and [plugins](https://buf.build/plugins). Time and time again, we've heard that developers want the benefits of code generation, but struggle with the complex web of different compiler and plugin versions, and the varying runtime needs that plugins have across different languages. Managing and maintaining a stable environment locally on a single machine is hard enough.

Every organization and open-source project develops homegrown Protobuf tooling in an effort to maintain consistent output across developers. A handful of organizations might get a workable solution, but these remain brittle and difficult to maintain over time.

At Buf, we believe code generation is a key building block and the Protobuf ecosystem deserves a proper solution. With [**remote plugins**](/docs/bsr/remote-plugins/overview/index.md), you no longer have to concern yourself with maintaining, downloading, or running plugins on your local machine. Using a plugin is as simple as referencing it in your `buf.gen.yaml`:

```protobuf
version: v1
plugins:
  # Use protoc-gen-go at v1.28.1
  - plugin: buf.build/protocolbuffers/go:v1.28.1
    out: gen/go
  # Use the latest version of protoc-gen-go-grpc
  - plugin: buf.build/grpc/go
    out: gen/go
```

`‍`Just invoke `buf generate` and you're done - no maintaining these plugins, no worrying about how to download or install them, just generate your stubs and get back to solving your real problems.

## What are remote packages?

Protobuf is a fantastic way to programmatically define your APIs and generate away a lot of the common work we perform as software engineers to communicate across our services. Here at Buf, we believe the eventual promise of Protobuf is for us to stop publishing English-language API specs, and instead move to generated SDKs that we all consume.

[**Remote packages**](/docs/bsr/generated-sdks/overview/index.md) is the movement towards this promise. With remote packages, Buf will take your modules and Protobuf plugins, add a little elbow grease, and generate full-serve packages for you to consume just like any third-party library in your native programming language. This means you don't have to worry about Protobuf code generation at all - you can push [modules](/docs/bsr/index.md#modules) to the BSR and install code stubs generated from those modules using dependency management tools like `npm` and `go`.

- Zero tooling to install: forget about plugins or Protobuf compilers entirely.
- API producers can provide two lines of installation instructions instead of publishing their own SDKs.
- No need to keep plugins and supporting library versions in sync.
- Dependabot and other tools pick up version changes.
- Any organization-wide caching used for your existing programming languages can be used in the exact same way.

**Go**

```protobuf
# Get the Connect client and server packages for the
# buf.build/connectrpc/eliza module
$ go get buf.build/gen/go/connectrpc/eliza/connectrpc/go
```

`‍   `

**NPM**

```protobuf
# Install the Connect client packages for the
# buf.build/connectrpc/eliza module
$ npm config set @buf:registry https://buf.build/gen/npm/v1
$ npm install @buf/connectrpc_eliza.bufbuild_connect-web
```

`‍   `

## The alpha: what did we learn

The response to the remote generation alpha has been phenomenal and usage has exploded:

- Last month, we had over 1M `buf generate` requests that use remote plugins. Y'all generate a lot of stuff!
- We've had over 500,000 module downloads across Go and NPM.
- We've had hundreds of remote plugins uploaded.

When we launched the remote generation alpha about a year ago, we never would have expected this type of adoption. It's great to see people recognize the benefits of consistent code generation - whether using remote plugins with `buf.gen.yaml`, or fetching generated SDKs with popular package managers like Go and NPM.

We've talked to many of you to gather feedback. Some of what we've learned:

- Plugin packaging errors have caused a lot of user pain.
- Users encountered issues discovering trusted and working plugins on the BSR. Common plugins like go-grpc often had duplicate versions and plugins were not always kept up to date. Plugin source code was not available, making it impossible to audit and have confidence in the published plugins.
- The concept of templates has no corollary in the Protobuf ecosystem and were a source of issues for various languages, especially Go. Templates also led to duplication across the BSR - many users uploaded almost-identical templates due to the strict handling of plugin options.
- Synthetic versions within Go and NPM are confusing and add unnecessary complexity.

## The release candidate

After a ton of work by the Buf team, we're ready to present our new remote plugins and remote packages experience that address all of these concerns and more. Some highlights:

- Public plugins are distributed by the Buf team and verified to work out-of-the-box. Users can audit how plugins are built and have confidence that code is generated from a secure and trusted source.
- The BSR provides a centralized place to discover plugins at [buf.build/plugins](https://buf.build/plugins). Plugins are grouped by programming language and each plugin has a detailed page with a description, license information, source URL, and usage instructions.
- Remote packages are now created per plugin, instead of per template. Templates have been removed in favor of plugin dependencies. Users can import remote packages from multiple plugins and no longer worry about issues like Go [protobuf namespace conflicts](https://developers.google.com/protocol-buffers/docs/reference/go/faq#namespace-conflict).
- Significant performance improvements to Go and NPM remote registries (large NPM packages install up to 90% faster than before). We also added support for Node ESM modules and declaring minimum Go version for remote packages.

Check out the full docs for additional details on [remote plugins](/docs/bsr/remote-plugins/overview/index.md) and [remote packages](/docs/bsr/generated-sdks/overview/index.md).

Obviously, all of this is a major change, and not everything is compatible with the remote generation alpha. However, do not worry - **we're keeping the remote generation alpha working until April 30, 2023** to give you time to migrate. For more details, see the documentation on [migration to remote plugins](/docs/migration-guides/migrate-remote-generation-alpha/index.md) and [migration to remote packages](/docs/migration-guides/migrate-remote-generation-alpha/index.md).

We've covered many of the plugins the Protobuf community uses day-to-day, but if there's another plugin you think we should maintain and host, file an issue for us on [github.com/bufbuild/plugins](https://github.com/bufbuild/plugins), we'd love to hear from you!

Our goal is to help move the Protobuf community forward for everyone, and we'll continue to do everything we can to help you. Again, thank you so much for all the support you've given us - it means a lot.

## Talk to us

For any questions or concerns don't hesitate to reach out to us on [Slack](https://buf.build/b/slack) - we'd love to hear from you!

‍
