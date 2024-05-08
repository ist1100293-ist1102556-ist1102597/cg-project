import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { VRButton } from 'three/addons/webxr/VRButton.js'
import * as Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

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
let cart
let cartCable
let claw
let clock = new THREE.Clock()
let moveArm = 0
let moveCart = 0
let moveClaw = 0
let moveClawArm = 0
let animationMode = 0

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict'
    scene = new THREE.Scene()

    scene.add(new THREE.AxesHelper(10))

    scene.background = new THREE.Color(0xe0ffff)
    createCrane()
    createObjects()
    createContainer()
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

    let armFront = new THREE.Mesh(new THREE.BoxGeometry(37, 2, 2), armMaterial)
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
    clawBase.translateY(-6)
    claw.add(clawBase)

    let clawCamera = new THREE.PerspectiveCamera(
        120,
        window.innerWidth / window.innerHeight,
        1,
        1000
    )
    cameras[5] = clawCamera
    clawCamera.position.set(0, -5, 0)
    clawCamera.lookAt(clawCamera.position.x, -100, clawCamera.position.z)
    clawCamera.rotateZ(Math.PI / 2)
    claw.add(clawCamera)

    let clawArm1Pivot = new THREE.Object3D()
    clawArm1Pivot.translateY(-6.8)
    clawArm1Pivot.translateX(-0.75)

    let clawArm1 = new THREE.Mesh(
        new THREE.ConeGeometry(0.25 * Math.sin(Math.PI / 3), 1.5, 3, 1),
        clawArmMaterial
    )
    clawArm1.rotation.z += Math.PI
    clawArm1.rotation.y += Math.PI / 2
    clawArm1.translateX(0.1)

    clawArmsPivot.push(clawArm1Pivot)
    clawArms.push(clawArm1)
    clawArm1Pivot.add(clawArm1)
    claw.add(clawArm1Pivot)

    let clawArm2Pivot = new THREE.Object3D()
    clawArm2Pivot.translateY(-6.8)
    clawArm2Pivot.translateX(0.75)

    let clawArm2 = new THREE.Mesh(
        new THREE.ConeGeometry(0.25 * Math.sin(Math.PI / 3), 1.5, 3, 1),
        clawArmMaterial
    )
    clawArm2.rotation.z += Math.PI

    clawArm2.rotation.y -= Math.PI / 2
    clawArm2.translateX(-0.1)

    clawArmsPivot.push(clawArm2Pivot)
    clawArms.push(clawArm2)
    clawArm2Pivot.add(clawArm2)
    claw.add(clawArm2Pivot)

    let clawArm3Pivot = new THREE.Object3D()
    clawArm3Pivot.translateY(-6.8)
    clawArm3Pivot.translateZ(0.75)

    let clawArm3 = new THREE.Mesh(
        new THREE.ConeGeometry(0.25 * Math.sin(Math.PI / 3), 1.5, 3, 1),
        clawArmMaterial
    )
    clawArm3.rotation.z += Math.PI
    clawArm3.rotation.y += Math.PI
    clawArm3.translateZ(-0.1)

    clawArmsPivot.push(clawArm3Pivot)
    clawArms.push(clawArm3)
    clawArm3Pivot.add(clawArm3)
    claw.add(clawArm3Pivot)

    let clawArm4Pivot = new THREE.Object3D()
    clawArm4Pivot.translateY(-6.8)
    clawArm4Pivot.translateZ(-0.75)

    let clawArm4 = new THREE.Mesh(
        new THREE.ConeGeometry(0.25 * Math.sin(Math.PI / 3), 1.5, 3, 1),
        clawArmMaterial
    )
    clawArm4.rotation.z += Math.PI
    clawArm4.translateZ(0.1)

    clawArmsPivot.push(clawArm4Pivot)
    clawArms.push(clawArm4)
    clawArm4Pivot.add(clawArm4)
    claw.add(clawArm4Pivot)

    return claw
}

function createContainer() {
    let containerMaterial = new THREE.MeshBasicMaterial({
        color: 0xd10202,
    })
    materials.push(containerMaterial)

    let properties = {
        x: -30,
        y: 0,
        z: 0,
        width: 10,
        length: 5,
    }

    let sceneobject = new THREE.Object3D()
    let cube = new THREE.Mesh(
        new THREE.BoxGeometry(
            properties.width,
            properties.width,
            properties.length
        ),
        containerMaterial
    )

    cube.position.set(
        properties.x,
        properties.y + properties.width / 2 - 1.5,
        properties.z
    )
    cube.rotation.y += Math.PI / 2
    sceneobject.add(cube)

    scene.add(sceneobject)
}

function createObjects() {
    createObject(1, 30, 0, -17)
    createObject(2, 0, 0, 31)
    createObject(1, 0, 0, -30)
    createObject(2, 19, 0, 17)
    createObject(1, -25, 0, 15)
}

function createObject(size, x, y, z) {
    'use strict'

    let objectMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ab44,
    })
    materials.push(objectMaterial)

    let sceneobject = new THREE.Object3D()
    let cube = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        objectMaterial
    )
    cube.position.set(x, y + size / 2 - 1.5, z)
    sceneobject.add(cube)

    scene.add(sceneobject)
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
        if (animationMode === 1) return
        let d = arm.getWorldPosition().distanceTo(object.getWorldPosition())
        if (d < armRadius + objectRadius) {
            handleCollisions(object)
        }
    })
}

function checkCollisions(object1, object2) {
    'use strict'
    let x1 = (object1.scale.x / 2) ** 2
    let y1 = (object1.scale.y / 2) ** 2
    let z1 = (object1.scale.z / 2) ** 2
    let objectRadius1 = Math.sqrt(x1 + y1 + z1)

    let x2 = (object2.scale.x / 2) ** 2
    let y2 = (object2.scale.y / 2) ** 2
    let z2 = (object2.scale.z / 2) ** 2
    let objectRadius2 = Math.sqrt(x2 + y2 + z2)

    let d = object1.getWorldPosition().distanceTo(object2.getWorldPosition())
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
    animationMode = 1
    scene.remove(object)

    claw.add(object)
    object.position.set(0, 0, 0)
    object.translateY(1 + 0.5 + object.scale.y / 2)

    objects.remove(object)
}

////////////
/* UPDATE */
////////////
function update(delta) {
    'use strict'
    arm.rotation.y += 1.5 * delta * moveArm

    if (moveCart === -1 && cart.position.x < -6) {
        cart.translateX(10 * delta)
    }

    if (moveCart === 1 && cart.position.x > -35) {
        cart.translateX(-10 * delta)
    }

    if (moveClaw === 1 && claw.position.y < 4.75) {
        claw.translateY(10 * delta)
        cartCable.scale.y -= 10 * delta
        cartCable.translateY(5 * delta)
    }

    if (moveClaw === -1 && claw.position.y > -25) {
        claw.translateY(-10 * delta)
        cartCable.scale.y += 10 * delta
        cartCable.translateY(-5 * delta)
    }

    if (
        moveClawArm === 1 &&
        clawArmsPivot[0].rotation.z < Math.PI / 4 &&
        clawArmsPivot[1].rotation.z > -Math.PI / 4
    ) {
        clawArmsPivot[0].rotation.z += 1.5 * delta
        clawArmsPivot[1].rotation.z -= 1.5 * delta
        clawArmsPivot[2].rotation.x += 1.5 * delta
        clawArmsPivot[3].rotation.x -= 1.5 * delta
    }

    if (
        moveClawArm === -1 &&
        clawArmsPivot[0].rotation.z > 0 &&
        clawArmsPivot[1].rotation.z < 0
    ) {
        clawArmsPivot[0].rotation.z -= 1.5 * delta
        clawArmsPivot[1].rotation.z += 1.5 * delta
        clawArmsPivot[2].rotation.x -= 1.5 * delta
        clawArmsPivot[3].rotation.x += 1.5 * delta
    }
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

    render()
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict'
    update(clock.getDelta())
    objects.forEach((object) => {
        if (animationMode === 1) return
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
            switchCamera(1)
            break
        case 50: // 2
            switchCamera(2)
            break
        case 51: // 3
            switchCamera(3)
            break
        case 52: // 4
            switchCamera(4)
            break
        case 53: // 5
            switchCamera(5)
            break
        case 54: // 6
            switchCamera(6)
            break
        case 82: // R
            switchWireframe()
            break
        case 65: // D
            moveArm = 1
            break
        case 68: // A
            moveArm = -1
            break
        case 87: // W
            moveCart = 1
            break
        case 83: // S
            moveCart = -1
            break
        case 38: // UP
            moveClaw = 1
            break
        case 40: // DOWN
            moveClaw = -1
            break
        case 81: // Q
            moveClawArm = 1
            break
        case 69: // E
            moveClawArm = -1
            break
    }
}

function switchCamera(n) {
    'use strict'
    currentCamera = cameras[n - 1]
}

function switchWireframe() {
    'use strict'
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
            moveArm = 0
            break
        case 87: // W
        case 83: // S
            moveCart = 0
            break
        case 38: // UP
        case 40: // DOWN
            moveClaw = 0
            break
        case 81: // Q
        case 69: // E
            moveClawArm = 0
            break
    }
}

init()
animate()
