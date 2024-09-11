<script setup lang="ts">
import { ref } from 'vue';
</script>
<template>
  <div>
    <h2>Geins SDK Test Bench - Nuxt3</h2>
    <table>
      <tr>
        <td>@geins/core</td>
        <td>@geins/crm</td>
        <td>@geins/cms</td>
      </tr>
      <tr>
        <td>
          <NuxtLink to="/core/event">Event</NuxtLink><br />
          <NuxtLink to="/core/routing">Routing</NuxtLink>
        </td>
        <td>
          <NuxtLink to="/crm/auth">Auth Test</NuxtLink><br />
          <NuxtLink to="/crm/spoof">Spoof User Test</NuxtLink>
        </td>
        <td>
          <pre><NuxtLink to="/cms/">Go to CMS</NuxtLink></pre>
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
