---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/admin/roles/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/admin/manage-repositories/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/setup-pro/"
  - - meta
    - property: "og:title"
      content: "Roles - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/roles.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/admin/roles/"
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
      content: "Roles - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/roles.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Roles

The BSR has two types of roles:

- Organization roles apply to members of organizations. The role defines access to the organization's resources and settings.
- Resource roles control which operations BSR users can perform on resources owned by an organization.

This guide describes each role and how the types of roles interact.

## Organization roles

Every user that's a member of an organization has an explicit organization role, which inherits a base resource role for each type of organization resource. Members can't change their own role — it must be done by an `Owner` or `Admin`.

### Member

- Can view the organization and its members.
- Inherits the base resource role on existing organization resources.

### Writer

- Can view the organization and its members.
- Can add resources such as repositories and plugins.
- Inherits `Write` roles over resources, regardless of the organization's base resource roles.

This role is especially useful with CI pipelines. For example, you could set the base resource role for repositories to `Read` and configure a [bot user](../instance/bot-users/) with `Write` access to push to repositories on merge.

### Admin

- Can modify organization settings, such as base resource roles.
- Can add and delete resources such as repositories and plugins.
- Can manage member roles, except `Owner`.

### Owner

Every organization must have at least one `Owner`, and can have more than one.

- Has unrestricted access to the organization, its settings, and all resources owned by the organization.
- Can add and delete resources such as repositories and plugins.
- Can delete the organization. You must delete all resources such as repositories and plugins before deleting the organization.

## Resource roles

Every user associated with a resource has either an explicit or an implicit role for that resource:

- `Read`: Can read the resource and import it as a dependency.
- `Limited Write`: Can create and write to non-default labels of the resource.
- `Write`: Can write to all labels of the resource and create new labels.
- `Admin`: Can administer the resource, including managing member access, updating settings, and deleting it.

If the user is the owner of that resource, or was directly associated with it by another user, that role is explicit. If the resource is owned by an organization, every member in that organization has an implicit role for that resource, which is controlled by the organization's base resource role for that resource type:

| Resource type | Base resource role | Editable? |
| :------------ | :----------------- | :-------: |
| Repository    | `Write`            |    ✅     |
| Plugin        | `Read`             |    ❌     |

You can change the base resource role for repositories and also [assign more granular resource roles](../manage-repositories/#change-repo-access) to individual members for specific repositories. This allows for greater flexibility in managing your Protobuf files.
