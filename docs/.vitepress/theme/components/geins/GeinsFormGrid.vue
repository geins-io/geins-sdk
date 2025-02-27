<script setup lang="ts"></script>
<template>
  <div class="form-grid">
    <slot />
  </div>
</template>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}
</style>
