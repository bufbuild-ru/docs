# buf export

Export proto files from one location to another

### Usage

```console
$ buf export <source> [flags]
```

### Description

The first argument is the source or module to export, which must be one of format \[dir,git,mod,protofile,tar,zip\]. This defaults to "." if no argument is specified.Examples:Export proto files in `<source>` to an output directory.

```console
$ buf export <source> --output=<output-dir>
```

Export current directory to another local directory.

```console
$ buf export . --output=<output-dir>
```

Export the latest remote module to a local directory.

```console
$ buf export <buf.build/owner/repository> --output=<output-dir>
```

Export a specific version of a remote module to a local directory.

```console
$ buf export <buf.build/owner/repository:ref> --output=<output-dir>
```

Export a git repo to a local directory.

```console
$ buf export https://github.com/owner/repository.git --output=<output-dir>
```

### Flags

#### \--config _string_

The buf.yaml file or data to use for configuration

#### \--disable-symlinks

Do not follow symlinks when reading sources or configuration from the local filesystem By default, symlinks are followed in this CLI, but never followed on the Buf Schema Registry

#### \--exclude-imports

Exclude imports.

#### \--exclude-path _strings_

Exclude specific files or directories, e.g. "proto/a/a.proto", "proto/a" If specified multiple times, the union is taken

#### \-h, --help

help for export

#### \-o, --output _string_

The output directory for exported files

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
