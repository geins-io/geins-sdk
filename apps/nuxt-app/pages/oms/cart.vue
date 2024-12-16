<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useNuxtApp } from '#app';
import { ref, onMounted } from 'vue';
import type { GeinsSettings } from '@geins/types';
import { logWrite, GeinsCore } from '@geins/core';
import { GeinsOMS } from '@geins/oms';
const { $currentChannel } = useNuxtApp();

const route = useRoute();
const cartIdFromQS = route.query.cartId || null;

// 54029c42-fa6c-4628-b1f2-4ca7aed2165f - 8st

const config = useRuntimeConfig();
const geinsSettings = config.public.geins.settings as GeinsSettings;
const geinsCore = new GeinsCore(geinsSettings);
const geinsOMS = new GeinsOMS(geinsCore);

const skuId = 1357;
const skuId2 = 1121;
const skuId3 = 1349;
const cartId = ref<string>('ad9d3e96-8827-477f-b079-102edb56ee59');
const cart = ref<any>({});
const cartItems = ref<any[]>([]);

onMounted(async () => {
  if (cartIdFromQS) {
    await loadCart(cartIdFromQS as string);
  }
});

const loadCart = async (id?: string) => {
  const currentCartId = id || cartId.value;

  logWrite('vue Current Cart Id', currentCartId);
  cart.value = await geinsOMS.cart.get(currentCartId);
  cartItems.value = await geinsOMS.cart.items.get();
  //logWrite('Items', cartItems.value);
};


const addItemToCart = async (item?: any) => {
  let args = {};
  if (item.id) {
    args = { id: item.id };
  } else {
    args = { skuId: skuId2 };
  }
  let result = await geinsOMS.cart.items.add(args);
  cartItems.value = await geinsOMS.cart.items.get();
  //logWrite('Items', cartItems.value);
  //let cart = await geinsOMS.cart.get();
  //logWrite('Cart after add', cart);
};

const add5ItemToCart = async (item?: any) => {
  let result = await geinsOMS.cart.items.add({ skuId, quantity: 5 });
  cartItems.value = await geinsOMS.cart.items.get();
  //logWrite('Items', cartItems.value);
  // let cart = await geinsOMS.cart.get();
  //logWrite('Cart after add', cart);
};

const removeItemFromCart = async (item?: any) => {
  let args = {};
  if (item.id) {
    args = { id: item.id };
  } else {
    args = { skuId };
  }
  let result = await geinsOMS.cart.items.remove(args);
  cartItems.value = await geinsOMS.cart.items.get();
  //logWrite('Items', cartItems.value);
  //let cart = await geinsOMS.cart.get();
  //logWrite('Cart after remove', cart);
};

const remove5ItemFromCart = async (item?: any) => {
  let result = await geinsOMS.cart.items.remove({ skuId, quantity: 5 });
  cartItems.value = await geinsOMS.cart.items.get();
  //logWrite('Items', cartItems.value);
  //let cart = await geinsOMS.cart.get();
  //logWrite('Cart after remove', cart);
};

const removeWholeItemFromCart = async (item?: any) => {
  let args = {};
  if (item.id) {
    args = { id: item.id };
  } else {
    args = { skuId };
  }
  let result = await geinsOMS.cart.items.delete(args);
  cartItems.value = await geinsOMS.cart.items.get();
  //logWrite('Items', cartItems.value);
  //let cart = await geinsOMS.cart.get();
  //logWrite('Cart after remove', cart);
};

const clear = async () => {
  await geinsOMS.cart.clear();
  logWrite('Cart cleared')
  logWrite('Cart re-get - start')
  cart.value = await geinsOMS.cart.get();
  logWrite('Cart re-get - stop')

};

</script>
<template>
  <div>
    <h2>Nuxt @geins/oms cart</h2>
    <p>
      <b>
        <NuxtLink to="/">GO BACK</NuxtLink>
      </b>
    </p>


    <div>
      <input type="text" v-model="cartId" /> <button @click="loadCart()">Load</button>
      <p>Actions</p>
      <button @click="addItemToCart">Add to Cart</button>
      <button @click="add5ItemToCart">Add 5 Cart</button>
      <br />
      <button @click="removeItemFromCart">Remove from Cart</button>
      <button @click="remove5ItemFromCart">Remove 5 Cart</button>
      <br />
      <button @click="clear">Clear</button>
    </div>
    <div>
      <p>Cart</p>
      <p><b>Id:</b> {{ cart?.id }}</p>
      <!--       <p><b>MerchantData:</b>
        {{ cart.merchantData }}
      </p> -->
    </div>

    <div v-for="item in cartItems" :key="item.id">
      <p>{{ item.skuId }} - {{ item.quantity }}
        <button @click="addItemToCart(item)">+</button>
        <button @click="removeItemFromCart(item)">-</button>
        <button @click="removeWholeItemFromCart(item)">x</button>
      </p>
    </div>
  </div>
</template>
