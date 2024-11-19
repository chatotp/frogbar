import { createAvatar, createAvatarText } from "./avatar";
import { updatePlayerHealth } from "./playerUtils";
import { playerAvatars, updateTargetPos, removePlayer } from "./state";

export function listenForUpdates(socket, scene, avatar, currentPlayer)
{
    socket.on('init', (players) => {
        socket.emit('updatePos', { position: avatar.position, rotation: avatar.rotation, hp: currentPlayer.hp, maxHP: currentPlayer.maxHP } );
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
                hp: playerData.hp,
                maxHP: playerData.maxHP
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
                    playerAvatars[playerId].hp = players[playerId].hp;
                    playerAvatars[playerId].maxHP = players[playerId].maxHP;
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
                        hp: playerData.hp,
                        maxHP: playerData.maxHP
                    };
                }
            }
        });
    });
    
    socket.on('disconnectPlayer', (playerId) => {
        removePlayer(playerId, scene);
    });

    socket.on('updateHealth', (playerId, damage) => {
        if (playerId === socket.id)
        {
            updatePlayerHealth(scene, currentPlayer, damage, true);
        }
    });
}

export function sendPosUpdate(socket, position, rotation)
{
    socket.emit('updatePos', { position: position, rotation: rotation } );
}
