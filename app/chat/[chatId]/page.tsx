"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

type Message = {
  id: string;
  user: string;
  text: string;
  timestamp: number;
};

const STORAGE_KEY = "chatduo_id";
const USERNAME_KEY = "chatduo_username";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.chatId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get username from localStorage
    const storedUsername = localStorage.getItem(USERNAME_KEY);
    const storedId = localStorage.getItem(STORAGE_KEY);

    if (!storedUsername || storedId !== chatId) {
      // Redirect to home if no username or wrong chat ID
      router.push("/");
      return;
    }

    setUsername(storedUsername);
    setIsLoading(false);

    // Fetch initial messages
    fetchMessages();

    // Poll for new messages every 2 seconds
    const interval = setInterval(fetchMessages, 2000);

    return () => clearInterval(interval);
  }, [chatId, router]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat/${chatId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim()) {
      setError("Message cannot be empty");
      return;
    }

    setError("");

    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: username,
          text: inputText.trim(),
        }),
      });

      if (response.ok) {
        setInputText("");
        // Immediately fetch new messages
        await fetchMessages();
      } else {
        setError("Failed to send message");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message");
    }
  };

  const handleDeleteChat = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this entire chat? This cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Clear localStorage and redirect to home
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(USERNAME_KEY);
        localStorage.removeItem("chatduo_timestamp");
        router.push("/");
      } else {
        setError("Failed to delete chat");
      }
    } catch (err) {
      console.error("Failed to delete chat:", err);
      setError("Failed to delete chat");
    }
  };

  const handleLeaveChat = () => {
    router.push("/");
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a]">
        <div className="text-gray-400">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a]">
      {/* Header */}
      <header className="bg-[#2a2a2a] border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-200">ChatDuo</h1>
          <div className="flex flex-col">
            <span className="text-sm text-gray-400">Chat ID: {chatId}</span>
            <span className="text-sm text-gray-400">You: {username}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleLeaveChat}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Leave Chat
          </button>
          <button
            onClick={handleDeleteChat}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Delete Chat
          </button>
        </div>
      </header>

      {/* Messages Container */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-center">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.user === username ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                  message.user === username
                    ? "bg-gradient-to-r from-orange-600 to-red-600 text-white"
                    : "bg-[#2a2a2a] text-gray-200"
                }`}
              >
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-semibold text-sm">{message.user}</span>
                  <span className="text-xs opacity-70">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
                <p className="break-words">{message.text}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Form */}
      <footer className="bg-[#2a2a2a] border-t border-gray-700 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 bg-[#1a1a1a] text-gray-200 rounded-lg border border-gray-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-orange-500/50"
          >
            Send
          </button>
        </form>
        {error && <p className="text-orange-400 text-sm mt-2">{error}</p>}
      </footer>
    </div>
  );
}
