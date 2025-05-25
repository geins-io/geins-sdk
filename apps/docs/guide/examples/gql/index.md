---
title: GraphQL Queries and Mutations
description: A collection of GraphQL queries and mutations used in the Geins SDK examples.
tags:
  - sdk
  - graphql
  - queries
  - mutations
  - fragments
---

# Queries, Mutations, Fragments

The following queries and mutations are used in various examples throughout the documentation. Try them out in with the [`graphql client`](../../../packages/core/graphql-client) in [`@geins/core`](../../../packages/core/) package or just in the [Geins GraphQL Playground](https://merchantapi.geins.io/ui/playground) or your own GraphQL client.

## Fragments

### SKU

```graphql
fragment Sku on SkuType {
  skuId
  gtin
  name
  productId
  stock {
    ...Stock
  }
}
```

### List Product Item

```graphql
fragment ListProduct on ProductType {
  brand {
    name
    alias
  }
  name
  productId
  articleNumber
  alias
  canonicalUrl
  unitPrice {
    ...Price
  }
  productImages {
    fileName
  }
  primaryCategory {
    name
    alias
  }
  totalStock {
    ...Stock
  }
}
```

### Product Variant

```graphql
fragment Variant on VariantType {
  alias
  level
  attributes {
    key
    value
  }
  label
  value
  dimension
  skuId
  productId
  stock {
    ...Stock
  }
  primaryImage
}
```

### Stock

```graphql
fragment Stock on StockType {
  inStock
  oversellable
  totalStock
  static
  incoming
}
```

### Price

```graphql
fragment Price on PriceType {
  isDiscounted
  regularPriceIncVatFormatted
  sellingPriceIncVatFormatted
  regularPriceExVatFormatted
  sellingPriceExVatFormatted
  sellingPriceIncVat
  sellingPriceExVat
  regularPriceIncVat
  regularPriceExVat
  vat
  discountPercentage
}
```

### Campaign

```graphql
fragment Campaign on CampaignRuleType {
  name
  hideTitle
}
```

### Meta Data

```graphql
fragment Meta on MetadataType {
  title
  description
}
```

### Cart

```graphql
fragment Cart on CartType {
  id
  promoCode
  appliedCampaigns {
    ...Campaign
  }
  items {
    id
    campaign {
      appliedCampaigns {
        ...Campaign
      }
      prices {
        price {
          ...Price
        }
        quantity
      }
    }
    unitPrice {
      ...Price
    }
    product {
      productId
      articleNumber
      brand {
        name
      }
      name
      productImages {
        fileName
      }
      alias
      canonicalUrl
      primaryCategory {
        name
      }
      skus {
        skuId
        name
        stock {
          ...Stock
        }
      }
      unitPrice {
        ...Price
      }
    }
    quantity
    skuId
    totalPrice {
      ...Price
    }
  }
  summary {
    fixedAmountDiscountIncVat
    fixedAmountDiscountExVat
    balance {
      pending
      pendingFormatted
      totalSellingPriceExBalanceExVat
      totalSellingPriceExBalanceIncVat
      totalSellingPriceExBalanceIncVatFormatted
    }
    subTotal {
      regularPriceIncVatFormatted
      regularPriceExVatFormatted
      sellingPriceIncVatFormatted
      sellingPriceExVatFormatted
      sellingPriceExVat
      sellingPriceIncVat
      vat
    }
    shipping {
      amountLeftToFreeShipping
      amountLeftToFreeShippingFormatted
      feeExVatFormatted
      feeIncVatFormatted
      feeIncVat
      feeExVat
      isDefault
    }
    total {
      isDiscounted
      sellingPriceIncVatFormatted
      sellingPriceExVatFormatted
      sellingPriceIncVat
      sellingPriceExVat
      discountIncVatFormatted
      discountExVatFormatted
      discountExVat
      discountIncVat
      vatFormatted
      vat
    }
  }
}
```

## Queries

### Cart

```graphql
query getCart($id: String, $channelId: String, $languageId: String, $marketId: String) {
  getCart(id: $id, channelId: $channelId, languageId: $languageId, marketId: $marketId) {
    ...Cart
  }
}
```

### Product

```graphql
query product($alias: String!, $channelId: String, $languageId: String, $marketId: String) {
  product(alias: $alias, channelId: $channelId, languageId: $languageId, marketId: $marketId) {
    productId
    alias
    articleNumber
    canonicalUrl
    name
    meta {
      ...Meta
    }
    brand {
      name
      alias
      canonicalUrl
    }
    productImages {
      fileName
    }
    primaryCategory {
      name
      alias
      canonicalUrl
    }
    categories {
      name
      alias
    }
    unitPrice {
      ...Price
    }
    texts {
      text1
      text2
      text3
    }
    parameterGroups {
      name
      parameterGroupId
      parameters {
        name
        value
        show
        identifier
      }
    }
    skus {
      ...Sku
    }
    totalStock {
      ...Stock
    }
    variantDimensions {
      dimension
      value
      level
      label
    }
    variantGroup {
      variants {
        variants {
          variants {
            ...Variant
          }
          ...Variant
        }
        ...Variant
      }
    }
    discountCampaigns {
      ...Campaign
    }
    rating {
      score
      voteCount
    }
  }
}
```

### Product Related Products

```graphql
query relatedProducts($alias: String!, $channelId: String, $languageId: String, $marketId: String) {
  relatedProducts(alias: $alias, channelId: $channelId, languageId: $languageId, marketId: $marketId) {
    alias
    name
    canonicalUrl
    brand {
      name
    }
    unitPrice {
      ...Price
    }
    relationType
    productImages {
      fileName
    }
    primaryImage
    primaryCategory {
      name
    }
    skus {
      ...Sku
    }
  }
}
```

## Mutations

### Add to Cart

```graphql
mutation addToCart(
  $id: String!
  $item: CartItemInputType!
  $channelId: String
  $languageId: String
  $marketId: String
) {
  addToCart(id: $id, item: $item, channelId: $channelId, languageId: $languageId, marketId: $marketId) {
    ...Cart
  }
}
```

### Update Cart

```graphql
mutation updateCartItem(
  $id: String!
  $item: CartItemInputType!
  $channelId: String
  $languageId: String
  $marketId: String
) {
  updateCartItem(id: $id, item: $item, channelId: $channelId, languageId: $languageId, marketId: $marketId) {
    ...Cart
  }
}
```

### Checkout

```graphql
mutation createOrUpdateCheckout(
  $cartId: String!
  $checkout: CheckoutInputType
  $channelId: String
  $languageId: String
  $marketId: String
) {
  createOrUpdateCheckout(
    cartId: $cartId
    checkout: $checkout
    channelId: $channelId
    languageId: $languageId
    marketId: $marketId
  ) {
    paymentOptions {
      paymentData
    }
  }
}
```
