
import { defineNuxtRouteMiddleware, useRuntimeConfig } from '#imports';
import cache from '../server/utils/cache';

export default defineNuxtRouteMiddleware((to, from) => {
  console.log('Running cache middleware...', to.path, from.path);
  const cachedValue = cache.get('exampleKey');
  console.log('Cache contents in middleware', cache.keys(), cache.mget(cache.keys()));

  if (cachedValue) {
    console.log('Cache hit:', cachedValue);
    // You can now use this cached value
  } else {
    console.log('Cache miss');
  }
});



/* import { defineNuxtRouteMiddleware, useRequestEvent } from '#app';
import { RoutingService } from '../utils/routingService';
import { useRuntimeConfig } from '#app';
import { cache } from '../server/utils/cache'; // Import the shared cache


export default defineNuxtRouteMiddleware(async (to) => {
  console.log('Running geinsRouter middleware...', to.path);
  const keys = cache.keys(); // Ensure the cache is initialized
  console.log('Total keys in cache:', keys.length);

  const runtimeConfig = useRuntimeConfig();
  const routingService = RoutingService.getInstance(runtimeConfig.public.geins.apiKey);

  console.log('Total routes in cache:', await routingService.getAllRoutes());


  // Get the current path (e.g., /old-url)
  const oldUrl = to.path;

  // Check if the old URL exists in the routing cache
  const newUrl = await routingService.getRoute(oldUrl);

  if (newUrl) {

    const event = useRequestEvent();
    if (event?.node.res) {
      const redirectUrl = `/routes${newUrl}`;
      // If a new URL is found, redirect to the new URL with a 301 status
      event.node.res.setHeader('Location', redirectUrl); // Ensure newUrl is a string
      event.node.res.statusCode = 302;
      event.node.res.end();
    }
  }
});
 */
