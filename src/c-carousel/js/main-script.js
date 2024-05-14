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
let delta
let scene
let cameras = []
let currentCamera
let tube
let morbiusBand
let rings = []
let objects = [[],[],[]]
let objectsLights = []
let directionalLight
let directionlLightOn = true
let spotLightsOn = true

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
    cameras[0].position.set(40, 45, 40)
    cameras[0].lookAt(0, 15, 0)

    currentCamera = cameras[0]

}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createLights() {
    'use strict'
    let ambientLight = new THREE.AmbientLight(0xFFD580, 0.3)
    scene.add(ambientLight)
    directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.7)
    directionalLight.position.set(100, 200, 100)
    directionalLight.target.position.set(0, 0, 0)
    scene.add(directionalLight.target)
    scene.add(directionalLight)

    let heights = [12,8,4]
    let distances = [10,15.5,21.5]
    for(let i = 0; i < 3; i++) {
        for (let j = 0; j < 8; j++) {
            let r = distances[i]
            let spotLight = new THREE.SpotLight( 0xffffff );
            spotLight.position.set(r * Math.sin(j * Math.PI / 4), heights[i], r * Math.cos(j * Math.PI / 4))
            spotLight.target.position.set(0,100,0)
            spotLight.intensity = 50
            objects[i][j].add(spotLight.target)
            rings[i].add(spotLight)
            objectsLights.push(spotLight)
        }
    }
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
class verticalSegment extends THREE.Curve {

	constructor( scale = 1 ) {
		super();
		this.scale = scale;
	}

	getPoint( t, optionalTarget = new THREE.Vector3() ) {

		const tx = 0;
		const ty = 20 * t;
		const tz = 0;

		return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );
	}
}

function createTube() {
    'use strict'
    let radius = 7
    let path = new verticalSegment( 1 );
    let geometry = new THREE.TubeGeometry(path,64,radius,20,true)
    let material = new THREE.MeshStandardMaterial({ color: 0xffff00 })
    tube = new THREE.Mesh(geometry, material)

    let geometryCircle = new THREE.CircleGeometry( 7, 32 )
    let circleTop = new THREE.Mesh( geometryCircle, material )
    circleTop.rotateX(-Math.PI/2)
    circleTop.position.y = 20

    tube.add(circleTop)

    let circleBottom = new THREE.Mesh( geometryCircle, material )
    circleBottom.rotateX(-Math.PI/2)
    circleBottom.position.y = 0

    tube.add(circleBottom)

    scene.add(tube)
}

function createRings() {
    'use strict'

    let ring1Shape = createRingShape(7, 13)
    let ring2Shape = createRingShape(13, 19)
    let ring3Shape = createRingShape(19, 25)

    let extrudeSettings = {
        depth: 4,
    };

    let geometry1 = new THREE.ExtrudeGeometry(ring1Shape, extrudeSettings)
    let material1 = new THREE.MeshStandardMaterial({ color: 0xff0000 })
    let ring1 = new THREE.Mesh(geometry1, material1)
    ring1.rotateX(-Math.PI / 2)
    ring1.position.y = 8
    rings[0] = new THREE.Object3D()
    rings[0].add(ring1)

    let geometry2 = new THREE.ExtrudeGeometry(ring2Shape, extrudeSettings)
    let material2 = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    let ring2 = new THREE.Mesh(geometry2, material2)
    ring2.rotateX(-Math.PI / 2)
    ring2.position.y = 4
    rings[1] = new THREE.Object3D()
    rings[1].add(ring2)

    let geometry3 = new THREE.ExtrudeGeometry(ring3Shape, extrudeSettings)
    let material3 = new THREE.MeshStandardMaterial({ color: 0x0000ff })
    let ring3 = new THREE.Mesh(geometry3, material3)
    ring3.rotateX(-Math.PI / 2)
    ring3.position.y = 0
    rings[2] = new THREE.Object3D()
    rings[2].add(ring3)

    rings.forEach(ring => {
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
    let heights = [14,10,6]
    let distances = [10,15.5,21.5]
    for(let i = 0; i < 3; i++) {
        for (let j = 0; j < 8; j++) {
            let geometry = new THREE.BoxGeometry(3, 4, 3)
            let material = new THREE.MeshStandardMaterial({ color: 0xfffff0 })
            let object = new THREE.Mesh(geometry, material)
            let r = distances[i]
            object.position.set(r * Math.sin(j * Math.PI / 4), heights[i], r * Math.cos(j * Math.PI / 4))
            objects[i].push(object)
            rings[i].add(object)
        }
    }
}

////////////
/* UPDATE */
////////////
function update() {
    'use strict'
    objects.forEach((ring, i) => {
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
        objectsLights.forEach(light => {
            light.intensity = 0
        })
    } else {
        objectsLights.forEach(light => {
            light.intensity = 50
        })
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
    switch(e.keyCode) {
        case 68: // D(d)
            directionlLightOn = !directionlLightOn
            break
        case 83 : // S(s)
            spotLightsOn = !spotLightsOn
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
    delta = clock.getDelta()
    update()
    render()
    clock.getDelta()
})
