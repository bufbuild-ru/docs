---

title: "bufstream admin clean storage - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/reference/cli/admin/clean/storage/"
  - - meta
    - property: "og:title"
      content: "bufstream admin clean storage - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/reference/cli/admin/clean/storage/"
  - - meta
    - property: "twitter:title"
      content: "bufstream admin clean storage - Buf Docs"

---

# bufstream admin clean storage

Delete the underlying local storage for the bufstream cluster

### Usage

```console
$ bufstream admin clean storage [flags]
```

### Description

Note that this will result in all existing state being deleted!Local storage is only used if the storage provider is LOCAL_DISK or the embedded etcd server is used. This is common in local testing (when running 'bufstream serve' with no arguments). This command will not attempt to clean any data stored in other metadata storage or storage providers (S3, GCS).

### Flags

#### \--data-dir _string_

The location of the storage.The default for Darwin and Linux is $XDG_DATA_HOME/bufstream if $XDG_DATA_HOME is set, otherwise $HOME/.local/share/bufstream.If Bufstream supports Windows in the future, the default will be %!L(MISSING)ocalAppData%!(MISSING)bufstream.

#### \-h, --help

help for storage

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [bufstream admin clean](../) - Perform Bufstream cleaning tasks
