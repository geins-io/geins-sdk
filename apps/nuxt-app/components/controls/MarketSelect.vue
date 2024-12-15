<script setup>
const props = defineProps({
  modelValue: String,
  options: Array,
});

const emit = defineEmits(['update:modelValue']);

const onInput = (event) => {
  emit('update:modelValue', event.target.value);
};

onMounted(async () => { });
</script>

<template>
  <select :value="modelValue" class="ddlWidth" @change="onInput">
    <option v-for="option in props.options" :key="option.value" :value="option.value">
      {{ option.text }}
    </option>
  </select>
</template>
<style scoped>
.ddlWidth {
  width: 250px;
}
</style>
