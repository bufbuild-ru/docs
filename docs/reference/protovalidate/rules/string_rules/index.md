---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/string_rules/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/sint64_rules/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/timestamp_rules/"
  - - meta
    - property: "og:title"
      content: "String - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/string_rules.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/protovalidate/rules/string_rules/"
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
      content: "String - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/rules/string_rules.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# String rules

StringRules describes the rules applied to `string` values These rules may also be applied to the `google.protobuf.StringValue` Well-Known-Type.

## const

`const` requires the field value to exactly match the specified value. If the field value doesn't match, an error message is generated.

::: info string.const example

```proto
message MyString {
  // value must equal `hello`
  string value = 1 [(buf.validate.field).string.const = "hello"];
}
```

:::

## len

`len` dictates that the field value must have the specified number of characters (Unicode code points), which may differ from the number of bytes in the string. If the field value does not meet the specified length, an error message will be generated.

::: info string.len example

```proto
message MyString {
  // value length must be 5 characters
  string value = 1 [(buf.validate.field).string.len = 5];
}
```

:::

## min_len

`min_len` specifies that the field value must have at least the specified number of characters (Unicode code points), which may differ from the number of bytes in the string. If the field value contains fewer characters, an error message will be generated.

::: info string.min_len example

```proto
message MyString {
  // value length must be at least 3 characters
  string value = 1 [(buf.validate.field).string.min_len = 3];
}
```

:::

## max_len

`max_len` specifies that the field value must have no more than the specified number of characters (Unicode code points), which may differ from the number of bytes in the string. If the field value contains more characters, an error message will be generated.

::: info string.max_len example

```proto
message MyString {
  // value length must be at most 10 characters
  string value = 1 [(buf.validate.field).string.max_len = 10];
}
```

:::

## len_bytes

`len_bytes` dictates that the field value must have the specified number of bytes. If the field value does not match the specified length in bytes, an error message will be generated.

::: info string.len_bytes example

```proto
message MyString {
  // value length must be 6 bytes
  string value = 1 [(buf.validate.field).string.len_bytes = 6];
}
```

:::

## min_bytes

`min_bytes` specifies that the field value must have at least the specified number of bytes. If the field value contains fewer bytes, an error message will be generated.

::: info string.min_bytes example

```proto
message MyString {
  // value length must be at least 4 bytes
  string value = 1 [(buf.validate.field).string.min_bytes = 4];
}
```

:::

## max_bytes

`max_bytes` specifies that the field value must have no more than the specified number of bytes. If the field value contains more bytes, an error message will be generated.

::: info string.max_bytes example

```proto
message MyString {
  // value length must be at most 8 bytes
  string value = 1 [(buf.validate.field).string.max_bytes = 8];
}
```

:::

## pattern

`pattern` specifies that the field value must match the specified regular expression (RE2 syntax), with the expression provided without any delimiters. If the field value doesn't match the regular expression, an error message will be generated.

::: info string.pattern example

```proto
message MyString {
  // value does not match regex pattern `^[a-zA-Z]//$`
  string value = 1 [(buf.validate.field).string.pattern = "^[a-zA-Z]//$"];
}
```

:::

## prefix

`prefix` specifies that the field value must have the specified substring at the beginning of the string. If the field value doesn't start with the specified prefix, an error message will be generated.

::: info string.prefix example

```proto
message MyString {
  // value does not have prefix `pre`
  string value = 1 [(buf.validate.field).string.prefix = "pre"];
}
```

:::

## suffix

`suffix` specifies that the field value must have the specified substring at the end of the string. If the field value doesn't end with the specified suffix, an error message will be generated.

::: info string.suffix example

```proto
message MyString {
  // value does not have suffix `post`
  string value = 1 [(buf.validate.field).string.suffix = "post"];
}
```

:::

## contains

`contains` specifies that the field value must have the specified substring anywhere in the string. If the field value doesn't contain the specified substring, an error message will be generated.

::: info string.contains example

```proto
message MyString {
  // value does not contain substring `inside`.
  string value = 1 [(buf.validate.field).string.contains = "inside"];
}
```

:::

## not_contains

`not_contains` specifies that the field value must not have the specified substring anywhere in the string. If the field value contains the specified substring, an error message will be generated.

::: info string.not_contains example

```proto
message MyString {
  // value contains substring `inside`.
  string value = 1 [(buf.validate.field).string.not_contains = "inside"];
}
```

:::

## in

`in` specifies that the field value must be equal to one of the specified values. If the field value isn't one of the specified values, an error message will be generated.

::: info string.in example

```proto
message MyString {
  // value must be in list ["apple", "banana"]
  string value = 1 [(buf.validate.field).string.in = "apple", (buf.validate.field).string.in = "banana"];
}
```

:::

## not_in

`not_in` specifies that the field value cannot be equal to any of the specified values. If the field value is one of the specified values, an error message will be generated.

::: info string.not_in example

```proto
message MyString {
  // value must not be in list ["orange", "grape"]
  string value = 1 [(buf.validate.field).string.not_in = "orange", (buf.validate.field).string.not_in = "grape"];
}
```

:::

## email

`email` specifies that the field value must be a valid email address, for example "foo@example.com".

Conforms to the definition for a valid email address from the [HTML standard](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address). Note that this standard willfully deviates from [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322), which allows many unexpected forms of email addresses and will easily match a typographical error.

If the field value isn't a valid email address, an error message will be generated.

::: info string.email example

```proto
message MyString {
  // value must be a valid email address
  string value = 1 [(buf.validate.field).string.email = true];
}
```

:::

## hostname

`hostname` specifies that the field value must be a valid hostname, for example "foo.example.com".

A valid hostname follows the rules below:

- The name consists of one or more labels, separated by a dot (".").
- Each label can be 1 to 63 alphanumeric characters.
- A label can contain hyphens ("-"), but must not start or end with a hyphen.
- The right-most label must not be digits only.
- The name can have a trailing dot — for example, "foo.example.com.".
- The name can be 253 characters at most, excluding the optional trailing dot.

If the field value isn't a valid hostname, an error message will be generated.

::: info string.hostname example

```proto
message MyString {
  // value must be a valid hostname
  string value = 1 [(buf.validate.field).string.hostname = true];
}
```

:::

## ip

`ip` specifies that the field value must be a valid IP (v4 or v6) address.

IPv4 addresses are expected in the dotted decimal format — for example, "192.168.5.21". IPv6 addresses are expected in their text representation — for example, "::1", or "2001:0DB8:ABCD:0012::0".

Both formats are well-defined in the internet standard [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986). Zone identifiers for IPv6 addresses (for example, "fe80::a%en1") are supported.

If the field value isn't a valid IP address, an error message will be generated.

::: info string.ip example

```proto
message MyString {
  // value must be a valid IP address
  string value = 1 [(buf.validate.field).string.ip = true];
}
```

:::

## ipv4

`ipv4` specifies that the field value must be a valid IPv4 address — for example "192.168.5.21". If the field value isn't a valid IPv4 address, an error message will be generated.

::: info string.ipv4 example

```proto
message MyString {
  // value must be a valid IPv4 address
  string value = 1 [(buf.validate.field).string.ipv4 = true];
}
```

:::

## ipv6

`ipv6` specifies that the field value must be a valid IPv6 address — for example "::1", or "d7a:115c:a1e0:ab12:4843:cd96:626b:430b". If the field value is not a valid IPv6 address, an error message will be generated.

::: info string.ipv6 example

```proto
message MyString {
  // value must be a valid IPv6 address
  string value = 1 [(buf.validate.field).string.ipv6 = true];
}
```

:::

## uri

`uri` specifies that the field value must be a valid URI, for example "https://example.com/foo/bar?baz=quux#frag".

URI is defined in the internet standard [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986). Zone Identifiers in IPv6 address literals are supported ([RFC 6874](https://datatracker.ietf.org/doc/html/rfc6874)).

If the field value isn't a valid URI, an error message will be generated.

::: info string.uri example

```proto
message MyString {
  // value must be a valid URI
  string value = 1 [(buf.validate.field).string.uri = true];
}
```

:::

## uri_ref

`uri_ref` specifies that the field value must be a valid URI Reference — either a URI such as "https://example.com/foo/bar?baz=quux#frag", or a Relative Reference such as "./foo/bar?query".

URI, URI Reference, and Relative Reference are defined in the internet standard [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986). Zone Identifiers in IPv6 address literals are supported ([RFC 6874](https://datatracker.ietf.org/doc/html/rfc6874)).

If the field value isn't a valid URI Reference, an error message will be generated.

::: info string.uri_ref example

```proto
message MyString {
  // value must be a valid URI Reference
  string value = 1 [(buf.validate.field).string.uri_ref = true];
}
```

:::

## address

`address` specifies that the field value must be either a valid hostname (for example, "example.com"), or a valid IP (v4 or v6) address (for example, "192.168.0.1", or "::1"). If the field value isn't a valid hostname or IP, an error message will be generated.

::: info string.address example

```proto
message MyString {
  // value must be a valid hostname, or ip address
  string value = 1 [(buf.validate.field).string.address = true];
}
```

:::

## uuid

`uuid` specifies that the field value must be a valid UUID as defined by [RFC 4122](https://datatracker.ietf.org/doc/html/rfc4122#section-4.1.2). If the field value isn't a valid UUID, an error message will be generated.

::: info string.uuid example

```proto
message MyString {
  // value must be a valid UUID
  string value = 1 [(buf.validate.field).string.uuid = true];
}
```

:::

## tuuid

`tuuid` (trimmed UUID) specifies that the field value must be a valid UUID as defined by [RFC 4122](https://datatracker.ietf.org/doc/html/rfc4122#section-4.1.2) with all dashes omitted. If the field value isn't a valid UUID without dashes, an error message will be generated.

::: info string.tuuid example

```proto
message MyString {
  // value must be a valid trimmed UUID
  string value = 1 [(buf.validate.field).string.tuuid = true];
}
```

:::

## ip_with_prefixlen

`ip_with_prefixlen` specifies that the field value must be a valid IP (v4 or v6) address with prefix length — for example, "192.168.5.21/16" or "2001:0DB8:ABCD:0012::F1/64". If the field value isn't a valid IP with prefix length, an error message will be generated.

::: info string.ip_with_prefixlen example

```proto
message MyString {
  // value must be a valid IP with prefix length
   string value = 1 [(buf.validate.field).string.ip_with_prefixlen = true];
}
```

:::

## ipv4_with_prefixlen

`ipv4_with_prefixlen` specifies that the field value must be a valid IPv4 address with prefix length — for example, "192.168.5.21/16". If the field value isn't a valid IPv4 address with prefix length, an error message will be generated.

::: info string.ipv4_with_prefixlen example

```proto
message MyString {
  // value must be a valid IPv4 address with prefix length
   string value = 1 [(buf.validate.field).string.ipv4_with_prefixlen = true];
}
```

:::

## ipv6_with_prefixlen

`ipv6_with_prefixlen` specifies that the field value must be a valid IPv6 address with prefix length — for example, "2001:0DB8:ABCD:0012::F1/64". If the field value is not a valid IPv6 address with prefix length, an error message will be generated.

::: info string.ipv6_with_prefixlen example

```proto
message MyString {
  // value must be a valid IPv6 address prefix length
   string value = 1 [(buf.validate.field).string.ipv6_with_prefixlen = true];
}
```

:::

## ip_prefix

`ip_prefix` specifies that the field value must be a valid IP (v4 or v6) prefix — for example, "192.168.0.0/16" or "2001:0DB8:ABCD:0012::0/64".

The prefix must have all zeros for the unmasked bits. For example, "2001:0DB8:ABCD:0012::0/64" designates the left-most 64 bits for the prefix, and the remaining 64 bits must be zero.

If the field value isn't a valid IP prefix, an error message will be generated.

::: info string.ip_prefix example

```proto
message MyString {
  // value must be a valid IP prefix
   string value = 1 [(buf.validate.field).string.ip_prefix = true];
}
```

:::

## ipv4_prefix

`ipv4_prefix` specifies that the field value must be a valid IPv4 prefix, for example "192.168.0.0/16".

The prefix must have all zeros for the unmasked bits. For example, "192.168.0.0/16" designates the left-most 16 bits for the prefix, and the remaining 16 bits must be zero.

If the field value isn't a valid IPv4 prefix, an error message will be generated.

::: info string.ipv4_prefix example

```proto
message MyString {
  // value must be a valid IPv4 prefix
   string value = 1 [(buf.validate.field).string.ipv4_prefix = true];
}
```

:::

## ipv6_prefix

`ipv6_prefix` specifies that the field value must be a valid IPv6 prefix — for example, "2001:0DB8:ABCD:0012::0/64".

The prefix must have all zeros for the unmasked bits. For example, "2001:0DB8:ABCD:0012::0/64" designates the left-most 64 bits for the prefix, and the remaining 64 bits must be zero.

If the field value is not a valid IPv6 prefix, an error message will be generated.

::: info string.ipv6_prefix example

```proto
message MyString {
  // value must be a valid IPv6 prefix
   string value = 1 [(buf.validate.field).string.ipv6_prefix = true];
}
```

:::

## host_and_port

`host_and_port` specifies that the field value must be valid host/port pair — for example, "example.com:8080".

The host can be one of:

- An IPv4 address in dotted decimal format — for example, "192.168.5.21".
- An IPv6 address enclosed in square brackets — for example, "\[2001:0DB8:ABCD:0012::F1\]".
- A hostname — for example, "example.com".

The port is separated by a colon. It must be non-empty, with a decimal number in the range of 0-65535, inclusive.

## well_known_regex

`well_known_regex` specifies a common well-known pattern defined as a regex. If the field value doesn't match the well-known regex, an error message will be generated.

::: info string.well_known_regex example

```proto
message MyString {
  // value must be a valid HTTP header value
  string value = 1 [(buf.validate.field).string.well_known_regex = KNOWN_REGEX_HTTP_HEADER_VALUE];
}
```

:::

## strict

This applies to regexes `HTTP_HEADER_NAME` and `HTTP_HEADER_VALUE` to enable strict header validation. By default, this is true, and HTTP header validations are [RFC-compliant](https://datatracker.ietf.org/doc/html/rfc7230#section-3). Setting to false will enable looser validations that only disallow `\r\n\0` characters, which can be used to bypass header matching rules.

::: info string.strict example

```proto
message MyString {
  // The field `value` must have be a valid HTTP headers, but not enforced with strict rules.
  string value = 1 [(buf.validate.field).string.strict = false];
}
```

:::

## example

`example` specifies values that the field may have. These values SHOULD conform to other rules. `example` values will not impact validation but may be used as helpful guidance on how to populate the given field.

::: info string.example example

```proto
message MyString {
  string value = 1 [
    (buf.validate.field).string.example = "hello",
    (buf.validate.field).string.example = "world"
  ];
}
```

:::
