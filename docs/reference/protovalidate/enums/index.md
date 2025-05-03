---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/protovalidate/enums/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/uint64_rules/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/protovalidate/cel_extensions/"
  - - meta
    - property: "og:title"
      content: "Enums - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/enums.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/protovalidate/enums/"
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
      content: "Enums - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/protovalidate/enums.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Enums

## Ignore

Specifies how FieldRules.ignore behaves. See the documentation for FieldRules.required for definitions of "populated" and "nullable".

### IGNORE_UNSPECIFIED

Validation is only skipped if it's an unpopulated nullable fields.

```proto
syntax="proto3";

message Request {
  // The uri rule applies to any value, including the empty string.
  string foo = 1 [
    (buf.validate.field).string.uri = true
  ];

  // The uri rule only applies if the field is set, including if it's
  // set to the empty string.
  optional string bar = 2 [
    (buf.validate.field).string.uri = true
  ];

  // The min_items rule always applies, even if the list is empty.
  repeated string baz = 3 [
    (buf.validate.field).repeated.min_items = 3
  ];

  // The custom CEL rule applies only if the field is set, including if
  // it's the "zero" value of that message.
  SomeMessage quux = 4 [
    (buf.validate.field).cel = {/* ... */}
  ];
}
```

### IGNORE_IF_UNPOPULATED

Validation is skipped if the field is unpopulated. This rule is redundant if the field is already nullable.

```proto
syntax="proto3

message Request {
  // The uri rule applies only if the value is not the empty string.
  string foo = 1 [
    (buf.validate.field).string.uri = true,
    (buf.validate.field).ignore = IGNORE_IF_UNPOPULATED
  ];

  // IGNORE_IF_UNPOPULATED is equivalent to IGNORE_UNSPECIFIED in this
  // case: the uri rule only applies if the field is set, including if
  // it's set to the empty string.
  optional string bar = 2 [
    (buf.validate.field).string.uri = true,
    (buf.validate.field).ignore = IGNORE_IF_UNPOPULATED
  ];

  // The min_items rule only applies if the list has at least one item.
  repeated string baz = 3 [
    (buf.validate.field).repeated.min_items = 3,
    (buf.validate.field).ignore = IGNORE_IF_UNPOPULATED
  ];

  // IGNORE_IF_UNPOPULATED is equivalent to IGNORE_UNSPECIFIED in this
  // case: the custom CEL rule applies only if the field is set, including
  // if it's the "zero" value of that message.
  SomeMessage quux = 4 [
    (buf.validate.field).cel = {/* ... */},
    (buf.validate.field).ignore = IGNORE_IF_UNPOPULATED
  ];
}
```

### IGNORE_IF_DEFAULT_VALUE

Validation is skipped if the field is unpopulated or if it is a nullable field populated with its default value. This is typically the zero or empty value, but proto2 scalars support custom defaults. For messages, the default is a non-null message with all its fields unpopulated.

```proto
syntax="proto3

message Request {
  // IGNORE_IF_DEFAULT_VALUE is equivalent to IGNORE_IF_UNPOPULATED in
  // this case; the uri rule applies only if the value is not the empty
  // string.
  string foo = 1 [
    (buf.validate.field).string.uri = true,
    (buf.validate.field).ignore = IGNORE_IF_DEFAULT_VALUE
  ];

  // The uri rule only applies if the field is set to a value other than
  // the empty string.
  optional string bar = 2 [
    (buf.validate.field).string.uri = true,
    (buf.validate.field).ignore = IGNORE_IF_DEFAULT_VALUE
  ];

  // IGNORE_IF_DEFAULT_VALUE is equivalent to IGNORE_IF_UNPOPULATED in
  // this case; the min_items rule only applies if the list has at least
  // one item.
  repeated string baz = 3 [
    (buf.validate.field).repeated.min_items = 3,
    (buf.validate.field).ignore = IGNORE_IF_DEFAULT_VALUE
  ];

  // The custom CEL rule only applies if the field is set to a value other
  // than an empty message (i.e., fields are unpopulated).
  SomeMessage quux = 4 [
    (buf.validate.field).cel = {/* ... */},
    (buf.validate.field).ignore = IGNORE_IF_DEFAULT_VALUE
  ];
}
```

This rule is affected by proto2 custom default values:

```proto
syntax="proto2";

message Request {
  // The gt rule only applies if the field is set and it's value is not
  the default (i.e., not -42). The rule even applies if the field is set
  to zero since the default value differs.
  optional int32 value = 1 [
    default = -42,
    (buf.validate.field).int32.gt = 0,
    (buf.validate.field).ignore = IGNORE_IF_DEFAULT_VALUE
  ];
}
```

### IGNORE_ALWAYS

The validation rules of this field will be skipped and not evaluated. This is useful for situations that necessitate turning off the rules of a field containing a message that may not make sense in the current context, or to temporarily disable rules during development.

```proto
message MyMessage {
  // The field's rules will always be ignored, including any validation's
  // on value's fields.
  MyOtherMessage value = 1 [
    (buf.validate.field).ignore = IGNORE_ALWAYS];
}
```

## KnownRegex

WellKnownRegex contain some well-known patterns.

### KNOWN_REGEX_UNSPECIFIED

### KNOWN_REGEX_HTTP_HEADER_NAME

HTTP header name as defined by [RFC 7230](https://datatracker.ietf.org/doc/html/rfc7230#section-3.2).

### KNOWN_REGEX_HTTP_HEADER_VALUE

HTTP header value as defined by [RFC 7230](https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.4).
