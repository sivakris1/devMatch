import { useEffect, useState } from 'react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import ChatWindow from '../components/ChatWindow'
import Navbar from '../components/Navbar'

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function getInitials(name) {
  return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'
}

const AVATAR_COLORS = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #3b82f6, #06b6d4)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #ec4899, #8b5cf6)',
]

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null) // { _id, name }

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/chat/conversations')
        setConversations(res.data.data || [])
      } catch (err) {
        console.error('Failed to load conversations', err)
      } finally {
        setLoading(false)
      }
    }
    fetchConversations()
  }, [])

  return (
    <div className="gradient-bg" style={{ minHeight: '100vh' }}>
      <div className="gradient-blob-1" />
      <div className="gradient-blob-2" />
      <div className="gradient-blob-3" />

      <Navbar />

      <div className="page-content" style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Header */}
        <div className="fade-in-up" style={{ marginBottom: '28px' }}>
          <h1 className="section-title">💬 Messages</h1>
          <p className="section-subtitle">Your conversations with other developers</p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{
              width: '40px', height: '40px', margin: '0 auto 16px',
              border: '3px solid rgba(99,102,241,0.2)',
              borderTop: '3px solid #6366f1',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ color: '#475569', fontSize: '14px' }}>Loading conversations...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Empty State */}
        {!loading && conversations.length === 0 && (
          <div className="glass-card fade-in-up" style={{
            padding: '60px 32px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>💬</div>
            <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: '700', margin: '0 0 8px' }}>
              No conversations yet
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px' }}>
              Start chatting by visiting a developer's profile
            </p>
            <a href="/developers" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <span>🔍 Browse Developers</span>
            </a>
          </div>
        )}

        {/* Conversation List */}
        {!loading && conversations.length > 0 && (
          <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {conversations.map((conv, i) => {
              const isSelected = selectedUser?._id === conv.otherUser._id
              const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length]

              return (
                <div
                  key={conv.roomId}
                  onClick={() => setSelectedUser(conv.otherUser)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    background: isSelected
                      ? 'rgba(99,102,241,0.15)'
                      : 'rgba(13,14,33,0.75)',
                    border: isSelected
                      ? '1px solid rgba(99,102,241,0.5)'
                      : '1px solid rgba(99,102,241,0.15)',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(20px)',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
                      e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(13,14,33,0.75)'
                      e.currentTarget.style.borderColor = 'rgba(99,102,241,0.15)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '48px', height: '48px',
                    borderRadius: '50%',
                    background: avatarColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '700', fontSize: '17px', color: 'white',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }}>
                    {getInitials(conv.otherUser.name)}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <p style={{
                        margin: 0, fontWeight: '600', fontSize: '15px',
                        color: isSelected ? '#a5b4fc' : '#f1f5f9'
                      }}>
                        {conv.otherUser.name}
                      </p>
                      <span style={{ fontSize: '11px', color: '#475569', flexShrink: 0, marginLeft: '8px' }}>
                        {timeAgo(conv.lastMessageTime)}
                      </span>
                    </div>
                    <p style={{
                      margin: 0, fontSize: '13px', color: '#64748b',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      maxWidth: '380px'
                    }}>
                      {conv.lastMessage}
                    </p>
                  </div>

                  {/* Arrow */}
                  <span style={{ color: '#475569', fontSize: '16px', flexShrink: 0 }}>›</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ChatWindow — opens when a conversation is clicked */}
      {selectedUser && (
        <ChatWindow
          currentUserId={user?._id || user?.id}
          receiverId={selectedUser._id}
          receiverName={selectedUser.name}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  )
}
