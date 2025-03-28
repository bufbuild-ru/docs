# buf registry logout

Log out of the Buf Schema Registry

### Usage

```console
$ buf registry logout [domain] [flags]
```

### Description

This command removes any BSR credentials from your .netrc file. The \[domain\] argument will default to buf.build if not specified.

### Flags

#### \-h, --help

help for logout

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf registry](../) - Manage assets on the Buf Schema Registry
