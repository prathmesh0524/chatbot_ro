const chatBox = document.getElementById("chat-box");

async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  appendMessage("You", message);
  input.value = "Thinking...";

  const apiKey = "AIzaSyC0jRUeYWtZD-jQhgHNsayxE8WzKniYlaw"; 
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: message }] }]
    })
  });

  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply found.";
  appendMessage("Gemini", reply);
  input.value = "";
}

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  msg.style.marginBottom = "10px";
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
