---

title: "SASL - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/auth/sasl/"
  - - meta
    - property: "og:title"
      content: "SASL - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/auth/sasl/"
  - - meta
    - property: "twitter:title"
      content: "SASL - Buf Docs"

---

# SASL

Bufstream supports several [SASL](https://datatracker.ietf.org/doc/html/rfc4422) authentication mechanisms for Kafka clients:

### OAUTH

You can use the [SASL/OAUTHBEARER](https://datatracker.ietf.org/doc/html/rfc7628) mechanism to leverage OAuth2.0/OIDC Authorization frameworks in a SASL context. Clients can send a signed JSON Web Token (JWT) aquired from an Identity Provider (IdP), which the server can validate using the public key of the signing key provided as a JSON Web Key Set (JWKS).

```yaml
kafka:
  authentication:
    sasl:
      oauthBearer:
        # How to aquire the JWKS.
        jwks:
          # If the JWKS is static, the configMap containing the JWKS at key 'jwks.json'.
          staticConfig:
          # A hosted JWKS that is accessible to the cluster.
          remote:
            # Kubernetes configMap with key 'url' of JWKS's URL, which must be a HTTPS url.
            urlConfig:
            # The keys are loaded once on startup and are refreshed every hour by default.
            # This controls the refresh interval.
            refreshInterval: 60m
            # Optional TLS config to access the URL.
            tls: {}
        # If provided, checks for the "aud" claim to match the provided value.
        audience:
        # If provided, checks for the "iss" claim to match the provided value.
        issuer:
```

### PLAIN

[SASL/PLAIN](https://datatracker.ietf.org/doc/html/rfc4616) is a simple username/password authentication mechanism. To enable it, add the following to your Helm values file:

```yaml
kafka:
  authentication:
    sasl:
      plain:
        # Kubernetes secrets containing `username` and `password` as secret keys.
        # See https://kubernetes.io/docs/concepts/configuration/secret/#basic-authentication-secret
        credentialsSecrets: []
```

### ANONYMOUS

As the name suggests, [SASL/ANONYMOUS](https://datatracker.ietf.org/doc/html/rfc4505) is used to authenticate as any anonymous principal. This doesn't provide any security layer and is _not_ recommended.

```yaml
kafka:
  authentication:
    sasl:
      anonymous: true
```

### SCRAM

To authenticate with [SASL/SCRAM](https://datatracker.ietf.org/doc/html/rfc5802), you need to configure a SCRAM admin user, which then has permission to create other SCRAM users.

#### Configuration

The SCRAM admin's credentials consist of a username, hash function, and a password in either plain text or the salted form, along with the salt and iteration used for salting.To configure the SCRAM admin with a password in plain text:

1.  Create a Kubernetes secret with keys `username` and `plaintext`.
2.  Populate the config below add it to `kafka.authentication.sasl` in your helm values.

Note that some client libraries, such as [segmentio/kafka-go](https://github.com/segmentio/kafka-go), may transform the password based on [SASLprep](https://datatracker.ietf.org/doc/html/rfc4013#section-2) before salting it and sending it as part of the SASL authentication exchange. Most libraries don't do this, and neither does Bufstream. If you are using a client that transforms the password, we recommend choosing a password consisting of only ASCII characters.

```yaml
scram:
  adminCredentials:
    # The hash algorithm used by the admin credentials. Supports [SHA256, SHA512].
    hash:
    # Only one of plaintextCredentialsSecret or salted can be set.
    # Kubernetes secret containing 'username' and 'plaintext' as secret keys.
    plaintextCredentialsSecret:
```

To configure the SCRAM admin with a salted password:

1.  Salt the admin password with a random salt, an iteration between 4096 and 16384 and an hash function of either `SHA256` or `SHA512`.
2.  Create a Kubernetes secret with keys `username`, `saltedPassword` and `salt`.
3.  Populate the config below add it to `kafka.authentication.sasl` in your helm values.

```yaml
scram:
  adminCredentials:
    # The hash algorithm used by the admin credentials. Supports [SHA256, SHA512].
    hash:
    # Salted admin credentials.
    salted:
      # The number of iterations in the salting process.
      iterations:
      # Kubernetes secret containing 'username', 'salt', 'salted-password' as secret keys.
      saltedSecret:
```

#### User Management

The SCRAM admin can manage other SCRAM users via the `DescribeScramUserCredentials` and `AlterScramUserCredentials` Kafka APIs.
