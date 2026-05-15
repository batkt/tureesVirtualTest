import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { MdMessage, MdClose, MdSend } from "react-icons/md";
import { FaRobot, FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import uilchilgee from "../services/uilchilgee";

const BASE_API = "https://turees.zevtabs.mn/api/v1/chat";
const SOCKET_URL = "https://turees.zevtabs.mn";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [guestId, setGuestId] = useState("");
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === "mn" ? "en" : "mn");
  };

  useEffect(() => {
    let gid = localStorage.getItem("chat_guest_id");
    if (!gid) {
      gid = "guest_" + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("chat_guest_id", gid);
    }
    setGuestId(gid);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const initChat = async () => {
    if (!guestId) return;
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_API}/conversations`, { guestId });
      setConversation(res.data.data);
      
      const msgRes = await axios.get(`${BASE_API}/conversations/${res.data.data.id}/messages?guestId=${guestId}`);
      setMessages(msgRes.data.data);
    } catch (err) {
      console.error("Failed to init chat", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !conversation) {
      initChat();
    }
  }, [isOpen, guestId]);

  useEffect(() => {
    if (!conversation) return;

    const s = io(SOCKET_URL, { transports: ["websocket", "polling"] });
    socketRef.current = s;

    s.emit("join", { conversationId: conversation.id, guestId });

    s.on("message:new", (payload) => {
      if (payload?.conversationId === conversation.id && payload?.message) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === payload.message.id)) return prev;
          return [...prev, payload.message];
        });
      }
    });

    return () => {
      s.emit("leave", { conversationId: conversation.id });
      s.disconnect();
    };
  }, [conversation]);

  const sendMessage = async () => {
    if (!input.trim() || !conversation) return;
    
    try {
      const text = input.trim();
      setInput("");
      
      const res = await axios.post(`${BASE_API}/conversations/${conversation.id}/messages`, {
        text,
        guestId
      });
      
      const { userMsg, botMsg, humanMode } = res.data.data;
      
      setMessages(prev => {
        let next = [...prev];
        if (userMsg && !next.some(m => m.id === userMsg.id)) next.push(userMsg);
        if (botMsg && !next.some(m => m.id === botMsg.id)) next.push(botMsg);
        return next;
      });
      
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 dark:bg-green-700 text-white shadow-lg transition-transform hover:scale-105 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MdMessage className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between bg-green-600 dark:bg-green-700 p-4 text-white">
            <div>
              <h3 className="font-semibold text-white">{t("Тусламж")}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleLang} className="text-xs rounded border border-white/30 px-2 py-1 hover:bg-white/20 transition">
                {i18n.language === "mn" ? "EN" : "MN"}
              </button>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-1 hover:bg-green-700 dark:hover:bg-green-800 transition">
                <MdClose className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900">
            {loading && <div className="text-center text-sm text-gray-400 mt-10">{t("Уншиж байна...")}</div>}
            
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  {!isUser && (
                    <div className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                      {m.role === "agent" ? <FaUser size={14} /> : <FaRobot size={14} />}
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    isUser ? "bg-green-600 dark:bg-green-700 text-white rounded-br-sm" : "bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-700 rounded-bl-sm shadow-sm"
                  }`}>
                    {m.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={t("Мессеж бичих...")}
              className="flex-1 rounded-full border border-gray-200 dark:border-slate-600 bg-transparent px-4 py-2 text-sm text-gray-800 dark:text-gray-100 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:border-green-500 dark:focus:ring-green-500"
            />
            <button 
              onClick={sendMessage}
              disabled={!input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 dark:bg-green-700 text-white disabled:opacity-50 transition"
            >
              <MdSend size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
