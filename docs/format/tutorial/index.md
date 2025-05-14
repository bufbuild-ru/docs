---
description: "Step-by-step walkthrough of the Buf CLI's Protobuf formatting features"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/format/tutorial/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/format/style/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/curl/usage/"
  - - meta
    - property: "og:title"
      content: "Quickstart - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/format/tutorial.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/format/tutorial/"
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
      content: "Quickstart - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/format/tutorial.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Format Protobuf files quickstart

> We recommend completing the [Buf CLI quickstart](../../cli/quickstart/) for an introduction to the `buf format` command.

Formatting your Protobuf files using a consistent and standardized style is a critical aspect of ensuring the readability and maintainability of your codebase. The Buf CLI provides a simple and powerful solution for enforcing this. With the `buf format` command, you can ensure that your Protobuf files adhere to industry best practices.

`buf format` rewrites Protobuf files according to an opinionated [style](../style/), so it has no configuration options. No need to waste time and energy deciding how `.proto` files ought to be formatted — the tool decides so you don't have to.

In this quickstart, you'll learn how to solve some common formatting problems with `buf format`.

## Usage and examples

By default, the [input](../../reference/inputs/) is the current directory and the formatted content is written to stdout. Given the `weather.proto` example file and file layout below, you get the following changes when you run the command.

```sh
buf format
```

```text
.
├── buf.yaml
└── proto
    └── weather
        └── v1
            └── weather.proto
```

::: info Original weather.proto

```protobuf
syntax = "proto3";

import "google/protobuf/timestamp.proto";
import "google/protobuf/datetime.proto";



package weather;



message Location {
      float latitude = 1;
      float longitude = 2;
}

message CurrentWeatherRequest {
  Location location = 1;
}

message CurrentWeatherResponse {
  float temperature = 1;
}

service WeatherVisionService {
  rpc CurrentWeather (CurrentWeatherRequest) returns (CurrentWeatherResponse);
}
```

:::

::: info Reformatted weather.proto

```protobuf
syntax = "proto3";

package weather;

import "google/protobuf/datetime.proto";
import "google/protobuf/timestamp.proto";

message Location {
  float latitude = 1;
  float longitude = 2;
}

message CurrentWeatherRequest {
  Location location = 1;
}

message CurrentWeatherResponse {
  float temperature = 1;
}

service WeatherVisionService {
  rpc CurrentWeather(CurrentWeatherRequest) returns (CurrentWeatherResponse);
}
```

:::

For a complete list of flags for `buf format`, see the [reference](../../reference/cli/buf/format/). Below are some of the key options, with results for a `simple.proto` file:

::: info proto/simple/v1/simple.proto

```proto
syntax = "proto3";

package simple.v1;

message Object {
  string key = 1;
  bytes value = 2;
}
```

:::

**To rewrite files in place, use the `-w` or `--write` flag.**

```sh
buf format -w
cat proto/simple/v1/simple.proto

syntax = "proto3";

package simple.v1;

message Object {
  string key = 1;
  bytes value = 2;
}
```

**To display a diff between the original and formatted content, use `-d` or `--diff`.**

```sh
buf format -d

diff -u proto/simple/v1/simple.proto.orig proto/simple/v1/simple.proto
--- proto/simple/v1/simple.proto.orig    ...
+++ proto/simple/v1/simple.proto         ...
@@ -2,8 +2,7 @@

 package simple.v1;

-
 message Object {
-    string key = 1;
-   bytes value = 2;
+  string key = 1;
+  bytes value = 2;
 }
```

You can also use the `--exit-code` flag to exit with a non-zero exit code if there is a diff:

```sh
buf format --exit-code
buf format -w --exit-code
buf format -d --exit-code
```

**To write the result to a specified output file or directory, use `-o` or `--output` and specify the file path.**

::: info Write the formatted file to another file

```sh
buf format proto/simple/v1/simple.proto -o formatted/simple.formatted.proto
```

:::

::: info Write the formatted directory to another directory, creating it if it doesn't exist

```sh
buf format proto -o formatted
```

:::

::: info This also works with module references

```sh
buf format buf.build/acme/weather -o formatted
```

:::

The `-w` and `-o` flags are mutually exclusive.
