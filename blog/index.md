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

<h3><a href="/blog/totw-5-avoid-import-public-weak/">Tip of the week #5: Avoid import public/weak</a></h3>

<h5>May 13, 2025</h5>

Avoid import public and import weak.

<h3><a href="/blog/bufstream-is-now-on-the-aws-marketplace/">Bufstream is now on the AWS Marketplace</a></h3>

<h5>May 9, 2025</h5>

We're excited to announce that Bufstream is now available on the AWS Marketplace. Enterprise customers can purchase through their AWS account and accelerate their deployment of Bufstream.

<h3><a href="/blog/kafka-schema-driven-development/">Cheap Kafka is cool. Schema-driven development with Kafka is cooler.</a></h3>

<h5>May 2, 2025</h5>

If you're looking for a modern drop-in replacement for Apache Kafka to save costs and complexity, Bufstream is probably your best bet. However, we've got a bigger mission here. Buf wants to bring schema-driven development across your entire stack, from your network APIs, to your streaming data, to your lakehouse, unified behind one schema language that can do it all.

<h3><a href="/blog/totw-4-accepting-mistakes/">Tip of the week #4: Accepting mistakes we can’t fix</a></h3>

<h5>April 29, 2025</h5>

Protobuf’s distributed nature introduces evolution risks that make it hard to fix some types of mistakes. Sometimes the best thing to do is to just let it be.

<h3><a href="/blog/totw-3-enum-names-need-prefixes/">Tip of the week #3:  Enum names need prefixes</a></h3>

<h5>April 22, 2025</h5>

Enums inherit some unfortunate behaviors from C++. Avoid this problem by using the Buf lint rules ENUM_VALUE_PREFIX and ENUM_ZERO_VALUE_SUFFIX.

<h3><a href="/blog/totw-2-compress-protos/">Tip of the week #2: Compress your Protos!</a></h3>

<h5>April 15, 2025</h5>

Compression is everywhere. This pervasiveness means that wire size tradeoffs matter less than they used to twenty years ago, when Protobuf was designed.

<h3><a href="/blog/totw-1-field-names/">Tip of the week #1: Field names are forever</a></h3>

<h5>April 8, 2025</h5>

Don’t rename fields. Even though there are a slim number of cases you can get away with it, it’s rarely worth doing, and is a potential source of bugs.

<h3><a href="/blog/bufstream-multi-region/">Multi-region, active-active Bufstream at 100 GiB/s</a></h3>

<h5>March 7, 2025</h5>

Bufstream — Buf’s drop-in replacement for Apache Kafka® — now supports business-critical workloads with multi-region, active-active clusters on GCP. 

<h3><a href="/blog/bufstream-on-spanner/">Bufstream on Spanner: 100 GiB/s with zero operational overhead</a></h3>

<h5>March 5, 2025</h5>

At less than $1M/month for 100 GiB/s of writes and 300 GiB/s of reads, Bufstream using Spanner is 25x cheaper than Confluent Cloud, 1.5x cheaper than WarpStream, and 3x cheaper than self-hosted Apache Kafka®.

<h3><a href="/blog/connect-es-v2/">Connect RPC for JavaScript: Connect-ES 2.0 is now generally available</a></h3>

<h5>November 20, 2024</h5>

Today, we’re announcing the 2.0 release of the Connect-ES project, the TypeScript implementation of Connect for Web browsers and Node.js. This release introduces improved support for major frameworks and simplified code generation. Connect-ES 2.0 now uses Protobuf-ES 2.0 APIs to leverage reflection, extension registries, and Protobuf custom options. The 2.0 release is a major version bump and comes with breaking changes. Read on to learn what’s changed and how to migrate to the 2.0 release.

<h3><a href="/blog/bufstream-jepsen-report/">Bufstream is the only cloud-native Kafka implementation validated by Jepsen</a></h3>

<h5>November 12, 2024</h5>

Jepsen's Bufstream report bolsters enterprise use of Buf’s elastic Kafka-compatible streaming platform to enable data quality, enforce governance policies, and cut costs 8x

<h3><a href="/blog/connect-swift-v1/">Connect-Swift 1.0 is now generally available</a></h3>

<h5>November 11, 2024</h5>

We’re excited to share that Connect-Swift has officially reached v1.0—its first stable release! With this milestone, the library’s battle-tested APIs will remain stable until its next major release. Projects can rely on Connect-Swift without worrying that future releases will cause breakages or require migrations.

<h3><a href="/blog/buf-custom-lint-breaking-change-plugins/">Introducing custom lint and breaking change plugins for Buf</a></h3>

<h5>September 18, 2024</h5>

Buf is introducing custom lint and breaking change plugins via the Bufplugin framework. Check it out to see how easy it is to author, test, and consume your own lint and breaking change rules.

<h3><a href="/blog/bsr-generated-sdks-for-csharp/">Generated SDKs for C# are now available on the Buf Schema Registry</a></h3>

<h5>August 28, 2024</h5>

We’re excited to announce that in addition to C++, Go, JavaScript/TypeScript, Java/Kotlin, Python, Swift, and Rust, the Buf Schema Registry now provides generated SDKs for C# via NuGet.

<h3><a href="/blog/bsr-generated-sdks-for-cpp/">Generated SDKs for C++ are now available on the Buf Schema Registry</a></h3>

<h5>August 28, 2024</h5>

We’re excited to announce that in addition to C#, Go, JavaScript/TypeScript, Java/Kotlin, Python, Swift, and Rust, the Buf Schema Registry now provides generated SDKs for C++ via CMake.

<h3><a href="/blog/protobuf-es-v2/">Protobuf for Javascript: Protobuf-ES 2.0 is now generally available</a></h3>

<h5>August 14, 2024</h5>

Today we’re announcing the 2.0 release of the Protobuf-ES project, our fully compliant Protobuf implementation for JavaScript and TypeScript. This release introduces full support for Protobuf Editions, new APIs for field presence & default values, TypeScript typing for Protobuf’s JSON Format, a full reflection API, support for Protobuf custom options, and more convenient APIs for managing extension registries. The 2.0 release is a major version bump, and comes with breaking changes. Read on to learn what’s changed and how to migrate to the 2.0 release.

<h3><a href="/blog/unified-buf-github-action-released/">Introducing the new Buf GitHub Action</a></h3>

<h5>August 13, 2024</h5>

Today, we’re launching the 1.0 release of our new unified GitHub Action, powered by the Buf CLI. This integration streamlines the processes of building, formatting, linting, and checking for breaking changes in your Protobuf schemas. It seamlessly integrates with GitHub's pull request workflow and automatically publishes Protobuf schema changes to the Buf Schema Registry when pull requests are merged.

<h3><a href="/blog/bufstream-kafka-lower-cost/">Bufstream: Kafka at 8x lower cost</a></h3>

<h5>July 9, 2024</h5>

We're excited to announce the public beta of Bufstream, a drop-in replacement for Apache Kafka deployed entirely in your own VPC that's 8x less expensive to operate.

<h3><a href="/blog/bsr-generated-sdks-for-rust/">Generated SDKs for Rust now available on the Buf Schema Registry</a></h3>

<h5>June 13, 2024</h5>

We’re excited to announce that the Buf Schema Registry now supports generated SDKs for Rust. Our Rust SDK crates are available natively to the Rust ecosystem using a custom crate registry that’s powered by our zero-dependency remote plugins platform.

<h3><a href="/blog/connect-rpc-joins-cncf/">Connect RPC joins CNCF: gRPC you can bet your business on</a></h3>

<h5>June 4, 2024</h5>

Connect RPC, Buf’s family of fully protocol-conformant and battle-tested alternatives to Google’s gRPC project, has joined the Cloud Native Computing Foundation. We joined the CNCF to demonstrate our deep commitment to sustainably and responsibly growing Connect as a well-governed and community-led open source project. Today, Connect integrates seamlessly with gRPC systems in production at companies of all sizes, such as CrowdStrike, PlanetScale, RedPanda, Chick-fil-A, BlueSky, and Dropbox.

<h3><a href="/blog/grpc-conformance-deep-dive/">Connect RPC vs. Google gRPC: Conformance Deep Dive</a></h3>

<h5>May 30, 2024</h5>

We’ve open sourced Connect RPC’s protocol conformance suite. Connect is a multi-protocol RPC project that includes support for the gRPC and gRPC-Web protocols. Anyone can now use it to validate the correctness of a gRPC implementation. This article explores how the test suite operates and details our findings for a selection of Connect RPC and Google’s gRPC runtimes.

<h3><a href="/blog/buf-cli-next-generation/">Introducing the next generation of the Buf CLI: still v1 and backwards-compatible</a></h3>

<h5>May 17, 2024</h5>

The Buf CLI and its associated configuration have been completely overhauled to support monorepos as first-class citizens. Everything we've changed is 100% backwards compatible.

<h3><a href="/blog/enhanced-buf-push-bsr-ui/">Introducing the newly improved BSR UI and buf push experience</a></h3>

<h5>May 17, 2024</h5>

We've made it easier to onboard and use the BSR with improved support for monorepos, tighter integration with source control providers, and a new BSR UI that is more polished and has improved accessibility.

<h3><a href="/blog/protobuf-editions-are-here/">Protobuf Editions are here: don’t panic</a></h3>

<h5>May 9, 2024</h5>

Most Protobuf users should ignore Editions and continue using proto3. If you become an early adopter, we’ve been working closely with Google to ensure that Buf will support editions as soon as they’re generally available.

<h3><a href="/blog/kong-insomnia-grpc-bsr-support/">The BSR now integrates with Kong Insomnia, making gRPC even easier to use</a></h3>

<h5>May 3, 2024</h5>

Kong Insomnia’s 9.0 release includes integrated support for the Buf Schema Registry. Organizations adopting gRPC can now provide developers first-class GUI tools while keeping schema access simple and secure.

<h3><a href="/blog/cloud-marketplaces/">The Buf Schema Registry is now on the AWS and Google Cloud Marketplaces</a></h3>

<h5>December 12, 2023</h5>

The BSR is the source of truth for your Protobuf APIs, and is the best way to share schemas across repositories, generate consistent code, and integrate Protobuf with Kafka. This launch helps Enterprise customers simplify how they purchase the Buf Schema Registry.

<h3><a href="/blog/bsr-generated-sdks/">Give clients pre-built native libraries for your APIs with zero effort</a></h3>

<h5>December 4, 2023</h5>

Produce pre-built client libraries in Go, Java, JS, TS, Swift, Kotlin, and Python out of the box for all of your Protobuf APIs with Buf’s generated SDKs. You’ll never have to explain how to use protoc ever again.

<h3><a href="/blog/python-generated-sdks/">Generated Python SDKs are now available in the BSR</a></h3>

<h5>November 29, 2023</h5>

Python engineers can now download pre-packaged generated code for their Protobuf schemas from the BSR using package management tools like pip, Poetry, and Conda.

<h3><a href="/blog/why-a-protobuf-schema-registry/">Why a Protobuf schema registry?</a></h3>

<h5>November 20, 2023</h5>

Learn why teams across industries and sizes have chosen the Buf Schema Registry as the home for their Protobuf schemas.

<h3><a href="/blog/the-real-reason-to-use-protobuf/">The real reason to use Protobuf is not performance</a></h3>

<h5>November 15, 2023</h5>

Fast serialization and small payloads are nice, but schema-driven development is why you’ll adopt Protobuf.

<h3><a href="/blog/review-governance-workflow/">Audit breaking changes with the Buf Schema Registry's governance workflow</a></h3>

<h5>November 6, 2023</h5>

Enterprise customers can now use the BSR to audit, approve, and reject commits that introduce breaking changes.

<h3><a href="/blog/type-path-uniqueness/">Type & path uniqueness policy enforcement for enterprises</a></h3>

<h5>September 5, 2023</h5>

The BSR can now enforce type and path uniqueness across all modules.

<h3><a href="/blog/seamless-gradle-integration-with-the-buf-cli/">Seamless Gradle integration with the Buf CLI</a></h3>

<h5>August 9, 2023</h5>

The Buf CLI can now integrate seamlessly with your Gradle builds.

<h3><a href="/blog/swift-packages/">Swift generated SDKs are now available for Xcode and SPM</a></h3>

<h5>July 12, 2023</h5>

Swift engineers can now download pre-packaged generated code for their Protobuf schemas from the BSR using Xcode and Swift Package Manager.

<h3><a href="/blog/breaking-change-governance/">Governance & breaking change policy enforcement for enterprises</a></h3>

<h5>July 10, 2023</h5>

The BSR can now enforce breaking change prevention policies across all modules.

<h3><a href="/blog/maven-repository/">Buf generated SDKs now support Java - introducing the Buf Maven repository</a></h3>

<h5>May 8, 2023</h5>

Launching the Buf Maven repository, supporting Java and Kotlin plugins (including connect-kotlin!)

<h3><a href="/blog/introducing-connect-cacheable-rpcs/">Introducing Cacheable RPCs in Connect</a></h3>

<h5>May 3, 2023</h5>

We’ve expanded the Connect protocol to support the use of HTTP GET requests, enabling web browsers and CDNs to cache Connect requests with ease.

<h3><a href="/blog/grpc-microservice-with-connect/">Building a modern gRPC-powered microservice using Node.js, Typescript, and Connect</a></h3>

<h5>April 27, 2023</h5>

Tutorial that covers creating a service, adding a client, testing, adding a database, and writing tests.

<h3><a href="/blog/protoc-gen-validate-v1-and-v2/">Announcing protoc-gen-validate v1.0 and our plans for v2.0</a></h3>

<h5>April 24, 2023</h5>

A look to the future of Protobuf validation

<h3><a href="/blog/plans-pricing-updates/">The Buf Schema Registry is out of beta! Announcing new Buf Schema Registry plans and pricing updates</a></h3>

<h5>April 12, 2023</h5>

The Buf Schema Registry (BSR) is officially out of beta, and we're launching new pricing plans

<h3><a href="/blog/protobuf-conformance/">Protobuf-ES is the only fully-compliant Protobuf library for JavaScript</a></h3>

<h5>March 21, 2023</h5>

The results are in: Protobuf-ES passes 99.95% of conformance tests

<h3><a href="/blog/introducing-bsr-scim/">The BSR now provides a SCIM service for Pro and Enterprise plans</a></h3>

<h5>March 16, 2023</h5>

Admins can now configure SCIM in their BSR to manage organization enrollments based on IdP security groups.

<h3><a href="/blog/connect-opentelemetry-go/">OpenTelemetry for connect-go: Observability out of the box</a></h3>

<h5>March 6, 2023</h5>

Add observability to your connect-go applications in just a few lines of code

<h3><a href="/blog/connect-node-beta/">Connect for Node.js is now available</a></h3>

<h5>February 28, 2023</h5>

Connect is now full-stack TypeScript

<h3><a href="/blog/announcing-connect-kotlin/">Announcing Connect-Kotlin: Connect is now fully supported on mobile!</a></h3>

<h5>February 22, 2023</h5>

Connect is now available across mobile for both Android and iOS!

<h3><a href="/blog/introducing-connect-query/">Introducing Connect-Query: Integrate Protobuf with TanStack Query more effectively</a></h3>

<h5>February 6, 2023</h5>

A TanStack Query extension to seamlessly integrate Protobuf

<h3><a href="/blog/buf-reflection-api/">Introducing the Buf Reflection API & Prototransform</a></h3>

<h5>February 2, 2023</h5>

A new API and Go library to unlock the power of Protobuf in your data processing.

<h3><a href="/blog/speeding-up-with-drafts/">Speeding up development with BSR drafts</a></h3>

<h5>January 25, 2023</h5>

To enable engineers to begin iterating quickly using generated code without the need to merge Protobuf schemas to main, we support BSR drafts.

<h3><a href="/blog/announcing-connect-swift/">Announcing Connect-Swift: You’ll actually want to use Protobuf on iOS</a></h3>

<h5>January 18, 2023</h5>

Eliminate handwritten Codable models by generating idiomatic HTTP APIs with Protobuf and Connect-Swift.

<h3><a href="/blog/buf-curl/">Introducing buf curl - Call your gRPC endpoints with the simplicity of buf</a></h3>

<h5>January 12, 2023</h5>

A new tool to call gRPC, gRPC-Web, and Connect endpoints.

<h3><a href="/blog/protobuf-es-v1/">Protobuf-ES has reached version 1.0</a></h3>

<h5>January 4, 2023</h5>

A stable, idiomatic Protocol Buffers library for TypeScript and JavaScript.

<h3><a href="/blog/generated-documentation-protobuf-options/">BSR Generated Documentation now supports Protobuf options</a></h3>

<h5>December 21, 2022</h5>

We are excited to share an update to the Generated Documentation feature within the BSR, which now includes support for most built-in Protobuf options. 🎉

<h3><a href="/blog/studio-now-has-favorites/">Buf Studio Now Has Favorites!</a></h3>

<h5>December 16, 2022</h5>

As of today, Buf Studio supports saving requests to your BSR profile.

<h3><a href="/blog/remote-packages-remote-plugins-approaching-v1/">Remote packages and remote plugins are approaching v1!</a></h3>

<h5>December 1, 2022</h5>

We've learned a lot from the alpha, and are excited to introduce a new and improved code generation experience.

<h3><a href="/blog/protobuf-es-the-protocol-buffers-typescript-javascript-runtime-we-all-deserve/">Protobuf-ES: The Protocol Buffers TypeScript/JavaScript runtime we all deserve</a></h3>

<h5>October 28, 2022</h5>

An idiomatic Protocol Buffers library for TypeScript and JavaScript is now available.

<h3><a href="/blog/bufs-new-compiler/">Buf's New Compiler</a></h3>

<h5>October 19, 2022</h5>

Buf has a new Protobuf compiler that is faster and more memory-efficient.

<h3><a href="/blog/protobuf-language-specification/">The Protobuf Language Specification</a></h3>

<h5>September 12, 2022</h5>

A comprehensive definition of the language, to empower a vibrant Protobuf ecosystem.

<h3><a href="/blog/bsr-redesign/">BSR redesign</a></h3>

<h5>August 25, 2022</h5>

Welcome to the new BSR

<h3><a href="/blog/introducing-the-buf-language-server/">Introducing the Buf Language Server</a></h3>

<h5>August 19, 2022</h5>

Jump to definition with 'bufls'.

<h3><a href="/blog/connect-web-protobuf-grpc-in-the-browser/">Connect-Web: It's time for Protobuf and gRPC to be your first choice in the browser</a></h3>

<h5>August 4, 2022</h5>

Use connect-web to generate compact, idiomatic TypeScript clients for your Protobuf APIs.

<h3><a href="/blog/buf-studio/">Buf Studio: Interact with gRPC and Protobuf APIs directly from your browser</a></h3>

<h5>July 28, 2022</h5>

Buf studio is an interactive web UI that lets you easily call your gRPC and Protobuf services from a browser.

<h3><a href="/blog/bazel-rules/">Bazel rules</a></h3>

<h5>June 20, 2022</h5>

Use buf with Bazel.

<h3><a href="/blog/connect-a-better-grpc/">Connect: A better gRPC</a></h3>

<h5>June 1, 2022</h5>

Use Connect to build simple, stable, browser and gRPC-compatible APIs.

<h3><a href="/blog/introducing-buf-format/">Introducing buf format</a></h3>

<h5>April 4, 2022</h5>

Rewrite Protobuf files in-place with 'buf format'.

<h3><a href="/blog/remote-plugin-execution/">Remote plugin execution with the Buf Schema Registry</a></h3>

<h5>March 9, 2022</h5>

Execute plugins on the BSR to enforce consistency and simplify code generation.

<h3><a href="/blog/buf-cli-v1/">The Buf CLI has reached version v1.0</a></h3>

<h5>February 23, 2022</h5>

A new foundational tool for the Protobuf ecosystem.

<h3><a href="/blog/announcing-bsr/">Introducing the Buf Schema Registry 🎉</a></h3>

<h5>February 2, 2022</h5>

The Buf Schema Registry: a platform for managing your Protocol Buffer APIs.

<h3><a href="/blog/an-update-on-our-fundraising/">An update on our fundraising</a></h3>

<h5>December 8, 2021</h5>

We've raised $93M across four rounds to fix Protobuf once and for all.

<h3><a href="/blog/buf-cli-now-available-for-windows/">Buf CLI Now Available for Windows!</a></h3>

<h5>August 30, 2021</h5>

Binaries for buf, protoc-gen-buf-breaking, and protoc-gen-buf-lint are now available for Windows, starting from v0.54.1!

<h3><a href="/blog/document-your-apis/">Document Your APIs and Increase Your Developer Productivity</a></h3>

<h5>August 19, 2021</h5>

Documentation is a fantastic developer productivity tool that can be applied by all levels of software engineers during the development process.

<h3><a href="/blog/authzed-case-study-maintaining-a-stable-protobuf-api/">Authzed Case Study: Maintaining a Stable Protocol Buffers API</a></h3>

<h5>June 15, 2021</h5>

Our friends at Authzed recently adopted Buf and have given us the honor of writing about their experience.

<h3><a href="/blog/github-actions-for-buf-now-available/">GitHub Actions for Buf now available</a></h3>

<h5>April 20, 2021</h5>

Buf's officially supported GitHub Actions make it easier than ever to instrument your CI/CD Protocol Buffers workflows with `buf`.

<h3><a href="/blog/api-design-is-stuck-in-the-past/">API design is stuck in the past</a></h3>

<h5>November 12, 2020</h5>

The industry has embraced statically typed languages, but API design remains twenty years in the past. Schema driven development presents an opportunity to pull API design into the present.
