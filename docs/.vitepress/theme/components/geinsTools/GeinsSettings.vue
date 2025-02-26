<script setup lang="ts">
import { ref, defineProps } from 'vue';
const props = defineProps<{
  showSettingsForm?: boolean;
  marginTop?: string;
}>();
const showSettings = ref(props.showSettingsForm);
</script>

<template>
  <div class="settings-wrap">
    <button class="toggle" @click="showSettings = !showSettings">
      <slot name="toggle">
        <div class="toggle-wrap">
          <GeinsSettingsStatus :linked="false" class="status" />
          <i class="chevron" :class="{ closed: !showSettings }"></i>
        </div>
      </slot>
    </button>
    <Transition name="slide-up">
      <div v-if="showSettings" class="content">
        <slot name="content">
          <GeinsSettingsForm />
        </slot>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.settings-wrap {
  margin-top: v-bind('marginTop');
}

.slide-up-enter-active {
  animation: slide-up 0.3s;
}
.slide-up-leave-active {
  animation: slide-up 0.1s reverse;
}
@keyframes slide-up {
  0% {
    opacity: 0;
    transform: translateY(100px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.toggle {
  width: 100%;
}

.toggle-wrap {
  display: flex;
  position: relative;
}

.status {
  width: 100%;
}

.chevron {
  position: absolute;
  top: calc(50% + 5px);
  right: 20px;
  transform: translateY(-50%) rotate(0deg);
  transform-origin: top;
  transition: transform 0.2s;
  display: block;
  width: 10px;
  height: 10px;
}
.chevron.closed {
  transform: translateY(-50%) rotate(-90deg);
}
.chevron::after {
  position: absolute;
  display: block;
  content: '';
  border: 5px solid transparent;
}
.chevron::after {
  border-top-color: var(--vp-c-text-1); /*Match chevron background colour*/
}
</style>
