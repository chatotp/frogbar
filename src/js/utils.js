import * as THREE from 'three';

export function handleResize(renderer, camera)
{
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    })
}

export function displayCoords()
{
    const coordsDisplay = document.createElement('div');
    coordsDisplay.className = 'coords-display';
    document.body.appendChild(coordsDisplay);
    return coordsDisplay;
}

// TODO: Remove this after adding skybox
export function createInfiniteGrid(size) {
    const gridMaterial = new THREE.LineBasicMaterial({ color: 0x888888 });
    const gridGeometry = new THREE.BufferGeometry();

    const positions = [];
    
    // Create horizontal grid lines
    for (let i = -size; i <= size; i++) {
        positions.push(i, 0, -size, i, 0, size); // Horizontal lines
        positions.push(-size, 0, i, size, 0, i); // Vertical lines
    }
    
    gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    
    const grid = new THREE.LineSegments(gridGeometry, gridMaterial);
    return grid;
}
