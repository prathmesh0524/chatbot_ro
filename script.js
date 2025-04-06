const apiKey = "AIzaSyC0jRUeYWtZD-jQhgHNsayxE8WzKniYlaw"; // Replace with your Gemini API key

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
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

  try {
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
    console.log("Gemini API Raw Response:", data); // For debugging

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply || "Sorry, I didn't understand that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "There was an error contacting Gemini API.";
  }
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (message === "") return;

  appendMessage("user", message);
  userInput.value = "";

  // Static keyword responses
  const greetings = ["hi", "hello", "hey", "hola", "yo"];
  if (greetings.includes(message.toLowerCase())) {
    appendMessage("bot", "Hi there! I'm here and ready to help. What would you like to ask?");
    return;
  }

  if (message.toLowerCase().includes("temp") || message.toLowerCase().includes("weather")) {
    appendMessage("bot", "The current temperature is 24°C. (Note: This is a static response for now.)");
    return;
  }

  // Otherwise, use Gemini API
  const botReply = await getGeminiResponse(message);
  appendMessage("bot", botReply);
}

// Events
sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

window.onload = () => {
  appendMessage("bot", "System: You can greet me or type a question to begin.");
};
