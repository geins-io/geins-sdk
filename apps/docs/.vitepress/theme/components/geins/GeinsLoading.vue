<template>
  <div class="spinner">
    <div class="spinner-circle"></div>
  </div>
</template>
<style scoped>
.spinner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--vp-c-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.spinner-circle {
  width: 20px;
  height: 20px;
  border: 2px solid var(--vp-c-white);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
