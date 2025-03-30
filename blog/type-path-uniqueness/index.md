---
layout: home

hero:
  name: "Type & path uniqueness policy enforcement for enterprises"
---

Avoiding name conflicts between Protobuf types in an application is critical to service stability, as failing to do so will result in fatal runtime exceptions and outages. Preventing these failures can prove challenging due to the fact that these conflicts may be introduced by other module dependencies despite your own code being flawless, such as when multiple libraries provide their own copies of `google.type.Timestamp`. A detailed example is available later in this post.

**To solve this issue and improve application stability for our customers, we’re introducing a new feature in the BSR that allows customers on our Enterprise plan to enforce uniqueness of Protobuf types and file paths across all modules:**

- **Prevent outages caused by type conflicts:** Eliminate the risk of runtime exceptions and subsequent outages caused by including conflicting Protobuf type names or file paths.
- **Preclude Protobuf file vendoring:** Reject pushes to modules that copy and redeclare types such as those in `googleapis`, and ensure that there is one source of truth for every Protobuf schema across your instance.

## Enforce type uniqueness in the BSR

BSR administrators can enforce this policy across their entire instance. To enable it, they first need to execute a scan to determine whether there are any existing collisions between types that have already been pushed to the BSR:

![Policy overview](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6747a1742dd110ea8a556b37_overview-RSJJMGYP.png)

This scan will identify and list each collision so that administrators can coordinate with API owners to resolve any outstanding issues:

![Type and path collisions panel](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6747a17461505f7055cffba8_collisions-panel-SICXHE5B.png)

Once the collisions have been identified and resolved, administrators can enable uniqueness enforcement. The BSR will then reject any pushes that introduce new collisions, and the CLI will display an error. More information can be found in our [documentation](/docs/bsr/policy-checks/uniqueness/index.md).

## Example of Protobuf type conflicts in Go

Protobuf runtimes require that type declarations be universally unique, and having two types with the same name will result in a fatal runtime exception in many languages. As an example, consider two teams at a company which each define their own versions of a `company.profiles.UserProfile` message in two different modules since they each require different fields to display.

If a third team wants to aggregate information from both of the other teams' APIs and subsequently includes both of these types in their Go server, this would result in a runtime panic:

```protobuf
panic: proto: file "profiles/v1/profile.proto" has a name conflict over company.profiles.UserProfile
previously from: "company.buf.team/gen/go/team1/profileinfo/protocolbuffers/go/profiles/v1"
currently from:  "company.buf.team/gen/go/team2/profiledetails/protocolbuffers/go/profiles/v1"
```

`‍`Had the BSR’s type uniqueness policy been enabled, it would not have been possible for each team to declare their own version of the `company.profiles.UserProfile` type. This policy encourages engineers to be specific, ideally resulting in descriptive names such as `customerteam.usermanagement.v1.UserProfile` and `reportingteam.users.v1.UserProfile`.

For additional context, read more about [types](https://protobuf.com/docs/language-spec#fully-qualified-names) and [namespace conflicts](https://protobuf.dev/reference/go/faq/#namespace-conflict).

## Get started with type uniqueness enforcement

To enable type uniqueness enforcement in the BSR, go to your admin settings or take a look at our [documentation](/docs/bsr/policy-checks/uniqueness/index.md). If you aren’t on our Enterprise plan today, you can check out our [pricing plans](https://buf.build/pricing/). As always, feedback and questions are welcome in the [Buf Slack](https://buf.build/b/slack/)!

‍
