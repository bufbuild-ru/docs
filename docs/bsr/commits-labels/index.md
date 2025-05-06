---

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/commits-labels/"
  - - link
    - rel: "prev"
      href: "https://bufbuild.ru/docs/bsr/repositories/"
  - - link
    - rel: "next"
      href: "https://bufbuild.ru/docs/bsr/authentication/"
  - - meta
    - property: "og:title"
      content: "Commits and labels - Buf Docs"
  - - meta
    - property: "og:image"
      content: "https://buf.build/docs/assets/images/social/bsr/commits-labels.png"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/commits-labels/"
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
      content: "Commits and labels - Buf Docs"
  - - meta
    - property: "twitter:image"
      content: "https://buf.build/docs/assets/images/social/bsr/commits-labels.png"
  - - meta
    - name: "twitter:card"
      content: "summary_large_image"

---

# Commits and labels

Like a version control system (VCS), the Buf Schema Registry (BSR) tracks the evolution of your schemas. Every time you push a change to the BSR, you create a _commit_, which is an immutable snapshot of a Buf [module](../../cli/modules-workspaces/) at a specific point in time that's stored in its [repository](../repositories/).

The BSR allows you to apply _labels_ to commits (similar to GitHub's branches and tags), which are usually used to separate feature development from production code, mark specific releases, and so on. Because the BSR is meant to be used alongside your VCS, its requirements are simpler, so we've chosen to collapse the branch and tag concepts into a single marker, the label.

This page explains the similarities and differences between the BSR and branch/tag-based systems, label interactions with Buf's governance features, and archiving and unarchiving labels.

See the [Modules and workspaces](../../cli/modules-workspaces/#referencing-a-module) page to learn how to reference a module by a specific commit or label.

## Commits

Every push of new content to a repository creates a commit that identifies a change in the schema. Commits include the schema files, Markdown docs, dependency manifest, Buf configuration files, and an optional VCS commit URL. They don't include any other VCS information, labels, or explicit parentage. Each commit also generates a digest of the contents. Commits also have no explicit parentage within the BSR — they can be diffed with any other commits in a label's history, but otherwise have no connection to each other.

One key difference between VCS commits and BSR commits is that unlike a VCS commit, a BSR commit only exists on the BSR repository and not locally. In addition to those listed above, BSR commits have the following properties:

- Commits may not be deleted.
- Commits always belong to at least one label (the [default label](../repositories/#default-label) if not specified)
- Commit can be present in multiple labels
- If [policy checks](../policy-checks/breaking/overview/) are enabled, a commit can have different review states in different labels
- All commits within a label are recorded and the history always moves forward — commits are appended only if they're newer than the latest (see [Interaction with governance features](#governance-interaction) below)
- All commits can be resolved as dependencies (for example, in `buf.lock` files or generated SDKs).
- Multiple BSR commits can have the same content but different VCS URLs, so that the backlinks provide context for the changes via the VCS commits and PR discussions. For example (assuming no other changes to the module):
  - BSR module contains content A.
  - VCS commit 1 creates a new service in the module.
    - Results in a BSR commit with content B and a link back to VCS commit 1.
  - VCS commit 2 modifies the service.
    - Results in a BSR commit with content C and a link back to VCS commit 2.
  - VCS commit 3 deletes the service and moves its functionality to a different module.
    - Results in a BSR commit with content A and a link back to VCS commit 3.

## Labels

A label is a mutable pointer to a specific commit. Each label has an append-only, time-ordered history of the commits it has pointed to over time. Labels can be applied when running `buf push` from the command line, but the more common use case is for CI/CD operations to assign labels to commits based on the branches and tags assigned to the corresponding VCS commit. Each repository has a _default label_ (named `main` by default), which is applied to commits unless another label is specified.

See the [Repository](../repositories/#default-label) page for more details about default label behavior.

### Interaction with governance features

If the BSR's [policy checks](../policy-checks/breaking/overview/) or [Confluent Schema Registry (CSR)](../csr/overview/) integration features are enabled, it enforces restrictions on when a label's pointer updates to a new commit. This protects consumers from broken builds or downstream data issues.

When policy checks are enabled, the new commit is allowed, but the label pointer only moves if either the commit doesn't introduce breaking changes _or_ an admin approves the commit from the review flow. Commits exist with one of these statuses at any given moment:

- **Passed:** The commit passes all checks (or checks aren't enabled).
- **Pending:** The commit failed a check and is now in the review flow.
- **Approved:** The commit was reviewed by a module admin and approved in spite of failing a check.
- **Rejected:** The commit was reviewed by a module admin and rejected.

### Deleting labels

You can't delete labels. The BSR is a package registry due to [generated SDKs](../generated-sdks/overview/), so deleting a label can have side effects that are much more impactful than branch deletion in Git. As a result, we don't allow it. However, you can [archive a label](../module/publish/#archiving-and-unarchiving-labels).

### Archived labels

Labels can be archived and unarchived, and the BSR behaves as follows:

- Archiving a label hides it from most lists in the UI by default (like autocomplete dropdowns), but doesn't actually delete it.
- You can still view archived labels if you know the direct URL.
- Pushing a new commit to an archived label automatically un-archives it.
- You can manually unarchive a label in the BSR UI.
- Buf's GitHub Action archives labels tied to PR branches when the PR is closed or merged.
- Archived labels are a valid resource reference and can be resolved as dependencies.
- The [default label](../repositories/#default-label) may not be archived.

For details about how to apply, archive, and unarchive labels, see [Pushing to the BSR](../module/publish/#archiving-and-unarchiving-labels).
