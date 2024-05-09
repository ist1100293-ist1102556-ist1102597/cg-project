import * as THREE from 'three'

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
let cameras = []
let currentCamera
let scene
let renderer
let materials = []
let clawArmsPivot = []
let clawArms = []
let objects = []

let crane
let arm
let armFront
let cart
let cartCable
let claw
let container
let clock = new THREE.Clock()
let pickedObject
let state = {
    moveArm: 0,
    moveCart: 0,
    moveClaw: 0,
    moveClawArm: 0,
    animation: {
        stage: 0,
        moveArm: false,
        moveCart: false,
    },
}

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict'
    scene = new THREE.Scene()

    scene.add(new THREE.AxesHelper(10))

    scene.background = new THREE.Color(0xa1ffff)
    createCrane()
    createContainer()
    createObjects()

    objects.splice(objects.indexOf(container), 1)
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras() {
    'use strict'

    let cameraScale = 20

    let camera0zoom = cameraScale * 1.3
    cameras[0] = new THREE.OrthographicCamera(
        window.innerWidth / -camera0zoom,
        window.innerWidth / camera0zoom,
        window.innerHeight / camera0zoom,
        window.innerHeight / -camera0zoom,
        1,
        1000
    )
    cameras[0].position.set(-50, 20, 0)
    cameras[0].lookAt(0, 20, 0)

    let camera1zoom = cameraScale * 1.3
    cameras[1] = new THREE.OrthographicCamera(
        window.innerWidth / -camera1zoom,
        window.innerWidth / camera1zoom,
        window.innerHeight / camera1zoom,
        window.innerHeight / -camera1zoom,
        1,
        1000
    )
    cameras[1].position.set(0, 20, 50)
    cameras[1].lookAt(0, 20, 0)

    let camera2zoom = cameraScale * 0.9
    cameras[2] = new THREE.OrthographicCamera(
        window.innerWidth / -camera2zoom,
        window.innerWidth / camera2zoom,
        window.innerHeight / camera2zoom,
        window.innerHeight / -camera2zoom,
        1,
        1000
    )
    cameras[2].position.set(0, 50, 0)
    cameras[2].lookAt(0, 0, 0)

    cameras[3] = new THREE.OrthographicCamera(
        window.innerWidth / -cameraScale,
        window.innerWidth / cameraScale,
        window.innerHeight / cameraScale,
        window.innerHeight / -cameraScale,
        1,
        1000
    )
    cameras[3].position.set(50, 55, 50)
    cameras[3].lookAt(0, 18, 0)

    cameras[4] = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        1000
    )
    cameras[4].position.set(50, 55, 50)
    cameras[4].lookAt(0, 18, 0)

    currentCamera = cameras[4]
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function createCrane() {
    'use strict'

    crane = new THREE.Object3D()

    crane.add(createTower())
    crane.add(createArm())
    crane.translateY(1.5) // Above floor level

    scene.add(crane)
}

function createTower() {
    'use strict'
    let tower = new THREE.Object3D()
    let towerMaterial = new THREE.MeshBasicMaterial({
        color: 0xeb8c34,
    })
    materials.push(towerMaterial)
    let towerBase = new THREE.Mesh(
        new THREE.BoxGeometry(6, 3, 6),
        towerMaterial
    )
    let towerPillar = new THREE.Mesh(
        new THREE.BoxGeometry(2, 30, 2),
        towerMaterial
    )
    towerPillar.translateY(16.5)
    tower.add(towerBase)
    tower.add(towerPillar)

    return tower
}

function createArm() {
    'use strict'
    arm = new THREE.Object3D()
    let armMaterial = new THREE.MeshBasicMaterial({
        color: 0xfaa555,
    })
    materials.push(armMaterial)

    let cabinMaterial = new THREE.MeshBasicMaterial({
        color: 0x25a8a7,
    })
    materials.push(cabinMaterial)

    let tirantMaterial = new THREE.MeshBasicMaterial({
        color: 0x4f4f4f,
    })
    materials.push(tirantMaterial)

    let cWeightMaterial = new THREE.MeshBasicMaterial({
        color: 0x303030,
    })
    materials.push(cWeightMaterial)

    armFront = new THREE.Mesh(new THREE.BoxGeometry(37, 2, 2), armMaterial)
    armFront.translateX(-17.5)
    arm.add(armFront)

    let armBack = new THREE.Mesh(new THREE.BoxGeometry(5, 1.5, 2), armMaterial)
    armBack.translateX(3.5)
    armBack.translateY(-0.25)
    arm.add(armBack)

    let armCabin = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), cabinMaterial)
    armCabin.translateX(-3.5)
    armCabin.translateY(-2)
    arm.add(armCabin)

    let armCounterWeight = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 3, 1.5),
        cWeightMaterial
    )
    armCounterWeight.translateX(4.5)
    armCounterWeight.translateY(-0.5)
    arm.add(armCounterWeight)

    let armApex = new THREE.Mesh(
        new THREE.ConeGeometry(1.2, 5, 3, 1),
        armMaterial
    )
    armApex.translateY(3.5)
    armApex.translateX(0.4)
    armApex.rotation.y += Math.PI / 6
    arm.add(armApex)

    let tirantFront = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 9.8),
        tirantMaterial
    )
    tirantFront.translateY(5.7)
    tirantFront.rotation.z += 5 * (Math.PI / 3) + Math.PI / 120
    tirantFront.translateY(-4.45)
    arm.add(tirantFront)

    let tirantBack1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 7.1),
        tirantMaterial
    )
    tirantBack1.translateY(6.5)
    tirantBack1.rotation.z -= 5 * (Math.PI / 3) + Math.PI / 6.5
    tirantBack1.rotation.y -= Math.PI / 13.8
    tirantBack1.translateY(-4.2)
    arm.add(tirantBack1)

    let tirantBack2 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 7.1),
        tirantMaterial
    )
    tirantBack2.translateY(6.5)
    tirantBack2.rotation.z -= 5 * (Math.PI / 3) + Math.PI / 6.5
    tirantBack2.rotation.y += Math.PI / 13.8
    tirantBack2.translateY(-4.2)
    arm.add(tirantBack2)

    arm.add(createCart())

    arm.translateY(32.5)
    return arm
}

function createCart() {
    'use strict'
    cart = new THREE.Object3D()
    let cartMaterial = new THREE.MeshBasicMaterial({
        color: 0x303030,
    })
    materials.push(cartMaterial)

    let cartCableMaterial = new THREE.MeshBasicMaterial({
        color: 0x4f4f4f,
    })
    materials.push(cartCableMaterial)

    let cartBody = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), cartMaterial)
    cart.add(cartBody)

    cartCable = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 1, 32),
        cartCableMaterial
    )
    cartCable.scale.y = 5
    cartCable.translateY(-3)
    cart.add(cartCable)

    cart.add(createClaw())

    cart.translateY(-1.5)
    cart.translateX(-33)
    return cart
}

function createClaw() {
    'use strict'

    claw = new THREE.Object3D()

    let clawBaseMaterial = new THREE.MeshBasicMaterial({
        color: 0xeb8c34,
    })
    materials.push(clawBaseMaterial)

    let clawArmMaterial = new THREE.MeshBasicMaterial({
        color: 0xfaa555,
    })
    materials.push(clawArmMaterial)

    let clawBase = new THREE.Mesh(
        new THREE.BoxGeometry(2, 1, 2),
        clawBaseMaterial
    )
    claw.add(clawBase)

    let clawCamera = new THREE.PerspectiveCamera(
        120,
        window.innerWidth / window.innerHeight,
        1,
        1000
    )
    cameras[5] = clawCamera
    clawCamera.position.set(0, 1, 0)
    clawCamera.lookAt(clawCamera.position.x, -100, clawCamera.position.z)
    clawCamera.rotateZ(Math.PI / 2)
    claw.add(clawCamera)

    let clawArm1Pivot = new THREE.Object3D()

    let clawArm1 = new THREE.Mesh(
        new THREE.ConeGeometry(0.3, 2, 3, 1),
        clawArmMaterial
    )
    clawArm1.translateY(-0.7)
    clawArm1.translateX(-1)
    clawArm1.rotation.z += Math.PI
    clawArm1.rotation.y += Math.PI / 2
    clawArm1.translateX(0.1)

    clawArmsPivot.push(clawArm1Pivot)
    clawArms.push(clawArm1)
    clawArm1Pivot.add(clawArm1)
    claw.add(clawArm1Pivot)

    let clawArm2Pivot = new THREE.Object3D()

    let clawArm2 = new THREE.Mesh(
        new THREE.ConeGeometry(0.3, 2, 3, 1),
        clawArmMaterial
    )

    clawArm2.translateY(-0.7)
    clawArm2.translateX(1)
    clawArm2.rotation.z += Math.PI
    clawArm2.rotation.y -= Math.PI / 2
    clawArm2.translateX(-0.1)

    clawArmsPivot.push(clawArm2Pivot)
    clawArms.push(clawArm2)
    clawArm2Pivot.add(clawArm2)
    claw.add(clawArm2Pivot)

    let clawArm3Pivot = new THREE.Object3D()

    let clawArm3 = new THREE.Mesh(
        new THREE.ConeGeometry(0.3, 2, 3, 1),
        clawArmMaterial
    )
    clawArm3.translateY(-0.7)
    clawArm3.translateZ(1)
    clawArm3.rotation.z += Math.PI
    clawArm3.rotation.y += Math.PI
    clawArm3.translateZ(-0.1)

    clawArmsPivot.push(clawArm3Pivot)
    clawArms.push(clawArm3)
    clawArm3Pivot.add(clawArm3)
    claw.add(clawArm3Pivot)

    let clawArm4Pivot = new THREE.Object3D()

    let clawArm4 = new THREE.Mesh(
        new THREE.ConeGeometry(0.3, 2, 3, 1),
        clawArmMaterial
    )

    clawArm4.translateY(-0.7)
    clawArm4.translateZ(-1)
    clawArm4.rotation.z += Math.PI
    clawArm4.translateZ(0.1)

    clawArmsPivot.push(clawArm4Pivot)
    clawArms.push(clawArm4)
    clawArm4Pivot.add(clawArm4)
    claw.add(clawArm4Pivot)

    claw.translateY(-6)

    return claw
}

function createContainer() {
    let containerMaterial = new THREE.MeshBasicMaterial({
        color: 0xd10202,
    })
    materials.push(containerMaterial)

    container = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        containerMaterial
    )
    container.scale.set(5, 5, 10)

    container.position.set(-30, 5 / 2, 0)
    objects.push(container)
    scene.add(container)
}

function createObjects() {
    let objectMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ab44,
    })
    materials.push(objectMaterial)

    createObject(objectMaterial)
    createObject(objectMaterial)
    createObject(objectMaterial)
    createObject(objectMaterial)
    createObject(objectMaterial)
}

function createObject(objectMaterial) {
    'use strict'

    let size = randomBetween(1, 2.5)

    let geometry
    let multiplier
    switch (Math.floor(randomBetween(0, 4))) {
        case 0:
            geometry = new THREE.BoxGeometry(1, 1, 1)
            multiplier = 0.5
            break
        case 1:
            geometry = new THREE.DodecahedronGeometry(1)
            multiplier = 0.94
            break
        case 2:
            geometry = new THREE.IcosahedronGeometry(1)
            multiplier = 0.865
            break
        case 3:
            geometry = new THREE.TorusGeometry(0.7, 0.15)
            multiplier = 0.85
            break
        default:
            geometry = new THREE.BoxGeometry(1, 1, 1)
    }

    let obj = new THREE.Mesh(geometry, objectMaterial)
    obj.userData = { size: size, multiplier: multiplier }
    obj.scale.set(size, size, size)
    obj.rotateY(randomBetween(0, 2 * Math.PI))

    while (true) {
        let position = getRandomPosition(size, multiplier)
        obj.position.set(position.x, position.y, position.z)
        scene.add(obj)
        if (
            !objects.reduce(
                (current, other) => current || checkCollisions(obj, other),
                false
            )
        ) {
            objects.push(obj)
            break
        }
        scene.remove(obj)
    }
}

function randomBetween(min, max) {
    return Math.random() * (max - min) + min
}

function getRandomPosition(size, multiplier) {
    let r = randomBetween(7.5, 30)
    let theta = randomBetween(0, 2 * Math.PI)

    return {
        x: r * Math.cos(theta),
        y: multiplier * size,
        z: r * Math.sin(theta),
    }
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisionsWithClaw(object) {
    'use strict'
    let x = (object.scale.x / 2) ** 2
    let y = (object.scale.y / 2) ** 2
    let z = (object.scale.z / 2) ** 2
    let objectRadius = Math.sqrt(x + y + z)

    let armRadius = 0.7
    clawArms.forEach((arm) => {
        if (state.animation.stage != 0) return
        let d = arm
            .getWorldPosition(new THREE.Vector3())
            .distanceTo(object.getWorldPosition(new THREE.Vector3()))
        if (d < armRadius + objectRadius) {
            handleCollisions(object)
        }
    })
}

function checkCollisions(object1, object2) {
    'use strict'
    let objectRadius1
    if (object1.geometry instanceof THREE.BoxGeometry) {
        objectRadius1 =
            Math.sqrt(
                object1.scale.x ** 2 +
                    object1.scale.y ** 2 +
                    object1.scale.z ** 2
            ) / 2
    } else {
        objectRadius1 =
            Math.max([object1.scale.x, object1.scale.y, object1.scale.z]) / 2
    }

    let objectRadius2
    if (object1.geometry instanceof THREE.BoxGeometry) {
        objectRadius2 =
            Math.sqrt(
                object2.scale.x ** 2 +
                    object2.scale.y ** 2 +
                    object2.scale.z ** 2
            ) / 2
    } else {
        objectRadius2 =
            Math.max([object2.scale.x, object2.scale.y, object2.scale.z]) / 2
    }

    let d = object1
        .getWorldPosition(new THREE.Vector3())
        .distanceTo(object2.getWorldPosition(new THREE.Vector3()))
    if (d < objectRadius1 + objectRadius2) {
        return true
    }
    return false
}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(object) {
    'use strict'
    state.animation.stage = 1
    scene.remove(object)

    claw.add(object)
    object.position.set(0, 0, 0)
    object.translateY(-(object.userData.multiplier + object.scale.y / 2))
    pickedObject = object
    objects.splice(objects.indexOf(object), 1)
}

////////////
/* UPDATE */
////////////
function update(delta) {
    'use strict'

    switch (state.animation.stage) {
        case 1:
            animationClawUp(delta)
            return
        case 2:
            animationArmMovement(delta)
            return
        case 3:
            animationClawDown(delta)
            return
        case 4:
            animationClawOpen(delta)
            return
    }

    if (state.animation.stage == 0) {
        arm.rotation.y += 1.5 * delta * state.moveArm

        if (state.moveCart === -1 && cart.position.x < -6) {
            cart.translateX(10 * delta)
        }

        if (state.moveCart === 1 && cart.position.x > -34.5) {
            cart.translateX(-10 * delta)
        }

        if (state.moveClaw === 1 && claw.position.y < -1.5) {
            translateClaw(10 * delta)
        }

        if (state.moveClaw === -1 && claw.position.y > -30.5) {
            translateClaw(-10 * delta)
        }

        if (
            state.moveClawArm === 1 &&
            clawArmsPivot[0].rotation.z < Math.PI / 6 &&
            clawArmsPivot[1].rotation.z > -Math.PI / 6
        ) {
            clawArmsPivot[0].rotation.z += 1.5 * delta
            clawArmsPivot[1].rotation.z -= 1.5 * delta
            clawArmsPivot[2].rotation.x += 1.5 * delta
            clawArmsPivot[3].rotation.x -= 1.5 * delta
        }

        if (
            state.moveClawArm === -1 &&
            clawArmsPivot[0].rotation.z > 0 &&
            clawArmsPivot[1].rotation.z < 0
        ) {
            clawArmsPivot[0].rotation.z -= 1.5 * delta
            clawArmsPivot[1].rotation.z += 1.5 * delta
            clawArmsPivot[2].rotation.x -= 1.5 * delta
            clawArmsPivot[3].rotation.x += 1.5 * delta
        }
    }
}

function animationClawUp(delta) {
    inAnimation(true)
    let clawPos = claw.position.y

    translateClaw(10 * delta)

    if (clawPos >= -20) {
        state.animation.stage = 2
        state.animation.moveArm = true
        state.animation.moveCart = true
    }
}

function animationArmMovement(delta) {
    if (state.animation.moveArm) {
        let armPos = armFront.getWorldPosition(new THREE.Vector3())
        let vTheta = armPos.z > 0 ? -1.5 : 1.5

        arm.rotation.y += vTheta * delta

        if (armPos.z < 1.5 && armPos.z > -1.5 && armPos.x < 0) {
            state.animation.moveArm = false
        }
    }

    if (state.animation.moveCart) {
        let cartPos = cart.position.x
        let v = cartPos > -30 ? -5 : 5

        cart.translateX(v * delta)

        if (cartPos > -31 && cartPos < -29) {
            state.animation.moveCart = false
        }
    }

    if (!state.animation.moveArm && !state.animation.moveCart) {
        state.animation.stage = 3
    }
}

function animationClawDown(delta) {
    let clawPos = claw.position.y

    translateClaw(-10 * delta)

    if (clawPos <= -25.5) {
        state.animation.stage = 4
    }
}

function animationClawOpen(delta) {
    if (clawArmsPivot[0].rotation.z > 0 && clawArmsPivot[1].rotation.z < 0) {
        clawArmsPivot[0].rotation.z -= 1.5 * delta
        clawArmsPivot[1].rotation.z += 1.5 * delta
        clawArmsPivot[2].rotation.x -= 1.5 * delta
        clawArmsPivot[3].rotation.x += 1.5 * delta
    } else {
        state.animation.stage = 0
        claw.remove(pickedObject)
    }

    inAnimation(false)
}

function translateClaw(d) {
    claw.translateY(d)
    cartCable.scale.y -= d
    cartCable.translateY(d / 2)
}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict'
    renderer.render(scene, currentCamera)
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict'
    renderer = new THREE.WebGLRenderer({
        antialias: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('resize', onResize)
    createScene()
    createCameras()

    createHUD()
    render()
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict'
    update(clock.getDelta())
    objects.forEach((object) => {
        if (state.animation.stage != 0) return
        checkCollisionsWithClaw(object)
    })
    render()
    clock.getDelta()
    requestAnimationFrame(animate)
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() {
    'use strict'

    renderer.setSize(window.innerWidth, window.innerHeight)

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        cameras[4].aspect = window.innerWidth / window.innerHeight
        cameras[4].updateProjectionMatrix()
    }
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict'
    switch (e.keyCode) {
        case 49: // 1
            normalControlCameras()
            highlightControl('camera1')
            switchCamera(1)
            break
        case 50: // 2
            normalControlCameras()
            highlightControl('camera2')
            switchCamera(2)
            break
        case 51: // 3
            normalControlCameras()
            highlightControl('camera3')
            switchCamera(3)
            break
        case 52: // 4
            normalControlCameras()
            highlightControl('camera4')
            switchCamera(4)
            break
        case 53: // 5
            normalControlCameras()
            highlightControl('camera5')
            switchCamera(5)
            break
        case 54: // 6
            normalControlCameras()
            highlightControl('camera6')
            switchCamera(6)
            break
        case 82: // R
            switchWireframe()
            break
        case 65: // A
            highlightControl('keyA')
            state.moveArm = 1
            break
        case 68: // D
            highlightControl('keyD')
            state.moveArm = -1
            break
        case 87: // W
            highlightControl('keyW')
            state.moveCart = 1
            break
        case 83: // S
            highlightControl('keyS')
            state.moveCart = -1
            break
        case 38: // UP
            highlightControl('keyArrowUp')
            state.moveClaw = 1
            break
        case 40: // DOWN
            highlightControl('keyArrowDown')
            state.moveClaw = -1
            break
        case 81: // Q
            highlightControl('keyQ')
            state.moveClawArm = 1
            break
        case 69: // E
            highlightControl('keyE')
            state.moveClawArm = -1
            break
    }
}

function switchCamera(n) {
    'use strict'
    currentCamera = cameras[n - 1]
}

function switchWireframe() {
    'use strict'
    if (materials[0].wireframe) {
        normalControl('keyR')
    } else {
        highlightControl('keyR')
    }
    materials.forEach((material) => {
        material.wireframe = !material.wireframe
    })
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e) {
    'use strict'
    switch (e.keyCode) {
        case 65: // A
        case 68: // D
            normalControl('keyA')
            normalControl('keyD')
            state.moveArm = 0
            break
        case 87: // W
        case 83: // S
            normalControl('keyW')
            normalControl('keyS')
            state.moveCart = 0
            break
        case 38: // UP
        case 40: // DOWN
            normalControl('keyArrowUp')
            normalControl('keyArrowDown')
            state.moveClaw = 0
            break
        case 81: // Q
        case 69: // E
            normalControl('keyQ')
            normalControl('keyE')
            state.moveClawArm = 0
            break
    }
}

function createHUD() {
    'use strict'
    let div = document.createElement('div')
    div.innerHTML = `
    <div class="container">
        <div class="sub-container">
            <h3 id="in-animation" class="sub-container-background"></h4>
        </div>
        <div class="sub-container">
            <h4>Braço</h4>
            <div id="keyA">[A]</div>
            <div id="keyD">[D]</div>
        </div>
        <div class="sub-container">
            <h4>Carrinho</h4>
            <div id="keyW">[W]</div>
            <div id="keyS">[S]</div>
        </div>
        <div class="sub-container">
            <h4>Garra</h4>
            <div id="keyArrowUp">[↑]</div>
            <div id="keyArrowDown">[↓]</div>
        </div>
        <div class="sub-container">
            <h4>Pinças</h4>
            <div id="keyQ">[Q]</div>
            <div id="keyE">[E]</div>
        </div>
        <div class="sub-container">
            <h4>Wireframe</h4>
            <div id="keyR" >[R]</div>
        </div>
        <div class="sub-container">
            <h4>Câmaras</h4>
            <div id="camera1">[1]</div>
            <div id="camera2">[2]</div>
            <div id="camera3">[3]</div>
            <div id="camera4">[4]</div>
            <div id="camera5">[5]</div>
            <div id="camera6">[6]</div>
        </div>
    </div>
    `
    div.setAttribute('class', 'container')
    document.body.appendChild(div)
    highlightControl('camera5')
}

function highlightControl(id) {
    document.getElementById(id).classList.add('sub-container-background')
}

function normalControl(id) {
    document.getElementById(id).classList.remove('sub-container-background')
}

function normalControlCameras() {
    for (let i = 1; i <= 6; i++) {
        document
            .getElementById('camera' + i)
            .classList.remove('sub-container-background')
    }
}

function inAnimation(animated) {
    if (animated) {
        document.getElementById('in-animation').innerHTML = 'Em animação'
    } else {
        document.getElementById('in-animation').innerHTML = ''
    }
}

init()
animate()
