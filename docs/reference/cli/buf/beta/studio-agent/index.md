---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/studio-agent/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/stats/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/"
  - - meta
    - property: "og:title"
      content: "buf beta studio-agent - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/beta/studio-agent.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/beta/studio-agent/"
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
      content: "buf beta studio-agent - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/beta/studio-agent.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf beta studio-agent

Run an HTTP(S) server as the Studio agent

### Usage

```console
$ buf beta studio-agent [flags]
```

### Flags

#### \--bind _string_

The address to be exposed to accept HTTP requests

#### \--ca-cert _string_

The CA cert to be used in the client and server TLS configuration

#### \--client-cert _string_

The cert to be used in the client TLS configuration

#### \--client-key _string_

The key to be used in the client TLS configuration

#### \--disallowed-header _strings_

The header names that are disallowed by this agent. When the agent receives an enveloped request with these headers set, it will return an error rather than forward the request to the target server. Multiple headers are appended if specified multiple times

#### \--forward-header _stringToString_

The headers to be forwarded via the agent to the target server. Must be an equals sign separated key-value pair (like --forward-header=fromHeader1=toHeader1). Multiple header pairs are appended if specified multiple times

#### \-h, --help

help for studio-agent

#### \--origin _string_

The allowed origin for CORS options

#### \--port _string_

The port to be exposed to accept HTTP requests

#### \--private-network

Use the agent with private network CORS

#### \--server-cert _string_

The cert to be used in the server TLS configuration

#### \--server-key _string_

The key to be used in the server TLS configuration

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf beta](../) - Beta commands. Unstable and likely to change
