---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/scim/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/sso/okta-saml/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/scim/azure-saml/"
  - - meta
    - property: "og:title"
      content: "SCIM - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/instance/scim/index.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/admin/instance/scim/"
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
      content: "SCIM - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/instance/scim/index.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Overview

::: warning
This feature is only available on the Pro and Enterprise plans.
:::

The BSR supports System for Cross-domain Identity Management (SCIM) 2.0 integration with several identity providers. SCIM is a protocol that maps users and groups from your Identity Provider (IdP) into the BSR, making it easy to manage BSR Organization membership. SCIM enables you to:

- provision a user in the BSR when they're added to your IdP
- deactivate a user when they're removed from your IdP
- update a user's membership to a BSR Organization when they're added or removed from an IdP group

We support SCIM for the following IdPs and auth methods:

- Azure (SAML)
- Okta (SAML)

If your IdP isn't in this list, contact [Support](https://support.buf.build) or your Buf representative to discuss adding support.

SCIM 2.0 defines [core user and group schemas](https://www.rfc-editor.org/rfc/rfc7643) that all SCIM implementations must implement. To support the IdPs indicated above, the BSR stores the following SCIM attributes for users:

- External ID
- Username
- Given name
- Family name
- Email (SCIM supports multiple emails, but the BSR only supports a single email of SCIM email type `work`)

## SCIM prerequisites

If you plan to push groups from your IdP to the BSR, you must have [automated organization provisioning](../user-lifecycle/#autoprovisioning) enabled.

### Create a SCIM token

To use the SCIM integration, you must obtain a SCIM token. Execute the following as a BSR administrator:

```sh
curl \
    -H "Authorization: Bearer ${BUF_TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{ "expire_time": "2023-03-03T15:56:12+00:00" }' \ # omit expire_time to create a token that never expires
    "https://buf.example.com/buf.alpha.registry.v1alpha1.SCIMTokenService/CreateSCIMToken"
```

The response includes the token's value in the `token` field. Save this token somewhere safe — you need it to enable SCIM in your IdP.

You can also use Buf Studio via `https://buf.example.com/studio` to invoke this endpoint.

### Readiness check

The BSR contains an optional readiness check that can inform you of any issues you may encounter when enabling SCIM provisioning. To assess your BSR instance's readiness, issue the following request to the BSR using your SCIM token:

```sh
curl \
    -H "Authorization: Bearer ${SCIM_TOKEN}" \
    -H "Content-Type: application/json" \
    "https://${PRIVATE_BSR_HOSTNAME}/scim/v2/readiness"
```

Inspect the request body for any warnings returned.
