const BACKEND_URL = "https://solutions-in-motion-ai-chat-backend.vercel.app/api/chat"; // <-- update if different
document.getElementById("sendBtn").addEventListener("click", sendMessage);

function addMessage(text, sender) {
  const chat = document.getElementById("chat");

  const wrapper = document.createElement("div");
  wrapper.className = `message ${sender}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  // 1. Escape HTML so nothing breaks
  let safe = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 2. Headings: ## Heading → <h2>Heading</h2>
  safe = safe.replace(/^###\s+(.*)$/gm, "<h3>$1</h3>");
  safe = safe.replace(/^##\s+(.*)$/gm, "<h2>$1</h2>");
  safe = safe.replace(/^#\s+(.*)$/gm, "<h1>$1</h1>");

  // 3. Bold + italics
  safe = safe.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
  safe = safe.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  safe = safe.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // 4. Bullet lists: "- item"
  safe = safe.replace(/^- (.*)$/gm, "<li>$1</li>");
  safe = safe.replace(/(<li>[\s\S]*?<\/li>)/gm, "<ul>$1</ul>");

  // 5. Numbered lists: "1. item"
  safe = safe.replace(/^\d+\.\s+(.*)$/gm, "<li>$1</li>");
  safe = safe.replace(/(<li>[\s\S]*?<\/li>)/gm, "<ol>$1</ol>");

  // 6. Paragraphs + line breaks
  safe = safe.replace(/\n{2,}/g, "<br><br>");
  safe = safe.replace(/\n/g, "<br>");

  bubble.innerHTML = safe;

  wrapper.appendChild(bubble);
  chat.appendChild(wrapper);

  chat.scrollTop = chat.scrollHeight;
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
