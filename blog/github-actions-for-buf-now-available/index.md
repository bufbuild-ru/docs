---
sidebar: false
prev: false
next: false

title: "GitHub Actions for Buf now available"
description: "Buf's officially supported GitHub Actions make it easier than ever to instrument your CI/CD Protocol Buffers workflows with `buf`."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/github-actions-for-buf-now-available"
  - - meta
    - property: "og:title"
      content: "GitHub Actions for Buf now available"
  - - meta
    - property: "og:description"
      content: "Buf's officially supported GitHub Actions make it easier than ever to instrument your CI/CD Protocol Buffers workflows with `buf`."
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "GitHub Actions for Buf now available"
  - - meta
    - property: "twitter:description"
      content: "Buf's officially supported GitHub Actions make it easier than ever to instrument your CI/CD Protocol Buffers workflows with `buf`."
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# GitHub Actions for Buf now available

_Note. This post was originally published in April 2021 and has been updated for accuracy based on recent improvements._

Buf officially supports a collection of [GitHub Actions](https://github.com/features/actions) to instrument your CI/CD Protocol Buffers workflows with the `buf` CLI. This guide will walk you through the steps required to create a GitHub workflow that runs [buf-setup](https://github.com/marketplace/actions/buf-setup), [buf-lint](https://github.com/marketplace/actions/buf-lint), [buf-breaking](https://github.com/marketplace/actions/buf-breaking), and [buf-push](https://github.com/marketplace/actions/buf-push).

## TL;DR

- The [buf-setup](https://github.com/marketplace/actions/buf-setup) action installs `buf` for use in other custom actions that require the `buf` CLI.
- The [buf-lint](https://github.com/marketplace/actions/buf-lint) and [buf-breaking](https://github.com/marketplace/actions/buf-breaking) actions ensure that your Protocol Buffers API changes always conform to your [`lint`](/docs/lint/index.md#configuration) and [`breaking`](/docs/breaking/index.md#configuration) configurations. Lint failures and breaking changes are written as **annotations** to GitHub Action runs and **in-line comments** on PRs.
- The [buf-push](https://github.com/marketplace/actions/buf-push) action automatically keeps your GitHub repository in-sync with the [Buf Scheme Registry (BSR)](/docs/bsr/index.md).
- Write your workflow configuration once and consistently across projects, and leave the rest to `buf`.

## Quick Start

Here's a full example to get you started with **lint** and **breaking changes** on pull requests.

The only prerequisite is the commands `buf lint` and `buf breaking` are executable from the root of the directory that contains your Protocol Buffers definitions. In most cases you'll want to define a [`buf.yaml`](/docs/configuration/v1/buf-yaml/index.md) configuration file to tailor `buf` to your project.

Create a `.github/workflows/buf-pull-request.yaml` file:

```yaml
name: buf-pull-request
on: pull_request
jobs:
  validate-proto:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      # Install and setup buf (default latest version)
      - uses: bufbuild/buf-setup-action@v0.3.1
      # Lint
      - uses: bufbuild/buf-lint-action@v0.3.0
      # Breaking change detection
      - uses: bufbuild/buf-breaking-action@v0.4.0
        with:
          # The 'main' branch of the GitHub repository that defines the module
          against: "https://github.com/${GITHUB_REPOSITORY}.git#branch=main"
```

Let's break it down:

1.  `buf-setup-action` installs the `buf` CLI, making it available for all subsequent steps within the job.
2.  `buf-lint-action` verifies your Protocol Buffers files conform to lint rules.
3.  `buf-breaking-action` checks for backwards-incompatible changes.

As mentioned, a [`buf.yaml`](/docs/configuration/v1/buf-yaml/index.md) configuration file can be added to customize `buf` for your project. Below is an example to get your started:

```yaml
version: v1
lint:
  use:
    - DEFAULT
breaking:
  use:
    - FILE
```

### Lint

For more in-depth information on lint and specific lint rules, refer to the [Lint documentation](/docs/lint/rules/index.md). Here we'll showcase a lint violation with [buf-lint](https://github.com/marketplace/actions/buf-lint), extending the quick start example above.

Suppose we have this `.proto` file that defines a `Version` message:

```protobuf
syntax = "proto3";

package bufbuild.semver.v1;

message Version {
  uint64 major = 1;
  uint64 minor = 2;
  uint64 micro = 3;
  string label = 4;
}
```

A developer mistakenly updates the `major` field to `Major`, such that it violates the `lint` configuration. To be more specific, this change doesn't conform to the `FIELD_LOWER_SNAKE_CASE` rule.

```protobuf
message Version {
- uint64 major = 1;
+ uint64 Major = 1;
  uint64 minor = 2;
  uint64 micro = 3;
  string label = 4;
}
```

The `buf-lint` action will detect this change and fail the step. Furthermore, it'll add annotations to the GitHub Action run and comment in-line on the PR. Enabling developers to quickly fix their mistakes and keep iterating.

![image](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/673fd089be6719b959bd0cf8_lint_v2-7KDB25AL.png)

### Breaking changes

For more in-depth information on breaking changes, refer to the [Breaking documentation](/docs/breaking/rules/index.md). Here we'll showcase a breaking change with [buf-breaking](https://github.com/marketplace/actions/buf-breaking), extending the quick-start and lint examples above.

In this example we're running breaking change detection _against_ the HEAD of our `main` branch. The developer fixed up the lint error from the example above, but has decided to change the type of the `label` field.

```protobuf
message Version {
  uint64 major = 1;
  uint64 minor = 2;
  uint64 micro = 3;
- string label = 4;
+ int64 label = 4;
}
```

The `buf-breaking` action will detect this change and fail the step. Similar to lint, the action will add annotations to the GitHub Action run and comment in-line on the PR.

![image](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/673fd089630d85a4a0d5daba_breaking_v2-KCG2OI2A.png)

### Push to BSR

The [**Buf Schema Registry (BSR)**](/docs/bsr/index.md) is a platform that serves as a source of truth for your Protocol Buffers files.

Once you've setup lint rules and breaking change detection a natural next step is to synchronize your Protocol Buffers files with the BSR. Building on the example above, you can adapt this workflow so that commits merged into the `main` branch will automatically push Protocol Buffers file updates to the BSR.

This might be a good time to read about [Modules](/docs/cli/modules-workspaces/index.md). A collection of Protocol Buffers files that are configured, built, and versioned as a logical unit.

To write to the BSR you'll need an API token. For details on creating a token [click here](/docs/bsr/authentication/index.md#create-an-api-token). Once you've created a token you'll want to store it as an encrypted [GitHub Secret](https://docs.github.com/en/actions/reference/encrypted-secrets). In this example we'll refer to this token as `BUF_TOKEN`.

Note, in the examples above the GitHub workflow was configured to run on every `pull_request` event. We do **not**, however, want to push to the BSR on every pull request commit. Let's create a separate workflow file `.github/workflows/push.yaml` that performs a similar workflow, but triggered on pushes to the `main` branch.

```yaml
name: buf-push
on:
  push:
    branches:
      - main
jobs:
  push-proto:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: bufbuild/buf-setup-action@v0.3.1
      - uses: bufbuild/buf-lint-action@v0.3.0
      - uses: bufbuild/buf-breaking-action@v0.4.0
        with:
          against: "https://github.com/${GITHUB_REPOSITORY}.git#ref=HEAD~1"
      - uses: bufbuild/buf-push-action@v0.3.0
        with:
          buf_token: ${{ secrets.BUF_TOKEN }}
```

This workflow is running lint and breaking change detection against the prior commit on the current branch, this is why we added `#ref=HEAD~1`. Once those steps have succeeded the `buf-push-action` will push the module (Protocol Buffers files) to the BSR. The module on the BSR is tagged with the **git commit SHA** so there is a direct link between your GitHub repository and the BSR.

Note, `ref=HEAD~1` does not work well for [rebase and merge](https://docs.github.com/en/github/administering-a-repository/configuring-pull-request-merges/about-merge-methods-on-github#rebasing-and-merging-your-commits) operations, since `buf` is comparing against the last commit there might be older commits with breaking changes. If you're using **Merge pull request** (GitHub default) or **Squash and merge** options then `#ref=HEAD~1` will work.

### Inputs

Projects adopting `buf` will have different layouts and configurations. All of our GitHub Actions are meant to be configurable depending on your needs.

If your directory structure doesn't match the examples above you may need to explicitly set an `input` field and a subdirectory via `subdir` in your GitHub actions, for more information see the [Inputs documentation](/docs/bsr/ci-cd/github-actions/index.md#inputs).

## Wrapping up

Now that you have all of the Buf GitHub Actions configured in your CI/CD pipeline, you'll never have to worry about manual Protocol Buffers maintenance again. If you have any questions or feedback, please reach out in our [public Slack channel](https://buf.build/b/slack)!

‍
