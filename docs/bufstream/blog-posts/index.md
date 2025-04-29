---

title: "Blog Posts - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/blog-posts/"
  - - meta
    - property: "og:title"
      content: "Blog Posts - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/blog-posts/"
  - - meta
    - property: "twitter:title"
      content: "Blog Posts - Buf Docs"

---

# Blog Posts

---

### [Multi-region, active-active Bufstream at 100 GiB/s](/blog/bufstream-multi-region/index.md)

**March 7, 2025**

> Bufstream — Buf’s drop-in replacement for Apache Kafka® — now supports business-critical workloads with multi-region, active-active clusters on GCP. Unlike other solutions, multi-region Bufstream clusters scale without limit, easily tolerate full region outages, add no operational complexity, and have clear SLAs. And at just $2.3M/month for 100 GiB/s of writes and 300 GiB/s of reads, multi-region Bufstream is 3x cheaper and infinitely more operable than a self-hosted Apache Kafka stretch cluster.

---

### [Bufstream on Spanner: 100 GiB/s with zero operational overhead](/blog/bufstream-on-spanner/index.md)

**March 5, 2025**

> Bufstream now supports cluster metadata management with Google Cloud Spanner. The combination of object storage and Spanner allows Bufstream to handle the world’s largest streaming data workloads, while still offloading all operational overhead to fully-managed cloud services. And at less than $1M/month for 100 GiB/s of writes and 300 GiB/s of reads, Bufstream is 25x cheaper than Confluent Cloud, 1.5x cheaper than WarpStream, and 3x cheaper than self-hosted Apache Kafka.

---

### [Bufstream is the only cloud-native Kafka implementation validated by Jepsen](/blog/bufstream-jepsen-report/index.md)

**November 12, 2024**

> Jepsen is the gold standard for distributed systems testing, and Bufstream is the only cloud-native Kafka implementation that has been independently tested by Jepsen. Today, we're releasing the results of that testing: a clean bill of health, validating that Bufstream maintains consistency even in the face of cascading infrastructure failures. We also highlight a years-long effort to fix a fundamental flaw in the Kafka transaction protocol.

---

### [Bufstream: Kafka at 8x lower cost](/blog/bufstream-kafka-lower-cost/index.md)

**July 9, 2024**

> We're excited to announce the public beta of Bufstream, a drop-in replacement for Apache Kafka deployed entirely in your own VPC that's 8x less expensive to operate.
