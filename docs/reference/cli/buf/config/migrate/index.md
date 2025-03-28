# buf config migrate

Migrate all buf.yaml, buf.work.yaml, buf.gen.yaml, and buf.lock files at the specified directories or paths to v2

### Usage

```console
$ buf config migrate [flags]
```

### Description

If no flags are specified, the current directory is searched for buf.yamls, buf.work.yamls, and buf.gen.yamls.The effects of this command may change over time

### Flags

#### \--buf-gen-yaml _strings_

The paths to the buf.gen.yaml generation templates to migrate

#### \-d, --diff

Write a diff to stdout instead of migrating files on disk. Useful for performing a dry run.

#### \-h, --help

help for migrate

#### \--module _strings_

The module directories to migrate. buf.yaml and buf.lock will be migrated

#### \--workspace _strings_

The workspace directories to migrate. buf.work.yaml, buf.yamls and buf.locks will be migrated

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf config](../) - Work with configuration files
