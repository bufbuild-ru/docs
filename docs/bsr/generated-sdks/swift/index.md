---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/swift/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/python/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/policy-checks/breaking/overview/"
  - - meta
    - property: "og:title"
      content: "Swift Package Manager/Xcode - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/generated-sdks/swift.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/generated-sdks/swift/"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "og:image:type"
      content: "image/png"
  - - meta
    - property: "og:image:width"
      content: "1200"
  - - meta
    - property: "og:image:height"
      content: "630"
  - - meta
    - property: "twitter:title"
      content: "Swift Package Manager/Xcode - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/generated-sdks/swift.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Swift Package Manager/Xcode

The Buf Schema Registry provides generated SDKs for Swift in the form of a Swift Package Manager repository, just like any other Swift library. It generates SDKs automatically when you push schema changes, which eliminates the need to manage a Protobuf toolchain or generate code locally.

See the [tutorial](../tutorial/) for instructions on how to access generated SDKs from the BSR directly.

## Setup and usage

Follow the instructions for your package manager of choice below.

+++tabs key:ced68075f7315935e25d8d71ad173824

== Xcode

No setup is required to start using Buf's generated Swift SDKs with Xcode.

However, Xcode doesn't yet support using the Swift Package Manager CLI and `Package.swift` for iOS/Mac apps. Dependency management for these targets is still done with Git repositories. To account for this, Buf provides a read-only Git server for generated SDKs, which is available at the `https://buf.build/gen/swift/git` host.

If you aren't developing an iOS, macOS, watchOS, or tvOS app and use a `Package.swift` manifest file to control your package and its dependencies, please use our Swift Package Manager implementation.

### Adding a dependency

To find the Git URLs for your BSR module, go to the module's **SDKs** tab, which you can find at `https://buf.build/ORGANIZATION/REPOSITORY/sdks`. Ensure you have the **Swift** language and the **Xcode** tab selected.

1.  In your Xcode project, navigate to **File** > **Add Packages...**.
2.  In the popup window, click into the `Search or Enter Package URL` text field in the top right and paste the provided SDK's `.git` URL:

    ::: info Example URL

    ```text
    https://buf.build/gen/swift/git/0.8.0-20230913231627-233fca715f49.1/connectrpc_eliza_connectrpc_swift.git
    ```

    :::

3.  Next, for the **Dependency Rule**, select **Branch** and point it to **main**.
4.  Click **Add Package**. A new pop-up will appear prompting you to link the SDK's products to your app.
5.  Ensure the library is checked and click **Add** to confirm the SDK addition (there will only ever be one library). Note that this will automatically add any transitive dependencies.

When using generated SDKs sourced from the read-only Git server with Xcode, only use the **Branch** dependency rule providing the **main** branch, or the **Exact Version** dependency rule, providing the SemVer, as the ranging rules will not function.

Note: Since Buf lazily produces a separate Git URL for each version of an SDK upon first request, Xcode's auto-update functionality doesn't work with these generated SDKs.

To update an SDK, navigate to the module's **SDKs** tab and get a new link for a new version. Then manually update the dependency by replacing the existing SDK with the SDK sourced from the new link.

== Swift Package Manager

To find the references for your BSR module to use with Swift Package Manager, go to the module's **SDKs** page, which you can find at `https://buf.build/ORGANIZATION/REPOSITORY/sdks`.

Ensure you have the **Swift** language and the **SPM** tab selected.

#### Setup

To enable Swift Package Manager to properly resolve all dependencies with the `buf` scope, set up the project registry with the following command:

::: info Setup

```sh
swift package-registry set https://buf.build/gen/swift --scope=buf
```

:::

#### Adding a dependency

Add a dependency on the generated SDK:

1.  Add a **package dependency** to the `dependencies` block of your `Package.swift` manifest file:

    ::: info Package.swift

    ```swift
    dependencies: [
        .package(
            id: "buf.connectrpc_eliza_connectrpc_swift",
            exact: "0.8.0-20230913231627-233fca715f49.1"
        )
    ],
    ```

    :::

2.  Add a **product dependency** to the `dependencies` block of your target's entry:

    ::: info Package.swift

    ```swift
    .target(
        name: "ExamplePackage",
        dependencies: [
            .product(
                name: "Connectrpc_Eliza_Connectrpc_Swift",
                package: "buf.connectrpc_eliza_connectrpc_swift"
            ),
        ]
    ),
    ```

    :::

+++

## Private generated SDKs

When using SDKs generated from private BSR repositories, you'll need to authenticate by including a personal API token for local use or a [Bot user's](../../admin/instance/bot-users/) API token for CI workflows. See the [Authentication](../../authentication/) page for instructions.

+++tabs key:ced68075f7315935e25d8d71ad173824

== Xcode

When you attempt to access a private BSR module's generated SDKs with Xcode, a prompt window will appear.

In the prompt window, ensure that it's requesting your username and password, and not the other VCS-based alternatives (GitHub, GitLab). Supply the username and token in these fields.

== Swift Package Manager

To access the private module, execute the following with the `swift` toolchain, which will associate the token with the registry in the `swift` configuration file `~/.swiftpm/configuration/registries.json` and create a macOS Keychain (or `.netrc` file) entry to store the credentials locally:

::: info Login

```sh
swift package-registry login https://buf.build/gen/swift/login --token={token}
```

:::

The login API was introduced in Swift 5.8. Please ensure your Swift toolchain version is 5.8 or later.

+++

## Names and versions

For SDK and product names, as well as available versions for a generated SDK, browse the BSR module's **SDKs** tab, which you can find at `https://{host}/{org}/{module}/sdks`. The BSR has special syntax for generated SDK names and product names — it's slightly different depending on which SDK you use.

- _MODULE-OWNER_ is the owner of the module.
- _MODULE-NAME_ is the name of the module.
- _PLUGIN-OWNER_ is the owner of the plugin.
- _PLUGIN-NAME_ is the name of the plugin.

+++tabs key:8e4c81a5769c89b438d4aa8f72e82fc1

== Xcode

```console
MODULE-OWNER_MODULE-NAME_PLUGIN-OWNER_PLUGIN-NAME

# Example
connectrpc_eliza_connectrpc_swift
```

== Swift Package Manager

```console
buf.MODULE-OWNER_MODULE-NAME_PLUGIN-OWNER_PLUGIN-NAME

# Example
buf.connectrpc_eliza_connectrpc_swift
```

== Product naming

```console
MODULE-OWNER_MODULE-NAME_PLUGIN-OWNER_PLUGIN-NAME

# Example
Connectrpc_Eliza_Connectrpc_Swift
```

+++

### Versions

The version syntax is similar to our other generated SDKs:

::: info Version syntax

```console
PLUGIN_VERSION-MODULE_TIMESTAMP-COMMIT_ID.PLUGIN_REVISION

# Example
v1.11.0-20230727062025-d8fbf2620c60.1
```

:::

With SDK versions (valid \[semver\]\[semver\]):

- The version core is the plugin version **1.11.0**
- The semver pre-release version is composed of:
  - module commit timestamp (YYYYMMDDHHMMSS) **20230727062025**
  - module commit short name (12 characters) **d8fbf2620c60**
- The final identifier is the plugin revision **1** for the plugin version

To discover SDK versions, you can browse a repository's SDK page, which has installation instructions and an interactive UI.

If you need a more specific version than the latest, such as needing to install a specific plugin version, you can use the [`buf registry sdk version` command](../../../reference/cli/buf/registry/sdk/version/).

Only commits that are on the default label at the time they're pushed to the BSR have populated timestamps. Timestamps on commits pushed to other labels are zeroed out with `00000000000000` to easily distinguish them as changes in labels that are still in development.

## Available plugins

For a full list of supported plugins, navigate to the [BSR plugins page](https://buf.build/plugins) and search for Swift.

To learn more about how these plugins are packaged and distributed, go to the [bufbuild/plugins repository](https://github.com/bufbuild/plugins). If you find a useful plugin that should be added, [file an issue](https://github.com/bufbuild/plugins/issues/new/choose).
