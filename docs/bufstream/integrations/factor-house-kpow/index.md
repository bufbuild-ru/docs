---
description: "Integration instructions for Factor House Kpow."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/integrations/factor-house-kpow/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bufstream/integrations/redpanda-console/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bufstream/deployment/"
  - - meta
    - property: "og:title"
      content: "Factor House Kpow - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/integrations/factor-house-kpow.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/integrations/factor-house-kpow/"
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
      content: "Factor House Kpow - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/integrations/factor-house-kpow.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Factor House Kpow

[Factor House Kpow](https://factorhouse.io/kpow) is a web UI for Apache Kafka which can be used with Bufstream.

## Get a license

You'll need a license for the Community Edition or Enterprise Edition of Kpow. Head over to Factor House to [get a community license](https://factorhouse.io/kpow/community), or [get in touch with their team](https://factorhouse.io/contact) to discuss enterprise offerings.

## Configuration

Kpow is configured via [environment variables](https://docs.factorhouse.io/kpow-ce/configuration). Setup for Bufstream is no different than any other Apache Kafka cluster. The following is an example of connecting to both Bufstream and the BSR:

```text
# The address of your Bufstream instance
BOOTSTRAP=bufstream:9092

# SCHEMA_REGISTRY values only needed if you would like to connect to the Buf Schema Registry as well

# The URL for your instance of the Confluent Schema Registry within the Buf Schema Registry
SCHEMA_REGISTRY_URL=https://demo.buf.dev/integrations/confluent/bufstream-demo

# Not needed for demo.buf.dev.
SCHEMA_REGISTRY_AUTH=USER_INFO

# The username of the BSR bot user you use to authenticate.
# Not needed for demo.buf.dev.
SCHEMA_REGISTRY_USER=example-bot-user

# The token for the above BSR bot user.
# Not neede for demo.buf.dev.
SCHEMA_REGISTRY_PASSWORD=example-bot-token

### Your License Details
LICENSE_ID=<license-id>
LICENSE_CODE=<license-code>
LICENSEE=<licensee>
LICENSE_EXPIRY=<license-expiry>
LICENSE_SIGNATURE=<license-signature>
```

## Use Kpow with a local Bufstream instance

Save the following file as `kpow.env` (filling out the license information with your license):

```text
BOOTSTRAP=host.docker.internal:9092
LICENSE_ID=<license-id>
LICENSE_CODE=<license-code>
LICENSEE=<licensee>
LICENSE_EXPIRY=<license-expiry>
LICENSE_SIGNATURE=<license-signature>
```

Start an in-memory Bufstream instance listening on the default Kafka port:

```bash
docker run -p 9092:9092 \
  --env BUFSTREAM_KAFKA_HOST=0.0.0.0 \
  --env BUFSTREAM_KAFKA_PUBLIC_HOST=host.docker.internal \
  --env BUFSTREAM_KAFKA_PUBLIC_PORT=9092 \
  bufbuild/bufstream:latest \
  serve --inmemory
```

In a separate terminal, start Kpow:

```bash
docker run -p 3000:3000 \
  --env-file kpow.env \
  factorhouse/kpow-ce:latest
```

Once both Bufstream and Kpow are running, navigate to `localhost:3000` in your browser.
