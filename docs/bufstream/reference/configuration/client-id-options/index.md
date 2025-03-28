# Client ID options

Kafka clients include an optional ID in each request that helps with logging, monitoring, and debugging. Bufstream leverages this ID to manipulate features of the cluster via options.

## Format

Client ID options are specified as `,`\- or `;`\-delimited key-value pairs appended to an optional ID. Pairs are defined as `<key>=<value>`.Valid client ID examples supported by Bufstream might look like:

```text
my-client-id,zone=us-west-2b
my-client-id;host_override=local.dev;broker_count=1
label.foo=bar,label.fizz=buzz
```

Whitespace is significant—don't add it around the delimiter or equal sign. Only use one type of delimiter within a client ID. Bufstream ignores malformed or unrecognized pairs.

## Supported options

### `zone`

\_string_When set, informs the Bufstream cluster which availability zone the client is in. Bufstream prioritizes routing the client's traffic to brokers in the same zone to [minimize inter-zone network traffic](../../../kafka-compatibility/configure-clients/#minimizing-inter-zone-network-traffic).

### `host_override`

\_string_When set, changes the hostname advertised by all brokers in the cluster to match. This can be used to connect to a running cluster via port-forwarding, usually in conjunction with [`broker_count`](#broker_count).

### `broker_count`

\_int_When set, changes how many brokers are advertised as part of the cluster. This can be used to control the number of connections a Kafka client makes. It's particularly useful for connecting to the cluster via port-forwarding in conjunction with [`host_override`](#host_override) and [connecting to Redpanda Console™](../../../integrations/redpanda-console/#basic-configuration).

### `label.<label>`

\_string_Each label pair is added as an attribute on all logs originating from the same client. For example, an option of `label.foo=bar` will be added to logs. While labels are arbitrary, they must be explicitly [enabled in the configuration](../bufstream-yaml/#buf.bufstream.config.v1alpha1.MetricsConfig.enable_labels).
