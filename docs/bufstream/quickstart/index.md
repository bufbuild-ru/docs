---

title: "Quickstart - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/quickstart/"
  - - meta
    - property: "og:title"
      content: "Quickstart - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/quickstart/"
  - - meta
    - property: "twitter:title"
      content: "Quickstart - Buf Docs"

---

# Bufstream quickstart

## What is Bufstream?

[Bufstream](https://buf.build/product/bufstream) is a fully self-hosted drop-in replacement for Apache Kafka® that writes data to S3-compatible object storage. It’s 100% compatible with the Kafka protocol, including support for exactly-once semantics (EOS) and transactions. Bufstream is 8x cheaper to operate, and a single cluster can elastically scale to hundreds of GB/s of throughput. It's the universal Kafka replacement for the modern age.Additionally, for teams sending Protobuf messages across their Kafka topics, Bufstream is a perfect partner. Bufstream can enforce data quality and governance requirements on the broker with [Protovalidate](https://github.com/bufbuild/protovalidate). Bufstream can directly persist records as [Apache Iceberg™](https://iceberg.apache.org/) tables, reducing time-to-insight in popular data lakehouse products such as Snowflake or ClickHouse.In this tutorial, we'll first explore Bufstream just as a Kafka replacement. Then, we'll explore Bufstream's additional capabilities when paired with Protobuf.

## Run the broker

Bufstream brokers are simple binaries. In production, a Bufstream broker needs:

- An object store, such as S3, GCS, or Azure Blob Storage.
- A metadata store, such as etcd, Postgres, Google Cloud Spanner, or Aurora.

With access to these two services, Bufstream brokers can elastically scale to meet your requirements.Bufstream brokers can also run locally for testing and CI, using your local file system as the object store, and an embedded etcd server as the metadata store. Let's get a Bufstream broker running!Download the Bufstream broker:

```bash
# Bufstream brokers are only available for Mac and Linux!

curl -sSL -o bufstream \
    "https://buf.build/dl/bufstream/latest/bufstream-$(uname -s)-$(uname -m)" && \
    chmod +x bufstream
```

Run the Bufstream broker in local mode:

```bash
./bufstream serve
```

A log line similar to this should print out (time and level fields stripped):

```console
msg="kafka server started" host=localhost port=9092 tls=false public=true
```

If so, congratulations! Bufstream is running locally at `localhost:9092`.

## Use common Kafka tools

Bufstream is a drop-in replacement for Kafka. You'll likely want to verify that by sending your own workloads to Bufstream. Here's some suggested usages with common tools to get you started.

### AKHQ

[AKHQ](https://akhq.io/) is a GUI for Kafka. Let's get a console running, and connect to Bufstream.For this example, you'll need [Docker](https://docs.docker.com/engine/install) installed and running.In a new terminal, create a configuration file for AKHQ:

```bash
# See https://akhq.io/docs for more details.

cat <<EOF >akhq.yaml
akhq:
    connections:
        bufstream:
            properties:
                bootstrap.servers: "host.docker.internal:9092"
                client.id: "akhq;broker_count=1;host_override=host.docker.internal"
EOF
```

Run AKHQ:

```bash
docker run -p 8080:8080 -v ./akhq.yaml:/app/application.yml tchiotludo/akhq:0.25.0
```

From here, you can open AKHQ in your favorite browser at `localhost:8080`. Create topics, send data to them, read data - have at it!

### Redpanda Console

[Redpanda Console™](https://docs.redpanda.com/current/console) is a web application that helps you manage, inspect, and debug Kafka-compatible workloads. Let's connect a console to Bufstream. (If you're still running AKHQ, stop it, first.)Run Redpanda Console:

```bash
docker run -p 8080:8080 \
    -e KAFKA_BROKERS=host.docker.internal:9092 \
    -e KAFKA_CLIENTID="rpconsole;broker_count=1;host_override=host.docker.internal" \
    docker.redpanda.com/redpandadata/console
```

Open Redpanda Console in your favorite browser at `localhost:8080`.It's ok to close any AKHQ or Redpanda terminals before continuing.

## Protobuf and Bufstream

Bufstream is compatible with Kafka, but it's so much more. When paired with Protobuf, Bufstream can also enforce data quality directly on the broker.We'll use code already written within [github.com/bufbuild/bufstream-demo](https://github.com/bufbuild/bufstream-demo) to publish and consume messages while exploring Bufstream's data enforcement functionality.For this example, you'll need [Go](https://go.dev/doc/install) installed. If you are on a Mac and using Homebrew, this is as easy as:

```bash
brew install go
```

We'll run all the examples here in the context of the demo repository. Stop the Bufstream broker and clone the repository:

```bash
git clone https://github.com/bufbuild/bufstream-demo.git
```

Move the broker into `bufstream-demo` then enter that directory:

```bash
mv bufstream ./bufstream-demo && \
    cd ./bufstream-demo
```

Open two more terminals in `bufstream-demo`, for a total of three:

1.  One for the broker.
2.  A second, where you'll launch producers.
3.  A third, where you'll launch consumers.

### First-class schema support

Bufstream integrates directly with any registry that implements Confluent Schema Registry API to provide first-class support for Protobuf schemas on the broker-side. Bufstream's understanding of the schema of your topic[1](#fn:1) allows it to provide some interesting functionality unavailable in other Kafka-compatible implementations.In this tutorial, we'll use the [Buf Schema Registry](../../bsr/) as our Confluent-compatible schema registry. The BSR has the ability to automatically associate Protobuf messages that it stores with subjects via a custom message option contained in the [buf.build/bufbuild/confluent](https://buf.build/bufbuild/confluent) [module](../../cli/modules-workspaces/). In the bufstream-demo example, we associate the [`EmailUpdated`](https://demo.buf.dev/bufbuild/bufstream-demo/docs/main:bufstream.demo.v1#bufstream.demo.v1.EmailUpdated) message with the `email-updated` topic (via the `email-updated-value` subject).

```protobuf
message EmailUpdated {
  option (buf.confluent.v1.subject) = {
    // The user-specified name for the Confluent Schema Registry instance within the BSR.
    //
    // Instances are managed within BSR admin settings.
    instance_name: "bufstream-demo"
    // The subject's name as determined by the subject naming strategy.
    //
    // See Confuent's documentation for more details.

    // The default subject name strategy is TopicNameStrategy, which appends either `-key` or
    // `-value` to a Kafka topic's name to create the subject name.
    name: "email-updated-value"
  };

  // The ID of the user associated with this email address update.
  string id = 1 [(buf.validate.field).string.uuid = true];
  // The old email address.
  string old_email_address = 2 [
    (buf.validate.field).string.email = true,
    (buf.validate.field).ignore = IGNORE_IF_UNPOPULATED,
    debug_redact = true
  ];
  // The new email address.
  string new_email_address = 3 [
    (buf.validate.field).required = true,
    (buf.validate.field).string.email = true
  ];
}
```

This schema is pushed to the [demo.buf.dev/bufbuild/bufstream-demo](https://demo.buf.dev/bufbuild/bufstream-demo) module. The BSR picks up the subject association, and uses the `EmailUpdated` schema for the `email-updated` topic.The BSR makes working with Protobuf schemas trivial, however Bufstream can work with the Confluent Schema Registry, and any other Confluent-compatible registry.Now that we have this association between topic and schema on the broker, let's find out what we can do with it!

### Schema enforcement and enveloping

It's often helpful to make Kafka messages self-describing, so that tools and frameworks can unmarshal, manipulate, and display them. The most common approach to making messages self-describing is to prefix the serialized message with a few extra bytes (commonly called an "envelope"). The prefix encodes the ID of the message's schema, which can then be retrieved from a schema registry. Much of the Kafka ecosystem supports this format, including most client libraries, [Kafka Connect](https://docs.confluent.io/platform/current/connect/index.html), [AKHQ](https://akhq.io/), [kSQLdb](https://ksqldb.io/), and [Snowflake's Kafka Connector](https://docs.confluent.io/cloud/current/connectors/cc-snowflake-sink/cc-snowflake-sink.html#schema-config). Before enveloping, enforcing that your payload matches your schema is an important safety concern.Typically, enforcement and enveloping is the job of producers. Producers connect to both the Confluent Schema Registry and Kafka via a fat client, which performs schema enforcement on the client-side, following with enveloping of the payload. We think this is a broken model:

- Your producer's client should be extremely simple: just post a raw message to your Kafka topic, and let the broker deal with the rest. By moving enforcement and enveloping logic to the client, you're requiring the ecosystem to maintain fat, hard-to-maintain Kafka clients across many languages. Their complexity means that language support suffers.
- Systems should never rely on client-side enforcement! Client-side enforcement is in effect "opt-in" enforcement. Producers can choose to do it or not, meaning you have no guarantees as to the quality of data sent to your consumers.

Bufstream can **enforce your schemas** and **automatically envelope** your payloads on the broker. Let's see this in action.

#### Run Bufstream in traditional Kafka mode

First, let's run Bufstream with a demo producer and consumer, where the producer talks to the Confluent Schema Registry, does enforcement and enveloping, and the consumer unenvelopes data by talking to the Confluent Schema Registry itself. This is the typical setup today.The producer publishes three types of payloads:

- An `EmailUpdated` message that passes schema enforcement and is semantically valid (see below).
- An `EmailUpdated` message that passes schema enforcement but is semantically invalid.
- An invalid message that does not conform to the `EmailUpdated` schema.

If given a CSR URL, the producer performs schema enforcement and enveloping for the `EmailUpdated` messages, while bypassing any enforcement or enveloping to produce the invalid message. If no CSR URL is provided, the producer performs no schema enforcement or enveloping at all.In the three terminals open to the `bufstream-demo` directory, run:

::: info Broker terminal

```bash
./bufstream serve
```

:::

::: info Producer terminal

```bash
go run ./cmd/bufstream-demo-produce \
  --topic email-updated \
  --group email-verifier \
  --csr-url "https://demo.buf.dev/integrations/confluent/bufstream-demo"
```

:::

::: info Consumer terminal

```bash
go run ./cmd/bufstream-demo-consume \
  --topic email-updated \
  --group email-verifier \
  --csr-url "https://demo.buf.dev/integrations/confluent/bufstream-demo"
```

:::

From the consumer, you should see something similar to the following (time and level fields stripped):

::: info Consumer terminal

```console
msg="consumed message with new email geovanyrodriguez@marks.info and old email jarvisweissnat@larkin.biz"
msg="consumed message with new email pug and old email lanestanton@swift.net"
msg="consumed malformed data" error="schema registry request failed error code: 40403: Schema not found"
msg="consumed message with new email tyrahane@schowalter.name and old email cydneyboyer@kovacek.io"
msg="consumed message with new email cattle and old email thurmannolan@rolfson.com"
msg="consumed malformed data" error="schema registry request failed error code: 40403: Schema not found"a
```

:::

This is what we'd expect: the consumer attempts to unenvelope every message, but can only do so for the two `EmailUpdated` messages.

#### Disconnect the producer from the CSR

Now, let's see what happens when we do not specify a CSR URL for the producer. This will result in the producer sending raw payloads to Bufstream, which will then send these raw payloads to the consumer. No schema enforcement or enveloping will be performed, however the consumer still expects this to have taken place. In the terminals running the producer and consumer, `ctrl+c` to kill them, and then restart the producer without the `--csr-url` flag but keep the consumer as-is:

::: info Producer terminal

```bash
go run ./cmd/bufstream-demo-produce \
  --topic email-updated \
  --group email-verifier
```

:::

::: info Consumer terminal

```bash
go run ./cmd/bufstream-demo-consume \
  --topic email-updated \
  --group email-verifier \
  --csr-url "https://demo.buf.dev/integrations/confluent/bufstream-demo"
```

:::

From the consumer, you should see something similar to the following:

::: info Consumer terminal

```console
msg="consumed malformed data" error="unknown magic byte"
msg="consumed malformed data" error="unknown magic byte"
msg="consumed malformed data" error="schema registry request failed error code: 40403: Schema not found"
```

:::

The consumer is attempting to unenvelope the data, but it is not enveloped to begin with. This results in the "unknown magic byte" error message.

#### Bufstream to the rescue

Now, let's turn on schema enforcement and enveloping on Bufstream! In the `bufstream-demo` repository, the file `config/bufstream.yaml` looks like the following:

```yaml
data_enforcement:
  schema_registries:
    - name: csr
      confluent:
        url: "https://demo.buf.dev/integrations/confluent/bufstream-demo"
        instance_name: "bufstream-demo"
  produce:
    - schema_registry: csr
      values:
        # If a record is not enveloped, automatically envelope it.
        coerce: true
        # If a record cannot be parsed, reject all records in the batch.
        on_parse_error: REJECT_BATCH
        # If a schema cannot be found, reject all records in the batch.
        on_no_schema: REJECT_BATCH
```

In your three terminals, kill your running Bufstream instance, producer and consumer, and let's put it all together: restart `bufstream` with this configuration file, the producer with no connection to the CSR, and the consumer continuing to connect to the CSR with expected enveloping:

::: info Broker terminal

```bash
./bufstream serve --config config/bufstream.yaml
```

:::

::: info Producer terminal

```bash
go run ./cmd/bufstream-demo-produce \
  --topic email-updated \
  --group email-verifier
```

:::

::: info Consumer terminal

```bash
go run ./cmd/bufstream-demo-consume \
  --topic email-updated \
  --group email-verifier \
  --csr-url "https://demo.buf.dev/integrations/confluent/bufstream-demo"
```

:::

From the producer, you should see something similar to the following:

::: info Producer terminal

```console
msg="produced semantically valid protobuf message" id=a002750d-d01f-4b82-8f29-4737153d5efe
msg="produced semantically invalid protobuf message" id=510111ab-a078-4bc8-87aa-96d71748c207
msg="error on produce of invalid data" error="failed to produce: INVALID_RECORD: This record has failed the validation on the broker and hence been rejected."
```

:::

From the consumer, you should see something similar to the following:

::: info Consumer terminal

```console
msg="consumed message with new email greencorwin@towne.org and old email darrelmedhurst@mayer.name"
msg="consumed message with new email raccoon and old email lambertturner@lebsack.com"
msg="consumed message with new email gerardoheaney@hamill.com and old email williamkovacek@klocko.org"
msg="consumed message with new email snake and old email issacgrant@simonis.biz"
```

:::

This is great! The producer sent unenveloped data, and got an error when trying to send data that did not pass schema enforcement. **The consumer only received data that passed schema enforcement, and it was automatically enveloped.** Bufstream did its job to ensure only good data reached its consumers.

### Semantic validation

Astute followers of this tutorial will notice that some messages had new email addresses that weren't valid emails:

```console
msg="consumed message with new email pug and old email lanestanton@swift.net"
```

This is because we were only enforcing that a given message sent by the producer matched the shape of the schema. The schema has `string new_email_address` and `string old_email_address`: any string will do, whether it is a valid email address, or an animal name.However, there's more to fields than just the data type. We might want to:

- Make sure that a `string email_address` field is actually an email address.
- Validate that an `age` field is always between 18 and 45.
- Check that a `name` field matches the regex `^[A-za-z]+$`.
- Validate that the field `email_address` is always set.

All of these are **semantic** properties of the field. In Kafka world today, you have no way of enforcing such properties with any schema language - all you can do is make sure that your data matches the schema shape via schema enforcement. However, we can do better.Buf has built the [Protovalidate](https://github.com/bufbuild/protovalidate) library to solve this challenge. Protovalidate allows you to add semantic properties to your fields, messages, and enums. Bufstream integrates with Protovalidate and can enforce these semantic properties on the broker, as an additional step on top of schema enforcement. Only Protobuf and Bufstream offer this capability. Let's try it out:Uncomment the following lines from `config/bufstream.yaml` in `bufstream-demo`:

```diff
-        #validation:
-          #on_error: REJECT_BATCH
+        validation:
+          on_error: REJECT_BATCH
```

Then, kill the processes and bring them back up:

::: info Broker terminal

```bash
./bufstream serve --config config/bufstream.yaml
```

:::

::: info Producer terminal

```bash
go run ./cmd/bufstream-demo-produce \
  --topic email-updated \
  --group email-verifier
```

:::

::: info Consumer terminal

```bash
go run ./cmd/bufstream-demo-consume \
  --topic email-updated \
  --group email-verifier \
  --csr-url "https://demo.buf.dev/integrations/confluent/bufstream-demo"
```

:::

From the producer:

::: info Producer terminal

```console
msg="produced semantically valid protobuf message" id=89ab6b85-c9df-4382-8f79-5ae88921da9f
msg="error on produce of semantically invalid protobuf message" error="failed to produce: INVALID_RECORD: This record has failed the validation on the broker and hence been rejected."
msg="error on produce of invalid data" error="failed to produce: INVALID_RECORD: This record has failed the validation on the broker and hence been rejected."
```

:::

From the consumer:

::: info Consumer terminal

```console
msg="consumed message with new email karianecrooks@jerde.net and old email demetriusgoyette@hintz.biz"
msg="consumed message with new email jarredfarrell@heidenreich.info and old email angusmitchell@kozey.net"
msg="consumed message with new email makaylagerlach@bradtke.net and old email gisselleheidenreich@rippin.io"
```

:::

With semantic validation enabled, the semantically invalid messages with animal names for email addresses were rejected with an error sent to the producer, and **the consumer received only semantically valid, enveloped data.**

## Wrapping up

This is only scratching the surface. Explore the Bufstream docs to learn more, and if operational simplicity, valid data, and saving a ton of money is interesting to you, [get in touch](https://buf.build/contact-us).

---

1.  Topics? Subjects? Subject naming strategies? The astute will point out that schemas are not associated with topics, rather schemas are associated with subjects, which are associated with record keys and values via their subject naming strategy. For the purposes of this tutorial, we'll assume that we are universally using the TopicNameStrategy, and are using Protobuf to represent the schema of our record values—the 99% case. Therefore, we'll assume that schemas are associated with topics. [↩](#fnref:1 "Jump back to footnote 1 in the text")
