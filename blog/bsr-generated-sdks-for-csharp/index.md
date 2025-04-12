---
layout: home

hero:
  name: "Generated SDKs for C# are now available on the Buf Schema Registry"
  tagline: "August 28, 2024"
---

We’re excited to announce that in addition to [C++](/docs/bsr/generated-sdks/cmake/index.md), [Go](/docs/bsr/generated-sdks/go/index.md), [JavaScript/TypeScript](/docs/bsr/generated-sdks/npm/index.md), [Java/Kotlin](/docs/bsr/generated-sdks/maven/index.md), [Python](/docs/bsr/generated-sdks/python/index.md), [Swift](/docs/bsr/generated-sdks/swift/index.md), and [Rust](/docs/bsr/generated-sdks/cargo/index.md), the Buf Schema Registry now provides generated SDKs for C# via NuGet. The BSR's NuGet repository currently serves generated SDKs for the popular [protocolbuffers/csharp](https://buf.build/protocolbuffers/csharp) and [grpc/csharp](https://buf.build/grpc/csharp) plugins.

## How we did it

Generated SDKs for C# contain everything you need to seamlessly integrate Protobuf into your Visual Studio or dotnet CLI project. Similarly to our [generated SDKs for Java via Maven](/docs/bsr/generated-sdks/maven/index.md), the BSR precompiles the NuGet packages it distributes (using `dotnet pack`) to support the broadest range of .NET target frameworks.

Like our other generated SDKs, the BSR resolves all transitive module and plugin dependencies automatically for you. There’s no need to navigate the dependencies of your code or use multiple C# plugins to get the correct generated types you need. You can depend on a Protobuf module like any other C# library in your project.

## Example usage

Integrating the BSR’s generated SDKs into your C# project is easy. Here’s an example of using the [BSR’s Registry API](https://buf.build/bufbuild/registry) in a simple console app to obtain information about an organization.

### Create a new console application

First, let’s create a new C# console project using the `dotnet` CLI:

```protobuf
dotnet new console --output BsrTest && cd BsrTest
```

### Configure `nuget.config` with a BSR package source

Next, let’s create a `nuget.config` file within the project and add the BSR as a new package source, like so:

```protobuf
<?xml version="1.0" encoding="utf-8"?>
<configuration>
    <packageSources>
        <add key="nuget.org" value="https://api.nuget.org/v3/index.json" protocolVersion="3" />
        <add key="BSR" value="<https://buf.build/gen/nuget/index.json>" protocolVersion="3" />
    </packageSources>
    <packageSourceCredentials>
        <BSR>
            <add key="Username" value="{username}" />
            <add key="ClearTextPassword" value="{token}" />
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

You’ll also need to configure some form of access credentials (sub out `{username}` and `{token}`, respectively) to access the BSR as a NuGet package source. Pro and Enterprise customers may choose to [configure a Bot user](/docs/bsr/admin/instance/bot-users/index.md) for this.

### Install our packages

Next, let’s add the [bufbuild/registry](https://buf.build/bufbuild/registry) Protobuf module to the project as a native C# dependency:

```protobuf
dotnet add package BSR.Bufbuild.Registry.Grpc.Csharp # Add BSR generated SDK
dotnet add package Grpc.Net.Client # Add the gRPC Client APIs
```

Finally, in `Program.cs`, let’s write a small program leveraging our SDK that prints out when the bufbuild organization was created:

```protobuf
using Buf.Registry.Owner.V1;
using Grpc.Net.Client;

const string instanceHostname = "buf.build";
const string organizationName = "bufbuild";

var channel = GrpcChannel.ForAddress("https://" + instanceHostname);
var client = new OrganizationService.OrganizationServiceClient(channel);
var request = new GetOrganizationsRequest
{
    OrganizationRefs = { new Buf.Registry.Owner.V1.OrganizationRef { Name = organizationName } }
};
var response = client.GetOrganizations(request);
var organization = response.Organizations[0];

Console.WriteLine($"{instanceHostname}/{organizationName} was created at {organization.CreateTime}.");
```

That’s it! When you run the program, you’ll get the following result:

```protobuf
$ dotnet run
buf.build/bufbuild was created at "2021-05-27T20:44:01.946721Z".
```

We're excited for the Buf Schema Registry to start supporting the C# ecosystem. We’ll begin rolling this functionality out to our Community and Teams customers in the coming weeks. Get in touch on our [Slack channel](https://buf.build/b/slack) or shoot us an email at [feedback@buf.build](mailto:feedback@buf.build) with questions and suggestions!

‍
