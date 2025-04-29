---
layout: home

title: "Multi-region, active-active Bufstream at 100 GiB/s"
description: "Bufstream — Buf’s drop-in replacement for Apache Kafka® — now supports business-critical workloads with multi-region, active-active clusters on GCP."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/bufstream-multi-region"
  - - meta
    - property: "og:title"
      content: "Multi-region, active-active Bufstream at 100 GiB/s"
  - - meta
    - property: "og:description"
      content: "Bufstream — Buf’s drop-in replacement for Apache Kafka® — now supports business-critical workloads with multi-region, active-active clusters on GCP."
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/67cb5e9cc6750282a712c0a0_multi-region.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Multi-region, active-active Bufstream at 100 GiB/s"
  - - meta
    - property: "twitter:description"
      content: "Bufstream — Buf’s drop-in replacement for Apache Kafka® — now supports business-critical workloads with multi-region, active-active clusters on GCP."
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/67cb5e9cc6750282a712c0a0_multi-region.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

hero:
  name: "Multi-region, active-active Bufstream at 100 GiB/s"
  tagline: "March 7, 2025"
---

Bufstream — Buf’s drop-in replacement for Apache Kafka® — now supports business-critical workloads with multi-region, active-active clusters on GCP. Unlike other solutions, multi-region Bufstream clusters scale without limit, easily tolerate full region outages, add no operational complexity, and have clear SLAs. And at just $2.3M/month for 100 GiB/s of writes and 300 GiB/s of reads, multi-region Bufstream is 3x cheaper and infinitely more operable than a self-hosted Apache Kafka stretch cluster.

## Key takeaways

- Available on AWS, GCP, and Azure, Bufstream is a diskless, leaderless replacement for Apache Kafka. Bufstream supports the full Kafka protocol, including transactions and exactly-once semantics, but writes message data directly to cloud object storage. To coordinate cluster membership, manage consumer groups, and assign message offsets, Bufstream clusters use a pluggable metadata backend.
- Earlier this week, we announced that [Bufstream deployments in GCP now support Spanner as a metadata backend](/blog/bufstream-on-spanner/index.md). Spanner allows Bufstream to scale limitlessly with zero operational burden: _all_ state management is delegated to GCP.
- By pairing a multi-region Spanner cluster with a multi-region Cloud Storage bucket, a single Bufstream cluster can span multiple regions with no additional operational toil and clear SLAs.
- Multi-region Bufstream clusters are active-active: consumers can read data from other regions with zero lag, producers in different regions can write to the same topic, and clients in different regions can join the same consumer group. During outages, clusters can scale rapidly to handle shifting application workloads. MirrorMaker 2, Confluent Cluster Linking, and Apache Kafka stretch clusters all fail to deliver on this active-active architecture.
- Bufstream handles a multi-region workload with 100 GiB/s of uncompressed writes and 300 GiB/s of uncompressed reads for just $2.3M/month — 3x lower than an impossible-to-operate Apache Kafka stretch cluster.

## Critical workloads deserve multi-region Kafka

As legacy software moves to the cloud, most systems simply treat cloud availability zones as on-premises racks or data centers. For example, the typical Apache Kafka deployment runs in a single cloud region, treating each availability zone as a rack. Using this approach, legacy systems can tolerate small cloud outages — for example, the typical Kafka deployment runs in three zones and can tolerate a single-zone outage without much fuss.

Unfortunately, these small outages are just the tip of the iceberg. While less common than single-zone outages, whole cloud regions go down with some regularity: [AWS](https://aws.amazon.com/message/061323/), [GCP](https://status.cloud.google.com/incidents/dS9ps52MUnxQfyDGPfkY), and [Azure](https://www.youtube.com/watch?v=tODJb-Tm_q0) each had a full-region outage in early 2023. To mitigate the effects of large-scale outages, highly resilient systems must span multiple regions. For legacy software, this is a significant challenge.

Today, Kafka is commonly used for business-critical streaming workloads like transaction processing, fraud detection, and dynamic pricing. Naturally, businesses want these functions to continue uninterrupted during large cloud outages, so we need a multi-region Kafka architecture. The ideal multi-region Kafka deployment would:

- Recover from single-region failures automatically and immediately, including scaling up to handle the increased workload in healthy regions. In [disaster planning parlance](https://cloud.google.com/architecture/dr-scenarios-planning-guide), we’d call this a [Recovery Time Objective (RTO)](https://en.wikipedia.org/wiki/IT_disaster_recovery#Recovery_Time_Objective) of zero.
- Have all acknowledged writes remain available throughout the outage. More formally, we want a [Recovery Point Objective (RPO)](https://en.wikipedia.org/wiki/IT_disaster_recovery#Recovery_Point_Objective) of zero.
- Remain conceptually simple for clients, hiding all the complexity of multi-region architecture.
- Remain operationally simple.
- Remain cost-effective.

In short, we’d like multi-region deployments to behave like single-region clusters — just better.

## Existing multi-region approaches are terrible

The Apache Kafka community has been wrestling with multi-region Kafka for more than a decade, starting with the initial version of MirrorMaker and continuing through the current discussion of [KIP-986](https://cwiki.apache.org/confluence/display/KAFKA/KIP-986%3A+Cross-Cluster+Replication). Today, the most widely-used solutions are MirrorMaker 2, Confluent Cluster Linking, and stretch clusters. Judged by the criteria above, all three are terrible.

[MirrorMaker 2](https://kafka.apache.org/documentation/#georeplication) builds on Kafka Connect to asynchronously replicate topics and consumer group offsets from a source cluster to a destination cluster. [Confluent Cluster Linking](https://docs.confluent.io/cloud/current/multi-cloud/cluster-linking/index.html) is conceptually similar, but doesn’t require Kafka Connect. Under both systems, replicated topics and consumer groups are read-only in the destination cluster. These asynchronous replicators deliver _none_ of the capabilities we want:

- ❌ Recovery requires manual intervention. Because consumers in different regions cannot join the same consumer group, workloads must manually fail over during outages.
- ❌ Because replication is asynchronous, unreplicated data is unavailable during outages.
- ❌ Application code becomes very complex. Bidirectional replication between two clusters [typically requires four separate topics to represent a single data stream](https://aiven.io/docs/products/kafka/kafka-mirrormaker/concepts/disaster-recovery/active-active-setup), and applications must explicitly juggle these topics to handle failovers, ordering, and exactly-once guarantees. This is [notoriously difficult](https://current.confluent.io/2024-sessions/mirrormaker-2s-offset-translation-isnt-exactly-once-and-thats-okay).
- ❌ Both MirrorMaker and Cluster Linking add new moving parts to an already-complicated distributed system. Since neither comes with any inherent SLAs, operators must monitor them carefully to minimize replication lag.
- ❌ Because Kafka clusters scale slowly, each cluster must be sized to handle the full workload. During normal operations, this over-provisions both clusters. Bidirectional replication also multiplies storage and networking costs.

Stretch clusters take a completely different approach. Rather than asynchronously replicating data between independent clusters, they simply spread a single Kafka cluster across regions. This comes with notable operational drawbacks, but it does deliver some of our desired capabilities:

- ✅ No failover is necessary. Though the cluster becomes quite fragile, it can tolerate the loss of a region without operator intervention. Because clients in different regions can write to the same topic and join the same consumer group, workloads can run in multiple regions concurrently and don’t need manual failover.
- ✅ Replication is synchronous, so all data remains available during outages.
- ✅ Stretch clusters look just like single-region clusters to clients, so application code remains simple.
- ❌ Operating a stretch cluster in the cloud can be difficult. Most documentation [suggests keeping inter-region latency below 50 milliseconds](https://docs.confluent.io/platform/6.1/multi-dc-deployments/multi-region-architectures.html#stretched-cluster) with a very tight p99. Periods of higher latency and lower throughput disproportionately affect Kafka producers, often bubbling all the way up to application-level errors. Because it’s also difficult in practice to handle outages, stretch cluster operators must typically schedule regular “game days” to exercise their outage playbooks.
- ❌ Stretch clusters are expensive. To tolerate loss of a single region, they _must_ run in at least three regions, incurring significant inter-zone and inter-region networking costs — which we’ll dig into in detail below.

Neither of these options are attractive. Asynchronous replicators require manual failovers, can orphan an unbounded amount of data during outages, and complicate application code. Stretch clusters offer true active-active multi-region capabilities, but are operationally challenging. Both are unappealingly expensive.

## Bufstream is naturally multi-region

By adopting a leaderless, diskless architecture, Bufstream can do much better. Even in single-region deployments, Bufstream brokers are stateless and communicate only with brokers in the same availability zone. All inter-zone communication goes through object storage and the cluster’s metadata backend. To expand a Bufstream cluster from a single region to multiple regions, we need a consistent, multi-region metadata backend and object storage bucket.

Google Cloud Platform offers both. [Bufstream already supports Spanner as a metadata backend](/blog/bufstream-on-spanner/index.md), so switching to a multi-region Spanner cluster doesn’t require any special code. As a metadata system, multi-region Spanner is unmatched: it’s fully consistent, stores data in multiple regions before acknowledging writes, and has a 99.999% availability SLA. And because Bufstream puts very little load on its metadata backend, Spanner typically accounts for less than 1% of cluster costs.

Google Cloud also offers [dual- and multi-region Cloud Storage buckets](https://cloud.google.com/blog/products/storage-data-transfer/choose-between-regional-dual-region-and-multi-region-cloud-storage). These buckets offer interesting guarantees: object metadata is fully consistent and synchronously stored in multiple regions, but the object data is replicated asynchronously. If clients try to fetch not-yet-replicated objects, the data is automatically fetched from the source region, stored locally, and returned to the client. This is perfect for Bufstream:

- Objects inhabit a single, strongly-consistent namespace across regions. Metadata-only operations (like listing bucket contents) don’t lose data during outages.
- During normal operations, writes are immediately visible in all regions.
- Large writes remain relatively low-latency.
- The complexities of inter-region replication are fully abstracted away behind the same API as a single-region bucket.
- Replication has clear SLAs. By default, 99.9% of objects are replicated within an hour, and 100% are replicated within 12 hours. For an additional fee, [Turbo Replication](https://cloud.google.com/storage/docs/availability-durability#turbo-replication) replicates 100% of objects in a dual-region bucket within 15 minutes.

Just by switching Bufstream to multi-region Cloud Storage and Spanner, we satisfy most of our multi-region requirements:

- ✅ No failover is necessary, and clusters can quickly scale to match shifting workload demands during outages. Clients in multiple regions can write to the same topic, join the same consumer group, and operate concurrently without compromising correctness. Under normal operations, there is no replication delay between regions.
- ❌ Up to an hour of data (or 15 minutes, with Turbo Replication) may become unavailable during outages. Consumers experience this as errors fetching some offsets. Producers can continue publishing without interruption, and consumers without strict ordering needs can skip over unavailable offsets and continue processing more recent data. Cloud Storage has 99.9999999% durability, so virtually all unavailable data reappears once the outage resolves. Unlike MirrorMaker 2 or Confluent Cluster Linking, this Recovery Point Objective is clear, can be lowered with Turbo Replication, and comes with zero operational overhead.
- ✅ Multi-region Bufstream clusters look just like single-region clusters to clients, keeping application code simple.
- ✅ Operating a multi-region Bufstream cluster is just like operating a single-region cluster. The hard problems of multi-region distributed systems are fully delegated to Google Cloud.
- ✅ Multi-region clusters are inexpensive. In fact, a multi-region Bufstream cluster is often cheaper than a single-region Apache Kafka cluster serving the same workload.

## Sub-second multi-region latency, no ops

To prove these cost and performance claims, we ran our largest workload on a Bufstream cluster running in two regions. Built with the Open Messaging Benchmark Framework, [this workload](https://pastebin.com/a57ZsF7A) creates 100 GiB/s of uncompressed writes and 300 GiB/s of uncompressed reads. With 4:1 client-side compression, this shrinks to 25 GiB/s of writes and 75 GiB/s of reads on the wire. We split the workload evenly, running half in each region.

The Bufstream cluster required to run this workload is similar to [our single-region setup](/blog/bufstream-on-spanner/index.md). We used a cluster of 108 `n2d-standard-32` brokers, each of which has 32 vCPUs and 128 GiB of memory. We distributed the cluster across six availability zones, three in the `us-west1` region and three in `us-west2`. We used a multi-region GCS bucket in the `us` multi-region as the cluster’s primary storage backend. For metadata storage, we configured Bufstream to use a 9-node multi-region Spanner cluster with read-write nodes in `us-west1` and `us-west2` and witness nodes in `us-west3`.

This cluster serves our enormous workload with aplomb. On average, the Bufstream brokers use just a third of the available vCPUs and half the available memory — the same performance profile as a single-region cluster serving an identical workload.

![](<https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/67cb5aa4229261b839964473_CPU%20Usage%20Cores%20(3).png>)

![](<https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/67cb5ab3f0710c02b2af3ced_Memory%20Usage%20(5).png>)

Backed by GCS and Spanner, Bufstream handles this load with a median end-to-end latency of 450 milliseconds and a p99 of 850 milliseconds.

![](<https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/67cb5ae01a7d5055b1cf7b8b_P50%20End-to-End%20Latency%20(3).png>)

![](<https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/67cb5ae9fc93164ba47f4bd3_P99%20End-to-End%20Latency%20(2).png>)

A single-region Apache Kafka cluster handling this load would be challenging. A stretch cluster is unthinkable. But with a few configuration changes, we’re able to convert a single-region Bufstream cluster to an active-active, multi-region cluster that easily handles this scale. And best of all, _going multi-region doesn’t add any operational load_. Google Cloud’s SRE teams are carrying the pager for Spanner and Cloud Storage, leaving us responsible just for the stateless, autoscaling Bufstream brokers. Our clients don’t need to think about complex multi-region replication topologies either — they can write to any topic and join any consumer group, in one region or both, and trust that their application code will continue to function correctly.

## 3x cheaper than an Apache Kafka stretch cluster

**The Bufstream cluster handling this workload costs $2,358,673 per month: $1,840,273 of infrastructure costs and $518,400 of fees.** Assuming a 1 year commitment, deployment in three zones of `us-west1` and three zones of `us-west2`, and 7 days of retention:

- The 108 `n2d-standard-32` Bufstream brokers, half in `us-west1` and half in `us-west2`, cost $74,015 per month. [Tier 1 networking](https://cloud.google.com/compute/vm-instance-pricing?hl=en#section-7), required for guaranteed network throughput, adds an additional $38,972 per month.
- 100 GiB/s for 7 days with 4x compression comes out to 14.4 PiB of data stored in our multi-region GCS bucket. At $0.026 per GiB, this comes to $393,120 per month.
- Writes to multi-region buckets are [more expensive](https://cloud.google.com/storage/pricing#dual-regions) than writes to single-region buckets, so our 744 GCS writes per second cost $19,284 per month. Our 2,030 reads per second cost $2,105 per month, for a total of $21,389 per month in GCS operations fees.
- Multi-region buckets also charge $0.02 per GiB for replication between regions. Over a month, our 100 GiB/s workload adds up to 247 PiB. After taking into account 4x client-side compression, this shrinks to 61.8 PiB, for a monthly total of $1,296,000.
- The 9-node Spanner cluster, handling about 10 GiB of metadata, costs $16,777 per month.
- All traffic from clients to Bufstream and between Bufstream nodes remains zone-local, so there are no addition inter-zone or inter-region networking fees.
- Buf charges a licensing fee of $0.002 per GiB of uncompressed writes, for a total of $518,400 per month.

**A comparable Apache Kafka stretch cluster is impossible to operate and still costs $7,527,268 per month, 3x more than Bufstream — even with fetch-from-follower and tiered storage enabled.** Again assuming a 1 year commitment and 7 days of retention:

- Following [best practices](https://docs.confluent.io/platform/current/multi-dc-deployments/multi-region-architectures.html#stretched-cluster-3-data-center), we’ll deploy our stretch cluster in three regions (`us-west1`, `us-west2`, and `us-west3`) with a replication factor of 3. We can’t effectively deploy a stretch cluster in only two regions because Kafka’s only abstraction for fault domains is a rack. To ensure that our cluster splits partition replicas between regions, we must configure the cluster to ignore availability zones and treat regions as our “racks.” But once we do that, Kafka will happily place multiple replicas in the same zone. As a result, a stretch cluster in two regions will often place all replicas for a partition in just two zones (one in each region). After all the expense and trouble of running a stretch cluster, that’s worse zone diversity than a single-region cluster!
- Even though it’s not officially supported and (to our knowledge) has never been tested, we assume that Apache Kafka’s tiered storage implementation works with multi-region GCS buckets. Without tiered storage, either the number of brokers or the disk size per broker becomes unmanageably large.
- We need 171 `n2-standard-48` brokers, split evenly between regions and each with 37 TiB of attached Hyperdisk, at a cost of $942,148 per month. With tiered storage, we assume that a cost-conscious deployment would keep 12 hours of data on disk with an additional 12 hour buffer. After 4x compression and 3x replication (two replicas in each region), our 100 GiB/s workload would require 6.2 PiB of storage. For argument’s sake, we spread this over 171 brokers, so each broker needs about 37 TiB of storage. Note that the `n4` instance family we used in our single-region benchmarks isn’t yet available in these regions, so we’re forced to use the slightly more expensive `n2` family.
- With tiered storage, we’ll also have 7 days of data GCS, for a total size of 14.4 PiB. We pay $0.026 per GiB for a monthly total of $393,120.
- As we did for our single-region benchmarks, we ignore the cost of GCS writes from tiered storage. They’re relatively low-volume and don’t meaningfully affect this comparison.
- Taking into account 4x client-side compression, tiered storage writes 61.8 PiB to GCS per month. Replication within the multi-region bucket costs $0.02 per GiB, so our monthly bucket replication bill is $1,296,000.
- The cluster spends $3,600,000 per month on inter-zone and inter-region networking to serve data producers. After 4x compression, our 100 GiB/s of writes falls to 25 GiB/s. Two thirds of the time, producers must send their writes to a partition leader in another region, adding up to 16.7 GiB/s of inter-region traffic. The remaining third of the time, two thirds of the producers must send their writes to a leader in the same region but a different availability zone, resulting in 5.6 GiB/s of inter-zone traffic. Once the partition leader receives a write, it must always replicate the data to brokers in two other regions, creating another 50 GiB/s of inter-region traffic. Added together, data producers create 66.7 GiB/s of inter-region and 5.6 GiB/s of inter-zone traffic. Inter-region traffic costs $0.02 per GiB and inter-zone traffic costs $0.01 per GiB, so this is about $1.39/s in networking fees.
- The cluster spends $1,296,000 on inter-zone networking to serve data consumers. Even with fetch-from-follower enabled, two thirds of consumers will need to read from a replica in another availability zone. After compression, our 75 GiB/s of reads results in 50 GiB/s of inter-zone traffic. At $0.01/GiB, this amounts to $0.50/s.

At this scale, an Apache Kafka stretch cluster is more of a theoretical exercise than a practical option — even the most talented infrastructure team would struggle to operate this cluster, scale up during outages, and scale back down afterwards.

## Conclusion

Among all the streaming data solutions in the market, only Bufstream makes truly robust, active-active deployments practical. Multi-region Bufstream clusters scale without limit, handle single-region outages automatically, add no operational complexity, and have clear data replication SLAs. And despite all that, Bufstream clusters are still less expensive than self-managed, single-region Apache Kafka clusters. There’s no other product in the market that even comes close.

If your business depends on streaming data, we’d love to make your workloads bulletproof. You can get a feel for Bufstream with our [interactive demo](/docs/bufstream/quickstart/index.md), dig into our [smaller-scale benchmarks and cost analysis](/docs/bufstream/cost/index.md), or chat with us in the [Buf Slack](https://buf.build/b/slack). For production deployments or to schedule a demo with our team, [reach out to us directly](https://buf.build/contact-us)!

‍
