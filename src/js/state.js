// shared state file for managing avatar pos and target pos
import * as THREE from 'three';

export const playerAvatars = {};
export const targetPos = {};

export function updateTargetPos(playerId, pos)
{
    if (!targetPos[playerId])
    {
        targetPos[playerId] = new THREE.Vector3();
    }

    targetPos[playerId].set(pos.x, pos.y, pos.z);
}

export function removePlayer(playerId, scene)
{
    if (playerAvatars[playerId]) 
    {
        scene.remove(playerAvatars[playerId]);
        delete playerAvatars[playerId];
    } 
    else 
    {
        console.warn(`Attempted to remove a non-existing player`);
    }

    if (targetPos[playerId])
    {
        delete targetPos[playerId];
    }
    else 
    {
        console.warn(`Attempted to remove positions of a non-existing player`);
    }
}