# buf registry plugin create

Create a BSR plugin

### Usage

```console
$ buf registry plugin create <remote/owner/plugin> [flags]
```

### Flags

#### \--default-label-name _string_

The default label name of the module

#### \--format _string_

The output format to use. Must be one of \[text,json\]

#### \-h, --help

help for create

#### \--type _string_

The type of the plugin. Must be one of \[check\]

#### \--visibility _string_

The module's visibility setting. Must be one of \[public,private\]

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf registry plugin](../) - Manage BSR plugins
