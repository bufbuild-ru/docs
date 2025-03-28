# buf config init

Initialize buf configuration files for your local development

### Usage

```console
$ buf config init [buf.build/owner/foobar] [flags]
```

### Description

This command will write a new buf.yaml file to start your local development.If a buf.yaml already exists, this command will not overwrite it, and will produce an error.The effects of this command may change over time - this command may initialize i.e. buf.gen.yaml files in the future.

### Flags

#### \-h, --help

help for init

#### \-o, --output _string_

The directory to write the configuration files to

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf config](../) - Work with configuration files
