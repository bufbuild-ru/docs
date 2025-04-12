---
layout: home

hero:
  name: "Give clients pre-built native libraries for your APIs with zero effort"
  tagline: "December 4, 2023"
---

Deploying Protobuf APIs across platforms can be challenging since many clients are unfamiliar with `protoc`, its plugins, and the configuration they require. Backend engineers often have to spend valuable time explaining to clients across the company how they should generate their client stubs to invoke the underlying APIs. At the end of the day, both backend teams and their clients end up frustrated.

Imagine a world where backend engineers didn’t have to explain anything to clients about `protoc`, and were simply able to say, “Here’s the SDK for my APIs - just plug it into your native package manager.” They’d be relieved to have their time back, and clients would be thrilled to avoid having to learn the `protoc` toolchain.

**With the Buf Schema Registry’s** [**generated SDKs**](/docs/bsr/generated-sdks/overview/index.md)**—automatically generated native libraries for Go, Java, JS, TS, Swift, Kotlin, and Python—that are continuously produced for every version of your API and every Protobuf plugin you have, this can be a reality. No client engineers will ever need to understand how to generate code from Protobuf schemas again:**

- **Consume SDKs from backend, frontend, and mobile clients:** Generated SDKs are available for a variety of development platforms through native registries, and are automatically generated and cached on-the-fly by the BSR for each commit and tag.
- **Integrate generated code using native package managers:** The BSR publishes SDKs which can be used from package managers like NPM, Go, Maven, Gradle, Swift Package Manager and pip, enabling clients to integrate generated outputs in the same way they would any other dependency using their native package manager of choice.
- **Generate code without managing a Protobuf environment:** Clients can build without having to worry about their Protobuf environment, compiler, or plugins by consuming generated SDKs from the BSR.
- **Deploy staged SDKs for in-flight changes:** Try out and iterate on staged API changes before shipping them to production by generating client SDKs for development branches in the BSR.
- **Get started without prior Protobuf knowledge:** We recently released a new onboarding walkthrough which is designed to help clients who are not familiar with Protobuf to quickly integrate generated SDKs for schemas that have been pushed by API producers.

## Setting up generated SDKs in the BSR

To start using generated SDKs in your project, you’ll first need to [sign in to the BSR](https://buf.build/login) and navigate to one of your Protobuf modules. (If you haven’t pushed any schemas to the BSR yet, you can learn how to create your first module in our [documentation](/docs/bsr/quickstart/index.md).)

Once you’ve selected a module, click on the **SDKs** tab. If this is your first time using generated SDKs, you’ll be greeted with a walkthrough and prompted to select your preferred language:

![Step 1](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/67479c39620b285ee7fa878d_step1-P6H23YP3.png)

Once you’ve selected a language, you’ll be presented with a list of relevant Protobuf plugins/runtimes to choose from. Typically, you’ll want to select a plugin for the base model types (such as `bufbuild/es` for TypeScript types) and a plugin for RPC generation (such as `connectrpc/es`):

![Step 2](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/67479c385cef994ef9b6d88d_step2-NDCJAQGT.png)

After clicking **Continue**, the BSR will provide instructions on how to configure your environment to integrate generated SDKs (such as configuring `npm` locally). Below these instructions, you’ll find the list of SDKs that have been generated for this particular module and the plugins you selected in the previous step. Installing the SDKs varies by language, but it is typically a 1-line command or configuration entry.

![Step 3](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/67479c3868798089240ee7b0_step3-UIEZBBYS.png)

Each SDK includes a **View integration guide** button which will take you to documentation and examples for how the generated code _contained by the SDK_ should be consumed by your application/service code. If you wish to use a plugin version other than the latest, you can change the **Plugin version** dropdown to a specific version. You can also switch the branch/tag/commit for SDKs by changing the **Current reference** dropdown on the top left of the page.

If you come back to this page later, you will not be prompted to choose a language or plugins again, but you can update these at any time by clicking **Change language** above the list of SDKs.

## Where to go from here

You can get started with generated SDKs by [signing up for the BSR for free](https://buf.build/signup) and [pushing your first Protobuf schema](/docs/bsr/quickstart/index.md). Our [documentation](/docs/bsr/generated-sdks/overview/index.md) for generated SDKs also contains language-specific walkthroughs for each supported package manager.

If you have any questions about generated SDKs or configuring the BSR, please reach out to us in the [Buf Slack](https://buf.build/b/slack/)!

‍
