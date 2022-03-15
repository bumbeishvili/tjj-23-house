import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { createBoxWithRoundedEdges, createPlaneWithRoundedEdges } from './utils.js'
import { PointLight } from 'three'

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
const wallsColorTexture = textureLoader.load('textures/bricks/color.jpg')
const wallsAmbientOcclusionTexture = textureLoader.load('textures/bricks/ambientOcclusion.jpg')
const wallsNormalTexture = textureLoader.load('textures/bricks/normal.jpg')
const wallsRoughnessTexture = textureLoader.load('textures/bricks/roughness.jpg')

const obj = {
    wallsAmbientOcclusionTexture,
    wallsColorTexture,
    wallsNormalTexture,
    wallsRoughnessTexture
};

Object.values(obj).forEach(texture => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(0.25, 0.25);
})




const walls = new THREE.Mesh(createBoxWithRoundedEdges(houseWidth, houseHeight, houseWidth, 1 / 8, 16), new THREE.MeshStandardMaterial({
    color: '#ac8382',
    aoMap: wallsAmbientOcclusionTexture,
    normalMap: wallsNormalTexture,
    roughnessMap: wallsRoughnessTexture,
    map: wallsColorTexture,
}));

console.log(walls)
walls.geometry.setAttribute('uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);


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
const doorColorTexture = textureLoader.load('textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('textures/door/roughness.jpg')



const doorWidth = 2;
const doorHeight = 2;

let panelGeometry = new THREE.PlaneBufferGeometry(2, 2, 100, 100)
panelGeometry.translate(1, 1, 0)
console.log(panelGeometry)

// panelGeometry =  createPlaneWithRoundedEdges({
//     width: doorWidth,
//     height: doorHeight,
//     radius: 0.1
// });

let door = new THREE.Mesh(panelGeometry, new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
    color: '#b35f45'
}))

door.geometry.setAttribute('uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)

door.position.z = houseWidth / 2 + 0.001
door.position.y = + 0.05
door.position.x = -doorWidth / 2
house.add(door)
// this.mesh.rotation.x = -Math.PI / 2
// this.container.add(this.mesh)

// Floor

const grassColorTexture = textureLoader.load('textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('textures/grass/roughness.jpg')

const grasT = {
    grassAmbientOcclusionTexture,
    grassColorTexture,
    grassNormalTexture,
    grassRoughnessTexture
}

Object.values(grasT).forEach(texture => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(0.25, 0.25);
})

console.log(walls);
walls.position.y = houseHeight / 2;

const floor = new THREE.Mesh(createBoxWithRoundedEdges(20, 0.4, 20, 1 / 16, 16), new THREE.MeshStandardMaterial({
    color: '#a9c388',
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
    map: grassColorTexture,
}));

floor.geometry.setAttribute('uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
// floor.rotation.x = - Math.PI * 0.5
floor.position.y = -0.2
scene.add(floor)



// Bushes
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })


const bushPositions = [
    { x: 0.8, y: 0.2, z: 2.2, scaleX: 0.5, scaleY: 0.5, scaleZ: 0.5 },
    { x: 1.4, y: 0.1, z: 2.1, scaleX: 0.25, scaleY: 0.25, scaleZ: 0.25 },
    { x: -0.8, y: 0.1, z: 2.2, scaleX: 0.4, scaleY: 0.4, scaleZ: 0.4 },
    { x: -1, y: 0.05, z: 2.6, scaleX: 0.15, scaleY: 0.15, scaleZ: 0.15 },
]

const bushes = bushPositions.map(bushPos => {
    const bush = new THREE.Mesh(bushGeometry, bushMaterial)
    bush.scale.set(bushPos.scaleX, bushPos.scaleY, bushPos.scaleZ)
    bush.position.set(bushPos.x, bushPos.y, bushPos.z)
    scene.add(bush)
    return bush;
})


// Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = createBoxWithRoundedEdges(0.6, 0.9, 0.2, 1 / 16, 4)  // new THREE.BoxBufferGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })

const gravesObjs = []
for (let i = 0; i < 50; i++) {
    const randomAngle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 6
    const z = Math.sin(randomAngle) * radius
    const x = Math.cos(randomAngle) * radius
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.set(x, 0.3, z);
    grave.rotation.z = Math.PI / (10 + Math.random() * 50);
    gravesObjs.push(grave)
    graves.add(grave)
}





/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)


// Door Light
const doorLight = new THREE.PointLight('#ff7d46', 1, 5);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight)



/**
 * 
 * GHOSTS
 */

const ghostProps = [
    { color: '#ff00ff', random: 2 + Math.random(), intensity: 2, distance: 3, radius: 4.5, speedScale: 1 },
    { color: '#00ffff', random: 2 + Math.random(), intensity: 2, distance: 3, radius: 5, speedScale: 1.4 },
    { color: '#ffff00', random: 2 + Math.random(), intensity: 2, distance: 3, radius: 6, speedScale: 1.8 },
]

const ghosts = ghostProps.map(props => {
    return new THREE.PointLight(props.color, props.intensity, props.distance);
})

scene.add(...ghosts);



/**
 * 
 * SHADOWS
 */

const lights = [moonLight, doorLight, ...ghosts];
const shadowObjs = ([...lights, walls, ...bushes, ...gravesObjs]);



shadowObjs.forEach(light => {
    light.castShadow = true;
});

([floor]).forEach(obj => {
    obj.receiveShadow = true;
});


moonLight.shadow.camera.near = 0.1;
moonLight.shadow.camera.far = 13;
doorLight.shadow.camera.far = 1;
lights.forEach(light => {
    light.shadow.mapSize.width = 256;
    light.shadow.mapSize.height = 256;
})

// Fog
const fog = new THREE.Fog('#262837', 1, 17)
scene.fog = fog;

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
renderer.setClearColor('#262837')
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update Ghosts


    ghosts.forEach((ghost, i) => {
        const speed = ghostProps[i].speedScale * elapsedTime;
        const rand = ghostProps[i].random;;
        const radius = ghostProps[i].radius;
        const angle = speed * 0.5 * (i % 2 ? 1 : -1);

        ghost.position.x = Math.cos(angle) * (radius + Math.sin(elapsedTime) * 0.32);
        ghost.position.z = Math.sin(angle) * radius;
        ghost.position.y = Math.abs(Math.sin(angle * 2) * radius / 2) + Math.sin(elapsedTime * rand)
    })



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()





// scene.traverse(child => {
//     if (child.material) {
//         child.material.wireframe = true;
//     }
// })

// const pointLightHelper = new THREE.PointLightHelper(doorLight, 0.2)
// scene.add(pointLightHelper)

// const directionalLightHelper = new THREE.DirectionalLightHelper(moonLight, 0.2)
// scene.add(directionalLightHelper)

// ghosts.forEach(ghost => {
//     const pointLightHelper = new THREE.PointLightHelper(ghost, 0.2)
//     scene.add(pointLightHelper)
// })


// lights.forEach(obj => {
//     scene.add(obj.shadow.camera)
//     const cameraHelper = new THREE.CameraHelper(obj.shadow.camera)
//     scene.add(cameraHelper);
// })