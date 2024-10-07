<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
  logWrite,
  GeinsCore,
  AuthClientConnectionModes,
  GeinsEventType,
} from '@geins/core';
import type { GeinsSettings, AuthSettings, GeinsUserType, GeinsUserInputTypeType } from '@geins/types';
import { GeinsCRM } from '@geins/crm';
import CookieDump from '~/components/CookieDump.vue';

const config = useRuntimeConfig();
const geinsSettings = config.public.geins.settings as GeinsSettings;
const authSettings = {
  clientConnectionMode: AuthClientConnectionModes.Direct,
} as AuthSettings;

const geinsCore = new GeinsCore(geinsSettings);
const geinsCRM = new GeinsCRM(geinsCore, authSettings);
const timeToLoggout = ref<number>(900);
const isLoggedIn = ref<boolean>(false);
const userObject = ref<GeinsUserType>();
const authObject = ref<any>(null);
const userOrderObject = ref<any>(null);

const checkUserLoggedIn = async () => {
  const result = await geinsCRM.auth.authorized();
  if (result === true) {
    isLoggedIn.value = true;
    return true;
  } else {
    isLoggedIn.value = false;
    return false;
  }
};

const userLoggedIn = computed(() => {
  checkUserLoggedIn();
  return isLoggedIn.value;
});

const setAuthObject = async (response: any) => {
  authObject.value = response;
  response?.tokens?.expiresIn
    ? (timeToLoggout.value = response.tokens.expiresIn)
    : null;
};

const getAuthObject = async () => {
  await geinsCRM.auth.getUser().then((response) => {
    setAuthObject(response);
  });
};

const setUserObject = async () => {
  const user = await geinsCRM.user.get();
  logWrite('user', user);
  if (user) {
    userObject.value = user;
  }
};

const getUserOrdersObject = async () => {
  const orders = await geinsCRM.user.orders();

  await geinsCRM.user.orders().then((response) => {
    userOrderObject.value = response;
    if (userOrderObject.value.length > 0) {
      getUserOrderObject(userOrderObject.value[0].id);
    }
  });
};

const logOut = async () => {
  await geinsCRM.auth.logout();
  userObject.value = undefined;
};

const getUserOrderObject = async (id: number) => {
  //const order = await geinsCRM.user.order(id);
  //logWrite('order with id:' + id, order);
};

onMounted(async () => {
  await setUserObject();
  //await getAuthObject();
  //await getUserOrdersObject();
  setInterval(() => {
    timeToLoggout.value -= 1;
    if (timeToLoggout.value <= 100) {
      geinsCRM.auth.refresh().then((response) => {
        setAuthObject(response);
      });
    }
    if (timeToLoggout.value <= 0) {
      geinsCRM.auth.logout();
    }
  }, 1000);
});

/**
 * Fetches and updates the user information.
 */
const getUser = async () => {
  setUserObject();
};

/**
 * Handles token refresh based on the current connection type.
 */
const handleRefresh = async () => {
  geinsCRM.auth.refresh().then((response) => {
    authObject.value = response;
    setAuthObject(response);
  });
};
async function handleSubmit() {
  // Add your form submission logic here
  console.log('Form submitted');
  const userSave: any = {
    address: {
      firstName: userObject.value?.address?.firstName,
      lastName: userObject.value?.address?.lastName,
      phone: userObject.value?.address?.phone,
      addressLine1: userObject.value?.address?.addressLine1,
      addressLine2: userObject.value?.address?.addressLine2,
      zip: userObject.value?.address?.zip,
      city: userObject.value?.address?.city,
      country: userObject.value?.address?.country,
    }
  }

  const user = await geinsCRM.user.update(userSave);
  logWrite('user', user);
}
</script>

<template>
  <div>
    <h2>Nuxt @geins/crm current user</h2>

    <p>
      This page demonstrates how to use the <b>@geins/crm</b> package to get the
      current user.
    </p>
    <p>
      <b>
        <NuxtLink to="/">GO BACK</NuxtLink>
      </b>
    </p>

    <table>
      <tr>
        <td style="vertical-align: top">
          <table>
            <tr>
              <td>1. Actions:</td>
            </tr>
            <tr>
              <td>
                <button :disabled="userLoggedIn === false" @click="getUser">
                  Get User
                </button>
                <button :disabled="userLoggedIn === false" @click="handleRefresh">
                  Refresh
                </button>
                <button @click="logOut">Logout</button>
              </td>
            </tr>
            <tr v-if="userObject && userObject.address">
              <td>

                <form>
                  <div>
                    <label for="firstName">First Name:</label>
                    <input id="firstName" v-model="userObject.address.firstName" type="text" />
                  </div>
                  <div>
                    <label for="lastName">Last Name:</label>
                    <input id="lastName" v-model="userObject.address.lastName" type="text" />
                  </div>
                  <div>
                    <label for="phone">Phone:</label>
                    <input id="phone" v-model="userObject.address.phone" type="tel" />
                  </div>
                  <div>
                    <label for="address1">Address 1:</label>
                    <input id="address1" v-model="userObject.address.addressLine1" type="text" />
                  </div>
                  <div>
                    <label for="address2">Address 2:</label>
                    <input id="address2" v-model="userObject.address.addressLine2" type="text" />
                  </div>
                  <div>
                    <label for="zipCode">Zip Code:</label>
                    <input id="zipCode" v-model="userObject.address.zip" type="text" />
                  </div>
                  <div>
                    <label for="city">City:</label>
                    <input id="city" v-model="userObject.address.city" type="text" />
                  </div>
                  <div>
                    <label for="country">Country:</label>
                    <input id="country" v-model="userObject.address.country" type="text" />
                  </div>
                  <button type="submit" @click.prevent="handleSubmit">Save</button>
                </form>
              </td>
            </tr>


          </table>
          <hr />
          <div>
            <CookieDump />
          </div>
        </td>
        <td style="vertical-align: top; padding-left: 50px">
          <b>User is logged in: {{ userLoggedIn }}</b><br /><br />
          <div v-if="userLoggedIn">
            <b>Time to logout: {{ timeToLoggout }}</b><br /><br />
          </div>
          <div v-if="userOrderObject" style="width: 500px; overflow-x: scroll">
            <b>User Order Object:</b>
            <pre>{{ JSON.stringify(userOrderObject, null, 2) }}</pre>
          </div>
          <div v-if="authObject" style="width: 500px; overflow-x: scroll">
            <b>Auth Object:</b>
            <pre>{{ JSON.stringify(authObject, null, 2) }}</pre>
          </div>

          <div v-if="userObject" style="width: 500px; overflow-x: scroll">
            <b>User Object:</b>
            <pre>{{ JSON.stringify(userObject, null, 2) }}</pre>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
