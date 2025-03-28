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
