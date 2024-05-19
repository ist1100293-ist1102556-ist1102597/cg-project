import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { VRButton } from 'three/addons/webxr/VRButton.js'
import * as Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

let renderer
let clock = new THREE.Clock()
let scene
let cameras = []
let currentCamera
let tube
let mobiusStrip
let rings = []
let objects = [[], [], []]
let objectsLights = []
let directionalLight
let directionlLightOn = true
let spotLightsOn = true
let state = {
    moveOuterRing: true,
    tOuter: 0,
    moveMiddleRing: true,
    tMiddle: 0.064,
    moveInnerRing: true,
    tInner: 0.128,
    moveMobiusStrip: true,
}

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict'
    scene = new THREE.Scene()
    scene.add(new THREE.AxesHelper(10))
    createTube()
    createRings()
    createObjects()
    createSkydome()
    translateRings()
    createMobiusStrip()
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
    cameras[0].position.set(20, 25, 20)
    cameras[0].lookAt(0, 0, 0)

    currentCamera = cameras[0]
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createLights() {
    'use strict'
    let ambientLight = new THREE.AmbientLight(0xffd580, 0.3)
    scene.add(ambientLight)
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.7)
    directionalLight.position.set(100, 200, 100)
    directionalLight.target.position.set(0, 0, 0)
    scene.add(directionalLight.target)
    scene.add(directionalLight)

    let distances = [4, 8, 12]
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 8; j++) {
            let r = distances[i]
            let spotLight = new THREE.SpotLight(0xffffff)
            let x = r * Math.sin((j * Math.PI) / 4)
            let z = r * Math.cos((j * Math.PI) / 4)
            spotLight.position.set(x, 2, z)
            spotLight.target.position.set(x, 100, z)
            spotLight.angle = Math.PI / 3
            scene.add(spotLight.target)
            spotLight.intensity = 1
            rings[i].add(spotLight)
            objectsLights.push(spotLight)
        }
    }
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createTube() {
    'use strict'
    let radius = 2
    let geometry = new THREE.CylinderGeometry(radius, radius, 24, 32, 1)
    let material = new THREE.MeshStandardMaterial({ color: 0xffff00 })
    tube = new THREE.Mesh(geometry, material)

    scene.add(tube)
}

function createRings() {
    'use strict'

    let ring1Shape = createRingShape(2, 6)
    let ring2Shape = createRingShape(6, 10)
    let ring3Shape = createRingShape(10, 14)

    let extrudeSettings = {
        depth: 4,
    }

    let geometry1 = new THREE.ExtrudeGeometry(ring1Shape, extrudeSettings)
    let material1 = new THREE.MeshStandardMaterial({ color: 0xff0000 })
    let ring1 = new THREE.Mesh(geometry1, material1)
    ring1.rotateX(-Math.PI / 2)
    rings[0] = new THREE.Object3D()
    rings[0].add(ring1)

    let geometry2 = new THREE.ExtrudeGeometry(ring2Shape, extrudeSettings)
    let material2 = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    let ring2 = new THREE.Mesh(geometry2, material2)
    ring2.rotateX(-Math.PI / 2)
    rings[1] = new THREE.Object3D()
    rings[1].add(ring2)

    let geometry3 = new THREE.ExtrudeGeometry(ring3Shape, extrudeSettings)
    let material3 = new THREE.MeshStandardMaterial({ color: 0x0000ff })
    let ring3 = new THREE.Mesh(geometry3, material3)
    ring3.rotateX(-Math.PI / 2)
    rings[2] = new THREE.Object3D()
    rings[2].add(ring3)

    rings.forEach((ring) => {
        scene.add(ring)
    })
}

function createRingShape(innerRadius, outerRadius) {
    'use strict'
    let shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false)

    let holePath = new THREE.Path()
    holePath.moveTo(0, 0)
    holePath.absarc(0, 0, innerRadius, 0, Math.PI * 2, false)

    shape.holes.push(holePath)
    return shape
}

function createObjects() {
    'use strict'
    let distances = [4, 8, 12]
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 8; j++) {
            let geometry = new THREE.BoxGeometry(2, 4, 2)
            let material = new THREE.MeshStandardMaterial({ color: 0xfffff0 })
            let object = new THREE.Mesh(geometry, material)
            let r = distances[i]
            object.position.set(
                r * Math.sin((j * Math.PI) / 4),
                6,
                r * Math.cos((j * Math.PI) / 4)
            )
            objects[i].push(object)
            rings[i].add(object)
        }
    }
}

function createSkydome() {
    let skyGeometry = new THREE.SphereGeometry(
        50,
        50,
        50,
        0,
        Math.PI * 2,
        0,
        Math.PI / 2
    )
    let loader = new THREE.TextureLoader()
    let texture = loader.load('textures/sky.jpg')
    let skyMaterial = new THREE.MeshStandardMaterial({
        map: texture,
    })
    let skydome = new THREE.Mesh(skyGeometry, skyMaterial)
    skydome.material.side = THREE.BackSide
    skydome.position.set(0, -12, 0)
    scene.add(skydome)
}

function translateRings() {
    'use strict'
    rings[0].position.y = 10 * Math.sin(2 * Math.PI * state.tInner) - 2
    rings[1].position.y = 10 * Math.sin(2 * Math.PI * state.tMiddle) - 2
    rings[2].position.y = 10 * Math.sin(2 * Math.PI * state.tOuter) - 2
}

function createMobiusStrip() {
    let material = new THREE.MeshStandardMaterial({
        color: 0xfffff0,
        side: THREE.DoubleSide,
    })
    let geometry = createMobiusStripGeometry()
    mobiusStrip = new THREE.Mesh(geometry, material)
    mobiusStrip.position.set(0, 13, 0)
    mobiusStrip.scale.multiplyScalar(1)
    scene.add(mobiusStrip)
}

function createMobiusStripGeometry() {
    // base of the mobius strip is a plane
    const geometry = new THREE.PlaneGeometry(1, 1, 60, 10)
    const positions = geometry.attributes.position.array

    for (let i = 0; i < positions.length; i += 3) {
        // z = 0
        const mobiusCoords = planeToMobiusStripPoint(
            positions[i],
            positions[i + 1]
        )

        // replace original point coords for its coords in the mobius strip
        positions[i] = mobiusCoords[0]
        positions[i + 1] = mobiusCoords[1]
        positions[i + 2] = mobiusCoords[2]
    }

    // rotate mobius strip to appear horizontally
    geometry.rotateX(0.5 * Math.PI)
    geometry.rotateZ(0.1 * Math.PI)
    geometry.computeVertexNormals()

    return geometry
}

function planeToMobiusStripPoint(x, y) {
    // Angle around mobius strip (x € [-0.5,0.5] so angle € [-pi,pi])
    const angle = 2 * Math.PI * x

    // Radius of points in mobius strip (y € [-0.5, 0.5])
    const r = 1 + y * Math.cos(angle)

    // x coordinate of point in mobius strip (polar to cartesian conversion)
    const x1 = Math.cos(angle) * r

    // y coordinate of point in mobius strip (polar to cartesian conversion)
    const y1 = Math.sin(angle) * r

    // z coordinate of point in mobius strip
    const z1 = y * Math.sin(angle)
    return [x1, y1, z1]
}

////////////
/* UPDATE */
////////////
function update(delta) {
    'use strict'
    objects.forEach((ring) => {
        ring.forEach((object) => {
            object.rotation.y += 1 * delta
        })
    })
    tube.rotation.y -= 0.5 * delta
    rings[0].rotation.y += 0.5 * delta
    rings[1].rotation.y -= 0.5 * delta
    rings[2].rotation.y += 0.5 * delta

    if (!directionlLightOn) {
        directionalLight.intensity = 0
    } else {
        directionalLight.intensity = 0.7
    }

    if (!spotLightsOn) {
        objectsLights.forEach((light) => {
            light.intensity = 0
        })
    } else {
        objectsLights.forEach((light) => {
            light.intensity = 50
        })
    }

    if (state.moveOuterRing) {
        state.tOuter += delta * 0.1
        rings[2].position.y = 10 * Math.sin(state.tOuter * 2 * Math.PI) - 2
    }

    if (state.moveMiddleRing) {
        state.tMiddle += delta * 0.1
        rings[1].position.y = 10 * Math.sin(state.tMiddle * 2 * Math.PI) - 2
    }

    if (state.moveInnerRing) {
        state.tInner += delta * 0.1
        rings[0].position.y = 10 * Math.sin(state.tInner * 2 * Math.PI) - 2
    }

    if (state.moveMobiusStrip) {
        mobiusStrip.rotation.y -= 2 * delta
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
    document.body.appendChild(VRButton.createButton(renderer))
    renderer.xr.enabled = true

    window.addEventListener('resize', onResize)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    createScene()
    createCameras()
    createLights()

    render()
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() {
    'use strict'

    renderer.setSize(window.innerWidth, window.innerHeight)
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict'
    switch (e.keyCode) {
        case 68: // D(d)
            directionlLightOn = !directionlLightOn
            break
        case 83: // S(s)
            spotLightsOn = !spotLightsOn
            break
        case 49: // 1
            if (state.moveInnerRing == 0) {
                state.moveInnerRing = 1
            } else {
                state.moveInnerRing = 0
            }
            break
        case 50: // 2
            if (state.moveMiddleRing == 0) {
                state.moveMiddleRing = 1
            } else {
                state.moveMiddleRing = 0
            }
            break
        case 51: // 3
            if (state.moveOuterRing == 0) {
                state.moveOuterRing = 1
            } else {
                state.moveOuterRing = 0
            }
            break
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e) {
    'use strict'
}

init()

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
renderer.setAnimationLoop(function () {
    'use strict'
    update(clock.getDelta())
    render()
    clock.getDelta()
})
