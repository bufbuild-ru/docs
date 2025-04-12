---
layout: home

hero:
  name: "Buf generated SDKs now support Java - introducing the Buf Maven repository"
  tagline: "May 8, 2023"
---

The Buf Schema Registry’s [generated SDKs](/docs/bsr/generated-sdks/overview/index.md) make it easy for developers to download generated code just like any other package, without needing a local Protobuf toolchain. The BSR already has support for Go modules via its [Go module proxy](/docs/bsr/generated-sdks/go/index.md), and JavaScript and TypeScript packages with its [NPM registry](/docs/bsr/generated-sdks/npm/index.md). **Today we’re adding to that lineup, by launching the** [**Buf Maven repository**](/docs/bsr/generated-sdks/maven/index.md)**, supporting Java and Kotlin plugins (including** [**connect-kotlin**](https://buf.build/connectrpc/kotlin)**!).**

The Buf Maven repository allows developers to consume SDKs generated from Protobuf schemas with their favorite build tools, like [Maven](https://maven.apache.org/index.html) and [Gradle](https://docs.gradle.org/current/userguide/what_is_gradle.html).

## Using the Buf Maven repository

As an example, we can create a small project that uses `gradle` to pull in a package from the Buf Maven repository, and then use [Connect-Kotlin](https://connectrpc.com/docs/kotlin/getting-started/) to call the [Connect Demo](https://connectrpc.com/demo/) API.

First, ensure that [`gradle`](https://docs.gradle.org/current/userguide/installation.html) is installed and on your `$PATH`. Then, create a new directory for the example:

```protobuf
mkdir buf-maven-example
cd buf-maven-example
```

And create the following `build.gradle.kts` file inside it:

```protobuf
plugins {
    kotlin("jvm") version "1.8.21"
    application
}

repositories {
    mavenCentral()
    maven {
        url = uri("https://buf.build/gen/maven")
    }
}

dependencies {
    // This dependency has been remotely generated!
    implementation("build.buf.gen:connectrpc_eliza_bufbuild_connect-kotlin:0.1.7.1.20230727062025.d8fbf2620c60")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.4")
    implementation("build.buf:connect-kotlin-okhttp:0.1.7")
}

application {
    mainClass.set("MainKt")
}
```

Next, create a `src/main/kotlin` directory:

```protobuf
$ mkdir -p src/main/kotlin
```

And create a file within it called `Main.kt` with the following content:

```protobuf
src/main/kotlin/Main.kt

import build.buf.connect.ProtocolClientConfig
import build.buf.connect.extensions.GoogleJavaProtobufStrategy
import build.buf.connect.impl.ProtocolClient
import build.buf.connect.okhttp.ConnectOkHttpClient
import build.buf.connect.protocols.NetworkProtocol
// These two are from our generated package!
import build.buf.gen.connectrpc.eliza.v1.ElizaServiceClient
import build.buf.gen.connectrpc.eliza.v1.sayRequest
import kotlinx.coroutines.runBlocking
import okhttp3.OkHttpClient

fun main(): Unit = runBlocking {
    val okHttpClient = OkHttpClient()
    val client = ProtocolClient(
        httpClient = ConnectOkHttpClient(okHttpClient),
        ProtocolClientConfig(
            host = "https://demo.connectrpc.com/",
            serializationStrategy = GoogleJavaProtobufStrategy(),
            networkProtocol = NetworkProtocol.CONNECT,
        ),
    )
    val elizaClient = ElizaServiceClient(client)
    try {
        println(elizaSay(elizaClient, "hello"))
    } finally {
        okHttpClient.dispatcher.executorService.shutdown()
    }
}

private suspend fun elizaSay(client: ElizaServiceClient, message: String): String {
    val response = client.say(sayRequest { sentence = message })
    response.failure<Void> { throw RuntimeException("failed with ${it.code}: ${it.error}") }
    val sentence = response.success { it.message.sentence }
    return sentence!!
}
```

From there, you should be able to `gradle run` to download dependencies, build the project and run it:

```protobuf
$ gradle run
Output
> Task :run
Hello...I'm glad you could drop by today.
```

The output listed below `> Task :run` is the response from Eliza, meaning that we’ve successfully interacted with the Connect Demo API!

## Buf Maven repository features

The Buf Maven repository is similar to the BSR’s NPM registry and Go module proxy, in that it supports all the BSR features our users have come to rely on in their workflows, like private repositories and branches. It also has support for the Protobuf Lite Runtime.

We’ve updated the SDKs tab with instructions for using Maven and Gradle. As an example, check out [buf.build/connectrpc/eliza/sdks/main](https://buf.build/connectrpc/eliza/sdks/main) and select “Maven” in the Platform dropdown.

![Screen shot of BSR SDKs tab with Maven displayed in dropdown menu](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6747a2d04202f4330657ff30_assets-tab-D7FLZ7SI.png)

### Versioning

The syntax for versions in the Buf Maven repository may look familiar if you’ve seen them used in the [NPM registry](/docs/bsr/generated-sdks/npm/index.md#full-syntax) and [Go module proxy](/docs/bsr/generated-sdks/go/index.md#full-syntax). For Maven, it is:

`{pluginVersion}.{pluginRevision}.{moduleTimestamp}.{moduleCommit}   `

This syntax allows tools like Dependabot to pick up new versions of the package whenever a new version of a plugin is available or new versions are pushed to the module.

### Private repositories

Similar to NPM and Go, using the Buf Maven repository with private repositories requires a little more setup, but we’ve also updated the SDKs tab and our [docs for generated SDKs](/docs/bsr/generated-sdks/maven/index.md#private) with instructions.

### Branches

The Buf Maven repository has support for staged commits—again, the SDKs tab is your friend here! Select a branch from the dropdown, and navigate to the Generated SDKs tab.

One thing you’ll notice about commit versions on branches is that they always contain `00000000000000` for their timestamp component—this makes it easier to determine visually when a dependency is on a branch, and also ensures that a branch commit will never sort higher than a `main` commit.

### Lite Runtime

The Buf Maven repository has support for creating packages based on the Protobuf [Lite Runtime](https://github.com/protocolbuffers/protobuf/blob/main/java/lite.md), ideal for mobile applications. Simply append `_lite` to the package name to get a package compiled with lite runtime support (for plugins that support the Lite Runtime—which currently is all of them).

## What’s next

We’re already planning to add a [Swift package registry](https://github.com/apple/swift-package-manager/blob/main/Documentation/Registry.md) to remote packages, as a backbone for [Connect-Swift](https://github.com/connectrpc/connect-swift). As always, we’d love to hear from you—feedback and questions are welcome on the [Buf Slack](https://buf.build/b/slack/)!

‍
