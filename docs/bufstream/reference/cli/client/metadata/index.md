---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bufstream/reference/cli/client/metadata/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bufstream/reference/cli/client/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bufstream/reference/configuration/bufstream-yaml/"
  - - meta
    - property: "og:title"
      content: "bufstream client metadata - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/reference/cli/client/metadata.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bufstream/reference/cli/client/metadata/"
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
      content: "bufstream client metadata - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bufstream/reference/cli/client/metadata.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# bufstream client metadata

client metadata command

### Usage

```console
$ bufstream client metadata [flags]
```

### Description

Connects to bufstream server and requests for metadata.

### Flags

#### \-h, --help

help for metadata

### Flags inherited from parent commands

#### \--bootstrap-address _string_

Bootstrap address of the bufstream broker

#### \--client-id _string_

ClientID value to send to the bufstream broker

#### \--root-ca-path _strings_

A path to Root CA certificate to load

### Parent Command

- [bufstream client](../) - client commands
