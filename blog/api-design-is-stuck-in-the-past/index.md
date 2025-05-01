---
sidebar: false
prev: false
next: false

title: "API design is stuck in the past"
description: "The industry has embraced statically typed languages, but API design remains twenty years in the past. Schema driven development presents an opportunity to pull API design into the present."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/api-design-is-stuck-in-the-past"
  - - meta
    - property: "og:title"
      content: "API design is stuck in the past"
  - - meta
    - property: "og:description"
      content: "The industry has embraced statically typed languages, but API design remains twenty years in the past. Schema driven development presents an opportunity to pull API design into the present."
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "API design is stuck in the past"
  - - meta
    - property: "twitter:description"
      content: "The industry has embraced statically typed languages, but API design remains twenty years in the past. Schema driven development presents an opportunity to pull API design into the present."
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# API design is stuck in the past

The industry has embraced statically typed languages, but API design remains twenty years in the past. Schema driven development presents an opportunity to pull API design into the present.

Two decades ago, it was widely argued that dynamic programming languages were more productive because you didn't have to spend time dealing with type signatures. The only reason, then, to use a statically typed language, was for better performance. Truth be told, at the time, this argument had some validity, and many organizations chose to move away from the Javas of the world, and towards the Pythons. But this was largely due to the specific statically typed languages in wide use, and because of a lack of tooling available at the time to support them.

By now, that tooling has become much more widely available. In fact, **the industry has learned over time that statically typed languages actually enable a whole host of new tooling possibilities, and ultimately, this tooling can drastically improve developer productivity and codebase maintainability.** Editor features like auto-complete and jump-to-definition make programmers much more productive, and are mostly only possible in statically typed languages. We see TypeScript taking off, even though it has no performance benefit over JavaScript, because it is more productive. In addition, larger code bases become easier to manage when everyone is able to have some typed reason about each others’ code, resulting in the ability to add features faster, with fewer bugs. In other words, the benefit of maintaining type signatures now well outweighs the cost.

### The status quo for APIs is still freeform

When it comes to network APIs, however, the industry is still twenty years behind. Most developers continue to rely on the path of least resistance: defining RESTful services, relying on JSON as the data format and HTTP as the transport protocol. Some feel that dynamically typed JSON, along with loosely-defined REST standards, are more productive than the alternatives, or that the learning curve associated with other API standards is too steep. Similar to dynamic languages 20 years ago, however, the status quo of API development leaves a lot of room for improvement.

API development today is overwhelmingly freeform. Fundamentally, that means that every company - and every team within every company - that claims their services are RESTful can actually have quite different API design standards. For example, naming conventions, pagination and versioning could all be radically different on one team compared to another. Often, a team might overload an object with unnecessary fields and use inconsistent data types. Unfortunately, this causes a number of problems.

### Freeform APIs can cause major problems

It’s straightforward to understand why having APIs structured differently harms service grokability. When APIs are designed differently, it’s not always obvious how the service should be used, preventing teams from quickly and confidently building applications around a new service.

Organizations do make attempts to standardize the service structure, mostly by way of API style guides. Setting a style guide is a headache in and of itself, either requiring a team to craft one or select a popular one. Teams and individuals can rarely agree on a style guide, so this decision often gets ignored and relitigated regularly in code reviews. Ultimately, even if there was internal consensus on an approach to style, there is no good way to enforce, monitor or lint APIs for adherence.

An inconsistent approach to service design and maintenance has another unintended effect: breaking changes. In a freeform API environment, you can’t fully understand the downstream impacts of making changes to the contract. This works in the opposite direction too; clients with an updated view of the world talking to servers that remain in need of an update, including during rolling updates, can send requests that servers do not understand. There isn’t a good way to work around this as an organization. You either expect that the service will consistently break users, or you develop some sort of internal process to better manage changes to the contract. **Many teams avoid making breaking changes altogether, choosing instead to only add to their API as needs change. In any case, considerable time is wasted on internal communication, APIs drift, and users still break. Ultimately, teams want and need API evolution to be more strictly governed.**

### The opportunity for schema driven development

It’s time for the industry to shift from a freeform approach to a world where all APIs are defined programmatically with schemas. Schema driven development solves many of the challenges summarized above. APIs are much easier to grok and can be relied on from day one. Organizations can set and enforce API standards across multiple teams. Service owners can make the changes they need to their service, with more structure in place to prevent breaking clients.

This is already a major improvement, but the full opportunity for schemas to improve developer productivity is much greater. Similar to the way that statically typed languages enabled new potential for tools to improve developer productivity, the major promise of schema driven development is the assets that the schema can generate automatically. This is a topic big enough to explore in another article, but suffice it to say, relying on a schema can automate all of the boilerplate code required to actually interact with services.

Today, schema driven API protocols are sometimes viewed as something you use only if performance matters. In the same way that typed languages needed tooling to support their adoption, a tooling ecosystem is needed to support the use of schema driven API protocols.

We at Buf feel that the best option available today for schema driven development is Protocol Buffers (a topic we’ll explore in a future article), and we’re hard at work building such tooling to support organizations using Protocol Buffers to define their services. We hope that with this kind of tooling, teams will look to API schemas for all-around productivity gains, and not just performance.

‍
