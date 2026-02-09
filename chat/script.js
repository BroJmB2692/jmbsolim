const BACKEND_URL = "https://solutions-in-motion-ai-chat-backend.vercel.app/api/chat"; // <-- update if different
document.getElementById("sendBtn").addEventListener("click", sendMessage);

function addMessage(text, sender) {
  const chatBox = document.getElementById("chat-box");
  const message = document.createElement("div");
  message.classList.add("message", sender);

  // Convert Markdown to HTML (simple version)
  let formatted = text
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/^\s*[-*]\s+(.*)/gm, "<li>$1</li>")
    .replace(/(\d+)\.\s+(.*)/gm, "<br><strong>$1.</strong> $2");

  // Wrap <li> items in <ul> if any exist
  if (formatted.includes("<li>")) {
    formatted = formatted.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");
  }

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
