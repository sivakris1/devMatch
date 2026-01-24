import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import DarkLayout from '../components/DarkLayout';

import { useUi } from '../api/UiContext';


const LoginPage = () => {

    const {loading,setLoading} = useUi();
    const {login} = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const handleSubmit = async(e) =>{
        e.preventDefault();
        setError('');
        setLoading(true);


        try {
            const res = await api.post('/auth/login',{email,password});

            const {token,user} = res.data;

            login({token,user});

            navigate('/profile');
        } catch (err) {
      
      setError(
        err.response?.data?.message || 'Login failed. Check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

 

return (
  <DarkLayout title="Find Developers">
    
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <h1>Welcome back to DevMatch</h1>

      <form onSubmit={handleSubmit}>
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
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  </DarkLayout>
);
   
}



export default LoginPage;