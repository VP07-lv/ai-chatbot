import { useState } from "react";
import axios from "axios";

const API_KEY = "your-openai-api-key"; // Replace with your actual API key

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const newMessages = [...messages, { user: input, bot: "Typing..." }];
    setMessages(newMessages);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: input }],
        },
        {
          headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        }
      );

      setMessages([
        ...newMessages.slice(0, -1),
        { user: input, bot: response.data.choices[0].message.content },
      ]);
    } catch (error) {
      setMessages([...newMessages.slice(0, -1), { user: input, bot: "Error occurred!" }]);
    }

    setInput("");
  }

  return (
    <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
      <h2>AI Chatbot</h2>
      <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
        {messages.map((msg, index) => (
          <p key={index}><b>You:</b> {msg.user} <br/><b>Bot:</b> {msg.bot}</p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        style={{ width: "80%", padding: "8px" }}
      />
      <button onClick={sendMessage} style={{ marginLeft: "10px", padding: "8px" }}>Send</button>
    </div>
  );
}

export default Chatbot;
