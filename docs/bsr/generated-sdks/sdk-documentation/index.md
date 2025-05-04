---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/sdk-documentation/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/tutorial/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/generated-sdks/artifactory/"
  - - meta
    - property: "og:title"
      content: "SDK documentation - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/generated-sdks/sdk-documentation.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/generated-sdks/sdk-documentation/"
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
      content: "SDK documentation - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/generated-sdks/sdk-documentation.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# SDK documentation

Generated SDKs are largely self-documenting. They include complete instructions for installing via the relevant package manager, or downloading an archive if that's not available. Some SDKs also provide a [generated API reference](#api-reference).In addition, you can add a "Getting started" guide to your SDKs to provide additional context to users.

## Getting started guide

Each SDK provides an open-text Markdown editor for the guide, allowing you to customize the content for the associated plugin.You must be a BSR instance admin or have the `Owner` or `Admin` [role](../../admin/roles/#organization-roles) in the module's parent organization to access the editor.

### Add a guide

1.  Go to the **SDKs** tab of the module: `https://buf.build/OWNER/MODULE/sdks`.
2.  Choose the plugin you want to create a guide for.
3.  Click **Open the Markdown editor**.
4.  Begin writing or paste in your text from another source.
5.  When you're done editing the text, click **Publish**. The guide is immediately visible to anyone who goes to that SDK.

You can format the text and add images or tables using Markdown or use the WYSIWYG buttons. Image URLs must be publicly addressable — the editor doesn't allow you to upload images.

### Edit or delete a guide

You can edit the guide anytime by clicking **Edit**. Make your changes and click **Publish** to publish the revision.To delete the guide, click the trash can icon at the top right of the editor.

::: warning Warning
SDK getting started guides aren't version-controlled resources. When their content is changed or deleted, older versions can't be recovered.
:::

## API reference

Most Go and JavaScript/Typescript SDKs have an easily accessible API reference on the SDK page. It's always in sync with the plugin version and module commit specified by the SDK, and is presented in the way that's standard for each language. Click the **API reference** button at the top right of the SDK to view it.![Screenshot of the API reference button](../../../images/bsr/sdks/sdk-docs-button.png)If the API reference for the SDK hasn't been generated before, the BSR displays a "Docs Generating" banner — otherwise, it displays a link to the reference's root directory. Click through to a package, and it shows its import statement and links to each of the package's descendants. You can then navigate around the documentation as needed.
