---
sidebar: false
prev: false
next: false

title: "Bufstream is the only cloud-native Kafka implementation validated by Jepsen"
description: "Jepsen's Bufstream report bolsters enterprise use of Buf’s elastic Kafka-compatible streaming platform to enable data quality, enforce governance policies, and cut costs 8x"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/bufstream-jepsen-report"
  - - meta
    - property: "og:title"
      content: "Bufstream is the only cloud-native Kafka implementation validated by Jepsen"
  - - meta
    - property: "og:description"
      content: "Jepsen's Bufstream report bolsters enterprise use of Buf’s elastic Kafka-compatible streaming platform to enable data quality, enforce governance policies, and cut costs 8x"
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674fa905a1364a81f78ad0ba_Jepsen.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Bufstream is the only cloud-native Kafka implementation validated by Jepsen"
  - - meta
    - property: "twitter:description"
      content: "Jepsen's Bufstream report bolsters enterprise use of Buf’s elastic Kafka-compatible streaming platform to enable data quality, enforce governance policies, and cut costs 8x"
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/674fa905a1364a81f78ad0ba_Jepsen.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Bufstream is the only cloud-native Kafka implementation validated by Jepsen

> 🎯 If you'd rather go straight to the source, [click here for the full Jepsen report](https://jepsen.io/analyses/bufstream-0.1.0).

[Jepsen](https://jepsen.io/) is the gold standard for distributed systems testing, and Bufstream is the only cloud-native Kafka implementation that has been independently tested by Jepsen. Today, we're releasing the results of that testing: a clean bill of health, validating that Bufstream maintains consistency even in the face of cascading infrastructure failures. We also highlight a years-long effort to fix a fundamental flaw in the Kafka transaction protocol.

## Key takeaways

- Bufstream is the only Kafka implementation built on a modern cloud-native architecture to be independently evaluated by Jepsen.
- All issues identified with Bufstream have been fixed.
- Buf takes production-grade enterprise software extremely seriously; Confluent Kora, StreamNative Ursa, and WarpStream have yet to make this critical investment. Bufstream is a Kafka implementation you can depend on.
- Testing Bufstream also uncovered a fundamental flaw in the Kafka transaction protocol. This flaw affects all Kafka-compatible queues, but will be fixed as part of [KIP-890](https://cwiki.apache.org/confluence/display/KAFKA/KIP-890%3A+Transactions+Server-Side+Defense).

## What is Bufstream?

[Bufstream](https://buf.build/product/bufstream) is a fully self-hosted drop-in replacement for Apache Kafka® that writes data to S3-compatible object storage. It’s 100% compatible with the Kafka protocol, including support for exactly-once semantics (EOS) and transactions. Bufstream enforces data quality and governance requirements directly at the broker with [Protovalidate](https://github.com/bufbuild/protovalidate). Data written by Bufstream is encoded in [Parquet](https://parquet.apache.org/) format and includes [Apache Iceberg™](https://iceberg.apache.org/) metadata, reducing Time-to-Insight in popular data lakehouse products like Snowflake or ClickHouse.

## What is Jepsen?

Since launching in 2013, [Jepsen](https://jepsen.io/) has established itself as the gold standard for distributed systems testing. It evaluates the consistency and availability of databases, queues, and other distributed systems in the face of extreme failures — simultaneous network partitions, strobing clock skew, and repeated pauses and crashes. Over the years, Jepsen's experimental approach has uncovered flaws in [Apache Kafka®](https://aphyr.com/posts/293-call-me-maybe-kafka), [Postgres](https://jepsen.io/analyses/postgresql-12.3), [Scylla](https://jepsen.io/analyses/scylla-4.2-rc3) and [many other databases](https://jepsen.io/analyses). The database community rightly views Jepsen as a stringent, impartial arbiter of real-world correctness.

It's our mission for [Bufstream](https://buf.build/product/bufstream/) to be the highest-quality implementation of the Kafka protocol available today, so we booked an engagement with Jepsen soon after our [initial release](/blog/bufstream-kafka-lower-cost/index.md). Today, we're happy to announce the availability of [Bufstream's official Jepsen report](https://jepsen.io/analyses/bufstream-0.1.0).

## How did Bufstream fare?

Jepsen identified five issues in Bufstream, all of which are now fixed:

> We found two liveness and three safety issues in Bufstream proper...As of version 0.1.3, all five issues are resolved.

**Most of the bugs were mundane** — stale caches, failure to account for inconsistent Kafka clients, and similar mistakes. Beyond fixing these specific bugs and running the Jepsen tests regularly, we've also expanded our integration and [Antithesis](https://antithesis.com/) test suites to catch similar issues in the future.

Bufstream is now more well-tested than ever and is the only cloud-native Apache Kafka implementation that fully supports transactional guarantees.

The report further notes that:

> Bufstream’s overall architecture appears sound: relying on a coordination service like etcd to establish the order of immutable chunks of data is a relatively straightforward approach with years of prior art in both OLTP and streaming systems.

We're proud to have a "relatively straightforward" architecture. Straightforward designs are easier to code, easier to debug, and easier to operate. And as Bufstream's Jepsen results indicate, they're able to survive noisy neighbors, flaky networks, abrupt termination, and unreliable clocks without losing data.

## What's wrong with the Kafka protocol?

The report also identified four issues with Apache Kafka, most of which were documentation gaps or bugs in the reference Java client. But the final issue was far more serious and ended up occupying much of the engagement: _Kafka's protocol makes transactions fundamentally unsound._ This flaw affects Apache Kafka, Bufstream, and presumably every other Kafka-compatible queue.

Apache Kafka separates the job of coordinating transactions from the job of accepting writes, allowing each to be handled by a separate broker. Thus, clients are designed to use one TCP connection to begin and end transactions and other TCP connections to actually send writes to the relevant partition leaders. Unfortunately, the Kafka protocol doesn't include transaction or sequence numbers for individual operations. Instead, commits and aborts affect _whichever transaction is currently in progress_. In a well-intentioned attempt to be robust by default, the Java clients automatically retry when committing or aborting a transaction times out.

This is fundamentally unsafe. If the network is slow, as it often is, clients may silently issue _two_ commits or aborts. When one succeeds, the client moves on, begins a new transaction, and sends additional writes. However, the delayed commit or abort may arrive and affect the _new_ transaction. The Jepsen report includes a visual representation of this sequence of events:

![G1a anomaly in Kafka](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/67464d944af3107b3d8a98a7_bufstream-kafka-protocol-flaw-3KB2FX5Z.svg)

This protocol flaw can manifest as a variety of anomalies, including loss of acknowledged writes. In Jepsen's own words:

> The crux of the problem is that Kafka’s transaction system implicitly assumes ordered, reliable delivery where none exists...The protocol includes no sequence number to reconstruct the order of messages sent by a single client; nor is there a transaction number to ensure messages affect the right transaction.

We reported this flaw as [KAFKA-17754](https://issues.apache.org/jira/browse/KAFKA-17754), and the Apache Kafka maintainers believe that it will be fixed as part of [KIP-890](https://cwiki.apache.org/confluence/display/KAFKA/KIP-890%3A+Transactions+Server-Side+Defense) ("Transactions Server-Side Defense"). KIP-890 has been under discussion for two years, but the end is in sight — the bulk of the new client- and broker-side logic was merged into the Apache Kafka codebase in early October. Bufstream already includes some mitigations for this issue, and we look forward to implementing KIP-890's new APIs as soon as they're stabilized and released.

## Conclusion

Bufstream is a message queue for the modern enterprise: stateless, auto-scaling, schema-aware, and [8x cheaper than self-managed Apache Kafka](/docs/bufstream/cost/index.md). And unlike Confluent Kora, StreamNative Ursa, and WarpStream, its correctness has been independently verified by Jepsen. It's ready for your most demanding, high-throughput workloads.

If your organization struggles to operate Kafka at scale, control cloud costs, or maintain data quality, Bufstream can help. [Read the full Jepsen report](https://jepsen.io/analyses/bufstream-0.1.0), chat with us in the [Buf Slack](https://buf.build/links/slack), or [reach out to us directly](https://buf.build/contact-us) to schedule a demo with our team!

‍
