---
sidebar: false
prev: false
next: false

title: "Tip of the week #1: Field names are forever"
description: "Don’t rename fields. Even though there are a slim number of cases you can get away with it, it’s rarely worth doing, and is a potential source of bugs."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/totw-1-field-names"
  - - meta
    - property: "og:title"
      content: "Tip of the week #1: Field names are forever"
  - - meta
    - property: "og:description"
      content: "Don’t rename fields. Even though there are a slim number of cases you can get away with it, it’s rarely worth doing, and is a potential source of bugs."
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/67eeda5d61965bb4f869608a_totw1%20Field%20names.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Tip of the week #1: Field names are forever"
  - - meta
    - property: "twitter:description"
      content: "Don’t rename fields. Even though there are a slim number of cases you can get away with it, it’s rarely worth doing, and is a potential source of bugs."
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/67eeda5d61965bb4f869608a_totw1%20Field%20names.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Tip of the week #1: Field names are forever

> _I wake up every morning and grab the morning paper. Then I look at the obituary page. If my name is not on it, I get up. — Ben Franklin_

TL;DR: Don’t rename fields. Even though there are a slim number of cases where you can get away with it, it’s rarely worth doing, and is a potential source of bugs.

## Names and tags

Protobuf message fields have _field tags_ that are used in the binary wire format to discriminate fields. This means that the wire format serialization does not actually depend on the _names_ of the fields. For example, the following messages will use the exact same serialization format.

```protobuf
message Foo {
  string bar = 1;
}

message Foo2 {
  string bar2 = 1;
}
```

In fact, the designers of Protobuf intended for it to be feasible to rename an in-use field. However, they were not successful: it can still be a breaking change.

## Schema consumers need to update

If your schema is public, the generated code will change. For example, renaming a field from `first_name` to `given_name` will cause the corresponding Go accessor to change from `FirstName` to `GivenName`, potentially breaking downstream consumers.

Renaming a field to a “better” name is almost never a worthwhile change, simply because of this breakage.

## JSON serialization breaks

Wire format serialization doesn’t look at names, but JSON does! This means that `Foo` and `Foo2` above serialize as `{"bar":"content"}` and `{"bar2":"content"}`  respectively, making them non-interchangeable.

This can be partially mitigated by using the `[json_name = "..."]` option on a field. However, this doesn’t actually work, because many Protobuf runtimes’ JSON codecs will accept both the name set in `json_name`, _and_ the specified field name. So `string given_name = 1 [json_name = "firstName"];` will allow deserializing from a key named `given_name`, but not `first_name` like it used to. This is still a breaking protocol change!

This is a place where Protobuf could have done better — if `json_name` had been a `repeated string`, this wire format breakage would have been avoidable. However, for reasons given below, renames are still a bad idea.

## Reflection!

Even if you could avoid source and JSON breakages, the names are always visible to reflection. Although it’s _very_ hard to guard against reflection breakages in general (since it can even see the order fields are declared in), this is one part of reflection that can be especially insidious — for example, if callers choose to sort fields by name, or if some middleware is using the name of a field to identify its frequency, or logging/redaction needs.

Don’t change the name, because reflection means you can’t know what’ll go wrong!

## But I really have to!

There are valid reasons for wanting to rename a field, such as expanding its scope. For example, `first_name` and `given_name` are not the same concept: in the Sinosphere, as well as in Hungary, the first name in a person’s full name is their family name, not their given name.

Or maybe a field that previously referred to a monetary amount, say `cost_usd`, is being updated to not specify the currency:

```protobuf
message Before {
  sint64 cost_usd = 1;
}

message After {
  enum Currency {
    CURRENCY_UNSPECIFIED = 0;
    CURRENCY_USD = 1;
    CURRENCY_EUR = 2;
    CURRENCY_JPY = 3;
    CURRENCY_USD_1000TH = 4; // 0.1 cents.
  }

  sint64 cost = 1;
  Currency currency = 2;
}
```

In cases like this, **renaming the field is a terrible idea**. Setting aside source code or JSON breakage, the new field has completely different semantics. If an old consumer, expecting a price in USD, receives a new wire format message serialized from `{"cost":990,"currency":"CURRENCY_USD_1000TH"}`, it will incorrectly interpret the price as 990USD, rather than 0.99USD. That’s a disastrous bug!

Instead, the right plan is to add `cost` and `currency` side-by-side `cost_usd`. Then, readers should first check for `cost_usd`  when reading `cost`, and take that to imply that `currency` is `CURRENCY_USD` (it’s also worth generating an error if `cost` and `cost_usd` are both present).

`cost_usd` can then be marked as `[deprecated = true]` . It is possible to even delete `cost_usd` in some cases, such as when you control all readers and writers — but if you don’t, the risk is very high. Plus, you kind of need to be able to re-interpret `cost_usd` as the value of `cost` in perpetuity.

If you do wind up deleting them, make sure to reserve the field’s number and name, to avoid accidental re-use.

```protobuf
reserved 1;
reserved "cost_usd";
```

But try not to. Renaming fields is nothing but tears and pain.
