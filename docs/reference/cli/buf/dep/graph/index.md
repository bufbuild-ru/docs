# buf dep graph

Print the dependency graph

### Usage

```console
$ buf dep graph <input> [flags]
```

### Description

As an example, if module in directory "src/proto" depends on module "buf.build/foo/bar" from the BSR with commit "12345", and "buf.build/foo/bar:12345" depends on module "buf.build/foo/baz" from the BSR with commit "67890", the following will be printed:digraph {"src/proto" -> "buf.build/foo/bar:12345" "buf.build/foo/bar:12345" -> "buf.build/foo/baz:67890"}The actual output may vary between CLI versions and has no stability guarantees, however the output will always be in valid DOT format. If you'd like us to produce an alternative stable format (such as a Protobuf message that we serialize to JSON), let us know!See https://graphviz.org to explore Graphviz and the DOT language. Installation of graphviz will vary by platform, but is easy to install using homebrew:brew install graphvizYou can easily visualize a dependency graph using the dot tool:buf dep graph | dot -Tpng >| graph.png && open graph.png The first argument is the source or module to print the dependency graph for, which must be one of format \[dir,git,mod,protofile,tar,zip\]. This defaults to "." if no argument is specified.

### Flags

#### \--disable-symlinks

Do not follow symlinks when reading sources or configuration from the local filesystem By default, symlinks are followed in this CLI, but never followed on the Buf Schema Registry

#### \--error-format _string_

The format for build errors printed to stderr. Must be one of \[text,json,msvs,junit,github-actions\]

#### \--format _string_

The format to print graph as. Must be one of \[dot,json\]

#### \-h, --help

help for graph

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf dep](../) - Work with dependencies
