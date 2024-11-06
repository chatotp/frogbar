export function addKeyboardControls(avatar) {
    const keyState = {
        w: false,
        s: false,
        a: false,
        d: false
    };

    document.addEventListener('keydown', (event) => {
        if (keyState.hasOwnProperty(event.key)) {
            keyState[event.key] = true;
        }
    });

    document.addEventListener('keyup', (event) => {
        if (keyState.hasOwnProperty(event.key)) {
            keyState[event.key] = false;
        }
    });

    function updatePos() {
        if (keyState.w) avatar.position.z += 0.05;
        if (keyState.s) avatar.position.z -= 0.05;
        if (keyState.a) avatar.position.x += 0.05;
        if (keyState.d) avatar.position.x -= 0.05;
    }

    return updatePos;
}
