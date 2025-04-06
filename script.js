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

// List of wake words for activation (case insensitive)
const wakeWords = ["hello prat", "hi prat", "hey prat"];

// When voice input returns a result
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript.trim().toLowerCase();
  console.log("Voice input:", transcript);
  
  // Check if transcript contains any wake word
  if (wakeWords.some(word => transcript.includes(word))) {
    // If wake word detected, greet the user and change avatar to a talking animation
    appendMessage("Prat", "Hi there! I'm here and ready to help. What would you like to ask?");
    changeAvatar("prat_talking.gif");
    // Revert avatar to idle after 2 seconds
    setTimeout(() => changeAvatar("prat_idle.gif"), 2000);
  } else {
    // Otherwise, set the input field to the transcript and send the message
    userInput.value = transcript;
    sendMessage();
  }
};

// Function to start voice recognition
function activateVoice() {
  recognition.start();
}

// Send message to Gemini API and update chat log
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;
  
  appendMessage("You", message);
  userInput.value = "Thinking...";
  
  // Change avatar to talking state
  changeAvatar("prat_talking.gif");
  
  const apiKey = "AIzaSyC0jRUeYWtZD-jQhgHNsayxE8WzKniYlaw";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    });
    
    const data = await response.json();
    // Get the reply; if undefined, set a fallback response
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

// Optional: start voice recognition on mic button click
micBtn.addEventListener("click", activateVoice);

// On window load, display instructions and start idle avatar
window.onload = () => {
  appendMessage("System", "Say 'Hello Prat' (or hi/hey prat) or type your message to begin.");
  changeAvatar("prat_idle.gif");
};
