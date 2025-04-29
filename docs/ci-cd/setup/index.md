---

title: "General setup - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/ci-cd/setup/"
  - - meta
    - property: "og:title"
      content: "General setup - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/ci-cd/setup/"
  - - meta
    - property: "twitter:title"
      content: "General setup - Buf Docs"

---

# General CI/CD setup

::: tip Using GitHub Actions?If you're using [GitHub Actions](https://github.com/features/actions), you can skip this guide and refer to the [GitHub Action guide](../github-actions/) instead.

:::

[Continuous Integration/Continuous Deployment (CI/CD)](https://en.wikipedia.org/wiki/CI/CD) is a software development practice that automates building, testing, and deploying software. If you are working with Protobuf, then the Buf CLI should be part of all three of these development stages.This guide illustrates how to integrate the Buf CLI into general CI/CD solutions, such as [CircleCI](https://circleci.com) and [TravisCI](https://travis-ci.org).

::: tip NoteWe don't have an SDK for the Buf CLI. If you want to use the Buf CLI as part of some automation, you should shell out to it.

:::

## Installation

The first step is to get the Buf CLI running on your CI/CD worker. To do so, you'll need an install script. It can be downloaded from a release or built from source.

+++tabs key:ac042d3c949c2e69ff4f27c2a0f5e648

== Download from a release

::: info install.sh

```bash
#!/bin/bash

PROJECT=<your-project-name>
# Use your desired buf version
BUF_VERSION=1.53.0
# buf is installed to ~/bin/your-project-name.
BIN_DIR=$HOME/bin/$PROJECT

curl -sSL \
    "https://github.com/bufbuild/buf/releases/download/v$BUF_VERSION/buf-$(uname -s)-$(uname -m)" \
    -o "$BIN_DIR/buf"
chmod +x "$BIN_DIR/buf"
```

:::

This script sends a request to the the Buf CLI GitHub Releases using [`curl`](https://curl.se/docs) for the given `BUF_VERSION` and operating system. The binary is then given executable permission.

== Build from source

If you intend to install the Buf CLI from source, this assumes that you have the Go toolchain available in your CI/CD.If not, see the [Go Documentation](https://golang.org/) for more details.

::: info install.sh

```bash
#!/bin/bash

BUF_TMP=$(mktemp -d)
cd $BUF_TMP; go get github.com/bufbuild/buf/cmd/buf@v$BUF_VERSION
rm -rf $BUF_TMP
```

:::

+++

## Running lint and breaking change detection

To run lint checks with your job, simply add `buf lint` to it and you're good to go.If your [`buf.yaml`](../../configuration/v2/buf-yaml/) is defined at the root of your repository, you can run the linter with this command:

```console
$ buf lint
```

If, on the other hand, your `buf.yaml` is defined in a nested directory, such as the `proto` directory, the command looks like this:

```console
$ buf lint proto
```

For `buf breaking`, the process is similar, but be sure to set the full `https` or `ssh` remote as the target. If your `buf.yaml` is defined at the root of your repository, the command looks like this:

```console
$ buf breaking --against "https://github.com/<your-org>/<your-repo>.git#branch=main"
```

Also valid:

```console
$ buf breaking --against "ssh://git@github.com/<your-org>/<your-repo>.git#branch=main"
```

Again, if your `buf.yaml` is defined in a nested directory, such as the `proto` directory, the command looks like this (notice the `subdir` parameter):

```console
$ buf breaking proto --against "https://github.com/<your-org>/<your-repo>.git#branch=main,subdir=proto"
```

Also valid:

```console
$ buf breaking proto --against "ssh://git@github.com/<your-org>/<your-repo>.git#branch=main,subdir=proto"
```

If you are on [TravisCI](https://travis-ci.org) or [CircleCI](https://circleci.com) they don't clone any branches outside of the one being tested, so this enables the Buf CLI to clone using the remote and run the [breaking change detector](../../breaking/overview/).

## Handling concurrent non-breaking changes

When multiple developers work on separate branches and each introduces non-breaking changes to a stable Protobuf package, merging these branches sequentially can sometimes lead to false positives in breaking change detection. This occurs because the `buf breaking` command compares the current directory, which may not include the other developers' changes, against the `main` branch.**Scenario:**

1.  Developer A creates the `feature1` branch from `main` and adds a new message.
2.  Developer B creates the `feature2` branch from `main` and adds a different new message.
3.  Developer A merges `feature1` into `main`.
4.  Developer B, before merging `feature2`, runs `buf breaking --against "https://github.com/<your-org>/<your-repo>.git#branch=main"`.

In step 4, `buf breaking` may incorrectly report a breaking change because it doesn't account for the new message added in `feature1` that's now in `main`.**Recommendation:**To avoid false positives during breaking change detection, developers should follow one of these approaches:

- Merge the latest changes from `main` into the feature branch before running `buf breaking`:

  ```console
  $ git fetch origin
  $ git merge origin/main
  $ buf breaking --against "https://github.com/<your-org>/<your-repo>.git#branch=main"
  ```

  This approach ensures that the `buf breaking` command considers all changes in `main` before running the check. CI/CD pipelines typically use this approach.

- Temporarily merge the latest changes from `main` into the feature branch, then abort the merge:

  ```console
  $ git fetch origin
  $ git merge --no-commit --no-ff origin/main
  $ buf breaking --against "https://github.com/<your-org>/<your-repo>.git#branch=main"
  $ git merge --abort
  ```

  This approach ensures that the `buf breaking` command considers all changes in `main` without altering the feature branch.

## CI authentication (Optional)

If you wish to authenticate a CI/CD job to access the [BSR](../../bsr/) (for example to push a module, create labels, etc.), we recommend you store your `BUF_TOKEN` in your CI/CD provider's secret environment variable storage.For example:

- [TravisCI](https://docs.travis-ci.com/user/environment-variables#defining-encrypted-variables-in-travisyml)
- [CircleCI](https://circleci.com/docs/2.0/env-vars/)
- [GitHub Actions](https://docs.github.com/en/actions/reference/encrypted-secrets)

You can then access the token in your job using an environment variable, which enables you to create a `.netrc` file for your job during setup. Here's an example assuming you've stored your token as `BUF_API_TOKEN` and your username as `BUF_USER`:

```console
$ echo ${BUF_API_TOKEN} | buf registry login --username ${BUF_USER} --token-stdin
```

For more details on authenticating to the `BSR`, see [Authentication](../../bsr/authentication/).

## CI caching

To enable caching of modules downloaded by the Buf CLI, you can either configure caching of the `~/.cache` directory, or set the `BUF_CACHE_DIR` environment variable to a directory of your choice and cache that directory.For more information about module caching, see the [module cache docs](../../cli/modules-workspaces/#module-cache).
