---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/cmake/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/cargo/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/go/"
  - - meta
    - property: "og:title"
      content: "CMake - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/generated-sdks/cmake.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/generated-sdks/cmake/"
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
      content: "CMake - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/generated-sdks/cmake.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# CMake

The Buf Schema Repository (BSR) provides generated SDKs for C++ in the form of a CMake library. You can consume generated SDKs from modules and plugins by using the [FetchContent](https://cmake.org/cmake/help/latest/module/FetchContent.html) command in the CMake scripts of your project. C++ SDKs are generated when requested by your project, which eliminates the need to manage a Protobuf toolchain or generate code locally.

## Available plugins

Currently, the BSR supports two plugins for CMake:

- The official [Protobuf C++ plugin](https://buf.build/protocolbuffers/cpp)
- The official [gRPC C++ plugin](https://buf.build/grpc/cpp)

To learn more about how these plugins are packaged and distributed, go to the [bufbuild/plugins repository](https://github.com/bufbuild/plugins). If you find a useful plugin that you think should be added, [file an issue](https://github.com/bufbuild/plugins/issues/new/choose)

## Setup

You need to be logged into the BSR from the command line to consume the C++ SDKs. See the [authentication docs](../../authentication/) for local and CI environments.Using a C++ generated SDK requires configuring CMake scripts in your project to pull the generated libraries from the BSR. The BSR's generated SDKs page for C++ walks you through a series of steps to do so, and they're explained in more detail below.

### 1\. Create `FetchContent` script

The first step is to create a CMake script that uses the `FetchContent` command to grab the CMake library from the BSR. For this example, we'll use the [googleapis](https://buf.build/googleapis/googleapis) module on the BSR. Your `FetchContent` snippet would look something like this:

```cmake
FetchContent_Declare(googleapis_googleapis_protocolbuffers_cpp // [!code highlight]
    URL https://buf.build/gen/cmake/googleapis/googleapis/protocolbuffers/cpp/v26.1-8bc2c51e08c4.1
    NETRC REQUIRED
    EXCLUDE_FROM_ALL
)
FetchContent_MakeAvailable(googleapis_googleapis_protocolbuffers_cpp) // [!code highlight]
```

The `FetchContent_Declare` command accepts a name for the content as its first parameter, which is then passed to `FetchContent_MakeAvailable`. The BSR chooses a name for you based on the module and plugin in use according to the following scheme:

```text
{moduleOwner}_{moduleName}_{pluginOwner}_{pluginName}
```

The URL to fetch the content is also generated based on the module and plugin. It also contains a unique string used to identify the plugin version and commit hash of the module being generated. For example:

```text
https://buf.build/gen/cmake/{moduleOwner}/{moduleName}/{pluginOwner}/{pluginName}/{pluginVersion}-{commitHash}.{pluginRevision}
```

The `commitHash` is the first 12 characters of the complete hash generated for the module commit in the BSR.The CMake script can live anywhere, but for consistency, we recommend placing it in a file in a `cmake/` directory, named with the same name passed to `FetchContent`. In this example, the code is saved to a file named `cmake/googleapis_googleapis_protocolbuffers_cpp.cmake`.If your build process has issues finding this file, see [Troubleshooting](#troubleshooting).

### 2\. Add the script to your build process

The next step is to invoke this `FetchContent` script as part of your build process. We recommend using CMake's [include](https://cmake.org/cmake/help/latest/command/include.html#include) command.In your main `CMakeLists.txt` file, add the following line:

```cmake
include(googleapis_googleapis_protocolbuffers_cpp)
```

The value passed to `include` should be the name of the file you created in step 1.

### 3\. Link the library

The final step is to link the downloaded library into your project. To do so, use the CMake command [`target_link_libraries`](https://cmake.org/cmake/help/latest/command/target_link_libraries.html#target-link-libraries):

```cmake
target_link_libraries(
    <yourProjectName>
    ...
    googleapis_googleapis_protocolbuffers_cpp
)
```

::: tip NoteThis library name must be what the BSR specifies, _not_ the name of the CMake file from step 1 or the name used with `FetchContent`. This is because it's named this way in the downloaded content from the BSR.

:::

## Troubleshooting

If you see the following error:

```text
CMake Error at CMakeLists.txt:27 (include):
  include could not find requested file:
```

This means that your build process is unable to find your `FetchContent` CMake file. When you use `include`, CMake first looks for a file with the exact path and name you specified relative to your `CMAKE_SOURCE_DIR`. If it doesn't find it, it then searches `CMAKE_MODULE_PATH` for a file with the name specified and a `.cmake` extension.Our instructions on the BSR assume that you have a `CMAKE_MODULE_PATH` set, which is why our `include` doesn't specify a `.cmake` extension. To resolve this, verify that you have a `CMAKE_MODULE_PATH` configured. For example, if you saved the file in a `cmake/` directory, check that you have something similar to the following in your main `CMakeLists.txt` file:

```Makefile
list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/cmake")
```

and then verify that the location of the file is `${CMAKE_MODULE_PATH}/cmake` (without the `.cmake` extension).However, if you don't use a `CMAKE_MODULE_PATH` then instead you need to specify the exact file path and name (with `.cmake` extension) to `include`. For example, if you have the file `cmake/googleapis_googleapis_protocolbuffers_cpp.cmake`, then your `include` should look like this:`include(cmake/googleapis_googleapis_protocolbuffers_cpp.cmake)`

## Related docs

- Try the [generated SDKs tutorial](../tutorial/) to learn how to generate SDKs from the BSR.
