---
layout: home

hero:
  name: "Building a modern gRPC-powered microservice using Node.js, Typescript, and Connect"
  tagline: "April 27, 2023"
---

_Authored by Joe McKenney, CEO of_ [_Dopt_](https://dopt.com/)

> Note: We’re reposting [Joe’s post](https://blog.dopt.com/building-a-modern-grpc-powered-microservice) with permission, as a step-by-step illustration of how one company uses schema-driven development and [Connect](https://connectrpc.com/) to build and test a gRPC API.

> Some of the packages for Connect-ES have since been refactored and are slightly out of date. All concepts presented are still current and accurate, but NPM packages related to Connect-ES have changed scopes from `@bufbuild` to `@connectrpc`. For more information, see the [release notes](https://github.com/connectrpc/connect-es/releases/tag/v0.13.1) for the v0.13.1 release of Connect-ES.

## Microservices in 2023

The microservice architecture is not new ([1](https://martinfowler.com/articles/microservices.html)). On the contrary, it’s a well-written-on topic, with a deep space of exploration into its tradeoffs ([2](https://martinfowler.com/articles/microservice-trade-offs.html)). Lots of folks say you don’t need them ([3](https://itnext.io/you-dont-need-microservices-2ad8508b9e27)) and write about their harm; some companies have even migrated from microservices to a monolith ([4](https://segment.com/blog/goodbye-microservices/)), yet many successful companies still implement this pattern. I’m probably in Martin Fowler’s [Monolith First](https://martinfowler.com/bliki/MonolithFirst.html) camp, i.e., there is a place for microservices, but you should both not start there and wait until you have identified a real need for them. We started with a monolith at Dopt because it’s the simplest architecture, and it allowed us to build and iterate quickly, as we learned from early customers. Over time, we’ve broken pieces of the application out into their own services.

Moving past the now-required disclaimer on microservices, this article aims to share our experience building an internal gRPC-powered microservice at Dopt using Node.js, Typescript, and Connect. This internal service was built to support analytics-related use cases with Dopt. In this case, we weren’t breaking out pre-existing implementation from the monolith but building a microservice from the start for this functionality. Building a microservice to support our needs here made sense due to the following.

- The data in this service’s DB is loosely coupled to data in other services, i.e., low-to-no risk of cross-service transactions
- This service’s requirements for storage are likely to evolve over time, potentially away from a relational database

## gRPC-powered APIs in Node.js

A bit of tl;dr on Dopt before we dive in. Dopt is essentially a web application for designing _user_ state machines on a canvas, paired with APIs and SDKs for utilizing those machines at runtime. The idea is that you can instantiate these machines per user of your product. We let you progress the user through the machine and handle the persistence of the user’s state in each machine for you. You can iterate on and version your machines, and we’ll handle migrating your users across machines’ versions. This should be deep enough to contextualize any Dopt-specific bits in this article (but if you’re interested in diving deeper, you can check out the Dopt [docs](https://docs.dopt.com/what-is-dopt/)).

In setting out to build this service, we wanted to use gRPC for its APIs. We’ve been reaching for REST when building APIs so far, primarily out of necessity, i.e., our public APIs needed auto-generated client SDKs and docs for developers working with them. We built those APIs with Fastify and Typebox but felt burned by a code-first approach to generating an OpenAPI spec. I’ll spare you the details and save that experience/learning for another article. Suffice it to say we love gRPC’s schema-first approach.

Now that we are building internal services, we have more freedom in how we design the API. gRPC is a great and well-documented choice for internal services, but building gRPC-powered APIs in Node.js is…an adventure. Much of the tooling and frameworks for gRPC are targeting languages traditionally used on the backend, e.g. Java, Go, etc. Accordingly, developers working with Javascript (or Typescript, for that matter) have not been the target audience.

Connect is a game changer in this regard. Check out Buf’s blogs, particularly [Connect: a better gRPC](/blog/connect-a-better-grpc/index.md) and [API design is stuck in the past](/blog/api-design-is-stuck-in-the-past/index.md). We’re largely a TypeScript shop and didn’t feel like this service needed to be in any other language, so Connect felt like first-class support for building gRPC-powered APIs with the tech we use at Dopt.

What follows is a tutorial-style post on how we developed our gRPC-powered service.

## Getting started

You’ll need [pnpm](https://pnpm.io/) and [Node.js](https://nodejs.org/en/download) installed on your machine and some tool for switching node versions (e.g. [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm) will work fine).

All of the code examples in this article are taken from the [demo repository](https://github.com/dopt/building-a-node-microservice). Each part of the post has a corresponding [commit](https://github.com/dopt/building-a-node-microservice/commits/main) in the repository’s main branch.

You can also clone and build the final result and follow along that way.

```protobuf
git clone [email protected]:dopt/building-a-node-microservice.git;
cd building-a-node-microservice;
fnm use; # or `nvm use` - You should see a message like "Using Node v18.xx.xx" after running this successfully.
pnpm install;
pnpm run build;
```

## Part 1: Create the monorepo ([9b91734](https://github.com/dopt/building-a-node-microservice/commit/9b917349d6d906478ce35dcfddfb58cf59cb3c3c))

I’ll structure the example repository as a monorepo. While largely irrelevant to a tutorial on gRPC-powered microservices, the setup is:

- a setup we use and love at Dopt
- showcasing modern monorepo tooling and therefore potentially useful to the reader

As you will see throughout the tutorial, the monorepo structure also promotes us breaking down the problem into separate but well-encapsulated pieces. By the end of this tutorial, we will have five distinct packages/modules, each with a unique responsibility. Their relationship will look like this.

![Diagram of Dopt's module relationships](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6748c1f13532db75dbb406ca_6748c1d441bd6c7869a5905c_1-%2540state-transitions.dependencies.png)

I’m going to use [pnpm](https://pnpmpkg.com/) and [turborepo](https://turbo.build/repo) in this monorepo.

We’ll start by initializing the repository and installing turbo.

```protobuf
pnpm init;
pnpm add turbo --save-dev --ignore-workspace-root-check;
```

I’m going to remove the [main](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#main) field, update the [scripts](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#scripts) and add a [packageManger](https://nodejs.org/api/packages.html#packagemanager) field. The end result looks something like this.

```protobuf
{
  "name": "build-a-node-microservice",
  "version": "1.0.0",
  "scripts": {
    "build": "pnpm exec turbo run build",
    "clean": "pnpm run --parallel -r clean",
    "format": "pnpm run --parallel -r format",
    "lint": "pnpm exec turbo run lint",
    "test": "pnpm exec turbo run test",
    "typecheck": "pnpm exec turbo run typecheck",
    "uninstall": "pnpm -r exec rm -rf node_modules"
  },
  "packageManager": "[email protected]",
  "devDependencies": {
    "turbo": "1.8.8"
  }
}
```

Both pnpm and turbo need a bit of configuration.

Pnpm has built-in support for monorepos via [pnpm workspaces](https://pnpm.io/workspaces). We’ll configure `pnpm-workspace.yaml` as follows.

```protobuf
packages:
  # all packages in subdirectories of services/
  - "services/**"
```

This defines the root of the workspace and constrains which directories in the workspace can house packages. Our package manager ([pnpm](https://pnpmpkg.com/)) and our build tool ([turbo](https://turborepo.org/docs)) will scan those directories and look for `package.json` files, indicating a package. A package’s dependencies are used to define our workspace’s topology.

The [turbo configuration](https://turbo.build/repo/docs/reference/configuration) will relate to the package scripts above in the sense that we will create a pipeline task per package script above. The configuration for each pipeline task indicates whether it depends on the workspace’s topological dependencies, is cacheable, and where the task will output build artifacts. Our config looks like this.

```protobuf
{
  "$schema": "https://turborepo.org/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": [],
      "outputs": []
    },
    "clean": {
      "cache": false
    },
    "typecheck": {
      "outputs": []
    },
    "format": {
      "outputs": []
    },
    "lint": {
      "outputs": []
    }
  }
}
```

Create a `README.md` and a `.gitignore`.

```protobuf
$ echo "# Building a modern gRPC-powered microservice using Node.js, Typescript, and Connect" >> README.md
```

```protobuf
node_modules
# where we will output build artifacts
dist/
# where turbo caches the output of tasks
.turbo
```

`‍`Then install and build the monorepo to confirm things are working.

```protobuf
pnpm install;
pnpm run build;
```

## Part 2: Scaffolding out the service ([dc00d46](https://github.com/dopt/building-a-node-microservice/commit/dc00d46980f4a7ff60a2e1e34ae3f80dd364d58a))

Our workspace configuration indicated that our services will live in a subdirectory of services.

I’m going to model our service as a family of packages that live under a shared [scope](https://docs.npmjs.com/cli/v9/using-npm/scope). These packages won’t be published to said scope (unless this service is public and you own that scope)—but the sentiment is the same. Our scope for this service will be `@state-transitions`.

```protobuf
mkdir -p services/@state-transitions
cd $_;
```

We are going to start by creating a package that will house the Protobuf definitions for our service and logic for generating TypeScript code from the schema.

Let’s create that package, initialize a `package.json`, and add the necessary build tooling.

```protobuf
mkdir definition;
cd definition;
pnpm init
pnpm add -D unbuild;
```

Also, let’s stub out the source code so we can confirm everything is working.

```protobuf
mkdir src;
echo "export {};" >> src/index.ts
```

With a few updates to the `package.json`, in particular, updating the

- package name to include the scope
- description (because docs are always helpful)
- scripts to implement `build` and `clean` while stubbing out the rest with a helpful message

The outcome is as follows.

```protobuf
{
  "name": "@state-transitions/definition",
  "version": "0.0.0",
  "description": "The state transitions service definition",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "require": "./dist/index.cjs",
      "import": "./dist/index.mjs",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "👇required package scripts": "",
    "build": "unbuild;",
    "clean": "rm -rf ./dist",
    "test": "echo \"@state-transitions/definition does not require test\"; exit 0;",
    "format": "echo \"@state-transitions/definition does not require test\"; exit 0;",
    "lint": "echo \"@state-transitions/definition does not require test\"; exit 0;",
    "☝️ required package scripts": ""
  },
  "dependencies": {},
  "devDependencies": {
    "unbuild": "1.2.0"
  }
}
```

At this point, the service definition should build, albeit with empty output.

```protobuf
$ pnpm run build
```

## Part 3: Designing the service’s schema, and codegen ([35f48e4](https://github.com/dopt/building-a-node-microservice/commit/35f48e4f6efff9ba2db29eebba521979450b62c4))

As mentioned in the intro, we are going to use [Buf](https://buf.build/) and [Connect](https://connectrpc.com/) as our tools. We’ll start by installing the dependencies.

```protobuf
# dependencies
$ pnpm add @bufbuild/protobuf
# devDependencies
$ pnpm add -D @bufbuild/buf @bufbuild/protoc-gen-connect-es @bufbuild/protoc-gen-es;
```

Buf provides a powerful [CLI](/docs/reference/cli/buf/index.md) for working with your Protobuf definitions. We’ll use the CLI directly below, but further down in this guide, we’ll hide its usage behind a common interface inside of our package scripts so our task pipelines work independently of these implementation details.

First, we’ll initialize the buf module at the root of the definition package.

```protobuf
$ pnpm exec buf mod init
```

This creates the `buf.yaml` file below and signals to Buf that the `.proto` files within this package should be thought of as a logical unit.

```protobuf
version: v1
breaking:
  use:
    - FILE
lint:
  use:
    - DEFAULT
```

We need to tell Buf what to generate from the `.proto` files it discovers in this module. This is achieved through a `buf.gen.yaml` file, which configures the various `protoc` plugins that will be run over the module and specifies where they will output the generated code.

We want two things, namely TypeScript definitions for the

- Protobuf messages we’ll configure ([@bufbuild/connect-es](https://github.com/connectrpc/connect-es))
- service that defines the RPCs and utilizes those message definitions ([@bufbuild/protoc-gen-connect-es](https://github.com/connectrpc/connect-es/tree/main/packages/protoc-gen-connect-es))

First, we’ll create a `buf.gen.yaml`.

```protobuf
$ touch buf.gen.yaml
```

Then populate it with the plugins mentioned above.

```protobuf
version: v1
managed:
  enabled: true
plugins:
  - name: es
    opt: target=ts
    out: src
  - name: connect-es
    opt: target=ts
    out: src
```

The `out:` configuration for both plugins indicates we’ll output the generated code into the `src` directory. The thinking is this, the code we output is TypeScript. We are going to need to build that TypeScript, and output the compiled JavaScript as well as type definitions. In this sense, it is the “source” for this package, albeit generated.

The Protobuf definition is going to live in a directory hierarchy that aligns with its `package` field, which relates to API evolution and backward compatibility. Our package field will be:

```protobuf
package proto.transitions.v1
```

Therefore the file path to that `.proto` file should reflect it.

```protobuf
mkdir -p proto/transitions/v1
cd $_;
```

Finally, we can scaffold our `.proto` file. Initially, it will have three RPCs:

- `StateTransition`
  - Log a state transition with the state transitions service
- `GetStateTransition`
  - Get a state transition from the state transitions service
- `HealthCheck`
  - Return the status of the service

These will allow us to log user state machine transitions, get individual transitions, and check if the service is up and running (either manually or with readiness probes in k8s). This set of RPCs is really just a starting point. As we built out analytics features for users we will start to expose RPCs that support those use cases. Additionally, we will be forced to think about what RPCs exist in the service definition vs. in the gateway, which is also a gRPC-powered service.

Below is a first stab at defining the RPCs and their requests/response types. One Dopt-specific detail—our machines are versioned, so the state transitions we log will be something like a (user, block, version, transition) tuple.

```protobuf
syntax = "proto3";

package proto.transitions.v1;

import "google/protobuf/timestamp.proto";;

enum ResponseStatus {
  RESPONSE_STATUS_ACCEPTED_UNSPECIFIED = 0;
  RESPONSE_STATUS_REJECTED = 1;
}

message StateTransitionRequest {
  string user = 1;
  string block = 2;
  uint32 version = 3;
  string transition = 4;
  google.protobuf.Timestamp timestamp = 5;
}

message StateTransitionResponse {
  ResponseStatus status = 1;
}

message GetStateTransitionRequest {
  string user = 1;
  string block = 2;
  uint32 version = 3;
}

message GetStateTransitionResponse {
  string user = 1;
  string block = 2;
  uint32 version = 3;
  string transition = 4;
  google.protobuf.Timestamp timestamp = 5;
}

message HealthCheckRequest {}

message HealthCheckResponse {
  enum ServingStatus {
    SERVING_STATUS_UNKNOWN_UNSPECIFIED = 0;
    SERVING_STATUS_SERVING = 1;
    SERVING_STATUS_NOT_SERVING = 2;
  }  ServingStatus status = 1;
}

service EventLogService {
  rpc StateTransition(StateTransitionRequest) returns (StateTransitionResponse) {}
  rpc GetStateTransition(GetStateTransitionRequest) returns (GetStateTransitionResponse) {}
  rpc HealthCheck(HealthCheckRequest) returns(HealthCheckResponse) {}
}
```

We can use the Buf CLI to generate code for this module as follows.

```protobuf
pnpm exec buf generate
```

This outputs code into the `./src/proto/transitions/v1/` directory, mirroring the package path in the output directory hierarchy. Because the destination and contents of this output are statically known based on the package field and the plugin configuration, we can safely create a barrel file that exports the contents of these two generated files. This will make building the package easier and cleaner.

```protobuf
export * from "./proto/transitions/v1/state-transitions_connect";
export * from "./proto/transitions/v1/state-transitions_pb";
```

Because our `./src` directory contains generated code, we will need to create a slightly unusual looking `.gitignore` for this package.

```protobuf
dist/
src/*!
src/index.ts
```

`‍`Additionally, we need to update the package scripts to build and clean correctly. Building, for this package, is a two-step process that involves code generation and then building said generated code. Additionally, our `clean` script needs to account for the generated code being dumped into the `./src` directory. A decision that is starting to smell a bit now that we’ve had to write code to defend against potentially bad outcomes associated with that decision.

```protobuf
diff --git a/services/@state-transitions/definition/package.json b/services/@state-transitions/definition/package.jsonindex 1c2a0ea..7b89dd6 100644
--- a/services/@state-transitions/definition/package.json
+++ b/services/@state-transitions/definition/package.json
@@ -18,12 +18,13 @@
   ],
   "scripts": {
     "👇required package scripts": "",
-    "build": "unbuild;",
-    "clean": "rm -rf ./dist",
+    "build": "pnpm run generate; unbuild;",
+    "clean": "rm -rf ./dist index",
          "format": "echo \"@state-transitions/definition does not require test\"; exit 0;",
     "lint": "echo \"@state-transitions/definition does not require test\"; exit 0;",
     "test": "echo \"@state-transitions/definition does not require test\"; exit 0;",
-    "☝️ required package scripts": ""
+    "☝️ required package scripts": "",
+    "generate": "buf generate"
   },
   "dependencies": {
     "@bufbuild/protobuf": "1.2.0"
```

At this point, we should be able to build the definition package successfully.

```protobuf
$ pnpm run build
```

As we iterate on the definition, we are going to want a better developer experience for rebuilding the package on changes. Typically, for a “library” or “utility” style package, I’d reach for either [unbuild’s stub concept](https://github.com/unjs/unbuild#-passive-watcher) or use [esbuild](https://esbuild.github.io/)/[tsup](https://tsup.egoist.dev/)/[rollup](https://rollupjs.org/) to implement a more traditional watch/rebuild, but in this case, I’m watching a `.proto` file that lives outside of the source, which breaks assumptions of those tools.

Given that, I’ll reach for trusty-ol’ `nodemon`. I feel confident that npm trends would buck me off said steed and direct me towards some hot new package, but I’m going to keep things simple given how little of a role this plays in the broader project.

```protobuf
$ pnpm add -D nodemon
```

After adding nodemon, we can wire our `dev` script to configure its usage, i.e., watch the `proto/` directory and call the `build` package script.

```protobuf
diff --git a/services/@state-transitions/definition/package.json b/services/@state-transitions/definition/package.jsonindex 7b89dd6..45979dc 100644
--- a/services/@state-transitions/definition/package.json
+++ b/services/@state-transitions/definition/package.json
@@ -20,6 +20,7 @@
     "👇required package scripts": "",
     "build": "pnpm run generate; unbuild;",
     "clean": "rm -rf ./dist ./src/proto",
+    "dev": "nodemon -e proto --watch proto/ --exec \"pnpm run build\"",
     "test": "echo \"@state-transitions/definition does not require test\"; exit 0;",
     "format": "echo \"@state-transitions/definition does not require test\"; exit 0;",
     "lint": "echo \"@state-transitions/definition does not require test\"; exit 0;",
@@ -33,6 +34,7 @@
     "@bufbuild/buf": "1.15.0-1",
     "@bufbuild/protoc-gen-connect-es": "0.8.6",
     "@bufbuild/protoc-gen-es": "1.2.0",
+    "nodemon": "2.0.22",
     "typescript": "5.0.4",
     "unbuild": "1.2.0"
   }
```

Buf comes with some great tooling for writing standard and opinionated `.proto` files. I’m going to wire their CLI’s linter and formatter into our package scripts so our task pipelines for formatting code and linting code do the right thing in the context of this package.

```protobuf
diff --git a/services/@state-transitions/definition/package.json b/services/@state-transitions/definition/package.jsonindex 7836889..1a343e0 100644
--- a/services/@state-transitions/definition/package.json
+++ b/services/@state-transitions/definition/package.json
@@ -22,8 +22,8 @@
     "clean": "rm -rf ./dist ./src/proto",
     "dev": "nodemon -e proto --watch proto/ --exec \"pnpm run build\"",
     "test": "echo \"@state-transitions/definition does not require test\"; exit 0;",
-    "format": "echo \"@state-transitions/definition does not require test\"; exit 0;",
-    "lint": "echo \"@state-transitions/definition does not require test\"; exit 0;",
+    "format": "buf format -w",
+    "lint": "buf lint",
     "☝️ required package scripts": "",
     "generate": "buf generate"
```

We can confirm these scripts are wired into our build pipelines by running the following from the workspace root.

```protobuf
pnpm run build;
pnpm run format;
pnpm run lint;
pnpm run test;
```

## Part 4: Implementing the service ([8788740](https://github.com/dopt/building-a-node-microservice/commit/87887409d308c88cb020b028c0f35cde5b55b239))

I often find that working in strongly-typed languages means that I spend far more time in the software design phase than on the actual implementation. The same story played out here and is reflected in how easy it is to get the service implementation up and running. It felt more like following a well-defined guide rather than starting from scratch.

Okay, let’s get to it! We’ll start by creating a service package in the services’ scope and initializing it.

```protobuf
mkdir service;
cd service;
pnpm init;
```

We’ll edit the `package.json`, the same as in the previous parts, to include the scope in the name, to have helpful runtime messages in the package scripts, and to define its exports. It looks something like this.

```protobuf
{
  "name": "@state-transitions/service",
  "version": "0.0.0",
  "description": "The state transitions service",
  "type": "module",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "👇required package scripts": "",
    "build": "echo \"@state-transitions/service `dev` not implemented\"; exit 0;",
    "clean": "echo \"@state-transitions/service `dev` not implemented\"; exit 0;",
    "dev": "echo \"@state-transitions/service `dev` not implemented\"; exit 0;",
    "format": "echo \"@state-transitions/service `format` not implemented\"; exit 0;",
    "lint": "echo \"@state-transitions/service `lint` not implemented\"; exit 0;",
    "test": "echo \"@state-transitions/service `test` not implemented\"; exit 0;",
    "typecheck": "tsc --noEmit",
    "☝️ required package scripts": ""
  },
  "dependencies": {},
  "devDependencies": {}
}
```

We are going to use [Fastify](https://www.fastify.io/) as our web framework for this microservice.

```protobuf
pnpm add fastify;
mkdir src;
cd src;
touch index.ts;
```

And we will once use [unbuild](https://github.com/unjs/unbuild) to build.

```protobuf
pnpm add -D unbuild;
pnpm run build;
```

Below are the updates to the `package.json`.

```protobuf
diff --git a/services/@state-transitions/service/package.json b/services/@state-transitions/service/package.jsonindex 317277e..9354855 100644
--- a/services/@state-transitions/service/package.json
+++ b/services/@state-transitions/service/package.json
@@ -16,15 +16,20 @@
   ],   "scripts": {
     "👇required package scripts": "",
-    "build": "echo \"@state-transitions/service `dev` not implemented\"; exit 0;",
-    "clean": "echo \"@state-transitions/service `dev` not implemented\"; exit 0;",
+    "build": "unbuild",
+    "clean": "rm -rf ./dist",
     "dev": "echo \"@state-transitions/service `dev` not implemented\"; exit 0;",
     "format": "echo \"@state-transitions/service `format` not implemented\"; exit 0;",
     "lint": "echo \"@state-transitions/service `lint` not implemented\"; exit 0;",
     "test": "echo \"@state-transitions/service `test` not implemented\"; exit 0;",
     "typecheck": "tsc --noEmit",
-    "☝️ required package scripts": ""
+    "☝️ required package scripts": "",
+    "start": "node ./dist/index.mjs"   },
-  "dependencies": {},
-  "devDependencies": {}
+  "dependencies": {
+    "fastify": "4.15.0"
+  },
+  "devDependencies": {
+    "unbuild": "1.2.0"
+  } }
```

Rather than immediately implementing the service definition, let’s just get a Fastify server up and running and confirm this setup until this point is correct, with a small server implementation like below.

```protobuf
import { fastify } from "fastify";

const server = fastify();

server.get("/health-check", () => {
  return {
    status: 200,
  };
});

await server.listen({
  host: "localhost",
  port: 8080,
});
```

We can then run the following in the `@state-transitions/service` package root.

```protobuf
pnpm run build;
node ./dist/index.mjs
```

In another window, we can `curl` the simple `/health-check` endpoint we created.

```protobuf
$ curl http://localhost:8080/health-check | jq
Output
  "status": 200
}
```

Alright, now that we know the package is set up correctly, let’s implement the service definition we created in part 3. For this, we will need some additional Connect-related dependencies and a dependency on the definition itself.

```protobuf
pnpm add @bufbuild/connect @bufbuild/connect-fastify
pnpm add @state-transitions/definition;
```

We’ll start by updating the server’s index file to register the [@bufbuild/connect-fastify](https://www.npmjs.com/package/@bufbuild/connect-fastify) plugin.

```protobuf
diff --git a/services/@state-transitions/service/src/index.ts b/services/@state-transitions/service/src/index.tsindex 666f1dd..55d9d56 100644
--- a/services/@state-transitions/service/src/index.ts
+++ b/services/@state-transitions/service/src/index.ts@@ -1,11 +1,12 @@
 import { fastify } from "fastify";
+import { fastifyConnectPlugin } from "@bufbuild/connect-fastify";
+
+import routes from "./connect";

 const server = fastify();

-server.get("/health-check", () => {
-  return {
-    status: 200,
-  };
+server.register(fastifyConnectPlugin, {
+  routes,
 });

await server.listen({
```

Above, I imported `routes` from a relatively located Connect file which doesn’t yet exist. Let’s create it and populate it like so.

```protobuf
import { ConnectRouter } from "@bufbuild/connect";
import {
  GetStateTransitionRequest,
  HealthCheckResponse_ServingStatus,
  ResponseStatus,
  StateTransitionRequest,
  StateTransitionService,
} from "@state-transitions/definition";

export default (router: ConnectRouter) => {
  router.service(StateTransitionService, {
    stateTransition(_: StateTransitionRequest) {
      return {
        status: ResponseStatus.ACCEPTED_UNSPECIFIED,
      };
    },
    getStateTransition(request: GetStateTransitionRequest) {
      return {
        user: request.user,
        block: request.block,
        version: request.version,
      };
    },
    healthCheck() {
      return {
        status: HealthCheckResponse_ServingStatus.SERVING,
      };
    },
  });
};
```

That’s it! To confirm everything is working, we can start the service and `curl` the endpoints.

```protobuf
$ pnpm run start;
```

Copy to clipboard

```protobuf
curl \
  --header 'Content-Type: application/json' \
  --data {} \
  http://localhost:8080/proto.transitions.v1.StateTransitionService/HealthCheck
```

```protobuf
curl \
  --header 'Content-Type: application/json' \
  --data '{ "user": "9fke93ur23-1", "block": "394208feop12e", "version": 0, "transition": "next", "timestamp": "1099-10-21T07:52:58Z" }' \
  http://localhost:8080/proto.transitions.v1.StateTransitionService/StateTransition
```

```protobuf
curl \
  --header 'Content-Type: application/json' \
  --data '{ "user": "9fke93ur23-1", "block": "394208feop12e", "version": 1 }' \
  http://localhost:8080/proto.transitions.v1.StateTransitionService/GetStateTransition
```

## Part 5: Testing the service ([7b52d74](https://github.com/dopt/building-a-node-microservice/commit/7b52d74b5e6b0ae9ef66ef2c0aa77d8ed41e7ac4))

We’ve got our initial RPCs; let’s try adding some tests!

While we made requests with `curl` in the previous part to confirm everything was working, I’d ideally like to test using a client.

First, I’ll create a package for the client so that our actual usage and test usage share the same client implementation and avoid duplicating code. In the `@state-transitions` directory, I’ll run the following.

```protobuf
mkdir client;
cd $_;
pnpm init;
```

I know we will need a few dependencies, the most important of which is the `@state-transitions/definition`, which we will use to create the correctly typed client.

```protobuf
pnpm add @state-transitions/definition;
```

We also need the Connect dependencies.

```protobuf
$ pnpm add @bufbuild/connect @bufbuild/connect-node @bufbuild/protobuf; # connect deps
```

Our source code for the client is going to be super tiny.

```protobuf
import { StateTransitionService } from "@state-transitions/definition";
import { createConnectTransport } from "@bufbuild/connect-node";
import { createPromiseClient } from "@bufbuild/connect";

// The following line is due to these issues
// > https://github.com/aspect-build/rules_ts/issues/159#issuecomment-1437399901
// > https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1270716220
import type {} from "@bufbuild/protobuf";

export const transport = createConnectTransport({
  baseUrl: `http://localhost:8080`,
  httpVersion: "1.1",
});

export const client = createPromiseClient(StateTransitionService, transport);
```

After adding build deps (e.g. `unbuild`) and updating package scripts minimally, our `package.json` looks like this

```protobuf
{
  "name": "@state-transitions/client",
  "version": "0.0.0",
  "description": "The state transitions client",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "require": "./dist/index.cjs",
      "import": "./dist/index.mjs",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "👇required package scripts": "",
    "build": "unbuild",
    "clean": "rm -rf ./dist",
    "dev": "echo \"@state-transitions/service `dev` not implemented\"; exit 0;",
    "format": "echo \"@state-transitions/service `format` not implemented\"; exit 0;",
    "lint": "echo \"@state-transitions/service `lint` not implemented\"; exit 0;",
    "test": "echo \"@state-transitions/service `test` not implemented\"; exit 0;",
    "typecheck": "tsc --noEmit",
    "☝️ required package scripts": ""
  },
  "dependencies": {
    "@bufbuild/connect": "0.8.6",
    "@bufbuild/connect-node": "0.8.6",
    "@state-transitions/definition": "workspace:*",
    "@bufbuild/protobuf": "1.2.0"
  },
  "peerDependencies": {
    "@bufbuild/protobuf": "1.2.0"
  },
  "devDependencies": {
    "unbuild": "1.2.0"
  }
}
```

And voilà, we’ve created a package for the client that can be used in the tests!

It’s probably not surprising that I’m going to create a test package to house the tests. Packages for all the things! Joking aside, packages are an awesome way to encapsulate highly cohesive logic.

In the `@state-transitions` directory, I’ll run the following.

```protobuf
mkdir tests;
cd $_;pnpm init;
```

The dependencies are simple in this case:

- `@state-transitions/client` to make request to the service
- `@state-transitions/service` so that we can bring it up in the test
- `fastify` for types
- `vitest` for testing

After adding those deps and updating package scripts, our `package.json` looks like this:

```protobuf
{
  "name": "@state-transitions/tests",
  "version": "0.0.0",
  "description": "The state transitions service integration tests",
  "type": "module",
  "module": "./dist/index.mjs",
  "exports": {
    ".": {
      "import": "./dist/index.mjs"
    }
  },
  "files": ["dist"],
  "scripts": {
    "👇required package scripts": "",
    "build": "echo \"@state-transitions/tests build target is not needed.\"; exit 0;",
    "clean": "rm -rf ./dist",
    "dev": "echo \"@state-transitions/tests dev not implemented\"; exit 0;",
    "format": "echo \"@state-transitions/tests format not implemented\"; exit 0;",
    "lint": "echo \"@state-transitions/tests lint not implemented\"; exit 0;",
    "test": "vitest run ./src/__tests__/",
    "typecheck": "tsc --noEmit",
    "☝️ required package scripts": ""
  },
  "dependencies": {
    "@state-transitions/client": "workspace:*",
    "@state-transitions/service": "workspace:*"
  },
  "devDependencies": {
    "fastify": "4.15.0",
    "vitest": "0.30.1"
  }
}
```

Time to write some tests.

```protobuf
mkdir -p src/__tests__;
cd $_;
touch basic.test.ts
```

The test is going to:

1.  wait for the service to come up
2.  make a request using the client and expect the response to look a certain way
3.  wait for the service to spin down

A first pass looks something like this:

```protobuf
import { beforeAll, afterAll, describe, expect, it } from "vitest";

import { server } from "@state-transitions/service";
import { client } from "@state-transitions/client";
import { FastifyInstance } from "fastify";

describe("[Test] @state-transition/service", () => {
  let fastify: FastifyInstance;

  beforeAll(async () => {
    fastify = await server;
    await fastify.ready();
  });
  afterAll(async () => {
    await fastify.close();
  });
  //
  describe("client.healthCheck(...)", () => {
    it("should get correct response from clients RPC method", async () => {
      const response = await client.healthCheck({});
      expect(response).toEqual({
        status: 1,
      });
    });
  });
});
```

If we run the test with `pnpm run test`, we’ll see it’s passing!

```protobuf
$ pnpm run test
Output
> @state-transitions/[email protected] test /home/joe/repos/blog-posts/building-a-node-microservice/services/@state-transitions/tests> vitest run ./src/__tests__/

 RUN  v0.30.1 /home/joe/repos/building-a-node-microservice/services/@state-transitions/tests

 ✓ src/__tests__/basic.test.ts (1)

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  11:08:53
   Duration  652ms (transform 73ms, setup 0ms, collect 213ms, tests 28ms, environment 0ms, prepare 66ms)
```

## Part 6: Adding a database in development ([e3b1f42](https://github.com/dopt/building-a-node-microservice/commit/e3b1f4291481b2957690ce91451cd785ac10d81e))

This service will have its own database. This tutorial creates a Postgres database that runs locally in a Docker container. This is fine in development, but in a production environment, you’d probably host your DB in one of the clouds. The distance between the two would just be environment variables, an exercise I will leave to the reader.

To start, we’ll create a database directory in the `@state-transitions` scope.

```protobuf
mkdir database
cd databasep
npm init;
```

We’ll update our `package.json` like so.

```protobuf
{
  "name": "@state-transitions/database",
  "version": "0.0.0",
  "description": "The state transitions database",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "scripts": {
    "👇required package scripts": "",
    "build": "unbuild",
    "clean": "rm -rf ./dist",
    "dev": "echo \"@state-transitions/service 'dev' not implemented\"; exit 0;",
    "format": "echo \"@state-transitions/service 'format' not implemented\"; exit 0;",
    "lint": "echo \"@state-transitions/service 'lint' not implemented\"; exit 0;",
    "test": "echo \"@state-transitions/service 'test' not implemented\"; exit 0;",
    "typecheck": "tsc --noEmit",
    "☝️ required package scripts": ""
  }
}
```

Since we are going to use Prisma as our ORM, we need to install the necessary dependencies and create a Prisma schema.

```protobuf
pnpm add -D prisma;
pnpm add @prisma/client;
mkdir src;
touch src/schema.prisma
```

Our Prisma schema is going to be quite simple. A single table of state transitions. Roughly equivalent to log lines. We configure our database connection in the schema, as well as how and where we generate the Prisma client.

```protobuf
datasource db {
  provider = "postgresql"
  url      = "postgres://user:[email protected]:5436/state_transitions_postgres"}

generator client {
  provider = "prisma-client-js"
  output   = "../dist"
}

model StateTransition {
  id          Int      @id @default(autoincrement())
  user        String
  block       String
  version     Int
  transition  String
  timestamp   DateTime @default(now())
}
```

`‍`To create the Postgres database, I’m going to create a `docker-compose.yml` file at the workspace root. Nothing special here—basically, the minimal configuration needed to get up and running.

```protobuf
$ cat docker-compose.yml
Output
services:
  state_transitions_postgres:
    container_name: state_transitions_postgres
    image: postgres:14-alpine
    restart: always
    environment:
      POSTGRES_USER: ${STATE_TRANSITIONSPOSTGRES_USER:-user}
      POSTGRES_PASSWORD: ${STATE_TRANSITIONSPOSTGRES_PASSWD:-passwd}
      POSTGRES_DB: ${STATE_TRANSITIONSPOSTGRES_DB:-state_transitions_postgres}
    ports:
      - ${STATE_TRANSITIONSPOSTGRES_PORT:-5436}:5432
    volumes:
      - state_transitions_data:/var/lib/postgresql/data
volumes:  state_transitions_data: ~
networks:
  example-net:
    driver: bridge
```

While the container configuration lives at the workspace root because of how docker-compose works, we can still have the package scripts encapsulate logic for how to bring the database up, down, etc. We can start with simple `up` and `down` package scripts that look like this.

```protobuf
"up": "docker-compose up state_transitions_postgres",
"down": "docker stop -t 15 state_transitions_postgres"
```

`‍`If we bring the container up, we can create the initial migration.

```protobuf
pnpm exec prisma migrate dev --name init
```

With our database up and running, we can now wire up our service implementation to use it. Back in `@state-transitions/service` let’s add a dependency on the database package.

```protobuf
pnpm add @state-transitions/database
```

From the [Prisma docs](https://www.prisma.io/fastify), it looks like we can create a Fastify plugin for instantiating Prisma. We’ll install the necessary deps.

```protobuf
$ pnpm add fastify-plugin
```

And then create the plugin.

```protobuf
import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@state-transitions/database";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
const prismaPlugin: FastifyPluginAsync = fp(async (server) => {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
  } catch {
    server.log.warn("Not connected to database");
  }
  server.decorate("prisma", prisma);
  server.addHook("onClose", async (server, done) => {
    server.log.info("Shutting down prisma connection");
    await prisma.$disconnect();
    done();
  });
});
export default prismaPlugin;
```

Additionally, we need to register the plugin in the server’s initialization.

```protobuf
diff --git a/services/@state-transitions/service/src/index.ts b/services/@state-transitions/service/src/index.tsindex 9d54a16..df32dde 100644
--- a/services/@state-transitions/service/src/index.ts
+++ b/services/@state-transitions/service/src/index.ts
@@ -1,10 +1,13 @@
 import { fastify } from "fastify";
 import { fastifyConnectPlugin } from "@bufbuild/connect-fastify";

+import prismaPlugin from "./plugin/prisma";
+
 import routes from "./connect";

 export const server = fastify();
+server.register(prismaPlugin);
 server.register(fastifyConnectPlugin, {
   routes,
 });
```

Now we can use Prisma to map our RPCs to database requests.

```protobuf
diff --git a/services/@state-transitions/service/src/connect.ts b/services/@state-transitions/service/src/connect.tsindex a39e1c5..aaa343f 100644
--- a/services/@state-transitions/service/src/connect.ts
+++ b/services/@state-transitions/service/src/connect.ts
@@ -1,4 +1,5 @@
 import { ConnectRouter } from "@bufbuild/connect";
+import { Timestamp } from "@bufbuild/protobuf";
 import {
   GetStateTransitionRequest,
   HealthCheckResponse_ServingStatus,
@@ -7,18 +8,31 @@
 import {
   StateTransitionService,
 } from "@state-transitions/definition";

+import { server } from "./";
+
 export default (router: ConnectRouter) => {
   router.service(StateTransitionService, {
-    stateTransition(_: StateTransitionRequest) {
+    async stateTransition(request: StateTransitionRequest) {
+      await server.prisma.stateTransition.create({
+        data: {
+          ...request,
+          timestamp: request.timestamp?.toDate() || Date.now().toString(),
+        },
+      });
       return {
         status: ResponseStatus.ACCEPTED_UNSPECIFIED,
       };
     },
-    getStateTransition(request: GetStateTransitionRequest) {
+    async getStateTransition(request: GetStateTransitionRequest) {
+      const transition = await server.prisma.stateTransition.findFirstOrThrow({
+        where: {
+          ...request,
+        },
+      });
+
       return {
-        user: request.user,
-        block: request.block,
-        version: request.version,
+        ...transition,
+        timestamp: Timestamp.fromDate(transition.timestamp),
       };
     },
     healthCheck() {
```

Once again, we can `curl` (like above) to confirm the RPCs are working. We need to bring the database up and run the server before doing so.

I’m going to quickly install a CLI that Dopt built and open-sourced called `please`. It makes running scripts on different packages in one command a breeze.

```protobuf
pnpm add -Dw @dopt/please;
pnpm exec please start:@state-transitions/service up:@state-transitions/database
```

See the console output below.

![Screen shot of console output from installing the please CLI](https://cdn.prod.website-files.com/6723e92f5d187330e4da8144/6747b65324751b6b82515c4d_image-placeholder.svg)

With our service and database up and running we can POST with `curl` to create a state transition.

```protobuf
curl \
  --header 'Content-Type: application/json' \
  --data '{ "user": "9fke93ur23-1", "block": "394208feop12e", "version": 0, "transition": "next", "timestamp": "1099-10-21T07:52:58Z" }' \
  http://localhost:8080/proto.transitions.v1.StateTransitionService/StateTransition
```

If we open up our database, we can confirm the record was created correctly.

```protobuf
$ docker exec -it 59a24bd34979 psql -U user -W state_transitions_postgres
Output
psql (14.6)
Type "help" for help.

state_transitions_postgres=# select * from "StateTransition";
 id |     user     |     block     | version | transition |      timestamp
----+--------------+---------------+---------+------------+---------------------
 77 | 9fke93ur23-1 | 394208feop12e |       0 | next       | 1099-10-21 07:52:58
(1 row)

state_transitions_postgres=#
```

Great, now let’s update the tests. Our tests have become slightly more complicated now that a database needs to be up and running for them to work. I’m going to write a simple test runner script. It will be responsible for:

1.  bringing up the DB
2.  waiting for the database to be ready
3.  running the test
4.  bringing down the DB
5.  returning the correct status code based on the test results

A first pass at this looks something like this.

```protobuf
#!/bin/bash

pnpm --filter @state-transitions/database run up &

# a bit hacky - wait for postgres to come up
while ! curl http://localhost:5436/ 2>&1 | grep '52'
do
  sleep 1
done

pnpm run test:e2e;

TEST_EXIT_STATUS=$?

pnpm --filter @state-transitions/database down;

exit $TEST_EXIT_STATUS;
```

We can wire the `test` package script to use the runner and put the original test innovation in a separate script.

```protobuf
"test": "./bin/runner.sh",
"test:e2e": "vitest run ./src/__tests__/"
```

You can run the test script on this package directly or run all the tests via the workspace-level test script.

> Thanks to Joe for creating and sharing this in-depth walkthrough. For more information about building browser and gRPC-compatible HTTP APIs, see the [Connect documentation](https://connectrpc.com/docs/introduction).

‍
