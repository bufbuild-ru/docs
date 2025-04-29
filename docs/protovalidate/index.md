---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/protovalidate/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bufstream/release-notes/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/protovalidate/quickstart/"
  - - meta
    - property: "og:title"
      content: "Overview - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/protovalidate/index.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/protovalidate/"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "og:image:type"
      content: "image/png"
  - - meta
    - property: "og:image:width"
      content: "1200"
  - - meta
    - property: "og:image:height"
      content: "630"
  - - meta
    - property: "twitter:title"
      content: "Overview - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/protovalidate/index.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Protovalidate overview

Protovalidate provides standard annotations to validate common rules on messages and fields, as well as the ability to use [CEL](https://cel.dev) to write custom rules. It's the next generation of [protoc-gen-validate](https://github.com/bufbuild/protoc-gen-validate), the only widely used validation library for Protobuf.Replacing hand-written code, [JavaScript's Yup](https://github.com/jquense/yup), [Go Validator](https://github.com/go-playground/validator), [Java Bean validation](https://beanvalidation.org/), Python's [Pydantic](https://docs.pydantic.dev/), and countless others, Protovalidate ensures consistent validation across languages and systems.

## Protovalidate in action

Consider this message requesting the creation of a new contact:

```protobuf
message AddContactRequest {
    string email_address = 1;
    string first_name = 2;
    string last_name = 3;
}
```

Protobuf guarantees type safety, but type safety doesn't solve real-world requirements:

1.  `email_address` is required and must be valid.
2.  `first_name` and `last_name` are required and each field can't be more than 50 characters long.
3.  `email_address` can't be the same as either name.

Protovalidate annotations enforce these rules easily:

```protobuf
message AddContactRequest {

    string first_name = 1 [
        (buf.validate.field).string.min_len = 1,
        (buf.validate.field).string.max_len = 50
    ];

    string last_name = 2 [
        (buf.validate.field).string.min_len = 1,
        (buf.validate.field).string.max_len = 50
    ];

    string email = 3 [
        (buf.validate.field).string.email = true
    ];

    // A dynamic rule! Its CEL expression is compiled once and evaluated
    // consistently across languages.
    option (buf.validate.message).cel = {
        id: "name.not.email"
        message: "first name and last name cannot be the same as email"
        expression: "this.first_name != this.email && this.last_name != this.email"
    };

}
```

Idiomatic Protovalidate runtimes then make it elementary to validate a message:

+++tabs key:02f86ed590437ffdb4d0e30bf7e48dc4

== Go

```go
if err = protovalidate.Validate(message); err != nil {
    // Handle failure.
}
```

== Java

```java
ValidationResult result = validator.validate(message);
if (!result.isSuccess()) {
    // Handle failure.
}
```

== Python

```python
try:
    protovalidate.validate(message)
except protovalidate.ValidationError as e:
    # Handle failure.
```

== C++

```cpp
buf::validate::Violations results = validator.Validate(message).value();
if (results.violations_size() > 0) {
    // Handle failure.
}
```

+++

::: tip Ready to code?Jump ahead to the [developer quickstart](quickstart/) to dive in.

:::

## Motivations

Even in a traditional monolith—a simple API with a browser-based frontend—validation logic is commonly repeated on the client and server. As monoliths are decomposed into microservices, publishers, consumers, and data pipelines, each passing messages to and from one another, it's increasingly difficult to ensure validation logic remains consistent.For example, a request to rebook a hypothetical canceled flight reservation may:

1.  Originate from a mobile application.
2.  Be received by a monolithic API.
3.  Be placed in a queue for processing by a microservice.
4.  Have its results distributed through multiple streaming data pipelines.

Traditionally, developers validate input at each step in this process: is the passenger locator for the flight a five-character alphanumeric string? Is the departure time within a given time window?Inevitably, validation inconsistencies cause hard-to-trace errors:

- One language's validation framework may consider a space character an empty string; another might not.
- Inclusion inconsistencies—"less than" vs. "less than or equals"—create hard-to-recreate, intermittent errors.
- Different teams may interpret requirements as slightly inconsistent regular expressions.

Protovalidate addresses these problems through schema-first development, lifting validation logic out of languages and into Protobuf schemas.

## Principles

Protovalidate is simple, consistent, and extensible. Its validation rules are defined centrally in Protobuf schemas, consistently evaluated across languages, and extended through dynamic expressions.Created by experts in the Protobuf space with decades of experience building Web-scale distributed systems, Protovalidate is free, open source, and integrates seamlessly with the Buf toolchain.

### Simplicity

You add rules to Protobuf messages and fields as straightforward annotations clearly stating their intent:

::: info First name is required, 50 characters or less, and alphanumeric.

```protobuf
message Person {
    string first_name = 1 [
        # A first_name must be provided.
        (buf.validate.field).required = true,

        # The first_name must not be longer than 50 characters.
        (buf.validate.field).string.max_len = 50,

        # Only letters are allowed.
        (buf.validate.field).string.pattern = "^[a-zA-Z]+$"
    ];
}
```

:::

### Consistency

Unlike its predecessor (`protoc-gen-validate`), Protovalidate does away with language-specific code generation that might introduce inconsistency. Protovalidate uses the [Common Expression Language (CEL)](https://cel.dev), a cross-language runtime for evaluating expressions. In CEL, `2+2` always equals `4`, and `this.size() > rules.max_len` always returns the same result.Furthermore, every Protovalidate runtime is tested against the same conformance suite, ensuring your schema-first business rules are consistently evaluated in your project's language.

### Extensibility

Validation solutions that are limited to static rules and regular expression matching are incomplete. Business requirements inevitably require considering combinations of fields or even comparisons to dynamic values, such as a point in time.In Protovalidate, your schemas can express these complex requirements through [CEL](https://cel.dev) expressions:

::: info First name and last name total length must be less than 100 characters.

```protobuf
message Person {
    option (buf.validate.message).cel = {
        id: "name.length.max"
        message: "first name and last name must be less than 100 characters"
        expression: "size(this.first_name + this.last_name) <= 100"
    };

    string first_name = 1;
    string last_name = 2;
}
```

:::

::: info Flight must depart in the future and less than 72 hours from now.

```protobuf
message FlightChangeRequest {
    google.protobuf.Timestamp departure_time = 1 [
        (buf.validate.field).timestamp.gt_now = true,
        (buf.validate.field).cel = {
            id: "departure_time.within_window"
            message: "departure time must not be more than 72 hours from now"
            expression: "this <= now + duration('72h')"
        }
    ];
}
```

:::

## Further advantages

### Uniform language support

Teams using different languages and frameworks often create different ways to represent validation failures. Different Go teams might use different validation packages, a Java team might use a JSR-380 (Bean Validation) implementation, and others might invent their own libraries.Protovalidate is schema-first: validation errors are represented in messages defined in its own Protobuf schema.Though Protovalidate provides idiomatic runtimes across supported languages, this means that all teams can rely on the same `Violations` and `Violations` APIs to represent validation failures consistently, no matter their language.

### Increased developer focus

Protovalidate ensures that developers focus on writing code serving business goals instead of reinventing validation wheels or investigating hard-to-trace bugs.If a team elects to write its own validation library, they'll inevitably face many decisions:

1.  If a string field is required, is a space allowed?
2.  Which date and time library should be used?
3.  What regular expression implementation should be used?

Teams using language-specific libraries inherit the decisions made by others. Inconsistency is inevitable and expensive to resolve.By embracing the schema-first nature of Protovalidate, all teams inherit consistent behavior, insuring data quality is uniformly enforced across distributed systems.

## Learn more

Read on to learn more about enabling schema-first validation with Protovalidate:

- See Protovalidate in action in the [developer quickstart](quickstart/).
- Learn [how to add Protovalidate to Protobuf projects](schemas/adding-protovalidate/).
- Discover [how to enforce Protovalidate rules within Kafka streams](quickstart/bufstream/).
