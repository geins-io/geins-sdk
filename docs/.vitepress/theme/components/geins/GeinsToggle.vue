<script setup lang="ts">
import { ref, defineProps } from 'vue';
const props = defineProps<{
  showContent?: boolean;
  marginTop?: string;
}>();
const showContent = ref(props.showContent);
</script>

<template>
  <div class="toggle-wrap">
    <button class="toggle" @click="showContent = !showContent">
      <div class="trigger-wrap">
        <slot name="trigger" />
        <i class="chevron" :class="{ closed: !showContent }"></i>
      </div>
    </button>
    <Transition name="slide-up">
      <div v-if="showContent" class="content">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.toggle-wrap {
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

.trigger-wrap {
  display: flex;
  position: relative;
}

.trigger-wrap > * {
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
