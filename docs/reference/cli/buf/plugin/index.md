# buf plugin

Work with check plugins

### Usage

```console
$ buf plugin [flags]
```

### Flags

#### \-h, --help

help for plugin

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

- [buf plugin prune](prune/) - Prune unused plugins from buf.lock
- [buf plugin push](push/) - Push a check plugin to a registry
- [buf plugin update](update/) - Update pinned remote plugins in a buf.lock

### Parent Command

- [buf](../) - The Buf CLI
