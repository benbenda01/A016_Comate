// 3D贪吃蛇游戏 - 人生旅程版
// 基于Three.js的3D实现

// 游戏核心变量
let scene, camera, renderer, snake, food;
let gameBoard, direction, gameOver;
let score = 0;
let autoPlay = false;
let animationId;

// 人生阶段配置（从现有项目中提取）
const lifeStages = [
    {
        name: '诞生',
        description: '生命的开始，充满无限可能',
        icon: '👶',
        color: 0xff9a9e,
        foodType: '🍼',
        environment: 'hospital'
    },
    {
        name: '童年',
        description: '无忧无虑，探索世界的年纪',
        icon: '🧒',
        color: 0xffecd2,
        foodType: '🍭',
        environment: 'playground'
    },
    {
        name: '青春',
        description: '追逐梦想，热血奋斗的时光',
        icon: '🎓',
        color: 0x667eea,
        foodType: '📚',
        environment: 'school'
    },
    {
        name: '成年',
        description: '承担责任，创造价值的阶段',
        icon: '💼',
        color: 0x764ba2,
        foodType: '💰',
        environment: 'office'
    },
    {
        name: '中年',
        description: '事业有成，家庭美满的收获期',
        icon: '👨‍👩‍👧‍👦',
        color: 0x6B8DD6,
        foodType: '🏠',
        environment: 'home'
    },
    {
        name: '暮年',
        description: '智慧沉淀，享受人生的时光',
        icon: '??',
        color: 0x8E37D7,
        foodType: '📔',
        environment: 'park'
    }
];

// 当前生命阶段索引
let currentStageIndex = 0;

// 初始化函数
function init() {
    // 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(lifeStages[currentStageIndex].color);

    // 创建相机
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 15);
    camera.lookAt(0, 0, 0);

    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('game-container').appendChild(renderer.domElement);

    // 添加光源
    addLights();

    // 创建游戏板
    createGameBoard();

    // 初始化蛇
    initSnake();

    // 生成第一个食物
    generateFood();

    // 添加环境
    createEnvironment(lifeStages[currentStageIndex].environment);

    // 添加事件监听器
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('keydown', onKeyDown);

    // 添加控制按钮
    createControlButtons();

    // 显示当前阶段信息
    updateStageInfo();

    // 启动游戏循环
    animate();
}

// 添加光照
function addLights() {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // 方向光（产生阴影）
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(20, 30, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
}

// 创建游戏板
function createGameBoard() {
    // 游戏板大小（网格单元数量）
    gameBoard = {
        width: 20,
        height: 20,
        size: 1 // 每个网格单元的大小
    };

    // 创建地板
    const floorGeometry = new THREE.PlaneGeometry(
        gameBoard.width * gameBoard.size,
        gameBoard.height * gameBoard.size
    );
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.8,
        metalness: 0.2,
        transparent: true,
        opacity: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // 添加网格线
    const gridHelper = new THREE.GridHelper(
        gameBoard.width * gameBoard.size,
        gameBoard.width,
        0x000000,
        0xcccccc
    );
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);
}

// 初始化蛇
function initSnake() {
    // 蛇的初始长度
    const initialLength = 3;
    
    // 蛇的身体部分数组
    snake = [];
    
    // 蛇头几何体和材质
    const headGeometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    const headMaterial = new THREE.MeshStandardMaterial({
        color: lifeStages[currentStageIndex].color,
        roughness: 0.5,
        metalness: 0.5
    });
    
    // 蛇身体几何体和材质
    const bodyGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: lifeStages[currentStageIndex].color,
        roughness: 0.5,
        metalness: 0.2
    });
    
    // 创建蛇的初始身体
    for (let i = 0; i < initialLength; i++) {
        const segment = new THREE.Mesh(
            i === 0 ? headGeometry : bodyGeometry,
            i === 0 ? headMaterial : bodyMaterial
        );
        
        // 设置位置 - 初始水平放置
        segment.position.x = -i;
        segment.position.y = 0.5; // 半个单位高，使其位于网格中心
        segment.position.z = 0;
        
        // 启用阴影
        segment.castShadow = true;
        segment.receiveShadow = true;
        
        // 添加到场景
        scene.add(segment);
        
        // 添加到蛇数组
        snake.push(segment);

        // 为蛇头添加"笨"字
        if (i === 0) {
            const headSprite = makeTextSprite('笨');
            headSprite.position.set(0, 0.7, 0);
            segment.add(headSprite);
        } else {
            // 为蛇身添加序列数字
            const bodySprite = makeTextSprite(i.toString());
            bodySprite.position.set(0, 0.7, 0);
            segment.add(bodySprite);
        }
    }
    
    // 初始方向 - 向右
    direction = { x: 1, y: 0, z: 0 };
    
    // 游戏状态
    gameOver = false;
}

// 生成食物
function generateFood() {
    // 如果已有食物，先移除
    if (food) {
        scene.remove(food);
    }
    
    // 随机位置
    const foodPosition = getRandomFoodPosition();
    
    // 为当前生命阶段创建特定食物
    const foodGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const foodMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        emissive: lifeStages[currentStageIndex].color,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8
    });
    
    food = new THREE.Mesh(foodGeometry, foodMaterial);
    food.position.set(foodPosition.x, 0.5, foodPosition.z);
    food.castShadow = true;
    
    // 添加浮动动画
    food.userData.floatY = 0;
    
    scene.add(food);
    
    // 在食物上方添加图标标识
    const sprite = makeTextSprite(lifeStages[currentStageIndex].foodType);
    sprite.position.set(0, 1, 0);
    food.add(sprite);
}

// 获取随机食物位置（确保不与蛇重叠）
function getRandomFoodPosition() {
    const gridWidth = gameBoard.width;
    const gridHeight = gameBoard.height;
    
    // 尝试次数限制，防止死循环
    let attempts = 0;
    const maxAttempts = 50;
    
    while (attempts < maxAttempts) {
        // 生成随机位置
        const x = Math.floor(Math.random() * gridWidth) - Math.floor(gridWidth / 2);
        const z = Math.floor(Math.random() * gridHeight) - Math.floor(gridHeight / 2);
        
        // 检查是否与蛇重叠
        let overlapping = false;
        for (const segment of snake) {
            if (Math.abs(segment.position.x - x) < 0.5 && 
                Math.abs(segment.position.z - z) < 0.5) {
                overlapping = true;
                break;
            }
        }
        
        if (!overlapping) {
            return { x, z };
        }
        
        attempts++;
    }
    
    // 如果尝试多次仍找不到，返回一个远离蛇头的位置
    const head = snake[0];
    return {
        x: head.position.x + 10,
        z: head.position.z + 10
    };
}

// 创建文本精灵
function makeTextSprite(text) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 128;
    canvas.height = 128;
    
    context.font = '80px Arial';
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, 64, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(1, 1, 1);
    
    return sprite;
}

// 创建环境元素
function createEnvironment(type) {
    // 清除旧环境元素
    scene.children.forEach(child => {
        if (child.userData && child.userData.isEnvironment) {
            scene.remove(child);
        }
    });
    
    // 根据当前阶段创建环境
    switch(type) {
        case 'hospital':
            createHospitalEnvironment();
            break;
        case 'playground':
            createPlaygroundEnvironment();
            break;
        case 'school':
            createSchoolEnvironment();
            break;
        case 'office':
            createOfficeEnvironment();
            break;
        case 'home':
            createHomeEnvironment();
            break;
        case 'park':
            createParkEnvironment();
            break;
    }
}

// 各种环境创建函数
function createHospitalEnvironment() {
    // 医院建筑
    const building = new THREE.Group();
    
    // 主体
    const buildingGeom = new THREE.BoxGeometry(15, 10, 15);
    const buildingMat = new THREE.MeshStandardMaterial({ color: 0xE0E0E0 });
    const buildingMesh = new THREE.Mesh(buildingGeom, buildingMat);
    buildingMesh.position.set(15, 5, -15);
    buildingMesh.castShadow = true;
    buildingMesh.receiveShadow = true;
    building.add(buildingMesh);
    
    // 标志
    const signGeom = new THREE.BoxGeometry(3, 3, 0.5);
    const signMat = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
    const signMesh = new THREE.Mesh(signGeom, signMat);
    signMesh.position.set(0, 3, 0.1);
    const sprite = makeTextSprite('🏥');
    sprite.position.set(0, 0, 1);
    signMesh.add(sprite);
    buildingMesh.add(signMesh);
    
    building.userData = { isEnvironment: true };
    scene.add(building);
}

function createPlaygroundEnvironment() {
    const playground = new THREE.Group();
    
    // 滑梯
    const slideTop = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.5, 3),
        new THREE.MeshStandardMaterial({ color: 0xE91E63 })
    );
    slideTop.position.set(-15, 3, 15);
    slideTop.castShadow = true;
    playground.add(slideTop);
    
    const slideRamp = new THREE.Mesh(
        new THREE.BoxGeometry(6, 0.5, 3),
        new THREE.MeshStandardMaterial({ color: 0xE91E63 })
    );
    slideRamp.position.set(-12, 1.5, 15);
    slideRamp.rotation.z = -Math.PI / 6;
    slideRamp.castShadow = true;
    playground.add(slideRamp);
    
    // 秋千
    const swingSet = new THREE.Group();
    
    // 支架
    const poleGeom = new THREE.CylinderGeometry(0.2, 0.2, 5);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x795548 });
    
    const pole1 = new THREE.Mesh(poleGeom, poleMat);
    pole1.position.set(15, 2.5, 12);
    pole1.castShadow = true;
    swingSet.add(pole1);
    
    const pole2 = new THREE.Mesh(poleGeom, poleMat);
    pole2.position.set(15, 2.5, 18);
    pole2.castShadow = true;
    swingSet.add(pole2);
    
    // 顶部横杆
    const crossbar = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.4, 7),
        new THREE.MeshStandardMaterial({ color: 0x795548 })
    );
    crossbar.position.set(15, 5, 15);
    crossbar.castShadow = true;
    swingSet.add(crossbar);
    
    // 秋千座位
    const seatGeom = new THREE.BoxGeometry(1.5, 0.3, 1);
    const seatMat = new THREE.MeshStandardMaterial({ color: 0x4CAF50 });
    const seat = new THREE.Mesh(seatGeom, seatMat);
    seat.position.set(15, 1.5, 15);
    seat.castShadow = true;
    swingSet.add(seat);
    
    // 链条（简化为线）
    const chainMat = new THREE.LineBasicMaterial({ color: 0xAAAAAA });
    
    const chain1Points = [];
    chain1Points.push(new THREE.Vector3(15, 5, 14.5));
    chain1Points.push(new THREE.Vector3(15, 1.5, 14.5));
    
    const chain1Geom = new THREE.BufferGeometry().setFromPoints(chain1Points);
    const chain1 = new THREE.Line(chain1Geom, chainMat);
    swingSet.add(chain1);
    
    const chain2Points = [];
    chain2Points.push(new THREE.Vector3(15, 5, 15.5));
    chain2Points.push(new THREE.Vector3(15, 1.5, 15.5));
    
    const chain2Geom = new THREE.BufferGeometry().setFromPoints(chain2Points);
    const chain2 = new THREE.Line(chain2Geom, chainMat);
    swingSet.add(chain2);
    
    playground.add(swingSet);
    
    playground.userData = { isEnvironment: true };
    scene.add(playground);
}

function createSchoolEnvironment() {
    const school = new THREE.Group();
    
    // 学校主体
    const buildingGeom = new THREE.BoxGeometry(20, 8, 12);
    const buildingMat = new THREE.MeshStandardMaterial({ color: 0xFFCA28 });
    const building = new THREE.Mesh(buildingGeom, buildingMat);
    building.position.set(-15, 4, -15);
    building.castShadow = true;
    building.receiveShadow = true;
    school.add(building);
    
    // 屋顶
    const roofGeom = new THREE.ConeGeometry(15, 5, 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xA52714 });
    const roof = new THREE.Mesh(roofGeom, roofMat);
    roof.rotation.y = Math.PI / 4;
    roof.position.set(-15, 10.5, -15);
    roof.castShadow = true;
    school.add(roof);
    
    // 门
    const doorGeom = new THREE.PlaneGeometry(3, 5);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x5D4037 });
    const door = new THREE.Mesh(doorGeom, doorMat);
    door.position.set(-15, 2.5, -8.9);
    school.add(door);
    
    // 窗户
    const windowGeom = new THREE.PlaneGeometry(2, 2);
    const windowMat = new THREE.MeshStandardMaterial({ color: 0x90CAF9, transparent: true, opacity: 0.7 });
    
    const window1 = new THREE.Mesh(windowGeom, windowMat);
    window1.position.set(-18, 4, -8.9);
    school.add(window1);
    
    const window2 = new THREE.Mesh(windowGeom, windowMat);
    window2.position.set(-12, 4, -8.9);
    school.add(window2);
    
    // 学校标志
    const signSprite = makeTextSprite('🎓');
    signSprite.position.set(-15, 7, -8.5);
    signSprite.scale.set(2, 2, 2);
    school.add(signSprite);
    
    school.userData = { isEnvironment: true };
    scene.add(school);
}

function createOfficeEnvironment() {
    const office = new THREE.Group();
    
    // 办公楼
    const buildingGeom = new THREE.BoxGeometry(18, 15, 18);
    const buildingMat = new THREE.MeshStandardMaterial({ 
        color: 0x607D8B,
        roughness: 0.1,
        metalness: 0.5
    });
    const building = new THREE.Mesh(buildingGeom, buildingMat);
    building.position.set(15, 7.5, 15);
    building.castShadow = true;
    building.receiveShadow = true;
    office.add(building);
    
    // 玻璃窗户
    const windowRowCount = 5;
    const windowColCount = 6;
    const windowSize = 1.5;
    const windowSpacing = 2.5;
    const windowGeom = new THREE.PlaneGeometry(windowSize, windowSize);
    const windowMat = new THREE.MeshStandardMaterial({ 
        color: 0xB3E5FC, 
        transparent: true, 
        opacity: 0.7,
        metalness: 0.8,
        roughness: 0.2
    });
    
    // 前面的窗户
    for (let row = 0; row < windowRowCount; row++) {
        for (let col = 0; col < windowColCount; col++) {
            const window = new THREE.Mesh(windowGeom, windowMat);
            window.position.set(
                15 - 8 + col * windowSpacing - ((windowColCount-1) * windowSpacing)/2, 
                2.5 + row * 2.5, 
                15 + 9.1
            );
            office.add(window);
        }
    }
    
    // 顶部公司标志
    const signSprite = makeTextSprite('💼');
    signSprite.position.set(15, 16, 15);
    signSprite.scale.set(3, 3, 3);
    office.add(signSprite);
    
    office.userData = { isEnvironment: true };
    scene.add(office);
}

function createHomeEnvironment() {
    const home = new THREE.Group();
    
    // 主房子
    const houseGeom = new THREE.BoxGeometry(12, 6, 10);
    const houseMat = new THREE.MeshStandardMaterial({ color: 0x8D6E63 });
    const house = new THREE.Mesh(houseGeom, houseMat);
    house.position.set(-15, 3, 15);
    house.castShadow = true;
    house.receiveShadow = true;
    home.add(house);
    
    // 屋顶
    const roofGeom = new THREE.ConeGeometry(10, 5, 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xA52714 });
    const roof = new THREE.Mesh(roofGeom, roofMat);
    roof.rotation.y = Math.PI / 4;
    roof.position.set(-15, 8.5, 15);
    roof.castShadow = true;
    home.add(roof);
    
    // 门
    const doorGeom = new THREE.PlaneGeometry(2, 3);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x5D4037 });
    const door = new THREE.Mesh(doorGeom, doorMat);
    door.position.set(-15, 1.5, 20.1);
    home.add(door);
    
    // 窗户
    const windowGeom = new THREE.PlaneGeometry(2, 2);
    const windowMat = new THREE.MeshStandardMaterial({ color: 0x90CAF9, transparent: true, opacity: 0.7 });
    
    const window1 = new THREE.Mesh(windowGeom, windowMat);
    window1.position.set(-18, 3, 20.1);
    home.add(window1);
    
    const window2 = new THREE.Mesh(windowGeom, windowMat);
    window2.position.set(-12, 3, 20.1);
    home.add(window2);
    
    // 烟囱
    const chimneyGeom = new THREE.BoxGeometry(1, 3, 1);
    const chimneyMat = new THREE.MeshStandardMaterial({ color: 0x6D4C41 });
    const chimney = new THREE.Mesh(chimneyGeom, chimneyMat);
    chimney.position.set(-12, 10, 15);
    chimney.castShadow = true;
    home.add(chimney);
    
    // 家庭标志
    const signSprite = makeTextSprite('👨‍👩‍👧‍👦');
    signSprite.position.set(-15, 6, 20.5);
    signSprite.scale.set(1.5, 1.5, 1.5);
    home.add(signSprite);
    
    home.userData = { isEnvironment: true };
    scene.add(home);
}

function createParkEnvironment() {
    const park = new THREE.Group();
    
    // 公园草地基础
    const groundGeom = new THREE.CircleGeometry(15, 32);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x4CAF50 });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(-15, 0.1, -15);
    ground.receiveShadow = true;
    park.add(ground);
    
    // 创建树木
    function createTree(x, z) {
        const tree = new THREE.Group();
        
        // 树干
        const trunkGeom = new THREE.CylinderGeometry(0.5, 0.7, 3, 8);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8D6E63 });
        const trunk = new THREE.Mesh(trunkGeom, trunkMat);
        trunk.position.y = 1.5;
        trunk.castShadow = true;
        tree.add(trunk);
        
        // 树冠
        const leavesGeom = new THREE.SphereGeometry(2, 16, 16);
        const leavesMat = new THREE.MeshStandardMaterial({ color: 0x2E7D32 });
        const leaves = new THREE.Mesh(leavesGeom, leavesMat);
        leaves.position.y = 4;
        leaves.castShadow = true;
        tree.add(leaves);
        
        tree.position.set(x, 0, z);
        return tree;
    }
    
    // 添加多棵树
    park.add(createTree(-20, -15));
    park.add(createTree(-15, -20));
    park.add(createTree(-10, -15));
    park.add(createTree(-15, -10));
    
    // 公园长椅
    const bench = new THREE.Group();
    
    // 椅子座位
    const seatGeom = new THREE.BoxGeometry(5, 0.5, 1.5);
    const seatMat = new THREE.MeshStandardMaterial({ color: 0x795548 });
    const seat = new THREE.Mesh(seatGeom, seatMat);
    seat.position.y = 1;
    seat.castShadow = true;
    bench.add(seat);
    
    // 椅子靠背
    const backGeom = new THREE.BoxGeometry(5, 1.5, 0.5);
    const backMat = new THREE.MeshStandardMaterial({ color: 0x795548 });
    const back = new THREE.Mesh(backGeom, backMat);
    back.position.set(0, 2, -0.5);
    back.castShadow = true;
    bench.add(back);
    
    // 椅子腿
    const legGeom = new THREE.BoxGeometry(0.5, 1, 1.5);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x5D4037 });
    
    const leg1 = new THREE.Mesh(legGeom, legMat);
    leg1.position.set(-2, 0.5, 0);
    leg1.castShadow = true;
    bench.add(leg1);
    
    const leg2 = new THREE.Mesh(legGeom, legMat);
    leg2.position.set(2, 0.5, 0);
    leg2.castShadow = true;
    bench.add(leg2);
    
    bench.position.set(-15, 0, -15);
    park.add(bench);
    
    // 养老标志
    const signSprite = makeTextSprite('👴');
    signSprite.position.set(-15, 6, -15);
    signSprite.scale.set(2, 2, 2);
    park.add(signSprite);
    
    park.userData = { isEnvironment: true };
    scene.add(park);
}

// 更新蛇的移动
function moveSnake() {
    if (gameOver) return;
    
    // 计算新头部位置
    const head = snake[0];
    const newHead = {
        x: head.position.x + direction.x,
        y: head.position.y,
        z: head.position.z + direction.z
    };
    
    // 检查是否撞到自己
    for (let i = 0; i < snake.length; i++) {
        if (Math.abs(snake[i].position.x - newHead.x) < 0.5 && 
            Math.abs(snake[i].position.z - newHead.z) < 0.5) {
            gameOver = true;
            showGameOver();
            return;
        }
    }
 