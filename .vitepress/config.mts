import { defineConfig } from 'vitepress';
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Buf',
  titleTemplate: ':title',

  description: 'The best way of working with Protocol Buffers.',

  cleanUrls: true,

  sitemap: {
    hostname: 'https://bufbuild.ru',
  },

  markdown: {
    html: true,
    config(md) {
      md.use(tabsMarkdownPlugin);
    },
  },

  ignoreDeadLinks: 'localhostLinks',

  themeConfig: {
    logo: '/buf-docs.svg',

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: 'Bufstream',
        link: '/product/bufstream/',
      },
      {
        text: 'Schema Registry',
        link: '/product/bsr/',
      },
      {
        text: 'CLI',
        link: '/cli/',
      },
      {
        text: 'Docs',
        link: '/docs/',
      },
      {
        text: 'Blog',
        link: '/blog/',
      },
    ],

    sidebar: [
      {
        text: 'Buf Docs',
        items: [
          { text: 'Home', link: '/docs/' },
          {
            text: 'Buf CLI',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/docs/cli/' },
              { text: 'Installation', link: '/docs/cli/installation/' },
              { text: 'Quickstart', link: '/docs/cli/quickstart/' },
              {
                text: 'Editor integration',
                link: '/docs/cli/editor-integration/',
              },
              {
                text: 'Modules and workspaces',
                link: '/docs/cli/modules-workspaces/',
              },
              {
                text: 'Generate code',
                collapsed: true,
                items: [
                  { text: 'Overview', link: '/docs/generate/overview/' },
                  { text: 'Tutorial', link: '/docs/generate/tutorial/' },
                  {
                    text: 'Managed mode',
                    link: '/docs/generate/managed-mode/',
                  },
                  {
                    text: 'buf.gen.yaml',
                    link: '/docs/configuration/v2/buf-gen-yaml/',
                  },
                  {
                    text: 'Troubleshooting code generation',
                    link: '/docs/generate/troubleshooting/',
                  },
                ],
              },
              {
                text: 'Detect breaking changes',
                collapsed: true,
                items: [
                  { text: 'Overview', link: '/docs/breaking/overview/' },
                  { text: 'Tutorial', link: '/docs/breaking/quickstart/' },
                  {
                    text: 'Rules and categories',
                    link: '/docs/breaking/rules/',
                  },
                  {
                    text: 'buf.yaml',
                    link: '/docs/configuration/v2/buf-yaml/',
                  },
                ],
              },
              {
                text: 'Lint Protobuf files',
                collapsed: true,
                items: [
                  { text: 'Overview', link: '/docs/lint/overview/' },
                  { text: 'Tutorial', link: '/docs/lint/quickstart/' },
                  { text: 'Rules and categories', link: '/docs/lint/rules/' },
                  {
                    text: 'buf.yaml',
                    link: '/docs/configuration/v2/buf-yaml/',
                  },
                ],
              },
              {
                text: 'Format Protobuf files',
                collapsed: true,
                items: [
                  { text: 'Overview', link: '/docs/format/style/' },
                  { text: 'Tutorial', link: '/docs/format/tutorial/' },
                ],
              },
              {
                text: 'Call Protobuf APIs',
                collapsed: true,
                items: [{ text: 'Overview', link: '/docs/curl/usage/' }],
              },
              {
                text: 'Build your Protobuf schema',
                collapsed: true,
                items: [
                  { text: 'Overview', link: '/docs/build/overview/' },
                  { text: 'Tutorial', link: '/docs/build/tutorial/' },
                ],
              },
              {
                text: 'Buf plugins',
                collapsed: true,
                items: [
                  { text: 'Overview', link: '/docs/cli/buf-plugins/overview/' },
                  {
                    text: 'Tutorial',
                    link: '/docs/cli/buf-plugins/tutorial-create-buf-plugin/',
                  },
                  {
                    text: 'Compiling to WebAssembly',
                    link: '/docs/cli/buf-plugins/webassembly/',
                  },
                  {
                    text: 'Publish plugins to the BSR',
                    link: '/docs/cli/buf-plugins/publish/',
                  },
                ],
              },
              { text: 'protoc plugins', link: '/docs/cli/protoc-plugins/' },
              {
                text: 'Build systems',
                collapsed: true,
                items: [
                  { text: 'Bazel', link: '/docs/cli/build-systems/bazel/' },
                  { text: 'Gradle', link: '/docs/cli/build-systems/gradle/' },
                ],
              },
            ],
          },
          {
            text: 'Buf Schema Registry',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/docs/bsr/' },
              { text: 'Quickstart', link: '/docs/bsr/quickstart/' },
              { text: 'Repositories', link: '/docs/bsr/repositories/' },
              { text: 'Commits and labels', link: '/docs/bsr/commits-labels/' },
              { text: 'Authentication', link: '/docs/bsr/authentication/' },
              {
                text: 'Working with modules',
                collapsed: true,
                items: [
                  {
                    text: 'Dependency management',
                    link: '/docs/bsr/module/dependency-management/',
                  },
                  {
                    text: 'Publish modules to the BSR',
                    link: '/docs/bsr/module/publish/',
                  },
                  {
                    text: 'Export modules from the BSR',
                    link: '/docs/bsr/module/export/',
                  },
                  {
                    text: "Get module's FileDescriptorSet from the BSR",
                    link: '/docs/bsr/module/descriptor/',
                  },
                ],
              },
              {
                text: 'CI/CD',
                collapsed: true,
                items: [
                  { text: 'General setup', link: '/docs/bsr/ci-cd/setup/' },
                  {
                    text: 'GitHub Action',
                    link: '/docs/bsr/ci-cd/github-actions/',
                  },
                ],
              },
              {
                text: 'Remote plugins',
                collapsed: true,
                items: [
                  {
                    text: 'Overview',
                    link: '/docs/bsr/remote-plugins/overview/',
                  },
                  { text: 'Tutorial', link: '/docs/bsr/remote-plugins/usage/' },
                  {
                    text: 'Custom plugins',
                    link: '/docs/bsr/remote-plugins/custom-plugins/',
                  },
                ],
              },
              {
                text: 'Generated SDKs',
                collapsed: true,
                items: [
                  {
                    text: 'Overview',
                    link: '/docs/bsr/generated-sdks/overview/',
                  },
                  {
                    text: 'Tutorial',
                    link: '/docs/bsr/generated-sdks/tutorial/',
                  },
                  {
                    text: 'User documentation',
                    link: '/docs/bsr/generated-sdks/user-documentation/',
                  },
                  { text: 'Cargo', link: '/docs/bsr/generated-sdks/cargo/' },
                  { text: 'CMake', link: '/docs/bsr/generated-sdks/cmake/' },
                  { text: 'Go packages', link: '/docs/bsr/generated-sdks/go/' },
                  {
                    text: 'Maven/Gradle',
                    link: '/docs/bsr/generated-sdks/maven/',
                  },
                  { text: 'NPM', link: '/docs/bsr/generated-sdks/npm/' },
                  { text: 'NuGet', link: '/docs/bsr/generated-sdks/nuget/' },
                  { text: 'Python', link: '/docs/bsr/generated-sdks/python/' },
                  {
                    text: 'Swift Package Manager/Xcode',
                    link: '/docs/bsr/generated-sdks/swift/',
                  },
                  {
                    text: 'Using Artifactory',
                    link: '/docs/bsr/generated-sdks/artifactory/',
                  },
                ],
              },
              {
                text: 'Policy checks',
                collapsed: true,
                items: [
                  {
                    text: 'Breaking changes',
                    collapsed: true,
                    items: [
                      {
                        text: 'Overview',
                        link: '/docs/bsr/policy-checks/breaking/overview/',
                      },
                      {
                        text: 'Setup',
                        link: '/docs/bsr/policy-checks/breaking/setup/',
                      },
                      {
                        text: 'Reviewing commits',
                        link: '/docs/bsr/policy-checks/breaking/review-commits/',
                      },
                    ],
                  },
                  {
                    text: 'Uniqueness',
                    link: '/docs/bsr/policy-checks/uniqueness/',
                  },
                ],
              },
              {
                text: 'Confluent Schema Registry integration',
                collapsed: true,
                items: [
                  { text: 'Overview', link: '/docs/bsr/csr/overview/' },
                  {
                    text: 'Manage Confluent Schema Registry instances',
                    link: '/docs/bsr/csr/manage-instances/',
                  },
                  {
                    text: 'Manage schemas',
                    link: '/docs/bsr/csr/manage-schemas/',
                  },
                  {
                    text: 'Integrate with Kafka clients',
                    link: '/docs/bsr/csr/kafka-clients/',
                  },
                ],
              },
              {
                text: 'Schema documentation',
                collapsed: true,
                items: [
                  {
                    text: 'Overview',
                    link: '/docs/bsr/documentation/overview/',
                  },
                  {
                    text: 'Adding documentation',
                    link: '/docs/bsr/documentation/create-docs/',
                  },
                ],
              },
              {
                text: 'Explore your APIs in Buf Studio',
                link: '/docs/bsr/studio/',
              },
              { text: 'Rate limits', link: '/docs/bsr/rate-limits/' },
              {
                text: 'BSR APIs',
                collapsed: true,
                items: [
                  {
                    text: 'Invoking the BSR APIs',
                    link: '/docs/bsr/apis/api-access/',
                  },
                  {
                    text: 'Reflection API – Overview',
                    link: '/docs/bsr/reflection/overview/',
                  },
                  {
                    text: 'Prototransform',
                    link: '/docs/bsr/reflection/prototransform/',
                  },
                ],
              },
              {
                text: 'Admin guides',
                collapsed: true,
                items: [
                  {
                    text: 'Manage your Buf account',
                    link: '/docs/bsr/admin/user-account/',
                  },
                  {
                    text: 'Manage organizations',
                    link: '/docs/bsr/admin/manage-organizations/',
                  },
                  {
                    text: 'Manage repositories',
                    link: '/docs/bsr/admin/manage-repositories/',
                  },
                  { text: 'Roles', link: '/docs/bsr/admin/roles/' },
                  {
                    text: 'Private instance',
                    collapsed: true,
                    items: [
                      {
                        text: 'Pro setup',
                        link: '/docs/bsr/admin/instance/setup-pro/',
                      },
                      {
                        text: 'Enterprise setup',
                        link: '/docs/bsr/admin/instance/setup-enterprise/',
                      },
                      {
                        text: 'SSO',
                        collapsed: true,
                        items: [
                          {
                            text: 'GitHub - OAuth2',
                            link: '/docs/bsr/admin/instance/sso/github-oauth2/',
                          },
                          {
                            text: 'Google - SAML',
                            link: '/docs/bsr/admin/instance/sso/google-saml/',
                          },
                          {
                            text: 'Okta - OIDC',
                            link: '/docs/bsr/admin/instance/sso/okta-oidc/',
                          },
                          {
                            text: 'Okta - SAML',
                            link: '/docs/bsr/admin/instance/sso/okta-saml/',
                          },
                        ],
                      },
                      {
                        text: 'SCIM',
                        collapsed: true,
                        items: [
                          {
                            text: 'Overview',
                            link: '/docs/bsr/admin/instance/scim/overview/',
                          },
                          {
                            text: 'Azure - SAML',
                            link: '/docs/bsr/admin/instance/scim/azure-saml/',
                          },
                          {
                            text: 'Okta - SAML',
                            link: '/docs/bsr/admin/instance/scim/okta-saml/',
                          },
                          {
                            text: 'FAQ',
                            link: '/docs/bsr/admin/instance/scim/faq/',
                          },
                        ],
                      },
                      {
                        text: 'Customize appearance',
                        link: '/docs/bsr/admin/instance/customize-appearance/',
                      },
                      {
                        text: 'Customize homepage',
                        link: '/docs/bsr/admin/instance/customize-homepage/',
                      },
                      {
                        text: 'User lifecycle',
                        link: '/docs/bsr/admin/instance/user-lifecycle/',
                      },
                      {
                        text: 'Bot users',
                        link: '/docs/bsr/admin/instance/bot-users/',
                      },
                      {
                        text: 'Managed modules',
                        link: '/docs/bsr/admin/instance/managed-modules/',
                      },
                      {
                        text: 'Audit logs',
                        link: '/docs/bsr/admin/instance/audit-logs/',
                      },
                      {
                        text: 'Webhooks',
                        link: '/docs/bsr/admin/instance/webhooks/',
                      },
                      {
                        text: 'Federation',
                        link: '/docs/bsr/admin/instance/federation/',
                      },
                      {
                        text: 'Recommended SDKs',
                        link: '/docs/bsr/admin/instance/recommended-sdks/',
                      },
                      {
                        text: 'Support',
                        link: '/docs/bsr/admin/instance/support/',
                      },
                    ],
                  },
                  {
                    text: 'On-prem instance',
                    collapsed: true,
                    items: [
                      {
                        text: 'Installation',
                        link: '/docs/bsr/admin/on-prem/installation/',
                      },
                      {
                        text: 'Optional configuration',
                        link: '/docs/bsr/admin/on-prem/configuration/',
                      },
                      {
                        text: 'Observability',
                        link: '/docs/bsr/admin/on-prem/observability/',
                      },
                      {
                        text: 'Architecture',
                        link: '/docs/bsr/admin/on-prem/architecture/',
                      },
                      {
                        text: 'Upgrade/Downgrade',
                        link: '/docs/bsr/admin/on-prem/upgrade/',
                      },
                      {
                        text: 'Release notes',
                        link: '/docs/bsr/admin/on-prem/release-notes/',
                      },
                    ],
                  },
                  {
                    text: 'Subscriptions',
                    collapsed: true,
                    items: [
                      {
                        text: 'Manage subscription',
                        link: '/docs/subscription/manage/',
                      },
                      {
                        text: 'Manage costs',
                        link: '/docs/subscription/manage-costs/',
                      },
                      {
                        text: 'Migrate to private instance',
                        link: '/docs/subscription/migrate/',
                      },
                      { text: 'FAQs', link: '/docs/subscription/faq/' },
                    ],
                  },
                ],
              },
            ],
          },
          {
            text: 'Bufstream',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/docs/bufstream/' },
              { text: 'Quickstart', link: '/docs/bufstream/quickstart/' },
              { text: 'Blog posts', link: '/docs/bufstream/blog-posts/' },
              { text: 'Benchmarks and cost', link: '/docs/bufstream/cost/' },
              {
                text: 'Deployment',
                collapsed: true,
                items: [
                  {
                    text: 'Tuning and performance',
                    link: '/docs/bufstream/deployment/tuning-performance/',
                  },
                  {
                    text: 'AWS',
                    collapsed: true,
                    items: [
                      {
                        text: 'Deploy with etcd',
                        link: '/docs/bufstream/deployment/aws/deploy-etcd/',
                      },
                      {
                        text: 'Deploy with Postgres',
                        link: '/docs/bufstream/deployment/aws/deploy-postgres/',
                      },
                    ],
                  },
                  {
                    text: 'Google Cloud',
                    collapsed: true,
                    items: [
                      {
                        text: 'Deploy with etcd',
                        link: '/docs/bufstream/deployment/gcp/deploy-etcd/',
                      },
                      {
                        text: 'Deploy with Postgres',
                        link: '/docs/bufstream/deployment/gcp/deploy-postgres/',
                      },
                      {
                        text: 'Deploy with Spanner',
                        link: '/docs/bufstream/deployment/gcp/deploy-spanner/',
                      },
                    ],
                  },
                  {
                    text: 'Azure',
                    collapsed: true,
                    items: [
                      {
                        text: 'Deploy with etcd',
                        link: '/docs/bufstream/deployment/azure/deploy-etcd/',
                      },
                      {
                        text: 'Deploy with Postgres',
                        link: '/docs/bufstream/deployment/azure/deploy-postgres/',
                      },
                    ],
                  },
                ],
              },
              {
                text: 'Data governance',
                collapsed: true,
                items: [
                  {
                    text: 'Schema enforcement',
                    link: '/docs/bufstream/data-governance/schema-enforcement/',
                  },
                  {
                    text: 'Semantic validation',
                    link: '/docs/bufstream/data-governance/semantic-validation/',
                  },
                ],
              },
              {
                text: 'Iceberg',
                collapsed: true,
                items: [
                  { text: 'Overview', link: '/docs/bufstream/iceberg/' },
                  {
                    text: 'Quickstart',
                    link: '/docs/bufstream/iceberg/quickstart/',
                  },
                  {
                    text: 'Configuration',
                    link: '/docs/bufstream/iceberg/configuration/',
                  },
                  {
                    text: 'Reference',
                    link: '/docs/bufstream/iceberg/reference/',
                  },
                ],
              },
              {
                text: 'Kafka compatibility',
                collapsed: true,
                items: [
                  {
                    text: 'Client configuration',
                    link: '/docs/bufstream/kafka-compatibility/configure-clients/',
                  },
                  {
                    text: 'Supported APIs',
                    link: '/docs/bufstream/kafka-compatibility/conformance/',
                  },
                ],
              },
              {
                text: 'Authentication',
                collapsed: true,
                items: [
                  { text: 'SASL', link: '/docs/bufstream/auth/sasl/' },
                  { text: 'mTLS', link: '/docs/bufstream/auth/mtls/' },
                ],
              },
              {
                text: 'Observability',
                collapsed: true,
                items: [
                  {
                    text: 'Overview',
                    link: '/docs/bufstream/observability/overview/',
                  },
                  {
                    text: 'Metrics',
                    link: '/docs/bufstream/observability/metrics/',
                  },
                  {
                    text: 'Status endpoint',
                    link: '/docs/bufstream/observability/status-endpoint/',
                  },
                  {
                    text: 'Datadog',
                    link: '/docs/bufstream/observability/datadog/',
                  },
                  {
                    text: 'Grafana',
                    link: '/docs/bufstream/observability/grafana/',
                  },
                ],
              },
              {
                text: 'Integrations',
                collapsed: true,
                items: [
                  { text: 'AKHQ', link: '/docs/bufstream/integrations/akhq/' },
                  {
                    text: 'Redpanda Console',
                    link: '/docs/bufstream/integrations/redpanda-console/',
                  },
                ],
              },
              {
                text: 'Reference',
                collapsed: true,
                items: [
                  {
                    text: 'Bufstream CLI commands',
                    link: '/docs/bufstream/reference/cli/',
                    collapsed: true,
                    items: [
                      {
                        text: 'bufstream migrate',
                        link: '/docs/bufstream/reference/cli/migrate/',
                      },
                      {
                        text: 'bufstream serve',
                        link: '/docs/bufstream/reference/cli/serve/',
                      },
                      {
                        text: 'Admin',
                        link: '/docs/bufstream/reference/cli/admin/',
                        collapsed: true,
                        items: [
                          {
                            text: 'bufstream admin get',
                            link: '/docs/bufstream/reference/cli/admin/get/',
                          },
                          {
                            text: 'bufstream admin resolve',
                            link: '/docs/bufstream/reference/cli/admin/resolve/',
                          },
                          {
                            text: 'bufstream admin set',
                            link: '/docs/bufstream/reference/cli/admin/set/',
                          },
                          {
                            text: 'bufstream admin status',
                            link: '/docs/bufstream/reference/cli/admin/status/',
                          },
                          {
                            text: 'bufstream admin usage',
                            link: '/docs/bufstream/reference/cli/admin/usage/',
                          },
                          {
                            text: 'Clean',
                            link: '/docs/bufstream/reference/cli/admin/clean/',
                            collapsed: true,
                            items: [
                              {
                                text: 'bufstream admin clean intake',
                                link: '/docs/bufstream/reference/cli/admin/clean/intake/',
                              },
                              {
                                text: 'bufstream admin clean storage',
                                link: '/docs/bufstream/reference/cli/admin/clean/storage/',
                              },
                              {
                                text: 'bufstream admin clean topics',
                                link: '/docs/bufstream/reference/cli/admin/clean/topics/',
                              },
                            ],
                          },
                          {
                            text: 'Repair',
                            link: '/docs/bufstream/reference/cli/admin/repair/',
                            collapsed: true,
                            items: [
                              {
                                text: 'bufstream admin repair topics',
                                link: '/docs/bufstream/reference/cli/admin/repair/topics/',
                              },
                            ],
                          },
                        ],
                      },
                      {
                        text: 'Client',
                        link: '/docs/bufstream/reference/cli/client/',
                        collapsed: true,
                        items: [
                          {
                            text: 'bufstream client metadata',
                            link: '/docs/bufstream/reference/cli/client/metadata/',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    text: 'Bufstream configuration files',
                    link: '/docs/bufstream/reference/configuration/bufstream-yaml/',
                    collapsed: true,
                    items: [
                      {
                        text: 'Helm chart',
                        link: '/docs/bufstream/reference/configuration/helm-values/',
                      },
                    ],
                  },
                  {
                    text: 'Bufstream client ID options',
                    link: '/docs/bufstream/reference/configuration/client-id-options/',
                  },
                ],
              },
              { text: 'Release notes', link: '/docs/bufstream/release-notes/' },
            ],
          },
          {
            text: 'Protovalidate',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/docs/protovalidate/' },
              { text: 'Quickstart', link: '/docs/protovalidate/quickstart/' },
              {
                text: 'Using Protovalidate',
                collapsed: true,
                items: [
                  {
                    text: 'Adding Protovalidate',
                    link: '/docs/protovalidate/schemas/adding-protovalidate/',
                  },
                  {
                    text: 'Standard rules',
                    link: '/docs/protovalidate/schemas/standard-rules/',
                  },
                  {
                    text: 'Custom rules',
                    link: '/docs/protovalidate/schemas/custom-rules/',
                  },
                  {
                    text: 'Predefined rules',
                    link: '/docs/protovalidate/schemas/predefined-rules/',
                  },
                ],
              },
              {
                text: 'RPC quickstarts',
                collapsed: true,
                items: [
                  {
                    text: 'Connect and Go',
                    link: '/docs/protovalidate/quickstart/connect-go/',
                  },
                  {
                    text: 'gRPC and Go',
                    link: '/docs/protovalidate/quickstart/grpc-go/',
                  },
                  {
                    text: 'gRPC and Java',
                    link: '/docs/protovalidate/quickstart/grpc-java/',
                  },
                  {
                    text: 'gRPC and Python',
                    link: '/docs/protovalidate/quickstart/grpc-python/',
                  },
                ],
              },
              {
                text: 'Kafka quickstart',
                link: '/docs/protovalidate/quickstart/bufstream/',
              },
              { text: 'Advanced CEL topics', link: '/docs/protovalidate/cel/' },
              {
                text: 'Migrate from protoc-gen-validate',
                link: '/docs/migration-guides/migrate-from-protoc-gen-validate/',
              },
              {
                text: 'Further reading',
                link: '/docs/protovalidate/further-reading/',
              },
            ],
          },
          {
            text: 'Reference',
            collapsed: true,
            items: [
              {
                text: 'Buf CLI commands',
                link: '/docs/reference/cli/buf/',
                collapsed: true,
                items: [
                  {
                    text: 'buf breaking',
                    link: '/docs/reference/cli/buf/breaking/',
                  },
                  { text: 'buf build', link: '/docs/reference/cli/buf/build/' },
                  {
                    text: 'buf convert',
                    link: '/docs/reference/cli/buf/convert/',
                  },
                  { text: 'buf curl', link: '/docs/reference/cli/buf/curl/' },
                  {
                    text: 'buf export',
                    link: '/docs/reference/cli/buf/export/',
                  },
                  {
                    text: 'buf format',
                    link: '/docs/reference/cli/buf/format/',
                  },
                  {
                    text: 'buf generate',
                    link: '/docs/reference/cli/buf/generate/',
                  },
                  { text: 'buf lint', link: '/docs/reference/cli/buf/lint/' },
                  { text: 'buf push', link: '/docs/reference/cli/buf/push/' },
                  {
                    text: 'Beta',
                    link: '/docs/reference/cli/buf/beta/',
                    collapsed: true,
                    items: [
                      {
                        text: 'buf beta buf-plugin-v1',
                        link: '/docs/reference/cli/buf/beta/buf-plugin-v1/',
                      },
                      {
                        text: 'buf beta buf-plugin-v1beta1',
                        link: '/docs/reference/cli/buf/beta/buf-plugin-v1beta1/',
                      },
                      {
                        text: 'buf beta buf-plugin-v2',
                        link: '/docs/reference/cli/buf/beta/buf-plugin-v2/',
                      },
                      {
                        text: 'buf beta lsp',
                        link: '/docs/reference/cli/buf/beta/lsp/',
                      },
                      {
                        text: 'buf beta price',
                        link: '/docs/reference/cli/buf/beta/price/',
                      },
                      {
                        text: 'buf beta stats',
                        link: '/docs/reference/cli/buf/beta/stats/',
                      },
                      {
                        text: 'buf beta studio-agent',
                        link: '/docs/reference/cli/buf/beta/studio-agent/',
                      },
                      {
                        text: 'Registry',
                        link: '/docs/reference/cli/buf/beta/registry/',
                        collapsed: true,
                        items: [
                          {
                            text: 'Plugin',
                            link: '/docs/reference/cli/buf/beta/registry/plugin/',
                            collapsed: true,
                            items: [
                              {
                                text: 'buf beta registry plugin delete',
                                link: '/docs/reference/cli/buf/beta/registry/plugin/delete/',
                              },
                              {
                                text: 'buf beta registry plugin push',
                                link: '/docs/reference/cli/buf/beta/registry/plugin/push/',
                              },
                            ],
                          },
                          {
                            text: 'Webhook',
                            link: '/docs/reference/cli/buf/beta/registry/webhook/',
                            collapsed: true,
                            items: [
                              {
                                text: 'buf beta registry webhook create',
                                link: '/docs/reference/cli/buf/beta/registry/webhook/create/',
                              },
                              {
                                text: 'buf beta registry webhook delete',
                                link: '/docs/reference/cli/buf/beta/registry/webhook/delete/',
                              },
                              {
                                text: 'buf beta registry webhook list',
                                link: '/docs/reference/cli/buf/beta/registry/webhook/list/',
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    text: 'Config',
                    link: '/docs/reference/cli/buf/config/',
                    collapsed: true,
                    items: [
                      {
                        text: 'buf config init',
                        link: '/docs/reference/cli/buf/config/init/',
                      },
                      {
                        text: 'buf config ls-breaking-rules',
                        link: '/docs/reference/cli/buf/config/ls-breaking-rules/',
                      },
                      {
                        text: 'buf config ls-lint-rules',
                        link: '/docs/reference/cli/buf/config/ls-lint-rules/',
                      },
                      {
                        text: 'buf config ls-modules',
                        link: '/docs/reference/cli/buf/config/ls-modules/',
                      },
                      {
                        text: 'buf config migrate',
                        link: '/docs/reference/cli/buf/config/migrate/',
                      },
                    ],
                  },
                  {
                    text: 'Dep',
                    link: '/docs/reference/cli/buf/dep/',
                    collapsed: true,
                    items: [
                      {
                        text: 'buf dep graph',
                        link: '/docs/reference/cli/buf/dep/graph/',
                      },
                      {
                        text: 'buf dep prune',
                        link: '/docs/reference/cli/buf/dep/prune/',
                      },
                      {
                        text: 'buf dep update',
                        link: '/docs/reference/cli/buf/dep/update/',
                      },
                    ],
                  },
                  {
                    text: 'Plugin',
                    link: '/docs/reference/cli/buf/plugin/',
                    collapsed: true,
                    items: [
                      {
                        text: 'buf plugin prune',
                        link: '/docs/reference/cli/buf/plugin/prune/',
                      },
                      {
                        text: 'buf plugin push',
                        link: '/docs/reference/cli/buf/plugin/push/',
                      },
                      {
                        text: 'buf plugin update',
                        link: '/docs/reference/cli/buf/plugin/update/',
                      },
                    ],
                  },
                  {
                    text: 'Registry',
                    link: '/docs/reference/cli/buf/registry/',
                    collapsed: true,
                    items: [
                      {
                        text: 'buf registry cc',
                        link: '/docs/reference/cli/buf/registry/cc/',
                      },
                      {
                        text: 'buf registry login',
                        link: '/docs/reference/cli/buf/registry/login/',
                      },
                      {
                        text: 'buf registry logout',
                        link: '/docs/reference/cli/buf/registry/logout/',
                      },
                      {
                        text: 'buf registry whoami',
                        link: '/docs/reference/cli/buf/registry/whoami/',
                      },
                      {
                        text: 'Module',
                        link: '/docs/reference/cli/buf/registry/module/',
                        collapsed: true,
                        items: [
                          {
                            text: 'buf registry module create',
                            link: '/docs/reference/cli/buf/registry/module/create/',
                          },
                          {
                            text: 'buf registry module delete',
                            link: '/docs/reference/cli/buf/registry/module/delete/',
                          },
                          {
                            text: 'buf registry module deprecate',
                            link: '/docs/reference/cli/buf/registry/module/deprecate/',
                          },
                          {
                            text: 'buf registry module info',
                            link: '/docs/reference/cli/buf/registry/module/info/',
                          },
                          {
                            text: 'buf registry module undeprecate',
                            link: '/docs/reference/cli/buf/registry/module/undeprecate/',
                          },
                          {
                            text: 'Commit',
                            link: '/docs/reference/cli/buf/registry/module/commit/',
                            collapsed: true,
                            items: [
                              {
                                text: 'buf registry module commit add-label',
                                link: '/docs/reference/cli/buf/registry/module/commit/add-label/',
                              },
                              {
                                text: 'buf registry module commit info',
                                link: '/docs/reference/cli/buf/registry/module/commit/info/',
                              },
                              {
                                text: 'buf registry module commit list',
                                link: '/docs/reference/cli/buf/registry/module/commit/list/',
                              },
                              {
                                text: 'buf registry module commit resolve',
                                link: '/docs/reference/cli/buf/registry/module/commit/resolve/',
                              },
                            ],
                          },
                          {
                            text: 'Label',
                            link: '/docs/reference/cli/buf/registry/module/label/',
                            collapsed: true,
                            items: [
                              {
                                text: 'buf registry module label archive',
                                link: '/docs/reference/cli/buf/registry/module/label/archive/',
                              },
                              {
                                text: 'buf registry module label info',
                                link: '/docs/reference/cli/buf/registry/module/label/info/',
                              },
                              {
                                text: 'buf registry module label list',
                                link: '/docs/reference/cli/buf/registry/module/label/list/',
                              },
                              {
                                text: 'buf registry module label unarchive',
                                link: '/docs/reference/cli/buf/registry/module/label/unarchive/',
                              },
                            ],
                          },
                          {
                            text: 'Settings',
                            link: '/docs/reference/cli/buf/registry/module/settings/',
                            collapsed: true,
                            items: [
                              {
                                text: 'buf registry module settings update',
                                link: '/docs/reference/cli/buf/registry/module/settings/update/',
                              },
                            ],
                          },
                        ],
                      },
                      {
                        text: 'Organization',
                        link: '/docs/reference/cli/buf/registry/organization/',
                        collapsed: true,
                        items: [
                          {
                            text: 'buf registry organization create',
                            link: '/docs/reference/cli/buf/registry/organization/create/',
                          },
                          {
                            text: 'buf registry organization delete',
                            link: '/docs/reference/cli/buf/registry/organization/delete/',
                          },
                          {
                            text: 'buf registry organization info',
                            link: '/docs/reference/cli/buf/registry/organization/info/',
                          },
                          {
                            text: 'buf registry organization update',
                            link: '/docs/reference/cli/buf/registry/organization/update/',
                          },
                        ],
                      },
                      {
                        text: 'Plugin',
                        link: '/docs/reference/cli/buf/registry/plugin/',
                        collapsed: true,
                        items: [
                          {
                            text: 'buf registry plugin create',
                            link: '/docs/reference/cli/buf/registry/plugin/create/',
                          },
                          {
                            text: 'buf registry plugin delete',
                            link: '/docs/reference/cli/buf/registry/plugin/delete/',
                          },
                          {
                            text: 'buf registry plugin info',
                            link: '/docs/reference/cli/buf/registry/plugin/info/',
                          },
                          {
                            text: 'Commit',
                            link: '/docs/reference/cli/buf/registry/plugin/commit/',
                            collapsed: true,
                            items: [
                              {
                                text: 'buf registry plugin commit add-label',
                                link: '/docs/reference/cli/buf/registry/plugin/commit/add-label/',
                              },
                              {
                                text: 'buf registry plugin commit info',
                                link: '/docs/reference/cli/buf/registry/plugin/commit/info/',
                              },
                              {
                                text: 'buf registry plugin commit list',
                                link: '/docs/reference/cli/buf/registry/plugin/commit/list/',
                              },
                              {
                                text: 'buf registry plugin commit resolve',
                                link: '/docs/reference/cli/buf/registry/plugin/commit/resolve/',
                              },
                            ],
                          },
                          {
                            text: 'Label',
                            link: '/docs/reference/cli/buf/registry/plugin/label/',
                            collapsed: true,
                            items: [
                              {
                                text: 'buf registry plugin label archive',
                                link: '/docs/reference/cli/buf/registry/plugin/label/archive/',
                              },
                              {
                                text: 'buf registry plugin label info',
                                link: '/docs/reference/cli/buf/registry/plugin/label/info/',
                              },
                              {
                                text: 'buf registry plugin label list',
                                link: '/docs/reference/cli/buf/registry/plugin/label/list/',
                              },
                              {
                                text: 'buf registry plugin label unarchive',
                                link: '/docs/reference/cli/buf/registry/plugin/label/unarchive/',
                              },
                            ],
                          },
                          {
                            text: 'Settings',
                            link: '/docs/reference/cli/buf/registry/plugin/settings/',
                            collapsed: true,
                            items: [
                              {
                                text: 'buf registry plugin settings update',
                                link: '/docs/reference/cli/buf/registry/plugin/settings/update/',
                              },
                            ],
                          },
                        ],
                      },
                      {
                        text: 'Sdk',
                        link: '/docs/reference/cli/buf/registry/sdk/',
                        collapsed: true,
                        items: [
                          {
                            text: 'buf registry sdk version',
                            link: '/docs/reference/cli/buf/registry/sdk/version/',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                text: 'Buf CLI configuration files',
                collapsed: true,
                items: [
                  {
                    text: 'v2',
                    collapsed: true,
                    items: [
                      {
                        text: 'buf.yaml',
                        link: '/docs/configuration/v2/buf-yaml/',
                      },
                      {
                        text: 'buf.gen.yaml',
                        link: '/docs/configuration/v2/buf-gen-yaml/',
                      },
                      {
                        text: 'buf.lock',
                        link: '/docs/configuration/v2/buf-lock/',
                      },
                    ],
                  },
                  {
                    text: 'v1',
                    collapsed: true,
                    items: [
                      {
                        text: 'buf.yaml',
                        link: '/docs/configuration/v1/buf-yaml/',
                      },
                      {
                        text: 'buf.gen.yaml',
                        link: '/docs/configuration/v1/buf-gen-yaml/',
                      },
                      {
                        text: 'buf.lock',
                        link: '/docs/configuration/v1/buf-lock/',
                      },
                      {
                        text: 'buf.work.yaml',
                        link: '/docs/configuration/v1/buf-work-yaml/',
                      },
                      {
                        text: 'v1 workspace configuration',
                        link: '/docs/reference/workspaces/',
                      },
                    ],
                  },
                  {
                    text: 'v1beta',
                    collapsed: true,
                    items: [
                      {
                        text: 'buf.yaml',
                        link: '/docs/configuration/v1beta1/buf-yaml/',
                      },
                      {
                        text: 'buf.gen.yaml',
                        link: '/docs/configuration/v1beta1/buf-gen-yaml/',
                      },
                      {
                        text: 'buf.lock',
                        link: '/docs/configuration/v1beta1/buf-lock/',
                      },
                      {
                        text: 'buf.work.yaml',
                        link: '/docs/configuration/v1beta1/lint-rules/',
                      },
                    ],
                  },
                ],
              },
              { text: 'Buf CLI inputs', link: '/docs/reference/inputs/' },
              { text: 'Buf images', link: '/docs/reference/images/' },
              {
                text: 'Internal compiler',
                link: '/docs/reference/internal-compiler/',
              },
              {
                text: 'Protovalidate',
                collapsed: true,
                items: [
                  {
                    text: 'Violations',
                    link: '/docs/reference/protovalidate/violations/',
                  },
                  {
                    text: 'Standard rules',
                    collapsed: true,
                    items: [
                      {
                        text: 'Any',
                        link: '/docs/reference/protovalidate/rules/any_rules/',
                      },
                      {
                        text: 'Bool',
                        link: '/docs/reference/protovalidate/rules/bool_rules/',
                      },
                      {
                        text: 'Bytes',
                        link: '/docs/reference/protovalidate/rules/bytes_rules/',
                      },
                      {
                        text: 'Double',
                        link: '/docs/reference/protovalidate/rules/double_rules/',
                      },
                      {
                        text: 'Duration',
                        link: '/docs/reference/protovalidate/rules/duration_rules/',
                      },
                      {
                        text: 'Enum',
                        link: '/docs/reference/protovalidate/rules/enum_rules/',
                      },
                      {
                        text: 'Fixed32',
                        link: '/docs/reference/protovalidate/rules/fixed32_rules/',
                      },
                      {
                        text: 'Fixed64',
                        link: '/docs/reference/protovalidate/rules/fixed64_rules/',
                      },
                      {
                        text: 'Float',
                        link: '/docs/reference/protovalidate/rules/float_rules/',
                      },
                      {
                        text: 'Int32',
                        link: '/docs/reference/protovalidate/rules/int32_rules/',
                      },
                      {
                        text: 'Int64',
                        link: '/docs/reference/protovalidate/rules/int64_rules/',
                      },
                      {
                        text: 'Map',
                        link: '/docs/reference/protovalidate/rules/map_rules/',
                      },
                      {
                        text: 'Message',
                        link: '/docs/reference/protovalidate/rules/message_rules/',
                      },
                      {
                        text: 'Oneof',
                        link: '/docs/reference/protovalidate/rules/oneof_rules/',
                      },
                      {
                        text: 'Repeated',
                        link: '/docs/reference/protovalidate/rules/repeated_rules/',
                      },
                      {
                        text: 'Sfixed32',
                        link: '/docs/reference/protovalidate/rules/sfixed32_rules/',
                      },
                      {
                        text: 'Sfixed64',
                        link: '/docs/reference/protovalidate/rules/sfixed64_rules/',
                      },
                      {
                        text: 'Sint32',
                        link: '/docs/reference/protovalidate/rules/sint32_rules/',
                      },
                      {
                        text: 'Sint64',
                        link: '/docs/reference/protovalidate/rules/sint64_rules/',
                      },
                      {
                        text: 'String',
                        link: '/docs/reference/protovalidate/rules/string_rules/',
                      },
                      {
                        text: 'Timestamp',
                        link: '/docs/reference/protovalidate/rules/timestamp_rules/',
                      },
                      {
                        text: 'Uint32',
                        link: '/docs/reference/protovalidate/rules/uint32_rules/',
                      },
                      {
                        text: 'Uint64',
                        link: '/docs/reference/protovalidate/rules/uint64_rules/',
                      },
                    ],
                  },
                  {
                    text: 'CEL extensions',
                    link: '/docs/reference/protovalidate/cel_extensions/',
                  },
                  {
                    text: 'API definition',
                    link: '/docs/https://bufbuild/bufbuild/protovalidate/docs/main:buf.validate',
                  },
                ],
              },
            ],
          },
          {
            text: 'Protobuf guide',
            collapsed: true,
            items: [
              {
                text: 'Style guide',
                link: '/docs/best-practices/style-guide/',
              },
              {
                text: 'Files and packages',
                link: '/docs/reference/protobuf-files-and-packages/',
              },
              { text: 'Descriptors', link: '/docs/reference/descriptors/' },
            ],
          },
          {
            text: 'Migration guides',
            collapsed: true,
            items: [
              {
                text: 'Migrate to v2 config files',
                link: '/docs/migration-guides/migrate-v2-config-files/',
              },
              {
                text: 'Migrating from individual Buf GitHub Actions',
                link: '/docs/migration-guides/migrate-to-buf-action/',
              },
              {
                text: 'Migrate from remote generation alpha',
                link: '/docs/migration-guides/migrate-remote-generation-alpha/',
              },
              {
                text: 'Migrate from Prototool',
                link: '/docs/migration-guides/migrate-from-prototool/',
              },
              {
                text: 'Migrate from Protolock',
                link: '/docs/migration-guides/migrate-from-protolock/',
              },
              {
                text: 'Migrate from protoc',
                link: '/docs/migration-guides/migrate-from-protoc/',
              },
              {
                text: 'Migrate from protoc-gen-validate',
                link: '/docs/migration-guides/migrate-from-protoc-gen-validate/',
              },
            ],
          },
          { text: 'Contact us', link: '/docs/contact/' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/bufbuild/buf' }],

    search: {
      provider: 'local',
    },
  },

  head: [
    [
      'script',
      {},
      `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
      ym(100678075, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true
      });`,
    ],
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.png',
        type: 'image/png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
        sizes: '180x180',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon-32x32.png',
        type: 'image/png',
        sizes: '32x32',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon-16x16.png',
        type: 'image/png',
        sizes: '16x16',
      },
    ],
    [
      'link',
      {
        rel: 'manifest',
        href: '/site.webmanifest',
      },
    ],
  ],

  rewrites: {
    '/docs/tutorials/getting-started-with-buf-cli/': '/docs/cli/quickstart/',
  },
});
