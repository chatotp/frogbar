// shared state file for managing avatar pos and target pos
import * as THREE from 'three';

export const playerAvatars = {};
export const targetPos = {};

export function updateTargetPos(playerId, pos, rot)
{
    if (!targetPos[playerId])
    {
        targetPos[playerId] = {
            position: new THREE.Vector3(),
            rotation: new THREE.Euler()
        };
    }

    targetPos[playerId].position.set(pos.x, pos.y, pos.z);
    targetPos[playerId].rotation.set(rot._x, rot._y, rot._z);
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

// asteroid states
export const asteroidState = {
    asteroids: [],

    setAsteroids(asteroids) 
    {
        this.asteroids = asteroids;
    },

    updateAsteroid(index, newData) 
    {
        if (this.asteroids[index]) 
        {
            this.asteroids[index] = { ...this.asteroids[index], ...newData };
        }
    },

    getAsteroids() 
    {
        return this.asteroids;
    },

    setMeshes(meshes)
    {
        this.meshes = meshes;
    },

    getMeshes()
    {
        return this.meshes;
    }
};
