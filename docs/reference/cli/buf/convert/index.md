---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/cli/buf/convert/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/reference/cli/buf/build/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/cli/buf/curl/"
  - - meta
    - property: "og:title"
      content: "buf convert - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/convert.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/cli/buf/convert/"
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
      content: "buf convert - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/cli/buf/convert.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# buf convert

Convert a message between binary, text, or JSON

### Usage

```console
$ buf convert <input> [flags]
```

### Description

Use an input proto to interpret a proto/json message and convert it to a different format.

Examples:

```console
$ buf convert <input> --type=<type> --from=<payload> --to=<output>
```

The `<input>` can be a local .proto file, binary output of "buf build", bsr module or local buf module:

```console
$ buf convert example.proto --type=Foo.proto --from=payload.json --to=output.binpb
```

All of `<input>`, "--from" and "to" accept formatting options:

```console
$ buf convert example.proto#format=binpb --type=buf.Foo --from=payload#format=json --to=out#format=json
```

Both `<input>` and "--from" accept stdin redirecting:

```console
$ buf convert <(buf build -o -)#format=binpb --type=foo.Bar --from=<(echo "{\"one\":\"55\"}")#format=json
```

Redirect from stdin to --from:

```console
$ echo "{\"one\":\"55\"}" | buf convert buf.proto --type buf.Foo --from -#format=json
```

Redirect from stdin to `<input>`:

```console
$ buf build -o - | buf convert -#format=binpb --type buf.Foo --from=payload.json
```

Use a module on the bsr:

```console
$ buf convert <buf.build/owner/repository> --type buf.Foo --from=payload.json
```

### Flags

#### \--disable-symlinks

Do not follow symlinks when reading sources or configuration from the local filesystem By default, symlinks are followed in this CLI, but never followed on the Buf Schema Registry

#### \--error-format _string_

The format for build errors printed to stderr. Must be one of \[text,json,msvs,junit,github-actions\]

#### \--from _string_

The location of the payload to be converted. Supported formats are \[binpb,json,txtpb,yaml\]

#### \-h, --help

help for convert

#### \--to _string_

The output location of the conversion. Supported formats are \[binpb,json,txtpb,yaml\]

#### \--type _string_

The full type name of the message within the input (e.g. acme.weather.v1.Units)

#### \--validate

Validate the message specified with --from by applying protovalidate rules to it. See https://github.com/bufbuild/protovalidate for more details.

### Flags inherited from parent commands

#### \--debug

Turn on debug logging

#### \--log-format _string_

The log format \[text,color,json\]

#### \--timeout _duration_

The duration until timing out, setting it to zero means no timeout

### Parent Command

- [buf](../) - The Buf CLI
