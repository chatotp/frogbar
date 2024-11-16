import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/Addons.js';
import { TextGeometry } from 'three/examples/jsm/Addons.js';

export function createAvatar(colorText = Math.random() * 0xffffff)
{
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshBasicMaterial({ color: colorText });
    const avatar = new THREE.Mesh(geometry, material);

    // Randomize the position for the current player avatar within a range of -30 to 30
    // x,y,z in clockwise from left-right direction
    const randomX = Math.random() * 60 - 30;
    const randomY = 0;
    const randomZ = Math.random() * 60 - 30;

    avatar.position.set(randomX, randomY, randomZ);

    return avatar;
}

export function createAvatarText(scene, avatar, username, colorText, localPlayer = -1)
{
    const fontLoader = new FontLoader();
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
        const textGeometry = new TextGeometry(username, {
            font: font,
            size: 0.25,
            depth: 0.05
        })

        // calculate bounding box width, so we can center text
        textGeometry.computeBoundingBox();
        const textCenter = new THREE.Vector3();
        textGeometry.boundingBox.getCenter(textCenter);

        const textMaterial = new THREE.MeshBasicMaterial({ color: colorText });
        const usernameTextMesh = new THREE.Mesh(textGeometry, textMaterial);
        usernameTextMesh.position.set(localPlayer * textCenter.x, 1.4, 0); // above avatar

        if (localPlayer === 1)
        {
            usernameTextMesh.rotateY(Math.PI);
        }
        
        avatar.add(usernameTextMesh);
        
        scene.add(avatar);
    });
}