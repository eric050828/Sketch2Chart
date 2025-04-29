document.addEventListener('DOMContentLoaded', function() {
    // DOM元素
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const toolBtns = document.querySelectorAll('.tool-btn');
    const clearCanvasBtn = document.getElementById('clear-canvas');
    
    // 畫布設置
    function resizeCanvas() {
        const canvasWrapper = document.querySelector('.canvas-wrapper');
        canvas.width = canvasWrapper.clientWidth;
        canvas.height = canvasWrapper.clientHeight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#1f2937';
        ctx.lineWidth = 2;
    }
    
    // 初始化畫布尺寸
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 繪圖變量
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentTool = 'pen-tool'; // 默認工具
    let startX, startY; // 用於形狀繪製
    let tempCanvas; // 用於暫存繪圖狀態
    const eraserSize = 20; // 橡皮擦大小，單位為像素
    
    // 工具切換功能
    toolBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            toolBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentTool = this.id;
            
            // 更新鼠標樣式
            if (currentTool === 'eraser-tool') {
                // 使用自定義SVG作為橡皮擦游標，大小與實際橡皮擦大小一致
                const svgCursor = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${eraserSize}' height='${eraserSize}' viewBox='0 0 ${eraserSize} ${eraserSize}'%3E%3Ccircle cx='${eraserSize/2}' cy='${eraserSize/2}' r='${eraserSize/2-1}' fill='rgba(255,255,255,0.5)' stroke='%23000' stroke-width='1'/%3E%3C/svg%3E`;
                canvas.style.cursor = `url("${svgCursor}") ${eraserSize/2} ${eraserSize/2}, auto`;
            } else if (currentTool === 'text-tool') {
                canvas.style.cursor = 'text';
            } else {
                canvas.style.cursor = 'crosshair';
            }
        });
    });
    
    // 清除畫布
    clearCanvasBtn.addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    
    // 滑鼠/觸控事件
    function startPosition(e) {
        isDrawing = true;
        [lastX, lastY] = getPosition(e);
        startX = lastX;
        startY = lastY;
        
        // 為形狀工具保存當前狀態
        if (['line-tool', 'rect-tool', 'circle-tool'].includes(currentTool)) {
            tempCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
        
        if (currentTool === 'text-tool') {
            addTextInput(lastX, lastY);
            isDrawing = false;
        }
    }
    
    function endPosition() {
        isDrawing = false;
        
        // 釋放臨時畫布
        tempCanvas = null;
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        const [currentX, currentY] = getPosition(e);
        
        switch (currentTool) {
            case 'pen-tool':
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(currentX, currentY);
                ctx.stroke();
                [lastX, lastY] = [currentX, currentY];
                break;
                
            case 'eraser-tool':
                ctx.save();
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                // 使用固定大小的橡皮擦，與游標大小匹配
                ctx.arc(currentX, currentY, eraserSize/2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;
                
            case 'line-tool':
                // 恢復之前的狀態
                if (tempCanvas) {
                    ctx.putImageData(tempCanvas, 0, 0);
                }
                
                // 繪製線條
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(currentX, currentY);
                ctx.stroke();
                break;
                
            case 'rect-tool':
                // 恢復之前的狀態
                if (tempCanvas) {
                    ctx.putImageData(tempCanvas, 0, 0);
                }
                
                // 計算矩形參數
                const width = currentX - startX;
                const height = currentY - startY;
                
                // 繪製矩形
                ctx.beginPath();
                ctx.rect(startX, startY, width, height);
                ctx.stroke();
                break;
                
            case 'circle-tool':
                // 恢復之前的狀態
                if (tempCanvas) {
                    ctx.putImageData(tempCanvas, 0, 0);
                }
                
                // 計算半徑
                const radius = Math.sqrt(
                    Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2)
                );
                
                // 繪製圓形
                ctx.beginPath();
                ctx.arc(startX, startY, radius, 0, Math.PI * 2);
                ctx.stroke();
                break;
        }
    }
    
    // 獲取鼠標/觸控坐標
    function getPosition(e) {
        let x, y;
        const rect = canvas.getBoundingClientRect();
        
        if (e.type.includes('touch')) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }
        
        return [x, y];
    }
    
    // 文字工具功能
    function addTextInput(x, y) {
        // 創建文字輸入框
        const input = document.createElement('input');
        input.type = 'text';
        input.style.position = 'absolute';
        
        // 計算正確的輸入框位置
        const canvasRect = canvas.getBoundingClientRect();
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        input.style.left = (canvasRect.left + x + scrollLeft) + 'px';
        input.style.top = (canvasRect.top + y + scrollTop) + 'px';
        
        // 設置輸入框樣式
        input.style.border = '1px solid #000';
        input.style.background = 'rgba(255, 255, 255, 0.8)';
        input.style.font = '16px Arial';
        input.style.color = '#1f2937';
        input.style.zIndex = '1000';
        input.style.padding = '4px';
        input.style.minWidth = '100px';
        input.style.maxWidth = '300px';
        input.style.outline = 'none';
        input.placeholder = '輸入文字...';
        
        // 添加到頁面
        document.body.appendChild(input);
        
        // 確保輸入框獲得焦點
        setTimeout(() => {
            input.focus();
        }, 10);
        
        // 處理文字添加到Canvas
        function addTextToCanvas() {
            const text = input.value.trim();
            if (text) {
                ctx.font = '16px Arial';
                ctx.fillStyle = '#1f2937';
                ctx.fillText(text, x, y + 16); // 16px 是字體高度的近似值
            }
            document.body.removeChild(input);
        }
        
        // 失焦時添加文字
        input.addEventListener('blur', addTextToCanvas);
        
        // 按下Enter鍵時添加文字
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTextToCanvas();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                document.body.removeChild(input);
            }
        });
    }
    
    // 註冊事件監聽
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseout', endPosition);
    
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        startPosition(e);
    });
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        endPosition();
    });
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        draw(e);
    });
}); 