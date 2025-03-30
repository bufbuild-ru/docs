---
layout: home

hero:
  name: "Protobuf-ES is the only fully-compliant Protobuf library for JavaScript"
---

One of the promises of Protobuf is a schema-based API that works seamlessly across implementations and languages. The ability to send and receive data over application boundaries in a predictable and reliable way offers developers a confidence that they cannot achieve by using REST.

**We’re proud to share that** [**Protobuf-ES**](https://github.com/bufbuild/protobuf-es) **passes 100% of all required conformance tests and 99.8% of** [**recommended tests**](https://github.com/protocolbuffers/protobuf/blob/v22.2/conformance/binary_json_conformance_suite.cc) **from the** [**Protobuf spec**](https://protobuf.com/docs/language-spec)**. Protobuf-ES is the most conformant Protobuf library in the JavaScript ecosystem, far exceeding even the results of Google’s own `google-protobuf` JavaScript library.** These results are derived via a test suite used specifically to test the conformance of Protobuf libraries, and can be viewed via Buf’s new [Protobuf Conformance repository](https://github.com/bufbuild/protobuf-conformance):

![results](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6747c559f295a7d6d2e2e0af_conformance-results-X77GANLL.png)

# The conformance test suite

The [conformance test suite](https://github.com/protocolbuffers/protobuf/tree/main/conformance) is a series of tests created by Google containing over 2,000 tests which verify how conformant a particular implementation is when it comes to serializing and deserializing Protobuf messages. This suite is an important concept as it provides clear predictability across implementations and languages, and allows new users to confidently adopt Protobuf.

To grasp the importance of conformance tests, it first helps to understand how serialization applies to Protobuf. Protobuf supports two serialization formats:

1.  The [binary wire format](https://protobuf.dev/programming-guides/encoding/): A simple but efficient binary serialization algorithm.
2.  The [canonical JSON format](https://protobuf.dev/programming-guides/proto3#json): A well-defined mapping between Protobuf fields and JSON properties.

In [Protobuf-ES](https://github.com/bufbuild/protobuf-es), for example, all Protobuf messages implement methods to support the serialization and deserialization of the formats above: `toBinary`, `fromBinary`, `toJson` `toJsonString`, `fromJson` and `fromJsonString`.

The intent of the conformance suite is to encourage the above method implementations to behave uniformly across languages and libraries, guaranteeing that the outputs of each are well-defined and predictable. For example, one application could use Protobuf-ES for TypeScript while another uses Google’s C# Protobuf library, and they could communicate reliably without encountering serialization issues. However, although all implementations strive to behave in the same way, there is no guarantee that they do in practice. This is where the conformance test suite becomes relevant.

# Executing the test suite

The conformance test suite runs by passing a series of Protobuf messages via `stdin` to the implementation being tested. It is then up to the implementation to act accordingly and return results back to the suite runner via `stdout`. Each test in the suite consists of one [`ConformanceRequest`](https://github.com/protocolbuffers/protobuf/blob/v22.2/conformance/conformance.proto#L95) input and one [`ConformanceResponse`](https://github.com/protocolbuffers/protobuf/blob/v22.2/conformance/conformance.proto#L129) output.

The `ConformanceRequest` messages which define the test consist of either a Protobuf binary or JSON payload, the type of message represented by that payload, and a requested output format for the result (i.e., Protobuf binary or JSON).

The payloads inside the `ConformanceRequest` can be one of two types, each corresponding to either `proto2` or `proto3` syntax. The payloads are comprehensive and contain every possible permutation of a Protobuf message’s fields and values.

For example, a test may indicate the following instruction (noted in prose for clarity):

This is a Protobuf binary payload of type `proto3.TestMessages`. It should be deserialized and then returned as a JSON payload.\*

Another test may state:

This is a JSON payload of type `proto2.TestMessages` that contains invalid data. It should fail upon deserialization.\*

Finally, tests are divided into two categories: **Required** and **Recommended**. For an implementation to completely conform to the Protobuf spec, it must pass _all_ required and recommended tests.

# Conformance tests in Protobuf-ES

When we set out to create Protobuf-ES, our focus from the outset was on completeness and conformance. We believe that it is paramount for consumers to have a level of predictability when serializing and deserializing payloads. As mentioned, Protobuf-ES is 99.95% conformant, failing only one test out of over 2,000. This single test is related to `proto2` extensions, which Protobuf-ES does not support yet.

We created the [Protobuf Conformance repository](https://github.com/bufbuild/protobuf-conformance) to illustrate this further by detailing the results of running the conformance test suite against various implementations. This demonstrates at a glance how Protobuf-ES stacks up against the ecosystem.

# The importance of conformance

Many of the tested implementations are very popular in the JavaScript and TypeScript space, yet they have low conformance scores, which begs the question — how much does this actually matter? For example, Protobuf.js is around 31% compliant, yet it has over 12 million weekly downloads on NPM. So, how important is this really?

The answer is that it will become increasingly more important as Protobuf grows in adoption. It is a red flag that libraries of such massive popularity contain wildly varying approaches to serialization and deserialization. For Protobuf to reach its full potential, it has to be reliable and predictable.

Consider this real-world example: Recently, new conformance tests were added to the suite that test the serialization of the [`Duration`](https://github.com/protocolbuffers/protobuf/blob/main/src/google/protobuf/duration.proto) Well-Known Type. These new tests consequently exposed a bug in Protobuf-ES. For context, the `Duration` type has some unique rules around its JSON mapping. From the comments in the source file:

In JSON format, the Duration type is encoded as a string rather than an object, where the string ends in the suffix "s" (indicating seconds) and is preceded by the number of seconds, with nanoseconds expressed as fractional seconds. For example, 3 seconds with 0 nanoseconds should be encoded in JSON format as "3s", while 3 seconds and 1 nanosecond should be expressed in JSON format as "3.000000001s"…

Further down in the file, the rules state:

Durations less than one second are represented with a 0 `seconds` field and a positive or negative `nanos` field. For durations of one second or more, a non-zero value for the `nanos` field must be of the same sign as the `seconds` field.

To put this to practical use, a `Duration` of `{seconds: 0 nanos: -100000000}` when serialized should equal `-0.1s`. However, the `toJson` method in Protobuf-ES’ generated `Duration` type contained a bug which caused negative durations to lose their sign. Thus, the string produced after encoding was `0.1s` — a potentially huge problem. Imagine that **Service A** calculates this negative duration, incorrectly serializes it to JSON, and then sends it to **Service B**. This service reads the value as `0.1s` and happily parses it to a `Duration` of `{seconds: 0 nanos: 100000000}`, which could result in a very difficult bug to track down.

Thankfully, we run Protobuf-ES against the conformance suite as part of our CI pipeline, and these new conformance tests caused our CI to fail and allowed us to quickly remedy the issue.

Now imagine that **Service B** is using a different Protobuf implementation which also has this bug. It could then receive a correctly-serialized JSON value of `-0.1s` but erroneously decode this to a `Duration` of `{seconds: 0 nanos: 100000000}`. It’s evident that this issue could quickly snowball as a result of non-conformant libraries.

# Broadening Protobuf conformance

We are proud that Protobuf-ES passes 99.95% of the Protobuf conformance tests, and we believe it is paramount that this becomes the norm across other Protobuf libraries in the industry. To this end, we created the [Protobuf Conformance repository](https://github.com/bufbuild/protobuf-conformance) to make the testing process more accessible and to provide an easier path for other implementations to verify and improve their results. We encourage you to check it out, as well as the [Protobuf-ES project](https://github.com/bufbuild/protobuf-es). If you have any questions about conformance tests, we’re happy to connect over [Slack](https://buf.build/b/slack/)!

‍
