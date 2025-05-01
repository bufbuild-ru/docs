---
sidebar: false
prev: false
next: false

title: "The BSR now provides a SCIM service for Pro and Enterprise plans"
description: "Admins can now configure SCIM in their BSR to manage organization enrollments based on IdP security groups."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/introducing-bsr-scim"
  - - meta
    - property: "og:title"
      content: "The BSR now provides a SCIM service for Pro and Enterprise plans"
  - - meta
    - property: "og:description"
      content: "Admins can now configure SCIM in their BSR to manage organization enrollments based on IdP security groups."
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6750ccd4aed8c384d4eee094_SCIM%20service.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "The BSR now provides a SCIM service for Pro and Enterprise plans"
  - - meta
    - property: "twitter:description"
      content: "Admins can now configure SCIM in their BSR to manage organization enrollments based on IdP security groups."
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6750ccd4aed8c384d4eee094_SCIM%20service.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# The BSR now provides a SCIM service for Pro and Enterprise plans

**As of today, the Buf Schema Registry implements the** [**SCIM**](http://www.simplecloud.info/) **standard! BSR admins on our** [**Pro or Enterprise plans**](https://buf.build/pricing/) **no longer need to manually create user accounts and enroll them in BSR organizations — they can now configure SCIM to manage organization enrollments based on their Identity Provider (IdP)’s security groups, and their users’ BSR access will be automatically updated when they are added or removed from the IdP.** This automation of user management saves time and reduces the risk of errors that can occur when manual updates are performed, and provides the ability to:

- Automatically provision users in the BSR when they are added to your IdP.
- Automatically deactivate users in the BSR when they are removed from your IdP.
- Automatically update user membership in BSR organizations when they are added to or removed from a group in your IdP.

SCIM is included with our [Pro and Enterprise plans](https://buf.build/pricing/), and it currently supports Okta and Azure Active Directory using the SAML authentication strategy.

## What is SCIM?

SCIM ([System for Cross-domain Identity Management](http://www.simplecloud.info/)) is an application-level protocol for provisioning and managing identity data in cloud environments. With SCIM, organizations can easily manage user identities across different systems and applications. SCIM simplifies the provisioning and de-provisioning of users, the management of groups that users belongs to, and the synchronization of user information from IdPs to cloud applications like the BSR.

SCIM is essentially a set of HTTP endpoints that define CRUD operations over a set of resources (such as users and groups), along with metadata endpoints that define the service provider itself. SCIM clients (in this case, your IdP) communicate with a service provider (the BSR) by invoking one or more of the endpoints for that resource. More information about SCIM can be found in [RFC 7642](https://www.rfc-editor.org/rfc/rfc7642). The BSR's SCIM implementation is fully compliant with the [SCIM 2.0 standard](https://www.simplecloud.info/#Specification).

## What does this mean for BSR users?

Historically, the BSR's user access management involved creating user accounts and enrolling them in BSR organizations. Once enrolled in an organization, users could access the repositories within that organization, but administrators needed to manually enroll each user to grant access to these resources. Now, admins on Pro and Enterprise plans using Okta or Azure Active Directory for Single-Sign-On can configure SCIM, and the BSR will manage organization enrollments based on the IdP’s security groups. Additionally, when a user is added to or removed from their IdP, their access to BSR will be automatically updated accordingly.

## Get started with SCIM in the BSR

To learn more about SCIM or to set it up in the BSR, check out the [BSR SCIM documentation](/docs/bsr/admin/instance/scim/overview/index.md). If you’re not yet on our Pro or Enterprise plan, [pricing details](https://buf.build/pricing/) are available on our website.

Don't hesitate to reach out to us on the [Buf Slack](https://buf.build/b/slack/) with any questions. We'd love to hear your feedback!
