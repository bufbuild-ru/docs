---
sidebar: false
prev: false
next: false

title: "Introducing the newly improved BSR UI and buf push experience"
description: "We've made it easier to onboard and use the BSR with improved support for monorepos, tighter integration with source control providers, and a new BSR UI that is more polished and has improved accessibility."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/enhanced-buf-push-bsr-ui"
  - - meta
    - property: "og:title"
      content: "Introducing the newly improved BSR UI and buf push experience"
  - - meta
    - property: "og:description"
      content: "We've made it easier to onboard and use the BSR with improved support for monorepos, tighter integration with source control providers, and a new BSR UI that is more polished and has improved accessibility."
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674fc504386e9849d661dfc8_New%20BSR%20UI.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Introducing the newly improved BSR UI and buf push experience"
  - - meta
    - property: "twitter:description"
      content: "We've made it easier to onboard and use the BSR with improved support for monorepos, tighter integration with source control providers, and a new BSR UI that is more polished and has improved accessibility."
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674fc504386e9849d661dfc8_New%20BSR%20UI.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Introducing the newly improved BSR UI and buf push experience

Alongside the [next generation of the Buf CLI](/blog/buf-cli-next-generation/index.md), we’re excited to introduce an enhanced `buf push` and unveil an updated Buf Schema Registry (BSR) UI. We’ve made significant changes to both `push` and the UI to eliminate friction when onboarding new teams and codebases to the BSR:

- **Tighter integration with source control:** We’ve updated `buf push` to make it much easier to mirror the state of protos in source control to the BSR, as well as map BSR commits back to source control commits.
- **New labels primitive:** Branches, tags, and drafts are now replaced with a single simple primitive called labels. A label is a mutable pointer to a BSR commit that tracks the history of commits it has pointed to.
- **Support for monorepos:** We’ve updated `buf push` to support pushing workspaces.
- **New BSR UI and API:** We’ve revamped the BSR UI and API to simplify workflows and improve accessibility and navigation.

Read on to learn more about what’s changed.

## Tighter integration with source control

To give you more insight into how modules in the BSR map to content in your source control provider, we’ve added new functionality to `buf push` and the BSR, including a new concept -- labels, to help you track changes to your modules and upstream repositories.

### What are labels?

A [label](/docs/bsr/commits-labels/index.md#labels) is a mutable pointer to a commit that tracks the history of commits it has pointed to. It combines the functionality of what used to be branches, tags, and drafts into a single, simple concept. Labels give you the ability to mirror how you organize code in your source control provider, as well as track state that might not be represented in source control at all. For example, you could have a label that tracks the state of your APIs that have been deployed (not just committed to source control). Because labels are tracked in the BSR alongside commits, you can use labels to compare changes within your module, and soon, you’ll be able to protect labels and enforce breaking change policies on them — giving you even more granular control over what is available to API consumers.

### Pushing with source control metadata

On `push`, you can now supply flags that read the target module's source control information and apply labels to the BSR commits:

- `--source-control-url`: This flag sets the source control URL for the commit, so that when you are browsing commits in the BSR, you can easily navigate to the relevant context in your source control (why was this change made, who reviewed it, etc.).
- `--create-default-label`: This flag creates a default label for the target module. If no value is specified, the BSR will default to `main`.
- `--label`: This flag associates the current commit with one or more labels. It replaces `--draft`, `--tag`, and `--branch`.

If you’re using git, we’ve added a new flag `--git-metadata`, which conveniently sets all of the above parameters automatically based on information from your git checkout. If you attempt to set this flag and have untracked changes or uncommitted code then `buf push` will error, protecting you from unexpected breaking changes.

Check out the documentation to learn more about [using labels](/docs/bsr/commits-labels/index.md) and [pushing with metadata](/docs/reference/cli/buf/push/index.md).

## Support for monorepos

Because `buf push` now wholly supports [workspaces](/docs/cli/modules-workspaces/index.md#referencing-a-module), it’s easier than ever to sync the state of a monorepo to the BSR. You can now push a collection of modules as a workspace, and when you do, Buf will create a new commit in the BSR in dependency order for each module in the workspace automatically.

For a deep-dive into workspace push, read our [companion blog post](/blog/buf-cli-next-generation/index.md).

## New BSR UI and API

We've shipped a new BSR UI designed to help you navigate your BSR organization, explore code, and review changes more effectively. These changes include structural changes to the information hierarchy to bring consistency to the different parts of the app, and visual updates to the look and feel with new colors, components, and typefaces. We're also proud to share that our new UI also meets [a11y](https://www.a11yproject.com/) accessibility standards.

### Commits tab

To that end, we’ve introduced a top-level [commits tab](/docs/bsr/module/publish/index.md#module-and-repository-setup) that displays all commits for the current label, including their review status, source control URL, and whether or not they contain content changes. From there, you can drill down into an individual commit to view its diff against `latest` and see any labels associated with it. We’ve also made it easy to navigate from the commits view to the diff view, where you can compare commits and labels to review how your codebase has evolved over time.

![Updated BSR Commits tab](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674685e868b4ce1068b28c44_new-commits-tab-HSFLKUKL.png)

### Labels view

In addition to the commits tab, we’ve also added a [labels view](/docs/bsr/module/publish/index.md#archiving-and-unarchiving-labels). The labels view displays all labels and allows owners to archive or unarchive labels to keep the module history clean and up to date.

![BSR labels view](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674685e86695c1d063506445_labels-view-J5PBPIRJ.png)

### Dependencies tab

We've also updated the module dependency tab to list dependencies rather than display a dot graph. Dependencies in this list are clickable, allowing you to navigate to and explore their codebases.

![BSR dependency tab view](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674685e86e6b5ae9f0aa2a51_deps-view-WXOTLBA7.png)

### BSR API

The updated UI is a frontend for the BSR’s new public API. We’re not quite ready to officially launch the public API, but here’s some of what you can expect:

- Uploading and downloading module content
- Module dependency graphs
- Commit policy check status
- Archiving labels

Check out the [new BSR UI](https://buf.build/explore), and [watch the docs](/docs/bsr/apis/api-access/index.md) to see what’s new in the API.

## What’s next?

We’re excited for you to start using the new capabilities in `buf push` and the BSR, but that’s just the tip of the iceberg. Throughout the rest of the year, we plan to ship enhancements and new features that help you adopt the BSR as a source of truth and governance layer for your downstream APIs. Some of the expected changes include, but are not limited to:

- A public v1 API to automate the way that you work with the BSR
- Re-designed GitHub Actions that make it easier for you to adopt Buf with recommended default behaviors and customizations
- Breaking change enforcement on a per-label basis to give your team more granular control over policy enforcement
- Server-side policy checks for linting
- Customizable lint and breaking change plugins that enable more customizable policy checks

We’d love to hear from you about the new BSR UI, `buf push`, and the upcoming roadmap — If you have any bug reports, enhancement ideas, or feature requests, reach out at [feedback@buf.build](mailto:feedback@buf.build).

‍
