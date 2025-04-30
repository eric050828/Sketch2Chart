# Sketch2Chart

[ [English](../README.md) | 繁體中文 ]

Sketch2Chart 是一個簡單易用的工具，能夠將手繪圖轉換成結構化的視覺代碼（Ex: SVG）。無論是流程圖、組織圖、示意圖或任何其他類型的圖表，Sketch2Chart 都能快速將您的手繪草圖轉換成可用的數位格式。

## 主要功能

- 🖌️ **簡易畫布**：提供類似小畫家的繪圖界面
- 📤 **圖片上傳**：支援上傳已有的手繪圖片
- 🔄 **智能轉換**：利用AI技術將手繪內容轉換為SVG等結構化格式
- 📝 **文字輔助**：可通過文字描述增強或修改輸出結果
- ✏️ **代碼編輯**：直接編輯生成的代碼，內建語法高亮
- 💾 **匯出功能**：下載生成的SVG或其他格式文件
- ⚙️ **進階設定**：自訂API端點、模型選擇及其他參數
- 📋 **歷史記錄**：保存先前轉換的結果，方便快速恢復和比較

## 使用方式

1. 下載原始碼
2. 使用瀏覽器直接開啟 `public/index.html` 文件
3. 點擊右上角齒輪圖標進行進階設定（可選）
4. 選擇使用畫布繪圖或上傳已有圖片
5. 點擊「轉換」按鈕進行處理
6. 根據需要編輯生成的代碼或添加文字描述
7. 下載或複製最終結果
8. 使用側邊欄查看和恢復之前轉換的圖表（歷史記錄）

## 技術架構

- 前端：HTML5, CSS3, JavaScript
- 繪圖：Canvas API
- 文件處理：FileReader API
- 代碼編輯：CodeMirror 5.65.13
- 視覺互動：SVG.js, SVG PanZoom
- AI整合：通過API連接多模態大語言模型

## 開發環境需求

- 現代瀏覽器（Chrome, Firefox, Edge 等）
- 網際網路連接（用於AI模型調用及CDN加載）

## 使用的外部套件

- [CodeMirror](https://codemirror.net/) - 用於代碼編輯與語法高亮
- [SVG.js](https://svgjs.dev/) - 用於SVG處理與互動
- [SVG PanZoom](https://github.com/ariutta/svg-pan-zoom) - 提供SVG縮放與平移功能

## 專案目錄結構

```
/sketch2chart
  ├── /docs               # 文件
  ├── /public             # 公共資源和靜態文件
  │    ├── index.html     # 主HTML文件
  │    ├── /css           # CSS文件
  │    │    └── styles.css
  │    ├── /js            # JavaScript文件
  │    │    ├── app.js    # 主應用邏輯
  │    │    └── canvas.js # 畫布相關功能
  │    └── /assets        # 圖片、圖標等靜態資源
  │         └── /images   
  ├── LICENSE             # 授權文件
  └── README.md           # 專案說明文件
```

## 未來規劃

- 前後端分離架構
- 提供獨立的API服務
- Python部署選項
- 支援更多輸出格式
- 優化模型效能及轉換精準度
- 擴充歷史記錄功能，加入分類和標籤

## 授權條款

MIT License 