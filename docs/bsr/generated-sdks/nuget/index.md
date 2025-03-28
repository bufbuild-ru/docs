# NuGet

The Buf Schema Repository (BSR) provides generated SDKs for C# in the form of a NuGet repository. You can consume generated SDKs from modules and plugins using `dotnet` or IDEs like Visual Studio and Rider. It generates SDKs automatically when you push schema changes, which eliminates the need to manage a Protobuf toolchain or generate code locally.

## Setup

To use Buf's NuGet repository, you must configure it in your `NuGet.config` file.You need to configure a token for the registry. Create a token (see the [Authentication](../../authentication/#create-a-token) page for instructions), and then include it in the `ClearTextPassword` field:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
    <packageSources>
        <add key="nuget.org" value="https://api.nuget.org/v3/index.json" protocolVersion="3" />
        <add key="BSR" value="https://buf.build/gen/nuget/index.json" protocolVersion="3" />
    </packageSources>
    <packageSourceCredentials>
        <BSR>
            <add key="Username" value="{bsr-username}" />
            <add key="ClearTextPassword" value="{token}" /> // [!code highlight]
            <add key="ValidAuthenticationTypes" value="Basic" />
        </BSR>
    </packageSourceCredentials>
    <packageSourceMapping>
        <packageSource key="nuget.org">
            <package pattern="*" />
        </packageSource>
        <packageSource key="BSR">
            <package pattern="BSR.*" />
        </packageSource>
    </packageSourceMapping>
</configuration>
```

## Installing generated SDKs

To install a generated SDK, use `dotnet add package` and reference the SDK name. For example, to install the [`connectrpc/eliza`](https://buf.build/connectrpc/eliza) Protobuf module using the [`grpc/csharp`](https://buf.build/grpc/csharp) plugin, run this command:

```console
$ dotnet add package BSR.Connectrpc.Eliza.Grpc.Csharp
```

See below for syntax specifics.

## Names and versions

The BSR NuGet repository has a special syntax for SDK names:

```text
BSR.{Module-Owner}.{Module-Name}.{Plugin-Owner}.{Plugin-Name}
```

Each component is title-cased to follow C# package-naming conventions. For an easy way to find the package name for your module, visit your repository's generated SDK page.For example, the SDK name `BSR.Connectrpc.Eliza.Grpc.Csharp` contains code for the [`connectrpc/eliza`](https://buf.build/connectrpc/eliza) module using the [`grpc/csharp`](https://buf.build/grpc/csharp) plugin.

### Versions

To discover SDK versions for the NuGet repository, you can browse a repository's generated SDK page, which has installation instructions and an interactive UI for selecting SDK versions.

### Full syntax

The BSR NuGet repository creates slightly different versions for released and unreleased versions, to adhere to NuGet's rules for prerelease versions and handle NuGet's versioning limitations.

#### Released versions

```text
{pluginMajor}.{pluginMinor}.1{pluginPatch}{pluginRevision}.{sequenceNumber}+{commitShortName}
```

For example:

```text
27.2.10001.12+6bcea16e2570
```

That represents:

- Plugin major: `27`
- Plugin minor: `2`
- Plugin patch: `0` (1<mark>00</mark>01)
- Plugin revision: `1` (100<mark>01</mark>)
- Sequence number: 12
- Commit short name: `6bcea16e2570`

#### Unreleased versions

```text
{pluginMajor}.{pluginMinor}.1{pluginPatch}{pluginRevision}.0-{commitTimestamp}-{commitShortName}
```

For example:

```text
27.2.10001.0-20240717164601-6bcea16e2570
```

That represents:

- Plugin major: `27`
- Plugin minor: `2`
- Plugin patch: `0` (1<mark>00</mark>01)
- Plugin revision: `1` (100<mark>01</mark>)
- Commit timestamp: `20240717164601`
- Commit short name: `6bcea16e2570`

The BSR supports [commits on labels](../../../concepts/modules-workspaces/#referencing-a-module). This feature enables you to push unreleased Protobuf file changes and consume generated code without affecting the [default label](../../../concepts/repositories/#default-label).Commits on the default label have released versions, and all other commits have unreleased versions.

## Available plugins

For a full list of supported plugins, navigate to the [BSR plugins page](https://buf.build/plugins) and search for C#.To learn more about how these plugins are packaged and distributed, go to the [bufbuild/plugins repository](https://github.com/bufbuild/plugins). If you find a useful plugin that you think should be added, [file an issue](https://github.com/bufbuild/plugins/issues/new/choose).

## Related docs

- Try the [generated SDKs tutorial](../tutorial/) to learn how to generate SDKs from the BSR.
