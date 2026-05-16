import { useEffect, useRef, useState } from "react";
import socket from "../api/socket";
import api from "../api/client";

export default function ChatWindow({
  currentUserId,
  receiverId,
  receiverName,
  onClose,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const roomId = [currentUserId, receiverId].sort().join("_");

  useEffect(() => {
  socket.connect()

  // ✅ Fix: Check if already connected
  if (socket.connected) {
    console.log('✅ Already connected, joining room:', roomId)
    socket.emit('join_room', roomId)
  } else {
    socket.on('connect', () => {
      console.log('✅ Connected, joining room:', roomId)
      socket.emit('join_room', roomId)
    })
  }

  // Load old messages
  const loadMessages = async () => {
    try {
      const res = await api.get(`/chat/${receiverId}`)
      setMessages(res.data.data)
    } catch (err) {
      console.log('❌ Failed to load messages', err)
    }
  }
  loadMessages()

  socket.on('receive_message', (data) => {
    console.log('✅ Message received!', data)
    setMessages((prev) => [...prev, data])
  })

  return () => {
    socket.off('connect')
    socket.off('receive_message')
    socket.disconnect()
  }
}, [roomId])


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  
  const sendMessage = () =>{
     if(!input.trim()) return;

     socket.emit('send_message',{
        roomId,
        senderId : currentUserId,
        receiverId,
        message : input.trim()
     })

     setInput('')
  }

  
  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px',
      width: '340px', height: '480px',
      background: 'rgba(13,14,33,0.95)',
      border: '1px solid rgba(99,102,241,0.3)',
      borderRadius: '16px',
      display: 'flex', flexDirection: 'column',
      zIndex: 1000,
      boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
        borderRadius: '16px 16px 0 0'
      }}>
        <div>
          <p style={{ margin: 0, fontWeight: '700', color: '#f1f5f9', fontSize: '15px' }}>
            💬 {receiverName}
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: '#6ee7b7' }}>● Online</p>
        </div>
        <button onClick={onClose} style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#94a3b8', borderRadius: '8px',
          padding: '4px 10px', cursor: 'pointer',
          fontFamily: 'Inter, sans-serif'
        }}>✕</button>
      </div>
      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '16px', display: 'flex',
        flexDirection: 'column', gap: '8px'
      }}>
        {messages.length === 0 && (
          <p style={{ color: '#475569', textAlign: 'center', fontSize: '13px', marginTop: '40px' }}>
            No messages yet. Say hello! 👋
          </p>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.senderId === currentUserId || msg.senderId?._id === currentUserId
          return (
            <div key={i} style={{
              display: 'flex',
              justifyContent: isMe ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                maxWidth: '75%',
                padding: '8px 14px',
                borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: isMe
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : 'rgba(255,255,255,0.07)',
                color: '#f1f5f9',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                {msg.message}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
      {/* Input */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', gap: '8px'
      }}>
        <input
          className="dm-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          style={{ flex: 1, padding: '10px 14px', fontSize: '13px' }}
        />
        <button className="btn-primary" onClick={sendMessage} style={{ padding: '10px 16px' }}>
          <span>→</span>
        </button>
      </div>
    </div>
  )
}

