---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/customize-homepage/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/customize-appearance/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/managed-modules/"
  - - meta
    - property: "og:title"
      content: "Customize homepage - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/instance/customize-homepage.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/admin/instance/customize-homepage/"
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
      content: "Customize homepage - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/instance/customize-homepage.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Customize the BSR homepage

::: warning
This feature is only available on the Pro and Enterprise plans.
:::

By default, a private instance Buf Schema Registry (BSR) homepage displays the same content as the [public BSR](https://buf.build). As a BSR instance admin, you can customize this page to make it more specific to your overall organization's needs:

- **Hide the user's information sidebar:** The sidebar makes it convenient for users to navigate to organizations and repositories they are part of, but on instances where only admins are creating orgs/repos, the sidebar can be hidden to make room for other content (like the "Getting started" guide and/or custom groups of organizations and repositories) mentioned below.
- **Add a "Getting started" guide to the top of the page:** Help orient your users to the aspects of the BSR you want them to focus on with custom Markdown-styled content. You can add separate guides for authenticated and unauthenticated users.
- **Choose whether to display popular repositories:** The BSR recommends a short list of commonly-referenced repositories, but you can hide it if desired.
- **Create custom groups of orgs and repos:** Point users of your instance toward the repositories and/or organizations that are most important.

To customize your BSR instance's homepage, go to **Admin panel > Home page** and add or edit sections as needed:

![Screenshot of BSR homepage admin screen](../../../../images/bsr/homepage/homepage-admin.png)

Once you're done, go to the homepage or your instance to confirm it's what you want. This example adds a "Getting started" guide for authenticated users, turns off the user sidebar, adds a custom group, and moves it above the **Popular Repositories** group:

![Screenshot of BSR homepage after customizing](../../../../images/bsr/homepage/homepage-customized.png)
