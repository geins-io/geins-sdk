# Geins Checkout Token

## Generate a token here

Follow these steps to generate a token for the checkout right now:

## 1. Set up your Geins Settings

<GeinsToggle margin-top="20px">
    <template #trigger>
        <GeinsStatus />
    </template>
    <GeinsSettingsForm />
</GeinsToggle>

## 2. Create a Cart

<GeinsToggle margin-top="20px">
    <template #trigger>
        <GeinsStatus for="geins-cart" name="Geins cart" />
    </template>
    <GeinsCartForm />
</GeinsToggle>

## 3. Generate a checkout token

<GeinsCheckoutTokenForm />
