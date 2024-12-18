import * as THREE from 'three';
import { handleShooting } from './shoot';

export function addMouseControls(avatar, scene, socket, userColor) {
    let shooting = false; // Track whether the mouse is being held down
    let shootingInterval; // Store the interval ID for continuous shooting

    // Start shooting on pointerdown
    document.addEventListener('pointerdown', () => {
        if (document.activeElement.id === "chat-input") return; // prevent shooting while typing in chat

        shooting = true;

        // trigger shooting immediately and then repeatedly at intervals
        handleShooting(avatar, scene, socket, userColor);
        shootingInterval = setInterval(() => {
            if (shooting) {
                handleShooting(avatar, scene, socket, userColor);
            }
        }, 100);
    });

    // Stop shooting on pointerup
    document.addEventListener('pointerup', () => {
        shooting = false;
        clearInterval(shootingInterval);
    });

    // stop shooting if the mouse leaves the window
    document.addEventListener('pointerleave', () => {
        shooting = false;
        clearInterval(shootingInterval);
    });
}


export function addKeyboardControls(avatar) 
{
    const keyState = {
        w: false,
        s: false,
        a: false,
        d: false,
        e: false,
        q: false,
        c: false,
        Escape: false
    };

    document.addEventListener('keydown', (event) => {
        if (event.key !== "Escape" && document.activeElement.id === "chat-input") return;
        if (keyState.hasOwnProperty(event.key)) {
            keyState[event.key] = true;
        }
    });

    document.addEventListener('keyup', (event) => {
        if (keyState.hasOwnProperty(event.key)) {
            keyState[event.key] = false;
        }
    });

    // Movement parameters for smooth motion
    let velocity = new THREE.Vector3(0, 0, 0);
    const acceleration = 0.01; 
    const deceleration = 0.005;
    const maxSpeed = 0.2;

    // Parameters for turning smoothness
    let rotationSpeed = 0;
    const maxRotationSpeed = 0.05;  // Maximum turn speed (radians per frame)
    const turnAcceleration = 0.002;

    function updatePos() {
        // Calculate forward/backward acceleration
        if (keyState.w) 
        {
            velocity.z = Math.min(velocity.z + acceleration, maxSpeed);
        } 
        else if (keyState.s) 
        {
            velocity.z = Math.max(velocity.z - acceleration, -maxSpeed);
        } 
        else 
        {
            // Deceleration when no keys are pressed
            velocity.z = velocity.z > 0 ? Math.max(velocity.z - deceleration, 0) : Math.min(velocity.z + deceleration, 0);
        }

        // Calculate left/right turning speed
        if (keyState.a) 
        {
            rotationSpeed = Math.min(rotationSpeed + turnAcceleration, maxRotationSpeed); // A key = clockwise
        } 
        else if (keyState.d) 
        {
            rotationSpeed = Math.max(rotationSpeed - turnAcceleration, -maxRotationSpeed); // D key = counterclockwise
        } 
        else 
        {
            // Decelerate turning if no keys pressed
            rotationSpeed = rotationSpeed > 0 ? Math.max(rotationSpeed - turnAcceleration, 0) : Math.min(rotationSpeed + turnAcceleration, 0);
        }

        if (keyState.e) 
        {
            avatar.position.y += 0.1;
        }
        else if (keyState.q)
        {
            avatar.position.y -= 0.1;
        }

        avatar.rotation.y += rotationSpeed;
        avatar.rotation.y = THREE.MathUtils.euclideanModulo(avatar.rotation.y, Math.PI * 2); // Normalize between 0 and 2π
        
        const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(avatar.quaternion);
        avatar.position.addScaledVector(direction, velocity.z);

        // Handle chat input focus/unfocus
        if (keyState.c) document.getElementById("chat-input").focus();
        if (keyState.Escape && document.activeElement.id === "chat-input") document.getElementById("chat-input").blur();
    }

    return updatePos;
}
