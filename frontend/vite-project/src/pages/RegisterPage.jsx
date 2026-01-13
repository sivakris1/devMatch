import React, { useState } from 'react'
import api from '../api/client'
import { useNavigate } from 'react-router-dom'

const RegisterPage = () => {

    const navigate = useNavigate()

    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async(e) =>{
        e.preventDefault();
        setError('');
        setLoading(true);


        try {
            const res = await api.post('/auth/register',{name,email,password});

            // const {token,user} = res.data;

            // login({token,user});

            navigate('/login');
        } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message 
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>

        <h1>DevMatch SignUp</h1>
      
      <form onSubmit={handleSubmit}>

        <div style={{ marginBottom: 12 }}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>

        {error && (
          <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}

        </button>
      </form>
    </div>
  )
}

export default RegisterPage
