<script setup>
import { useRoute } from '#app';
import { useRuntimeConfig } from '#app';
import { RoutingService } from '~/utils/routingService'; // Adjust path as needed

// Capture the dynamic path using Nuxt's useRoute
const route = useRoute();
const fullPath = `/routing/${route.params.slug.join('/')}`; // Reconstruct the full dynamic path

// Initialize the routing service
const runtimeConfig = useRuntimeConfig();
const routingService = new RoutingService(runtimeConfig.public.geins.apiKey);

// Test the route using the routing service
let routeData = null;
const fetchRouteData = async () => {
  routeData = await routingService.getRoute(fullPath);
};

// Call the function to fetch the data
fetchRouteData();
</script>
<template>
  <div>
    <h1>Routing Service Testing Page</h1>
    <p><strong>Requested Path:</strong> {{ fullPath }}</p>
    <div v-if="routeData">
      <h2>Route Found:</h2>
      <p><strong>Old URL:</strong> {{ fullPath }}</p>
      <p><strong>New URL:</strong> {{ routeData }}</p>
    </div>
    <div v-else>
      <p>No route found for this path.</p>
    </div>
  </div>
</template>
