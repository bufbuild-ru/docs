---
description: "How to integrate the Buf Schema Registry into Confluent-aware Kafka clients"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/csr/kafka-clients/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/csr/manage-schemas/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/documentation/overview/"
  - - meta
    - property: "og:title"
      content: "Integrate with Kafka clients - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/csr/kafka-clients.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/csr/kafka-clients/"
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
      content: "Integrate with Kafka clients - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/csr/kafka-clients.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Integrate with Kafka clients

::: warning
This feature is only available on the Enterprise plan.
:::

The BSR's Confluent Schema Registry (CSR) integration is compatible with all clients and tools that can consume the CSR API. The examples below use the official Confluent clients in [Java](https://github.com/confluentinc/schema-registry) and [Go](https://pkg.go.dev/github.com/confluentinc/confluent-kafka-go/v2). Configuration and usage may vary for third-party clients.

## Authentication and configuration

- Clients must be [authenticated](../../authentication/) against the BSR to access its Confluent Schema Registry API using a token. We recommend using a [bot user](../../admin/instance/bot-users/) per client application.
- The BSR's Confluent Schema Registry API supports any [subject name strategy](https://docs.confluent.io/platform/current/schema-registry/fundamentals/serdes-develop/index.html#subject-name-strategy), but **only supports the [default reference subject name strategy](https://docs.confluent.io/platform/current/schema-registry/fundamentals/serdes-develop/index.html#schema-references) at this time**.
- The BSR's Confluent Schema Registry API runs in the `READONLY` mode and blocks clients from auto-registering schemas or changing other configuration via the API.

## Producers

In this example, we've configured a Kafka producer to serialize and emit a message onto the `email-updated` topic using the BSR's Confluent Schema Registry. The serializer uses the default _TopicNameStrategy_ to resolve a subject name of `email-updated-value` used to look up the schema in the BSR.

```
    sequenceDiagram
        participant Kafka
        participant Producer
        participant CSR as CSR in the BSR
        Note over Producer: attempts to register schema
        Producer->>CSR: POST /subjects/{subject}/versions
        Note over CSR: check compatibility
        alt incompatible or unregistered
            CSR->>Producer: ERROR
        else compatible
            Note over CSR: return existing, valid schema ID
            CSR->>Producer: {"id": 123}
            note over Producer: cache schema ID
            Producer->>Kafka: produce {topic} {schema-id}+{data}
        end
```

+++tabs key:097d1f90186d2168d4e653218c3bbbc9

== Java

```java
package com.example.demo;

import com.google.protobuf.ByteString;
import com.example.buf.gen.demo.analytics.EmailUpdated;
import io.confluent.kafka.serializers.protobuf.KafkaProtobufSerializer;
import io.confluent.kafka.serializers.protobuf.KafkaProtobufSerializerConfig;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;

import java.nio.charset.StandardCharsets;
import java.util.Properties;
import java.util.UUID;

public class ProtobufProducer {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, KafkaProtobufSerializer.class.getName());
        props.put(KafkaProtobufSerializerConfig.AUTO_REGISTER_SCHEMAS, false);

        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "<KAFKA_HOST_AND_PORT>");
        props.put(KafkaProtobufSerializerConfig.SCHEMA_REGISTRY_URL_CONFIG, "<CSR_INSTANCE_URL>");
        props.put(KafkaProtobufSerializerConfig.BASIC_AUTH_CREDENTIALS_SOURCE, "USER_INFO");
        props.put(KafkaProtobufSerializerConfig.USER_INFO_CONFIG, "<BSR_USER>:<BSR_TOKEN>");

        try (Producer<String, EmailUpdated> producer = new KafkaProducer<>(props)) {
            String topic = "email-updated"; // corresponds to the `email-updated-value` subject using the TopicNameStrategy
            String key = "testkey";
            EmailUpdated event = EmailUpdated.newBuilder()
                .setUserId(123)
                .setPreviousEmail("previous@example.com")
                .setNewEmail("new@example.com")
                .setNewEmailVerified(true)
                .build();
            producer.send(new ProducerRecord<>(topic, key, event));
        }
    }
}
```

== Go

```go
package main

import (
    "log"
    "math/rand"
    "strconv"

    "buf.example.com/gen/demo/analytics"
    "github.com/confluentinc/confluent-kafka-go/v2/schemaregistry"
    "github.com/confluentinc/confluent-kafka-go/v2/schemaregistry/serde"
    "github.com/confluentinc/confluent-kafka-go/v2/schemaregistry/serde/protobuf"
    "github.com/confluentinc/confluent-kafka-go/v2/kafka"
)

func main() {
    serializer, err := initSerializer()
    if err != nil {
        log.Fatal(err)
    }

    producer, err := initProducer()
    if err != nil {
        log.Fatal(err)
    }

    if err = produce(serializer, producer); err != nil {
        log.Fatal(err)
    }
}

func initSerializer() (serde.Serializer, error) {
    clientConfig := schemaregistry.NewConfigWithAuthentication(
        "<CSR_INSTANCE_URL>",
        "<BUF_USER_NAME>", // [machine] user name used when generating the token
        "<BUF_TOKEN>",
    )
    client, err := schemaregistry.NewClient(clientConfig)
    if err != nil {
        return err
    }
    serializerConfig := protobuf.NewSerializerConfig()
    serializerConfig.AutoRegisterSchemas = false
    return protobuf.NewSerializer(
        client,
        serde.ValueSerde,
        serializerConfig,
    )
}

func initProducer() (*kafka.Producer, error) {
    config := &kafka.ConfigMap{
        "bootstrap.servers": "<KAFKA_HOST_AND_PORT>",
    }
    return kafka.NewProducer(config)
}

func produce(serializer serde.Serializer, producer *kafka.Producer) error {
    defer producer.Close()
    topic := "email-updated"
    event := &analytics.EmailUpdated{
        UserId: 123,
        PreviousEmail: "previous@example.com",
        NewEmail: "new@example.com",
        NewEmailVerified: true,
    }
    value, err := serializer.Serialize(topic, event)
    if err != nil {
        return err
    }
    msg := &kafka.Message{
        TopicPartition: kafka.TopicPartition{
            Topic: &topic,
            Partition: kafka.PartitionAny,
        },
        Key: []byte("testkey"),
        Value: value
    }
    delivery := make(chan kafka.Event, 1)
    if err := producer.Produce(msg, delivery); err != nil {
        return err
    }
    log.Println(<-delivery)
    return nil
}
```

+++

## Consumers

```
    sequenceDiagram
        participant Kafka
        participant Consumer
        participant CSR as CSR in the BSR
        Consumer->>Kafka: fetch {topic}
        Kafka->>Consumer: {schema-id}+{data}
        Consumer->>CSR: GET /schemas/{schema-id}
        CSR->>Consumer: {"schema": "..."}
        note over Consumer: cache schema<br>& process messages
```

+++tabs key:097d1f90186d2168d4e653218c3bbbc9

== Java

The Java deserializer supports decoding into either concrete messages (like those used in the producer example above) or dynamic messages constructed from the schema resolved from the BSR's Confluent Schema Registry. The example below uses a [`DynamicMessage`](https://protobuf.dev/reference/java/api-docs/com/google/protobuf/DynamicMessage):

```java
package com.example.demo;

import com.google.protobuf.DynamicMessage;
import io.confluent.kafka.serializers.protobuf.KafkaProtobufDeserializer;
import io.confluent.kafka.serializers.protobuf.KafkaProtobufDeserializerConfig;
import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.StringDeserializer;

import java.time.Duration;
import java.util.Collections;
import java.util.Properties;

public class ProtobufConsumer {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "<KAFKA_HOST_AND_PORT>");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, KafkaProtobufDeserializer.class.getName());
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "demo");
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        props.put(KafkaProtobufDeserializerConfig.SCHEMA_REGISTRY_URL_CONFIG, "<CSR_INSTANCE_URL>");
        props.put(KafkaProtobufDeserializerConfig.BASIC_AUTH_CREDENTIALS_SOURCE, "USER_INFO");
        props.put(KafkaProtobufDeserializerConfig.USER_INFO_CONFIG, "<BSR_USER>:<BSR_TOKEN>");

        try (Consumer<String, DynamicMessage> consumer = new KafkaConsumer<>(props)) {
            String topic = "email-updated";
            consumer.subscribe(Collections.singletonList(topic));
            ConsumerRecords<String, DynamicMessage> records = consumer.poll(Duration.ofMillis(10_000));
            for (ConsumerRecord<String, DynamicMessage> record : records) {
                System.out.printf("Consumed event from topic %s: key %s -> value %s%n", topic, record.key(), record.value());
            }
        }
    }
}
```

== Go

The Go deserializer needs to be able to find the concrete types in its registry. We recommend attaching the [`protoregistry.GlobalTypes`](https://pkg.go.dev/google.golang.org/protobuf/reflect/protoregistry#GlobalTypes) to the deserializer.

```go
package main

import (
    "log"

    // required to register the types in protoregistry.GlobalTypes
    _ "buf.example.com/gen/demo/analytics"

    "github.com/confluentinc/confluent-kafka-go/v2/schemaregistry"
    "github.com/confluentinc/confluent-kafka-go/v2/schemaregistry/serde"
    "github.com/confluentinc/confluent-kafka-go/v2/schemaregistry/serde/protobuf"
    "github.com/confluentinc/confluent-kafka-go/v2/kafka"
    "google.golang.org/protobuf/reflect/protoregistry"
)

func main() {
    deserializer, err := initDeserializer()
    if err != nil {
        log.Fatal(err)
    }

    consumer, err := initConsumer()
    if err != nil {
        log.Fatal(err)
    }

    if err = consume(deserializer, consumer); err != nil {
        log.Fatal(err)
    }
}

func initDeserializer() (serde.Deserializer, error) {
    clientConfig := schemaregistry.NewConfigWithAuthentication(
        "<CSR_INSTANCE_URL>",
        "<BUF_USER_NAME>", // [machine] user name used when generating the token
        "<BUF_TOKEN>",
    )
    client, err := schemaregistry.NewClient(clientConfig)
    if err != nil {
        return err
    }
    deserializer, err := protobuf.NewDeserializer(
        client,
        serde.ValueSerde,
        protobuf.NewDeserializerConfig(),
    )
    if err != nil {
        return err
    }
    deserializer.ProtoRegistry = protoregistry.GlobalTypes
    return deserializer, nil
}

func initConsumer() (*kafka.Consumer, error) {
    config := &kafka.ConfigMap{
        "bootstrap.servers": "<KAFKA_HOST_AND_PORT>",
        "group.id": "demo",
    }
    return kafka.NewConsumer(kafkaCfg)
}

func consume(deserializer serde.Deserializer, consumer *kafka.Consumer) error {
    defer consumer.Close()
    topic := "email-updated"
    if err := consumer.SubscribeTopics([]string{topic}, nil); err != nil {
        return err
    }
    defer consumer.Unsubscribe()
    defer consumer.Commit()

    switch event := consumer.Poll(10_000 /* ms */).(type) {
    case nil:
        log.Println("no events")
    case *kafka.Message:
        msg, err := deserializer.Deserialize(topic, event.Value)
        if err != nil {
            return err
        }
        log.Printf("consumed: %v", msg)
    case kafka.Error:
        log.Printf("error (%v): %v", event.Code(), event)
    default:
        log.Printf("ignored: %v", event)
    }
    return nil
}
```

+++
