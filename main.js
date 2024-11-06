import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { TextGeometry } from 'three/examples/jsm/Addons.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

if (WebGL.isWebGL2Available())
{
    renderSpace();
}
else
{
    document.body.appendChild(WebGL.getErrorMessage());
}

function renderSpace()
{
    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const coordsDisplay = displayCoords();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        60, window.innerWidth / window.innerHeight,
        1, 1000
    )
    camera.position.set(0, 5, -10);
    camera.lookAt(0, 0, 0);

    const cameraOffset = new THREE.Vector3(0, 5, -10);

    const { cube, wireframeCube } = createAvatar(scene);

    function animate()
    {
        camera.position.copy(cube.position).add(cameraOffset);
        camera.lookAt(cube.position);
        
        coordsDisplay.textContent = `X: ${cube.position.x.toFixed(2)}, Y: ${cube.position.y.toFixed(2)}, Z: ${cube.position.z.toFixed(2)}`;
        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);
    addEventListeners(renderer, camera, cube);
    addControls(wireframeCube);
    temp(scene);
}

function createAvatar(scene)
{
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00fff0 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // add temp wireframe
    const wireframeGeometry = new THREE.BoxGeometry(1.1, 2.1, 1.1); // Slightly larger than the main cube
    const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    const wireframeCube = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    scene.add(wireframeCube);

    // add temp text placeholder
    const fontLoader = new FontLoader();
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
        const textGeometry = new TextGeometry('test', {
            font: font,
            size: 0.3,
            height: 0.05
        })

        const textMaterial = new THREE.MeshBasicMaterial({ color: 0x00fff0 });
        const usernameTextMesh = new THREE.Mesh(textGeometry, textMaterial);
        usernameTextMesh.position.set(-0.4, -0.5, 5); // above avatar
        cube.add(usernameTextMesh);
    })

    return { cube, wireframeCube };
}

function addEventListeners(renderer, camera, avatar)
{
    addControls(avatar);
    handleResize(renderer, camera);
}

function addControls(avatar)
{
    // keyboard controls
    const keyState = {
        w: false,
        s: false,
        a: false,
        d: false
    }

    document.addEventListener('keydown', (event) => {
        if (keyState.hasOwnProperty(event.key))
        {
            keyState[event.key] = true;
        }
    })

    document.addEventListener('keyup', (event) => {
        if (keyState.hasOwnProperty(event.key))
        {
            keyState[event.key] = false;
        }
    })

    function updatePos()
    {
        if (keyState.w) avatar.position.z += 0.05;
        if (keyState.s) avatar.position.z -= 0.05;
        if (keyState.a) avatar.position.x += 0.05;
        if (keyState.d) avatar.position.x -= 0.05;
    }

    function gameLoop()
    {
        updatePos();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}

function handleResize(renderer, camera)
{
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    })
}

function displayCoords()
{
    const coordsDisplay = document.createElement('div');
    coordsDisplay.className = 'coords-display';
    document.body.appendChild(coordsDisplay);
    return coordsDisplay;
}

function temp(scene)
{
    const gridHelper = new createInfiniteGrid(100);
    scene.add(gridHelper);
}

function createInfiniteGrid(size) {
    const gridMaterial = new THREE.LineBasicMaterial({ color: 0x888888 });
    const gridGeometry = new THREE.BufferGeometry();

    const positions = [];
    
    // Create horizontal grid lines
    for (let i = -size; i <= size; i++) {
        positions.push(i, 0, -size, i, 0, size); // Horizontal lines
        positions.push(-size, 0, i, size, 0, i); // Vertical lines
    }
    
    gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    
    const grid = new THREE.LineSegments(gridGeometry, gridMaterial);
    return grid;
}