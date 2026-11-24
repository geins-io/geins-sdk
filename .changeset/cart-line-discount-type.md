---
'@geins/types': minor
'@geins/oms': minor
---

Read each cart line's discount type, and add `PRICE_LIST` to the discount types.

The cart fragment now selects `product.discountType`, so every read that returns a cart (cart,
checkout, order) has it, and `CartItemProductType` gets it as an optional `GeinsDiscountType`. It
is `undefined` where the API answers none. `GeinsDiscountType` gains `PriceListType`
(`PRICE_LIST`), which the Merchant API returns for a price from a customer price list that is not
enforced.
