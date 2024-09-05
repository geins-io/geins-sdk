export default defineNuxtRouteMiddleware(async (to, from) => {
  const routingService: any = useNuxtApp().$routingService;

  // Check if the current route matches any old URLs
  const newUrl = await (routingService as any).getRoute(to.fullPath);

  if (newUrl) {
    console.log(`Redirecting from ${to.fullPath} to ${newUrl}`);
    return navigateTo(newUrl, { redirectCode: 301 });
  }
});
