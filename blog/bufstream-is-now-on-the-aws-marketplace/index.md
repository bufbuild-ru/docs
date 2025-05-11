---
sidebar: false
prev: false
next: false

title: "Bufstream is now on the AWS Marketplace"
description: "We're excited to announce that Bufstream is now available on the AWS Marketplace. Enterprise customers can purchase through their AWS account and accelerate their deployment of Bufstream."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/bufstream-is-now-on-the-aws-marketplace"
  - - meta
    - property: "og:title"
      content: "Bufstream is now on the AWS Marketplace"
  - - meta
    - property: "og:description"
      content: "We're excited to announce that Bufstream is now available on the AWS Marketplace. Enterprise customers can purchase through their AWS account and accelerate their deployment of Bufstream."
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/681d02780b1ecc3726eb2026_Bufstream%20on%20AWS.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Bufstream is now on the AWS Marketplace"
  - - meta
    - property: "twitter:description"
      content: "We're excited to announce that Bufstream is now available on the AWS Marketplace. Enterprise customers can purchase through their AWS account and accelerate their deployment of Bufstream."
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/681d02780b1ecc3726eb2026_Bufstream%20on%20AWS.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Bufstream is now on the AWS Marketplace

We’re excited to announce that [Bufstream](https://buf.build/product/bufstream) is now available on the [AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-sxis5ql3aqgsy). Enterprise customers can purchase through their AWS account and accelerate their deployment of Bufstream.

## What is Bufstream?

Bufstream is the Kafka-compatible message queue built for the data lakehouse era. It's a drop-in replacement for Apache Kafka®, but instead of requiring expensive machines with large attached disks, Bufstream builds on top of off-the-shelf technologies such as S3 and Postgres to provide a Kafka implementation that is built for 2025.

As compared to Apache Kafka, Bufstream:

- Is [**8x less expensive to operate**](/docs/bufstream/cost/index.md), including Buf's licensing fees.
- Guarantees data quality: Bufstream eliminates bad data at the source: rather than hoping that every producer will opt into validation, Bufstream brokers work with the [Buf Schema Registry](https://buf.build/product/bsr) to enforce quality controls for all topics with Protobuf schemas.
- Scales throughput from zero to **100s of GB/s in a single cluster** with no fuss, with virtually zero maintenance.
- Is **active-active**: Bufstream brokers are **leaderless**. Writes can happen to any broker in any zone, reducing networking fees. For GCP clusters, writes can happen to any broker in **multiple regions** without significantly affecting cost characteristics.

## AWS Marketplace Overview

The AWS Marketplace is a digital store that helps customers discover, deploy, and manage a wide range of third-party software solutions. Companies are increasingly transacting through the Cloud Marketplaces for many different reasons, including:

- **Simplified Procurement:** Customers can now purchase Bufstream directly through their AWS accounts, eliminating the need for additional vendor approval processes.
- **Access to Committed Cloud Spend:** Purchases through the AWS Marketplace unlock the ability to better utilize already committed cloud spend.
- **Integrated Billing and Invoicing:** Marketplaces provide integrated billing and invoicing, allowing customers to manage their Bufstream subscription alongside their other AWS services.

## Self-Hosted on AWS

Bufstream deployments are completed self-hosted. We don't need to jump through any hoops to explain what BYOC is and isn't; Bufstream is entirely deployed within your VPC. Metadata is sensitive data, and we don't want to have access to yours.

For more information on how to deploy Bufstream in AWS, [see our Docs](/docs/bufstream/deployment/cluster-recommendations/index.md).

![](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/681d01d78f2c7da16861d400_Bufstream%20on%20AWS.png)

## Getting started

We want to help our customers improve their time to value. If you’d like to discuss purchasing Bufstream through the AWS Marketplace, [contact us](https://buf.build/contact-us) for more information.

For additional details about Bufstream and its features, see our [Bufstream Overview here](/docs/bufstream/index.md). If you’re interested in learning more, read about why [schema-driven development with Kafka is important](/blog/kafka-schema-driven-development/index.md) for your organization.
