import * as THREE from 'three';
import { updatePlayerHealth } from './playerUtils';
import { playerAvatars } from './state';

export function handleShooting(playerAvatar, scene, socket, userColor) {
    const bulletGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: userColor });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    
    // Set initial bullet position to player's position
    bullet.position.copy(playerAvatar.position);
    scene.add(bullet);

    // Calculate bullet direction based on player's orientation
    const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(playerAvatar.quaternion).normalize();
    const speed = 0.5;

    let hit = false;

    function animateBullet() {
        bullet.position.addScaledVector(direction, speed);
    
        Object.keys(playerAvatars).forEach(playerId => {
            const target = playerAvatars[playerId].avatar;

            if (!hit && bullet.position.distanceTo(target.position) < 0.5) { // collision threshold
                hit = true; // Mark as hit to prevent multiple triggers
                updatePlayerHealth(scene, playerAvatars[playerId], 5);
                socket.emit('playerHit', playerId, 5);
                scene.remove(bullet);
            }
        });
    
        if (!hit && bullet.position.length() > 100) {
            scene.remove(bullet);
        } else if (!hit) {
            requestAnimationFrame(animateBullet);
        }
    }    

    animateBullet();
}
