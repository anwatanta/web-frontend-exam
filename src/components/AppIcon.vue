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
})
</script>

<template>
  <svg
    v-if="viewBoxMap[name]"
    width="1em"
    height="1em"
    :viewBox="viewBoxMap[name]"
    aria-hidden="true"
    class="inline-block"
  >
    <use :href="`#icon-${name}`" />
  </svg>

  <span
    v-else
    class="inline-block bg-red-700"
    style="width: 1em; height: 1em"
    :title="`[AppIcon] 找不到 icon: ${name}`"
  />
</template>
