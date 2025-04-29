---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/webhook/create/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/webhook/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/webhook/delete/"
  - - meta
    - property: "og:title"
      content: "buf beta registry webhook create - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/beta/registry/webhook/create.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/beta/registry/webhook/create/"
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
      content: "buf beta registry webhook create - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/beta/registry/webhook/create.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf beta registry webhook create

Create a repository webhook

### Usage

```console
$ buf beta registry webhook create [flags]
```

### Flags

#### \--callback-url _string_

The url for the webhook to callback to on a given event

#### \--event _string_

The event type to create a webhook for. The proto enum string value is used for this input (e.g. 'WEBHOOK_EVENT_REPOSITORY_PUSH')

#### \-h, --help

help for create

#### \--owner _string_

The owner name of the repository to create a webhook for

#### \--remote _string_

The remote of the repository the created webhook will belong to

#### \--repository _string_

The repository name to create a webhook for

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf beta registry webhook](../) - Manage webhooks for a repository on the Buf Schema Registry
