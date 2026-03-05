import { createServer } from 'miragejs'

import educationList from './data/educationList'
import jobList from './data/jobList'
import salaryList from './data/salaryList'

function filterJobs(data, companyName, educationLevel, salaryLevel) {
  let result = data

  if (companyName) {
    result = result.filter((item) => item.companyName.includes(companyName))
  }
  if (educationLevel) {
    result = result.filter((item) => item.educationId === educationLevel)
  }
  if (salaryLevel) {
    result = result.filter((item) => item.salaryId === salaryLevel)
  }

  return result
}

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,

    routes() {
      this.namespace = 'api/v1'

      this.get('/jobs', (_schema, request) => {
        const companyName = request.queryParams.company_name
        const educationLevel = Number(request.queryParams.education_level)
        const salaryLevel = Number(request.queryParams.salary_level)

        const prePage = Number(request.queryParams.pre_page)
        const page = Number(request.queryParams.page)

        const listItems = jobList.map(({ companyPhoto, description, ...rest }) => rest)
        const filtered = filterJobs(listItems, companyName, educationLevel, salaryLevel)

        if (!Number.isNaN(prePage) && !Number.isNaN(page) && prePage > 0 && page > 0) {
          const startIndex = (page - 1) * prePage
          const endIndex = startIndex + prePage
          return {
            data: filtered.slice(startIndex, endIndex),
            total: filtered.length,
          }
        }

        return {
          data: filtered,
          total: filtered.length,
        }
      })

      this.get('/educationLevelList', () => educationList)
      this.get('/salaryLevelList', () => salaryList)

      this.get('/jobs/:id', (_schema, request) => {
        const data = jobList.find((item) => item.id === request.params.id)

        if (!data) return []

        const { preview, educationId, salaryId, ...rest } = data
        void preview
        void educationId
        void salaryId
        return rest
      })
    },
  })
}

