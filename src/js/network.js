import { createAvatar } from "./avatar";
import { playerAvatars, updateTargetPos, removePlayer } from "./state";

export function listenForUpdates(socket, scene, avatar)
{
    socket.on('init', (players) => {
        socket.emit('updatePos', avatar.position);
        Object.keys(players).forEach(playerId => {
            const newAvatar = createAvatar(scene);
            const pos = players[playerId];
            newAvatar.position.set(pos.x, pos.y, pos.z);
            playerAvatars[playerId] = newAvatar;
        })
    })

    socket.on('updateAll', (players) => {
        Object.keys(players).forEach(playerId => {
            if (playerId != socket.id)
            {
                const pos = players[playerId];
                
                // update player if exists
                // else create new one
                if (!playerAvatars[playerId])
                {
                    const newAvatar = createAvatar(scene);
                    newAvatar.position.set(pos.x, pos.y, pos.z);
                    playerAvatars[playerId] = newAvatar;
                }

                updateTargetPos(playerId, pos);
            }
        })
    })
    
    socket.on('disconnectPlayer', (playerId) => {
        removePlayer(playerId, scene);
    })
}

export function sendPosUpdate(socket, position)
{
    socket.emit('updatePos', position);
}