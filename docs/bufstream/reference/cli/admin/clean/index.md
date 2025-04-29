---

title: "Clean - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/reference/cli/admin/clean/"
  - - meta
    - property: "og:title"
      content: "Clean - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/reference/cli/admin/clean/"
  - - meta
    - property: "twitter:title"
      content: "Clean - Buf Docs"

---

# bufstream admin clean

Perform Bufstream cleaning tasks

### Usage

```console
$ bufstream admin clean [flags]
```

### Flags

#### \-h, --help

help for clean

#### \--help-tree

Print the entire sub-command tree

### Flags inherited from parent commands

#### \--cacert _string_

Path to a PEM-encoded X509 certificate pool file that contains the set of trusted certificate authorities/issuers. If omitted, the system's default set of trusted certificates are used to verify the server's certificate. This option is only valid when the URL uses the https scheme. It is not applicable if --insecure or -k flag is used

#### \-E, --cert _string_

Path to a PEM-encoded X509 certificate file, for using client certificates with TLS. This option is only valid when the URL uses the https scheme. A --key flag must also be present to provide the private key that corresponds to the given certificate

#### \--debug

Turn on debug logging

#### \-k, --insecure

If set, the TLS connection will be insecure and the server's certificate will NOT be verified. This is generally discouraged. This option is only valid when the URL uses the https scheme

#### \--key _string_

Path to a PEM-encoded X509 private key file, for using client certificates with TLS. This option is only valid when the URL uses the https scheme. A --cert or -E flag must also be present to provide the certificate and public key that corresponds to the given private key

#### \--log-format _string_

The log format \[text,json\]

#### \--servername _string_

The server name to use in TLS handshakes (for SNI) if the URL scheme is https. If not specified, the default is the origin host in the URL

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

#### \--url _string_

URL to admin service

### Subcommands

- [bufstream admin clean intake](intake/) - cleans intake files
- [bufstream admin clean storage](storage/) - Delete the underlying local storage for the bufstream cluster
- [bufstream admin clean topics](topics/) - cleans topics/partitions

### Parent Command

- [bufstream admin](../) - Perform Bufstream administrative tasks
