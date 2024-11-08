import { createScene } from './src/js/scene';
import { createAvatar } from './src/js/avatar';
import { addKeyboardControls } from './src/js/control';
import { listenForUpdates, sendPosUpdate } from './src/js/network';
import { playerAvatars, targetPos } from './src/js/state';

import * as utils from './src/js/utils';
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { handleVoiceChatUpdates } from './src/js/voiceChat';

// TODO: Change this in prod!
const socket = io("https://localhost:3000");

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
    let lastPos = new THREE.Vector3();

    listenForUpdates(socket, scene, avatar);

    function animateLoop()
    {
        ctrAnimate();
        camera.position.copy(avatar.position).add(cameraOffSet);
        camera.lookAt(avatar.position);

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

                handleVoiceChatUpdates(avatar.position, playerId);
            }
        })

        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animateLoop);
    utils.handleResize(renderer, camera);

    // TODO: Remove this after adding skybox
    const gridHelper = new utils.createInfiniteGrid(100);
    scene.add(gridHelper);
}