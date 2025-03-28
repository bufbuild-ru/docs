# buf beta price

Get the price for BSR paid plans for a given source or module

### Usage

```console
$ buf beta price <source> [flags]
```

### Description

The first argument is the source or module to get a price for, which must be one of format \[dir,git,mod,protofile,tar,zip\]. This defaults to "." if no argument is specified.

### Flags

#### \--disable-symlinks

Do not follow symlinks when reading sources or configuration from the local filesystem By default, symlinks are followed in this CLI, but never followed on the Buf Schema Registry

#### \-h, --help

help for price

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf beta](../) - Beta commands. Unstable and likely to change
