## Geins Merchant API Order Flow

This guide provides an example of how to work with carts and checkout in the Merchant API.

> All examples below use the default channel, market, and language. Use the `channelId`, `marketId`, or `languageId` parameters to use a different setup.

### Create a Cart

To create a new cart, use the [getCart](https://docs.geins.io/docs/api/merchant/queries/get-cart) query with an empty cart ID:

```graphql
{
    getCart(id: "")
    {
        id
    }
}
```

**Example Response:**
```json
{
    "data": {
        "getCart": {
            "id": "a3439b63-dffa-4007-a181-1484e0115ac3"
        }
    },
    "extensions": {}
}
```

### Add Items to the Cart

To add items to the cart, use the [addToCart](https://docs.geins.io/docs/api/merchant/mutations/add-to-cart) mutation.

**Example:**
```graphql
mutation {
    addToCart(id: "a3439b63-dffa-4007-a181-1484e0115ac3", item: { skuId: 5155, quantity: 1 })
    {
        items {
            skuId
            totalPrice {
                sellingPriceIncVat
            }
            product {
                name
            }
        }
    }
}
```

### Create the Checkout

To create a new checkout session, use the [createOrUpdateCheckout](https://docs.geins.io/docs/api/merchant/mutations/create-or-update-checkout) mutation. Use the same mutation to update an existing checkout session.

**Example:**
```graphql
mutation createOrUpdateCheckout {
    createOrUpdateCheckout(
        cartId: "a3439b63-dffa-4007-a181-1484e0115ac3"
        checkout: {
            billingAddress: {
                zip: "12067"
            }
        }
    ) 
    {
        cart {
            id
            items {
                unitPrice {
                    ...Price
                }
                product {
                    productId
                    name
                }
                quantity
                skuId
                totalPrice {
                    ...Price
                }
            }
            summary {
                subTotal {
                    sellingPriceIncVat
                    vat
                }
                shipping {
                    feeIncVat
                    isDefault
                }
                total {
                    sellingPriceIncVat
                    vat
                }
            }
        }
        email
        identityNumber
        billingAddress {
            ...Address
        }
        shippingAddress {
            ...Address
        }
        shippingData
        shippingOptions {
            id
            displayName
            isSelected
            feeIncVat
        }
        paymentOptions {
            id
            displayName
            paymentData
            isSelected
        }
    }
}

fragment Price on PriceType {
    sellingPriceIncVat
    vat
}

fragment Address on AddressType {
    firstName
    lastName
    careOf
    addressLine1
    addressLine2
    zip
    city
    country
    entryCode
    mobile
    company
}
```

> The `createOrUpdateCheckout` mutation will return available shipping options when `billingAddress.zip` is set and payment options when a shipping option is selected. By default, the first available shipping option is selected.

#### Working with External Shipping or Payment Checkouts

Geins supports a simple list of shipping options and an integration with nShift Checkout. However, it is also possible to integrate with other shipping or payment checkouts/providers.

When working with external shipping checkouts, use the `externalShippingFee` field in the [checkout input parameter](https://docs.geins.io/docs/api/merchant/inputs/checkout-input-type) to set the selected shipping fee. It is also possible to set the shipping fee by calling the [setCartShippingFee](https://docs.geins.io/docs/api/merchant/mutations/set-cart-shipping-fee) mutation.

To store other custom data, such as external identifiers, use the `merchantData` field in the checkout input parameter or call the [setCartMerchantData](https://docs.geins.io/docs/api/merchant/mutations/set-cart-merchant-data) mutation. This field is also accessible from our management API and merchant center.

#### External Shipping

Geins offers an integration with the nShift external shipping checkout. Even when this mode is used, individual shipping options are returned in the `shippingOptions` field. The `shippingData` field contains the HTML snippet needed to render the checkout.

#### Payment

Geins offers the following payment checkouts:
1. Geins Checkout (aggregates a wide variety of payment providers)
2. Klarna Checkout
3. Svea Checkout
4. Walley Checkout
5. Avarda Checkout

Custom payment options can also be added. These integrations are typically made in the client application.

To render the checkouts mentioned above, use the `paymentData` field on `shippingOptions`.
