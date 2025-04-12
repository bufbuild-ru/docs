---
layout: home

hero:
  name: "Buf Studio Now Has Favorites!"
  tagline: "December 16, 2022"
---

## What is Buf Studio?

[Buf Studio](https://buf.build/studio) is our playground for interacting with gRPC and [Connect](https://connectrpc.com/) services stored in the [Buf Schema Registry](https://buf.build/product/bsr). It enables engineers to develop and debug APIs more effectively by sending requests through the Studio UI, which provides several key features:

- Autocomplete for APIs (using BSR Protobuf definitions)
- Schema validation
- Support for Connect and gRPC services
- Shareable requests for easier collaboration

More details are available in our [Buf Studio announcement](/blog/buf-studio/index.md) and [documentation](/docs/bsr/studio/index.md).

## Introducing Studio Favorites

In the past, users would lose access to requests upon exiting their Buf Studio session. Although this workflow was useful for experimentation and schema validation, it meant users had to painstakingly reconstruct requests or save them elsewhere if they wanted to send them again later. As of today, Buf Studio supports saving requests through a new feature: [Studio Favorites](/docs/bsr/studio/index.md#saving-requests)!

Now, each time a user sends a request through Buf Studio, an option is available to add that request as a favorite. Favoriting a request saves it to the user’s BSR profile for later usage, making the target URL, headers, request body, and protocol all easily retrievable. Saved requests can be renamed, deleted, and, of course, replayed in the Studio editor.

### When should I favorite requests?

Favorites can be especially useful:

- When working in Studio with multiple endpoints, payloads, and headers across several browser tabs
- If the project/API is expected to take multiple days to build and test
- For users who already find themselves organizing and storing requests elsewhere (such as in a git repository or document)
- To store requests for an API that will have new additions in the future

### How do I use favorites?

Follow these steps:

- [Log in](https://buf.build/login) to the BSR
- Go to [Buf Studio](https://buf.build/studio)
- Select a repository
- Construct a request to your desired API
- Send the request, and both request and response will appear in the "Responses" section to the right
- Hover over the new entry to reveal a star icon. When clicked, it will preserve the target URL, request body, headers, and protocol for later reference

![Studio add favorite](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6747cfbe6ed4e228781cf326_studio-add-favorite-CXBTURXR.png)

![Studio load favorite](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6747cfbe43a57d0936bcbb9f_studio-load-favorite-Y5JSZCFL.gif)

### Get started with favorites

To start adding your own favorites in Buf Studio, visit [buf.build/studio](https://buf.build/studio). You can also take a closer look at the [tutorial video we released on YouTube](https://youtu.be/qOFE6cM8ofA). For any questions or concerns, check out [the Studio docs](/docs/bsr/studio/index.md#saving-requests), and don't hesitate to reach out to us on [Slack](https://buf.build/b/slack) - we’d love to hear your feedback!

‍
