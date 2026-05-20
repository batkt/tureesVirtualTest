import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { message } from "antd";
import { MdMessage, MdClose, MdSend, MdMic, MdAttachFile } from "react-icons/md";
import { FaRobot, FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import uilchilgee from "../services/uilchilgee";
import { useAuth } from "../services/auth";

const BASE_API = "https://admin.zevtabs.mn/api/v1/chat";
const SOCKET_URL = "https://admin.zevtabs.mn";

function ChatWidgetAudioPlayer({ src }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current ? audioRef.current.currentTime : 0);
  };
  const handleLoadedMetadata = () => {
    setDuration(audioRef.current ? audioRef.current.duration : 0);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex items-center gap-2 py-1.5 px-2 bg-black/10 dark:bg-black/20 rounded-xl min-w-[170px] select-none text-current">
      <audio
        ref={audioRef}
        src={src}
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <button
        onClick={togglePlay}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-current transition"
      >
        {isPlaying ? (
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg className="h-4 w-4 fill-current ml-0.5" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      <div className="flex flex-col text-[10px]">
        <span className="font-mono">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const { ajiltan, baiguullaga } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [guestId, setGuestId] = useState("");
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const { t, i18n } = useTranslation();

  const [chatConfig, setChatConfig] = useState(null);
  const [currentChoices, setCurrentChoices] = useState([]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get(`${BASE_API}/config?project=turees`);
        if (res.data?.data) {
          const config = res.data.data;
          setChatConfig(config);
          setCurrentChoices(config.rootChoices || []);
        }
      } catch (err) {
        console.error("Error fetching chat config:", err);
      }
    };
    fetchConfig();
  }, []);

  // Voice recording and attachment states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const recordingIntervalRef = useRef(null);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === "mn" ? "en" : "mn");
  };

  useEffect(() => {
    if (ajiltan && ajiltan._id) {
      setGuestId(`ajiltan_${ajiltan._id}`);
    } else {
      let gid = localStorage.getItem("chat_guest_id");
      if (!gid) {
        gid = "guest_" + Math.random().toString(36).substring(2, 15);
        localStorage.setItem("chat_guest_id", gid);
      }
      setGuestId(gid);
    }
  }, [ajiltan]);

  useEffect(() => {
    setConversation(null);
    setMessages([]);
  }, [guestId]);

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
      const res = await axios.post(`${BASE_API}/conversations`, { 
        guestId,
        project: 'turees',
        displayName: ajiltan ? ajiltan.ner : undefined,
        baiguullagaName: baiguullaga ? baiguullaga.ner : undefined,
        ajiltniiNer: ajiltan ? ajiltan.ner : undefined
      });
      setConversation(res.data.data);
      
      const msgRes = await axios.get(`${BASE_API}/conversations/${res.data.data.id}/messages?guestId=${guestId}`);
      setMessages(msgRes.data.data);
    } catch (err) {
      console.error("Failed to init chat", err);
      message.error("Чат холбогдоход алдаа гарлаа: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !conversation) {
      initChat();
    }
  }, [isOpen, guestId, conversation]);

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
    if (!input.trim()) return;
    if (!conversation) {
      message.warning("Чат холбогдоогүй байна. Түр хүлээнэ үү.");
      return;
    }
    
    try {
      const text = input.trim();
      setInput("");
      
      const res = await axios.post(`${BASE_API}/conversations/${conversation.id}/messages`, {
        text,
        guestId,
        project: 'turees',
        displayName: ajiltan ? ajiltan.ner : undefined,
        baiguullagaName: baiguullaga ? baiguullaga.ner : undefined,
        ajiltniiNer: ajiltan ? ajiltan.ner : undefined
      });
      
      const { userMsg, botMsg } = res.data.data;
      
      setMessages(prev => {
        let next = [...prev];
        if (userMsg && !next.some(m => m.id === userMsg.id)) next.push(userMsg);
        if (botMsg && !next.some(m => m.id === botMsg.id)) next.push(botMsg);
        return next;
      });
      
    } catch (err) {
      console.error(err);
      message.error("Мессеж илгээхэд алдаа гарлаа: " + err.message);
    }
  };

  const sendQuickMessage = async (text) => {
    if (!text || !text.trim()) return;
    if (!conversation) {
      message.warning("Чат холбогдоогүй байна. Түр хүлээнэ үү.");
      return;
    }
    
    try {
      const res = await axios.post(`${BASE_API}/conversations/${conversation.id}/messages`, {
        text,
        guestId,
        project: 'turees',
        displayName: ajiltan ? ajiltan.ner : undefined,
        baiguullagaName: baiguullaga ? baiguullaga.ner : undefined,
        ajiltniiNer: ajiltan ? ajiltan.ner : undefined
      });
      
      const { userMsg, botMsg } = res.data.data;
      
      setMessages(prev => {
        let next = [...prev];
        if (userMsg && !next.some(m => m.id === userMsg.id)) next.push(userMsg);
        if (botMsg && !next.some(m => m.id === botMsg.id)) next.push(botMsg);
        return next;
      });
      
    } catch (err) {
      console.error(err);
      message.error("Мессеж илгээхэд алдаа гарлаа: " + err.message);
    }
  };

  const uploadAndSendFile = async (fileBlob, filename, fileType, duration = null) => {
    if (!conversation) return;
    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append("file", fileBlob, filename);
      formData.append("fileType", fileType);
      
      const uploadRes = await axios.post(`https://admin.zevtabs.mn/api/v1/chat/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      if (uploadRes.data.success) {
        const fileUrl = uploadRes.data.fileUrl;
        const res = await axios.post(`${BASE_API}/conversations/${conversation.id}/messages`, {
          text: "",
          fileUrl,
          fileType,
          duration,
          guestId,
          project: 'turees',
          displayName: ajiltan ? ajiltan.ner : undefined,
          baiguullagaName: baiguullaga ? baiguullaga.ner : undefined,
          ajiltniiNer: ajiltan ? ajiltan.ner : undefined
        });
        
        const { userMsg, botMsg } = res.data.data;
        setMessages(prev => {
          let next = [...prev];
          if (userMsg && !next.some(m => m.id === userMsg.id)) next.push(userMsg);
          if (botMsg && !next.some(m => m.id === botMsg.id)) next.push(botMsg);
          return next;
        });
      }
    } catch (e) {
      message.error("Файл илгээхэд алдаа гарлаа: " + e.message);
      console.error(e);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    let fileType = "image";
    if (file.type.startsWith("video/")) {
      fileType = "video";
    } else if (file.type.startsWith("audio/")) {
      fileType = "audio";
    }
    
    await uploadAndSendFile(file, file.name, fileType);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        stream.getTracks().forEach(track => track.stop());
        
        await uploadAndSendFile(blob, `voice-${Date.now()}.webm`, "audio", recordingTime);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch (err) {
      message.error("Микрофон ашиглах зөвшөөрөл олдсонгүй");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.onstop = null; // discard
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
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
            
            {!loading && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-300 mb-3 animate-pulse">
                  <MdMessage className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">{t("Чат эхлүүлэх")}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">{t("Та асуух зүйлээ доор бичнэ үү эсвэл сонголтоос сонгоно уу.")}</p>
                
                <div className="w-full space-y-2 max-w-[240px]">
                  <button
                    onClick={() => sendQuickMessage("Чатботтой ярих")}
                    className="w-full py-2.5 px-4 rounded-xl border-2 border-green-500/30 dark:border-green-500/20 hover:border-green-500/80 bg-white dark:bg-slate-800 text-green-600 dark:text-green-400 text-xs font-bold transition duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                  >
                    <span>🤖</span> {t("Чатботтой ярих")}
                  </button>
                  <button
                    onClick={() => sendQuickMessage("Оператортой холбогдох")}
                    className="w-full py-2.5 px-4 rounded-xl border-2 border-green-500/30 dark:border-green-500/20 hover:border-green-500/80 bg-white dark:bg-slate-800 text-green-600 dark:text-green-400 text-xs font-bold transition duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                  >
                    <span>👤</span> {t("Оператортой холбогдох")}
                  </button>
                </div>
              </div>
            )}
            
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
                    {m.text && <p className="whitespace-pre-wrap break-words">{m.text}</p>}
                    {m.fileUrl && (
                      <div className="mt-1 max-w-full overflow-hidden rounded-lg">
                        {m.fileType === "image" && (
                          <img
                            src={`https://admin.zevtabs.mn/api/file?path=${m.fileUrl}`}
                            alt="Attachment"
                            className="max-h-60 max-w-full object-cover cursor-pointer rounded-lg border border-gray-100 dark:border-slate-700 hover:opacity-95 transition-opacity"
                            onClick={() => window.open(`https://admin.zevtabs.mn/api/file?path=${m.fileUrl}`, '_blank')}
                          />
                        )}
                        {m.fileType === "audio" && (
                          <ChatWidgetAudioPlayer src={`https://admin.zevtabs.mn/api/file?path=${m.fileUrl}`} />
                        )}
                      </div>
                    )}
                    {m.createdAt && (
                      <p className={`text-[9px] mt-1 text-right ${isUser ? 'text-green-100' : 'text-gray-400'}`}>
                        {new Date(m.createdAt).toLocaleTimeString('mn-MN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700">
            {isRecording ? (
              <div className="flex items-center justify-between w-full bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-full py-1.5 px-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shrink-0" />
                  <span className="text-red-600 dark:text-red-400 text-xs font-mono font-bold">
                    {Math.floor(recordingTime / 60)}:{String(recordingTime % 60).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={cancelRecording} className="text-xs text-gray-400 hover:text-gray-600 px-2">
                    {t("Болих")}
                  </button>
                  <button onClick={stopRecording} className="text-xs bg-red-600 text-white rounded-full px-3 py-1 hover:bg-red-700 transition">
                    {t("Илгээх")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  id="chat-file-input" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={uploadingFile}
                />
                <button 
                  onClick={() => document.getElementById("chat-file-input").click()}
                  disabled={uploadingFile}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition"
                >
                  <MdAttachFile size={20} />
                </button>
                
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder={uploadingFile ? t("Уншиж байна...") : t("Мессеж бичих...")}
                  disabled={uploadingFile}
                  className="flex-1 rounded-full border border-gray-200 dark:border-slate-600 bg-transparent px-4 py-1.5 text-sm text-gray-800 dark:text-gray-100 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:border-green-500 dark:focus:ring-green-500"
                />
                
                <button 
                  onClick={startRecording}
                  disabled={uploadingFile}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 hover:text-red-500 transition"
                >
                  <MdMic size={20} />
                </button>

                <button 
                  onClick={sendMessage}
                  disabled={!input.trim() || uploadingFile}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 dark:bg-green-700 text-white disabled:opacity-50 transition"
                >
                  <MdSend size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
