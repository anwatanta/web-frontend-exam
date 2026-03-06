<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  jobId: { type: String, default: null },
  educationList: { type: Array, default: () => [] },
  salaryList: { type: Array, default: () => [] },
})

const emit = defineEmits(['close'])

const job = ref(null)
const carouselImages = computed(() =>
  (job.value?.companyPhoto ?? []).map((url, i) =>
    url.replace(
      /picsum\.photos\/(\d+)\/(\d+)/,
      `picsum.photos/seed/${job.value?.id ?? 0}_${i}/$1/$2`,
    ),
  ),
)
// 將原始陣列複製一份拼接，讓輪播尾端無縫接回開頭
const displayImages = computed(() => [...carouselImages.value, ...carouselImages.value])
const totalOriginal = computed(() => carouselImages.value.length)

async function fetchJob(id) {
  if (!id) return
  const res = await fetch(`/api/v1/jobs/${id}`)
  job.value = await res.json()
}

// --- Carousel ---
const currentIndex = ref(0)

let startX = 0
const threshold = 50

const setIndex = (index) => {
  currentIndex.value = index
}

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % totalOriginal.value
}

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + totalOriginal.value) % totalOriginal.value
}

const handleDragStart = (e) => {
  stopAutoPlay()
  startX = e.touches ? e.touches[0].clientX : e.clientX
}

const handleDragEnd = (e) => {
  if (startX === 0) return
  const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
  const deltaX = endX - startX
  if (deltaX > threshold) {
    prevImage()
  } else if (deltaX < -threshold) {
    nextImage()
  }
  startX = 0
  startAutoPlay()
}

// --- Auto-play ---
let autoPlayTimer = null

function startAutoPlay() {
  stopAutoPlay()
  if (totalOriginal.value <= 1) return
  autoPlayTimer = setInterval(nextImage, 3000)
}

function stopAutoPlay() {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

watch(
  () => props.jobId,
  (id) => {
    job.value = null
    currentIndex.value = 0
    stopAutoPlay()
    if (id) fetchJob(id)
  },
  { immediate: true },
)

watch(totalOriginal, (n) => {
  if (n > 1) startAutoPlay()
  else stopAutoPlay()
})

function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowLeft') prevImage()
  if (e.key === 'ArrowRight') nextImage()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  stopAutoPlay()
})
</script>

<template>
  <Transition name="modal">
    <div v-if="jobId" class="fixed inset-0 z-50 flex items-center justify-center px-[22px]">
      <!-- Backdrop -->
      <div class="bg-gray-1000/50 absolute inset-0" @click="emit('close')" />

      <!-- Modal card -->
      <div
        class="modal-card max-h-3xl relative z-10 flex h-[70vh] w-full max-w-[750px] flex-col rounded-sm bg-white shadow-[0_9px_46px_8px_rgba(0,0,0,0.12),0_24px_38px_3px_rgba(0,0,0,0.14),0_11px_15px_-7px_rgba(0,0,0,0.2)]"
      >
        <!-- Loading skeleton -->
        <template v-if="!job">
          <div class="flex h-[62px] items-center border-b border-gray-500 px-6">
            <div class="h-5 w-24 animate-pulse rounded bg-gray-300" />
          </div>
          <div class="flex flex-col gap-4 p-6">
            <div class="h-5 w-48 animate-pulse rounded bg-gray-300" />
            <div class="h-[150px] w-full animate-pulse rounded-xl bg-gray-300" />
            <div class="h-4 w-full animate-pulse rounded bg-gray-300" />
            <div class="h-4 w-5/6 animate-pulse rounded bg-gray-300" />
            <div class="h-4 w-4/6 animate-pulse rounded bg-gray-300" />
          </div>
        </template>

        <template v-if="job">
          <h2
            class="text-20 md:text-24 text-gray-1000 flex items-center border-b border-gray-500 px-6 py-4 font-bold"
          >
            詳細資訊
          </h2>
          <!-- Scrollable content -->
          <div class="flex flex-col gap-3 overflow-y-auto p-4 md:gap-[18px] md:p-6">
            <!-- Header -->
            <p
              class="text-14 md:text-20 text-gray-1000 flex flex-col gap-1 md:flex-row md:items-center"
            >
              <span class="text-20 md:text-24 font-bold">{{ job.companyName }}</span>
              <span>{{ ' ' }}{{ job.jobTitle }}</span>
            </p>

            <!-- Carousel -->
            <div class="select-none">
              <div
                class="relative w-full cursor-grab overflow-hidden active:cursor-grabbing"
                @touchstart="handleDragStart"
                @touchend="handleDragEnd"
                @mousedown="handleDragStart"
                @mouseup="handleDragEnd"
                @mouseleave="handleDragEnd"
              >
                <div
                  class="flex w-full transition-transform duration-500 ease-out"
                  :style="{ transform: `translateX(-${currentIndex * 250}px)` }"
                >
                  <div
                    v-for="(img, index) in displayImages"
                    :key="index"
                    class="w-[250px] shrink-0 px-1"
                  >
                    <img
                      :src="img"
                      draggable="false"
                      :alt="`公司照片 ${(index % totalOriginal) + 1}`"
                      class="h-[150px] w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <!-- Dots -->
              <div class="mt-2.5 flex items-center justify-center gap-2">
                <button
                  v-for="(_, index) in carouselImages"
                  :key="'dot-' + index"
                  @click="setIndex(index)"
                  class="h-1.5 rounded-full transition-all duration-300 ease-in-out"
                  :class="
                    index === currentIndex
                      ? 'w-6 bg-orange-700'
                      : 'w-1.5 bg-gray-500 hover:bg-gray-400'
                  "
                />
              </div>
            </div>

            <!-- Description -->
            <div
              class="prose text-16 mt-3 leading-relaxed text-gray-800 md:mt-[18px]"
              v-html="job.description"
            />
          </div>

          <!-- Footer: close button -->
          <div
            class="flex h-[52px] shrink-0 items-center justify-end border-t border-gray-500 px-2"
          >
            <button class="text-16 text-gray-1000 h-9 cursor-pointer px-3" @click="emit('close')">
              關閉
            </button>
          </div>
        </template>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* 動畫 1：backdrop 淡入/淡出 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* 動畫 2：modal card 向上滑入/向下滑出 */
.modal-enter-active .modal-card {
  transition:
    transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1),
    opacity 0.25s ease;
}
.modal-leave-active .modal-card {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}
.modal-enter-from .modal-card {
  transform: translateY(32px);
  opacity: 0;
}
.modal-leave-to .modal-card {
  transform: translateY(16px);
  opacity: 0;
}
.prose :deep(h1) {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.3rem;
  color: var(--color-gray-1100);
}
.prose :deep(h2) {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0.6rem 0 0.2rem;
}
.prose :deep(ul) {
  padding-left: 1.25rem;
  list-style: disc;
  margin: 0.25rem 0;
}
.prose :deep(li) {
  margin: 0.15rem 0;
}
</style>
