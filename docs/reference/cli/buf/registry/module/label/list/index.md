# buf registry module label list

List module labels

### Usage

```console
$ buf registry module label list <remote/owner/module[:ref]> [flags]
```

### Flags

#### \--archive-status _string_

The archive status of the labels listed. Must be one of \[archived,unarchived,all\]

#### \--format _string_

The output format to use. Must be one of \[text,json\]

#### \-h, --help

help for list

#### \--page-size _uint32_

The page size.

#### \--page-token _string_

The page token. If more results are available, a "next_page" key is present in the --format=json output

#### \--reverse

Reverse the results

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf registry module label](../) - Manage a module's labels
