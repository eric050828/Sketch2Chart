// i18n.js - 國際化多語系支援

// 語言設定
const defaultLang = 'en';
let currentLang = localStorage.getItem('sketch2chart_lang') || defaultLang;

// 翻譯資料
const translations = {
  'en': {
    // 頁面標題和頭部
    'page-title': 'Sketch2Chart - Hand-drawn Sketch Converter',
    'header-title': 'Sketch2Chart',
    'header-subtitle': 'Convert hand-drawn sketches to structured code',
    
    // 標籤和按鈕
    'tab-canvas': 'Canvas',
    'tab-upload': 'Upload Image',
    
    // 工具按鈕
    'tool-pen': '✏️ Pencil',
    'tool-line': '📏 Line',
    'tool-rect': '⬜ Rectangle',
    'tool-circle': '⭕ Circle',
    'tool-text': '🔤 Text',
    'tool-eraser': '🧽 Eraser',
    'tool-clear': '🗑️ Clear',
    
    // 上傳區域
    'drop-zone-prompt': 'Drop image here or click to upload',
    'preview-title': 'Preview Image',
    'remove-image': 'Remove Image',
    
    // 描述與API
    'text-description-title': 'Text Description (Optional)',
    'text-description-placeholder': 'Enter additional text description or modification instructions...',
    'api-key': 'API Key',
    'api-key-placeholder': 'Enter your API key',
    'advanced-settings': '⚙️ Advanced Settings',
    
    // 行動按鈕
    'convert-btn': 'Convert to SVG',
    
    // 輸出區域
    'output-title': 'Conversion Result',
    'preview-section': 'Preview',
    'placeholder-text': 'Conversion result will be displayed here',
    'code-section': 'SVG Code',
    'copy-code': 'Copy Code',
    'download-svg': 'Download SVG',
    
    // 歷史記錄
    'history-title': 'History',
    'history-empty': 'No history records',
    
    // 進階設定模態視窗
    'modal-title': 'Advanced API Settings',
    'api-url': 'API Endpoint URL',
    'api-url-placeholder': 'e.g., https://api.openai.com/v1/chat/completions',
    'api-url-help': 'Enter an OpenAI-compatible API endpoint. Self-hosted LLMs or other compatible services can be configured here.',
    'model-select': 'Model Selection',
    'custom-model': 'Custom...',
    'custom-model-name': 'Custom Model Name',
    'custom-model-placeholder': 'Enter custom model name',
    'temperature': 'Temperature',
    'temperature-help': 'Lower values produce more deterministic results, higher values produce more diverse results',
    'max-tokens': 'Maximum Generated Tokens',
    'max-tokens-help': 'Limit the maximum length of the API response',
    'advanced-options': 'Advanced Options',
    'stream-response': 'Enable streaming response (if API supports it)',
    'save-settings': 'Save these settings',
    'reset-defaults': 'Reset to Defaults',
    'save-btn': 'Save Settings',
    
    // 頁尾
    'footer-text': 'Sketch2Chart',
    
    // 語言切換
    'language': 'Language',
    'lang-en': 'English',
    'lang-zh-tw': '繁體中文',
    
    // 錯誤和成功訊息
    'error-message': 'Error',
    'error-occurred': 'An error occurred',
    'code-copied': 'Code copied to clipboard',
    'copy-failed': 'Failed to copy code',
    'settings-saved': 'Settings saved successfully'
  },
  'zh-tw': {
    // 頁面標題和頭部
    'page-title': 'Sketch2Chart - 手繪轉換工具',
    'header-title': 'Sketch2Chart',
    'header-subtitle': '將手繪圖轉換為結構化代碼',
    
    // 標籤和按鈕
    'tab-canvas': '畫布',
    'tab-upload': '上傳圖片',
    
    // 工具按鈕
    'tool-pen': '✏️ 鉛筆',
    'tool-line': '📏 直線',
    'tool-rect': '⬜ 矩形',
    'tool-circle': '⭕ 圓形',
    'tool-text': '🔤 文字',
    'tool-eraser': '🧽 橡皮擦',
    'tool-clear': '🗑️ 清除',
    
    // 上傳區域
    'drop-zone-prompt': '拖放圖片到此處或點擊上傳',
    'preview-title': '預覽圖片',
    'remove-image': '移除圖片',
    
    // 描述與API
    'text-description-title': '文字描述（可選）',
    'text-description-placeholder': '請輸入額外的文字描述或修改指示...',
    'api-key': 'API金鑰',
    'api-key-placeholder': '請輸入您的API金鑰',
    'advanced-settings': '⚙️ 進階設定',
    
    // 行動按鈕
    'convert-btn': '轉換為SVG',
    
    // 輸出區域
    'output-title': '轉換結果',
    'preview-section': '預覽',
    'placeholder-text': '轉換結果將在此顯示',
    'code-section': 'SVG 程式碼',
    'copy-code': '複製代碼',
    'download-svg': '下載SVG',
    
    // 歷史記錄
    'history-title': '歷史記錄',
    'history-empty': '尚無歷史記錄',
    
    // 進階設定模態視窗
    'modal-title': '進階 API 設定',
    'api-url': 'API 端點 URL',
    'api-url-placeholder': '例如: https://api.openai.com/v1/chat/completions',
    'api-url-help': '輸入 OpenAI 相容的 API 端點。自架 LLM 或其他兼容服務可在此設定。',
    'model-select': '模型選擇',
    'custom-model': '自定義...',
    'custom-model-name': '自定義模型名稱',
    'custom-model-placeholder': '輸入自定義模型名稱',
    'temperature': '溫度 (Temperature)',
    'temperature-help': '較低的值產生更確定性結果，較高的值產生更多樣化結果',
    'max-tokens': '最大生成令牌數',
    'max-tokens-help': '限制API回應的最大長度',
    'advanced-options': '進階選項',
    'stream-response': '啟用串流回應（如果 API 支援）',
    'save-settings': '保存這些設定',
    'reset-defaults': '重設為預設值',
    'save-btn': '保存設定',
    
    // 頁尾
    'footer-text': 'Sketch2Chart',
    
    // 語言切換
    'language': '語言',
    'lang-en': 'English',
    'lang-zh-tw': '繁體中文',
    
    // 錯誤和成功訊息
    'error-message': '錯誤',
    'error-occurred': '發生錯誤',
    'code-copied': '程式碼已複製到剪貼簿',
    'copy-failed': '複製程式碼失敗',
    'settings-saved': '設定已成功儲存'
  }
};

// 翻譯函數
function __(key) {
  const text = translations[currentLang][key];
  return text || key; // 如果沒有翻譯則返回 key 本身
}

// 套用翻譯到頁面上
function applyTranslation() {
  // 設定頁面標題
  document.title = __('page-title');
  
  // 翻譯所有有 data-i18n 屬性的元素
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    
    // 根據元素類型不同，設置不同的屬性
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      if (element.getAttribute('placeholder')) {
        element.setAttribute('placeholder', __(key + '-placeholder'));
      }
      if (element.getAttribute('value') && element.type !== 'password' && element.type !== 'number') {
        element.value = __(key);
      }
    } else {
      element.textContent = __(key);
    }
  });
}

// 切換語言
function changeLang(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem('sketch2chart_lang', lang);
    applyTranslation();
    
    // 更新語言選擇器的狀態
    document.querySelectorAll('.lang-select').forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // 觸發自定義事件，通知其他模組語言已更改
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }
}

// 初始化語言功能
function initI18n() {
  // 創建語言選擇器
  const langSelector = document.createElement('div');
  langSelector.className = 'language-selector';
  
  const langLabel = document.createElement('span');
  langLabel.textContent = __('language') + ': ';
  langSelector.appendChild(langLabel);
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh-tw', name: '繁體中文' }
  ];
  
  languages.forEach(lang => {
    const btn = document.createElement('button');
    btn.className = `lang-select ${currentLang === lang.code ? 'active' : ''}`;
    btn.setAttribute('data-lang', lang.code);
    btn.textContent = lang.name;
    btn.addEventListener('click', () => changeLang(lang.code));
    langSelector.appendChild(btn);
  });
  
  // 將語言選擇器添加到頁面
  const header = document.querySelector('header');
  if (header) {
    header.appendChild(langSelector);
  }
  
  // 套用初始翻譯
  applyTranslation();
}

// 在DOM加載完成後初始化
document.addEventListener('DOMContentLoaded', initI18n);

// 匯出功能供其他模組使用
window.i18n = {
  __,
  getCurrentLang: () => currentLang,
  changeLang,
  applyTranslation
}; 