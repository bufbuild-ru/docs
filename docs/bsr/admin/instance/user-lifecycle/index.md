---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/user-lifecycle/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/customize-homepage/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/bot-users/"
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

This feature is only available on the Pro and Enterprise plans.

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

User deactivation is a manual process using the admin panel—if your BSR instance is `https://buf.example.com` then it's available at `https://buf.example.com/admin/users`.

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

If you want to have all users that login to your instance automatically added to an organization with a specific role, then reach out to us to configure this for you.If you use security groups at your organization and your IdP supports exposing the set of groups a user belongs to in the SAML assertion/OIDC ID token, you can map those groups to BSR Organizations. The BSR automatically enrolls and un-enrolls users as members as your IdP groups change.To configure this, contact [Support](https://support.buf.build) or your Buf representative with the name of the SAML assertion attribute/OIDC ID token claim that contain a user's groups. Then follow the steps below to map or unmap your IdP groups to the BSR.

WarningOnce this is configured, _all_ user tokens from the IdP _must_ contain group information. Any user for whom groups information isn't provided will be unable to login to the BSR.

### Map a security group to a BSR Organization

To map a security group to a BSR Organization, you must issue an API command directly with a user who has admin permissions on the organization:

1.  Create an API token from your user settings page.
2.  Export `BUF_TOKEN`, `GROUP_NAME`, `ORGANIZATION_NAME` and `PRIVATE_BSR_HOSTNAME` according to your details.
3.  Get the organization ID:

    ```console
    $ curl \
        -H "Authorization: Bearer ${BUF_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{\"name\":\"${ORGANIZATION_NAME}\"}" \
        "https://${PRIVATE_BSR_HOSTNAME}/buf.alpha.registry.v1alpha1.OrganizationService/GetOrganizationByName"
    ```

4.  Extract the returned `organization.id`, export it as `ORGANIZATION_ID` and use it to map the group:

    ```console
    $ curl \
        -H "Authorization: Bearer ${BUF_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{\"organization_id\":\"${ORGANIZATION_ID}\", \"group_name\":\"${GROUP_NAME}\"}" \
        "https://${PRIVATE_BSR_HOSTNAME}/buf.alpha.registry.v1alpha1.OrganizationService/AddOrganizationGroup"
    ```

    - Members of the group are automatically added to the organization at the Member role. You can optionally override this by specifying a `role_override` in the payload:

      ```console
      $ curl \
          -H "Authorization: Bearer ${BUF_TOKEN}" \
          -H "Content-Type: application/json" \
          -d "{\"organization_id\":\"${ORGANIZATION_ID}\", \"group_name\":\"${GROUP_NAME}\", \"role_override\":\"ORGANIZATION_ROLE_ADMIN\"}" \
          "https://${PRIVATE_BSR_HOSTNAME}/buf.alpha.registry.v1alpha1.OrganizationService/AddOrganizationGroup"
      ```

5.  Ask your employees to logout/login for changes to take effect.

### Update a security group mapping

If a security group is already mapped to a BSR organization and you want to change or clear the role override, you must issue this API command directly with a user who has admin permissions on the organization.

```console
$ curl \
    -H "Authorization: Bearer ${BUF_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"organization_id\":\"${ORGANIZATION_ID}\", \"group_name\":\"${GROUP_NAME}\", \"role_override\":\"ORGANIZATION_ROLE_ADMIN\"}" \
    "https://${PRIVATE_BSR_HOSTNAME}/buf.alpha.registry.v1alpha1.OrganizationService/UpdateOrganizationGroup"
```

If you want to clear the role override, use `ORGANIZATION_ROLE_UNSPECIFIED` as the `role_override` value.

### Unmap a security group to a BSR Organization

To unmap a group, issue the same commands, except in the final step invoke `RemoveOrganizationGroup` instead.

```console
$ curl \
    -H "Authorization: Bearer ${BUF_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"organization_id\":\"${ORGANIZATION_ID}\", \"group_name\":\"${GROUP_NAME}\"}" \
    "https://${PRIVATE_BSR_HOSTNAME}/buf.alpha.registry.v1alpha1.OrganizationService/RemoveOrganizationGroup"
```

Members don't need to logout or login when a group is removed—they're removed from the organization immediately.
