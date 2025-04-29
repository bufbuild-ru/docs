---

title: "Predefined rules - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/protovalidate/schemas/predefined-rules/"
  - - meta
    - property: "og:title"
      content: "Predefined rules - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/protovalidate/schemas/predefined-rules/"
  - - meta
    - property: "twitter:title"
      content: "Predefined rules - Buf Docs"

---

# Predefined rules

When your Protovalidate projects grow, you might find that the same custom rules or groups of standard rules start to be repeated. Just like you'd refactor repeated code into a function, predefined rules allow you to write these patterns once and reuse them across your project.

Code availableCompanion code for this page is available in [GitHub](https://github.com/bufbuild/buf-examples/tree/main/protovalidate/rules-predefined).

## Example case

It's normal for a large schema to reuse the same maximum lengths for strings, such as 50, 100, and 250. Such fields are often either required or optional.Consequently, Protobuf messages begin to repeat their Protovalidate rules:

::: info Repeated groups of standard rules

```protobuf
message Person {
  // first_name is required and must be 50 or fewer characters.
  string first_name = 1 [
    (buf.validate.field).string.min_len = 1,
    (buf.validate.field).string.max_len = 50
  ];
  // middle_name is optional and must be 50 or fewer characters.
  string middle_name = 2 [(buf.validate.field).string.max_len = 50];
  // last_name is required and must be 50 or fewer characters.
  string last_name = 3 [
    (buf.validate.field).string.min_len = 1,
    (buf.validate.field).string.max_len = 50
  ];
  // title is optional and can be no longer than 64 characters.
  string title = 4 [(buf.validate.field).string.max_len = 64];
}
```

:::

Instead of copying, pasting, and hoping for consistent maintenance, Protovalidate allows you to extend any standard rule message, capturing common logic once and reusing it.

## Creating predefined rules

With predefined rules, you can create two rules to address this example:

- A `string` rule for a required "medium" length string.
- A `string` rule for an optional "medium" length string.

Then, if the definition for a "medium" string changes from 50 characters to 64, you only need to make one update.

### Create a rule file

First, create a separate `.proto` file for predefined rules. It's not required, but separating services, messages, and extensions is good practice.For the example above, create a `predefined_string_rules.proto` file to store all of your predefined `string` rules:

::: info predefined_string_rules.proto

```protobuf
syntax = "proto2";

package bufbuild.people.v1;

import "buf/validate/validate.proto";
```

:::

Because predefined rules are extensions, this file must use either `proto2` syntax or Protobuf 2023 Edition. You're free to import and use them within `proto3` files.Extensions are always qualified by the package within which they're defined. In this example, it's assumed that predefined rules are defined in the same package as messages. In other cases, usage must qualify the package name of the extension. For example, `(buf.validate.field).float.(foo.bar.required_with_max)`

### Extend a rule message

Next, extend the desired standard rule message, like `StringRules`:

::: info Extending StringRules

```diff
syntax = "proto2";

package bufbuild.people.v1;

import "buf/validate/validate.proto";

+ extend buf.validate.StringRules {}
```

:::

### Define simple predefined rules

For each predefined rule you want to create, add a field to the extension that follows these guidelines:

- The field type should match the type of value for your rule. At runtime, its value is accessible within CEL expressions as a variable named `rule`.
- The field number must not conflict with any other extension of the same message across all Protobuf files in the project. See the warning at the end of this section for more information.
- The field must have an option of type `buf.validate.predefined`, which itself has a single `cel` field of type `Rule`. Its value is a custom CEL rule.

Following these guidelines, you can declare predefined `required_medium` and `optional_medium` rules to fix the example:

::: info Simple predefined string rules

```protobuf
extend buf.validate.StringRules {
  optional bool required_medium = 80048952 [(buf.validate.predefined).cel = {
    id: "string.required.medium"
    message: "this is required and must be 50 or fewer characters"
    expression: "this.size() > 0 && this.size() <= 50"
  }];
  optional bool optional_medium = 80048953 [(buf.validate.predefined).cel = {
    id: "string.optional.medium"
    message: "this must be 50 or fewer characters"
    expression: "this.size() <= 50"
  }];
}
```

:::

Field numbers must be uniqueBe mindful that extension numbers must not conflict with any other extension to the same message across all Protobuf files in a given process. This restriction also applies to projects that consume Protobuf files indirectly as dependencies. The same extension number may be re-used across different kinds of rule, e.g. 1000 in FloatRules is distinct from 1000 in Int32Rules.Extension numbers may be from 1000 to 536870911, inclusive. Values from 1000 to 99999 are reserved for [Protobuf Global Extension Registry](https://github.com/protocolbuffers/protobuf/blob/main/docs/options.md) entries, and values from 100000 to 536870911 are reserved for integers that aren't explicitly assigned. It's discouraged to use the latter range with rules that are defined in public schemas due to the risk of conflicts.

### Use predefined rules

Now that you've defined `required_medium` and `optional_medium` rules, the repetitive groups of standard rules in the `Person` message can be simplified. Be sure to import your rule file and surround the name of your extension with parentheses.

::: info Using predefined rules in messages

```protobuf
syntax = "proto3";

package bufbuild.people.v1;

import "buf/validate/validate.proto";
import "bufbuild/people/v1/predefined_string_rules.proto";

message Person {
  string first_name = 1 [(buf.validate.field).string.(required_medium) = true];
  string middle_name = 2 [(buf.validate.field).string.(optional_medium) = true];
  string last_name = 3 [(buf.validate.field).string.(required_medium) = true];
  string title = 4 [(buf.validate.field).string.(optional_medium) = true];
}
```

:::

### Define complex predefined rules

The prior example is a simple predefined rule: it doesn't use the rule's value within its CEL expression. If requirements for the `title` field changed to require a nonzero minimum length and an atypical maximum length like `64`, it'd be tempting to stop using predefined rules.Instead, you can create predefined rules that incorporate rule values into both their logic and validation messages. Building on the prior example, you can create a new `required_with_max` that:

- Uses the `rule` variable within its CEL expression to access the value assigned to the rule (`64`).
- Uses the `rules` variable within its CEL expression to resolve conflicts with other rules within the same underlying rule message.
- Returns an empty string when the field's value is valid, and a dynamic error message when validation fails.

::: info Complex predefined rule

```protobuf
extend buf.validate.StringRules {
  // Irrelevant rules omitted for brevity...
  optional int32 required_with_max = 80048954 [(buf.validate.predefined).cel = {
    id: "string.required.max"
    expression:
      "(this.size() > 0 && this.size() <= rule)"
      "? ''"
      ": 'this is required and must be ' + string(rule) + ' or fewer characters but ' + string(rules.max_len)"
  }];
}
```

:::

You can now update `title` to use the `required_with_max` rule:

::: info Using complex predefined rules in messages

```protobuf
message Person {
  // Irrelevant fields omitted for brevity...
  string title = 4 [(buf.validate.field).string.(required_with_max) = 64];
}
```

:::

Logic in predefined rules may conflict with or overlap other rules. To resolve these cases, the `rules` variable is available within a predefined rule's CEL expression. Its value is an instance of the message extended by your predefined rule.Using `rules`, the `required_with_max` rule could be updated to always pass validation whenever non-zero `min_len` and `max_len` rules are also applied to the field, delegating validation to these more specific rules:

::: info Using the rules variable

```diff
extend buf.validate.StringRules {
  // Irrelevant rules omitted for brevity...
  optional int32 required_with_max = 80048954 [(buf.validate.predefined).cel = {
    id: "string.required.max"
    expression:
-     "(this.size() > 0 && this.size() <= rule)"
+     "(rules.min_len > 0 && rules.max_len > 0) || (this.size() > 0 && this.size() <= rule)"
      "? ''"
      ": 'this is required and must be ' + string(rule) + ' or fewer characters but ' + string(rules.max_len)"
  }];
}
```

:::

## Learn more

Now that you've mastered [standard rules](../standard-rules/), [custom rules](../custom-rules/), and predefined rules, it's time to put Protovalidate to work inside your RPC APIs or Kafka streams:

- Add Protovalidate to [Connect Go](../../quickstart/connect-go/)
- Add Protovalidate to gRPC with quickstarts for [gRPC and Go](../../quickstart/grpc-go/), [gRPC and Java](../../quickstart/grpc-java/), or [gRPC and Python](../../quickstart/grpc-python/).
- Enforce Protovalidate rules in Kafka with [Bufstream](../../quickstart/bufstream/).
