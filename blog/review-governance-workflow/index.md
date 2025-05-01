---
sidebar: false
prev: false
next: false

title: "Audit breaking changes with the Buf Schema Registry's governance workflow"
description: "Enterprise customers can now use the BSR to audit, approve, and reject commits that introduce breaking changes."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/review-governance-workflow"
  - - meta
    - property: "og:title"
      content: "Audit breaking changes with the Buf Schema Registry's governance workflow"
  - - meta
    - property: "og:description"
      content: "Enterprise customers can now use the BSR to audit, approve, and reject commits that introduce breaking changes."
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6750cc02fc941e56e37122ec_Audit%20breaking%20changes.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Audit breaking changes with the Buf Schema Registry's governance workflow"
  - - meta
    - property: "twitter:description"
      content: "Enterprise customers can now use the BSR to audit, approve, and reject commits that introduce breaking changes."
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6750cc02fc941e56e37122ec_Audit%20breaking%20changes.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Audit breaking changes with the Buf Schema Registry's governance workflow

_The_ [_Buf Schema Registry_](https://buf.build/product/bsr) _(BSR) is the source of truth for your Protobuf APIs, and is the best way to share schemas across repositories, generate consistent code, and integrate Protobuf with Kafka. This launch adds the ability to govern schema evolution from a centralized place, ensuring APIs progress safely over time._

A few months ago, we added the ability for customers on our Enterprise plan to [configure breaking change policy enforcement in the BSR](/blog/breaking-change-governance/index.md), which enabled teams to prevent breaking changes from getting deployed to production clients and services.

**Today we’re extending the BSR’s ability to manage schema evolution by introducing a new _governance workflow_ which allows administrators to use the BSR to review, approve, and reject commits that introduce breaking changes. This feature is built around developers' existing git workflows, and is a post-merge safeguard to protect downstream consumers against breaking changes:**

- **Ensure breaking changes are reviewed by the right team members:** Commits that introduce breaking changes must be reviewed and approved by a module administrator — even if they've been merged in git upstream — before they are made available to downstream consumers such as generated SDKs, Buf Studio, and reflection APIs ([see our documentation](/docs/bsr/policy-checks/breaking/overview/index.md#downstream)).
- **Visibility into breaking changes:** The BSR provides a view that shows which commits contain breaking changes, whether they’ve been reviewed, and what the outcome of the reviews were, providing a paper trail of schema evolution over time.
- **Safely revert bad changes:** If a breaking change is mistakenly pushed to the BSR, the original offending git commit can be reverted and the BSR will automatically dismiss its review requirement and hide the commit from downstream consumers, thus unblocking the module for development.
- **Stay on top of reviews:** Reviewers are notified via email and through the new BSR Inbox when a breaking change requires review, and the committer is made aware of changes to their commit’s review status through the same channels.

Additional details can be found in our [documentation](/docs/bsr/policy-checks/breaking/overview/index.md).

## Reviewing commits

When an organization has breaking change enforcement enabled, if a commit that contains a breaking change is pushed to a module’s `main` branch in the BSR, the commit is automatically moved to a “Pending” state where it is unavailable to downstream consumers while it awaits review.

The BSR sends an email to the module’s administrators notifying them that there is a new commit that requires their review, and also sends a message to the new BSR Inbox:

![inbox.png](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6747a1252a572b335b5c8ab7_inbox-JW2KYPQX.png)

Commits that require approval are annotated as such in the module’s Commits tab, and a banner is prominently shown to all users indicating that the module requires attention. Module administrators are also given a prompt to “Review changes”:

![error-banner.png](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6747a12580cfdb13dbb6ffad_error-banner-OUZXBEMQ.png)

When an administrator navigates to the review flow, the commit with the breaking change — as well as any other commits that may have been stacked on top of it — are shown in a queue on the left. The first commit’s diff is shown in the center of the page, along with inline comments flagging each breaking change:

![review-flow.png](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6747a125019fdd2d648903ab_review-flow-FK6AJHDB.png)

Administrators can choose to either:

- **Approve the breaking change**, indicating that the change was deliberate and that any downstream breakages are acceptable. Approving the commit will make it available on the latest `main` branch, and it will be marked as “Approved” on the Commits tab.
- **Reject the breaking change** and continue preventing downstream consumers from accessing the commit, marking it as “Rejected” on the Commits tab. A follow-up change is usually required after this, such as reverting the bad commit in git or patching it in another way. If and when the commit is reverted and there is no longer a breaking diff between a pending commit and `main`, the BSR will automatically approve the safe commit.

If there are additional commits that require review, the administrator will be taken through each one in the order they were pushed, and the reviewer can exit the flow at any time and come back to it later without losing completed reviews. Once commits have been reviewed, the original committers will receive emails notifying them that their commits have been evaluated, and the module’s Commits tab will reflect the review state of each commit:

![overview.png](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6747a1254202f43306564e59_overview-DL5XT56Q.png)

## Get started

The BSR’s new governance workflow for breaking changes enables engineers to confidently evolve their API schemas while making it easy for API owners to audit and approve these changes, ensuring that potentially problematic commits are reviewed by the right people.

To enable this workflow in the BSR, go to your admin settings or take a look at the [documentation](/docs/bsr/policy-checks/breaking/setup/index.md) for more information. If you aren’t on our Enterprise plan today, you can check out our [pricing plans](https://buf.build/pricing/). As always, feedback and questions are welcome in the [Buf Slack](https://buf.build/b/slack/)!

‍
