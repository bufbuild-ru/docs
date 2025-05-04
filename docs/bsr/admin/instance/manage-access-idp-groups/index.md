---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/manage-access-idp-groups/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/user-lifecycle/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/bot-users/"
  - - meta
    - property: "og:title"
      content: "Manage user access with IdP groups - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/instance/manage-access-idp-groups.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/admin/instance/manage-access-idp-groups/"
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
      content: "Manage user access with IdP groups - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/instance/manage-access-idp-groups.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Manage user access with IdP groups

::: warning
This feature is only available on the Pro and Enterprise plans.
:::

IdP group mapping allows you to manage membership in BSR organizations and repositories via security groups in your IdP, so it works seamlessly with your existing access controls:

- Users are granted access based on IdP group membership, with a default [role](../../roles/) that you can choose.
- The BSR automatically enrolls and un-enrolls users as members as your IdP groups change, and resolves differences between groups and manually-assigned access levels.

## Prerequisites

- Your BSR instance uses SSO for user provisioning.
- You can provide an OIDC claim or a SAML assertion that contains the user’s groups — Buf will need to configure your instance before you can map groups. Contact your Buf representative or [Support](../support/) for setup.
  - For OIDC, if your IdP broadcasts a `UserInfo` endpoint, you can configure the BSR to pull it from there. Otherwise, it must be part of the ID token.
  - SCIM isn't required for this feature, but if it's enabled and you're using it to push groups to the BSR, your IdP must be configured to provide the OIDC claim/SAML assertion.
- If you filter which groups the BSR is aware of, only map to those groups. Mapping to a group the BSR can't see has no effect.

::: warning Warning
Once this is configured, all user tokens from the IdP must contain group information. If you're using SAML, any user for whom groups information isn't provided will be unable to login to the BSR. If you're using OIDC, their groups will be treated as empty and they will lose access to the mapped organizations and repositories.
:::

## Map an IdP group to an organization

To map a group to a BSR organization, issue an API command with a user who has [admin permissions](../../roles/#admin) on the organization:

1.  [Create an API token](../../../authentication/#create-a-token).
2.  Export `BUF_TOKEN`, `GROUP_NAME`, `ORGANIZATION_NAME` and `PRIVATE_BSR_HOSTNAME` according to your details.
3.  Get the organization ID:

    ```console
    $ curl \
        -H "Authorization: Bearer ${BUF_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{\"name\":\"${ORGANIZATION_NAME}\"}" \
        "https://${PRIVATE_BSR_HOSTNAME}/buf.alpha.registry.v1alpha1.OrganizationService/GetOrganizationByName"
    ```

4.  Extract the returned `organization.id`, export it as `ORGANIZATION_ID` and use it to map the group (see below if you want to override the default member role):

    ```console
    $ curl \
        -H "Authorization: Bearer ${BUF_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{\"organization_id\":\"${ORGANIZATION_ID}\", \"group_name\":\"${GROUP_NAME}\"}" \
        "https://${PRIVATE_BSR_HOSTNAME}/buf.alpha.registry.v1alpha1.OrganizationService/AddOrganizationGroup"
    ```

5.  Ask your employees to logout/login for changes to take effect.

### Override the default member role

Members of the group are automatically added to the organization at the `Member` role by default. You can optionally override this by specifying a `role_override` in the payload, where the value is one of the [specified roles](https://buf.build/bufbuild/buf/docs/main:buf.alpha.registry.v1alpha1#buf.alpha.registry.v1alpha1.OrganizationRole). The `ORGANIZATION_ROLE_MACHINE` is equivalent to the `WRITER` role.To create the mapping with a role override, issue this API command with a user who has admin permissions on the organization:

```console
$ curl \
    -H "Authorization: Bearer ${BUF_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"organization_id\":\"${ORGANIZATION_ID}\", \"group_name\":\"${GROUP_NAME}\", \"role_override\":\"ORGANIZATION_ROLE_ADMIN\"}" \
    "https://${PRIVATE_BSR_HOSTNAME}/buf.alpha.registry.v1alpha1.OrganizationService/AddOrganizationGroup"
```

### Change or clear the role override

If you want to change or clear the role override, issue this API command with a user who has admin permissions on the organization:

```console
$ curl \
    -H "Authorization: Bearer ${BUF_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"organization_id\":\"${ORGANIZATION_ID}\", \"group_name\":\"${GROUP_NAME}\", \"role_override\":\"ORGANIZATION_ROLE_ADMIN\"}" \
    "https://${PRIVATE_BSR_HOSTNAME}/buf.alpha.registry.v1alpha1.OrganizationService/UpdateOrganizationGroup"
```

To clear the role override, use `ORGANIZATION_ROLE_UNSPECIFIED` as the `role_override` value.

## Unmap a security group to an organization

To unmap a group, issue the same commands as for mapping, except in the final step invoke `RemoveOrganizationGroup` instead.

```console{5}
$ curl \
    -H "Authorization: Bearer ${BUF_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"organization_id\":\"${ORGANIZATION_ID}\", \"group_name\":\"${GROUP_NAME}\"}" \
    "https://${PRIVATE_BSR_HOSTNAME}/buf.alpha.registry.v1alpha1.OrganizationService/RemoveOrganizationGroup"
```

Members don't need to logout or login when a group is removed — they're removed from the organization immediately.

## Map an IdP group to a repository

You can only map groups to repositories that are owned by an organization. To map a group to a BSR repository, issue an API command with a user who has the [`Admin` resource role](../../roles/#base-resource-roles) on the repository:

1.  [Create an API token](../../../authentication/#create-a-token).
2.  Export `BUF_TOKEN`, `GROUP_NAME`, `REPOSITORY_NAME`, `ORGANIZATION_NAME`, and `PRIVATE_BSR_HOSTNAME` according to your details.
3.  Get the repository ID:

    ```console
    $ curl \
        -H "Authorization: Bearer ${BUF_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{\"fullName\":\"${ORGANIZATION_NAME}/${REPOSITORY_NAME}\"}" \
        "https://${PRIVATE_BSR_HOSTNAME}/buf.alpha.registry.v1alpha1.RepositoryService/GetRepositoryByFullName"
    ```

4.  Extract the returned `repository.id`, export it as `REPOSITORY_ID` and use it to map the group (see below if you want to override the default resource role):

    ```console
    $ curl \
        -H "Authorization: Bearer ${BUF_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{\"repository_id\":\"${REPOSITORY_ID}\", \"group_name\":\"${GROUP_NAME}\"}" \
        "https://${PRIVATE_BSR_HOSTNAME}/buf.alpha.registry.v1alpha1.RepositoryService/AddRepositoryGroup"
    ```

5.  Ask your employees to logout/login for changes to take effect.

### Override the default resource role

Members of the group are automatically added to the repository with a `Read` resource role by default. You can optionally override this by specifying a `role_override` in the payload, where the value is one of the [specified roles](https://buf.build/bufbuild/buf/docs/main:buf.alpha.registry.v1alpha1#buf.alpha.registry.v1alpha1.RepositoryRole) (except for `REPOSITORY_ROLE_OWNER`, which is the parent organization).To create the mapping with a role override, issue this API command with a user who has the `Admin` resource role on the repository:

```console
$ curl \
    -H "Authorization: Bearer ${BUF_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"repository_id\":\"${REPOSITORY_ID}\", \"group_name\":\"${GROUP_NAME}\", \"role_override\":\"REPOSITORY_ROLE_WRITE\"}" \
    "https://${PRIVATE_BSR_HOSTNAME}/buf.alpha.registry.v1alpha1.RepositoryService/AddRepositoryGroup"
```

### Change or clear the role override

If you want to change or clear the role override, issue this API command with a user who has the `Admin` resource role on the repository:

```console
$ curl \
    -H "Authorization: Bearer ${BUF_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"repository_id\":\"${REPOSITORY_ID}\", \"group_name\":\"${GROUP_NAME}\", \"role_override\":\"REPOSITORY_ROLE_WRITE\"}" \
    "https://${PRIVATE_BSR_HOSTNAME}/buf.alpha.registry.v1alpha1.RepositoryService/UpdateRepositoryGroup"
```

To clear the role override, use `REPOSITORY_ROLE_UNSPECIFIED` as the `role_override` value.

## Unmap a security group to a repository

To unmap a group, issue the same commands as for mapping, except in the final step invoke `RemoveRepositoryGroup` instead.

```console{5}
$ curl \
    -H "Authorization: Bearer ${BUF_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"repository_id\":\"${REPOSITORY_ID}\", \"group_name\":\"${GROUP_NAME}\"}" \
    "https://${PRIVATE_BSR_HOSTNAME}/buf.alpha.registry.v1alpha1.RepositoryService/RemoveRepositoryGroup"
```

Members don't need to logout or login when a group is removed — they're removed from the repository immediately.

## Resolution of different access levels

If a user has different access levels over an organization or repository based on group memberships and manual overrides via the BSR web app, the access level resolves at runtime to the highest available. The BSR tracks the complete set of roles that apply, so if a mapping is changed or a user's group membership changes, the BSR only removes that specific role. The user retains their roles from other groups and those given manually.
