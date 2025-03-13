document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") sendMessage();
});

function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return;

    addMessage(userInput, "user-message");
    document.getElementById("user-input").value = "";

    fetchAIResponse(userInput);
}

function addMessage(text, className) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", className);
    messageDiv.innerText = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function fetchAIResponse(userText) {
    addMessage("Thinking...", "bot-message");

    fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + window.OPENAI_API_KEY
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userText }]
        })
    })
    .then(response => response.json())
    .then(data => {
        const aiResponse = data.choices[0].message.content.trim();
        document.querySelector(".bot-message:last-child").remove();
        addMessage(aiResponse, "bot-message");
    })
    .catch(() => {
        document.querySelector(".bot-message:last-child").remove();
        addMessage("❌ Error: Unable to connect!", "bot-message");
    });
}
