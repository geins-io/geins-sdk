# @geins/core

## Introduction

## Quick Start

# Using the GraphQLClient from GeinsCore

The GeinsCore class is the main entry point of the Geins SDK, providing essential functionalities to interact with the Geins API. One of the powerful features it exposes is the GraphQLClient, accessible via the graphql property. The GraphQLClient allows you to execute custom GraphQL queries and mutations, giving you the flexibility to fetch and manipulate data as needed.

This article will guide you through the process of using the GraphQLClient provided by GeinsCore, including examples of running queries and mutations. We'll also demonstrate how to use the TypeScript types exported by the @geins/types package to ensure type safety in your applications.

## Overview

- `GeinsCore`: The central class of the Geins SDK, used to configure and access various services.
- `GraphQLClient`: A class exposed through GeinsCore that allows you to execute custom GraphQL queries and mutations against the Geins API.
- `gql`: A function exposed through @geins/core used to parse GraphQL queries and mutations.
- `@geins/types`: A package that exports TypeScript types generated from the Geins GraphQL schema, providing type definitions for the API.
  By using the `GraphQLClient` and types from `@geins/types`, you can interact with the Geins API in a flexible and type-safe manner, leveraging the power of GraphQL and TypeScript.

## Accessing the GraphQLClient

Once you have an instance of GeinsCore (refer to the [initialization guide](/core)), you can access the `GraphQLClient` through the graphql property.

```typescript
const graphqlClient = geinsCore.graphql;
```

The `GraphQLClient` provides two primary methods:

- `runQuery<TData, TVariables>(query, variables?, options?)`
- `runMutation<TData, TVariables>(mutation, variables?, options?)`

## Using TypeScript Types from @geins/types

The `@geins/types` package exports TypeScript interfaces and types generated from the Geins GraphQL schema. These types correspond to the data structures returned by the API and can be used to ensure type safety in your application.

### Installation

Make sure to install the `@geins/types` package in your project, refer to the [installation guide](/types).

### Importing Types

You can import the necessary types directly from `@geins/types`:

```typescript
import {
  GeinsProductTypeType,
  GeinsProductsResultTypeType,
} from '@geins/types';
```

## Running GraphQL Queries

### Method Signature

```typescript
runQuery<TData, TVariables>(
  query: DocumentNode,
  variables?: TVariables,
  options?: {
    fetchPolicy?: FetchPolicy;
    [key: string]: any;
  }
): Promise<TData | null>;

```

- `TData`: The expected shape of the response data.
- `TVariables`: The shape of the variables object for the query.
- `query`: The GraphQL query, written using gql.
- `variables`: An optional object containing variables for the query.
- `options`: Optional settings, such as fetchPolicy.

## Quick Start

## User token

## API Reference

## Examples
