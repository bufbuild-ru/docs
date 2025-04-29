---
layout: home

title: "Swift generated SDKs are now available for Xcode and SPM"
description: "Swift engineers can now download pre-packaged generated code for their Protobuf schemas from the BSR using Xcode and Swift Package Manager."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/swift-packages"
  - - meta
    - property: "og:title"
      content: "Swift generated SDKs are now available for Xcode and SPM"
  - - meta
    - property: "og:description"
      content: "Swift engineers can now download pre-packaged generated code for their Protobuf schemas from the BSR using Xcode and Swift Package Manager."
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6750cc3014882ab5f207ce89_Swift%20SDKs.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Swift generated SDKs are now available for Xcode and SPM"
  - - meta
    - property: "twitter:description"
      content: "Swift engineers can now download pre-packaged generated code for their Protobuf schemas from the BSR using Xcode and Swift Package Manager."
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6750cc3014882ab5f207ce89_Swift%20SDKs.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

hero:
  name: "Swift generated SDKs are now available for Xcode and SPM"
  tagline: "July 12, 2023"
---

**Today we’re announcing the release of Swift support for** [**generated SDKs**](/docs/bsr/generated-sdks/swift/index.md) **in the Buf Schema Registry (BSR)!** Swift engineers no longer need to manage a Protobuf toolchain or generate code locally—they can now download pre-packaged generated code for their Protobuf schemas from the BSR using Swift Package Manager and Xcode. These packages are automatically made available when schema changes are pushed to the BSR.

**Swift package support complements our existing** [**Go**](/docs/bsr/generated-sdks/go/index.md)**,** [**JavaScript/TypeScript**](/docs/bsr/generated-sdks/npm/index.md)**, and** [**Java/Kotlin**](/docs/bsr/generated-sdks/maven/index.md) **packages, enabling clients across all frontend and mobile platforms to consume generated packages from Protobuf schemas using their native dependency managers.**

We've updated each BSR module’s Generated SDKs tab with instructions on how to get started with remote Swift packages using either Xcode or Swift Package Manager. You can also find instructions and more details in our [documentation](/docs/bsr/generated-sdks/swift/index.md).

## Using generated SDKs with Xcode

As an example, let's take an existing Swift project that makes use of locally-generated code and update it to consume the remote Swift package for a Protobuf module in the BSR.

To get started, clone the [`connect-swift`](https://github.com/connectrpc/connect-swift) repository:

```protobuf
git clone git@github.com:connectrpc/connect-swift.git
```

Then, open the example app’s Xcode project:

```protobuf
open Examples/ElizaSwiftPackageApp/ElizaSwiftPackageApp.xcodeproj
```

Now that we have the project open, let’s delete the locally generated code from the project, which we’ll then replace with a generated SDK. Remove the following files from the `GeneratedSources` directory:

`ElizaSwiftPackageApp/ElizaSharedSources/GeneratedSources/eliza.pb.swift   ElizaSwiftPackageApp/ElizaSharedSources/GeneratedSources/eliza.connect.swift   `

Next, navigate to the [Generated SDKs tab for the Eliza repository](https://buf.build/connectrpc/eliza/sdks) in the BSR and select **Swift** from the language drop-down. Then select **Xcode** in the tab view and copy the provided URL for `connectrpc/swift`:

![Screenshot of assets tab with xcode git links visible](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6747a20bbb58e402d94a04df_xcode-git-links-CIY7EC3A.png)

Then, navigate to the Xcode project and select **File > Add Packages...**:

![Screenshot of xcode with add packages option selected](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6747a20bb03e1f496d6cb674_xcode-add-packages-CQAI2CT5.png)

In the popup window, click into the **Search or Enter Package URL** text field in the top right and paste the URL.

Next, point the dependency at the `main` branch. Buf produces a separate git URL for each BSR commit due to versioning requirements, so this will always be stable.

Alternatively, you can also specify the package version explicitly as an `Exact Version`:

![Screenshot of xcode with package popup and eliza package selected](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6747a20b512046ff641b86ce_xcode-packages-popup-JV7XAWQ6.png)

A popup will prompt you to link the package’s product (the generated library) to your app. There will only be one option—ensure it’s selected and click **Add Package** to confirm the package addition, which will automatically add any transitive dependencies:

![Screenshot of xcode with library selection popup and eliza library selected](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6747a20b2a572b335b5d7451_xcode-library-popup-NQK4TC6V.png)

Navigate to the `MenuView.swift` file and add the import statement for the generated module for `connect-swift`:

`import Connectrpc_Eliza_Connectrpc_Swift   `

Copy to clipboard

Navigate to `MessagingViewModel.swift` and add the import statements for both the generated Connect code and the SwiftProtobuf types:

`import Connectrpc_Eliza_Apple_Swift // Transitive dependency of Connectrpc_Eliza_Connectrpc_Swift   import Connectrpc_Eliza_Connectrpc_Swift   `

Copy to clipboard

You should be able to build and run the app! Future commits pushed to the Eliza repository in the BSR will be available as Swift packages automatically, and there is no longer a need to manage a local Protobuf toolchain or generate code manually.

## Using generated SDKs with SPM (Swift Package Manager)

Buf’s remote Swift packages also work with Swift Package Manager and `Package.swift` files. For details on how to use generated SDKs with SPM, take a look at our [documentation](/docs/bsr/generated-sdks/swift/index.md).

## Where to go from here

Head over to our [documentation](/docs/bsr/generated-sdks/swift/index.md) to get started with generated SDKs for Swift, and check out [`connect-swift`](https://github.com/connectrpc/connect-swift) if you aren’t already using it for your Swift RPCs! If you’re new to generated SDKs, documentation is also available for each of our other supported package managers: [Go packages](/docs/bsr/generated-sdks/go/index.md), [NPM](/docs/bsr/generated-sdks/npm/index.md), and [Maven](/docs/bsr/generated-sdks/maven/index.md). As always, we’d love to hear from you—feedback and questions are welcome on the [Buf Slack](https://buf.build/b/slack/)!
