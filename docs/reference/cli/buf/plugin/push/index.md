---

title: "buf plugin push - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/plugin/push/"
  - - meta
    - property: "og:title"
      content: "buf plugin push - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/plugin/push/"
  - - meta
    - property: "twitter:title"
      content: "buf plugin push - Buf Docs"

---

# buf plugin push

Push a check plugin to a registry

### Usage

```console
$ buf plugin push <remote/owner/plugin> [flags]
```

### Description

The first argument is the plugin full name in the format <remote/owner/plugin>.

### Flags

#### \--binary _string_

The path to the Wasm binary file to push.

#### \--create

Create the plugin if it does not exist. Defaults to creating a private plugin on the BSR if --create-visibility is not set. Must be used with --create-type.

#### \--create-type _string_

The plugin's type setting, if created. Can only be set with --create-type. Must be one of \[check\]

#### \--create-visibility _string_

The module's visibility setting, if created. Can only be set with --create. Must be one of \[public,private\]

#### \-h, --help

help for push

#### \--label _strings_

Associate the label with the plugins pushed. Can be used multiple times.

#### \--source-control-url _string_

The URL for viewing the source code of the pushed plugins (e.g. the specific commit in source control).

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf plugin](../) - Work with check plugins
