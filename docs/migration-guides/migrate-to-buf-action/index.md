---

title: "Migrating from individual Buf GitHub Actions - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/migration-guides/migrate-to-buf-action/"
  - - meta
    - property: "og:title"
      content: "Migrating from individual Buf GitHub Actions - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/migration-guides/migrate-to-buf-action/"
  - - meta
    - property: "twitter:title"
      content: "Migrating from individual Buf GitHub Actions - Buf Docs"

---

# Migrating from individual Buf GitHub Actions

If you're currently using any of our individual GitHub Actions (\[buf-setup-action\]\[buf-setup\], \[buf-breaking-action\]\[buf-breaking\], \[buf-lint-action\]\[buf-lint\], or \[buf-push-action\]\[buf-push\]), we recommend migrating to the unified Action. We'll be deprecating the individual Actions soon and the unified Action significantly simplifies using the Buf CLI and BSR in your CI workflows.The unified Action is a superset of the individual actions that combines all of your Buf CI configuration into a single `buf-ci.yaml` file. It also includes some additional capabilities:

- Can limit each operation to specific types of pull requests
- Adds a summary comment to pull requests
- Can specify permissions for reading and writing to the Git repository
- Automatically archives BSR labels when their corresponding GitHub branches or tags are deleted
- Enables more complex workflows—change the order of steps, add checks to additional steps, and disable steps as needed

Some of the previous Actions' parameter names have changed. The table below maps the old values to the new ones:

| Old Action          | Old name                   | New name           | Notes    |
| :------------------ | :------------------------- | :----------------- | :------- |
| buf-setup-action    | `buf_api_token`            | `token`            |          |
|                     | `buf_user`                 | —                  | Not used |
|                     | `buf_domain`               | `domain`           |          |
| buf-breaking-action | `against`                  | `breaking_against` |          |
|                     | `buf_input_https_username` | `github_actor`     |          |
|                     | `buf_input_https_password` | `github_token`     |          |
|                     | `buf_token`                | `token`            |          |
| buf-lint-action     | `buf_token`                | `token`            |          |

The unified Action also introduces several new parameters. See the \[complete list of parameters\]\[parameters\] in its GitHub repository.

### Configuration comparison

The example below compares the configs for the previous Actions to the unified Actions, for the same set of tasks:

- Set up the Action: define tokens, set Buf CLI version
- Run breaking change and lint checks on the `proto` subdirectory for all pull requests
- Run breaking change and lint checks on the `proto` subdirectory, then push to the BSR
- The unified Action adds a `buf format` check to both sets of checks

#### Individual Actions

::: info .github/workflows/pull-request.yaml

```yaml
on:
  # Apply to all pull requests
  pull_request:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # Run `git checkout`
      - uses: actions/checkout@v4
      # Install the Buf CLI
      - uses: bufbuild/buf-setup-action@v1
      # Check for breaking changes in the 'proto' directory on all pull requests
      - uses: bufbuild/buf-breaking-action@v1
        with:
          input: proto
          against: "https://github.com/acme/weather.git#branch=main,ref=HEAD~1,subdir=proto"
        # Check for lint errors in the 'proto' directory on all pull requests
      - uses: bufbuild/buf-lint-action@v1
        with:
          input: proto
```

:::

::: info .github/workflows/push.yaml

```yaml
on:
  # Apply to all pushes on 'main' branch
  push:
    branches:
      - main
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: bufbuild/buf-setup-action@v1
        with:
          buf_api_token: ${{ secrets.BUF_API_TOKEN }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
          version: "1.53.0"
      # Run a lint check on Protobuf sources
      - uses: bufbuild/buf-lint-action@v1
      # Run breaking change detection for Protobuf sources against the current
      # `main` branch, 'proto' subdirectory
      - uses: bufbuild/buf-breaking-action@v1
        with:
          against: https://github.com/acme/weather.git#branch=main,ref=HEAD~1,subdir=proto
      # Push the validated module to the BSR
      - uses: bufbuild/buf-push-action@v1
        with:
          buf_token: ${{ secrets.BUF_TOKEN }}
```

:::

#### Unified Action

::: info .github/workflows/buf-ci.yaml

```yaml
name: Buf CI
on:
  # Apply to all pushes on 'main' branch
  push:
    branches:
      - main
  # Apply to all pull requests
  pull_request:
  delete:
permissions:
  contents: read
  pull-requests: write
jobs:
  buf:
    runs-on: ubuntu-latest
    steps:
      # Run `git checkout`
      - uses: actions/checkout@v4
      - uses: bufbuild/buf-action@v1
        with:
          token: ${{ secrets.BUF_TOKEN }}
          input: "proto"
          breaking-against: "https://github.com/acme/weather.git#branch=main,ref=HEAD~1,subdir=proto"
          # Run breaking change, lint, and format checks for Protobuf sources against all branches,
          # 'proto' # subdirectory, then push to the BSR once validated
          lint: ${{ github.event_name == 'push' }}
          format: ${{ github.event_name == 'push' }}
          breaking: ${{ github.event_name == 'push' }}
```

:::
