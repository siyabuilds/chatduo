"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import Swal from "sweetalert2";

const STORAGE_KEY = "chatduo_id";
const USERNAME_KEY = "chatduo_username";
const TIMESTAMP_KEY = "chatduo_timestamp";
const EXPIRY_TIME = 15 * 60 * 1000;

export default function Home() {
  const router = useRouter();
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkExistingId();
  }, []);

  const checkExistingId = () => {
    const storedId = localStorage.getItem(STORAGE_KEY);
    const storedUsername = localStorage.getItem(USERNAME_KEY);
    const storedTimestamp = localStorage.getItem(TIMESTAMP_KEY);

    if (!storedId || !storedTimestamp) {
      // No existing ID, show input field
      setShowInput(true);
      setIsLoading(false);
      return;
    }

    const currentTime = Date.now();
    const savedTime = parseInt(storedTimestamp, 10);
    const timeDifference = currentTime - savedTime;

    if (timeDifference > EXPIRY_TIME) {
      // More than 15 minutes passed, show input field
      setShowInput(true);
      setIsLoading(false);
    } else {
      // ID is still valid, ask user if they want to use it
      setIsLoading(false);
      Swal.fire({
        title: "Existing Session Found",
        html: `Would you like to use the existing ID <strong>"${storedId}"</strong>${
          storedUsername
            ? ` with username <strong>"${storedUsername}"</strong>`
            : ""
        } for a chat?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, use it!",
        cancelButtonText: "No, create new",
        confirmButtonColor: "#ea580c",
        cancelButtonColor: "#4b5563",
        background: "#2a2a2a",
        color: "#e5e7eb",
        customClass: {
          popup: "rounded-lg",
          confirmButton: "rounded-lg",
          cancelButton: "rounded-lg",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // User wants to use existing ID
          proceedWithId(storedId, storedUsername || "");
        } else {
          // Clear localStorage and show input field
          clearStorage();
          setShowInput(true);
        }
      });
    }
  };

  const clearStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(TIMESTAMP_KEY);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (inputValue.length <= 5) {
      setError("ID must be greater than 5 characters");
      return;
    }

    if (username.trim().length === 0) {
      setError("Username is required");
      return;
    }

    // Save ID, username, and timestamp to localStorage
    localStorage.setItem(STORAGE_KEY, inputValue);
    localStorage.setItem(USERNAME_KEY, username);
    localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());

    proceedWithId(inputValue, username);
  };

  const proceedWithId = (id: string, user: string) => {
    // Navigate to the chat page
    router.push(`/chat/${id}`);
  };

  const showInfoModal = () => {
    Swal.fire({
      title: "How to Get Started",
      html: `
        <div style="text-align: left; color: #e5e7eb;">
          <h3 style="color: #ea580c; font-weight: bold; margin-bottom: 12px;">Getting Started:</h3>
          <ol style="margin-left: 20px; margin-bottom: 16px;">
            <li style="margin-bottom: 8px;">Enter a username (can be anything memorable)</li>
            <li style="margin-bottom: 8px;">Create a unique chat ID (more than 5 characters)</li>
            <li style="margin-bottom: 8px;">Share the chat ID with someone you want to chat with</li>
            <li style="margin-bottom: 8px;">Both users should use the same chat ID to connect</li>
          </ol>
          <h3 style="color: #ea580c; font-weight: bold; margin-bottom: 12px;">💡 Quick Tip:</h3>
          <p style="margin-bottom: 16px;">
            Your username and chat ID can be <strong>random but memorable values</strong>. 
            These are <strong>NOT account details</strong> and don't need to be secure. 
            Think of them like a temporary room name and nickname.
          </p>
          <h3 style="color: #ea580c; font-weight: bold; margin-bottom: 12px;">Important Notice:</h3>
          <p style="margin-bottom: 8px;">
            <strong>Chats are NOT saved permanently.</strong> Messages will be deleted after 15 minutes of inactivity.
          </p>
          <p>
            Please save any important information elsewhere before leaving the chat.
          </p>
        </div>
      `,
      confirmButtonText: "Got it!",
      confirmButtonColor: "#ea580c",
      background: "#2a2a2a",
      color: "#e5e7eb",
      customClass: {
        popup: "rounded-lg",
        confirmButton: "rounded-lg",
      },
      width: "600px",
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a]">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a] relative">
      {/* Info Icon */}
      <button
        onClick={showInfoModal}
        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-orange-500 transition-colors rounded-full hover:bg-[#2a2a2a]"
        aria-label="Show information"
      >
        <Info className="w-6 h-6" />
      </button>

      <main className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold gradient-text">ChatDuo</h1>
        <p className="text-lg text-gray-400 text-center">
          Welcome to ChatDuo! Create a unique chat ID to start chatting with
          others.
        </p>

        {showInput && (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="username-input"
                className="text-gray-300 text-sm font-medium"
              >
                Your username
              </label>
              <input
                id="username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="px-4 py-3 bg-[#2a2a2a] text-gray-200 rounded-lg border border-gray-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="id-input"
                className="text-gray-300 text-sm font-medium"
              >
                Create your unique chat ID
              </label>
              <input
                id="id-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter ID (more than 5 characters)"
                className="px-4 py-3 bg-[#2a2a2a] text-gray-200 rounded-lg border border-gray-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
              {error && (
                <span className="text-orange-400 text-sm">{error}</span>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-orange-500/50"
            >
              Start Chat
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
