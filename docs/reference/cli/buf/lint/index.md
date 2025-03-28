# buf lint

Run linting on Protobuf files

### Usage

```console
$ buf lint <input> [flags]
```

### Description

The first argument is the source, module, or Image to lint, which must be one of format \[binpb,dir,git,json,mod,protofile,tar,txtpb,yaml,zip\]. This defaults to "." if no argument is specified.

### Flags

#### \--config _string_

The buf.yaml file or data to use for configuration

#### \--disable-symlinks

Do not follow symlinks when reading sources or configuration from the local filesystem By default, symlinks are followed in this CLI, but never followed on the Buf Schema Registry

#### \--error-format _string_

The format for build errors or check violations printed to stdout. Must be one of \[text,json,msvs,junit,github-actions,config-ignore-yaml\]

#### \--exclude-path _strings_

Exclude specific files or directories, e.g. "proto/a/a.proto", "proto/a" If specified multiple times, the union is taken

#### \-h, --help

help for lint

#### \--path _strings_

Limit to specific files or directories, e.g. "proto/a/a.proto", "proto/a" If specified multiple times, the union is taken

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf](../) - The Buf CLI
