export function initChat(socket)
{
    const chatMsgs = document.getElementById("chat-msgs");
    const chatInput = document.getElementById("chat-input");

    // listen for keypress "Enter"
    chatInput.addEventListener("keydown", (event) => {
        const chatMsgVal = chatInput.value.trim();
        if (event.key === "Enter" && chatMsgVal !== "")
        {
            socket.emit("chatMsg", chatMsgVal);
            chatInput.value = "";
        }
    });

    // listen for incoming msgs
    socket.on("chatMsg", (data) => {
        const msg = document.createElement("div");
        msg.className = "chat-message";
        msg.textContent = `${data.user}: ${data.msg}`;
        chatMsgs.appendChild(msg);
        chatMsgs.scrollTop = chatMsgs.scrollHeight; // scroll to bottom
    })
}