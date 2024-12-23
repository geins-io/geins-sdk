# Cart

## Overview

The `CartService` manages all operations related to the shopping cart in the Geins SDK. It provides methods for creating, retrieving, modifying, and finalizing carts, as well as managing cart items, merchant data, promotions, and shipping information.

## Cart

The cart represents the collection of items selected by a user along with metadata like applied campaigns, promotion codes, and shipping details.

## Methods

### Create

Creates a new cart instance. This method initializes a cart and returns its identifier.

### Get

Retrieves an existing cart using its unique ID. This includes all items, summaries, and metadata associated with the cart.

### Refresh

Refreshes the cart to ensure all calculations (e.g., pricing, promotions) are up-to-date based on current conditions.

### Clear

Clears all items and metadata from the cart, resetting it to an empty state.

### Complete

Finalizes the cart, marking it as ready for checkout.

## Items

### Messages

Retrieves any system or user messages associated with the cart, such as errors or promotional notes.

### Packages Grouped Items

Handles grouping of cart items into packages, often used for shipping or promotional purposes.

### Manage Cart Items

#### Add Item to Cart

Adds a new item to the cart. The method takes details like product ID, quantity, and optional attributes.

#### Update Item in Cart

Updates the properties of an existing item in the cart, such as quantity or custom attributes.

#### Remove Item from Cart

Removes a specified item from the cart by its unique identifier.

## Merchant Data

Manages merchant-specific data associated with the cart, enabling custom logic or additional metadata for the merchant.

## Applied Campaigns

Lists and manages marketing campaigns applied to the cart. This could include discounts, free shipping offers, or bundle promotions.

## Promotion Code

### Apply

Applies a promotion code to the cart, adjusting prices and discounts accordingly.

### Remove

Removes an existing promotion code from the cart, recalculating prices and discounts.

## Shipping

### Shipping Fees

Calculates and updates shipping fees based on the cart's items, destination, and shipping method.

## Context

### Server

Handles server-side operations for the cart, ensuring security and efficiency during interactions with the backend.

### Client

Manages client-side aspects of the cart, such as caching and local updates before syncing with the server.
