---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/user-lifecycle/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/scim/faq/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/manage-access-idp-groups/"
  - - meta
    - property: "og:title"
      content: "User lifecycle - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/instance/user-lifecycle.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/admin/instance/user-lifecycle/"
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
      content: "User lifecycle - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/instance/user-lifecycle.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# User lifecycle

::: warning
This feature is only available on the Pro and Enterprise plans.
:::

For private BSR instances, users are managed by your Identity Provider (IdP). This page describes various aspects of the lifecycle of SSO-managed BSR users.

## Provisioning new users

Users are provisioned Just In Time (JIT) on first login. Buf usernames are derived from the left portion of the email address before the `@`. To ensure the username works across the Buf ecosystem, all invalid characters are replaced with a dash (`-`).The username must start with a letter and contain only alphanumeric characters and a dash (`-`). Examples:

- `bob.smith@example.com` -> `bob-smith`
- `julia-smith+demo@example.com` -> `julia-smith-demo`

In the event of a username or reserved word collision, the system appends sequentially incrementing integers to the username to ensure uniqueness.Newly provisioned users can access any public repositories in your private BSR instance. As on the public BSR, organization owners can manually add users to their organizations to share access to an organization's private repositories.

- If you want to have all users who login to your instance automatically added to an organization with a specific role, reach out to us to configure this for you.
- If you want to map organization membership to security groups in your Identity Provider, then use [automated organization membership provisioning](#autoprovisioning).

## Provisioning admin users

Private BSR instances provide special privileges for administrator accounts to configure and manage various aspects of your BSR instance.During the setup of your BSR instance, you'll be asked which account to designate as an administrator. At this time, administrator privileges can only be granted by Buf engineers, so reach out if you need additional admin users.

## Deactivating users

Unlike the public BSR at `buf.build`, private BSR users can't delete themselves. Instead, the enterprise BSR requires administrators to deactivate user accounts. Deactivating a user revokes all of their outstanding tokens and permissions, locking them out of the BSR web interface and CLI. A deactivated user's resources such as repositories, plugins, and configuration files won't be deleted.

### Using the admin panel

User deactivation is a manual process using the admin panel — if your BSR instance is `https://buf.example.com` then it's available at `https://buf.example.com/admin/users`.

### Using the BSR API

Users can also be deactivated by issuing API commands directly:

1.  Create an API token from your user settings page.
2.  Export `BUF_TOKEN`, `USERNAME_TO_DEACTIVATE` and `PRIVATE_BSR_HOSTNAME` according to your details.
3.  Get the userID:

    ```console
    $ curl \
        -H "Authorization: Bearer ${BUF_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"${USERNAME_TO_DEACTIVATE}\"}" \
        "https://${PRIVATE_BSR_HOSTNAME}/buf.alpha.registry.v1alpha1.UserService/GetUserByUsername"
    ```

4.  Extract the returned `user.id`, export it as `USER_ID` and use it to deactivate the user:

    ```console
    $ curl \
        -H "Authorization: Bearer ${BUF_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{\"id\":\"${USER_ID}\"}" \
        "https://${PRIVATE_BSR_HOSTNAME}/buf.alpha.registry.v1alpha1.UserService/DeactivateUser"
    ```

### SCIM

You can also deactivate users by removing them from your identity provider if you've connected it to the BSR. See the [SCIM documentation](../scim/overview/) for setup details.

### Permanent account deletion

If you require permanent account deletion, reach out for assistance.

## Automated organization membership provisioning

If you want all users who login to your instance to be automatically added to an organization with a specific role, reach out to us to configure this for you.If you want to map IdP security groups to specific organizations or repositories, see [Manage user access with IdP groups](../manage-access-idp-groups/)
