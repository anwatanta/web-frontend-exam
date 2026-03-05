import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useJobsStore = defineStore('jobs', () => {
  const jobs = ref([])
  const total = ref(0)
  const loading = ref(false)
  const currentPage = ref(1)
  const perPage = ref(6)

  const totalPages = computed(() => Math.ceil(total.value / perPage.value))

  const filters = ref({
    companyName: '',
    educationLevel: '',
    salaryLevel: '',
  })

  async function fetchJobs() {
    loading.value = true
    try {
      const params = new URLSearchParams({
        page: currentPage.value,
        pre_page: perPage.value,
      })
      if (filters.value.companyName) {
        params.set('company_name', filters.value.companyName)
      }
      if (filters.value.educationLevel) {
        params.set('education_level', filters.value.educationLevel)
      }
      if (filters.value.salaryLevel) {
        params.set('salary_level', filters.value.salaryLevel)
      }

      const res = await fetch(`/api/v1/jobs?${params}`)
      const data = await res.json()
      jobs.value = data.data
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  function setPage(page) {
    currentPage.value = page
    fetchJobs()
  }

  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
    currentPage.value = 1
    fetchJobs()
  }

  function setPerPage(value) {
    perPage.value = value
    currentPage.value = 1
    fetchJobs()
  }

  return { jobs, total, loading, currentPage, perPage, totalPages, filters, fetchJobs, setPage, setFilters, setPerPage }
})
