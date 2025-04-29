---

title: "Bot users - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/bot-users/"
  - - meta
    - property: "og:title"
      content: "Bot users - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/admin/instance/bot-users/"
  - - meta
    - property: "twitter:title"
      content: "Bot users - Buf Docs"

---

# Bot users

This feature is only available on the Pro and Enterprise plans.

Bot users are headless users created and managed by BSR administrators.They're useful for providing and managing permissions to your automated workflows, such as CI, and when you want a separate BSR user to perform certain tasks, without having to manage the user at the SSO level.

## Limitations

The tokens created for bot users can perform most actions that are accessible to normal users, but there are also some limitations, namely:

- Bot users have no ability to access the BSR web interface—the API token created for them can't be used to resolve a cookie through the browser.
- Bot users can't manage their own tokens (their tokens must be managed by server administrators).

## Setup

To create and manage bot users:

1.  Go to the admin panel for your private BSR instance and select **Bot Users** in the left side menu. For example, if your BSR is `https://buf.example.com`, it's available at `https://buf.example.com/admin/bot-users`.
2.  Click the **Create bot user** button, then input a username to create the bot user.
3.  After the user is created, click on its name to go to the user details page and manage its tokens there.

After the user and its tokens are set up, the bot user is ready for use. However, the bot user won't automatically be granted any roles in any organizations or repositories. You still need to manage its role in the preferred organizations or repositories so that it has the permission needed to perform actions. Refer to [Manage members](../../manage-members/) for details.
