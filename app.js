import { createScene } from './src/js/scene';
import { createAvatar } from './src/js/avatar';
import { addKeyboardControls } from './src/js/control';

import * as utils from './src/js/utils';
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

if (WebGL.isWebGL2Available()) 
{
    initSpace();
} 
else
{
    document.body.appendChild(WebGL.getErrorMessage());
}

function initSpace()
{
    const { scene, camera, renderer } = createScene();
    const coordsDisplay = utils.displayCoords();
    const avatar = createAvatar(scene);

    const ctrAnimate = addKeyboardControls(avatar);
    const cameraOffSet = new THREE.Vector3(0, 5, -10);

    function animateLoop()
    {
        ctrAnimate();
        camera.position.copy(avatar.position).add(cameraOffSet);
        camera.lookAt(avatar.position);

        coordsDisplay.textContent = `X: ${avatar.position.x.toFixed(2)}, Y: ${avatar.position.y.toFixed(2)}, Z: ${avatar.position.z.toFixed(2)}`;

        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animateLoop);
    utils.handleResize(renderer, camera);

    // TODO: Remove this after adding skybox
    const gridHelper = new utils.createInfiniteGrid(100);
    scene.add(gridHelper);
}