---
sidebar: false
prev: false
next: false
aside: false

title: "Blog"
description: "Keep up with the latest at Buf."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/"
  - - meta
    - property: "og:title"
      content: "Blog"
  - - meta
    - property: "og:description"
      content: "Keep up with the latest at Buf."
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/67202403476bad65d88793e7/674f7b1337c8dac79f6fc9e2_Blog.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Blog"
  - - meta
    - property: "twitter:description"
      content: "Keep up with the latest at Buf."
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/67202403476bad65d88793e7/674f7b1337c8dac79f6fc9e2_Blog.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Blog

### [Bufstream is now on the AWS Marketplace](/blog/bufstream-is-now-on-the-aws-marketplace/index.md)

###### May 9, 2025

We're excited to announce that Bufstream is now available on the AWS Marketplace. Enterprise customers can purchase through their AWS account and accelerate their deployment of Bufstream.

### [Cheap Kafka is cool. Schema-driven development with Kafka is cooler.](/blog/kafka-schema-driven-development/index.md)

###### May 2, 2025

If you're looking for a modern drop-in replacement for Apache Kafka to save costs and complexity, Bufstream is probably your best bet. However, we've got a bigger mission here. Buf wants to bring schema-driven development across your entire stack, from your network APIs, to your streaming data, to your lakehouse, unified behind one schema language that can do it all.

### [Tip of the week #4: Accepting mistakes we can’t fix](/blog/totw-4-accepting-mistakes/index.md)

###### April 29, 2025

Protobuf’s distributed nature introduces evolution risks that make it hard to fix some types of mistakes. Sometimes the best thing to do is to just let it be.

### [Tip of the week #3:  Enum names need prefixes](/blog/totw-3-enum-names-need-prefixes/index.md)

###### April 22, 2025

Enums inherit some unfortunate behaviors from C++. Avoid this problem by using the Buf lint rules ENUM_VALUE_PREFIX and ENUM_ZERO_VALUE_SUFFIX.

### [Tip of the week #2: Compress your Protos!](/blog/totw-2-compress-protos/index.md)

###### April 15, 2025

Compression is everywhere. This pervasiveness means that wire size tradeoffs matter less than they used to twenty years ago, when Protobuf was designed.

### [Tip of the week #1: Field names are forever](/blog/totw-1-field-names/index.md)

###### April 8, 2025

Don’t rename fields. Even though there are a slim number of cases you can get away with it, it’s rarely worth doing, and is a potential source of bugs.

### [Multi-region, active-active Bufstream at 100 GiB/s](/blog/bufstream-multi-region/index.md)

###### March 7, 2025

Bufstream — Buf’s drop-in replacement for Apache Kafka® — now supports business-critical workloads with multi-region, active-active clusters on GCP. 

### [Bufstream on Spanner: 100 GiB/s with zero operational overhead](/blog/bufstream-on-spanner/index.md)

###### March 5, 2025

At less than $1M/month for 100 GiB/s of writes and 300 GiB/s of reads, Bufstream using Spanner is 25x cheaper than Confluent Cloud, 1.5x cheaper than WarpStream, and 3x cheaper than self-hosted Apache Kafka®.

### [Connect RPC for JavaScript: Connect-ES 2.0 is now generally available](/blog/connect-es-v2/index.md)

###### November 20, 2024

Today, we’re announcing the 2.0 release of the Connect-ES project, the TypeScript implementation of Connect for Web browsers and Node.js. This release introduces improved support for major frameworks and simplified code generation. Connect-ES 2.0 now uses Protobuf-ES 2.0 APIs to leverage reflection, extension registries, and Protobuf custom options. The 2.0 release is a major version bump and comes with breaking changes. Read on to learn what’s changed and how to migrate to the 2.0 release.

### [Bufstream is the only cloud-native Kafka implementation validated by Jepsen](/blog/bufstream-jepsen-report/index.md)

###### November 12, 2024

Jepsen's Bufstream report bolsters enterprise use of Buf’s elastic Kafka-compatible streaming platform to enable data quality, enforce governance policies, and cut costs 8x

### [Connect-Swift 1.0 is now generally available](/blog/connect-swift-v1/index.md)

###### November 11, 2024

We’re excited to share that Connect-Swift has officially reached v1.0—its first stable release! With this milestone, the library’s battle-tested APIs will remain stable until its next major release. Projects can rely on Connect-Swift without worrying that future releases will cause breakages or require migrations.

### [Introducing custom lint and breaking change plugins for Buf](/blog/buf-custom-lint-breaking-change-plugins/index.md)

###### September 18, 2024

Buf is introducing custom lint and breaking change plugins via the Bufplugin framework. Check it out to see how easy it is to author, test, and consume your own lint and breaking change rules.

### [Generated SDKs for C# are now available on the Buf Schema Registry](/blog/bsr-generated-sdks-for-csharp/index.md)

###### August 28, 2024

We’re excited to announce that in addition to C++, Go, JavaScript/TypeScript, Java/Kotlin, Python, Swift, and Rust, the Buf Schema Registry now provides generated SDKs for C# via NuGet.

### [Generated SDKs for C++ are now available on the Buf Schema Registry](/blog/bsr-generated-sdks-for-cpp/index.md)

###### August 28, 2024

We’re excited to announce that in addition to C#, Go, JavaScript/TypeScript, Java/Kotlin, Python, Swift, and Rust, the Buf Schema Registry now provides generated SDKs for C++ via CMake.

### [Protobuf for Javascript: Protobuf-ES 2.0 is now generally available](/blog/protobuf-es-v2/index.md)

###### August 14, 2024

Today we’re announcing the 2.0 release of the Protobuf-ES project, our fully compliant Protobuf implementation for JavaScript and TypeScript. This release introduces full support for Protobuf Editions, new APIs for field presence & default values, TypeScript typing for Protobuf’s JSON Format, a full reflection API, support for Protobuf custom options, and more convenient APIs for managing extension registries. The 2.0 release is a major version bump, and comes with breaking changes. Read on to learn what’s changed and how to migrate to the 2.0 release.

### [Introducing the new Buf GitHub Action](/blog/unified-buf-github-action-released/index.md)

###### August 13, 2024

Today, we’re launching the 1.0 release of our new unified GitHub Action, powered by the Buf CLI. This integration streamlines the processes of building, formatting, linting, and checking for breaking changes in your Protobuf schemas. It seamlessly integrates with GitHub's pull request workflow and automatically publishes Protobuf schema changes to the Buf Schema Registry when pull requests are merged.

### [Bufstream: Kafka at 8x lower cost](/blog/bufstream-kafka-lower-cost/index.md)

###### July 9, 2024

We're excited to announce the public beta of Bufstream, a drop-in replacement for Apache Kafka deployed entirely in your own VPC that's 8x less expensive to operate.

### [Generated SDKs for Rust now available on the Buf Schema Registry](/blog/bsr-generated-sdks-for-rust/index.md)

###### June 13, 2024

We’re excited to announce that the Buf Schema Registry now supports generated SDKs for Rust. Our Rust SDK crates are available natively to the Rust ecosystem using a custom crate registry that’s powered by our zero-dependency remote plugins platform.

### [Connect RPC joins CNCF: gRPC you can bet your business on](/blog/connect-rpc-joins-cncf/index.md)

###### June 4, 2024

Connect RPC, Buf’s family of fully protocol-conformant and battle-tested alternatives to Google’s gRPC project, has joined the Cloud Native Computing Foundation. We joined the CNCF to demonstrate our deep commitment to sustainably and responsibly growing Connect as a well-governed and community-led open source project. Today, Connect integrates seamlessly with gRPC systems in production at companies of all sizes, such as CrowdStrike, PlanetScale, RedPanda, Chick-fil-A, BlueSky, and Dropbox.

### [Connect RPC vs. Google gRPC: Conformance Deep Dive](/blog/grpc-conformance-deep-dive/index.md)

###### May 30, 2024

We’ve open sourced Connect RPC’s protocol conformance suite. Connect is a multi-protocol RPC project that includes support for the gRPC and gRPC-Web protocols. Anyone can now use it to validate the correctness of a gRPC implementation. This article explores how the test suite operates and details our findings for a selection of Connect RPC and Google’s gRPC runtimes.

### [Introducing the next generation of the Buf CLI: still v1 and backwards-compatible](/blog/buf-cli-next-generation/index.md)

###### May 17, 2024

The Buf CLI and its associated configuration have been completely overhauled to support monorepos as first-class citizens. Everything we've changed is 100% backwards compatible.

### [Introducing the newly improved BSR UI and buf push experience](/blog/enhanced-buf-push-bsr-ui/index.md)

###### May 17, 2024

We've made it easier to onboard and use the BSR with improved support for monorepos, tighter integration with source control providers, and a new BSR UI that is more polished and has improved accessibility.

### [Protobuf Editions are here: don’t panic](/blog/protobuf-editions-are-here/index.md)

###### May 9, 2024

Most Protobuf users should ignore Editions and continue using proto3. If you become an early adopter, we’ve been working closely with Google to ensure that Buf will support editions as soon as they’re generally available.

### [The BSR now integrates with Kong Insomnia, making gRPC even easier to use](/blog/kong-insomnia-grpc-bsr-support/index.md)

###### May 3, 2024

Kong Insomnia’s 9.0 release includes integrated support for the Buf Schema Registry. Organizations adopting gRPC can now provide developers first-class GUI tools while keeping schema access simple and secure.

### [The Buf Schema Registry is now on the AWS and Google Cloud Marketplaces](/blog/cloud-marketplaces/index.md)

###### December 12, 2023

The BSR is the source of truth for your Protobuf APIs, and is the best way to share schemas across repositories, generate consistent code, and integrate Protobuf with Kafka. This launch helps Enterprise customers simplify how they purchase the Buf Schema Registry.

### [Give clients pre-built native libraries for your APIs with zero effort](/blog/bsr-generated-sdks/index.md)

###### December 4, 2023

Produce pre-built client libraries in Go, Java, JS, TS, Swift, Kotlin, and Python out of the box for all of your Protobuf APIs with Buf’s generated SDKs. You’ll never have to explain how to use protoc ever again.

### [Generated Python SDKs are now available in the BSR](/blog/python-generated-sdks/index.md)

###### November 29, 2023

Python engineers can now download pre-packaged generated code for their Protobuf schemas from the BSR using package management tools like pip, Poetry, and Conda.

### [Why a Protobuf schema registry?](/blog/why-a-protobuf-schema-registry/index.md)

###### November 20, 2023

Learn why teams across industries and sizes have chosen the Buf Schema Registry as the home for their Protobuf schemas.

### [The real reason to use Protobuf is not performance](/blog/the-real-reason-to-use-protobuf/index.md)

###### November 15, 2023

Fast serialization and small payloads are nice, but schema-driven development is why you’ll adopt Protobuf.

### [Audit breaking changes with the Buf Schema Registry's governance workflow](/blog/review-governance-workflow/index.md)

###### November 6, 2023

Enterprise customers can now use the BSR to audit, approve, and reject commits that introduce breaking changes.

### [Type & path uniqueness policy enforcement for enterprises](/blog/type-path-uniqueness/index.md)

###### September 5, 2023

The BSR can now enforce type and path uniqueness across all modules.

### [Seamless Gradle integration with the Buf CLI](/blog/seamless-gradle-integration-with-the-buf-cli/index.md)

###### August 9, 2023

The Buf CLI can now integrate seamlessly with your Gradle builds.

### [Swift generated SDKs are now available for Xcode and SPM](/blog/swift-packages/index.md)

###### July 12, 2023

Swift engineers can now download pre-packaged generated code for their Protobuf schemas from the BSR using Xcode and Swift Package Manager.

### [Governance & breaking change policy enforcement for enterprises](/blog/breaking-change-governance/index.md)

###### July 10, 2023

The BSR can now enforce breaking change prevention policies across all modules.

### [Buf generated SDKs now support Java - introducing the Buf Maven repository](/blog/maven-repository/index.md)

###### May 8, 2023

Launching the Buf Maven repository, supporting Java and Kotlin plugins (including connect-kotlin!)

### [Introducing Cacheable RPCs in Connect](/blog/introducing-connect-cacheable-rpcs/index.md)

###### May 3, 2023

We’ve expanded the Connect protocol to support the use of HTTP GET requests, enabling web browsers and CDNs to cache Connect requests with ease.

### [Building a modern gRPC-powered microservice using Node.js, Typescript, and Connect](/blog/grpc-microservice-with-connect/index.md)

###### April 27, 2023

Tutorial that covers creating a service, adding a client, testing, adding a database, and writing tests.

### [Announcing protoc-gen-validate v1.0 and our plans for v2.0](/blog/protoc-gen-validate-v1-and-v2/index.md)

###### April 24, 2023

A look to the future of Protobuf validation

### [The Buf Schema Registry is out of beta! Announcing new Buf Schema Registry plans and pricing updates](/blog/plans-pricing-updates/index.md)

###### April 12, 2023

The Buf Schema Registry (BSR) is officially out of beta, and we're launching new pricing plans

### [Protobuf-ES is the only fully-compliant Protobuf library for JavaScript](/blog/protobuf-conformance/index.md)

###### March 21, 2023

The results are in: Protobuf-ES passes 99.95% of conformance tests

### [The BSR now provides a SCIM service for Pro and Enterprise plans](/blog/introducing-bsr-scim/index.md)

###### March 16, 2023

Admins can now configure SCIM in their BSR to manage organization enrollments based on IdP security groups.

### [OpenTelemetry for connect-go: Observability out of the box](/blog/connect-opentelemetry-go/index.md)

###### March 6, 2023

Add observability to your connect-go applications in just a few lines of code

### [Connect for Node.js is now available](/blog/connect-node-beta/index.md)

###### February 28, 2023

Connect is now full-stack TypeScript

### [Announcing Connect-Kotlin: Connect is now fully supported on mobile!](/blog/announcing-connect-kotlin/index.md)

###### February 22, 2023

Connect is now available across mobile for both Android and iOS!

### [Introducing Connect-Query: Integrate Protobuf with TanStack Query more effectively](/blog/introducing-connect-query/index.md)

###### February 6, 2023

A TanStack Query extension to seamlessly integrate Protobuf

### [Introducing the Buf Reflection API & Prototransform](/blog/buf-reflection-api/index.md)

###### February 2, 2023

A new API and Go library to unlock the power of Protobuf in your data processing.

### [Speeding up development with BSR drafts](/blog/speeding-up-with-drafts/index.md)

###### January 25, 2023

To enable engineers to begin iterating quickly using generated code without the need to merge Protobuf schemas to main, we support BSR drafts.

### [Announcing Connect-Swift: You’ll actually want to use Protobuf on iOS](/blog/announcing-connect-swift/index.md)

###### January 18, 2023

Eliminate handwritten Codable models by generating idiomatic HTTP APIs with Protobuf and Connect-Swift.

### [Introducing buf curl - Call your gRPC endpoints with the simplicity of buf](/blog/buf-curl/index.md)

###### January 12, 2023

A new tool to call gRPC, gRPC-Web, and Connect endpoints.

### [Protobuf-ES has reached version 1.0](/blog/protobuf-es-v1/index.md)

###### January 4, 2023

A stable, idiomatic Protocol Buffers library for TypeScript and JavaScript.

### [BSR Generated Documentation now supports Protobuf options](/blog/generated-documentation-protobuf-options/index.md)

###### December 21, 2022

We are excited to share an update to the Generated Documentation feature within the BSR, which now includes support for most built-in Protobuf options. 🎉

### [Buf Studio Now Has Favorites!](/blog/studio-now-has-favorites/index.md)

###### December 16, 2022

As of today, Buf Studio supports saving requests to your BSR profile.

### [Remote packages and remote plugins are approaching v1!](/blog/remote-packages-remote-plugins-approaching-v1/index.md)

###### December 1, 2022

We've learned a lot from the alpha, and are excited to introduce a new and improved code generation experience.

### [Protobuf-ES: The Protocol Buffers TypeScript/JavaScript runtime we all deserve](/blog/protobuf-es-the-protocol-buffers-typescript-javascript-runtime-we-all-deserve/index.md)

###### October 28, 2022

An idiomatic Protocol Buffers library for TypeScript and JavaScript is now available.

### [Buf's New Compiler](/blog/bufs-new-compiler/index.md)

###### October 19, 2022

Buf has a new Protobuf compiler that is faster and more memory-efficient.

### [The Protobuf Language Specification](/blog/protobuf-language-specification/index.md)

###### September 12, 2022

A comprehensive definition of the language, to empower a vibrant Protobuf ecosystem.

### [BSR redesign](/blog/bsr-redesign/index.md)

###### August 25, 2022

Welcome to the new BSR

### [Introducing the Buf Language Server](/blog/introducing-the-buf-language-server/index.md)

###### August 19, 2022

Jump to definition with 'bufls'.

### [Connect-Web: It's time for Protobuf and gRPC to be your first choice in the browser](/blog/connect-web-protobuf-grpc-in-the-browser/index.md)

###### August 4, 2022

Use connect-web to generate compact, idiomatic TypeScript clients for your Protobuf APIs.

### [Buf Studio: Interact with gRPC and Protobuf APIs directly from your browser](/blog/buf-studio/index.md)

###### July 28, 2022

Buf studio is an interactive web UI that lets you easily call your gRPC and Protobuf services from a browser.

### [Bazel rules](/blog/bazel-rules/index.md)

###### June 20, 2022

Use buf with Bazel.

### [Connect: A better gRPC](/blog/connect-a-better-grpc/index.md)

###### June 1, 2022

Use Connect to build simple, stable, browser and gRPC-compatible APIs.

### [Introducing buf format](/blog/introducing-buf-format/index.md)

###### April 4, 2022

Rewrite Protobuf files in-place with 'buf format'.

### [Remote plugin execution with the Buf Schema Registry](/blog/remote-plugin-execution/index.md)

###### March 9, 2022

Execute plugins on the BSR to enforce consistency and simplify code generation.

### [The Buf CLI has reached version v1.0](/blog/buf-cli-v1/index.md)

###### February 23, 2022

A new foundational tool for the Protobuf ecosystem.

### [Introducing the Buf Schema Registry 🎉](/blog/announcing-bsr/index.md)

###### February 2, 2022

The Buf Schema Registry: a platform for managing your Protocol Buffer APIs.

### [An update on our fundraising](/blog/an-update-on-our-fundraising/index.md)

###### December 8, 2021

We've raised $93M across four rounds to fix Protobuf once and for all.

### [Buf CLI Now Available for Windows!](/blog/buf-cli-now-available-for-windows/index.md)

###### August 30, 2021

Binaries for buf, protoc-gen-buf-breaking, and protoc-gen-buf-lint are now available for Windows, starting from v0.54.1!

### [Document Your APIs and Increase Your Developer Productivity](/blog/document-your-apis/index.md)

###### August 19, 2021

Documentation is a fantastic developer productivity tool that can be applied by all levels of software engineers during the development process.

### [Authzed Case Study: Maintaining a Stable Protocol Buffers API](/blog/authzed-case-study-maintaining-a-stable-protobuf-api/index.md)

###### June 15, 2021

Our friends at Authzed recently adopted Buf and have given us the honor of writing about their experience.

### [GitHub Actions for Buf now available](/blog/github-actions-for-buf-now-available/index.md)

###### April 20, 2021

Buf's officially supported GitHub Actions make it easier than ever to instrument your CI/CD Protocol Buffers workflows with `buf`.

### [API design is stuck in the past](/blog/api-design-is-stuck-in-the-past/index.md)

###### November 12, 2020

The industry has embraced statically typed languages, but API design remains twenty years in the past. Schema driven development presents an opportunity to pull API design into the present.
