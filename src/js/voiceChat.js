import { targetPos } from './state';

// TODO: Change this value later
const VOICE_CHAT_RANGE = 20;
const peers = {};
const playerAudioElements = {};

export function handleVoiceChatUpdates(localPlayerPos, playerId)
{
    const distance = calculateDistance(localPlayerPos, playerId);
    const volume = Math.max(0, 1 - (distance / VOICE_CHAT_RANGE));

    adjustAudioVolume(playerId, volume);

    if (distance <= VOICE_CHAT_RANGE && !peers[playerId])
    {
        createPeer(playerId);
    }
    else if (distance > VOICE_CHAT_RANGE && peers[playerId])
    {
        closePeer(playerId);
    }
}

export function createPeer(playerId)
{
    captureAudio().then((stream) => {
        const peerConn = new RTCPeerConnection();
        stream.getTracks().forEach(track => {
            peerConn.addTrack(track, stream);
        })

        peerConn.ontrack = (event) => {
            playAudioForPeer(playerId, event.streams[0]);
        }

        peers[playerId] = peerConn;

        console.log("Peer connected!")
    })
}

export function closePeer(playerId)
{
    const peerConn = peers[playerId];
    if (peerConn)
    {
        peerConn.close();
        delete peers[playerId];

        const audio = playerAudioElements[playerId];
        if (audio)
        {
            audio.remove();
            delete playerAudioElements[playerId];
        }
    }

    console.log("Peer went far away!")
}

function captureAudio()
{
    return navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => stream)
        .catch(error => console.error('Error capturing audio: ', error));
}

function adjustAudioVolume(playerId, volume)
{
    let audio = playerAudioElements[playerId];
    if (!audio)
    {
        audio = document.createElement('audio');
        audio.id = `audio-${playerId}`;
        audio.autoplay = true;
        playerAudioElements[playerId] = audio;
        document.body.appendChild(audio);
    }

    audio.volume = volume;
    console.log("Setting up audio volume for " + playerId + ": " + volume);
}

function playAudioForPeer(playerId, stream)
{
    let audio = playerAudioElements[playerId];
    if (!audio)
    {
        audio = document.createElement('audio');
        audio.id = `audio-${playerId}`;
        audio.autoplay = true;
        playerAudioElements[playerId] = audio;
        document.body.appendChild(audio);
    }

    audio.srcObject = stream;
    console.log("Audio transmitted!");
}

function calculateDistance(localPlayerId, playerId)
{
    const pos1 = localPlayerId.position;
    const pos2 = targetPos[playerId];

    if (!pos1 || !pos2)
    {
        return 0;
    }

    const dx = Math.abs(pos1.x - pos2.x);
    const dy = Math.abs(pos1.y - pos2.y);
    const dz = Math.abs(pos1.z - pos2.z);
    return dx + dy + dz;
}