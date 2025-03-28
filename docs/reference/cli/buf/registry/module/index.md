# buf registry module

Manage BSR modules

### Usage

```console
$ buf registry module [flags]
```

### Flags

#### \-h, --help

help for module

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

- [buf registry module commit](commit/) - Manage a module's commits
- [buf registry module create](create/) - Create a BSR module
- [buf registry module delete](delete/) - Delete a BSR module
- [buf registry module deprecate](deprecate/) - Deprecate a BSR module
- [buf registry module info](info/) - Get a BSR module
- [buf registry module label](label/) - Manage a module's labels
- [buf registry module settings](settings/) - Manage a module's settings
- [buf registry module undeprecate](undeprecate/) - Undeprecate a BSR module

### Parent Command

- [buf registry](../) - Manage assets on the Buf Schema Registry
