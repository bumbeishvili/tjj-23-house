import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { createBoxWithRoundedEdges, createPlaneWithRoundedEdges } from './utils.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * House
 */
const house = new THREE.Group();
scene.add(house);


const houseWidth = 4;
const houseHeight = 3;

// Walls
const walls = new THREE.Mesh(createBoxWithRoundedEdges(houseWidth, houseHeight, houseWidth, 1 / 8, 16), new THREE.MeshStandardMaterial({
    color: '#ac8382'
}));
console.log(walls);
walls.position.y = houseHeight / 2;

house.add(walls)




// Roof
const roofHeight = 2;
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(houseWidth, roofHeight, 4),
    new THREE.MeshStandardMaterial({ color: '#b35f45' })
)
roof.rotation.y = Math.PI / 4;
roof.position.y = houseHeight + roof.geometry.parameters.height / 2 - 0.2;

house.add(roof)


// Door
const doorWidth = 2;
const doorHeight = 2;

let panelGeometry = createPlaneWithRoundedEdges({
    width: doorWidth,
    height: doorHeight,
    radius: 0.1
});

let door = new THREE.Mesh(panelGeometry, new THREE.MeshStandardMaterial({ color: '#b35f45' }))

door.position.z = houseWidth / 2 + 0.001
door.position.y = + 0.05
door.position.x = -doorWidth / 2
house.add(door)
// this.mesh.rotation.x = -Math.PI / 2
// this.container.add(this.mesh)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: '#a9c388' })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)



/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.5)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 15
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()