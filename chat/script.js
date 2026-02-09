const BACKEND_URL = "https://solutions-in-motion-ai-chat-backend.vercel.app/api/chat"; // <-- update if different
document.getElementById("sendBtn").addEventListener("click", sendMessage);

function addMessage(text, sender) {
  const chatBox = document.getElementById("chat-box");
  const message = document.createElement("div");
  message.classList.add("message", sender);

  // Safest formatting: only line breaks + bold
  const formatted = text
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  message.innerHTML = formatted;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();
  addMessage(data.reply, "bot");
}
