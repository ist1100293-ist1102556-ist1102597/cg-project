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
let clawArms = []

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

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict'
    scene = new THREE.Scene()

    scene.add(new THREE.AxesHelper(10))

    scene.background = new THREE.Color(0xaaaaaa)
    createCrane()
    createObjects()
    createContainer()
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras() {
    'use strict'

    cameras[0] = new THREE.OrthographicCamera(
        100 / -2,
        100 / 2,
        100 / 2,
        100 / -2,
        1,
        1000
    )
    cameras[0].position.set(-50, 30, 0)
    cameras[0].lookAt(0, 30, 0)

    cameras[1] = new THREE.OrthographicCamera(
        100 / -2,
        100 / 2,
        100 / 2,
        100 / -2,
        1,
        1000
    )
    cameras[1].position.set(-10, 10, 100)
    cameras[1].lookAt(-10, 10, 0)

    cameras[2] = new THREE.OrthographicCamera(
        150 / -2,
        150 / 2,
        150 / 2,
        150 / -2,
        1,
        1000
    )
    cameras[2].position.set(0, 40, 0)
    cameras[2].lookAt(0, 0, 0)

    cameras[3] = new THREE.OrthographicCamera(
        100 / 2,
        100 / -2,
        100 / 2,
        100 / -2,
        1,
        1000
    )
    cameras[3].position.set(40, 40, 40)
    cameras[3].lookAt(-30, 0, -30)

    cameras[4] = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        1000
    )
    cameras[4].position.set(40, 40, 40)
    cameras[4].lookAt(-30, 0, -30)

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
        color: 0x00ff00,
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
        color: 0xff0000,
    })
    materials.push(armMaterial)

    let armFront = new THREE.Mesh(new THREE.BoxGeometry(37, 2, 2), armMaterial)
    armFront.translateX(-17.5)
    arm.add(armFront)

    let armCabin = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), armMaterial)
    armCabin.translateX(-3.5)
    armCabin.translateY(-2)
    arm.add(armCabin)

    let armBack = new THREE.Mesh(new THREE.BoxGeometry(5, 1.5, 2), armMaterial)
    armBack.translateX(3.5)
    armBack.translateY(-0.25)
    arm.add(armBack)

    let armCounterWeight = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 3, 1.5),
        armMaterial
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
        armMaterial
    )
    tirantFront.translateY(5.7)
    tirantFront.rotation.z += 5 * (Math.PI / 3) + Math.PI / 120
    tirantFront.translateY(-4.45)
    arm.add(tirantFront)

    let tirantBack1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 7.1),
        armMaterial
    )
    tirantBack1.translateY(6.5)
    tirantBack1.rotation.z -= 5 * (Math.PI / 3) + Math.PI / 6.5
    tirantBack1.rotation.y -= Math.PI / 13.8
    tirantBack1.translateY(-4.2)
    arm.add(tirantBack1)

    let tirantBack2 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 7.1),
        armMaterial
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
        color: 0x0000ff,
    })
    materials.push(cartMaterial)

    let cartBody = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), cartMaterial)
    cart.add(cartBody)

    cartCable = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 1, 32),
        cartMaterial
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

    let clawMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
    })
    materials.push(clawMaterial)

    let clawBase = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 2), clawMaterial)
    clawBase.translateY(-6)
    claw.add(clawBase)

    let clawCamera = new THREE.PerspectiveCamera(
        90,
        window.innerWidth / window.innerHeight,
        1,
        1000
    )
    cameras[5] = clawCamera
    clawCamera.position.set(0, -5, 0)
    clawCamera.lookAt(clawCamera.position.x, -100, clawCamera.position.z)
    clawCamera.rotateZ(Math.PI / 2)
    claw.add(clawCamera)

    let clawArm1 = new THREE.Mesh(
        new THREE.ConeGeometry(0.25 * Math.sin(Math.PI / 3), 1.5, 3, 1),
        clawMaterial
    )
    clawArm1.rotation.z += Math.PI

    clawArm1.rotation.y += Math.PI / 2
    clawArm1.translateX(0.1)

    let clawArm1Pivot = new THREE.Object3D()
    clawArm1Pivot.translateY(-6.8)
    clawArm1Pivot.translateX(-0.75)

    clawArms.push(clawArm1Pivot)
    clawArm1Pivot.add(clawArm1)
    claw.add(clawArm1Pivot)

    let clawArm2 = new THREE.Mesh(
        new THREE.ConeGeometry(0.25 * Math.sin(Math.PI / 3), 1.5, 3, 1),
        clawMaterial
    )
    clawArm2.rotation.z += Math.PI

    clawArm2.rotation.y -= Math.PI / 2
    clawArm2.translateX(-0.1)

    let clawArm2Pivot = new THREE.Object3D()
    clawArm2Pivot.translateY(-6.8)
    clawArm2Pivot.translateX(0.75)

    clawArms.push(clawArm2Pivot)
    clawArm2Pivot.add(clawArm2)
    claw.add(clawArm2Pivot)

    let clawArm3 = new THREE.Mesh(
        new THREE.ConeGeometry(0.25 * Math.sin(Math.PI / 3), 1.5, 3, 1),
        clawMaterial
    )
    clawArm3.rotation.z += Math.PI
    clawArm3.rotation.y += Math.PI
    clawArm3.translateZ(-0.1)

    let clawArm3Pivot = new THREE.Object3D()
    clawArm3Pivot.translateY(-6.8)
    clawArm3Pivot.translateZ(0.75)

    clawArms.push(clawArm3Pivot)
    clawArm3Pivot.add(clawArm3)
    claw.add(clawArm3Pivot)

    let clawArm4 = new THREE.Mesh(
        new THREE.ConeGeometry(0.25 * Math.sin(Math.PI / 3), 1.5, 3, 1),
        clawMaterial
    )
    clawArm4.rotation.z += Math.PI
    clawArm4.translateZ(0.1)

    let clawArm4Pivot = new THREE.Object3D()
    clawArm4Pivot.translateY(-6.8)
    clawArm4Pivot.translateZ(-0.75)

    clawArms.push(clawArm4Pivot)
    clawArm4Pivot.add(clawArm4)
    claw.add(clawArm4Pivot)

    return claw
}

function createContainer() {
    let containerMaterial = new THREE.MeshBasicMaterial({
        color: 0xfa0000,
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
        color: 0xff0000,
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
function checkCollisions() {
    'use strict'
}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions() {
    'use strict'
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
        clawArms[0].rotation.z < Math.PI / 4 &&
        clawArms[1].rotation.z > -Math.PI / 4
    ) {
        clawArms[0].rotation.z += 1.5 * delta
        clawArms[1].rotation.z -= 1.5 * delta
        clawArms[2].rotation.x += 1.5 * delta
        clawArms[3].rotation.x -= 1.5 * delta
    }

    if (
        moveClawArm === -1 &&
        clawArms[0].rotation.z > 0 &&
        clawArms[1].rotation.z < 0
    ) {
        clawArms[0].rotation.z -= 1.5 * delta
        clawArms[1].rotation.z += 1.5 * delta
        clawArms[2].rotation.x -= 1.5 * delta
        clawArms[3].rotation.x += 1.5 * delta
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
        case 80: // P
            switchWireframe()
            break
        case 81: // Q
            moveArm = 1
            break
        case 65: // A
            moveArm = -1
            break
        case 87: // W
            moveCart = 1
            break
        case 83: // S
            moveCart = -1
            break
        case 69: // E
            moveClaw = 1
            break
        case 68: // D
            moveClaw = -1
            break
        case 82: // R
            moveClawArm = 1
            break
        case 70: // F
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
        case 81: // Q
        case 65: // A
            moveArm = 0
            break
        case 87: // W
        case 83: // S
            moveCart = 0
            break
        case 69: // E
        case 68: // D
            moveClaw = 0
            break

        case 82: // R
        case 70: // F
            moveClawArm = 0
            break
    }
}

init()
animate()
