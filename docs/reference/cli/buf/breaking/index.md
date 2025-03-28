# buf breaking

Verify no breaking changes have been made

### Usage

```console
$ buf breaking <input> --against <against-input> [flags]
```

### Description

This command makes sure that the `<input>` location has no breaking changes compared to the `<against-input>` location.The first argument is the source, module, or image to check for breaking changes, which must be one of format \[binpb,dir,git,json,mod,protofile,tar,txtpb,yaml,zip\]. This defaults to "." if no argument is specified.

### Flags

#### \--against _string_

Required. The source, module, or image to check against. Must be one of format \[binpb,dir,git,json,mod,protofile,tar,txtpb,yaml,zip\]

#### \--against-config _string_

The buf.yaml file or data to use to configure the against source, module, or image

#### \--config _string_

The buf.yaml file or data to use for configuration

#### \--disable-symlinks

Do not follow symlinks when reading sources or configuration from the local filesystem By default, symlinks are followed in this CLI, but never followed on the Buf Schema Registry

#### \--error-format _string_

The format for build errors or check violations printed to stdout. Must be one of \[text,json,msvs,junit,github-actions\]

#### \--exclude-imports

Exclude imports from breaking change detection.

#### \--exclude-path _strings_

Exclude specific files or directories, e.g. "proto/a/a.proto", "proto/a" If specified multiple times, the union is taken

#### \-h, --help

help for breaking

#### \--limit-to-input-files

Only run breaking checks against the files in the input When set, the against input contains only the files in the input Overrides --path

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
