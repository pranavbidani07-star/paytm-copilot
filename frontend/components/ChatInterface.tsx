"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, Send, Bot, User, Loader2 } from "lucide-react";
import ActionCard from "./ActionCard";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Namaste! I am your Paytm Merchant Copilot. How can I help you grow your business today?" }
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN"; // English India, handles some Hinglish
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      // Optional: Auto submit here
      // handleSend(transcript); 
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSend = async (textToSubmit: string = input) => {
    if (!textToSubmit.trim()) return;

    const userMessage = { role: "user" as const, content: textToSubmit };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchant_id: "M1", query: textToSubmit }),
      });
      
      const data = await res.json();
      const aiReply = data.reply || "Sorry, I couldn't process that.";
      
      setMessages((prev) => [...prev, { role: "ai", content: aiReply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "ai", content: "Network error connecting to backend API." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionAccept = () => {
    // Show toast for demo
    alert("Success! Loan Approved and Purchase Order dispatched to supplier via Paytm Payout.");
    setMessages((prev) => [...prev, { role: "ai", content: "Great! ₹4,000 has been disbursed directly to the supplier's UPI. Your inventory will arrive tomorrow." }]);
  };

  return (
    <div className="flex flex-col h-[600px] max-h-[70vh] bg-slate-50/50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-sky-100 text-sky-600"}`}>
              {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none shadow-sm" : "bg-white text-slate-700 rounded-tl-none shadow-sm border border-slate-100"}`}>
              {msg.content}
              {msg.role === "ai" && <ActionCard messageText={msg.content} onAccept={handleActionAccept} />}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 flex-row">
            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="px-4 py-3 bg-white rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
              <Loader2 size={16} className="text-sky-600 animate-spin" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-slate-200">
        <div className="flex items-center gap-2 bg-slate-100 rounded-full p-1 pl-4 pr-1">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask your copilot..."
            className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2 text-slate-700 placeholder:text-slate-400"
          />
          <button 
            onClick={handleSpeech}
            className={`p-2 rounded-full transition-colors ${isListening ? "bg-red-100 text-red-500 animate-pulse" : "text-slate-500 hover:bg-slate-200 hover:text-slate-700"}`}
          >
            <Mic size={18} />
          </button>
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
