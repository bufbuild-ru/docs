---
layout: home

title: "The Buf Schema Registry is out of beta! Announcing new Buf Schema Registry plans and pricing updates"
description: "The Buf Schema Registry (BSR) is officially out of beta, and we're launching new pricing plans"

head:
  - - meta
    - property: "og:title"
      content: "The Buf Schema Registry is out of beta! Announcing new Buf Schema Registry plans and pricing updates"
  - - meta
    - property: "og:description"
      content: "The Buf Schema Registry (BSR) is officially out of beta, and we're launching new pricing plans"
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6750ccb0dcfc0cba857a7c6b_BSR%20beta.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "The Buf Schema Registry is out of beta! Announcing new Buf Schema Registry plans and pricing updates"
  - - meta
    - property: "twitter:description"
      content: "The Buf Schema Registry (BSR) is officially out of beta, and we're launching new pricing plans"
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6750ccb0dcfc0cba857a7c6b_BSR%20beta.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

hero:
  name: "The Buf Schema Registry is out of beta! Announcing new Buf Schema Registry plans and pricing updates"
  tagline: "April 12, 2023"
---

We are excited to announce that the Buf Schema Registry (BSR) is officially out of beta!

When we first launched the BSR nearly two years ago, our goal was to make an enterprise-grade solution for managing Protobuf APIs available to the entire software community, not just a lucky few. Since then, we have worked closely with our broad community of users and a growing number of enterprise customers to expand the BSR’s functionality and build it into the must-have platform for Protobuf for teams of all sizes.

## Introducing our new plans: Teams and Pro

Today, we are launching [two new plans](https://buf.build/pricing) that will help make the BSR a great fit for an even larger part of the Protobuf community:

**Teams:** If you’re using the BSR at work, our Teams plan is the solution for you to privately manage your team's APIs on the BSR. It offers all of the existing BSR solutions that you have been using, as well as:

- Unlimited private repositories
- Hosted custom plugins
- Email support within 24 hours

**Pro:** Our Pro plan is built for organizations with more complex IT requirements. Pro customers have full control of a managed, private BSR instance, in addition to:

- Unlimited organizations
- Custom SSO with SAML and OIDC
- Dedicated subdomain for your company
- Email support within 2 hours
- Comprehensive audit logging
- Server admin and bulk user management, including SCIM

For more details on these plans, please visit our [pricing page](https://buf.build/pricing).

## Unlocking the potential of Protobuf with the BSR

Buf is the only end-to-end developer platform for Protocol Buffers and gRPC, and our customers rely on the BSR to fulfill Protobuf’s promise of fast, safe, and convenient API evolution:

- [Manage Protobuf schemas across repositories](/docs/bsr/module/dependency-management/index.md), leveraging the BSR as the single source of truth
- Enable teams in your organization to effectively search, discover, and build on APIs independently using [generated documentation](/docs/bsr/documentation/overview/index.md) and built-in dependency management
- [Generate SDKs from your schemas](/docs/bsr/remote-plugins/overview/index.md), allowing engineers to effectively build APIs and consume generated SDKs via package managers like NPM without having to configure environments or manage plugins and compiler versions
- [Prevent breaking changes](/docs/breaking/overview/index.md) and enforce best practices, improving system reliability and preventing outages
- [Host, invoke, and consume custom plugins](/docs/bsr/remote-plugins/overview/index.md), replacing the need for custom Protobuf tooling, processes, and vendoring infrastructure
- [Validate and transform dynamic data at runtime](/docs/bsr/reflection/prototransform/index.md), bringing Protobuf to data pipelines and other event-based systems

We’re constantly expanding what the BSR can do. If you have feedback you would like to share, please join the discussion in our [community Slack channel](https://buf.build/b/slack).

## Introducing types-based pricing

Along with our new BSR plans, we are announcing how we’ll price use of the BSR. On our Teams and Pro plans, we now price based on the number of Protobuf types that your team stores in the BSR.

Types include any of the following:

- Messages
- Enums
- RPCs

You will be charged based on the average number of types used by your organization per month. To make sure we accurately capture your organization's usage, you will not be billed until after each full month of usage. Pricing will be as follows:

- For Teams: $0.50 per [type](https://buf.build/pricing#faqs)/month
  - first year discount to $0.40 for those who sign up before October 15, 2023
- For Pro: $1000 base price, including 200 types. Additional types: $5.00 per [type](https://buf.build/pricing#faqs)/month.
  - first year discount to $4.00/type (and 250 types included) for those who sign up before October 15, 2023

We considered this carefully: types may not be the first thing that comes to mind in terms of how to charge. In the end, we chose types for one simple reason: we want to bill in the fairest manner possible. The value you get out of the BSR should be correlated to what you pay us, without worrying about how to structure your APIs for optimal billing. The volume of API definitions you have stored on the BSR correlates with your usage of the BSR, and messages, enums, and RPCs make up the core of a Protobuf API definition. While types are a bit more complicated to reason about, charging based on your actual usage of the BSR results in a fairer experience for everyone - no matter how many repositories or users you have, your billing remains correlated to how much you actually use the BSR.

For more details on how types-based billing will work, please visit our [pricing page](https://buf.build/pricing).

## Key dates and changes to our Community plan

Going forward, we will continue to offer a free BSR plan — the Community plan — for open-source projects and teams just getting started with the BSR. The Community plan is feature-rich, and includes:

- One private repository (with up to 100 types)
- Unlimited public repositories
- Community Slack channel support

We want to ensure that current BSR users on the Community plan have enough time to consider their organizational needs and transition to the BSR plan that’s right for them. As a result, we will not limit use of the Community plan until May 15, 2023.

- **As of April 11**, you can [sign up](https://buf.build/pricing) for our Teams and Pro plans and gain access to their enhanced functionality.
- **As of May 15**, we will be enforcing usage limits on our Community plan. After this date, organizations continuing to use the Community plan will only have access to one private repository. To ease the transition to our new plans, both Teams and Pro plans include a one month free trial.

For users already on the BSR, we will be following up with a direct communication with more detail on what this transition will look like for you.

## BSR for enterprises

For larger organizations with more complex needs, we will continue to offer our Enterprise plans. We offer full data isolation and dedicated resources, custom resource, deployment, and contracting commitments, as well as white glove support. If you’re interested in discussing an Enterprise plan, you can reach us at [**support@buf.build**](mailto:support@buf.build)**.**

**To learn more and to sign up for Teams or Pro, check out our** [**pricing**](https://buf.build/pricing) **page. If you have further questions about the new plans, we are here to help! You can reach us at** [**support@buf.build**](mailto:support@buf.build)**.**

‍
