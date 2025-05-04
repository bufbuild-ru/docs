---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/cli/editor-integration/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/cli/quickstart/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/cli/modules-workspaces/"
  - - meta
    - property: "og:title"
      content: "Editor integration - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/cli/editor-integration.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/cli/editor-integration/"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "og:image:type"
      content: "image/png"
  - - meta
    - property: "og:image:width"
      content: "1200"
  - - meta
    - property: "og:image:height"
      content: "630"
  - - meta
    - property: "twitter:title"
      content: "Editor integration - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/cli/editor-integration.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Editor integration

The Buf CLI produces structured machine readable error output for [build](../../build/overview/), [lint](../../lint/overview/), and [breaking change](../../breaking/overview/) errors which integrate with IDEs, scripts, and other tools.We currently provide integration with Vim, Visual Studio Code, and JetBrains IDEs, and we may support other editors in the future. [Contact us](../../contact/) if you're interested in any of these, or others not already listed here.

## Vim

Vim integration for linting is available using the [ALE](https://github.com/dense-analysis/ale) lint engine via the [vim-buf](https://github.com/bufbuild/vim-buf) plugin.To use Vim integration `buf` must be [installed](../installation/). Using [vim-plug](https://github.com/junegunn/vim-plug), add this to your `.vimrc`:

```vim
Plug 'dense-analysis/ale'
Plug 'bufbuild/vim-buf'
let g:ale_linters = {
\   'proto': ['buf-lint',],
\}
let g:ale_lint_on_text_changed = 'never'
let g:ale_linters_explicit = 1
```

The extension runs `buf lint --path` on save and reveals errors on a per-file basis. To detect package-level problems, be sure to run a workspace-wide `buf lint` as part of your [CI](../../bsr/ci-cd/setup/) process.

## Visual Studio Code

The Visual Studio Code extension can be downloaded from the in-editor extension browser under the name "Buf" or manually via the [extension page](https://marketplace.visualstudio.com/items?itemName=bufbuild.vscode-buf). You need to have `buf` [installed](../installation/) to use it.Our Buf extension currently supports [linting](../../lint/overview/) your `.proto` files. It runs `buf lint --path` on save and reveals errors on a per-file basis. To detect package-level problems, be sure to run a workspace-wide `buf lint` as part of your CI process.The Buf CLI is executed in the root of your workspace, which means it's configured by the [`buf.yaml`](../../configuration/v2/buf-yaml/) there.

::: tip Note
The `vscode-buf` extension doesn't work in conjunction with the `vscode-proto` extension. More generally, if you run into issues you may need to disable other extensions that register the `.proto` file suffix.
:::

## JetBrains IDEs

The plugin for all IntelliJ-based IDEs is available on the [JetBrains Plugin Marketplace](https://plugins.jetbrains.com/plugin/19147-buf-for-protocol-buffers).You can install it from the settings window of your IDE. The plugin supports [linting and formatting](../../lint/overview/) for your `.proto` files, as well as navigation, syntax highlighting, and more.

## EditorConfig suggestions

If you use [EditorConfig](https://editorconfig.org) files to enforce consistent styles in your code, we recommend these settings for your `.proto` files:

```ini
[*.proto]
indent_size = 2
indent_style = space
insert_final_newline = true
```

These settings aren't semantically meaningful in Protobuf but are commonly used throughout the ecosystem.

## Formatting options

The Buf CLI supports these formatting options (passed using the `--error-format` flag) to support other integrations:

+++tabs key:6a9930b1101c9528aa63ecf42a990d91

== text

```text
path/to/file.proto:1:10:syntax value must be "proto2" or "proto3"
```

== msvs

```text
path/to/file.proto(1,10) : error COMPILE : syntax value must be "proto2" or "proto3"`
```

== json

```text
{"path":"path/to/file.proto","start_line":1,"start_column":10,"end_line":1,"end_column":10,"type":"COMPILE","message":"syntax value must be \"proto2\" or \"proto3\""}
```

+++
