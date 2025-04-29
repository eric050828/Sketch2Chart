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

    // 轉換按鈕點擊事件
    convertBtn.addEventListener('click', function() {
        // 顯示加載狀態
        this.disabled = true;
        this.innerHTML = '處理中...';
        svgPreview.innerHTML = '<div class="placeholder">正在處理您的圖片，請稍候...</div>';
        
        // 模擬API調用延遲
        setTimeout(() => {
            processConversion();
        }, 1500);
    });

    // 模擬轉換處理
    function processConversion() {
        // 檢查API金鑰
        if (!apiKey.value.trim()) {
            alert('請輸入API金鑰！');
            convertBtn.disabled = false;
            convertBtn.innerHTML = '轉換為SVG';
            svgPreview.innerHTML = '<div class="placeholder">轉換結果將在此顯示</div>';
            return;
        }
        
        // 這裡應該是實際的API調用，現在只是模擬
        const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
            <rect x="50" y="50" width="300" height="100" fill="none" stroke="#4f46e5" stroke-width="2"/>
            <line x1="50" y1="50" x2="350" y2="150" stroke="#4f46e5" stroke-width="2"/>
            <circle cx="200" cy="100" r="30" fill="none" stroke="#4f46e5" stroke-width="2"/>
            <text x="185" y="105" font-family="Arial" font-size="12" fill="#1f2937">文字</text>
        </svg>`;
        
        // 更新預覽和代碼編輯器
        svgPreview.innerHTML = sampleSvg;
        
        // 使用CodeMirror編輯器設定內容
        codeEditor.setValue(sampleSvg);
        codeEditor.refresh();
        
        // 啟用按鈕
        copyCodeBtn.disabled = false;
        downloadSvgBtn.disabled = false;
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
}); 