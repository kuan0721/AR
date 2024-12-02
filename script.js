let lastButtonState = null;

function updateButtonVisuals(buttonId, isActive) {
    const button = document.getElementById(buttonId);
    const statusText = document.getElementById('statusText');

    if (isActive) {
        button.classList.add('active');
        button.style.animation = 'none';
        button.offsetHeight;
        button.style.animation = 'buttonPress 0.5s ease';

        // 顯示狀態文字
        statusText.style.opacity = '1';
        statusText.innerText = buttonId === 'previousBtn' ? '已偵測左側按鈕' : '已偵測右側按鈕';
    } else {
        button.classLisurl_2, capove('active');
        button.style.animation = '';
        statusText.style.opacity = '0';
    }
}

function handleButtonTrigger(direction) {
    const previousBtn = document.getElementById('previousBtn');
    const nextBtn = document.getElementById('nextBtn');
    const statusText = document.getElementById('statusText');

    // 重置所有按鈕狀態
    previousBtn.classList.remove('active');
    nextBtn.classList.remove('active');

    // 根據方向觸發對應按鈕
    if (direction === 'left') {
        updateButtonVisuals('previousBtn', true);
        statusText.innerText = "上一步";
        // 觸發實際的點擊事件
        previousBtn.click();
    } else if (direction === 'right') {
        updateButtonVisuals('nextBtn', true);
        statusText.innerText = "下一步";
        // 觸發實際的點擊事件
        nextBtn.click();
    }

    // 設置定時器移除活動狀態
    setTimeout(() => {
        if (direction === 'left') {
            updateButtonVisuals('previousBtn', false);
        } else if (direction === 'right') {
            updateButtonVisuals('nextBtn', false);
        }
        statusText.innerText = "";
    }, 5000);   // 將button顯示時間到 5 秒
}

// 修改 setInterval 輪詢頻率並添加狀態指示
setInterval(async () => {
    try {
        const response = await fetch('/button_status');
        const data = await response.json();

        const statusText = document.getElementById('statusText');

        if (data.is_active && data.button_triggered !== lastButtonState) {
            // 處理按鈕觸發
            handleButtonTrigger(data.button_triggered);
            lastButtonState = data.button_triggered;
        } else if (!data.is_active) {
            // 當狀態為空時，不做任何更新
            lastButtonState = null;
            statusText.style.opacity = '0';
        }
    } catch (error) {
        console.error('Error fetching button status:', error);
    }
}, 100);  // 每 100ms 輪詢一次

// 當頁面加載完成時設置按鈕事件
document.addEventListener('DOMContentLoaded', function() {
    // 設置按鈕點擊事件
    document.getElementById('previousBtn').addEventListener('click', function(e) {
        console.log('Previous button clicked');
        // 在這裡添加上一步的具體操作
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 200);
    });

    document.getElementById('nextBtn').addEventListener('click', function(e) {
        console.log('Next button clicked');
        // 在這裡添加下一步的具體操作
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 200);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // 定義各步驟的內容
    const steps = [
        {
            title: 'Step 1',
            description: '380mm機架中間箭頭朝前',
            videoSrc: '/static/video/1.mp4', // 第一步的影片檔案
            sound: '/static/sound/step1.mp3',
        },
        //step2
        {
            title: 'Step 2',
            description: '工具/材料 : A螺絲起子2mm/跟兩顆一號螺絲',
            videoSrc: '/static/video/2.mp4',
            sound: '/static/sound/step2.mp3', // 第二步的音檔  
        },
        
        {
            title: 'Step 2-1',
            description: '對準孔位：<br>• 拿起無人機腳架，找到380架左右兩邊的正方形孔洞。<br>• 將腳架的螺絲孔與機架上的孔位對準。',
            videoSrc: '/static/video/2-1.mp4',
            sound: '/static/sound/step2-1.mp3',
        },
        {
            title: 'Step 2-2', 
            description: '•	使用螺絲固定腳架，建議採用對角鎖法<br>•（即先鎖對角的螺絲，這樣可以避免機架變形）。',
            videoSrc: '/static/video/2-2.mp4',
            sound: '/static/sound/step2-2.mp3',
        },
        {
            title: 'Step 2-3', 
            description: '•	確認腳架的外八角度，這樣可以提升穩定性<br>•	並確保無人機在起降時更穩固。。',
            videoSrc: '/static/video/2-3.mp4',
            sound: '/static/sound/step2-3.mp3',
        },
        //step3
        {
            title: 'Step 3',
            description: '工具/材料 : <br>A螺絲起子2mm//四顆一號螺絲<br>四根短銅柱/配電盤。',
            images: '/static/images/step3.jpg',
            sound: '/static/sound/step3.mp3', 
        },
        {
            title: 'Step 3-1',
            description: '• 請拿起配電盤，將一號螺絲各別插入每個角落的鎖孔。<br>然後使用短銅柱將其固定。請注意，需將配電盤元件面朝上。',
            videoSrc: '/static/video/3-1.mp4',
            sound: '/static/sound/step3-1.mp3', 
        },
        //step4
        {
            title: 'Step 4',
            description: '•	工具/材料 :<br>A螺絲起子2mm/四顆一號螺絲<br>配電盤/底座板。',
            images :'/static/images/step1.png',
            sound: '/static/sound/step4.mp3', 
        },
        {   
            title: 'Step 4-1',
            description: '•	將組裝好的無人機腳架向左旋轉180度<br>• 確保箭頭朝前（即機架的前方）。',
            videoSrc: '/static/video/4-1.mp4',
            sound: '/static/sound/step4-1.mp3', 
        },
        {
            title: 'Step 4-2',
            description: '• 拿起配電盤翻面，需將配電盤元件面朝下<br>•電源(紅黑)線當尾巴朝向自己。',
            videoSrc: '/static/video/4-2.mp4',
            sound: '/static/sound/step4-2.mp3', 
        },
        {
            title: 'Step 4-3',
            description: '• 將配電盤對準底左的4條孔洞<br>確保接孔與銅柱正確對應。',
            videoSrc: '/static/video/4-3.mp4',
            sound: '/static/sound/step4-3.mp3', 
        },
        {
            title: 'Step 4-4',
            description: '•	使用螺絲將配電盤和底座是固定在銅柱上<br>• 確保螺絲全部鎖緊。',
            videoSrc: '/static/video/4-4.mp4',
            sound: '/static/sound/step4-4.mp3', 
        },
        {
            title: 'Step 4-5',
            description: '• 確保螺絲全部鎖緊，轉回正面尾巴朝下自己。',
            videoSrc: '/static/video/4-5.mp4',
            sound: '/static/sound/step4-5.mp3', 
        },
        //step5
        {
            title: 'Step 5',
            description: '•工具/材料 : A螺絲起子2mm/八根一號螺絲<br>八根長銅柱，/底座板',
            videoSrc: '/static/video/5-1.mp4',
            sound: '/static/sound/step5.mp3', 
        },
        {
            title: 'Step 5-1',
            description: '•	右手拿起銅柱，確認銅柱的螺絲洞朝下。<br>• 將銅柱放置於機架的四周機臂鎖孔。。',
            videoSrc: '/static/video/5-4.mp4',
            sound: '/static/sound/step5-1.mp3', 
        },
        //step6
        {
            title: 'step 6',
            description: '•	將無人機機架再次翻回正面，使箭頭朝前，配電盤尾巴朝後。<br>•	整理線路，將4個電變整理好',
            videoSrc: '/static/video/6-1.mp4',
            sound: '/static/sound/step6.mp3', 
        },
        {
            title: 'Step 6-1',
            description: '• 拿起FWU/PWM/in的線（寬線）。<br>• 將線插入配電盤孔位該接孔會標註為FWU-PWM-in。',
            videoSrc: '/static/video/6-3.mp4',
            sound: '/static/sound/step6-1.mp3', 
        },
        {
            title: 'Step 6-2',
            description: '• 拿起Power1的線（細線）。<br>•	將這條線插入配電盤最前方左邊標示為PWR1的白色接孔。',
            videoSrc: '/static/video/6-2.mp4',
            sound: '/static/sound/step6-2.mp3', 
        },
        //step7
        {
            title: 'Step 7',
            description: '•工具/材料 : <br>A螺絲起子2mm/四顆一號螺絲，/中間層機架板',
            videoSrc: '/static/video/7-1.mp4',
            sound: '/static/sound/step7.mp3',  
        },
        {
            title: 'Step 7-1',
            description: '•	飛控放置在中間層機架板的正中央<br>>確認飛控方向正確',
            videoSrc: '/static/video/7-2.mp4',
            sound: '/static/sound/step7-1.mp3',
        },
        {
            title: 'Step 7-2',
            description: '•	翻轉飛控，檢查飛控底部的四個孔。<br>• 將這四個孔對準機架的第一和第三條線上的孔位。',
            videoSrc: '/static/video/7-3.mp4',
            sound: '/static/sound/step7-2.mp3',
        },
        {
            title: 'Step 7-3',
            description: '•	使用螺絲固定飛控，確保每個孔位都鎖緊。<br>• 確保飛控穩固安裝於機架上。',
            videoSrc: '/static/video/7-4.mp4',
            sound: '/static/sound/step7-3.mp3',
        },
        {
            title: 'Step 7-4',
            description: '•	將四個電調從下方穿過第二層機架，並確認它們正確排列。<br>• 將大線穿入後方孔洞，小線線穿入前方孔洞',
            videoSrc: '/static/video/7-5.mp4',
            sound: '/static/sound/step7-4.mp3',
        },//step 8
        {
            title: 'Step 8',
            description: '•工具/材料 : <br>A螺絲起子2mm/B螺絲起子2.5mm/四顆馬達，/四支機臂(底)<br> 20顆一號螺絲，/28跟短銅柱，/16顆二號螺絲',
            images: '/static/images/step8.jpg',
            sound: '/static/sound/step8.mp3',
        },
        {
            title: 'Step 8-1',
            description: '• 拿起機臂和馬達，將螺孔對準機臂，鎖上螺絲<br>• 注意對角鎖螺絲，不要一開始就鎖緊，四個鎖上在鎖緊',
            videoSrc: '/static/video/8-1.mp4',
            sound: '/static/sound/step8-1.mp3',
        },
        {
            title: 'Step 8-2',
            description: '•	找到機臂上對應的 5 個洞，將短銅柱用螺絲固定到機臂上。',
            videoSrc: '/static/video/8-2.mp4',
            sound: '/static/sound/step8-2.mp3',
        },
        {
            title: 'Step 8-3',
            description: '•	將機臂放對應對方向<br>•	右上：紅色馬達<br>• 最後插上馬達與電變的線，3條線隨便插',
            videoSrc: '/static/video/8-3.mp4',
            sound: '/static/sound/step8-3.mp3',
        },
        {
            title: 'Step 8-4',
            description: '•	將機臂放對應對方向<br>• 右下：黑色馬達<br>• 最後插上馬達與電變的線，3條線隨便插',
            videoSrc: '/static/video/8-4.mp4',
            sound: '/static/sound/step8-4.mp3',
        },
        {
            title: 'Step 8-5',
            description: '•	將機臂放對應對方向<br>•	左下：紅色馬達<br>• 最後插上馬達與電變的線，3條線隨便插',
            videoSrc: '/static/video/8-5.mp4',
            sound: '/static/sound/step8-5.mp3',
        },
        {
            title: 'Step 8-6',
            description: '•	將機臂放對應對方向<br>•	左上：黑色馬達<br>• 最後插上馬達與電變的線，3條線隨便插',
            videoSrc: '/static/video/8-6.mp4',
            sound: '/static/sound/step8-6.mp3',
        },
        {
            title: 'Step 8-7',
            description: '•	拿出另一個機臂（有大洞）。<br>• 將其對準已安裝電調的銅柱。<br>• 使用螺絲將這個機臂鎖緊在銅柱上 ',
            videoSrc: '/static/video/8-7.mp4',
            sound: '/static/sound/step8-7.mp3',
        },
        {
            title: 'Step 8-8',
            description: '•	拿出30mm銀色銅柱<br>• 鎖到機臂與機身的連接處(稍為難鎖)',
            videoSrc: '/static/video/8-8',
            sound: '/static/sound/step8-8.mp3',
        },
        //step 9
        {
            title: 'Step 9',
            description: '工具/材料 : <br> A型2 mm螺絲起子，/C型5.5 mm內六角套筒起子<br>GPS，/三號螺絲和螺帽，/頂板',
            images: '/static/images/step12',
            sound: '/static/sound/step9.mp3',
        },
        {
            title: 'Step 9-1',
            description: '• 拿出頂板，和GPS。 <br>• 注意頂板與GPS箭頭都需要朝前',
            videoStepTitle: '/static/video/9-1.mp4',
            sound: '/static/sound/step9-1.mp3',
        },
        {
            title: 'Step 9-2',
            description: '•	使用螺絲將 GPS 鎖入正方形孔位，需鎖靠近內側的4個螺絲<br>• 並在每顆螺絲的背面加上螺帽。',
            videoStepTitle: '/static/video/9-2.mp4',
            sound: '/static/sound/step9-2.mp3',
        },
        {
            title: 'Step 9-3',
            description: '•	將接收插到飛控上的DSM/BUS RC接孔。<br>• 找到 GPS 的連接線，並將其插入飛控上的 GPS Module 接孔。<br>• 使用螺絲，將第 3 層機架固定到第 2 層機架上的長銅柱上。',
            videoStepTitle: '/static/video/9-3.mp4',
            sound: '/static/sound/step9-3.mp3',
        },
        {
            title: 'Step 9-4',
            description: '• 轉下馬達上的黑色和紅色螺帽，為安裝螺旋槳做好準備。<br>• (紅色螺帽左旋為鬆，黑色螺帽右旋為鬆)。',
            videoStepTitle: '/static/video/9-4.mp4',
            sound: '/static/sound/step9-4.mp3',
        },
        {
            title: 'Step 9-5',
            description: '•	確保 GPS 的箭頭朝向機架的前方<br>• 這將作為判斷螺旋槳安裝方向的參考。',
            videoStepTitle: '/static/video/9-5.mp4',
            sound: '/static/sound/step9-5.mp3',
        },
        {
            title: 'Step 9-6',
            description: '•	右上與左上：安裝橘色螺旋槳。<br>o 找到螺旋槳上標有 "紅點" ，將其安裝於 左上。<br>o "藍點"橘色螺旋槳安裝於 右上。',
            videoStepTitle: '/static/video/9-6.mp4',
            sound: '/static/sound/step9-6.mp3',
        },
        {
            title: 'Step 9-7',
            description: '• 右下與左下：安裝黑色螺旋槳。<br>o 找到另一個標有 "紅點"的螺旋槳，將其安裝於 右下。<br>o	其餘黑色螺旋槳安裝於 左下。',
            videoStepTitle: '/static/video/9-6.mp4',
            sound: '/static/sound/step9-7.mp3',
        },
        {
            title: 'Step 9-8',
            description: '•	將拆下的螺帽（黑色或粉紅色）依序鎖緊。<br>• 確保螺旋槳穩固不會鬆動。<br>• (紅色螺帽右旋為緊，黑色螺帽左旋為緊)',
            videoStepTitle: '/static/video/9-6.mp4',
            sound: '/static/sound/step9-8.mp3',
        }
    ];

    // 初始當前步驟
    let currentStepIndex = 0;
    let currentAudio = null; // 保存當前播放的音效
    // 取得 DOM 元素
    const stepTitle = document.getElementById('stepTitle');
    const stepDescription = document.getElementById('stepDescription');
    const videoStepTitle = document.getElementById('videoStepTitle');
    const stepVideo = document.getElementById('stepVideo');
    const previousBtn = document.getElementById('previousBtn');
    const nextBtn = document.getElementById('nextBtn');

    // 更新畫面
    function updateStep() {
        const step = steps[currentStepIndex];
        
        // 更新文字內容
        stepTitle.textContent = `步驟說明 ${step.title}`;
        stepDescription.innerHTML = step.description;
    
        // 動態更新影片或圖片
        if (step.videoSrc) {
            stepVideo.style.display = 'block';
            stepVideo.src = step.videoSrc;
            stepVideo.play();
            document.getElementById('stepImage').style.display = 'none';
        } else if (step.images) {
            const stepImage = document.getElementById('stepImage');
            stepImage.style.display = 'block';
            stepImage.src = step.images;
            stepVideo.style.display = 'none';
        } else {
            stepVideo.style.display = 'none';
            document.getElementById('stepImage').style.display = 'none';
        }
    
        // 播放音檔（解決自動播放限制）
        const stepAudio = document.getElementById('stepAudio');
        if (step.sound) {
            stepAudio.src = step.sound;
            stepAudio.style.display = 'block';
    
            // 確保在互動後能播放
            stepAudio.play().catch(() => {
                console.log('音檔無法自動播放，請用戶點擊啟用音頻功能。');
            });
        } else {
            stepAudio.style.display = 'none';
        }
    
        // 更新影片步驟標題
        videoStepTitle.textContent = `影片步驟 ${step.title}`;
    
        // 按鈕狀態
        previousBtn.disabled = currentStepIndex === 0;
        nextBtn.disabled = currentStepIndex === steps.length - 1;
    
    
    
    
    
        // 添加動畫效果
        const leftTop = document.querySelector('.left-top');
        const rightTop = document.querySelector('.right-top');
    
        leftTop.classList.add('slide-in');
        rightTop.classList.add('slide-in');
    
        // 移除動畫類別，確保下次更新時重新觸發動畫
        setTimeout(() => {
            leftTop.classList.remove('slide-in');
            rightTop.classList.remove('slide-in');
        }, 100); // 時間與動畫持續時間一致

        
    }
    document.addEventListener('DOMContentLoaded', () => {
        updateStep();
    });
    
    

    // 上一步按鈕點擊事件
    previousBtn.addEventListener('click', () => {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            updateStep();
        }
    });

    // 下一步按鈕點擊事件
    nextBtn.addEventListener('click', () => {
        if (currentStepIndex < steps.length - 1) {
            currentStepIndex++;
            updateStep();
        }
    });

    // 初始化畫面
    updateStep();
});

document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('startScreen');
    const assemblyScreen = document.getElementById('assemblyScreen');
    const startButton = document.getElementById('startButton');

    // 點擊開始組裝按鈕後切換畫面
    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';  // 隱藏開始畫面
        assemblyScreen.style.display = 'block'; // 顯示組裝畫面
        updateStep(); // 初始化第一步
    });

    // 初始化畫面（如果直接進入組裝步驟）
    updateStep();
});
