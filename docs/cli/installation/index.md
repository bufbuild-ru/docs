---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/cli/installation/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/cli/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/cli/quickstart/"
  - - meta
    - property: "og:title"
      content: "Installation - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/cli/installation.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/cli/installation/"
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
      content: "Installation - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/cli/installation.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Install the Buf CLI

To install the Buf CLI, you can either use an installation script or download and extract an archive file from the command line that corresponds to the version of your operating system.

+++tabs key:03e8bda3cf345ee99ea1b631bc4970bb

== Homebrew

You can install `buf` on macOS or Linux using [Homebrew](https://brew.sh):

```console
$ brew install bufbuild/buf/buf
```

This installs:

- The binaries `buf`, `protoc-gen-buf-breaking`, `protoc-gen-buf-lint`.
- Bash completion for `buf`.
- Fish completion for `buf`.
- Zsh completion for `buf`.

== NPM

`buf` is available via [npm](https://www.npmjs.com/package/@bufbuild/buf):

```console
$ npm install @bufbuild/buf
```

This installs the binaries `buf`, `protoc-gen-buf-breaking`, and `protoc-gen-buf-lint` to be used within your project.

To execute `buf` from the command line, you can use `npx`:

```console
$ npx buf --version
```

== GitHub

`buf` is released via the [bufbuild/buf](https://github.com/bufbuild/buf) repository.

Two types of assets are available:

- The single `buf`, `protoc-gen-buf-breaking`, and `protoc-gen-buf-lint` binaries.
- A tarball containing the binaries, bash completion, fish completion, and zsh completion.

See the [Releases](https://github.com/bufbuild/buf/releases) page for the current release.

**Binary**

The binary is all you need to get started.

To install just the `buf` binary to `/usr/local/bin` for version `1.53.0`:

```sh
# Substitute BIN for your bin directory.
# Substitute VERSION for the current released version.
BIN="/usr/local/bin" && \
VERSION="1.53.0" && \
curl -sSL \
"https://github.com/bufbuild/buf/releases/download/v${VERSION}/buf-$(uname -s)-$(uname -m)" \
-o "${BIN}/buf" && \
chmod +x "${BIN}/buf"
```

`/usr/local/bin` should be on your `$PATH`.

To uninstall from `/usr/local/bin`:

```sh
# Substitute BIN for your bin directory.
BIN="/usr/local/bin" && \
rm -f "${BIN}/buf"
```

**Tarball**

To install the `buf`, `protoc-gen-buf-breaking`, and `protoc-gen-buf-lint` binaries, and bash/fish/zsh completion to `/usr/local` for version `1.53.0`:

```sh
# Substitute PREFIX for your install prefix.
# Substitute VERSION for the current released version.
PREFIX="/usr/local" && \
VERSION="1.53.0" && \
curl -sSL \
"https://github.com/bufbuild/buf/releases/download/v${VERSION}/buf-$(uname -s)-$(uname -m).tar.gz" | \
tar -xvzf - -C "${PREFIX}" --strip-components 1
```

The binaries are installed to `/usr/local/bin`, which should be on your `$PATH`.

To uninstall from `/usr/local`:

```sh
# Substitute PREFIX for your install prefix.
PREFIX="/usr/local" && \
rm -f \
"${PREFIX}/bin/buf" \
"${PREFIX}/bin/protoc-gen-buf-breaking" \
"${PREFIX}/bin/protoc-gen-buf-lint" \
"${PREFIX}/etc/bash_completion.d/buf" \
"${PREFIX}/etc/fish/vendor_completions.d/buf.fish"
"${PREFIX}/etc/zsh/site-functions/_buf"
```

#### Verify a release using minisign

Releases are signed using our [minisign](https://github.com/jedisct1/minisign) public key:

```text
RWQ/i9xseZwBVE7pEniCNjlNOeeyp4BQgdZDLQcAohxEAH5Uj5DEKjv6
```

The release assets can be verified using this command (assuming that `minisign` is installed):

```sh
# Download and verify the checksum file for the release
# Substitute VERSION for the current released version.
VERSION="1.53.0" && \
curl -OL https://github.com/bufbuild/buf/releases/download/v${VERSION}/sha256.txt && \
curl -OL https://github.com/bufbuild/buf/releases/download/v${VERSION}/sha256.txt.minisig && \
minisign -Vm sha256.txt -P RWQ/i9xseZwBVE7pEniCNjlNOeeyp4BQgdZDLQcAohxEAH5Uj5DEKjv6

# Download the file(s) you want to verify, for example the tarball
VERSION="1.53.0" && \
curl -OL \
"https://github.com/bufbuild/buf/releases/download/v${VERSION}/buf-$(uname -s)-$(uname -m).tar.gz"

# Verify the file checksums
cat sha256.txt | shasum -a 256 -c --ignore-missing
```

== Source

The binary can be installed from source if `go` is installed. However, we recommend using one of the release assets instead.

#### Unix

```sh
# Substitute GOBIN for your bin directory
# Leave unset to default to $GOPATH/bin
GOBIN=/usr/local/bin go install github.com/bufbuild/buf/cmd/buf@v1.53.0
```

#### Windows

```sh
# Substitute GOBIN for your bin directory
# Leave unset to default to %GOPATH%\bin
GOBIN=C:\dev\go\bin go install github.com/bufbuild/buf/cmd/buf@v1.53.0
```

#### Errors when using `tools.go`

This isn't an issue with Buf — all Go CLI tools can have this problem when using this approach. Despite its suggestion on the Go wiki, we consider it somewhat of an anti-pattern at Buf. **We don't support or recommend using `tools.go`.**

Programs are built (and tested) with a specific set of dependencies, and the `tools.go` method results in those dependencies being resolved with the dependencies of your own program (and other tools), which is ill-advised at best and incorrect at worst. Go packages aren't supposed to change in incompatible ways while keeping the same identity (which is why `v2` and `v1` packages, for example, have different import paths). Unfortunately, people break things and sometimes breaking changes are published on minor releases with the same import path. When this happens, the `tools.go` approach becomes problematic.

We recommend that you install Go tooling like anything else — either with individual `go install` calls or from released binaries. This way you're insulated from this problem. In addition, with Go v1.16 and higher, you can specify versions to `go install`, so ensuring everyone is using the same version for tooling is easily done without using `go.mod`.

You can find Buf’s officially recommended command for installing from source using `go install` above. Using this command causes the Go tool to ignore `go.mod`, so the versions of Buf dependencies are the exact ones that we intend.

== Docker

Buf ships a Docker image ([bufbuild/buf](https://hub.docker.com/r/bufbuild/buf)) that enables you to use `buf` as part of your Docker workflow.

For example, you can run `buf lint` with this command:

```console
$ docker run --volume "$(pwd):/workspace" --workdir /workspace bufbuild/buf lint
```

== Windows

You can install the Buf CLI using the [Scoop](https://scoop.sh) installer for Windows:

```powershell
scoop install buf
```

To update Buf:

```powershell
scoop update buf
```

#### Binary

Buf offers Windows binaries for both the `x86_64` and `arm64` architectures. You can download the latest binaries from [GitHub Releases](https://github.com/bufbuild/buf/releases/latest).

+++
