---
sidebar: false
prev: false
next: false

title: "Speeding up development with BSR drafts"
description: "To enable engineers to begin iterating quickly using generated code without the need to merge Protobuf schemas to main, we support BSR drafts."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/speeding-up-with-drafts"
  - - meta
    - property: "og:title"
      content: "Speeding up development with BSR drafts"
  - - meta
    - property: "og:description"
      content: "To enable engineers to begin iterating quickly using generated code without the need to merge Protobuf schemas to main, we support BSR drafts."
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6750cea118efbc3de15663c8_Python%20SDKs.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Speeding up development with BSR drafts"
  - - meta
    - property: "twitter:description"
      content: "To enable engineers to begin iterating quickly using generated code without the need to merge Protobuf schemas to main, we support BSR drafts."
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6750cea118efbc3de15663c8_Python%20SDKs.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Speeding up development with BSR drafts

> Drafts have been superceded by branches. For more information please see the [module documentation](/docs/bsr/module/publish/index.md#pushing-with-labels).

The Buf Schema Registry ([BSR](/docs/bsr/index.md)) stores and manages Protobuf files as versioned modules so that individuals and organizations can publish and consume their APIs without friction. However, having only a `main` commit history in the BSR makes it difficult for engineers to push work-in-progress modules for testing or validation in the same way that they would push commits to a git feature branch. **To enable engineers to begin iterating quickly using generated code without the need to merge Protobuf schemas to `main`, we support BSR drafts.**

Drafts are not included in the `main` commit history, can be deleted or overwritten, and work seamlessly with:

- **GitHub branches:** Drafts can be automatically deployed to the BSR when a change is pushed to a GitHub branch/PR by configuring a GitHub action.
- **The `buf` CLI:** Drafts can be used locally with the `buf` CLI and commands like `buf build` and `buf generate`.
- **Generated SDKs:** Any draft can be used with generated SDKs, enabling in-progress changes to be integrated using tools like `npm` and `go get`.

![Diagram of main commit history and drafts](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6747cbd6f32b8fbebe1b50a5_drafts-diagram-MPAS3DK4.png)

# Creating drafts

Users can manually push drafts with a simple `buf` CLI command:

```bash
$ buf push --draft <DRAFT_NAME>
```

When the draft is pushed, it becomes available on the BSR, along with its documentation. A link at the top of the repository page will show the number of drafts that were pushed to that repository and provide the ability to navigate to them:

![Drafts on the BSR UI](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6747cbd65a8524bc3305cd4d_drafts-on-bsr-ui-C3IITABL.png)

Users can also integrate drafts by adding the [`buf-push-action`](https://github.com/bufbuild/buf-push-action) to their [GitHub workflows](https://docs.github.com/en/actions/using-workflows/about-workflows). With this integration, engineers can **automatically** deploy drafts with their Protobuf definitions to the BSR whenever they push to a GitHub branch or pull request!

To illustrate, consider this example:

```yaml
name: buf-push
on: push # Apply to all pushes
jobs:
  push-module:
    # Run `git checkout`
    - uses: actions/checkout@v3
    # Install the `buf` CLI
    - uses: bufbuild/buf-setup-action@v1
    # Push the module to the BSR
    - uses: bufbuild/buf-push-action@v1
      with:
        buf_token: ${{ secrets.BUF_TOKEN }}
        # Push as a draft when not pushing to `main`
        draft: ${{ github.ref_name != 'main' }}
```

The `draft` flag indicates whether the module should be pushed as a draft. In the above example, the module will be pushed to the BSR as a draft if the GitHub push did not occur on the `main` git branch. The name of the BSR draft will be the [short ref name](https://docs.github.com/en/actions/learn-github-actions/contexts#github-context) of the git branch or git tag that triggered the workflow run. For more details on `buf-push-action`, check out the [GitHub repository](https://github.com/bufbuild/buf-push-action) and the [Buf documentation](/docs/bsr/ci-cd/github-actions/index.md#buf-push).

# Using drafts with the Buf CLI

To consume a draft with the `buf` CLI, use the name of the draft as a module reference. For example, assuming a [`buf.gen.yaml`](/docs/configuration/v1/buf-gen-yaml/index.md) file exists in the current directory, code can be generated for a draft with the name `add-pet-type-fish` using:

```protobuf
buf generate buf.build/tommyma/petapis:add-pet-type-fish
```

The `:<DRAFT_NAME>` reference can also be used in other `buf` CLI commands including `buf build`, `buf breaking`, `buf export`, `buf curl`, or as a dependency in the [`buf.yaml`](/docs/configuration/v1/buf-yaml/index.md):

```yaml
version: v1
deps:
  - buf.build/tommyma/petapis:add-pet-type-fish
breaking:
  use:
    - FILE
lint:
  use:
    - DEFAULT
```

Please be aware that since drafts are able to be deleted and overwritten, they can only be used as dependencies locally. **A module that has a dependency on a draft cannot be pushed to the BSR.**

## Using drafts with [generated SDKs](/docs/bsr/generated-sdks/overview/index.md)

In addition to using drafts with the `buf` CLI, engineers can also consume them with [generated SDKs](/docs/bsr/generated-sdks/overview/index.md).

To reference a draft in generated SDKs, add a `@<DRAFT_NAME>` reference to the `go get` or `npm install` command. The package will be generated with the latest plugin version available when referencing the name of the draft for the remote package.

To get a remote package with **generated Go code** using [protocolbuffers/go](https://buf.build/protocolbuffers/go) for the draft shown above:

```bash
$ go get buf.build/gen/go/tommyma/petapis/protocolbuffers/go@add-pet-type-fish
```

To get a remote package that includes **generated TypeScript code** with [protobuf-es](https://buf.build/bufbuild/es):

```bash
$ npm install @buf/tommyma_petapis.bufbuild_es@add-pet-type-fish
```

# Get started with BSR drafts

Drafts are a powerful tool to boost developer productivity by making it easier to push work-in-progress Protobuf definitions to the BSR. This workflow unblocks engineers and enables them to begin iterating quickly using generated code without the need to merge Protobuf schemas to `main`. Check out [buf.build](https://buf.build/) to start developing with drafts now!

For any questions or concerns, check out [the BSR docs](/docs/bsr/index.md), and don't hesitate to reach out to us on [Slack](https://buf.build/b/slack) - we’d love to hear your feedback!
