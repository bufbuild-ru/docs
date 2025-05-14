---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/artifactory/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/sdk-documentation/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/cargo/"
  - - meta
    - property: "og:title"
      content: "Use SDKs with Artifactory - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/generated-sdks/artifactory.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/generated-sdks/artifactory/"
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
      content: "Use SDKs with Artifactory - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/generated-sdks/artifactory.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Use SDKs with Artifactory

::: warning
This feature is only available on the Pro and Enterprise plans.
:::

The Buf Schema Registry (BSR) provides generated SDKs of generated code through standard registry APIs in each language. This makes it easy to configure artifact management tools like Artifactory to work with the BSR.

This guide uses the `buf.example.com` BSR instance and `https://example.jfrog.io` Artifactory instance as examples, but these should be substituted with the domains of your own instances.

## Setup

You must be a BSR instance admin to set up Artifactory.

+++tabs key:630b555e8416c8dec9e29cc2b5711592

== Go

1.  First, add a new Go remote repository to your Artifactory instance at `https://example.jfrog.io/ui/admin/repositories/remote/new`.

    - Set **Repository Key** to `buf-go`
    - Set **URL** to `https://buf.example.com/gen/go`
    - Open the **Advanced** tab and check **Bypass HEAD Requests**

2.  In your BSR, create a [bot user](../../admin/instance/bot-users/) with a token. Then set the **User Name** and **Access Token** of the `buf-go` repository in Artifactory to the BSR username and token of the bot user that you created.
3.  Create a new virtual repository named `go`, or use an existing virtual Go repository.

    - Edit the virtual repository and add `buf-go` to the included items under `go`
    - Ensure that the `go-remote` remote repository is also added to included items

== NPM

1.  First, add a new NPM remote repository to your Artifactory instance at `https://example.jfrog.io/ui/admin/repositories/remote/new`.

    - Set **Repository Key** to `buf-npm`
    - Set **URL** to `https://buf.example.com/gen/npm/v1`
    - Set **Repository Layout** and **Remote Layout Mapping** to `npm-default`
    - Open the **Advanced** tab and check **Bypass HEAD Requests**

2.  In your BSR, create a [bot user](../../admin/instance/bot-users/) with a token. Then set the **User Name** and **Access Token** of the `buf-npm` repository in Artifactory to the BSR user name and token of the bot user that you created.
3.  Create a new virtual repository named `npm`, or use an existing virtual NPM repository.

    - Edit the virtual repository and add `buf-npm` to the included items under `npm`

4.  Add another remote repository to act as a mirror for the official npm registry:

    - Set **Repository Key** to `npm-official`
    - Set **URL** to `https://registry.npmjs.org/`

== Maven

1.  First, add a new Maven remote repository to your Artifactory instance at `https://example.jfrog.io/ui/admin/repositories/remote/new`.

    - Set **Repository Key** to `buf-maven`
    - Set **URL** to `https://buf.example.com/gen/maven`
    - Scroll down to the **General** section and uncheck **Handle Snapshots** - the Buf Maven Repository doesn't support snapshots

2.  In your BSR, create a bot user with a token. Then set the **User Name** and **Access Token** of the `buf-maven` repository in Artifactory to the BSR user name and token of the bot user that you created.
3.  Add another remote repository to act as a mirror for Maven Central:

    - Set **Repository Key** to `maven-central`
    - Set **URL** to `https://repo1.maven.org/maven2/`

4.  Create a new virtual repository named `maven`, or use an existing virtual Maven repository.

    - Edit the virtual repository and add `buf-maven` and `maven-central` to the included items under `maven`

== Python

1.  First, add a new Python remote repository to your Artifactory instance at `https://example.jfrog.io/ui/admin/repositories/remote/new`.

    - Set **Repository Key** to `buf-python`
    - Set **URL** to `https://buf.example.com/gen/python`
    - Ensure **Repository Layout** is `simple-default` and **Remote Layout Mapping** is unset
    - Set **Registry URL** to `https://buf.example.com/gen/python`
    - Set **Registry Suffix** to `simple`
    - Open the **Advanced** tab and check **Bypass HEAD Requests**

2.  In your BSR, create a [bot user](../../admin/instance/bot-users/) with a token. Then set the **User Name** and **Access Token** of the `buf-python` repository in Artifactory to the BSR user name and token of the bot user that you created.
3.  Create a new virtual repository named `python`, or use an existing virtual Python repository.

    - Edit the virtual repository and add `buf-python` to the included items under `python`

4.  (Optional) Add another remote repository to act as a mirror for the official PyPI repository. This step is only required to bring in plugin dependencies such as the `protobuf` package - if you already have your own repository with these packages, you can use that repository instead.

    - Set **Key** to `pypi-official`
    - Set **URL** to `https://files.pythonhosted.org`
    - Set **Registry URL** to `https://pypi.org`
    - Set **Registry Suffix** to `simple`

== Cargo

1.  First, add a new Cargo remote repository to your Artifactory instance at `https://example.jfrog.io/ui/admin/repositories/remote/new`.

    - Set **Repository Key** to `buf-cargo`
    - Set **URL** to `https://buf.example.com/gen/cargo`
    - Set **Repository Layout** to `cargo-default` and ensure **Remote Layout Mapping** is unset
    - Set **Registry URL** to `https://buf.example.com/gen/cargo`
    - Ensure **Enable sparse index support** is checked on - the Buf Cargo Registry only supports the sparse index
    - If you want to allow unauthenticated access to download crates, ensure **Allow anonymous download and search** is checked on
      - Checking this option may require a re-index of the repository, which can be done in Application->Artifactory->Artifacts, right click and click **Recalculate Index**
    - Open the **Advanced** tab and check **Bypass HEAD Requests**

2.  In your BSR, create a [bot user](../../admin/instance/bot-users/) with a token. Then set the **User Name** and **Access Token** of the `buf-cargo` repository in Artifactory to the BSR user name and token of the bot user that you created.

== NuGet

1.  First, add a new NuGet remote repository to your Artifactory instance at `https://example.jfrog.io/ui/admin/repositories/remote/new`.

    - Set **Repository Key** to `buf-nuget`
    - Set **URL** to `https://buf.example.com/gen/nuget`
    - Set **NuGet v3 Feed URL** to `https://buf.example.com/gen/nuget/index.json`
    - Ensure **NuGet Feed Context Path** and **NuGet Symbol Server URL** are unset
    - Enable **Force Authentication**

2.  In your BSR, create a [bot user](../../admin/instance/bot-users/) with a token. Then set the **User Name** and **Access Token** of the `buf-nuget` repository in Artifactory to the BSR username and token of the bot user that you created.

+++

## Usage

### Go

1.  Click **Set Up Client/CI Tool** on the `go` virtual repository and follow the instructions.
2.  Run the following in a terminal to configure Artifactory as the go proxy:

    ```sh
    export GOPROXY="https://${ARTIFACTORY_USER}:${ARTIFACTORY_ACCESS_TOKEN}@example.jfrog.io/artifactory/api/go/go"
    ```

3.  Stop the go client from trying to resolve the sum with the global sumdb, see the [GONOSUMDB documentation](https://go.dev/ref/mod#environment-variables) for more.

    ```sh
    export GONOSUMDB=buf.example.com/gen/go
    ```

4.  Install modules:

    ```sh
    go get buf.example.com/gen/go/acme/petapis/protocolbuffers/go
    ```

### NPM

1.  Click **Set Up Client/CI Tool** on the `npm` virtual repository and follow the instructions.
2.  Run the following to configure Artifactory as a global registry, so that all `npm install` requests are routed to it.

    ```sh
    npm config set registry https://example.jfrog.io/artifactory/api/npm/npm/
    ```

    Or, configure only the `@bufteam` scope used by the BSR.

    ```sh
    npm config set @bufteam:registry https://bufbuild.jfrog.io/artifactory/api/npm/npm/
    ```

3.  Authenticate with Artifactory:

    ```sh
    npm login
    ```

4.  Install packages:

    ```sh
    npm install @bufteam/example_hello-service.protocolbuffers_js
    ```

### Maven

Click **Set Up Client/CI Tool** on the `maven` virtual repository and follow the instructions.

For `mvn`, add the following server to your `~/.m2/settings.xml` file, replacing `{ArtifactoryUsername}` with your Artifactory username, and `{ArtifactoryToken}` with the token you just generated during setup.

::: info ~/.m2/settings.xml

```xml
<settings>
  <!-- Other settings -->
  <servers>
    <!-- Add this server! -->
    <server>
      <id>buf-artifactory</id>
      <username>{ArtifactoryUsername}</username>
      <password>{ArtifactoryToken}</password>
    </server>
  </servers>
</settings>
```

:::

Next, add the repository to your `pom.xml` file, replacing `{ArtifactoryMavenURL}` with the URL of your Artifactory Maven Repository:

::: info pom.xml

```xml
<repositories>
  <!-- Other repositories -->
  <repository>
    <id>buf-artifactory</id>
    <url>{ArtifactoryMavenURL}</url>
    <releases>
      <enabled>true</enabled>
    </releases>
    <snapshots>
      <enabled>false</enabled>
    </snapshots>
  </repository>
</repositories>
```

:::

Then, to use packages add the dependency to your `pom.xml` file. The easiest way to find dependencies is to go to your module's assets tab on the BSR, which has a listing of versions for your module with all of the plugins on your instance. For example:

::: info pom.xml

```xml
<dependencies>
  <!-- ... -->
  <dependency>
    <groupId>com.example.buf.gen</groupId>
    <artifactId>connectrpc_eliza_bufbuild_connect-kotlin</artifactId>
    <version>0.1.8.3.20230727062025.d8fbf2620c60</version>
  </dependency>
</dependencies>
```

:::

### Gradle

For `gradle`, Artifactory doesn't supply instructions. Add your Artifactory repository to your `build.gradle` or `build.gradle.kts` file, and supply your Artifactory username and token as a username and password in Gradle Properties for the repository using [credentials](https://docs.gradle.org/current/userguide/declaring_repositories.html#sec:handling_credentials).

For example, you could add your credentials to a `gradle.properties` file in your project, replacing `{ArtifactoryUsername}` with your Artifactory username, and `{ArtifactoryToken}` with the token you just generated during setup:

::: info gradle.properties

```text
bufArtifactoryUsername="{ArtifactoryUsername}"
bufArtifactoryPassword="{ArtifactoryToken}"
```

:::

Then add a repository to your `build.gradle` or `build.gradle.kts` file, replacing `{ArtifactoryMavenURL}` with the URL of your Artifactory Maven Repository.

+++tabs key:1104d51ecd14d56dedf2edcf04c281e2

== Kotlin

::: info build.gradle.kts

```kotlin
repositories {
  maven {
    name = "bufArtifactory"
    url = uri("{ArtifactoryMavenURL}")
    credentials(PasswordCredentials::class)
  }
}
```

:::

== Groovy

::: info build.gradle

```groovy
repositories {
  maven {
    name = 'bufArtifactory'
    url "{ArtifactoryMavenURL}"
    credentials(PasswordCredentials)
  }
}
```

:::

+++

To use packages, add the dependency to your `build.gradle` or `build.gradle.kts` file. The easiest way to find dependencies is to go to your module's assets tab on the BSR, which has a listing of versions for your module with all of the plugins on your instance.

+++tabs key:1104d51ecd14d56dedf2edcf04c281e2

== Kotlin

::: info build.gradle.kts

```kotlin
dependencies {
  implementation("com.example.buf.gen:connectrpc_eliza_bufbuild_connect-kotlin:0.1.8.3.20230727062025.d8fbf2620c60")
}
```

:::

== Groovy

::: info build.gradle

```groovy
dependencies {
  implementation('com.example.buf.gen:connectrpc_eliza_bufbuild_connect-kotlin:0.1.8.3.20230727062025.d8fbf2620c60')
}
```

:::

+++

### Python

1.  Click **Set Up Client/CI Tool** on the `python` virtual repository and follow the instructions. You should end up with an `index-url` in your `~/.pip/pip.conf` file, containing a URL like:

    ```text
    https://<artifactory-username>:<artifactory-password-or-token>@example.jfrog.io/artifactory/api/pypi/python/simple
    ```

2.  Install packages:

    ```sh
    pip install example_hello-service_protocolbuffers_python
    ```

### Cargo

1.  Click **Set Up Client/CI Tool** on the `buf-cargo` remote repository and follow the instructions. At minimum, you should end up with a `registries.artifactory` configuration in your `.cargo/config.toml` file:

    ```toml
    [registries.artifactory]
    index = "sparse+https://example.jfrog.io/artifactory/api/cargo/buf-cargo/index/"
    ```

    You may also need to set up credentials if your Artifactory instance is authenticated, which should be included in the instructions.

2.  Install packages:

    ```sh
    cargo add --registry artifactory example_hello-service_community_neoeinstein-prost
    ```

### NuGet

1.  Click **Set Up Client/CI Tool** on the `buf-nuget` remote repository and follow the instructions. At minimum, you should end up with an `Artifactory` package source in your `NuGet.config` file:

    ```xml
    <packageSources>
      <add key="Artifactory" value="https://example.jfrog.io/artifactory/api/nuget/v3/buf-nuget/index.json" />
    </packageSources>
    ```

    You may also need to set up credentials if your Artifactory instance is authenticated, which should be included in Artifactory's instructions.

2.  Install packages:

    ```sh
    dotnet add package Bsr.Example.HelloService.Grpc.Csharp
    ```
