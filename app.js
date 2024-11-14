import { createScene } from './src/js/scene';
import { createAvatar } from './src/js/avatar';
import { addKeyboardControls } from './src/js/control';
import { listenForUpdates, sendPosUpdate } from './src/js/network';
import { playerAvatars, targetPos } from './src/js/state';
import { initChat } from './src/js/textChat';

import * as utils from './src/js/utils';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/Addons.js';
import WebGL from 'three/addons/capabilities/WebGL.js';

// TODO: Change this in prod!
const socket = io("https://localhost:3000");

if (WebGL.isWebGL2Available()) 
{
    initSpace();
    initChat(socket);
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
    avatar.add(camera);
    camera.position.set(0, 4, -5);

    const controls = new PointerLockControls(camera, renderer.domElement);
    document.addEventListener('click', () => {
        controls.lock();  // Lock the mouse pointer
    });

    const keyControls = addKeyboardControls(avatar);

    listenForUpdates(socket, scene, avatar);

    let lastPos = new THREE.Vector3();

    function animateLoop()
    {
        controls.update(0.05);
        keyControls();

        coordsDisplay.textContent = `X: ${avatar.position.x.toFixed(2)}, Y: ${avatar.position.y.toFixed(2)}, Z: ${avatar.position.z.toFixed(2)}`;

        if (!avatar.position.equals(lastPos))
        {
            sendPosUpdate(socket, avatar.position);
            lastPos.copy(avatar.position);
        }

        Object.keys(playerAvatars).forEach(playerId => {
            if (targetPos[playerId])
            {
                const currentAvatar = playerAvatars[playerId];
                const newPos = targetPos[playerId];

                // interpolate curr pos to target pos
                currentAvatar.position.lerp(newPos, 0.1);
            }
        })

        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animateLoop);
    utils.handleResize(renderer, camera);

    const colorPoints = new utils.createColorPoints(2000, 500); // 2000 points spread over 500 units in space
    scene.add(colorPoints);    
}