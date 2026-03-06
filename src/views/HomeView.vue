<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import JobCard from '@/components/JobCard.vue'
import JobDetailModal from '@/components/JobDetailModal.vue'
import { useJobsStore } from '@/stores/jobs'

// import bgImage from '@/assets/image/bg.png'
// import characterImage from '@/assets/image/character.png'
// import leftEyeImage from '@/assets/image/character-left-eye.png'
// import rightEyeImage from '@/assets/image/character-right-eye.png'
import loopTextImage from '@/assets/image/loop-text.png'
const store = useJobsStore()

// --- Eye tracking ---
const characterRef = ref(null)
const leftEyeOffset = ref(0)
const rightEyeOffset = ref(0)

function handleMouseMove(e) {
  if (!characterRef.value) return
  const rect = characterRef.value.getBoundingClientRect()

  const centerX = rect.left + rect.width * 0.5
  const dx = e.clientX - centerX
  const dist = Math.abs(dx)
  const sign = dist === 0 ? 0 : dx / dist
  const ratio = Math.min(dist / 80, 1)

  leftEyeOffset.value = sign * ratio * 2
  rightEyeOffset.value = sign * ratio * 1
}

// --- Filters ---
const searchCompany = ref('')
const selectedEducation = ref('')
const selectedSalary = ref('')
const educationList = ref([])
const salaryList = ref([])

async function fetchFilterOptions() {
  const [eduRes, salRes] = await Promise.all([
    fetch('/api/v1/educationLevelList'),
    fetch('/api/v1/salaryLevelList'),
  ])
  educationList.value = await eduRes.json()
  salaryList.value = await salRes.json()
}

function applySearch() {
  store.setFilters({
    companyName: searchCompany.value,
    educationLevel: selectedEducation.value,
    salaryLevel: selectedSalary.value,
  })
}

function clearFilters() {
  searchCompany.value = ''
  selectedEducation.value = ''
  selectedSalary.value = ''
  store.setFilters({ companyName: '', educationLevel: '', salaryLevel: '' })
}

// --- Job detail modal ---
const activeJobId = ref(null)

function openModal(jobId) {
  activeJobId.value = jobId
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  activeJobId.value = null
  document.body.style.overflow = ''
}

// --- Pagination pages (mobile max 6) ---
const isMobile = ref(window.innerWidth < 768)

const visiblePages = computed(() => {
  const total = store.totalPages
  const current = store.currentPage
  const maxMobile = 6

  if (!isMobile.value || total <= maxMobile) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const half = Math.floor(maxMobile / 2)
  let start = current - half
  let end = current + half - 1

  if (start < 1) {
    start = 1
    end = maxMobile
  }
  if (end > total) {
    end = total
    start = total - maxMobile + 1
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// --- Responsive perPage ---
function getPerPage() {
  return window.innerWidth >= 768 ? 6 : 4
}

function handleResize() {
  isMobile.value = window.innerWidth < 768
  const next = getPerPage()
  if (next !== store.perPage) {
    store.setPerPage(next)
  }
}

onMounted(async () => {
  document.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('resize', handleResize)
  store.setPerPage(getPerPage())
  await Promise.all([fetchFilterOptions()])
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', handleResize)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="min-h-screen bg-linear-to-r from-[#868686] to-[#5C5C5C] pb-3 md:pb-7">
    <!-- ===== Hero Section ===== -->
    <section
      class="max-h-[238px] overflow-hidden bg-[url('@/assets/image/bg.png')] bg-cover bg-top md:max-h-[823px]"
    >
      <div class="mx-auto max-w-[1440px]">
        <div class="relative flex max-w-[317px] md:max-w-[1097px]">
          <!-- Character with eye tracking -->
          <div ref="characterRef" class="relative w-[70vw]">
            <img
              src="@/assets/image/character.png"
              alt="character"
              class="w-full select-none"
              draggable="false"
            />

            <img
              src="@/assets/image/character-left-eye.png"
              alt="left eye"
              class="pointer-events-none absolute top-[37.3%] left-[53%] w-[4%] max-w-[40px] select-none"
              :style="{
                transform: `translateX(${leftEyeOffset}px)`,
                transition: 'transform 0.08s ease-out',
              }"
              draggable="false"
            />

            <img
              src="@/assets/image/character-right-eye.png"
              alt="right eye"
              class="pointer-events-none absolute top-[36.7%] left-[66.7%] w-[4%] max-w-[34px] select-none"
              :style="{
                transform: `translateX(${rightEyeOffset}px)`,
                transition: 'transform 0.08s ease-out',
              }"
              draggable="false"
            />
          </div>

          <!-- loop-text -->
          <img
            src="@/assets/image/loop-text.png"
            alt="logo"
            class="animate-text-loop absolute inset-x-0 top-[50%] mx-auto w-[25vw] max-w-[137px] translate-x-[120%] object-contain md:max-w-[500px]"
            draggable="false"
          />
        </div>
      </div>
    </section>

    <!-- ===== Job List Section ===== -->
    <section
      class="isolate border-y border-gray-500 bg-gray-100 p-4 shadow-[2px_2px_4px_0_rgba(0,0,0,0.25)] md:mx-7 md:-mt-[8%] md:rounded-xl md:border md:p-6"
    >
      <!-- Section title -->
      <h2
        class="text-20 md:text-24 text-gray-1000 mb-3 font-bold before:mr-2 before:inline-block before:h-4 before:rounded-full before:border-4 before:border-l before:border-orange-700 md:mb-5"
      >
        適合前端工程師的好工作
      </h2>

      <!-- Filter bar -->
      <div class="mb-5 hidden gap-x-[18px] md:flex">
        <div class="relative flex grow flex-col gap-1">
          <label
            class="text-12 text-gray-1000 absolute top-0 left-3 -translate-y-1/2 bg-gray-100 px-1"
            >公司名稱</label
          >
          <input
            v-model="searchCompany"
            type="text"
            placeholder="請輸入公司名稱"
            class="text-16 placeholder:text-gray-1000 h-14 rounded-sm border border-gray-500 px-3 focus:outline-none"
          />
        </div>

        <div class="relative flex w-1/5 flex-col gap-1">
          <label
            class="text-12 text-gray-1000 absolute top-0 left-3 -translate-y-1/2 bg-gray-100 px-1"
            >教育程度</label
          >
          <select
            v-model="selectedEducation"
            class="text-16 h-14 min-w-32 appearance-none rounded-sm border border-gray-500 px-3 focus:outline-none"
          >
            <option value="">不限</option>
            <option v-for="edu in educationList" :key="edu.id" :value="edu.id">
              {{ edu.label }}
            </option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 after:h-0 after:w-0 after:border-t-[5px] after:border-r-[5px] after:border-l-[5px] after:border-t-gray-800 after:border-r-transparent after:border-l-transparent"
          ></div>
        </div>

        <div class="relative flex w-1/5 flex-col gap-1">
          <label
            class="text-12 text-gray-1000 absolute top-0 left-3 -translate-y-1/2 bg-gray-100 px-1"
            >薪水範圍</label
          >
          <select
            v-model="selectedSalary"
            class="text-16 h-14 appearance-none rounded-sm border border-gray-500 px-3 focus:outline-none"
          >
            <option value="">不限</option>
            <option v-for="sal in salaryList" :key="sal.id" :value="sal.id">
              {{ sal.label }}
            </option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 after:h-0 after:w-0 after:border-t-[5px] after:border-r-[5px] after:border-l-[5px] after:border-t-gray-800 after:border-r-transparent after:border-l-transparent"
          ></div>
        </div>

        <button
          class="hover:bg-gray-1400 text-16 cursor-pointer rounded-sm bg-gray-700 px-[22px] py-2 text-gray-100 transition-colors"
          @click="applySearch"
        >
          條件搜尋
        </button>
      </div>

      <!-- Loading -->
      <div v-if="store.loading" class="flex h-full items-center justify-center py-7 md:h-[458px]">
        <div
          class="border-gray-1000 h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"
        />
      </div>

      <!-- Job cards grid -->
      <div
        v-else-if="store.jobs.length"
        class="grid grid-cols-1 gap-2.5 md:grid-cols-3 md:gap-[18px]"
      >
        <JobCard
          v-for="job in store.jobs"
          :key="job.id"
          :job="job"
          :education-list="educationList"
          :salary-list="salaryList"
          @view-detail="openModal"
        />
      </div>

      <!-- Empty -->
      <div
        v-else
        class="flex h-full items-center justify-center rounded-md border border-gray-500 text-gray-700 md:h-[458px]"
      >
        無資料
      </div>

      <!-- Pagination -->
      <div
        v-if="store.totalPages > 1"
        class="mt-2.5 flex justify-center gap-1.5 select-none md:mt-3"
      >
        <button
          :disabled="store.currentPage <= 1"
          class="text-gray-1000 shrink-0 cursor-pointer disabled:cursor-auto disabled:text-gray-700"
          @click="store.setPage(store.currentPage - 1)"
        >
          <AppIcon name="chevron-left" class="text-[32px]" />
        </button>

        <button
          v-for="p in visiblePages"
          :key="p"
          class="text-14 text-gray-1000 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full"
          :class="p === store.currentPage ? 'bg-gray-300' : 'bg-transparent'"
          @click="store.setPage(p)"
        >
          {{ p }}
        </button>

        <button
          :disabled="store.currentPage >= store.totalPages"
          class="text-gray-1000 shrink-0disabled:cursor-auto cursor-pointer disabled:text-gray-700"
          @click="store.setPage(store.currentPage + 1)"
        >
          <AppIcon name="chevron-right" class="text-[32px]" />
        </button>
      </div>
    </section>

    <!-- ===== Job Detail Modal ===== -->
    <JobDetailModal
      :job-id="activeJobId"
      :education-list="educationList"
      :salary-list="salaryList"
      @close="closeModal"
    />
  </div>
</template>
