---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/subscription/migrate/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/subscription/manage-costs/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/subscription/faq/"
  - - meta
    - property: "og:title"
      content: "Migrate to private instance - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/subscription/migrate.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/subscription/migrate/"
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
      content: "Migrate to private instance - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/subscription/migrate.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Migrate to your new registry

**Buf Pro** gives organizations complete control over their development environment through a private Buf Schema Registry instance with a dedicated subdomain, providing an integrated and dependable developer experience. This reduces the amount of time spent on tedious and repetitive tasks, freeing up more time for developers to create value for their clients.

Our Pro tier gives organizations a private instance of the BSR with dedicated subdomain instead of the public instance at [buf.build](https://buf.build/). When moving to your private instance, you'll need to complete a few basic tasks.

## Create tokens

To access the BSR, you need to provide login configuration details via the buf CLI.

```console
$ buf registry login <name>.buf.dev
```

Bot users need to have tokens from the new instance generated, see [authentication](../../bsr/authentication/) for details.

## Manage members

Organizations on the Pro tier have 2 options for managing team members:

- Set up custom SSO via OAuth2 OIDC, or SAML. See the [SSO docs](../../bsr/admin/instance/sso/github-oauth2/) for more information.
- Use the [public BSR](https://buf.build/) as your identity provider (IdP). Instructions below.

### Using the BSR as your IdP

1.  New organization members must [sign up](https://buf.build/signup) for the BSR.
2.  The organization admin must then add the member to the org on the public BSR via the https://buf.build//members page.
3.  The new member can then log in to the private BSR instance. You can organize members into teams on the private instance by creating Organizations there.

## Using community modules in your BSR instance

Buf has made various modules available in the BSR for community use and regularly maintains them. These modules include the popular [googleapis](https://buf.build/googleapis/googleapis) and [protoc-gen-validate](https://buf.build/envoyproxy/protoc-gen-validate), which were added to support community development with the BSR. We [manage these modules](../../bsr/admin/instance/managed-modules/) for your private BSR instance, which alleviates the need to download and locally manage these Protobuf files, especially those from larger modules such as `googleapis/googleapis`.

Syncing the modules can take a few hours from the time we create the server, and once they're present, you need to change any dependencies on the public BSR versions to point to your private instance. See the section below for instructions.

## Rename modules and update dependencies

With your own dedicated instance of the Buf Schema Registry, you need to change the `name` of all configured modules to reference your private subdomain (`<name>.buf.dev`). You also need to adjust any dependencies that refer to `buf.build` to reference your private subdomain. Buf copies all of the [managed modules](../../bsr/admin/instance/managed-modules/) to your dedicated instance so you can start depending on them right away, but if you have dependencies across your own modules, you need to push them to your new dedicated instance and update your `buf.yaml` files so that no cross-domain dependencies exist.

To update your modules and dependencies:

1.  Replace all occurrences of `buf.build` in your `buf.yaml` files with your private subdomain.
2.  Push all of your modules to your private instance.

### Migrating when downgrading from Pro

If you downgrade from a Pro subscription, you'll no longer have access to your private BSR instance and need to migrate your modules and dependencies to point to the [public BSR](https://buf.build). This is the same process as above, but in reverse:

1.  Replace all occurrences of your private subdomain (`<name>.buf.dev`) in your `buf.yaml` files with `buf.build`.
2.  Push all of your modules to the public BSR.
