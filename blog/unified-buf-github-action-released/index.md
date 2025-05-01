---
sidebar: false
prev: false
next: false

title: "Introducing the new Buf GitHub Action"
description: "Today, we’re launching the 1.0 release of our new unified GitHub Action, powered by the Buf CLI. This integration streamlines the processes of building, formatting, linting, and checking for breaking changes in your Protobuf schemas. It seamlessly integrates with GitHub's pull request workflow and automatically publishes Protobuf schema changes to the Buf Schema Registry when pull requests are merged."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/unified-buf-github-action-released"
  - - meta
    - property: "og:title"
      content: "Introducing the new Buf GitHub Action"
  - - meta
    - property: "og:description"
      content: "Today, we’re launching the 1.0 release of our new unified GitHub Action, powered by the Buf CLI. This integration streamlines the processes of building, formatting, linting, and checking for breaking changes in your Protobuf schemas. It seamlessly integrates with GitHub's pull request workflow and automatically publishes Protobuf schema changes to the Buf Schema Registry when pull requests are merged."
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674fa976adb419dff6e6d3ea_Github%20action.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Introducing the new Buf GitHub Action"
  - - meta
    - property: "twitter:description"
      content: "Today, we’re launching the 1.0 release of our new unified GitHub Action, powered by the Buf CLI. This integration streamlines the processes of building, formatting, linting, and checking for breaking changes in your Protobuf schemas. It seamlessly integrates with GitHub's pull request workflow and automatically publishes Protobuf schema changes to the Buf Schema Registry when pull requests are merged."
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674fa976adb419dff6e6d3ea_Github%20action.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Introducing the new Buf GitHub Action

Today, we’re launching the 1.0 release of our [new unified GitHub Action](https://github.com/marketplace/actions/buf-action), powered by the Buf CLI. This integration streamlines the processes of building, formatting, linting, and checking for breaking changes in your Protobuf schemas. It seamlessly integrates with GitHub's pull request workflow and automatically publishes Protobuf schema changes to the Buf Schema Registry when pull requests are merged.

## Key takeaways

- We've consolidated our individual GitHub actions into a unified action to simplify integrating your repositories with the Buf Schema Registry.
- Our new GitHub action synchronizes your GitHub branch and tag names with the BSR, keeping both repositories organized and in sync with your Protobuf schema changes.
- The 1.0 release of our new unified GitHub action is now available. We will soon deprecate our existing individual actions and recommend that everyone begin migrating from them. We will announce a formal deprecation timeline in the coming weeks.

## Getting started with `buf-action`

You can start using `buf-action` with your GitHub projects today! Check out the [usage example](https://github.com/bufbuild/buf-action?tab=readme-ov-file#usage) to get started quickly. The project’s README provides a [comprehensive list of parameters](https://github.com/bufbuild/buf-action?tab=readme-ov-file#configuration) you can use to customize the action's behavior. If you run into any issues or have an idea for a new feature, [please file an issue](https://github.com/bufbuild/buf-action/issues) or [join us in Slack](https://buf.build/links/slack).

## What’s new in 1.0

We've developed this unified GitHub Action to streamline our integration between Buf and GitHub. The `buf-action` is pre-configured to adhere to Buf's best practices, enabling your PRs to automatically build, check, and push your modules effortlessly. For more advanced requirements, you can readily customize almost every aspect of its functionality. This allows you to tailor the action to align with your specific workflow needs by skipping steps, adjusting triggers, and more.

### Sync your tags and branches with the BSR

Our new push integration now includes your GitHub repository's branch and tag name metadata. When the BSR receives a push, it automatically links your commit to a matching label defined in the BSR. If branches or tags are removed from GitHub, the BSR will automatically mark those labels as archived for you.

![buf action sync](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/67467033da70bcc23452a1d0_buf-action-branch-sync-EBP77THZ.png)

### Bypass checks using PR labels

The new `buf-action` makes skipping checks on pull requests easy when a specific GitHub label is added to the PR. With the default configuration, adding a `buf skip breaking` label to a pull request will skip the breaking change detection step. This eliminates the need to disable your CI pipeline when introducing breaking changes to your Protobuf schemas that you’re confident are safe to land.

![buf action skip breaking](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/67467033da70bcc23452a1c7_buf-action-skip-breaking-5XZ4YMJK.png)

You can also easily configure `buf-action` to allow skipping other tasks via PR label ([example](https://github.com/bufbuild/buf-action/blob/main/examples/skip-on-commits/buf-ci.yaml)), disallow skipping the breaking task or customizing the label names.

### Findings integrated inline

After all checks are performed for each commit, the results are shown inline within the PR’s code view. Each finding is associated with the exact line it originated from and includes a detailed description of the identified issue.

![buf action annotations](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/67467033a8d98b654a507747_buf-action-annotations-SYXSGJBO.png)

## What’s next?

If you're already using one of our existing GitHub actions ([buf-setup-action](https://github.com/marketplace/actions/buf-setup), [buf-breaking-action](https://github.com/marketplace/actions/buf-breaking), [buf-lint-action](https://github.com/marketplace/actions/buf-lint), [buf-push-action](https://github.com/marketplace/actions/buf-push)), we recommend [reading our buf-action migration guide](/docs/bsr/ci-cd/github-actions/index.md) to consolidate and simplify your configuration and workflow. You’ll likely see a nice speedup as well! We’ll soon mark these actions as deprecated and will provide more details on their support timeline in the coming weeks.

If you have any feedback or need any additional help with our GitHub integrations, please reach out to [feedback@buf.build](mailto:feedback@buf.build) or [join us in Slack](https://buf.build/links/slack).

‍
