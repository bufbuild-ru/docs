---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/sso/okta-oidc/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/sso/google-saml/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/sso/okta-saml/"
  - - meta
    - property: "og:title"
      content: "Okta - OIDC - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/instance/sso/okta-oidc.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/admin/instance/sso/okta-oidc/"
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
      content: "Okta - OIDC - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/instance/sso/okta-oidc.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Okta - OIDC

::: warning
This feature is only available on the Pro and Enterprise plans.
:::

Buf's SSO integration supports the following OIDC features:

- Service Provider (SP) initiated SSO
- Just-in-Time (JIT) user provisioning

The steps below must be carried out by an Okta administrator for your organization.

## Prerequisites

- Setup ([Pro](../../setup-pro/) | [Enterprise](../../setup-enterprise/)) needs to be complete.
- You need to know your private BSR instance's domain name (for example, `example.buf.dev` or `buf.example.com`) for the steps below.

## Set up application

1.  Sign in to your Okta organization.
2.  Navigate to **Applications** > **Applications** and click **Create App Integration**.
3.  For **Sign-in method**, select **OIDC - OpenID Connect**.
4.  For **Application type**, select **Web Application**.

### Configure OIDC

1.  Under **General Settings**, give the integration an App name like "Buf Schema Registry" or "Buf". This should be something meaningful to your users.
2.  Under **Grant type**, make sure to check **Refresh Token**.

    ![ Okta OIDC configuration](../../../../../images/bsr/sso/okta-oidc.png)

3.  Next, provide the callback URL. This depends on the domain you provided.

    - Sign-in redirect URIs are `https://buf.example.com/oauth2/callback`
    - Sign-out redirect URIs are `https://buf.example.com/logout`

    Support for logout will be available in an upcoming release, but we suggest configuring this now so it works seamlessly when enabled. If you require [Application Single Logout](https://help.okta.com/en/prod/Content/Topics/Apps/Apps_Single_Logout.htm), contact [Support](https://support.buf.build) or your Buf representative.

    ![ Okta OIDC configuration](../../../../../images/bsr/sso/okta-oidc-2.png)

    Note that Buf provisions users Just-in-Time based on the email address.

4.  In the **Assignments** section, select which users or groups of users should have access to this Buf instance.

## Update SSO configuration

To set up or update your BSR instance's SSO configuration:

1.  Go to the Settings page for your OIDC integration.

    ![Screen shot of Okta OIDC settings](../../../../../images/bsr/sso/okta-oidc-3.png)

2.  In another tab, go to the **SSO Configuration page** at `http://<BSR_SERVER>/<ORGANIZATION>/pro-settings`.
3.  From the **SSO Provider** dropdown, choose **OIDC**.
4.  Copy and paste the client ID, client secret, and the issuer URL (the Okta domain from your OIDC settings) and enter an optional logout URL.
5.  Click **Update**.

    ![Screen shot of BSR Okta OIDC configuration](../../../../../images/bsr/sso/oidc-config.png)

## Configure Token Refresh

1.  Go to the Settings page for your OIDC integration and click **Edit**.
2.  Scroll down to the **Refresh Token** section.
3.  Select **Rotate token after every use** and make sure the **Grace period for token rotation** is set to 15s. The important part is to make sure this value isn't set to 0.
4.  Click **Save**.

    ![Screen shot of Okta Refresh Token settings](../../../../../images/bsr/sso/okta_oidc_refresh_token.png)

## Next steps

- View the [User lifecycle](../../user-lifecycle/) page to understand how users are provisioned.
