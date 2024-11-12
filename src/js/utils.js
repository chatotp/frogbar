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

export function createColorPoints(numPoints = 1000, spread = 1000) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(numPoints * 3); // Each point has x, y, z
    const colors = new Float32Array(numPoints * 3);    // Each point has r, g, b

    const color = new THREE.Color();

    for (let i = 0; i < numPoints; i++) {
        // Random positions within the defined spread
        positions[i * 3] = (Math.random() - 0.5) * spread;     // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * spread; // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * spread; // z

        // Random color generation
        color.setHSL(Math.random(), 0.7, 0.5);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material for points with vertex colors
    const material = new THREE.PointsMaterial({
        size: 1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: false, // Ensures size scales with distance
    });

    const points = new THREE.Points(geometry, material);
    return points;
}
