// 人生阶段数据
const lifeStages = [
    {
        name: '诞生',
        description: '生命的开始，充满无限可能',
        icon: '👶',
        progress: 0,
        achievements: [
            { name: '第一次呼吸', unlocked: false, icon: '💨' },
            { name: '第一声啼哭', unlocked: false, icon: '👶' },
            { name: '新生儿体检', unlocked: false, icon: '🏥' }
        ]
    },
    {
        name: '童年',
        description: '无忧无虑，探索世界的年纪',
        icon: '🧒',
        progress: 16.67,
        achievements: [
            { name: '第一次走路', unlocked: false, icon: '👣' },
            { name: '第一天上幼儿园', unlocked: false, icon: '🏫' },
            { name: '学会骑自行车', unlocked: false, icon: '🚲' }
        ]
    },
    {
        name: '青春',
        description: '追逐梦想，热血奋斗的时光',
        icon: '🎓',
        progress: 33.33,
        achievements: [
            { name: '初恋', unlocked: false, icon: '💘' },
            { name: '毕业典礼', unlocked: false, icon: '🎓' },
            { name: '第一份兼职', unlocked: false, icon: '💼' }
        ]
    },
    {
        name: '成年',
        description: '承担责任，创造价值的阶段',
        icon: '💼',
        progress: 50,
        achievements: [
            { name: '第一份全职工作', unlocked: false, icon: '💼' },
            { name: '独立生活', unlocked: false, icon: '🏠' },
            { name: '买车', unlocked: false, icon: '🚗' }
        ]
    },
    {
        name: '中年',
        description: '事业有成，家庭美满的收获期',
        icon: '👨‍👩‍👧‍👦',
        progress: 66.67,
        achievements: [
            { name: '结婚', unlocked: false, icon: '💍' },
            { name: '第一个孩子', unlocked: false, icon: '👶' },
            { name: '升职加薪', unlocked: false, icon: '📈' }
        ]
    },
    {
        name: '暮年',
        description: '智慧沉淀，享受人生的时光',
        icon: '👴',
        progress: 83.33,
        achievements: [
            { name: '退休', unlocked: false, icon: '🏖️' },
            { name: '第一个孙子', unlocked: false, icon: '👶' },
            { name: '写回忆录', unlocked: false, icon: '📖' }
        ]
    }
];

// 当前阶段索引
let currentStage = 0;
let autoPlayInterval = null;

// DOM元素
const stages = document.querySelectorAll('.stage');
const progressBar = document.querySelector('.progress');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const autoBtn = document.getElementById('autoBtn');
const shareBtn = document.getElementById('shareBtn');

// 初始化
function init() {
    updateStage(0);
    bindEvents();
    
    // 添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// 绑定事件
function bindEvents() {
    prevBtn.addEventListener('click', () => {
        if (currentStage > 0) {
            updateStage(currentStage - 1);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentStage < stages.length - 1) {
            updateStage(currentStage + 1);
        }
    });
    
    autoBtn.addEventListener('click', toggleAutoPlay);
    shareBtn.addEventListener('click', shareLifeJourney);
    
    // 为每个阶段添加点击事件
    stages.forEach((stage, index) => {
        stage.addEventListener('click', () => {
            if (autoPlayInterval) {
                stopAutoPlay();
            }
            updateStage(index);
        });
    });
}

// 更新阶段
function updateStage(stageIndex) {
    currentStage = stageIndex;
    
    // 更新阶段状态
    stages.forEach((stage, index) => {
        stage.classList.toggle('active', index === stageIndex);
    });
    
    // 更新进度条
    const progress = ((stageIndex + 1) / stages.length) * 100;
    progressBar.style.width = progress + '%';
    
    // 更新按钮状态
    prevBtn.disabled = stageIndex === 0;
    nextBtn.disabled = stageIndex === stages.length - 1;
    
    // 滚动到当前阶段
    const activeStage = stages[stageIndex];
    activeStage.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
    
    // 添加阶段描述动画
    showStageInfo(stageIndex);
}

// 显示阶段信息
function showStageInfo(stageIndex) {
    const stage = lifeStages[stageIndex];
    const stageElement = stages[stageIndex];
    
    // 添加淡入动画
    stageElement.style.animation = 'fadeIn 0.6s ease';
    
// 创建信息气泡
    const infoBubble = document.createElement('div');
    infoBubble.className = 'info-bubble';
    infoBubble.innerHTML = `
        <h3>${stage.name}</h3>
        <p>${stage.description}</p>
        <span>${stage.icon}</span>
        <div class="achievements-preview">
            ${stage.achievements.slice(0, 2).map(a => 
                `<span class="achievement-icon">${a.icon}</span>`
            ).join('')}
            ${stage.achievements.length > 2 ? '...' : ''}
        </div>
    `;
    
    // 添加气泡样式
    Object.assign(infoBubble.style, {
        position: 'absolute',
        background: 'rgba(255,255,255,0.9)',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        top: '-60px',
        left: '50%',
        transform: 'translateX(-50%)',
        whiteSpace: 'nowrap',
        zIndex: '100',
        animation: 'slideDown 0.5s ease'
    });
    
    // 移除旧气泡
    const oldBubble = stageElement.querySelector('.info-bubble');
    if (oldBubble) {
        oldBubble.remove();
    }
    
    stageElement.appendChild(infoBubble);
    
    // 添加成就点击事件
    const achievementIcons = infoBubble.querySelectorAll('.achievement-icon');
    achievementIcons.forEach((icon, index) => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            showAchievementsPanel(stageIndex);
        });
    });
    
    // 3秒后自动隐藏
    setTimeout(() => {
        if (infoBubble.parentNode) {
            infoBubble.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => infoBubble.remove(), 300);
        }
    }, 3000);
}

// 自动播放
function toggleAutoPlay() {
    if (autoPlayInterval) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
}

function startAutoPlay() {
    autoBtn.textContent = '停止播放';
    autoBtn.style.background = 'rgba(255,100,100,0.3)';
    
    autoPlayInterval = setInterval(() => {
        if (currentStage < stages.length - 1) {
            updateStage(currentStage + 1);
        } else {
            // 播放完成后重新开始
            setTimeout(() => {
                updateStage(0);
            }, 2000);
        }
    }, 3000);
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
    autoBtn.textContent = '自动播放';
    autoBtn.style.background = 'rgba(255,255,255,0.2)';
}

// 键盘控制
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentStage > 0) {
        updateStage(currentStage - 1);
    } else if (e.key === 'ArrowRight' && currentStage < stages.length - 1) {
        updateStage(currentStage + 1);
    } else if (e.key === ' ') {
        e.preventDefault();
        toggleAutoPlay();
    }
});

// 添加CSS动画和成就样式
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideDown {
        from { 
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
        }
        to { 
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from { 
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to { 
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
        }
    }
    
    .achievements-preview {
        margin-top: 10px;
        display: flex;
        justify-content: center;
        gap: 8px;
    }
    
    .achievement-icon {
        font-size: 1.5rem;
        opacity: 0.7;
        transition: all 0.3s ease;
    }
    
    .achievement-icon:hover {
        opacity: 1;
        transform: scale(1.2);
    }
    
    .achievements-panel {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255,255,255,0.9);
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        max-width: 80%;
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
        animation: slideUp 0.5s ease;
    }
    
    .achievements-panel h3 {
        text-align: center;
        margin-bottom: 10px;
        color: #333;
    }
    
    .achievement-item {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 8px 0;
        padding: 8px;
        border-radius: 5px;
        background: rgba(255,255,255,0.7);
    }
    
    .achievement-item.unlocked {
        background: rgba(100,255,100,0.2);
    }
    
    .achievement-item .icon {
        font-size: 1.5rem;
    }
    
    .achievement-item .name {
        flex-grow: 1;
    }
    
    .close-panel {
        position: absolute;
        top: 5px;
        right: 10px;
        cursor: pointer;
        font-size: 1.2rem;
    }
`;
document.head.appendChild(style);

// 显示成就面板
function showAchievementsPanel(stageIndex) {
    const stage = lifeStages[stageIndex];
    
    // 有30%概率触发迷你游戏而不是成就面板
    if (Math.random() < 0.3) {
        showMiniGame(stageIndex);
        return;
    }
    
    // 移除旧面板
    const oldPanel = document.querySelector('.achievements-panel');
    if (oldPanel) {
        oldPanel.remove();
    }
    
    // 创建新面板
    const panel = document.createElement('div');
    panel.className = 'achievements-panel';
    panel.innerHTML = `
        <span class="close-panel">×</span>
        <h3>${stage.name} - 人生成就</h3>
        ${stage.achievements.map(a => `
            <div class="achievement-item ${a.unlocked ? 'unlocked' : ''}">
                <span class="icon">${a.icon}</span>
                <span class="name">${a.name}</span>
                <span class="status">${a.unlocked ? '✓' : '🔒'}</span>
            </div>
        `).join('')}
    `;
    
    document.body.appendChild(panel);
    
    // 随机解锁1-2个成就
    const lockedAchievements = stage.achievements.filter(a => !a.unlocked);
    if (lockedAchievements.length > 0) {
        const randomCount = Math.min(2, Math.floor(Math.random() * lockedAchievements.length) + 1);
        for (let i = 0; i < randomCount; i++) {
            const randomIndex = Math.floor(Math.random() * lockedAchievements.length);
            lockedAchievements[randomIndex].unlocked = true;
        }
        
        // 更新面板显示
        setTimeout(() => {
            panel.querySelectorAll('.achievement-item').forEach((item, index) => {
                if (stage.achievements[index].unlocked) {
                    item.classList.add('unlocked');
                    item.querySelector('.status').textContent = '✓';
                }
            });
        }, 500);
    }
    
    // 关闭面板
    panel.querySelector('.close-panel').addEventListener('click', () => {
        panel.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => panel.remove(), 300);
    });
}

// 成就解锁通知
function showAchievementUnlock(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <span class="icon">${achievement.icon}</span>
        <div>
            <div class="notif-title">成就解锁！</div>
            <div class="notif-desc">${achievement.name}</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // 添加庆祝效果
    createCelebrationEffect();
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// 庆祝效果
function createCelebrationEffect() {
    const celebrations = ['🎉', '✨', '⭐', '🎊', '🥳'];
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const effect = document.createElement('div');
            effect.className = 'celebration-effect';
            effect.textContent = celebrations[Math.floor(Math.random() * celebrations.length)];
            effect.style.left = Math.random() * 100 + 'vw';
            effect.style.animationDelay = (Math.random() * 1) + 's';
            document.body.appendChild(effect);
            
            setTimeout(() => effect.remove(), 2000);
        }, i * 100);
    }
}

// 添加庆祝样式
const celebrationStyle = document.createElement('style');
celebrationStyle.textContent = `
    .achievement-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 1000;
        animation: slideInRight 0.5s ease;
    }
    
    .notif-title {
        font-weight: bold;
        font-size: 1.1rem;
    }
    
    .notif-desc {
        opacity: 0.9;
    }
    
    .celebration-effect {
        position: fixed;
        top: -50px;
        font-size: 2rem;
        animation: celebrateFall 2s ease-in-out;
        z-index: 999;
        pointer-events: none;
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes celebrateFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }
`;
document.head.appendChild(celebrationStyle);

// 修改成就解锁函数
function unlockRandomAchievement(stageIndex) {
    const stage = lifeStages[stageIndex];
    const lockedAchievements = stage.achievements.filter(a => !a.unlocked);
    if (lockedAchievements.length > 0) {
        const randomIndex = Math.floor(Math.random() * lockedAchievements.length);
        const unlockedAchievement = lockedAchievements[randomIndex];
        unlockedAchievement.unlocked = true;
        
        showAchievementUnlock(unlockedAchievement);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 添加鼠标悬停效果
stages.forEach(stage => {
    stage.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
    });
    
    stage.addEventListener('mouseleave', function() {
        if (!this.classList.contains('active')) {
            this.style.transform = 'scale(1)';
        }
    });
});

// 添加触摸支持
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && currentStage < stages.length - 1) {
            // 向左滑动 - 下一阶段
            updateStage(currentStage + 1);
        } else if (diff < 0 && currentStage > 0) {
            // 向右滑动 - 上一阶段
            updateStage(currentStage - 1);
        }
    }
}

// 分享人生旅程
function shareLifeJourney() {
    const stage = lifeStages[currentStage];
    const shareText = `我正在体验"${stage.name}"人生阶段 - ${stage.description}。你也来探索人生的旅程吧！`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
        // 使用Web Share API
        navigator.share({
            title: '我的人生旅程',
            text: shareText,
            url: shareUrl
        }).catch(err => {
            console.log('分享失败:', err);
            showShareOptions(shareText, shareUrl);
        });
    } else {
        // 回退方案
        showShareOptions(shareText, shareUrl);
    }
}

function showShareOptions(text, url) {
    const sharePanel = document.createElement('div');
    sharePanel.className = 'share-panel';
    sharePanel.innerHTML = `
        <h3>分享你的人生旅程</h3>
        <div class="share-methods">
            <button class="share-method" data-type="weibo">
                <span>微博</span>
            </button>
            <button class="share-method" data-type="wechat">
                <span>微信</span>
            </button>
            <button class="share-method" data-type="qq">
                <span>QQ</span>
            </button>
            <button class="share-method" data-type="copy">
                <span>复制链接</span>
            </button>
            <button class="close-share">取消</button>
        </div>
    `;
    
    document.body.appendChild(sharePanel);
    
    // 添加分享方法事件
    sharePanel.querySelectorAll('.share-method').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            switch(type) {
                case 'weibo':
                    window.open(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`);
                    break;
                case 'wechat':
                    alert('请使用微信扫描二维码分享');
                    // 实际应用中这里可以生成二维码
                    break;
                case 'qq':
                    window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`);
                    break;
                case 'copy':
                    navigator.clipboard.writeText(`${text} ${url}`).then(() => {
                        alert('链接已复制到剪贴板');
                    });
                    break;
            }
            sharePanel.remove();
        });
    });
    
    sharePanel.querySelector('.close-share').addEventListener('click', () => {
        sharePanel.remove();
    });
}

// 添加分享样式
const shareStyle = document.createElement('style');
shareStyle.textContent = `
    .share-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 1000;
        max-width: 90%;
        width: 300px;
    }
    
    .share-methods {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-top: 20px;
    }
    
    .share-method {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background: white;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .share-method:hover {
        background: #f5f5f5;
        transform: translateY(-2px);
    }
    
    .close-share {
        grid-column: 1 / -1;
        padding: 10px;
        background: #f0f0f0;
        border: none;
        border-radius: 8px;
        cursor: pointer;
    }
`;
document.head.appendChild(shareStyle);

// 添加页面可见性检测
document.addEventListener('visibilitychange', () => {
    if (document.hidden && autoPlayInterval) {
        stopAutoPlay();
    }
});