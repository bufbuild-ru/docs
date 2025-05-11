---
sidebar: false
prev: false
next: false

title: "Tip of the week #4: Accepting mistakes we can’t fix"
description: "Protobuf’s distributed nature introduces evolution risks that make it hard to fix some types of mistakes. Sometimes the best thing to do is to just let it be."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/totw-4-accepting-mistakes"
  - - meta
    - property: "og:title"
      content: "Tip of the week #4: Accepting mistakes we can’t fix"
  - - meta
    - property: "og:description"
      content: "Protobuf’s distributed nature introduces evolution risks that make it hard to fix some types of mistakes. Sometimes the best thing to do is to just let it be."
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6801451dcd7b966e557a47bc_totw%204.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Tip of the week #4: Accepting mistakes we can’t fix"
  - - meta
    - property: "twitter:description"
      content: "Protobuf’s distributed nature introduces evolution risks that make it hard to fix some types of mistakes. Sometimes the best thing to do is to just let it be."
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6801451dcd7b966e557a47bc_totw%204.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Tip of the week #4: Accepting mistakes we can’t fix

> _Bad humor is an evasion of reality; good humor is an acceptance of it. — Malcolm Muggeridge_

TL;DR: Protobuf’s distributed nature introduces evolution risks that make it hard to fix some types of mistakes. Sometimes the best thing to do is to just let it be.

## A different mindset

Often, you’ll design and implement a feature for the software you work on, and despite your best efforts to test it, something terrible happens in production. We have a playbook for this, though: fix the bug in your program and ship or deploy the new, fixed version to your users. It might mean working late for big emergencies, but turnaround for most organizations is a day to a week.

Most bugs aren’t emergencies, though. Sometimes a function has a confusing name, or an integer type is just a bit too small for real-world data, or an API conflates “zero” and “null”. You fix the API, refactor all usages in your API in one commit, merge, and the fix rolls out gradually.

Unless, of course, it’s a bug in a communication API, like a serialization format: your Protobuf types, or your JSON schema, or the not-too-pretty code that parses fields out of dict built from a YAML file. Here, you can’t _just_ atomically fix the world. Fixing bugs in your APIs (from here on, “APIs” means “Protobuf definitions”) requires a different mindset than fixing bugs in ordinary code.

## What are the risks?

Protobuf’s wire format is designed so that you can safely add new fields to a type, or values to an enum, without needing to perform an atomic upgrade. But other changes, like renaming fields or changing their type, are very dangerous.

This is because Protobuf types exist on a temporal axis: different versions of the same type exist simultaneously among programs in the field that are actively talking to each other. This means that _writers from the future_ (that is, new serialization code) must be careful to not confuse the many _readers from the past_ (old versions of the deserialization code). Conversely, future readers must tolerate anything past writers produce.

In a modern distributed deployment, the number of versions that exist at once can be quite large. This is true even in self-hosted clusters, but becomes much more fraught whenever user-upgradable software is involved. This can include mobile applications that talk to your servers, or appliance software managed by a third-party administrator, or even just browser-service communication.

The most important principle: you can’t easily control when old versions of a type or service are no longer relevant. As soon as a type escapes out of the scope of even a single team, upgrading types becomes a departmental effort.

## Learning to love the bomb

There are many places where Protobuf could have made schema evolution easier, but didn’t. For example, changing `int32 foo = 1;` to `sfixed32 foo = 1;` is a breakage, even though at the wire format level, it is _possible_ for a parser to distinguish and accept both forms of `foo` correctly. There too many other examples to list, but it’s important to understand that the language is not always working in our favor.

For example, if we notice a `int32` value is too small, and should have been 64-bit, you can’t upgrade it without readers from the past potentially truncating it. But we really have to upgrade it! What are our options?

1.  Issue a new version of the message and all of its dependencies. This is the main reason why sticking a version number in the package name, as enforced by Buf’s [`PACKAGE_VERSION_SUFFIX`](/docs/lint/rules/index.md#package_version_suffix) lint rule, is so important.
2.  Do the upgrade anyway and hope nothing breaks. This _can_ work for certain kinds of upgrades, if the underlying format is compatible, but it can have **disastrous consequences** if you don’t know what you’re doing, especially if it’s a type that’s not completely internal to a team’s project. [Buf breaking change detection](/docs/breaking/overview/index.md) helps you avoid changes with potential for breakage.

Of course, there is a third option, which is to accept that some things aren’t worth fixing. When the cost of a fix is so high, fixes just aren’t worth it, especially when the language is working against us.

This means that even in Buf’s own APIs, we sometimes do things in a way that isn’t quite ideal, or is inconsistent with our own best practices. Sometimes, the ecosystem changes in a way that changes best practice, but we can’t upgrade to it without breaking our users. In the same way, you shouldn’t rush to use new, better language features if they would cause protocol breaks: sometimes, the right thing is to do nothing, because not breaking your users is more important.
