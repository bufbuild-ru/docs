# buf registry plugin settings update

Update BSR plugin settings

### Usage

```console
$ buf registry plugin settings update <remote/owner/plugin> [flags]
```

### Flags

#### \--description _string_

The new description for the plugin

#### \-h, --help

help for update

#### \--url _string_

The new URL for the plugin

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

- [buf registry plugin settings](../) - Manage a plugin's settings
