---
layout: home

hero:
  name: "Authzed Case Study: Maintaining a Stable Protocol Buffers API"
  tagline: "June 15, 2021"
---

**Our friends at** [**Authzed**](https://authzed.com/) **recently adopted Buf and have given us the honor of writing about their experience.**

## The first day of the rest of your life

Congrats! You've hit a stable release or maybe you haven't and instead customers have already decided to depend on your API. Rather than pulling the rug out from beneath your users, you've taken it upon yourself to keep everyone happy. Now that you've been tasked with maintaining API compatibility, you'll need a guiding light to copy for inspiration. For many developers, [Stripe](https://stripe.com/blog/api-versioning) is that holy grail of API compatibility: Applications with payments systems written using the Stripe API over a decade ago still function today without changes. While we should all aspire to have a comparable compatibility story, not everyone is using the same technology stack. What does maintaining an API at Stripe's level look like if you're using gRPC/Protocol Buffers rather than JSON/HTTP?

## Taking the first step

At [Authzed](https://authzed.com/), we've begun our journey towards diligent Protocol Buffers API versioning. Our initial goals are to:

1.  Catch breaking changes before they ship and release a new version of the API if need be
2.  Make the API consistent, intuitive, and ecosystem-friendly
3.  Remove as much friction as possible for our developers while making changes The starting place for us was obvious: migrate our existing ad-hoc Protocol Buffers setup to the [Buf toolchain](https://buf.build/). Buf is a new, faster Protocol Buffers compiler, but compilation speed isn't why we're switching: we're sold on its robust feature-set.

## Iterating with confidence

Our existing workflow had been to read the Protocol Buffers documentation to determine whether or not a change is backwards compatible. Occasionally, we'd spend time testing out code locally just to ensure that a change is wire-compatible. This is time consuming and adds a requirement for more tribal knowledge from our team of developers. Buf eliminates this concern with [breaking change detection](/docs/breaking/overview/index.md) that can be built into CI/CD workflows. Going forward, we'll be able to publish an official versioning and deprecation policy, which can be easily and confidently enforced with Buf.

## Discovering idioms

Even though we've worked with Protocol Buffers APIs in the past and even have a Xoogler on the team that has worked on the internal Protocol Buffers tooling team at Google, we still struggle to write and maintain idiomatic objects and service definitions. Buf has a massive index of linting rules and presets like those used at Google and Uber. These linting rules are the culmination of experience from years of engineering and are a great source to learn from. The [linting documentation](/docs/lint/rules/index.md) includes descriptions of the common rules and justifications for why they should be applied. These idioms include package naming, which in turn describes how to best version your packages, too! We're currently sticking with the defaults which we've found quite sane. But there's a fine balance between following idioms and making trade-offs for user experience; not every idiom yields nice to work with code generated in each language. When we eventually run into particular rules that choose to ignore, Buf makes [exceptions](/docs/lint/overview/index.md#configuration) a single-line change.

## Standardizing the build flow

Before Buf, we had shell scripts for generating code from our Protocol Buffers service definitions. Each shell script varied from project to project and had to include additional logic like determining where the script was executed relative to where our `.proto` files live. Only afterwards could we focus on passing the right flags to `protoc` to generate code. All of this, however, is already built into Buf, allowing us to abandon our shell scripts entirely. Now we have a `buf.gen.yaml` that specifies our plugins' arguments. By adding a [shebang](<https://en.wikipedia.org/wiki/Shebang_(Unix)>) to the beginning of the YAML file, we even make it so you can easily _execute_ the YAML file to generate the code for a project:

```protobuf
#!/usr/bin/env -S buf generate ../protos --template
version: "v1beta1"
plugins:
    - name: "go"
      out: "pkg/proto"
      opt: "paths=source_relative"
    - name: "go-grpc"
      out: "pkg/proto"
      opt: "paths=source_relative"
    - name: "validate"
      out: "pkg/proto"
      opt: "paths=source_relative,lang=go"
```

```protobuf
./buf.gen.yaml
```

Now our devs don't even have to learn how to use Buf: our config files know how to run themselves and CI/CD pipelines can handle the rest.

## A lifelong journey

This is just the beginning for our service's API. We know you can never truly escape [Hyrum's Law](https://xkcd.com/1172/), but these are our first steps towards minimizing the impact of the changes we make. Buf enabled us to fly past the first step of validating our APIs and now we can focus on building out API metrics that will be used for data-driven decision making for our deprecation policies and API design efforts. We're extremely excited for the future Buf and its impact on the ecosystem of Protocol Buffers tooling.

‍
