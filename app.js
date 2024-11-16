import { createScene } from './src/js/scene';
import { createAvatar, createAvatarText } from './src/js/avatar';
import { addKeyboardControls } from './src/js/control';
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

    listenForUpdates(socket, scene, avatar);

    // Prompt for the username
    const username = prompt("Enter your username:", "Anonymous");
    const userHexColor = avatar.material.color.getHex();
    const userColor = `#${userHexColor.toString(16).padStart(6, '0')}`;
    socket.emit('setUserData', { username, color: userColor} );
    createAvatarText(scene, avatar, username, userColor, 1);

    let lastPos = new THREE.Vector3();
    let lastRot = new THREE.Euler();

    function animateLoop()
    {
        keyControls();

        coordsDisplay.update(avatar.position, avatar.rotation);

        if (!avatar.position.equals(lastPos) || !avatar.rotation.equals(lastRot))
        {
            sendPosUpdate(socket, avatar.position, avatar.rotation);
            lastPos.copy(avatar.position);
            lastRot.copy(avatar.rotation);
        }

        Object.keys(playerAvatars).forEach(playerId => {
            if (targetPos[playerId])
            {
                const currentAvatar = playerAvatars[playerId];
                const newPos = targetPos[playerId].position;
                const newRot = targetPos[playerId].rotation;

                // interpolate curr pos to target pos
                currentAvatar.position.lerp(newPos, 0.1);

                // interpolate curr rot to target rot
                const targetRotation = new THREE.Euler(newRot._x, newRot._y, newRot._z);
                currentAvatar.quaternion.slerp(new THREE.Quaternion().setFromEuler(targetRotation), 0.1);
            }
        })

        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animateLoop);
    utils.handleResize(renderer, camera);

    const colorPoints = new utils.createColorPoints(2000, 500); // 2000 points spread over 500 units in space
    scene.add(colorPoints);    
}