import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/Addons.js';
import { TextGeometry } from 'three/examples/jsm/Addons.js';

export function createAvatar(scene)
{
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00fff0 });
    const avatar = new THREE.Mesh(geometry, material);
    scene.add(avatar);

    createAvatarText(avatar);

    return avatar;
}

function createAvatarText(avatar)
{
    const fontLoader = new FontLoader();
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
        const textGeometry = new TextGeometry('test', {
            font: font,
            size: 0.3,
            depth: 0.05
        })

        const textMaterial = new THREE.MeshBasicMaterial({ color: 0x00fff0 });
        const usernameTextMesh = new THREE.Mesh(textGeometry, textMaterial);
        usernameTextMesh.position.set(-0.4, -0.5, 5); // above avatar
        avatar.add(usernameTextMesh);
    });
}