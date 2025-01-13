# Promotion Code

Promotion codes are a powerful tool for incentivizing customers to make purchases. This is how you can apply and remove promotion codes from the cart.

## Apply

Applies a promotion code to the cart, adjusting prices and discounts accordingly.

```typescript
const result = await geinsOMS.cart.promotions.apply('PROMO_CODE');
if(result === true){
    console.log("Promotion code applied successfully");
}
```

## Remove

Removes an existing promotion code from the cart, recalculating prices and discounts.

```typescript
const result = await geinsOMS.cart.promotions.remove();
if(result === true){
    console.log("Promotion code removed successfully");
}
```

