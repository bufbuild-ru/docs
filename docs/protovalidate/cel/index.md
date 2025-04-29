---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/protovalidate/cel/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/protovalidate/quickstart/bufstream/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/migration-guides/migrate-from-protoc-gen-validate/"
  - - meta
    - property: "og:title"
      content: "Advanced CEL topics - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/protovalidate/cel/index.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/protovalidate/cel/"
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
      content: "Advanced CEL topics - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/protovalidate/cel/index.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Advanced CEL topics

Understanding how a tool works can be just as important as understanding how to use it. In this page, you'll learn more about [Common Expression Language (CEL)](https://cel.dev), an open source technology at the core of Protovalidate. It explores what CEL and its "expressions" are, who uses CEL, and how Protovalidate uses CEL.When you're finished, you should have a better understanding of CEL, be able to explain how Protovalidate works, and maybe even have ideas about using CEL in other projects.

::: tip What this page isn'tThis page is **not** a tutorial for how to write CEL-based Protovalidate rules. If that's what you're looking for, see [custom](../schemas/custom-rules/) or [predefined](../schemas/predefined-rules/) rules.

:::

## What is CEL?

CEL is a miniature programming language designed to be embedded within applications that need to evaluate, compile, and run brief "one-liners." In other words, it's a way to let other programs safely provide small pieces of code that need to run within your own.A mental model that may be helpful is to think of CEL as the runtime for a formula in a spreadsheet. The spreadsheet's author writes the formula, and "something" within the spreadsheet application executes the formula to provide a result. CEL is that "something."

## Who uses CEL?

CEL is used in popular technologies across the modern internet, proving that it's a production-worthy tool that can operate at scale.

- [Google Cloud Platform](http://cloud.google.com/) uses CEL throughout its services. If you've written expressions for conditional IAM, its Secure Web Proxy, or Firebase security rules, you've used CEL.
- In [Kubernetes](https://kubernetes.io/docs/reference/using-api/cel/), instead of using webhooks to validate custom resource definitions (CRDs), you can use CEL to validate values provided to a CRD and resources' state transitions.
- [Envoy](https://www.envoyproxy.io/) proxy lets you use CEL to declare conditions, such as authorization filters, that must be evaluated at runtime.
- The [KrakenD](https://www.krakend.io/docs/endpoints/common-expression-language-cel/) API gateway allows you to filter requests and conditionally return responses with CEL expressions.

## What's a CEL expression?

CEL's "one-liners" are expressions—code that combines constants, variables, functions, and operators to produce a value. (Expressions are the opposite of statements-code that's a valueless instruction.)One way to think of expressions is that they're the right side of an assignment. In this Go example, `this.size() > 5` is an expression:

```go
valid := this.size() > 5
```

Because CEL's syntax is C-style, its expressions are easy to read and write for anyone familiar with Go, Java, Python, C++, JavaScript, Typescript, or many other languages. Adapting the Go example above to a CEL expression, where the native CEL function `size()` returns the length of a string, the following example CEL expression returns `false` (`foo` has a length of `3`, which is less than `5`):

::: info Simple CEL expression

```text
"foo".size() > 5
```

:::

## How does CEL work?

At first glance, it's tempting to think that CEL can't scale because it appears to be dynamic. This isn't true. An application using CEL employs the CEL compiler to evaluate and compile expressions into CEL programs. This makes it simple to build a cache of already-encountered expressions or to proactively warm up a cache with a library of expressions.Let's take a look at how this works, using the prior example of checking a `string`'s length. Though implementations vary across its supported languages, they all follow the same basic workflow.First, the application compiles CEL expressions into CEL programs by:

1.  Receiving one or more CEL expressions to evaluate. In this case, it's `someString.size() > 5`.
2.  Creating a CEL environment and compiler—these are classes or types provided by the language-specific CEL implementation.
3.  Asking the CEL compiler to compile expressions, handling any compiler failures. For any expressions using variables, such as `someString`, the compiler is provided the name and type of the variable.
4.  Receiving the result of the CEL compiler (a CEL abstract syntax tree, or AST).
5.  Creating a CEL program (another class or type provided by the CEL library) based on the compiled AST.

After CEL expressions are compiled into CEL programs, the program can be provided input and run (evaluated, in CEL's terminology) at any time, returning the result of its expression.It's not too different from writing any other compiled program: the source code is compiled, turned into an executable program, and then a runtime executes the program with any provided input.For more details on how to use CEL directly, see the [CEL tutorials for Go, Java, and C++](https://cel.dev/tutorials/cel-get-started-tutorial).

## Protovalidate and CEL

### Why it uses CEL

Protovalidate is the spiritual successor to [`protoc-gen-validate` (PGV)](https://github.com/bufbuild/protoc-gen-validate), a `protoc` plugin that generates polyglot message validation functions. When developers use their Protobuf files and PGV to generate code, PGV creates idiomatic `Validate` methods for the generated types.

::: info Person proto requiring a first name with PGV-generated Validate()

```go
p := new(Person)
err := p.Validate() // err: First name is required
```

:::

Because it relies on code generation, PGV's rules have to be implemented in each supported language. When UUID was added as a well-known string rule, [the code change](https://github.com/bufbuild/protoc-gen-validate/commit/30b4f8ca30fe575a15e9f5c369c4898d53e38c4e) had to consistently implement the definition of a UUID string in Go, Java, and C++.With that it mind, you can probably guess why Protovalidate uses CEL. If CEL expressions form a way to consistently evaluate expressions across multiple languages, and you can write a library of CEL expressions for common validation cases, you can create a cross-platform validation library.Instead of defining each rule in each language, Protovalidate defines a library of CEL expressions for common rules that work across all of its supported languages.

### Where it uses CEL

Unlike `protoc-gen-validate`, Protovalidate isn't a `protoc` plugin. It doesn't rely on any code generation. The core of Protovalidate is simply [one Protobuf file](https://github.com/bufbuild/protovalidate/blob/main/proto/protovalidate/buf/validate/validate.proto) using the `proto2` syntax to define options (annotations).In `validate.proto`, you can see the definition for every standard Protovalidate rule. For example, Protovalidate doesn't have to define validation for a UUID string in Go, Java, and C++. Instead, Protovalidate stores it once as—you probably guessed it—a CEL expression:

::: info UUID definition in validate.proto

```protobuf
bool uuid = 22 [
  (predefined).cel = {
    id: "string.uuid"
    message: "value must be a valid UUID"
    expression: "!rules.uuid || this == '' || this.matches('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$')"
  }
]
```

:::

Because `uuid` is defined as a `bool` field in the `StringRules` message, this makes it easy for you to annotate any `string` field that should be a UUID, without worrying about inconsistent UUID checking across Go, Java, or other systems:

```text
message Contact {
    string name = 1 [(buf.validate.field).string.uuid = true];
}
```

Since the definition of `uuid` is part of the `StringRules` message, its backing CEL expression is compiled as part of the `Contact`'s Protobuf descriptor—the compiled schema contains all of its own validation rules within its own metadata.

### How it uses CEL

Because you've already learned [how CEL works](#how-does-cel-work), you can probably extrapolate how your application and Protovalidate use CEL.Your application:

1.  Depends on the Protovalidate library that supports its language.
2.  Creates a Protovalidate `Validator` (class or type provided the Protovalidate library).
3.  Optionally warms up the Validator's compiled CEL program cache.
4.  Asks the Validator to validate a Protobuf message by:
    1.  Using its cache of messages to look up all CEL programs that should be run for the message.
    2.  Running each program, binding either the message or each field's value as a variable named `this`.
    3.  Collecting the results of each program.
    4.  Transforming those results into the `Violation` and `Violations` messages defined by Protovalidate.
5.  Handles the idiomatic response from the Validator: Go uses an `error`, Java uses a `ValidationResult` class, etc.

::: tip It's easier than it sounds.If that sounds like a lot, and you're just interested in using Protovalidate in RPC APIs, don't fret.Buf provides quickstarts with either open-source or example interceptors that do all of this for you. They're available for [Connect and Go](../quickstart/connect-go/), [gRPC and Go](../quickstart/grpc-go/), [gRPC and Java](../quickstart/grpc-java/), and [gRPC and Python](../quickstart/grpc-python/).

:::

### What CEL unlocks

Because Protovalidate relies on CEL expressions that are compiled into schema metadata, it's not limited to using only its standard library of CEL-based validation expressions. CEL allows Protovalidate to do what no other Protobuf validation library has ever done—it lets you write your own validation expressions.

#### Custom CEL expressions

With Protovalidate, you can write your own validation rules once in your Protobuf files, and then immediately use them across any supported language.Protovalidate calls these [custom rules](../schemas/custom-rules/). Simple to implement, they're nothing more than an association of a CEL expression with a given field or message:

::: info Custom rule example

```protobuf
message SampleMessage {
  string must_be_five = 1 [(buf.validate.field).cel = {
    id: "must.be.five"
    message: "this must be five letters long"

    // A CEL expression defines the rule.
    expression: "this.size() >= 5"
  }];
}
```

:::

#### Reusable rule libraries

Protovalidate defines its [standard rules](../schemas/standard-rules/) in a Protobuf file. By extending its messages, you can do the same thing. This means you can develop organization-specific libraries of your own rules, [publish them to the Buf Schema Registry](/docs/bsr/module/publish/), and then reuse them across your enterprise.Creating these [predefined rules](../schemas/predefined-rules/) is similar to creating custom rules, using `proto2` syntax and extending Protovalidate's rule messages:

::: info Predefined rule example

```protobuf
extend buf.validate.StringRules {
  optional bool must_be_five = 80048952 [
    (buf.validate.predefined).cel = {
        id: "must.be.five"
        message: "this must be five letters long"

        // A CEL expression defines the rule.
        expression: "this.size() >= 5"
    }
  ];
}
```

:::

### CEL extensions it adds

You've already seen that CEL allows variable values to be bound at runtime. Protovalidate takes advantage of this, providing variables like `this`, `rule`, and `rules` to your CEL expressions.CEL doesn't stop with variables, however—brand-new functions and overloads can be added to CEL itself. CEL programs delegate their execution to implementations provided by the host language, binding to names and CEL types.Protovalidate leverages this to provide common validation functions that aren't built into CEL. For example, every language-specific Protovalidate implementation consistently implements `isNan()` to provide a function that you can use to check for `NaN` values. In `protovalidate-go`'s [source code](https://github.com/bufbuild/protovalidate-go/blob/main/cel/library.go), you can see this function's declaration, naming, binding to the CEL `double` type, and delegation to `math.isNaN()`:

::: info library.go (excerpt)

```go
cel.Function("isNan",
   cel.MemberOverload(
       "double_is_nan_bool",
       []*cel.Type{cel.DoubleType},
       cel.BoolType,
       cel.UnaryBinding(func(value ref.Val) ref.Val {
           num, ok := value.Value().(float64)
           if !ok {
               return types.UnsupportedRefValConversionErr(value)
           }
           return types.Bool(math.IsNaN(num))
       }),
   ),
)
```

:::

This introduces cross-platform concerns: if Go's `math.IsNaN()` follows different semantics than the type-specific `isNaN()` functions for Java's `Double` and `Float` types, consistency could suffer. Protovalidate addresses this through a suite of [conformance tests](https://github.com/bufbuild/protovalidate/blob/main/docs/conformance.md) that all supported implementations must pass.All of Protovalidate's CEL extensions are documented in the [Protovalidate reference](../../reference/protovalidate/cel_extensions/).

## What you can do with CEL

Hopefully this introduction to CEL's workings and its relationship with Protovalidate has given you not just a better understanding of Protovalidate but also added CEL itself to your toolbox. If you find yourself in a situation where you need to support simple expression evaluation across platforms, or even provide a safe runtime to end users, CEL is a well-supported, extensible choice.

## Learning more

- Learn more about using CEL with Protovalidate to write [custom](../schemas/custom-rules/) and [predefined](../schemas/predefined-rules/) rules.
- Find out how to use CEL in your own Go, Java, or C++ applications with a [CEL code lab](https://cel.dev/tutorials/cel-get-started-tutorial).
- Take a deep dive into the [CEL language reference](https://github.com/google/cel-spec/blob/master/doc/langdef.md).
