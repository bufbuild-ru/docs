---
sidebar: false
prev: false
next: false

title: "Generated SDKs for Rust now available on the Buf Schema Registry"
description: "We’re excited to announce that the Buf Schema Registry now supports generated SDKs for Rust. Our Rust SDK crates are available natively to the Rust ecosystem using a custom crate registry that’s powered by our zero-dependency remote plugins platform."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/bsr-generated-sdks-for-rust"
  - - meta
    - property: "og:title"
      content: "Generated SDKs for Rust now available on the Buf Schema Registry"
  - - meta
    - property: "og:description"
      content: "We’re excited to announce that the Buf Schema Registry now supports generated SDKs for Rust. Our Rust SDK crates are available natively to the Rust ecosystem using a custom crate registry that’s powered by our zero-dependency remote plugins platform."
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674fa998a569ef00d761d24f_Rust%20SDKs.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Generated SDKs for Rust now available on the Buf Schema Registry"
  - - meta
    - property: "twitter:description"
      content: "We’re excited to announce that the Buf Schema Registry now supports generated SDKs for Rust. Our Rust SDK crates are available natively to the Rust ecosystem using a custom crate registry that’s powered by our zero-dependency remote plugins platform."
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674fa998a569ef00d761d24f_Rust%20SDKs.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Generated SDKs for Rust now available on the Buf Schema Registry

We’re excited to announce that in addition to [Go](/docs/bsr/generated-sdks/go/index.md), [JavaScript/TypeScript](/docs/bsr/generated-sdks/npm/index.md), [Java/Kotlin](/docs/bsr/generated-sdks/maven/index.md), [Python](/docs/bsr/generated-sdks/python/index.md), and [Swift](/docs/bsr/generated-sdks/swift/index.md), the Buf Schema Registry now provides [generated SDKs for Rust](/docs/bsr/generated-sdks/cargo/index.md). Our Rust SDK crates are available natively to the Rust ecosystem using a custom crate registry that’s powered by our zero-dependency [remote plugins](https://buf.build/plugins) platform. For Rust SDKs, we’re now offering the popular community-maintained [neoeinstein-prost](https://buf.build/community/neoeinstein-prost) and [neoeinstein-tonic](https://buf.build/community/neoeinstein-tonic) compiler wrappers for the widely used [Prost](https://github.com/tokio-rs/prost) and [Tonic](https://github.com/hyperium/tonic) projects.

## How we did it

All of our generated SDKs provide native integration with ecosystem package management tooling, which for the Rust ecosystem means [Cargo](https://crates.io/).

To date, [our other integrations](/docs/bsr/generated-sdks/overview/index.md) have relied on lazy source code generation, which entails waiting for a request for a specific package version, either fetching the generated package from the cache or running code generation on the fly, returning the package, and caching it for future requests.

A challenge we encountered with Rust is that Cargo’s index pages [require a checksum](https://doc.rust-lang.org/cargo/reference/registry-index.html#json-schema) to exist for all crate versions, meaning that to populate an index version, we’d need to have already created the `.crate` file and hashed it. We wanted to be able to generate an SDK for any combination of module commit and plugin version, but we wanted to avoid needing to pre-generate all possible combinations (which is what we would need to do to precompute all the necessary checksums) because most combinations would never be used.

To balance Cargo’s requirement for a checksum with our desire to not generate everything up front, the Buf Schema Registry only pre-generates SDKs for module commit and plugin version combinations that we have evidence a consumer is interested in. On the initial request of a crate index page (typically triggered by a `cargo add`, which you can find on the SDKs tab of your repository), we register interest in that repository, causing new pushes to the default label to automatically enqueue for generation. (And generation is fast — you’ll never notice a significant lag between a push and the version available in the index.)

Additionally, by navigating to labels and commits in your repository, generation is queued for those commits and labels (and future commits to the same labels), ensuring your selected version is available in the crate index. All of this is explained in [our Cargo docs](/docs/bsr/generated-sdks/cargo/index.md) — let us know if anything isn’t clear.

## Example usage

Here’s a quick example using generated SDKs for Rust to query [the BSR’s Registry API](https://buf.build/bufbuild/registry) for information about an organization (specifically, our own [bufbuild](https://buf.build/bufbuild) organization).

To start with, create a new Rust project:

```protobuf
cargo new buf-test
cd buf-test
mkdir .cargo
```

Next, edit the `.cargo/config.toml` file in your project to add Buf as a new Cargo registry. (You can find all of these steps easily by visiting the SDKs page for your repository and selecting Rust.) Your .cargo/config.toml file should look like this:

```protobuf
# .cargo/config.toml
[registries.buf]
index = "sparse+https://buf.build/gen/cargo/"
credential-provider = "cargo:token"
```

Next, create an authentication token to securely authenticate with the BSR, substituting your `<token>`:

```protobuf
cargo login --registry buf "Bearer <token>"
```

From there, you need to add a few dependencies:

```protobuf
# Add our generated SDKs!
cargo add --registry buf bufbuild_registry_community_neoeinstein-prost
cargo add --registry buf bufbuild_registry_community_neoeinstein-tonic
cargo add tonic --features tls-roots # Enable the features we need
cargo add tokio --features macros,rt-multi-thread # Async runtime
```

Next, you need some client code to interact with the API. In `src/main.rs`, add the following code:

```protobuf
use bufbuild_registry_community_neoeinstein_prost::buf::registry::owner::v1::{
    organization_ref::Value, GetOrganizationsRequest, OrganizationRef,
};
use bufbuild_registry_community_neoeinstein_tonic::buf::registry::owner::v1::tonic::organization_service_client::OrganizationServiceClient;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut client = OrganizationServiceClient::connect("https://buf.build").await?;
    let get_organizations_response = client
        .get_organizations(tonic::Request::new(GetOrganizationsRequest {
            organization_refs: vec![OrganizationRef {
                value: Some(Value::Name("bufbuild".into())),
            }],
        }))
        .await?;

    let bufbuild_org = get_organizations_response.into_inner().organizations[0].to_owned();
    println!(
        "The {} org was created at {} (unix time)",
        bufbuild_org.name,
        bufbuild_org.create_time.unwrap().seconds
    );

    Ok(())
}
```

Finally, you can run the client, getting information about the bufbuild organization from buf.build:

```protobuf
$ cargo run
# ... more output ...
Output

$ date -r 1622148241
Thu May 27 16:44:01 EDT 2021
```

This is our initial foray into the Rust world — we welcome your feedback, so get in touch on our [Slack channel](https://buf.build/b/slack) or shoot us an email at [feedback@buf.build](mailto:feedback@buf.build) with questions and suggestions!

‍
