<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
  logWrite,
  GeinsCore,
  buildEndpoints,
  CookieService,
  AuthClientConnectionMode,
  GeinsCustomerType,
  GeinsGender
} from '@geins/core';
import type {
  AuthSettings,
  GeinsCredentials,
  GeinsUserInputTypeType,
} from '@geins/types';
import { GeinsCRM } from '@geins/crm';

import Select from '~/components/controls/Select.vue';
import { fake } from '~/utils/faker';

const cookieService = new CookieService();

const config = useRuntimeConfig();
const geinsCredentials = config.public.geins.credentials as GeinsCredentials;
const authSettings = {
  clientConnectionMode: AuthClientConnectionMode.Direct,
} as AuthSettings;
const geinsCore = new GeinsCore(geinsCredentials);
const geinsCRM = new GeinsCRM(geinsCore, authSettings);

const items = ref<any[]>([]);
const user = ref<any>({});

const fakeUser = fake.user();
const userRegister = ref<GeinsUserInputTypeType>({
  address: {
    firstName: fakeUser.user.address?.firstName || '',
    lastName: fakeUser.user.address?.lastName || '',
    company: fakeUser.user.address?.company || '',
    mobile: fakeUser.user.address?.mobile || '',
    phone: fakeUser.user.address?.phone || '',
    entryCode: fakeUser.user.address?.entryCode || '',
    addressLine1: fakeUser.user.address?.addressLine1 || '',
    addressLine2: fakeUser.user.address?.addressLine2 || '',
    addressLine3: fakeUser.user.address?.addressLine3 || '',
    careOf: fakeUser.user.address?.careOf || '',
    city: fakeUser.user.address?.city || '',
    state: fakeUser.user.address?.state || '',
    zip: fakeUser.user.address?.zip || '',
  },
  newsletter: fakeUser.user.newsletter || false,
  customerType: fakeUser.user.customerType || '',
  gender: fakeUser.user.gender || '',
  entityId: fakeUser.user.entityId || '',
  metaData: fakeUser.user.metaData || '{}',
});

interface Option {
  key: string;
  value: string | number;
}
const customerTypeOptions: Option[] = [];
for (const key in GeinsCustomerType) {
  customerTypeOptions.push({
    key,
    value: GeinsCustomerType[key as keyof typeof GeinsCustomerType],
  });
}
const genderTypeOptions: Option[] = [];
for (const key in GeinsGender) {
  genderTypeOptions.push({
    key,
    value: GeinsGender[key as keyof typeof GeinsGender],
  });
}

interface OptionBoolean {
  key: string;
  value: boolean;
}
const newsletterOptions: OptionBoolean[] = [];
newsletterOptions.push({ key: 'Yes', value: true });
newsletterOptions.push({ key: 'No', value: false });

const username = ref<string>('');
const password = ref<string>('dZgFCZi66mnPr9D');

const register = async () => {
  const result = await geinsCRM.auth.newUser({
    username: username.value,
    password: password.value,
  });

  logWrite('User registered', result);

  user.value = result;
  updateCookiesDisplay();
  items.value.push({
    header: username.value,
    data: JSON.stringify(
      { username: username.value, password: password.value },
      null,
      2,
    ),
  });
  items.value.unshift({
    header: username.value + ':: ' + password.value,
    data: JSON.stringify(result, null, 2),
  });
};

const registerWithInfo = async () => {
  // copy the userRegister object to avoid changing the original object
  const userObject = JSON.parse(JSON.stringify(userRegister.value));

  const result = await geinsCRM.auth.newUser(
    {
      username: username.value,
      password: password.value,
    },
    userObject,
  );
  logWrite('User registered', result);
  user.value = result;
  updateCookiesDisplay();
  items.value.push({
    header: username.value,
    data: JSON.stringify(
      { username: username.value, password: password.value },
      null,
      2,
    ),
  });
  items.value.unshift({
    header: username.value + ':: ' + password.value,
    data: JSON.stringify(result, null, 2),
  });
};

const updateCookiesDisplay = () => {
  items.value = [];
  const allCookies = cookieService.getAll() as any;
  for (const key in allCookies) {
    items.value.push({
      header: key,
      data: JSON.stringify(allCookies[key], null, 2),
    });
  }
};

const newUser = async () => {
  const fakeUser = fake.user();
  username.value = fakeUser.email;
};

const clearCookies = () => {
  updateCookiesDisplay();
};

onMounted(() => {
  newUser();
  // updateCookiesDisplay();
});
</script>

<template>
  <div>
    <h2>Nuxt @geins/crm register user</h2>

    <p>
      This page sets a spoofed user in the browser cookies. The user can then be
      used to get preview cms data.
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
              <td>
                <table>
                  <tr>
                    <td>1. Information</td>
                  </tr>
                  <tr>
                    <td>
                      <label>Email:</label><br /><input v-model="username" /><br />
                      <label>Password:</label><br /><input v-model="password" />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td>
                <hr />
              </td>
            </tr>
            <tr>
              <td>2. Singup With Bare minimum</td>
            </tr>
            <tr>
              <td>
                <button @click="register">Register</button>
              </td>
            </tr>
            <tr>
              <td>3. Signup with more info</td>
            </tr>
            <tr v-if="userRegister.address">
              <td>
                <label>customerType:</label><br />
                <Select v-model="userRegister.customerType" :options="customerTypeOptions" />
                <br />
                <label>entityId:</label><br /><input v-model="userRegister.entityId" /><br />
                <label>gender:</label><br /><Select v-model="userRegister.gender" :options="genderTypeOptions" /><br />
                <label>newsletter:</label><br /><Select :options="newsletterOptions" /><br />
                <label>firstname:</label><br /><input v-model="userRegister.address.firstName" /><br />
                <label>lastName:</label><br /><input v-model="userRegister.address.lastName" /><br />
                <label>company:</label><br /><input v-model="userRegister.address.company" /><br />
                <label>mobile:</label><br />
                <input v-model="userRegister.address.mobile" /><br />
                <label>phone:</label><br /><input v-model="userRegister.address.phone" /><br />
                <label>entryCode:</label><br /><input v-model="userRegister.address.entryCode" /><br />
                <label>careOf:</label><br /><input v-model="userRegister.address.careOf" /><br />
                <label>addressLine1:</label><br /><input v-model="userRegister.address.addressLine1" /><br />
                <label>addressLine2:</label><br /><input v-model="userRegister.address.addressLine2" /><br />
                <label>addressLine3:</label><br /><input v-model="userRegister.address.addressLine3" /><br />
                <label>city:</label><br /><input v-model="userRegister.address.city" /><br />
                <label>state:</label><br /><input v-model="userRegister.address.state" /><br />
                <label>zip:</label><br /><input v-model="userRegister.address.zip" /><br />
              </td>
            </tr>
            <tr>
              <td>
                <button @click="registerWithInfo">
                  Register with more info
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <hr />
              </td>
            </tr>
          </table>
          <hr />
          <div>
            Added Users:
            <div v-for="(item, index) in items" v-if="items.length > 0" :key="index">
              <p>
                <b>{{ item.header }}</b><br />
                <textarea :style="{
                  border: 0,
                  width: '400px',
                  height:
                    item.data.length > 100
                      ? Math.min(500, item.data.length * 10) + 'px'
                      : '70px',
                }">{{ item.data }}</textarea>
              </p>
            </div>
            <i v-else> ... no users added </i>
          </div>
        </td>
        <td style="vertical-align: top; padding-left: 50px">
          <div v-if="user" style="width: 500px; overflow-x: scroll">
            <b>User Object:</b>
            <pre>{{ JSON.stringify(user, null, 2) }}</pre>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
