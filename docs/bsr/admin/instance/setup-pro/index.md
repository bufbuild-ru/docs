# Pro setup

This feature is only available on the Pro plan.

This page describes the basic setup for a private Pro instance of the Buf Schema Registry (BSR).

## DNS setup

No additional DNS setup is required. Your BSR instance is hosted at a custom domain assigned by Buf that takes the form `NAME.buf.dev`, where `NAME` is the name of your BSR organization. You should reference this name instead of the public BSR instance (`buf.build`) when you run commands, create modules, or use modules as dependencies.Your private BSR instance is reachable from the public internet and is protected by SSO and CLI tokens.

## Assign administrative users

Your private BSR instance provides special privileges for administrator accounts to configure and manage various aspects of the instance. At least one user needs to be promoted to registry admin—see [Provisioning admin users](../user-lifecycle/#admin-users) for instructions.

## Identity provider (IdP) setup

By default, your BSR instance uses the public BSR as the IdP, but you should set up your BSR instance to use your SSO as the IdP instead. Follow the setup instructions for your provider, and read the [user lifecycle](../user-lifecycle/) page to understand how Buf provisions users in the BSR. We recommend that users in your organization sign up with their organization email addresses, so that when you switch to SSO their accounts merge automatically.
