---
layout: home

hero:
  name: "Protobuf Editions are here: don’t panic"
---

**Most Protobuf users should ignore Editions and continue using proto3. If you become an early adopter, we’ve been working closely with Google to ensure that Buf will support editions as soon as they’re generally available.**

## Key Takeaways

- **Protobuf Editions will become generally available with the release of `protoc` 27.0.** This introduces an alternative approach to syntax-based schema semantics choices and relies more heavily on finer-grained file, message, or field-level options to opt into or out of Protobuf language features on a case-by-case basis.
- **Edition `2023` unifies `proto2` and `proto3` functionality and semantics.** The unification comes with sane and backward-compatible defaults, but users can control how their existing projects adopt it.
- **Using Editions won't alter or modify any existing wire formats or encodings.** It’s meant to aid plugin maintainers by providing an integrated feature flag system that generated APIs and runtimes may rely on.
- **We recommend sticking with `proto3` for the foreseeable future and holding off on adopting Editions early.** Before making the switch, give the support lifetimes for Editions and the migration plans some time to develop and mature.

## What are Editions?

Editions introduce a new feature flag system, powered by `option` definitions, to the Protobuf IDL. The newly introduced `edition` keyword controls how the flags behave and is available as an alternative to the `syntax` keyword. Protoc plugin maintainers can now define their own feature flag definitions and tie their default values to specific Editions, allowing for incremental adoption. This enables existing projects to decide when and how to adopt new or potentially breaking functionality.

### How frequently will Editions be declared?

Google hasn’t yet committed to a cadence for declaring new Editions, but they expect no more than one per year. New Editions will maintain forward and backward compatibility. If new default behaviors introduce unwanted changes to your project, they can be disabled using the corresponding feature flag.

It’s unclear what an edition's official support lifetime will be today, although Google has suggested it might be “[like 10 years](https://github.com/protocolbuffers/protobuf/blob/main/docs/design/editions/what-are-protobuf-editions.md#what-is-an-edition-used-for).” In general, Google doesn’t currently offer an LTS version of its `protoc` and runtimes, so as a community, we have to respond continuously to [their breaking change policy](https://protobuf.dev/support/version-support/#cadence).

### How are feature flags used?

Feature flags for Editions are expressed using [Protobuf Options](https://protobuf.dev/programming-guides/proto3/#options). All entity types can be annotated with feature flags to control generated code and runtime behaviors. For example, in Edition `2023`, [field presence default behaviors](https://protobuf.dev/editions/features/#field_presence) moved from implicit to explicit optional by default. Here’s how you’d upgrade to Editions but opt out of that and retain the default `proto3` implicit behavior:

```protobuf
- syntax = "proto3";
+ edition = "2023";

+ // The default presence behavior in Editions is now explicit (like proto2),
+ // This reverts to proto3 implicit presence per field
message Customer {
-  string name = 1;
-  string email = 2;
+  string name = 1 [features.field_presence = IMPLICIT];
+  string email = 2 [features.field_presence = IMPLICIT];
}
```

That’s a mouthful! All we’ve done here is preserve the behavior of `proto3`. Luckily, features can be declared hierarchically, which can cut down on the verbosity, like so:

```protobuf
- syntax = "proto3";
+ edition = "2023";

+ // The default presence behavior in Editions is now explicit (like proto2),
+ // This reverts to proto3 implicit presence for the whole file.
+ option features.field_presence = IMPLICIT;

message Customer {
   string name = 1;
   string email = 2;
}
```

Now this behavior would apply to all fields defined within this file. All of this is for only one facet of `proto3` implied behavior. So what would it look like to preserve all the implied behavior?

### Fully preserving `proto2` and `proto3` semantics with Editions

In a post-Editions world, `syntax = "proto3"` is a syntactical shorthand that can be equivalently expressed using all these file-level options:

```protobuf
- syntax = "proto3";
+ edition = "2023";

+ import "google/protobuf/cpp_features.proto";
+ import "google/protobuf/java_features.proto";

+ option features.field_presence = IMPLICIT;

+ // The ones below aren't strictly necessary because they are
+ // the defaults in edition 2023.
+ option features.enum_type = OPEN;
+ option features.repeated_field_encoding = PACKED;
+ option features.json_format = ALLOW;
+ option features.utf8_validation = VERIFY;
+ option features.(pb.cpp).legacy_closed_enum = false;
+ option features.(pb.go).legacy_unmarshal_json_enum = false;
+ option features.(pb.java).legacy_closed_enum = false;
```

Additionally, all `packed = false` repeated field-level options must be changed individually like so:

```protobuf
- repeated int32 bar = 1 [packed = false];
+ repeated int32 bar = 1 [features.repeated_field_encoding = EXPANDED];
```

For `proto2`, it’s much the same, just different flag values:

```protobuf
- syntax = "proto2";
+ edition = "2023";

+ import "google/protobuf/cpp_features.proto";
+ import "google/protobuf/go_features.proto";
+ import "google/protobuf/java_features.proto";

+ option features.enum_type = CLOSED;
+ option features.repeated_field_encoding = EXPANDED;
+ option features.json_format = LEGACY_BEST_EFFORT;
+ option features.utf8_validation = NONE;
+ option features.(pb.cpp).legacy_closed_enum = true;
+ option features.(pb.go).legacy_unmarshal_json_enum = true;
+ option features.(pb.java).legacy_closed_enum = true;

+ // This one isn't strictly necessary because it's
+ // the default in edition 2023.
+ option features.field_presence = EXPLICIT;
```

As one can see above, the default semantics for Edition `2023` _mostly_ match proto3 syntax, with the exception of implicit field presence.

### What problems are Editions solving?

In short, nothing really (for end users). The introduction of Editions is the result of major Google-internal refactoring of how `protoc` and its plugin architecture implements and observes feature checks when generating code. This isn’t intended to force breaking changes to existing projects, nor is it designed to impact any of the existing encodings.

It should be a boring change that gives plugin maintainers finer-grained control over how future versions of their Protobuf runtimes behave, improvements are made, and new features are introduced. Having said that, it’s impossible to ignore the explosion of verbosity that Editions has introduced to the project as a side-effect of this level of available control.

## What’s changing with Edition `2023`?

The first Edition, `2023`, focuses on unifying the functionality and semantics of the existing `proto2` and `proto3` syntax variants. This means your existing proto3 projects can now use [default field values](https://protobuf.dev/programming-guides/proto2/#optional) and [extensions](https://protobuf.dev/programming-guides/proto2/#extensions).

### Unifying implied behaviors

Before Editions, syntax variants had a number of implicit behaviors that you had to opt into wholly. This table outlines a handful of major implicit behavior differences between `proto2` and `proto3`:

Featureproto2 implied behavior

| Feature                                                                                            | proto2 implied behavior | proto3 implied behavior |
| -------------------------------------------------------------------------------------------------- | ----------------------- | ----------------------- |
| packed repeated primitives by default behavior                                                     | 🚫                      | ✅                      |
| Default values for message fields                                                                  | ✅                      | 🚫                      |
| [Extensions](https://protobuf.dev/programming-guides/proto2/#extensions) support                   | ✅                      | 🚫                      |
| required keyword support                                                                           | ✅                      | 🚫                      |
| [Groups](https://protobuf.dev/programming-guides/proto2/#groups) support                           | ✅                      | 🚫                      |
| UTF-8 string validation                                                                            | 🚫                      | ✅                      |
| Implicit optional fields                                                                           | 🚫                      | ✅                      |
| Open enum semantics                                                                                | 🚫                      | ✅                      |
| [absl::string_view](https://abseil.io/docs/cpp/guides/strings#string_view) support for C++ strings | 🚫                      | 🚫                      |

Edition `2023` also addresses a common misconception that the features that `proto3` left out were considered bad or should be avoided. This was never the case; many teams and projects inside and outside Google are still actively relying on and utilizing `proto2`\-specific functionality regularly.

### More efficient sub-message encoding

Edition `2023` introduces the ability for sub-message fields to use [Group Encoding](https://protobuf.dev/programming-guides/encoding/#groups). Although the docs say this is a deprecated feature _of the language_ (technically correct), the wire encoding of groups remains a valid and supported concept. The benefit of using group encoding for sub-messages is that wire format parsers are able to read sub-messages in a single pass without having to parse the length first. This results in more optimized performance when deserializing — a minor performance win for everyone. This won’t be on by default, but can be enabled using file or field-level features like so:

```protobuf
edition = "2023";

// Enables group encoding for sub-messages instead of length prefixed
// for all messages.
option features.message_encoding = DELIMITED

message Outer {
  message Inner {
    // ...
  }
  // Disables group encoding for this one sub-message field.
  Inner inner = 1 [features.message_encoding = LENGTH_PREFIXED]
}
```

### The `protoc` plugin protocol has changed

If you’re a maintainer of a `protoc` plugin, there are new (and currently undocumented) changes you’ll need to implement in order to take advantage of the new feature system. The scope of those changes deserve their own article that we’ll address in the near future. If you’re building plugins with Buf’s protoplugin libraries for [Go](https://github.com/bufbuild/protoplugin) or [JavaScript](https://github.com/bufbuild/protobuf-es/tree/v2/packages/protoplugin), this will be far easier for you to support shortly.

## What should you do?

If you’re happy with `proto3` (or `proto2` for that matter), just keep using it and ignore Editions for the time being. Edition `2023` doesn’t introduce new or novel functionality, and the support for the existing `proto3` and `proto2` modes within the Protobuf ecosystem will be around for effectively forever. Editions is brand new and untested outside of Google's internal business needs, and the lifetime guarantees of an Edition are still unclear. Additionally, [tooling to help large projects migrate](https://github.com/protocolbuffers/protobuf/blob/main/docs/design/prototiller/editions-tooling.md) to Editions has yet to be made available (but we're told it's coming).

If you choose to be an early adopter, Buf's compiler toolchain and products will keep working like they always do. We’ve been working extremely closely with Google to ensure we fully support Editions. We expect our full compiler toolchain to support Editions starting as soon as they’re generally available.

As the ecosystem learns more about how these new capabilities meld with existing enterprise codebases and deployments, we'll continuously codify our recommendations and best practices into our linter and breaking change detection tooling to support you.

In the meantime, nobody ever got fired for choosing `proto3`.

‍
