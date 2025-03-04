<script setup lang="ts"></script>
<template>
  <div class="form-container">
    <slot />
  </div>
</template>

<style scoped>
.form-container {
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--vp-c-divider);
}
@media (max-width: 768px) {
  .form-container {
    padding: 1.5rem;
  }
}
</style>
