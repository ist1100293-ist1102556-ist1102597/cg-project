import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { VRButton } from 'three/addons/webxr/VRButton.js'
import * as Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

let renderer
let scene
let cameras = []
let currentCamera
let tube
let morbiusBand
let rings = []
let objects = []

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict'
    scene = new THREE.Scene()
    scene.add(new THREE.AxesHelper(10))
    createTube()
    createRings()
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
    cameras[0].position.set(50, 55, 50)
    cameras[0].lookAt(0, 30, 0)

    currentCamera = cameras[0]

}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createLights() {
    'use strict'
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
    let material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
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
    let material1 = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    let ring1 = new THREE.Mesh(geometry1, material1)
    ring1.rotateX(-Math.PI / 2)
    ring1.position.y = 8
    rings[0] = new THREE.Object3D()
    rings[0].add(ring1)

    let geometry2 = new THREE.ExtrudeGeometry(ring2Shape, extrudeSettings)
    let material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    let ring2 = new THREE.Mesh(geometry2, material2)
    ring2.rotateX(-Math.PI / 2)
    ring2.position.y = 4
    rings[1] = new THREE.Object3D()
    rings[1].add(ring2)

    let geometry3 = new THREE.ExtrudeGeometry(ring3Shape, extrudeSettings)
    let material3 = new THREE.MeshBasicMaterial({ color: 0x0000ff })
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
    document.body.appendChild(VRButton.createButton(renderer))
    renderer.xr.enabled = true

    window.addEventListener('resize', onResize)
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
    update()
    render()
})
