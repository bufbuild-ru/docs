---

title: "FAQs - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/subscription/faq/"
  - - meta
    - property: "og:title"
      content: "FAQs - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/subscription/faq/"
  - - meta
    - property: "twitter:title"
      content: "FAQs - Buf Docs"

---

# Billing and subscription FAQ

## Billing and payments

### Where can I view my billing date?

Navigate to the **Subscription** page in your Account settings, then [View Billing Info](../manage/#view-billing-info).

### What happens if I pay for a monthly subscription and add more types?

When you add types to your organization in the middle of your billing cycle, you will be charged for the average number of types throughout your cycle. For example, if you began your billing cycle with 100 types and added 50 halfway through your billing cycle, you would be charged for 125 types.

### Can the Buf Schema Registry be used for free for open source projects?

Public repositories are and will always be free with no impact to your billing. Buf is a proud supporter of open source software and provides qualifying projects with access to Buf Schema Registry including unlimited public repositories, generated client and server libraries, and collaborators at no cost.

### What happens if my payment fails?

If your payment fails, there is a 1 billing cycle grace period, including the due date.Buf also sends an email notification with the subject `Action Required - Credit Card Payment Failed`, with an attached unpaid invoice after each failed payment attempt.Once the grace period is over and the invoice is still not paid, the subscription is downgraded to a Community plan and all paid features are disabled.

### What billing-related emails will I receive from Buf?

Buf sends the following billing-related emails:

- Confirmation of paid invoices
- Notification of payment failures
- Usage overage alerts

### How can I get a proposal to purchase a Teams or Pro plan?

For Teams and Pro plans, purchasing via credit card is currently the only option. Users interested in an Enterprise plan can contact the Buf team for a proposal and purchase order.

### Can I subscribe with a purchase order or ACH/EFT?

Customers interested in an enterprise account can contact the Buf team for a proposal and purchase order. For Teams and Pro accounts, purchasing via credit card is the only option we currently support.

### How do I get a receipt for my subscription?

Customers will receive an email invoice each billing cycle and a subscription confirmation with a link to their Organization Billing page. From here you can view invoices by clicking the **Edit Payment** button.

### How will I be billed for Buf Schema Registry?

Organizations are billed on a monthly basis, based on the pricing plan you have selected.

### Can I pay annually?

At this time we only offer annual billing on the Enterprise plan, but let us know if you’d like an annual option for Teams or Pro—we appreciate the feedback.

### Will I receive an invoice for my Buf Schema Registry subscription?

Yes, you will receive a monthly invoice for your subscription, which will be emailed to the billing email address associated with your account.

### Will I receive a prorated refund if I downgrade my pricing plan?

No, Buf doesn't offer prorated refunds for downgrading your pricing plan. Your new pricing plan will take effect immediately.

### Will I receive a prorated refund if I cancel my subscription?

No, Buf doesn't offer prorated refunds for canceled subscriptions. Your account will be downgraded immediately to the Community plan.

### What happens if I exceed the number of types allowed in my pricing tier?

Types are billed according to monthly average usage, and the cost per Type depends on the chosen plan. Usage is calculated as the average number of types within the organization over the billing cycle. Buf will send an email alert to organization administrators when usage has progressed beyond the configured usage alert threshold.

### How can I reduce my bill?

There are two methods for lowering your monthly cost: converting private repositories to public and reducing the number of types in private repositories. All plans allow for unlimited public repositories. To lower your bill, you can consider converting some private repositories to public to reduce the number of types. Alternatively, you can update private repositories to hold fewer types, lowering your monthly average cost.

### Do I need to do anything at the end of my subscription term?

No. All subscriptions are automatically renewed at the end of the term using the original form of payment.

### I have more questions regarding the new pricing, who can I reach out to?

If you have any questions that aren't covered in the FAQ, [please reach out](mailto:support@buf.build); a member of the Buf team will get back to you.

## Plan management

### Are there restrictions for private repositories?

Community plan organizations may have 1 private repository with up to 100 types. Teams and Pro organizations are entitled to unlimited private repositories with no limits to the number of types they can push.

### Are there restrictions for public repositories?

No, all plans allow for unlimited public repositories with an unlimited number of types and collaborators. We don't bill for public repositories.

### Are there plugin restrictions?

All plans can use Buf-managed plugins as part of remote plugins and generated SDKs. Pro and Enterprise organizations can create unlimited hosted custom plugins.

### What restrictions are there for the Community plan?

- You are limited to one (1) private repository. If you already have one private repository, you will not be able to create new private repositories.
- If you cancel a paid subscription, all private repositories within your account will become read-only. You can read the repositories and import them as a dependency, but not write to them.
- Your one private repository is limited to 100 types. Any private repositories with more than 100 types after downgrading will become read-only.
- Community plan limits were enforced as of May 15, 2023. Any organizations and repositories that existed prior to then are treated as if they were downgraded from a paid plan. For access to unlimited private repositories and unlimited types, please [consider upgrading](#upgrade-options).

### What upgrade options are available for the Community plan?

To take full advantage of all the BSR has to offer, there are a number of options for your organization:

- **[Upgrade to Teams](#upgrade-teams):** You will retain access to all of your existing private repositories after upgrading to our Teams plan and will gain access to all Teams features and support.
- **[Upgrade to Pro](#upgrade-pro):** You will be provisioned a private instance of the BSR, allowing you to migrate all of your existing private repositories. Please see our [migration guide](../migrate/) for more details.
- **Convert your private repositories to public repositories:** Community plan users have unlimited public repositories. You can change visibility on existing private repositories to become public repositories to retain write access. Once you have only one private repository with 100 types or less, write access will be restored for that private repository.

### How do I upgrade to a Teams plan?

Upgrading your legacy plan to a Teams plan offers you unlimited private repositories and types. For information on how to upgrade to a Teams plan, see the [How To Upgrade](../manage/#upgrade-teams) page.

### How do I upgrade to a Pro plan?

Upgrading your plan to a Pro plan includes a private instance of the BSR, custom SSO with SAML and OIDC, and a dedicated subdomain. For information on how to upgrade to a Pro plan from a legacy plan, see the [subscription management](../manage/#upgrade-pro) page.

### How do I downgrade or cancel my subscription?

If you're downgrading, first ensure that your account organization details are updated to reflect the features available in the plan you want to downgrade to. For example, if your plan includes a private BSR instance, you need to migrate your repositories to the [public BSR](https://buf.build). Depending on which plan you migrate to, you may also be subject to limits on private repositories and need to change their visibility. For more information on migrating from your private BSR instance, see [Migrating when downgrading from Pro](../migrate/#pro-downgrade).For information on what’s included in the Teams and Community plans, see the [Pricing](https://buf.build/pricing) page.To downgrade or cancel your subscription, go to the **Billing** page for your organization and click **Cancel Subscription** at the bottom of the page. If you're downgrading, resubscribe to the new plan you want.

- Teams customers will immediately be subject to [Community Plan limits](#community-limits).
- Pro customers will retain access to their private BSR instance for 1 week for the purposes of exporting data. After 1 week, the instance will be deleted.

Note: You will be invoiced for your pro-rated usage up to the cancellation date.

### Will my subscription automatically renew?

Yes, your subscription will automatically renew each month unless you cancel your subscription.

### Are there any paid plans for individual users?

Not yet—it’s something we’d like to add in the future. For now, if you want to utilize the features of our paid plans, create an organization and subscribe to a Teams or Pro plan.

## Access control

### Is it possible to enable access for our organization's IP addresses, instead of tracking and managing individual accounts for our numerous agents, users, and seats?

Our Enterprise plan includes an isolated single-tenant instance, which enables large organizations to use Buf Schema Registry across a range of diverse environments. For more information and pricing, please contact [Buf Sales](mailto:sales@buf.build).

### Do I need an account to use the Buf Schema Registry?

Yes in order to use the BSR, you will need an account. You can sign up for an individual account [here](https://buf.build/pricing). Once authenticated, you can be added as an organization member or repository collaborator.

### Do organization or repository member limits differ between the Free, Teams, and Pro plans?

No, you are able to add an unlimited number of members to an organization or repository.

### Can I download my schemas if I cancel my subscription?

Yes, you can download your data at any time by using [`buf export`](../../bsr/module/export/).

## Support

### How do I access support? Do I have any extra benefits?

Buf Teams and Pro users have access to dedicated and priority support. All Buf users, including those on the Community plan, have access to the Buf Slack channels for community support. For questions on support, or any other questions you might have, visit our [contact page](../../contact/) to find the best way to get in touch with us.
