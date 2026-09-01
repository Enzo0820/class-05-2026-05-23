# FRC 得分排行榜

假日方案課程 W5（2026/05/23）課堂專案。使用 Next.js（App Router）+ TypeScript + Tailwind CSS，主題結合 FRC 機器人競賽。

## 功能

### 得分登錄
- 表單輸入隊伍編號／名稱與聯盟得分
- 輸入驗證：隊名不可空白、分數須為非負整數
- 送出後即時更新排行榜並顯示狀態提示

### 排行榜
- 依分數排序，前三名顯示獎牌，第一名額外標示皇冠
- 已知隊伍自動補上隊名（7632、254、1678、2056）
- 顯示目前參賽隊伍數
- 「重新整理」重新拉取資料
- 「全部清除」附二次確認對話框

### 背景動畫
- FRC 7632 機器人徽章從畫面四個方向隨機出現，沿貝茲曲線路徑飛過，帶旋轉與縮放
- 每 4 秒自動生成 1–2 個；送出分數或點擊標題時一次生成 15 個
- 以 CSS \`@keyframes\` 搭配 CSS 變數實作，節點在 10 秒後自動清除

## 專案結構

| 路徑 | 說明 |
|---|---|
| \`app/page.tsx\` | 主頁面（Client Component），狀態管理與 UI |
| \`app/api/scores/\` | Route Handler，提供 GET／POST／DELETE |
| \`app/globals.css\` | 全域樣式 |
| \`app/layout.tsx\` | 版面配置 |

排行榜資料以伺服器端 JSON 檔案保存。

## 執行方式

\`\`\`bash
npm install
npm run dev
\`\`\`

開啟 http://localhost:3000
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
