# Oneof rules

The `OneofConstraints` message type enables you to manage constraints for oneof fields in your protobuf messages.

## required

If `required` is true, exactly one field of the oneof must be present. A validation error is returned if no fields in the oneof are present. The field itself may still be a default value; further constraints should be placed on the fields themselves to ensure they are valid values, such as `min_len` or `gt`.

::: info oneof.required example

```proto
message MyMessage {
  oneof value {
    // Either `a` or `b` must be set. If `a` is set, it must also be
    // non-empty; whereas if `b` is set, it can still be an empty string.
    option (buf.validate.oneof).required = true;
    string a = 1 [(buf.validate.field).string.min_len = 1];
    string b = 2;
  }
}
```

:::
