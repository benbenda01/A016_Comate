// ===== 人生阶段数据定义 =====
const lifeStages = [
    {
        name: '诞生',
        description: '生命的开始，充满无限可能',
        icon: '👶',
        color: 0xFFB6C1,
        achievements: ['第一次呼吸', '第一声啼哭', '新生儿体检'],
        quotes: ['生命是一份珍贵的礼物。', '每个孩子都是奇迹。', '新生命带来新希望。']
    },
    {
        name: '童年',
        description: '无忧无虑，探索世界的年纪',
        icon: '🧒',
        color: 0xFFE4B5,
        achievements: ['第一次走路', '第一天上幼儿园', '学会骑自行车'],
        quotes: ['童年是一生最美好的时光。', '好奇心是最好的老师。', '每天都有新发现。']
    },
    {
        name: '青春',
        description: '追逐梦想，热血奋斗的时光',
        icon: '🎓',
        color: 0x87CEEB,
        achievements: ['初恋', '毕业典礼', '第一份兼职'],
        quotes: ['青春是用来奋斗的。', '梦想是前进的动力。', '勇敢追求自己的目标。']
    },
    {
        name: '成年',
        description: '承担责任，创造价值的阶段',
        icon: '💼',
        color: 0x98FB98,
        achievements: ['第一份全职工作', '独立生活', '买车'],
        quotes: ['责任让我们成长。', '独立是成年的标志。', '努力工作，认真生活。']
    },
    {
        name: '中年',
        description: '事业有成，家庭美满的收获期',
        icon: '👨‍👩‍👧‍👦',
        color: 0xDDA0DD,
        achievements: ['结婚', '第一个孩子', '升职加薪'],
        quotes: ['家庭是最好的财富。', '付出总有回报。', '经验是最宝贵的资产。']
    },
    {
        name: '暮年',
        description: '智慧沉淀，享受人生的时光',
        icon: '👴',
        color: 0xF0E68C,
        achievements: ['退休', '第一个孙子', '写回忆录'],
        quotes: ['智慧来自于经历。', '岁月如歌，回味无穷。', '传承比拥有更重要。']
    }
];

// ===== 游戏状态管理 =====
class GameState {
    constructor() {
        this.isPlaying = false;
        this.isPaused = false;
        this.isAutoMode = true;
        this.currentStageIndex = 0;
        this.snakeLength = 1;
        this.achievementsUnlocked = 0;
        this.score = 0;
    }

    reset() {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentStageIndex = 0;
        this.snakeLength = 1;
        this.achievementsUnlocked = 0;
        this.score = 0;
    }
}

// ===== 3D贪吃蛇游戏引擎 =====
class SnakeGame3D {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.gameState = new GameState();
        
        // 游戏配置
        this.gridSize = 20;
        this.cellSize = 1;
        this.moveSpeed = 200; // 毫秒
        this.lastMoveTime = 0;
        
        // 蛇的状态
        this.snake = [];
        this.direction = { x: 1, y: 0, z: 0 };
        this.nextDirection = { x: 1, y: 0, z: 0 };
        
        // 食物（人生目标）
        this.food = null;
        this.foodStageIndex = 0;
        
        // Three.js 对象
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.snakeSegments = [];
        this.foodMesh = null;
        this.cameraAngle = 0;
        this.cameraDistance = 25;
        
        this.init();
    }

    init() {
        this.setupScene();
        this.setupLights();
        this.setupGrid();
        this.createSnake();
        this.spawnFood();
        this.setupEventListeners();
        this.animate();
        
        // 隐藏加载屏幕
        setTimeout(() => {
            document.getElementById('loading-screen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loading-screen').style.display = 'none';
            }, 500);
        }, 1000);
    }

    setupScene() {
        // 场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        this.scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);

        // 相机
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.updateCameraPosition();

        // 渲染器
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // 窗口调整
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    setupLights() {
        // 环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // 方向光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.left = -30;
        directionalLight.shadow.camera.right = 30;
        directionalLight.shadow.camera.top = 30;
        directionalLight.shadow.camera.bottom = -30;
        this.scene.add(directionalLight);

        // 点光源（跟随食物）
        this.foodLight = new THREE.PointLight(0xffffff, 1, 10);
        this.scene.add(this.foodLight);
    }

    setupGrid() {
        // 创建网格地板
        const gridHelper = new THREE.GridHelper(
            this.gridSize * this.cellSize,
            this.gridSize,
            0x444444,
            0x222222
        );
        this.scene.add(gridHelper);

        // 创建边界
        const boundaryMaterial = new THREE.MeshPhongMaterial({
            color: 0x333366,
            transparent: true,
            opacity: 0.3
        });

        const boundaryGeometry = new THREE.BoxGeometry(
            this.gridSize * this.cellSize + 0.2,
            10,
            this.gridSize * this.cellSize + 0.2
        );

        for (let i = 0; i < 4; i++) {
            const wall = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
            const angle = (Math.PI / 2) * i;
            const distance = (this.gridSize * this.cellSize) / 2;
            wall.position.x = Math.sin(angle) * distance;
            wall.position.z = Math.cos(angle) * distance;
            wall.position.y = 5;
            wall.rotation.y = angle;
            this.scene.add(wall);
        }
    }

    createSnake() {
        const startX = 0;
        const startY = 0.5;
        const startZ = 0;
        
        this.snake = [{ x: startX, y: startY, z: startZ }];
        
        const geometry = new THREE.SphereGeometry(this.cellSize / 2, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: lifeStages[0].color,
            emissive: lifeStages[0].color,
            emissiveIntensity: 0.3,
            shininess: 100
        });
        
        const segment = new THREE.Mesh(geometry, material);
        segment.position.set(startX, startY, startZ);
        segment.castShadow = true;
        this.scene.add(segment);
        this.snakeSegments.push(segment);

        // 为蛇头添加"笨"字标签
        this.addTextToSegment(segment, '笨', 0);
    }

    addTextToSegment(segment, text, index) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 256;
        
        context.font = '160px Arial';
        context.fillStyle = '#0000FF'; // 蓝色字体
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 128, 128);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(0.8, 0.8, 1);
        sprite.position.y = 0.9;
        
        segment.add(sprite);
        segment.textSprite = sprite;
    }

    updateSnakeLabels() {
        this.snakeSegments.forEach((segment, index) => {
            if (index === 0) {
                // 蛇头保持"笨"字
                if (!segment.textSprite) {
                    this.addTextToSegment(segment, '笨', 0);
                }
            } else {
                // 更新蛇身的序列数字
                if (segment.textSprite) {
                    segment.remove(segment.textSprite);
                }
                this.addTextToSegment(segment, index.toString(), index);
            }
        });
    }

    spawnFood() {
        let foodPos;
        let attempts = 0;
        const maxAttempts = 100;

        do {
            foodPos = {
                x: Math.floor(Math.random() * this.gridSize - this.gridSize / 2) * this.cellSize,
                y: 0.5,
                z: Math.floor(Math.random() * this.gridSize - this.gridSize / 2) * this.cellSize
            };
            attempts++;
        } while (this.isPositionOccupied(foodPos) && attempts < maxAttempts);

        this.food = foodPos;

        // 移除旧食物
        if (this.foodMesh) {
            this.scene.remove(this.foodMesh);
        }

        // 创建新食物（立方体 + 光晕效果）
        const stageColor = lifeStages[this.foodStageIndex].color;
        
        const geometry = new THREE.BoxGeometry(
            this.cellSize * 0.8,
            this.cellSize * 0.8,
            this.cellSize * 0.8
        );
        const material = new THREE.MeshPhongMaterial({
            color: stageColor,
            emissive: stageColor,
            emissiveIntensity: 0.5,
            shininess: 100
        });
        
        this.foodMesh = new THREE.Mesh(geometry, material);
        this.foodMesh.position.set(this.food.x, this.food.y, this.food.z);
        this.foodMesh.castShadow = true;
        this.scene.add(this.foodMesh);

        // 更新食物光源
        this.foodLight.position.set(this.food.x, this.food.y + 2, this.food.z);
        this.foodLight.color.setHex(stageColor);
    }

    isPositionOccupied(pos) {
        return this.snake.some(segment => 
            segment.x === pos.x && 
            segment.y === pos.y && 
            segment.z === pos.z
        );
    }

    moveSnake() {
        if (!this.gameState.isPlaying || this.gameState.isPaused) return;

        const currentTime = Date.now();
        if (currentTime - this.lastMoveTime < this.moveSpeed) return;
        this.lastMoveTime = currentTime;

        // 更新方向
        this.direction = { ...this.nextDirection };

        // 计算新头部位置
        const head = this.snake[0];
        const newHead = {
            x: head.x + this.direction.x * this.cellSize,
            y: head.y,
            z: head.z + this.direction.z * this.cellSize
        };

        // 边界检查（穿墙效果）
        const halfGrid = (this.gridSize / 2) * this.cellSize;
        if (newHead.x >= halfGrid) newHead.x = -halfGrid + this.cellSize;
        if (newHead.x < -halfGrid) newHead.x = halfGrid - this.cellSize;
        if (newHead.z >= halfGrid) newHead.z = -halfGrid + this.cellSize;
        if (newHead.z < -halfGrid) newHead.z = halfGrid - this.cellSize;

        // 碰撞检测（撞到自己游戏结束）
        if (this.isPositionOccupied(newHead)) {
            this.gameOver();
            return;
        }

        // 添加新头部
        this.snake.unshift(newHead);

        // 检查是否吃到食物
        if (this.isEatingFood(newHead)) {
            this.eatFood();
        } else {
            // 移除尾部
            const removedSegment = this.snake.pop();
            const removedMesh = this.snakeSegments.pop();
            this.scene.remove(removedMesh);
        }

        // 添加新的头部网格
        const stageIndex = Math.min(
            Math.floor(this.snake.length / 3),
            lifeStages.length - 1
        );
        const stageColor = lifeStages[stageIndex].color;
        
        const geometry = new THREE.SphereGeometry(this.cellSize / 2, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: stageColor,
            emissive: stageColor,
            emissiveIntensity: 0.3,
            shininess: 100
        });
        
        const segment = new THREE.Mesh(geometry, material);
        segment.position.set(newHead.x, newHead.y, newHead.z);
        segment.castShadow = true;
        this.scene.add(segment);
        this.snakeSegments.unshift(segment);

        // 更新蛇身颜色（渐变效果）
        this.updateSnakeColors();

        // 更新所有蛇节的文字标签
        this.updateSnakeLabels();
    }

    updateSnakeColors() {
        const rainbowColors = [
            0xFF0000, // 赤
            0xFF7F00, // 橙
            0xFFFF00, // 黄
            0x00FF00, // 绿
            0x00FFFF, // 青
            0x0000FF, // 蓝
            0x8B00FF  // 紫
        ];
        this.snakeSegments.forEach((segment, index) => {
            const colorIndex = index % rainbowColors.length;
            const color = rainbowColors[colorIndex];
            segment.material.color.setHex(color);
            segment.material.emissive.setHex(color);
        });
    }

    isEatingFood(pos) {
        if (!this.food) return false;
        return Math.abs(pos.x - this.food.x) < 0.1 &&
               Math.abs(pos.y - this.food.y) < 0.1 &&
               Math.abs(pos.z - this.food.z) < 0.1;
    }

    eatFood() {
        this.gameState.snakeLength = this.snake.length;
        this.gameState.score += 10;
        
        // 更新当前人生阶段
        const newStageIndex = Math.min(
            Math.floor(this.snake.length / 3),
            lifeStages.length - 1
        );
        
        if (newStageIndex > this.gameState.currentStageIndex) {
            this.gameState.currentStageIndex = newStageIndex;
            this.onStageChange(newStageIndex);
        }

        // 解锁成就
        this.gameState.achievementsUnlocked++;
        this.showAchievement();

        // 显示随机格言
        if (Math.random() < 0.3) {
            this.showQuote();
        }

        // 更新UI
        this.updateUI();

        // 生成新食物
        this.foodStageIndex = Math.min(
            this.foodStageIndex + 1,
            lifeStages.length - 1
        );
        this.spawnFood();

        // 检查是否完成游戏
        if (this.gameState.achievementsUnlocked >= 18) {
            setTimeout(() => this.gameComplete(), 1000);
        }
    }

    onStageChange(stageIndex) {
        const stage = lifeStages[stageIndex];
        
        // 更新阶段信息
        document.getElementById('current-stage').textContent = stage.name;
        document.getElementById('stage-desc').textContent = stage.description;

        // 创建舞台变化特效
        this.createStageChangeEffect(stage.color);
        
        // 显示阶段格言
        this.showQuote(stage.quotes[0]);
    }

    createStageChangeEffect(color) {
        const particleCount = 50;
        const particles = new THREE.Group();

        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.1, 8, 8);
            const material = new THREE.MeshBasicMaterial({ color: color });
            const particle = new THREE.Mesh(geometry, material);
            
            const angle = (Math.PI * 2 * i) / particleCount;
            const radius = 5;
            particle.position.set(
                Math.cos(angle) * radius,
                Math.random() * 10,
                Math.sin(angle) * radius
            );
            
            particles.add(particle);
        }

        this.scene.add(particles);

        // 动画
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed > 2000) {
                this.scene.remove(particles);
                return;
            }

            particles.children.forEach((particle, i) => {
                particle.position.y -= 0.05;
                particle.rotation.x += 0.1;
                particle.rotation.y += 0.1;
            });

            requestAnimationFrame(animate);
        };
        animate();
    }

    showAchievement() {
        const popup = document.getElementById('achievement-popup');
        const stageIndex = this.gameState.currentStageIndex;
        const achievementIndex = (this.gameState.achievementsUnlocked - 1) % 3;
        const achievement = lifeStages[stageIndex].achievements[achievementIndex];

        document.getElementById('achievement-title').textContent = '成就解锁！';
        document.getElementById('achievement-desc').textContent = achievement;

        popup.classList.remove('hidden');
        setTimeout(() => {
            popup.classList.add('hidden');
        }, 3000);
    }

    showQuote(customQuote = null) {
        const quoteDisplay = document.getElementById('quote-display');
        const quoteText = document.getElementById('quote-text');
        
        let quote;
        if (customQuote) {
            quote = customQuote;
        } else {
            const stage = lifeStages[this.gameState.currentStageIndex];
            quote = stage.quotes[Math.floor(Math.random() * stage.quotes.length)];
        }

        quoteText.textContent = quote;
        quoteDisplay.classList.remove('hidden');

        setTimeout(() => {
            quoteDisplay.classList.add('hidden');
        }, 4000);
    }

    autoMove() {
        if (!this.gameState.isAutoMode || !this.food) return;

        const head = this.snake[0];
        const dx = this.food.x - head.x;
        const dz = this.food.z - head.z;

        // 智能寻路（简单版）
        if (Math.abs(dx) > Math.abs(dz)) {
            if (dx > 0) this.setDirection(1, 0, 0);
            else this.setDirection(-1, 0, 0);
        } else {
            if (dz > 0) this.setDirection(0, 0, 1);
            else this.setDirection(0, 0, -1);
        }
    }

    setDirection(x, y, z) {
        // 防止反向移动
        if (this.direction.x === -x && this.direction.z === -z) return;
        this.nextDirection = { x, y, z };
    }

    updateCameraPosition() {
        const angle = this.cameraAngle;
        this.camera.position.x = Math.sin(angle) * this.cameraDistance;
        this.camera.position.y = 15;
        this.camera.position.z = Math.cos(angle) * this.cameraDistance;
        this.camera.lookAt(0, 0, 0);
    }

    toggleCamera() {
        this.cameraAngle += Math.PI / 4;
        this.updateCameraPosition();
    }

    zoomCamera(direction) {
        this.cameraDistance = Math.max(15, Math.min(35, this.cameraDistance + direction * 2));
        this.updateCameraPosition();
    }

    updateUI() {
        document.getElementById('snake-length').textContent = this.snake.length;
        document.getElementById('stage-progress').textContent = 
            `${this.gameState.currentStageIndex + 1}/6`;
        document.getElementById('achievements').textContent = 
            `${this.gameState.achievementsUnlocked}/18`;
    }

    setupEventListeners() {
        // 开始按钮
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });

        // 暂停按钮
        document.getElementById('pause-btn').addEventListener('click', () => {
            this.togglePause();
        });

        // 重启按钮
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartGame();
        });

        // 视角切换
        document.getElementById('view-toggle').addEventListener('click', () => {
            this.toggleCamera();
        });

        // 缩放按钮
        document.getElementById('zoom-in').addEventListener('click', () => {
            this.zoomCamera(-1);
        });

        document.getElementById('zoom-out').addEventListener('click', () => {
            this.zoomCamera(1);
        });

        // 键盘控制
        document.addEventListener('keydown', (e) => {
            if (!this.gameState.isPlaying) return;

            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.setDirection(0, 0, -1);
                    this.gameState.isAutoMode = false;
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.setDirection(0, 0, 1);
                    this.gameState.isAutoMode = false;
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.setDirection(-1, 0, 0);
                    this.gameState.isAutoMode = false;
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.setDirection(1, 0, 0);
                    this.gameState.isAutoMode = false;
                    break;
                case ' ':
                    this.togglePause();
                    break;
            }
        });

        // 关闭规则面板
        document.getElementById('close-rules').addEventListener('click', () => {
            document.getElementById('rules-panel').style.display = 'none';
        });

        // 游戏结束后重启
        document.getElementById('restart-final').addEventListener('click', () => {
            this.restartGame();
        });
    }

    startGame() {
        this.gameState.isPlaying = true;
        this.gameState.isPaused = false;
        
        document.getElementById('start-btn').disabled = true;
        document.getElementById('pause-btn').disabled = false;
        document.getElementById('rules-panel').style.display = 'none';

        this.showQuote('让我们开始这段人生旅程吧！');
    }

    togglePause() {
        this.gameState.isPaused = !this.gameState.isPaused;
        const pauseBtn = document.getElementById('pause-btn');
        
        if (this.gameState.isPaused) {
            pauseBtn.querySelector('.btn-text').textContent = '继续';
            pauseBtn.querySelector('.btn-icon').textContent = '▶️';
        } else {
            pauseBtn.querySelector('.btn-text').textContent = '暂停';
            pauseBtn.querySelector('.btn-icon').textContent = '⏸️';
        }
    }

    restartGame() {
        // 清除场景中的蛇
        this.snakeSegments.forEach(segment => this.scene.remove(segment));
        this.snakeSegments = [];
        this.snake = [];

        // 重置游戏状态
        this.gameState.reset();
        this.foodStageIndex = 0;

        // 重新创建蛇和食物
        this.createSnake();
        this.spawnFood();

        // 重置UI
        this.updateUI();
        document.getElementById('current-stage').textContent = lifeStages[0].name;
        document.getElementById('stage-desc').textContent = lifeStages[0].description;
        document.getElementById('start-btn').disabled = false;
        document.getElementById('pause-btn').disabled = true;
        document.getElementById('game-over-panel').classList.add('hidden');

        // 重置方向
        this.direction = { x: 1, y: 0, z: 0 };
        this.nextDirection = { x: 1, y: 0, z: 0 };
        this.gameState.isAutoMode = true;
    }

    gameOver() {
        this.gameState.isPlaying = false;
        
        // 显示游戏结束面板
        document.getElementById('final-length').textContent = this.snake.length;
        document.getElementById('final-stages').textContent = 
            `${this.gameState.currentStageIndex + 1}/6`;
        document.getElementById('final-achievements').textContent = 
            `${this.gameState.achievementsUnlocked}/18`;
        
        document.getElementById('game-over-panel').classList.remove('hidden');
    }

    gameComplete() {
        this.gameState.isPlaying = false;
        
        // 显示完成面板
        document.getElementById('final-length').textContent = this.snake.length;
        document.getElementById('final-stages').textContent = '6/6';
        document.getElementById('final-achievements').textContent = '18/18';
        
        const panel = document.getElementById('game-over-panel');
        panel.querySelector('h2').textContent = '🎉 恭喜！完成人生旅程 🎉';
        panel.classList.remove('hidden');
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // 自动移动
        if (this.gameState.isAutoMode) {
            this.autoMove();
        }

        // 移动蛇
        this.moveSnake();

        // 食物旋转动画
        if (this.foodMesh) {
            this.foodMesh.rotation.y += 0.02;
            this.foodMesh.position.y = 0.5 + Math.sin(Date.now() * 0.003) * 0.2;
        }

        // 渲染场景
        this.renderer.render(this.scene, this.camera);
    }
}

// ===== 初始化游戏 =====
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new SnakeGame3D();
});