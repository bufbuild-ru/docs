---
description: "Installation and usage instructions for using Buf's generated SDKs with Maven/Gradle"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/maven/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/go/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/npm/"
  - - meta
    - property: "og:title"
      content: "Maven/Gradle - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/generated-sdks/maven.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/generated-sdks/maven/"
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
      content: "Maven/Gradle - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/generated-sdks/maven.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Maven/Gradle

The Buf Schema Registry provides generated SDKs for JVM-based languages in the form of a Maven repository, just like any other Java or Kotlin library. It generates SDKs automatically when you push schema changes, which eliminates the need to manage a Protobuf toolchain or generate code locally.

The BSR's Maven repository is hosted at [https://buf.build/gen/maven](https://buf.build/gen/maven). See the [quickstart](../tutorial/) for instructions on how to access generated SDKs from the BSR directly.

## Setup and usage

Follow the instructions for your package manager of choice below.

+++tabs key:d70b0b29ae9a5e1e36d1a91a72dc142e

== Maven

#### Setup

Update your `pom.xml` file to include the Buf Maven repository as a `<repository>`:

::: info pom.xml

```xml
  <repositories>
    <repository>
      <name>Buf Maven Repository</name>
      <id>buf</id>
      <url>https://buf.build/gen/maven</url>
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

::: tip Note
The `<id>` value is important for using private generated SDKs because it must match the `<id>` in the `<server>` section of the `~/.m2/settings.xml` file (see the [private generated SDKs](#private) section for more details).
:::

#### Adding a dependency

To add a dependency on a generated SDK, add the `groupId`, `artifactId`, and `version` to the `<dependencies>` section of your `pom.xml` file:

::: info pom.xml

```xml
<dependencies>
  <dependency>
    <groupId>build.buf.gen</groupId>
    <artifactId>connectrpc_eliza_connectrpc_kotlin</artifactId>
    <version>0.3.0.2.20230913231627.233fca715f49</version>
  </dependency>
</dependencies>
```

:::

See the [names and versions](#remote) section for syntax specifics.

== Gradle/Kotlin

#### Setup

Update your `build.gradle` file to include the Buf Maven repository:

::: info build.gradle.kts

```kotlin
repositories {
  mavenCentral()
  maven {
    url = uri("https://buf.build/gen/maven")
  }
}
```

:::

#### Adding a dependency

To add a dependency on a generated SDK, add the dependency to the `dependencies` section of your `build.gradle.kts` file:

::: info build.gradle.kts

```kotlin
{implementation("build.buf.gen:connectrpc_eliza_connectrpc_kotlin:0.3.0.2.20230913231627.233fca715f49")}
```

:::

See the [names and versions](#remote) section for syntax specifics.

== Gradle/Groovy

#### Setup

Update your `build.gradle` file to include the Buf Maven repository:

::: info build.gradle

```groovy
repositories {
  mavenCentral()
  maven {
    url "https://buf.build/gen/maven"
  }
}
```

:::

#### Adding a dependency

To add a dependency on a generated SDK, add the dependency to the `dependencies` section of your `build.gradle` file:

::: info build.gradle

```groovy
{implementation("build.buf.gen:connectrpc_eliza_connectrpc_kotlin:0.3.0.2.20230913231627.233fca715f49")}
```

:::

See the [names and versions](#remote) section for syntax specifics.

+++

## Private generated SDKs

When using SDKs generated from private BSR repositories, you'll need to authenticate by including a personal API token for local use or a [Bot user's](../../admin/instance/bot-users/) API token for CI workflows. See the [Authentication](../../authentication/) page for instructions.

+++tabs key:d70b0b29ae9a5e1e36d1a91a72dc142e

== Maven

To use private generated SDKs with Maven, edit your `~/.m2/settings.xml` file to include your API token:

::: info ~/.m2/settings.xml

```xml
<settings>
  <servers>
    <!--
    Add this <server>, replacing {token} with your API Token.
    The <id> value must match the id of the Buf Maven repository in your
    pom.xml file - in this guide, it's `buf`.
    -->
    <server>
      <id>buf</id>
      <configuration>
        <httpHeaders>
          <property>
            <name>Authorization</name>
            <value>Bearer {token}</value>
          </property>
        </httpHeaders>
      </configuration>
    </server>
  </servers>
</settings>
```

:::

== Gradle/Kotlin

To use private generated SDKs with Gradle, specify your repository with an `HttpHeaderCredentials` property, specify that you're using `HttpHeaderAuthentication`, and then specify your actual header credentials as Gradle properties, so that your API token is kept secret:

::: info build.gradle.kts

```kotlin
repositories {
  mavenCentral()
  maven {
    name = "buf"
    url = uri("https://buf.build/gen/maven")
    credentials(HttpHeaderCredentials::class)
    authentication {
      create<HttpHeaderAuthentication>("header")
    }
  }
}
```

:::

::: tip Note
The `name` value is important for using private generated SDKs because it must be prefixed to each Gradle property that makes up the header credentials.
:::

To specify the actual header credentials as Gradle properties, you can set them in your `~/.gradle/gradle.properties` file, or in any other way that Gradle allows [Gradle properties to be specified](https://docs.gradle.org/current/userguide/build_environment.html#sec:gradle_configuration_properties) (command-line, environment variables, etc.):

::: info ~/.gradle/gradle.properties

```text
bufName=Authorization
bufValue=Bearer {token}
```

:::

== Gradle/Groovy

To use private generated SDKs with Gradle, specify your repository with an `HttpHeaderCredentials` property, specify that you're using `HttpHeaderAuthentication`, and then specify your actual header credentials as Gradle properties, so that your API token is kept secret:

::: info build.gradle

```groovy
repositories {
  mavenCentral()
  maven {
    name = 'buf'
    url = 'https://buf.build/gen/maven'
    credentials(HttpHeaderCredentials)
    authentication {
      header(HttpHeaderAuthentication)
    }
  }
}
```

:::

::: tip Note
The `name` value is important for using private generated SDKs because it must be prefixed to each Gradle property that makes up the header credentials.
:::

To specify the actual header credentials as Gradle properties, you can set them in your `~/.gradle/gradle.properties` file, or in any other way that Gradle allows [Gradle properties to be specified](https://docs.gradle.org/current/userguide/build_environment.html#sec:gradle_configuration_properties) (command-line, environment variables, etc.):

::: info ~/.gradle/gradle.properties

```text
bufName=Authorization
bufValue=Bearer {token}
```

:::

+++

## Names and versions

The BSR Maven repository has a special syntax for SDK names:

```text
{moduleOwner}_{moduleName}_{pluginOwner}_{pluginName}
```

For example, the SDK name `connectrpc_eliza_connectrpc_kotlin` contains code for the [`connectrpc/eliza`](https://buf.build/connectrpc/eliza) module using the [connectrpc/kotlin](https://buf.build/connectrpc/kotlin) plugin.

Additionally, if a plugin supports the [Java Protobuf Lite runtime](https://github.com/protocolbuffers/protobuf/blob/b478a29bf0945d5b141992885ac9cfde45c66697/java/lite.md), the name is suffixed with `_lite`:

```text
{moduleOwner}_{moduleName}_{pluginOwner}_{pluginName}_lite
```

When installing the `connectrpc_eliza_connectrpc_kotlin_lite` SDK, the BSR generates code for the [`connectrpc/eliza`](https://buf.build/connectrpc/eliza) module using the [connectrpc/kotlin](https://buf.build/connectrpc/kotlin) plugin, ensuring that dependencies are using the lite runtime, which makes the SDK suitable for use on Android.

### Versions

To discover SDK versions for the Maven repository, you can browse a repository's SDK page, which has installation instructions and an interactive UI.

### Full syntax

The version, revision, and commit information for plugins is appended to the SDK name described above with a preceding colon, with each field separated by `.`:

```text
{sdkName}:{pluginVersion}.{pluginRevision}.{commitTimestamp}.{commitShortName}
```

As an example:

```text
connectrpc_eliza_connectrpc_kotlin:0.3.0.2.20230913231627.233fca715f49
```

That represents:

- Plugin version: `0.3.0`
- Plugin revision: `2`
- Commit timestamp: `20230913231627`
- Commit short name: `233fca715f49`

If you need a more specific version than the latest, such as needing to install a specific plugin version, you can use the [`buf registry sdk version` command](../../../reference/cli/buf/registry/sdk/version/).

The BSR supports [commits on labels](../../../cli/modules-workspaces/#referencing-a-module). This feature enables you to push unreleased Protobuf file changes and consume generated code without affecting the [default label](../../repositories/#default-label).

Only commits that are on the default label at the time they're pushed to the BSR have populated timestamps. Timestamps on commits pushed to other labels are zeroed out with `00000000000000` to easily distinguish them as changes in labels that are still in development.

## Available plugins

For a full list of supported plugins, navigate to the [BSR plugins page](https://buf.build/plugins) and search for Java or Kotlin.

To learn more about how these plugins are packaged and distributed, go to the [bufbuild/plugins repository](https://github.com/bufbuild/plugins). If you find a useful plugin that should be added, [file an issue](https://github.com/bufbuild/plugins/issues/new/choose).

## Troubleshooting

### Why does generating Java code using my valid module as an input result in an error?

Some users' Protobuf packages may use [Java reserved keywords](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/_keywords.html) (`public`, `native`, etc.). The generated code fails to compile if it includes one of these keywords, regardless of whether it's generated by a plugin locally or remotely. We suggest avoiding the use of Java reserved keywords in modules that you expect to use for generating code.

### Can Maven JARs be hosted without the `build.buf.gen` prefix?

No. The package name prefix is tied to the host name of the BSR, so it can't be changed or removed. Private BSR instances for Pro, Enterprise, and On-prem plans have a different prefix based on their host name.
