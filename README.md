# Web Frontend Exam — Vue

本專案為 Yile 前端工程師徵才作業，根據 Figma 設計稿實作職缺列表與詳細資訊頁面。

🔗 **線上展示**：[https://anwatanta.github.io/web-frontend-exam/](https://anwatanta.github.io/web-frontend-exam/)

---

## 如何執行此專案

### 環境需求

- Node.js `^20.19.0` 或 `>=22.12.0`
- npm

### 安裝與啟動

```bash
# 1. 安裝依賴
npm install

# 2. 啟動開發伺服器
npm run dev
```

開啟瀏覽器前往 `http://localhost:5173`

### 打包

```bash
npm run build
```

輸出至 `dist/` 目錄。

### 程式碼檢查

```bash
npm run lint
```

---

## 專案架構

```
src/
├── assets/
│   ├── main.css          # 全域樣式（含 Tailwind 匯入與自訂 CSS 變數）
│   ├── icon/             # SVG 圖示
│   └── image/            # 頁面用圖片（人物、背景、旋轉文字）
├── components/
│   ├── AppIcon.vue       # 通用 SVG 圖示元件
│   ├── JobCard.vue       # 職缺卡片元件
│   ├── JobDetailModal.vue # 職缺詳細資訊 Modal（含輪播）
│   └── icons/
│       └── SvgSprite.vue # SVG Sprite 定義
├── mirage/
│   ├── server.js         # MirageJS Mock API Server 設定
│   └── data/
│       ├── jobList.js    # 職缺假資料
│       ├── educationList.js
│       └── salaryList.js
├── router/
│   └── index.js          # Vue Router 路由設定
├── stores/
│   └── jobs.js           # Pinia Store（職缺列表狀態與 API 呼叫）
├── views/
│   └── HomeView.vue      # 首頁（Hero + 篩選器 + 職缺列表 + 分頁）
├── App.vue
└── main.js
```

### 技術選型

| 項目 | 技術 |
|------|------|
| 框架 | Vue 3 (Composition API) |
| 建置工具 | Vite |
| 樣式 | Tailwind CSS v4 |
| 狀態管理 | Pinia |
| 路由 | Vue Router |
| Mock API | MirageJS |
| 部署 | GitHub Pages（GitHub Actions 自動部署） |

### 資料流邏輯

1. **Mock API**：使用 MirageJS 攔截所有 `fetch` 請求，模擬後端 API（`/api/v1/jobs`、`/api/v1/educationLevelList`、`/api/v1/salaryLevelList`）。
2. **Pinia Store（`jobs.js`）**：集中管理職缺列表、分頁（`currentPage`、`perPage`）、篩選條件（`filters`）、載入狀態（`loading`）。提供 `setPage()`、`setFilters()`、`setPerPage()` 方法，每次呼叫都會重新打 API 取得資料。
3. **HomeView**：掛載時同時呼叫 `fetchFilterOptions()`（取得教育程度、薪資清單）與 `store.setPerPage()`（依螢幕寬度決定每頁數量）。篩選器變更後呼叫 `store.setFilters()`，頁碼自動重設為第 1 頁。
4. **JobDetailModal**：接收 `jobId` prop，透過 `watch` 監聽變化，有值時打 `/api/v1/jobs/:id` 取得詳細資料。

---

## 專案遇到的困難、問題及解決方法

### 1. 部署後 API 全部回傳 404

**問題**：MirageJS 只在開發模式啟動（`if (import.meta.env.DEV)`），打包後 mock server 不存在，所有 API 呼叫都打到 GitHub Pages，回傳 404 HTML，導致 `SyntaxError: Unexpected token '<'`。

**解決**：移除 DEV 條件判斷，讓 MirageJS 在所有環境（包含 production build）都正常運作。

```js
// 修改前
if (import.meta.env.DEV) {
  makeServer()
}

// 修改後
makeServer()
```

---

### 2. 部署後 CSS 回傳 404

**問題**：`index.html` 中有一行 `<link href="/src/style.css" rel="stylesheet" />`，但專案並不存在此檔案（CSS 是透過 `main.js` 的 `import './assets/main.css'` 匯入），Vite 無法識別此路徑，也不會自動加上 base 前綴，導致瀏覽器嘗試載入 `/src/style.css` 而 404。

**解決**：直接從 `index.html` 移除這行多餘的 link 標籤。

---

### 3. 圖片輪播無縫循環

**問題**：Modal 內的公司照片輪播，若直接以 index 對 5 張圖取模，切換到最後一張後再往下滑會有明顯跳回的視覺問題。

**解決**：將原始圖片陣列複製一份並拼接（`[...images, ...images]`），讓使用者操作時滑入「複本」部分，感覺上是無縫的，實際 index 僅對原始長度取模。

---

### 4. 人物眼睛追蹤滑鼠

**問題**：Hero 區域的人物眼睛需要跟隨滑鼠移動，但眼睛偏移量若太大或直接用絕對座標計算，容易讓眼睛跑出眼眶。

**解決**：計算滑鼠相對於人物中心的水平距離，除以固定係數後做 `Math.min` 限制最大偏移量，兩顆眼睛使用不同係數（`2` 和 `1`）模擬立體感。

---

### 5. RWD 每頁筆數自動切換

**問題**：手機版每頁顯示 4 筆、桌機版 6 筆，視窗大小改變時需要重新取資料。

**解決**：監聽 `resize` 事件，比較新舊 `perPage` 值，只在實際改變時才呼叫 `store.setPerPage()`，避免多餘的 API 呼叫。

---

### 6. 手機版分頁按鈕數量限制

**問題**：若職缺數量多，分頁按鈕會在手機螢幕上超出版面。

**解決**：以 `computed` 計算 `visiblePages`，手機版最多顯示 6 個頁碼，以當前頁為中心向兩側展開，並處理接近首尾的邊界情況。
