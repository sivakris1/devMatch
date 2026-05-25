import { useState } from 'react'

const SKILLS = [
  'React', 'Node.js', 'JavaScript', 'TypeScript', 'Python',
  'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift',
  'Kotlin', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
  'Express.js', 'Next.js', 'Vue.js', 'Angular', 'Svelte',
  'React Native', 'Flutter', 'Django', 'FastAPI', 'Spring Boot',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud',
  'Git', 'GitHub', 'GraphQL', 'REST API', 'Socket.io',
  'TailwindCSS', 'CSS', 'HTML', 'Sass', 'Bootstrap',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
  'Data Science', 'Pandas', 'NumPy', 'Figma', 'Linux', 'Bash'
]

export default function SkillInput({ skills, setSkills }) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)


  const handleInputChange = (e) => {
    const value = e.target.value
    setInput(value)
    setActiveSuggestionIndex(-1) // Reset selection when user types

    if (value.trim().length < 1) {
      setSuggestions([])
      return
    }

    // Filter matching skills
    const filtered = SKILLS.filter(
      skill =>
        skill.toLowerCase().includes(value.toLowerCase()) &&
        !skills.includes(skill) // don't show already added skills
    ).slice(0, 6) // max 6 suggestions

    setSuggestions(filtered)
  }

  const addSkill = (skill) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill])
    }
    setInput('')
    setSuggestions([])
        setActiveSuggestionIndex(-1) // Reset index on add

  }

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove))
  }

      const handleKeyDown = (e) => {
    // Arrow Down
    if (e.key === 'ArrowDown') {
      e.preventDefault() // Prevent cursor jumping
      if (activeSuggestionIndex < suggestions.length - 1) {
        setActiveSuggestionIndex(activeSuggestionIndex + 1)
      }
    }
    // Arrow Up
    else if (e.key === 'ArrowUp') {
      e.preventDefault() // Prevent cursor jumping
      if (activeSuggestionIndex > -1) {
        setActiveSuggestionIndex(activeSuggestionIndex - 1)
      }
    }
    // Enter Key
    else if (e.key === 'Enter') {
      e.preventDefault()
      
      // If we have highlighted a suggestion with arrow keys, add that one!
      if (activeSuggestionIndex > -1 && activeSuggestionIndex < suggestions.length) {
        addSkill(suggestions[activeSuggestionIndex])
      } 
      // If nothing is highlighted but suggestions exist, add the first one
      else if (suggestions.length > 0) {
        addSkill(suggestions[0])
      } 
      // Otherwise, add what the user manually typed
      else if (input.trim()) {
        addSkill(input.trim())
      }
    }
    // Escape Key
    else if (e.key === 'Escape') {
      setSuggestions([])
      setActiveSuggestionIndex(-1)
    }
  }



  

  return (
    <div style={{ position: 'relative' }}>

      {/* Added Skills Tags */}
      
      
      {skills.length  > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          {skills.map(skill => (
            <span key={skill} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '4px 12px',
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '20px',
              color: '#a5b4fc', fontSize: '13px', fontWeight: '500'
            }}>
              {skill}
              <span
                onClick={() => removeSkill(skill)}
                style={{ cursor: 'pointer', color: '#64748b', fontSize: '12px', fontWeight: '700' }}
              >✕</span>
            </span>
          ))}
        </div>
      )} 
    
      {/* Input */}
      <input
        className="dm-input"
        placeholder="Type a skill (e.g. React, Python...)"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0, right: 0,
          background: 'rgba(13,14,33,0.98)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '12px',
          marginTop: '4px',
          zIndex: 100,
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
        }}>
                    {suggestions.map((skill, i) => (
            <div
              key={skill}
              onClick={() => addSkill(skill)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                color: '#cbd5e1',
                fontSize: '14px',
                // Highlight suggestion if active index matches:
                background: i === activeSuggestionIndex 
                  ? 'rgba(99, 102, 241, 0.25)' 
                  : 'transparent',
                borderBottom: i < suggestions.length - 1
                  ? '1px solid rgba(255,255,255,0.04)' : 'none',
                transition: 'background 0.15s ease',
                display: 'flex', alignItems: 'center', gap: '10px'
              }}
              onMouseEnter={() => setActiveSuggestionIndex(i)} // Mouse hover updates highlight index
              onMouseLeave={() => setActiveSuggestionIndex(-1)}
            >
              <span style={{ fontSize: '16px' }}>⚡</span>
              {skill}
            </div>
          ))}

        </div>
      )}
    </div>
  )
}
