const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");

// Start voice recognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript.trim();
  console.log("Heard:", transcript);

  if (transcript.toLowerCase() === "hello prat") {
    appendMessage("Prat", "Hi! I'm here. How can I help you?");
  } else {
    input.value = transcript;
    sendMessage();
  }
};

function activateVoice() {
  recognition.start();
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  appendMessage("You", message);
  input.value = "Thinking...";

  const apiKey = "AIzaSyC0jRUeYWtZD-jQhgHNsayxE8WzKniYlaw"; // Replace with your key
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
  appendMessage("Prat", reply);
  input.value = "";
}

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  msg.style.marginBottom = "10px";
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Auto-start voice when page loads
window.onload = () => {
  appendMessage("System", "Say 'Hello Prat' to begin.");
  activateVoice();
};
