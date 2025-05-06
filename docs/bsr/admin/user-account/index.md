---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/admin/user-account/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/reflection/prototransform/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/admin/manage-organizations/"
  - - meta
    - property: "og:title"
      content: "Manage your Buf account - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/user-account.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/admin/user-account/"
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
      content: "Manage your Buf account - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/user-account.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Manage your user account

A Buf account grants you access to Buf Schema Registry repositories and allows you to explore the available modules. You'll also need a Buf account to share modules on the Buf Schema Registry.

If you haven't already, [sign up](https://buf.build/signup). You'll see several login options, including Google, GitHub, and traditional email and password. Next, you'll receive a verification email and need to verify your email address by clicking the link inside.

After you've successfully verified, select a username and complete your registration. If successful, you'll see that you're logged in and that your username displays in the upper right-hand corner.

## Updating your profile

On the [settings page](https://buf.build/settings/user), you have the option to link a URL and provide a description for your profile, which can be up to 350 characters in length.

### Adding API tokens

API tokens allow you to [authenticate](../../authentication/) as this user and access the registry from the Buf CLI and other tools. To create a new token:

1.  Click **Create new token**.
2.  Set an expiration time, and add a note for yourself to distinguish this token from others.
3.  Click **Create** and copy the token to your clipboard. You can't access this token again and it's used to identify you, so store it somewhere safe.

## Resetting your password

If you’ve forgotten your password, you can reset it by clicking on the **Forgot password?** link on the [login page](https://buf.build/login). Enter your email address, and you'll receive an email with instructions for resetting your password.

Once you’ve successfully reset your password, you'll receive a confirmation email in your inbox.

## Deleting your account

::: warning Warning
Deleting your account is a permanent action, and can't be undone. You must first delete all repositories and plugins you own, and leave or delete any organizations you belong to or created.
:::

To delete your account, go to the [settings page](https://buf.build/settings/user) and click **Delete account**.
