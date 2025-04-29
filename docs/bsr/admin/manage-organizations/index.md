---

title: "Manage organizations - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/admin/manage-organizations/"
  - - meta
    - property: "og:title"
      content: "Manage organizations - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/admin/manage-organizations/"
  - - meta
    - property: "twitter:title"
      content: "Manage organizations - Buf Docs"

---

# Manage organizations

An organization allows you to collaborate with others on a shared set of Protobuf files. Once you've set up the organization, you can add other Buf users as members and assign roles to them. Depending on the role, they may have specific permissions to change the organization itself and the underlying resources. See [Manage members and roles](../manage-members/) for more information about roles and how to assign them.

## Create organization

To create a new organization:

1.  [Sign in](https://login.buf.build/) to the Buf Schema Registry.
2.  Click on **Show all** under the **Your organization** section.
3.  Select **Create Organization**.![Create a new organization](../../../images/bsr/org-create.png)

When setting up a new organization, there are a few important things to keep in mind:

- The organization name must be unique and between 3 and 32 characters in length. It can only contain lowercase letters, numbers, or hyphens (-).
- You can add an organization URL in the repository settings later.
- You can also provide a description of the organization, which can be up to 350 characters in length, and provide an organization logo to make the org memorable and identifiable.

WarningOrganization names can't be changed without deleting and recreating the organization and all of its contents. Choose the name carefully.

## Delete organization

Deleting the organization is a permanent action, and can't be undone. You must first delete all repositories and plugins owned by the organization.
