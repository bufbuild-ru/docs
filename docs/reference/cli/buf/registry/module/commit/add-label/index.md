# buf registry module commit add-label

Add labels to a commit

### Usage

```console
$ buf registry module commit add-label <remote/owner/module:commit> --label <label> [flags]
```

### Flags

#### \--format _string_

The output format to use. Must be one of \[text,json\]

#### \-h, --help

help for add-label

#### \--label _strings_

The labels to add to the commit. Must have at least one

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf registry module commit](../) - Manage a module's commits
