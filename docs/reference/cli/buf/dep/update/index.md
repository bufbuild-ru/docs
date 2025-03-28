# buf dep update

Update pinned module dependencies in a buf.lock

### Usage

```console
$ buf dep update <directory> [flags]
```

### Description

Fetch the latest digests for the specified module references in buf.yaml, and write them and their transitive dependencies to buf.lock.The first argument is the directory of the local module to update. Defaults to "." if no argument is specified.

### Flags

#### \-h, --help

help for update

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf dep](../) - Work with dependencies
