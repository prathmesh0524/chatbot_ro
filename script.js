const inputBox = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const apiKey = "AIzaSyC0jRUeYWtZD-jQhgHNsayxE8WzKniYlaw"; // 🔁 Replace with YOUR actual Gemini API key

function appendMessage(sender, message) {
  const msgDiv = document.createElement("div");
  msgDiv.className = sender === "You" ? "user-message" : "bot-message";
  msgDiv.textContent = `${sender}: ${message}`;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = inputBox.value.trim();
  if (!message) return;

  appendMessage("You", message);
  inputBox.value = "";

  const lower = message.toLowerCase();

  // 💬 Hardcoded responses
  if (["hi", "hello", "hey"].includes(lower)) {
    appendMessage("Prat", "Hi there! I'm here and ready to help. What would you like to ask?");
    return;
  }
  if (lower.includes("temp")) {
    appendMessage("Prat", "The current temperature is 24°C. (Note: This is a static response for now.)");
    return;
  }

  // 🧠 Ask Gemini API
  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }],
        }),
      }
    );

    const data = await res.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I didn’t get that.";

    appendMessage("Prat", reply);
  } catch (err) {
    console.error(err);
    appendMessage("Prat", "Oops! Couldn’t connect to Gemini.");
  }
}

document.getElementById("send-btn").addEventListener("click", sendMessage);
inputBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});


