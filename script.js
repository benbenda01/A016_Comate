const lifeStages = [
    {
        name: '诞生',
        description: '生命的开始，充满无限可能',
        icon: '👶',
        progress: 0,
        achievements: [
            { name: '第一次呼吸', unlocked: false, icon: '💨' },
            { name: '第一声啼哭', unlocked: false, icon: '??' },
            { name: '新生儿体检', unlocked: false, icon: '🏥' }
        ],
        collectibles: ['🍼', '🧸', '👶'],
        events: ['在医院出生', '第一次回家', '第一次笑'],
        quotes: ['生命是一份珍贵的礼物。', '每个孩子都是奇迹。', '新生命带来新希望。']
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
        ],
        collectibles: ['🧩', '🚲', '📕'],
        events: ['第一个生日', '第一次交朋友', '学会画画'],
        quotes: ['童年是一生最美好的时光。', '好奇心是最好的老师。', '每天都有新发现。']
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
        ],
        collectibles: ['📱', '🎸', '🎓'],
        events: ['第一次旅行', '考上理想大学', '学习新技能'],
        quotes: ['青春是用来奋斗的。', '梦想是前进的动力。', '勇敢追求自己的目标。'],
        miniGame: {
            name: '知识竞赛',
            description: '答对问题获得知识点',
            type: 'quiz'
        }
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
        ],
        collectibles: ['💻', '🚗', '🏠'],
        events: ['升职加薪', '购置房产', '创业尝试'],
        quotes: ['责任让我们成长。', '独立是成年的标志。', '努力工作，认真生活。'],
        miniGame: {
            name: '时间管理',
            description: '平衡工作与生活，安排一天的计划',
            type: 'management'
        }
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
        ],
        collectibles: ['👨‍👩‍👧‍👦', '💍', '🏡'],
        events: ['孩子入学', '职业巅峰', '家庭旅行'],
        quotes: ['家庭是最好的财富。', '付出总有回报。', '经验是最宝贵的资产。'],
        miniGame: {
            name: '家庭决策',
            description: '为家庭做出最佳的资源分配决策',
            type: 'strategy'
        }
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
        ],
        collectibles: ['📔', '🏖️', '??'],
        events: ['金婚纪念', '环球旅行', '教孙辈下棋'],
        quotes: ['智慧来自于经历。', '岁月如歌，回味无穷。', '传承比拥有更重要。'],
        miniGame: {
            name: '人生回忆',
            description: '回忆一生的重要时刻',
            type: 'memory'
        }
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
    
    // 随机显示人生语录
    showRandomQuote(stageIndex);
    
    // 有20%概率触发随机事件
    if (Math.random() < 0.2) {
        setTimeout(() => triggerRandomEvent(stageIndex), 1000);
    }
    
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

// 迷你游戏系统
const miniGames = {
    0: { // 诞生阶段 - 点击游戏
        name: '新生儿反应测试',
        description: '快速点击闪烁的表情！',
        play: function() {
            return new Promise((resolve) => {
                const gamePanel = createGamePanel(this.name, this.description);
                let score = 0;
                let clicks = 0;
                const maxClicks = 10;
                
                const emoji = document.createElement('div');
                emoji.textContent = '??';
                emoji.style.cssText = `
                    font-size: 3rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: absolute;
                `;
                
                const moveEmoji = () => {
                    emoji.style.left = Math.random() * 80 + '%';
                    emoji.style.top = Math.random() * 60 + '%';
                };
                
                emoji.addEventListener('click', () => {
                    score += 10;
                    clicks++;
                    gamePanel.querySelector('.game-score').textContent = `得分: ${score}`;
                    
                    if (clicks >= maxClicks) {
                        setTimeout(() => {
                            gamePanel.remove();
                            resolve(score);
                        }, 500);
                    } else {
                        moveEmoji();
                    }
                });
                
                gamePanel.querySelector('.game-content').appendChild(emoji);
                moveEmoji();
                setInterval(moveEmoji, 1500);
            });
        }
    },
    1: { // 童年阶段 - 记忆游戏
        name: '记忆大师',
        description: '记住表情的位置！',
        play: function() {
            return new Promise((resolve) => {
                const gamePanel = createGamePanel(this.name, this.description);
                const emojis = ['🧸', '🎮', '📚', '🚲', '⚽', '🎨'];
                let score = 0;
                
                const grid = document.createElement('div');
                grid.style.cssText = `
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                    padding: 20px;
                `;
                
                const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
                let flipped = [];
                let matched = 0;
                
                cards.forEach((emoji, index) => {
                    const card = document.createElement('div');
                    card.className = 'memory-card';
                    card.dataset.emoji = emoji;
                    card.dataset.index = index;
                    card.style.cssText = `
                        width: 60px;
                        height: 60px;
                        background: white;
                        border-radius: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 2rem;
                        cursor: pointer;
                        transform-style: preserve-3d;
                        transition: transform 0.3s;
                    `;
                    
                    card.addEventListener('click', () => {
                        if (flipped.length < 2 && !card.classList.contains('flipped')) {
                            card.textContent = emoji;
                            card.classList.add('flipped');
                            flipped.push(card);
                            
                            if (flipped.length === 2) {
                                setTimeout(() => {
                                    if (flipped[0].dataset.emoji === flipped[1].dataset.emoji) {
                                        score += 20;
                                        matched += 2;
                                        gamePanel.querySelector('.game-score').textContent = `得分: ${score}`;
                                        
                                        if (matched === cards.length) {
                                            setTimeout(() => {
                                                gamePanel.remove();
                                                resolve(score);
                                            }, 500);
                                        }
                                    } else {
                                        flipped.forEach(c => {
                                            c.textContent = '❓';
                                            c.classList.remove('flipped');
                                        });
                                    }
                                    flipped = [];
                                }, 800);
                            }
                        }
                    });
                    
                    card.textContent = '❓';
                    grid.appendChild(card);
                });
                
                gamePanel.querySelector('.game-content').appendChild(grid);
            });
        }
    },
    2: { // 青春阶段 - 打字游戏
        name: '追梦打字',
        description: '快速输入显示的单词！',
        play: function() {
            return new Promise((resolve) => {
                const gamePanel = createGamePanel(this.name, this.description);
                const words = ['梦想', '奋斗', '青春', '热血', '拼搏', '未来'];
                let score = 0;
                let currentWord = '';
                
                const wordDisplay = document.createElement('div');
                wordDisplay.style.cssText = `
                    font-size: 2rem;
                    margin: 20px;
                    color: #667eea;
                `;
                
                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = '在这里输入...';
                input.style.cssText = `
                    width: 80%;
                    padding: 10px;
                    font-size: 1.2rem;
                    border: 2px solid #667eea;
                    border-radius: 8px;
                    margin: 10px;
                `;
                
                const nextWord = () => {
                    currentWord = words[Math.floor(Math.random() * words.length)];
                    wordDisplay.textContent = currentWord;
                    input.value = '';
                    input.focus();
                };
                
                let wordsTyped = 0;
                input.addEventListener('input', () => {
                    if (input.value === currentWord) {
                        score += 15;
                        wordsTyped++;
                        gamePanel.querySelector('.game-score').textContent = `得分: ${score}`;
                        
                        if (wordsTyped >= 5) {
                            setTimeout(() => {
                                gamePanel.remove();
                                resolve(score);
                            }, 500);
                        } else {
                            nextWord();
                        }
                    }
                });
                
                gamePanel.querySelector('.game-content').appendChild(wordDisplay);
                gamePanel.querySelector('.game-content').appendChild(input);
                nextWord();
            });
        }
    },
    3: { // 成年阶段 - 决策游戏
        name: '人生选择',
        description: '做出明智的选择！',
        play: function() {
            return new Promise((resolve) => {
                const gamePanel = createGamePanel(this.name, this.description);
                const scenarios = [
                    {question: '高薪但加班多 vs 钱少但工作轻松', choices: ['高薪', '轻松'], scores: [20, 15]},
                    {question: '买车还是存钱？', choices: ['买车', '存钱'], scores: [10, 25]},
                    {question: '继续进修还是直接工作？', choices: ['进修', '工作'], scores: [25, 15]}
                ];
                
                let totalScore = 0;
                let currentScenario = 0;
                
                const showScenario = () => {
                    if (currentScenario >= scenarios.length) {
                        setTimeout(() => {
                            gamePanel.remove();
                            resolve(totalScore);
                        }, 500);
                        return;
                    }
                    
                    const scenario = scenarios[currentScenario];
                    const content = gamePanel.querySelector('.game-content');
                    content.innerHTML = `
                        <p style="font-size: 1.2rem; margin: 20px;">${scenario.question}</p>
                        <div style="display: flex; gap: 20px; justify-content: center;">
                            ${scenario.choices.map((choice, i) => `
                                <button class="choice-btn" data-index="${i}" style="
                                    padding: 15px 30px;
                                    font-size: 1.1rem;
                                    border: 2px solid #667eea;
                                    background: white;
                                    border-radius: 10px;
                                    cursor: pointer;
                                    transition: all 0.3s;
                                ">${choice}</button>
                            `).join('')}
                        </div>
                    `;
                    
                    content.querySelectorAll('.choice-btn').forEach((btn, i) => {
                        btn.addEventListener('click', () => {
                            totalScore += scenario.scores[i];
                            currentScenario++;
                            gamePanel.querySelector('.game-score').textContent = `得分: ${totalScore}`;
                            showScenario();
                        });
                    });
                };
                
                showScenario();
            });
        }
    }
};

function createGamePanel(title, description) {
    const panel = document.createElement('div');
    panel.className = 'game-panel';
    panel.innerHTML = `
        <div class="game-header">
            <h3>${title}</h3>
            <p>${description}</p>
            <span class="game-score">得分: 0</span>
        </div>
        <div class="game-content"></div>
    `;
    panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 2000;
        min-width: 400px;
        max-width: 500px;
    `;
    document.body.appendChild(panel);
    return panel;
}

function showMiniGame(stageIndex) {
    const game = miniGames[stageIndex] || miniGames[0];
    game.play().then(score => {
        showGameResult(score);
        // 根据分数解锁成就
        if (score > 50) {
            unlockRandomAchievement(stageIndex);
        }
    });
}

function showGameResult(score) {
    const result = document.createElement('div');
    result.className = 'game-result';
    result.innerHTML = `
        <h3>游戏结束！</h3>
        <p style="font-size: 2rem; margin: 20px;">🎉</p>
        <p>最终得分: <strong>${score}</strong></p>
        <p>${score > 80 ? '完美！' : score > 50 ? '不错！' : '继续加油！'}</p>
    `;
    result.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 2001;
        text-align: center;
    `;
    document.body.appendChild(result);
    
    createCelebrationEffect();
    setTimeout(() => result.remove(), 3000);
}

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

// 人生语录系统
function showRandomQuote(stageIndex) {
    const stage = lifeStages[stageIndex];
    if (!stage.quotes || stage.quotes.length === 0) return;
    
    const quote = stage.quotes[Math.floor(Math.random() * stage.quotes.length)];
    
    const quoteBox = document.createElement('div');
    quoteBox.className = 'quote-box';
    quoteBox.innerHTML = `
        <div class="quote-icon">💭</div>
        <div class="quote-text">"${quote}"</div>
    `;
    quoteBox.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.95);
        padding: 20px 30px;
        border-radius: 15px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        max-width: 80%;
        z-index: 1500;
        animation: slideUp 0.5s ease;
        display: flex;
        align-items: center;
        gap: 15px;
    `;
    
    document.body.appendChild(quoteBox);
    
    setTimeout(() => {
        quoteBox.style.animation = 'slideDown 0.5s ease';
        setTimeout(() => quoteBox.remove(), 500);
    }, 4000);
}

// 随机事件系统
function triggerRandomEvent(stageIndex) {
    const stage = lifeStages[stageIndex];
    if (!stage.events || stage.events.length === 0) return;
    
    const event = stage.events[Math.floor(Math.random() * stage.events.length)];
    
    const eventBox = document.createElement('div');
    eventBox.className = 'event-box';
    eventBox.innerHTML = `
        <div class="event-icon">⚡</div>
        <div class="event-content">
            <div class="event-title">随机事件发生！</div>
            <div class="event-text">${event}</div>
        </div>
        <button class="event-close">×</button>
    `;
    eventBox.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 25px;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        z-index: 2000;
        min-width: 300px;
        animation: popIn 0.5s ease;
    `;
    
    document.body.appendChild(eventBox);
    
    // 添加关闭事件
    const closeBtn = eventBox.querySelector('.event-close');
    closeBtn.addEventListener('click', () => {
        eventBox.style.animation = 'popOut 0.3s ease';
        setTimeout(() => eventBox.remove(), 300);
    });
    
    // 自动关闭
    setTimeout(() => {
        if (eventBox.parentNode) {
            eventBox.style.animation = 'popOut 0.3s ease';
            setTimeout(() => eventBox.remove(), 300);
        }
    }, 5000);
    
    // 添加庆祝效果
    createCelebrationEffect();
}

// 收藏品系统
let collectedItems = new Set();

function showCollectiblesPanel() {
    const panel = document.createElement('div');
    panel.className = 'collectibles-panel';
    
    let content = '<h2>我的收藏品</h2><div class="collectibles-grid">';
    
    lifeStages.forEach((stage, index) => {
        content += `<div class="stage-collectibles">
            <h3>${stage.name}</h3>
            <div class="items">`;
        
        stage.collectibles.forEach(item => {
            const collected = collectedItems.has(`${index}-${item}`);
            content += `<span class="collectible-item ${collected ? 'collected' : 'locked'}">${collected ? item : '🔒'}</span>`;
        });
        
        content += '</div></div>';
    });
    
    content += '</div>';
    
    panel.innerHTML = content + '<button class="close-collectibles">关闭</button>';
    panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 15px 50px rgba(0,0,0,0.3);
        z-index: 3000;
        max-width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    document.body.appendChild(panel);
    
    panel.querySelector('.close-collectibles').addEventListener('click', () => {
        panel.remove();
    });
}

// 随机解锁收藏品
function unlockRandomCollectible(stageIndex) {
    const stage = lifeStages[stageIndex];
    const availableItems = stage.collectibles.filter((item, i) => 
        !collectedItems.has(`${stageIndex}-${item}`)
    );
    
    if (availableItems.length > 0) {
        const item = availableItems[Math.floor(Math.random() * availableItems.length)];
        collectedItems.add(`${stageIndex}-${item}`);
        
        showCollectibleUnlock(item);
    }
}

function showCollectibleUnlock(item) {
    const notification = document.createElement('div');
    notification.className = 'collectible-notification';
    notification.innerHTML = `
        <div class="collectible-icon">${item}</div>
        <div>
            <div class="notif-title">获得收藏品！</div>
            <div class="notif-desc">你获得了一个新的收藏品</div>
        </div>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ffd89b, #19547b);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 1500;
        animation: slideInTop 0.5s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutTop 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// 人生统计面板
function showStatsPanel() {
    const totalAchievements = lifeStages.reduce((sum, stage) => sum + stage.achievements.length, 0);
    const unlockedAchievements = lifeStages.reduce((sum, stage) => 
        sum + stage.achievements.filter(a => a.unlocked).length, 0
    );
    
    const totalCollectibles = lifeStages.reduce((sum, stage) => sum + stage.collectibles.length, 0);
    const collectedCount = collectedItems.size;
    
    const panel = document.createElement('div');
    panel.className = 'stats-panel';
    panel.innerHTML = `
        <h2>人生统计</h2>
        <div class="stat-item">
            <span class="stat-label">当前阶段：</span>
            <span class="stat-value">${lifeStages[currentStage].name} ${lifeStages[currentStage].icon}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">已解锁成就：</span>
            <span class="stat-value">${unlockedAchievements} / ${totalAchievements}</span>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(unlockedAchievements/totalAchievements*100)}%"></div>
            </div>
        </div>
        <div class="stat-item">
            <span class="stat-label">收集物品：</span>
            <span class="stat-value">${collectedCount} / ${totalCollectibles}</span>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(collectedCount/totalCollectibles*100)}%"></div>
            </div>
        </div>
        <div class="stat-item">
            <span class="stat-label">人生进度：</span>
            <span class="stat-value">${lifeStages[currentStage].progress.toFixed(1)}%</span>
        </div>
        <button class="view-collectibles">查看收藏品</button>
        <button class="close-stats">关闭</button>
    `;
    panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 15px 50px rgba(0,0,0,0.3);
        z-index: 3000;
        min-width: 400px;
    `;
    
    document.body.appendChild(panel);
    
    panel.querySelector('.close-stats').addEventListener('click', () => {
        panel.remove();
    });
    
    panel.querySelector('.view-collectibles').addEventListener('click', () => {
        panel.remove();
        showCollectiblesPanel();
    });
}

// 添加统计按钮到控制面板
function addStatsButton() {
    const statsBtn = document.createElement('button');
    statsBtn.id = 'statsBtn';
    statsBtn.className = 'control-btn';
    statsBtn.textContent = '📊 统计';
    statsBtn.addEventListener('click', showStatsPanel);
    
    const controls = document.querySelector('.controls');
    if (controls) {
        controls.appendChild(statsBtn);
    }
}

// 在初始化时添加统计按钮
document.addEventListener('DOMContentLoaded', () => {
    init();
    initVisualEffects();
    addStatsButton();
    
    // 每次切换阶段时有30%概率解锁收藏品
    const originalUpdateStage = updateStage;
    updateStage = function(stageIndex) {
        originalUpdateStage(stageIndex);
        if (Math.random() < 0.3) {
            setTimeout(() => unlockRandomCollectible(stageIndex), 1500);
        }
    };
});

// 粒子特效
function createParticleEffect() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1000';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const particles = [];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.size > 0.2) this.size -= 0.1;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function handleParticles() {
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            if (particles[i].size <= 0.2) {
                particles.splice(i, 1);
                i--;
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (particles.length < 100) {
            particles.push(new Particle());
        }
        handleParticles();
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// 动态背景
function createDynamicBackground() {
    const background = document.createElement('div');
    background.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #ff9a9e, #fad0c4, #ffecd2);
        background-size: 400% 400%;
        animation: gradientBG 15s ease infinite;
        z-index: -1;
    `;
    document.body.insertBefore(background, document.body.firstChild);

    const style = document.createElement('style');
    style.textContent = `
        @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
    document.head.appendChild(style);
}

// 初始化特效
document.addEventListener('DOMContentLoaded', () => {
    init();
    createParticleEffect();
    createDynamicBackground();
});

// 粒子效果
function createParticleSystem() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    document.body.appendChild(particleContainer);

    const particleCount = 50;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        particleContainer.appendChild(particle);
        particles.push(particle);
    }

    function updateParticles() {
        particles.forEach(particle => {
            if (parseFloat(particle.style.top) > 100) {
                particle.style.top = '-5vh';
                particle.style.left = Math.random() * 100 + 'vw';
            }
        });
        requestAnimationFrame(updateParticles);
    }

    updateParticles();
}

// 动态背景
function createDynamicBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'bgCanvas';
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const colors = ['#667eea', '#764ba2', '#6B8DD6', '#8E37D7'];
    let step = 0;

    function drawBackground() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i <= width; i += 20) {
            const t = i + step;
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, colors[0]);
            gradient.addColorStop(1, colors[1]);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 10;
            ctx.stroke();
        }

        step += 0.5;
        if (step >= 20) {
            step = 0;
        }

        requestAnimationFrame(drawBackground);
    }

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    drawBackground();
}

// 初始化视觉效果
function initVisualEffects() {
    createParticleSystem();
    createDynamicBackground();
}

// 游戏规则侧边栏控制
function initRulesSidebar() {
    const toggleBtn = document.getElementById('toggleRules');
    const sidebar = document.querySelector('.game-rules-sidebar');
    
    if (!toggleBtn || !sidebar) return;

    // 初始状态设置为展开
    let isCollapsed = false;
    
    toggleBtn.addEventListener('click', () => {
        isCollapsed = !isCollapsed;
        sidebar.classList.toggle('collapsed', isCollapsed);
        toggleBtn.textContent = isCollapsed ? '展开' : '收起';
    });
    
    // 添加"统计"按钮到控制面板
    addStatsBtnIfNeeded();
}

// 在页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    init();
    initVisualEffects();
    initRulesSidebar();
});

// 添加粒子和背景样式
const visualEffectsStyle = document.createElement('style');
visualEffectsStyle.textContent = `
    .particle-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    }
    .particle {
        position: absolute;
        width: 5px;
        height: 5px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        animation: float linear infinite;
    }
    @keyframes float {
        0% { transform: translateY(0); }
        100% { transform: translateY(100vh); }
    }
    #bgCanvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
`;
document.head.appendChild(visualEffectsStyle);