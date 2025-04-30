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
    const historyPreviewsContainer = document.getElementById('history-previews');
    
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
    
    // 縮放控制按鈕
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomResetBtn = document.getElementById('zoom-reset');
    
    // SVG.js 相關變數
    let svgDrawing = null;
    let svgContainer = null;
    const ZOOM_STEP = 0.2; // 每次縮放的步進值
    
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
    
    // 歷史記錄相關變數
    const MAX_HISTORY_ITEMS = 20;
    let historyItems = [];
    
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
        
        // 添加編輯器內容變更事件監聽，即時更新預覽
        let updateTimer = null;
        codeEditor.on('change', function() {
            clearTimeout(updateTimer);
            updateTimer = setTimeout(function() {
                const svgCode = codeEditor.getValue();
                if (svgCode && svgCode.trim().startsWith('<svg')) {
                    // 當用戶手動編輯代碼時，我們不希望保存到歷史記錄
                    updateSvgPreview(svgCode, true);
                }
            }, 300);  // 300ms 的防抖動延遲
        });
    }
    
    // 更新SVG預覽
    async function updateSvgPreview(svgCode, fromHistory = false) {
        // 清除現有內容
        svgPreview.innerHTML = '';
        
        // 創建SVG容器
        svgContainer = document.createElement('div');
        svgContainer.id = 'svg-container';
        svgContainer.style.width = '100%';
        svgContainer.style.height = '100%';
        svgPreview.appendChild(svgContainer);
        
        try {
            // 初始化SVG.js繪圖
            svgDrawing = SVG().addTo('#svg-container').size('100%', '100%');
            
            // 解析SVG代碼
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgCode, 'image/svg+xml');
            const svgElement = svgDoc.documentElement;
            
            // 獲取SVG的viewBox屬性
            let viewBox = svgElement.getAttribute('viewBox');
            if (!viewBox) {
                const width = svgElement.getAttribute('width') || 800;
                const height = svgElement.getAttribute('height') || 600;
                viewBox = `0 0 ${width} ${height}`;
            }
            
            // 設置SVG.js繪圖的viewBox
            svgDrawing.attr('viewBox', viewBox);
            
            // 將SVG代碼添加到SVG.js繪圖中
            svgDrawing.svg(svgCode);
            
            // 啟用平移和縮放功能
            svgDrawing.panZoom({
                zoomMin: 0.5,
                zoomMax: 10,
                zoomFactor: 0.1
            });
            
            // 啟用按鈕
            zoomInBtn.disabled = false;
            zoomOutBtn.disabled = false;
            zoomResetBtn.disabled = false;
            copyCodeBtn.disabled = false;
            downloadSvgBtn.disabled = false;
            
            // 如果不是從歷史記錄載入的圖像，保存到歷史
            if (!fromHistory && svgCode) {
                await saveToHistory(svgCode);
            }
        } catch (error) {
            console.error('SVG渲染錯誤:', error);
            svgPreview.innerHTML = `<div class="placeholder error">SVG渲染錯誤: ${error.message}</div>`;
        }
    }
    
    // 縮放控制按鈕事件
    zoomInBtn.addEventListener('click', function() {
        if (svgDrawing) {
            const zoom = svgDrawing.zoom();
            svgDrawing.zoom(zoom + ZOOM_STEP);
        }
    });
    
    zoomOutBtn.addEventListener('click', function() {
        if (svgDrawing) {
            const zoom = svgDrawing.zoom();
            svgDrawing.zoom(Math.max(0.1, zoom - ZOOM_STEP));
        }
    });
    
    zoomResetBtn.addEventListener('click', function() {
        if (svgDrawing) {
            svgDrawing.zoom(1);
            svgDrawing.panTo(0, 0);
        }
    });
    
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

    // 轉換按鈕點擊事件 - 這個事件處理程序將在初始化函數中設置
    let isProcessing = false; // 防止重複點擊
    function handleConvertButtonClick() {
        // 如果已經在處理中，則忽略
        if (isProcessing) return;
        
        // 檢查API金鑰
        if (!apiKey.value.trim()) {
            alert('請輸入API金鑰！');
            return;
        }
        
        // 標記正在處理
        isProcessing = true;
        
        // 顯示加載狀態
        convertBtn.disabled = true;
        convertBtn.innerHTML = '處理中...';
        svgPreview.innerHTML = '<div class="placeholder">正在處理您的圖片，請稍候...</div>';
        
        // 調用API
        callApi().finally(() => {
            // 恢復按鈕狀態
            convertBtn.disabled = false;
            convertBtn.innerHTML = '轉換為SVG';
            isProcessing = false;
        });
    }

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
            await processSvgResponse(response);
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
                        text: (textInput.value ? `${textInput.value}\n` : "") + "Please convert this hand-drawn sketch into SVG code."
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
                // 設置編輯器內容
                codeEditor.setValue(svgCode);
                codeEditor.refresh();
                
                // 更新SVG預覽 - 不在此處保存歷史記錄，將在updateSvgPreview中處理
                await updateSvgPreview(svgCode, false);
                
                // 啟用按鈕
                copyCodeBtn.disabled = false;
                downloadSvgBtn.disabled = false;
            } else {
                throw new Error('未能從API回應中提取SVG代碼');
            }
        } catch (error) {
            handleApiError(error);
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
        console.error('API Error:', error);
        
        let errorMessage;
        if (typeof error === 'object' && error.message) {
            errorMessage = error.message;
        } else {
            errorMessage = error.toString();
        }
        
        svgPreview.innerHTML = `<div class="placeholder error">${window.i18n.__('error-message')}: ${errorMessage}</div>`;
        
        // 顯示錯誤提示吐司訊息
        showToast(`${window.i18n.__('error-occurred')}: ${errorMessage}`);
        
        // 啟用轉換按鈕
        convertBtn.disabled = false;
        convertBtn.innerHTML = window.i18n.__('convert-btn');
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
        // 檢查是否已有吐司訊息
        let toast = document.querySelector('.toast');
        
        if (toast) {
            // 如果已有吐司，則更新內容並重設超時
            toast.textContent = message;
            toast.classList.add('show');
            
            // 清除現有的超時
            if (toast.timeoutId) {
                clearTimeout(toast.timeoutId);
            }
        } else {
            // 創建新的吐司元素
            toast = document.createElement('div');
            toast.className = 'toast';
            toast.textContent = message;
            document.body.appendChild(toast);
            
            // 延遲一點點，讓CSS過渡效果正常工作
            setTimeout(() => {
                toast.classList.add('show');
            }, 10);
        }
        
        // 設置超時以自動關閉吐司
        toast.timeoutId = setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                // 超時後移除吐司元素
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300); // 等待過渡效果完成
        }, 3000);
    }
    
    // 監聽語言變更事件，更新模型選項顯示
    document.addEventListener('languageChanged', function(event) {
        // 更新自定義選項文字
        const customOption = apiModel.querySelector('option[value="custom"]');
        if (customOption) {
            customOption.textContent = window.i18n.__('custom-model');
        }
        
        // 更新錯誤訊息顯示
        const placeholderError = document.querySelector('.placeholder.error');
        if (placeholderError) {
            const errorMessage = placeholderError.textContent.split(': ')[1] || '';
            placeholderError.textContent = `${window.i18n.__('error-message')}: ${errorMessage}`;
        }
        
        // 更新預覽圖片的alt屬性
        if (imagePreview) {
            imagePreview.alt = window.i18n.__('preview-title');
        }
    });
    
    // 歷史記錄功能
    async function saveToHistory(svgCode) {
        if (!svgCode || svgCode.trim() === '') return;
        
        // 簡單雜湊函數
        const simpleHash = (str) => {
            return str.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 0);
        };
        
        // 檢查是否已經存在相同的SVG
        if (historyItems.length > 0) {
            const newHash = simpleHash(svgCode);
            
            // 檢查最新項目是否相同 (避免短時間內重複添加相同的SVG)
            if (historyItems[0]._hash === newHash) {
                return; // 不添加重複項目
            }
        }
        
        // 創建一個歷史項目
        const timestamp = new Date();
        try {
            const dataUrl = await generateSvgThumbnail(svgCode);
            const historyItem = {
                id: `history-${Date.now()}`,
                timestamp: timestamp,
                svgCode: svgCode,
                thumbnail: dataUrl,
                description: textInput.value || "",
                _hash: simpleHash(svgCode)
            };
            
            // 添加到歷史數組
            historyItems.unshift(historyItem);
            
            // 限制歷史項目數量
            if (historyItems.length > MAX_HISTORY_ITEMS) {
                historyItems = historyItems.slice(0, MAX_HISTORY_ITEMS);
            }
            
            // 保存到localStorage
            saveHistoryToStorage();
            
            // 更新UI
            renderHistoryItems();
        } catch (error) {
            console.error('保存歷史記錄失敗:', error);
        }
    }
    
    function generateSvgThumbnail(svgCode) {
        // 創建一個暫時的SVG容器來生成縮圖
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.width = '800px';
        tempContainer.style.height = '600px';
        document.body.appendChild(tempContainer);
        
        // 設置SVG內容
        tempContainer.innerHTML = svgCode;
        const svgElement = tempContainer.querySelector('svg');
        
        // 用canvas生成縮圖
        try {
            const svgString = new XMLSerializer().serializeToString(svgElement);
            const canvas = document.createElement('canvas');
            canvas.width = 240; // 縮圖寬度
            canvas.height = 160; // 縮圖高度
            
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const img = new Image();
            img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
            
            return new Promise((resolve) => {
                img.onload = function() {
                    // 計算縮放比例以適應縮圖尺寸
                    const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.9;
                    const x = (canvas.width - img.width * scale) / 2;
                    const y = (canvas.height - img.height * scale) / 2;
                    
                    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                    document.body.removeChild(tempContainer);
                    resolve(canvas.toDataURL('image/png'));
                };
                
                img.onerror = function() {
                    // 錯誤處理 - 返回一個空白縮圖
                    document.body.removeChild(tempContainer);
                    resolve(canvas.toDataURL('image/png'));
                };
            });
        } catch (error) {
            console.error('生成縮圖錯誤:', error);
            document.body.removeChild(tempContainer);
            
            // 創建一個簡單的預設縮圖
            const canvas = document.createElement('canvas');
            canvas.width = 240;
            canvas.height = 160;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = '16px Arial';
            ctx.fillStyle = '#999';
            ctx.textAlign = 'center';
            ctx.fillText('預覽不可用', canvas.width / 2, canvas.height / 2);
            
            return canvas.toDataURL('image/png');
        }
    }
    
    function renderHistoryItems() {
        // 清空容器
        historyPreviewsContainer.innerHTML = '';
        
        if (historyItems.length === 0) {
            historyPreviewsContainer.innerHTML = '<div class="placeholder">尚無歷史記錄</div>';
            return;
        }
        
        // 渲染每個歷史項目
        historyItems.forEach(item => {
            const historyElement = document.createElement('div');
            historyElement.className = 'history-item';
            historyElement.dataset.id = item.id;
            
            // 添加縮圖
            const img = document.createElement('img');
            img.src = item.thumbnail;
            img.alt = '轉換結果預覽';
            historyElement.appendChild(img);
            
            // 添加日期標籤
            const dateLabel = document.createElement('div');
            dateLabel.className = 'history-date';
            dateLabel.textContent = formatDate(item.timestamp);
            historyElement.appendChild(dateLabel);
            
            // 添加刪除按鈕
            const deleteBtn = document.createElement('div');
            deleteBtn.className = 'delete-history';
            deleteBtn.textContent = '×';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteHistoryItem(item.id);
            });
            historyElement.appendChild(deleteBtn);
            
            // 點擊載入該歷史項目
            historyElement.addEventListener('click', () => {
                loadHistoryItem(item);
            });
            
            historyPreviewsContainer.appendChild(historyElement);
        });
    }
    
    function loadHistoryItem(item) {
        // 設置編輯器內容
        codeEditor.setValue(item.svgCode);
        
        // 設置描述（如果有）
        textInput.value = item.description;
        
        // 更新SVG預覽（fromHistory=true表示來自歷史記錄，不要重複保存）
        updateSvgPreview(item.svgCode, true);
        
        // 標記活動項目
        const historyElements = document.querySelectorAll('.history-item');
        historyElements.forEach(el => {
            if (el.dataset.id === item.id) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    }
    
    function deleteHistoryItem(id) {
        // 過濾掉要刪除的項目
        historyItems = historyItems.filter(item => item.id !== id);
        
        // 保存到localStorage
        saveHistoryToStorage();
        
        // 更新UI
        renderHistoryItems();
    }
    
    function formatDate(date) {
        return date instanceof Date ? 
            `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}` : 
            '未知日期';
    }
    
    function saveHistoryToStorage() {
        try {
            // 對每個歷史項目處理日期（轉為字符串）
            const historyToSave = historyItems.map(item => ({
                id: item.id,
                timestamp: item.timestamp.toISOString(),
                svgCode: item.svgCode,
                thumbnail: item.thumbnail,
                description: item.description,
                _hash: item._hash
            }));
            
            localStorage.setItem('sketch2chart_history', JSON.stringify(historyToSave));
        } catch (error) {
            console.error('保存歷史記錄失敗:', error);
        }
    }
    
    function loadHistoryItems() {
        try {
            const saved = localStorage.getItem('sketch2chart_history');
            if (saved) {
                const parsed = JSON.parse(saved);
                
                // 簡單雜湊函數
                const simpleHash = (str) => {
                    return str.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 0);
                };
                
                // 轉換日期字符串回Date對象
                historyItems = parsed.map(item => ({
                    ...item,
                    timestamp: new Date(item.timestamp),
                    // 如果沒有雜湊值，添加一個
                    _hash: item._hash || simpleHash(item.svgCode)
                }));
                
                renderHistoryItems();
            }
        } catch (error) {
            console.error('加載歷史記錄失敗:', error);
            historyItems = [];
        }
    }
    
    // 保存進階設定
    function saveAdvancedSettings() {
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
    }
    
    // 重設設定為預設值
    function resetToDefaults() {
        // 重設為預設值
        apiSettings = {...defaultApiSettings};
        
        // 更新UI
        updateSettingsUI();
        
        // 顯示提示
        showToast('已重設為預設值');
    }
    
    // 初始化頁面
    async function init() {
        // 加載保存的設定
        loadSavedSettings();
        
        // 初始化CodeMirror
        initCodeMirror();
        
        // 載入歷史項目
        await loadHistoryItems();
        renderHistoryItems();
        
        // 為轉換按鈕添加事件監聽器
        convertBtn.addEventListener('click', handleConvertButtonClick);
        
        // 為複製代碼按鈕添加事件監聽器
        copyCodeBtn.addEventListener('click', () => {
            const svgCode = codeEditor.getValue();
            navigator.clipboard.writeText(svgCode)
                .then(() => {
                    showToast(window.i18n.__('code-copied'));
                })
                .catch(err => {
                    console.error('複製失敗:', err);
                    showToast(window.i18n.__('copy-failed'));
                });
        });
        
        // 為下載SVG按鈕添加事件監聽器
        downloadSvgBtn.addEventListener('click', () => {
            const svgCode = codeEditor.getValue();
            const blob = new Blob([svgCode], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'sketch2chart.svg';
            document.body.appendChild(a);
            a.click();
            
            // 清理
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 0);
        });
        
        // 進階設定處理
        advancedSettingsBtn.addEventListener('click', () => {
            advancedSettingsModal.classList.remove('hidden');
            updateSettingsUI();
        });
        
        closeModalBtn.addEventListener('click', () => {
            advancedSettingsModal.classList.add('hidden');
        });
        
        // 點擊模態視窗外側關閉
        advancedSettingsModal.addEventListener('click', (e) => {
            if (e.target === advancedSettingsModal) {
                advancedSettingsModal.classList.add('hidden');
            }
        });
        
        // 保存設定按鈕
        saveSettingsBtn.addEventListener('click', () => {
            saveAdvancedSettings();
            advancedSettingsModal.classList.add('hidden');
            showToast(window.i18n.__('settings-saved'));
        });
        
        // 重設為預設值
        resetDefaultsBtn.addEventListener('click', resetToDefaults);
        
        // 切換自定義模型輸入欄位
        apiModel.addEventListener('change', function() {
            if (this.value === 'custom') {
                customModelContainer.classList.remove('hidden');
            } else {
                customModelContainer.classList.add('hidden');
            }
        });
        
        // 溫度滑桿更新顯示值
        temperature.addEventListener('input', function() {
            temperatureValue.textContent = this.value;
        });
        
        // 初始化完成
        console.log('應用程式初始化完成');
    }
    
    // 初始化應用程式
    init();
}); 