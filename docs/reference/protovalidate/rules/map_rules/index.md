---

title: "Map - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/protovalidate/rules/map_rules/"
  - - meta
    - property: "og:title"
      content: "Map - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/protovalidate/rules/map_rules/"
  - - meta
    - property: "twitter:title"
      content: "Map - Buf Docs"

---

# Map rules

MapRules describe the rules applied to `map` values.

## min_pairs

Specifies the minimum number of key-value pairs allowed. If the field has fewer key-value pairs than specified, an error message is generated.

::: info map.min_pairs example

```proto
message MyMap {
  // The field `value` must have at least 2 key-value pairs.
  map<string, string> value = 1 [(buf.validate.field).map.min_pairs = 2];
}
```

:::

## max_pairs

Specifies the maximum number of key-value pairs allowed. If the field has more key-value pairs than specified, an error message is generated.

::: info map.max_pairs example

```proto
message MyMap {
  // The field `value` must have at most 3 key-value pairs.
  map<string, string> value = 1 [(buf.validate.field).map.max_pairs = 3];
}
```

:::

## keys

Specifies the rules to be applied to each key in the field.

::: info map.keys example

```proto
message MyMap {
  // The keys in the field `value` must follow the specified rules.
  map<string, string> value = 1 [(buf.validate.field).map.keys = {
    string: {
      min_len: 3
      max_len: 10
    }
  }];
}
```

:::

## values

Specifies the rules to be applied to the value of each key in the field. Message values will still have their validations evaluated unless skip is specified here.

::: info map.values example

```proto
message MyMap {
  // The values in the field `value` must follow the specified rules.
  map<string, string> value = 1 [(buf.validate.field).map.values = {
    string: {
      min_len: 5
      max_len: 20
    }
  }];
}
```

:::
