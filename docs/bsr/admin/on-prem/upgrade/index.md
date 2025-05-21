---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/admin/on-prem/upgrade/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/admin/on-prem/architecture/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/admin/on-prem/release-notes/"
  - - meta
    - property: "og:title"
      content: "Upgrade or downgrade - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/on-prem/upgrade.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/admin/on-prem/upgrade/"
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
      content: "Upgrade or downgrade - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/on-prem/upgrade.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Upgrade or downgrade

This page describes how to upgrade or download an on-prem BSR instance.

## Upgrade

We currently support (and test) zero downtime sequential upgrades from one minor version to the next minor version. For example, if you’re on version `1.0.0` then you can safely upgrade to `1.0.X` or `1.1.X` without any downtime.

To upgrade, deploy the new version of the helm chart. The exact steps vary depending on how you use helm — directly, with [helmfile](https://github.com/helmfile/helmfile), or through CI. If using helm directly, upgrade the Helm chart on the cluster using the `bsr.yaml` Helm values file you created [during installation](../installation/):

```sh
helm upgrade bsr oci://us-docker.pkg.dev/buf-images-1/bsr/charts/bsr \
  --version "1.x.x" \
  --namespace=bsr \
  --values bsr.yaml
```

### Multi-version upgrades

If you want to upgrade more than one minor version (for example `1.0.0` to `1.2.0`) and you care about avoiding downtime, then you need to apply minor version upgrades one at a time (for example deploy `1.1.0`, verify deploy successful, deploy `1.2.0`, verify deploy successful, etc.).

If you are OK with downtime and prefer to minimize the number of steps required to upgrade across multiple versions, you can use the following process (note that this only saves you time if you are upgrading 3 or more minor versions at once):

1.  Using the currently deployed version of the helm chart, enable [maintenance mode](../configuration/#maintenance-mode) in the helm values, and apply it (for example deploy `1.0.0` with `maintenance: true`).
2.  Verify that the deploy has completed.
3.  Take a snapshot of the Postgres database, to guard against data loss in case a rollback is necessary.
4.  Apply the latest version of the helm chart with [maintenance mode](../configuration/#maintenance-mode) disabled in the helm values (for example deploy `1.9.0` with `maintenance: false` or omitted).

## Downgrade

You can downgrade to any previous patch release of the same major and minor (for example, 1.2.3 -> 1.2.1) without downtime or data loss. If you need to do this, simply deploy the old version.

### Data loss potential

Beyond patch releases, downgrading is generally safe within the previous minor release of the same major (for example, 1.2.3 -> 1.1.0). However, in the example above, if you used new features released in 1.2.x, downgrading to 1.1.x may delete all data for the new features. This data loss won't be visible until you upgrade to 1.2.x again.

**To minimize potential data loss problems, we recommend never rolling back further than one minor release from the newest version ever deployed to an instance.** Although it's possible to do this, the potential for unintentional data loss increases the further back you go.

### Downgrade steps

If you haven't used new features or losing their data is acceptable, you can downgrade with no downtime within the previous minor release by following these steps:

1.  Deploy the version you want to roll back to (for example `1.1.0`). This is safe to do as a rolling deployment, so that you don't incur downtime.
2.  Ensure that the rollback has completed and there are no more instances of the newer version (for example `1.2.0`) running.
3.  Look up the schema version for the version you have rolled back to in the [BSR Release Notes](../release-notes/) (for example the database schema version for `1.1.0` is `222`).
4.  Manually run `bufd migratedownto $VERSION` using the bufd binary you are rolling back from and the schema version you looked up in the release notes (for example with `1.2.0` binary run `bufd migratedownto 222` to downgrade to the `1.1.0` schema).
