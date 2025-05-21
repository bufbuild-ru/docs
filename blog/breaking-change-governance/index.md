---
sidebar: false
prev: false
next: false

title: "Governance & breaking change policy enforcement for enterprises"
description: "The BSR can now enforce breaking change prevention policies across all modules."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/breaking-change-governance"
  - - meta
    - property: "og:title"
      content: "Governance & breaking change policy enforcement for enterprises"
  - - meta
    - property: "og:description"
      content: "The BSR can now enforce breaking change prevention policies across all modules."
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6750cc3fee8391dc84fb708d_Governance%20%26%20breaking.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Governance & breaking change policy enforcement for enterprises"
  - - meta
    - property: "twitter:description"
      content: "The BSR can now enforce breaking change prevention policies across all modules."
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6750cc3fee8391dc84fb708d_Governance%20%26%20breaking.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Governance & breaking change policy enforcement for enterprises

**Today we’re introducing the ability to** [**configure breaking change policy enforcement in the BSR UI**](/docs/bsr/policy-checks/breaking/index.md) **for customers on our Enterprise plan, which provides a guarantee that breaking schema changes cannot be mistakenly deployed through the BSR and cause downstream outages or data loss.**

- **Configure rules in the BSR UI:** Administrators can enable breaking change prevention and customize strictness requirements across **all** BSR organizations and modules without needing to add `buf.yaml` files to each repository.
- **Guarantee no breaking changes in production:** When breaking change prevention is active, pushes to the BSR will be rejected if their schemas contain breaking changes that are not compliant with the specified [rule set](/docs/breaking/index.md). This guarantees that no unexpected breaking changes will ever be deployed to production.
- **Automatically ignore alpha, beta, and test packages:** Sometimes it makes sense to allow breaking changes to APIs that are still in development and require frequent iteration. To assist with these workflows, BSR admins can choose to disable breaking change enforcement for packages that are versioned as alpha or beta and those used for testing.

In addition to these new features, we’re excited to share some details on other work we’re doing to provide administrators with new governance and data policy controls for Protobuf schemas.

## Breaking change policy enforcement

### Global breaking change rules

BSR admins now have a set of controls to enable breaking change prevention across their entire Enterprise instance, and to customize which set of rules should be enforced. When enabled, prevention levels can be set to [`FILE`](/docs/breaking/rules/index.md) (the default) to protect from breaking source code _and_ wire compatibility or [`WIRE_JSON`](/docs/breaking/rules/index.md) to protect from breaking _only_ wire compatibility.

Once configured, every BSR module will automatically adhere to these rules, and any attempt to push non-compliant schemas will be rejected by the BSR. These settings take precedence over any breaking change options specified in `buf.yaml` files and ensure server-wide compliance with breaking change rules:

![Admin Settings View](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6747a2a8d02fcf7e5155dcd7_admin-settings-I3GOGJGX.png)

Engineers are also able to see the rules that are being applied to their module's schemas within the BSR UI:

![Module View](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6747a2a6019fdd2d648a7aca_module-view-YQDP2UZ5.png)

To enable these settings, head over to your BSR admin settings page or check out the [documentation](/docs/bsr/policy-checks/breaking/setup/index.md). Note that this feature is only available to customers on our [Enterprise plan](https://buf.build/pricing/).

### Automatically ignore alpha, beta, and test packages

Packages that require frequent iteration and are subject to regular breaking changes, such as those still in alpha, can be opted out of breaking change enforcement by BSR admins. For example, enabling the “Allow breaking changes to unstable packages” option will allow breaking changes to be pushed to the following packages the BSR:

- `foo.bar.v1alpha1`
- `foo.bar.v1beta1`
- `foo.bar.v1test`

### Working with local `buf.yaml` configs

Local setups and CI configurations that currently leverage `buf.yaml` files to assign breaking change rules will continue to work when running `buf breaking` locally. However, the following behavior changes should be noted:

- Breaking change rules configured in the BSR will always be used when running `buf push`.
- A warning will be shown in the CLI when attempting to run `buf push` if the breaking change configuration in the local `buf.yaml` is less strict than what is being enforced by the BSR (for example, if you have `WIRE_JSON` locally and `FILE` in the BSR). A warning will also be shown if excluded files are present in the local `buf.yaml`, as exclusions cannot be specified in the BSR UI.

## More data and governance features are on the way

Instance-wide breaking change prevention is our first step toward a more comprehensive policy governance solution that we plan to offer to enterprise BSR customers. Here are a few areas we are currently investing in:

- **Breaking change review workflows:** Audit, approve, or block breaking changes as a module administrator. Teams will be able to request exceptions to breaking change policies, and breaking changes that are approved by administrators will be visually annotated.
- **Data pipeline integration:** Ensure backward compatibility of Kafka topics at build time. Teams will be able to enforce and verify that any topic entering Kafka is associated with a schema and that those schemas have been through organizational review before entering production pipelines.
- **Request validation at the network edge:** Data validation goes beyond just type safety, and it’s important to ensure that services consistently process valid client data. Adding rules to Protobuf schemas and enforcing them at the edge from an API gateway means security and compliance teams can simply sign off on schemas and have confidence that the policies will be enforced everywhere.
- **Policy-based audit logging:** Having observability into the quality and content of the data entering your services is critical to effectively debugging and mitigating incidents. We plan to provide annotations that can be added to Protobuf RPCs to automatically emit events and logs from your gateway.

If you’re interested in beta testing any of this functionality, please [let us know](https://buf.build/contact-us)!

## Get started with breaking change policy enforcement

To enable breaking change policy enforcement in the BSR, head over to your admin settings or take a look at the [documentation](/docs/bsr/policy-checks/breaking/index.md). If you aren’t on our Enterprise plan today, you can check out our [pricing plans](https://buf.build/pricing/). As always, feedback and questions are welcome in the [Buf Slack](https://buf.build/b/slack/)!

‍
