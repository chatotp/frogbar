import { createAvatar, createAvatarText } from "./avatar";
import { playerAvatars, updateTargetPos, removePlayer } from "./state";

export function listenForUpdates(socket, scene, avatar)
{
    socket.on('init', (players) => {
        socket.emit('updatePos', { position: avatar.position, rotation: avatar.rotation } );
        Object.keys(players).forEach(playerId => {
            const playerData = players[playerId];
            const newAvatar = createAvatar(playerData.color);
            createAvatarText(scene, newAvatar, playerData.username, playerData.color);
            
            const pos = playerData.position;
            newAvatar.position.set(pos.x, pos.y, pos.z);

            const rot = playerData.rotation;
            newAvatar.rotation.set(rot._x, rot._y, rot._z);
            playerAvatars[playerId] = {
                avatar: newAvatar,
                hp: 0,
                maxHP: 100
            };
        });
    });

    socket.on('updateAll', (players) => {
        Object.keys(players).forEach(playerId => {
            if (playerId !== socket.id) {
                const pos = players[playerId].position;
                const rot = players[playerId].rotation;

                if (playerAvatars[playerId]) {
                    updateTargetPos(playerId, pos, rot);
                    const newAvatar = playerAvatars[playerId].avatar;
                    newAvatar.position.set(pos.x, pos.y, pos.z);
                    newAvatar.rotation.set(rot._x, rot._y, rot._z);
                }
                else
                {
                    const playerData = players[playerId];
                    const newAvatar = createAvatar(playerData.color);
                    createAvatarText(scene, newAvatar, playerData.username, playerData.color);
                    
                    newAvatar.position.set(pos.x, pos.y, pos.z);
                    newAvatar.rotation.set(rot._x, rot._y, rot._z);
                    playerAvatars[playerId] = {
                        avatar: newAvatar,
                        hp: 0,
                        maxHP: 100
                    };
                }
            }
        });
    });
    
    socket.on('disconnectPlayer', (playerId) => {
        removePlayer(playerId, scene);
    });
}

export function sendPosUpdate(socket, position, rotation)
{
    socket.emit('updatePos', { position: position, rotation: rotation } );
}
