
  const apiKey = "AIzaSyC0jRUeYWtZD-jQhgHNsayxE8WzKniYlaw"; // Replace this with your actual Gemini API key


window.onload = () => {
  const chatLog = document.getElementById("chat-log");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");
  const micBtn = document.getElementById("mic-btn");

  if (!chatLog || !userInput || !sendBtn || !micBtn) {
    console.error("One or more DOM elements are missing.");
    return;
  }

  function appendMessage(sender, message) {
    const div = document.createElement("div");
    div.classList.add("message", sender);
    div.innerText = `${sender === "user" ? "You" : "Prat"}: ${message}`;
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  async function fetchGeminiResponse(message) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: message }] }]
      })
    });

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn't get that.";
  }

  async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    appendMessage("user", message);
    userInput.value = "";

    try {
      const reply = await fetchGeminiResponse(message);
      appendMessage("bot", reply);
    } catch (e) {
      appendMessage("bot", "Oops! Something went wrong.");
      console.error(e);
    }
  }

  // Button clicks
  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // Voice input
  micBtn.addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      userInput.value = spokenText;
      sendMessage();
    };

    recognition.onerror = () => {
      appendMessage("bot", "Voice input failed.");
    };
  });

  // Initial message
  appendMessage("bot", "System: You can type or use mic to talk to me.");
};

