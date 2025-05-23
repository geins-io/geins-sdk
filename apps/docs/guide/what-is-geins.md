---
title: What is Geins?
description: What is Geins?
tags:
  - sdk
  - geins
  - guide
  
---

# What is Geins?

As a developer, you know the frustration of working with clunky e-commerce platforms that limit your creativity. You deserve tools that empower you to build amazing digital experiences.

Geins is your ally in this mission. Our hybrid platform gives you the flexibility to create truly custom solutions, while also providing a stable foundation to build upon. Say goodbye to technical constraints and hello to a platform that unleashes your full potential.

<div class="tip custom-block" style="padding-top: 8px">

Just want to get to developing? Skip to the [Quickstart](./quickstart).

</div>

## Core Features

- **Modular Design**: Geins offers a suite of modular packages, each addressing specific needs, from core platform interactions to customer management and content delivery.
- **Comprehensive SDK**: The SDK includes packages for content management (CMS), customer relationship management (CRM), product information management (PIM), and core functionality, all designed to work together.
- **Developer-Friendly**: With TypeScript support, detailed documentation, and support for Node.js and browser environments, Geins focuses on providing an exceptional developer experience.

## Available Packages

The Geins SDK is divided into multiple packages, each serving a unique purpose:

### @geins/core

This is the foundational package that enables interaction with the Geins API. All other packages rely on `@geins/core` for API communications, configurations, and event handling.

### @geins/cms

The CMS package allows developers to manage and render content such as pages, menus, and widgets dynamically. This is essential for content-rich applications needing flexibility and ease of content updates.

### @geins/crm

This package focuses on customer management, providing tools for handling authentication, registration, user profiles, and transaction histories. It’s vital for applications where user interaction and customer data management are primary concerns.

### @geins/pim <Badge type="info" text="TBA" />

The PIM (Product Information Management) package is designed for managing product data, including product listings, details, and search functionality. This is especially useful for e-commerce sites requiring complex product management and search capabilities.

### @geins/search <Badge type="info" text="TBA" />

The Search package provides tools for implementing search functionality within your application. It includes features like faceted search, autocomplete, and search result rendering, making it easy to integrate powerful search capabilities.

### @geins/oms <Badge type="info" text="TBA" />

Cart and order management are handled by the OMS (Order Management System) package. It provides tools for managing shopping carts, processing orders, and handling order fulfillment, making it essential for e-commerce applications.

### @geins/types

All TypeScript types used across the Geins SDK are housed in this package. It provides the essential type definitions that ensure consistency and type safety across the various modules.

## How Geins Works

Geins operates as a fully integrated ecosystem of packages that communicate through the `@geins/core` module. By instantiating `GeinsCore`, developers can access functionality across CMS, CRM, and PIM modules without complex setup. This architecture allows each module to operate independently or work together seamlessly, depending on your application’s requirements.

## Getting Started

To start using Geins, begin by installing `@geins/core`, along with any other packages that meet your specific needs.

```sh
# Example installation with npm
npm install @geins/core @geins/cms @geins/crm @geins/pim @geins/types
```

Once installed, initialize `GeinsCore` and other modules within your application:

```typescript
import { GeinsCore } from '@geins/core';
import { GeinsCMS } from '@geins/cms';
import { GeinsCRM } from '@geins/crm';

const geinsCore = new GeinsCore({
  apiKey: 'your-api-key',
  accountName: 'your-account-name',
  channel: 'your-channel-id',
  locale: 'your-locale',
  market: 'your-market',
});

const geinsCMS = new GeinsCMS(geinsCore);
const geinsCRM = new GeinsCRM(geinsCore);
```

With `GeinsCore` and other packages initialized, you can start making API calls, managing content, and interacting with customer data.

## Why Choose Geins?

Geins offers a flexible, scalable solution for e-commerce, making it ideal for businesses of all sizes. With a developer-focused SDK, comprehensive modules, and robust documentation, Geins simplifies the process of building and managing a modern e-commerce platform.

For more detailed information on each package, refer to the specific documentation sections.
