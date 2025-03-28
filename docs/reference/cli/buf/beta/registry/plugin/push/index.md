# buf beta registry plugin push

Push a plugin to a registry

### Usage

```console
$ buf beta registry plugin push <source> [flags]
```

### Description

The first argument is the source to push (directory containing buf.plugin.yaml or plugin release zip), which must be a directory. This defaults to "." if no argument is specified.

### Flags

#### \--disable-symlinks

Do not follow symlinks when reading sources or configuration from the local filesystem By default, symlinks are followed in this CLI, but never followed on the Buf Schema Registry

#### \--format _string_

The output format to use. Must be one of \[text,json\]

#### \-h, --help

help for push

#### \--image _string_

Existing image to push

#### \--override-remote _string_

Override the default remote found in buf.plugin.yaml name and dependencies

#### \--visibility _string_

The plugin's visibility setting. Must be one of \[public,private\]

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf beta registry plugin](../) - Manage plugins on the Buf Schema Registry
