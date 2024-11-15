export function initChat(socket)
{
    const chatMsgs = document.getElementById("chat-msgs");
    const chatInput = document.getElementById("chat-input");

    chatInput.addEventListener("keydown", (event) => {
        const chatMsgVal = chatInput.value.trim();
        if (event.key === "Enter" && chatMsgVal !== "")
        {
            socket.emit("chatMsg", chatMsgVal);
            chatInput.value = "";
        }
    });

    socket.on("chatMsg", (data) => {
        const msg = document.createElement("div");
        msg.className = "chat-message";

        const userNameSpan = document.createElement("span");
        userNameSpan.style.color = data.color || "white";
        userNameSpan.textContent = `${data.user}: `

        const msgSpan = document.createElement("span");
        msgSpan.textContent = `${data.msg}`;
        
        msg.appendChild(userNameSpan);
        msg.appendChild(msgSpan);

        chatMsgs.appendChild(msg);
        chatMsgs.scrollTop = chatMsgs.scrollHeight; // scroll to bottom
    })
}
