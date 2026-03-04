<script setup>
const viewBoxMap = {
  'book-outline': '0 0 18 18',
  'person-outline': '0 0 18 18',
  'money-outline': '0 0 18 18',
  'chevron-left': '0 0 32 32',
  'chevron-right': '0 0 32 32',
}

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: '1em' },
})
</script>

<template>
  <svg
    v-if="viewBoxMap[name]"
    :width="size"
    :height="size"
    :viewBox="viewBoxMap[name]"
    aria-hidden="true"
    class="inline-block align-middle transition-colors"
  >
    <use :href="`#icon-${name}`" />
  </svg>

  <span
    v-else
    class="inline-block rounded bg-red-700 align-middle"
    :style="{ width: '1em', height: '1em' }"
    :title="`[AppIcon] 找不到 icon: ${name}`"
  />
</template>
