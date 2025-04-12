# Using Protovalidate in Kafka with Bufstream

This tutorial shows how to add Protovalidate to a Go streaming application powered by [Bufstream](../../../bufstream/):

1.  Adding the Protovalidate dependency.
2.  Annotating Protobuf files.
3.  Regenerating code.
4.  Enabling validation in the broker.

## Prerequisites

- Install the [Buf CLI](../../../cli/). If you already have, run `buf --version` to verify that you're using at least `1.32.0`.
- Use Linux or Mac and have [`git`](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), [`go`](https://go.dev/dl/), and `make` installed and in your `$PATH`.
- Clone the `buf-examples` repo and navigate to the `protovalidate/bufstream/start` directory:

  ```console
  $ git clone git@github.com:bufbuild/buf-examples.git && cd buf-examples/protovalidate/bufstream/start
  ```

## Goal

This tutorial's Kafka producer publishes `EmailUpdated` messages that change a fictitious user's email from an old value to a new value, but it doesn't have any input validation. Your goal is to add the following validation rules using Protovalidate:

1.  Messages must provide an `id` value that's a valid UUID.
2.  Messages must provide a valid email address for the `new_email_address` field.

## Run the code

Before you begin to code, verify that the example is working. In one terminal window, start the Bufstream broker. It's the default `make` target:

::: info Broker terminal

```console
$ make
```

:::

After a little while, you should see that it has started:

::: info Broker terminal

```console
time=2025-02-18T19:46:46.368-05:00 level=INFO msg="kafka server started" host=:: port=9092 tls=false
time=2025-02-18T19:46:46.369-05:00 level=INFO msg="updating ownership" oldShardNum=0 oldShardCount=0 shardNum=0 shardCount=1
```

:::

In a second terminal window, start the producer with the `producer` target:

::: info Producer terminal

```console
$ make producer
```

:::

After a few seconds, you should see that it has started:

::: info Producer terminal

```console
time=2025-02-18T19:47:28.780-05:00 level=INFO msg="starting produce"
time=2025-02-18T19:47:34.541-05:00 level=INFO msg="produced semantically valid protobuf message" id=f00d937e-3c94-4fce-b51a-eab6c1f164fd
time=2025-02-18T19:47:34.795-05:00 level=INFO msg="produced semantically invalid protobuf message" id=53cba699-f972-4e6b-9512-4e40ff6eedf7
```

:::

In a third terminal window, start the consumer with the `consumer` target:

::: info Consumer terminal

```console
$ make consumer
```

:::

After a few seconds, you should see that it has started:

::: info Consumer terminal

```console
time=2025-02-18T19:47:56.717-05:00 level=INFO msg="starting consume"
time=2025-02-18T19:48:09.249-05:00 level=INFO msg="consumed message with new email margareterutherford@mckenzie.name and redacted old email"
time=2025-02-18T19:48:10.251-05:00 level=INFO msg="consumed message with new email bad-email-fish and redacted old email"
```

:::

Note that there's something fishy in the last log message—the new email isn't a valid address. You're about to combine Protovalidate with Bufstream's Kafka capabilities to make sure invalid messages are rejected by the broker.It's okay to use `Ctrl-C` to stop the broker, producer, and consumer before continuing.

## Explore tutorial code

This tutorial uses the example in `bufstream/start`. All filenames are relative to this directory.

### Makefile

This project's `Makefile` provides targets for downloading and running the Bufstream broker and the included Go-based producer and consumer applications.One item to note is that producer and consumer targets both specify Kafka targets, groups, and [Buf Schema Registry (BSR)-based Confluent Schema Registry](../../../bsr/kafka/overview/) URLs. When using Protovalidate in your own Bufstream-based Kafka applications, they should be configured for your equivalents.

::: info Makefile producer target

```makefile
.PHONY: producer
producer:
    go run ./cmd/bufstream-demo-produce \
      --topic email-updated \
      --group email-verifier \
      --csr-url "https://demo.buf.dev/integrations/confluent/bufstream-demo"
```

:::

### Protobuf

The project provides a Protobuf message representing a user updating their email address:

::: info proto/bufstream/demo/v1/demo.proto

```protobuf
message EmailUpdated {
  // Confluent Schema Registry (CSR) configuration for this message.
  option (buf.confluent.v1.subject) = {
    instance_name: "bufstream-demo"
    name: "email-updated-value"
  };

  // The ID of the user associated with this email address update.
  string id = 1;

  // The old email address.
  string old_email_address = 2;

  // The new email address.
  string new_email_address = 3;
}
```

:::

### YAML

When you add Protovalidate, you'll update the following files:

1.  `buf.yaml`: Protovalidate must be added as a dependency.
2.  `buf.gen.yaml`: To avoid a common issue in projects using the Buf CLI's [managed mode](../../../generate/managed-mode/), you'll see how to exclude Protovalidate from package renaming.
3.  `config/bufstream.yaml`: To inform the Bufstream broker that semantically invalid messages (messages failing Protovalidate validation) should be rejected, you'll need to enable a configuration option.

Now that you know your way around the example code, it's time to integrate Protovalidate.

## Integrate Protovalidate

It's time to add Protovalidate to your project. It may be useful to read the Protovalidate [overview](../../) and its [quickstart](../) before continuing.

### Add Protovalidate dependency

Because Protovalidate is a publicly available [Buf Schema Registry (BSR)](../../../bsr/) module, it's simple to add it to any Buf CLI project.

1.  Add Protovalidate to your Go project:

    ```console
    $ go get buf.build/gen/go/bufbuild/protovalidate/protocolbuffers/go/buf/validate
    ```

2.  Add Protovalidate as a dependency to `buf.yaml`.

    ::: info buf.yaml

    ```diff
    # buf.yaml files define how to build the .proto files within your local directory
    #
    # See https://bufbuild.ru/docs/tutorials/getting-started-with-buf-cli for more details.
    version: v2
    modules:
      # Our .proto files live within the proto directory.
      - path: proto
    deps:
      # We import "buf/confluent/v1/extensions.proto" within our example files, which
      # comes from the demo.buf.dev/bufbuild/protovalidate module.
      - buf.build/bufbuild/confluent
    + - buf.build/bufbuild/protovalidate
    ```

    :::

3.  Use any of your open terminal windows to update dependencies with the Buf CLI. You'll be warned that Protovalidate is declared but unused. That's fine.

    ::: info Updating CLI dependencies

    ```console
    $ buf dep update
    WARN    Module buf.build/bufbuild/protovalidate is declared in your buf.yaml deps but is unused...
    ```

    :::

4.  Because this example uses [managed mode](../../../generate/managed-mode/), exclude Protovalidate from any updates to `go_package`.

    ::: info buf.gen.yaml

    ```diff
    # buf.gen.yaml files define how to generate stubs using the buf generate command.
    #
    # See https://bufbuild.ru/docs/generate/tutorial for more details.
    version: v2
    managed:
      enabled: true
      override:
        - file_option: go_package_prefix
          value: github.com/bufbuild/buf-examples/protovalidate/bufstream/start
        - file_option: go_package_prefix
          module: buf.build/bufbuild/confluent
          value: buf.build/gen/go/bufbuild/confluent/protocolbuffers/go
    + disable:
    +   - file_option: go_package
    +     module: buf.build/bufbuild/protovalidate
    plugins:
      - remote: buf.build/protocolbuffers/go
        out: gen
        opt: paths=source_relative
    clean: true
    ```

    :::

5.  In any of your open terminal windows, verify that configuration is complete by running `buf generate`. It should complete with no error.

::: tip Further reading and `protoc`Learn more about incorporating Protovalidate and `protoc` support in the [Adding protovalidate](../../schemas/adding-protovalidate/) page.

:::

### Add Protovalidate rules

You'll now add [standard rules](../../schemas/standard-rules/) to `demo.proto` requiring that the `id` field is a UUID and that the `new_email_address` is a valid email address. Start by importing Protovalidate:

::: info proto/bufstream/demo/v1/demo.proto

```diff
syntax = "proto3";

// Implements types for the Bufstream demo.
package bufstream.demo.v1;

// We import extensions.proto to use a custom option that allows us to associate
// a message with a specific subject.
//
// See the https://buf.build/bufbuild/confluent module
// for the full documentation.
import "buf/confluent/v1/extensions.proto";
+ import "buf/validate/validate.proto";
```

:::

Next, add field-level validation rules:

1.  Use `string.uuid` to declare that `id` must be present and a valid UUID.
2.  Use `required` and `string.email` to validate the `new_email_address` field.

::: info proto/bufstream/demo/v1/demo.proto

```diff
message EmailUpdated {
  // Code omitted for brevity

  // The ID of the user associated with this email address update.
- string id = 1;
+ string id = 1 [
+   (buf.validate.field).string.uuid = true
+ ];

  // The old email address.
  string old_email_address = 2 [
    // When data quality enforcement is enabled, debug_redact fields can be optionally redacted
    // on a per-topic basis when records are read by producers.
    //
    // This is generally used for sensitive fields.
    debug_redact = true
  ];
  // The new email address.
- string new_email_address = 3;
+ string new_email_address = 3 [
+   (buf.validate.field).required = true,
+   (buf.validate.field).string.email = true
+ ];
}
```

:::

::: tip Learn more about [string](../../../reference/protovalidate/rules/string_rules/) and [standard](../../schemas/standard-rules/) rules.

:::

### Compile Protobuf

Next, use any terminal window to compile your Protobuf and regenerate code, adding the Protovalidate options to all of your message descriptors:

```console
$ buf generate
```

With regenerated code, your broker, producer and consumer should still build and start. (If you're still running the either, stop them with `Ctrl-c`.)Restart the broker:

::: info Broker terminal

```console
$ make
```

:::

After a little while, you should see that it has started:

::: info Broker terminal

```console
time=2025-02-19T10:32:46.909-05:00 level=INFO msg="kafka server started" host=:: port=9092 tls=false
time=2025-02-19T10:32:46.910-05:00 level=INFO msg="updating ownership" oldShardNum=0 oldShardCount=0 shardNum=0 shardCount=1
```

:::

Restart the producer:

::: info Producer terminal

```console
$ make producer
```

:::

After a few seconds, you should see that it has started:

::: info Producer terminal

```console
time=2025-02-19T10:40:47.878-05:00 level=INFO msg="starting produce"
time=2025-02-19T10:41:13.985-05:00 level=INFO msg="produced semantically valid protobuf message" id=9e253fe7-5123-413b-b010-ab4caba5142b
time=2025-02-19T10:41:14.237-05:00 level=INFO msg="produced semantically invalid protobuf message" id=8ef986cd-a865-420d-857b-05ebac436984
```

:::

In a third terminal window, start the consumer with the `consumer` target:

::: info Consumer terminal

```console
$ make consumer
```

:::

After a few seconds, you should see that it has started, but these log messages may be a surprise: the broker is still accepting updates with invalid email addresses, and the consumer still receives them.

::: info Consumer terminal

```console
time=2025-02-19T10:40:58.132-05:00 level=INFO msg="starting consume"
time=2025-02-19T10:41:14.662-05:00 level=INFO msg="consumed message with new email madgegottlieb@kunze.com and redacted old email"
time=2025-02-19T10:41:15.663-05:00 level=INFO msg="consumed message with new email bad-email-cheetah and redacted old email"
```

:::

The producer fails to reject the invalid messages because Bufstream hasn't been told to validate inbound requests.

### Add Protovalidate enforcement

Enforcing Protovalidate logic in a Bufstream broker is a simple configuration change.Follow these steps to begin enforcing Protovalidate rules in Bufstream:

1.  Stop the broker, producer, and consumer with `Ctrl-c`.
2.  Open `config/bufstream.yaml`.
3.  Make the following change to the `data_enforcement.produce` configuration, stating that validation should take place and failures should cause rejection:

    ::: info config/bufstream.yaml

    ```diff
    data_enforcement:
      schema_registries:
        - name: csr
          confluent:
            url: "https://demo.buf.dev/integrations/confluent/bufstream-demo"
            instance_name: "bufstream-demo"
      produce:
        - topics: { all: true }
          schema_registry: csr
          values:
            on_parse_error: REJECT_BATCH
    +       validation:
    +         on_error: REJECT_BATCH
    ```

    :::

Bufstream is now configured to reject messages that fail to pass your validation rules. Restart your broker:

::: info Broker terminal

```console
$ make
```

:::

After a few seconds, you should see that it has started:

::: info Broker terminal

```console
time=2025-02-19T10:45:18.607-05:00 level=INFO msg="kafka server started" host=:: port=9092 tls=false
time=2025-02-19T10:45:18.608-05:00 level=INFO msg="updating ownership" oldShardNum=0 oldShardCount=0 shardNum=0 shardCount=1
```

:::

Next, start your producer:

::: info Producer terminal

```console
$ make producer
```

:::

After a few seconds, you should see that it has started:

::: info Producer terminal

```console
time=2025-02-19T10:45:21.797-05:00 level=INFO msg="starting produce"
time=2025-02-19T10:45:23.688-05:00 level=INFO msg="produced semantically valid protobuf message" id=9e05b5fc-3c18-4c8c-a4ea-09ff161bff32
```

:::

This time, note that invalid messages are being rejected:

::: info Producer terminal

```console
time=2025-02-19T10:45:23.809-05:00 level=ERROR msg="error on produce of semantically invalid protobuf message" error="failed to produce: INVALID_RECORD: This record has failed the validation on broker and hence be rejected."
```

:::

Back in the broker's output, the details of the error are available.

::: info Broker terminal

```console
time=2025-02-19T10:45:23.808-05:00 level=ERROR msg="data enforcement error" kafka.topic.name=email-updated offset=0 error="enforcement validate error, rejecting batch: validation error:\n - new_email_address: value must be a valid email address [string.email]" action=REJECT_BATCH kafka.kafka.api.key=Produce kafka.kafka.api.version=10 kafka.correlation_id=1
```

:::

In a third terminal window, start the consumer with the `consumer` target:

::: info Consumer terminal

```console
$ make consumer
```

:::

After a few seconds, you should see that it has started and no invalid messages are received:

::: info Consumer terminal

```console
time=2025-02-19T10:45:23.926-05:00 level=INFO msg="starting consume"
time=2025-02-19T10:45:24.518-05:00 level=INFO msg="consumed message with new email fridamurphy@veum.io and redacted old email"
```

:::

You've now added Protovalidate enforcement to a Bufstream broker. All consumers can trust that only semantically valid messages are in the stream.

## Conclusion

In this tutorial, you've learned how to add Protovalidate to your Protobuf project, declare validation rules in your Protobuf files, and enable their enforcement within Bufstream.

## Further reading

- Add Protovalidate's [standard rules](../../schemas/standard-rules/) to schemas
- Use CEL expressions to declare field and message-level [custom rules](../../schemas/custom-rules/)
- Reuse logic with [predefined rules](../../schemas/predefined-rules/)
- Add Protovalidate to [Connect Go](../connect-go/)
- Add Protovalidate to gRPC with quickstarts for [gRPC and Go](../grpc-go/), [gRPC and Java](../grpc-java/), or [gRPC and Python](../grpc-python/).
