---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/subscription/manage-costs/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/subscription/manage/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/subscription/migrate/"
  - - meta
    - property: "og:title"
      content: "Manage costs - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/subscription/manage-costs.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/subscription/manage-costs/"
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
      content: "Manage costs - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/subscription/manage-costs.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Manage subscription costs

This page describes how to view your types usage and provides some best practices for managing the cost of your subscription by right-sizing the number of private types in your organization.

## Track types usage

Teams, Pro, and Enterprise plans provide dashboards to help estimate your usage costs. The type of information in the dashboard and its location depend on the plan.

### Teams and Pro plans

These subscriptions are per BSR organization and are billed based on average types usage per month. Organization admins can view the dashboard at:

`https://buf.build/ORGANIZATION/settings/usage`

![Example dashboard](../../images/bsr/types-usage-public.png)

On the same page, admins can also request an email alert when types usage reaches a specific threshold.

### Enterprise plans

These subscriptions are per BSR instance and are billed based on maximum types usage, with the interval set by your contract. The BSR provides two dashboards for Enterprise customers, both of which can be filtered by owner or repository and exported to CSV for sharing.

#### Billable types history

This dashboard shows up to a year's worth of historical data for billable types per month, broken down by type. The date range is selectable. Instance admins can view this dashboard at:

`https://BSR_INSTANCE/admin/billable-history`

![Example dashboard](../../images/bsr/types-usage-private-history.png)

#### Current types usage

This dashboard shows the current types usage broken out by owner and each type. The table can be sorted by any column, and clicking through allows you to view usage down to the repository level. Instance admins can view this dashboard at:

`https://BSR_INSTANCE/admin/current-usage`

![Example dashboard](../../images/bsr/types-usage-private-current.png)

## Reduce private types usage

We price based on types so that your cost aligns with usage of the BSR. That said, because the BSR offers true dependency management for Protobuf, you may be able to optimize your usage in private repositories by reducing vendored dependencies, and for some subscriptions, leveraging public repositories.

### Reduce vendored dependencies

Your Protobuf files likely have dependencies on third-party types like [googleapis](https://buf.build/googleapis/googleapis). Because the BSR provides many of these dependencies as modules, you can depend on its remote versions and remove any locally-vendored versions. See the [Dependency management](../../bsr/module/dependency-management/) page for more information.

If you don't find an official repository for your dependency in the BSR, then create a new public repository in your organization to hold these types.

### Convert private repositories to public

If you have a Community or Teams subscription, another option is to move types that don't need to be private into a public repository — types there aren't counted for billing purposes. This way, you can limit the paid types in your subscription to the much smaller number of business-sensitive types stored in your organization's private repositories. Making your APIs public can also lead to better discovery for your customers and encourage an open source community to emerge around your services.
