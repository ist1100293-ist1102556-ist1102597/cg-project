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

let crane
let arm
let cart
let claw

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict'
    scene = new THREE.Scene()

    scene.add(new THREE.AxesHelper(10))

    scene.background = new THREE.Color(0xaaaaaa)
    createCrane()
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras() {
    'use strict'
    cameras[0] = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        1000
    )
    cameras[0].position.set(30, 20, 30)
    cameras.forEach((element) => {
        element.lookAt(0, 40, 0)
    })
    currentCamera = cameras[0]
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
        wireframe: true,
    })
    let towerBase = new THREE.Mesh(
        new THREE.BoxGeometry(6, 3, 6),
        towerMaterial
    )
    let towerPillar = new THREE.Mesh(
        new THREE.BoxGeometry(2, 30, 2),
        towerMaterial
    )
    towerPillar.translateY(18)
    tower.add(towerBase)
    tower.add(towerPillar)

    return tower
}

function createArm() {
    'use strict'
    arm = new THREE.Object3D()
    let armMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
    })

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
    armApex.translateY(4)
    armApex.translateX(0.4)
    armApex.rotation.y += Math.PI / 6
    arm.add(armApex)

    arm.add(createCart())

    arm.translateY(34)
    return arm
}

function createCart() {
    'use strict'
    cart = new THREE.Object3D()
    let cartMaterial = new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        wireframe: true,
    })
    let cartBody = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), cartMaterial)
    cart.add(cartBody)

    let cartCable = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 5, 32),
        cartMaterial
    )
    cartCable.translateY(-3)
    cart.add(cartCable)

    cart.translateY(-1.5)
    cart.translateX(-33)
    return cart
}

function createContainer() {}

function createObject() {}

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
function update() {
    'use strict'
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
    createScene()
    createCameras()

    render()
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict'

    requestAnimationFrame(animate)
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() {
    'use strict'
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict'
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e) {
    'use strict'
}

init()
animate()
