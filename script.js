// Get DOM elements
const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("userInput");
const micBtn = document.getElementById("micBtn");
const pratAvatar = document.getElementById("prat-avatar");

// Initialize Speech Recognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;

// When voice input returns a result, just send the transcript
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript.trim().toLowerCase();
  // Clean punctuation from transcript
  const cleanedTranscript = transcript.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  console.log("Voice input:", cleanedTranscript);
  userInput.value = cleanedTranscript;
  sendMessage();
};

// Function to start voice recognition
function activateVoice() {
  recognition.start();
}

// Function to send message (handles greetings and temperature)
async function sendMessage() {
  const rawMessage = userInput.value.trim();
  if (!rawMessage) return;
  
  // Clean the message for simple checks
  const message = rawMessage.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  
  appendMessage("You", rawMessage);
  userInput.value = "Thinking...";
  
  // Change avatar to talking state
  changeAvatar("prat_talking.gif");
  
  // Check for greeting messages (exact match)
  const greetings = ["hi", "hello", "hey"];
  if (greetings.includes(message)) {
    setTimeout(() => {
      appendMessage("Prat", "Hi there! I'm here and ready to help. What would you like to ask?");
      userInput.value = "";
      setTimeout(() => changeAvatar("prat_idle.gif"), 1500);
    }, 500);
    return;
  }
  
  // Check for temperature-related queries (if message includes "temp" or "temperature")
  if (message.includes("temp") || message.includes("temperature")) {
    setTimeout(() => {
      appendMessage("Prat", "The current temperature is 24°C. (Note: This is a static response for now.)");
      userInput.value = "";
      setTimeout(() => changeAvatar("prat_idle.gif"), 1500);
    }, 500);
    return;
  }
  
  // Otherwise, call the Gemini API
  const apiKey = "AIzaSyC0jRUeYWtZD-jQhgHNsayxE8WzKniYlaw"; // Replace with your actual API key
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: rawMessage }] }]
      })
    });
    
    const data = await response.json();
    // Get the reply; if undefined, use a fallback
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn't get that.";
    appendMessage("Prat", reply);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    appendMessage("Prat", "Oops, something went wrong. Please try again later.");
  }
  
  // Clear input and revert avatar to idle after 1.5 seconds
  userInput.value = "";
  setTimeout(() => changeAvatar("prat_idle.gif"), 1500);
}

// Function to append a message to the chat log
function appendMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
  msgDiv.className = "message";
  chatLog.appendChild(msgDiv);
  chatLog.scrollTop = chatLog.scrollHeight;
}

// Function to change the avatar image
function changeAvatar(imageName) {
  // Assumes your images are stored in the prat-avatar folder
  pratAvatar.src = `prat-avatar/${imageName}`;
}

// Start voice recognition when mic button is clicked
micBtn.addEventListener("click", activateVoice);

// On window

