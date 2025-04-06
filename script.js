const apiKey = "AIzaSyC0jRUeYWtZD-jQhgHNsayxE8WzKniYlaw"; // 🔐 Replace this with your actual Gemini API key

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");

function appendMessage(sender, message) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.innerText = `${sender === "user" ? "You" : "Prat"}: ${message}`;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function getGeminiResponse(userMessage) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ],
    }),
  });

  const data = await response.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  return reply || "Sorry, I didn't understand that.";
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (message === "") return;

  appendMessage("user", message);
  userInput.value = "";

  // Check for greetings
  const greetings = ["hi", "hello", "hey", "hola", "yo"];
  if (greetings.includes(message.toLowerCase())) {
    appendMessage("bot", "Hi there! I'm here and ready to help. What would you like to ask?");
    return;
  }

  // Check for temperature keyword
  if (message.toLowerCase().includes("temp") || message.toLowerCase().includes("weather")) {
    appendMessage("bot", "The current temperature is 24°C. (Note: This is a static response for now.)");
    return;
  }

  // Otherwise, fetch response from Gemini
  try {
    const botReply = await getGeminiResponse(message);
    appendMessage("bot", botReply);
  } catch (error) {
    appendMessage("bot", "There was an error contacting Gemini API.");
    console.error(error);
  }
}

// Events
sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

window.onload = () => {
  appendMessage("bot", "System: You can greet me or type a question to begin.");
};

