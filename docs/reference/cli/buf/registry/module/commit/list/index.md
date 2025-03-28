# buf registry module commit list

List modules commits

### Usage

```console
$ buf registry module commit list <remote/owner/module[:ref]> [flags]
```

### Description

This command lists commits in a module based on the reference specified. For a commit reference, it lists the commit itself. For a label reference, it lists the current and past commits associated with this label. If no reference is specified, it lists all commits in this module.

### Flags

#### \--digest-changes-only

Only commits that have changed digests. By default, all commits are listed

#### \--format _string_

The output format to use. Must be one of \[text,json\]

#### \-h, --help

help for list

#### \--page-size _uint32_

The page size

#### \--page-token _string_

The page token. If more results are available, a "next_page" key is present in the --format=json output

#### \--reverse

Reverse the results. By default, they are ordered with the newest first

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf registry module commit](../) - Manage a module's commits
