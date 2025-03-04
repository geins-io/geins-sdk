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
  gap: 1rem;
  margin-bottom: 2rem;
}
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}
</style>
