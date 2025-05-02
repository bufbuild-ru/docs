---
sidebar: false
prev: false
next: false

title: "Introducing the Buf Language Server"
description: "Jump to definition with 'bufls'."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/introducing-the-buf-language-server"
  - - meta
    - property: "og:title"
      content: "Introducing the Buf Language Server"
  - - meta
    - property: "og:description"
      content: "Jump to definition with 'bufls'."
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Introducing the Buf Language Server"
  - - meta
    - property: "twitter:description"
      content: "Jump to definition with 'bufls'."
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Introducing the Buf Language Server

At Buf, we sometimes experiment to figure out how we can best help move the Protobuf community forward. Sometimes these experiments don't really go anywhere, but other times they turn into real products. Traditionally, we've kept these experiments internal until they're production-ready, but we'd like to start sharing more of these experiments with the community, even if they don't end up going anywhere. Today we're excited to publicize one of these experiments - the beginnings of a Protobuf language server that speaks the standard Language Server Protocol ([LSP](https://microsoft.github.io/language-server-protocol)) available at [github.com/bufbuild/buf-language-server](https://github.com/bufbuild/buf-language-server).

The `bufls` language server is a _proof of concept_ - we don't actively maintain this, and there are no guarantees in terms of stability, but we want to hear your feedback! Please give `bufls` a try, message us on [Slack](https://buf.build/b/slack), and let us know what you think!

## LSP

The LSP was designed to standardize IDE functionality behind a common protocol. Put simply, implementing a language server enables seamless integration between _many_ IDEs all at once. There are [a variety of server implementations](https://microsoft.github.io/language-server-protocol/implementors/servers) available today for a number of programming languages, including JavaScript, TypeScript, Go, and Rust. There are also a [number of tools](https://microsoft.github.io/language-server-protocol/implementors/tools) that support the LSP as clients, including Vim, VSCode, and Sublime.

## Usage

You can install the `bufls` command (short for _Buf Language Server_) with the following command:

```bash
$ go install github.com/bufbuild/buf-language-server/cmd/bufls@latest
```

Now, all you need to do is wire up the language server with your LSP-compatible tool, such as Vim. If you use [vim-lsp](https://github.com/prabirshrestha/vim-lsp), you only need to configure the following:

```vim
Plug 'prabirshrestha/vim-lsp'

augroup LspBuf
  au!
  autocmd User lsp_setup call lsp#register_server({
      \ 'name': 'bufls',
      \ 'cmd': {server_info->['bufls', 'serve']},
      \ 'whitelist': ['proto'],
      \ })
  autocmd FileType proto nmap <buffer> gd <plug>(lsp-definition)
augroup END
```

## Go to definition

The `bufls` server only supports the `textDocument/definition` endpoint for now (hence the `lsp-definition` configuration shown above). This means that you can jump to the definition of the Protobuf descriptor that your cursor is hovering over.

For example, consider the following `object.proto` file, where the surrounding `[ ]` represents the current cursor position:

```protobuf
syntax = "proto3";

package acme.object.v1;

message Object {
  string id = 1;
}

message GetObjectRequest {
  string id = 1;
}

message GetObjectResponse {
  [O]bject object = 1;
}

service ObjectService {
  rpc GetObject(GetObjectRequest) returns (GetObjectResponse);
}
```

If you issue the `textDocument/definition` command from your editor, the cursor will jump to the definition of the `acme.object.v1.Object` descriptor and your editor will be updated like so:

```protobuf
syntax = "proto3";

package acme.object.v1;

message [O]bject {
  string id = 1;
}

message GetObjectRequest {
  string id = 1;
}

message GetObjectResponse {
  Object object = 1;
}

service ObjectService {
  rpc GetObject(GetObjectRequest) returns (GetObjectResponse);
}
```

Where things get really interesting is when your cursor is on an identifier that is defined in another file, package, or module. In fact, the `textDocument/definition` endpoint adopts the same semantics as the [`buf`](https://github.com/bufbuild/buf) CLI so that references are resolved to the descriptors defined in your [workspace](/docs/reference/workspaces/index.md) (defined by a [`buf.work.yaml`](/docs/configuration/v1/buf-work-yaml/index.md)), or the [module cache](/docs/cli/modules-workspaces/index.md#module-cache) for dependencies included in your [`buf.lock`](/docs/configuration/v1/buf-lock/index.md) manifest.

A tool like this is tremendously helpful for understanding exactly where a descriptor is defined - it's not always clear where descriptors are resolved from `import` statements alone, especially if multiple files from the same package are imported like so:

```protobuf
syntax = "proto3";

package acme.object.v1;

import "acme/pkg/v1/caller.proto";
import "acme/pkg/v1/types.proto";

message Object {
  string id = 1;
}

message GetObjectRequest {
  string id = 1;
  acme.pkg.v1.Context context = 2;
}

message GetObjectResponse {
  Object object = 1;
  acme.pkg.v1.Metadata metadata = 2;
}

service ObjectService {
  rpc GetObject(GetObjectRequest) returns (GetObjectResponse);
}
```

From this view, it's impossible to know where the `acme.pkg.v1.{Context,Metadata}` descriptors are defined without looking into the `caller.proto` or `types.proto` files yourself. But with `bufls`, you can find out exactly where the type is defined _instantly_ (just like you're used to with your programming language of choice).

## Talk to us

Our goal here is to get your feedback. Reach out to us on [Slack](https://buf.build/b/slack) - we'd love to hear from you!

‍
