import { createScene } from './src/js/scene';
import { createAvatar, createAvatarText } from './src/js/avatar';
import { addKeyboardControls, addMouseControls } from './src/js/control';
import { listenForUpdates } from './src/js/network';
import { playerAvatars, targetPos } from './src/js/state';
import { initChat } from './src/js/textChat';

import * as utils from './src/js/utils';
import * as playerUtils from './src/js/playerUtils'
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

const socket = io("https://frogbar-server.onrender.com");

if (WebGL.isWebGL2Available()) 
{
    initSpace();
    initChat(socket);
} 
else
{
    document.body.appendChild(WebGL.getErrorMessage());
}


let isAnimating = true;

function initSpace()
{
    const { scene, camera, renderer, sun } = createScene();
    const coordsDisplay = utils.displayCoords();
    const avatar = createAvatar();
    avatar.add(camera);
    camera.position.set(0, 4, -5);

    // Prompt for the username
    const username = prompt("Enter your username:", "Anonymous");
    const userHexColor = avatar.material.color.getHex();
    const userColor = `#${userHexColor.toString(16).padStart(6, '0')}`;
    socket.emit('setUserData', { username, color: userColor, hp: 100, maxHP: 100 } );
    createAvatarText(scene, avatar, username, userColor, 1);

    const currentPlayer = {
        avatar: avatar,
        hp: 100,
        maxHP: 100
    };

    playerUtils.updatePlayerHealth(scene, currentPlayer, 0, true);
    const keyControls = addKeyboardControls(avatar);
    addMouseControls(avatar, scene, socket, userColor);

    // listen for socket events
    listenForUpdates(socket, scene, avatar, currentPlayer);

    let lastPos = new THREE.Vector3();
    let lastRot = new THREE.Euler();

    function animateLoop()
    {
        if (!isAnimating) return;

        keyControls();

        coordsDisplay.update(avatar.position, avatar.rotation);
        utils.checkSunCollision(scene, currentPlayer, sun.position, true);
        playerUtils.updateCurrentPlayerPos(lastPos, lastRot, avatar, socket, currentPlayer);

        Object.keys(playerAvatars).forEach(playerId => {
            if (targetPos[playerId])
            {
                utils.checkSunCollision(scene, playerAvatars[playerId], sun.position);
                const currentAvatar = playerAvatars[playerId].avatar;
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

export function pauseAnimation()
{
    isAnimating = false;
}

export function resumeAnimation()
{
    isAnimating = true;
}