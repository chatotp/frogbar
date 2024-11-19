import { sendPosUpdate } from "./network";
import { showDeathScreen } from "./utils";

export function updateCurrentPlayerPos(lastPos, lastRot, avatar, socket)
{
    if (!avatar.position.equals(lastPos) || !avatar.rotation.equals(lastRot))
    {
        sendPosUpdate(socket, avatar.position, avatar.rotation);
        lastPos.copy(avatar.position);
        lastRot.copy(avatar.rotation);
    }
}

export function updatePlayerHealth(scene, player, damage, localPlayer = false) {
    player.hp -= damage;
    const hpPercentage = Math.min(Math.max(0, (player.hp / player.maxHP) * 100), 100);

    if (hpPercentage === 0)
    {
        showDeathScreen(scene, player, localPlayer);
    }

    updateCurrentPlayerHPBar(hpPercentage);
}


function updateCurrentPlayerHPBar(percentage) {
    const hpBar = document.getElementById('current-player-hp-bar');
    hpBar.style.width = `${percentage}%`;
    
    // change color dynamically based on the HP percentage
    if (percentage > 50) {
        hpBar.style.backgroundColor = 'lightgreen';
    } else if (percentage > 20) {
        hpBar.style.backgroundColor = 'yellow';
    } else {
        hpBar.style.backgroundColor = 'red';
    }
}
