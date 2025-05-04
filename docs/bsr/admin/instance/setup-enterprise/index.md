---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/setup-enterprise/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/setup-pro/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/sso/github-oauth2/"
  - - meta
    - property: "og:title"
      content: "Enterprise setup - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/instance/setup-enterprise.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/admin/instance/setup-enterprise/"
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
      content: "Enterprise setup - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/instance/setup-enterprise.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Enterprise setup

::: warning
This feature is only available on the Enterprise plan.
:::

This page describes the basic setup for a private instance of the Buf Schema Registry (BSR). Currently, this requires manual work and communication between Buf engineers and your organization.

## Configure your DNS

Your BSR instance is hosted using a custom domain provided by you.For example, if your domain is `example.com`, you might choose to use `buf.example.com` as your private BSR instance's domain name. Once you've chosen a domain for your BSR instance, inform us of the name.A Buf engineer will provide you with the value for your `CNAME` records. The following examples use `example-corp.enterprise.buf.build` as a placeholder for this value.

```text
buf.example.com.          CNAME    example-corp.enterprise.buf.build.
```

Your private BSR instance is reachable from the public internet and is protected by SSO and CLI tokens. If your organization requires additional security measures such as IP range restriction, reach out to discuss.

## Assign administrative users

Your private BSR instance provides special privileges for administrator accounts to configure and manage various aspects of the instance. At least one user needs to be promoted to registry admin — see [Provisioning admin users](../user-lifecycle/#admin-users) for instructions.

## Identity provider (IdP) setup

By default, your BSR instance uses the public BSR as the IdP, but you should set up your BSR instance to use your SSO as the IdP instead. Follow the setup instructions for your provider, and read the [user lifecycle](../user-lifecycle/) page to understand how Buf provisions users in the BSR. We recommend that users in your organization sign up with their organization email addresses, so that when you switch to SSO their accounts merge automatically.
