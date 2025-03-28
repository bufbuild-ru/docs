# GitHub App

This feature is only available on the Pro and Enterprise plans.

Though our open source [GitHub Actions](../github-actions/) provide a robust experience for smaller teams, it can become laborious to repeatedly configure these actions if your organization has many repositories.The Buf GitHub App offers an easy way to seamlessly synchronize source control and your private instance of the Buf Schema Registry (BSR). Once enabled, the app discovers repositories that have `buf.yaml` files inside and reacts to pull requests against those modules with a variety of checks:

- **Breaking:** The breaking check performs [breaking changes](../../breaking/overview/) detection between the current branch and the latest BSR commit to `main`. Breaking changes are displayed as file annotations on the pull request.
- **Format:** The [format](../../format/style/) check displays formatting violations as file annotations on the pull request, and recommends running `buf format -w` to resolve them.
- **Lint:** The lint check performs [linting](../../lint/overview/) of `proto` files and displays lint violations as file annotations on the pull request.
- **Push:** The push check pushes `buf push` a [branch commit](../../bsr/module/publish/#pushing-with-labels) to the BSR and adds a comment to the pull request informing readers about how to consume generated code.

The app also performs a push to the BSR `main` branch when pull requests are merged in GitHub, tagging the commit with the Git SHA.

## Authorizing the app

The app uses the BSR credentials of the developer who has created the pull request. It requires them to sign into the BSR, which they're prompted to do via a comment:

> Hey @example-dev! You're not connected to the Buf Schema Registry (BSR). Please click here to connect.

## Configuration file

The GitHub App configures the behaviour of both the `lint` and `breaking` checks from the `buf.yaml` in each module. Each check can be customized further by providing a `.github/buf.github.yaml` file in the repository.The `buf.github.yaml` config file below demonstrates all default values being explicitly set. This file is the equivalent of no `buf.github.yaml` being present in your repository.

::: info buf.github.yaml

```yaml
version: v1beta1
checks:
  format:
    ignore: []
    skip: false
  breaking:
    ignore: []
    skip: false
  lint:
    ignore: []
    skip: false
push:
  branches: []
```

:::

### `version`

**Required.** Defines the current configuration version. The only accepted value is `v1beta1`.

### `checks`

The `checks` key is a map of checks, and the accepted values are `format`, `lint` and `breaking`.

### `check` configuration

#### `ignore`

The `ignore` key is a list of file paths within the repository that this check should ignore. If a directory is ignored, then all files and subfolders of the directory are also ignored. The specified directory or file paths must be relative to the root of the repository.

#### `skip`

The `skip` key is a boolean flag, if `true` then this check is skipped entirely and won't run in this repository.

### `push` configuration

#### `branches`

The `branches` key is a list of branch names or GitHub branch selection patterns. For example, both `main` and `releases/*` are valid. If empty, the app defaults to the default branch.

## Setup

You can use the following URL to skip most of the configuration steps (only steps 7 and 10-13 are necessary).

::: tip NoteWe use `example-org` and `buf.example.com` as placeholder values, but they should be substituted with your GitHub organization and private BSR instance, respectively.

:::

```text
https://github.com/organizations/example-org/settings/apps/new?name=buf&url=https%3A%2F%2Fbuf.example.com&callback_url=https%3A%2F%2Fbuf.example.com%2Fapp%2Fgithub%2Fcallback&webhook_url=https%3A%2F%2Fbuf.example.com%2Fapp%2Fgithub%2Fwebhook&webhook_active=true&events[]=check_run&events[]=check_suite&events[]=deployment&events[]=deployment_status&events[]=pull_request&events[]=push&checks=write&statuses=write&deployments=write&pull_requests=write&issues=write&contents=read
```

1.  Navigate to `https://github.com/organizations/example-org/settings/apps/new`.
2.  Set the **GitHub App name**—we recommend `buf`
3.  Set the **Homepage URL** to your private BSR instance address, such as `https://buf.example.com`.
4.  Set the **Callback URL** to `https://buf.example.com/app/github/callback`.
5.  Under **Webhook**, check **Active**.
6.  Set the **Webhook URL** to `https://buf.example.com/app/github/webhook`.
7.  Set the **Webhook secret** to a random generated value, and store it for later use.
8.  Under **Repository Permissions**, configure the following:
    - Checks - `Read and write`
    - Commit statuses - `Read and write`
    - Contents - `Read-only`
    - Deployments - `Read and write`
    - Issues - `Read and write`
    - Metadata - `Read-only`
    - Pull requests - `Read and write`
9.  Subscribe to the following events:
    - Check run
    - Check Suite
    - Deployment
    - Deployment Status
    - Pull Request
    - Push
10. If your organization is hosted on https://github.com, then make sure **Where can this GitHub App be installed?** is set to **Only on this account.** For private instances, **Any Account** can be selected.
11. Click **Create GitHub App**.
12. Once the app is created, from the app’s setting page, click on **Generate a new client secret** and store it for later use.
13. Click on **Generate a private key** and store it for later use.

Share the **App ID**, **Client ID**, **Client Secret**, **Private Key** and **Webhook Secret** with your Buf representative.
