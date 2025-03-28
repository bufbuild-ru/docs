# buf dep

Work with dependencies

### Usage

```console
$ buf dep [flags]
```

### Flags

#### \-h, --help

help for dep

#### \--help-tree

Print the entire sub-command tree

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Subcommands

- [buf dep graph](graph/) - Print the dependency graph
- [buf dep prune](prune/) - Prune unused dependencies from a buf.lock
- [buf dep update](update/) - Update pinned module dependencies in a buf.lock

### Parent Command

- [buf](../) - The Buf CLI
