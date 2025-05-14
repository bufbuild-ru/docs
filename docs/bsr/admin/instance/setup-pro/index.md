---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/setup-pro/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/admin/roles/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/setup-enterprise/"
  - - meta
    - property: "og:title"
      content: "Pro setup - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/instance/setup-pro.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/admin/instance/setup-pro/"
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
      content: "Pro setup - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/instance/setup-pro.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Pro setup

::: warning
This feature is only available on the Pro plan.
:::

This page describes the basic setup for a private Pro instance of the Buf Schema Registry (BSR).

## DNS setup

No additional DNS setup is required. Your BSR instance is hosted at a custom domain assigned by Buf that takes the form `NAME.buf.dev`, where `NAME` is the name of your BSR organization. You should reference this name instead of the public BSR instance (`buf.build`) when you run commands, create modules, or use modules as dependencies.

Your private BSR instance is reachable from the public internet and is protected by SSO and CLI tokens.

## Assign administrative users

Your private BSR instance provides special privileges for administrator accounts to configure and manage various aspects of the instance. At least one user needs to be promoted to registry admin — see [Provisioning admin users](../user-lifecycle/#admin-users) for instructions.

## Identity provider (IdP) setup

By default, your BSR instance uses the public BSR as the IdP, but you should set up your BSR instance to use your SSO as the IdP instead. Follow the setup instructions for your provider, and read the [user lifecycle](../user-lifecycle/) page to understand how Buf provisions users in the BSR. We recommend that users in your organization sign up with their organization email addresses, so that when you switch to SSO their accounts merge automatically.
