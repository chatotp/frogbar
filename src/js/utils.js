import * as THREE from 'three';
import { pauseAnimation, resumeAnimation } from '../../app';
import { updateCurrentPlayerHPBar } from './playerUtils';
import { asteroidState } from './state';

export function handleResize(renderer, camera)
{
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    })
}
export function displayCoords() {
    const coordsDisplay = document.createElement('div');
    coordsDisplay.className = 'coords-display';
    document.body.appendChild(coordsDisplay);

    return {
        update: (position, rotation) => {
            coordsDisplay.innerHTML = `
                X: ${position.x.toFixed(2)}, Y: ${position.y.toFixed(2)}, Z: ${position.z.toFixed(2)}<br>
                Rotation: ${THREE.MathUtils.radToDeg(rotation.y).toFixed(2)}°
            `;
        }
    };
}

export function checkSunCollision(scene, player, sunPosition, localPlayer = false)
{
    const distance = player.avatar.position.distanceTo(sunPosition);

    if (distance < 50)
    {
        showDeathScreen(scene, player, localPlayer)
    }
}

export function showDeathScreen(scene, player, localPlayer, died = false)
{
    scene.remove(player.avatar);

        if (localPlayer)
        {
            showBurnedScreen(died);
            pauseAnimation();
        }

        setTimeout(() => {
            if (localPlayer)
            {
                restartPlayer(player, died);
            }

            scene.add(player.avatar);
            
            if (localPlayer)
            {
                resumeAnimation();
            }
        }, 3000);
}

function restartPlayer(player) 
{
    player.avatar.position.set((Math.random() - 0.5) * 60, 0, (Math.random() - 0.5) * 60);
    player.hp = player.maxHP;
    updateCurrentPlayerHPBar(100);
}

function showBurnedScreen(died = false) 
{
    const burnedScreen = document.getElementById('burned-screen');
    burnedScreen.style.display = 'block';

    if (died)
    {
        burnedScreen.textContent = "You died!";
    }
    else
    {
        burnedScreen.textContent = "You got burned!";
    }

    setTimeout(() => {
        burnedScreen.style.display = 'none';
    }, 3000);
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

export function setupAsteroids(scene)
{
    const asteroidMeshes = [];

    // Visualize asteroids in the scene
    asteroidState.getAsteroids().forEach((asteroidData) => {
        const { position_x, position_y, position_z, velocity_x, velocity_y, velocity_z, radius } = asteroidData;

        // Create a new asteroid mesh using the data from the server
        const asteroidGeometry = new THREE.DodecahedronGeometry(radius);
        const asteroidMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
        const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

        asteroid.position.set(position_x, position_y, position_z);
        asteroid.rotationSpeed = new THREE.Vector3(0.02, 0.01, 0.02); // random values
        asteroid.velocity = new THREE.Vector3(velocity_x, velocity_y, velocity_z);

        asteroidMeshes.push(asteroid);
        scene.add(asteroid);
    });

    asteroidState.setMeshes(asteroidMeshes);
}

export function checkForAsteroidCollision(scene, asteroid, currentPlayer)
{
    const playerPos = currentPlayer.avatar.position;
    const distance = playerPos.distanceTo(asteroid.position);
    const collisionThreshold = asteroid.geometry.parameters.radius + 2; // Add slight buffer;

    if (distance < collisionThreshold)
    {
        showDeathScreen(scene, currentPlayer, true, true);
    }
}
