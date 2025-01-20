<template>
  <div class="min-h-screen flex items-center justify-center">
    <p>Redirecting to checkout...</p>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const token = ref('eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJlbnZpcm9ubWVudCI6InByb2QiLCJhcGlLZXkiOiJCRDY3OUZGMC0wNUJFLTQ4NzYtQjU0Qy1GMTZERkRCOEU5NjciLCJhY2NvdW50TmFtZSI6ImxhYnMiLCJjaGFubmVsIjoiMSIsInRsZCI6IjEiLCJsb2NhbGUiOiJzdi1TRSIsIm1hcmtldCI6InNlIn0.');

// Redirect to checkout with a mock token
onMounted(() => {
  router.push(`/checkout/${token.value}`);
})
</script>
