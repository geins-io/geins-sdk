<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-2xl w-full mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div class="bg-white rounded-lg px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center">
        <div class="max-w-max mx-auto">
          <main class="sm:flex">
            <div class="sm:ml-6">
              <div class="sm:border-l sm:border-gray-200 sm:pl-6">
                <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                  Thank you for your order!
                </h1>
                <p class="mt-2 text-base text-gray-500">
                  Your order number is: {{ orderId }}
                </p>
              </div>
              <div class="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                <NuxtLink
                  to="/"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Go back home
                </NuxtLink>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const orderId = route.params.orderId
</script>