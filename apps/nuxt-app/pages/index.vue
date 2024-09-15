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
          <NuxtLink to="/core/routing">Routing</NuxtLink>
        </td>
        <td>
          <NuxtLink to="/crm/auth">Auth</NuxtLink><br />
          <NuxtLink to="/crm/spoof">Spoof User</NuxtLink>
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
          <!--  <NuxtLink to="/pim/brand">Brand</NuxtLink> -->
        </td>
        <td>
          <NuxtLink to="/search/product">Product</NuxtLink>
        </td>
        <td></td>
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
