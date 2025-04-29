---

title: "Buf CLI commands - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/"
  - - meta
    - property: "og:title"
      content: "Buf CLI commands - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/"
  - - meta
    - property: "twitter:title"
      content: "Buf CLI commands - Buf Docs"

---

# buf

The Buf CLI

### Usage

```console
$ buf [flags]
```

### Description

A tool for working with Protocol Buffers and managing resources on the Buf Schema Registry (BSR)

### Flags

#### \--debug

Turn on debug logging

#### \-h, --help

help for buf

#### \--help-tree

Print the entire sub-command tree

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

#### \--version

Print the version

### Subcommands

- [buf breaking](breaking/) - Verify no breaking changes have been made
- [buf build](build/) - Build Protobuf files into a Buf image
- [buf config](config/) - Work with configuration files
- [buf convert](convert/) - Convert a message between binary, text, or JSON
- [buf curl](curl/) - Invoke an RPC endpoint, a la 'cURL'
- [buf dep](dep/) - Work with dependencies
- [buf export](export/) - Export proto files from one location to another
- [buf format](format/) - Format Protobuf files
- [buf generate](generate/) - Generate code with protoc plugins
- [buf lint](lint/) - Run linting on Protobuf files
- [buf plugin](plugin/) - Work with check plugins
- [buf push](push/) - Push to a registry
- [buf registry](registry/) - Manage assets on the Buf Schema Registry
- [buf beta](beta/) - Beta commands. Unstable and likely to change
