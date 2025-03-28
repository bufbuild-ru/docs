# buf registry plugin

Manage BSR plugins

### Usage

```console
$ buf registry plugin [flags]
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

- [buf registry plugin commit](commit/) - Manage a plugin's commits
- [buf registry plugin create](create/) - Create a BSR plugin
- [buf registry plugin delete](delete/) - Delete a BSR plugin
- [buf registry plugin info](info/) - Get a BSR plugin
- [buf registry plugin label](label/) - Manage a plugin's labels
- [buf registry plugin settings](settings/) - Manage a plugin's settings

### Parent Command

- [buf registry](../) - Manage assets on the Buf Schema Registry
