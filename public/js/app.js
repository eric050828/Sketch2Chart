document.addEventListener('DOMContentLoaded', function() {
    // DOM元素
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const resultTabBtns = document.querySelectorAll('.result-tab-btn');
    const resultContents = document.querySelectorAll('.result-content');
    const convertBtn = document.getElementById('convert-btn');
    const copyCodeBtn = document.getElementById('copy-code-btn');
    const downloadSvgBtn = document.getElementById('download-svg-btn');
    const codeEditorTextarea = document.getElementById('code-editor');
    const svgPreview = document.getElementById('svg-preview');
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const previewContainer = document.getElementById('preview-container');
    const clearImageBtn = document.getElementById('clear-image');
    const dropZone = document.querySelector('.drop-zone');
    const apiKey = document.getElementById('api-key');
    const textInput = document.getElementById('text-input');
    
    // 進階設定元素
    const advancedSettingsBtn = document.getElementById('advanced-settings-btn');
    const advancedSettingsModal = document.getElementById('advanced-settings-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const resetDefaultsBtn = document.getElementById('reset-defaults-btn');
    const apiUrl = document.getElementById('api-url');
    const apiModel = document.getElementById('api-model');
    const customModelContainer = document.getElementById('custom-model-container');
    const customModel = document.getElementById('custom-model');
    const temperature = document.getElementById('temperature');
    const temperatureValue = document.getElementById('temperature-value');
    const maxTokens = document.getElementById('max-tokens');
    const streamResponse = document.getElementById('stream-response');
    const saveSettings = document.getElementById('save-settings');
    
    // API設定默認值
    const defaultApiSettings = {
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4-vision-preview',
        customModel: '',
        temperature: 0.7,
        maxTokens: 4000,
        streamResponse: true,
        saveSettings: true
    };
    
    // 當前API設定
    let apiSettings = {...defaultApiSettings};
    
    // 初始化CodeMirror編輯器
    let codeEditor;
    
    function initCodeMirror() {
        codeEditor = CodeMirror.fromTextArea(codeEditorTextarea, {
            mode: "xml",
            htmlMode: true,
            theme: "dracula",
            lineNumbers: true,
            indentUnit: 2,
            tabSize: 2,
            autoCloseTags: true,
            matchBrackets: true,
            lineWrapping: true,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            extraKeys: {
                "Ctrl-Space": "autocomplete",
                "Ctrl-Q": function(cm) {
                    cm.foldCode(cm.getCursor());
                }
            }
        });
        
        // 當視窗大小改變時，調整編輯器大小
        window.addEventListener('resize', function() {
            codeEditor.refresh();
        });
        
        // 當切換到程式碼頁籤時刷新編輯器
        document.querySelector('.result-tab-btn[data-target="code-section"]').addEventListener('click', function() {
            setTimeout(() => {
                codeEditor.refresh();
            }, 10);
        });
    }
    
    // 初始化編輯器
    initCodeMirror();

    // 標籤切換功能
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            
            // 更新按鈕狀態
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 更新內容區域
            tabContents.forEach(content => {
                if (content.id === target) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });
        });
    });

    // 結果標籤切換功能
    resultTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            
            // 更新按鈕狀態
            resultTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 更新內容區域
            resultContents.forEach(content => {
                if (content.id === target) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });
        });
    });

    // 圖片上傳功能
    imageUpload.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            
            // 檢查文件類型
            if (!file.type.match('image.*')) {
                alert('請上傳圖片文件！');
                return;
            }
            
            // 顯示預覽
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                previewContainer.classList.remove('hidden');
                dropZone.querySelector('.drop-zone-prompt').style.display = 'none';
            }
            reader.readAsDataURL(file);
        }
    });

    // 拖放功能
    ['dragover', 'dragenter'].forEach(eventName => {
        dropZone.addEventListener(eventName, function(e) {
            e.preventDefault();
            this.classList.add('drop-zone-active');
        }, false);
    });
    
    ['dragleave', 'dragend'].forEach(eventName => {
        dropZone.addEventListener(eventName, function(e) {
            e.preventDefault();
            this.classList.remove('drop-zone-active');
        }, false);
    });
    
    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drop-zone-active');
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            imageUpload.files = e.dataTransfer.files;
            const event = new Event('change');
            imageUpload.dispatchEvent(event);
        }
    }, false);

    // 點擊上傳區域觸發文件選擇
    dropZone.addEventListener('click', function() {
        imageUpload.click();
    });

    // 清除上傳的圖片
    clearImageBtn.addEventListener('click', function() {
        imagePreview.src = '';
        imageUpload.value = '';
        previewContainer.classList.add('hidden');
        dropZone.querySelector('.drop-zone-prompt').style.display = 'block';
    });

    // 進階設定按鈕事件
    advancedSettingsBtn.addEventListener('click', function() {
        advancedSettingsModal.classList.remove('hidden');
    });
    
    // 關閉模態視窗按鈕事件
    closeModalBtn.addEventListener('click', function() {
        advancedSettingsModal.classList.add('hidden');
    });
    
    // 點擊模態視窗外部關閉
    advancedSettingsModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });
    
    // 模型選擇變更事件
    apiModel.addEventListener('change', function() {
        if (this.value === 'custom') {
            customModelContainer.classList.remove('hidden');
        } else {
            customModelContainer.classList.add('hidden');
        }
    });
    
    // 溫度滑桿變更事件
    temperature.addEventListener('input', function() {
        temperatureValue.textContent = this.value;
    });
    
    // 保存設定按鈕事件
    saveSettingsBtn.addEventListener('click', function() {
        // 更新設定
        apiSettings.apiUrl = apiUrl.value;
        apiSettings.model = apiModel.value === 'custom' ? customModel.value : apiModel.value;
        apiSettings.customModel = customModel.value;
        apiSettings.temperature = parseFloat(temperature.value);
        apiSettings.maxTokens = parseInt(maxTokens.value);
        apiSettings.streamResponse = streamResponse.checked;
        apiSettings.saveSettings = saveSettings.checked;
        
        // 保存設定到本地存儲
        if (saveSettings.checked) {
            localStorage.setItem('sketch2chart_api_settings', JSON.stringify(apiSettings));
        }
        
        // 關閉模態視窗
        advancedSettingsModal.classList.add('hidden');
        
        // 顯示提示
        showToast('設定已保存');
    });
    
    // 重設為預設值按鈕事件
    resetDefaultsBtn.addEventListener('click', function() {
        // 重設為預設值
        apiSettings = {...defaultApiSettings};
        
        // 更新UI
        updateSettingsUI();
        
        // 顯示提示
        showToast('已重設為預設值');
    });
    
    // 轉換按鈕點擊事件
    convertBtn.addEventListener('click', function() {
        // 檢查API金鑰
        if (!apiKey.value.trim()) {
            alert('請輸入API金鑰！');
            return;
        }
        
        // 顯示加載狀態
        this.disabled = true;
        this.innerHTML = '處理中...';
        svgPreview.innerHTML = '<div class="placeholder">正在處理您的圖片，請稍候...</div>';
        
        // 調用API
        callApi();
    });

    // 調用API
    async function callApi() {
        try {
            // 準備畫布或圖片數據
            let imageData = null;
            
            // 如果上傳了圖片
            if (imagePreview.src && !imagePreview.src.endsWith('alt="預覽圖片"')) {
                imageData = imagePreview.src;
            } else {
                // 否則使用畫布
                const canvas = document.getElementById('drawing-canvas');
                imageData = canvas.toDataURL('image/png');
            }
            
            // 準備請求數據
            const requestData = prepareRequestData(imageData);
            
            // 發送API請求
            const response = await sendApiRequest(requestData);
            
            // 處理回應
            processSvgResponse(response);
        } catch (error) {
            // 處理錯誤
            handleApiError(error);
        }
    }
    
    // 準備API請求數據
    function prepareRequestData(imageData) {
        // 獲取當前設定的模型
        const model = apiSettings.model;
        
        // 創建消息內容
        const messages = [
            {
                role: "system",
                content: "You are a skilled assistant that converts hand-drawn sketches into SVG code. Your task is to analyze the provided image and generate clean, optimized SVG code that accurately represents the sketch. Focus on precision and maintain the original layout and proportions."
            },
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: textInput.value || "Please convert this hand-drawn sketch into SVG code."
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: imageData
                        }
                    }
                ]
            }
        ];
        
        // 返回請求數據對象
        return {
            model: model,
            messages: messages,
            max_tokens: apiSettings.maxTokens,
            temperature: apiSettings.temperature,
            stream: apiSettings.streamResponse
        };
    }
    
    // 發送API請求
    async function sendApiRequest(requestData) {
        // 發送請求
        const response = await fetch(apiSettings.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey.value}`
            },
            body: JSON.stringify(requestData)
        });
        
        // 檢查回應狀態
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API請求失敗：${response.status} ${errorText}`);
        }
        
        // 返回回應數據
        if (apiSettings.streamResponse) {
            return response; // 返回響應對象以進行流處理
        } else {
            return await response.json();
        }
    }
    
    // 處理SVG回應
    async function processSvgResponse(response) {
        try {
            let svgCode = '';
            
            if (apiSettings.streamResponse) {
                // 處理串流回應
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';
                
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    // 解碼數據
                    const chunk = decoder.decode(value, { stream: true });
                    buffer += chunk;
                    
                    // 解析回應
                    const lines = buffer.split('\n');
                    buffer = lines.pop(); // 保留最後一行作為下一個緩衝
                    
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.substring(6);
                            if (data === '[DONE]') continue;
                            
                            try {
                                const json = JSON.parse(data);
                                const content = json.choices[0].delta.content;
                                if (content) svgCode += content;
                            } catch (e) {
                                console.warn('解析串流數據時出錯:', e);
                            }
                        }
                    }
                }
            } else {
                // 處理非串流回應
                const content = response.choices[0].message.content;
                // 提取SVG代碼 (假設回應中包含純SVG代碼)
                svgCode = extractSvgCode(content);
            }
            
            // 更新預覽和代碼編輯器
            if (svgCode) {
                // 更新預覽
                svgPreview.innerHTML = svgCode;
                
                // 使用CodeMirror編輯器設定內容
                codeEditor.setValue(svgCode);
                codeEditor.refresh();
                
                // 啟用按鈕
                copyCodeBtn.disabled = false;
                downloadSvgBtn.disabled = false;
            } else {
                throw new Error('未能從API回應中提取SVG代碼');
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            // 恢復按鈕狀態
            convertBtn.disabled = false;
            convertBtn.innerHTML = '轉換為SVG';
        }
    }
    
    // 從回應文本中提取SVG代碼
    function extractSvgCode(text) {
        // 假設回應只包含乾淨的SVG代碼
        // 如果回應包含其他文本，可以使用正則表達式提取<svg>...</svg>部分
        if (text.trim().startsWith('<svg') && text.trim().endsWith('</svg>')) {
            return text.trim();
        }
        
        // 嘗試從文本中提取SVG代碼
        const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/i);
        return svgMatch ? svgMatch[0] : text.trim();
    }
    
    // 處理API錯誤
    function handleApiError(error) {
        console.error('API錯誤:', error);
        
        // 更新UI
        svgPreview.innerHTML = `<div class="placeholder error">發生錯誤：${error.message}</div>`;
        convertBtn.disabled = false;
        convertBtn.innerHTML = '轉換為SVG';
    }
    
    // 複製代碼按鈕
    copyCodeBtn.addEventListener('click', function() {
        if (codeEditor.getValue()) {
            // 使用Clipboard API複製
            navigator.clipboard.writeText(codeEditor.getValue())
                .then(() => {
                    // 顯示複製成功提示
                    const originalText = this.textContent;
                    this.textContent = '已複製!';
                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 1500);
                })
                .catch(err => {
                    console.error('無法複製文本: ', err);
                    
                    // 舊的複製方法作為後備
                    const textarea = document.createElement('textarea');
                    textarea.value = codeEditor.getValue();
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    
                    // 顯示複製成功提示
                    const originalText = this.textContent;
                    this.textContent = '已複製!';
                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 1500);
                });
        }
    });

    // 下載SVG按鈕
    downloadSvgBtn.addEventListener('click', function() {
        const svgContent = codeEditor.getValue();
        if (svgContent) {
            const blob = new Blob([svgContent], {type: 'image/svg+xml'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'sketch2chart.svg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    });

    // 讀取本地存儲的API金鑰
    const savedApiKey = localStorage.getItem('sketch2chart_api_key');
    if (savedApiKey) {
        apiKey.value = savedApiKey;
    }

    // 保存API金鑰到本地存儲
    apiKey.addEventListener('change', function() {
        localStorage.setItem('sketch2chart_api_key', this.value);
    });
    
    // 載入保存的設定
    function loadSavedSettings() {
        const savedSettings = localStorage.getItem('sketch2chart_api_settings');
        
        if (savedSettings) {
            try {
                // 解析保存的設定
                const parsed = JSON.parse(savedSettings);
                
                // 更新當前設定
                apiSettings = { ...apiSettings, ...parsed };
                
                // 更新UI
                updateSettingsUI();
            } catch (error) {
                console.error('載入設定失敗:', error);
            }
        } else {
            // 使用默認設定
            apiSettings = { ...defaultApiSettings };
            updateSettingsUI();
        }
    }
    
    // 更新設定UI
    function updateSettingsUI() {
        // 更新URL
        apiUrl.value = apiSettings.apiUrl;
        
        // 更新模型選擇
        if (apiSettings.model === apiSettings.customModel) {
            apiModel.value = 'custom';
            customModel.value = apiSettings.customModel;
            customModelContainer.classList.remove('hidden');
        } else {
            apiModel.value = apiSettings.model;
            customModel.value = apiSettings.customModel;
            customModelContainer.classList.add('hidden');
        }
        
        // 更新溫度
        temperature.value = apiSettings.temperature;
        temperatureValue.textContent = apiSettings.temperature;
        
        // 更新最大令牌數
        maxTokens.value = apiSettings.maxTokens;
        
        // 更新選項
        streamResponse.checked = apiSettings.streamResponse;
        saveSettings.checked = apiSettings.saveSettings;
    }
    
    // 顯示提示信息
    function showToast(message) {
        // 如果已有提示，先移除
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            document.body.removeChild(existingToast);
        }
        
        // 創建提示元素
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        // 添加到頁面
        document.body.appendChild(toast);
        
        // 顯示動畫
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // 自動隱藏
        setTimeout(() => {
            toast.classList.remove('show');
            
            // 隱藏後移除
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // 初始化載入設定
    loadSavedSettings();
}); 