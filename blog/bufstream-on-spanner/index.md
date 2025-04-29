---
layout: home

title: "Bufstream on Spanner: 100 GiB/s with zero operational overhead"
description: "At less than $1M/month for 100 GiB/s of writes and 300 GiB/s of reads, Bufstream using Spanner is 25x cheaper than Confluent Cloud, 1.5x cheaper than WarpStream, and 3x cheaper than self-hosted Apache Kafka®."

head:
  - - meta
    - property: "og:title"
      content: "Bufstream on Spanner: 100 GiB/s with zero operational overhead"
  - - meta
    - property: "og:description"
      content: "At less than $1M/month for 100 GiB/s of writes and 300 GiB/s of reads, Bufstream using Spanner is 25x cheaper than Confluent Cloud, 1.5x cheaper than WarpStream, and 3x cheaper than self-hosted Apache Kafka®."
  - - meta
    - property: "og:image"
      content: ""
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Bufstream on Spanner: 100 GiB/s with zero operational overhead"
  - - meta
    - property: "twitter:description"
      content: "At less than $1M/month for 100 GiB/s of writes and 300 GiB/s of reads, Bufstream using Spanner is 25x cheaper than Confluent Cloud, 1.5x cheaper than WarpStream, and 3x cheaper than self-hosted Apache Kafka®."
  - - meta
    - property: "twitter:image"
      content: ""
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

hero:
  name: "Bufstream on Spanner: 100 GiB/s with zero operational overhead"
  tagline: "March 5, 2025"
---

Bufstream — Buf’s drop-in replacement for Apache Kafka® — now supports cluster metadata management with [Google Cloud Spanner](https://cloud.google.com/spanner). The combination of object storage and Spanner allows Bufstream to handle the world’s largest streaming data workloads, while still offloading all operational overhead to fully-managed cloud services. And at less than $1M/month for 100 GiB/s of writes and 300 GiB/s of reads, Bufstream is 25x cheaper than Confluent Cloud, 1.5x cheaper than WarpStream, and 3x cheaper than self-hosted Apache Kafka. Bufstream continues to be available on AWS, GCP, and Azure.

## Key takeaways

- Bufstream now supports Spanner as an alternative to etcd for metadata management. Bufstream uses Spanner to coordinate cluster membership, manage consumer groups, and assign message offsets.
- Spanner allows Bufstream to scale limitlessly with zero operational burden: _all_ state management is delegated to GCP.
- Backed by Spanner and Google Cloud Storage, Bufstream handles 100 GiB/s of uncompressed writes and 300 GiB/s of uncompressed reads for just $932,578/month — 25x lower than Confluent Cloud, 1.5x cheaper than WarpStream, and 3x lower than self-hosted Apache Kafka.
- Support for Postgres (all clouds), Aurora (AWS), and AlloyDB (GCP) is coming soon.

## Why does Bufstream have a separate metadata store?

Bufstream is a drop-in replacement for Apache Kafka that writes all data directly to object storage. In essence, the brokers in a Bufstream cluster treat object storage as a bottomless, shared disk. This allows Bufstream to abandon Kafka’s leader-per-partition architecture — because they’re all connected to the same storage bucket, each Bufstream broker can serve reads and writes for any partition. Adopting a leaderless, diskless design allows Bufstream clusters to autoscale quickly, minimize inter-zone networking, and split hot partitions.

However, a leaderless design comes with one significant tradeoff: the cluster needs some way to coordinate membership, manage consumer groups, and assign strictly increasing offsets to messages in the same partition. This metadata tends to be low volume, but it’s queried frequently and changes often. Bufstream clusters use a separate database to manage this metadata.

## Why use Spanner instead of etcd?

Until today, Bufstream clusters have managed their metadata with [etcd](https://etcd.io/). For most streaming data workloads, etcd is an excellent choice: it’s strongly consistent, highly available, open source, and [extensively tested](https://jepsen.io/analyses/etcd-3.4.3). However, etcd becomes increasingly difficult to operate — and eventually hits hard limits — as the database size and request volume increase. These scalability limits don’t typically affect clusters handling less than 10 GiB/s of writes, but they’ve prevented Bufstream from handling truly enormous workloads.

Starting today, Bufstream clusters can instead manage their metadata with [Google Cloud Spanner](https://cloud.google.com/spanner?hl=en). Like etcd, Spanner is strongly consistent and highly available. Unlike etcd, Spanner scales horizontally and is available as a fully managed service. This allows Bufstream clusters in GCP to handle immense workloads without the operational challenges typical of large-scale distributed systems: all the fiddly, stateful subsystems are operated by Google.

Bufstream is as easy to operate as traditional SaaS, but runs _completely_ within your cloud account — fully air-gapped from Buf.

## Does Bufstream _really_ scale infinitely?

Using the Open Messaging Benchmark Framework, we’ve verified that Bufstream comfortably handles the world’s largest Kafka workloads. We benchmarked all the way up to 100 GiB/s of write throughput, using an [OMB configuration](https://pastebin.com/a57ZsF7A) that sends 1 kB messages, enables 4:1 client-side compression, and has 3x consumer fan-out. This workload matches the scale of some of the world’s largest Kafka clusters. In fact, it’s so large that we had to split it into two 50 GiB/s workloads to prevent the Open Messaging Benchmark Framework from crashing!

To handle 100 GiB/s of uncompressed writes, we used a Bufstream cluster of 90 n2d-standard-32 brokers, which have 32 vCPUs and 128 GB of memory each. We distributed the cluster evenly across three availability zones. With a standard GCS bucket as its primary storage backend and 9 Spanner nodes as its metadata store, the cluster handled this workload using just a third of the available vCPUs and half the available memory.

![](<https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/67c8a99437804ff3f03c91ad_CPU%20Usage%20Cores%20(1).png>)

![](<https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/67c8a9a4743f80e22b13e9bc_Memory%20Usage%20(3).png>)

At this scale, Apache Kafka is _notoriously_ difficult to operate. In contrast, Spanner and Google Cloud Storage handle this load without a hiccup — and without a dedicated operations team. Median end-to-end latency is just 350 milliseconds, and p99 latency is well below a second.

![](<https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/67c8a9c489e8ea745faedf2f_P50%20End-to-End%20Latency%20(2).png>)

![](<https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/67c8a9d46ec9b50a912c7010_P99%20End-to-End%20Latency%20(1).png>)

It’s worth emphasizing that even though this benchmark is enormous, it’s far from hitting Bufstream’s limits. The Bufstream and Spanner clusters scale linearly — by adding more nodes, they could easily handle even higher throughput. And even at massive scale, all the difficult operational challenges are handled by GCP.

## 3x cheaper than Apache Kafka

**The Bufstream cluster handling this workload costs $932,578 per month: $414,178 of infrastructure costs and $518,400 of fees.** Assuming a 1 year commitment, deployment in GCP’s `us-central1` region, and 7 days of retention:

- The 90 `n2d-standard-32` Bufstream brokers cost $56,042 per month. Tier 1 networking, required for guaranteed network throughput, adds an additional $29,496 per month.
- 100 GiB/s for 7 days with 4x compression comes out to 14.42 PiB of data stored in GCS, which costs $302,409 per month.
- 1,360 GCS writes per second and 3,450 reads per second cost $21,498 per month.
- The 9-node Spanner cluster, handling about 10 GiB of metadata, costs $4,733 per month.
- There are _no_ inter-zone networking fees.
- Buf charges a licensing fee of $0.002 per GiB of uncompressed writes, for a total of $518,400 per month.

**A comparable Apache Kafka cluster costs $2,685,524 per month, 3x more than Bufstream — even with fetch-from-follower and tiered storage enabled.** Again assuming a 1 year commitment, deployment in `us-central1`, and 7 days of retention:

- 172 `n4-standard-48` brokers, each with 37 TiB of attached Hyperdisk, cost $698,316 per month. With tiered storage, we assume that a cost-conscious deployment would keep 12 hours of data on disk with an additional 12 hour buffer. After 4x compression and 3x replication, our 100 GiB/s workload would require 6.2 PiB of storage. For argument’s sake, we spread this over 172 brokers, so each broker needs about 37 TiB of storage.
- The remaining 6 days of data are stored in GCS, for a total size of 12.36 PiB and a monthly cost of $259,208.
- While tiered storage does write to GCS, the writes are relatively low-volume and don’t significantly affect costs. For simplicity, we’ll ignore them.
- The cluster uses 165 PiB of inter-zone networking per month, which costs $1,728,000 per month. After 4x compression, our 100 GiB/s of writes falls to 25 GiB/s. Two thirds of the time, producers must send their writes to a partition leader in a different availability zone, resulting in 16.7 GiB/s of inter-zone traffic. Once the partition leader receives a write, it must always replicate the data to brokers in the other two zones, resulting in another 50 GiB/s of inter-zone traffic. Over a month, this adds up to 165 PiB of traffic, which GCP prices at $0.01 per GiB.

Of course, an Apache Kafka cluster with so many brokers and such large disks is an operational nightmare. Keeping it running requires a team of skilled, specialized engineers, each of whom commands a top-of-market salary. By outsourcing complexity to GCP and keeping brokers stateless, Bufstream completely eliminates this operational tax.

## 25x cheaper than Confluent Cloud

_Ideally, we’d use Confluent Cloud’s Enterprise or Freight clusters to compare costs in GCP. But neither product supports deployment in GCP, so we have to resort to the next cheapest offering — Dedicated._

**If Confluent Cloud Dedicated supported such large workloads, we’d pay $23,224,581 per month — 24.9x more than Bufstream.** Again, assuming deployment in GCP and 7 days of retention:

- We need at least 427 Confluent eCKUs, which cost $817,790 per month. Our workload requires 100 GiB/s of uncompressed write capacity, or 25 GiB/s after compression. [Each eCKU can serve a maximum of 60 MiB/s of writes](https://docs.confluent.io/cloud/current/clusters/cluster-types.html#ecku-cku-comparison), so we need at least 427 eCKUs. Each eCKU costs $2.66 per hour.
- We pay $18,129,879 per month for read and write throughput. Our workload has 100 GiB/s of uncompressed writes and 300 GiB/s of uncompressed reads. After 4x compression, we have 100 GiB/s of compressed reads and writes, or 247 PiB per month. In GCP, Confluent charges $0.07/GiB for Dedicated cluster throughput.
- We pay $3,628,912 per month to store 3 replicas of our 14.42 PiB data set. Confluent charges $0.08 per GiB of data before replication. [Dedicated clusters hard-code 3x replication](https://docs.confluent.io/cloud/current/billing/overview.html#storage), so the effective price is $0.24 per GiB.
- We pay $648,000 per month to GCP in inter-zone networking fees. GCP charges this on the instance performing the egress, meaning we pay for the inter-zone traffic our producers generate. $0.01/GiB charged on ⅔ of our 25 GiB/s producer traffic is $648,000 per month. Private Service Connect would raise this cost even further.

Unfortunately, **Confluent Cloud simply cannot serve a workload this large**: [even Enterprise, Dedicated, and Freight clusters can only scale to 152 CKUs](https://docs.confluent.io/cloud/current/clusters/cluster-types.html#ecku-cku-comparison). Bufstream’s cloud-native architecture not only makes it 25x cheaper than Confluent Cloud, it allows clusters to handle dramatically larger workloads with ease.

## 1.5x cheaper than WarpStream

Unfortunately, WarpStream’s pricing calculator doesn’t support GCP. But on AWS, it suggests that our benchmark workload would require 160 `m6in.4xlarge` agents — a total of 2,560 vCPUs and 10,240 GiB of memory, roughly equivalent to the Bufstream cluster above. WarpStream’s calculator also estimates $133,705 of object storage operations per month, but we assume that increasing batch sizes can reduce this to approximately $25,000 per month. Bufstream and WarpStream also store the same amount of data in GCS. Without digging into the details of VM sizing, premium networking, and workload tuning, we can safely assume that WarpStream and Bufstream have similar infrastructure costs.

But even if we generously assume that WarpStream’s data plane is as efficient as Bufstream’s and that their control plane can handle this scale, their licensing fees are _2x higher_. For the same workload (100 GiB/s of uncompressed writes and 300 GiB/s of uncompressed reads), **WarpStream charges $1,035,905 in licensing fees per month. That’s more than the total cost of the equivalent Bufstream cluster.** Added to the infrastructure costs of the data plane, $1M per month of control plane fees makes WarpStream 1.5x more expensive than Bufstream.

And, of course, unlike WarpStream, Bufstream has also been [independently verified](https://jepsen.io/analyses/bufstream-0.1.0) to implement the entire Kafka protocol by Jepsen, and can be deployed completely within your own VPC with no data or metadata sent back to Buf.

## What’s next for Bufstream?

Bufstream is the best platform for streaming data workloads in the cloud — and on GCP, it’s even better when paired with Spanner. Compared to self-managed Apache Kafka, Confluent Cloud, and WarpStream, Bufstream is dramatically cheaper, simpler, and more scalable. Coupled with GCP’s support for multi-region storage buckets, Spanner support also opens the door to true multi-region Bufstream clusters.

We plan to support more storage backends for cluster metadata in the very near future. In addition to etcd and Spanner, we plan to support Postgres, AWS Aurora, and GCP AlloyDB. For workloads that don’t need horizontal scalability and synchronous metadata replication, these relational databases are inexpensive and operationally familiar.

We’re also continuing to harden our Apache Iceberg support. Currently available as a preview, this feature allows Bufstream to natively store any topic with a schema as an Iceberg table. Bufstream does this without any extra copies of the data: Kafka consumers and Iceberg queries read from the same files in object storage, lowering costs and further reducing operational toil.

We’d love to help you modernize your streaming data platform. You can get a feel for Bufstream with our [interactive demo](/docs/bufstream/quickstart/index.md), dig into our [smaller-scale benchmarks and cost analysis](/docs/bufstream/cost/index.md), or chat with us in the [Buf Slack](https://buf.build/b/slack). For production deployments or to schedule a demo with our team, [reach out to us directly](https://buf.build/contact-us)!
