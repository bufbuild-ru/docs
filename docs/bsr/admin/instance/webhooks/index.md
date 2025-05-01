---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/webhooks/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/audit-logs/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/admin/instance/federation/"
  - - meta
    - property: "og:title"
      content: "Webhooks - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/instance/webhooks.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/admin/instance/webhooks/"
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
      content: "Webhooks - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/admin/instance/webhooks.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Webhooks

This feature is only available on the Pro and Enterprise plans.

Private BSR instances offer webhooks to notify your backend services when a specific event of interest happens. This allows you to build integrations triggering further actions — for example:

- Run a CI/CD pipeline to run appropriate downstream builds, tests, deployments
- Notify interested parties to inform them of any changes to `.proto` files or versions
- Tag your git repository based on your BSR tags

Webhooks are in **alpha**, which includes support for a single event: a successful `buf push` on a repository.Webhooks are _disabled_ by default. Contact [Support](https://support.buf.build) or your Buf representative if you want webhooks enabled for your private BSR instance. If webhooks are enabled, then by default they process batches of up to 20 events every 5 seconds.Integrating consists of writing an event listener and then subscribing to events. The event listener must implement the [EventService](https://buf.build/bufbuild/buf/docs/main:buf.alpha.webhook.v1alpha1#buf.alpha.webhook.v1alpha1.EventService) and subscriptions are managed through the [WebhookService](https://buf.build/bufbuild/buf/docs/main:buf.alpha.registry.v1alpha1#buf.alpha.registry.v1alpha1.WebhookService). These services can be easily interacted with using the Connect library, as shown below in [Webhooks with Connect](#webhooks-with-connect).If you can't use Connect, see the [Webhooks without Connect](#webhooks-without-connect) guide below that shows you how to:

- manage webhook subscriptions using a regular curl+JSON payload; and
- build an event listener that's compatible with [Connect](https://connectrpc.com/) (`application/proto`) requests.

::: tip In the samples below, please use the domain name for your private BSR instance (for example, `https://buf.example.com`) in place of `BSR_INSTANCE_DOMAIN_NAME`.

:::

## Webhooks with Connect

This guide uses a Go [Connect](https://connectrpc.com/) client and generated Go code for the webhooks service. This code was generated using the `connectrpc/go` [plugin](https://buf.build/connectrpc/go) in the [BSR public repository](https://buf.build/bufbuild/buf).The generated module from that plugin includes:

- packages based in the [original Protobuf packages](https://buf.build/bufbuild/buf/docs/main) from the BSR module
- a nested `connect` package for RPC handlers and clients that use the [connect-go library](https://connectrpc.com/docs/go/getting-started).

> _The steps should be similar for the JS generated code, which uses the `protocolbuffers/js` plugin._

### Prepare to receive webhooks

You build the webhook listener using the Connect client code generated from the [Webhook Event service](https://buf.build/bufbuild/buf/docs/main:buf.alpha.webhook.v1alpha1#buf.alpha.webhook.v1alpha1.EventService). First, fetch the generated go module from the [connect-go plugin](https://buf.build/bufbuild/buf/sdks/main):

```console
$ go get buf.build/gen/go/bufbuild/buf/connectrpc/go
```

Here's an example Connect implementation:

```go
package main

import (
    "context"
    "fmt"
    "net/http"

    connect "connectrpc.com/connect"
    registryv1alpha1 "buf.build/gen/go/bufbuild/buf/connectrpc/go/buf/alpha/registry/v1alpha1"
    webhookv1alpha1 "buf.build/gen/go/bufbuild/buf/connectrpc/go/buf/alpha/webhook/v1alpha1"
    webhookconnect "buf.build/gen/go/bufbuild/buf/connectrpc/go/buf/alpha/webhook/v1alpha1/webhookv1alpha1connect"
)

type webhookEventHandler struct{}

func (h *webhookEventHandler) Event(
    ctx context.Context,
    req *connect.Request[webhookv1alpha1.EventRequest],
) (*connect.Response[webhookv1alpha1.EventResponse], error) {
    // Handle the type-safe incoming request for the push event:
    payload := req.Msg
    switch payload.Event {
    case registryv1alpha1.WebhookEvent_WEBHOOK_EVENT_REPOSITORY_PUSH:
        pushEvent := payload.Payload.GetRepositoryPush()
        fmt.Println("received repo push event:", pushEvent)
    default:
        fmt.Println("unknown event:", payload.Event)
    }

    // Webhook listener has an empty response
    return connect.NewResponse(&webhookv1alpha1.EventResponse{}), nil
}

// Connect handler based on: https://connectrpc.com/docs/go/getting-started#implement-handler
func main() {
    mux := http.NewServeMux()
    mux.Handle(webhookconnect.NewEventServiceHandler(&webhookEventHandler{}))
    http.ListenAndServe("localhost:8080", mux)
}
```

### Manage subscriptions

Webhooks are managed through the BSR API. The easiest way to interact with the API is to use the generated Connect client. Users with the [Admin role](../../roles/#base-resource-roles) in a repository can manage webhook subscriptions for that repository.Below is an example of managing webhooks using the BSR [Webhook service](https://buf.build/bufbuild/buf/docs/main:buf.alpha.registry.v1alpha1#buf.alpha.registry.v1alpha1.WebhookService). First, fetch the generated go module from the connect-go [template](https://buf.build/bufbuild/buf/sdks/main) if you didn't in the previous step:

```console
$ go get buf.build/gen/go/bufbuild/buf/connectrpc/go
```

Then in your Go code, set up the subscription:

```go
package main

import (
    "context"
    "log"
    "net/http"

    connect "connectrpc.com/connect"
    registryv1alpha1 "buf.build/gen/go/bufbuild/buf/connectrpc/go/buf/alpha/registry/v1alpha1"
    registryconnect "buf.build/gen/go/bufbuild/buf/connectrpc/go/buf/alpha/registry/v1alpha1/registryv1alpha1connect"
)

func main() {
    connectClient := registryconnect.NewWebhookServiceClient(
        http.DefaultClient,
        "https://BSR_INSTANCE_DOMAIN_NAME", // BSR API
    )

    // Creating the webhook. Each repository event allows a single webhook. Since
    // we support only push events at the moment, this means that a repository can
    // have just one webhook subscription in total.
    createReq := connect.NewRequest(&registryv1alpha1.CreateWebhookRequest{
        WebhookEvent:   registryv1alpha1.WebhookEvent_WEBHOOK_EVENT_REPOSITORY_PUSH,
        OwnerName:      "ORG_NAME_OR_USERNAME",
        RepositoryName: "REPOSITORY_NAME",
        CallbackUrl:    "https://your.callback.url/buf.alpha.webhook.v1alpha1.EventService/Event",
    })
    createReq.Header().Add("Authorization", "Bearer YOUR_API_TOKEN")

    createResp, err := connectClient.CreateWebhook(context.Background(), createReq)
    if err != nil {
        log.Fatalf("creating webhook failed: %v", err)
    }
    webhook := createResp.Msg.Webhook
    if webhook == nil {
        log.Fatal("nil webhook response")
    }
    log.Println("new webhook created!", webhook)

    // Checking webhook exists
    listReq := connect.NewRequest(&registryv1alpha1.ListWebhooksRequest{
        OwnerName:      "ORG_NAME_OR_USERNAME",
        RepositoryName: "REPOSITORY_NAME",
    })
    listReq.Header().Add("Authorization", "Bearer YOUR_API_TOKEN")

    listResp, err := connectClient.ListWebhooks(context.Background(), listReq)
    if err != nil {
        log.Fatalf("list webhooks failed: %v", err)
    }
    log.Println("existing webhooks:", listResp)

    // Deleting the webhook. Is your callback URL going to change and you need to
    // update your integration? You can remove you webhook and recreate it again.
    // Note that pending notifications for events that were recently triggered may
    // be delivered anyway after deleting the webhook subscription.
    deleteReq := connect.NewRequest(&registryv1alpha1.DeleteWebhookRequest{
        WebhookId: webhook.WebhookId,
    })
    deleteReq.Header().Add("Authorization", "Bearer YOUR_API_TOKEN")

    deleteResp, err := connectClient.DeleteWebhook(context.Background(), deleteReq)
    if err != nil {
        log.Fatalf("delete webhook failed: %v", err)
    }
    log.Println("webhook deleted:", deleteResp)
}}
```

## Webhooks without Connect

Connect isn't required for communicating with the webhooks service — because the BSR is also written with Connect handlers, you can make the same calls using curl with JSON.

### Prepare to receive webhooks

The BSR supports [Connect-compatible](https://connectrpc.com/) backend services for webhooks. Events trigger an HTTP POST to the subscribed callback URL, with a `Content-Type: application/proto` header and a proto payload with the event details.A listener service must exist at the callback URL that's compatible with the `Event` RPC signature in the public `bufbuild` [Protobuf docs](https://buf.build/bufbuild/buf/docs/main:buf.alpha.webhook.v1alpha1#buf.alpha.webhook.v1alpha1.EventService). Here are the [possible payloads](https://buf.build/bufbuild/buf/docs/main:buf.alpha.webhook.v1alpha1#buf.alpha.webhook.v1alpha1.EventRequest), and the [expected response](https://buf.build/bufbuild/buf/docs/main:buf.alpha.webhook.v1alpha1#buf.alpha.webhook.v1alpha1.EventResponse).

### Manage subscriptions with the Buf CLI

You can manage your webhooks with the `buf beta registry webhook` commands. `WEBHOOK_EVENT_REPOSITORY_PUSH` is the only event type that's currently available.

#### Create a webhook subscription with the Buf CLI

```console
$ buf beta registry webhook create \
  --owner="<the organization or username that owns the repository>" \
  --repository="<the repository name>" \
  --callback-url="https://your.callback.url/buf.alpha.webhook.v1alpha1.EventService/Event" \
  --event="WEBHOOK_EVENT_REPOSITORY_PUSH" \
  --remote="BSR_INSTANCE_DOMAIN_NAME"
```

#### List webhook subscriptions with the Buf CLI

```console
$ buf beta registry webhook list \
  --owner="<the organization or username that owns the repository>" \
  --repository="<the repository name>" \
  --remote="BSR_INSTANCE_DOMAIN_NAME"
```

#### Delete webhook subscriptions with the Buf CLI

```console
$ buf beta registry webhook delete \
  --id="the-webhook-id-that-will-be-deleted" \
  --remote="BSR_INSTANCE_DOMAIN_NAME"
```

### Manage subscriptions with curl

Webhooks are managed through the [BSR API](https://buf.build/bufbuild/buf/docs/main:buf.alpha.registry.v1alpha1#buf.alpha.registry.v1alpha1.WebhookService). Requests can be made to this API using an RPC client like [Connect](https://connectrpc.com/) or via `curl` commands with JSON payloads.

#### Create webhook subscription with curl

Use the [`CreateWebhook` RPC](https://buf.build/bufbuild/buf/docs/main:buf.alpha.registry.v1alpha1#buf.alpha.registry.v1alpha1.WebhookService.CreateWebhook) to create webhooks for a repository:

```console
$ curl --location --request POST 'https://BSR_INSTANCE_DOMAIN_NAME/buf.alpha.registry.v1alpha1.WebhookService/CreateWebhook' \
--header 'Authorization: Bearer <BSR api token>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "owner_name": "<the organization or username that owns the repository>",
    "repository_name": "<the repository name>",
    "webhook_event": "WEBHOOK_EVENT_REPOSITORY_PUSH",
    "callback_url": "https://your.callback.url/buf.alpha.webhook.v1alpha1.EventService/Event"
}'
---
HTTP Status: 200 OK
Content-Type: application/json
{
  "webhook": {
    "event": "WEBHOOK_EVENT_REPOSITORY_PUSH",
    "webhookId": "the-new-webhook-id",
    "createTime": "2022-07-11T21:15:27.633999Z",
    "updateTime": "2022-07-11T21:15:27.633999Z",
    "repository_name": "<the repository name>",
    "owner_name": "<the organization or username that owns the repository>",
    "callbackUrl": "https://your.callback.url/buf.alpha.webhook.v1alpha1.EventService/Event"
  }
}
```

For the `callback_url` parameter, make sure you use an **https** scheme, and you suffix the complete RPC path to the `Event` method, with no queries, fragments, or any additional characters.

#### List webhook subscriptions with curl

After creating a webhook subscription for a repository, you can confirm its existence using the [`ListWebhooks` RPC](https://buf.build/bufbuild/buf/docs/main:buf.alpha.registry.v1alpha1#buf.alpha.registry.v1alpha1.WebhookService.ListWebhooks):

```console
$ curl --location --request POST 'https://BSR_INSTANCE_DOMAIN_NAME/buf.alpha.registry.v1alpha1.WebhookService/ListWebhooks' \
--header 'Authorization: Bearer <your BSR api token>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "owner_name": "<the organization or username that owns the repository>",
    "repository_name": "<the repository name>"
}'
```

This should return a successful response in the form of:

```console
HTTP Status: 200 OK
Content-Type: application/json
{
  "webhooks": [
    {
      "event": "WEBHOOK_EVENT_REPOSITORY_PUSH",
      "webhookId": "the-webhook-id",
      "createTime": "2022-07-11T21:15:27.633999Z",
      "updateTime": "2022-07-11T21:15:27.633999Z",
      "repository_name": "<the repository name>",
      "owner_name": "<the organization or username that owns the repository>",
      "callbackUrl": "https://your.callback.url/buf.alpha.webhook.v1alpha1.EventService/Event"
    }
  ]
}
```

#### Delete webhook subscription with curl

Webhooks can be deleted using the [`DeleteWebhook` RPC](https://buf.build/bufbuild/buf/docs/main:buf.alpha.registry.v1alpha1#buf.alpha.registry.v1alpha1.WebhookService.DeleteWebhook):

```console
$ curl --location --request POST 'https://BSR_INSTANCE_DOMAIN_NAME/buf.alpha.registry.v1alpha1.WebhookService/DeleteWebhook' \
--header 'Authorization: Bearer <your BSR api token>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "webhook_id": "the-webhook-id-that-will-be-deleted"
}'
---
HTTP Status: 200 OK
Content-Type: application/json
{}
```

## Test receiving a webhook push event

You can test receiving repository push events with this snippet:

```console
# Testing your webhook service using binary proto.
# You can use `buf beta convert` to take a JSON payload and
# convert it into binary proto format, and then use that
# as a body payload to send via curl.
$ echo '{
  "event": "WEBHOOK_EVENT_REPOSITORY_PUSH",
  "payload": {
    "repositoryPush": {
      "eventTime": "2022-07-11T15:07:30Z",
      "repository": {
        "id": "my-repo-id",
        "name": "my-repo-name",
        "createTime": "2022-07-10T15:07:30Z",
        "updateTime": "2022-07-10T18:07:30Z",
        "userId": "the-user-id",
        "visibility": "VISIBILITY_PUBLIC"
      },
      "repositoryCommit": {
        "author": "the-author-username",
        "commitSequenceId": 10,
        "createTime": "2022-07-11T15:07:30Z",
        "id": "the-commit-id",
        "name": "the-commit-name",
        "digest": "the-commit-digest",
        "tags": [
          {
            "author": "the-tag-author",
            "commitName": "the-commit-hash",
            "id": "the-tag-id",
            "createTime": "2022-07-11T15:07:30Z",
            "name": "the-tag-name"
          }
        ]
      }
    }
  }
}' | \
    buf beta convert buf.build/bufbuild/buf \
        --input=-#format=json \
        --type buf.alpha.webhook.v1alpha1.EventRequest | \
    curl -X POST https://your.callback.url/buf.alpha.webhook.v1alpha1.EventService/Event \
        -H "Content-Type: application/proto" \
        --data-binary @-
```

Once a webhook subscription is configured, your listener begins receiving `buf push` events with a Protobuf payload in the `EventRequest` format. The payload includes the commit object that triggered the event (including the author), as well as the repository object that this commit was pushed to. For more details on the payload, visit the docs [definition](https://buf.build/bufbuild/buf/docs/main:buf.alpha.webhook.v1alpha1#buf.alpha.webhook.v1alpha1.EventRequest).
