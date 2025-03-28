# CEL extensions

This page documents the variables, custom functions, and overloads that Protovalidate adds to [Common Expression Language (CEL)](https://cel.dev). All [standard rules](https://github.com/bufbuild/protovalidate/blob/main/docs/standard-constraints.md) are defined in CEL expressions and often leverage these Protovalidate-specific CEL extensions.They are all available in any [custom](https://github.com/bufbuild/protovalidate/blob/main/docs/custom-constraints.md) or [predefined](https://github.com/bufbuild/protovalidate/blob/main/docs/predefined-constraints.md) rule's CEL expression unless otherwise noted.

## Variables

### this

`this` refers to the current value. When defining a [field rule](https://github.com/bufbuild/protovalidate/blob/main/docs/custom-constraints.md#field-level-constraints), `this` refers to the value of the field. When defining a [message rule](https://github.com/bufbuild/protovalidate/blob/main/docs/custom-constraints.md#message-level-constraints), `this` refers to the message itself. Its fields can be accessed via dot notation.

### now

`now` is a `google.protobuf.Timestamp`. It's computed once per expression: `now == now` always evaluates to `true`.

### rule

_Only available within [predefined rules](https://github.com/bufbuild/protovalidate/blob/main/docs/predefined-constraints.md)_.`rule` refers to the value assigned to a predefined rule when used as a field within a Protobuf message.

### rules

_Only available within [predefined rules](https://github.com/bufbuild/protovalidate/blob/main/docs/predefined-constraints.md)_.Within a predefined rule, `rules` is an instance of the underlying Protovalidate rule message being extended. For example, the `rules` variable made available to a CEL expression for a predefined rule extending `StringRules` is an instance of the StringRules message itself.

## Double functions

Protovalidate adds the following extensions functions to [CEL's `double`](https://github.com/google/cel-spec/blob/master/doc/langdef.md#numeric-values) type.

### isInf

`double.isInf() -> bool`Tests whether the double is an infinity.

### isNan

`double.isNan() -> bool`Tests whether the double is NaN. Returns `false` when `isInf()` is `true`.

## Int functions

Protovalidate adds the following extensions functions to [CEL's `int`](https://github.com/google/cel-spec/blob/master/doc/langdef.md#numeric-values) type.

### isInf

`int.isInf() -> bool`Tests whether the int is an infinity.

## String functions

Protovalidate adds the following extensions functions to [CEL's `string`](https://github.com/google/cel-spec/blob/master/doc/langdef.md#string-and-bytes-values) type.

### isEmail

`string.isEmail() -> bool`Test whether the string is a valid email address.

### isHostAndPort

`string.isHostAndPort(bool) -> bool`Test whether the string is a valid host/port pair. The single `bool` argument is required, and if it's true, the port is also required—otherwise, the port is optional.

### isHostname

`string.isHostname() -> bool`Test whether the string is a valid hostname.

### isIp

`string.isIp() -> bool`Test whether the string is a valid IP address in either IPv4 or IPv6.`string.isIp(int) -> bool`Test whether the string is a valid IP address in a specific IP version. Versions other than `0`, `4`, or `6` always return `false`.

### isIpPrefix

`string.isIpPrefix() -> bool`Test whether the string is a valid IP with prefix length.`string.isIpPrefix(int) -> bool`Test whether the string is a valid IP with prefix length in a specific IP version. Versions other than `0`, `4`, or `6` always return `false`.`string.isIpPrefix(bool) -> bool`Test whether the string is a valid IP with prefix length and an appropriate network address.`string.isIpPrefix(int, bool) -> bool`Test whether the string is a valid IP with prefix length in a specific IP version and an appropriate network address. IP versions other than `0`, `4`, or `6` always return `false`.

### isUri

`string.isUri()`Tests whether the string is a valid absolute URI.

### isUriRef

`string.isUriRef() -> bool`Tests whether the string is a valid (absolute or relative) URI.

## List functions

Protovalidate adds the following extensions functions to [CEL's `list`](https://github.com/google/cel-spec/blob/master/doc/langdef.md#aggregate-values) type.

### unique

`list.unique()`Test whether the items in the list are all unique. It can be used with lists of the following types:

- `bool`
- `bytes`
- `double`
- `int`
- `string`
- `uint`

## Overloads

Protovalidate overloads the following [CEL functions](https://github.com/google/cel-spec/blob/master/doc/langdef.md#functions):

### contains

`bytes.contains(bytes) -> bool`Overload of the CEL standard `contains` to support bytes.

### endsWith

`bytes.endsWith(bytes) -> bool`Overload of the CEL standard `endsWith` to support bytes.

### startsWith

`bytes.startsWith(bytes) -> bool`Overload of the CEL standard `startsWith` to support bytes.

## Further reading

Learn about all CEL variables and functions within its [language definition](https://github.com/google/cel-spec/blob/master/doc/langdef.md).
