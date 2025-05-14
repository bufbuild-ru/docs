---
description: "Enterprise-grade Kafka and gRPC for the modern age."

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/reference/protobuf-files-and-packages/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/best-practices/style-guide/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/reference/descriptors/"
  - - meta
    - property: "og:title"
      content: "Files and packages - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/reference/protobuf-files-and-packages.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/reference/protobuf-files-and-packages/"
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
      content: "Files and packages - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/reference/protobuf-files-and-packages.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Files and packages

In the Protobuf IDL, files have two important facets to their identity:

1.  **Package**: the name that appears in a `package` declaration in the file. If there is no such declaration, the file uses the global, unnamed package.
2.  **File path**: the path of the source file (relative to some “import” or “project” root directory), as used by the compiler when code is generated for the file.

The following sections discuss these in depth as well as some best practices to avoid relevant pitfalls.

## TL;DR

Adhere to the following best practices to avoid issues in your generated code related to file collisions:

1.  Always declare a package in your Protobuf sources.

    Use at least 3 components in the package name: organization, purpose, version.

2.  Always organize your Protobuf files into a directory structure that mirrors the package name.
3.  Always import a file using the same path that was used to compile that file.

A highly recommended practice is to [lint](../../lint/overview/) your schemas as part of CI verification. In fact, most of the above best practices are already enforced by the Buf CLI’s lint rules!

## Packages

The package of a file defines the _namespace_ for all the elements defined in that file. The [fully qualified names](https://protobuf.com/docs/language-spec#fully qualified-names) of all elements — messages, enums, services, etc — are prefixed with this package name. The following example source file demonstrates how fully qualified names are formed:

```protobuf
syntax = "proto3";             // Fully qualified names
package foo.bar;               // ---------------------

message Baz {                  // foo.bar.Baz
  string name = 1;             // foo.bar.Baz.name
  fixed64 uid = 2;             // foo.bar.Baz.uid
  Settings settings = 3;       // foo.bar.Baz.settings
  message Settings {           // foo.bar.Baz.Settings
    bool frozen = 1;           // foo.bar.Baz.Settings.frozen
    uint32 version = 2;        // foo.bar.Baz.Settings.version
    repeated string attrs = 3; // foo.bar.Baz.Settings.attrs
  }
}
```

**Every element must have a unique fully qualified name.** So making sure every file has a `package` declaration is important. Multiple files can use the same package, so this is also a way to semantically group files and the schemata they define.

If you write a file that has _no_ package declaration and define a message therein named `User`, it's possible (likely, even) that another developer may do the same. While this _might be_ harmless, it easily becomes problematic when integrating with other code that uses Protobuf (such as when working with other teams or even with open-source libraries). If you wanted to use the API of another service or a third-party package in your program, and the author of that service or package has created types with the same package-less name as you, you will almost certainly run into problems in your program.

For example, in C++, this mistake results in a compile error. In Go, it results in a fatal error when the program is being initialized. Other languages may exhibit different symptoms; some work just fine.

You can categorically prevent all such issues by always specifying a package in every source file. Furthermore, you should specify a _good_ package name. Bad package names could just as likely lead to name conflicts. A good package name should be informative but also highly unlikely to be used accidentally by another Protobuf user.

**A good rule of thumb is to use at least three components**:

1.  The first component should be the name of the author or owner — typically a company or organization name. We can see this in action in the well-known types provided by Google, where the first component of the package is `google`.

    Avoid names that are too short and likely to conflict with similarly named organizations. For example `central` could be ambiguous as there are many companies whose name starts with the word “Central”.

    Ideally, use a name that's a registered trademark.

    If a company has an organization on a popular repository hub — like GitHub, GitLab, DockerHub, or the [public BSR](https://buf.build/explore) — you could use that same organization name.

    Be wary of using an individual’s name instead of an organization. For example, using a GitHub or Gmail user ID could be problematic if a different person happens to use the same user ID with a different system.

    Though it's safe to use the same package naming convention as Java — where package names start with a reverse domain name — we usually discourage it. For example, if your organization owns the domain “foobar.io” or “show.biz”, your Java package names might start with “io.foobar” or “biz.show” respectively. No other ecosystem uses this convention. So while this is useful from the standpoint of preventing name collisions, it's inconsistent with normal Protobuf package naming practices.

2.  The second component should convey the purpose of the Protobuf schema or the purpose or name of the system or product that it defines. Looking at some example Google services, we see packages like [`google.bigtable`](https://github.com/googleapis/googleapis/tree/master/google/bigtable), [`google.datastore`](https://github.com/googleapis/googleapis/tree/master/google/datastore), [`google.pubsub`](https://github.com/googleapis/googleapis/tree/master/google/pubsub), and [`google.spanner`](https://github.com/googleapis/googleapis/tree/master/google/spanner).

    If your company has built multiple systems or products, then the name of a system or product is suitable. It may be useful to group related systems or products if there are many of them. For example, Google has grouped many of their APIs related to Google Cloud under the name `cloud`: [`google.cloud.compute`](https://github.com/googleapis/googleapis/tree/master/google/cloud/compute), [`google.cloud.iap`](https://github.com/googleapis/googleapis/tree/master/google/cloud/iap), [`google.cloud.kms`](https://github.com/googleapis/googleapis/tree/master/google/cloud/kms), and [`google.cloud.support`](https://github.com/googleapis/googleapis/tree/master/google/cloud/support).

    You should generally _not_ create a package component named “api” because that's vague. Concrete and informative names are better.

3.  The last component should be [a version number](../../lint/rules/#package_version_suffix). Defining your packages with a version number clearly communicates the stability of the schema (`v1alpha1` indicates an unstable API; `v1` indicates a stable contract) and also gives you a path to making breaking changes in the future, by introducing incompatible schemas in a separate package with a new version number.

    There are techniques to safely make breaking changes without versioning — dissecting the changes into small, careful, incremental changes coupled with careful updates and roll-outs of all consumers and producers. But these techniques can be error-prone and brittle. And once an organization gets to be a certain size, they become infeasible. They're also infeasible when there are producers or consumers outside of your control, such as external API clients, older software on users’ mobile devices, etc. So creating a new version, and supporting both versions while getting clients to migrate to the new one, is generally safer and easier to reason about.

Larger organizations and/or large systems with many Protobuf sources likely want longer package names with deeper hierarchies: this helps organize the schemas in addition to helping prevent two different developers from accidentally creating conflicting packages.

For example, within a single system or product, you can subdivide packages further using the names of services (for micro-service architectures) or names of significant components or business domain entities. For example, if we have an organization “Acme” that makes an online gaming product named “Gamify”, we might have `acme.gamify.users.v1`. We may also have `acme.gamify.users.settings.v1`, with APIs for a user to update their own settings. And we’d probably have other components, one per game, such as `acme.gamify.bingo.v1` and `acme.gamify.checkers.v1`.

Within a single service, you might create sub-packages for orthogonal functions. For example, within `google.bigtable`, there is a sub-package named [`google.bigtable.admin`](https://github.com/googleapis/googleapis/tree/master/google/bigtable/admin) which contains administrative APIs for the BigTable control plane.

Avoid including parts of your org chart — like team names — in the package. Attributes like these can change over time, and ownership over particular parts of the codebase can also change over time. So it’s better to use names or descriptive words that are unlikely to change.

## File Paths

If you compile a file using a very short path, like `util.proto`, it's possible that another user may use the exact same path to compile their unrelated file. Just like above, this _might be_ fine — until you start integrating with code whose author made a similar conflicting choice.

This issue comes about due to the way [descriptors](../descriptors/) work (descriptors are runtime representations of parsed Protobuf source files). File descriptors are identified by this path. When conflicts arise, the symptoms may vary, from compilation failure to runtime errors. For languages that don't support descriptors, things will likely work without error.

So, in order to avoid possible conflicts of file paths with files from other authors, you should organize the files under folders in a way that the path is unlikely to conflict.

In the previous section, we already discussed how to create a good package name that's unlikely to conflict with other authors. So the best practice here is simple: **organize files into directories that mirror the package name**.

So if you are using a package such as `foo.bar.baz`, the files for that package should live in a folder named `foo/bar/baz`. When you compile those files, make sure the compiler is seeing paths for these files that start with `foo/bar/baz`.

- In `buf`, the file’s path and name aren’t provided to the compiler explicitly. Instead, the file’s path is relative to the module’s root (where the [`buf.yaml`](../../configuration/v2/buf-yaml/) file is defined). All source files in the module are compiled together. So you’d create `foo/bar/baz` folders underneath the module root.
- In `protoc`, on the other hand, the names are provided explicitly, as are “import paths” in the form of `-I` flags. The file names provided must be relative to one of these import paths. (If none are specified, the current directory is assumed to be the only import path.) So you would pass filenames like `foo/bar/baz/baz.proto` and provide the root directory via an `-I` flag. You could even invoke `protoc` from the root directory and pass `-I .` as a flag.

### Imports

A file’s path is also used in `import` statements, by other files that depend on the file and make use of types that it defines.

It's important that other files import the file using the same path. So if a file is compiled using the path `foo/bar/baz/baz.proto`, then all files that depend on that file should import it the same way:

```protobuf
import "foo/bar/baz/baz.proto";
```

When [descriptors](../descriptors/) are used, like for reflection use cases, the source of the descriptors is often a set of embedded data in the generated code. When we compiled the file as `foo/bar/baz/baz.proto`, the embedded data contains that string (`“foo/bar/baz/baz.proto"`) as the file’s path.

If we used a different path to import the same file, for example `baz/baz.proto`, then when we load a file descriptor for that importing file, it may not be able to resolve the import because the imported path doesn't match the one in the embedded data.

Using `buf` can help to avoid this mistake. But even though `buf` makes this mistake harder, it's still possible. If you're vendoring dependencies in your module (for example, if they're not available on the [BSR](../../bsr/) and so can’t be declared in your `buf.yaml` [configuration](../../configuration/v2/buf-yaml/#deps)), you must make sure that the directory structure of these vendored files, relative to the module root, matches the layout of the authoritative sources.

If you're using protoc, this is an easy mistake to make: the flexibility of the command-line interface actually lends itself to doing this and ending up compiling with mismatching paths. You need to be very cautious in how you configure include paths to make sure that such mistakes can be caught by protoc instead of showing up as problems in the generated code.

If you do refer to a file in an `import` statement using a different path from how that file itself was compiled, you are likely to see errors with generated code. In C++, this manifests in compilation failures. In Go and Java, this can manifest in runtime errors when trying to actually use the descriptors that have mismatching import statements. In languages that don't support descriptors, there are likely to be no issues.

Even if you're not using a language where these problems emerge, it's best to avoid them. The community and possibly your future self will thank you if and when your schema ends up being used with languages where errors _do_ occur.
