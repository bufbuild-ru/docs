# bufstream admin repair topics

repairs issues with topics

### Usage

```console
$ bufstream admin repair topics [flags]
```

### Description

Finds and repairs various issues with topics.

### Flags

#### \--experimental

Enable experimental checks

#### \-h, --help

help for topics

#### \--topic _strings_

The topics. If not set, runs on all topics.

### Flags inherited from parent commands

#### \--cacert _string_

Path to a PEM-encoded X509 certificate pool file that contains the set of trusted certificate authorities/issuers. If omitted, the system's default set of trusted certificates are used to verify the server's certificate. This option is only valid when the URL uses the https scheme. It is not applicable if --insecure or -k flag is used

#### \-E, --cert _string_

Path to a PEM-encoded X509 certificate file, for using client certificates with TLS. This option is only valid when the URL uses the https scheme. A --key flag must also be present to provide the private key that corresponds to the given certificate

#### \--debug

Turn on debug logging

#### \--fix

Fix any issues found.

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

### Parent Command

- [bufstream admin repair](../) - Perform Bufstream repair tasks
