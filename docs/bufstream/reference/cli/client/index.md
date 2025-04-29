---

title: "Client - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/reference/cli/client/"
  - - meta
    - property: "og:title"
      content: "Client - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/reference/cli/client/"
  - - meta
    - property: "twitter:title"
      content: "Client - Buf Docs"

---

# bufstream client

client commands

### Usage

```console
$ bufstream client [flags]
```

### Description

Client commands to interact with a bufstream server.

### Flags

#### \--bootstrap-address _string_

Bootstrap address of the bufstream server

#### \--client-id _string_

ClientID value to send to the bufstream server

#### \-h, --help

help for client

#### \--help-tree

Print the entire sub-command tree

#### \--root-ca-path _strings_

A path to Root CA certificate to load

### Subcommands

- [bufstream client metadata](metadata/) - client metadata command

### Parent Command

- [bufstream](../) - The Bufstream process.
