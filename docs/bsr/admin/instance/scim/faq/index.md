---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/scim/faq/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/scim/okta-saml/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/customize-appearance/"
  - - meta
    - property: "og:title"
      content: "FAQ - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/instance/scim/faq.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/admin/instance/scim/faq/"
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
      content: "FAQ - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/instance/scim/faq.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# FAQ

This feature is only available on the Pro and Enterprise plans.

This page contains frequently asked questions related to the BSR's SCIM 2.0 integration.

### How do I resolve a failed User provision?

When a user is provisioned within the BSR, SCIM Clients first try to match the IdP user to an existing user in the BSR. The BSR's SCIM integration uses the user's **email address** to match an IdP user.Users can fail to provision from the IdP to the BSR for various reasons. Usually it's the result of a conflict with an existing user in the BSR. If your IdP reports this error, ensure that the user you are trying to provision has recently logged in and logged out of the system. Contact [Support](https://support.buf.build) or your Buf representative if you're unable to verify this.Also ensure that your IdP is configured to map the correct value to the SCIM `email` and `userName` fields. To reconcile the corrupted state:

1.  Deprovision the user from the application in your IdP.
2.  Fix any attribute misconfigurations.
    - Ensure that you are using the user's email as their SAML `NameId`.
    - Ensure that the SCIM username is mapped to the correct field, as per the instructions for your IdP.
3.  Re-provision the user in the application in your IdP.

### I successfully provisioned a user from my IdP into an existing user in the BSR, but now I have two user accounts with the slightly different usernames. What do I do?

See above.

### Can I use SCIM without auto-provisioning?

If you push IdP groups to the BSR via SCIM, you must configure [automated organization provisioning](../../user-lifecycle/#autoprovisioning), otherwise users are removed from any groups upon their next login. If you don't wish to push IdP Groups to the BSR, you don't need to configure it.
