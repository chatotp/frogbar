import { createAvatar, createAvatarText } from "./avatar";
import { playerAvatars, updateTargetPos, removePlayer } from "./state";

export function listenForUpdates(socket, scene, avatar)
{
    socket.on('init', (players) => {
        socket.emit('updatePos', avatar.position);
        Object.keys(players).forEach(playerId => {
            const playerData = players[playerId];
            const newAvatar = createAvatar(playerData.color);
            createAvatarText(scene, newAvatar, playerData.username, playerData.color);
            const pos = playerData.position;
            newAvatar.position.set(pos.x, pos.y, pos.z);
            playerAvatars[playerId] = newAvatar;
        });
    });

    socket.on('updateAll', (players) => {
        Object.keys(players).forEach(playerId => {
            if (playerId !== socket.id) {
                const pos = players[playerId].position;

                if (playerAvatars[playerId]) {
                    updateTargetPos(playerId, pos);
                    const newAvatar = playerAvatars[playerId];
                    newAvatar.position.set(pos.x, pos.y, pos.z);
                }
                else
                {
                    const playerData = players[playerId];
                    const newAvatar = createAvatar(playerData.color);
                    createAvatarText(scene, newAvatar, playerData.username, playerData.color);
                    const pos = playerData.position;
                    newAvatar.position.set(pos.x, pos.y, pos.z);
                    playerAvatars[playerId] = newAvatar;
                }
            }
        });
    });
    
    socket.on('disconnectPlayer', (playerId) => {
        removePlayer(playerId, scene);
    });
}

export function sendPosUpdate(socket, position)
{
    socket.emit('updatePos', position);
}
