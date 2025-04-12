---
layout: home

hero:
  name: "Generated SDKs for C++ are now available on the Buf Schema Registry"
  tagline: "August 28, 2024"
---

We’re excited to announce that in addition to [C#](/docs/bsr/generated-sdks/nuget/index.md), [Go](/docs/bsr/generated-sdks/go/index.md), [JavaScript/TypeScript](/docs/bsr/generated-sdks/npm/index.md), [Java/Kotlin](/docs/bsr/generated-sdks/maven/index.md), [Python](/docs/bsr/generated-sdks/python/index.md), [Swift](/docs/bsr/generated-sdks/swift/index.md), and [Rust](/docs/bsr/generated-sdks/cargo/index.md), the Buf Schema Registry now provides generated SDKs for C++ via CMake. The BSR's CMake repository currently serves generated SDKs for the widely used [protocolbuffers/cpp](https://buf.build/protocolbuffers/cpp) and [grpc/cpp](https://buf.build/grpc/cpp) plugins.

## How we did it

Generated SDKs for C++ contain everything you need to seamlessly integrate Protobuf into your CMake project. However, CMake is a build system and not a package manager, so we had to approach them differently than usual. You can use CMake’s [`FetchContent`](https://cmake.org/cmake/help/latest/module/FetchContent.html) command to get the generated C++ libraries directly from the BSR.

Like our other generated SDKs, the BSR resolves all transitive module and plugin dependencies automatically for you. There’s no need to navigate the dependencies of your code or use multiple C++ plugins to get the correct generated types you need. You can depend on a Protobuf module like any other C++ library in your CMake project.

## Example usage

You can integrate BSR-hosted Protobuf modules into your project with a few short steps. The BSR helpfully illustrates them, providing you with the exact code snippets you need. However, here’s a quick example using the [googleapis module on the BSR](https://buf.build/googleapis/googleapis).

### Create a `FetchContent` script

First, let’s create a CMake script using the [`FetchContent`](https://cmake.org/cmake/help/latest/module/FetchContent.html) command to get the generated SDK from the BSR:

```protobuf
FetchContent_Declare(googleapis_googleapis_protocolbuffers_cpp
    URL https://buf.build/gen/cmake/googleapis/googleapis/protocolbuffers/cpp/v26.1-8bc2c51e08c4.1
    NETRC REQUIRED
    EXCLUDE_FROM_ALL
)
FetchContent_MakeAvailable(googleapis_googleapis_protocolbuffers_cpp)
```

The URL points to a unique location which provides a zip file containing the generated C++ code, including additional CMake `configuration` files that make it easy to integrate the code into your project.

### Add the script to your build process

Next, let’s invoke the script as part of your build process, using CMake's [`include`](https://cmake.org/cmake/help/latest/command/include.html#include) command. In your main `CMakeLists.txt` file, add the following line:

```protobuf
include(googleapis_googleapis_protocolbuffers_cpp)
```

### Link the library

Finally, link the downloaded library into your project using the  [`target_link_libraries`](https://cmake.org/cmake/help/latest/command/target_link_libraries.html#target-link-libraries) CMake command:

```protobuf
target_link_libraries(
    <yourProjectName>
    ...
    googleapis_googleapis_protocolbuffers_cpp
)
```

And that's it! Now, you can begin to depend on the SDK in your project. For example:

```protobuf
#include "google/rpc/status.pb.h"
#include <iostream>

int main(int argc, char *argv[]) {

  google::rpc::Status status;
  status.set_code(42);

  std::cout << status.code();

  return 0;
}
```

We're excited for the Buf Schema Registry to start supporting the C++ ecosystem. Get in touch on our [Slack channel](https://buf.build/b/slack) or shoot us an email at [feedback@buf.build](mailto:feedback@buf.build) with questions and suggestions!

‍
