---

title: "Client configuration - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/kafka-compatibility/configure-clients/"
  - - meta
    - property: "og:title"
      content: "Client configuration - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/kafka-compatibility/configure-clients/"
  - - meta
    - property: "twitter:title"
      content: "Client configuration - Buf Docs"

---

# Client configuration for Bufstream

Bufstream is API-compatible with Apache Kafka and therefore works out of the box with any client. The examples below use [franz-go](https://github.com/twmb/franz-go/tree/master) and the [Apache Kafka Java Client](https://github.com/apache/kafka/tree/trunk/clients/src/main/java/org/apache/kafka/clients) to illustrate the recommended settings.

## Connecting to Bufstream

To connect clients to Bufstream, provide Bufstream's bootstrap URL and port to the client. Bufstream uses the standard Kafka port `9092` by default, but this value is configurable.

## Minimizing inter-zone network traffic

Bufstream uses [options](../../reference/configuration/client-id-options/) within the client ID to determine which availability zone (AZ) it's operating in and respond to service discovery requests with only the addresses of zone-local brokers. To configure your clients for zone awareness, append a `zone` option to the client ID. For example, use a client ID of `my-app-001,zone=us-east-1a` for the first instance of an application called `my-app` in AWS `us-east-1a`. On deploy, Bufstream emits the AZ values that you can use in client configuration.Following standard Kafka practice, take care to make client IDs unique.

## Optimizing performance and write throughput

Because Bufstream brokers write directly to object storage and don't have a local disk, they're much more latency-sensitive. Therefore, Bufstream's optimal performance occurs when processing workloads with large batch sizes or high concurrency. To achieve high write throughput and optimal performance in Bufstream, we recommend configuring the following settings:

- **Linger**: Linger determines how long a producer waits for more records before triggering a request, and is the most important client setting. For most Bufstream deployments, a default linger value of 200 ms is appropriate. The ideal value should be about equal to the 50th percentile of the record produce delay, or half of the writer flush interval. You can set this value with the `intake.delay_max` [Bufstream configuration value](/docs/bufstream/reference/configuration/bufstream-yaml/#buf.bufstream.config.v1alpha1.IntakeConfig).
- **Batch Size**: Batch size determines how a producer buffers before writing. The maximum batch size shouldn't exceed the maximum flush size (15 MB). A good batch size target to start with is 4 MB. Most Bufstream deployments should perform optimally with a batch size of 1-8 MB. You can set this value with the `intake.delay_max_bytes` [Bufstream configuration value](/docs/bufstream/reference/configuration/bufstream-yaml/#buf.bufstream.config.v1alpha1.IntakeConfig).
- **Max Request Size**: We recommend using the client default, as this is effectively controlled by the configured batch size.

Configuring both batch size and linger helps clients optimize for Bufstream's latency sensitivity and reduce data loss. To monitor intake performance, we recommend the following metric: `bufstream.kafka.produce.delay.duration`.

## Example configuration

The examples below illustrate how to configure `franz-go` and the Apache Kafka Java Client using the recommended settings for performance, throughput, and zone awareness.

+++tabs key:d473ce4174ea8c8bc85a521c2bdda7e7

== franz-go

```go
package main

import (
        "github.com/twmb/franz-go/pkg/kgo"
)

func NewKafkaClient(bootstrapServers []string, groupID, topic string) (*kgo.Client, error) {
  return kgo.NewClient(
        // Connects your clients to Bufstream's bootstrap servers
        kgo.SeedBrokers("bufstream:9092"),
        // Sets the client id to the name of your bufstream app comma separated from the availability zone.
        // this field is whitespace dependent. Don't add spaces around the comma or equal sign.
        kgo.ClientID("my-bufstream-001,zone=a"),
        kgo.FetchMaxWait(time.Second),
        // Sets the upper bound of the batch size to be sent. In Bufstream, this shouldn't exceed the max flush rate of 15 MB.
        kgo.ProducerBatchMaxBytes(4*1024*1024),
        // Sets how long a producer will wait for records before batching them into a request.
        kgo.ProducerLinger(200*time.Millisecond),
    )
}
```

== Kafka Java Client

```java
package com.mycompany.bufstream.client;

import org.apache.kafka.clients.CommonClientConfigs;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;

import java.util.Properties;

public class MyClient {

    private final KafkaProducer<String, String> producer;
    private final KafkaConsumer<String, String> consumer;

    public MyClient() {
        Properties producerProperties = new Properties();
        producerProperties.put(CommonClientConfigs.BOOTSTRAP_SERVERS_CONFIG, "bufstream:9092");
        // Set producer client id
        producerProperties.put(CommonClientConfigs.CLIENT_ID_CONFIG, "my-bufstream-001,zone=a");
        producerProperties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
        producerProperties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");

        // Set producer "linger.ms"
        producerProperties.put(ProducerConfig.LINGER_MS_CONFIG, "200"); // 200 ms
        // Set producer batch size
        producerProperties.put(ProducerConfig.BATCH_SIZE_CONFIG, "4194304"); // 4*1024*1024
        this.producer = new KafkaProducer<>(producerProperties);

        Properties consumerProperties = new Properties();
        consumerProperties.put(CommonClientConfigs.BOOTSTRAP_SERVERS_CONFIG, "bufstream:9092");
        consumerProperties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer");
        consumerProperties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer");
        consumerProperties.put(CommonClientConfigs.GROUP_ID_CONFIG, "my-group");

        // Set consumer "fetch.wait.max.ms"
        consumerProperties.put(ConsumerConfig.FETCH_MAX_WAIT_MS_CONFIG, "1000"); // 1 second
        this.consumer = new KafkaConsumer<>(consumerProperties);
    }
}
```

+++

To see how we configured our clients in Benchmark runs, check out the [benchmarks and cost documentation](../../cost/). For more information on configuring Bufstream, consult [Tuning and performance](../../deployment/tuning-performance/).
