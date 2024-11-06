import * as THREE from 'three';

export function createScene()
{
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        60, window.innerWidth / window.innerHeight,
        1, 1000
    );

    camera.position.set(0, 5, -10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    return { scene, camera, renderer };
}