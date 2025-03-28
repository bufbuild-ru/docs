# Federation

DEPRECATEDWe recommend using the default [managed modules](../managed-modules/) feature, which synchronizes the community modules hosted in the public BSR to your private BSR instance.

Federation allows Buf modules to depend on modules hosted on different BSR instances. For example, a module on `buf.example.com` may depend on a public BSR module like `buf.build/googleapis/googleapis`. Although hosted on a different remote, federated dependencies work the same as regular dependencies.

::: tip NoteUse of Federation creates a dependency between your single-tenant instance and `buf.build`. For this reason federation is turned **off** by default for new customers. If you wish to use this feature, please reach out to a Buf representative.

:::

## Limitations

Depending on a module from `buf.build` doesn't automatically mirror this module into your BSR.Federation is currently only supported between enterprise instances (for instance `buf.example.com`) and public `buf.build` modules. See the table below for an overview:

| Module                    | Dependency                                  | Supported                                               |
| ------------------------- | ------------------------------------------- | ------------------------------------------------------- |
| `buf.example.com/foo/bar` | `buf.build/user/public-repository`          | Yes                                                     |
| `buf.example.com/foo/bar` | `buf.build/user/private-repository`         | No (dependencies on private modules not supported)      |
| `buf.example.com/foo/bar` | `different-buf.example.org/user/repository` | No (dependencies between enterprise BSRs not supported) |
| `buf.build/foo/bar`       | `buf.example.com/user/public-repository`    | No (federation is a enterprise-only feature)            |

## Migration

The easiest way to move away from federated modules is to depend on a local copy. The BSR automatically synchronizes a list of well-known community modules using the [managed modules](../managed-modules/) feature.

### Manual upload

If the module that you want to sync can't be added to the managed modules repository, then you can manually upload a copy to your instance:

1.  Export the module from [buf.build](https://buf.build) to a local directory.
2.  Initialize a new local module under the `buf.example.com` private instance.
3.  Create the organization and repository.
4.  Push the module.

::: info Example sequence

```console
$ buf export buf.build/acme/petapis --output petapis
$ cd petapis
$ buf config init buf.example.com/acme/petapis
$ buf beta registry organization create buf.example.com/acme
$ buf beta registry repository create buf.example.com/acme/petapis --visibility public
$ buf push
```

:::
