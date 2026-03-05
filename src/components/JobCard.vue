<script setup>
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  job: {
    type: Object,
    required: true,
  },
  educationList: {
    type: Array,
    default: () => [],
  },
  salaryList: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['view-detail'])

const educationLabel = computed(() => {
  const found = props.educationList.find((e) => Number(e.id) === props.job.educationId)
  return found?.label ?? ''
})

const salaryLabel = computed(() => {
  const found = props.salaryList.find((s) => Number(s.id) === props.job.salaryId)
  return found?.label ?? ''
})
</script>

<template>
  <article
    class="flex flex-col gap-2.5 rounded-md border border-gray-500 bg-gray-100 p-4 transition-shadow hover:shadow-[0_0_8px_0_rgba(0,0,0,0.35)]"
  >
    <!-- Company name -->
    <h3 class="text-16 md:text-24 text-gray-1000 font-bold">{{ job.companyName }}</h3>

    <div class="flex flex-col gap-2">
      <!-- Job title -->
      <p class="text-14 flex items-center gap-1.5 text-gray-800">
        <AppIcon name="person-outline" class="shrink-0 text-[18px]" />
        {{ job.jobTitle }}
      </p>
      <!-- Education -->
      <p class="text-14 flex items-center gap-1.5 text-gray-800">
        <AppIcon name="book-outline" class="shrink-0 text-[18px]" />
        {{ educationLabel }}
      </p>
      <!-- Salary -->
      <p class="text-14 flex items-center gap-1.5 text-gray-800">
        <AppIcon name="money-outline" class="shrink-0 text-[18px]" />
        {{ salaryLabel }}
      </p>
    </div>

    <!-- Preview -->
    <p class="text-14 text-gray-1000">{{ job.preview }}</p>

    <!-- View detail -->
    <button
      class="text-14 cursor-pointer text-center font-bold text-orange-700"
      @click.stop="emit('view-detail', job.id)"
    >
      查看細節
    </button>
  </article>
</template>
