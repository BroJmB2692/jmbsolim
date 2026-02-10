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

  // 2. Normalize all line endings to Unix-style
  safe = safe.replace(/\r\n/g, "\n");

  // 3. Insert a blank line between numbered items and bullet lists
  safe = safe.replace(/^(\d+\..*)\n- /gm, "$1\n\n- ");

  // 4. Normalize any accidental double spaces before bullets
  safe = safe.replace(/\n[ ]*- /g, "\n- ");

  // 5. Bold + italics
  safe = safe.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
  safe = safe.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  safe = safe.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // 6. Bullet list items: "- item"
  safe = safe.replace(/^- (.*)$/gm, "<li>$1</li>");

  // 7. Group consecutive <li> into a single <ul>
  safe = safe.replace(/(<li>[\s\S]*?<\/li>)+/gm, match => {
    return "<ul>" + match + "</ul>";
  });

  // 8. Convert double line breaks into paragraph spacing
  safe = safe.replace(/\n{2,}/g, "<br><br>");

  // 9. Convert remaining single line breaks
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
