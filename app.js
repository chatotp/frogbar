import { createScene } from './src/js/scene';
import { createAvatar, createAvatarText } from './src/js/avatar';
import { addKeyboardControls, addMouseControls } from './src/js/control';
import { listenForUpdates, sendPosUpdate } from './src/js/network';
import { playerAvatars, targetPos } from './src/js/state';
import { initChat } from './src/js/textChat';

import * as utils from './src/js/utils';
import * as THREE from 'three';
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
    const avatar = createAvatar();
    avatar.add(camera);
    camera.position.set(0, 4, -5);

    const keyControls = addKeyboardControls(avatar);
    addMouseControls(camera);

    listenForUpdates(socket, scene, avatar);

    // Prompt for the username
    const username = prompt("Enter your username:", "Anonymous");
    const userHexColor = avatar.material.color.getHex();
    const userColor = `#${userHexColor.toString(16).padStart(6, '0')}`;
    socket.emit('setUserData', { username, color: userColor} );
    createAvatarText(scene, avatar, username, userColor, 1);

    let lastPos = new THREE.Vector3();

    function animateLoop()
    {
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