const COMPANY_PHOTOS = [
  'https://picsum.photos/640/360',
  'https://picsum.photos/640/360',
  'https://picsum.photos/640/360',
  'https://picsum.photos/640/360',
  'https://picsum.photos/640/360',
]

const DESCRIPTION_HTML =
  '<h1>工作內容</h1>' +
  '<h2>職責與要求</h2>' +
  '<ul><li>這裡是示意用的描述（HTML 字串）。</li></ul>' +
  '<h2>我們提供</h2>' +
  '<ul><li>良好的團隊合作與成長機會。</li></ul>'

const templates = [
  {
    companyName: '立刻科技',
    jobTitle: '資深前端工程師',
    educationId: 4,
    salaryId: 3,
    preview: '招募經驗豐富的前端工程師，共創卓越網頁體驗！',
  },
  {
    companyName: '品味設計',
    jobTitle: '視覺設計師',
    educationId: 5,
    salaryId: 2,
    preview: '尋找具備創意與想像力的視覺設計師，共同打造獨特視覺風格！',
  },
  {
    companyName: '快速服務',
    jobTitle: '客戶服務專員',
    educationId: 2,
    salaryId: 1,
    preview: '招聘熱忱的客戶服務專員，共同維護客戶滿意度！',
  },
  {
    companyName: '數據科技',
    jobTitle: '數據分析師',
    educationId: 3,
    salaryId: 4,
    preview: '招聘數據分析師，解讀數據背後的故事，一同創造價值！',
  },
  {
    companyName: '創意工場',
    jobTitle: 'UI/UX 設計師',
    educationId: 6,
    salaryId: 5,
    preview: '招募對 UI/UX 設計充滿熱情的設計師，共同打造極致用戶體驗！',
  },
  {
    companyName: '餐飲樂活',
    jobTitle: '廚師助手',
    educationId: 1,
    salaryId: 2,
    preview: '招募熱愛烹飪的廚師助手，共同營造美味料理的魔法！',
  },
]

export const jobs = Array.from({ length: 36 }, (_, index) => {
  const id = String(index + 1)
  const t = templates[index % templates.length]
  return {
    id,
    ...t,
    companyPhoto: COMPANY_PHOTOS,
    description: DESCRIPTION_HTML,
  }
})

