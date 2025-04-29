---

title: "mTLS - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/auth/mtls/"
  - - meta
    - property: "og:title"
      content: "mTLS - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/auth/mtls/"
  - - meta
    - property: "twitter:title"
      content: "mTLS - Buf Docs"

---

# mTLS

You can use mutual TLS (mTLS) authentication as a fallback for SASL. A Bufstream broker derives the authentication principal from the client certificate if SASL authentication isn't used.To enable mTLS authentication, populate the config below and add it to `kafka.authentication` in your helm values.

```yaml
mtls:
  # Supports [ANONYMOUS, SUBJECT_COMMON_NAME, SAN_DNS, SAN_URI].
  principalSource: ""
```

If `principalSource` is `ANONYMOUS`, the user is considered authenticated as long as the TLS handshake succeeds. If `principalSource` is one of `SUBJECT_COMMON_NAME`, `SAN_DNS` or `SAN_URI`, the user is authenticated if the client has sent a certificate with the specified principal source.
