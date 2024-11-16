import * as THREE from 'three';

export function createScene()
{
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight,
        1, 1000
    );

    camera.position.set(0, 5, -10);
    camera.lookAt(0, 0, 0);


    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene.add(createSun());

    return { scene, camera, renderer };
}

function createSun()
{
    const sunGeometry = new THREE.SphereGeometry(50, 32, 32); 
    const sunMaterial = new THREE.MeshStandardMaterial({
        emissive: 0xFFFF00,
        emissiveIntensity: 1,
    });

    const sun = new THREE.Mesh(sunGeometry, sunMaterial);

    // position sun far away
    sun.position.set(200, 0, 100);  // far from the origin (camera)

    return sun;
}