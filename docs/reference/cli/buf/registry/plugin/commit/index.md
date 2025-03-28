# buf registry plugin commit

Manage a plugin's commits

### Usage

```console
$ buf registry plugin commit [flags]
```

### Flags

#### \-h, --help

help for commit

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

- [buf registry plugin commit add-label](add-label/) - Add labels to a commit
- [buf registry plugin commit info](info/) - Get commit information
- [buf registry plugin commit list](list/) - List plugins commits
- [buf registry plugin commit resolve](resolve/) - Resolve commit from a reference

### Parent Command

- [buf registry plugin](../) - Manage BSR plugins
