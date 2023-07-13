import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
//PerspectiveCamera(FeildOfView, AspectRatio, viewFrustum (0.1,1000)--> makes sure you can see everything from the camera)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
//the renderer needs to know where to render the 3d images
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg')
    }
);
//set the pixel ratio as the screen ratio 
renderer.setPixelRatio(window.devicePixelRatio);
//make the canvas full screen
renderer.setSize(window.innerWidth, window.innerHeight);
//now set the camera at an angle so that the objects are properly rendered
camera.position.setZ(30)
//now render it
renderer.render(scene,camera)

const geometry = new THREE.TorusGeometry(10,3,16,100)
const material = new THREE.MeshStandardMaterial({color:0xFF6347, wireframe:false});
const torus = new THREE.Mesh(geometry,material);

// scene.add(torus)

const pointLight = new THREE.PointLight(0xffffff);
//ambientLight will light up everything in the room equally
const ambientLight = new THREE.AmbientLight(0xffffff);

//helpers will help us visulise where we keep our objects and light sources
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200,50)
pointLight.position.set(20,20,20)
// scene.add(pointLight,ambientLight)
scene.add(pointLight)
// scene.add(lightHelper,gridHelper)
//adds orbit controls to move around based on mouse movements
const controls = new OrbitControls(camera,renderer.domElement);
scene.add(controls)

function addStar(){
    const geometry = new THREE.SphereGeometry(0.25,24,24)
    const material = new THREE.MeshStandardMaterial({color:0xffffff})
    const star = new THREE.Mesh(geometry,material)
    //random generation
    const [x,y,z] = Array(3).fill().map(()=>(THREE.MathUtils.randFloatSpread(600,1000)))
    star.position.set(x,y,z)
    scene.add(star)
}
//-----------------------------------
//Earth
const earthTexture = new THREE.TextureLoader().load('./assets/earth.jpg')
const geometryEarth = new THREE.SphereGeometry(10,24,24)
const materialEarth = new THREE.MeshStandardMaterial({map:earthTexture})
const earth = new THREE.Mesh(geometryEarth,materialEarth)
//random generation
// earth.position.set(10,10,-50)
// scene.background = spaceTexture --> add it if you want to
//Moon-------------------------------
const moonTexture = new THREE.TextureLoader().load('./assets/moon.jpg')
const geometryMoon = new THREE.SphereGeometry(5,24,24)
const materialMoon = new THREE.MeshStandardMaterial({map:moonTexture})
const moon = new THREE.Mesh(geometryMoon,materialMoon)
//random generation
//(distance from earth, , +ve--> daylight zone, -ve--> night zone)
moon.position.set(60,0,40)
earth.add(moon)
scene.add(earth)

//fill in the stars: 
Array(250).fill().forEach(addStar)
//load texture for the background
const spaceTexture = new THREE.TextureLoader().load("./assets/space-texture.jpg")

function animate(){
    requestAnimationFrame(animate);

    const earthRotationSpeed = 0.001; // Adjust this value for Earth's rotation speed
    const moonRotationSpeed = earthRotationSpeed; // Adjust this value for Moon's rotation speed

    earth.rotation.y += earthRotationSpeed;
    moon.rotation.y += moonRotationSpeed;
    
    controls.update()
    renderer.render(scene,camera)
}

animate()

function onWindowResize() {
    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

// Add event listener to window's resize event
window.addEventListener("resize", onWindowResize);

