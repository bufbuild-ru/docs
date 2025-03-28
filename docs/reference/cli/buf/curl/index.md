# buf curl

Invoke an RPC endpoint, a la 'cURL'

### Usage

```console
$ buf curl <url> [flags]
```

### Description

This command helps you invoke HTTP RPC endpoints on a server that uses gRPC or Connect.By default, server reflection is used, unless the --reflect flag is set to false. Without server reflection, a --schema flag must be provided to indicate the Protobuf schema for the method being invoked.The only positional argument is the URL of the RPC method to invoke. The name of the method to invoke comes from the last two path components of the URL, which should be the fully-qualified service name and method name, respectively.The URL can use either http or https as the scheme. If http is used then HTTP 1.1 will be used unless the --http2-prior-knowledge flag is set. If https is used then HTTP/2 will be preferred during protocol negotiation and HTTP 1.1 used only if the server does not support HTTP/2.The default RPC protocol used will be Connect. To use a different protocol (gRPC or gRPC-Web), use the --protocol flag. Note that the gRPC protocol cannot be used with HTTP 1.1.The input request is specified via the -d or --data flag. If absent, an empty request is sent. If the flag value starts with an at-sign (@), then the rest of the flag value is interpreted as a filename from which to read the request body. If that filename is just a dash (-), then the request body is read from stdin. The request body is a JSON document that contains the JSON formatted request message. If the RPC method being invoked is a client-streaming method, the request body may consist of multiple JSON values, appended to one another. Multiple JSON documents should usually be separated by whitespace, though this is not strictly required unless the request message type has a custom JSON representation that is not a JSON object.Request metadata (i.e. headers) are defined using -H or --header flags. The flag value is in "name: value" format. But if it starts with an at-sign (@), the rest of the value is interpreted as a filename from which headers are read, each on a separate line. If the filename is just a dash (-), then the headers are read from stdin.If headers and the request body are both to be read from the same file (or both read from stdin), the file must include headers first, then a blank line, and then the request body.Examples:Issue a unary RPC to a plain-text (i.e. "h2c") gRPC server, where the schema for the service is in a Buf module in the current directory, using an empty request message:

```console
$ buf curl --schema . --protocol grpc --http2-prior-knowledge  \
     http://localhost:20202/foo.bar.v1.FooService/DoSomething
```

Issue an RPC to a Connect server, where the schema comes from the Buf Schema Registry, using a request that is defined as a command-line argument:

```console
$ buf curl --schema buf.build/connectrpc/eliza  \
     --data '{"name": "Bob Loblaw"}'          \
     https://demo.connectrpc.com/connectrpc.eliza.v1.ElizaService/Introduce
```

Issue a unary RPC to a server that supports reflection, with verbose output:

```console
$ buf curl --data '{"sentence": "I am not feeling well."}' -v  \
     https://demo.connectrpc.com/connectrpc.eliza.v1.ElizaService/Say
```

Issue a client-streaming RPC to a gRPC-web server that supports reflection, where custom headers and request data are both in a heredoc:

```console
$ buf curl --data @- --header @- --protocol grpcweb                              \
     https://demo.connectrpc.com/connectrpc.eliza.v1.ElizaService/Converse  \
   <<EOM
Custom-Header-1: foo-bar-baz
Authorization: token jas8374hgnkvje9wpkerebncjqol4

{"sentence": "Hi, doc. I feel hungry."}
{"sentence": "What is the answer to life, the universe, and everything?"}
{"sentence": "If you were a fish, what of fish would you be?."}
EOM
```

Note that server reflection (i.e. use of the --reflect flag) does not work with HTTP 1.1 since the protocol relies on bidirectional streaming. If server reflection is used, the assumed URL for the reflection service is the same as the given URL, but with the last two elements removed and replaced with the service and method name for server reflection.If an error occurs that is due to incorrect usage or other unexpected error, this program will return an exit code that is less than 8. If the RPC fails otherwise, this program will return an exit code that is the gRPC code, shifted three bits to the left.

### Flags

#### \--cacert _string_

Path to a PEM-encoded X509 certificate pool file that contains the set of trusted certificate authorities/issuers. If omitted, the system's default set of trusted certificates are used to verify the server's certificate. This option is only valid when the URL uses the https scheme. It is not applicable if --insecure or -k flag is used

#### \-E, --cert _string_

Path to a PEM-encoded X509 certificate file, for using client certificates with TLS. This option is only valid when the URL uses the https scheme. A --key flag must also be present to provide the private key that corresponds to the given certificate

#### \--connect-timeout _float_

The time limit, in seconds, for a connection to be established with the server. There is no limit if this flag is not present

#### \-d, --data _string_

Request data. This should be zero or more JSON documents, each indicating a request message. For unary RPCs, there should be exactly one JSON document. A special value of '@' means to read the data from the file at . If the path is "-" then the request data is read from stdin. If the same file is indicated as used with the request headers flags (--header or -H), the file must contain all headers, then a blank line, and then the request body. It is not allowed to indicate stdin if the schema is expected to be provided via stdin as a file descriptor set or image

#### \--emit-defaults

Emit default values for JSON-encoded responses.

#### \-H, --header _strings_

Request headers to include with the RPC invocation. This flag may be specified more than once to indicate multiple headers. Each flag value should have the form "name: value". A special value of '@' means to read headers from the file at . If the path is "-" then headers are read from stdin. If the same file is indicated as used with the request data flag (--data or -d), the file must contain all headers, then a blank line, and then the request body. It is not allowed to indicate stdin if the schema is expected to be provided via stdin as a file descriptor set or image

#### \-h, --help

help for curl

#### \--http2-prior-knowledge

This flag can be used to indicate that HTTP/2 should be used. Without this, HTTP 1.1 will be used with URLs with an http scheme, and protocol negotiation will be used to choose either HTTP 1.1 or HTTP/2 for URLs with an https scheme. With this flag set, HTTP/2 is always used, even over plain-text.

#### \--http3

This flag can be used to indicate that HTTP/3 should be used. Without this, HTTP 1.1 will be used with URLs with an http scheme, and protocol negotiation will be used to choose either HTTP 1.1 or HTTP/2 for URLs with an https scheme. With this flag set, HTTP/3 is always used.

#### \-k, --insecure

If set, the TLS connection will be insecure and the server's certificate will NOT be verified. This is generally discouraged. This option is only valid when the URL uses the https scheme

#### \--keepalive-time _float_

The duration, in seconds, between TCP keepalive transmissions

#### \--key _string_

Path to a PEM-encoded X509 private key file, for using client certificates with TLS. This option is only valid when the URL uses the https scheme. A --cert or -E flag must also be present to provide the certificate and public key that corresponds to the given private key

#### \--list-methods

When set, the command lists supported methods and then exits. If server reflection is used to provide the RPC schema, then the given URL must be a base URL, not including a service or method name. If the schema source is not server reflection, the URL is not used and may be omitted.

#### \--list-services

When set, the command lists supported services and then exits. If server reflection is used to provide the RPC schema, then the given URL must be a base URL, not including a service or method name. If the schema source is not server reflection, the URL is not used and may be omitted.

#### \-n, --netrc

If true, a file named .netrc in the user's home directory will be examined to find credentials for the request. The credentials will be sent via a basic authorization header. The command will fail if the file does not have an entry for the hostname in the URL. This flag is ignored if a --user or -u flag is present. This is ignored if a --header or -H flag is provided that sets a header named 'Authorization'.

#### \--netrc-file _string_

This is just like use --netrc or -n, except that the named file is used instead of a file named .netrc in the user's home directory. This flag cannot be used with the --netrc or -n flag. This is ignored if a --header or -H flag is provided that sets a header named 'Authorization'.

#### \--no-keepalive

By default, connections are created using TCP keepalive. If this flag is present, they will be disabled

#### \-o, --output _string_

Path to output file to create with response data. If absent, response is printed to stdout

#### \--protocol _string_

The RPC protocol to use. This can be one of "grpc", "grpcweb", or "connect"

#### \--reflect

If true, use server reflection to determine the schema

#### \--reflect-header _strings_

Request headers to include with reflection requests. This flag may only be used when --reflect is also set. This flag may be specified more than once to indicate multiple headers. Each flag value should have the form "name: value". But a special value of '\*' may be used to indicate that all normal request headers (from --header and -H flags) should also be included with reflection requests. A special value of '@' means to read headers from the file at . If the path is "-" then headers are read from stdin. It is not allowed to indicate a file with the same path as used with the request data flag (--data or -d). Furthermore, it is not allowed to indicate stdin if the schema is expected to be provided via stdin as a file descriptor set or image

#### \--reflect-protocol _string_

The reflection protocol to use for downloading information from the server. This flag may only be used when server reflection is used. By default, this command will try all known reflection protocols from newest to oldest. If this results in a "Not Implemented" error, then older protocols will be used. In practice, this means that "grpc-v1" is tried first, and "grpc-v1alpha" is used if it doesn't work. If newer reflection protocols are introduced, they may be preferred in the absence of this flag being explicitly set to a specific protocol. The valid values for this flag are "grpc-v1" and "grpc-v1alpha". These correspond to services named "grpc.reflection.v1.ServerReflection" and "grpc.reflection.v1alpha.ServerReflection" respectively

#### \--schema _strings_

The module to use for the RPC schema. This is necessary if the server does not support server reflection. The format of this argument is the same as for the arguments to other buf sub-commands such as build and generate. It can indicate a directory, a file, a remote module in the Buf Schema Registry, or even standard in ("-") for feeding an image or file descriptor set to the command in a shell pipeline. If multiple schema flags are present, they will be consulted in order to resolve service and type names. Setting this flags implies --reflect=false unless a reflect flag is explicitly present. If both schema and reflect flags are in use, reflection will be used first and the schemas will be consulted in order thereafter if reflection fails to resolve a schema element.

#### \--servername _string_

The server name to use in TLS handshakes (for SNI) if the URL scheme is https. If not specified, the default is the origin host in the URL or the value in a "Host" header if one is provided

#### \--unix-socket _string_

The path to a unix socket that will be used instead of opening a TCP socket to the host and port indicated in the URL

#### \-u, --user _string_

The user credentials to send, via a basic authorization header. The value should be in the format "username:password". If the value has no colon, it is assumed to just be the username, in which case you will be prompted to enter a password. This overrides the use of a .netrc file. This is ignored if a --header or -H flag is provided that sets a header named 'Authorization'.

#### \-A, --user-agent _string_

The user agent string to send. This is ignored if a --header or -H flag is provided that sets a header named 'User-Agent'.

#### \-v, --verbose

Turn on verbose mode

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf](../) - The Buf CLI
