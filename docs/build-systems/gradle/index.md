# Gradle

Buf provides official support for the [Gradle](http://gradle.org/) build tool with the [Buf Gradle Plugin](https://github.com/bufbuild/buf-gradle-plugin), which enables you to:

- [Lint](../../lint/overview/) Protobuf sources using the [`bufLint`](#buf-lint) task.
- Perform [breaking change detection](#buf-breaking) for Protobuf [inputs](../../reference/inputs/) using the [`bufBreaking`](#buf-breaking) task.

## Setup

### Gradle setup

To get started, you'll need to add the Buf Gradle plugin:

::: info build.gradle.kts

```kotlin
plugins {
  id("build.buf") version "0.10.2"
}
```

:::

### Buf project setup

For a basic project or one that uses the [`protobuf-gradle-plugin`](https://github.com/google/protobuf-gradle-plugin), create a [`buf.yaml`](../../configuration/v2/buf-yaml/) configuration file. You can do this in the project directory, or specify the location of `buf.yaml` by configuring the extension:

```kotlin
buf {
    configFileLocation = rootProject.file("buf.yaml")
}
```

## Buf Gradle tasks

Once the plugin is set up, you can run the following tasks through Gradle (via `./gradlew` or `gradle`):

- [`bufFormatApply`](#buf-format): Applies Buf's formatter to Protobuf code.
- [`bufFormatCheck`](#buf-format): Validates Protobuf code using Buf's formatter.
- [`bufLint`](#buf-lint): Lints Protobuf code.
- [`bufBreaking`](#buf-breaking): Checks a Protobuf schema against a previous version for backwards-incompatible changes.
- [`bufGenerate`](#buf-generate): Generates code stubs from your Protobuf schema.

### Format checks

`bufFormatApply` is run manually and has no configuration.`bufFormatCheck` is run automatically during the `check` task if `enforceFormat` is enabled. It has no other configuration.

```kotlin
buf {
    enforceFormat = true // true by default
}
```

### Linting

`bufLint` is configured by the `buf.yaml` file in your project or workspace. It's run automatically during the `check` task.

### Breaking change detection

`bufBreaking` is more complicated since it requires a previous version of the Protobuf schema to validate the current version. Buf's built-in Git integration isn't quite enough since it requires a buildable Protobuf source set and the plugin's extraction step typically targets the project build directory, which is ephemeral and not committed.The plugin uses `buf build` to create an image from the current Protobuf schema and then publishes it as a Maven publication. In subsequent builds of the project, the plugin resolves the previously published schema image and run `buf breaking` against the current schema with the image as its reference.

#### Checking against the latest published version

Enable `checkSchemaAgainstLatestRelease` and the plugin resolves the previously published Maven artifact as its input for validation.For example, first publish the project with `publishSchema` enabled:

```kotlin
buf {
    publishSchema = true
}
```

Then configure the plugin to check the schema:

```kotlin
buf {
    // continue to publish schema
    publishSchema = true

    checkSchemaAgainstLatestRelease = true
}
```

The plugin runs Buf to check the project's current schema:

```text
> Task :bufBreaking FAILED
src/main/proto/buf/service/test/test.proto:9:1:Previously present field "1" with name "test_content" on message "TestMessage" was deleted.
```

#### Checking against a static version

If you don't want to dynamically check against the latest published version of your schema, you can specify a version with `previousVersion`:

```kotlin
buf {
    // continue to publish schema
    publishSchema = true

    // will always check against version 0.1.0
    previousVersion = "0.1.0"
}
```

#### Artifact details

By default, the published image artifact infers its details from an existing Maven publication if one exists. If one doesn't exist, you have more than one, or you'd like to specify the details yourself, you can configure them:

```kotlin
buf {
    publishSchema = true

    imageArtifact {
        groupId = rootProject.group.toString()
        artifactId = "custom-artifact-id"
        version = rootProject.version.toString()
    }
}
```

### Generating code

`bufGenerate` is configured as described in the [Buf docs](../../generate/overview/). Create a `buf.gen.yaml` in the project root and `bufGenerate` generates code in the project's build directory at `"$buildDir/bufbuild/generated/<out path from buf.gen.yaml>"`.An example for Java code generation using the remote plugin:

::: info Example buf.gen.yaml

```yaml
version: v2
plugins:
  - remote: buf.build/protocolbuffers/java
    out: java
```

:::

To use generated code in your build, you must add the generated code as a source directory and configure a task dependency to ensure code is generated before compilation:

::: info build.gradle.kts

```kotlin
import build.buf.gradle.BUF_GENERATED_DIR

plugins {
    `java`
    id("build.buf") version "<version>"
}

// Add a task dependency for compilation
tasks.named("compileJava").configure { dependsOn("bufGenerate") }

// Add the generated code to the main source set
sourceSets["main"].java { srcDir("$buildDir/$BUF_GENERATED_DIR/java") }

// Configure dependencies for protobuf-java:
repositories { mavenCentral() }

dependencies {
    implementation("com.google.protobuf:protobuf-java:<protobuf version>")
}
```

:::

#### Generating dependencies

If you'd like to generate code for your dependencies, configure the `bufGenerate` task:

::: info build.gradle.kts

```kotlin
buf {
    generate {
        includeImports = true
    }
}
```

:::

Ensure you have an up-to-date `buf.lock` file generated by `buf dep update` or this generation fails.

#### Further configuration

By default, `bufGenerate` reads the `buf.gen.yaml` template file from the project root directory. You can override the location of the template file:

::: info build.gradle.kts

```kotlin
buf {
    generate {
        templateFileLocation = rootProject.file("subdir/buf.gen.yaml")
    }
}
```

:::

### Specifying the Buf version

You can configure the version of Buf used by setting the `toolVersion` property on the plugin:

```kotlin
buf {
    toolVersion = "<version>"
}
```
