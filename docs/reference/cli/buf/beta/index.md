# buf beta

Beta commands. Unstable and likely to change

### Usage

```console
$ buf beta [flags]
```

### Flags

#### \-h, --help

help for beta

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

- [buf beta buf-plugin-v1](buf-plugin-v1/) - Run buf as a check plugin.
- [buf beta buf-plugin-v1beta1](buf-plugin-v1beta1/) - Run buf as a check plugin.
- [buf beta buf-plugin-v2](buf-plugin-v2/) - Run buf as a check plugin.
- [buf beta lsp](lsp/) - Start the language server
- [buf beta price](price/) - Get the price for BSR paid plans for a given source or module
- [buf beta registry](registry/) - Manage assets on the Buf Schema Registry
- [buf beta stats](stats/) - Get statistics for a given source or module
- [buf beta studio-agent](studio-agent/) - Run an HTTP(S) server as the Studio agent

### Parent Command

- [buf](../) - The Buf CLI
