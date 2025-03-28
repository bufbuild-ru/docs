# Format Protobuf files – Tutorial

> We recommend completing the [Buf CLI quickstart](../../cli/quickstart/) for an introduction to the `buf format` command.

Formatting your Protobuf files using a consistent and standardized style is a critical aspect of ensuring the readability and maintainability of your codebase. The Buf CLI provides a simple and powerful solution for enforcing this. With the `buf format` command, you can ensure that your Protobuf files adhere to industry best practices.`buf format` rewrites Protobuf files according to an opinionated [style](../style/), so it has no configuration options. No need to waste time and energy deciding how `.proto` files ought to be formatted—the tool decides so you don't have to.In this tutorial, you'll learn how to solve some common formatting problems with `buf format`.

## Usage and examples

By default, the [input](../../reference/inputs/) is the current directory and the formatted content is written to stdout. Given the `weather.proto` example file and file layout below, you get the following changes when you run the command.

```console
$ buf format
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

```console
$ buf format -w
$ cat proto/simple/v1/simple.proto

syntax = "proto3";

package simple.v1;

message Object {
  string key = 1;
  bytes value = 2;
}
```

::: tip NoteMost people will want to use `buf format -w`.

:::

**To display a diff between the original and formatted content, use `-d` or `--diff`.**

```console
$ buf format -d

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

```console
$ buf format --exit-code
$ buf format -w --exit-code
$ buf format -d --exit-code
```

**To write the result to a specified output file or directory, use `-o` or `--output` and specify the file path.**

::: info Write the formatted file to another file

```console
$ buf format proto/simple/v1/simple.proto -o formatted/simple.formatted.proto
```

:::

::: info Write the formatted directory to another directory, creating it if it doesn't exist

```console
$ buf format proto -o formatted
```

:::

::: info This also works with module references

```console
$ buf format buf.build/acme/weather -o formatted
```

:::

WarningThe -w and -o flags can't be used together in a single invocation.
