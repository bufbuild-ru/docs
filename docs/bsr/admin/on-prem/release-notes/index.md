---

title: "Release notes - Buf Docs"

head:
  - - link
    - rel: "canonical"
      href: "https://bufbuild.ru/docs/bsr/admin/on-prem/release-notes/"
  - - meta
    - property: "og:title"
      content: "Release notes - Buf Docs"
  - - meta
    - property: "og:url"
      content: "https://bufbuild.ru/docs/bsr/admin/on-prem/release-notes/"
  - - meta
    - property: "twitter:title"
      content: "Release notes - Buf Docs"

---

# Release notes

## v1.21.0

**_Release date:_** 2025-04-21 | **_Database version:_** 350 | **_Minimum CLI version:_** v1.24.0

- **[Customize homepage](../../instance/customize-homepage/):** We’ve updated the custom homepage to include an opt-in getting started guide that will only be accessible to authenticated users.
- **Types usage:** Admins can now access a more detailed dashboard about the [types usage for specific owners or repositories](../../../../subscription/manage-costs/#types-usage-dashboard) in their BSR instance.
- **Security group mapping:** When [mapping security groups to BSR organizations](../../instance/user-lifecycle/#map-a-security-group-to-a-bsr-organization) you can now optionally override a group member's role by specifying a `role_override`.
- **Code generation:** We’ve enabled remote code generation caching by default if networking isn't enabled in the [sandbox](../architecture/#bufsandboxd). When enabled, this setting allows the BSR to reuse previously generated code when the same artifact is requested by a user, resulting in faster code generation response times. Administrators of BSR instances where plugins may generate non-deterministic results due to noncompliance with [the plugin protocol](../../../remote-plugins/custom-plugins/#plugin-protocol-requirements) may want to consider disabling the cache by setting `generationCache: false` in the Helm chart.

## v1.20.1

**_Release date:_** 2025-04-07 | **_Database version:_** 339 | **_Minimum CLI version:_** v1.24.0

- **[Module Dependency UI](../../../module/dependency-management/#viewing-dependencies-and-dependents):** The module dependency UI now allows you to view any modules that depend on your module.
- **Maven Repository:** The BSR’s Maven Repository now prepends an underscore for Java Generated SDK packages that begin with a number, as [recommended](https://docs.oracle.com/javase/tutorial/java/package/namingpkgs.html) in the language spec.

## v1.20.0

**_Release date:_** 2025-03-28 | **_Database version:_** 339 | **_Minimum CLI version:_** v1.24.0

- **[Customize homepage](../../instance/customize-homepage/):** Instance admins can customize the BSR’s homepage to make it more specific to your overall organization's needs.
- **[Customize appearance](../../instance/customize-appearance/):** Instance admins can customize aspects of the BSR’s appearance such as colors, logos, and font families to match your organization’s branding.
- **Python Generated SDKs:** We’ve fixed an issue where some versions of Python Generated SDKs were unavailable when they should have already been generated.
- **Uniqueness check:** We’ve fixed an issue that was causing the [collision scan](../../../policy-checks/uniqueness/#scan-for-collisions) for the uniqueness check on an instance to fail in certain conditions.

## v1.19.0

**_Release date:_** 2025-03-11 | **_Database version:_** 335 | **_Minimum CLI version:_** v1.24.0

- **SAML Metadata Updates:** We’ve updated the BSR to retry fetching SAML metadata, mitigating possible issues that may occur during a deployment if a pod fails to retrieve SAML metadata due to transient network issues.

## v1.18.0

**_Release date:_** 2025-03-05 | **_Database version:_** 332 | **_Minimum CLI version:_** v1.24.0

- **[API reference documentation](../../../generated-sdks/tutorial/#api-reference):** The BSR can now generate API reference documentation for the plugin version and module commit specified by a Generated SDK.
- **[Reviewing CSR breaking changes](../../../csr/overview/#breaking-changes):** Any commits introducing breaking changes to a CSR subject’s schema are no longer blocked at push time. Those commits can now be [reviewed and approved](../../../policy-checks/breaking/review-commits/) by an admin by downgrading the compatibility mode of any affected subjects.
- We’ve updated the BSR to return a clearer [error message](https://github.com/bufbuild/buf/issues/3650) when running `buf generate` if a given plugin exists but the requested version does not.
- We've upgraded the [OCI Registry external dependency](../architecture/#external-dependencies) to [v3.0.0-rc.3](https://github.com/distribution/distribution/releases/tag/v3.0.0-rc.3). If you’ve customized your OCI Registry destination, consider updating your internal mirror also.

## v1.17.2

**_Release date:_** 2025-02-27 | **_Database version:_** 327 | **_Minimum CLI version:_** v1.24.0

- **Maven Repository**: We've fixed a bug that resulted in packages returning a 404 NotFound error after an error during artifact generation.
- **Plugins:** Added [grpc/swift-protobuf](https://github.com/grpc/grpc-swift-protobuf) plugin. Added support for Swift 6 and multiple Swift plugins for each Swift version.

## v1.17.1

**_Release date:_** 2025-02-19 | **_Database version:_** 327 | **_Minimum CLI version:_** v1.24.0

- **Managed plugins:** We’ve added v25.3 of the [kotlin and pyi plugins](https://github.com/bufbuild/plugins).

## v1.17.0

**_Release date:_** 2025-02-06 | **_Database version:_** 327 | **_Minimum CLI version:_** v1.24.0

- **Explore and share plugins and SDKs:** We made improvements to the [plugins](../../../remote-plugins/overview/) and generated SDKs pages, including changes to navigation to allow for better exploration and link sharing capabilities.
- **User documentation for SDKs:** We've added support for [user documentation](../../../generated-sdks/user-documentation/) for SDKs.
- **[Recommended SDKs](../../instance/recommended-sdks/):** Admins can now recommend generated SDKs at their respective levels (instance/organization/repository) to help guide schema consumers toward preferred plugins.
- **Dark mode:** We’ve added dark mode to the BSR, so users can now choose between a light or dark theme for their UI.

## v1.16.1

**_Release date:_** 2025-01-27 | **_Database version:_** 322 | **_Minimum CLI version:_** v1.24.0

- **OIDC:** We've [added support](../installation/#configure-authentication) for specifying a source for additional claims, like `groups`.
- **Managed modules:** We fixed an issue where the BSR was not consistently updating to the latest managed module version.

## v1.16.0

**_Release date:_** 2025-01-21 | **_Database version:_** 322 | **_Minimum CLI version:_** v1.24.0

::: tip NoteA license is now required to operate the BSR—more details on setup can be found in the [installation guide](../installation/#4-configure-the-bsrs-helm-values).

:::

- **Support custom authorization:** We've added support for retrieving additional claims from the UserInfo endpoint as specified in the [OpenID Connect Core 1.0 specification](https://openid.net/specs/openid-connect-core-1_0.html#UserInfo).
- **See deprecated plugins in Generated SDKs:** Deprecated plugins, which were previously hidden, are now visible when users select their plugin for generated SDKs.
- We've upgraded the [OCI Registry external dependency](../architecture/#external-dependencies) to [v3.0.0-rc.2](https://github.com/distribution/distribution/releases/tag/v3.0.0-rc.2). If you’ve customized your OCI Registry destination, consider updating your internal mirror also.

## v1.15.2

**_Release date:_** 2025-01-15 | **_Database version:_** 320 | **_Minimum CLI version:_** v1.24.0

- **OIDC:** We fixed an issue where the BSR did not trust additionally requested certificates when reaching out an OIDC provider.
- **Chart simplification:** We added a new [clientTLSSecrets](../installation/#trusting-additional-certificates) chart value to easily mount the certificates in all required clients.

## v1.15.1

**_Release date:_** 2025-01-14 | **_Database version:_** 320 | **_Minimum CLI version:_** v1.24.0

- **Blob Storage:** We fixed an issue where the BSR did not trust additionally requested certificates when reaching out to blob storage.
- **Bufjavacompilerd:** We fixed a permission issue that could lead to failed startups.

## v1.15.0

**_Release date:_** 2024-12-10 | **_Database version:_** 320 | **_Minimum CLI version:_** v1.24.0

- **NuGet generated SDKs:** We made several updates to NuGet generated SDKs, including updating them so they no longer require network access and can use the code generation sandbox directly.
- **Opt-in support for disallowing user-scoped repositories:** The BSR now provides [the option](../configuration/#feature-flags) to disallow users from creating personal repositories.
- **Python generated SDKs:** We added support for `poetry` and `uv`.
- **Go Module Proxy:** We added support for configurable base plugins, so customers can use alternatives to `protocolbuffers/go` as the Go base types in custom plugins.
- We've upgraded the [OCI Registry external dependency](../architecture/#external-dependencies) to [v3.0.0-rc.1](https://github.com/distribution/distribution/releases/tag/v3.0.0-rc.1). If you’ve customized your OCI Registry destination, consider updating your internal mirror also.

## v1.14.0

**_Release date:_** 2024-10-31 | **_Database version:_** 309 | **_Minimum CLI version:_** v1.24.0

- **Cargo registry update:** We now support custom licenses in [Cargo](../../../generated-sdks/cargo/) crates. Users can populate the `license` field in the generated SDK’s `cargo.toml` to a custom SPDX with the `LicenseRef-` [syntax](https://spdx.github.io/spdx-spec/v2.3/SPDX-license-expressions/).
- **Managed plugins:** We fixed an issue with plugin deletion which prevented the re-installation of deleted plugins.
- **Type uniqueness:** We fixed several issues, including the presence of duplicate types.

## v1.13.0

**_Release date:_** 2024-10-09 | **_Database version:_** 301 | **_Minimum CLI version:_** v1.24.0

- **Generated SDKs:** [NuGet](../../../generated-sdks/nuget/) and [CMake](../../../generated-sdks/cmake/) generated SDKs are now enabled for all BSR on-prem installations.
- **Cargo registry update:** License information is now added to Cargo crates. The crate uses the [module license](../../../../cli/modules-workspaces/#module-license) from its associated commit, otherwise it falls back to a raw LICENSE file if it's present in the module.
- We've updated the NuGet Repository to skip dependencies on [protocolbuffers/wellknowntypes](https://buf.build/protocolbuffers/wellknowntypes), allowing the `Google.Protobuf` package to pull in the correct dependency.

## v1.12.1

**_Release date:_** 2024-09-12 | **_Database version:_** 299 | **_Minimum CLI version:_** v1.24.0

- **Managed plugins:** Fixes to older versions of the [BSR managed plugins](https://github.com/bufbuild/plugins) are now included in on-prem releases.

## v1.12.0

**_Release date:_** 2024-09-11 | **_Database version:_** 299 | **_Minimum CLI version:_** v1.24.0

- **[Artifactory support for NuGet](../../../generated-sdks/artifactory/):** Users can now configure the BSR as a remote NuGet repository in Artifactory.
- We fixed an issue that prevented the generation of Cargo assets for older plugin versions.

---

# Older releases

Expand to see previous releases

## v1.11.0

**_Release date:_** 2024-08-27 | **_Database version:_** 298 | **_Minimum CLI version:_** v1.24.0

- **[NuGet repository support for generated SDKs](../../../generated-sdks/nuget/):** The NuGet repository serves generated SDKs for [`protocolbuffers/csharp`](https://buf.build/protocolbuffers/csharp) and [`grpc/csharp`](https://buf.build/grpc/csharp), allowing .NET developers to integrate with the BSR directly in their existing `dotnet` workflows.
- **[CMake support for generated SDKs](../../../generated-sdks/cmake/):** Use CMake’s [`FetchContent`](https://cmake.org/cmake/help/latest/module/FetchContent.html) command to get the generated C++ libraries directly from the BSR, supporting the use of [`protocolbuffers/cpp`](https://buf.build/protocolbuffers/cpp) and [`grpc/cpp`](https://buf.build/grpc/cpp).
- **BSR [status page](../observability/#status-page):** The new BSR status page helps BSR admins and deployment operators verify that the BSR instance is configured correctly.
- **[Opt-in support for unauthenticated access to public resources](../configuration/#public-access):** The BSR now provides the option to allow unauthenticated users to view public modules in the BSR, and consume related artifacts such as generated SDKs for those modules.
- **Cargo registry update:** We updated the Cargo Registry's `prost` generated SDKs to generate `bytes::Bytes` [fields](https://docs.rs/bytes/latest/bytes/struct.Bytes.html) for Protobuf `bytes` type fields, and enabled generation of the encoded `FileDescriptorSet` in the generated output for usage with tonic's gRPC reflection.
- **1 year limit on custom tokens:** Users can no longer create custom tokens with an expiry date longer than 1 year in the future.

## v1.10.0

**_Release date:_** 2024-07-23 | **_Database version:_** 295 | **_Minimum CLI version:_** v1.24.0

- We've upgraded the [OCI Registry external dependency](../architecture/#external-dependencies) to [v3.0.0-beta.1](https://github.com/distribution/distribution/releases/tag/v3.0.0-beta.1). If you’ve customized your OCI Registry destination, consider updating your internal mirror also.
- The BSR now implements the [UpdateOrganizations](https://buf.build/bufbuild/registry/docs/main:buf.registry.owner.v1#buf.registry.owner.v1.OrganizationService.UpdateOrganizations) and [ListOrganizations](https://buf.build/bufbuild/registry/docs/main:buf.registry.owner.v1#buf.registry.owner.v1.OrganizationService.ListOrganizations) RPCs.
- We fixed an issue that prevented the button for archiving or unarchiving labels from being visible to users with the correct permissions.

## v1.9.1

**_Release date:_** 2024-07-01 | **_Database version:_** 286 | **_Minimum CLI version:_** v1.24.0

- **Managed plugins:** [Community plugins](https://buf.build/community/plugins) are now included as part of the BSR managed plugins.
- **Code generation:** The sandbox runtime container used for code generation has had unneeded dependencies removed to reduce the surface area for potential vulnerabilities.
- **Managed modules:** Labels for Git commit SHAs on managed modules continue to be created, but they're automatically archived to reduce clutter the BSR UI when browsing a managed module. Pinning to archived labels in a `buf.yaml` continues to work.

## v1.9.0

**_Release date:_** 2024-06-18 | **_Database version:_** 284 | **_Minimum CLI version:_** v1.24.0

- **Cargo Registry:** Protobuf package names in generated Rust code are now converted into snake case to conform with expectations in the Rust ecosystem.
- **Managed Modules and Plugins:** Buf managed modules (for example googleapis, protovalidate) and [managed plugins](https://buf.build/plugins) are packaged with the BSR release. This functionality was added with v1.6.0 and is now enabled by default.
- **NPM Registry:** We've removed the `branch-<branch>` and `tag-<tag>` dist-tags from the npm package metadata. Now, the `label-<label>` dist-tags should be used for installation commands (for example `npm install <npm-bsr-package>@label-<label>`).

## v1.8.3

**_Release date:_** 2024-06-06 | **_Database version:_** 281 | **_Minimum CLI version:_** v1.24.0

- **Maven Registry:** We've added a [configuration option](../configuration/#using-artifactory-for-maven-generation) to support using a custom TLS trust store with an Artifactory registry.
- **Cargo Registry:** The Cargo registry has been updated to loosen dependency pins and allow for semver-compatible selection between dependencies, taking the highest available version.

## v1.8.2

**_Release date:_** 2024-06-04 | **_Database version:_** 281 | **_Minimum CLI version:_** v1.24.0

- **Maven Registry:** We've added configuration that enables the use of Artifactory between the BSR and Maven Central.
- **Cargo Registry:** The Cargo registry has been updated to always eagerly generate code for all of a crate's transitive dependencies.

## v1.8.1

**_Release date:_** 2024-05-29 | **_Database version:_** 280 | **_Minimum CLI version:_** v1.24.0

- **Rust SDKs:** The BSR now provides [generated SDKs](../../../generated-sdks/overview/) for Cargo in the form of a Crate Registry. You can consume generated SDKs from modules and plugins using `cargo`. SDKs are generated automatically when you push schema changes, eliminating the need to manage a Protobuf toolchain or generate code locally.
- **Archive Registry:** The Buf Schema Registry allows you to [generate and download an archive](../../../generated-sdks/tutorial/#download-archive) that contains the output of code generation for a combination of any module and Protobuf plugin, similar to what you would get with [generated SDKs](../../../generated-sdks/overview/) (except it works for any plugin, not just the languages supported by generated SDKs).
- **Module dependency UI:** We've updated the module dependency tab to list dependencies rather than display a dot graph. This makes browsing and exploring dependencies much easier, especially for modules with many transitive dependencies.

## v1.8.0

**_Release date:_** 2024-05-20 | **_Database version:_** 279 | **_Minimum CLI version:_** v1.24.0

- **[The next generation of Buf CLI](/blog/buf-cli-next-generation/index.md):** The Buf CLI and its associated configuration have been completely overhauled to support monorepos as first-class citizens. Buf CLI `v1.32.0` and newer require at least `v1.8.0` of the BSR for operations that interact with the BSR.
- **[New and improved BSR UI](/blog/enhanced-buf-push-bsr-ui/index.md)**: Alongside the [new Buf CLI](/blog/buf-cli-next-generation/index.md), we’re excited to introduce an enhanced `buf push` and unveil an updated Buf Schema Registry (BSR) UI. We’ve made significant changes to both `push` and the UI to eliminate friction when onboarding new teams and codebases to the BSR.
- **[Insomnia Support](/blog/kong-insomnia-grpc-bsr-support/index.md):** The BSR now integrates with Kong Insomnia, making gRPC even easier to use.
- **Fewer authentication redirects:** We are now handling authentication refresh tokens on the backend, so users should no longer see multiple redirects in the browser when their auth token expires.

---

## v1.7.0

**_Release date:_** 2024-04-17 | **_Database version:_** 266 | **_Minimum CLI version:_** v1.24.0

- **[Custom options](../../../documentation/create-docs/#annotated-protobuf-options):** BSR Generated Documentation has been enhanced to support Protobuf custom options.
- **[Protoschema plugins](https://github.com/bufbuild/protoschema-plugins):** We released a pair of Protobuf plugins that generate schemas from protos for JSON Schema and PubSub. Additionally, we published a Buf [managed module](https://buf.build/googlecloudplatform/bq-schema-api) and [plugin](https://buf.build/googlecloudplatform/bq-schema) for BigQuery.
- **[Module Archive](../../../module/export/#export-with-curl):** A new generic module archive endpoint can be used to download any module from the BSR in an archived format. This is similar to `buf export` but includes additional files (for example license, readme), and it works with standard tools, such as `curl` or `wget`.
- **[Module descriptor endpoint](../../../module/descriptor/):** A new endpoint enables users to get the FileDescriptorSet of a BSR module from an HTTP endpoint. As with the Module Archive, it works with standard tools and can be easily cached from the client side.
- **Data migrations:** This release contains an important data migration that will run asynchronously after startup and could take some time to complete on instances with a lot of data. This migration will need to complete before it's possible to upgrade to future versions, so we recommend upgrading to 1.7.0 as soon as you can.

---

## v1.6.0

**_Release date:_** 2024-03-19 | **_Database version:_** 255 | **_Minimum CLI version:_** v1.24.0

- **Managed Modules and Plugins:** Buf managed modules (for example googleapis, protovalidate) and [managed plugins](https://buf.build/plugins) are packaged with the BSR release. Existing customers will be contacted with upgrade instructions.
- **SAML:** We now allow for setting the SAML groups attribute name in the BSR helm chart. An example can be found in the [on-prem installation docs](../installation/#install-helm).
- **SLO Dashboards:** The observability dashboards and alerts have been updated to fix a bug where an incorrect histogram bucket was being used. The new Rules and Dashboards are available on the [Observability](../observability/) page.

---

## v1.5.1

**_Release date:_** 2024-02-15 | **_Database version:_** 247 | **_Minimum CLI version:_** v1.23.0

- **Plugins Sandbox:** Added a config option to allow restricted network access from within custom plugins.

## v1.5.0

**_Release date:_** 2024-02-13 | **_Database version:_** 247 | **_Minimum CLI version:_** v1.23.0

- **Icons:** The BSR has updated an update icon set that is better aligned with the concepts represented.
- **Search results design:** BSR Search uses the new icons to more effectively communicate result types, and also includes richer results on the [search page](https://buf.build/search).
- **Pinned dependencies in Python generated SDKs:** The BSR now pins module and plugin dependencies in the [Python generated SDKs](../../../generated-sdks/python/).
- **Reduced memory usage**: BSR instances no longer exhibit unbounded memory growth that was caused by [a long-lived cache in an upstream dependency](https://go-review.googlesource.com/c/protobuf/+/560095).

---

## v1.4.1

**_Release date:_** 2024-01-24 | **_Database version:_** 246 | **_Minimum CLI version:_** v1.23.0

- **Python registry:** The BSR now serves the Python index at `/gen/python/simple` in addition to `/gen/python` so that Artifactory correctly detects that the BSR serves a Python repository.
- **Types usage:** Types usage can now be viewed from the admin panel for enterprise and on-prem BSR instances. For example, if your BSR is https://buf.example.com, then usage will be available at https://buf.example.com/admin/usage.

## v1.4.0

**_Release date:_** 2024-01-17 | **_Database version:_** 246 | **_Minimum CLI version:_** v1.23.0

- **Azure support:** The BSR now supports deployment in an Azure environment and includes new config options for [Azure Blob Storage](../installation/#azure-blob-storage).
- **OCI registry:** The [OCI registry](../architecture/) used for storing remote plugins and managed modules has been upgraded. The new version adds support for Azure Blob Storage and addresses issues with AWS Workload Identity.

---

## v1.3.1

**_Release date:_** 2023-12-07 | **_Database version:_** 241 | **_Minimum CLI version:_** v1.23.0

- **Bugfix:** As part of the Governance workflow, the “review changes” page for a commit with a breaking change was showing an error and now displays properly.

## v1.3.0

**_Release date:_** 2023-12-05 | **_Database version:_** 241 | **_Minimum CLI version:_** v1.23.0

- **Python support for [generated SDKs](../../../generated-sdks/python/):** Python engineers no longer need to manage a Protobuf toolchain or generate code locally—they can now download pre-packaged generated code for their Protobuf schemas from the BSR using package management tools like pip, Poetry, Conda, and others that support [PEP 503 - Simple Repository API](https://peps.python.org/pep-0503/).
- **[Governance workflow](/blog/review-governance-workflow/index.md):** The BSR now provides the ability to configure a customer SMTP server to send email messages for the governance workflow.
- **Account Merging:** When a new SSO provider is configured, existing BSR users will automatically be migrated to the new provider based on email matching the next time they log in.
- **SLO Dashboards:** The SLO alerting threshold for slow requests has been decreased from 250s to 75s, in an effort to be more responsive to slow requests. Additionally, the histogram buckets for HTTP metrics have been adjusted so they're now in parity with RPC metrics. Please upgrade by [importing the new files](../observability/#grafana-dashboards).

---

## v1.2.0

**_Release date:_** 2023-11-07 | **_Database version:_** 239 | **_Minimum CLI version:_** v1.23.0

- **[Governance flow](../../../policy-checks/breaking/overview/#review-flow):** Buf's breaking change policy check includes a review flow, so that when developers attempt to push breaking changes to the BSR, commits can be approved or rejected by code owners instead of being rejected outright. This gives downstream consumers protection from breaking schema changes, but allows for nuance in cases where breaking changes are acceptable.
- **Updated activity view:** The activity view in the BSR has been updated to support branches and improve the ability to view commit history and tags. Throughout the BSR UI, branches have replaced drafts.
- **Generated SDKs:** Remote Packages has been rebranded as Generated SDKs, and includes clearer instructions with plugin filtering based on the preferred programming language.

---

## v1.1.0

**_Release date:_** 2023-10-03 | **_Database version:_** 222 | **_Minimum CLI version:_** v1.23.0

- The BSR now allows customers to [enforce uniqueness of Protobuf types and file paths across all modules](/blog/type-path-uniqueness/index.md). This helps to prevent name conflicts between Protobuf types in an application, which could result in fatal runtime exceptions and outages.
- BSR Search now includes results from the content of a module. Module content can be either a module element (service, method, message, enum) or a module file (`.proto`).
- BSR generated docs now support [syntax highlighting and markdown table rendering](../../../documentation/create-docs/#formatting-syntax).
- This release includes new SLO Dashboards for non-RPC endpoints to give visibility into the entire BSR as a whole. There are now separate dashboards to monitor all HTTP requests and Registry requests. See [Observability](../observability/) for more information.

---

## v1.0.4

**_Release date:_** 2023-08-28 | **_Database version:_** 208

- Enabled alerting for SLO dashboard
  - Adds _high-priority_ alerts with **severity=page** label for high error rate incidents **ErrorBudgetBurn**
  - Adds _low-priority_ **ErrorBudgetBurn** alerts with **severity=warning** label for low error rate incidents

---

## v1.0.3

**_Release date:_** 2023-07-21 | **_Database version:_** 189

- Updated the helm chart to default to using a fully qualified domain name for the OCI Registry
- Fixed the panic observed in maintenance mode. Previously, a working auth config was assumed; now updated to work without auth.
- Added the option of allowing the BSR to read trusted certificates from mounted files to address a x509 error.

---

## v1.0.2

**_Release date:_** 2023-07-14 | **_Database version:_** 186

- Added support for AWS instance profile credentials
- Updated Grafana dashboards to include recording rules
- Added support for prometheus endpoints

---

## v1.0.1

**_Release date:_** 2023-07-07 | **_Database version:_** 182

- Updated the BSR to use [`goose`](https://github.com/pressly/goose) for database migrations
- Included simple Grafana SLO dashboards with release

---

## v1.0.0

**_Release date:_** 2023-06-30

- Initial release
