<script setup lang="ts">
import { ref } from 'vue';
</script>
<template>
  <div>
    <h2>Geins SDK Test Bench - Nuxt3</h2>
    <table>
      <tr style="background-color: grey; font-size: 20px">
        <td>@geins/core</td>
        <td>@geins/crm</td>
        <td>@geins/cms</td>
      </tr>
      <tr>
        <td>
          <NuxtLink to="/core/channels">Channels</NuxtLink><br />
          <NuxtLink to="/core/event">Event</NuxtLink><br />
          <NuxtLink to="/core/routing">Routing</NuxtLink><br />
          <NuxtLink to="/core/graphqlquery">GraphQL query</NuxtLink>
        </td>
        <td>
          <NuxtLink to="/crm/register">Register User / New User</NuxtLink><br />
          <NuxtLink to="/crm/authdirect">Authenticate - Direct Mode</NuxtLink><br />
          <NuxtLink to="/crm/authproxy">Authenticate - Proxy Mode</NuxtLink><br />
          <NuxtLink to="/crm/login">Simple Login</NuxtLink><br />
          <NuxtLink to="/crm/user">Current User</NuxtLink><br />
          <NuxtLink to="/crm/pwReset">Password Reset</NuxtLink><br />
          <NuxtLink to="/crm/spoof">Spoof User</NuxtLink><br />
        </td>
        <td>
          <NuxtLink to="/cms/area">Area</NuxtLink><br />
          <NuxtLink to="/cms/page">Page</NuxtLink><br />
          <NuxtLink to="/cms/menu">Menu</NuxtLink>
        </td>
      </tr>
      <tr style="background-color: grey; font-size: 20px">
        <td>@geins/pim</td>
        <td>@geins/search</td>
        <td></td>
      </tr>
      <tr>
        <td>
          <NuxtLink to="/pim/brands">Brands</NuxtLink>
        </td>
        <td>
          <NuxtLink to="/search/product">Product</NuxtLink>
        </td>
        <td>

        </td>
      </tr>
    </table>
  </div>
</template>
<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

td {
  border: 1px solid black;
  padding: 8px;
}
</style>
