---
sidebar: false
prev: false
next: false

title: "Introducing Connect-Query: Integrate Protobuf with TanStack Query more effectively"
description: "A TanStack Query extension to seamlessly integrate Protobuf"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/blog/introducing-connect-query"
  - - meta
    - property: "og:title"
      content: "Introducing Connect-Query: Integrate Protobuf with TanStack Query more effectively"
  - - meta
    - property: "og:description"
      content: "A TanStack Query extension to seamlessly integrate Protobuf"
  - - meta
    - property: "og:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6750ce68c75105f82a0e2829_Introducing%20Connect-Query.png"
  - - meta
    - property: "og:type"
      content: "website"
  - - meta
    - property: "twitter:title"
      content: "Introducing Connect-Query: Integrate Protobuf with TanStack Query more effectively"
  - - meta
    - property: "twitter:description"
      content: "A TanStack Query extension to seamlessly integrate Protobuf"
  - - meta
    - property: "twitter:image"
      content: "https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6750ce68c75105f82a0e2829_Introducing%20Connect-Query.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"
---

# Introducing Connect-Query: Integrate Protobuf with TanStack Query more effectively

Engineers who are familiar with React know that synchronizing data across the application and preventing duplicate fetches is not a problem that comes solved out-of-the-box. Until a few months ago, we experienced the same state management challenges within the Buf Schema Registry's React front-end. We eventually paired our [Connect-Web](https://connectrpc.com/docs/web/getting-started) clients with [TanStack Query](https://react-query.tanstack.com/) which simplified our state management and allowed us to take advantage of the static types provided by our Protobuf schemas.

However, even though we were using Protobuf, we still needed to write redundant boilerplate code to manage the keys of the TanStack queries we were creating. We had the exciting opportunity to partner closely with [Tanner Linsley](https://twitter.com/tannerlinsley) and the incredible folks at [Nozzle](https://nozzle.io/) to produce a new library to solve these problems and rethink how engineers using TanStack should experience Protobuf in their development workflows.

## Introducing Connect-Query

**Today, in collaboration with Tanner Linsley and Nozzle, we're launching** [**Connect-Query**](https://github.com/connectrpc/connect-query-es)**, a TypeScript-first expansion pack for TanStack Query that gives you Protobuf superpowers.** Developing with Connect-Query provides several key benefits:

- **Type-safe methods:** Through code generation, Connect-Query ensures that query keys are always correct and consistent.
- **Flexible:** All hooks provided by Connect-Query return only the parameters required by TanStack Query, allowing for easy customization and overrides for all default behavior. This also provides enough flexibility for handling edge cases that fall outside of the usual fetch/mutate patterns.
- **Un-opinionated:** Connect-Query can be adapted to work with almost any other query library that accepts a key and query function.
- **Method discovery:** Strong types make it easy to discover RPC method sources in the IDE when typing its name.

Before Connect-Query, we found that it became repetitive to manually write all the glue code for connecting our RPCs, which also opened the door to potential programming errors. For example, consider the two `say` functions below:

```protobuf
import { ElizaService } from '@buf/connectrpc_eliza.connectrpc_es/connectrpc/eliza/v1/eliza_connectweb';
import { SayRequest, SayResponse } from '@buf/connectrpc_eliza.connectrpc_es/connectrpc/eliza/v1/eliza_pb'
import { useQuery, useQueryClient } from '@TanStack/react-query';
// A simple hook to take a service and return a client connected to the API:
import { useClient } from './util';

function useElizaSay(payload: SayRequest) {
    const elizaClient = useClient(ElizaService);
    return useQuery({
        queryKey: [ElizaService.typeName, 'say', payload],
        queryFn: () => elizaClient.say(payload)
    });
}

function useUpdateElizaSay(payload: SayRequest) {
    const queryClient = useQueryClient();
    return (newResponse: SayResponse) => {
        queryClient.setQueryData(
            [ElizaService.typeName, 'say', payload],
            newResponse
        );
    }
}

const Component = () = {
    const payload = { sentence: 'hello' };
    const { data } = useElizaSay(payload);
    const updateData = useUpdateElizaSay();
    ...
```

Connect-Query simplifies this work by generating the following outputs which include the query key and request/response message types:

```protobuf
import { createQueryService } from "@connectrpc/connect-query";
import { MethodKind } from "@bufbuild/protobuf";
import {
    SayRequest,
    SayResponse,
} from "@buf/connectrpc_eliza.bufbuild_es/connectrpc/eliza/v1/eliza_pb.js";

export const typeName = "connectrpc.eliza.v1.ElizaService";

export const say = createQueryService({
    service: {
        methods: {
            say: {
                name: "Say",
                kind: MethodKind.Unary,
                I: SayRequest,
                O: SayResponse,
            },
        },
        typeName: "connectrpc.eliza.v1.ElizaService",
    },
}).say;
```

With this set of generated code, our original implementation becomes simpler, more concise, and type-safe:

```protobuf
import { say } from '@buf/connectrpc_eliza.connectrpc_query-es/connectrpc/eliza/v1/eliza-ElizaService_connectquery';
import { SayResponse } from '@buf/connectrpc_eliza.connectrpc_es/connectrpc/eliza/v1/eliza_pb'
import { useQuery, useQueryClient } from '@tanstack/react-query';

const Component = () = {
    const { data } = useQuery(say.useQuery({ sentence: 'hello' }));
    const queryClient = useQueryClient();
    const updateData = (newResponse: SayResponse) => {
        queryClient.setQueryData(...say.setQueryData(newResponse, payload));
    }
    ...
}
```

## What about other frameworks?

As we work towards a v1.0 release for Connect-Query, we're dedicated to targeting the same frameworks as TanStack Query (including Solid, Svelte, and Vue). All of these libraries are already compatible with Connect-Query, but we have a bit more work we'd like to do to further enhance the experience across all TanStack-supported frameworks.

## Get started with Connect-Query

To get started with Connect-Query, take a look at the [GitHub repository](https://github.com/connectrpc/connect-query-es), check out the [documentation](https://connectrpc.com/docs/web/query/getting-started/), or install it directly from `npm`:

**`$`**`  npm install @connectrpc/connect-query @connectrpc/protoc-gen-connect-query    `

Copy to clipboard

For any questions or concerns, please [open a GitHub issue](https://github.com/connectrpc/connect-query-es/issues) or reach out to us through the [Buf Slack](https://buf.build/b/slack) - we'd love to hear your feedback!

‍
