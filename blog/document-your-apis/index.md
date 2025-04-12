---
layout: home

hero:
  name: "Document Your APIs and Increase Your Developer Productivity"
  tagline: "August 19, 2021"
---

Documentation is a fantastic developer productivity tool that can be applied by all levels of software engineers during the development process.

As software engineers, we need to read a lot of existing code each day - some written by our colleagues and some by our past selves. In both cases, context can get lost over time, and one of the ways we mitigate that loss is through documentation.

Documentation in code is provided at three levels:

- **Type definition**: documenting specific types and functions provides clear boundaries for what the code should cover. Many languages provide built-in support for this, such as docstrings.
- **In-line explanations**: one-off explanations for small portions of the code that may be initially non-intuitive. This is also useful for marking code that may change often and/or may have a broad audience.
- **Package/module/library**: a high level overview of the package or library. The target audience for this is usually a consumer or user of the code. It should provide clear use-cases and potentially an example for integrating with the functionality to get users started quickly.

Good documentation makes a major impact. While documentation is in no way a replacement for other good software development practices, such as clarity in naming and well-defined, readable blocks of logic, documentation can be used to surface nuances and architectural decisions that are often lost over time. This allows engineers, especially those new to a library or code base, to gather the majority of the context without scheduling a lot of meetings or spending excessive time discussing the code over chat.

These same documentation principles should also be applied to your APIs. The path to good documentation often goes hand-in-hand with good coding practices, so when talking about one, it often leads to the other. In this blog post, we'll walk through some recommendations on documenting your Protocol Buffers API definitions and ways that the BSR's documentation features can help.

## Type Definitions and In-line Comments

When designing APIs, the primary things we usually consider are who our users are and what are their expectations. Defining your Protocol Buffers types with these expectations in mind, it is useful to document each definition's purpose:

**Messages**, outside of requests and responses, should represent a single unit within the realm of this API, (such as a `User` message), and the documentation should clearly explain this unit in the context of the API. Field-level comments round out the documentation.

```protobuf
// User contains all the information about a user at Acme Co.
message User {
  // id is the unique id for the user. This maps to an incremented database key.
  uint32 id = 1;
  // username is the username. This is defined by the user and must be a unique string.
  string username = 2;
  // created_on is the date the user was created.
  google.type.Datetime created_on = 3;
  // UserAccess is the level of access this user has to the database.
  UserAccess user_access = 4;
}
```

**Enums** provide a structure that encapsulates a predefined set of values, and when used as a field, can only be set to **one of** the values at a given time. The example below shows an enum for `UserAccess`, which can only be one of these types of access: `ADMIN`, `READ_WRITE`, `READ`, and `UNSPECIFIED` for situations where user access has not yet been provided. The documentation for enums should clearly cover each of the values and the surface area of the enum.

```protobuf
// UserAccess captures the level of access a user has to the Acme Co. database.
enum UserAccess {
  // User access has not been specified.
  USER_ACCESS_UNSPECIFIED = 0;
  // User has admin access.
  USER_ACCESS_ADMIN = 1;
  // User has the ability to read from and write to the database.
  USER_ACCESS_READ_WRITE = 2;
  // User has the ability to read from the database.
  USER_ACCESS_READ = 3;
}
```

`‍   `

**Services** provide an interface that represents an **RPC** system and will generate service interface code and stubs in a chosen language. Each RPC should be a single, isolated piece of functionality. The documentation for RPCs should state the expected inputs and outputs of the RPC and what changes occur to the system, if any, when run.

```protobuf
// UserService is the service used to interact with users at Acme Co.
service UserService {
  // GetUserById returns the `User` for a given id.
  rpc GetUserById(GetUserByIdRequest) returns (GetUserByIdResponse);
  // ListUsers returns all the users at Acme Co. in alphabetical order based on username.
  rpc ListUsers(ListUsersRequest) returns (ListUsersResponse);
  // AddUser adds a new user to Acme Co. with the given username and access level.
  rpc AddUser(AddUserRequest) returns (AddUserResponse);
  // ChangeUserAccess changes the access level for a given user to the given access level.
  rpc ChangeUserAccess(ChangeUserAccessRequest) returns (ChangeUserAccessResponse);
}
```

`‍   `

All leading comments for type definitions are published as documentation. There are also links between imported types across packages and repositories so engineers can easily review type definitions and get the full picture of a given package.

## Package-Level Documentation

A package usually encapsulates all the Protocol Buffers definitions that pertain to a broader domain. Packages are can be imported and used by other engineers, so an explanation of the boundaries and context is important.

When you add leading comments to **one of** the `package` declaration tags, the comments will be published as the package-level documentation. If multiple `package` tags have leading comments, the generated documentation will use the leading comments from the first file in the package, based on alphabetical order.

```protobuf
syntax = "proto3";

// Package acme.v1.user defines a set of APIs for managing users at Acme Co.
package acme.v1.user;
```

`‍   `

## Module-Level Documentation

Lastly, you can define documentation at the module-level. You can do this by adding a `buf.md` file to your module source code. This will appear at the top of the `Docs` tab of your repository and can provide a clear overview of the repository.

```protobuf
# Acme Co. Proto Module

This is the full set of proto files for the Acme Co. APIs.
```

**For examples of API documentation, visit our managed third-party modules**:

- [googleapis/googleapis](https://buf.build/googleapis/googleapis)
- [envoyproxy/protoc-gen-validate](https://buf.build/envoyproxy/protoc-gen-validate)
- [gogo/protobuf](https://buf.build/gogo/protobuf)

‍
