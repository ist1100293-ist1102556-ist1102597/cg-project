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
    let radius = 10
    let path = new verticalSegment( 1 );
    let geometry = new THREE.TubeGeometry(path,64,radius,20,true)
    let material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
    tube = new THREE.Mesh(geometry, material)

    let geometryCircle = new THREE.CircleGeometry( 10, 32 )
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
