---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/scim/azure-saml/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/scim/overview/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/scim/okta-saml/"
  - - meta
    - property: "og:title"
      content: "Azure - SAML - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/instance/scim/azure-saml.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/admin/instance/scim/azure-saml/"
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
      content: "Azure - SAML - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/instance/scim/azure-saml.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Azure - SAML

::: warning
This feature is only available on the Pro and Enterprise plans.
:::

SCIM for Azure Active Directory supports the following SCIM resources:

- Users (mapped directly to BSR Users)
- Groups (not directly represented in the BSR, but can be added to BSR Organizations by name to manage Organization membership)

The steps below must be carried out by users with administrative privileges in your Azure AD account.

## Prerequisites

- Setup ([Pro](../../setup-pro/) | [Enterprise](../../setup-enterprise/)) needs to be complete.
- You need to know your private BSR instance's domain name (for example, `example.buf.dev` or `buf.example.com`) for the steps below.

## Enable SCIM provisioning

1.  Complete the [SCIM prerequisites](../overview/) if you haven't already.
2.  Sign in to your Azure portal.
3.  Navigate to your BSR application under **Enterprise applications** in your Azure Active Directory tenant.
4.  Click **Provisioning** on the side bar, click **Configure Provisioning**.
5.  Under **Provisioning Mode**, select `Automatic`.
6.  Under **Admin Credentials**, enter the following information:
    - **Tenant URL**: `https://buf.example.com/scim/v2`
    - **Secret Token**: enter the SCIM token you created earlier
7.  Click **Save**.

## Configure SCIM mappings

1.  Navigate to your BSR application under **Enterprise applications** in your Azure Active Directory tenant.
2.  On the left sidebar, navigate to **Provisioning**, and then **Provisioning** again.
3.  Under Mappings, click **Provision Azure Active Directory Users**.
4.  Ensure that the following attribute mappings are set. Delete all other attribute mappings.

    | Azure Active Directory attribute                              | Application attribute          |
    | ------------------------------------------------------------- | ------------------------------ |
    | `userPrincipalName`                                           | `userName`                     |
    | `Switch([IsSoftDeleted], , "False", "True", "True", "False")` | `active`                       |
    | `mail`                                                        | `emails[type eq "work"].value` |
    | `givenName`                                                   | `name.givenName`               |
    | `surname`                                                     | `name.familyName`              |

5.  Click **Save**.

## Provision users

In the **Overview** tab in the Provisioning app, click **Start Provisioning**. Azure provisions users on a fixed interval, but you can also navigate to **Provision on demand** if you want to immediately provision users.

If you had previously assigned this Azure application to users before enabling SCIM, Azure tries to match the users to existing users within the BSR, and this should succeed without error. If this fails, consult the **Provisioning Logs** tab in the Provisioning app.

If you encounter any errors provisioning users, see the [relevant part of the FAQ](../faq/#how-do-i-resolve-a-failed-user-provision). If you are unable to resolve those issues, contact [Support](https://support.buf.build) or your Buf representative.
