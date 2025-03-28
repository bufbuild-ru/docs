# buf registry sdk version

Resolve module and plugin reference to a specific Generated SDK version

### Usage

```console
$ buf registry sdk version --module=<buf.build/owner/repository[:ref]> --plugin=<buf.build/owner/plugin[:version]> [flags]
```

### Description

This command returns the version of the Generated SDK for the given module and plugin. Examples:Get the version of the eliza module and the go plugin for use with the Go module proxy.

```console
$ buf registry sdk version --module=buf.build/connectrpc/eliza --plugin=buf.build/protocolbuffers/go
v1.33.0-20230913231627-233fca715f49.1
```

Use a specific module version and plugin version.

```console
$ buf registry sdk version --module=buf.build/connectrpc/eliza:233fca715f49425581ec0a1b660be886 --plugin=buf.build/protocolbuffers/go:v1.32.0
v1.32.0-20230913231627-233fca715f49.1
```

### Flags

#### \-h, --help

help for version

#### \--module _string_

The module reference to resolve

#### \--plugin _string_

The plugin reference to resolve

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf registry sdk](../) - Manage Generated SDKs
