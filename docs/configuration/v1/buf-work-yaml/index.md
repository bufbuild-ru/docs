---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/configuration/v1/buf-work-yaml/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/configuration/v1/buf-lock/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/workspaces/"
  - - meta
    - property: "og:title"
      content: "buf.work.yaml - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/configuration/v1/buf-work-yaml.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/configuration/v1/buf-work-yaml/"
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
      content: "buf.work.yaml - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/configuration/v1/buf-work-yaml.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf.work.yaml v1 config file

::: tip Note
Buf now has a `v2` configuration available, where this file is no longer used. See the [v2 `buf.yaml` reference](../../v2/buf-yaml/) and the [v1 to v2 migration guide](../../../migration-guides/migrate-v2-config-files/) for details about the new configuration and migration instructions.
:::

The `buf.work.yaml` file is used to define a [workspace](../../../reference/workspaces/), where one or more modules can coexist and interoperate within a common directory. Workspaces make it possible for local [modules](../../../cli/modules-workspaces/) to import Protobuf files from other local modules, and unlock other powerful use cases that operate on multiple modules at the same time.

The diagram and file below represent a complete example of a `buf.work.yaml` configuration file and its corresponding tree layout containing the `buf.build/acme/petapis` and `buf.build/acme/paymentapis` modules:

```text
.
├── buf.work.yaml
├── paymentapis
│   ├── acme
│   │   └── payment
│   │       └── v2
│   │           └── payment.proto
│   └── buf.yaml
└── petapis
    ├── acme
    │   └── pet
    │       └── v1
    │           └── pet.proto
    └── buf.yaml
```

::: info buf.work.yaml

```yaml
version: v1
directories:
  - paymentapis
  - petapis
```

:::

## Fields

### `version`

**Required.** Defines the current configuration version. The only accepted value is `v1`.

### `directories`

**Required.** Lists the directories that define modules to be included in the workspace. The directory paths must be relative to the `buf.work.yaml`, and can't point to a location outside of the directory where your `buf.work.yaml` is. For example, `../external` is invalid.

The directory `.` is invalid as well. Given the [requirement](../../../reference/workspaces/#additional-requirements) to have no overlapping directories, and given that a directory can't point to a location outside of your `buf.work.yaml` directory, listing a directory named `.` in your `buf.work.yaml` means that the `buf.work.yaml` only contains that single directory. It's the same as having no `buf.work.yaml` at all.

Each directory is included as an independent module, such that all of the Protobuf files defined within the `paymentapis` and `petapis` directories are included in the workspace, relative to the respective module root. For more information about how to import modules into each other, see the [importing across modules](../../../reference/workspaces/#importing-across-modules) section of the workspaces documentation.
