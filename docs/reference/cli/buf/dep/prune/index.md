# buf dep prune

Prune unused dependencies from a buf.lock

### Usage

```console
$ buf dep prune <directory> [flags]
```

### Description

The first argument is the directory of your buf.yaml configuration file. Defaults to "." if no argument is specified.

### Flags

#### \-h, --help

help for prune

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf dep](../) - Work with dependencies
