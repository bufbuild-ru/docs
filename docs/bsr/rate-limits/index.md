---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/rate-limits/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/studio/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/apis/api-access/"
  - - meta
    - property: "og:title"
      content: "Rate limits - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/rate-limits.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/rate-limits/"
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
      content: "Rate limits - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/rate-limits.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Rate limits

The BSR limits the number of API requests you can make within a specified amount of time. These limits prevent abuse and ensures that the BSR remains available for all users.

## Limits

### Code generation

#### Unauthenticated traffic

The BSR allows 10 unauthenticated code generation requests per hour, with a burst of up to 10 requests. If you send more than 10 unauthenticated requests per hour using [remote plugins](../remote-plugins/overview/), you’ll receive a rate limit error.To prevent service interruptions, ensure that your CI jobs and local usages of the Buf CLI authenticate with the Buf Schema Registry (BSR) before making these requests.Pro and Enterprise users aren't affected by this limit.

## How to authenticate

If you don't have a BSR account, you can [sign up](https://buf.build/signup)—it's free. Remote plugins are free as well. If you already have an account, do the following:

- **Locally:** Run `buf registry login` and follow the instructions.
- **In CI:** Create a [BSR token](https://buf.build/settings/user) and set it as a secret environment variable named `BUF_TOKEN`.

For step-by-step instructions, including those for GitHub Actions, see our [authentication](../authentication/) docs.

#### Authenticated traffic

The BSR allows 960 authenticated code generation requests per hour, with a burst of up to 120 requests.

### FileDescriptorSetService

#### Unauthenticated traffic

Only authenticated traffic is permitted to access this endpoint.

#### Authenticated traffic

The BSR allows 1 authenticated request per second to this service, with a burst of up to 2 requests.

### Buf CLI

Every call to `buf generate` that involves remote plugins counts as one request, with a max limit of 20 plugins per request. For example, if you have a `buf.gen.yaml` file with 22 remote plugins, the BSR rejects your request.If you have exactly 20 (or fewer) plugins and run `buf generate`, this counts as one request.

## Monitoring your rate limit

Callers can check response headers to determine the current status of rate limiting.

| Header                | Description                                                                         |
| --------------------- | ----------------------------------------------------------------------------------- |
| X-RateLimit-Limit     | The number of requests allowed in a window of time                                  |
| X-RateLimit-Remaining | The number of requests that can still be made in the current window of time         |
| X-RateLimit-Reset     | The number of seconds until the current rate limit window completely resets         |
| Retry-After           | When rate limited, the number of seconds to wait before another request is accepted |

## Exceeding the rate limit

Requests that exceed a rate limit return HTTP status code 429 and the `X-RateLimit-Remaining` header is `0`. You shouldn't retry your request until after the number of seconds specified in the `Retry-After` header.

## Increasing your rate limit

If you want a higher rate limit, consider making authenticated requests instead of unauthenticated requests. Authenticated requests have a significantly higher rate limit than unauthenticated requests. See how to [authenticate the Buf CLI](../authentication/#authenticating-in-ci) for details on authenticating.If you are hitting a rate limit that you don't believe you should be, [contact us](../../contact/).
