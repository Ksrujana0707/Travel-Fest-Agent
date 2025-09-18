import React, { useState, useEffect, useRef } from "react";
import "../styles/Chatbot.css";

// ✅ Use .env if available, otherwise fallback to localhost:5000
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/chat";

const Chatbot = () => {
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("chats");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeChatId, setActiveChatId] = useState(
    chats.length > 0 ? chats[0].id : null
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    console.log("🌍 Backend URL being used:", API_URL);
    if (API_URL) {
      setReady(true);
    } else {
      console.error("❌ No API URL found. Check your .env (REACT_APP_API_URL).");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, activeChatId]);

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: `Chat ${chats.length + 1}`,
      messages: [
        { sender: "bot", text: "Hello! Ask me about festivals or travel plans." },
      ],
    };
    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
  };

  const handleDeleteChat = (chatId) => {
    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    setChats(updatedChats);
    if (chatId === activeChatId) {
      setActiveChatId(updatedChats.length > 0 ? updatedChats[0].id : null);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeChatId) return;

    const userMessage = { sender: "user", text: message };
    const updatedChats = chats.map((chat) =>
      chat.id === activeChatId
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat
    );
    setChats(updatedChats);
    setMessage("");
    setLoading(true);

    try {
      console.log("📡 Sending to:", API_URL);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, chatId: activeChatId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "API error");

      const botMessage = {
        sender: "bot",
        text: data.reply || "❌ No reply from server",
      };

      const finalChats = updatedChats.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, botMessage] }
          : chat
      );
      setChats(finalChats);
    } catch (error) {
      console.error("❌ Error fetching bot reply:", error);
      const errorMsg = {
        sender: "bot",
        text: "⚠️ Could not connect to server. Please try again.",
      };
      const errorChats = updatedChats.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, errorMsg] }
          : chat
      );
      setChats(errorChats);
    } finally {
      setLoading(false);
    }
  };

  const activeChat = chats.find((c) => c.id === activeChatId);

  if (!ready) return <p>🔄 Connecting to backend...</p>;

  return (
    <div className="chatbot-container">
      {/* Sidebar */}
      <div className="chatbot-sidebar">
        <div className="sidebar-header">
          <h2>Chats</h2>
          <button onClick={handleNewChat}>+ New</button>
        </div>
        <ul>
          {chats.map((chat) => (
            <li
              key={chat.id}
              className={chat.id === activeChatId ? "active" : ""}
            >
              <span onClick={() => setActiveChatId(chat.id)}>{chat.title}</span>
              <button onClick={() => handleDeleteChat(chat.id)}>🗑️</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="chatbot-chatarea">
        <div className="chatbot-messages">
          {activeChat ? (
            activeChat.messages.map((msg, idx) => (
              <div key={idx} className={`chatbot-message ${msg.sender}`}>
                {msg.sender === "bot" && <div className="avatar">🤖</div>}
                {msg.sender === "user" && <div className="avatar">👤</div>}
                <div className="message-text">{msg.text}</div>
              </div>
            ))
          ) : (
            <p>Select or start a chat</p>
          )}
          {loading && <p className="typing">Bot is typing...</p>}
          <div ref={messagesEndRef} />
        </div>

        {activeChat && (
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Type your question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button onClick={handleSendMessage} disabled={loading}>
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
