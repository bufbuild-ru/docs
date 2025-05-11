---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/inputs/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/configuration/v1beta1/lint-rules/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/images/"
  - - meta
    - property: "og:title"
      content: "Buf CLI inputs - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/inputs.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/inputs/"
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
      content: "Buf CLI inputs - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/inputs.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Buf CLI inputs

The various I/O options for the Buf CLI may seem a bit daunting — this reference aims to sort out both what these options do, and why they're necessary.

In general, a Buf input is a collection of Protobuf files acted on by many of the Buf CLI commands. In most cases, the input is a [module](../../cli/modules-workspaces/), but a variety of other formats are supported and explained below.

By default, the Buf CLI uses the current directory as its input for all commands.

## Terminology

First, some basic terminology to help our discussion:

- **Source:** A collection of uncompiled Protobuf files. **Note:** An image built with `buf build` isn't considered a source.
- **Image:** A set of Protobuf files compiled into an [`Image`](https://buf.build/bufbuild/buf/docs/main/buf.alpha.image.v1#buf.alpha.image.v1.Image) binary using the `buf build` command. An _image_ represents everything inside a Protobuf project and can be used as the input to most commands. You can read more about the mechanics of Buf images in the [Image reference](../images/).
- **Input:** Either a _source_ or an _image_.
- **Format:** A description of the type of _input_. Commonly used formats include [`dir`](#dir) and [`git`](#git). It's usually derived automatically but you can opt to set it explicitly.

## Why?

Generally, your only goal is to work with `.proto` files on disk. The Buf CLI works this way by default. But there are cases where you may want to work with more than just local files. Those cases are described below.

### The Buf Schema Registry (BSR)

The core primitive for Buf is the [module](../../cli/modules-workspaces/). Protobuf on its own has **no concept of modules**, only files. The Buf Schema Registry ([BSR](../../bsr/)) is a registry for Buf modules that you want to manage across teams and even organizations.

With the BSR, you can refer to any version of a Buf module and use it as an input for each of the `buf` commands. You can lint all the Protobuf files in the `buf.build/acme/petapis` module, for example, with the `buf lint` command:

```sh
buf lint buf.build/acme/petapis
```

### Breaking change detection

The biggest current use case is for [breaking change detection](../../breaking/overview/). When you are comparing your current Protobuf schema to an old version of your schema, you have to decide — where's your old version stored? The Buf CLI provides multiple options for this, including the ability to directly compile and compare against a Git branch or Git tag.

It's sometimes preferable, however, to store a representation of your old version in a file. [Buf images](../images/) provide this functionality, allowing you to store your golden state, and then compare your current Protobuf schema against it. This includes support for partial comparisons, as well as storing the golden state in a remote location.

For example:

```sh
buf build -o image.binpb
buf breaking --against image.binpb
```

## Specifying an input

Buf inputs are specified as the first argument on the command line, and with the `--against` flag for the compare against input on `buf breaking`.

For each of `buf {build,lint,breaking,generate,ls-files}`, the input is specified as the first argument. Inputs are specified as a string and have this structure:

```text
path#option_key1=option_value1,option_key2=option_value2
```

The path specifies the path to the input. The options specify options to interpret the input at the path.

### format option

The `format` option can be used on any input string to override the derived format.

Examples:

- `path/to/file.data#format=binpb` explicitly sets the format to `binpb`. By default this path would be interpreted as `dir` format.
- `https://github.com/googleapis/googleapis#format=git` explicitly sets the format to `git`. In this case however, note that `https://github.com/googleapis/googleapis.git` has the same effect; the `.git` suffix is used to infer the format (see below for derived formats).
- `-#format=json` explicitly sets the format to `json`, which reads from stdin as JSON, or in the case of `buf build --output`, writes to stdout as JSON.

### Other options

As of now, there are seven other options, all of which are format specific:

- The `branch` option specifies the branch to clone for `git` inputs.
- The `tag` option specifies the tag to clone for `git` inputs.
- The `ref` option specifies an explicit `git` reference for `git` inputs. Any ref that's a valid input to `git checkout` is accepted.
- The `depth` option optionally specifies how deep of a clone to perform. This defaults to 50 if ref is set, and 1 otherwise.
- The `recurse_submodules` option says to clone submodules recursively for `git` inputs.
- The `strip_components` option specifies the number of directories to strip for `tar` or `zip` inputs.
- The `subdir` option specifies a subdirectory to use within a `git`, `tar`, or `zip` input.
- The `filter` option applies a filter when cloning `git` inputs.

If `ref` is specified, `branch` can be further specified to clone a specific branch before checking out the `ref`.

## Source formats

All Sources contain a set of `.proto` files that can be compiled.

### dir

A local directory. The path can be either relative or absolute.

**This is the default format**. By default, `buf` uses the current directory as its input for all commands.

Examples:

- `path/to/dir` says to compile the files in this relative directory path.
- `/absolute/path/to/dir` says to compile the files in this absolute directory path.

### mod

A Module on the Buf Schema Registry. This uses whatever is in this Module for the sources.

Example:

- `buf.build/googleapis/googleapis` says to compile the files within [buf.build/googleapis/googleapis](https://buf.build/googleapis/googleapis).

### tar

A tarball. The path to this tarball can be either a local file, a remote http/https location, or `-` for stdin.

Use `compression=gzip` to specify that the tarball is compressed with Gzip. This is automatically detected if the file extension is `.tgz` or `.tar.gz`.

Use `compression=zstd` to specify that the tarball is compressed with Zstandard. This is automatically detected if the file extension is `.tar.zst`.

The `strip_components` and `subdir` options are optional. Note that `strip_components` is applied before `subdir`.

Examples:

- `foo.tar` says to read the tarball at this relative path.
- `foo.tar.gz` says to read the gzipped tarball at this relative path.
- `foo.tgz` says to read the gzipped tarball at this relative path.
- `foo.tar.zst` says to read the zstandard tarball at this relative path.
- `foo.tar#strip_components=2` says to read the tarball at this relative path and strip the first two directories.
- `foo.tgz#subdir=proto` says to read the gzipped tarball at this relative path, and use the subdirectory `proto` within the archive as the base directory.
- `https://github.com/googleapis/googleapis/archive/master.tar.gz#strip_components=1` says to read the gzipped tarball at this http location, and strip one directory.
- `-#format=tar` says to read a tarball from stdin.
- `-#format=tar,compression=gzip` says to read a gzipped tarball from stdin.
- `-#format=tar,compression=zstd` says to read a zstandard tarball from stdin.

### zip

A zip archive. The path to this archive can be either a local file, a remote http/https location, or `-` for stdin.

The `strip_components` and `subdir` options are optional. Note that `strip_components` is applied before `subdir`.

Examples:

- `foo.zip` says to read the zip archive at this relative path.
- `foo.zip#strip_components=2` says to read the zip archive at this relative path and strip the first two directories.
- `foo.zip#subdir=proto` says to read the zip archive at this relative path, and use the subdirectory `proto` within the archive as the base directory.
- `https://github.com/googleapis/googleapis/archive/master.zip#strip_components=1` says to read the zip archive at this http location, and strip one directory.
- `-#format=zip` says to read a zip archive from stdin.

### git

A Git repository. The path to the Git repository can be either a local `.git` directory, or a remote `http://`, `https://`, `ssh://`, or `git://` location.

- The `branch` option specifies the branch to clone.
- The `tag` option specifies the tag to clone.
- The `ref` option specifies an explicit Git reference. Any ref that's a valid input to `git checkout` is accepted. Note that most git hosts (including GitHub) only allow fetching by reference and not commits by sha. Buf clones the repo, then run `git checkout <ref>` to get to the specified commit for ref. To use refs for commits outside of the range of the default clone settings use `branch` and `depth` as needed.
- The `depth` option specifies how deep of a clone to perform. It defaults to 50 if `ref` is used and 1 otherwise.
- The `recurse_submodules` option says to clone submodules recursively.
- The `subdir` option says to use this subdirectory as the base directory.
- The `filter` option applies a `git` filter to clone. This is useful for large repositories where you want to perform a partial or shallow clone. The filter is in the form of git's filter-spec. See the [git documentation](https://git-scm.com/docs/git-rev-list#Documentation/git-rev-list.txt---filterltfilter-specgt). If specified with the `subdir` the checkout will be a sparse checkout for the specified subdirectory.

Note that `http://`, `https://`, `ssh://`, and `git://` locations must be prefixed with their scheme:

- HTTP locations must start with `http://`.
- HTTPS locations must start with `https://`.
- SSH locations must start with `ssh://`.
- Git locations must start with `git://`.

Examples:

- `.git#branch=main` says to clone the `main` branch of the git repository at the relative path `.git`. This is particularly useful for local breaking change detection.
- `.git#tag=v1.0.0` says to clone the v1.0.0 tag of the git repository at the relative path `.git`.
- `.git#branch=main,subdir=proto` says to clone the `main` branch and use the `proto` directory as the base directory.
- `.git#branch=main,recurse_submodules=true` says to clone the `main` branch along with all recursive submodules.
- `.git#ref=7c0dc2fee4d20dcee8a982268ce35e66fc19cac8` says to clone the default branch of the repo and checkout the specific ref.
- `.git#branch=foo,ref=3ef31aff63c2d2911e0665b13906d0b2027575b7` says to clone the foo branch of repo and checkout the specific ref.
- `.git#ref=refs/remotes/pull/3,branch=my_feature,depth=100` says to clone the specified branch to a depth of 100 and checkout `refs/remotes/pull/3`.
- `https://github.com/googleapis/googleapis.git` says to clone the default branch of the git repository at the remote location.
- `https://github.com/googleapis/googleapis.git#branch=master` says to clone the master branch of the git repository at the remote location.
- `https://github.com/googleapis/googleapis.git#tag=v1.0.0` says to clone the v1.0.0 tag of the git repository at the remote location.
- `git://github.com/googleapis/googleapis.git#branch=master` is also valid.
- `ssh://git@github.com/org/private-repo.git#branch=master` is also valid.
- `https://github.com/googleapis/googleapis#format=git,branch=master` is also valid.
- `https://github.com/envoyproxy/envoy.git#subdir=api,filter=tree:0` creates a treeless clone and sparse checkout at the `api` directory.

### protofile

A local Protobuf file. The path can be either relative or absolute, similar to the [dir](#dir) input. This is a special input that uses the file and its imports as the input to `buf` commands. If a local [configuration](../../cli/) file is found, dependencies specified are used to resolve file imports first, followed by the local filesystem. If there is no local configuration, the local filesystem is used to resolve file imports.

- The `include_package_files` option can used to include all other files in the package for the specified Protobuf file. This is set to `false` by default.

Examples:

- `buf build path/to/my/file.proto` compiles an [image](../images/) based on the file and its imports.
- An absolute path, `/absolute/path/to/my/file.proto` can also be accepted.
- `buf build path/to/my/file.proto#include_package_files=true` compiles an [image](../images/) for the file and the files in the package and their imports.
- `buf build path/to/my/file.proto#include_package_files=false` is equivalent to the default behavior.

### Symlinks

Note that symlinks are supported for `dir` and `protofile` inputs only, while `mod`, `git`, `tar`, and `zip` inputs ignore all symlinks.

## Image formats

All Buf images are files. You can read image files from a local path, a remote HTTP/HTTPS location, or stdin (using `-`).

You can create images using `buf build`. Examples:

- `buf build -o image.binpb`
- `buf build -o image.binpb.gz`
- `buf build -o image.binpb.zst`
- `buf build -o image.json`
- `buf build -o image.json.gz`
- `buf build -o image.json.zst`
- `buf build -o image.txtpb`
- `buf build -o image.txtpb.gz`
- `buf build -o image.txtpb.zst`
- `buf build -o -`
- `buf build -o -#format=json`
- `buf build -o -#format=json,compression=gzip`
- `buf build -o -#format=json,compression=zstd`
- `buf build -o -#format=txtpb`

Note that `-o` is an alias for `--output`.

**You can also create Buf images in the `binpb` format using `protoc`**. See the [internal compiler](../internal-compiler/) documentation for more details.

The command below, for examples, shows a way to compile all Protobuf files in your current directory, produce a [`FileDescriptorSet`](https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/descriptor.proto) (which is also a Buf image, as described in the [reference documentation](../images/)) to stdout, and read this image as binary from stdin:

Images should use the `.binpb`, `.txtpb`, and `.json` file extensions when stored on disk, as these are [now the canonical file extensions](https://protobuf.dev/programming-guides/techniques#suffixes) for these encoding formats.

```sh
protoc -I . $(find. -name '*.proto') -o /dev/stdout | buf lint -
```

### binpb

A Buf image in binary format.

> This was formerly called the `bin` format. `.binpb` is now the canonical file extension for Protobuf data serialized in binary format, so this has been changed to `binpb`. References to `bin` and the `.bin` function continue to function.

Use `compression=gzip` to specify that the Buf image is compressed using Gzip. This is automatically detected if the file extension is `.binpb.gz`

Use `compression=zstd` to specify that the Buf image is compressed using Zstandard. This is automatically detected if the file extension is `.binpb.zst`

Examples:

- `image.binpb` says to read the file at this relative path.
- `image.binpb.gz` says to read the gzipped file at this relative path.
- `image.binpb.zst` says to read the zstandard file at this relative path.
- `-` says to read a binary image from stdin.
- `-#compression=gzip` says to read a gzipped binary image from stdin.
- `-#compression=zstd` says to read a zstandard binary image from stdin.

### json

A Buf image in JSON format. This creates images that use much more space and are slower to parse but result in diffs that show the actual differences between two Buf images in a readable format.

Use `compression=gzip` to specify the Buf image is compressed with Gzip. This is automatically detected if the file extension is `.json.gz`

Use `compression=zstd` to specify that the Buf image is compressed with Zstandard. This is automatically detected if the file extension is `.json.zst`

Examples:

- `image.json` says to read the file at this relative path.
- `image.json.gz` says to read the gzipped file at this relative path.
- `image.json.zst` says to read the zstandard file at this relative path.
- `-#format=json` says to read a JSON image from stdin.
- `-#format=json,compression=gzip` says to read a gzipped JSON image from stdin.
- `-#format=json,compression=zstd` says to read a zstandard JSON image from stdin.

When combined with [jq](https://stedolan.github.io/jq), this also allows for introspection. For example, to see a list of all packages:

```sh
buf build -o -#format=json | jq '.file[] | .package' | sort | uniq | head
"google.actions.type"
"google.ads.admob.v1"
"google.ads.googleads.v1.common"
"google.ads.googleads.v1.enums"
"google.ads.googleads.v1.errors"
"google.ads.googleads.v1.resources"
"google.ads.googleads.v1.services"
"google.ads.googleads.v2.common"
"google.ads.googleads.v2.enums"
"google.ads.googleads.v2.errors"
```

### txtpb

A Buf image in [text](https://protobuf.dev/reference/protobuf/textformat-spec/) format. In modern usage of Protobuf, JSON is preferred, but many legacy usages of Protobuf still use the text format.

Use `compression=gzip` to specify that the Buf image is compressed using Gzip. This is automatically detected if the file extension is `.txtpb.gz`

Use `compression=zstd` to specify that the Buf image is compressed using Zstandard. This is automatically detected if the file extension is `.txtpb.zst`

Examples:

- `image.txtpb` says to read the file at this relative path.
- `image.txtpb.gz` says to read the gzipped file at this relative path.
- `image.txtpb.zst` says to read the zstandard file at this relative path.
- `-` says to read a binary image from stdin.
- `-#compression=gzip` says to read a gzipped binary image from stdin.
- `-#compression=zstd` says to read a zstandard binary image from stdin.

## Automatically derived formats

By default, `buf` derives the format and compression of an input from the path via the file extension.

| Extension  | Derived format | Derived Compression | Notes                                                                                                                           |
| ---------- | -------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| .binpb     | binpb          | none                |                                                                                                                                 |
| .binpb.gz  | binpb          | gzip                |                                                                                                                                 |
| .binpb.zst | binpb          | zstd                |                                                                                                                                 |
| .bin       | binpb          | none                | .binpb [is now the canonical file extension](https://protobuf.dev/programming-guides/techniques#suffixes) for the binary format |
| .bin.gz    | binpb          | gzip                | .binpb [is now the canonical file extension](https://protobuf.dev/programming-guides/techniques#suffixes) for the binary format |
| .bin.zst   | binpb          | zstd                | .binpb [is now the canonical file extension](https://protobuf.dev/programming-guides/techniques#suffixes) for the binary format |
| .json      | json           | none                |                                                                                                                                 |
| .json.gz   | json           | gzip                |                                                                                                                                 |
| .json.zst  | json           | zstd                |                                                                                                                                 |
| .txtpb     | txtpb          | none                |                                                                                                                                 |
| .txtpb.gz  | txtpb          | gzip                |                                                                                                                                 |
| .txtpb.zst | txtpb          | zstd                |                                                                                                                                 |
| .tar       | tar            | none                |                                                                                                                                 |
| .tar.gz    | tar            | gzip                |                                                                                                                                 |
| .tgz       | tar            | gzip                |                                                                                                                                 |
| .tar.zst   | tar            | zstd                |                                                                                                                                 |
| .zip       | zip            | n/a                 |                                                                                                                                 |
| .git       | git            | none                |                                                                                                                                 |

There are also **two special cases**:

- If the path is `-`, this is interpreted to mean stdin. By default, this is interpreted as the `binpb` Format.

  Of note, the special value `-` can also be used as a value to the `--output` flag of `buf build`, which is interpreted to mean stdout, and also interpreted by default as the `binpb` format.

- If the path is `/dev/null` on Linux or Mac, or `nul` for Windows, this is interpreted as the `binpb` format.

**If no format can be automatically derived, the `dir` format is assumed**, meaning that `buf` assumes that the path is a path to a local directory.

The format of an input can be explicitly set as described above.

## Deprecated formats

The formats below are deprecated. They should continue to work forever, but we recommend updating if you are explicitly specifying any of these.

| Format   | Replacement                                                |
| -------- | ---------------------------------------------------------- |
| `bingz`  | Use the `binpb` format with the `compression=gzip` option. |
| `jsongz` | Use the `json` format with the `compression=gzip` option.  |
| `targz`  | Use the `tar` format with the `compression=gzip` option.   |

## Authentication

Archives, Git repositories, and Buf image files can be read from remote locations. For those remote locations that need authentication, a couple of mechanisms exist.

### HTTPS

Remote archives and Buf image files use [netrc files](https://ec.haxx.se/usingcurl/netrc.html) for authentication. `buf` looks for a netrc file at `$NETRC` first, defaulting to `~/.netrc`.

Git repositories are cloned using the `git` command, so any credential helpers you have configured are automatically used.

Basic authentication can be also specified for remote archives, Git repositories, and Buf image files over HTTPS with these environment variables:

- `BUF_INPUT_HTTPS_USERNAME` is the username. For GitHub, this is your GitHub user.
- `BUF_INPUT_HTTPS_PASSWORD` is the password. For GitHub, this is a personal access token for your GitHub User.

Assuming one of these mechanisms is present, you can call `buf` as you normally would:

```sh
buf lint https://github.com/org/private-repo.git#branch=main
buf lint https://github.com/org/private-repo.git#tag=v1.0.0
buf lint https://github.com/org/private-repo/archive/main.tar.gz#strip_components=1
buf lint https://github.com/org/private-repo/archive/main.zip#strip_components=1
buf breaking --against https://github.com/org/private-repo.git#branch=main
buf breaking --against https://github.com/org/private-repo.git#tag=v1.0.0
```

### SSH

Public key authentication can be used for remote Git repositories over SSH.

Git repositories are cloned via the `git` command, so by default, `buf` uses your existing Git SSH configuration, including any identities added to `ssh-agent`.

These environment variables can also be used:

- `BUF_INPUT_SSH_KEY_FILE` is the path to the private key file.
- `BUF_INPUT_SSH_KNOWN_HOSTS_FILES` is a colon-separated list of known hosts file paths.

Assuming one of these mechanisms is present, you can call `buf` as you normally would:

```sh
buf lint ssh://git@github.com/org/private-repo.git#branch=main
buf lint ssh://git@github.com/org/private-repo.git#tag=v1.0.0
buf breaking --against ssh://git@github.com/org/private-repo.git#branch=main
buf breaking --against ssh://git@github.com/org/private-repo.git#tag=v1.0.0
```

Note that CI services such as [CircleCI](https://circleci.com) have a private key and known hosts file pre-installed, so this should work out of the box.

## Input configuration

By default, `buf` looks for a [`buf.yaml`](../../configuration/v2/buf-yaml/) in this manner:

- For `dir, binpb, json, txtpb` inputs, `buf` looks at your current directory for a `buf.yaml` file.
- For `tar` and `zip` inputs, `buf` looks at the root of the archive for a `buf.yaml` file after `strip_components` is applied.
- For `git` inputs, `buf` looks at the root of the cloned repository at the head of the cloned branch.

The configuration can be overridden with the `--config` flag. See the [configuration documentation](../../configuration/v2/buf-yaml/) for more details.
